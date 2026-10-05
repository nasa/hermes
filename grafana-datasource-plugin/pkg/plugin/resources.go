package plugin

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
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

type channelEntry struct {
	Component string `json:"component"`
	Name      string `json:"name"`
}

func (d *Datasource) handleGetTelemetryChannels(w http.ResponseWriter, r *http.Request) {
	rows, err := d.db.QueryContext(r.Context(), "SELECT component, name FROM telemetryDefs ORDER BY component, name;")
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
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var selected []channelEntry
	if err := json.Unmarshal(body, &selected); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if len(selected) == 0 {
		writeJSONResponse(w, []keyEntry{})
		return
	}

	query := `
		SELECT DISTINCT d.component, d.name, t.key 
		FROM json_to_recordset($1::json) AS sel(component text, name text)
		JOIN telemetryDefs d ON d.component = sel.component AND d.name = sel.name
		JOIN telemetry t ON t.telemetryDefId = d.id
		WHERE t.key IS NOT NULL
		ORDER BY d.component, d.name, t.key
		LIMIT 200;`

	rows, err := d.db.QueryContext(r.Context(), query, string(body))
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
