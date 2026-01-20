package main

import (
	"context"
	"fmt"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

type loghandler struct {
	realtime *otelslog.Handler
	recorded *otelslog.Handler
}

var fswLogHandlers = map[string]*loghandler{}

func EventToLogRecord(ctx context.Context) {
	logger := log.GetLogger(ctx)
	host.Event.On(ctx, func(event *pb.SourcedEvent) {
		src := event.Source
		if event.Source == "hermes" {
			logger.Debug("fswId is 'hermes' which overlaps with main logger resource name, using 'hermes-fsw'")
			src = "hermes-fsw"
		}

		handler := fswLogHandlers[src]
		if handler == nil {
			logger.Debug("creating new logger handler for newly registered FSW connection", "fswId", event.Source)

			resRt, err := resource.New(ctx,
				resource.WithAttributes(semconv.ServiceNameKey.String(src)),
				resource.WithAttributes(semconv.ServiceNamespaceKey.String("realtime")),
			)

			if err != nil {
				logger.Error("failed to create rt event logger resource for newly registered FSW connection", "fswId", event.Source, "err", err)
				return
			}

			resDp, err := resource.New(ctx,
				resource.WithAttributes(semconv.ServiceNameKey.String(src)),
				resource.WithAttributes(semconv.ServiceNamespaceKey.String("recorded")),
			)

			if err != nil {
				logger.Error("failed to create dp event logger resource for newly registered FSW connection", "fswId", event.Source, "err", err)
				return
			}

			provRt, err := infra.NewLoggerProvider(ctx, resRt)

			if err != nil {
				logger.Error("failed to create rt event logger provider for newly registered FSW connection", "fswId", event.Source, "err", err)
				return
			}

			provDp, err := infra.NewLoggerProvider(ctx, resDp)

			if err != nil {
				logger.Error("failed to create dp event logger provider for newly registered FSW connection", "fswId", event.Source, "err", err)
				return
			}

			handler = &loghandler{
				realtime: otelslog.NewHandler(
					"events",
					otelslog.WithLoggerProvider(provRt),
				),
				recorded: otelslog.NewHandler(
					"events",
					otelslog.WithLoggerProvider(provDp),
				),
			}

			fswLogHandlers[src] = handler
		}

		switch event.Context {
		case pb.SourceContext_REALTIME:
			handler.realtime.Handle(context.Background(), event.GetEvent().Record())
		case pb.SourceContext_RECORDED:
			handler.recorded.Handle(context.Background(), event.GetEvent().Record())
		default:
			panic(fmt.Sprintf("unexpected pb.SourceContext: %#v", event.Context))
		}
	})
}
