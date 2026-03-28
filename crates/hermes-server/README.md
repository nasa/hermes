# hermes-grpc

Rust gRPC client and server code for Hermes.

This crate contains the generated Rust gRPC service definitions from `proto/grpc/hermes.proto`.

## Code Generation

The gRPC code is automatically generated during the build process by the `build.rs` script using [tonic](https://github.com/hyperium/tonic).

Generated files are placed in Cargo's `OUT_DIR` and included via the `include!` macro.

## Regenerating

To regenerate the gRPC code:

```bash
cargo build -p hermes-grpc
# or
yarn proto-rust
```

## Usage

```rust
use hermes_grpc::*;

// Use the generated gRPC client/server types
```

## Dependencies

This crate depends on `hermes-pb` for the protobuf message types.
