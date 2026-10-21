---
icon: fontawesome/solid/database
---

# Recording from YAMCS

yamcs-recorder copies one YAMCS instance's telemetry into TimescaleDB and, with `--otlp`, its events into Loki.

!!! abstract "Before you start"

    - YAMCS running with the yamcs-grpc plugin, as in the [Quick Start](../getting-started/quick-start.md). The
      recorder reads from YAMCS through the plugin.
    - [Docker](https://docs.docker.com/get-docker/), to run the databases and Grafana.
    - [Go](https://go.dev/dl/) 1.26 or newer and make, to build the recorder.
    - [Node.js](https://nodejs.org/) 22 or newer and [Mage](https://magefile.org), to build the Hermes datasource for
      Grafana.
    - A Hermes clone. Commands on this page run from its top folder, the repository root, unless they say otherwise:

        ```sh
        git clone --branch v6 https://github.com/nasa/hermes.git
        ```

## What it records

| What | Where it goes | When |
| --- | --- | --- |
| Values of telemetered parameters, meaning the ones YAMCS decodes from downlinked telemetry, such as F Prime telemetry channels | TimescaleDB tables `parameters` and `parameter_values` | By default |
| Parameters directly under the top-level path, the first part of a YAMCS path (`/Ref_Ref` in `/Ref_Ref/FPrimeTime`). fprime-yamcs puts one there for each packet header field. | The same tables | Left out unless you pass `--include-top-level` |
| Every YAMCS event, such as an F Prime event (a log message from the flight software) | Loki, through the OpenTelemetry collector | Only with `--otlp` |

The recorder records only what arrives while it runs. It doesn't fill gaps later from the YAMCS archive, the history
YAMCS keeps. Its README lists
[what it writes](https://github.com/nasa/hermes/blob/v6/cmd/yamcs-recorder/README.md#what-it-writes) and its
[limits](https://github.com/nasa/hermes/blob/v6/cmd/yamcs-recorder/README.md#limits), such as when Loki drops an event.

## Start the databases

First build the Hermes datasource once, as in [Build the datasource](grafana.md#build-the-datasource), so Grafana can
load it. Then start the databases, the collector and Grafana:

```sh
docker compose up -d
```

| Service | Address | Details |
| --- | --- | --- |
| TimescaleDB | `localhost:5432` | User `postgres`, password `password`, database `hermes` |
| OpenTelemetry collector | `localhost:4317` | Receives the recorder's events and passes them to Loki |
| Loki | `localhost:3100` | Stores the events |
| Grafana | `localhost:3000` | User `admin`, password `admin`. See [Grafana](grafana.md). |

## Build the recorder

```sh
make out/yamcs-recorder
```

To try it, run it by hand while YAMCS runs, and stop it with Ctrl+C when you're done:

```sh
PGPASSWORD=password out/yamcs-recorder --instance fprime-project \
    --postgresql 'postgres://postgres@localhost:5432/hermes?sslmode=disable' --otlp localhost:4317
```

| Part | What it does |
| --- | --- |
| `PGPASSWORD=password` | Gives TimescaleDB's password, which the `--postgresql` URL leaves out |
| `--instance fprime-project` | Records the instance `fprime-project`, the name fprime-yamcs gives its instance |
| `--postgresql ...` | Says where TimescaleDB is |
| `--otlp localhost:4317` | Sends events to the collector over OTLP, OpenTelemetry's protocol. Leave it out to record telemetry only. |

The recorder connects to the yamcs-grpc plugin at `localhost:8091` unless you pass `--yamcs`. Its README lists
[every flag](https://github.com/nasa/hermes/blob/v6/cmd/yamcs-recorder/README.md#run).

## Run it from YAMCS

The recorder exits when YAMCS stops or its instance restarts. YAMCS's ProcessRunner service can run the recorder
alongside YAMCS and, with `restart: always`, restart it within 5 seconds. The recorder's output then goes to the YAMCS
log.

### Get a YAMCS config directory

fprime-yamcs starts YAMCS with its built-in config directory unless you pass your own with `--yamcs-config-dir`. If
you don't have one yet, copy the built-in one. Run this where you start fprime-yamcs, with its Python environment
active:

```sh
config=$(python -c "from importlib.resources import files; print(files('fprime_yamcs') / 'yamcs/src/main/yamcs')")
cp -r "$config" yamcs-config
```

### Add the recorder

Copy `out/yamcs-recorder` to a fixed absolute path, for example `/opt/hermes/yamcs-recorder`. Then, in
`yamcs-config/etc/yamcs.yaml`, add this entry to the end of the `services` list, after the `HttpServer` entry that is
already there:

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

- If YAMCS can't run the command, YAMCS itself fails to start and logs `Could not start Yamcs`.
- To keep the password out of the file, leave out `environment` and set `PGPASSWORD` before you start fprime-yamcs.
  YAMCS passes its environment on to the recorder.
- If you set a port other than 8091 under `yamcs-grpc` in the same file, add `--yamcs, localhost:<port>` to the
  `command` list.
- One recorder records one instance. To record more than one, add one entry per instance, each with its own `name` and
  `--instance`.

### Start fprime-yamcs

Restart fprime-yamcs with your config directory. `--yamcs-plugin-jars` loads the yamcs-grpc plugin from
`yamcs-grpc-plugin/out/lib`, where its `./build.sh` puts the jars. Replace `<hermes>` with the path to your Hermes
clone:

```sh
fprime-yamcs --yamcs-config-dir yamcs-config --yamcs-plugin-jars <hermes>/yamcs-grpc-plugin/out/lib
```

The recorder's output shows up in the YAMCS log, including a `recorder stats` line every 30 seconds.
