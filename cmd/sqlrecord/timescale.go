package main

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"

	"database/sql"

	_ "github.com/lib/pq"
)

var PG_TEMPLATES SQLTemplates = SQLTemplates{
	CreateEventDefs: `
		CREATE TABLE IF NOT EXISTS eventDefs (
			id SERIAL PRIMARY KEY,
			component TEXT,
			name TEXT,
			severity BIGINT,
			formatString TEXT,
			args JSONB,
			UNIQUE(component, name)
		);
	`,
	CreateEvents: `
		CREATE TABLE IF NOT EXISTS events (
			id SERIAL,
			eventDefId BIGINT REFERENCES eventDefs(id),
			time TIMESTAMP WITH TIME ZONE,
			timeSclk REAL,
			message TEXT,
			source TEXT,
			args JSONB,
			%s
			PRIMARY KEY(id, eventDefId, time, timeSclk)
		) WITH (
			tsdb.hypertable,
			tsdb.partition_column = 'time',
			tsdb.segmentby = 'eventDefId',
			tsdb.chunk_interval = '1 hour'
		);
	`,
	CreateTelemetryDefs: `
		CREATE TABLE IF NOT EXISTS telemetryDefs (
			id SERIAL PRIMARY KEY,
			name TEXT,
			component TEXT,
			UNIQUE(name, component)
		);
	`,
	CreateTelemetries: `
		DO $$ BEGIN
			CREATE TYPE ValueType AS ENUM (
				'int',
				'uint',
				'float',
				'bool',
				'string',
				'enum',
				'object',
				'array',
				'bytes'
			);
			EXCEPTION
			WHEN duplicate_object THEN null;
		END $$;

		CREATE TABLE IF NOT EXISTS telemetry (
			id SERIAL,
			time TIMESTAMP WITH TIME ZONE,
			telemetryDefId BIGINT REFERENCES telemetryDefs(id),
			timeSclk REAL,
			source TEXT,
			labels TEXT,
			key TEXT,
			valueType ValueType,
			integral BIGINT,
			floating REAL,
			boolval BOOLEAN,
			string TEXT,
			bytes BYTEA,
			%s
			PRIMARY KEY(id, time, telemetryDefId, timeSclk)
		) WITH (
			tsdb.hypertable,
			tsdb.partition_column = 'time',
			tsdb.segmentby = 'telemetryDefId'
		);
	`,
	TimeConverter: func(t time.Time) any {
		return t
	},
	PlaceholderFormatter: func(n uint64) string {
		return "$" + strconv.FormatUint(n, 10)
	},
}

type PGRecorder struct {
	log         log.Logger
	db          *sql.DB
	extraColumn *ExtraColumn
}

func NewPGRecorder(dbFile string, extraColumn *ExtraColumn) (*PGRecorder, error) {
	db, err := sql.Open("postgres", dbFile)
	db.SetMaxOpenConns(100)
	if err != nil {
		return nil, fmt.Errorf("failed to create sqlite database: %w", err)
	}
	return &PGRecorder{
		log:         log.GetLogger(context.TODO()).With("db", "postgresql"),
		db:          db,
		extraColumn: extraColumn,
	}, nil
}

func (r *PGRecorder) Close() error {
	return r.db.Close()
}

func (r *PGRecorder) Initialize() error {
	return PG_TEMPLATES.CreateTables(r.db, r.log, r.extraColumn)
}

func (r *PGRecorder) StartTransaction() (Tx, error) {
	return NewSQLTx(r.db, PG_TEMPLATES)
}

func (r *PGRecorder) InsertEvent(tx Tx, srcEvent *pb.SourcedEvent) error {
	return PG_TEMPLATES.InsertEvent(tx, srcEvent, r.extraColumn)
}

func (r *PGRecorder) InsertTelemetry(tx Tx, srcTlm *pb.SourcedTelemetry) error {
	return PG_TEMPLATES.InsertTelemetry(tx, srcTlm, r.extraColumn)
}

func (r *PGRecorder) MaxConnections() int {
	return r.db.Stats().MaxOpenConnections
}

func (r *PGRecorder) DB() *sql.DB {
	return r.db
}
