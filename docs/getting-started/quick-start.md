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

Before connecting to your flight software, you need to build your F Prime deployment and generate its dictionary. It is recommended to read the F Prime
[Hello World Tutorial](https://fprime.jpl.nasa.gov/latest/tutorials-hello-world/docs/hello-world/)
to learn how to develop and iterate on flight software. In the next section we
will show a quick set of instructions to get started
[fprime-sensors-reference](https://github.com/fprime-community/fprime-sensors-reference) using as a guide.

### Set up the development environment

First you'll need to clone and perform first time Python Virtual Environment setup
in the repository.

```bash title="Workspace setup"
git clone --recursive git@github.com:fprime-community/fprime-sensors-reference.git
cd fprime-sensors-reference
python3 -m venv fprime-venv
source fprime-venv/bin/activate
pip install -r lib/fprime/requirements.txt
```

### Building Flight Software

Now you can build the F Prime deployment.

```bash title="Building Sensors Ref Deployment"
cd FprimeSensorsReference/ReferenceDeployment
fprime-util generate
fprime-util build
```

If the deployment successfully built, Hermes should automatically detect the
dictionary in the top of the rover panel.

![alt text](../assets/dict-detected.png)

## Running Your F Prime Deployment
