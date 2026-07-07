package otel

import (
	"context"
	"fmt"

	_ "embed"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc"
	"go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

var (
	_ host.ProfileProvider[Params] = (*otelProvider)(nil)
)

//go:embed schema.json
var schema string

type Params struct {
	Endpoint    string `json:"endpoint"`
	ServiceName string `json:"serviceName"`
	Events      bool   `json:"events"`
	Telemetry   bool   `json:"telemetry"`
}

type otelProvider struct{}

func (o *otelProvider) Default() Params {
	return Params{
		Endpoint:    "localhost:4317",
		ServiceName: "hermes",
		Events:      true,
		Telemetry:   false,
	}
}

func (o *otelProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	session.Log().Info("connecting to OTEL collector", "endpoint", settings.Endpoint)

	exporter, err := otlploggrpc.New(ctx,
		otlploggrpc.WithEndpoint(settings.Endpoint),
		otlploggrpc.WithInsecure(),
	)
	if err != nil {
		return fmt.Errorf("failed to create OTEL exporter: %w", err)
	}
	defer exporter.Shutdown(context.Background())

	res, err := resource.New(ctx,
		resource.WithAttributes(semconv.ServiceNameKey.String(settings.ServiceName)),
	)
	if err != nil {
		return fmt.Errorf("failed to create OTEL resource: %w", err)
	}

	provider := log.NewLoggerProvider(
		log.WithResource(res),
		log.WithProcessor(log.NewBatchProcessor(exporter)),
	)
	defer provider.Shutdown(context.Background())

	handler := otelslog.NewHandler("hermes",
		otelslog.WithLoggerProvider(provider),
	)

	session.Started()

	if settings.Events {
		session.Log().Info("exporting events to OTEL collector")
		host.Event.On(ctx, func(msg *pb.SourcedEvent) {
			handler.Handle(context.Background(), msg.GetEvent().Record())
		})
	}

	if settings.Telemetry {
		session.Log().Info("exporting telemetry to OTEL collector")
		host.Telemetry.On(ctx, func(msg *pb.SourcedTelemetry) {
			handler.Handle(context.Background(), msg.GetTelemetry().Record())
		})
	}

	<-ctx.Done()
	return nil
}

func Init() error {
	_, err := host.RegisterProfileProviderWithUiSchema(
		"OpenTelemetry",
		&otelProvider{},
		schema,
		`{"ui:order": ["endpoint", "serviceName", "events", "telemetry"]}`,
	)
	return err
}
