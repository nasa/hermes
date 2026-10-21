---
description: Set up for your F Prime flight-software development workflow.
icon: fontawesome/solid/play
---

# Quick Start

!!! abstract

    This quick start guide is tailored for the [F Prime](https://fprime.jpl.nasa.gov)
    software framework though much of this guide can be applied to other software frameworks.

**Prerequisites**

1. [Visual Studio Code](https://code.visualstudio.com/)
2. [Hermes VSCode Extension](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes)
3. [Hermes F Prime VSCode Extension](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes-fprime)
4. The [yamcs-grpc plugin](./installation.md#yamcs-grpc-plugin)
5. A basic understanding of writing and running [F Prime](https://github.com/nasa/fprime) Flight Software
6. (Optional) Read through the [core concepts](../arch/core-concepts.md) document to get more context about Hermes.

A detailed guide of the first four steps can be found in the [installation](./installation.md) page.

## Overview

This guide will walk you through:

1. Building and running your F Prime deployment under YAMCS
2. Connecting Hermes to YAMCS
3. Sending a command to verify the connection

By the end of this guide, you'll have Hermes connected to your F Prime deployment and ready to send commands and receive telemetry.

## Building Your F Prime Deployment

Before connecting to your flight software, you need to build your F Prime deployment and generate its dictionary. It is recommended to read the F Prime
[Hello World Tutorial](https://fprime.jpl.nasa.gov/latest/tutorials-hello-world/docs/hello-world/)
to learn how to develop and iterate on flight software. In the next section we
will show a quick set of instructions to get started using Ref, the reference deployment that comes with F Prime, as a guide.

### Set up the development environment

First you'll need to clone and perform first time Python Virtual Environment setup
in the repository.

```sh title="Get F Prime"
git clone --branch v4.4.1 https://github.com/nasa/fprime.git
cd fprime/TestDeploymentsProject
python3 -m venv fprime-venv
. fprime-venv/bin/activate
pip install -r ../requirements.txt
```

F Prime's Python requirements also install [fprime-yamcs](https://github.com/fprime-community/fprime-yamcs), which
starts YAMCS with the deployment's commands and telemetry loaded, starts the deployment, and connects the two.

### Building Flight Software

Now you can build the F Prime deployment.

```sh title="Build Ref"
fprime-util generate
fprime-util build
```

## Running Your F Prime Deployment

From `fprime/TestDeploymentsProject`, with the virtual environment active, run fprime-yamcs and pass it the plugin's
jars. Replace `<yamcs-grpc>` with the path of the folder that holds the yamcs-grpc plugin's jars.

```sh
fprime-yamcs --yamcs-plugin-jars <yamcs-grpc>
```

- fprime-yamcs keeps running in its terminal and prints YAMCS's log. Leave it running while you use Hermes.
- The plugin is ready once the log shows `gRPC API listening on port 8091`.
- To stop fprime-yamcs, YAMCS and Ref, press ++ctrl+c++.

## Connecting Hermes to YAMCS

The Hermes VSCode extension starts in **offline mode** by default. This
means that there is _no_ connection to the flight software. To connect,
point Hermes at YAMCS from the status bar item at the bottom of the VSCode window:

1. Click **Hermes: Offline** in the status bar, or run **Hermes: Change Backend Mode** from the command palette.
2. Pick **YAMCS**.
3. Press Enter to keep the plugin's address, `localhost:8091`.

The status bar then shows **Hermes: YAMCS** and the address. If both turn red instead, hover over the address to see
why.

## Sending a Command

1. Open a folder and create a file called `noop.hermes.md`. It opens as a Hermes notebook.
2. Add a code cell. Click the language name at the bottom right of the cell and pick **fprime**. This makes it an
   F Prime cell, which names commands the way F Prime does.
3. Type this no-op command, which does nothing but report that it ran:

    ```
    R00:00:00 CdhCore.cmdDisp.CMD_NO_OP
    ```

    `R00:00:00` is a relative time tag: wait zero seconds, then send. Every line of an F Prime cell needs one.

4. Click the run button to the left of the cell.

| Where | What you see |
| --- | --- |
| End of the command's line | `✓` once YAMCS has sent the command. YAMCS doesn't wait for Ref to run it. |
| Cell output | The events YAMCS reported while the cell ran, such as `NoOpReceived` from `CdhCore.cmdDisp`. This one shows that Ref ran the command. |

!!! success
    You have now connected Hermes with F Prime flight software!

## Next Steps

Now that you have successfully connected your flight software, you can now
send commands and monitor realtime telemetry and events streaming from your
system.

You can read about [notebooks](../vscode/notebooks.md) in VSCode and set up
[telemetry monitoring](../tlm/index.md) infrastructure.
