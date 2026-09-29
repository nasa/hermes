package timescaledb

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/nasa/hermes/pkg/log"
)

// schemaVersion is the version this build of Hermes expects. Migrate brings a
// database up to it on every process start.
const schemaVersion = 3

// advisoryLockKey guards the migration against two Hermes processes starting
// against the same database at the same time. The value is arbitrary but must
// stay stable across releases.
const advisoryLockKey = 0x48524D53 // "HRMS"

// migration is one step from version-1 to version. Steps run in order inside
// the same transaction as the version bump, so a failure leaves the recorded
// version untouched and the next start retries from the same place.
type migration struct {
	version int
	name    string
	apply   func(context.Context, *sqlx.Tx, log.Logger) error
}

var migrations = []migration{
	{
		version: 1,
		name:    "baseline schema",
		apply: func(ctx context.Context, tx *sqlx.Tx, _ log.Logger) error {
			// Every statement in schema.sql is CREATE ... IF NOT EXISTS, so
			// this is also correct for a database created before versioning
			// existed — it simply finds everything already present.
			_, err := tx.ExecContext(ctx, schemaSql)
			return err
		},
	},
	{
		version: 2,
		name:    "reclaim def id sequences",
		apply: func(ctx context.Context, tx *sqlx.Tx, logger log.Logger) error {
			// Def ids used to be supplied explicitly from the wire, so the
			// SERIAL sequences behind them were never advanced past 1 while
			// existing rows hold ids in the thousands. Now that the database
			// allocates ids, the sequence must be moved past the highest
			// existing row or the first insert collides.
			for _, table := range []string{"telemetryDefs", "eventDefs"} {
				var next int64
				err := tx.QueryRowContext(ctx, fmt.Sprintf(
					`SELECT setval(
						pg_get_serial_sequence('%s', 'id'),
						COALESCE((SELECT MAX(id) FROM %s), 0) + 1,
						false
					)`, table, table)).Scan(&next)
				if err != nil {
					return fmt.Errorf("failed to reclaim %s id sequence: %w", table, err)
				}
				logger.Info("reclaimed def id sequence", "table", table, "nextId", next)
			}
			return nil
		},
	},
	{
		version: 3,
		name:    "purge collapsed telemetry defs",
		apply: func(ctx context.Context, tx *sqlx.Tx, logger log.Logger) error {
			// Providers that left the ref id unset all wrote id=0, and
			// ON CONFLICT DO NOTHING collapsed every one of their channels
			// into a single def row. The real component/name per sample was
			// never stored, so the affected telemetry cannot be repaired.
			//
			// Note this also removes a genuine channel that happened to sit at
			// id 0, if any provider ever emitted one. There is no way to tell
			// the two apart.
			res, err := tx.ExecContext(ctx, `DELETE FROM telemetry WHERE telemetryDefId = 0`)
			if err != nil {
				return fmt.Errorf("failed to purge collapsed telemetry: %w", err)
			}
			rows, _ := res.RowsAffected()

			defRes, err := tx.ExecContext(ctx, `DELETE FROM telemetryDefs WHERE id = 0`)
			if err != nil {
				return fmt.Errorf("failed to purge collapsed telemetry def: %w", err)
			}
			defRows, _ := defRes.RowsAffected()

			if rows > 0 || defRows > 0 {
				logger.Warn(
					"discarded unrecoverable telemetry that was collapsed onto def id 0; "+
						"its true component/name was never recorded",
					"telemetryRows", rows,
					"defRows", defRows,
				)
			}
			return nil
		},
	},
}

// Migrate brings the database schema up to schemaVersion, applying only the
// steps it has not already seen. Safe to call on every process start and safe
// to run concurrently from multiple processes.
func Migrate(ctx context.Context, db *sqlx.DB, logger log.Logger) error {
	if _, err := db.ExecContext(ctx,
		`CREATE TABLE IF NOT EXISTS schemaVersion (version INTEGER NOT NULL)`,
	); err != nil {
		return fmt.Errorf("failed to create schemaVersion table: %w", err)
	}

	tx, err := db.BeginTxx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin migration transaction: %w", err)
	}
	defer tx.Rollback()

	// Released automatically when the transaction ends, so a crashed migration
	// cannot leave the lock held.
	if _, err := tx.ExecContext(ctx, `SELECT pg_advisory_xact_lock($1)`, advisoryLockKey); err != nil {
		return fmt.Errorf("failed to acquire migration lock: %w", err)
	}

	// Re-read inside the lock: another process may have migrated while we
	// were waiting for it.
	current := 0
	if err := tx.QueryRowContext(ctx,
		`SELECT COALESCE(MAX(version), 0) FROM schemaVersion`,
	).Scan(&current); err != nil {
		return fmt.Errorf("failed to read schema version: %w", err)
	}

	if current >= schemaVersion {
		logger.Debug("database schema is up to date", "version", current)
		return tx.Commit()
	}

	logger.Info("migrating database schema", "from", current, "to", schemaVersion)

	for _, m := range migrations {
		if m.version <= current {
			continue
		}
		logger.Info("applying migration", "version", m.version, "name", m.name)
		if err := m.apply(ctx, tx, logger); err != nil {
			return fmt.Errorf("migration %d (%s) failed: %w", m.version, m.name, err)
		}
	}

	// Single row, rewritten each time, so schemaVersion never accumulates.
	if _, err := tx.ExecContext(ctx, `DELETE FROM schemaVersion`); err != nil {
		return fmt.Errorf("failed to clear schema version: %w", err)
	}
	if _, err := tx.ExecContext(ctx,
		`INSERT INTO schemaVersion (version) VALUES ($1)`, schemaVersion,
	); err != nil {
		return fmt.Errorf("failed to record schema version: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit migration: %w", err)
	}

	logger.Info("database schema migration complete", "version", schemaVersion)
	return nil
}
