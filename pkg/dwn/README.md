# Downlink Package

This package provides functionality for managing file downlinks from spacecraft or remote systems.

## Overview

The downlink package implements a robust system for receiving file chunks from remote sources, reassembling them, and validating the resulting files. It handles out-of-order reception, missing chunks, and provides metrics for monitoring downlink progress and status.

## Components

The downlink package provides the following components:

- DownlinkSession: Manages a single file downlink, handling chunk reception, storage, reassembly, and validation
- DownlinkChunk: Represents a chunk of data from a file being downlinked
- FileValidator: Interface for validating completed downlink files

## Features

- Handles out-of-order chunk reception
- Supports partial file downlinks and resumption
- Provides detailed metrics for monitoring
- Integrates with OpenTelemetry for tracing
- Supports file validation after downlink completion

## Metrics

The package exports several metrics for monitoring downlink performance:

- `hermes.downlink.size.confirmed`: Total bytes successfully downlinked
- `hermes.downlink.size.missing`: Total bytes missing from downlinks
- `hermes.downlink.size.discarded`: Redundant bytes discarded during downlink
- `hermes.downlink.chunks`: Number of chunks received
- `hermes.downlink.count.all`: Total number of downlink attempts
- `hermes.downlink.count.failed`: Number of failed downlinks
- `hermes.downlink.count.confirmed`: Number of successful downlinks

## Usage

```go
import (
    "github.com/nasa/hermes/pkg/dwn"
    "github.com/nasa/hermes/pkg/log"
)

// Create a new downlink session
session, err := dwn.NewDownlinkSession(
    logger,
    "spacecraft1",
    "/remote/path/file.dat",
    "/local/destination/file.dat",
    expectedFileSize,
    myValidator,
)
if err != nil {
    // Handle error
}

// Start the downlink process
go session.Start()

// Send chunks to the session
session.Chunk(&dwn.DownlinkChunk{
    Offset: 0,
    Data: []byte{...},
})

// Wait for completion
status, err := session.Wait(context.Background())
```

## Dependencies

- `github.com/nasa/hermes/pkg/host`: For host-specific functionality
- `github.com/nasa/hermes/pkg/infra`: For infrastructure components
- `github.com/nasa/hermes/pkg/log`: For logging
- `github.com/nasa/hermes/pkg/pb`: For protocol buffer definitions
- `github.com/nasa/hermes/pkg/util`: For utility functions
- `go.opentelemetry.io/otel`: For telemetry and tracing
