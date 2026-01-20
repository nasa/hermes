package pb

import (
	"fmt"
	"time"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/sdk/metric/metricdata"
)

type OtelMetric interface {
	// Convert this object to an InfluxDB line protocol metric
	AsOtelMetric(in []metricdata.Metrics) []metricdata.Metrics
}

var (
	_ OtelMetric = (*Telemetry)(nil)

	// Use ERT instead of SCLK time to log otel metrics
	UseErt = false
)

func (t *Time) AsTime() time.Time {
	if UseErt {
		return time.Now()
	} else {
		unx := t.GetUnix()
		if unx == nil {
			return time.Now()
		} else {
			return unx.AsTime()
		}
	}
}

func (x *Telemetry) otelPoints(points []metricdata.DataPoint[float64], path string, value *Value, attr attribute.Set) []metricdata.DataPoint[float64] {
	if path != "" {
		attr = attribute.NewSet(
			append(attr.ToSlice(), attribute.String("path", path))...,
		)
	}

	switch ty := value.Value.(type) {
	case *Value_I:
		return append(points, metricdata.DataPoint[float64]{
			Attributes: attr,
			Time:       x.Time.AsTime(),
			Value:      float64(ty.I),
		})
	case *Value_U:
		return append(points, metricdata.DataPoint[float64]{
			Attributes: attr,
			Time:       x.Time.AsTime(),
			Value:      float64(ty.U),
		})
	case *Value_F:
		return append(points, metricdata.DataPoint[float64]{
			Attributes: attr,
			Time:       x.Time.AsTime(),
			Value:      float64(ty.F),
		})
	case *Value_B:
		var v float64
		if ty.B {
			v = 1
		} else {
			v = 0
		}

		return append(points, metricdata.DataPoint[float64]{
			Attributes: attr,
			Time:       x.Time.AsTime(),
			Value:      v,
		})
	case *Value_E:
		return append(points, metricdata.DataPoint[float64]{
			Attributes: attr,
			Time:       x.Time.AsTime(),
			Value:      float64(ty.E.Raw),
		})
	case *Value_O:
		if o := ty.O.GetO(); o != nil {
			var prefix = path
			if prefix != "" {
				prefix = prefix + "_"
			}

			for k, v := range o {
				points = x.otelPoints(points, fmt.Sprintf("%s%s", prefix, k), v, attr)
			}
		}

		return points
	case *Value_A:
		if a := ty.A.GetValue(); a != nil {
			for i, v := range a {
				points = x.otelPoints(points, fmt.Sprintf("%s[%d]", path, i), v, attr)
			}
		}

		return points
	}

	return points
}

// AsMetric implements InfluxDBMetric.
func (x *Telemetry) AsOtelMetric(mets []metricdata.Metrics) []metricdata.Metrics {
	attrs := []attribute.KeyValue{}
	for key, value := range x.Labels {
		attrs = append(attrs, attribute.String(key, value))
	}

	pts := x.otelPoints(make([]metricdata.DataPoint[float64], 0), "", x.Value, attribute.NewSet(attrs...))
	if len(pts) == 0 {
		return mets
	}

	return append(mets, metricdata.Metrics{
		Name: fmt.Sprintf("%s_%s", x.GetRef().GetComponent(), x.GetRef().GetName()),
		Data: metricdata.Gauge[float64]{
			DataPoints: pts,
		},
	})
}
