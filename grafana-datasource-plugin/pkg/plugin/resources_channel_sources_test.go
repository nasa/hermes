package plugin

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestTelemetryChannelsIncludeSources(t *testing.T) {
	const query = `SELECT DISTINCT d.component, d.name, t.source
		FROM telemetryDefs d
		LEFT JOIN telemetry t ON t.telemetryDefId = d.id
		ORDER BY d.component, d.name, t.source;`
	for _, tt := range []struct {
		name string
		rows *sqlmock.Rows
		body string
	}{
		{
			name: "same channel from two sources",
			rows: sqlmock.NewRows([]string{"component", "name", "source"}).
				AddRow("CDH", "Temperature", "FSW-A").AddRow("CDH", "Temperature", "FSW-B"),
			body: `[{"component":"CDH","name":"Temperature","source":"FSW-A"},{"component":"CDH","name":"Temperature","source":"FSW-B"}]`,
		},
		{
			name: "definition with no telemetry",
			rows: sqlmock.NewRows([]string{"component", "name", "source"}).AddRow("CDH", "Temperature", nil),
			body: `[{"component":"CDH","name":"Temperature"}]`,
		},
		{
			name: "empty source identifier",
			rows: sqlmock.NewRows([]string{"component", "name", "source"}).AddRow("CDH", "Temperature", ""),
			body: `[{"component":"CDH","name":"Temperature","source":""}]`,
		},
		{
			name: "no definitions",
			rows: sqlmock.NewRows([]string{"component", "name", "source"}),
			body: `[]`,
		},
	} {
		t.Run(tt.name, func(t *testing.T) {
			db, mock, err := sqlmock.New()
			if err != nil {
				t.Fatal(err)
			}
			defer func() { _ = db.Close() }()
			mock.ExpectQuery(regexp.QuoteMeta(query)).WillReturnRows(tt.rows).RowsWillBeClosed()
			response := httptest.NewRecorder()
			datasource := Datasource{db: db}
			datasource.handleGetTelemetryChannels(response, httptest.NewRequest(http.MethodGet, "/telemetry/channels?includeSources=true", nil))
			if response.Code != http.StatusOK || response.Body.String() != tt.body {
				t.Fatalf("got %d %s, want 200 %s", response.Code, response.Body.String(), tt.body)
			}
			if err := mock.ExpectationsWereMet(); err != nil {
				t.Fatal(err)
			}
		})
	}
}

func TestTelemetryChannelsSourceRowError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = db.Close() }()
	rows := sqlmock.NewRows([]string{"component", "name", "source"}).
		AddRow("CDH", "Temperature", "FSW-A").RowError(0, errors.New("read failed"))
	mock.ExpectQuery("SELECT DISTINCT").WillReturnRows(rows).RowsWillBeClosed()
	response := httptest.NewRecorder()
	datasource := Datasource{db: db}
	datasource.handleGetTelemetryChannels(response, httptest.NewRequest(http.MethodGet, "/telemetry/channels?includeSources=true", nil))
	if response.Code != http.StatusInternalServerError {
		t.Fatalf("got status %d, want 500", response.Code)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
