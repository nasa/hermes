package plugin

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/lib/pq"
)

func scanStrings(rows *sql.Rows) ([]string, error) {
	defer func() { _ = rows.Close() }()
	var items []string
	for rows.Next() {
		var item string
		if err := rows.Scan(&item); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if items == nil {
		items = []string{}
	}
	return items, nil
}

func (d *Datasource) handleGetTelemetryComponents(w http.ResponseWriter, r *http.Request) {
	rows, err := d.db.QueryContext(r.Context(), "SELECT DISTINCT component FROM telemetryDefs ORDER BY component;")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	items, err := scanStrings(rows)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSONResponse(w, items)
}

type channelEntry struct {
	Component string `json:"component"`
	Name      string `json:"name"`
}

func (d *Datasource) handleGetTelemetryChannels(w http.ResponseWriter, r *http.Request) {
	query := "SELECT component, name FROM telemetryDefs ORDER BY component, name;"
	var args []any
	if sources := r.URL.Query()["sources"]; len(sources) > 0 {
		fromRaw := r.URL.Query().Get("from")
		toRaw := r.URL.Query().Get("to")
		if fromRaw == "" || toRaw == "" {
			http.Error(w, "source-filtered channel queries require from and to", http.StatusBadRequest)
			return
		}
		from, err := time.Parse(time.RFC3339Nano, fromRaw)
		if err != nil {
			http.Error(w, "invalid from time", http.StatusBadRequest)
			return
		}
		to, err := time.Parse(time.RFC3339Nano, toRaw)
		if err != nil || to.Before(from) {
			http.Error(w, "invalid to time", http.StatusBadRequest)
			return
		}
		timeField := r.URL.Query().Get("timeField")
		if timeField == "" {
			timeField = "ert"
		}
		if timeField != "time" && timeField != "ert" {
			http.Error(w, "invalid time field", http.StatusBadRequest)
			return
		}
		query = fmt.Sprintf(`SELECT d.component, d.name FROM telemetryDefs d
			WHERE EXISTS (
				SELECT 1 FROM telemetry t
				WHERE t.telemetryDefId = d.id AND t.source = ANY($1)
				  AND t.%s >= $2 AND t.%s <= $3
			)
			ORDER BY d.component, d.name;`, timeField, timeField)
		args = append(args, pq.Array(sources), from, to)
	}
	rows, err := d.db.QueryContext(r.Context(), query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer func() { _ = rows.Close() }()

	items := []channelEntry{}
	for rows.Next() {
		var entry channelEntry
		if err := rows.Scan(&entry.Component, &entry.Name); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, entry)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSONResponse(w, items)
}

func (d *Datasource) handleGetTelemetrySources(w http.ResponseWriter, r *http.Request) {
	rows, err := d.db.QueryContext(r.Context(), "SELECT DISTINCT source FROM telemetry ORDER BY source;")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	items, err := scanStrings(rows)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSONResponse(w, items)
}

type keyEntry struct {
	Component string `json:"component"`
	Channel   string `json:"channel"`
	Key       string `json:"key"`
}

func (d *Datasource) handleGetTelemetryKeys(w http.ResponseWriter, r *http.Request) {
	components := r.URL.Query()["components"]
	channels := r.URL.Query()["channels"]
	if len(components) == 0 || len(channels) == 0 {
		writeJSONResponse(w, []keyEntry{})
		return
	}

	query := `
		SELECT DISTINCT d.component, d.name, t.key 
		FROM telemetry t
		JOIN telemetryDefs d ON t.telemetryDefId = d.id
		WHERE d.component = ANY($1) AND d.name = ANY($2) AND t.key IS NOT NULL
		ORDER BY d.component, d.name, t.key
		LIMIT 200;`

	rows, err := d.db.QueryContext(r.Context(), query, pq.Array(components), pq.Array(channels))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer func() { _ = rows.Close() }()

	items := []keyEntry{}
	for rows.Next() {
		var entry keyEntry
		if err := rows.Scan(&entry.Component, &entry.Channel, &entry.Key); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, entry)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSONResponse(w, items)
}

func (d *Datasource) handleGetEventSources(w http.ResponseWriter, r *http.Request) {
	rows, err := d.db.QueryContext(r.Context(), "SELECT DISTINCT source FROM events ORDER BY source;")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	items, err := scanStrings(rows)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSONResponse(w, items)
}

func writeJSONResponse(w http.ResponseWriter, data any) {
	bytes, err := json.Marshal(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(bytes)
}
