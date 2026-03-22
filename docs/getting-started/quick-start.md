---
description: Set up for your F Prime flight-software development workflow.
icon: fontawesome/solid/play
---

# Quick Start

!!! note

    This quick start guide is tailored for the [F Prime](https://fprime.jpl.nasa.gov)
    software framework though much of this guide can be applied to other software frameworks.

**Prerequisites**

1. [Visual Studio Code](https://code.visualstudio.com/)
2. [Hermes VSCode Extension](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes)
3. [Hermes F Prime VSCode Extension](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes-fprime)
4. A basic understanding of writing and running [F Prime](https://github.com/nasa/fprime) Flight Software

## Overview

This guide will walk you through:

1. Starting the Hermes backend in local mode
2. Building and running your F Prime deployment
3. Creating a profile and connecting to your flight software (FSW)
4. Verifying the connection

By the end of this guide, you'll have Hermes connected to your F Prime deployment and ready to send commands and receive telemetry.

## Starting the Hermes Backend

The Hermes VSCode extension starts in **offline mode** by default. This
means that there is _no_ backend to connect to the flight software with.
To connect to the FSW you'll need to connect the VSCode frontend to a
backend. The simplest way to do this is by starting the backend bundled
with the Hermes VSCode extension in **local mode**.

The connection of the VSCode frontend to the backend can be managed by
the status bar item at the bottom of the VSCode window.

![alt text](../assets/mode-select.png)

You'll be presented with some options about how to connect to a Hermes
backend. In this guide we will be using **Local Mode**. The **Remote Mode**
will become useful once you are ready to deploy Hermes into a
[production environment](../prod/index.md) though is not strictly required.

**Verifying the Backend**

To validate the backend started correctly, the VSCode terminal process
running the backend can be focused to show the logs associated with the
backend.

![alt text](../assets/local-terminal.png)

## Building Your F Prime Deployment

Before connecting to your flight software, you need to build your F Prime deployment and generate its dictionary.

### Generate the Build Cache

First, generate the F Prime build cache which creates the necessary build files:

1. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run: **F Prime: Generate Build Cache**
3. Select your deployment (e.g., `Ref`)
4. Choose a build type (e.g., `default`)

<!-- SCREENSHOT: Command palette showing "F Prime: Generate Build Cache" with deployment selection -->

This creates the build directory and configures CMake for your deployment.

### Build the Deployment

Next, build the deployment binary and dictionary:

1. Open the Command Palette
2. Run: **F Prime: Build Deployment**
3. Select your deployment
4. Wait for the build to complete

<!-- SCREENSHOT: Terminal showing successful F Prime build output -->

The build generates a dictionary file (typically `<DeploymentName>TopologyAppDictionary.xml`) in your build output directory.

## Creating a Profile

Profiles in Hermes bundle your dictionary, connection settings, and other configuration needed to communicate with your flight software.

### Create a New Profile

1. Open the Hermes sidebar by clicking the Hermes icon in the Activity Bar (left sidebar)
2. In the **Profiles** section, click the **+** button to create a new profile
3. Enter a profile name (e.g., `Ref-Local`)
4. Select your deployment's dictionary file from the build output

<!-- SCREENSHOT: Hermes sidebar showing Profiles section with + button -->

<!-- SCREENSHOT: Dialog for creating new profile with name and dictionary file selection -->

### Configure Profile Connections

After creating the profile, configure how Hermes will connect to your flight software:

1. Expand your profile in the sidebar
2. Click the gear icon to open profile settings
3. Under **Connections**, click **Add Connection**
4. Configure the connection type and endpoints:
    - **Downlink**: Where telemetry is received (e.g., TCP Server on port 50000)
    - **Uplink**: Where commands are sent (e.g., TCP Client to port 50001)

<!-- SCREENSHOT: Profile settings showing connection configuration with TCP settings -->

!!! tip "Common F Prime Connection Setup"

    For a standard F Prime deployment running locally:

    - **Downlink**: TCP Server, address `0.0.0.0`, port `50000`
    - **Uplink**: TCP Client, address `127.0.0.1`, port `50001`

## Running Your F Prime Deployment

Now that your profile is configured, start your F Prime deployment using VSCode tasks.

### Start the Deployment

1. Open the Command Palette
2. Run: **Tasks: Run Task**
3. Select **F Prime: Run Deployment**
4. Choose your deployment

<!-- SCREENSHOT: Command palette showing "Tasks: Run Task" with F Prime tasks listed -->

Your deployment will start in a VSCode terminal. You should see initialization messages and the flight software waiting for connections.

<!-- SCREENSHOT: Terminal showing F Prime deployment running with initialization messages -->

!!! note "Alternative Methods"

    You can also start your deployment manually from the command line:

    ```bash
    cd build-artifacts/<deployment>/bin
    ./<DeploymentName>
    ```

## Connecting to Your Deployment

With your flight software running, connect your Hermes profile:

1. In the Hermes sidebar, find your profile
2. Click the **Start** button (▶️ icon) next to your profile name
3. Hermes will establish connections based on your profile configuration

<!-- SCREENSHOT: Hermes sidebar showing profile with Start button highlighted -->

### Verifying the Connection

Once connected, you should see:

1. The profile status changes to **Running** (green indicator)
2. The **Connections** panel shows active uplink/downlink connections
3. Live telemetry begins appearing in the Hermes views

<!-- SCREENSHOT: Hermes sidebar showing running profile with green status and active connections -->

<!-- SCREENSHOT: Connections panel showing established uplink and downlink connections -->

!!! success "You're Ready!"

    Your Hermes environment is now set up and connected to your F Prime deployment. You're ready to interact with your flight software!

## Next Steps

Now that you're connected, you can:

- [Send commands and view telemetry](../workflow/commanding.md) - Learn how to interact with your flight software
- [View and analyze events](../workflow/events.md) - Monitor system events and logs
- [Create sequences](../workflow/sequences.md) - Automate command sequences
- [Record and playback data](../workflow/recording.md) - Capture telemetry for analysis

## Troubleshooting

### Backend Not Starting

If the backend doesn't start automatically:

1. Check the backend logs: **Hermes: Focus Backend Terminal**
2. Verify the backend binary is present at `out/backend` in your workspace
3. Try manually reconnecting: **Hermes: Reconnect to Backend**

### Connection Failed

If your profile fails to connect:

1. Verify your F Prime deployment is running
2. Check the connection settings match your deployment configuration
3. Ensure ports aren't blocked by firewalls
4. Check the backend logs for detailed error messages

### Dictionary Not Found

If the dictionary file isn't available:

1. Rebuild your deployment: **F Prime: Build Deployment**
2. Verify the dictionary XML file exists in your build output
3. Check the path in your profile settings is correct

