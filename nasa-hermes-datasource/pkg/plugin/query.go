package plugin

import (
	"cmp"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"slices"
	"strings"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/lib/pq"
)

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifier).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (d *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	// create response struct
	response := backend.NewQueryDataResponse()

	// loop over queries and execute them individually.
	for _, q := range req.Queries {
		res := d.query(ctx, req.PluginContext, q)

		// save the response in a hashmap
		// based on with RefID as identifier
		response.Responses[q.RefID] = res
	}

	return response, nil
}

type channelRef struct {
	Component string `json:"component"`
	Name      string `json:"name"`
}

type keyRef struct {
	Component string `json:"component"`
	Channel   string `json:"channel"`
	Key       string `json:"key"`
}

type queryModel struct {
	QueryType        string       `json:"queryType"`
	Channels         []channelRef `json:"channels"`
	Sources          []string     `json:"sources"`
	Keys             []keyRef     `json:"keys,omitempty"`
	TimeField        string       `json:"timeField"`
	TimeOverrideFrom string       `json:"timeOverrideFrom,omitempty"`
	TimeOverrideTo   string       `json:"timeOverrideTo,omitempty"`
	Aggregation      string       `json:"aggregation,omitempty"`
}

func (d *Datasource) query(ctx context.Context, pCtx backend.PluginContext, query backend.DataQuery) backend.DataResponse {
	// Unmarshal the JSON into our queryModel.
	var qm queryModel

	err := json.Unmarshal(query.JSON, &qm)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("json unmarshal: %v", err.Error()))
	}

	queryFrom := query.TimeRange.From
	queryTo := query.TimeRange.To
	if qm.TimeOverrideFrom != "" {
		if t, err := time.Parse(time.RFC3339Nano, qm.TimeOverrideFrom); err == nil {
			queryFrom = t
		}
	}
	if qm.TimeOverrideTo != "" {
		if t, err := time.Parse(time.RFC3339Nano, qm.TimeOverrideTo); err == nil {
			queryTo = t
		}
	}

	var timeColumn string
	switch qm.TimeField {
	case "time":
		timeColumn = "time"
	case "ert":
		timeColumn = "ert"
	default:
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("invalid time type: %s", qm.TimeField))
	}

	switch qm.QueryType {
	case "events":
		return d.queryEvents(ctx, pCtx, qm, queryFrom, queryTo, timeColumn)
	case "telemetry":
		return d.queryTelemetry(ctx, pCtx, qm, queryFrom, queryTo, timeColumn, query.Interval)
	}
	return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("invalid query type: %s", qm.QueryType))
}

var severityLabels = map[int64]string{
	0: "DIAGNOSTIC",
	1: "ACTIVITY_LOW",
	2: "ACTIVITY_HIGH",
	3: "WARNING_LOW",
	4: "WARNING_HIGH",
	5: "COMMAND",
	6: "FATAL",
}

func severityLabel(sev int64) string {
	if label, ok := severityLabels[sev]; ok {
		return label
	}
	return fmt.Sprintf("UNKNOWN(%d)", sev)
}

