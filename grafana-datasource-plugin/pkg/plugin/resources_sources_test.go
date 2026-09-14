package plugin

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/lib/pq"
)

func telemetryChannelsFilteredQuery(timeField string) string {
	return fmt.Sprintf(`SELECT d.component, d.name FROM telemetryDefs d
		WHERE EXISTS (
			SELECT 1 FROM telemetry t
			WHERE t.telemetryDefId = d.id AND t.source = ANY($1)
			  AND t.%s >= $2 AND t.%s <= $3
		)
		ORDER BY d.component, d.name;`, timeField, timeField)
}

func TestTelemetryChannelsSourceFilter(t *testing.T) {
	const allQuery = "SELECT component, name FROM telemetryDefs ORDER BY component, name;"
	from := time.Date(2026, 9, 14, 18, 0, 0, 0, time.UTC)
	to := from.Add(time.Hour)
	for _, tt := range []struct {
		name      string
		sources   []string
		timeField string
		empty     bool
	}{
		{name: "all sources"},
		{name: "one source", sources: []string{"FSW-A"}},
		{name: "multiple sources by onboard time", sources: []string{"FSW-A", "FSW-B"}, timeField: "time"},
		{name: "quoted source", sources: []string{"FSW's \"test\",\\source"}},
		{name: "empty source identifier", sources: []string{""}},
		{name: "no matching source", sources: []string{"unknown"}, empty: true},
	} {
		t.Run(tt.name, func(t *testing.T) {
			db, mock, err := sqlmock.New()
			if err != nil {
				t.Fatal(err)
			}
			defer func() { _ = db.Close() }()
			values := url.Values{"sources": tt.sources}
			var expected *sqlmock.ExpectedQuery
			if len(tt.sources) > 0 {
				field := tt.timeField
				if field == "" {
					field = "ert"
				}
				query := telemetryChannelsFilteredQuery(field)
				expected = mock.ExpectQuery(regexp.QuoteMeta(query)).WithArgs(pq.Array(tt.sources), from, to)
				values.Set("from", from.Format(time.RFC3339Nano))
				values.Set("to", to.Format(time.RFC3339Nano))
				values.Set("timeField", field)
			} else {
				expected = mock.ExpectQuery(regexp.QuoteMeta(allQuery)).WithoutArgs()
			}
			rows := sqlmock.NewRows([]string{"component", "name"})
			body := "[]"
			if !tt.empty {
				rows.AddRow("CDH", "Temperature")
				body = `[{"component":"CDH","name":"Temperature"}]`
			}
			expected.WillReturnRows(rows).RowsWillBeClosed()
			request := httptest.NewRequest(http.MethodGet, "/telemetry/channels?"+values.Encode(), nil)
			response := httptest.NewRecorder()
			(&Datasource{db: db}).handleGetTelemetryChannels(response, request)
			if response.Code != http.StatusOK || response.Body.String() != body {
				t.Fatalf("got %d %s, want 200 %s", response.Code, response.Body.String(), body)
			}
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Fatal(err)
			}
		})
	}
}

func TestTelemetryChannelsSourceFilterRejectsUnboundedOrInvalidRanges(t *testing.T) {
	for _, rawQuery := range []string{
		"sources=FSW-A",
		"sources=FSW-A&from=2026-09-14T18%3A00%3A00Z&to=2026-09-14T19%3A00%3A00Z&timeField=bogus",
		"sources=FSW-A&from=2026-09-14T20%3A00%3A00Z&to=2026-09-14T19%3A00%3A00Z&timeField=ert",
	} {
		db, _, err := sqlmock.New()
		if err != nil {
			t.Fatal(err)
		}
		response := httptest.NewRecorder()
		(&Datasource{db: db}).handleGetTelemetryChannels(response, httptest.NewRequest(http.MethodGet, "/telemetry/channels?"+rawQuery, nil))
		_ = db.Close()
		if response.Code != http.StatusBadRequest {
			t.Fatalf("query %q got status %d, want 400", rawQuery, response.Code)
		}
	}
}

func TestTelemetryChannelsFilteredQueryError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = db.Close() }()
	from := time.Date(2026, 9, 14, 18, 0, 0, 0, time.UTC)
	to := from.Add(time.Hour)
	mock.ExpectQuery("SELECT d.component").WithArgs(pq.Array([]string{"FSW-A"}), from, to).
		WillReturnError(errors.New("database unavailable"))
	values := url.Values{
		"sources":   []string{"FSW-A"},
		"from":      []string{from.Format(time.RFC3339Nano)},
		"to":        []string{to.Format(time.RFC3339Nano)},
		"timeField": []string{"ert"},
	}
	response := httptest.NewRecorder()
	(&Datasource{db: db}).handleGetTelemetryChannels(response, httptest.NewRequest(http.MethodGet, "/telemetry/channels?"+values.Encode(), nil))
	if response.Code != http.StatusInternalServerError {
		t.Fatalf("got status %d, want 500", response.Code)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
