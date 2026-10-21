---
description: Run an F Prime deployment under YAMCS and command it from VS Code.
icon: fontawesome/solid/play
---

# Quick Start

This guide runs F Prime's reference deployment under YAMCS, connects Hermes to it, and sends a no-op command from a
notebook.

!!! abstract "Before you start"

    - Build the yamcs-grpc plugin and set up the VS Code extensions, as in [Installation](installation.md).
    - Install F Prime's [system requirements](https://fprime.jpl.nasa.gov/latest/docs/getting-started/installing-fprime/#system-requirements):
      git, a C and C++ compiler, and Python 3.10 or newer with venv and pip. F Prime builds on Linux and macOS. On
      Windows, run the F Prime and fprime-yamcs steps in WSL.

## Build an F Prime deployment

This guide uses `Ref`, the reference deployment that comes with F Prime. F Prime's Python requirements include
[fprime-yamcs](https://github.com/fprime-community/fprime-yamcs), which runs YAMCS for an F Prime deployment.

```sh title="Workspace setup"
git clone --branch v4.4.1 https://github.com/nasa/fprime.git
cd fprime/TestDeploymentsProject
python3 -m venv fprime-venv
. fprime-venv/bin/activate
pip install -r ../requirements.txt
```

```sh title="Build Ref"
fprime-util generate
fprime-util build
```

To learn how to write and build your own deployment, see F Prime's
[Hello World tutorial](https://fprime.jpl.nasa.gov/latest/tutorials-hello-world/docs/hello-world/).

## Start YAMCS with the plugin

From `fprime/TestDeploymentsProject`, with the virtual environment active, run fprime-yamcs and pass it the plugin's
jars. Replace `<hermes>` with the path to your Hermes clone. From WSL, a clone on the Windows side is under
`/mnt/c/...`.

```sh
fprime-yamcs --yamcs-plugin-jars <hermes>/yamcs-grpc-plugin/out/lib
```

fprime-yamcs starts YAMCS with an instance called `fprime-project`, starts Ref and connects the two. The plugin is up
once the output shows `gRPC API listening on port 8091`. The YAMCS web interface is at http://localhost:8090.

## Connect Hermes

Hermes starts in Offline mode. In the VS Code window with Hermes:

1. Run **Hermes: Change Backend Mode** from the command palette, or click **Hermes: Offline** in the status bar.
2. Pick **YAMCS**.
3. Press Enter to keep the plugin's address, `localhost:8091`.

The status bar then shows **Hermes: YAMCS** and the address. If it turns red instead, hover over the address to see
why.

## Send a command

1. Open a folder and create a file called `noop.hermes.md`. It opens as a Hermes notebook.
2. Add a code cell and set its language to `fprime`.
3. Type this command. `R00:00:00` is a time tag that sends the command right away. F Prime cells need one on every
   line.

    ```
    R00:00:00 CdhCore.cmdDisp.CMD_NO_OP
    ```

4. Run the cell.

| Where | What you see |
| --- | --- |
| End of the command's line | `✓` once YAMCS sends the command. It doesn't wait for the flight software, so check the events for its response. Hover over `✓` to see each step YAMCS recorded. |
| Cell output | The events YAMCS reported while the cell ran, such as `NoOpReceived` from `CdhCore.cmdDisp` |
| **Hermes: Events** panel | The same events, along with older ones from YAMCS's archive |
| **Hermes: Telemetry** panel | A row for each telemetry channel YAMCS has received, such as `CommandsDispatched` under `/Ref_Ref/CdhCore/cmdDisp`, which counts dispatched commands |

## Next steps

- [Notebooks](../vscode/notebooks.md): YAMCS cells, time tags, cell targets and command statuses.
- [Recording](../tlm/recording.md): record telemetry and events, and chart them in Grafana.
