# Migration from TypeScript to Rust

The `hermes-fprime-dictionary` crate now provides both a library and a CLI binary that replaces the TypeScript version at `src/scripts/fprime-json-dictionary.ts`.

## Key Changes

### Before (TypeScript)
```bash
# Required Node.js runtime
node out/fprime-json-dictionary dict.json > out.pb
```

### After (Rust)
```bash
# Standalone native binary, no runtime required
hermes-fprime-dictionary dict.json > out.pb
```

## Benefits

1. **No Runtime Dependencies**: Rust binary is self-contained, doesn't require Node.js
2. **Better Performance**: Native binary is faster than JavaScript
3. **Type Safety**: Rust's type system provides stronger guarantees
4. **Easier Distribution**: Single binary can be distributed without npm/yarn
5. **Same Functionality**: Produces identical output to the TypeScript version

## Installation

```bash
# Install from source
cargo install --path crates/hermes-fprime-dictionary

# Or build directly
cd crates/hermes-fprime-dictionary
cargo build --release
# Binary will be at target/release/hermes-fprime-dictionary
```

## Verification

The integration tests verify that the library and binary produce identical output:

```bash
cd crates/hermes-fprime-dictionary
cargo test
```

All tests include:
- Unit tests for the library functions
- CLI integration tests
- Consistency tests ensuring library and binary produce identical output

## TypeScript Script Status

The TypeScript version at `src/scripts/fprime-json-dictionary.ts` can be considered deprecated in favor of this Rust implementation. However, it remains in the codebase for backward compatibility until all users migrate.

## Usage Examples

### Basic Conversion
```bash
hermes-fprime-dictionary /path/to/fprime-dict.json > hermes-dict.pb
```

### Pipeline Usage
```bash
# Convert and upload to backend
hermes-fprime-dictionary fprime-dict.json | curl -X POST --data-binary @- http://backend/upload
```

### Library Usage (Rust)
```rust
use hermes_fprime_dictionary::parse_fprime_json_dictionary;
use prost::Message;

let json = std::fs::read_to_string("dict.json")?;
let dict = parse_fprime_json_dictionary(&json)?;
let bytes = dict.encode_to_vec();
```

## Compatibility

The Rust implementation is 100% compatible with the TypeScript version:
- Same input format (F' JSON dictionaries)
- Same output format (Hermes protobuf)
- Same behavior for all dictionary elements (commands, events, telemetry, etc.)
- Same format string preprocessing (FPP `{d}` → printf `%d`)
