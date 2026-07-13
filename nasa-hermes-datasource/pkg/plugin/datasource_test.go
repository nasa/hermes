package plugin

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/nasa/hermes-datasource/pkg/models"
)

func TestQueryData(t *testing.T) {
	ds := Datasource{}

	resp, err := ds.QueryData(
		context.Background(),
		&backend.QueryDataRequest{
			Queries: []backend.DataQuery{
				{RefID: "A"},
			},
		},
	)
	if err != nil {
		t.Error(err)
	}

	if len(resp.Responses) != 1 {
		t.Fatal("QueryData must return a response")
	}
}

func TestSeverityLabel(t *testing.T) {
	tests := []struct {
		input    int64
		expected string
	}{
		{0, "DIAGNOSTIC"},
		{1, "ACTIVITY_LOW"},
		{2, "ACTIVITY_HIGH"},
		{3, "WARNING_LOW"},
		{4, "WARNING_HIGH"},
		{5, "COMMAND"},
		{6, "FATAL"},
		{99, "UNKNOWN(99)"},
		{-1, "UNKNOWN(-1)"},
	}

	for _, tt := range tests {
		t.Run(fmt.Sprintf("severity_%d", tt.input), func(t *testing.T) {
			result := severityLabel(tt.input)
			if result != tt.expected {
				t.Errorf("severityLabel(%d) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}

func TestQueryDispatch(t *testing.T) {
	ds := Datasource{}

	t.Run("returns error on invalid JSON", func(t *testing.T) {
		resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
			Queries: []backend.DataQuery{
				{RefID: "A", JSON: []byte(`{invalid`)},
			},
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if resp.Responses["A"].Status != backend.StatusBadRequest {
			t.Errorf("expected StatusBadRequest, got %v", resp.Responses["A"].Status)
		}
	})

	t.Run("returns error on unknown query type", func(t *testing.T) {
		qJSON, _ := json.Marshal(queryModel{QueryType: "unknown"})
		resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
			Queries: []backend.DataQuery{
				{RefID: "A", JSON: qJSON},
			},
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if resp.Responses["A"].Status != backend.StatusBadRequest {
			t.Errorf("expected StatusBadRequest, got %v", resp.Responses["A"].Status)
		}
	})

	t.Run("returns empty response for telemetry with missing channel", func(t *testing.T) {
		qJSON, _ := json.Marshal(queryModel{QueryType: "telemetry", TimeField: "time", Aggregation: "avg"})
		resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
			Queries: []backend.DataQuery{
				{RefID: "A", JSON: qJSON},
			},
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(resp.Responses["A"].Frames) != 0 {
			t.Errorf("expected no frames for missing channel, got %d", len(resp.Responses["A"].Frames))
		}
	})
}

func TestQueryDataMultipleQueries(t *testing.T) {
	ds := Datasource{}

	q1, _ := json.Marshal(queryModel{QueryType: "unknown"})
	q2, _ := json.Marshal(queryModel{QueryType: "telemetry", TimeField: "time", Aggregation: "avg"})

	resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
		Queries: []backend.DataQuery{
			{RefID: "A", JSON: q1},
			{RefID: "B", JSON: q2},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(resp.Responses) != 2 {
		t.Fatalf("expected 2 responses, got %d", len(resp.Responses))
	}
	if _, ok := resp.Responses["A"]; !ok {
		t.Error("missing response for RefID A")
	}
	if _, ok := resp.Responses["B"]; !ok {
		t.Error("missing response for RefID B")
	}
}

func TestBuildResponseIntType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "comp", "ch", "src", "int", "", 42.0, nil, nil, nil).
		AddRow(now.Add(time.Second), "comp", "ch", "src", "int", "", 100.0, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)

	resultRows, _ := db.Query("SELECT")
	qm := queryModel{Channels: []channelRef{{"comp", "ch"}}, TimeField: "time", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 1 {
		t.Fatalf("expected 1 frame, got %d", len(resp.Frames))
	}
	frame := resp.Frames[0]
	if frame.Name != "comp.ch" {
		t.Errorf("expected frame name 'comp.ch', got %q", frame.Name)
	}
	if len(frame.Fields) != 2 {
		t.Fatalf("expected 2 fields, got %d", len(frame.Fields))
	}
	if frame.Fields[1].Name != "value" {
		t.Errorf("expected value field 'value', got %q", frame.Fields[1].Name)
	}
	if frame.Fields[0].Len() != 2 {
		t.Errorf("expected 2 rows, got %d", frame.Fields[0].Len())
	}
	val := frame.Fields[1].At(0).(*float64)
	if *val != 42.0 {
		t.Errorf("expected 42.0, got %f", *val)
	}
}

func TestBuildResponseUintType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "c", "ch", "src", "uint", "", 255.0, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	qm := queryModel{Channels: []channelRef{{"c", "ch"}}, TimeField: "time", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 1 || resp.Frames[0].Fields[0].Len() != 1 {
		t.Fatal("expected 1 frame with 1 row")
	}
	val := resp.Frames[0].Fields[1].At(0).(*float64)
	if *val != 255.0 {
		t.Errorf("expected 255.0, got %f", *val)
	}
}

func TestBuildResponseFloatType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "c", "ch", "src", "float", "", nil, 3.14, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{Channels: []channelRef{{"c", "ch"}}, TimeField: "time", Aggregation: "avg"}, resultRows)

	val := resp.Frames[0].Fields[1].At(0).(*float64)
	if *val != 3.14 {
		t.Errorf("expected 3.14, got %f", *val)
	}
}

func TestBuildResponseBoolType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "c", "ch", "src", "bool", "", nil, nil, 1.0, nil).
		AddRow(now.Add(time.Second), "c", "ch", "src", "bool", "", nil, nil, 0.0, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{Channels: []channelRef{{"c", "ch"}}, TimeField: "time", Aggregation: "avg"}, resultRows)

	v1 := resp.Frames[0].Fields[1].At(0).(*bool)
	v2 := resp.Frames[0].Fields[1].At(1).(*bool)
	if *v1 != true {
		t.Error("expected first bool row to be true")
	}
	if *v2 != false {
		t.Error("expected second bool row to be false")
	}
}

func TestBuildResponseStringType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "c", "ch", "src", "string", "", nil, nil, nil, "hello")

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{Channels: []channelRef{{"c", "ch"}}, TimeField: "time", Aggregation: "avg"}, resultRows)

	val := resp.Frames[0].Fields[1].At(0).(*string)
	if *val != "hello" {
		t.Errorf("expected 'hello', got %q", *val)
	}
}

