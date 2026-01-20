package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"

	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var SQLITE_TEMPLATES SQLTemplates = SQLTemplates{
	CreateEventDefs: `
		CREATE TABLE IF NOT EXISTS eventDefs (
			id INTEGER NOT NULL PRIMARY KEY,
			component TEXT,
			name TEXT,
			severity TEXT,
			formatString TEXT,
			args TEXT,
			UNIQUE(component, name)
		);
	`,
	CreateEvents: `
		CREATE TABLE IF NOT EXISTS events (
			id INTEGER NOT NULL PRIMARY KEY,
			eventDefId INTEGER,
			time REAL,
			timeSclk REAL,
			message TEXT,
			source TEXT,
			args TEXT,
			%s
			FOREIGN KEY(eventDefId) REFERENCES eventDefs(id)
		);
	`,
	CreateTelemetryDefs: `
		CREATE TABLE IF NOT EXISTS telemetryDefs (
			id INTEGER NOT NULL PRIMARY KEY,
			name TEXT,
			component TEXT,
			UNIQUE(name, component)
		);
	`,
	CreateTelemetries: `
		CREATE TABLE IF NOT EXISTS telemetry (
			id INTEGER NOT NULL PRIMARY KEY,
			telemetryDefId INTEGER,
			time REAL,
			timeSclk REAL,
			source TEXT,
			labels TEXT,
			key TEXT,
			valueType TEXT,
			integral INTEGER,
			floating REAL,
			boolval INTEGER,
			string TEXT,
			bytes BLOB,
			%s
			FOREIGN KEY(telemetryDefId) REFERENCES telemetryDefs(id)
		);
	`,
	TimeConverter: func(t time.Time) any {
		return float64(t.UnixNano()) / 1e6
	},
	PlaceholderFormatter: func(n uint64) string {
		return "?"
	},
}

type SQLiteRecorder struct {
	log         log.Logger
	db          *sql.DB
	extraColumn *ExtraColumn
}

func NewSQLiteRecorder(dbFile string, extraColumn *ExtraColumn) (*SQLiteRecorder, error) {
	db, err := sql.Open("sqlite3", dbFile)
	db.SetMaxOpenConns(1)
	if err != nil {
		return nil, fmt.Errorf("failed to create sqlite database: %w", err)
	}
	return &SQLiteRecorder{
		log:         log.GetLogger(context.TODO()).With("db", "sqlite"),
		db:          db,
		extraColumn: extraColumn,
	}, nil
}

func (r *SQLiteRecorder) Close() error {
	return r.db.Close()
}

func (r *SQLiteRecorder) Initialize() error {
	_, err := r.db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		return fmt.Errorf("failed to enable foreign keys: %w", err)
	}
	_, err = r.db.Exec("PRAGMA journal_mode=WAL;")
	if err != nil {
		return fmt.Errorf("failed to enable write-ahead logging: %w", err)
	}
	// _, err = r.db.Exec("PRAGMA synchronous=OFF;")
	// if err != nil {
	// 	return fmt.Errorf("failed to disable synchronous mode: %w", err)
	// }

	return SQLITE_TEMPLATES.CreateTables(r.db, r.log, r.extraColumn)
}

func (r *SQLiteRecorder) StartTransaction() (Tx, error) {
	return NewSQLTx(r.db, SQLITE_TEMPLATES)
}

func (r *SQLiteRecorder) InsertEvent(tx Tx, srcEvent *pb.SourcedEvent) error {
	return SQLITE_TEMPLATES.InsertEvent(tx, srcEvent, r.extraColumn)
}

func (r *SQLiteRecorder) InsertTelemetry(tx Tx, srcTlm *pb.SourcedTelemetry) error {
	return SQLITE_TEMPLATES.InsertTelemetry(tx, srcTlm, r.extraColumn)
}

func (r *SQLiteRecorder) MaxConnections() int {
	return r.db.Stats().MaxOpenConnections
}

func (r *SQLiteRecorder) DB() *sql.DB {
	return r.db

}
