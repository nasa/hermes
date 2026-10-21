---
icon: brands/grafana
---

# Grafana

Grafana, a web app for charts and dashboards, reads each database through a datasource (Grafana writes "data
source"), a plugin for one kind of database:

- The Hermes datasource charts the telemetry that yamcs-recorder writes to TimescaleDB.
- Grafana's own Loki datasource searches the events that the recorder sends to Loki.

[Recording from YAMCS](recording.md) shows how to start the databases, Grafana and the recorder.

## Open Grafana

The `docker compose up -d` in [Start the databases](recording.md#start-the-databases) also starts Grafana, which
installs the Hermes datasource from the latest Hermes release as it starts. Open
[localhost:3000](http://localhost:3000) and log in with user `admin` and password `admin`. Both datasources are
already set up, as `Hermes Datasource` and `Loki`.

## Use your own Grafana

Your Grafana needs to be version 12.3.0 or newer.

### Install the Hermes datasource

Each Hermes release has the Hermes datasource as `nasa-hermes-datasource.zip`. It isn't in Grafana's plugin catalog and
Grafana hasn't signed it, so you install it from the release and allow it as an unsigned plugin. Pick the way that
matches your Grafana.

**Grafana in Docker.** Set these environment variables on the Grafana container, as the `docker-compose.yml` in Hermes
does. Grafana then downloads the datasource from the latest Hermes release when it starts:

```yaml
services:
  grafana:
    image: grafana/grafana:latest
    environment:
      GF_INSTALL_PLUGINS: "https://github.com/nasa/hermes/releases/latest/download/nasa-hermes-datasource.zip;nasa-hermes-datasource"
      GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS: nasa-hermes-datasource
```

To stay on one release instead, point `GF_INSTALL_PLUGINS` at that release's versioned zip. For the release tagged
`v<version>`:

```yaml
GF_INSTALL_PLUGINS: "https://github.com/nasa/hermes/releases/download/v<version>/nasa-hermes-datasource-<version>.zip;nasa-hermes-datasource"
```

**Grafana installed on a machine.**

1. Run the install script, which needs [jq](https://jqlang.github.io/jq/) and unzip. It downloads the datasource from
   the latest Hermes release into Grafana's plugins folder. On Linux, that folder belongs to the `grafana` user, so
   run the script with sudo. On a Mac, use `bash` instead of `sudo bash`.

    ```sh
    curl -fsSL https://raw.githubusercontent.com/nasa/hermes/main/grafana-datasource-plugin/install.sh | sudo bash
    ```

    The script finds the plugins folder of Grafana installed from a Linux package or with Homebrew on an Intel Mac.
    For any other Grafana, give it the folder by replacing `bash` with `bash -s -- <plugins-folder>`. With Homebrew
    on an Apple silicon Mac, that folder is `/opt/homebrew/var/lib/grafana/plugins`.

2. Open `grafana.ini`. It is `/etc/grafana/grafana.ini` for a Linux package. With Homebrew it is
   `/opt/homebrew/etc/grafana/grafana.ini`, or `/usr/local/etc/grafana/grafana.ini` on an Intel Mac. In its
   `[plugins]` section, set this line, and remove the `;` in front of it if there is one:

    ```ini
    allow_loading_unsigned_plugins = nasa-hermes-datasource
    ```

3. Restart Grafana, with `sudo systemctl restart grafana-server` on Linux or `brew services restart grafana` on a Mac.

### Add the Hermes datasource

1. Go to **Connections** > **Data sources**, add a new data source and search for Hermes. If Hermes isn't in the list,
   check that Grafana allows the unsigned plugin.
2. Fill in:

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
[user guide](https://github.com/nasa/hermes/blob/main/grafana-datasource-plugin/src/README.md#3-query-data) explains
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
[Query events in Grafana](https://github.com/nasa/hermes/blob/main/cmd/yamcs-recorder/README.md#query-events-in-grafana)
in the recorder's README.
