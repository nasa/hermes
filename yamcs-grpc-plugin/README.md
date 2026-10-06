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

## Not done

- `GrpcContext` has to live in `org.yamcs.http` because `Context`'s constructor is package-private.
  A YAMCS upgrade could break that.
- `SessionsApi/SubscribeSession` fails with `Internal`: YAMCS finds the session through the browser's
  HTTP cookie, which a gRPC call lacks. Hermes doesn't call it.
- gRPC clients don't show up in YAMCS's connection list (`/api/http-traffic`), which only covers HTTP
  connections.
- No TLS, and it listens on every interface.
