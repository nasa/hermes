---
icon: fontawesome/solid/database
---

# Datastores

Unlike many ground data systems for space missions, Hermes does not
ship with a builtin data persistence solution. Data storage is not
a goal of the Hermes project. For this purpose, Hermes relies on
an external provider to store its time series data. There are a number
of databases that Hermes supports, each with their own use cases.

This document will attempt to provide guidance to system architects
on how to design and deploy a ground system topology.

Before we discuss the Hermes supported datastores, it is important to
discuss the data model of Hermes. Hermes uses a generic data representation
which can be converted to a chosen database representation. It is also
important to note that Hermes does not persist any data in the backend.
A plugin can be either built directly into the backend or attached via
the [gRPC API](https://grpc.io).

The Hermes downlink data model is described in our [core concepts](../../arch/core-concepts.md)
document.

Below is a table of the supported databases that can be used to persist
data streaming through Hermes.

<table>
  <tr>
    <!-- <td>Database</td> -->
    <td style="width: 25%">Database Overview</td>
    <td style="width: 55%">Pros/Cons</td>
    <td style="width: 20%">Use Cases</td>
  </tr>
  <tr>
    <td>
      <a href="./open-telemetry">Open Telemetry</a>
      <p>
        Covers all <a href="https://opentelemetry.io/">OTEL</a>
        databases including the recommended Grafana Loki-Grafana-Tempo-Mimir (LGTM) stack.
      </p>
    </td>
    <td>
      <b>Pros</b>
      <ul>
          <li>Free and Open-Source with Enterprise Support</li>
          <li>Standard data schema</li>
          <li>Out-of-the-box applications built into Grafana for querying</li>
          <li>Easy configuration and deployment</li>
      </ul>
      <b>Cons</b>
      <ul>
          <li>Limits telemetry to <em>numeric</em> (or complex structures/arrays of numeric) telemetry</li>
          <li>Does not support 'raw' sample querying</li>
          <li>Reprocesses telemetry >1Hz into 1Hz data</li>
          <li>Does not support multiple time columns (i.e. ERT only, no SCLK)</li>
          <li>Cannot model complex dynamic data structures such as those in data products or image files</li>
      </ul>
    </td>
    <td>
      <p>Demo, prototype, early development.</p>
      <p>Supplimentary to another database for events and command + sequence tracing.</p>
    </td>
  </tr>
  <tr>
    <td>
      <a href="./clickhouse">Clickhouse</a>
      <p>High performance database built for online analytical processing (OLAP)</p>
    </td>
    <td>
      <b>Pros</b>
      <ul>
          <li>Free and Open-Source with Enterprise Support</li>
          <li>High performance and scalable</li>
          <li>Used for large scale analytical applications</li>
          <li>SQL queries</li>
      </ul>
      <b>Cons</b>
      <ul>
          <li>Complex configuration and management</li>
          <li>Not a good fit for relational data (not typically used by Hermes but may be used on other parts of your mission)</li>
          <li>No out of the box support in Grafana that conforms to Hermes data model (i.e. raw queries required for now)</li>
      </ul>
    </td>
    <td>V&V, ALTO, Operations</td>
  </tr>
  <tr>
    <td>
      <a href="./sqlite">SQLite</a>
      <p>Single file based embedded database for zero overhead data storage.</p>
    </td>
    <td>
      <b>Pros</b>
      <ul>
          <li>No configuration, very simple</li>
          <li>Used for large scale analytical applications</li>
      </ul>
      <b>Cons</b>
      <ul>
          <li>Not meant for server-like deployment (i.e. single process access)</li>
          <li>Not meant for large scale datasets</li>
      </ul>
    </td>
    <td>FSW Dev, CI, FIT Testing</td>
  </tr>
  <tr>
    <td>
      <a href="./timescaledb">TimescaleDB</a>
      <p>Time series extension to PostgreSQL. Supports materialized view for online preprocessing of common queries. Works with Postgres tooling.</p>
    </td>
    <td>
      <b>Pros</b>
      <ul>
          <li>High performance and scalable</li>
          <li>Used for large scale analytical applications</li>
          <li>Supports PostgreSQL infrastructure. Great for teams already using postgres.</li>
      </ul>
      <b>Cons</b>
      <ul>
          <li>Partially Open-Source <em>focusing</em> on Enterprise Support</li>
          <li>2.x uses custom query language called flux, 3.x switches to SQL.</li>
          <li>Complex configuration and management</li>
          <li>No out of the box support in Grafana that conforms to Hermes data model (i.e. raw queries required for now)</li>
          <li>Business model rapidly changes with new releases</li>
      </ul>
    </td>
    <td>V&V, ALTO, Operations</td>
  </tr>
  <tr>
    <td>
      <a href="./influxdb">InfluxDB</a>
      <p>High performance open-schema time series nosql column-based database</p>
    </td>
    <td>
      <b>Pros</b>
      <ul>
          <li>High performance and scalable</li>
          <li>Used for large scale analytical applications</li>
          <li>Low upfront effort for configuration and deployment</li>
      </ul>
      <b>Cons</b>
      <ul>
          <li>Partially Open-Source <em>focusing</em> on Enterprise Support</li>
          <li>Does not support multiple time columns ERT or SCLK, not both</li>
          <li>Limited support for large binary blob fields, images may need separate store.</li>
          <li>No out of the box support in Grafana that conforms to Hermes data model (i.e. raw queries required for now)</li>
          <li>Business model rapidly changes with new releases</li>
      </ul>
    </td>
    <td>V&V, ALTO, Operations</td>
  </tr>
</table>
