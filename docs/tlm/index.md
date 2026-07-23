# Telemetry Monitoring

## Database

Hermes does not come with a database, but rather, offers supports pushing data to multiple different databases. In addition, Hermes supports Grafana for live data monitoring. The recommended stack is a TimescaleDB instance with a Grafana instance with the Hermes datasource plugin installed. To get started, see the [TimescaleDB](./db/timescaledb) page.

## Grafana Plugin Only

Alternatively, if you only want to install the Hermes Grafana datasource plugin, see the [Grafana](./grafana) page.