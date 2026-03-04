# gRPC Package

This package contains the generated gRPC code for the Hermes API service.

## Overview

The gRPC package provides the protocol buffer generated code for client-server communication in the Hermes system. It defines the service interfaces, request and response message types, and client/server stubs for remote procedure calls.

## Components

The gRPC package provides the following components:

- API Definition: Contains the generated protocol buffer code for the Hermes API, including message type definitions and service interfaces
- gRPC Service: Contains the generated gRPC service code for client stubs and server interfaces

## API Services

The Hermes API provides several services for interacting with spacecraft systems:

- Command execution and sequencing
- File upload and download
- Flight software (FSW) management
- Profile management
- Telemetry subscription
- Event monitoring

## Usage

### Client-Side Usage

```go
import (
    "github.com/nasa/hermes/pkg/client"
    "github.com/nasa/hermes/pkg/grpc"
)

// Create a client connection
conn, err := client.NewClient()
if err != nil {
    // Handle error
}
defer conn.Close()

// Create an API client
apiClient := grpc.NewApiClient(conn)

// Make API calls
response, err := apiClient.Command(ctx, &pb.CommandValue{...})
```

### Server-Side Implementation

```go
import (
    "github.com/nasa/hermes/pkg/grpc"
    "github.com/nasa/hermes/pkg/pb"
    "google.golang.org/grpc"
)

// Implement the API server interface
type apiServer struct {
    grpc.UnimplementedApiServer
}

// Implement API methods
func (s *apiServer) Command(ctx context.Context, cmd *pb.CommandValue) (*pb.Reply, error) {
    // Implementation
    return &pb.Reply{...}, nil
}

// Register the server
grpcServer := grpc.NewServer()
grpc.RegisterApiServer(grpcServer, &apiServer{})
```

## Dependencies

- `github.com/nasa/hermes/pkg/pb`: For protocol buffer message definitions
- `google.golang.org/protobuf`: For protocol buffer support
- `google.golang.org/grpc`: For gRPC functionality

## Note

This package contains auto-generated code from protocol buffer definitions. Do not modify the files directly; instead, update the source `.proto` files and regenerate the code using the appropriate protoc tools.
