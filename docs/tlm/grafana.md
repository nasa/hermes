---
icon: brands/grafana
---

# Grafana

Grafana, a web app for charts and dashboards, reads each database through a datasource (Grafana writes "data
source"), a plugin for one kind of database:

- The Hermes datasource charts the telemetry that yamcs-recorder writes to TimescaleDB.
- Grafana's own Loki datasource searches the events that the recorder sends to Loki.

[Recording from YAMCS](recording.md) shows how to start the databases, Grafana and the recorder.

## Build the datasource

No Hermes release has the Hermes datasource yet, so build it from source. Until a release ships it, the Grafana in the
root `docker-compose.yml` loads this build. From `grafana-datasource-plugin/`:

```sh
npm install && npm run build   # frontend, needs Node.js 22 or newer
mage -v                        # backend, needs Go 1.26.5 or newer and Mage
```

The frontend is the part that runs in your browser, and the backend is the part Grafana runs to query TimescaleDB.
[Mage](https://magefile.org) is a make-like build tool for Go. Both write to `dist/`.

## Open Grafana

The `docker compose up -d` in [Start the databases](recording.md#start-the-databases) also starts Grafana. Open
[localhost:3000](http://localhost:3000) and log in with user `admin` and password `admin`. Both datasources are
already set up, as `Hermes Datasource` and `Loki`.

## Use your own Grafana

Your Grafana needs to be version 12.3.0 or newer.

1. Copy `dist/` into it and allow the unsigned plugin, as in
   [Install the plugin](https://github.com/nasa/hermes/blob/v6/grafana-datasource-plugin/src/README.md#1-install-the-plugin)
   in the datasource's user guide.
2. Go to **Connections** > **Data sources**, add a new data source, search for Hermes, and fill in:

    | Field | Value for the compose TimescaleDB |
    | --- | --- |
    | Host | `localhost:5432` from a Grafana on the same machine |
    | User | `postgres` |
    | Password | `password` |
    | Database | `hermes` |

3. Click **Save & test** to check the connection.

## Chart telemetry

1. Go to **Dashboards** > **New** > **New dashboard**, add a panel and open it for editing.
2. Pick the Hermes datasource as the panel's **Data source**.
3. Pick a parameter in **Parameter**, for example `/Ref_Ref/CdhCore/cmdDisp/CommandsDispatched`.
4. Save the dashboard.

The **Builder** / **Code** toggle at the top of the query editor switches between picking parameters from lists and
writing your own SQL. The datasource's
[user guide](https://github.com/nasa/hermes/blob/v6/grafana-datasource-plugin/src/README.md#3-query-data) explains
each field.

## Search events

1. The Grafana that `docker compose up -d` starts already has a Loki datasource. In your own Grafana on the same
   machine, go to **Connections** > **Data sources**, add a new data source of type **Loki**, set its **URL** to
   `http://localhost:3100`, and click **Save & test**.
2. Open **Explore**, Grafana's page for one-off queries, and pick the Loki datasource.
3. Switch the query editor to **Code** and run this LogQL (Loki's query language) query. It shows every event from the
   `fprime-project` instance:

    ```logql
    {service_name="fprime-project"}
    ```

The recorder tags each event with its YAMCS instance, which Loki keeps as the `service_name` label. To filter by event
type or severity, see
[Query events in Grafana](https://github.com/nasa/hermes/blob/v6/cmd/yamcs-recorder/README.md#query-events-in-grafana)
in the recorder's README.
