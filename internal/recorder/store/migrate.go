// Package store writes YAMCS parameter values into TimescaleDB for the
// recorder.
package store

import (
	"context"
	"database/sql"
	_ "embed"
	"fmt"
	"log/slog"
)

// advisoryLockKey names the Postgres advisory lock (a lock on a number we pick
// rather than on a table) that stops two recorders from migrating the same
// database at once.
const advisoryLockKey = 0x48524D5352454344 // "HRMSRECD"

//go:embed schema.sql
var schemaSQL string

type migration struct {
	version int
	name    string
	sql     string
}

var migrations = []migration{
	{
		version: 1,
		name:    "parameters and parameter_values",
		sql:     schemaSQL,
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

	// We create recorder_schema_version only after taking the lock. When two
	// processes run CREATE TABLE IF NOT EXISTS at the same moment, both can see
	// the table missing and try to create it, and one then fails with a duplicate
	// key error.
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
