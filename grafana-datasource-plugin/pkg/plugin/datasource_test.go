package plugin

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
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

	t.Run("returns no frames for telemetry without rawSql", func(t *testing.T) {
		qJSON, _ := json.Marshal(queryModel{QueryType: "telemetry", TimeField: "generation_time", Aggregation: "avg"})
		resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
			Queries: []backend.DataQuery{
				{RefID: "A", JSON: qJSON},
			},
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(resp.Responses["A"].Frames) != 0 {
			t.Errorf("expected no frames without rawSql, got %d", len(resp.Responses["A"].Frames))
		}
	})
}

func TestQueryDataMultipleQueries(t *testing.T) {
	ds := Datasource{}

	q1, _ := json.Marshal(queryModel{QueryType: "unknown"})
	q2, _ := json.Marshal(queryModel{QueryType: "telemetry", TimeField: "generation_time", Aggregation: "avg"})

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
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/comp", "ch", "src", "SINT64", "", 42.0, nil, nil, nil, nil).
		AddRow(now.Add(time.Second), "/comp", "ch", "src", "SINT64", "", 100.0, nil, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)

	resultRows, _ := db.Query("SELECT")
	qm := queryModel{TimeField: "generation_time", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 1 {
		t.Fatalf("expected 1 frame, got %d", len(resp.Frames))
	}
	frame := resp.Frames[0]
	if frame.Name != "/comp/ch" {
		t.Errorf("expected frame name '/comp/ch', got %q", frame.Name)
	}
	if len(frame.Fields) != 2 {
		t.Fatalf("expected 2 fields, got %d", len(frame.Fields))
	}
	if frame.Fields[1].Name != "/comp/ch" {
		t.Errorf("expected value field '/comp/ch', got %q", frame.Fields[1].Name)
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
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "UINT64", "", 255.0, nil, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	qm := queryModel{TimeField: "generation_time", Aggregation: "avg"}
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
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "DOUBLE", "", nil, 3.14, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "avg"}, resultRows)

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
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "BOOLEAN", "", nil, nil, 1.0, nil, nil).
		AddRow(now.Add(time.Second), "/c", "ch", "src", "BOOLEAN", "", nil, nil, 0.0, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "last"}, resultRows)

	v1 := resp.Frames[0].Fields[1].At(0).(*bool)
	v2 := resp.Frames[0].Fields[1].At(1).(*bool)
	if *v1 != true {
		t.Error("expected first bool row to be true")
	}
	if *v2 != false {
		t.Error("expected second bool row to be false")
	}
}

func TestBuildResponseNumericAggregates(t *testing.T) {
	tests := []struct {
		aggregation, valueType string
		valFloat, valBool      interface{}
		want                   float64
	}{
		{"count", "BOOLEAN", 7.0, nil, 7},
		{"count", "BINARY", 12.0, nil, 12},
		{"count", "STRING", 3.0, nil, 3},
		{"count", "UINT32", 5.0, nil, 5},
		{"avg", "BOOLEAN", nil, 0.25, 0.25},
		{"sum", "BOOLEAN", nil, 3.0, 3},
	}
	for _, tt := range tests {
		t.Run(tt.aggregation+" "+tt.valueType, func(t *testing.T) {
			db, mock, err := sqlmock.New()
			if err != nil {
				t.Fatalf("sqlmock: %v", err)
			}
			defer func() { _ = db.Close() }()

			rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
				AddRow(time.Now(), "/c", "ch", "src", tt.valueType, "", nil, tt.valFloat, tt.valBool, nil, nil)
			mock.ExpectQuery("SELECT").WillReturnRows(rows)
			resultRows, _ := db.Query("SELECT")
			resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: tt.aggregation}, resultRows)

			if resp.Error != nil {
				t.Fatalf("unexpected error: %v", resp.Error)
			}
			val, ok := resp.Frames[0].Fields[1].At(0).(*float64)
			if !ok || val == nil || *val != tt.want {
				t.Errorf("want number %v, got %#v", tt.want, resp.Frames[0].Fields[1].At(0))
			}
		})
	}
}

func TestBuildResponseStringType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "STRING", "", nil, nil, nil, "hello", nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "first"}, resultRows)

	val := resp.Frames[0].Fields[1].At(0).(*string)
	if *val != "hello" {
		t.Errorf("expected 'hello', got %q", *val)
	}
}

