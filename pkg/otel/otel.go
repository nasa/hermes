package otel

import (
	"context"
	"fmt"
	"time"

	_ "embed"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/metric/metricdata"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

var (
	_ host.ProfileProvider[Params] = (*otelProvider)(nil)
)

//go:embed schema.json
var schema string

var uiSchema = `{"ui:order": ["endpoint", "serviceName", "events", "telemetry"]}`

type Params struct {
	Endpoint    string `json:"endpoint"`
	ServiceName string `json:"serviceName"`
	Events      *bool  `json:"events,omitempty"`
	Telemetry   *bool  `json:"telemetry,omitempty"`
}

// EventsEnabled reports whether events should be pushed. Profiles saved
// before this option existed have no key and must stay enabled.
func (p Params) EventsEnabled() bool {
	return p.Events == nil || *p.Events
}

// TelemetryEnabled reports whether telemetry should be pushed. Profiles
// saved before this option existed have no key and must stay enabled.
func (p Params) TelemetryEnabled() bool {
	return p.Telemetry == nil || *p.Telemetry
}

type otelProvider struct{}

func (o *otelProvider) Default() Params {
	return Params{
		Endpoint:    "localhost:4317",
		ServiceName: "hermes",
	}
}

func (o *otelProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	if !settings.EventsEnabled() && !settings.TelemetryEnabled() {
		return fmt.Errorf("at least one of events or telemetry must be enabled")
	}

	session.Log().Info("connecting to OTEL collector", "endpoint", settings.Endpoint)

	res, err := resource.New(ctx,
		resource.WithAttributes(semconv.ServiceNameKey.String(settings.ServiceName)),
	)
	if err != nil {
		return fmt.Errorf("failed to create OTEL resource: %w", err)
	}

	if settings.EventsEnabled() {
		session.Log().Info("exporting events to OTEL collector")

		logOpts := []otlploggrpc.Option{otlploggrpc.WithInsecure()}
		if settings.Endpoint != "" {
			logOpts = append(logOpts, otlploggrpc.WithEndpoint(settings.Endpoint))
		}

		logExporter, err := otlploggrpc.New(ctx, logOpts...)
		if err != nil {
			return fmt.Errorf("failed to create OTEL log exporter: %w", err)
		}
		defer logExporter.Shutdown(context.Background())

		logProvider := log.NewLoggerProvider(
			log.WithResource(res),
			log.WithProcessor(log.NewBatchProcessor(logExporter)),
		)
		defer logProvider.Shutdown(context.Background())

		handler := otelslog.NewHandler("hermes",
			otelslog.WithLoggerProvider(logProvider),
		)

		host.Event.On(ctx, func(msg *pb.SourcedEvent) {
			handler.Handle(context.Background(), msg.GetEvent().Record())
		})
	} else {
		session.Log().Info("event logging to OTEL collector is disabled by profile settings")
	}

	if settings.TelemetryEnabled() {
		session.Log().Info("exporting telemetry to OTEL collector")

		metricOpts := []otlpmetricgrpc.Option{otlpmetricgrpc.WithInsecure()}
		if settings.Endpoint != "" {
			metricOpts = append(metricOpts, otlpmetricgrpc.WithEndpoint(settings.Endpoint))
		}

		metricExporter, err := otlpmetricgrpc.New(ctx, metricOpts...)
		if err != nil {
			return fmt.Errorf("failed to create OTEL metric exporter: %w", err)
		}
		defer metricExporter.Shutdown(context.Background())

		cache := make(chan []metricdata.Metrics, 64)

		go func() {
			ticker := time.NewTicker(1 * time.Second)
			defer ticker.Stop()
			var buf []metricdata.Metrics
			for {
				select {
				case <-ctx.Done():
					return
				case chunk := <-cache:
					buf = append(buf, chunk...)
				case <-ticker.C:
					if len(buf) == 0 {
						continue
					}
					exportErr := metricExporter.Export(ctx, &metricdata.ResourceMetrics{
						Resource: res,
						ScopeMetrics: []metricdata.ScopeMetrics{{
							Metrics: buf,
						}},
					})
					if exportErr != nil {
						session.Log().Error("failed to export telemetry metrics", "err", exportErr)
					}
					buf = nil
				}
			}
		}()

		host.Telemetry.On(ctx, func(msg *pb.SourcedTelemetry) {
			m := msg.GetTelemetry().AsOtelMetric([]metricdata.Metrics{})
			if len(m) > 0 {
				cache <- m
			}
		})
	} else {
		session.Log().Info("telemetry logging to OTEL collector is disabled by profile settings")
	}

	session.Started()

	<-ctx.Done()
	return nil
}

func Init() error {
	_, err := host.RegisterProfileProviderWithUiSchema(
		"OpenTelemetry",
		&otelProvider{},
		schema,
		uiSchema,
	)
	return err
}
