---
icon: fontawesome/solid/plug
---

# Offline Mode

Hermes starts in Offline mode each time VS Code starts, and the status bar shows **Hermes: Offline**. Offline mode
has no connection to YAMCS. You can write notebook cells with completion and argument checks, but they don't run.

## Connect to YAMCS

1. Click **Hermes: Offline** in the status bar, or run **Hermes: Change Backend Mode** from the command palette.
2. Pick **YAMCS**.
3. Enter the address of the [yamcs-grpc plugin](https://github.com/nasa/hermes/tree/v6/yamcs-grpc-plugin), for example
   `localhost:8091`.

Hermes connects to every running [instance](../arch/core-concepts.md#yamcs-terms) that has the `realtime` processor,
and the status bar shows **Hermes: YAMCS**. To go back, pick **Offline** in the same list.

If the connection ends, for example because YAMCS stopped, the status bar turns red and Hermes works as in Offline
mode. Hover over the address in the status bar to see why. Run **Hermes: Reconnect to Backend** to connect again, which
also picks up instances started since Hermes connected.

To change how Hermes connects, set these keys in the `hermes.host.yamcs` setting:

| Key | Default | Sets |
| --- | --- | --- |
| `address` | `localhost:8091` | The address the prompt starts with |
| `processor` | `realtime` | The processor Hermes subscribes to and sends commands through, in every instance |
| `includeTopLevel` | `false` | Whether the telemetry table shows parameters directly under a top-level path. See [Telemetry and Events](telemetry-and-events.md#telemetry-table-and-plot). |

## Dictionaries

A dictionary lists a flight software's commands. Cells use it for completion, hovers and argument checks. Hermes loads
dictionaries from these places in both modes:

| Dictionary | Loaded | After a restart, with a folder open |
| --- | --- | --- |
| F Prime JSON dictionaries in the workspace's `build-artifacts/**/dict/` folders | Automatically, and again when a build changes them | Found again |
| A file you open with [Open Dictionary](#load-or-delete-a-dictionary) | When you open it | Kept |
| `<instance>` and `<instance> (F Prime)`, built from each YAMCS instance's commands | Each time YAMCS mode connects | Kept |

### Pick a dictionary

To see or change the dictionary of the language you are writing, click `{ }` in the status bar, then **Select**. It
lists F Prime dictionaries for F Prime cells and YAMCS dictionaries for YAMCS cells.

![Selecting a dictionary from the status bar](../assets/dict-select.png)

The selected dictionary applies to cells on Automatic. A cell with a [target](notebooks.md#pick-a-cell-target) uses
its target's dictionary, even in Offline mode.

### Load or delete a dictionary

The **Connections** view, in the Hermes sidebar, lists the dictionaries Hermes has loaded.

- To load an F Prime dictionary from a file, pick **F Prime (JSON, >=4.0)** or **F Prime (XML, <4.0)** in the view's
  menu and click **Open Dictionary**.
- To delete a dictionary, click its trash icon. Deleting `<instance>` also deletes `<instance> (F Prime)`. Deleting
  only `<instance> (F Prime)` doesn't last, because Hermes FPrime builds it again from `<instance>`. A dictionary from
  `build-artifacts` comes back the next time Hermes changes mode or restarts.

## Cells in Offline mode

Cells parse and check their commands in Offline mode, but running one fails with "No target FSW set on this cell (or
connected)". A cell whose target isn't connected shows that target with a disconnected icon in its status bar.

To write a cell for an instance before connecting, pick that instance, marked "not connected", as the cell's
[target](notebooks.md#pick-a-cell-target). The picker lists each instance whose dictionary Hermes saved the last time it
connected, and the cell uses that dictionary.