func (d *Datasource) queryEvents(ctx context.Context, _ backend.PluginContext, qm queryModel, queryFrom time.Time, queryTo time.Time, timeColumn string) backend.DataResponse {
	var response backend.DataResponse

	queryArgs := []any{
		pq.Array(qm.Sources),
		queryFrom,
		queryTo,
	}

	eventSQL := fmt.Sprintf(`
		SELECT 
			e.%s,
			d.component,
			d.name,
			d.severity,
			e.message,
			e.source,
			e.args::text AS arguments
		FROM eventDefs d
		JOIN events e ON e.eventDefId = d.id
		WHERE ($1::text[] = '{}' OR e.source = ANY($1))
		  AND e.%s >= $2
		  AND e.%s <= $3
		ORDER BY e.%s ASC;`, timeColumn, timeColumn, timeColumn, timeColumn)

	rows, err := d.db.QueryContext(ctx, eventSQL, queryArgs...)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("events query execution failed: %v", err.Error()))
	}
	defer func() { _ = rows.Close() }()

	frame := data.NewFrame("Events")
	frame.Fields = append(frame.Fields,
		data.NewField(timeColumn, nil, []time.Time{}),
		data.NewField("component", nil, []string{}),
		data.NewField("name", nil, []string{}),
		data.NewField("severity", nil, []string{}),
		data.NewField("message", nil, []string{}),
		data.NewField("source", nil, []string{}),
		data.NewField("args", nil, []string{}),
	)

	for rows.Next() {
		var t time.Time
		var component, name string
		var severity int64
		var message, source, args string

		if err := rows.Scan(&t, &component, &name, &severity, &message, &source, &args); err != nil {
			return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("events row scan failure: %v", err.Error()))
		}

		frame.AppendRow(t, component, name, severityLabel(severity), message, source, args)
	}
	if err := rows.Err(); err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("events row iteration error: %v", err.Error()))
	}

	response.Frames = append(response.Frames, frame)
	return response
}

func (d *Datasource) queryTelemetry(ctx context.Context, _ backend.PluginContext, qm queryModel, queryFrom time.Time, queryTo time.Time, timeColumn string, queryInterval time.Duration) backend.DataResponse {
	var response backend.DataResponse
	if len(qm.Channels) == 0 {
		return response
	}

	// Extract unique components and names from structured channels
	componentSet := make(map[string]struct{})
	names := make([]string, len(qm.Channels))
	for i, ch := range qm.Channels {
		componentSet[ch.Component] = struct{}{}
		names[i] = ch.Name
	}
	components := make([]string, 0, len(componentSet))
	for c := range componentSet {
		components = append(components, c)
	}

	keyStrings := make([]string, len(qm.Keys))
	for i, k := range qm.Keys {
		keyStrings[i] = k.Key
	}
	sqlKeyParam := pq.Array(keyStrings)
	if len(keyStrings) > 0 {
		keyPatterns := make([]string, len(keyStrings))
		for i, key := range keyStrings {
			keyPatterns[i] = key + "%"
		}
		sqlKeyParam = pq.Array(keyPatterns)
	}

	queryArgs := []any{
		pq.Array(components),
		pq.Array(names),
		pq.Array(qm.Sources),
		queryFrom,
		queryTo,
		sqlKeyParam,
	}

	// Set time grouping interval
	var intervalExpr string
	if queryInterval.Milliseconds() >= 1 {
		queryArgs = append(queryArgs, fmt.Sprintf("%d milliseconds", int(queryInterval.Milliseconds())))
		intervalExpr = "time_bucket($7::interval, t." + timeColumn + ")"
	} else {
		intervalExpr = "t." + timeColumn
	}

	// Data aggregation operations
	var aggregationOp string
	switch qm.Aggregation {
	case "avg":
		aggregationOp = "AVG"
	case "min":
		aggregationOp = "MIN"
	case "max":
		aggregationOp = "MAX"
	case "count":
		aggregationOp = "COUNT"
	default:
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("invalid data aggregation type: %s", qm.Aggregation))
	}

	// TODO: also consider having valueType in telemetryDefs instead of telemetry
	rawSQL := fmt.Sprintf(`
		SELECT
			%s AS time_bucket,
			d.component,
			d.name,
			t.source,
			t.valueType,
			t.key,
			%s(t.integral::double precision) AS val_int,
			%s(t.floating::double precision) AS val_float,
			%s(t.boolval::int::double precision) AS val_bool,
			MAX(t.string) AS val_str 
		FROM telemetryDefs d
		JOIN telemetry t ON t.telemetryDefId = d.id
		WHERE d.component = ANY($1)
		  AND d.name = ANY($2)
		  AND ($3::text[] = '{}' OR t.source = ANY($3))
		  AND t.%s >= $4 AND t.%s <= $5
		  AND ($6::text[] = '{}' OR t.key LIKE ANY($6))
		GROUP BY time_bucket, d.component, d.name, t.source, t.valueType, t.key
		ORDER BY time_bucket ASC;`, intervalExpr, aggregationOp, aggregationOp, aggregationOp, timeColumn, timeColumn)

	// Execute the query
	rows, err := d.db.QueryContext(ctx, rawSQL, queryArgs...)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("telemetry query execution failed: %v", err.Error()))
	}
	defer func() { _ = rows.Close() }()

	return buildResponse(qm, rows, response)
}

