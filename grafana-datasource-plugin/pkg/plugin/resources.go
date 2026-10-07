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
	rows, err := d.db.QueryContext(r.Context(), "SELECT DISTINCT space_system, name FROM parameters ORDER BY space_system, name;")
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
	rows, err := d.db.QueryContext(r.Context(), "SELECT DISTINCT instance FROM parameters ORDER BY instance;")
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

	// We list each parameter's members in its own subquery so parameter_id has
	// a single value inside it. TimescaleDB's SkipScan can then jump from one
	// member_path to the next in the (parameter_id, member_path, generation_time)
	// index instead of reading every stored value. The outer DISTINCT drops
	// repeats when a parameter exists in several instances.
	query := `
		SELECT DISTINCT p.space_system, p.name, m.member_path
		FROM json_to_recordset($1::json) AS sel(component text, name text)
		JOIN parameters p ON p.space_system = sel.component AND p.name = sel.name
		CROSS JOIN LATERAL (
			SELECT DISTINCT v.member_path
			FROM parameter_values v
			WHERE v.parameter_id = p.id
		) m
		ORDER BY p.space_system, p.name, m.member_path;`

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
