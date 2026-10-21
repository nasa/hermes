# Hermes FPrime

Adds F Prime's command language to [Hermes](https://github.com/nasa/hermes/tree/v6), for F Prime cells in Hermes
notebooks (`.hermes.md`), `.seq` sequence files and F Prime notebooks (`.fnb`), which save as sequence text instead of
Markdown. It needs the [Hermes extension](https://github.com/nasa/hermes/tree/v6/src/extensions/core).

## Features

- F Prime commands with completion, hovers and argument checks from an F Prime dictionary, the file an F Prime build
  writes that lists its commands, events and telemetry channels. To pick the dictionary, click the `{ }` item next to
  the language name in the status bar.
- Reads dictionaries in JSON (F Prime 4.0 and newer) or XML (older), and finds JSON ones in the workspace's
  `build-artifacts` folders on its own.

## F Prime cells in YAMCS mode

When [fprime-yamcs](https://github.com/fprime-community/fprime-yamcs) runs a YAMCS instance, F Prime cells can send
commands to it through [YAMCS mode](https://github.com/nasa/hermes/tree/v6/src/extensions/core#yamcs-mode). Hermes
builds a dictionary called `<instance> (F Prime)` for each such instance.

A cell uses the dictionary of its target, the instance picked in its status bar. A cell on **Automatic**, the default,
uses the dictionary selected under `{ }`, which Hermes sets to the first instance's. If you select one from
`build-artifacts` there instead, the cell fails with "has no YAMCS qualified name".

An F Prime cell looks like this:

```
R00:00:00 CdhCore.cmdDisp.CMD_NO_OP
R00:00:05 CdhCore.cmdDisp.CMD_NO_OP_STRING "hello"   ; waits 5 s after the first command
```

| Part of a line | Example | Meaning |
| --- | --- | --- |
| Time tag, required on every line | `R00:00:05` | A relative tag: wait this long after the previous command passes (or the cell starts), then send. The line counts down while it waits, for example `◷ sends in 3.2 s`. |
| Command | `CdhCore.cmdDisp.CMD_NO_OP_STRING` | The F Prime name: the command's YAMCS path, here `/Ref_Ref/CdhCore/cmdDisp/CMD_NO_OP_STRING`, without its top-level part (`/Ref_Ref`) and joined with dots |
| Arguments | `"hello"` | Separated by spaces or commas |
| Comment | `; waits 5 s` | Everything after `;` |

Commands pass, fail and show their status as in
[YAMCS cells](https://github.com/nasa/hermes/tree/v6/src/extensions/yamcs#run-a-cell), and the cell lists events the
same way.

fprime-yamcs gives commands no verifiers, the checks YAMCS runs on returning telemetry to decide whether a command
worked. So a command passes once YAMCS sends it, even if the flight software rejects it. The cell's event list shows
how the flight software responded.

## Limits

- An absolute time tag (`A...`) doesn't wait. The command sends right away.
