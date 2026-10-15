# yamcs-grpc

A YAMCS plugin that serves the YAMCS API over gRPC, using YAMCS's own `.proto` service definitions
unchanged. Each call is handed to the same `Api` implementation that answers YAMCS's HTTP and
WebSocket requests, so the plugin holds no per-method logic and no generated server code.

## Build

```sh
./build.sh
```

Needs Docker and a POSIX shell (Git Bash or WSL on Windows). It downloads grpc-java 1.84.0 from Maven
Central and compiles against the YAMCS 5.13.5 jars inside `yamcs/example-simulation`. `out/lib/` then
holds the plugin jar and the grpc-java jars.

## Editing in an IDE

`pom.xml` lists the same dependencies, so VS Code's Java extension (or any Maven-aware IDE) can
resolve YAMCS and gRPC without a Maven install. `build.sh` builds the jar YAMCS loads, so keep the
versions in both files in sync.

## Test

```sh
mvn test
```

Needs Maven 3.9 or newer and Java 17 or newer. The tests in `test/` run without a YAMCS server.

## Run

The plugin loads into an existing YAMCS; it is not a separate server. gRPC listens on 8091. To
change it, add this to the server's `yamcs.yaml`:

```yaml
yamcs-grpc:
  port: 8095
```

With YAMCS security enabled, send the same Basic or Bearer `authorization` header as for HTTP.

A client that falls more than 8 MiB behind on a stream has its call ended with `RESOURCE_EXHAUSTED`,
so a stalled client can't fill YAMCS's memory.

**With fprime-yamcs** (tested with 0.2.3, which bundles YAMCS 5.12.8):

```sh
fprime-yamcs ... --yamcs-plugin-jars <repo>/yamcs-grpc-plugin/out/lib
```

To set the port, put the `yamcs-grpc` section in `etc/yamcs.yaml` under the directory you pass to
`--yamcs-config-dir`.

**With stock YAMCS.** Everything in YAMCS's `lib/ext` is on its classpath, so mount `out/lib` there.
With the example-simulation image, from `yamcs-grpc-plugin/`:

```sh
docker run -d --name yamcs-grpc -p 8090:8090 -p 8091:8091 \
    -v "$(pwd -W 2>/dev/null || pwd)/out/lib:/opt/yamcs/lib/ext:ro" yamcs/example-simulation:5.13.5
```

## Try it

From the repo root:

```sh
grpcurl -plaintext -import-path proto -proto yamcs/protobuf/processing/processing.proto \
    -d '{"instance":"simulator","processor":"realtime","id":[{"name":"/YSS/SIMULATOR/BatteryVoltage1"}]}' \
    localhost:8091 yamcs.protobuf.processing.ProcessingApi/SubscribeParameters
```

## VS Code

In VS Code, run **Hermes: Change Backend Mode**, pick **YAMCS**, and enter the plugin's address and
the instance. The prompts are prefilled from the `hermes.host.yamcs` setting, then from your last
answers. The setting also picks the processor. Clicking the instance name in the status bar
prompts again. F Prime channels show up in the telemetry table and plot with source `yamcs:<instance>`.
Parameters directly in a top-level space system, where fprime-yamcs puts the CCSDS and F Prime packet
header fields, are left out unless `hermes.host.yamcs` sets `includeTopLevel`. Structs and arrays get
one row per member or element, such as `comQueueDepth[1]`, with member paths spelled the way
yamcs-recorder (`cmd/yamcs-recorder`) stores them. Rows are timed by when YAMCS received each
value, its acquisition time. YAMCS values have no SCLK, so the SCLK column shows that time in UTC.

YAMCS events show up in the events panel with source `yamcs:<instance>`, YAMCS's source in the
component column and its type in the name column. On connect the panel loads the newest 100 events
from the archive, then adds live ones. It does not show an event's extra, reception time or createdBy.

YAMCS mode lists the instance's commands when it connects and builds a Hermes dictionary from them,
listed under the instance's name with type `yamcs`. The Hermes YAMCS extension
(`src/extensions/yamcs`) adds a YAMCS cell language for Hermes notebooks: one command per line, its
qualified name and then its arguments, for example
`/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING "hello"`. Completion, hovers and argument
checks come from that dictionary. fprime-yamcs gives commands no descriptions, so hovers show only
names and types. It gives a string's limit only as its encoded size, which YAMCS's `ListCommands`
doesn't report, so YAMCS rather than the editor refuses a string that is too long.

