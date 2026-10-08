# YAMCS protos

`processing.proto`, `events_service.proto` and everything they import, copied unchanged from the
`yamcs/` directory of `org.yamcs:yamcs-api:5.13.5` on Maven Central. YAMCS licenses them under
the LGPL-3.0.

The yamcs-grpc plugin does not read these files; it uses the descriptors compiled into YAMCS. They
are here for clients, which generate their bindings from them.

To update, copy the same paths from a newer `yamcs-api` jar, then run `yarn proto-go-yamcs`,
`yarn proto-ts-yamcs` and `yarn proto-json-yamcs` to regenerate the bindings. `yarn proto` runs
the last two but not `proto-go-yamcs`, which needs protoc 36.0 exactly, so run that one yourself.
