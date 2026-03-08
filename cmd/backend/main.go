package main

import (
	"context"
	builtinLog "log"
	"log/slog"
	"net"
	"os"
	"os/signal"
	"sync"

	"github.com/nasa/hermes/pkg/fprime"
	hermesGrpc "github.com/nasa/hermes/pkg/grpc"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/influxdb"
	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/rpc"
	"github.com/nasa/hermes/pkg/util"

	flag "github.com/spf13/pflag"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"go.opentelemetry.io/otel"
	"google.golang.org/grpc"
	"google.golang.org/grpc/health"
	healthgrpc "google.golang.org/grpc/health/grpc_health_v1"
)

var configFile string
var verbose bool = false
var generateConfig = false
var verboseEvents = false
var verboseTelemetry = false

func init() {
	flag.StringVar(&configFile, "config", configFile, "config file to load")
	flag.StringVar(&host.Config.RootPath, "root", host.Config.RootPath, "root path to load profile configuration and dictionaries from")
	flag.StringVar(&host.Config.BindType, "bind-type", host.Config.BindType, "bind gRPC service to this address")
	flag.StringVar(&host.Config.BindAddress, "bind", host.Config.BindAddress, "bind gRPC service to this address")
	flag.BoolVar(&infra.OtelExport, "export-telemetry", infra.OtelExport, "Export logs, metrics, & traces to an OpenTelemetry gRPC Collector")
	flag.BoolVarP(&verbose, "verbose", "v", verbose, "print debug log levels")
	flag.BoolVar(&generateConfig, "generate-config", generateConfig, "generate default TOML configuration to STDOUT and exit")
	flag.BoolVarP(&host.Config.StartProfiles, "start", "s", host.Config.StartProfiles, "start all profiles on backend startup")
	flag.BoolVar(&verboseEvents, "print-events", verboseEvents, "print received events to console")
	flag.BoolVar(&verboseTelemetry, "print-telemetry", verboseTelemetry, "print received telemetry to console")
}

func main() {
	flag.Parse()

	if verbose {
		log.ConsoleLevel = slog.LevelDebug
	}

	logger := log.GetLogger(context.TODO())

	if !verbose && (verboseEvents || verboseTelemetry) {
		logger.Error("--print-event and --print-telemetry requires --verbose as well")
		os.Exit(1)
	}

	err := fprime.Init()
	if err != nil {
		logger.Error("failed to initialize fprime", "err", err)
		os.Exit(1)
	}

	err = influxdb.Init()
	if err != nil {
		logger.Error("failed to initialize influxdb", "err", err)
		os.Exit(1)
	}

	if generateConfig {
		err := host.GenerateConfiguration(os.Stdout)
		if err != nil {
			logger.Error("failed to generate configuration", "err", err)
			os.Exit(1)
		} else {
			os.Exit(0)
		}
	}

	if configFile != "" {
		f, err := os.Open(configFile)
		if err != nil {
			logger.Error("failed to open configuration file", "err", err)
			os.Exit(1)
		}

		logger.Info("loading configuration file", "path", configFile)
		err = host.LoadConfiguration(f)
		if err != nil {
			logger.Error("failed to load configuration", "err", err)
			os.Exit(1)
		}

		// Reparse the commandline arguments to apply CLI overrides
		flag.Parse()
	} else {
		err = host.DefaultConfiguration()
		if err != nil {
			logger.Error("failed to load configuration", "err", err)
			os.Exit(1)
		}
	}

	// Handle SIGINT (CTRL+C) gracefully.
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	shutdown, err := infra.SetupOTelSDK(ctx)
	if err != nil {
		builtinLog.Fatalf("failed to setup infra: %v", err)
	}

	if host.Config.EventAsOtel {
		// Pushes EVRs to OTEL under separate resource ids to distinguish them from the Hermes logs
		EventToLogRecord(ctx)
	}

	if host.Config.ChannelAsOtel {
		// Pushes EHAs to OTEL under separate resource ids to distinguish them from the Hermes telemetry
		TelemetryToMetrics(ctx)
	}

	if verboseEvents {
		host.Event.On(ctx, func(msg *pb.SourcedEvent) {
			logger.Debug(
				"event",
				"src", msg.GetSource(),
				"ctx", msg.GetContext().String(),
				"name", msg.GetEvent().GetRef().GetName(),
				"component", msg.GetEvent().GetRef().GetComponent(),
				"message", msg.GetEvent().GetMessage(),
			)
		})
	}

	if verboseTelemetry {
		host.Telemetry.On(ctx, func(msg *pb.SourcedTelemetry) {
			logger.Debug(
				"telemetry",
				"src", msg.GetSource(),
				"ctx", msg.GetContext().String(),
				"name", msg.GetTelemetry().GetRef().GetName(),
				"component", msg.GetTelemetry().GetRef().GetComponent(),
				"value", msg.GetTelemetry().GetValue(),
			)
		})
	}

	if host.Config.DownlinkAsOtel {
		// Pushes downlink events to OTEL
		DownlinkToLogRecord(ctx)
	}

	defer func() {
		if err := shutdown(context.Background()); err != nil {
			logger.Error("failed to shutdown infra", "err", err)
			os.Exit(1)
		}
	}()

	storage := host.NewStorage(host.Config.RootPath)
	err = storage.Load()
	if err != nil {
		logger.Error("failed to load state from filesystem", "err", err)
		os.Exit(2)
	}

	// Listens for state changes and flushes them to the filesystem
	storage.Listen(ctx)

	var lc net.ListenConfig
	logger.Info("starting gRPC backend server", "address", host.Config.BindAddress)
	lis, err := lc.Listen(ctx, host.Config.BindType, host.Config.BindAddress)
	if err != nil {
		logger.Error("failed to listen", "err", err)
		return
	}

	srv := grpc.NewServer(
		// Dictionaries are the only ones likely limited by this
		// 32mb is significantly larger than the entire m2020 dict
		grpc.MaxRecvMsgSize(512*1024*1024),
		grpc.MaxSendMsgSize(512*1024*1024),

		grpc.StatsHandler(otelgrpc.NewServerHandler(
			otelgrpc.WithMeterProvider(otel.GetMeterProvider()),
			otelgrpc.WithTracerProvider(otel.GetTracerProvider()),
		)),
	)

	healthcheck := health.NewServer()
	healthgrpc.RegisterHealthServer(srv, healthcheck)
	hermesGrpc.RegisterApiServer(srv, rpc.NewApiServer())
	hermesGrpc.RegisterProviderServer(srv, rpc.NewProviderServer())

	wg := sync.WaitGroup{}
	wg.Go(func() {
		<-ctx.Done()
		logger.Info("stopping gRPC server")
		srv.Stop()

		logger.Info("stopping profiles")
		host.Profiles.Stop(util.SigTermIntContext())

		storage.Finish()
	})

	servActive := make(chan struct{})
	go func() {
		defer close(servActive)
		logger.Info("gRPC server is active")
		if err := srv.Serve(lis); err != nil {
			logger.Error("failed to server grpc server", "err", err)
		}
		logger.Debug("gRPC server shutdown")
	}()

	if host.Config.StartProfiles {
		go func() {
			logger.Info("starting profiles")
			for _, id := range host.Profiles.AllProfileIds() {
				prof, err := host.Profiles.GetProfile(id)
				if err != nil {
					continue
				}

				err = prof.Start(ctx)
				if err != nil {
					logger.Warn("failed to start profile", "id", id, "name", prof.Name(), "err", err)
				}
			}
		}()
	}

	select {
	case <-ctx.Done():
	case <-servActive:
	}
}
