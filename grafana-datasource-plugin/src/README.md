<!-- [![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.downloads&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Downloads&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Marketplace Version](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Marketplace&prefix=v&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Grafana Dependency](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.grafanaDependency&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Grafana&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Signature](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.versionSignatureType&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Signature&color=brightgreen)](https://grafana.com/grafana/plugins/nasa-hermes-datasource) -->
![License](https://img.shields.io/badge/License-Apache%202.0-blue)

# Hermes datasource

The Hermes datasource charts the telemetry that
[yamcs-recorder](https://github.com/nasa/hermes/tree/main/cmd/yamcs-recorder) records from [YAMCS](https://yamcs.org), a
mission control server, into [TimescaleDB](https://www.timescale.com/). It is part of NASA's
[Hermes](https://github.com/nasa/hermes/tree/main) ground data system and has two query modes:

- Builder: pick parameters, instances and struct members from lists, with no SQL.
- Code: write your own SQL.

Events are not in TimescaleDB. With `--otlp`, yamcs-recorder sends them through an OpenTelemetry collector to Loki, so
query them with Grafana's Loki datasource
([examples](https://github.com/nasa/hermes/tree/main/cmd/yamcs-recorder#query-events-in-grafana)).

## Requirements

- Grafana 12.3.0 or newer.
- TimescaleDB with the `parameters` and `parameter_values` tables, which yamcs-recorder creates on start.

## Getting started

### 1. Install the plugin

Hermes releases so far ship an older version of this plugin that reads different tables. Until a release ships this
one, build it from source:

```sh
git clone https://github.com/nasa/hermes.git
cd hermes/grafana-datasource-plugin
npm install && npm run build   # frontend, needs Node.js 22 or newer
mage -v                        # backend, needs Go and Mage (magefile.org)
```

Then:

1. Copy `dist/` into Grafana's plugins directory as `nasa-hermes-datasource`, for example
   `/var/lib/grafana/plugins/nasa-hermes-datasource`.
2. Builds from source aren't signed, so allow the plugin with
   `GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=nasa-hermes-datasource`, or with
   `allow_loading_unsigned_plugins = nasa-hermes-datasource` under `[plugins]` in `grafana.ini`.
3. Restart Grafana.

### 2. Configure the datasource

Go to **Connections** > **Data sources** > **Add new data source**, search for Hermes, and fill in every field:

| Field    | Value                            | With Hermes's [`docker-compose.yml`](https://github.com/nasa/hermes/blob/main/docker-compose.yml) |
| -------- | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Host     | TimescaleDB's `host:port`        | `localhost:5432`, or `timescaledb:5432` from a Grafana in the same compose project              |
| User     | The database user                | `postgres`                                                                                      |
| Password | That user's password             | `password`                                                                                      |
| Database | The one yamcs-recorder writes to | `hermes`                                                                                        |

Click **Save & Test** to check the connection.

### 3. Query data

Create a panel and pick your Hermes datasource. The **Builder** / **Code** toggle at the top of the query editor
switches modes.

#### Builder mode

| Field                              | What it does                                                                                                                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parameter                          | Required. YAMCS parameters, shown by their path, such as `/Ref_Ref/CdhCore/version/FrameworkVersion`, or a dashboard variable. Each parameter, member, instance and value type gets its own series.         |
| Aggregation                        | Reduces each time bucket of the panel's interval to one value. `Average` is the default. `Raw (none)` returns every sample and `Latest Value` only the newest.                                              |
| Instance                           | YAMCS instances to include. Empty means all.                                                                                                                                                                |
| Members (one box per parameter)    | Shown for a parameter with several struct members or array elements, for example `.x` or `[0]`. Starts with all selected; remove the ones you don't need. Clearing it removes the parameter from the query. |
| Generation Time / Acquisition Time | Which time to plot: when the value was produced (the default) or when YAMCS received it.                                                                                                                    |
| Value Transform                    | Collapsible. Rescales values or renames series, per parameter or per member. See below.                                                                                                                     |
| From / To Override                 | Under Advanced. Pins the query to an absolute time range instead of the dashboard's.                                                                                                                        |

`Average` and `Sum` don't work on string or enum parameters. On a boolean, `Average` is the fraction of true samples and
`Sum` counts them.

#### Value Transform

Enter a plain number to multiply by it, or a PostgreSQL expression with `$__value` in place of the stored value. The
transform applies to each sample before aggregation.

| Example input       | Gives                                              |
| ------------------- | -------------------------------------------------- |
| `0.001`             | Milli to base units (`$__value * 0.001`)           |
| `$__value - 273.15` | Kelvin to Celsius                                  |
| `ABS($__value)`     | The absolute value. Any PostgreSQL function works. |
| `$__value * $gain`  | The value scaled by the dashboard variable `$gain` |

- Transforms apply to numeric parameters only. Boolean, string and byte values pass through unchanged.
- `Count` ignores the transform.
- The Display name field under each input renames that series in the legend and tooltips.

#### Code mode

Switching to Code fills a SQL editor with the builder's query. Dashboard variables such as `$instance` are filled in
before it runs; use `${instance:sqlstring}` to have them quoted, for example `WHERE p.instance IN (${instance:sqlstring})`.
These macros are expanded on the server:

| Macro                   | Expands to                                                            |
| ----------------------- | --------------------------------------------------------------------- |
| `$__timeFilter(column)` | `column >= '<from>' AND column <= '<to>'` for the dashboard range     |
| `$__timeFrom(column)`   | `column >= '<from>'`                                                  |
| `$__timeTo(column)`     | `column <= '<to>'`                                                    |
| `$__interval`           | The panel interval as a PostgreSQL interval, for use in `time_bucket` |
| `$__interval_ms`        | The panel interval in milliseconds                                    |

SQL whose columns are the builder's, in the same order, is drawn as one series per parameter, member and instance.
Those columns are `time_bucket`, `space_system`, `name`, `instance`, `value_type`, `member_path`, `val_int`,
`val_float`, `val_bool`, `val_str` and `val_bytes`. Any other result comes back as a table.

A query saved in Code mode reopens in Code mode. Switching back to Builder drops your edits, after offering to copy
them.

## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
