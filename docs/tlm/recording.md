---
icon: fontawesome/solid/database
---

# Recording from YAMCS

yamcs-recorder copies one YAMCS instance's telemetry into TimescaleDB and, with `--otlp`, its events into Loki.

!!! abstract "Before you start"

    - YAMCS running with the yamcs-grpc plugin, as in
      [Running Your F Prime Deployment](../getting-started/quick-start.md#running-your-f-prime-deployment). The recorder reads
      from YAMCS through the plugin.
    - [Docker](https://docs.docker.com/get-docker/), to run the databases and Grafana.
    - A Hermes clone. Its `docker-compose.yml` and `config` folder start the databases and Grafana:

        ```sh
        git clone https://github.com/nasa/hermes.git
        ```

## What it records

| What | Where it goes | When |
| --- | --- | --- |
| Values of telemetered parameters, meaning the ones YAMCS decodes from downlinked telemetry, such as F Prime telemetry channels | TimescaleDB tables `parameters` and `parameter_values` | By default |
| The SCLK of each F Prime value, the flight software's clock reading from the header of the packet the value came from | The `sclk_us` column of `parameter_values` | By default |
| Parameters directly under the top-level path, the first part of a YAMCS path (`/Ref_Ref` in `/Ref_Ref/FPrimeTime`). fprime-yamcs puts one there for each packet header field. | The same tables | Left out unless you pass `--include-top-level` |
| Every YAMCS event, such as an F Prime event (a log message from the flight software) | Loki, through the OpenTelemetry collector | Only with `--otlp` |

The recorder's README lists
[what it writes](https://github.com/nasa/hermes/blob/main/cmd/yamcs-recorder/README.md#what-it-writes) and its
[limits](https://github.com/nasa/hermes/blob/main/cmd/yamcs-recorder/README.md#limits).

## Start the databases

From the top folder of your Hermes clone, the repository root, start the databases, the collector and Grafana:

```sh
docker compose up -d
```

| Service | Address | Details |
| --- | --- | --- |
| TimescaleDB | `localhost:5432` | User `postgres`, password `password`, database `hermes` |
| OpenTelemetry collector | `localhost:4317` | Receives the recorder's events and passes them to Loki |
| Loki | `localhost:3100` | Stores the events |
| Grafana | `localhost:3000` | User `admin`, password `admin`. See [Grafana](grafana.md). |

## Download the recorder

yamcs-recorder comes in the `hermes-v<version>-<platform>.tar.gz` archive on the
[Hermes releases page](https://github.com/nasa/hermes/releases). Download the one for your computer: `linux-amd64` for
most Linux PCs and WSL, `linux-arm64` for ARM Linux, `darwin-amd64` for an Intel Mac or `darwin-arm64` for an Apple
silicon Mac. Then unpack it:

```sh
tar -xvf hermes-v<version>-<platform>.tar.gz
```

This puts `yamcs-recorder` and Hermes's other command-line tools in the current folder.

To try it, run it by hand while YAMCS runs, and stop it with Ctrl+C when you're done:

```sh
PGPASSWORD=password ./yamcs-recorder --instance fprime-project \
    --postgresql 'postgres://postgres@localhost:5432/hermes?sslmode=disable' --otlp localhost:4317
```

| Part | What it does |
| --- | --- |
| `PGPASSWORD=password` | Gives TimescaleDB's password, which the `--postgresql` URL leaves out |
| `--instance fprime-project` | Records the instance `fprime-project`, the name fprime-yamcs gives its instance |
| `--postgresql ...` | Says where TimescaleDB is |
| `--otlp localhost:4317` | Sends events to the collector over OTLP, OpenTelemetry's protocol. Leave it out to record telemetry only. |

The recorder connects to the yamcs-grpc plugin at `localhost:8091` unless you pass `--yamcs`. Its README lists
[every flag](https://github.com/nasa/hermes/blob/main/cmd/yamcs-recorder/README.md#run).

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

From the folder where you unpacked the archive, copy `yamcs-recorder` to a fixed absolute path, for example
`/opt/hermes/yamcs-recorder`:

```sh
sudo mkdir -p /opt/hermes && sudo cp yamcs-recorder /opt/hermes/
```

Then, in `yamcs-config/etc/yamcs.yaml`, add this entry to the end of the `services` list, after the `HttpServer`
entry that is already there:

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

Stop fprime-yamcs with Ctrl+C. Then start it again from the folder that holds `yamcs-config`, this time with your
config directory. Replace `<yamcs-grpc>` with the yamcs-grpc plugin folder, as in
[Running Your F Prime Deployment](../getting-started/quick-start.md#running-your-f-prime-deployment):

```sh
fprime-yamcs --yamcs-config-dir yamcs-config --yamcs-plugin-jars <yamcs-grpc>
```

The recorder's output shows up in the YAMCS log, including a `recorder stats` line every 30 seconds.
