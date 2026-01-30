# InfluxDB Package

This package provides integration with InfluxDB for storing and querying telemetry and event data.

## Overview

The influxdb package implements a profile provider for connecting to InfluxDB databases and storing spacecraft telemetry and event data. It converts Hermes data structures to InfluxDB line protocol format and manages the connection to the InfluxDB server.

## Components

The influxdb package provides the following components:

- InfluxDB Provider: Implements the InfluxDB connection provider that manages connections to InfluxDB servers
- Data Conversion: Provides utilities for converting Hermes data types to InfluxDB format
- Schema Definition: Defines the configuration schema for InfluxDB connections

## Features

- Real-time telemetry storage in InfluxDB
- Event logging with severity levels
- Support for custom tags and fields
- Integration with Grafana for visualization
- Configurable data organization with buckets

## Usage

### Creating an InfluxDB Connection

```go
import (
    "github.com/nasa/hermes/pkg/host"
    "github.com/nasa/hermes/pkg/influxdb"
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
