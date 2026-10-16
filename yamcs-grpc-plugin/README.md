# yamcs-grpc

A YAMCS plugin that serves the YAMCS API over gRPC. Calls and subscriptions that YAMCS serves over
HTTP and WebSocket become gRPC calls and streams, answered by the same YAMCS code.

Hermes uses it for YAMCS mode, which shows live YAMCS telemetry and events in VS Code and sends
commands from notebook cells.

## Build

From `yamcs-grpc-plugin/`:

```sh
./build.sh   # needs Docker, curl and a POSIX shell (Git Bash or WSL on Windows)
mvn test     # needs Maven 3.9+ and Java 17+, but no YAMCS server
```

`build.sh` compiles against YAMCS 5.13.5 inside the `yamcs/example-simulation` image and writes the
plugin and its gRPC jars to `out/lib/`. `pom.xml` lists the same dependencies for IDEs and `mvn test`.
Keep its versions in sync with `build.sh`.

## Run

The plugin runs inside a YAMCS server, which loads it at startup from its classpath and logs
`gRPC API listening on port 8091`.

With fprime-yamcs, the tool that runs YAMCS for an F Prime deployment (tested with 0.2.3, which
bundles YAMCS 5.12.8):

```sh
fprime-yamcs ... --yamcs-plugin-jars <repo>/yamcs-grpc-plugin/out/lib
```

With stock YAMCS, put the `out/lib` jars in YAMCS's `lib/ext`. For example, from `yamcs-grpc-plugin/`:

```sh
docker run -d --name yamcs-grpc -p 8090:8090 -p 8091:8091 \
    -v "$(pwd -W 2>/dev/null || pwd)/out/lib:/opt/yamcs/lib/ext:ro" yamcs/example-simulation:5.13.5
```

To change the port, add this to `yamcs.yaml`. With fprime-yamcs, that is `etc/yamcs.yaml` in the
directory you pass to `--yamcs-config-dir`.

```yaml
yamcs-grpc:
  port: 8095
```

## Try it

With the container above running, this grpcurl command streams a battery voltage. Run it from the
Hermes repo root, whose `proto/yamcs/` holds the YAMCS `.proto` files for clients.

```sh
grpcurl -plaintext -import-path proto -proto yamcs/protobuf/processing/processing.proto \
    -d '{"instance":"simulator","processor":"realtime","id":[{"name":"/YSS/SIMULATOR/BatteryVoltage1"}]}' \
    localhost:8091 yamcs.protobuf.processing.ProcessingApi/SubscribeParameters
```

## Security

- The plugin has no TLS and listens on every interface. Traffic is unencrypted, and any machine that
  can reach the port can connect.
- With YAMCS security on, clients send the same Basic or Bearer `authorization` header as for HTTP.
  Hermes sends none, so YAMCS mode fails with `UNAUTHENTICATED` unless YAMCS security is off.

## YAMCS mode in VS Code

Run "Hermes: Change Backend Mode", pick "YAMCS", and enter the plugin's address and the YAMCS
instance. To change them later, click the instance name in the status bar.

Defaults come from the `hermes.host.yamcs` setting:

| Setting | Default | Use |
| --- | --- | --- |
| `address` | `localhost:8091` | The plugin's `host:port` |
| `instance` | `fprime-project` | The YAMCS instance |
| `processor` | `realtime` | The processor to subscribe on and send commands to |
| `includeTopLevel` | `false` | Also show top-level parameters, which in fprime-yamcs are packet header fields |

If YAMCS or the instance stops, the status bar turns red with the reason in its tooltip. Run
"Hermes: Reconnect to Backend" to connect again.

### Telemetry and events

- Parameters, which are F Prime channels under fprime-yamcs, show in the telemetry table and plot with
  source `yamcs:<instance>`. Each struct member or array element gets its own row, such as
  `comQueueDepth[1]`, timed by when YAMCS received the value.
- Events show in the events panel with the same source. The component column shows YAMCS's event
  source, and the name column shows the event type. On connect the panel loads the newest 100
  archived events, then adds live ones.
- YAMCS values carry no spacecraft clock (SCLK) time, so the SCLK column shows their UTC time.

### Commands

YAMCS mode builds a Hermes dictionary named after the instance from the instance's commands. The
Hermes YAMCS extension (`src/extensions/yamcs`) uses it for a YAMCS notebook cell language with
completion, hovers and argument checks. Each line is a command's qualified name and its arguments:

```
/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING "hello"
```

Some commands have verifiers, which are checks YAMCS runs on the telemetry that comes back. The
instance's mission database defines them. A cell sends one command at a time and waits for each
command's verifiers before sending the next.

| What happens | Cell result |
| --- | --- |
| YAMCS sends a command that has no verifiers | Passes, though the flight software may not have run it |
| The command's verifiers pass | Passes |
| A verifier fails or times out | Fails |
| YAMCS refuses or fails to send the command | Fails with YAMCS's reason |

A failed command stops the cell. Hermes has no timeout of its own, so a cell waits until YAMCS sends
the command and its verifiers finish, or until you stop it. Stopping a cell doesn't cancel a command
it has already handed to YAMCS.

fprime-yamcs builds its mission database with fprime-xtce, which as of 0.1.5 defines no verifiers. So
under fprime-yamcs a cell passes once YAMCS has sent its commands, even if the flight software rejects
one.

### F Prime cells

When fprime-yamcs runs the instance, F Prime cells work too. They use F Prime command names such as
`CdhCore.cmdDisp.CMD_NO_OP`, from a dictionary called `<instance> (F Prime)`. Each line's relative
time tag, such as `R00:00:05`, is a delay before Hermes sends that command as a YAMCS cell would.

In Hermes's other modes, an F Prime cell's output lists the events its commands raise. In YAMCS mode
it doesn't, so look in the events panel.

## Limits

- A client more than 8 MiB behind on a stream is cut off with `RESOURCE_EXHAUSTED`, so a stalled
  client can't fill YAMCS's memory.
- gRPC clients don't appear in YAMCS's connection list, which covers only HTTP.
- `SessionsApi/SubscribeSession` fails with `Internal`, because YAMCS finds a session by its browser
  cookie.
- `GrpcContext` relies on a package-private YAMCS constructor, so a YAMCS upgrade could break it.

## Live tests

Run these from the repo root against fprime-yamcs with the plugin loaded. They wait for the
FrameworkVersion channel, which F Prime sends only at boot, so boot the deployment while YAMCS runs.

```sh
YAMCS_GRPC_ADDRESS=localhost:8091 yarn jest src/extensions/core/test/yamcs.test.ts
node build build                           # builds the extension that run.js tests
node src/extensions/core/test/e2e/run.js   # opens VS Code 1.138.0, downloaded on first run
```

- Jest skips the live tests unless `YAMCS_GRPC_ADDRESS` is set. `run.js` defaults it to `localhost:8091`.
- The jest tests and `run.js` read `YAMCS_INSTANCE`, default `fprime-project`, and each send a
  `CMD_NO_OP_STRING` to the flight software.
- The jest tests leave two events in the instance's archive.