func buildResponse(qm queryModel, rows *sql.Rows, response backend.DataResponse) backend.DataResponse {
	frames := make(map[string]*data.Frame)

	for rows.Next() {
		var t time.Time
		var component, channel, source, dbValueType string
		var key string
		var vInt, vFloat, vBool sql.NullFloat64
		var vStr sql.NullString
		if err := rows.Scan(&t, &component, &channel, &source, &dbValueType, &key, &vInt, &vFloat, &vBool, &vStr); err != nil {
			return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("telemetry row scan failure: %v", err.Error()))
		}

		frameId := fmt.Sprintf("%s.%s.%s/%s(%s)", component, channel, key, qm.TimeField, source)
		frame, exists := frames[frameId]

		// Create new frame
		if !exists {
			frame = data.NewFrame(frameId)
			frame.Fields = append(frame.Fields, data.NewField(qm.TimeField, nil, []time.Time{}))

			var valueField *data.Field
			switch dbValueType {
			case "int", "uint", "float":
				valueField = data.NewField("value", nil, []*float64{})
			case "bool":
				valueField = data.NewField("value", nil, []*bool{})
			default:
				valueField = data.NewField("value", nil, []*string{})
			}
			valueField.Labels = map[string]string{
				"component": component,
				"channel":   channel,
				"key":       key,
				"source":    source,
				"timeField": qm.TimeField,
			}
			frame.Fields = append(frame.Fields, valueField)
			frames[frameId] = frame
		}

		// Put this row into the correct data frame
		switch dbValueType {
		case "int", "uint":
			var valPtr *float64
			if vInt.Valid {
				valPtr = &vInt.Float64
			}
			frame.AppendRow(t, valPtr)
		case "float":
			var valPtr *float64
			if vFloat.Valid {
				valPtr = &vFloat.Float64
			}
			frame.AppendRow(t, valPtr)
		case "bool":
			var valPtr *bool
			if vBool.Valid {
				b := vBool.Float64 > 0
				valPtr = &b
			}
			frame.AppendRow(t, valPtr)
		default:
			var valPtr *string
			if vStr.Valid {
				valPtr = &vStr.String
			}
			frame.AppendRow(t, valPtr)
		}
	}

	if err := rows.Err(); err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("telemetry row iteration error: %v", err.Error()))
	}

	// Compute minimal display names across all frames
	keySet := make(map[string]struct{})
	sourceSet := make(map[string]struct{})
	for _, frame := range frames {
		for _, field := range frame.Fields {
			if field.Labels == nil {
				continue
			}
			if field.Labels["key"] != "value" {
				keySet[field.Labels["key"]] = struct{}{}
			}
			sourceSet[field.Labels["source"]] = struct{}{}
		}
	}
	multiKey := len(keySet) > 1
	multiSource := len(sourceSet) > 1

	// Return all data frames with display names
	for _, frame := range frames {
		var frameName string
		for _, field := range frame.Fields {
			if field.Labels == nil {
				continue
			}
			parts := []string{field.Labels["component"], field.Labels["channel"]}
			if multiKey && field.Labels["key"] != "value" {
				parts = append(parts, field.Labels["key"])
			}
			displayName := strings.Join(parts, ".")
			if multiSource {
				displayName += " (" + field.Labels["source"] + ")"
			}
			field.SetConfig(&data.FieldConfig{
				DisplayNameFromDS: displayName,
			})
			frameName = displayName
		}
		frame.Name = frameName
		response.Frames = append(response.Frames, frame)
	}
	slices.SortFunc(response.Frames, func(a, b *data.Frame) int {
		return cmp.Compare(a.Name, b.Name)
	})
	return response
}
