package plugin

import (
	"database/sql"
	"encoding/json"
	"net/http"

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
	// components[i] and channels[i] together name one selected channel.
	components := r.URL.Query()["components"]
	channels := r.URL.Query()["channels"]
	if len(components) != len(channels) {
		http.Error(w, "components and channels must have the same length", http.StatusBadRequest)
		return
	}
	if len(components) == 0 {
		writeJSONResponse(w, []keyEntry{})
		return
	}

	// Members are listed per parameter (one per instance) and capped so a large
	// array cannot flood the picker.
	query := `
		SELECT DISTINCT p.space_system, p.name, m.member_path
		FROM unnest($1::text[], $2::text[]) AS sel(space_system, name)
		JOIN parameters p ON p.space_system = sel.space_system AND p.name = sel.name
		CROSS JOIN LATERAL (
			SELECT DISTINCT v.member_path
			FROM parameter_values v
			WHERE v.parameter_id = p.id
			ORDER BY v.member_path
			LIMIT 1000
		) m
		ORDER BY p.space_system, p.name, m.member_path;`

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
