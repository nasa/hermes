---
description: Run F Prime flight software under YAMCS and command it from VS Code.
icon: fontawesome/solid/play
---

# Quick Start

This guide builds Ref, a sample flight software program that comes with F Prime, and runs it under YAMCS. Then it
connects Hermes to YAMCS and sends Ref a no-op command, which does nothing but report that it ran.

!!! abstract "Before you start"

    - Build the yamcs-grpc plugin and set up the Hermes VS Code extensions, as in [Installation](installation.md).
    - Install F Prime's [system requirements](https://fprime.jpl.nasa.gov/latest/docs/getting-started/installing-fprime/#system-requirements):
      git, a C and C++ compiler, and Python 3.10 or newer with venv and pip. F Prime builds on Linux and macOS. On
      Windows, run this page's terminal commands in WSL.

## Build Ref

In F Prime, each flight software program you build and run is called a deployment. Ref is F Prime's reference
deployment. It is the only deployment in F Prime's `TestDeploymentsProject` folder, so the commands below build and run
it.

Run these in a folder outside your Hermes clone:

```sh title="Get F Prime"
git clone --branch v4.4.1 https://github.com/nasa/fprime.git
cd fprime/TestDeploymentsProject
python3 -m venv fprime-venv
. fprime-venv/bin/activate
pip install -r ../requirements.txt
```

F Prime's Python requirements install two tools this guide uses:

- `fprime-util`, F Prime's build tool
- [fprime-yamcs](https://github.com/fprime-community/fprime-yamcs), which starts YAMCS with the deployment's commands
  and telemetry loaded, starts the deployment, and connects the two. It brings its own Java runtime for YAMCS.

```sh title="Build Ref"
fprime-util generate
fprime-util build
```

## Start YAMCS with the plugin

From `fprime/TestDeploymentsProject`, with the virtual environment active, run fprime-yamcs and pass it the plugin's
jars. Replace `<hermes>` with the path to your Hermes clone. In WSL, a Windows folder such as `C:\Users\me\hermes` is
`/mnt/c/Users/me/hermes`.

```sh
fprime-yamcs --yamcs-plugin-jars <hermes>/yamcs-grpc-plugin/out/lib
```

- fprime-yamcs keeps running in its terminal and prints YAMCS's log. Leave it running while you use Hermes.
- The plugin is ready once the log shows `gRPC API listening on port 8091`.
- YAMCS keeps Ref's commands, telemetry and events in an instance called `fprime-project`. (One YAMCS server can run
  several instances.) Hermes calls it `yamcs:fprime-project`, which you'll see below your notebook cell
  later.
- YAMCS's own web interface is at [http://localhost:8090](http://localhost:8090).
- To stop fprime-yamcs, YAMCS and Ref, press ++ctrl+c++.

## Connect Hermes

Hermes starts in Offline mode, with no connection to YAMCS. In the VS Code window with Hermes, which is the
**[Extension Development Host]** window if you run Hermes from the repository:

1. Click **Hermes: Offline** in the status bar, or run **Hermes: Change Backend Mode** from the command palette.
2. Pick **YAMCS**.
3. Press Enter to keep the plugin's address, `localhost:8091`.

The status bar then shows **Hermes: YAMCS** and the address. If both turn red instead, hover over the address to see
why.

## Send a command

1. Open a folder and create a file called `noop.hermes.md`. It opens as a Hermes notebook.
2. Add a code cell. Click the language name at the bottom right of the cell and pick **fprime**. This makes it an
   F Prime cell, which names commands the way F Prime does.
3. Type this command:

    ```
    R00:00:00 CdhCore.cmdDisp.CMD_NO_OP
    ```

    `R00:00:00` is a relative time tag: wait zero seconds, then send. Every line of an F Prime cell needs one.

4. Click the run button to the left of the cell.

| Where | What you see |
| --- | --- |
| End of the command's line | `✓` once YAMCS has sent the command. YAMCS doesn't wait for Ref to run it. |
| Hover over the `✓` | Each step YAMCS recorded for the command |
| Cell output | The events YAMCS reported while the cell ran, such as `NoOpReceived` from `CdhCore.cmdDisp`. This one shows that Ref ran the command. |
| Events panel, in the **Hermes: Events** tab | The same events, plus the newest 100 that YAMCS had stored when Hermes connected |
| Telemetry table, in the **Hermes: Telemetry** tab | A row for each telemetry channel YAMCS has received, such as `CommandsDispatched`, which counts dispatched commands. Its component is `/Ref_Ref/CdhCore/cmdDisp`, the YAMCS path of `CdhCore.cmdDisp`. |

## Next steps

- [Notebooks](../vscode/notebooks.md): YAMCS cells, time tags, cell targets and command statuses.
- [Recording from YAMCS](../tlm/recording.md): record telemetry and events, and chart them in Grafana.
- F Prime's [Hello World tutorial](https://fprime.jpl.nasa.gov/latest/tutorials-hello-world/docs/hello-world/): write
  and build your own deployment.
