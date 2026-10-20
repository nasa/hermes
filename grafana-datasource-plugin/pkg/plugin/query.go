package plugin

import (
	"cmp"
	"context"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"reflect"
	"slices"
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

type queryModel struct {
	TimeField   string  `json:"timeField"`
	Aggregation string  `json:"aggregation"`
	RawSql      *string `json:"rawSql,omitempty"`
}

// We write our own interval and time range macros and take the rest from the SDK. The SDK writes the
// interval as a bare duration like 10m, which Postgres can't parse in time_bucket($__interval, ...),
// and the time range in whole seconds, which leaves a live panel's newest values out.
var macros = sqlutil.Macros{
	"interval": func(q *sqlutil.Query, _ []string) (string, error) {
		return fmt.Sprintf("'%d milliseconds'::interval", q.Interval.Milliseconds()), nil
	},
	"timeFilter": func(q *sqlutil.Query, args []string) (string, error) {
		from, err := timeBound(args, ">=", q.TimeRange.From)
		if err != nil {
			return "", err
		}
		to, err := timeBound(args, "<=", q.TimeRange.To)
		return from + " AND " + to, err
	},
	"timeFrom": func(q *sqlutil.Query, args []string) (string, error) {
		return timeBound(args, ">=", q.TimeRange.From)
	},
	"timeTo": func(q *sqlutil.Query, args []string) (string, error) {
		return timeBound(args, "<=", q.TimeRange.To)
	},
}

// timeBound writes a condition comparing the column given as the macro's argument with t.
func timeBound(args []string, op string, t time.Time) (string, error) {
	if len(args) != 1 {
		return "", fmt.Errorf("expected 1 argument, received %d", len(args))
	}
	return fmt.Sprintf("%s %s '%s'", args[0], op, t.UTC().Format(time.RFC3339Nano)), nil
}

func (d *Datasource) query(ctx context.Context, _ backend.PluginContext, query backend.DataQuery) backend.DataResponse {
	// Unmarshal the JSON into our queryModel.
	var qm queryModel

	if err := json.Unmarshal(query.JSON, &qm); err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("json unmarshal: %v", err.Error()))
	}

	switch qm.TimeField {
	case "generation_time":
	case "acquisition_time":
	default:
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("invalid time type: %s", qm.TimeField))
	}

	var querySQL string
	if qm.RawSql != nil {
		querySQL = *qm.RawSql
	} else {
		return backend.ErrDataResponse(backend.StatusBadRequest, "rawSql is required")
	}

	querySQL, err := sqlutil.Interpolate(&sqlutil.Query{RawSQL: querySQL, TimeRange: query.TimeRange, Interval: query.Interval}, macros)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusBadRequest, fmt.Sprintf("macro expansion failed: %v", err.Error()))
	}

	rows, err := d.db.QueryContext(ctx, querySQL)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("query execution failed: %v", err.Error()))
	}
	defer func() { _ = rows.Close() }()

	// A result with the builder's columns becomes one series per parameter, member and instance,
	// even when the SQL was edited in Code mode. Any other result comes back as a table.
	if columns, err := rows.Columns(); err == nil && slices.Equal(columns, builderColumns) {
		return buildResponse(qm, rows)
	}
	return tableResponse(rows)
}

func validateAggregation(aggregation string, dbValueType string) error {
	var invalid bool
	switch aggregation {
	case "avg", "sum":
		invalid = dbValueType == "STRING" || dbValueType == "ENUMERATED" || dbValueType == "BINARY" || dbValueType == "TIMESTAMP"
	case "min", "max":
		invalid = dbValueType == "BINARY"
	}
	if invalid {
		return fmt.Errorf("aggregation %q cannot be applied to %q values; use first, last, count, or raw", aggregation, dbValueType)
	}
	return nil
}

// isNumericAggregate reports whether an aggregation's result is a number even
// when the parameter's values are not: a count of any type, or the average or
// sum of a boolean, which are the fraction and number of true samples.
func isNumericAggregate(aggregation, dbValueType string) bool {
	return aggregation == "count" || (dbValueType == "BOOLEAN" && (aggregation == "avg" || aggregation == "sum"))
}

// builderColumns are the columns of the SQL that query.ts builds, in the order buildResponse scans them.
var builderColumns = []string{"time_bucket", "space_system", "name", "instance", "value_type", "member_path", "val_int", "val_float", "val_bool", "val_str", "val_bytes"}

