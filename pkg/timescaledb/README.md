# InfluxDB Package

This package provides integration with TimescaleDB for storing and querying telemetry and event data.

## Overview

The timescaledb package implements a profile provider for connecting to TimescaleDB databases and storing spacecraft telemetry and event data. It converts Hermes data structures to TimescaleDB [[TODO]] format and manages the connection to the TimescaleDB server.

## Components

The timescaledb package provides the following components:

- TimescaleDB Provider: Implements the TimescaleDB connection provider that manages connections to TimescaleDB servers
- Data Conversion: Provides utilities for converting Hermes data types to TimescaleDB format
- Schema Definition: Defines the configuration schema for TimescaleDB connections

## Features

- Real-time telemetry storage in TimescaleDB
- Event logging with severity levels
- Support for custom tags and fields
- Integration with Grafana for visualization
- Configurable data organization with buckets

[[TODO]]: BELOW

## Usage

### Creating a TimescaleDB Connection

```go
import (
    "github.com/nasa/hermes/pkg/host"
    "github.com/nasa/hermes/pkg/timescaledb"
)

// Register the InfluxDB provider
host.Profiles.RegisterProvider("influxdb", &influxdb.Provider{})

// Create a profile with InfluxDB configuration
profile, err := host.Profiles.Create("myInfluxProfile", "influxdb", influxdb.Params{
    Url:    "http://localhost:8086",
    Token:  "my-token",
    OrgId:  "my-organization",
    Bucket: "spacecraft-data",
    Ert:    true,
    DefaultTags: []struct{
        Key   string
        Value string
    }{
        {Key: "mission", Value: "demo"},
    },
})

// Connect the profile
err = profile.Connect(ctx)
```

### Configuration Parameters

- `url`: URL to the InfluxDB server (e.g., "http://localhost:8086")
- `token`: Authentication token for the InfluxDB API
- `orgId`: Organization ID or name
- `bucket`: Bucket name for storing data
- `ert`: Whether to include Earth Return Time with data points
- `defaultTags`: List of tags to apply to all data points

## Dependencies

- `github.com/influxdata/influxdb-client-go/v2`: InfluxDB client library
- `github.com/influxdata/line-protocol`: Line protocol parsing and formatting
- `github.com/nasa/hermes/pkg/host`: For profile provider interfaces
- `github.com/nasa/hermes/pkg/pb`: For protocol buffer definitions
