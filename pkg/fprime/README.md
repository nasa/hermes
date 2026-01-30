# F' (F Prime) Package

This package provides integration with the F' (F Prime) flight software framework developed by NASA/JPL.

## Overview

The F' package implements interfaces and protocols for communicating with spacecraft running the F' flight software framework. It provides support for:

- Command and telemetry handling
- File uplink and downlink
- Packet encoding and decoding
- Protocol implementations

## Components

The F' package provides the following components:

- Flight Software Interface: Implements the primary interface for communicating with F' flight software
- Packet Handling: Defines packet structures for F' communication
- File Transfer: Implements file transfer protocols for F'
- Protocol Implementation: Provides protocol adapters for different communication methods
- Configuration: Manages F'-specific configuration settings
- Types and Schema: Defines F'-specific data types and schema

## Protocol Definition

The `fprime.protocol` file contains the protocol definition used to generate the Go code with the protocolc tool. It defines the structure of:

- File transfer packets
- Command and telemetry packets
- Event packets

## Usage

### Creating an F' FSW Interface

```go
import (
    "github.com/nasa/hermes/pkg/fprime"
    "github.com/nasa/hermes/pkg/host"
    "github.com/nasa/hermes/pkg/log"
)

// Create a new F' FSW interface
fsw := fprime.NewFprimeFsw(
    logger,
    "spacecraft1",
    dictionary,
)

// Send a command
cmd := &pb.CommandValue{...}
err := fsw.SendCommand(cmd)

// Uplink a file
status, err := fsw.UploadFile(ctx, sourcePath, destinationPath)
```

### Processing Telemetry

```go
// Process incoming packets
go func() {
    for packet := range fsw.Up {
        // Handle telemetry packets
        if telemetry, ok := packet.Payload.([]*fprime.TelemValue); ok {
            for _, tlm := range telemetry {
                // Process telemetry value
            }
        }
    }
}()
```

## Dependencies

- `github.com/nasa/hermes/pkg/cmd`: For command parsing
- `github.com/nasa/hermes/pkg/host`: For host interfaces
- `github.com/nasa/hermes/pkg/infra`: For infrastructure components
- `github.com/nasa/hermes/pkg/log`: For logging
- `github.com/nasa/hermes/pkg/pb`: For protocol buffer definitions
- `github.com/nasa/hermes/pkg/serial`: For binary serialization
- `github.com/nasa/hermes/pkg/stream`: For stream handling
- `github.com/nasa/hermes/pkg/util`: For utility functions
