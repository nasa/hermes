# Client Package

This package provides client functionality for connecting to Hermes services via gRPC.

## Overview

The client package offers a standardized way to establish connections to Hermes services with various authentication methods. It handles:

- Connection establishment to Hermes servers
- Authentication through different methods (none, username/password, token)
- Transport security configuration

## Components

The client package provides the following components:

- Client functionality for creating gRPC client connections
- Authentication mechanisms for gRPC connections
- Support for both Basic (username/password) and Bearer (token) authentication types

## Environment Variables

The client package uses the following environment variables for configuration:

| Variable | Description |
|----------|-------------|
| `HERMES_HOST` | Host address to connect to (default: localhost:6880) |
| `HERMES_AUTH_METHOD` | Authentication method: 'none', 'userpass', or 'token' |
| `HERMES_USERPASS` | Username/password in the format `<username>:<password>` |
| `HERMES_USERPASS_B64` | Base64-encoded username/password |
| `HERMES_TOKEN` | Authentication token for token-based authentication |

## Usage

```go
import "github.com/nasa/hermes/pkg/client"

// Set environment variables for configuration
os.Setenv("HERMES_HOST", "example.com:6880")
os.Setenv("HERMES_AUTH_METHOD", "userpass")
os.Setenv("HERMES_USERPASS", "username:password")

// Create a new client connection
conn, err := client.NewClient()
if err != nil {
    // Handle error
}
defer conn.Close()

// Use the connection with gRPC service clients
serviceClient := myservice.NewServiceClient(conn)
```

## Authentication Methods

### No Authentication

For local or development environments where authentication is not required:

```
HERMES_AUTH_METHOD=none
```

### Username/Password Authentication

For basic authentication with username and password:

```
HERMES_AUTH_METHOD=userpass
HERMES_USERPASS=username:password
```

Or using base64 encoding:

```
HERMES_AUTH_METHOD=userpass
HERMES_USERPASS_B64=dXNlcm5hbWU6cGFzc3dvcmQ=
```

### Token Authentication

For bearer token authentication:

```
HERMES_AUTH_METHOD=token
HERMES_TOKEN=your-auth-token
```

## Dependencies

- `google.golang.org/grpc`: For gRPC client functionality
- `google.golang.org/grpc/credentials`: For authentication mechanisms
