package main

import (
	"context"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

func DownlinkToLogRecord(ctx context.Context) {
	logger := log.GetLogger(ctx)

	// Create downlink event log handler
	src := "hermes-downlink"

	logger.Debug("creating new logger handler for newly registered downlink connection")

	res, err := resource.New(ctx,
		resource.WithAttributes(semconv.ServiceNameKey.String(src)),
	)

	if err != nil {
		logger.Error("failed to create logger resource for newly registered downlink connection", "err", err)
		return
	}

	prov, err := infra.NewLoggerProvider(ctx, res)

	if err != nil {
		logger.Error("failed to create logger provider for newly registered downlink connection", "err", err)
		return
	}

	handler := otelslog.NewHandler(
		"downlinks",
		otelslog.WithLoggerProvider(prov),
	)

	// Handle events emitted on the downlink bus
	host.Downlink.On(ctx, func(Downlink *pb.FileDownlink) {
		handler.Handle(context.Background(), Downlink.Record())
	})
}
