CREATE TABLE IF NOT EXISTS eventDefs (
    id SERIAL PRIMARY KEY,
    version TEXT,
	component TEXT,
	name TEXT,
    severity BIGINT,
    formatString TEXT,
    args JSONB,
    UNIQUE(version, component, name)
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL,
    eventDefId BIGINT REFERENCES eventDefs(id),
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    timeSclk REAL,
    message TEXT,
    source TEXT,
    args JSONB,
    ert TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY(id, eventDefId, time, timeSclk, ert, source)
) WITH (
    tsdb.hypertable,
    tsdb.partition_column = 'time',
    tsdb.segmentby = 'source',
    tsdb.chunk_interval = '1 day'
);

SELECT add_dimension('events', by_range('ert', INTERVAL '1 day'), if_not_exists => true);

CREATE TABLE IF NOT EXISTS telemetryDefs (
    id SERIAL PRIMARY KEY,
    version TEXT,
    name TEXT,
    component TEXT,
    UNIQUE(version, name, component)
);

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
    time TIMESTAMP WITH TIME ZONE NOT NULL,
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
    ert TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY(id, time, telemetryDefId, timeSclk, ert, source)
) WITH (
    tsdb.hypertable,
    tsdb.partition_column = 'time',
    tsdb.segmentby = 'source',
    tsdb.chunk_interval = '1 day'
);

SELECT add_dimension('telemetry', by_range('ert', INTERVAL '1 day'), if_not_exists => true);