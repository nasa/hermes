---
icon: fontawesome/solid/database
---

# Recording from YAMCS

`yamcs-recorder` copies one YAMCS instance's telemetry into TimescaleDB and its events into Loki, so you can chart and
search them in Grafana.

## What It Records

- The value of every TELEMETERED parameter, meaning one that YAMCS decodes from downlinked telemetry, such as an
  F Prime telemetry channel. The recorder writes them to the TimescaleDB tables `parameters` and `parameter_values`.
  fprime-yamcs, which runs YAMCS for an F Prime deployment, also defines a parameter for each packet header field.
  The recorder leaves those out. To record them anyway, pass `--include-top-level`.
- With `--otlp`, every event. The recorder sends each one to an OpenTelemetry collector, which forwards it to Loki.

The recorder only records what arrives while it runs, and doesn't fill gaps from the YAMCS archive later. Loki drops
an event whose generation time is too far in the future, or too far behind the newest event from the same instance.
[`config/loki.yml`](https://github.com/nasa/hermes/blob/v6/config/loki.yml) sets how far behind it can be. The
recorder's README describes
[what it writes](https://github.com/nasa/hermes/blob/v6/cmd/yamcs-recorder/README.md#what-it-writes) and its
[limits](https://github.com/nasa/hermes/blob/v6/cmd/yamcs-recorder/README.md#limits).

## Start the Databases

From the root of a Hermes clone, run:

```sh
docker compose up -d
```

| Service | Address | Details |
| --- | --- | --- |
| TimescaleDB | `localhost:5432` | User `postgres`, password `password`, database `hermes` |
| OpenTelemetry collector | `localhost:4317` | Receives events from the recorder's `--otlp` over gRPC |
| Loki | `localhost:3100` | Receives events from the collector |
| Grafana | [localhost:3000](http://localhost:3000) | Login `admin` / `admin`, with a Hermes datasource and a Loki datasource set up |

!!! warning
    This Grafana downloads the Hermes datasource from the latest Hermes release when it starts. No release has the v6
    datasource yet, so the download fails and Grafana doesn't start. Until one does, chart telemetry in the
    datasource's development Grafana, as described in
    [Install the v6 Datasource](grafana.md#install-the-v6-datasource).

## Get the Recorder

From the root of a Hermes clone on the `v6` branch, build it with Go 1.26 or newer:

```sh
make out/yamcs-recorder
```

To try it while YAMCS runs with the yamcs-grpc plugin, run it by hand. It connects to the plugin at `localhost:8091`
by default:

```sh
PGPASSWORD=password out/yamcs-recorder --instance fprime-project \
    --postgresql 'postgres://postgres@localhost:5432/hermes?sslmode=disable' --otlp localhost:4317
```

The [Run](https://github.com/nasa/hermes/blob/v6/cmd/yamcs-recorder/README.md#run) section of its README lists every
flag. To keep it running, copy the binary to a fixed absolute path, such as `/opt/hermes/yamcs-recorder`, and have
YAMCS run it.

## Run It from YAMCS

The recorder exits when YAMCS stops or its instance restarts, so something has to start it again. YAMCS can do that
with its ProcessRunner service, which runs a command next to YAMCS, writes the command's output to the YAMCS log, and
with `restart: always` starts it again within 5 seconds of it exiting.

The recorder talks to YAMCS through Hermes's
[yamcs-grpc plugin](https://github.com/nasa/hermes/tree/v6/yamcs-grpc-plugin), so YAMCS must load that plugin too.

### Get a YAMCS Config Directory

fprime-yamcs starts YAMCS with the config directory you pass to `--yamcs-config-dir`, in place of its built-in one.
If you don't have your own yet, start from a copy of the built-in one. Run this in the Python environment where
fprime-yamcs is installed:

```sh
config=$(python -c "from importlib.resources import files; print(files('fprime_yamcs') / 'yamcs/src/main/yamcs')")
cp -r "$config" yamcs-config
```

### Add the Recorder

In `yamcs-config/etc/yamcs.yaml`, add this entry to the end of the `services` list, after the `HttpServer` entry that
is already there:

```yaml
  - class: org.yamcs.ProcessRunner
    name: recorder-fprime-project
    args:
      command: [/opt/hermes/yamcs-recorder, --instance, fprime-project,
                --postgresql, "postgres://postgres@localhost:5432/hermes?sslmode=disable",
                --otlp, localhost:4317]
      environment:
        PGPASSWORD: password
      restart: always
```

- Use an absolute path. If YAMCS cannot run the command, YAMCS itself fails to start and logs `Could not start Yamcs`.
- To keep the password out of the file, leave out `environment` and set `PGPASSWORD` before you start fprime-yamcs.
  YAMCS passes its environment on to the recorder.
- The recorder connects to the plugin at `localhost:8091`, the plugin's default port. If you set another port under
  `yamcs-grpc` in the same file, add `--yamcs, localhost:<port>` to the `command` list.
- One recorder records one instance. To record more than one, add one entry per instance, each with its own `name` and
  `--instance`.

Then start fprime-yamcs with `--yamcs-config-dir yamcs-config`, along with the `--yamcs-plugin-jars` option that loads
the yamcs-grpc plugin. The recorder's output shows up in the YAMCS log, including a `recorder stats` line every 30
seconds.

## View It in Grafana

Chart telemetry with the Hermes datasource and search events with the Loki datasource, as described on the
[Grafana](grafana.md) page.
