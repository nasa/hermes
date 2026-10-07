// Command yamcs-recorder records the TELEMETERED parameters of a YAMCS
// instance into TimescaleDB, by default leaving out the packet header fields
// fprime-yamcs defines. It exits non-zero when the subscription ends, so run it
// under a supervisor that restarts it.
package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"os/signal"
	"slices"
	"strings"
	"sync/atomic"
	"syscall"
	"time"

	"github.com/lib/pq"
	flag "github.com/spf13/pflag"
	"google.golang.org/grpc"

	"github.com/nasa/hermes/internal/recorder/convert"
	"github.com/nasa/hermes/internal/recorder/store"
	"github.com/nasa/hermes/internal/recorder/yamcs"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/processing"
)

const statsInterval = 30 * time.Second

type config struct {
	yamcs           string
	instance        string
	processor       string
	postgresql      string
	includeTopLevel bool
}

func main() {
	var cfg config
	flag.StringVar(&cfg.yamcs, "yamcs", "localhost:8091", "host:port of the yamcs-grpc plugin")
	flag.StringVar(&cfg.instance, "instance", "fprime-project", "YAMCS instance to record")
	flag.StringVar(&cfg.processor, "processor", "realtime", "YAMCS processor to subscribe to")
	flag.StringVar(&cfg.postgresql, "postgresql", "", "TimescaleDB database URL; give the password in PGPASSWORD")
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

// run records until a signal arrives or the subscription ends.
func run(ctx context.Context, cfg config, logger *slog.Logger) error {
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

	r := &recorder{
		db:     db,
		ids:    store.NewResolver(),
		conv:   convert.New(cfg.instance, logger),
		stored: stored,
		logger: logger,
	}
	go r.stats.logEvery(ctx, logger)
	defer r.stats.log(logger)
	for ctx.Err() == nil {
		data, err := stream.Recv()
		if err != nil {
			return fmt.Errorf("parameter subscription ended: %w", err)
		}
		r.record(ctx, data)
	}
	return ctx.Err()
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
	unmapped      atomic.Int64 // values dropped because YAMCS never sent their parameter's name
	incomplete    atomic.Int64 // values and members dropped for having no generation time or no value
	alreadyStored atomic.Int64 // rows dropped by dropStored
	insertErrors  atomic.Int64 // failed inserts, each dropping one message's rows

	lastInsertError atomic.Pointer[string]
}

func (s *stats) log(logger *slog.Logger) {
	attrs := []any{
		"values", s.values.Load(), "rows", s.rows.Load(), "unmapped", s.unmapped.Load(),
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