func TestBuildResponseBytesType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "BINARY", "", nil, nil, nil, nil, []byte{0x1a, 0x2f, 0xb0}).
		AddRow(now.Add(time.Second), "/c", "ch", "src", "BINARY", "", nil, nil, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "first"}, resultRows)

	if len(resp.Frames) != 1 {
		t.Fatalf("expected 1 frame, got %d", len(resp.Frames))
	}
	// bytes are hex-encoded into a *string value field.
	val := resp.Frames[0].Fields[1].At(0).(*string)
	if *val != "1a2fb0" {
		t.Errorf("expected hex '1a2fb0', got %q", *val)
	}
	// NULL bytes yield a nil *string.
	if null := resp.Frames[0].Fields[1].At(1).(*string); null != nil {
		t.Errorf("expected nil *string for null bytes, got %v", *null)
	}
}

func TestValidateAggregation(t *testing.T) {
	tests := []struct {
		aggregation string
		valueType   string
		wantErr     bool
	}{
		{"avg", "DOUBLE", false},
		{"avg", "SINT64", false},
		{"avg", "UINT64", false},
		{"avg", "BOOLEAN", false},
		{"avg", "STRING", true},
		{"avg", "ENUMERATED", true},
		{"avg", "BINARY", true},
		{"avg", "TIMESTAMP", true},
		{"sum", "STRING", true},
		{"min", "FLOAT", false},
		{"min", "STRING", false},
		{"min", "TIMESTAMP", false},
		{"min", "BINARY", true},
		{"max", "BINARY", true},
		{"first", "STRING", false},
		{"first", "BINARY", false},
		{"last", "BINARY", false},
		{"count", "STRING", false},
		{"raw", "BINARY", false},
	}
	for _, tt := range tests {
		t.Run(fmt.Sprintf("%s_%s", tt.aggregation, tt.valueType), func(t *testing.T) {
			err := validateAggregation(tt.aggregation, tt.valueType)
			if (err != nil) != tt.wantErr {
				t.Errorf("validateAggregation(%q, %q) error = %v, wantErr %v", tt.aggregation, tt.valueType, err, tt.wantErr)
			}
		})
	}
}

func TestBuildResponseRejectsInvalidAggregation(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "STRING", "", nil, nil, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "avg"}, resultRows)

	if resp.Status != backend.StatusBadRequest {
		t.Fatalf("expected StatusBadRequest for avg on string, got %v", resp.Status)
	}
	if len(resp.Frames) != 0 {
		t.Errorf("expected no frames on validation error, got %d", len(resp.Frames))
	}
}

