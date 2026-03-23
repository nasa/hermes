---
icon: fontawesome/solid/window-restore
---

# Workflow

This document will describe the various features of the Hermes frontend
to help define a user's workflow when interacting with their system.
If you have not yet connected Hermes to your flight-software you should
follow [this](./quick-start.md) guide first.

This document only describes features in VSCode. This may be suffcient for
software or local development. However during test activities and flight operations,
it highly is recommended to set up [telemetry monitoring](../tlm/index.md)
infrastructure to persist data and monitor channels.

## Commanding & Notebooks

Hermes utilizes VSCode Notebooks which are very similar to
[Jupyter Notebooks](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)
though true Jupyter Notebooks are not actually used by Hermes.

Hermes uses [Markdown](https://www.markdownguide.org/basic-syntax/)
as a backing format to define notebooks. A hermes notebook may be created
using the `.hermes.md` extension.

Once you create a `.hermes.md` file you should see something like this:

![alt text](../assets/empty-notebook.png)

Notebooks in VSCode are divided up into _cells_. There are two types of cells:
code and markdown. A markdown cell is a documentation cell that supports
[VSCode Markdown](https://code.visualstudio.com/docs/languages/markdown). These
cells are typically used to denote human instructions or additional contextual
information around raw FSW commands. A code cell is a cell that can be "executed"
or dispatched or a given FSW connection. Code cells have an associated language
and certain connections support dispatching certain languages.

### Basic Command Dispatch

Let's start by creating a code cell and changing the language type to `fprime`.

![alt text](../assets/code-cell-language-mode.png)

Once changed we should see that the bottom left of the code cell shows the name
of the FSW connection this code cell will dispatch commands to. In the
[previous](./quick-start.md#option-1-hermes-profile) tutorial we named our FSW connection `sensors-ref`
which now shows up in our notebook.

Now you may type a FSW command and dispatch it. In our example we are using a
connection to F Prime. F Prime commands come in the form:

```bash
# Relative-time commanding
R[HH]:[MM]:[SS] component.MNEMONIC [args...]
```

For example a common command to test the connection between ground and flight is:

```bash
R00:00:00 CdhCore.cmdDisp.CMD_NO_OP
```

Clicking the :fontawesome-solid-play: Play button for the cell will dispatch
each command, line by line in the cell until it reaches the first command failure.
The events that are emitting during the execution of the cell will be displayed
as they are received under the code cell:

![alt text](../assets/cmd-dispatch.png)

### Dictionary Selection

Hermes supports loading multiple dictionaries for different deployments or target FSWs.
When writing commands in a code cell, Hermes uses _one_ of the dictionaries to validate
commands and provide insides to the user such as auto-complete or hover information.

To select a dictionary you can use the `{}` language item at the
bottom of the VSCode window after you have selected the code block with the language
you are writing commands in:

![alt text](../assets/dict-select.png)

!!! tip
    By default, when a FSW connects to Hermes, the dictionary associated with that connection
    will automatically be selected. You may need to change the dictionary depending on which
    FSW you are commanding.

## Event Reports

Events that are emitted during the execution of a code block are logged inside
the notebook. However, this is not sufficient as events outside of the execution
time of a code cell may stream to the ground. Also, the notebook may be cleared
and therefore events lost.

Hermes provides a tab in the VSCode [panel](https://code.visualstudio.com/docs/getstarted/userinterface#_basic-layout)
called `Hermes: Events`.

![alt text](../assets/event-panel.png)

This panel keeps a log of all the events streaming from the FSW. They are kept
in memory and can be searched and filtered in this panel. The features of this panel
enumerated in the image above are described below:

| Feature | Name                     | Description                                                                                                       |
| ------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 1       | EVR Table                | Event table showing all in-memory events stored in this frontend with the source/severity/message filter applied. |
| 2       | Time format              | Format to display timestamp in. SCLK displayes the raw spacecraft clock, UTC & Local are derived from ERT.        |
| 3       | Source / Severity filter | Filter events by severity level. If multiple FSW connections are active, another source filter will appear.       |
| 4       | Message filter           | Filter events by message string (right-most column).                                                              |
| 5       | Follow                   | When checked, the table will automatically scroll to show the latest event as new events arrive to the ground.    |
| 6       | Clear Log                | Clear the in-memory store of events to free up memory usage. It is recommeded to use this during long test runs.  |

## Telemetry Charts

Telemetry channels are samples of data streamed to the ground at various rates configured
by the FSW. Channels can be defined as any [type](../arch/core-concepts.md#types) such as
a numeric, struct, array etc. Hermes ships with a tab in the VSCode Panel called `Hermes: Telemetry`
which has two panes:

1. Telemetry Table: A table view showing all the channels that Hermes has received and their latest value
2. Telemetry Plot: A time series plot of the _numeric_ channels selected in the table.

![alt text](../assets/telemetry-panel.png)

| Feature | Name                     | Description                                                                                                                                     |
| ------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1       | Telemetry Table          | Telemetry table showing latest value of each channel stored in this frontend with the source/severity/message filter applied.                   |
| 2       | Plot Select              | When checked (only shows for numeric channels), this channel will be plotted in the telemetry plot.                                             |
| 3       | Telemetry Plot           | Displays all the channels that are selected in the table over the selected time range.                                                          |
| 4       | Telemetry Plot Legend    | Displays the min/max/last values of each channel selected in the plot. Items pay be temporarily hidden from the plot by clicking on the legend. |
| 5       | Time format              | Format to display timestamp in. SCLK displayes the raw spacecraft clock, UTC & Local are derived from ERT.                                      |
| 6       | Source / Severity filter | Filter channels by component or name. If multiple FSW connections are active, another source filter will appear.                                |
| 7       | Clear Data               | Clear the in-memory store of telemetry to free up memory usage. Hermes VSCode has a hard limit per-channel at ~10k samples.                     |
| 8       | Screenshot               | Render the telemetry plot to an image.                                                                                                          |
| 9       | Interpolation Mode       | Determines how to connect lines between samples (i.e. linear, smooth last, current).                                                            |
| 10      | Time Window              | Time window to display data over. Relative to current time.                                                                                     |

!!! note
    The telemetry plot includes a backing in-memory database to store telemetry samples. To save from unbounded memory growth,
    each channel is limited to 10k samples. Older samples are cleared after this limit is reached.

!!! tip
    This telemetry plot is not meant to be a comprehensive dashboarding solution. It is recommeded to connect
    Hermes to [Grafana](https://grafana.com) for a more complete experience.

## File Transfer

Hermes supports file uplink and downlink to/from the spacecraft. The general model is
the _sender_ of the file will initiate the transfer. This means that for file uplink
Hermes is responsible for initiating the uplink while file downlink is initiated by
some mechanism of the FSW.

!!! note
    It is common for FSW to provide a command to initiate a downlink and therefore
    Hermes can _indirectly_ request a file to be downlinked. FSW might also use an
    automated mechanism to initiate file downlink according to a radio pass schedule
    or otherwise.

The Hermes VSCode frontend can _monitor_ downlink and _initiate_ uplink. Hermes
will handle the progress of file downlink and track missing or invalid pieces of
the file. This section will discuss how to uplink and downlink files using F Prime
FSW as an example.

### Uplink

![alt text](../assets/uplink-pane.png){ width=200 align=right }

File uplink is initiated by the Hermes frontend through the `Uplink` pane in the
rover panel of VSCode. Files can be added to this pane to _stage_ them for uplink
by click the :fontawesome-solid-plus: Plus icon.

It is important once you select the file to fill in the destination path
you wish to uplink the file to.

![alt text](../assets/uplink-complete.png){ width=200 align=left }

Once uplinked the file should show a :fontawesome-solid-check: check mark
next to the listing in the uplink pane.

#### Flow control

It is important to note that by Hermes default, Hermes will uplink files
as fast as the physical transport allows it to. This may be too fast for the
flight-software to handle. You may need to slow dowwn the uplink by using a
man-in-the-middle approach to limit transmission rates to/from the spacecraft.


### Downlink

Hermes does not explicitly initiate file downlink. As discussed earlier, Hermes
assumes all file transmission is handled by some mechanism the FSW defines.
It is common for flight software to provide a command to downlink a file or define
an automated downlink schedule. In this example we will utilize the FSW command
`FileHandling.fileDownlink.SendFile` provided by recommended F Prime FSW topologies.

![alt text](../assets/downlink-complete.png)

Once a file is downlinked, Hermes will put the file into the downlink folder that is
configured. If you are running Hermes in "Local" mode, this is typically the `.hermes`
directory in your workspace.

You should now see two new files in that folder:

1. `<fsw-name>-<timestamp>-<filename>.<ext>`: The actual file that was downlinked
2. `<fsw-name>-<timestamp>-<filename>.<ext>.md.pb`: A metadata file in [protobuf](https://protobuf.dev) format that includes information about the file that was downlinked
