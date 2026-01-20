package stream

import (
	"bufio"
	"context"
	"errors"
	"io"

	"github.com/nasa/hermes/pkg/infra"
	"go.opentelemetry.io/otel/metric"
)

var metricWriteTotal, _ = infra.Meter.Int64Counter(
	"hermes.protocol.write",
	metric.WithDescription("Total bytes written through protocol"),
	metric.WithUnit("By"),
)

var metricReadTotal, _ = infra.Meter.Int64Counter(
	"hermes.protocol.read",
	metric.WithDescription("Total bytes read through protocol"),
	metric.WithUnit("By"),
)

var metricWriteErrs, _ = infra.Meter.Int64Counter(
	"hermes.protocol.writeErrors",
	metric.WithDescription("Total number of write errors on protocol"),
)

var metricReadErrs, _ = infra.Meter.Int64Counter(
	"hermes.protocol.readErrors",
	metric.WithDescription("Total number of read errors on protocol"),
)

var (
	_ io.Reader = (*instrumentedReader)(nil)
	_ io.Writer = (*instrumentedWriter)(nil)
)

type instrumentedReader struct {
	attr metric.MeasurementOption
	r    io.Reader
}

type instrumentedWriter struct {
	attr metric.MeasurementOption
	w    io.Writer
}

// Read implements io.Reader.
func (i *instrumentedReader) Read(p []byte) (n int, err error) {
	n, err = i.r.Read(p)
	if err != nil {
		// Check if this is actually an error
		if errors.Is(err, io.EOF) || errors.Is(err, bufio.ErrBufferFull) {
			// These errors are not actually errors, don't count them
		} else {
			metricReadErrs.Add(context.Background(), 1, i.attr)
			// TODO(tumbar) Do we need to log the error?
		}
	}

	if n > 0 {
		metricReadTotal.Add(context.Background(), int64(n), i.attr)
	}

	return n, err
}

// Write implements io.Writer.
func (i *instrumentedWriter) Write(p []byte) (n int, err error) {
	n, err = i.w.Write(p)
	if err != nil {
		metricWriteErrs.Add(context.Background(), 1, i.attr)
		// TODO(tumbar) Do we need to log the error?
	}

	if n > 0 {
		metricWriteTotal.Add(context.Background(), int64(n), i.attr)
	}

	return n, err
}

type instrumentedReadWriter struct {
	instrumentedReader
	instrumentedWriter
}

func NewInstrumentedReader(r io.Reader, attr metric.MeasurementOption) io.Reader {
	return &instrumentedReader{
		attr: attr,
		r:    r,
	}
}

func NewInstrumentedWriter(w io.Writer, attr metric.MeasurementOption) io.Writer {
	return &instrumentedWriter{
		attr: attr,
		w:    w,
	}
}

func NewInstrumentedReadWriter(rw io.ReadWriter, attr metric.MeasurementOption) io.ReadWriter {
	return &instrumentedReadWriter{
		instrumentedReader: instrumentedReader{
			r:    rw,
			attr: attr,
		},
		instrumentedWriter: instrumentedWriter{
			w:    rw,
			attr: attr,
		},
	}
}
