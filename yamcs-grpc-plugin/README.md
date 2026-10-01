# yamcs-grpc (prototype)

A YAMCS plugin that serves the YAMCS API over gRPC, using YAMCS's own `.proto` service definitions
unchanged. Each call is handed to the same `Api` implementation that answers YAMCS's HTTP and
WebSocket requests, so the plugin holds no per-method logic and no generated server code.

## Build

```sh
./build.sh
```

Needs Docker. It downloads grpc-java 1.84.0 from Maven Central and compiles against the YAMCS 5.13.5
jars inside `yamcs/example-simulation`. `out/lib/` then holds the plugin jar and the grpc-java jars.

## Editing in an IDE

`pom.xml` lists the same dependencies, so VS Code's Java extension (or any Maven-aware IDE) can
resolve YAMCS and gRPC without a Maven install. `build.sh` is still what builds the container jar, so
keep the versions in both files in sync.

## Run

The plugin loads into an existing YAMCS; it is not a separate server. gRPC listens on 8091. To
change it, add this to the server's `yamcs.yaml`:

```yaml
yamcs-grpc:
  port: 8095
```

**With fprime-yamcs.** fprime-yamcs 0.2.3 bundles YAMCS 5.12.8, so build against that version, then
pass a directory holding the plugin jar and `out/lib`'s grpc-java jars:

```sh
docker run --rm -v "$(pwd -W):/w" -w /w maven:3.9-eclipse-temurin-21 mvn -q -Dyamcs.version=5.12.8 package
fprime-yamcs ... --yamcs-plugin-jars <dir with target/yamcs-grpc-0.1.0.jar and out/lib/{grpc,perfmark}-*.jar>
```

**With stock YAMCS.** Anything in `lib/ext` is on the classpath, e.g. the example-simulation image:

```sh
docker run -d --name yamcs-grpc-proto -p 8190:8090 -p 8091:8091 \
    -v "$(pwd -W)/out/lib:/opt/yamcs/lib/ext:ro" yamcs/example-simulation
```

## Try it

From Windows, the address depends on where YAMCS runs: a Docker container answers on `127.0.0.1`,
while a server inside WSL answers on `localhost` (IPv6). From the repo root:

```sh
grpcurl -plaintext -import-path proto -proto yamcs/protobuf/processing/processing.proto \
    -d '{"instance":"simulator","processor":"realtime","id":[{"name":"/YSS/SIMULATOR/BatteryVoltage1"}]}' \
    127.0.0.1:8091 yamcs.protobuf.processing.ProcessingApi/SubscribeParameters
```

In VS Code, set `hermes.host.yamcs` to the plugin's address and instance, run **Hermes: Change
Backend Mode** and pick **YAMCS**. Every TELEMETERED parameter shows up in the telemetry table and
plot with source `yamcs:<instance>`. Aggregates and arrays get one row per member, named like the
recorder's member paths (`CCSDS_Packet_ID.APID`, `comQueueDepth[1]`).

Checks against a running plugin, from the repo root:

```sh
YAMCS_GRPC_ADDRESS=localhost:8095 yarn jest src/extensions/core/test/yamcs.test.ts
node build build
YAMCS_GRPC_ADDRESS=localhost:8095 node yamcs-grpc-plugin/e2e/run.js   # downloads VS Code 1.138.0 on first run
```

`VSCODE_TEST_CACHE` points `run.js` at an existing download instead.

## Not done

- `GrpcContext` has to live in `org.yamcs.http` because `Context`'s constructor is package-private.
  A YAMCS upgrade could break that.
- No slow-client policy. grpc-java buffers without limit when a client reads slower than YAMCS sends.
- `SessionsApi/SubscribeSession` returns an `Internal` error over gRPC. The YAMCS web UI uses it to
  hear when its login session expires, and it finds that session through the browser cookie on the
  HTTP connection, which a gRPC call doesn't have. Nothing in Hermes calls it, and `ListSessions`
  works.
- gRPC clients don't show up in YAMCS's connection list (`/api/http-traffic`), which only covers HTTP
  connections.
- No TLS. Auth reuses YAMCS's Basic and Bearer handling but was only tested with security off.
