# Hermes: Spacecraft Command & Telemetry System

!!! warning

    Hermes is currently undergoing migration from our internal deployment to
    public Github. Documentation is currently under construction and incomplete.

<figure markdown="span">
  ![Image title](assets/hermes.svg){ width="300" }
</figure>

Hermes is a system for spacecraft command and telemetry management, providing a modern interface for ground operators to interact with flight software. It features a [Visual Studio Code](https://code.visualstudio.com/) frontend for commanding and telemetry display, along with a powerful backend for processing and routing data to and from flight software.

## Key Features

- **Command Management**: Uplink and sequence uplink with verification and validation
- **Telemetry Display**: Real-time visualization of spacecraft telemetry data
- **File Transfer**: Uplink and downlink file capabilities with integrity verification
- **CCSDS Protocol Support**: Implementation of space communication standards
- **Modern Web Interface**: Integrates with commercial time series databases (e.g., InfluxDB, Prometheus)
- **Extensible Architecture**: Plugin system for supporting various spacecraft and communication protocols

## System Components

### Frontend



- Commanding spacecraft systems
- Visualizing telemetry data in real-time
- Managing file transfers
- Configuring system parameters

### Backend

The backend handles:

- Communication with spacecraft systems
- Protocol implementation (CCSDS, etc.)
- Data processing and routing
- Command validation and verification
- Telemetry processing and storage

## Getting Started

To get started with Hermes, see the [Installation Guide](getting-started/installation.md) and [Quick Start Guide](getting-started/quick-start.md).