func TestBuildResponseEnumType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	// enum falls through to default (string) branch in buildResponse
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "c", "ch", "src", "enum", "", nil, nil, nil, "MY_ENUM_VAL")

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{Channels: []channelRef{{"c", "ch"}}, TimeField: "time", Aggregation: "avg"}, resultRows)

	val := resp.Frames[0].Fields[1].At(0).(*string)
	if *val != "MY_ENUM_VAL" {
		t.Errorf("expected 'MY_ENUM_VAL', got %q", *val)
	}
}

func TestBuildResponseNullValues(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	// All value columns are NULL
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "c", "ch", "src", "int", "", nil, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{Channels: []channelRef{{"c", "ch"}}, TimeField: "time", Aggregation: "avg"}, resultRows)

	val := resp.Frames[0].Fields[1].At(0)
	if val != (*float64)(nil) {
		t.Errorf("expected nil *float64 for null int, got %v", val)
	}
}

func TestBuildResponseEmptyRows(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"})

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{Channels: []channelRef{{"c", "ch"}}, TimeField: "time", Aggregation: "avg"}, resultRows)

	if len(resp.Frames) != 0 {
		t.Fatalf("expected 0 frames for empty result, got %d", len(resp.Frames))
	}
}

func TestQueryEventsWithMock(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := Datasource{db: db}
	now := time.Now().Truncate(time.Second)

	eventRows := sqlmock.NewRows([]string{"time", "component", "name", "severity", "message", "source", "arguments"}).
		AddRow(now, "comp1", "evt1", int64(3), "something happened", "src1", `{"key":"val"}`).
		AddRow(now.Add(time.Second), "comp1", "evt2", int64(6), "fatal error", "src1", `{}`)

	mock.ExpectQuery("SELECT").WillReturnRows(eventRows)

	rawSql := "SELECT * FROM events"
	qJSON, _ := json.Marshal(queryModel{QueryType: "events", Sources: []string{"src1"}, TimeField: "time", Aggregation: "avg", RawSql: &rawSql})
	resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
		Queries: []backend.DataQuery{
			{RefID: "A", JSON: qJSON, TimeRange: backend.TimeRange{From: now.Add(-time.Hour), To: now.Add(time.Hour)}},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	dr := resp.Responses["A"]
	if dr.Status != 0 {
		t.Fatalf("expected success, got status %v: %s", dr.Status, dr.Error)
	}
	if len(dr.Frames) != 1 {
		t.Fatalf("expected 1 frame, got %d", len(dr.Frames))
	}
	frame := dr.Frames[0]
	if frame.Name != "Events" {
		t.Errorf("expected frame name 'Events', got %q", frame.Name)
	}
	if frame.Fields[0].Len() != 2 {
		t.Errorf("expected 2 rows, got %d", frame.Fields[0].Len())
	}
	// severity labels
	if frame.Fields[3].At(0) != "WARNING_LOW" {
		t.Errorf("expected WARNING_LOW, got %v", frame.Fields[3].At(0))
	}
	if frame.Fields[3].At(1) != "FATAL" {
		t.Errorf("expected FATAL, got %v", frame.Fields[3].At(1))
	}
}

func TestQueryTelemetryWithMock(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := Datasource{db: db}
	now := time.Now().Truncate(time.Second)

	telemetryRows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "comp1", "ch1", "src1", "float", "", nil, 1.5, nil, nil).
		AddRow(now.Add(time.Second), "comp1", "ch1", "src1", "float", "", nil, 2.5, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(telemetryRows)

	rawSql := "SELECT * FROM telemetry"
	qJSON, _ := json.Marshal(queryModel{QueryType: "telemetry", Channels: []channelRef{{"comp1", "ch1"}}, Sources: []string{"src1"}, TimeField: "time", Aggregation: "avg", RawSql: &rawSql})
	resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
		Queries: []backend.DataQuery{
			{
				RefID:    "A",
				JSON:     qJSON,
				Interval: 10 * time.Second,
				TimeRange: backend.TimeRange{
					From: now.Add(-time.Hour),
					To:   now.Add(time.Hour),
				},
			},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	dr := resp.Responses["A"]
	if dr.Status != 0 {
		t.Fatalf("expected success, got status %v: %s", dr.Status, dr.Error)
	}
	if len(dr.Frames) != 1 {
		t.Fatalf("expected 1 frame, got %d", len(dr.Frames))
	}
	frame := dr.Frames[0]
	if frame.Name != "comp1.ch1" {
		t.Errorf("expected frame name 'comp1.ch1', got %q", frame.Name)
	}
	if frame.Fields[1].Name != "value" {
		t.Errorf("expected field name 'value', got %q", frame.Fields[1].Name)
	}
	if frame.Fields[0].Len() != 2 {
		t.Errorf("expected 2 rows, got %d", frame.Fields[0].Len())
	}
	v0 := frame.Fields[1].At(0).(*float64)
	v1 := frame.Fields[1].At(1).(*float64)
	if *v0 != 1.5 {
		t.Errorf("expected 1.5, got %f", *v0)
	}
	if *v1 != 2.5 {
		t.Errorf("expected 2.5, got %f", *v1)
	}
}

func TestCheckHealth(t *testing.T) {
	t.Run("returns error when host is missing", func(t *testing.T) {
		ds := Datasource{config: &models.PluginSettings{Host: "", Database: "hermes"}}

		res, err := ds.CheckHealth(context.Background(), &backend.CheckHealthRequest{})

		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if res.Status != backend.HealthStatusError {
			t.Errorf("expected HealthStatusError, got %v", res.Status)
		}
		if res.Message != "Host configuration parameter is missing" {
			t.Errorf("expected 'Host configuration parameter is missing', got '%s'", res.Message)
		}
	})

	t.Run("returns error when database is missing", func(t *testing.T) {
		ds := Datasource{config: &models.PluginSettings{Host: "localhost:5432", Database: ""}}

		res, err := ds.CheckHealth(context.Background(), &backend.CheckHealthRequest{})

		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if res.Status != backend.HealthStatusError {
			t.Errorf("expected HealthStatusError, got %v", res.Status)
		}
		if res.Message != "Database configuration parameter is missing" {
			t.Errorf("expected 'Database configuration parameter is missing', got '%s'", res.Message)
		}
	})

	t.Run("returns error when db is nil", func(t *testing.T) {
		ds := Datasource{config: &models.PluginSettings{Host: "localhost:5432", Database: "hermes"}}

		res, err := ds.CheckHealth(context.Background(), &backend.CheckHealthRequest{})

		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if res.Status != backend.HealthStatusError {
			t.Errorf("expected HealthStatusError, got %v", res.Status)
		}
		if res.Message != "Internal database connection is null" {
			t.Errorf("expected 'Internal database connection is null', got '%s'", res.Message)
		}
	})
}

func TestBuildResponseMultiComponentChannel(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "CDH", "Temperature", "fsw-1", "float", "", nil, 22.5, nil, nil).
		AddRow(now, "Sensors", "Voltage", "fsw-1", "float", "", nil, 3.3, nil, nil).
		AddRow(now.Add(time.Second), "CDH", "Temperature", "fsw-1", "float", "", nil, 23.0, nil, nil).
		AddRow(now.Add(time.Second), "Sensors", "Voltage", "fsw-1", "float", "", nil, 3.4, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	qm := queryModel{Channels: []channelRef{{"CDH", "Temperature"}, {"Sensors", "Voltage"}}, TimeField: "time", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 2 {
		t.Fatalf("expected 2 frames for multi-component, got %d", len(resp.Frames))
	}

	frameNames := map[string]bool{}
	for _, f := range resp.Frames {
		frameNames[f.Name] = true
	}
	if !frameNames["CDH.Temperature"] {
		t.Error("missing frame CDH.Temperature")
	}
	if !frameNames["Sensors.Voltage"] {
		t.Error("missing frame Sensors.Voltage")
	}
}

func TestBuildResponseKeyFiltering(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "CDH", "Attitude", "fsw-1", "float", "value.x", nil, 1.0, nil, nil).
		AddRow(now, "CDH", "Attitude", "fsw-1", "float", "value.y", nil, 2.0, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	qm := queryModel{Channels: []channelRef{{"CDH", "Attitude"}}, Keys: []keyRef{{"CDH", "Attitude", "value.x"}, {"CDH", "Attitude", "value.y"}}, TimeField: "time", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 2 {
		t.Fatalf("expected 2 frames (one per key), got %d", len(resp.Frames))
	}

	frameNames := map[string]bool{}
	for _, f := range resp.Frames {
		frameNames[f.Name] = true
	}
	if !frameNames["CDH.Attitude.value.x"] {
		t.Error("missing frame for key value.x")
	}
	if !frameNames["CDH.Attitude.value.y"] {
		t.Error("missing frame for key value.y")
	}
}

func TestBuildResponseErtTimeField(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "component", "channel", "source", "valueType", "key", "val_int", "val_float", "val_bool", "val_str"}).
		AddRow(now, "c", "ch", "src", "float", "", nil, 9.9, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	qm := queryModel{Channels: []channelRef{{"c", "ch"}}, TimeField: "ert", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 1 {
		t.Fatalf("expected 1 frame, got %d", len(resp.Frames))
	}
	frame := resp.Frames[0]
	if frame.Name != "c.ch" {
		t.Errorf("expected frame name 'c.ch', got %q", frame.Name)
	}
	if frame.Fields[0].Name != "ert" {
		t.Errorf("expected time field 'ert', got %q", frame.Fields[0].Name)
	}
}

func TestQueryTelemetryErtTimeField(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := Datasource{db: db}
	mock.ExpectQuery("SELECT").WillReturnRows(sqlmock.NewRows([]string{"time", "value"}))

	rawSql := "SELECT * FROM telemetry"
	qJSON, _ := json.Marshal(queryModel{QueryType: "telemetry", TimeField: "ert", Aggregation: "avg", RawSql: &rawSql})
	resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
		Queries: []backend.DataQuery{
			{RefID: "A", JSON: qJSON},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.Responses["A"].Status != 0 {
		t.Errorf("expected no error for ert time field, got status %v", resp.Responses["A"].Status)
	}
}

func TestQueryTelemetryInvalidTimeField(t *testing.T) {
	ds := Datasource{}

	qJSON, _ := json.Marshal(queryModel{QueryType: "telemetry", Channels: []channelRef{{"comp", "ch"}}, TimeField: "bogus", Aggregation: "avg"})
	resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
		Queries: []backend.DataQuery{
			{RefID: "A", JSON: qJSON},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.Responses["A"].Status != backend.StatusBadRequest {
		t.Errorf("expected StatusBadRequest for invalid time field, got %v", resp.Responses["A"].Status)
	}
}

// responseRecorder is a minimal http.ResponseWriter for testing resource handlers.
type responseRecorder struct {
	code   int
	body   []byte
	header http.Header
}

func (r *responseRecorder) Header() http.Header { return r.header }
func (r *responseRecorder) Write(b []byte) (int, error) {
	r.body = append(r.body, b...)
	return len(b), nil
}
func (r *responseRecorder) WriteHeader(code int) { r.code = code }

func TestResourceHandlerComponents(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery("SELECT DISTINCT component").WillReturnRows(
		sqlmock.NewRows([]string{"component"}).AddRow("CDH").AddRow("Sensors").AddRow("Power"),
	)

	req, _ := http.NewRequest("GET", "/telemetry/components", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetryComponents(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.code)
	}

	var result []string
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 3 || result[0] != "CDH" || result[1] != "Sensors" || result[2] != "Power" {
		t.Errorf("unexpected components: %v", result)
	}
}

func TestResourceHandlerChannels(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery("SELECT component").WillReturnRows(
		sqlmock.NewRows([]string{"component", "name"}).AddRow("CDH", "Temperature").AddRow("Sensors", "Voltage"),
	)

	req, _ := http.NewRequest("GET", "/telemetry/channels?components=CDH&components=Sensors", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetryChannels(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d; body: %s", rr.code, string(rr.body))
	}

	var result []channelEntry
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 2 || result[0].Name != "Temperature" || result[0].Component != "CDH" {
		t.Errorf("unexpected channels: %v", result)
	}
}

func TestResourceHandlerChannelsAll(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery("SELECT component").WillReturnRows(
		sqlmock.NewRows([]string{"component", "name"}).AddRow("CDH", "Temperature").AddRow("Sensors", "Voltage"),
	)

	req, _ := http.NewRequest("GET", "/telemetry/channels", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetryChannels(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d; body: %s", rr.code, string(rr.body))
	}

	var result []channelEntry
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 2 {
		t.Errorf("expected 2 channels, got %v", result)
	}
}

func TestResourceHandlerSources(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery("SELECT DISTINCT source").WillReturnRows(
		sqlmock.NewRows([]string{"source"}).AddRow("fsw-1").AddRow("fsw-2"),
	)

	req, _ := http.NewRequest("GET", "/telemetry/sources", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetrySources(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.code)
	}

	var result []string
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 2 {
		t.Errorf("expected 2 sources, got %v", result)
	}
}

func TestResourceHandlerKeys(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery("SELECT DISTINCT").WillReturnRows(
		sqlmock.NewRows([]string{"component", "name", "key"}).
			AddRow("CDH", "Attitude", "value").
			AddRow("CDH", "Attitude", "value.x").
			AddRow("CDH", "Attitude", "value.y"),
	)

	req, _ := http.NewRequest("GET", "/telemetry/keys?components=CDH&channels=Attitude", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetryKeys(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.code)
	}

	var result []keyEntry
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 3 {
		t.Errorf("expected 3 keys, got %v", result)
	}
	if result[0].Component != "CDH" || result[0].Channel != "Attitude" || result[0].Key != "value" {
		t.Errorf("unexpected first key entry: %v", result[0])
	}
}

func TestResourceHandlerKeysEmpty(t *testing.T) {
	ds := &Datasource{}

	req, _ := http.NewRequest("GET", "/telemetry/keys", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetryKeys(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.code)
	}

	var result []keyEntry
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 0 {
		t.Errorf("expected empty keys for missing params, got %v", result)
	}
}

func TestResourceHandlerEventSources(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery("SELECT DISTINCT source").WillReturnRows(
		sqlmock.NewRows([]string{"source"}).AddRow("fsw-1"),
	)

	req, _ := http.NewRequest("GET", "/events/sources", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetEventSources(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.code)
	}

	var result []string
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 1 || result[0] != "fsw-1" {
		t.Errorf("unexpected event sources: %v", result)
	}
}
