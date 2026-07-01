# TimescaleDB Package

This package provides integration with TimescaleDB for storing and querying telemetry and event data.

## Overview

The timescaledb package implements a profile provider for connecting to TimescaleDB databases and storing spacecraft telemetry and event data. It converts Hermes data structures to TimescaleDB PostgreSQL format and manages the connection to the TimescaleDB server.

## Components

The timescaledb package provides the following components:

- TimescaleDB Provider: Implements the TimescaleDB connection provider that manages connections to TimescaleDB servers
- Data Conversion: Provides utilities for converting Hermes data types to TimescaleDB format
- Schema Definition: Defines the configuration schema for TimescaleDB connections

## Features

- Real-time telemetry storage in TimescaleDB
- Event logging with severity levels
- Integration with Grafana for visualization

## Usage

### Creating a TimescaleDB Connection

```go
import (
    _ "github.com/nasa/hermes/pkg/timescaledb"
)

// Register the TimescaleDB provider (call once at startup)
timescaledb.Init()
```

Once registered, configure a TimescaleDB profile through the Hermes UI or programmatically with:

```go
params := timescaledb.Params{
    Host:     "localhost:5432",
    User:     "postgres",
    Password: "password",
    Database: "hermes",
}
```

### Configuration Parameters

- `host`: TimescaleDB host and port (e.g., `localhost:5432`)
- `user`: Database user
- `password`: Database password
- `database`: Database name where telemetry and events will be stored

Earth Return Time (ERT) is automatically recorded as a `TIMESTAMPTZ` column on every telemetry and event row, capturing the wall-clock time at insertion.

## Dependencies

- `github.com/lib/pq`: PostgreSQL driver for Go
- `github.com/nasa/hermes/pkg/host`: For profile provider interfaces
- `github.com/nasa/hermes/pkg/pb`: For protocol buffer definitions
