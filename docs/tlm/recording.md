# Recording from YAMCS

When Hermes runs against YAMCS, `yamcs-recorder` copies one YAMCS instance's telemetry into TimescaleDB and its
events into Loki, so you can plot and search them in Grafana.

## What It Records

- The value of every TELEMETERED parameter, meaning one that YAMCS decodes from downlinked telemetry, such as an
  F Prime telemetry channel. Values go into the TimescaleDB tables `parameters` and `parameter_values`. The packet
  header fields that fprime-yamcs defines are left out. To record them anyway, pass `--include-top-level`.
- With `--otlp`, every event. The recorder sends each one to an OpenTelemetry collector, which forwards it to Loki.

The recorder only records what arrives while it runs. YAMCS's own archive keeps everything, including what the
recorder missed. The [recorder's README](https://github.com/nasa/hermes/blob/main/cmd/yamcs-recorder/README.md)
describes the rows and log records it writes.

## Start the Databases

From the root of a Hermes clone, run:

```sh
docker compose up -d
```

This starts TimescaleDB on port 5432 (user `postgres`, password `password`, database `hermes`), Loki, an OpenTelemetry
collector on port 4317 and Grafana on [localhost:3000](http://localhost:3000). Grafana comes with the Hermes data
source for TimescaleDB and a Loki data source already set up.

## Get the Recorder

The Hermes release archives for Linux and macOS include `yamcs-recorder`. To build it from a clone instead, run
`make out/yamcs-recorder`. Put the binary at a fixed absolute path, such as `/opt/hermes/yamcs-recorder`.

## Run It from YAMCS

The recorder exits when YAMCS stops or its instance restarts, so something has to start it again. YAMCS can do that
with its ProcessRunner service, which runs a command next to YAMCS, writes the command's output to the YAMCS log, and
with `restart: always` starts it again within 5 seconds of it exiting.

The recorder talks to YAMCS through Hermes's
[yamcs-grpc plugin](https://github.com/nasa/hermes/tree/main/yamcs-grpc-plugin), so YAMCS must load that plugin too.

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
- To record more than one instance, add one entry per instance, each with its own `name` and `--instance`.

Then start fprime-yamcs with `--yamcs-config-dir yamcs-config`. The recorder's output shows up in the YAMCS log,
including a `recorder stats` line every 30 seconds.

## View It in Grafana

In Grafana, query telemetry with the Hermes data source, as described on the [Grafana](./grafana.md) page. Query events
with the Loki data source, by instance name:

```
{service_name="fprime-project"}
```
