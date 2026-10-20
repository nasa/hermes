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

type parameterEntry struct {
	SpaceSystem string `json:"spaceSystem"`
	Name        string `json:"name"`
}

func (d *Datasource) handleGetTelemetryParameters(w http.ResponseWriter, r *http.Request) {
	rows, err := d.db.QueryContext(r.Context(), "SELECT DISTINCT space_system, name FROM parameters ORDER BY space_system, name;")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer func() { _ = rows.Close() }()

	items := []parameterEntry{}
	for rows.Next() {
		var entry parameterEntry
		if err := rows.Scan(&entry.SpaceSystem, &entry.Name); err != nil {
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

func (d *Datasource) handleGetTelemetryInstances(w http.ResponseWriter, r *http.Request) {
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

type memberEntry struct {
	SpaceSystem string `json:"spaceSystem"`
	Parameter   string `json:"parameter"`
	Member      string `json:"member"`
}

func (d *Datasource) handleTelemetryMembers(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var selected []parameterEntry
	if err := json.Unmarshal(body, &selected); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if len(selected) == 0 {
		writeJSONResponse(w, []memberEntry{})
		return
	}

	// DISTINCT drops repeats when a member has had several value types or the
	// parameter exists in several instances.
	query := `
		SELECT DISTINCT p.space_system, p.name, p.member_path
		FROM json_to_recordset($1::json) AS sel("spaceSystem" text, name text)
		JOIN parameters p ON p.space_system = sel."spaceSystem" AND p.name = sel.name
		ORDER BY p.space_system, p.name, p.member_path;`

	rows, err := d.db.QueryContext(r.Context(), query, string(body))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer func() { _ = rows.Close() }()

	items := []memberEntry{}
	for rows.Next() {
		var entry memberEntry
		if err := rows.Scan(&entry.SpaceSystem, &entry.Parameter, &entry.Member); err != nil {
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
