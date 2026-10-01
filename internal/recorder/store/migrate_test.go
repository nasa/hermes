package store

import (
	"bytes"
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"sync"
	"sync/atomic"
	"testing"

	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var dbCounter atomic.Int64

// freshDatabase creates an empty database for one test and returns its DSN.
// HERMES_TEST_TIMESCALE_DSN must be a postgres:// URL whose user can create
// databases; the tests skip when it is unset.
func freshDatabase(t *testing.T) string {
	t.Helper()

	dsn := os.Getenv("HERMES_TEST_TIMESCALE_DSN")
	if dsn == "" {
		t.Skip("HERMES_TEST_TIMESCALE_DSN not set")
	}

	admin, err := sql.Open("postgres", dsn)
	require.NoError(t, err)
	t.Cleanup(func() { _ = admin.Close() })

	name := fmt.Sprintf("recorder_store_test_%d_%d", os.Getpid(), dbCounter.Add(1))
	ctx := context.Background()
	_, err = admin.ExecContext(ctx, `DROP DATABASE IF EXISTS `+name)
	require.NoError(t, err)
	_, err = admin.ExecContext(ctx, `CREATE DATABASE `+name)
	require.NoError(t, err)
	t.Cleanup(func() {
		_, _ = admin.ExecContext(context.Background(), `DROP DATABASE IF EXISTS `+name+` WITH (FORCE)`)
	})

	u, err := url.Parse(dsn)
	require.NoError(t, err)
	u.Path = "/" + name
	return u.String()
}

func openDB(t *testing.T, dsn string) *sql.DB {
	t.Helper()
	db, err := sql.Open("postgres", dsn)
	require.NoError(t, err)
	t.Cleanup(func() { _ = db.Close() })
	return db
}

// migratedDB returns a handle to a fresh database at the current schema.
func migratedDB(t *testing.T) *sql.DB {
	t.Helper()
	db := openDB(t, freshDatabase(t))
	require.NoError(t, Migrate(context.Background(), db, slog.New(slog.DiscardHandler)))
	return db
}

func TestMigrateFreshThenNoOp(t *testing.T) {
	db := openDB(t, freshDatabase(t))
	ctx := context.Background()

	var logs bytes.Buffer
	logger := slog.New(slog.NewTextHandler(&logs, &slog.HandlerOptions{Level: slog.LevelDebug}))

	require.NoError(t, Migrate(ctx, db, logger))
	assert.Contains(t, logs.String(), "applying recorder migration")

	var version int
	require.NoError(t, db.QueryRowContext(ctx, `SELECT version FROM recorder_schema_version`).Scan(&version))
	assert.Equal(t, schemaVersion, version)

	var hypertables int
	require.NoError(t, db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM timescaledb_information.hypertables WHERE hypertable_name = 'parameter_values'`,
	).Scan(&hypertables))
	assert.Equal(t, 1, hypertables)

	var hasParameters bool
	require.NoError(t, db.QueryRowContext(ctx,
		`SELECT to_regclass('parameters') IS NOT NULL`).Scan(&hasParameters))
	assert.True(t, hasParameters)

	logs.Reset()
	require.NoError(t, Migrate(ctx, db, logger))
	assert.Contains(t, logs.String(), "recorder schema is up to date")
	assert.NotContains(t, logs.String(), "applying recorder migration")

	var rows int
	require.NoError(t, db.QueryRowContext(ctx, `SELECT COUNT(*) FROM recorder_schema_version`).Scan(&rows))
	assert.Equal(t, 1, rows)
}

// Two processes starting together on an empty database. v5's Migrate fails
// this because it creates its version table before taking the lock.
func TestMigrateConcurrentOnEmptyDatabase(t *testing.T) {
	for round := range 5 {
		dsn := freshDatabase(t)
		a, b := openDB(t, dsn), openDB(t, dsn)
		// Open both connections up front so neither Migrate gets a head start.
		require.NoError(t, a.Ping())
		require.NoError(t, b.Ping())

		var wg sync.WaitGroup
		errs := make([]error, 2)
		start := make(chan struct{})
		for i, db := range []*sql.DB{a, b} {
			wg.Go(func() {
				<-start
				errs[i] = Migrate(context.Background(), db, slog.New(slog.DiscardHandler))
			})
		}
		close(start)
		wg.Wait()

		require.NoError(t, errs[0], "round %d", round)
		require.NoError(t, errs[1], "round %d", round)

		var version, rows int
		require.NoError(t, a.QueryRow(`SELECT MAX(version), COUNT(*) FROM recorder_schema_version`).Scan(&version, &rows))
		assert.Equal(t, schemaVersion, version)
		assert.Equal(t, 1, rows)
	}
}
