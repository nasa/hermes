<!-- [![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.downloads&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Downloads&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Marketplace Version](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Marketplace&prefix=v&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Grafana Dependency](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.grafanaDependency&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Grafana&color=F47A20)](https://grafana.com/grafana/plugins/nasa-hermes-datasource)
[![Signature](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.versionSignatureType&url=https://grafana.com/api/plugins/nasa-hermes-datasource&label=Signature&color=brightgreen)](https://grafana.com/grafana/plugins/nasa-hermes-datasource) -->
![License](https://img.shields.io/badge/License-Apache%202.0-blue)

# Hermes Datasource

## Overview

**Hermes** is a Grafana backend datasource plugin that connects to a [TimescaleDB](https://www.timescale.com/) database to query and visualize **telemetry** and **events** data from NASA's [Hermes ground data system (GDS)](https://github.com/nasa/hermes).

The plugin provides a multi-select query editor for querying events and telemetry, making it easy to build dashboards over spacecraft telemetry and event streams without writing raw SQL. Multiple telemetry channels, sources, and keys can be selected in a single query to overlay or compare data series. Additionally you can write custom SQL queries.

## Requirements

- **Grafana** >= 12.3.0
- **TimescaleDB** (PostgreSQL with the TimescaleDB extension); the plugin expects the Hermes schema (`telemetryDefs`, `telemetry`, `eventDefs`, `events` tables/hypertables) to already exist in the target database. See [Hermes](https://github.com/nasa/hermes) for help.

## Getting Started

### 1. Install the plugin

Install the plugin into your Grafana instance. Once installed, restart Grafana if required.

### 2. Configure the datasource

Navigate to **Connections > Data sources > Add new data source** and search for **Hermes**, then fill in the connection details.

Click **Save & Test** to verify connectivity.

### 3. Query data

Create a new panel and select **Hermes**. Use the **Builder / Code** toggle at the top of the query editor to switch modes.

#### Builder: Telemetry

Select **Telemetry** in the bottom-right toggle. Queries time-series values from the `telemetry` hypertable.

| Field           | Type                   | Description                                                                                                                               |
| --------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Channel**     | multi-select, required | One or more `component.channel` pairs. Each unique combination produces its own data frame.                                               |
| **Aggregation** | select                 | Function applied per time bucket: `Average`, `Min`, `Max`, `Count`, `First`, `Last`, `Sum`, `Derivative`, `Raw (none)`.                   |
| **Source**      | multi-select, optional | FSW source identifier. Leave empty to include all sources.                                                                                |
| **Keys**        | multi-select, optional | Sub-field paths for compound (object/array) channels. Appears per-channel only when multiple keys exist. Leave empty to include all keys. |

<br>

#### Builder: Events

Select **Events** in the bottom-right toggle. Returns event log entries with fields: timestamp, component, name, severity, message, source, args.

| Field      | Type                   | Description                                                |
| ---------- | ---------------------- | ---------------------------------------------------------- |
| **Source** | multi-select, optional | FSW source identifier. Leave empty to include all sources. |

<br>

#### Builder: Shared options

Available for both query types:

| Field                  | Description                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| **Time Field**         | `Receive Time` (ERT) or `On-board Time` (spacecraft clock)                                             |
| **From / To Override** | *(Advanced, collapsible)* Pin the query to an absolute time range, ignoring the dashboard time picker. |

<br>

#### Code Mode

Raw SQL editor. Switching from Builder → Code pre-populates the editor with the generated SQL. Switching back to Builder will warn if you have made manual edits.


## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
