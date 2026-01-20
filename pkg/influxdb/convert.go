package influxdb

import (
	"encoding/base64"
	"encoding/json"
	"fmt"

	lineProtocol "github.com/influxdata/line-protocol"
	"github.com/nasa/hermes/pkg/pb"
)

func evrSeverityToGrafana(sev pb.EvrSeverity) string {
	switch sev {
	case pb.EvrSeverity_EVR_DIAGNOSTIC:
		return "debug"
	case pb.EvrSeverity_EVR_ACTIVITY_LOW, pb.EvrSeverity_EVR_ACTIVITY_HIGH:
		return "info"
	case pb.EvrSeverity_EVR_WARNING_LOW:
		return "warning"
	case pb.EvrSeverity_EVR_WARNING_HIGH:
		return "error"
	case pb.EvrSeverity_EVR_COMMAND:
		return "trace"
	case pb.EvrSeverity_EVR_FATAL:
		return "fatal"
	}

	return "info"
}

func evrSeverityToString(sev pb.EvrSeverity) string {
	switch sev {
	case pb.EvrSeverity_EVR_DIAGNOSTIC:
		return "DIAGNOSTIC"
	case pb.EvrSeverity_EVR_ACTIVITY_LOW:
		return "ACTIVITY_LO"
	case pb.EvrSeverity_EVR_ACTIVITY_HIGH:
		return "ACTIVITY_HI"
	case pb.EvrSeverity_EVR_WARNING_LOW:
		return "WARNING_LO"
	case pb.EvrSeverity_EVR_WARNING_HIGH:
		return "WARNING_HI"
	case pb.EvrSeverity_EVR_COMMAND:
		return "COMMAND"
	case pb.EvrSeverity_EVR_FATAL:
		return "FATAL"
	}

	return "DIAGNOSTIC"
}

// AsMetric implements InfluxDBMetric.
func EventAsMetric(x *pb.Event) (lineProtocol.MutableMetric, error) {
	args := make([]any, 0)
	for i, arg := range x.Args {
		argAny, err := pb.ValueToAny(arg, pb.ConversionOptions{})
		if err != nil {
			return nil, fmt.Errorf("failed to process argument [%d]: %w", i, err)
		}

		args = append(args, argAny)
	}

	encodedArgs, err := json.Marshal(args)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal arguments: %w", err)
	}

	line, err := lineProtocol.New("evr", map[string]string{
		"component": x.Ref.Component,
		"name":      x.Ref.Name,
		"level":     evrSeverityToGrafana(x.Ref.Severity),
		"severity":  evrSeverityToString(x.Ref.Severity),
	}, map[string]any{
		"message": x.Message,
		"args":    string(encodedArgs),
	}, x.Time.AsTime())

	if x.Time.HasSclk() {
		line.AddField("sclk", x.Time.Sclk)
	}

	if err != nil {
		return nil, err
	}

	return line, nil
}

func SourcedEventAsMetric(x *pb.SourcedEvent) (lineProtocol.MutableMetric, error) {
	metric, err := EventAsMetric(x.Event)
	if err != nil {
		return nil, err
	}

	var stream string
	switch x.GetContext() {
	case pb.SourceContext_REALTIME:
		stream = "realtime"
	case pb.SourceContext_RECORDED:
		stream = "recorded"
	default:
		panic("unexpected pb.SourceContext")
	}

	metric.AddTag("source", x.Source)
	metric.AddTag("stream", stream)
	return metric, nil
}

func typedArrayName(kind pb.NumberKind) string {
	switch kind {
	case pb.NumberKind_NUMBER_U8:
		return "Uint8Array"
	case pb.NumberKind_NUMBER_I8:
		return "Int8Array"
	case pb.NumberKind_NUMBER_U16:
		return "Uint16Array"
	case pb.NumberKind_NUMBER_I16:
		return "Int16Array"
	case pb.NumberKind_NUMBER_U32:
		return "Uint32Array"
	case pb.NumberKind_NUMBER_I32:
		return "Int32Array"
	case pb.NumberKind_NUMBER_U64:
		return "BigUint64Array"
	case pb.NumberKind_NUMBER_I64:
		return "BigInt64Array"
	case pb.NumberKind_NUMBER_F32:
		return "Float32Array"
	case pb.NumberKind_NUMBER_F64:
		return "Float64Array"
	}

	return "Uint8Array"
}

func attachFieldsTyped(
	line lineProtocol.MutableMetric,
	value *pb.Value,
	path string,
) {
	if value == nil {
		return
	}

	switch ty := value.Value.(type) {
	case *pb.Value_I:
		line.AddField(path, ty.I)
	case *pb.Value_U:
		line.AddField(path, ty.U)
	case *pb.Value_F:
		line.AddField(path, ty.F)
	case *pb.Value_B:
		line.AddField(path, ty.B)
	case *pb.Value_S:
		line.AddField(path, ty.S)
	case *pb.Value_E:
		line.AddField(path, ty.E.Raw)
		if ty.E.GetFormatted() != "" {
			line.AddField(fmt.Sprintf("format.%s", path), ty.E.GetFormatted())
		}
	case *pb.Value_O:
		if o := ty.O.GetO(); o != nil {
			for k, v := range o {
				attachFieldsTyped(line, v, fmt.Sprintf("%s.%s", path, k))
			}
		}
	case *pb.Value_A:
		if a := ty.A.GetValue(); a != nil {
			for i, v := range a {
				attachFieldsTyped(line, v, fmt.Sprintf("%s[%d]", path, i))
			}
		}
	case *pb.Value_R:
		line.AddField(fmt.Sprintf("type:%s", path), typedArrayName(ty.R.Kind))
		line.AddField(fmt.Sprintf("bigEndian:%s", path), ty.R.BigEndian)

		b64Encoded := make([]byte, base64.StdEncoding.EncodedLen(len(ty.R.Value)))
		base64.StdEncoding.Encode(b64Encoded, ty.R.Value)
		line.AddField(path, b64Encoded)
	}
}

// AsMetric implements InfluxDBMetric.
func TelemetryAsMetric(x *pb.Telemetry) (lineProtocol.MutableMetric, error) {
	line, err := lineProtocol.New(fmt.Sprintf("%s.%s", x.Ref.Component, x.Ref.Name), map[string]string{
		"component": x.Ref.Component,
		"name":      x.Ref.Name,
	}, map[string]any{}, x.Time.AsTime())

	if err != nil {
		return nil, err
	}

	attachFieldsTyped(line, x.GetValue(), "value")

	if x.Time.HasSclk() {
		line.AddField("sclk", x.Time.Sclk)
	}

	return line, nil
}

func SourcedTelemetryAsMetric(x *pb.SourcedTelemetry) (lineProtocol.MutableMetric, error) {
	metric, err := TelemetryAsMetric(x.Telemetry)
	if err != nil {
		return nil, err
	}

	var stream string
	switch x.GetContext() {
	case pb.SourceContext_REALTIME:
		stream = "realtime"
	case pb.SourceContext_RECORDED:
		stream = "recorded"
	default:
		panic("unexpected pb.SourceContext")
	}

	metric.AddTag("source", x.Source)
	metric.AddTag("stream", stream)

	for name, val := range x.GetTelemetry().GetLabels() {
		metric.AddTag(name, val)
	}

	return metric, nil
}
