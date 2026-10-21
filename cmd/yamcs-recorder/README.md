# yamcs-recorder

yamcs-recorder records the values of a YAMCS instance's telemetered parameters in TimescaleDB, a PostgreSQL database
for time series, where Grafana charts them with the [Hermes datasource](../../grafana-datasource-plugin/src/README.md).
A parameter is YAMCS's name for a telemetry value, and a telemetered one is decoded from downlinked telemetry, such as
an F Prime telemetry channel. With `--otlp`, the recorder also sends the instance's events through an OpenTelemetry
collector to Loki, a log database.

```mermaid
flowchart LR
    yamcs["YAMCS with yamcs-grpc"] -->|"parameters, events"| rec["yamcs-recorder"]
    rec -->|"parameters"| ts[("TimescaleDB")]
    rec -->|"events"| otel["OpenTelemetry collector"] --> loki[("Loki")]
    ts -->|"Hermes datasource"| graf["Grafana"]
    loki --> graf
```

## Run

Start YAMCS with the [yamcs-grpc plugin](../../yamcs-grpc-plugin/README.md#run), and TimescaleDB, Loki and the
OpenTelemetry collector as in the root README's [Getting started](../../README.md#getting-started). Then, from the
repository root, build the recorder with Go 1.26 or newer and run it in a POSIX shell (Git Bash or WSL on Windows):

```sh
go build -o out/yamcs-recorder ./cmd/yamcs-recorder

# docker-compose.yml gives TimescaleDB the password "password"
PGPASSWORD=password out/yamcs-recorder --instance fprime-project \
    --postgresql 'postgres://postgres@localhost:5432/hermes?sslmode=disable' --otlp localhost:4317
```

Set `--instance` to your YAMCS instance: `fprime-project` under fprime-yamcs, or `simulator` under stock YAMCS.

| Flag | Default | Sets |
| --- | --- | --- |
| `--yamcs` | `localhost:8091` | `host:port` of the yamcs-grpc plugin |
| `--instance` | `fprime-project` | YAMCS instance to record |
| `--processor` | `realtime` | YAMCS processor to subscribe to |
| `--postgresql` | Required | TimescaleDB database URL. Give the password in `PGPASSWORD`. |
| `--otlp` | Unset: parameters only, no events | `host:port` of the collector's OTLP gRPC receiver, for example `localhost:4317` for `docker-compose.yml`. OTLP is the OpenTelemetry protocol. |
| `--include-top-level` | `false` | Also record the parameters directly under a top-level path, such as `/Ref_Ref/FPrimeTime`, which fprime-yamcs defines for packet header fields |
| `--log-level` | `info` | `debug`, `info`, `warn` or `error` |

## What it writes

On start it creates the `timescaledb` extension and its tables if they are missing. The database itself must exist;
`docker-compose.yml` creates `hermes`.

| Where | Holds |
| --- | --- |
| `parameters` table | A row for each scalar the recorder has stored a value for, unique by instance, space system (the path above the name, such as `/Ref_Ref/CdhCore/version`), name, `member_path` and value type |
| `parameter_values` table | Each scalar value, pointing at its `parameters` row |
| Loki, with `--otlp` | Each event, as described in [Events](#events) |

`member_path` names a struct member or array element, for example `.x` or `[0]`, and is empty for a whole value.

## Events

Each event becomes one OpenTelemetry log record.

| Log record field | Holds |
| --- | --- |
| Service name | The YAMCS instance |
| Instrumentation scope | `yamcs-recorder` |
| Timestamp | Generation time, when the event's source raised it |
| Observed timestamp | Reception time, when YAMCS received it |
| Body | The event's message |
| Severity number | The event's F Prime severity, numbered as in the next table |
| `yamcs.severity`, `yamcs.source`, `yamcs.type`, `yamcs.seq_number`, `yamcs.created_by` | YAMCS's fields of the same names |
| `yamcs.extra.<key>` | Each entry of the event's `extra`. For an F Prime event, its arguments and `fprime_event_id`, `fprime_event_name` and `fprime_severity`. |

| F Prime severity | Severity number | Loki level | Events with only a YAMCS severity |
| --- | --- | --- | --- |
| `DIAGNOSTIC` | 1 | trace | |
| `COMMAND` | 5 | debug | |
| `ACTIVITY_LO` | 9 | info | `INFO` |
| `ACTIVITY_HI` | 10 | info | `WATCH` |
| `WARNING_LO` | 13 | warn | `WARNING` |
| `WARNING_HI` | 17 | error | `DISTRESS` |
| `FATAL` | 21 | fatal (critical in Grafana) | `CRITICAL`, `SEVERE` |

## Query events in Grafana

In Grafana, query events with a Loki datasource. To add one to the Hermes datasource's development Grafana, see its
[README](../../grafana-datasource-plugin/README.md#3-start-grafana-and-timescaledb).

Loki indexes the service name as the `service_name` label and keeps the other fields as structured metadata, with dots
replaced by underscores. These two queries select the events of one F Prime event type, and the events at level error
or worse:

```logql
{service_name="fprime-project"} | yamcs_type="CdhCore.cmdDisp.OpCodeDispatched"
{service_name="fprime-project"} | severity_number >= 17
```

## Limits

| When | What happens |
| --- | --- |
| YAMCS or TimescaleDB is unreachable at start, YAMCS stops, or the instance restarts | The recorder exits non-zero. Run it under a supervisor that restarts it. |
| YAMCS requires a login | The recorder can't subscribe, because it sends no credentials. |
| The recorder isn't running | Nothing is recorded. The recorder doesn't read missed values or events from the YAMCS archive later. |
| TimescaleDB goes down while the recorder runs | Values are dropped until it is back. `insert_errors` on the `recorder stats` log line, logged every 30 seconds, counts the failed writes. |
| The collector is unreachable | The recorder retries each batch of events for about 10 seconds, then drops it and logs `OpenTelemetry error`. |
| The collector requires TLS | The recorder can't reach it, because it connects without TLS. |
| Loki gets an event outside its time limits | Loki drops the event and the collector logs `Exporting failed`. With the repository's `config/loki.yml`, that is a generation time more than 10 minutes ahead, or more than about six months behind the newest event for the instance. |

## Tests

```sh
HERMES_TEST_TIMESCALE_DSN='postgres://postgres:password@localhost:5432/postgres?sslmode=disable' \
YAMCS_GRPC_ADDRESS=localhost:8091 go test ./internal/recorder/... ./cmd/yamcs-recorder/
```

| Variable | Value | Read by |
| --- | --- | --- |
| `HERMES_TEST_TIMESCALE_DSN` | A `postgres://` URL whose user can create databases. Tests skip without it. | Database tests, end-to-end test |
| `YAMCS_GRPC_ADDRESS` | `host:port` of the yamcs-grpc plugin. Tests skip without it. | YAMCS tests, end-to-end test |
| `YAMCS_INSTANCE` | Instance name, optional, default `fprime-project` | YAMCS tests, end-to-end test |

- The YAMCS event test and the end-to-end test each raise one event through YAMCS's `CreateEvent` call. The event
  stays in the instance's archive.
- The YAMCS parameter test and the end-to-end test wait for a parameter value, so the instance must be receiving
  telemetry or have a cached value from earlier telemetry.
