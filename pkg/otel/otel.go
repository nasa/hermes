package otel

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
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

// Each source holds a provider goroutine, and source is client-supplied.
const maxLogSources = 256

// serviceName labels a record with its source, or the profile's name if it has none.
func serviceName(source, fallback string) string {
	switch {
	case source != "":
		return source
	case fallback != "":
		return fallback
	default:
		return "hermes"
	}
}

func newResource(ctx context.Context, name string) (*resource.Resource, error) {
	res, err := resource.New(ctx,
		resource.WithAttributes(semconv.ServiceNameKey.String(name)),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create OTEL resource for source %q: %w", name, err)
	}

	return res, nil
}

type sharedLogExporter struct {
	log.Exporter
}

func (sharedLogExporter) Shutdown(context.Context) error { return nil }

type logTarget struct {
	provider *log.LoggerProvider
	handler  slog.Handler
}

type logRouter struct {
	mu       sync.Mutex
	fallback string
	exporter log.Exporter
	targets  map[string]*logTarget
	dropped  map[string]struct{} // sources refused once the cap was reached
}

func newLogRouter(fallback string, exporter log.Exporter) *logRouter {
	return &logRouter{
		fallback: fallback,
		exporter: sharedLogExporter{exporter},
		targets:  map[string]*logTarget{},
		dropped:  map[string]struct{}{},
	}
}

// errSourceLimit is returned once per refused source, not once per record.
type errSourceLimit struct {
	name  string
	limit int
}

func (e errSourceLimit) Error() string {
	return fmt.Sprintf("refusing to export source %q: profile is already exporting %d sources", e.name, e.limit)
}

func (r *logRouter) target(ctx context.Context, source string) (*logTarget, error) {
	name := serviceName(source, r.fallback)

	r.mu.Lock()
	defer r.mu.Unlock()

	if target, ok := r.targets[name]; ok {
		return target, nil
	}

	// Refuse the newcomer rather than evicting a source that is still exporting.
	if len(r.targets) >= maxLogSources {
		if _, seen := r.dropped[name]; seen {
			return nil, nil
		}

		r.dropped[name] = struct{}{}
		return nil, errSourceLimit{name: name, limit: maxLogSources}
	}

	res, err := newResource(ctx, name)
	if err != nil {
		return nil, err
	}

	provider := log.NewLoggerProvider(
		log.WithResource(res),
		log.WithProcessor(log.NewBatchProcessor(r.exporter)),
	)

	target := &logTarget{
		provider: provider,
		handler: otelslog.NewHandler("hermes",
			otelslog.WithLoggerProvider(provider),
		),
	}

	r.targets[name] = target
	return target, nil
}

func (r *logRouter) handle(ctx context.Context, source string, rec slog.Record) error {
	target, err := r.target(ctx, source)
	if err != nil || target == nil {
		return err
	}

	return target.handler.Handle(ctx, rec)
}

func (r *logRouter) shutdown(ctx context.Context) {
	r.mu.Lock()
	targets := r.targets
	r.targets = map[string]*logTarget{}
	r.mu.Unlock()

	for _, target := range targets {
		_ = target.provider.Shutdown(ctx)
	}
}

type metricChunk struct {
	source  string
	metrics []metricdata.Metrics
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

		router := newLogRouter(settings.ServiceName, logExporter)
		defer router.shutdown(context.Background())

		host.Event.On(ctx, func(msg *pb.SourcedEvent) {
			err := router.handle(context.Background(), msg.GetSource(), msg.GetEvent().Record())
			if err != nil {
				session.Log().Error("failed to export event", "source", msg.GetSource(), "err", err)
			}
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

		cache := make(chan metricChunk, 64)

		go func() {
			ticker := time.NewTicker(1 * time.Second)
			defer ticker.Stop()
			buf := map[string][]metricdata.Metrics{}
			for {
				select {
				case <-ctx.Done():
					return
				case chunk := <-cache:
					buf[chunk.source] = append(buf[chunk.source], chunk.metrics...)
				case <-ticker.C:
					if len(buf) == 0 {
						continue
					}
					for source, metrics := range buf {
						res, resErr := newResource(ctx, serviceName(source, settings.ServiceName))
						if resErr != nil {
							session.Log().Error("failed to resolve telemetry resource", "source", source, "err", resErr)
							continue
						}

						exportErr := metricExporter.Export(ctx, &metricdata.ResourceMetrics{
							Resource: res,
							ScopeMetrics: []metricdata.ScopeMetrics{{
								Metrics: metrics,
							}},
						})
						if exportErr != nil {
							session.Log().Error("failed to export telemetry metrics", "source", source, "err", exportErr)
						}
					}
					buf = map[string][]metricdata.Metrics{}
				}
			}
		}()

		host.Telemetry.On(ctx, func(msg *pb.SourcedTelemetry) {
			m := msg.GetTelemetry().AsOtelMetric([]metricdata.Metrics{})
			if len(m) > 0 {
				cache <- metricChunk{source: msg.GetSource(), metrics: m}
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
