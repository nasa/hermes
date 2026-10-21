# Hermes YAMCS

Send YAMCS commands from Hermes notebooks. It needs the
[Hermes extension](https://github.com/nasa/hermes/tree/v6/src/extensions/core).

## Write a cell

Switch Hermes to [YAMCS mode](https://github.com/nasa/hermes/tree/v6/src/extensions/core#yamcs-mode) first. Then, in a
Hermes notebook (`.hermes.md`), set a code cell's language to **YAMCS**. Write one command per line: its qualified
name, which is its full path in YAMCS, then its arguments, separated by spaces or commas. Lines starting with `#` are
comments.

```
/Ref_Ref/CdhCore/cmdDisp/CMD_NO_OP
/Ref_Ref/CdhCore/cmdDisp/CMD_NO_OP_STRING "hello"
```

Completion, hovers and argument checks start once YAMCS mode connects, and keep working with no connection if VS Code
has a folder open. They use the commands of the cell's target, the instance picked in its status bar. A cell on
**Automatic**, the default, uses the dictionary selected under `{ }` in the status bar, which Hermes sets to the first
instance's.

To write F Prime names and time tags instead, use an F Prime cell from
[Hermes FPrime](https://github.com/nasa/hermes/tree/v6/src/extensions/fprime).

## Run a cell

A cell sends its commands one at a time to its target, each once the one before it has passed. A cell on Automatic
refuses to run while several instances are connected. To give every cell the same target, click
**Set Target for All Cells** in the notebook toolbar.

The mission database, which defines an instance's commands, can give a command verifiers. These are checks YAMCS runs
on the telemetry that comes back, to decide whether the command worked.

| When | The command |
| --- | --- |
| YAMCS sends a command that has no verifiers | Passes, even if the flight software then rejects it |
| The command's verifiers pass | Passes |
| A verifier fails or times out | Fails. Its status shows `✗` and YAMCS's reason, or `?` if YAMCS doesn't fail the command itself. |
| YAMCS refuses the command or fails to send it | Fails, with YAMCS's reason |

- A failed command stops the cell, and the commands after it aren't sent.
- Hermes has no timeout of its own. A cell waits as long as YAMCS takes to send and verify a command, or until you
  stop it.
- Stopping a cell doesn't withdraw a command YAMCS already has.

## Command status

While a cell runs, each command's status shows at the end of its line. YAMCS records each stage of sending and
checking a command as a step, such as `Sent`.

| Status (example) | Meaning |
| --- | --- |
| `● Sent · 0.4 s` | In flight, with the newest step YAMCS recorded for it and the time so far |
| `✓ Sent · 0.1 s` | Passed, with the newest step and the time it took |
| `✗ failed · EXECUTION_ERROR` | Failed, with YAMCS's reason |
| `○ not sent` | Waiting for the commands before it, or the cell ended before sending it, or YAMCS refused it |
| `? Sent · 1.5 s` | Result unknown: the cell stopped while the command was in flight, or a verifier failed and YAMCS didn't fail the command |

Hover over a status to see each step YAMCS recorded for the command, with its UTC time and the time since the first
step. The statuses and their steps are saved with the notebook, so they come back when you reopen it, as long as the
command's line is unchanged. Running the cell again clears them.

## Cell output

While a cell runs, its output lists every event YAMCS reports for the cell's target, including ones the cell's
commands didn't cause. It keeps listing for one second after the last command ends.

- An F Prime event, from [fprime-yamcs](https://github.com/fprime-community/fprime-yamcs), shows its F Prime severity,
  such as `WARNING_HI`. Any other event shows YAMCS's severity.
- To hide F Prime events of one severity, turn off its setting, such as `hermes.notebook.evrDiagnostic`. Other events
  always show.

For events outside a cell's run, or ones these settings hide, see the events panel.

## Limits under fprime-yamcs

- Commands have no verifiers, so a command passes once YAMCS sends it, even if the flight software rejects it. The
  cell's event list shows how the flight software responded.
- Hovers show only names and types, because fprime-yamcs gives commands no descriptions.
- The editor can't check a string's length. YAMCS refuses a string that is too long when the cell runs.
