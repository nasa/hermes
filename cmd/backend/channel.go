package main

import (
	"context"
	"slices"
	"time"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"go.opentelemetry.io/otel/sdk/instrumentation"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/metric/metricdata"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

type telemetryExporter struct {
	logger log.Logger
	exp    metric.Exporter
	res    *resource.Resource
	cache  []metricdata.Metrics
	in     chan []metricdata.Metrics
}

func (t *telemetryExporter) eventLoop(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Second)

	for {
		select {
		case <-ctx.Done():
			ticker.Stop()
			return
		case <-ticker.C:
			c := t.cache
			t.cache = make([]metricdata.Metrics, 0)

			err := t.exp.Export(ctx, &metricdata.ResourceMetrics{
				Resource: t.res,
				ScopeMetrics: []metricdata.ScopeMetrics{{
					Scope: instrumentation.Scope{
						Name:      otelgrpc.ScopeName,
						Version:   "0.58.0",
						SchemaURL: "https://opentelemetry.io/schemas/1.17.0",
					},
					Metrics: c,
				}},
			})

			if err != nil {
				t.logger.Error("failed to export telemetry metrics", "err", err)
				break
			}

			err = t.exp.ForceFlush(ctx)
			if err != nil {
				t.logger.Error("failed to force telemetry export flush", "err", err)
			}
		case chunk := <-t.in:
			t.cache = slices.Concat(t.cache, chunk)
		}
	}
}

type telemetryHandler struct {
	realtime *telemetryExporter
	recorded *telemetryExporter
}

var fswTelemetryCache = map[string]*telemetryHandler{}

func TelemetryToMetrics(ctx context.Context) {
	logger := log.GetLogger(ctx)

	exp := infra.GetMetricExporter()
	if exp == nil {
		logger.Debug("not exporting OpenTelemetry metrics, disabling TelemetryToMetrics")
		return
	}

	host.Telemetry.On(ctx, func(tlm *pb.SourcedTelemetry) {
		src := tlm.Source
		if tlm.Source == "hermes" {
			logger.Debug("fswId is 'hermes' which overlaps with main metric resource name, using 'hermes-fsw'")
			src = "hermes-fsw"
		}

		c := fswTelemetryCache[src]
		if c == nil {
			logger.Debug("creating new metrics handler for newly registered FSW connection", "fswId", tlm.Source)
			resRt, err := resource.New(ctx,
				resource.WithAttributes(semconv.ServiceNameKey.String(src)),
				resource.WithAttributes(semconv.ServiceNamespaceKey.String("realtime")),
			)

			if err != nil {
				logger.Error("failed to create metric resource (realtime) for newly registered FSW connection", "fswId", tlm.Source, "err", err)
				return
			}

			resRec, err := resource.New(ctx,
				resource.WithAttributes(semconv.ServiceNameKey.String(src)),
				resource.WithAttributes(semconv.ServiceNamespaceKey.String("recorded")),
			)

			if err != nil {
				logger.Error("failed to create metric resource (recorded) for newly registered FSW connection", "fswId", tlm.Source, "err", err)
				return
			}

			rt := &telemetryExporter{
				logger: logger.With("stream", "realtime"),
				exp:    exp,
				res:    resRt,
				cache:  make([]metricdata.Metrics, 0),
				in:     make(chan []metricdata.Metrics, 64),
			}

			rec := &telemetryExporter{
				logger: logger.With("stream", "recorded"),
				exp:    exp,
				res:    resRec,
				cache:  make([]metricdata.Metrics, 0),
				in:     make(chan []metricdata.Metrics, 64),
			}

			go rt.eventLoop(ctx)
			go rec.eventLoop(ctx)

			c = &telemetryHandler{
				realtime: rt,
				recorded: rec,
			}
			fswTelemetryCache[src] = c
		}

		m := tlm.GetTelemetry().AsOtelMetric([]metricdata.Metrics{})
		if len(m) > 0 {
			switch tlm.GetContext() {
			case pb.SourceContext_REALTIME:
				c.realtime.in <- m
			case pb.SourceContext_RECORDED:
				c.recorded.in <- m
			default:
				panic("unexpected pb.SourceContext")
			}
		}
	})
}
