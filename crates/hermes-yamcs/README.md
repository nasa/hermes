# Hermes-YAMCS Bridge

A bridge that implements the Hermes gRPC API and translates it to YAMCS HTTP/WebSocket API calls.

## Overview

This crate provides a gRPC server that implements the Hermes API (`hermes.Api` service) and forwards requests to a YAMCS backend via HTTP REST and WebSocket connections. This allows Hermes clients (like the VSCode extension) to connect to YAMCS missions.

## Features

### Implemented

- **Commands**: `Command()` - Issue commands to spacecraft via YAMCS
- **Events**: `SubEvent()` - Subscribe to real-time event streams from YAMCS
- **Telemetry**: `SubTelemetry()` - Subscribe to real-time parameter/telemetry streams from YAMCS

### Not Implemented (as requested)

- Profiles (ignored per requirements)
- Dictionary management
- File uplink/downlink
- FSW management
- Raw commands and sequences

## Usage

### Command Line Arguments

```bash
hermes-yamcs [YAMCS_URL] [INSTANCE] [PROCESSOR] [BIND_ADDR]
```

**Arguments:**
- `YAMCS_URL` - YAMCS server URL (default: `http://localhost:8090`)
- `INSTANCE` - YAMCS instance name (default: `myproject`)
- `PROCESSOR` - YAMCS processor name (default: `realtime`)
- `BIND_ADDR` - gRPC server bind address (default: `[::1]:6880`)

### Examples

**Basic usage with defaults:**
```bash
cargo run --package hermes-yamcs
```

**Connect to custom YAMCS server:**
```bash
cargo run --package hermes-yamcs -- http://yamcs-server:8090 spacecraft realtime 0.0.0.0:6880
```

**With specific instance:**
```bash
cargo run --package hermes-yamcs -- http://localhost:8090 mysat realtime [::1]:6880
```

## Architecture

```
┌─────────────────┐        gRPC         ┌─────────────────┐
│                 │ ◄─────────────────► │                 │
│  Hermes Client  │   Hermes Proto API  │  hermes-yamcs   │
│  (VSCode ext)   │                     │     Bridge      │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                        HTTP/REST│ WebSocket
                                                 │
                                        ┌────────▼────────┐
                                        │                 │
                                        │  YAMCS Server   │
                                        │                 │
                                        └─────────────────┘
```

### Type Conversions

#### Commands
- **Hermes → YAMCS**
  - `CommandValue` → `IssueCommandOptions`
  - Command name: `/{component}/{mnemonic}`
  - Arguments converted to JSON format

#### Events
- **YAMCS → Hermes**
  - `Event` → `SourcedEvent`
  - YAMCS severity mapped to Hermes `EvrSeverity`
  - Extra fields converted to tags

#### Telemetry
- **YAMCS → Hermes**
  - `ParameterValue` → `SourcedTelemetry`
  - Engineering values converted to Hermes `Value` types
  - Acquisition status and monitoring results added as labels

#### Values
- Automatic conversion between YAMCS and Hermes value types:
  - Primitives: float, double, integers, boolean, string
  - Complex: arrays, aggregates/objects, binary data
  - Timestamps: ISO8601 strings ↔ protobuf Timestamp

## Configuration with Hermes VSCode Extension

To use this bridge with the Hermes VSCode extension:

1. Start the bridge:
   ```bash
   cargo run --package hermes-yamcs -- http://yamcs-server:8090 myinstance realtime [::1]:6880
   ```

2. Configure VSCode settings:
   ```json
   {
     "hermes.host.type": "remote",
     "hermes.host.url": "http://[::1]:6880"
   }
   ```

3. The extension will connect to the bridge, which forwards to YAMCS

## Dependencies

- `hermes-server` - Generated Hermes gRPC service definitions
- `hermes-pb` - Hermes protobuf message types
- `yamcs-http` - YAMCS HTTP REST and WebSocket client
- `tonic` - gRPC server implementation
- `tokio` - Async runtime

## Development

Build:
```bash
cargo build --package hermes-yamcs
```

Run tests (when added):
```bash
cargo test --package hermes-yamcs
```

## Limitations

- Profile management is not implemented (by design)
- Dictionary operations are not supported
- File transfer operations are not implemented
- Some YAMCS-specific features may not map perfectly to Hermes semantics

## Future Enhancements

Potential improvements:
- Dictionary translation layer (YAMCS MDB ↔ Hermes Dictionary)
- Command verification status streaming
- Historical data queries
- Better error handling and logging
- Health checks and metrics
