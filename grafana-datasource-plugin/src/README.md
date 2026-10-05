<!-- [![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.downloads&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Downloads&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Marketplace Version](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Marketplace&prefix=v&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Grafana Dependency](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.grafanaDependency&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Grafana&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Signature](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.versionSignatureType&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Signature&color=brightgreen)](https://grafana.com/grafana/plugins/nasa-hermes-datasource) -->
![License](https://img.shields.io/badge/License-Apache%202.0-blue)

# Hermes Datasource

## Overview

**Hermes** is a Grafana backend datasource plugin that connects to a [TimescaleDB](https://www.timescale.com/) database to query and visualize **telemetry** data from NASA's [Hermes ground data system (GDS)](https://github.com/nasa/hermes).

The plugin provides a multi-select query editor for querying telemetry, making it easy to build dashboards over spacecraft telemetry without writing raw SQL. Multiple parameters, instances, and members can be selected in a single query to overlay or compare data series. Additionally you can write custom SQL queries.

## Requirements

- **Grafana** >= 12.3.0
- **TimescaleDB** (PostgreSQL with the TimescaleDB extension); the plugin reads the `parameters` table and `parameter_values` hypertable that [yamcs-recorder](https://github.com/nasa/hermes/tree/v6/cmd/yamcs-recorder) creates on start. See [Hermes](https://github.com/nasa/hermes) for help.

## Getting Started

### 1. Install the plugin

Install the plugin into your Grafana instance. Once installed, restart Grafana if required.

### 2. Configure the datasource

Navigate to **Connections > Data sources > Add new data source** and search for **Hermes**, then fill in the connection details.

Click **Save & Test** to verify connectivity.

### 3. Query data

Create a new panel and select **Hermes**. Use the **Builder / Code** toggle at the top of the query editor to switch modes.

#### Builder: Telemetry

Select **Telemetry** in the bottom-right toggle. Queries time-series values from the `parameter_values` hypertable.

| Field           | Type                   | Description                                                                                                                               |
| --------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Parameter**   | multi-select, required | One or more YAMCS parameters, shown as `/space_system/name`. Each parameter, member and instance becomes its own series.                  |
| **Aggregation** | select                 | Function applied per time bucket: `Average`, `Min`, `Max`, `Count`, `First`, `Last`, `Sum`, `Derivative`, `Raw (none)`, `Latest Value`.   |
| **Instance**    | multi-select, optional | YAMCS instance. Leave empty to include all instances.                                                                                     |
| **Members**     | multi-select, optional | Struct members and array elements (e.g. `[0]`, `.x`). Appears per parameter only when there are several. Adding the parameter selects all of its members; remove the ones you don't need. Clearing the box removes the parameter. |
| **Value Transform** | text, optional     | *(Collapsible)* Rescale or convert values per parameter, or per member for struct and array parameters. See below.                        |

<br>

##### Value Transform

Each selected parameter gets its own input. Enter a plain number to multiply by it, or any PostgreSQL expression using `$__value` in place of the stored value.

| Input                       | Result                    |
| --------------------------- | ------------------------- |
| *(blank)*                   | No transform              |
| `2`                         | `$__value * 2`            |
| `0.001`                     | Milli → base units        |
| `$__value - 273.15`         | Kelvin → Celsius          |
| `$__value * 9.0/5.0 + 32`   | Celsius → Fahrenheit      |
| `ABS($__value)`             | Any PostgreSQL function   |
| `$__value * $gain`          | Combined with a dashboard variable |

The transform is compiled into the generated SQL and applied before aggregation, so it carries over when you switch to Code mode and stays correct for `Min` / `Max` with negative factors.

Notes:

- Applies to **numeric parameters only**. Boolean, string, and byte values are returned unchanged.
- Use `$__value`, not `$v` — Grafana reserves the `$__` prefix, so the token can never be shadowed by a dashboard variable.
- `Count` counts the transformed expression, so an expression that changes null-ness (such as `COALESCE($__value, 0)`) will also change the count.

<br>

#### Builder: Events

The Events query type is hidden because yamcs-recorder only records telemetry.

<br>

#### Builder: Shared options

Available for all query types:

| Field                  | Description                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| **Time Field**         | `Generation Time` (when the value was produced, the default) or `Acquisition Time` (when YAMCS received it) |
| **From / To Override** | *(Advanced, collapsible)* Pin the query to an absolute time range, ignoring the dashboard time picker. |

<br>

#### Code Mode

Raw SQL editor. Switching from Builder → Code pre-populates the editor with the generated SQL. Switching back to Builder will warn if you have made manual edits.


## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
