# Host Utilities Package

This package provides utility functions and components for host-side operations in the Hermes system.

## Overview

The hostutil package implements common utilities for network communication and time handling that are used by various host-side components in the Hermes system. It provides reusable components for TCP client/server connections and time system conversions.

## Components

The hostutil package provides the following components:

- TCP Client: Implements a TCP client connection provider that creates and manages TCP client connections
- TCP Server: Implements a TCP server connection provider with support for single-client or multi-client modes
- Time Systems: Provides utilities for working with different time systems and standards (UTC, TAI, Ephemeris Time, etc.)

## Usage

### TCP Client Example

```go
import (
    "github.com/nasa/hermes/pkg/host"
    "github.com/nasa/hermes/pkg/hostutil"
)

// Create a TCP client connection
err := hostutil.TcpClientProvider(
    ctx,
    "my-client",
    session,
    hostutil.TcpClientParams{
        Address: "localhost:8080",
    },
    func(conn io.ReadWriteCloser) {
        // Handle the connection
    },
)
```

### TCP Server Example

```go
import (
    "github.com/nasa/hermes/pkg/host"
    "github.com/nasa/hermes/pkg/hostutil"
)

// Create a TCP server
err := hostutil.TcpServerProvider(
    ctx,
    "my-server",
    session,
    hostutil.TcpServerParams{
        Address: ":8080",
        SingleClient: true,
    },
    func(conn io.ReadWriteCloser) error {
        // Handle client connection
        return nil
    },
)
```

### Time System Example

```go
import (
    "github.com/nasa/hermes/pkg/hostutil"
)

// Create a time system
var timeSystem hostutil.TimeSystem

// Convert flight software time to Go time
goTime := timeSystem.Convert(seconds, nanos)
```

## Dependencies

- `github.com/nasa/hermes/pkg/host`: For host connection session interfaces
- `github.com/nasa/hermes/pkg/infra`: For infrastructure components
- `github.com/nasa/hermes/pkg/spice`: For SPICE time handling
- `github.com/nasa/hermes/pkg/util`: For utility functions
