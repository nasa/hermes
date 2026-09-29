package timescaledb

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/nasa/hermes/pkg/log"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// testDSN points at a TimescaleDB instance, overridable for CI. These tests
// skip rather than fail when nothing is listening, so the default `go test`
// run stays hermetic.
func testDSN() string {
	if dsn := os.Getenv("HERMES_TEST_TIMESCALE_DSN"); dsn != "" {
		return dsn
	}
	return "postgres://postgres:password@localhost:5433/hermes?sslmode=disable"
}

// migrateTestDB gives each test an isolated schema in the shared instance, so
// tests neither see each other's tables nor disturb a developer's real data.
func migrateTestDB(t *testing.T) (*sqlx.DB, log.Logger) {
	t.Helper()

	db, err := sqlx.Open("postgres", testDSN())
	if err != nil {
		t.Skipf("no timescaledb available: %v", err)
	}
	if err := db.PingContext(context.Background()); err != nil {
		t.Skipf("no timescaledb reachable at %s: %v", testDSN(), err)
	}

	schema := fmt.Sprintf("migrate_test_%d", os.Getpid()+int(hashName(t.Name())))
	ctx := context.Background()

	_, err = db.ExecContext(ctx, fmt.Sprintf(`DROP SCHEMA IF EXISTS %s CASCADE`, schema))
	require.NoError(t, err)
	_, err = db.ExecContext(ctx, fmt.Sprintf(`CREATE SCHEMA %s`, schema))
	require.NoError(t, err)
	// public must stay on the path: the TimescaleDB extension functions
	// (by_range, add_dimension) live there.
	_, err = db.ExecContext(ctx, fmt.Sprintf(`SET search_path TO %s, public`, schema))
	require.NoError(t, err)

	// One connection only, so the session-scoped search_path above applies to
	// every query the test makes.
	db.SetMaxOpenConns(1)

	t.Cleanup(func() {
		_, _ = db.ExecContext(context.Background(),
			fmt.Sprintf(`DROP SCHEMA IF EXISTS %s CASCADE`, schema))
		_ = db.Close()
	})

	return db, log.GetLogger(ctx)
}

func hashName(s string) uint32 {
	var h uint32 = 2166136261
	for i := 0; i < len(s); i++ {
		h = (h ^ uint32(s[i])) * 16777619
	}
	return h % 100000
}

// A fresh database must come out fully built and recorded at the current
// version, and a second Migrate must be a no-op.
func TestMigrateFreshIsIdempotent(t *testing.T) {
	db, logger := migrateTestDB(t)
	ctx := context.Background()

	require.NoError(t, Migrate(ctx, db, logger))

	var version int
	require.NoError(t, db.QueryRowContext(ctx, `SELECT version FROM schemaVersion`).Scan(&version))
	assert.Equal(t, schemaVersion, version)

	for _, table := range []string{"telemetryDefs", "eventDefs", "telemetry", "events"} {
		var exists bool
		require.NoError(t, db.QueryRowContext(ctx,
			`SELECT EXISTS (SELECT 1 FROM information_schema.tables
			 WHERE table_name = lower($1) AND table_schema = current_schema())`, table,
		).Scan(&exists))
		assert.True(t, exists, "%s should exist after migration", table)
	}

	// Restarting the process must not re-run anything or change the version.
	require.NoError(t, Migrate(ctx, db, logger))
	require.NoError(t, db.QueryRowContext(ctx, `SELECT version FROM schemaVersion`).Scan(&version))
	assert.Equal(t, schemaVersion, version)

	var rows int
	require.NoError(t, db.QueryRowContext(ctx, `SELECT COUNT(*) FROM schemaVersion`).Scan(&rows))
	assert.Equal(t, 1, rows, "schemaVersion must not accumulate rows")
}

// The upgrade path: a database written by the old code holds explicit def ids
// and has no schemaVersion table. The sequence must be moved past those ids so
// the first database-assigned insert does not collide.
func TestMigrateReclaimsSequencesFromExplicitIds(t *testing.T) {
	db, logger := migrateTestDB(t)
	ctx := context.Background()

	// Stand up the old-world schema without any version bookkeeping.
	_, err := db.ExecContext(ctx, schemaSql)
	require.NoError(t, err)

	// Old code supplied ids from the wire, which never advanced the sequence.
	_, err = db.ExecContext(ctx,
		`INSERT INTO telemetryDefs (id, name, component) VALUES (4061, 'MotTlmHstReqStart', 'mot')`)
	require.NoError(t, err)
	_, err = db.ExecContext(ctx,
		`INSERT INTO eventDefs (id, component, name, severity) VALUES (1288, 'cmdDisp', 'NoOpStringReceived', 2)`)
	require.NoError(t, err)

	require.NoError(t, Migrate(ctx, db, logger))

	// The pre-existing rows survive.
	var name string
	require.NoError(t, db.QueryRowContext(ctx,
		`SELECT name FROM telemetryDefs WHERE id = 4061`).Scan(&name))
	assert.Equal(t, "MotTlmHstReqStart", name)

	// And a new def gets an id past them instead of colliding.
	var newId int64
	require.NoError(t, db.QueryRowContext(ctx,
		`INSERT INTO telemetryDefs (name, component) VALUES ('Voltage', 'mot') RETURNING id`).Scan(&newId))
	assert.Greater(t, newId, int64(4061), "new def id must clear the highest explicit id")

	var newEventId int64
	require.NoError(t, db.QueryRowContext(ctx,
		`INSERT INTO eventDefs (component, name, severity) VALUES ('mot', 'Stalled', 3) RETURNING id`).Scan(&newEventId))
	assert.Greater(t, newEventId, int64(1288))
}

// The collapsed def at id 0 and the telemetry hanging off it are unrecoverable
// and must be removed; everything else must be left alone.
func TestMigratePurgesCollapsedDef(t *testing.T) {
	db, logger := migrateTestDB(t)
	ctx := context.Background()

	_, err := db.ExecContext(ctx, schemaSql)
	require.NoError(t, err)

	_, err = db.ExecContext(ctx, `
		INSERT INTO telemetryDefs (id, name, component) VALUES
			(0, 'WhicheverArrivedFirst', 'mot'),
			(7, 'RealChannel', 'cmdDisp')`)
	require.NoError(t, err)

	_, err = db.ExecContext(ctx, `
		INSERT INTO telemetry (time, telemetryDefId, timeSclk, source, key, valueType, integral, ert) VALUES
			(now(), 0, 1, 'fsw', 'value', 'int', 1, now()),
			(now(), 0, 2, 'fsw', 'value', 'int', 2, now()),
			(now(), 7, 3, 'fsw', 'value', 'int', 3, now())`)
	require.NoError(t, err)

	require.NoError(t, Migrate(ctx, db, logger))

	var collapsedDefs, collapsedRows int
	require.NoError(t, db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM telemetryDefs WHERE id = 0`).Scan(&collapsedDefs))
	require.NoError(t, db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM telemetry WHERE telemetryDefId = 0`).Scan(&collapsedRows))
	assert.Zero(t, collapsedDefs)
	assert.Zero(t, collapsedRows)

	// The legitimate def and its telemetry are untouched.
	var keptDefs, keptRows int
	require.NoError(t, db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM telemetryDefs WHERE id = 7`).Scan(&keptDefs))
	require.NoError(t, db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM telemetry WHERE telemetryDefId = 7`).Scan(&keptRows))
	assert.Equal(t, 1, keptDefs)
	assert.Equal(t, 1, keptRows)
}
