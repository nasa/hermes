---
icon: fontawesome/solid/book-open
---

# Notebooks

A Hermes notebook mixes Markdown cells, for instructions and notes, with code cells that send commands to the flight
software. Cells send commands once Hermes [connects to YAMCS](offline-mode.md#connect-to-yamcs). In Offline mode, before
it connects, you can still write and check them.

## Create a notebook

| File name ends in | Opens as | Extension | Saved as |
| --- | --- | --- | --- |
| `.hermes.md` | Hermes notebook | Hermes | Markdown. Code cells become code blocks and each cell's event list becomes a table, so the file reads as a document on GitHub. |
| `.fnb` | F Prime notebook | Hermes FPrime | F Prime sequence text, with everything but the commands in `;` comment lines |

![An empty Hermes notebook](../assets/empty-notebook.png)

Add a code cell, then click the language name at the bottom right of the cell to pick its language.

![Picking a code cell's language](../assets/code-cell-language-mode.png)

| Language | Extension | Names a command by |
| --- | --- | --- |
| YAMCS | Hermes YAMCS | Its [qualified name](../arch/core-concepts.md#yamcs-terms), the command's full path in YAMCS |
| fprime | Hermes FPrime | Its F Prime name, after a time tag |

## YAMCS cells

Write one command per line: its qualified name, then its arguments, separated by spaces or commas. A line starting
with `#` is a comment.

```
# A no-op, then a no-op that carries a string
/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP
/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING "hello"
```

## F Prime cells

When [fprime-yamcs](https://github.com/fprime-community/fprime-yamcs) runs a YAMCS instance, Hermes FPrime builds a
[dictionary](offline-mode.md#dictionaries) called `<instance> (F Prime)` from the instance's commands. F Prime cells use
it to send those commands by their F Prime names.

```
R00:00:00 CdhCore.cmdDisp.CMD_NO_OP
R00:00:05 CdhCore.cmdDisp.CMD_NO_OP_STRING "hello"   ; waits 5 s after the first command
```

| Part of a line | Example | Meaning |
| --- | --- | --- |
| Time tag, required | `R00:00:05` | Wait this long after the previous command passes, or after the cell starts, then send. The format is `RHH:MM:SS[.sss]`. |
| Command | `CdhCore.cmdDisp.CMD_NO_OP_STRING` | The command's YAMCS path without the deployment, joined with dots. In YAMCS, this one is `/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING`. |
| Arguments | `"hello"` | Separated by spaces or commas |
| Comment | `; waits 5 s` | Everything after `;` |

An absolute time tag, such as `A2026-293T12:00:00`, doesn't wait. The command sends right away.

## Pick a cell target

Each F Prime or YAMCS cell sends its commands to its target. In YAMCS mode, each running YAMCS instance is a target
called `yamcs:<instance>`. The cell's status bar, below its code, shows the target. Click it to pick another:

| Choice | Target |
| --- | --- |
| Automatic | The only connected instance. A cell on Automatic refuses to run while several instances are connected. |
| Custom | The name you type, such as `yamcs:fprime-project` |
| `yamcs:<instance>` | An instance Hermes is connected to |
| `yamcs:<instance>`, not connected | An instance whose dictionary Hermes saved the last time it connected. The cell can't run until that instance is connected. |

To give every F Prime and YAMCS cell in a notebook the same target, click **Set Target for All Cells** in the
notebook toolbar and pick an instance, connected or not. Cells added afterwards start on Automatic.

A cell checks its commands against its target's dictionary: `<instance>` for a YAMCS cell, `<instance> (F Prime)` for
an F Prime cell. A cell on Automatic uses the dictionary [selected](offline-mode.md#pick-a-dictionary) under `{ }` in
the status bar, which Hermes sets to the first instance's when it connects. An F Prime dictionary from a
`build-artifacts` folder doesn't come from YAMCS, so an F Prime cell on Automatic that uses one fails to run with "has
no YAMCS qualified name".

## Run a cell

Click the cell's run button. The cell sends its commands one at a time, each once the one before it has passed.

Whether a command passes can depend on its verifiers, the checks YAMCS runs on returning telemetry to decide whether a
command worked.

| When | The command |
| --- | --- |
| YAMCS sends a command that has no verifiers | Passes, even if the flight software then rejects it |
| The command's verifiers pass | Passes |
| A verifier fails or times out | Fails, with YAMCS's reason. If YAMCS doesn't fail the command itself, its status shows `?`. |
| YAMCS refuses the command or fails to send it | Fails, with YAMCS's reason |

- A failed command stops the cell, and the commands after it aren't sent.
- Hermes has no timeout of its own. A cell waits as long as YAMCS takes, or until you stop it.
- Stopping a cell doesn't withdraw a command YAMCS already has.
- fprime-yamcs gives commands no verifiers, so they pass once YAMCS sends them. The cell's events show how the flight
  software responded.

### Command status

While a cell runs, each command's status shows at the end of its line.

| Status (example) | Meaning |
| --- | --- |
| `◷ sends in 3.2 s` | Waiting out its time tag |
| `● Sent · 0.4 s` | In flight, with the newest step YAMCS recorded for it and the time so far |
| `✓ Sent · 0.1 s` | Passed, with the newest step and the time it took |
| `✗ failed · EXECUTION_ERROR` | Failed, with YAMCS's reason |
| `○ not sent` | Waiting for the commands before it, or the cell ended before sending it, or YAMCS refused it |
| `? Sent · 1.5 s` | Result unknown: the cell stopped while the command was in flight, or a verifier failed and YAMCS didn't fail the command |

Hover over a status to see each step YAMCS recorded, with its UTC time. The notebook saves the statuses, so they come
back when you reopen it, as long as the command's line is unchanged. Running the cell again clears them.

## Events in a cell's output

While a cell runs, its output lists every event YAMCS reports for the cell's target, including events that other
commands or clients caused. It keeps listing for one second after the last command ends.

- An F Prime event shows its component, name and F Prime severity, such as `WARNING_HI`. Any other event shows YAMCS's
  source, type and severity.
- To hide F Prime events of one severity, turn off its setting, such as `hermes.notebook.evrDiagnostic`. Other events
  always show.
- Times are in UTC. To change that, set `hermes.notebook.evr.timeFormat` to `local` or `sclk`. YAMCS gives events no
  SCLK, so under `sclk` the time is blank.

To see events outside a cell's run, use the [events panel](telemetry-and-events.md#events-panel).

## Operator signoff

To sign off a step of a procedure in a Hermes notebook, finish editing a Markdown cell and click **Operator Signoff**
in its toolbar. Hermes adds a line like this to the cell:

```
> October 20th 2026, 3:04:05 pm OPERATOR NAME
```

| Setting | Default | Sets |
| --- | --- | --- |
| `hermes.notebook.signoff.name` | `OPERATOR NAME` | The name to sign with |
| `hermes.notebook.signoff.template` | `> {date} {name}` | The line Hermes adds |
| `hermes.notebook.signoff.datetime` | `MMMM Do YYYY, h:mm:ss a` | The [Moment.js format](https://momentjs.com/docs/#/displaying/format/) of `{date}` |
