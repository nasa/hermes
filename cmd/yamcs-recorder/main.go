// Command yamcs-recorder records the TELEMETERED parameters of a YAMCS
// instance into TimescaleDB, by default leaving out the packet header fields
// fprime-yamcs defines. Given --otlp, it also exports the instance's events as
// OpenTelemetry log records to a collector. It exits non-zero when its
// parameter or event subscription ends, so run it under a supervisor that
// restarts it. Events raised while it is not running are not exported.
package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/url"
	"os"
	"os/signal"
	"slices"
	"strconv"
	"strings"
	"sync/atomic"
	"syscall"
	"time"

	"github.com/lib/pq"
	flag "github.com/spf13/pflag"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc"
	otellog "go.opentelemetry.io/otel/log"
	sdklog "go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
	"google.golang.org/grpc"
	"google.golang.org/grpc/backoff"

	"github.com/nasa/hermes/internal/recorder/convert"
	"github.com/nasa/hermes/internal/recorder/store"
	"github.com/nasa/hermes/internal/recorder/yamcs"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/processing"
)

const statsInterval = 30 * time.Second

type config struct {
	yamcs           string
	instance        string
	processor       string
	postgresql      string
	otlp            string
	includeTopLevel bool
}

func main() {
	var cfg config
	flag.StringVar(&cfg.yamcs, "yamcs", "localhost:8091", "host:port of the yamcs-grpc plugin")
	flag.StringVar(&cfg.instance, "instance", "fprime-project", "YAMCS instance to record")
	flag.StringVar(&cfg.processor, "processor", "realtime", "YAMCS processor to subscribe to")
	flag.StringVar(&cfg.postgresql, "postgresql", "", "TimescaleDB database URL; give the password in PGPASSWORD")
	flag.StringVar(&cfg.otlp, "otlp", "",
		"host:port of an OpenTelemetry collector's OTLP gRPC receiver; exports events when set")
	flag.BoolVar(&cfg.includeTopLevel, "include-top-level", false,
		"Also record parameters directly in a top-level space system, where fprime-yamcs puts its packet header fields")
	logLevel := flag.String("log-level", "info", "Log level: debug, info, warn or error")
	flag.Parse()

	var level slog.Level
	if err := level.UnmarshalText([]byte(*logLevel)); err != nil {
		fmt.Fprintln(os.Stderr, "invalid --log-level:", err)
		os.Exit(2)
	}
	logger := slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: level}))
	if cfg.postgresql == "" {
		logger.Error("--postgresql is required")
		os.Exit(2)
	}
	if cfg.otlp != "" {
		// The OTLP exporter accepts a URL like http://localhost:4317 and only
		// fails when it exports, so we check for host:port here. SplitHostPort
		// alone accepts http://collector, with port //collector.
		_, port, err := net.SplitHostPort(cfg.otlp)
		if err == nil {
			_, err = strconv.ParseUint(port, 10, 16)
		}
		if err != nil {
			logger.Error("--otlp must be host:port", "err", err)
			os.Exit(2)
		}
	}
	// The OpenTelemetry SDK hands errors from its background work, such as failed
	// exports, to a global handler that prints them with log.Print. We log them
	// through our logger instead so they look like our other lines. Unlike insert
	// errors, we log each one rather than count it on the stats line, because the
	// exporter sends one batch at a time and retries it for up to 10 seconds before
	// dropping it. So while the collector is unreachable, this logs about once every
	// 10 seconds.
	otel.SetErrorHandler(otel.ErrorHandlerFunc(func(err error) {
		logger.Error("OpenTelemetry error", "err", err)
	}))

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	// Stop catching signals once the first arrives, so a second Ctrl-C kills the process.
	context.AfterFunc(ctx, stop)

	err := run(ctx, cfg, logger)
	if ctx.Err() != nil {
		logger.Info("recorder stopped")
		return
	}
	logger.Error("recorder failed", "err", err)
	os.Exit(1)
}

