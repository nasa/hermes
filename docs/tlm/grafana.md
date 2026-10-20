---
icon: brands/grafana
---

# Grafana

Grafana charts the telemetry that yamcs-recorder writes to TimescaleDB with the Hermes datasource, and searches the
events it sends to Loki with Grafana's own Loki datasource. [Recording from YAMCS](recording.md) shows how to start
the databases and the recorder.

## Install the v6 Datasource

No Hermes release has the v6 datasource yet, so build it from source. From `grafana-datasource-plugin/` in a clone of
the `v6` branch:

```sh
npm install && npm run build   # frontend, needs Node.js 22 or newer
mage -v                        # backend, needs Go and Mage (magefile.org)
```

Then load it into Grafana 12.3.0 or newer:

1. Copy `dist/` into Grafana's plugins directory as `nasa-hermes-datasource`, for example
   `/var/lib/grafana/plugins/nasa-hermes-datasource`.
2. Builds from source aren't signed, so allow the plugin with the environment variable
   `GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=nasa-hermes-datasource`, or in `grafana.ini`:

    ```ini
    [plugins]
    allow_loading_unsigned_plugins = nasa-hermes-datasource
    ```

3. Restart Grafana.

!!! tip "Try it in the development Grafana"
    Until a release has the v6 datasource, the Grafana in the root `docker-compose.yml` fails to download it and
    doesn't start. The datasource's development setup runs its own Grafana, which loads `dist/` and already has the
    TimescaleDB connection, but no Loki datasource. It uses the same ports as the Grafana and TimescaleDB in the root
    `docker-compose.yml`, so stop those first:

    ```sh
    docker compose stop grafana timescaledb         # from the repo root
    cd grafana-datasource-plugin && npm run server
    ```

    Its database starts empty. It has the same port, user, password and database as the TimescaleDB in
    `docker-compose.yml`, so yamcs-recorder writes to it with the same flags. See
    [Develop](https://github.com/nasa/hermes/blob/v6/grafana-datasource-plugin/README.md#develop) in the datasource's
    README.

## Connect to TimescaleDB

The Grafana in `docker-compose.yml` and the development Grafana come with this connection. In another Grafana, go to
Connections > Data sources > Add new data source, search for Hermes, and fill in:

| Field | Value for the TimescaleDB in `docker-compose.yml` |
| --- | --- |
| Host | `localhost:5432` from a Grafana on the same machine, or `timescaledb:5432` from a container in the same compose project |
| User | `postgres` |
| Password | `password` |
| Database | `hermes` |

Click Save & Test to check the connection.

## Chart Telemetry

Create a panel and pick the Hermes datasource. The Builder / Code toggle at the top of the query editor switches
between picking parameters from lists and writing your own SQL. The datasource's
[user guide](https://github.com/nasa/hermes/blob/v6/grafana-datasource-plugin/src/README.md) explains each Builder
field, Value Transform and Code mode.

## Search Events

In Explore or a panel, pick the Loki datasource. The recorder sends each event with its YAMCS instance as the service
name, and Loki keeps that as the `service_name` label. This query shows every event from the `fprime-project`
instance:

```logql
{service_name="fprime-project"}
```

- The Grafana in `docker-compose.yml` has a Loki datasource, named Loki. In another Grafana, add one whose URL
  reaches Loki on port 3100. That is `http://localhost:3100` from a Grafana installed on the same machine, or
  `http://host.docker.internal:3100` from a container on Docker Desktop, such as the development Grafana.
- To filter by event type or severity, see
  [Query events in Grafana](https://github.com/nasa/hermes/blob/v6/cmd/yamcs-recorder/README.md#query-events-in-grafana)
  in the recorder's README.
