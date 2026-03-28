# hermes-pb

Rust protobuf message types for Hermes.

This crate contains the generated Rust code for all protobuf message definitions in `proto/pb/`.

## Code Generation

The protobuf code is automatically generated during the build process by the `build.rs` script using [prost](https://github.com/tokio-rs/prost).

Generated files are placed in Cargo's `OUT_DIR` and included via the `include!` macro.

## Regenerating

To regenerate the protobuf code:

```bash
cargo build -p hermes-pb
# or
yarn proto-rust
```

## Usage

```rust
use hermes_pb::*;

// Use the generated types
```