// run records until a signal arrives or either subscription ends.
func run(ctx context.Context, cfg config, logger *slog.Logger) error {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	db, err := openDatabase(ctx, cfg.postgresql, logger)
	if err != nil {
		return err
	}
	defer db.Close()
	stored, err := store.LatestGenerationTimes(ctx, db, cfg.instance)
	if err != nil {
		return err
	}

	conn, err := yamcs.Dial(cfg.yamcs)
	if err != nil {
		return fmt.Errorf("failed to create YAMCS client: %w", err)
	}
	defer conn.Close()
	stream, err := subscribe(ctx, conn, cfg, logger)
	if err != nil {
		return err
	}
	var eventStream events.EventsApi_SubscribeEventsClient
	var eventLogger otellog.Logger
	if cfg.otlp == "" {
		logger.Info("not exporting events, since --otlp is not set")
	} else {
		provider, err := newLoggerProvider(ctx, cfg.otlp, cfg.instance)
		if err != nil {
			return err
		}
		// On return we shut the provider down, which exports the events it still
		// holds. By then ctx has usually been cancelled, so we pass a fresh context.
		// We give it no deadline, since the exporter gives up on each send after 10
		// seconds. Even with the collector down, exit takes at most about 30 seconds.
		defer func() {
			if err := provider.Shutdown(context.Background()); err != nil {
				logger.Error("failed to flush events", "err", err)
			}
		}()
		eventLogger = provider.Logger("yamcs-recorder")
		eventStream, err = yamcs.SubscribeEvents(ctx, conn, cfg.instance)
		if err != nil {
			return err
		}
		logger.Info("exporting events", "otlp", cfg.otlp)
	}

	r := &recorder{
		db:     db,
		ids:    store.NewResolver(),
		conv:   convert.New(cfg.instance, logger),
		stored: stored,
		logger: logger,
	}
	go r.stats.logEvery(ctx, logger)
	defer r.stats.log(logger)

	// Both subscriptions run on ctx, so when the first one ends we cancel ctx to
	// end the other. That is also how the event stream ends when the instance
	// restarts, since YAMCS leaves it open but silent. We return the first one's
	// error, but only after both loops are done, so the deferred flush, stats
	// line and database close come after the last emit and insert.
	done := make(chan error, 2)
	go func() { done <- recordParameters(ctx, stream, r) }()
	if eventStream != nil {
		go func() { done <- exportEvents(ctx, eventStream, eventLogger, &r.stats) }()
	}
	err = <-done
	cancel()
	if eventStream != nil {
		<-done
	}
	return err
}

// openDatabase connects to the database at dbURL and creates or updates the
// recorder's tables.
func openDatabase(ctx context.Context, dbURL string, logger *slog.Logger) (*sql.DB, error) {
	connector, err := pq.NewConnector(dbURL)
	if err != nil {
		// A url.Error quotes the whole URL, password included.
		var urlErr *url.Error
		if errors.As(err, &urlErr) {
			err = urlErr.Err
		}
		return nil, fmt.Errorf("invalid --postgresql: %w", err)
	}
	db := sql.OpenDB(connector)
	if err := store.Migrate(ctx, db, logger); err != nil {
		db.Close()
		return nil, err
	}
	return db, nil
}

// subscribe asks YAMCS for the instance's TELEMETERED parameters and subscribes
// to the ones recordedParameters keeps.
func subscribe(ctx context.Context, conn grpc.ClientConnInterface, cfg config, logger *slog.Logger) (processing.ProcessingApi_SubscribeParametersClient, error) {
	names, err := yamcs.TelemeteredParameters(ctx, conn, cfg.instance)
	if err != nil {
		return nil, err
	}
	names, excluded := recordedParameters(names, cfg.includeTopLevel)
	if len(names) == 0 {
		return nil, fmt.Errorf("instance %s has no TELEMETERED parameters to record (%d excluded)", cfg.instance, excluded)
	}
	stream, err := yamcs.Subscribe(ctx, conn, cfg.instance, cfg.processor, names)
	if err != nil {
		return nil, err
	}
	logger.Info("recording", "yamcs", cfg.yamcs, "instance", cfg.instance, "processor", cfg.processor,
		"parameters", len(names), "excluded", excluded)
	return stream, nil
}

// recordedParameters returns the names to subscribe to. Unless includeTopLevel
// is set, it leaves out parameters directly in a top-level space system, which
// fprime-yamcs uses for packet header fields. Those describe each packet
// rather than the spacecraft.
func recordedParameters(names []string, includeTopLevel bool) (kept []string, excluded int) {
	if includeTopLevel {
		return names, 0
	}
	kept = slices.DeleteFunc(names, inTopLevelSpaceSystem)
	return kept, len(names) - len(kept)
}

// inTopLevelSpaceSystem reports whether name has exactly two slashes, like
// /Ref_Ref/FPrimeTime. fprime-yamcs puts the packet header fields directly in
// the top-level space system and every channel at least one level below it.
func inTopLevelSpaceSystem(name string) bool {
	return strings.Count(name, "/") == 2
}

// newLoggerProvider returns a provider that batches log records and exports
// them over OTLP gRPC to the collector at addr. Its resource, the attributes it
// sends with every batch, names the instance as the service, which Loki turns
// into the service_name label.
func newLoggerProvider(ctx context.Context, addr, instance string) (*sdklog.LoggerProvider, error) {
	// gRPC waits up to 2 minutes between reconnects, so after a long collector
	// outage we would keep dropping events that long once it is back. We lower
	// the limit to 5 seconds. ConnectParams also replaces gRPC's 20 second
	// connect timeout, so we pass that default again.
	reconnect := backoff.DefaultConfig
	reconnect.MaxDelay = 5 * time.Second
	exporter, err := otlploggrpc.New(ctx,
		otlploggrpc.WithEndpoint(addr),
		// The collector in docker-compose.yml doesn't use TLS.
		otlploggrpc.WithInsecure(),
		otlploggrpc.WithDialOption(grpc.WithConnectParams(grpc.ConnectParams{Backoff: reconnect, MinConnectTimeout: 20 * time.Second})),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create OTLP exporter: %w", err)
	}
	return sdklog.NewLoggerProvider(
		sdklog.WithResource(resource.NewSchemaless(semconv.ServiceNameKey.String(instance))),
		sdklog.WithProcessor(sdklog.NewBatchProcessor(exporter)),
	), nil
}

