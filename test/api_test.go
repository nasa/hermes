package integration

import (
	"context"
	"fmt"
	"net"
	"testing"
	"time"

	hermesGrpc "github.com/nasa/hermes/pkg/grpc"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/emptypb"
)

const (
	// Default backend address - can be overridden with HERMES_BACKEND_ADDRESS env var
	defaultBackendAddress = "localhost:50051"
	// Connection timeout
	connectionTimeout = 30 * time.Second
	// Request timeout
	requestTimeout = 10 * time.Second
	// FPrime connection timeout - longer because we need to wait for FSW to start
	fprimeConnectionTimeout = 60 * time.Second
)

// TestConfig holds configuration for integration tests
type TestConfig struct {
	BackendAddress string
}

// getTestConfig returns the test configuration
func getTestConfig() *TestConfig {
	// You can extend this to read from environment variables
	return &TestConfig{
		BackendAddress: defaultBackendAddress,
	}
}

// setupGRPCClient establishes a connection to the backend and returns the API client
func setupGRPCClient(t *testing.T) (hermesGrpc.ApiClient, *grpc.ClientConn) {
	cfg := getTestConfig()

	t.Logf("Connecting to backend at %s", cfg.BackendAddress)

	// Set up connection with retry
	var conn *grpc.ClientConn
	var err error

	for i := range 10 {
		conn, err = grpc.NewClient(
			cfg.BackendAddress,
			grpc.WithTransportCredentials(insecure.NewCredentials()),
			grpc.WithContextDialer(func(ctx context.Context, addr string) (net.Conn, error) {
				return net.DialTimeout("tcp", addr, connectionTimeout)
			}),
		)
		if err == nil {
			break
		}
		t.Logf("Connection attempt %d failed: %v, retrying...", i+1, err)
		time.Sleep(2 * time.Second)
	}

	require.NoError(t, err, "Failed to connect to backend")
	require.NotNil(t, conn, "Connection should not be nil")

	client := hermesGrpc.NewApiClient(conn)
	t.Logf("Successfully connected to backend")

	return client, conn
}

// TestBackendHealth verifies the backend is running and responding
func TestBackendHealth(t *testing.T) {
	client, conn := setupGRPCClient(t)
	defer conn.Close()

	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()

	// Try a simple API call - getting all FSWs
	resp, err := client.AllFsw(ctx, &emptypb.Empty{})

	require.NoError(t, err, "AllFsw should not return an error")
	require.NotNil(t, resp, "Response should not be nil")

	t.Logf("Backend is healthy")
}

// TestAllProviders tests the AllProviders endpoint
func TestAllProviders(t *testing.T) {
	client, conn := setupGRPCClient(t)
	defer conn.Close()

	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()

	resp, err := client.AllProviders(ctx, &emptypb.Empty{})

	require.NoError(t, err, "AllProviders should not return an error")
	require.NotNil(t, resp, "Response should not be nil")

	t.Logf("Retrieved %d providers", len(resp.GetAll()))

	// Verify response structure
	assert.NotNil(t, resp.GetAll(), "Providers list should not be nil")
}

// TestAllDictionary tests the AllDictionary endpoint
func TestAllDictionary(t *testing.T) {
	client, conn := setupGRPCClient(t)
	defer conn.Close()

	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()

	resp, err := client.AllDictionary(ctx, &emptypb.Empty{})

	require.NoError(t, err, "AllDictionary should not return an error")
	require.NotNil(t, resp, "Response should not be nil")

	// We pre-seed the docker compose with a single dictionary from the fprime ref deployment
	require.Len(t, resp.GetAll(), 1)
}

// TestProfileLifecycle tests creating, updating, and removing a profile
func TestProfileLifecycle(t *testing.T) {
	client, conn := setupGRPCClient(t)
	defer conn.Close()

	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()

	profile := &pb.Profile{
		Name:     "test-profile",
		Provider: "FPrime Server",
	}

	// Add profile
	addResp, err := client.AddProfile(ctx, profile)
	require.NoError(t, err, "Failed to add profile")

	require.NotNil(t, addResp, "Add profile response should not be nil")
	profileID := addResp.GetId()
	t.Logf("Created profile with ID: %s", profileID)

	// Clean up - remove the profile
	defer func() {
		_, err := client.RemoveProfile(ctx, &pb.Id{Id: profileID})
		if err != nil {
			t.Logf("Warning: failed to clean up profile: %v", err)
		}
	}()

	// Get the profile to verify it was created
	getResp, err := client.AllProfiles(ctx, &emptypb.Empty{})
	require.NoError(t, err, "Should be able to list profiles")

	found := false
	for id, p := range getResp.GetAll() {
		if id == profileID {
			found = true
			assert.Equal(t, profile.GetName(), p.GetValue().GetName(), "Profile name should match")
			break
		}
	}
	assert.True(t, found, "Created profile should be in the list")
}

// TestConcurrentRequests tests that the backend can handle concurrent requests
func TestConcurrentRequests(t *testing.T) {
	client, conn := setupGRPCClient(t)
	defer conn.Close()

	const numRequests = 10
	results := make(chan error, numRequests)

	// Launch concurrent requests
	for i := 0; i < numRequests; i++ {
		go func(id int) {
			ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
			defer cancel()

			_, err := client.AllProfiles(ctx, &emptypb.Empty{})
			if err != nil {
				results <- fmt.Errorf("request %d failed: %w", id, err)
			} else {
				results <- nil
			}
		}(i)
	}

	// Collect results
	for i := 0; i < numRequests; i++ {
		err := <-results
		assert.NoError(t, err, "Concurrent request should succeed")
	}

	t.Logf("Successfully completed %d concurrent requests", numRequests)
}

// TestInvalidRequests tests error handling for invalid requests
func TestInvalidRequests(t *testing.T) {
	client, conn := setupGRPCClient(t)
	defer conn.Close()

	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()

	// Test getting a non-existent FSW
	_, err := client.GetFsw(ctx, &pb.Id{Id: "non-existent-fsw-id"})
	assert.Error(t, err, "Getting non-existent FSW should return an error")
	t.Logf("Invalid FSW request correctly returned error: %v", err)

	// Test getting a non-existent dictionary
	_, err = client.GetDictionary(ctx, &pb.Id{Id: "non-existent-dict-id"})
	assert.Error(t, err, "Getting non-existent dictionary should return an error")
	t.Logf("Invalid dictionary request correctly returned error: %v", err)
}
