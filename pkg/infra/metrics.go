package infra

import (
	"context"
	"io"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
)

var metricBytes, _ = Meter.Int64Counter(
	"hermes.bytes",
	metric.WithDescription("Number of bytes that have moved through this point"),
)

var metricPacketSize, _ = Meter.Int64Gauge(
	"hermes.read_size",
	metric.WithDescription("Size of read from a monitored reader"),
)

var metricPackets, _ = Meter.Int64Counter(
	"hermes.packets",
	metric.WithDescription("Number of packets that have moved through this point"),
)

type MonitorKind uint8

const (
	DOWNLINK MonitorKind = iota
	UPLINK
)

func (k MonitorKind) String() string {
	switch k {
	case DOWNLINK:
		return "downlink"
	case UPLINK:
		return "uplink"
	default:
		return "unknown"
	}
}

func ProtocolMonitor(kind MonitorKind, name string, pkt []byte) {
	metricBytes.Add(
		context.Background(),
		int64(len(pkt)),
		metric.WithAttributes(
			attribute.String("name", name),
			attribute.String("kind", kind.String()),
		),
	)

	metricPackets.Add(
		context.Background(),
		1,
		metric.WithAttributes(
			attribute.String("name", name),
			attribute.String("kind", kind.String()),
		),
	)
}

type monitoredReadWriter struct {
	io.ReadWriteCloser

	name      string
	readAttr  metric.MeasurementOption
	writeAttr metric.MeasurementOption
}

func (m *monitoredReadWriter) Read(p []byte) (n int, err error) {
	n, err = m.ReadWriteCloser.Read(p)

	if n > 0 {
		metricBytes.Add(
			context.Background(),
			int64(n),
			m.readAttr,
		)

		metricPacketSize.Record(
			context.Background(),
			int64(n),
			m.readAttr,
		)

		metricPackets.Add(
			context.Background(),
			1,
			m.readAttr,
		)

		metricPacketSize.Record(
			context.Background(),
			int64(n),
			m.readAttr,
		)
	}

	return
}

func (m *monitoredReadWriter) Write(p []byte) (n int, err error) {
	n, err = m.ReadWriteCloser.Write(p)

	if n > 0 {
		metricBytes.Add(
			context.Background(),
			int64(n),
			m.writeAttr,
		)

		metricPackets.Add(
			context.Background(),
			1,
			m.writeAttr,
		)
	}

	return
}
func MonitoredReadWriter(
	conn io.ReadWriteCloser,
	name string,
	attributes ...attribute.KeyValue,
) io.ReadWriteCloser {
	readAttr := []attribute.KeyValue{
		attribute.String("name", name),
		attribute.String("type", "read"),
	}

	readAttr = append(readAttr, attributes...)

	writeAttr := []attribute.KeyValue{
		attribute.String("name", name),
		attribute.String("type", "write"),
	}

	writeAttr = append(writeAttr, attributes...)

	return &monitoredReadWriter{
		ReadWriteCloser: conn,
		name:            name,
		readAttr:        metric.WithAttributes(readAttr...),
		writeAttr:       metric.WithAttributes(writeAttr...),
	}
}