func TestBuildResponseEnumType(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	// ENUMERATED falls through to the default (string) branch, showing its label
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "ENUMERATED", "", nil, nil, nil, "MY_ENUM_VAL", nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "first"}, resultRows)

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
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "SINT64", "", nil, nil, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "avg"}, resultRows)

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

	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"})

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "avg"}, resultRows)

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
	qJSON, _ := json.Marshal(queryModel{QueryType: "events", TimeField: "generation_time", Aggregation: "avg", RawSql: &rawSql})
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

	telemetryRows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/comp1", "ch1", "src1", "DOUBLE", "", nil, 1.5, nil, nil, nil).
		AddRow(now.Add(time.Second), "/comp1", "ch1", "src1", "DOUBLE", "", nil, 2.5, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(telemetryRows)

	rawSql := "SELECT * FROM parameter_values"
	qJSON, _ := json.Marshal(queryModel{QueryType: "telemetry", TimeField: "generation_time", Aggregation: "avg", RawSql: &rawSql})
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
	if frame.Name != "/comp1/ch1" {
		t.Errorf("expected frame name '/comp1/ch1', got %q", frame.Name)
	}
	if frame.Fields[1].Name != "/comp1/ch1" {
		t.Errorf("expected field name '/comp1/ch1', got %q", frame.Fields[1].Name)
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

func TestBuildResponseMultiSpaceSystem(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/CDH", "Temperature", "fsw-1", "DOUBLE", "", nil, 22.5, nil, nil, nil).
		AddRow(now, "/Sensors", "Voltage", "fsw-1", "DOUBLE", "", nil, 3.3, nil, nil, nil).
		AddRow(now.Add(time.Second), "/CDH", "Temperature", "fsw-1", "DOUBLE", "", nil, 23.0, nil, nil, nil).
		AddRow(now.Add(time.Second), "/Sensors", "Voltage", "fsw-1", "DOUBLE", "", nil, 3.4, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	qm := queryModel{TimeField: "generation_time", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 2 {
		t.Fatalf("expected 2 frames for two space systems, got %d", len(resp.Frames))
	}

	frameNames := map[string]bool{}
	for _, f := range resp.Frames {
		frameNames[f.Name] = true
	}
	if !frameNames["/CDH/Temperature"] {
		t.Error("missing frame /CDH/Temperature")
	}
	if !frameNames["/Sensors/Voltage"] {
		t.Error("missing frame /Sensors/Voltage")
	}
}

func TestBuildResponseOneFramePerMember(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/CDH", "Attitude", "fsw-1", "DOUBLE", ".x", nil, 1.0, nil, nil, nil).
		AddRow(now, "/CDH", "Attitude", "fsw-1", "DOUBLE", ".y", nil, 2.0, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	qm := queryModel{TimeField: "generation_time", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 2 {
		t.Fatalf("expected 2 frames (one per member), got %d", len(resp.Frames))
	}

	frameNames := map[string]bool{}
	for _, f := range resp.Frames {
		frameNames[f.Name] = true
	}
	if !frameNames["/CDH/Attitude.x"] {
		t.Error("missing frame for member .x")
	}
	if !frameNames["/CDH/Attitude.y"] {
		t.Error("missing frame for member .y")
	}
}

func TestBuildResponseNamesSingleMemberAndInstances(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/CDH", "Temps", "fsw-a", "FLOAT", "[0]", nil, 1.0, nil, nil, nil).
		AddRow(now, "/CDH", "Temps", "fsw-b", "FLOAT", "[0]", nil, 2.0, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	resp := buildResponse(queryModel{TimeField: "generation_time", Aggregation: "avg"}, resultRows)

	if len(resp.Frames) != 2 {
		t.Fatalf("expected 2 frames (one per instance), got %d", len(resp.Frames))
	}
	if resp.Frames[0].Name != "/CDH/Temps[0] (fsw-a)" || resp.Frames[1].Name != "/CDH/Temps[0] (fsw-b)" {
		t.Errorf("unexpected frame names %q, %q", resp.Frames[0].Name, resp.Frames[1].Name)
	}
}

func TestBuildResponseAcquisitionTimeField(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	now := time.Now().Truncate(time.Second)
	rows := sqlmock.NewRows([]string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}).
		AddRow(now, "/c", "ch", "src", "DOUBLE", "", nil, 9.9, nil, nil, nil)

	mock.ExpectQuery("SELECT").WillReturnRows(rows)
	resultRows, _ := db.Query("SELECT")
	qm := queryModel{TimeField: "acquisition_time", Aggregation: "avg"}
	resp := buildResponse(qm, resultRows)

	if len(resp.Frames) != 1 {
		t.Fatalf("expected 1 frame, got %d", len(resp.Frames))
	}
	frame := resp.Frames[0]
	if frame.Name != "/c/ch" {
		t.Errorf("expected frame name '/c/ch', got %q", frame.Name)
	}
	if frame.Fields[0].Name != "acquisition_time" {
		t.Errorf("expected time field 'acquisition_time', got %q", frame.Fields[0].Name)
	}
}

func TestQueryTelemetryAcquisitionTimeField(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := Datasource{db: db}
	mock.ExpectQuery("SELECT").WillReturnRows(sqlmock.NewRows([]string{"time", "value"}))

	rawSql := "SELECT * FROM parameter_values"
	qJSON, _ := json.Marshal(queryModel{QueryType: "telemetry", TimeField: "acquisition_time", Aggregation: "avg", RawSql: &rawSql})
	resp, err := ds.QueryData(context.Background(), &backend.QueryDataRequest{
		Queries: []backend.DataQuery{
			{RefID: "A", JSON: qJSON},
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.Responses["A"].Status != 0 {
		t.Errorf("expected no error for acquisition_time, got status %v", resp.Responses["A"].Status)
	}
}

func TestQueryTelemetryInvalidTimeField(t *testing.T) {
	ds := Datasource{}

	qJSON, _ := json.Marshal(queryModel{QueryType: "telemetry", TimeField: "bogus", Aggregation: "avg"})
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

func TestResourceHandlerParameters(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery(`SELECT DISTINCT space_system, name FROM parameters`).WillReturnRows(
		sqlmock.NewRows([]string{"space_system", "name"}).AddRow("/CDH", "Temperature").AddRow("/Sensors", "Voltage"),
	)

	req, _ := http.NewRequest("GET", "/telemetry/parameters", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetryParameters(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d; body: %s", rr.code, string(rr.body))
	}

	var result []parameterEntry
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 2 || result[0].Name != "Temperature" || result[0].SpaceSystem != "/CDH" {
		t.Errorf("unexpected parameters: %v", result)
	}
}

func TestResourceHandlerParametersAll(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery(`SELECT DISTINCT space_system, name FROM parameters`).WillReturnRows(
		sqlmock.NewRows([]string{"space_system", "name"}).AddRow("/CDH", "Temperature").AddRow("/Sensors", "Voltage"),
	)

	req, _ := http.NewRequest("GET", "/telemetry/parameters", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetryParameters(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d; body: %s", rr.code, string(rr.body))
	}

	var result []parameterEntry
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 2 {
		t.Errorf("expected 2 parameters, got %v", result)
	}
}

func TestResourceHandlerInstances(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery(`SELECT DISTINCT instance FROM parameters`).WillReturnRows(
		sqlmock.NewRows([]string{"instance"}).AddRow("fsw-1").AddRow("fsw-2"),
	)

	req, _ := http.NewRequest("GET", "/telemetry/instances", nil)
	rr := &responseRecorder{header: http.Header{}}
	ds.handleGetTelemetryInstances(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.code)
	}

	var result []string
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 2 {
		t.Errorf("expected 2 instances, got %v", result)
	}
}

func TestResourceHandlerMembers(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer func() { _ = db.Close() }()

	ds := &Datasource{db: db}

	mock.ExpectQuery(`(?s)SELECT DISTINCT p.space_system, p.name, m.member_path.*FROM parameter_values v`).
		WithArgs(`[{"spaceSystem":"/CDH","name":"Attitude"},{"spaceSystem":"/Sensors","name":"Attitude"}]`).
		WillReturnRows(sqlmock.NewRows([]string{"space_system", "name", "member_path"}).
			AddRow("/CDH", "Attitude", ".x").
			AddRow("/CDH", "Attitude", ".y").
			AddRow("/Sensors", "Attitude", ""),
		)

	body := `[{"spaceSystem":"/CDH","name":"Attitude"},{"spaceSystem":"/Sensors","name":"Attitude"}]`
	req, _ := http.NewRequest("POST", "/telemetry/members", strings.NewReader(body))
	rr := &responseRecorder{header: http.Header{}}
	ds.handleTelemetryMembers(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.code)
	}

	var result []memberEntry
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 3 {
		t.Errorf("expected 3 members, got %v", result)
	}
	if result[0].SpaceSystem != "/CDH" || result[0].Parameter != "Attitude" || result[0].Member != ".x" {
		t.Errorf("unexpected first member entry: %v", result[0])
	}
}

func TestResourceHandlerMembersEmpty(t *testing.T) {
	ds := &Datasource{}

	req, _ := http.NewRequest("POST", "/telemetry/members", strings.NewReader("[]"))
	rr := &responseRecorder{header: http.Header{}}
	ds.handleTelemetryMembers(rr, req)

	if rr.code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.code)
	}

	var result []memberEntry
	if err := json.Unmarshal(rr.body, &result); err != nil {
		t.Fatalf("json unmarshal: %v", err)
	}
	if len(result) != 0 {
		t.Errorf("expected empty members for missing params, got %v", result)
	}
}

func TestResourceHandlerMembersBadBody(t *testing.T) {
	ds := &Datasource{}

	req, _ := http.NewRequest("POST", "/telemetry/members", strings.NewReader("spaceSystems=/CDH"))
	rr := &responseRecorder{header: http.Header{}}
	ds.handleTelemetryMembers(rr, req)

	if rr.code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rr.code)
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
