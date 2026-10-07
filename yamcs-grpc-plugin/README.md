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

YAMCS mode can't send commands or show events. It sends no credentials, so it fails with
`UNAUTHENTICATED` when YAMCS security is on. When its subscription ends, for example because YAMCS
or its instance stopped, the status bar turns red with the reason in its tooltip. To subscribe again,
run **Hermes: Reconnect to Backend**.

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