// recordParameters stores the values that stream delivers until it ends.
func recordParameters(ctx context.Context, stream processing.ProcessingApi_SubscribeParametersClient, r *recorder) error {
	for ctx.Err() == nil {
		data, err := stream.Recv()
		if err != nil {
			return fmt.Errorf("parameter subscription ended: %w", err)
		}
		r.record(ctx, data)
	}
	return ctx.Err()
}

// exportEvents emits each event that stream delivers as a log record until the
// stream ends. The provider behind eventLogger batches and exports them.
func exportEvents(ctx context.Context, stream events.EventsApi_SubscribeEventsClient, eventLogger otellog.Logger, st *stats) error {
	for ctx.Err() == nil {
		e, err := stream.Recv()
		if err != nil {
			return fmt.Errorf("event subscription ended: %w", err)
		}
		eventLogger.Emit(ctx, convert.LogRecord(e))
		st.events.Add(1)
	}
	return ctx.Err()
}

// recorder stores the values that arrive on one parameter subscription.
type recorder struct {
	db   *sql.DB
	ids  *store.Resolver
	conv *convert.Converter
	// stored holds the newest generation time each parameter had in the
	// database when we started. dropStored uses it to skip the values YAMCS
	// re-sends when the subscription opens.
	stored map[store.Parameter]time.Time
	stats  stats
	logger *slog.Logger
}

// record stores the values in one message from YAMCS. If the insert fails, we
// count the error and drop the message's rows rather than exit, so the YAMCS
// subscription stays open and we record again once the database is back.
func (r *recorder) record(ctx context.Context, data *processing.SubscribeParametersData) {
	if invalid := data.GetInvalid(); len(invalid) > 0 {
		r.logger.Warn("YAMCS rejected parameters", "count", len(invalid), "first", invalid[0].GetName())
	}
	rows, unmapped, incomplete := r.conv.Rows(data)
	rows, alreadyStored := dropStored(rows, r.stored)
	r.stats.values.Add(int64(len(data.GetValues())))
	r.stats.unmapped.Add(int64(unmapped))
	r.stats.incomplete.Add(int64(incomplete))
	r.stats.alreadyStored.Add(int64(alreadyStored))
	if len(rows) == 0 {
		return
	}
	// Finish this insert even if a signal arrives, so its rows aren't lost.
	if err := store.Insert(context.WithoutCancel(ctx), r.db, r.ids, rows); err != nil {
		r.stats.insertErrors.Add(1)
		msg := err.Error()
		r.stats.lastInsertError.Store(&msg)
		return
	}
	r.stats.rows.Add(int64(len(rows)))
}

// dropStored removes rows generated at or before the newest time stored for
// their parameter at startup. The subscription starts with YAMCS's cached
// value of each parameter, which an earlier run may have stored already, so we
// check a parameter only in the first message that has it, then delete the
// parameter from stored. Checking every message would also drop new values
// whose generation time went backwards, for example after a clock restart.
func dropStored(rows []store.Row, stored map[store.Parameter]time.Time) (kept []store.Row, alreadyStored int) {
	if len(stored) == 0 {
		return rows, 0
	}
	cutoff := make(map[store.Parameter]time.Time)
	for _, r := range rows {
		if t, ok := stored[r.Parameter]; ok {
			cutoff[r.Parameter] = t
			delete(stored, r.Parameter)
		}
	}
	kept = slices.DeleteFunc(rows, func(r store.Row) bool {
		t, ok := cutoff[r.Parameter]
		return ok && !r.GenerationTime.After(t)
	})
	return kept, len(rows) - len(kept)
}

// stats are totals since start, logged every statsInterval instead of a line
// per value or error.
type stats struct {
	values        atomic.Int64 // parameter values YAMCS sent
	rows          atomic.Int64 // rows inserted
	events        atomic.Int64 // events handed to the OpenTelemetry SDK
	unmapped      atomic.Int64 // values dropped because YAMCS never sent their parameter's name
	incomplete    atomic.Int64 // values and members dropped for having no generation time or no value
	alreadyStored atomic.Int64 // rows dropped by dropStored
	insertErrors  atomic.Int64 // failed inserts, each dropping one message's rows

	lastInsertError atomic.Pointer[string]
}

func (s *stats) log(logger *slog.Logger) {
	attrs := []any{
		"values", s.values.Load(), "rows", s.rows.Load(), "events", s.events.Load(), "unmapped", s.unmapped.Load(),
		"incomplete", s.incomplete.Load(), "already_stored", s.alreadyStored.Load(), "insert_errors", s.insertErrors.Load(),
	}
	// Swap clears the error, so each line shows only the newest one since the previous line.
	if msg := s.lastInsertError.Swap(nil); msg != nil {
		attrs = append(attrs, "last_insert_error", *msg)
	}
	logger.Info("recorder stats", attrs...)
}

func (s *stats) logEvery(ctx context.Context, logger *slog.Logger) {
	ticker := time.NewTicker(statsInterval)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			s.log(logger)
		}
	}
}
