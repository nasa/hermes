package plugin

import (
	"cmp"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"reflect"
	"slices"
	"strings"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/grafana-plugin-sdk-go/data/sqlutil"
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
	Aggregation      string       `json:"aggregation"`
	RawSql           *string      `json:"rawSql,omitempty"`
}

func (d *Datasource) query(ctx context.Context, pCtx backend.PluginContext, query backend.DataQuery) backend.DataResponse {
	// Unmarshal the JSON into our queryModel.
	var qm queryModel

	if err := json.Unmarshal(query.JSON, &qm); err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("json unmarshal: %v", err.Error()))
	}

	switch qm.TimeField {
	case "time":
	case "ert":
	default:
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("invalid time type: %s", qm.TimeField))
	}

	var querySQL string
	if qm.RawSql != nil {
		querySQL = *qm.RawSql
	} else {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("rawSql is required for query type: %s", qm.QueryType))
	}

	if strings.Contains(querySQL, "$__interval") {
		intervalStr := fmt.Sprintf("%d milliseconds", int(query.Interval.Milliseconds()))
		querySQL = strings.ReplaceAll(querySQL, "$__interval", fmt.Sprintf("'%s'::interval", intervalStr))
	}

	switch qm.QueryType {
	case "events":
		return d.queryEvents(ctx, pCtx, qm, querySQL)
	case "telemetry":
		return d.queryTelemetry(ctx, pCtx, qm, querySQL)
	case "raw":
		return d.queryRaw(ctx, pCtx, querySQL)
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

func (d *Datasource) queryEvents(ctx context.Context, _ backend.PluginContext, qm queryModel, eventSQL string) backend.DataResponse {
	rows, err := d.db.QueryContext(ctx, eventSQL)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("events query execution failed: %v", err.Error()))
	}
	defer func() { _ = rows.Close() }()

	frame := data.NewFrame("Events")
	frame.Fields = append(frame.Fields,
		data.NewField(qm.TimeField, nil, []time.Time{}),
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

	var response backend.DataResponse
	response.Frames = append(response.Frames, frame)
	return response
}

func (d *Datasource) queryTelemetry(ctx context.Context, _ backend.PluginContext, qm queryModel, telemetrySQL string) backend.DataResponse {
	// Execute the query
	rows, err := d.db.QueryContext(ctx, telemetrySQL)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("telemetry query execution failed: %v", err.Error()))
	}
	defer func() { _ = rows.Close() }()

	return buildResponse(qm, rows)
}

func buildResponse(qm queryModel, rows *sql.Rows) backend.DataResponse {
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

	if qm.Aggregation == "deriv" {
		computeDerivatives(&frames)
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
	var response backend.DataResponse
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
			field.Name = displayName
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

func computeDerivatives(frames *map[string]*data.Frame) {
	for _, frame := range *frames {
		if len(frame.Fields) < 2 {
			continue
		}

		timeField := frame.Fields[0]
		valueField := frame.Fields[1]
		size := valueField.Len()
		if size < 2 {
			continue
		}
		if _, ok := valueField.At(0).(*float64); !ok {
			continue
		}

		valuesCopy := make([]*float64, size)
		for i := range size {
			if val := valueField.At(i); val != nil {
				valuesCopy[i] = val.(*float64)
			}
		}

		deriv := make([]*float64, size)
		deriv[0] = nil

		for i := range size {
			// Skip the first one
			if i == 0 {
				continue
			}

			prevTime := timeField.At(i - 1).(time.Time)
			currTime := timeField.At(i).(time.Time)

			prevVal := valuesCopy[i-1]
			currVal := valuesCopy[i]
			if prevVal == nil || currVal == nil {
				continue
			}

			timeDelta := currTime.Sub(prevTime).Seconds()
			if timeDelta == 0 {
				var zero float64
				deriv[i] = &zero
				continue
			}

			deri := (*currVal - *prevVal) / timeDelta
			deriv[i] = &deri
		}

		frame.Fields[1] = data.NewField(valueField.Name, valueField.Labels, deriv)
	}
}

// nullFloat32Converter handles nullable REAL/FLOAT4 (float32) columns from
// PostgreSQL. The SDK's built-in converters only register float64 for nullable
// floats, so a NULL in a REAL column would otherwise fail to scan. Scanning into
// sql.NullFloat64 (which lib/pq widens float4 into) handles NULL cleanly.
var nullFloat32Converter = sqlutil.Converter{
	Name:           "nullable float32 converter",
	InputScanType:  reflect.TypeFor[sql.NullFloat64](),
	InputTypeName:  "FLOAT4",
	FrameConverter: sqlutil.NullDecimalConverter.FrameConverter,
}

func (d *Datasource) queryRaw(ctx context.Context, _ backend.PluginContext, eventSQL string) backend.DataResponse {
	rows, err := d.db.QueryContext(ctx, eventSQL)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("events query execution failed: %v", err.Error()))
	}
	defer func() { _ = rows.Close() }()

	frame, err := sqlutil.FrameFromRows(rows, -1, nullFloat32Converter)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("failed to parse rows to frame: %v", err.Error()))
	}
	frame.Name = "Raw Data"

	var response backend.DataResponse
	response.Frames = append(response.Frames, frame)
	return response
}
