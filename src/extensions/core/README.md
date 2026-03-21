# Hermes Extension for Visual Studio Code

A VSCode extension that provides telemetry monitoring, commanding, and notebook-based workflows for spacecraft ground systems. The Hermes extension enables real-time testbed operations and flight software integration.

Support for NASA's F' (FPrime) framework can be found in the
Hermes F Prime [sub-extension](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes-fprime).

## Features

- **Interactive Notebooks**: Create and execute command sequences using Jupyter-style notebooks
- **Live Telemetry**: Real-time monitoring of spacecraft telemetry channels and events (EVRs)
- **Command Uplink**: Send commands to flight software with validation and confirmation
- **Dictionary Integration**: Automatic loading of F' dictionaries for command and telemetry definitions
- **Multiple Backend Modes**: Work offline, run a local backend, or connect to remote ground systems
- **Profile Management**: Configure and switch between different spacecraft configurations
- **Connection Management**: Support for TCP/UDP connections to flight software

![Full Screenshot](https://github.com/nasa/hermes/raw/HEAD/docs/assets/full-screenshot.png)

## Installation

Install the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes) or search for "Hermes" in the VSCode Extensions view.

### Requirements

- Visual Studio Code 1.70.0 or higher
- For local backend mode: The extension includes a bundled backend binary for your platform
- For remote backend mode: Access to a running Hermes backend server

## Getting Started

1. **Install the extension** from the marketplace
2. **Open a workspace** containing F' dictionaries or Hermes configuration
3. **Select a backend mode** using the status bar or command palette:
   - `Hermes: Change Backend Mode`

![Full Screenshot](https://github.com/nasa/hermes/raw/HEAD/docs/assets/mode-select.png)

### Backend Modes

The extension supports three backend modes:

#### Offline Mode
Work with sequences and notebooks without connecting to flight software. Ideal for writing procedures and planning operations.

#### Local Mode (Default)
Runs a backend process managed by VSCode. Provides full telemetry, commanding, and profile management capabilities. Data is stored in `.hermes/` in your workspace.

#### Remote Mode
Connect to an externally-managed backend server for shared testbed or operations environments. Configure the backend URL in settings.

<!-- Add screenshot of connection status here -->

## Working with Notebooks

Create a new Hermes notebook (`.hermes.md`) to start building command sequences:

1. Create a new file with `.hermes.md` extension
2. Add code cells and select language to write sequences in
3. Execute cells to send commands to flight software

<!-- Add screenshot of notebook interface here -->

## Documentation

For more detailed documentation, see:
- [Project README](https://github.com/nasa/hermes/)
- [Users Guide](https://nasa.github.io/hermes/)

## Issues & Feedback

Report issues or request features on [GitHub Issues](https://github.com/nasa/hermes/issues).

## License

Copyright © 2026 California Institute of Technology. All rights reserved.
