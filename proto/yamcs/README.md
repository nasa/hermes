# YAMCS protos

`processing.proto` and everything it imports, copied unchanged from the `yamcs/` directory of
`org.yamcs:yamcs-api:5.13.5` on Maven Central. YAMCS licenses them under the LGPL-3.0.

The yamcs-grpc plugin does not read these files; it uses the descriptors compiled into YAMCS. They
are here for clients, which generate their bindings from them.

To update, copy the same paths from a newer `yamcs-api` jar and regenerate the bindings.
