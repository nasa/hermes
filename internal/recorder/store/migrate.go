// Package store writes YAMCS parameter values into TimescaleDB for the
// recorder. Its tables are separate from the ones Hermes v5 uses in
// pkg/timescaledb, so both can share a database.
package store

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
)

// advisoryLockKey must differ from v5's 0x48524D53 so the two migrators never
// wait on each other.
const advisoryLockKey = 0x48524D5352454344 // "HRMSRECD"

type migration struct {
	version int
	name    string
	sql     string
}

var migrations = []migration{
	{
		version: 1,
		name:    "parameters and parameter_values",
		sql: `
CREATE TABLE IF NOT EXISTS parameters (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    instance     TEXT NOT NULL,
    space_system TEXT NOT NULL CHECK (space_system LIKE '/%'),
    name         TEXT NOT NULL,
    UNIQUE (instance, space_system, name)
);

CREATE TABLE IF NOT EXISTS parameter_values (
    parameter_id     INTEGER NOT NULL REFERENCES parameters (id),
    member_path      TEXT NOT NULL DEFAULT '',
    generation_time  TIMESTAMPTZ NOT NULL,
    acquisition_time TIMESTAMPTZ,
    value_type       TEXT NOT NULL CONSTRAINT value_type_known CHECK (value_type IN
        ('FLOAT','DOUBLE','UINT32','SINT32','UINT64','SINT64','BOOLEAN','STRING','BINARY','ENUMERATED','TIMESTAMP')),
    int_value        BIGINT,
    float_value      DOUBLE PRECISION,
    bool_value       BOOLEAN,
    string_value     TEXT,
    binary_value     BYTEA
) WITH (
    tsdb.hypertable,
    tsdb.partition_column = 'generation_time',
    tsdb.segmentby = 'parameter_id, member_path',
    tsdb.orderby = 'generation_time DESC',
    tsdb.chunk_interval = '1 day'
);

CREATE INDEX IF NOT EXISTS parameter_values_param_member_time_idx
    ON parameter_values (parameter_id, member_path, generation_time DESC);
`,
	},
}

// schemaVersion is the version Migrate brings the database to.
var schemaVersion = migrations[len(migrations)-1].version

// Migrate applies every migration the database has not seen, in one
// transaction. Safe to call on every start and from several processes at once.
func Migrate(ctx context.Context, db *sql.DB, logger *slog.Logger) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin migration transaction: %w", err)
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, `SELECT pg_advisory_xact_lock($1)`, int64(advisoryLockKey)); err != nil {
		return fmt.Errorf("failed to acquire migration lock: %w", err)
	}

	// Created under the lock: v5 creates its version table before locking, and
	// two processes starting together race on the CREATE.
	if _, err := tx.ExecContext(ctx,
		`CREATE TABLE IF NOT EXISTS recorder_schema_version (version INTEGER NOT NULL)`,
	); err != nil {
		return fmt.Errorf("failed to create recorder_schema_version table: %w", err)
	}

	current := 0
	if err := tx.QueryRowContext(ctx,
		`SELECT COALESCE(MAX(version), 0) FROM recorder_schema_version`,
	).Scan(&current); err != nil {
		return fmt.Errorf("failed to read schema version: %w", err)
	}

	if current >= schemaVersion {
		logger.Debug("recorder schema is up to date", "version", current)
		return tx.Commit()
	}

	for _, m := range migrations {
		if m.version <= current {
			continue
		}
		logger.Info("applying recorder migration", "version", m.version, "name", m.name)
		if _, err := tx.ExecContext(ctx, m.sql); err != nil {
			return fmt.Errorf("migration %d (%s) failed: %w", m.version, m.name, err)
		}
	}

	if _, err := tx.ExecContext(ctx, `DELETE FROM recorder_schema_version`); err != nil {
		return fmt.Errorf("failed to clear schema version: %w", err)
	}
	if _, err := tx.ExecContext(ctx,
		`INSERT INTO recorder_schema_version (version) VALUES ($1)`, schemaVersion,
	); err != nil {
		return fmt.Errorf("failed to record schema version: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit migration: %w", err)
	}
	logger.Info("recorder schema migrated", "from", current, "to", schemaVersion)
	return nil
}
