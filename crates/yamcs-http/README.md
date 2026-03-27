# yamcs-http

Rust client library for the [YAMCS](https://yamcs.org) (Yet Another Mission Control System) HTTP/REST API.

## Features

- Complete HTTP/REST API client for YAMCS
- Support for multiple authentication methods (JWT, client certificates, none)
- WebSocket support for real-time subscriptions (with `websocket` feature)
- Comprehensive type definitions for all YAMCS API objects
- Async/await using `tokio` and `reqwest`
- Request interceptors for custom authentication flows

## Installation

Add this to your `Cargo.toml`:

```toml
[dependencies]
yamcs-http = "4.1"
tokio = { version = "1", features = ["full"] }
```

To enable WebSocket support:

```toml
[dependencies]
yamcs-http = { version = "4.1", features = ["websocket"] }
```

## Quick Start

```rust
use yamcs_http::{YamcsClient, AuthMethod};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a client without authentication
    let client = YamcsClient::new("http://localhost:8090")?;

    // Get server information
    let info = client.get_general_info().await?;
    println!("YAMCS version: {}", info.yamcs_version);
    println!("Server ID: {}", info.server_id);

    Ok(())
}
```

## Authentication

YAMCS supports multiple authentication methods:

### No Authentication

```rust
let client = YamcsClient::new("http://localhost:8090")?;
```

### JWT/Bearer Token

```rust
let client = YamcsClient::with_auth(
    "http://localhost:8090",
    AuthMethod::AccessToken("your-token".to_string())
)?;
```

### Client Certificates

```rust
let client = YamcsClient::with_auth(
    "https://localhost:8090",
    AuthMethod::ClientCert {
        cert_path: "/path/to/cert.pem".to_string(),
        key_path: "/path/to/key.pem".to_string(),
    }
)?;
```

## Usage Examples

### Get User Information

```rust
let client = YamcsClient::with_auth(
    "http://localhost:8090",
    AuthMethod::AccessToken("token".to_string())
)?;

let user = client.get_user_info().await?;
println!("User: {}", user.name);
println!("Email: {}", user.email);
println!("Superuser: {}", user.superuser);
```

### Get System Information

```rust
let client = YamcsClient::new("http://localhost:8090")?;
let sys_info = client.get_system_info().await?;

println!("Uptime: {}ms", sys_info.uptime);
println!("Heap usage: {}/{}",
    sys_info.used_heap_memory,
    sys_info.max_heap_memory
);
println!("CPU load: {:.2}%", sys_info.cpu_load * 100.0);
```

### Check Authentication Requirements

```rust
let client = YamcsClient::new("http://localhost:8090")?;
let auth_info = client.get_auth_info().await?;

if auth_info.require_authentication {
    println!("Authentication is required");
    if let Some(openid) = auth_info.openid {
        println!("OpenID Connect is available");
        println!("  Client ID: {}", openid.client_id);
        println!("  Authorization endpoint: {}", openid.authorization_endpoint);
    }
}
```

### Custom TLS Configuration

```rust
use reqwest::Client;

// Create a custom reqwest client with TLS settings
let reqwest_client = Client::builder()
    .danger_accept_invalid_certs(true)  // For self-signed certificates
    .build()?;

let client = YamcsClient::with_reqwest_client(
    reqwest_client,
    "https://localhost:8090",
    AuthMethod::AccessToken("token".to_string())
)?;
```

## API Coverage

### Phase 1 (Current): Core Infrastructure ✅

- HTTP client with authentication
- Error handling
- Basic system APIs:
  - `get_general_info()` - Server version and configuration
  - `get_user_info()` - Current user information
  - `get_auth_info()` - Authentication configuration
  - `get_system_info()` - System metrics and runtime info

### Phase 2 (Planned): Mission Database (MDB)

- Space system queries
- Parameter definitions and metadata
- Command definitions and metadata
- Container queries
- Algorithm queries

### Phase 3 (Planned): Real-time Operations

- Parameter value queries (historical and current)
- Command issuing and history
- Event queries and creation
- Packet queries
- Processor management

### Phase 4 (Planned): WebSocket Infrastructure

- WebSocket client setup
- Subscription management
- Frame loss detection
- Connection lifecycle

### Phase 5 (Planned): Real-time Subscriptions

- Parameter subscriptions
- Event subscriptions
- Command subscriptions
- Alarm subscriptions
- Processor subscriptions
- Link subscriptions

### Phases 6-7 (Planned): Extended Features

- Alarms and activities
- File transfers
- Timeline management
- Table queries
- User/role management

## Architecture

The library is structured into several modules:

- `client`: Main `YamcsClient` implementation
- `auth`: Authentication types and methods
- `http`: HTTP client infrastructure with interceptor support
- `error`: Comprehensive error types
- `types`: Type definitions for all YAMCS API objects
  - `types::common`: Shared types (Value, NamedObjectId, etc.)
  - `types::system`: System and instance types
  - More type modules coming in future phases
- `websocket`: WebSocket client (requires `websocket` feature)

## Error Handling

All methods return `Result<T, YamcsError>` where `YamcsError` provides detailed error information:

```rust
match client.get_user_info().await {
    Ok(user) => println!("User: {}", user.name),
    Err(yamcs_http::YamcsError::HttpStatus { status, message, .. }) => {
        eprintln!("HTTP error {}: {}", status, message);
    }
    Err(yamcs_http::YamcsError::Auth(msg)) => {
        eprintln!("Authentication error: {}", msg);
    }
    Err(e) => {
        eprintln!("Error: {}", e);
    }
}
```

## Contributing

This crate is part of the Hermes ground data system project. Contributions are welcome!

## License

See the main Hermes repository for license information.

## Resources

- [YAMCS Documentation](https://docs.yamcs.org/)
- [YAMCS REST API Reference](https://docs.yamcs.org/yamcs-http-api/)
- [Hermes Project](https://github.com/nasa/hermes)
