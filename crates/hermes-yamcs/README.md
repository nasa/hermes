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
hermes-yamcs [OPTIONS]
```

**Options:**
- `--yamcs-url <URL>` - YAMCS server URL (default: `http://localhost:8090`)
- `--yamcs-processor <NAME>` - YAMCS processor name used for all instances (default: `realtime`)
- `--bind-addr <ADDR>` - gRPC server bind address (default: `[::1]:6880`)

### Examples

**Basic usage with defaults:**
```bash
cargo run --package hermes-yamcs
```

**Connect to custom YAMCS server:**
```bash
cargo run --package hermes-yamcs -- --yamcs-url http://yamcs-server:8090 --bind-addr 0.0.0.0:6880
```

**Use different processor:**
```bash
cargo run --package hermes-yamcs -- --yamcs-processor simulation
```

## Multi-Instance Support

The bridge automatically discovers all YAMCS instances on the connected server. Each instance is exposed as a separate **FSW** (Flight Software connection):

- **Single Profile**: The bridge presents one profile representing the YAMCS connection
- **Multiple FSW Connections**: Each YAMCS instance appears as a separate FSW connection with `id` = instance name
- **Dynamic Routing**: Commands and subscriptions are routed to instances based on metadata

### How Routing Works

**Commands**: Specify the target instance via gRPC metadata `"id"` field:
```
metadata["id"] = "spacecraft-1"  // Routes to YAMCS instance "spacecraft-1"
```

**Telemetry/Event Subscriptions**: Use `BusFilter.source` field:
- **Single instance**: Set `source` = instance name (e.g., `"spacecraft-1"`)
- **All instances**: Leave `source` empty (`""`) to receive data from all instances merged into one stream

Each telemetry/event item includes its `source` field set to the originating instance name.

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
                                        │  (multi-instance)│
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
   cargo run --package hermes-yamcs -- --yamcs-url http://yamcs-server:8090
   ```

2. Configure VSCode settings:
   ```json
   {
     "hermes.host.type": "remote",
     "hermes.host.url": "http://[::1]:6880"
   }
   ```

3. The extension will connect to the bridge, which discovers all YAMCS instances
4. Each YAMCS instance appears as a separate FSW connection that can be commanded independently

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
