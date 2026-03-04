# Host Package

This package provides core infrastructure for the Hermes system, managing flight software interfaces, event buses, and system configuration.

## Overview

The host package implements the central components that coordinate communication between different parts of the Hermes system. It defines interfaces for flight software (FSW) connections, manages event and telemetry buses, and provides facilities for configuration and state management.

## Components

The host package provides the following components:

- Flight Software Interfaces: Defines interfaces for interacting with flight software, including command sending, sequence execution, and file uploads
- Message Buses: Implements publish-subscribe event buses for system-wide communication with filtering and subscription management
- Dictionary Management: Provides facilities for managing command and telemetry dictionaries with support for multiple namespaces
- Profile Management: Manages connection profiles and providers for creating and maintaining connections
- Storage: Implements persistent storage for system configuration with file-based storage and JSON serialization
- Global Resources: Defines system-wide shared resources for profiles, dictionaries, events, telemetry, and file downlinks

## Usage

### Working with Flight Software Interfaces

```go
import "github.com/nasa/hermes/pkg/host"

// Check if an FSW supports a capability
if fsw.Info().HasCapability(pb.FswCapability_COMMAND) {
    // Cast to the appropriate interface
    cmdFsw := fsw.(host.CmdFsw)
    success, err := cmdFsw.Command(ctx, command)
}
```

### Using Event Buses

```go
// Subscribe to events
subscription := host.Event.Subscribe(ctx, func(event *pb.SourcedEvent) {
    // Handle event
})
defer subscription.Unsubscribe()

// Publish an event
host.Event.Emit(event)
```

### Managing Profiles

```go
// Register a profile provider
host.Profiles.RegisterProvider("myProvider", myProvider)

// Create a profile
profile, err := host.Profiles.Create("myProfile", "myProvider", config)

// Connect a profile
err := profile.Connect(ctx)
```

## Dependencies

- `github.com/nasa/hermes/pkg/pb`: For protocol buffer definitions
- `go.opentelemetry.io/otel`: For tracing and instrumentation
