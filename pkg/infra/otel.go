package infra

import (
	"context"
	"errors"
	"fmt"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/log/global"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

var (
	logExporter    *otlploggrpc.Exporter
	metricExporter metric.Exporter
	traceExporter  trace.SpanExporter
	OtelExport     bool
)

// setupOTelSDK bootstraps the OpenTelemetry pipeline.
// If it does not return an error, make sure to call shutdown for proper cleanup.
func SetupOTelSDK(ctx context.Context) (shutdown func(context.Context) error, err error) {
	var shutdownFuncs []func(context.Context) error

	// shutdown calls cleanup functions registered via shutdownFuncs.
	// The errors from the calls are joined.
	// Each registered cleanup will be invoked once.
	shutdown = func(ctx context.Context) error {
		var err error
		for _, fn := range shutdownFuncs {
			err = errors.Join(err, fn(ctx))
		}
		shutdownFuncs = nil
		return err
	}

	// handleErr calls shutdown for cleanup and makes sure that all errors are returned.
	handleErr := func(inErr error) {
		err = errors.Join(inErr, shutdown(ctx))
	}

	res, err := resource.New(ctx,
		resource.WithAttributes(semconv.ServiceNameKey.String("hermes")),
	)

	if err != nil {
		handleErr(err)
		return
	}

	// Set up propagator.
	prop := newPropagator()
	otel.SetTextMapPropagator(prop)

	// Set up trace provider.
	tracerProvider, err := NewTraceProvider(ctx, res)
	if err != nil {
		handleErr(err)
		return
	}
	shutdownFuncs = append(shutdownFuncs, tracerProvider.Shutdown)
	otel.SetTracerProvider(tracerProvider)

	// Set up meter provider.
	meterProvider, err := NewMeterProvider(ctx, res)
	if err != nil {
		handleErr(err)
		return
	}
	shutdownFuncs = append(shutdownFuncs, meterProvider.Shutdown)
	otel.SetMeterProvider(meterProvider)

	// Set up logger provider.
	loggerProvider, err := NewLoggerProvider(ctx, res)
	if err != nil {
		handleErr(err)
		return
	}
	shutdownFuncs = append(shutdownFuncs, loggerProvider.Shutdown)
	global.SetLoggerProvider(loggerProvider)

	return
}

func newPropagator() propagation.TextMapPropagator {
	return propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	)
}

func NewTraceProvider(ctx context.Context, res *resource.Resource) (prov *trace.TracerProvider, err error) {
	if !OtelExport {
		// Don't export metrics if grpc exporter is not enabled
		return trace.NewTracerProvider(), nil
	}

	if traceExporter == nil {
		traceExporter, err = otlptracegrpc.New(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to create the trace exporter: %w", err)
		}
	}

	traceProvider := trace.NewTracerProvider(
		trace.WithResource(res),
		trace.WithBatcher(traceExporter),
	)
	return traceProvider, nil
}

func GetMetricExporter() metric.Exporter {
	return metricExporter
}

func NewMeterProvider(ctx context.Context, res *resource.Resource) (prov *metric.MeterProvider, err error) {
	if !OtelExport {
		// Don't export metrics if grpc exporter is not enabled
		return metric.NewMeterProvider(), nil
	}

	if metricExporter == nil {
		metricExporter, err = otlpmetricgrpc.New(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to create the metric exporter: %w", err)
		}
	}

	return metric.NewMeterProvider(
		metric.WithResource(res),
		metric.WithReader(
			metric.NewPeriodicReader(
				metricExporter,
				// High rate metric flush
				metric.WithInterval(1*time.Second),
			),
		),
	), nil
}

func NewLoggerProvider(ctx context.Context, res *resource.Resource) (provider *log.LoggerProvider, err error) {
	if !OtelExport {
		// Don't export metrics if grpc exporter is not enabled
		return log.NewLoggerProvider(log.WithResource(res)), nil
	}

	if logExporter == nil {
		logExporter, err = otlploggrpc.New(ctx)

		if err != nil {
			return nil, fmt.Errorf("failed to create grpc log exporter: %w", err)
		}
	}

	return log.NewLoggerProvider(
		log.WithResource(res),
		// FIXME(tumbar) Should we be batching?
		log.WithProcessor(log.NewBatchProcessor(logExporter)),
	), nil
}
