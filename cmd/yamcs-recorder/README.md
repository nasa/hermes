# yamcs-recorder

yamcs-recorder records the telemetered parameters of a YAMCS instance in TimescaleDB, where Grafana charts them with
the [Hermes datasource](../../grafana-datasource-plugin/src/README.md). With `--otlp`, it also sends the instance's
events through an OpenTelemetry collector to Loki.

```mermaid
flowchart LR
    yamcs["YAMCS with yamcs-grpc"] -->|"parameters, events"| rec["yamcs-recorder"]
    rec -->|"parameters"| ts[("TimescaleDB")]
    rec -->|"events"| otel["OpenTelemetry collector"] --> loki[("Loki")]
    ts -->|"Hermes datasource"| graf["Grafana"]
    loki --> graf
```

## Run

Start YAMCS with the [yamcs-grpc plugin](../../yamcs-grpc-plugin/README.md#run), and the TimescaleDB, collector, Loki
and Grafana services in the root [`docker-compose.yml`](../../docker-compose.yml). Then, from the repo root:

```sh
# docker-compose.yml gives TimescaleDB the password "password"
PGPASSWORD=password go run ./cmd/yamcs-recorder --yamcs localhost:8091 --instance fprime-project \
    --postgresql 'postgres://postgres@localhost:5432/hermes?sslmode=disable' --otlp localhost:4317
```

| Flag | Default | Use |
| --- | --- | --- |
| `--yamcs` | `localhost:8091` | `host:port` of the yamcs-grpc plugin |
| `--instance` | `fprime-project` | YAMCS instance to record |
| `--processor` | `realtime` | YAMCS processor to subscribe to |
| `--postgresql` | required | TimescaleDB database URL. Give the password in `PGPASSWORD`. |
| `--otlp` | unset: parameters only, no events | `host:port` of the collector's OTLP gRPC receiver, for example `localhost:4317` for `docker-compose.yml` |
| `--include-top-level` | `false` | Also record parameters directly in a top-level space system, such as `/Ref_Ref/FPrimeTime`, where fprime-yamcs puts packet header fields |
| `--log-level` | `info` | `debug`, `info`, `warn` or `error` |

## What it writes

On start it creates the `timescaledb` extension and its tables if they are missing. The database itself must exist;
`docker-compose.yml` creates `hermes`.

| Where | One entry per |
| --- | --- |
| `parameters` table | scalar it has stored a value for, by instance, space system, name, `member_path` (for example `.x` or `[0]`, empty for a whole value) and value type. A type change in a new dictionary adds a row, so Grafana shows each type as its own series. |
| `parameter_values` table | scalar value, pointing at its `parameters` row |
| Loki, with `--otlp` | event, as described in [Events](#events) |

## Events

Each event becomes one OpenTelemetry log record.

| Log record field | Holds |
| --- | --- |
| Service name | the YAMCS instance |
| Instrumentation scope | `yamcs-recorder` |
| Timestamp | generation time, when the event's source raised it |
| Observed timestamp | reception time, when YAMCS received it |
| Body | the event's message |
| Severity number | the event's F Prime severity, numbered as in the next table |
| `yamcs.severity`, `yamcs.source`, `yamcs.type`, `yamcs.seq_number`, `yamcs.created_by` | YAMCS's fields of the same names |
| `yamcs.extra.<key>` | each entry of the event's `extra`. For an F Prime event, its arguments and `fprime_event_id`, `fprime_event_name` and `fprime_severity`. |

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

Use the Loki datasource that `docker-compose.yml` sets up in Grafana. Loki indexes the service name as the
`service_name` label and keeps the other fields as structured metadata, with dots replaced by underscores. These two
queries select the events of one F Prime event type, and the events at level error or worse:

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
| Loki gets an event outside its time limits | Loki drops the event and the collector logs `Exporting failed`. With the repo's `config/loki.yml`, that is a generation time more than 10 minutes ahead, or more than about six months behind the newest event for the instance. |

## Tests

```sh
HERMES_TEST_TIMESCALE_DSN='postgres://postgres:password@localhost:5432/postgres?sslmode=disable' \
YAMCS_GRPC_ADDRESS=localhost:8091 go test ./internal/recorder/... ./cmd/yamcs-recorder/
```

| Variable | Value | Read by |
| --- | --- | --- |
| `HERMES_TEST_TIMESCALE_DSN` | a `postgres://` URL whose user can create databases. Tests skip without it. | database tests, end-to-end test |
| `YAMCS_GRPC_ADDRESS` | `host:port` of the yamcs-grpc plugin. Tests skip without it. | YAMCS tests, end-to-end test |
| `YAMCS_INSTANCE` | instance name, optional, default `fprime-project` | YAMCS tests, end-to-end test |

- The YAMCS event test and the end-to-end test each raise one event through YAMCS's `CreateEvent` call. The event
  stays in the instance's archive.
- The YAMCS parameter test and the end-to-end test wait for a parameter value, so the instance must be receiving
  telemetry or have a cached value from earlier telemetry.
