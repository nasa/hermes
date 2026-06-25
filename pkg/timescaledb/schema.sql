CREATE TABLE IF NOT EXISTS eventDefs (
    id SERIAL PRIMARY KEY,
	component TEXT,
	name TEXT,
    severity BIGINT,
    formatString TEXT,
    args JSONB,
    UNIQUE(component, name)
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL,
    eventDefId BIGINT REFERENCES eventDefs(id),
    time TIMESTAMP WITH TIME ZONE,
    timeSclk REAL,
    message TEXT,
    source TEXT,
    args JSONB,
    PRIMARY KEY(id, eventDefId, time, timeSclk)
) WITH (
    tsdb.hypertable,
    tsdb.partition_column = 'time',
    tsdb.segmentby = 'eventDefId',
    tsdb.chunk_interval = '1 hour'
);

CREATE TABLE IF NOT EXISTS telemetryDefs (
    id SERIAL PRIMARY KEY,
    name TEXT,
    component TEXT,
    UNIQUE(name, component)
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