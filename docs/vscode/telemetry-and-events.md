---
icon: fontawesome/solid/chart-line
---

# Telemetry and Events

Hermes adds two tabs to the VS Code panel, **Hermes: Telemetry** and **Hermes: Events**. In YAMCS mode they show the
telemetry and events of every connected YAMCS instance. Each row's source is `yamcs:<instance>`, and a Source filter
appears once there is more than one.

## Telemetry table and plot

![The telemetry table and plot](../assets/telemetry-panel.png)

The table has a row for each [parameter](../arch/core-concepts.md#yamcs-terms), YAMCS's name for a telemetry value:

- The component is the parameter's path in YAMCS without its name, and the channel is the name.
- A struct or array gets a row for each member or element, such as `comQueueDepth[1]`.
- Each value is timed by when YAMCS received it.
- Parameters directly under a top-level path, such as `/Ref_Ref/FPrimeTime`, are left out. fprime-yamcs puts packet
  header fields there. To show them, set `"includeTopLevel": true` in the
  [`hermes.host.yamcs` setting](offline-mode.md#connect-to-yamcs).

| # | Control | What it does |
| --- | --- | --- |
| 1 | Table | Shows each row's newest value |
| 2 | Plot | Check a numeric row to plot it |
| 3 | Plot | Plots the checked rows over the time window |
| 4 | Legend | Shows each plotted row's minimum, maximum and last value. Click a row's name to hide its line. |
| 5 | Time format | UTC, Local or SCLK. See [Times](#times). |
| 6 | Filters | Show only some components, or the channels whose name contains the text you type |
| 7 | Clear Telemetry | Empties the table and plot |
| 8 | Screenshot | Saves the plot as a PNG in the workspace folder |
| 9 | Line style | Linear, smooth or one of two step styles |
| 10 | Time window | The last 1m, 5m, 30m, 1h or 3h |

Hermes keeps the newest 10,000 values of each row.

## Events panel

![The events panel](../assets/event-panel.png)

When YAMCS mode connects, the panel lists each instance's newest 100 events from YAMCS's archive, then new events as
YAMCS reports them.

- An F Prime event shows its component, name and F Prime severity, such as `CdhCore.cmdDisp`, `OpCodeDispatched` and
  `COMMAND`. Any other event shows YAMCS's source, type and severity.
- Each event is timed by when the flight software raised it.

| # | Control | What it does |
| --- | --- | --- |
| 1 | Event list | Lists the events that pass the filters |
| 2 | Time format | UTC, Local or SCLK. See [Times](#times). |
| 3 | Severities | Shows only the checked severities |
| 4 | Filter Events | Shows only the events whose message contains the text you type |
| 5 | Follow | Scrolls to each new event |
| 6 | Clear | Empties the list |

## Times

The table, the plot and the events panel show times in UTC. You can switch the table and the panel to Local or SCLK.
YAMCS gives parameters and events no SCLK (spacecraft clock) time, so their time is blank under SCLK.
