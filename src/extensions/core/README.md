# Hermes for Visual Studio Code

Hermes shows live telemetry and events in VS Code and sends commands from notebook cells. It connects to
[YAMCS](https://yamcs.org/), a mission control server, through the
[yamcs-grpc plugin](https://github.com/nasa/hermes/tree/v6/yamcs-grpc-plugin). The
[project README](https://github.com/nasa/hermes/tree/v6) shows how the parts of Hermes fit together.

![A Hermes notebook cell in YAMCS mode with each command's status and the events it raised, above the telemetry table and a telemetry plot](https://github.com/nasa/hermes/raw/v6/docs/assets/yamcs-mode.png)

## Features

- Notebooks (`.hermes.md`) that mix Markdown with command cells
- A telemetry table and plot
- An events panel
- Commanding from notebook cells, with completion, argument checks and each command's status on its line

## Companion extensions

Command cells come from these extensions, so install at least one of them to send commands:

| Extension | Adds |
| --- | --- |
| [Hermes YAMCS](https://github.com/nasa/hermes/tree/v6/src/extensions/yamcs) | YAMCS command cells, which name each command by its full YAMCS path |
| [Hermes FPrime](https://github.com/nasa/hermes/tree/v6/src/extensions/fprime) | F Prime command cells, `.seq` sequences and F Prime dictionaries |

## Requirements

- VS Code 1.98 or newer
- A YAMCS server that runs the [yamcs-grpc plugin](https://github.com/nasa/hermes/tree/v6/yamcs-grpc-plugin) and
  doesn't require a login. Hermes sends no credentials, so a server that requires one refuses it with
  `UNAUTHENTICATED`.

## Install

Hermes is on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jet-propulsion-laboratory.hermes),
but YAMCS mode isn't released there yet. Until it is, run the extensions from this repository as described in
[Develop](#develop).

## Notebooks

1. Create a file whose name ends in `.hermes.md`. It opens as a Hermes notebook.
2. Add a code cell and set its language to **YAMCS** (from Hermes YAMCS) or **fprime** (from Hermes FPrime).
3. Connect to YAMCS ([YAMCS mode](#yamcs-mode)) and run the cell.

Each cell sends its commands to its target, the [YAMCS instance](#connect) it runs on. The cell's status bar shows
the target as `yamcs:<instance>`. Click it to pick another. On **Automatic**, the default, a cell uses the only
connected instance, and refuses to run while several are connected. **Set Target for All Cells** in the notebook
toolbar gives every F Prime and YAMCS cell the same target.

The [Hermes YAMCS](https://github.com/nasa/hermes/tree/v6/src/extensions/yamcs) and
[Hermes FPrime](https://github.com/nasa/hermes/tree/v6/src/extensions/fprime) READMEs show what to write in each kind
of cell.

## YAMCS mode

### Connect

Hermes starts in Offline mode, with no connection. Cells get completion and argument checks, but don't run. To
connect:

1. Click **Hermes: Offline** in the status bar, or run **Hermes: Change Backend Mode** from the command palette.
2. Pick **YAMCS**.
3. Enter the plugin's address, for example `localhost:8091`.

A YAMCS server can run several instances, each with its own commands, telemetry and archive. Hermes connects to every
running instance that has the processor set in [Settings](#settings), `realtime` by default. The status bar then shows
**Hermes: YAMCS** and the address. Click the address to connect to another server.

If the connection ends, for example because YAMCS stopped, the status bar turns red and the address's tooltip gives
the reason. Run **Hermes: Reconnect to Backend** to connect again, or to add an instance started after Hermes
connected.

### Settings

Set these as keys of the `hermes.host.yamcs` setting in VS Code's settings:

| Key | Default | Sets |
| --- | --- | --- |
| `address` | `localhost:8091` | The yamcs-grpc plugin's `host:port`, which the connect prompt starts with |
| `processor` | `realtime` | The YAMCS processor Hermes subscribes to and sends commands through, in every instance. A processor handles an instance's data, and `realtime` handles live data. |
| `includeTopLevel` | `false` | Also show the parameters directly under a top-level path, such as `/Ref_Ref/FPrimeTime`, which [fprime-yamcs](https://github.com/fprime-community/fprime-yamcs) defines for packet header fields |

### What you see

| View | In YAMCS mode |
| --- | --- |
| Telemetry table and plot | A row for each parameter of each instance, timed by when YAMCS received it, with source `yamcs:<instance>`. Structs and arrays get a row per member or element, for example `comQueueDepth[1]`. |
| Events panel | Each instance's newest 100 events in YAMCS's archive, then live ones. An F Prime event shows its component and name, for example `CdhCore.cmdDisp` and `OpCodeDispatched`, and any other event YAMCS's source and type. |
| Connections view, in the Hermes sidebar | Each instance's [dictionaries](#dictionaries). Deleting `<instance>` also deletes `<instance> (F Prime)`. |
| Times | UTC by default, including in cell event lists (`hermes.notebook.evr.timeFormat`). YAMCS values have no spacecraft clock (SCLK) time, so their time is blank when a view is set to SCLK. |

### Dictionaries

Completion and argument checks in cells come from a dictionary of commands. Hermes builds these for each instance:

- `<instance>`, from the instance's commands, for YAMCS cells
- `<instance> (F Prime)`, for F Prime cells, when Hermes FPrime is installed and fprime-yamcs runs the instance

A cell uses its target's dictionary. A cell on Automatic uses the one selected under `{ }` in the status bar, which
Hermes sets to the first instance's when it connects. In Offline mode the dictionaries stay available, as long as
VS Code has a folder open.

## Develop

```sh
yarn install
yarn test      # unit tests
```

To try a change, open the repository in VS Code, pick **All** in the **Run and Debug** view and press F5. It builds
the extensions and opens a VS Code window with Hermes, Hermes YAMCS and Hermes FPrime loaded.

### Live tests

These need [fprime-yamcs](https://github.com/fprime-community/fprime-yamcs) running an F Prime deployment with the
yamcs-grpc plugin. Start YAMCS first, then boot the deployment: the tests wait for the FrameworkVersion telemetry
channel, which F Prime sends only at boot. Then, from the repository root:

```sh
YAMCS_GRPC_ADDRESS=localhost:8091 yarn jest src/extensions/core/test/yamcs.test.ts
node build build                           # builds the extension run.js loads
node src/extensions/core/test/e2e/run.js   # downloads VS Code 1.138.0 on first run, writes result.json next to itself
```

| Variable | Default | Effect |
| --- | --- | --- |
| `YAMCS_GRPC_ADDRESS` | `localhost:8091` (`run.js` only) | The plugin's address. Jest runs the live tests only when it is set. |
| `YAMCS_INSTANCE` | `fprime-project`, the instance fprime-yamcs creates | The YAMCS instance the tests check |
| `VSCODE_TEST_CACHE` | `.vscode-test` next to `run.js` | Where `run.js` finds or downloads VS Code |
| `E2E_HOLD_MS` | `0` | Keeps the `run.js` window open this many milliseconds with the telemetry table showing |

The jest tests and `run.js` each send `CMD_NO_OP_STRING` to the flight software. The jest tests also raise two events
of their own, which stay in the instance's archive.

## Issues and feedback

Report issues or request features on [GitHub Issues](https://github.com/nasa/hermes/issues).

## License

Copyright © 2026 California Institute of Technology. All rights reserved.