func buildResponse(qm queryModel, rows *sql.Rows) backend.DataResponse {
	frames := make(map[string]*data.Frame)
	var skipped error

	for rows.Next() {
		var t time.Time
		var spaceSystem, parameter, instance, dbValueType string
		var member string
		var vInt, vFloat, vBool sql.NullFloat64
		var vStr sql.NullString
		var vBytes []byte
		if err := rows.Scan(&t, &spaceSystem, &parameter, &instance, &dbValueType, &member, &vInt, &vFloat, &vBool, &vStr, &vBytes); err != nil {
			return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("telemetry row scan failure: %v", err.Error()))
		}

		// A parameter whose type changed can have rows this aggregation can't
		// use, such as text under avg. We skip those and fail only when nothing
		// was usable.
		if err := validateAggregation(qm.Aggregation, dbValueType); err != nil {
			skipped = err
			continue
		}

		// A parameter whose type changed gets one frame per type.
		frameId := fmt.Sprintf("%s/%s%s/%s(%s) %s", spaceSystem, parameter, member, qm.TimeField, instance, dbValueType)
		frame, exists := frames[frameId]

		// Create new frame
		if !exists {
			frame = data.NewFrame(frameId)
			frame.Fields = append(frame.Fields, data.NewField(qm.TimeField, nil, []time.Time{}))

			valueType := dbValueType
			if isNumericAggregate(qm.Aggregation, dbValueType) {
				valueType = "DOUBLE"
			}
			var valueField *data.Field
			switch valueType {
			case "UINT32", "SINT32", "UINT64", "SINT64", "FLOAT", "DOUBLE":
				valueField = data.NewField("value", nil, []*float64{})
			case "BOOLEAN":
				valueField = data.NewField("value", nil, []*bool{})
			default:
				valueField = data.NewField("value", nil, []*string{})
			}
			valueField.Labels = map[string]string{
				"space_system": spaceSystem,
				"parameter":    parameter,
				"member":       member,
				"instance":     instance,
				"timeField":    qm.TimeField,
				"value_type":   dbValueType,
			}
			frame.Fields = append(frame.Fields, valueField)
			frames[frameId] = frame
		}

		// Append the row, or for "latest" overwrite row 0 so only the most
		// recent value survives (rows arrive ordered by time ascending).
		appendRow := func(val interface{}) {
			if qm.Aggregation == "latest" && frame.Fields[0].Len() > 0 {
				frame.Fields[0].Set(0, t)
				frame.Fields[1].Set(0, val)
			} else {
				frame.AppendRow(t, val)
			}
		}

		if isNumericAggregate(qm.Aggregation, dbValueType) {
			// query.ts puts a boolean's average or sum in val_bool, and every
			// count in val_float whatever the value type.
			n := vBool
			if qm.Aggregation == "count" {
				n = vFloat
			}
			var valPtr *float64
			if n.Valid {
				valPtr = &n.Float64
			}
			appendRow(valPtr)
			continue
		}

		// ENUMERATED and TIMESTAMP take the default case, showing the enum label or
		// the UTC text the recorder stores.
		switch dbValueType {
		case "UINT32", "SINT32", "UINT64", "SINT64":
			var valPtr *float64
			if vInt.Valid {
				valPtr = &vInt.Float64
			}
			appendRow(valPtr)
		case "FLOAT", "DOUBLE":
			var valPtr *float64
			if vFloat.Valid {
				valPtr = &vFloat.Float64
			}
			appendRow(valPtr)
		case "BOOLEAN":
			var valPtr *bool
			if vBool.Valid {
				b := vBool.Float64 > 0
				valPtr = &b
			}
			appendRow(valPtr)
		case "BINARY":
			var valPtr *string
			if vBytes != nil {
				s := hex.EncodeToString(vBytes)
				valPtr = &s
			}
			appendRow(valPtr)
		default:
			var valPtr *string
			if vStr.Valid {
				valPtr = &vStr.String
			}
			appendRow(valPtr)
		}
	}

	if err := rows.Err(); err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("telemetry row iteration error: %v", err.Error()))
	}

	if skipped != nil && len(frames) == 0 {
		return backend.ErrDataResponse(backend.StatusBadRequest, skipped.Error())
	}

	if qm.Aggregation == "deriv" {
		computeDerivatives(&frames)
	}

	// Name the instance only when the result spans more than one, and the value
	// type only when one parameter member has several types in the result.
	instanceSet := make(map[string]struct{})
	typeCount := make(map[string]int)
	for _, frame := range frames {
		for _, field := range frame.Fields {
			if field.Labels == nil {
				continue
			}
			instanceSet[field.Labels["instance"]] = struct{}{}
			typeCount[seriesKey(field.Labels)]++
		}
	}
	multiInstance := len(instanceSet) > 1

	// Return all data frames with display names
	var response backend.DataResponse
	for _, frame := range frames {
		var frameName string
		for _, field := range frame.Fields {
			if field.Labels == nil {
				continue
			}
			// Matches how YAMCS writes the name, for example /CDH/Attitude.x or /CDH/Temps[0].
			displayName := field.Labels["space_system"] + "/" + field.Labels["parameter"] + field.Labels["member"]
			if multiInstance {
				displayName += " (" + field.Labels["instance"] + ")"
			}
			if typeCount[seriesKey(field.Labels)] > 1 {
				displayName += " " + field.Labels["value_type"]
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
	if skipped != nil {
		response.Frames[0].AppendNotices(data.Notice{Severity: data.NoticeSeverityWarning, Text: skipped.Error()})
	}
	return response
}

// seriesKey identifies one parameter member in one instance, whatever its value type.
func seriesKey(labels data.Labels) string {
	return labels["space_system"] + "/" + labels["parameter"] + labels["member"] + "(" + labels["instance"] + ")"
}

func computeDerivatives(frames *map[string]*data.Frame) {
	for _, frame := range *frames {
		if len(frame.Fields) < 2 {
			continue
		}

		timeField := frame.Fields[0]
		valueField := frame.Fields[1]
		size := valueField.Len()
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

func tableResponse(rows *sql.Rows) backend.DataResponse {
	frame, err := sqlutil.FrameFromRows(rows, -1, nullFloat32Converter)
	if err != nil {
		return backend.ErrDataResponse(backend.StatusInternal, fmt.Sprintf("failed to parse rows to frame: %v", err.Error()))
	}
	frame.Name = "Raw Data"

	var response backend.DataResponse
	response.Frames = append(response.Frames, frame)
	return response
}
