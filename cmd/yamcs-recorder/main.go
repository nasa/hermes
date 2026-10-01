// Command yamcs-recorder records every TELEMETERED parameter of a YAMCS
// instance into TimescaleDB. It exits non-zero when the subscription ends, so
// run it under a supervisor that restarts it.
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
	"sync/atomic"
	"syscall"
	"time"

	"github.com/lib/pq"
	flag "github.com/spf13/pflag"

	"github.com/nasa/hermes/internal/recorder/convert"
	"github.com/nasa/hermes/internal/recorder/store"
	"github.com/nasa/hermes/internal/recorder/yamcs"
)

const statsInterval = 30 * time.Second

type config struct {
	yamcs      string
	instance   string
	processor  string
	postgresql string
}

func main() {
	var cfg config
	flag.StringVar(&cfg.yamcs, "yamcs", "localhost:8091", "Address of the YAMCS gRPC plugin")
	flag.StringVar(&cfg.instance, "instance", "fprime-project", "YAMCS instance to record")
	flag.StringVar(&cfg.processor, "processor", "realtime", "YAMCS processor to subscribe to")
	flag.StringVar(&cfg.postgresql, "postgresql", "", "TimescaleDB database URL; give the password in PGPASSWORD")
	logLevel := flag.String("log-level", "info", "Log level: debug, info, warn or error")
	flag.Parse()

	var level slog.Level
	if err := level.UnmarshalText([]byte(*logLevel)); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(2)
	}
	logger := slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: level}))
	if cfg.postgresql == "" {
		logger.Error("--postgresql is required")
		os.Exit(2)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	// After the first signal, a second one kills the process.
	context.AfterFunc(ctx, stop)

	err := run(ctx, cfg, logger)
	if ctx.Err() != nil {
		logger.Info("recorder stopped")
		return
	}
	logger.Error("recorder failed", "error", err)
	os.Exit(1)
}

func run(ctx context.Context, cfg config, logger *slog.Logger) error {
	connector, err := pq.NewConnector(cfg.postgresql)
	if err != nil {
		// A url.Error quotes the whole URL, password included.
		if urlErr := (*url.Error)(nil); errors.As(err, &urlErr) {
			err = urlErr.Err
		}
		return fmt.Errorf("invalid --postgresql: %w", err)
	}
	db := sql.OpenDB(connector)
	defer db.Close()
	if err := store.Migrate(ctx, db, logger); err != nil {
		return err
	}

	conn, err := yamcs.Dial(cfg.yamcs)
	if err != nil {
		return fmt.Errorf("failed to create YAMCS client: %w", err)
	}
	defer conn.Close()
	names, err := yamcs.TelemeteredParameters(ctx, conn, cfg.instance)
	if err != nil {
		return err
	}
	if len(names) == 0 {
		return fmt.Errorf("instance %s has no TELEMETERED parameters", cfg.instance)
	}
	stream, err := yamcs.Subscribe(ctx, conn, cfg.instance, cfg.processor, names)
	if err != nil {
		return err
	}
	logger.Info("recording", "yamcs", cfg.yamcs, "instance", cfg.instance, "processor", cfg.processor,
		"parameters", len(names))

	var st stats
	go st.logEvery(ctx, logger)
	defer st.log(logger)

	conv := convert.New(cfg.instance, logger)
	ids := store.NewResolver()
	for ctx.Err() == nil {
		data, err := stream.Recv()
		if err != nil {
			return fmt.Errorf("parameter subscription ended: %w", err)
		}
		if invalid := data.GetInvalid(); len(invalid) > 0 {
			logger.Warn("YAMCS rejected parameters", "count", len(invalid), "first", invalid[0].GetName())
		}
		rows, unmapped := conv.Rows(data)
		st.values.Add(int64(len(data.GetValues())))
		st.unmapped.Add(int64(unmapped))
		if len(rows) == 0 {
			continue
		}
		// A signal stops the loop only after this insert finishes.
		if err := store.Insert(context.WithoutCancel(ctx), db, ids, rows); err != nil {
			st.insertErrors.Add(1)
			msg := err.Error()
			st.lastInsertError.Store(&msg)
			continue
		}
		st.rows.Add(int64(len(rows)))
	}
	return ctx.Err()
}

// stats are totals since start, logged instead of a line per value or error.
type stats struct {
	values, rows, unmapped, insertErrors atomic.Int64
	lastInsertError                      atomic.Pointer[string]
}

func (s *stats) log(logger *slog.Logger) {
	attrs := []any{
		"values", s.values.Load(), "rows", s.rows.Load(),
		"unmapped", s.unmapped.Load(), "insert_errors", s.insertErrors.Load(),
	}
	// Only the latest error since the previous line.
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
