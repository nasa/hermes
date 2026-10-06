# yamcs-recorder

Records the TELEMETERED parameters of a YAMCS instance into TimescaleDB, through the yamcs-grpc plugin. With
`--otlp`, it also exports the instance's events as OpenTelemetry log records to an OpenTelemetry collector, which
forwards them to Loki.

```sh
PGPASSWORD=... go run ./cmd/yamcs-recorder --yamcs localhost:8091 --instance fprime-project \
    --postgresql 'postgres://postgres@localhost:5432/hermes?sslmode=disable' --otlp localhost:4317
```

On start it creates the `timescaledb` extension, the `parameters` table and the `parameter_values` hypertable if
they are missing. Each value becomes one row per scalar, with struct members and array elements named in
`member_path` (`.member`, `[0]`).

It leaves out parameters directly in a top-level space system, such as `/Ref_Ref/FPrimeTime`, where
fprime-yamcs puts the CCSDS and F Prime packet header fields. To record them anyway, pass `--include-top-level`.

YAMCS sends each parameter's cached value first. After a restart, that value is dropped if it is already stored.

The recorder exits non-zero when its parameter or event subscription ends, for example when YAMCS stops or its
instance restarts, so run it under a supervisor that restarts it.

If a write to TimescaleDB fails, for example while the database is down, the values in that message are dropped.
The recorder keeps running and writes again once the database is back. Each failed write adds one to `insert_errors`
on the `recorder stats` line, which it logs every 30 seconds.

## Events

`--otlp` is the `host:port` of the collector's OTLP gRPC receiver, such as `localhost:4317` for the root
`docker-compose.yml`. The recorder connects without TLS, so it cannot reach a collector that requires TLS. Without
`--otlp` it records parameters only and does not subscribe to events.

Each event becomes one log record:

- The service name is the YAMCS instance, and the instrumentation scope is `yamcs-recorder`.
- The timestamp is the event's generation time (when its source raised it) and the observed timestamp its reception
  time (when YAMCS received it). When YAMCS sends no reception time, the OpenTelemetry SDK uses the time the recorder
  handed it the event.
- The body is the event's message.
- The severity number places the YAMCS severity in an OpenTelemetry band, and Loki gives the record that band's
  level: `INFO` 9 (info), `WATCH` 13 and `WARNING` 14 (warn), `DISTRESS` 17 (error), `CRITICAL` 21 and `SEVERE` 22
  (fatal, which Grafana shows as critical). The numbers keep YAMCS's order, so queries can filter on them.
  `WARNING_NEW`, the number YAMCS plans to move `WARNING` to, also gets 14, and the deprecated `ERROR` gets 22. There
  is no severity text, because Loki would take the level from that text and does not know `WATCH`, `DISTRESS` or
  `SEVERE`.
- `yamcs.severity`, `yamcs.source`, `yamcs.type`, `yamcs.seq_number` and `yamcs.created_by` hold YAMCS's own fields.
  `yamcs.type` and `yamcs.created_by` are there only when YAMCS sets them. `yamcs.severity` is the severity name,
  with `WARNING_NEW` named `WARNING` and `ERROR` named `SEVERE`.
- Each entry of the event's `extra` becomes an attribute `yamcs.extra.<key>`; for F Prime events those are the event
  arguments, `fprime_event_id`, `fprime_event_name` and `fprime_severity`. The prefix stops an argument named
  `level` or `severity` from replacing the level Loki gives the record.

Only events raised while the recorder runs are exported; it does not read missed ones from the YAMCS archive. The
recorder sends records in batches about once a second, and on exit sends the rest before it stops. If the collector
is unreachable, the exporter retries each batch for about 10 seconds, then logs an `OpenTelemetry error` line and
drops it. Exit can then take up to about 30 seconds, and the recorder may also log `failed to flush events`. If more
than 2048 events are waiting while the collector is unreachable, the SDK drops the oldest without logging. `events`
on the `recorder stats` line counts the events handed to the SDK, not the ones the collector accepted.

Loki drops an event whose generation time is more than 7 days old, more than 10 minutes in the future, or more than
an hour older than the newest event it already has for that instance, such as an event downlinked late. The
collector logs `Exporting failed` for it, and the recorder does not see the error.

In Grafana, query events through the Loki datasource. Loki indexes the service name as the `service_name` label and
keeps the other fields as structured metadata, with dots replaced by underscores. For example, the events of one
F Prime event type, and the errors and worse:

```logql
{service_name="fprime-project"} | yamcs_type="CdhCore.cmdDisp.OpCodeDispatched"
{service_name="fprime-project"} | severity_number >= 17
```

## Tests

The store tests need `HERMES_TEST_TIMESCALE_DSN`, a `postgres://` URL whose user can create databases. The
subscription tests need `YAMCS_GRPC_ADDRESS` and read `YAMCS_INSTANCE` (default `fprime-project`). Without them,
those tests skip. The event subscription test raises one event through YAMCS's `CreateEvent` call, and the event
stays in that instance's archive.

```sh
HERMES_TEST_TIMESCALE_DSN='postgres://postgres:password@localhost:5432/postgres?sslmode=disable' \
YAMCS_GRPC_ADDRESS=localhost:8091 go test ./internal/recorder/... ./cmd/yamcs-recorder/
```
