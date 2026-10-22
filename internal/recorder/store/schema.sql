-- The recorder's tables, created by migration 1 in migrate.go. Once a release has
-- shipped, change the schema with a new migration there rather than by editing
-- this file, or databases that already ran migration 1 would never get the change.

CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Each row defines one scalar of a parameter (the whole value, a struct member or
-- an array element) and the type of its values. When a new dictionary changes
-- that type, the values go under a new row, so Grafana can show each type as its
-- own series.
CREATE TABLE IF NOT EXISTS parameters (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    instance     TEXT NOT NULL,
    space_system TEXT NOT NULL CHECK (space_system LIKE '/%'),
    name         TEXT NOT NULL,
    member_path  TEXT NOT NULL DEFAULT '',
    value_type   TEXT NOT NULL CONSTRAINT value_type_known CHECK (value_type IN
        ('FLOAT','DOUBLE','UINT32','SINT32','UINT64','SINT64','BOOLEAN','STRING','BINARY','ENUMERATED','TIMESTAMP')),
    UNIQUE (instance, space_system, name, member_path, value_type)
);

-- tsdb.segmentby and tsdb.orderby make compressed chunks keep the rows of each
-- parameter_id together, newest first, so reading one parameter decompresses
-- only that parameter's rows. On TimescaleDB 2.23+ the WITH options also add a
-- columnstore policy that compresses chunks older than a day.
CREATE TABLE IF NOT EXISTS parameter_values (
    parameter_id     INTEGER NOT NULL REFERENCES parameters (id),
    generation_time  TIMESTAMPTZ NOT NULL,
    acquisition_time TIMESTAMPTZ,
    sclk_us          BIGINT,
    int_value        BIGINT,
    float_value      DOUBLE PRECISION,
    bool_value       BOOLEAN,
    string_value     TEXT,
    binary_value     BYTEA
) WITH (
    tsdb.hypertable,
    tsdb.partition_column = 'generation_time',
    tsdb.segmentby = 'parameter_id',
    tsdb.orderby = 'generation_time DESC',
    tsdb.chunk_interval = '1 day'
);

CREATE INDEX IF NOT EXISTS parameter_values_param_generation_idx
    ON parameter_values (parameter_id, generation_time DESC);

-- Grafana can also filter by acquisition time, so we index it too.
CREATE INDEX IF NOT EXISTS parameter_values_param_acquisition_idx
    ON parameter_values (parameter_id, acquisition_time DESC);
