# yamcs-recorder

Records the TELEMETERED parameters of a YAMCS instance into TimescaleDB, through the yamcs-grpc plugin.

```sh
PGPASSWORD=... go run ./cmd/yamcs-recorder --yamcs localhost:8091 --instance fprime-project \
    --postgresql 'postgres://postgres@localhost:5432/hermes?sslmode=disable'
```

On start it creates the `timescaledb` extension, the `parameters` table and the `parameter_values` hypertable if
they are missing. Each value becomes one row per scalar, with struct members and array elements named in
`member_path` (`.member`, `[0]`).

It leaves out parameters directly in a top-level space system, such as `/Ref_Ref/FPrimeTime`, where
fprime-yamcs puts the CCSDS and F Prime packet header fields. To record them anyway, pass `--include-top-level`.

YAMCS sends each parameter's cached value first. After a restart, that value is dropped if it is already stored.

The recorder exits non-zero when the subscription ends, for example when YAMCS stops or its instance restarts, so
run it under a supervisor that restarts it.

If a write to TimescaleDB fails, for example while the database is down, the values in that message are dropped.
The recorder keeps running and writes again once the database is back. Each failed write adds one to `insert_errors`
on the `recorder stats` line, which it logs every 30 seconds.

## Tests

The store tests need `HERMES_TEST_TIMESCALE_DSN`, a `postgres://` URL whose user can create databases. The
subscription tests need `YAMCS_GRPC_ADDRESS` and read `YAMCS_INSTANCE` (default `fprime-project`). Without them,
those tests skip. The event subscription test raises one event through YAMCS's `CreateEvent` call, and the event
stays in that instance's archive.

```sh
HERMES_TEST_TIMESCALE_DSN='postgres://postgres:password@localhost:5432/postgres?sslmode=disable' \
YAMCS_GRPC_ADDRESS=localhost:8091 go test ./internal/recorder/... ./cmd/yamcs-recorder/
```
