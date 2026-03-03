# Hermes Integration Tests

This directory contains integration tests for the Hermes backend gRPC API service. These tests run the backend service in a Docker container and verify the API functionality using a gRPC client.

## Overview

The integration test suite:
- Builds and runs the backend service in a Docker container
- Connects to the `Api` gRPC service as a client
- Tests various API endpoints including profiles, FSW connections, dictionaries, and command sequences
- Verifies error handling and concurrent request support

## Prerequisites

- Docker and Docker Compose installed
- Go 1.25 or later
- Make (for running Makefile targets)

## Quick Start

Run the complete integration test suite:

```bash
make test-integration
```

This command will:
1. Build the Docker image
2. Start the backend service container
3. Run all integration tests
4. Clean up containers and volumes

## Manual Testing

If you want more control over the testing process:

### 1. Setup (Start the backend service)

```bash
make test-integration-setup
```

This builds the Docker image and starts the backend service on `localhost:50051`.

### 2. Run the tests

```bash
make test-integration-run
```

Or run Go tests directly:

```bash
go test -v ./test/integration/... -timeout 5m
```

### 3. Teardown (Stop and clean up)

```bash
make test-integration-teardown
```

## Test Configuration

The tests connect to `localhost:50051` by default. You can customize this by modifying the `defaultBackendAddress` constant in `api_test.go`.

### Environment Variables

You can extend the configuration to use environment variables:
- `HERMES_BACKEND_ADDRESS`: Backend service address (default: `localhost:50051`)

## Test Structure

### `api_test.go`

Contains the main integration test suite:

#### Connection Tests
- **TestBackendHealth**: Verifies the backend is running and responding
- **TestConcurrentRequests**: Tests concurrent API calls

#### Profile Management Tests
- **TestAllProfiles**: Lists all profiles
- **TestProfileLifecycle**: Creates, retrieves, and deletes a profile

#### Provider Tests
- **TestAllProviders**: Lists all profile providers

#### Dictionary Tests
- **TestAllDictionary**: Lists all dictionaries

#### FSW Tests
- **TestSubscribeFsw**: Tests streaming FSW subscription

#### Command Tests
- **TestCommandSequence**: Tests command sequence execution

#### Error Handling Tests
- **TestInvalidRequests**: Tests error handling for invalid requests

#### Benchmarks
- **BenchmarkAllProfiles**: Performance benchmark for profile listing

## Docker Configuration

### `Dockerfile`

Located in the project root, this builds the backend service with:
- Multi-stage build for minimal image size
- Non-root user for security
- Health check support
- Default port: 50051

### `docker-compose.test.yml`

Docker Compose configuration for integration testing:
- Service: `hermes-backend`
- Network: `hermes-test-network`
- Volumes for test data and config
- Health checks

## Writing New Tests

To add a new integration test:

1. Create a test function in `api_test.go`:

```go
func TestMyNewFeature(t *testing.T) {
    client, conn := setupGRPCClient(t)
    defer conn.Close()
    
    ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
    defer cancel()
    
    // Your test logic here
    resp, err := client.SomeEndpoint(ctx, &pb.SomeRequest{})
    require.NoError(t, err)
    assert.NotNil(t, resp)
}
```

2. Use the `setupGRPCClient()` helper to establish a connection
3. Always use context with timeout
4. Properly handle cleanup with `defer`

## Troubleshooting

### Container fails to start

Check Docker logs:
```bash
docker compose -f docker-compose.test.yml logs hermes-backend
```

### Connection timeout

Ensure the backend service is running:
```bash
docker compose -f docker-compose.test.yml ps
```

The service should be in `Up` state.

### Tests fail due to missing FSW/Provider

Some tests (like `TestCommandSequence` and `TestProfileLifecycle`) require an active FSW connection or provider. These tests will skip gracefully if dependencies are not available.

### Port already in use

If port 50051 is already in use, modify the port mapping in `docker-compose.test.yml`:
```yaml
ports:
  - "50052:50051"  # External:Internal
```

Then update `defaultBackendAddress` in the test file to `localhost:50052`.

## CI/CD Integration

To integrate with CI/CD pipelines:

```bash
# In your CI script
make test-integration

# Or with explicit cleanup on failure
make test-integration-setup
make test-integration-run || {
    docker compose -f docker-compose.test.yml logs hermes-backend
    make test-integration-teardown
    exit 1
}
make test-integration-teardown
```

## Test Data

Place test data files in:
- `test/data/`: For runtime data
- `test/config/`: For configuration files

These directories are mounted as volumes in the Docker container.

## Performance Testing

Run benchmarks:

```bash
go test -bench=. -benchmem ./test/integration/...
```

## Coverage

Generate test coverage:

```bash
go test -coverprofile=coverage.out ./test/integration/...
go tool cover -html=coverage.out
```

## Additional Resources

- [gRPC Documentation](https://grpc.io/docs/)
- [Protocol Buffers](https://developers.google.com/protocol-buffers)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Testify Documentation](https://github.com/stretchr/testify)
