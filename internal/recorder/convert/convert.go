// Package convert turns YAMCS parameter subscription messages into recorder
// store rows, and YAMCS events into OpenTelemetry log records.
package convert

import (
	"database/sql"
	"log/slog"
	"strconv"
	"strings"

	"github.com/nasa/hermes/internal/recorder/store"
	"github.com/nasa/hermes/internal/yamcspb/protobuf"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/processing"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/pvalue"
)

// splitName splits a qualified name such as "/A/B/Param" into its space system
// "/A/B" and name "Param". A parameter at the root, "/Param", is in "/".
func splitName(qualified string) (spaceSystem, name string, ok bool) {
	i := strings.LastIndexByte(qualified, '/')
	if !strings.HasPrefix(qualified, "/") || i == len(qualified)-1 {
		return "", "", false
	}
	if i == 0 {
		return "/", qualified[1:], true
	}
	return qualified[:i], qualified[i+1:], true
}

// Converter converts the messages of one SubscribeParameters stream. Values
// carry only a numericId; YAMCS sends the id-to-name mapping in earlier (or the
// same) messages of that stream, so use a new Converter per stream.
type Converter struct {
	instance   string
	logger     *slog.Logger
	params     map[uint32]store.Parameter
	incomplete int // in the current Rows call
}

func New(instance string, logger *slog.Logger) *Converter {
	return &Converter{instance: instance, logger: logger, params: make(map[uint32]store.Parameter)}
}

// Rows remembers any id-to-name mapping that data carries, then flattens each
// of its values into one row per leaf. We record the calibrated engValue
// (engineering value), not the uncalibrated rawValue. unmapped counts values
// dropped because their numericId has no mapping, and incomplete counts values
// and leaves dropped because they have no generation time or no value.
func (c *Converter) Rows(data *processing.SubscribeParametersData) (rows []store.Row, unmapped, incomplete int) {
	c.incomplete = 0
	for id, named := range data.GetMapping() {
		spaceSystem, name, ok := splitName(named.GetName())
		if !ok {
			c.logger.Warn("skipping parameter with unexpected name", "name", named.GetName())
			continue
		}
		c.params[id] = store.Parameter{Instance: c.instance, SpaceSystem: spaceSystem, Name: name}
	}

	for _, pv := range data.GetValues() {
		p, ok := c.params[pv.GetNumericId()]
		if !ok {
			c.logger.Debug("skipping value with unmapped numericId", "numericId", pv.GetNumericId())
			unmapped++
			continue
		}
		rows = c.appendValue(rows, p, pv)
	}
	return rows, unmapped, c.incomplete
}

func (c *Converter) appendValue(rows []store.Row, p store.Parameter, pv *pvalue.ParameterValue) []store.Row {
	if pv.GenerationTime == nil {
		c.logger.Debug("skipping value without generationTime", "parameter", p.Name)
		c.incomplete++
		return rows
	}
	row := store.Row{Parameter: p, GenerationTime: pv.GetGenerationTime().AsTime()}
	if pv.AcquisitionTime != nil {
		row.AcquisitionTime = sql.NullTime{Time: pv.GetAcquisitionTime().AsTime(), Valid: true}
	}
	return c.appendLeaves(rows, row, pv.GetEngValue())
}

// appendLeaves appends one row per scalar in v, extending row.MemberPath with
// ".name" for aggregate members and "[i]" for array elements.
func (c *Converter) appendLeaves(rows []store.Row, row store.Row, v *protobuf.Value) []store.Row {
	if v == nil || v.Type == nil {
		c.logger.Debug("skipping leaf without a value", "parameter", row.Parameter.Name, "member", row.MemberPath)
		c.incomplete++
		return rows
	}
	switch v.GetType() {
	case protobuf.Value_AGGREGATE:
		// name[i] is the name of value[i]. YAMCS leaves members without a value
		// out of both lists, so names past the end of values mean a malformed
		// message, and we count them as incomplete.
		names, values := v.GetAggregateValue().GetName(), v.GetAggregateValue().GetValue()
		for i, name := range names {
			if i >= len(values) {
				c.logger.Debug("skipping aggregate members without values", "parameter", row.Parameter.Name,
					"member", row.MemberPath, "count", len(names)-i)
				c.incomplete += len(names) - i
				break
			}
			member := row
			member.MemberPath = row.MemberPath + "." + name
			rows = c.appendLeaves(rows, member, values[i])
		}
	case protobuf.Value_ARRAY:
		for i, e := range v.GetArrayValue() {
			elem := row
			elem.MemberPath = row.MemberPath + "[" + strconv.Itoa(i) + "]"
			rows = c.appendLeaves(rows, elem, e)
		}
	default:
		value, ok := scalar(v)
		if !ok {
			c.logger.Debug("skipping leaf", "parameter", row.Parameter.Name, "member", row.MemberPath, "type", v.GetType())
			c.incomplete++
			return rows
		}
		row.Value = value
		rows = append(rows, row)
	}
	return rows
}

// scalar maps a YAMCS scalar to a store value. It reports false for NONE and
// for a scalar whose value field is missing.
func scalar(v *protobuf.Value) (store.Value, bool) {
	switch v.GetType() {
	case protobuf.Value_FLOAT:
		return store.FloatValue(v.GetFloatValue()), v.FloatValue != nil
	case protobuf.Value_DOUBLE:
		return store.DoubleValue(v.GetDoubleValue()), v.DoubleValue != nil
	case protobuf.Value_UINT32:
		return store.Uint32Value(v.GetUint32Value()), v.Uint32Value != nil
	case protobuf.Value_SINT32:
		return store.Sint32Value(v.GetSint32Value()), v.Sint32Value != nil
	case protobuf.Value_UINT64:
		return store.Uint64Value(v.GetUint64Value()), v.Uint64Value != nil
	case protobuf.Value_SINT64:
		return store.Sint64Value(v.GetSint64Value()), v.Sint64Value != nil
	case protobuf.Value_BOOLEAN:
		return store.BooleanValue(v.GetBooleanValue()), v.BooleanValue != nil
	case protobuf.Value_STRING:
		return store.StringValue(v.GetStringValue()), v.StringValue != nil
	case protobuf.Value_BINARY:
		return store.BinaryValue(v.GetBinaryValue()), v.BinaryValue != nil
	case protobuf.Value_ENUMERATED:
		return store.EnumeratedValue(v.GetSint64Value(), v.GetStringValue()), v.Sint64Value != nil
	case protobuf.Value_TIMESTAMP:
		// YAMCS's timestampValue counts leap seconds, so it is not Unix time.
		// Keep its UTC text as sent instead.
		return store.TimestampValue(v.GetStringValue()), v.StringValue != nil
	}
	return store.Value{}, false
}
