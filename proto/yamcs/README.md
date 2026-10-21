# YAMCS protos

This directory holds `processing.proto`, `events_service.proto`, `commands_service.proto`,
`instances_service.proto` and everything they import, copied unchanged from the `yamcs/` directory of
`org.yamcs:yamcs-api:5.13.5` on Maven Central. YAMCS licenses them under the LGPL-3.0.

## Who uses them

- The [Hermes VS Code extensions](../../src/extensions/core/README.md), through TypeScript bindings.
- [yamcs-recorder](../../cmd/yamcs-recorder/README.md), through Go bindings.
- grpcurl, as in the [yamcs-grpc plugin's example](../../yamcs-grpc-plugin/README.md#try-it).

The yamcs-grpc plugin doesn't read them. It serves the definitions compiled into YAMCS, so editing
these files doesn't change what the server offers.

## Update

Copy the same files from the `yamcs/` directory of a newer `yamcs-api` jar, which is a zip archive on
Maven Central. Then regenerate the bindings from the repository root:

| Command | Generates | Needs |
| --- | --- | --- |
| `yarn proto-go-yamcs` | Go code in `internal/yamcspb/` | Go, and protoc 36.0 exactly |
| `yarn proto-ts-yamcs` | TypeScript types in `src/modules/rpc/src/proto/yamcs/` | `yarn install` |
| `yarn proto-json-yamcs` | JSON descriptors in `src/modules/rpc/src/proto/yamcs.json` | `yarn install` |