YAMCS cells run on the connection `yamcs:<instance>`, on the processor from `hermes.host.yamcs`, one
command at a time. YAMCS's mission database, which defines the instance's commands, can give a command
verifiers. These are checks YAMCS runs on the telemetry that comes back, to decide whether the command
succeeded or failed. For a command with verifiers, Hermes waits for YAMCS's verdict before it issues
the next command. The command passes when YAMCS records `CommandComplete` as `OK`, and the cell fails
with YAMCS's reason when it records `NOK`. The database decides which results of a verifier give a
verdict. If a verifier fails or times out and the database gives that result no verdict, the cell
fails and says the command's result is unknown. If every verifier passes and none gives a verdict, the
command passes. Hermes sets no time limit of its own, so a cell waits as long as the database lets a
command's verifiers wait, or until you stop it. A command without verifiers passes once YAMCS has sent
it, which doesn't mean the flight software ran it. When YAMCS refuses or fails to send a command, the
cell fails with YAMCS's reason. Commands after a failed one aren't sent. Stopping a cell doesn't
withdraw a command YAMCS already holds.

When you run a cell, the editor shows each command's status at the end of its line. A command in
flight shows the newest step YAMCS has recorded and how long it has taken so far, for example
`● Sent · 0.4 s`. A command that passes shows `✓` and the time it took, and one that fails shows `✗`
with YAMCS's reason, for example `✗ failed · EXECUTION_ERROR`. Commands the cell hasn't sent show
`○ not sent`, and a command still in flight when the cell stops shows `?`. Hover over a status to see
the steps YAMCS has recorded for the command.

F Prime cells run in YAMCS mode too, when fprime-yamcs runs the instance. The Hermes F Prime extension
builds an F Prime dictionary from YAMCS mode's dictionary, listed as `<instance> (F Prime)`. It names
each command as F Prime does, for example `CdhCore.cmdDisp.CMD_NO_OP` for
`/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP`, and takes its opcode from fprime-yamcs's
`OpCode` argument assignment. Each command waits out its relative time tag, then goes out as a YAMCS
cell's command does, so an F Prime cell passes, fails and shows its commands' statuses as a YAMCS cell
does. The cell waits for the flight software only when the mission database gives a command verifiers.
fprime-yamcs builds its database with fprime-xtce, which as of version 0.1.5 defines none, so with
that database an F Prime cell passes once YAMCS has sent its commands, even when the flight software
rejects one. Unlike Local and Remote modes, the cell doesn't list the events its commands raise. They
show in the events panel.

YAMCS mode sends no credentials, so it fails with `UNAUTHENTICATED` when YAMCS security is on. When
its subscription ends, for example because YAMCS or its instance stopped, the status bar turns red
with the reason in its tooltip. To subscribe again, run **Hermes: Reconnect to Backend**.

Checks against fprime-yamcs with the plugin and a running F Prime deployment, from the repo root.
They wait for FrameworkVersion, which F Prime sends only at boot, so the deployment must have booted
while this YAMCS instance was running:

```sh
YAMCS_GRPC_ADDRESS=localhost:8091 yarn jest src/extensions/core/test/yamcs.test.ts
node build build
node src/extensions/core/test/e2e/run.js   # downloads VS Code 1.138.0 on first run
```

The live jest tests run only when `YAMCS_GRPC_ADDRESS` is set. `run.js` defaults to `localhost:8091`
and writes `result.json` next to itself. Both read `YAMCS_INSTANCE`, default `fprime-project`.
The two live event tests each raise one event with YAMCS's `CreateEvent`, which stays in that instance's archive.
One live command test and `run.js` each send a `CMD_NO_OP_STRING` to the flight software.
`VSCODE_TEST_CACHE` points `run.js` at an existing VS Code download. `E2E_HOLD_MS` holds the window
open that many milliseconds with the telemetry table showing.

## Not done

- `GrpcContext` has to live in `org.yamcs.http` because `Context`'s constructor is package-private.
  A YAMCS upgrade could break that.
- `SessionsApi/SubscribeSession` fails with `Internal`: YAMCS finds the session through the browser's
  HTTP cookie, which a gRPC call lacks. Hermes doesn't call it.
- gRPC clients don't show up in YAMCS's connection list (`/api/http-traffic`), which only covers HTTP
  connections.
- No TLS, and it listens on every interface.
