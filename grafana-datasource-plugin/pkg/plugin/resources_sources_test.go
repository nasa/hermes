package plugin

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/lib/pq"
)

func TestTelemetryChannelsSourceFilter(t *testing.T) {
	const allQuery = "SELECT component, name FROM telemetryDefs ORDER BY component, name;"
	const filteredQuery = `SELECT d.component, d.name FROM telemetryDefs d
		WHERE EXISTS (
			SELECT 1 FROM telemetry t
			WHERE t.telemetryDefId = d.id AND t.source = ANY($1)
		)
		ORDER BY d.component, d.name;`
	for _, tt := range []struct {
		name    string
		sources []string
		empty   bool
	}{
		{name: "all sources"},
		{name: "one source", sources: []string{"FSW-A"}},
		{name: "multiple sources", sources: []string{"FSW-A", "FSW-B"}},
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
			query := allQuery
			if len(tt.sources) > 0 {
				query = filteredQuery
			}
			expected := mock.ExpectQuery(regexp.QuoteMeta(query))
			if len(tt.sources) > 0 {
				expected.WithArgs(pq.Array(tt.sources))
			} else {
				expected.WithoutArgs()
			}
			rows := sqlmock.NewRows([]string{"component", "name"})
			body := "[]"
			if !tt.empty {
				rows.AddRow("CDH", "Temperature")
				body = `[{"component":"CDH","name":"Temperature"}]`
			}
			expected.WillReturnRows(rows).RowsWillBeClosed()
			values := url.Values{"sources": tt.sources}
			request := httptest.NewRequest(http.MethodGet, "/telemetry/channels?"+values.Encode(), nil)
			response := httptest.NewRecorder()
			datasource := Datasource{db: db}
			datasource.handleGetTelemetryChannels(response, request)
			if response.Code != http.StatusOK || response.Body.String() != body {
				t.Fatalf("got %d %s, want 200 %s", response.Code, response.Body.String(), body)
			}
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Fatal(err)
			}
		})
	}
}

func TestTelemetryChannelsFilteredQueryError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = db.Close() }()
	mock.ExpectQuery("SELECT d.component").WithArgs(pq.Array([]string{"FSW-A"})).
		WillReturnError(errors.New("database unavailable"))
	response := httptest.NewRecorder()
	datasource := Datasource{db: db}
	datasource.handleGetTelemetryChannels(response, httptest.NewRequest(http.MethodGet, "/telemetry/channels?sources=FSW-A", nil))
	if response.Code != http.StatusInternalServerError {
		t.Fatalf("got status %d, want 500", response.Code)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
