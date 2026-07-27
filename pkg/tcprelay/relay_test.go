package tcprelay

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"net"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
)

const (
	testTimeout    = 10 * time.Second
	connectTimeout = 2 * time.Second
)

// mockConnectSession implements host.ConnectSession for testing
type mockConnectSession struct{}

func (m *mockConnectSession) Log() log.Logger {
	return log.GetLogger(context.Background())
}

func (m *mockConnectSession) Started()                {}
func (m *mockConnectSession) Connect(fsw host.Fsw)    {}
func (m *mockConnectSession) Disconnect(fsw host.Fsw) {}

func startRelay(t *testing.T, ctx context.Context, sourcePort int, duplexPorts []int, readablePorts []int, serverMode bool) {
	startRelaySession(t, ctx, &mockConnectSession{}, sourcePort, duplexPorts, readablePorts, serverMode)
}

func startRelaySession(t *testing.T, ctx context.Context, session host.ConnectSession, sourcePort int, duplexPorts []int, readablePorts []int, serverMode bool) {
	provider := &tcpRelayProvider{}
	params := Params{
		SourceAddress: "localhost",
		SourcePort:    sourcePort,
		ServerMode:    serverMode,
		DuplexPorts:   duplexPorts,
		ReadablePorts: readablePorts,
	}

	go func() {
		err := provider.Start(ctx, params, session)
		if err != nil && ctx.Err() == nil {
			t.Errorf("Relay failed: %v", err)
		}
	}()
}

// mockTCPSource simulates a Hermes backend TCP source port
type mockTCPSource struct {
	listener net.Listener
	port     int
	conns    []net.Conn
	mu       sync.Mutex
	t        *testing.T
}

func newMockSource(t *testing.T) *mockTCPSource {
	// Port 0 = OS assigns a random free port
	listener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)

	port := listener.Addr().(*net.TCPAddr).Port
	mock := &mockTCPSource{
		listener: listener,
		port:     port,
		t:        t,
	}

	go func() {
		for {
			conn, err := listener.Accept()
			if err != nil {
				return
			}
			t.Logf("Mock source accepted connection from %s", conn.RemoteAddr())
			mock.mu.Lock()
			mock.conns = append(mock.conns, conn)
			mock.mu.Unlock()
		}
	}()

	t.Cleanup(func() {
		mock.Close()
	})

	return mock
}

func (m *mockTCPSource) Port() int {
	return m.port
}

func (m *mockTCPSource) WaitForConnection(timeout time.Duration) (net.Conn, error) {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		m.mu.Lock()
		if len(m.conns) > 0 {
			conn := m.conns[len(m.conns)-1]
			m.mu.Unlock()
			return conn, nil
		}
		m.mu.Unlock()
		time.Sleep(10 * time.Millisecond)
	}
	return nil, fmt.Errorf("timeout waiting for connection")
}

func (m *mockTCPSource) Close() {
	m.listener.Close()
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, conn := range m.conns {
		conn.Close()
	}
}

func getFreePort(t *testing.T) int {
	listener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	port := listener.Addr().(*net.TCPAddr).Port
	listener.Close()
	return port
}

// syncUplink round-trips a byte client->source to prove the client is subscribed
// (the relay only reads uplink after registering the downlink handler).
func syncUplink(t *testing.T, client, sourceConn net.Conn) {
	t.Helper()
	_, err := client.Write([]byte{0})
	require.NoError(t, err)
	sync := make([]byte, 1)
	sourceConn.SetReadDeadline(time.Now().Add(testTimeout))
	_, err = io.ReadFull(sourceConn, sync)
	require.NoError(t, err)
}

func TestRelayDuplex(t *testing.T) {
	source := newMockSource(t)
	duplexPort := getFreePort(t)
	startRelay(t, t.Context(), source.Port(), []int{duplexPort}, nil, false)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	relayClient, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer relayClient.Close()

	// Test uplink: client -> relay -> source
	uplinkData := []byte("uplink test")
	_, err = relayClient.Write(uplinkData)
	require.NoError(t, err)

	uplinkReceived := make([]byte, len(uplinkData))
	sourceConn.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(sourceConn, uplinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(uplinkData), n)
	assert.Equal(t, uplinkData, uplinkReceived)

	// Test downlink: source -> relay -> client
	downlinkData := []byte("downlink test")
	_, err = sourceConn.Write(downlinkData)
	require.NoError(t, err)

	downlinkReceived := make([]byte, len(downlinkData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err = io.ReadFull(relayClient, downlinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(downlinkData), n)
	assert.Equal(t, downlinkData, downlinkReceived)
}

func TestRelayReadable(t *testing.T) {
	source := newMockSource(t)
	readablePort := getFreePort(t)
	startRelay(t, t.Context(), source.Port(), nil, []int{readablePort}, false)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	relayClient, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", readablePort), connectTimeout)
	require.NoError(t, err)
	defer relayClient.Close()

	// Test uplink is dropped (not sent to source)
	// Do this first to ensure relay has set up the broadcast handler
	uplinkData := []byte("uplink should be dropped")
	_, err = relayClient.Write(uplinkData)
	require.NoError(t, err)

	// Source should NOT receive uplink
	sourceConn.SetReadDeadline(time.Now().Add(500 * time.Millisecond))
	buf := make([]byte, len(uplinkData))
	_, err = sourceConn.Read(buf)
	assert.Error(t, err)

	// Test downlink works (handler is now guaranteed to be registered)
	downlinkData := []byte("downlink only")
	_, err = sourceConn.Write(downlinkData)
	require.NoError(t, err)

	downlinkReceived := make([]byte, len(downlinkData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(relayClient, downlinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(downlinkData), n)
	assert.Equal(t, downlinkData, downlinkReceived)
}

func TestRelayMultipleClients(t *testing.T) {
	source := newMockSource(t)
	duplexPort := getFreePort(t)
	startRelay(t, t.Context(), source.Port(), []int{duplexPort}, nil, false)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	// Connect several clients, each synced so it won't miss the broadcast.
	const numClients = 3
	clients := make([]net.Conn, numClients)
	for i := range numClients {
		client, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
		require.NoError(t, err)
		defer client.Close()
		clients[i] = client

		syncUplink(t, client, sourceConn)
	}

	// Send broadcast message from source
	broadcastData := []byte("broadcast to all")
	_, err = sourceConn.Write(broadcastData)
	require.NoError(t, err)

	// Each client should receive the message
	for i, client := range clients {
		received := make([]byte, len(broadcastData))
		client.SetReadDeadline(time.Now().Add(testTimeout))
		n, err := io.ReadFull(client, received)
		require.NoError(t, err, "Client %d should receive broadcast", i)
		assert.Equal(t, len(broadcastData), n)
		assert.Equal(t, broadcastData, received)
	}
}

func TestRelayLargeData(t *testing.T) {
	source := newMockSource(t)
	duplexPort := getFreePort(t)
	startRelay(t, t.Context(), source.Port(), []int{duplexPort}, nil, false)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	relayClient, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer relayClient.Close()

	syncUplink(t, relayClient, sourceConn)

	largeData := bytes.Repeat([]byte("NASA/JPL"), 12800) // 100 KB

	go func() {
		_, err := sourceConn.Write(largeData)
		if err != nil {
			t.Errorf("Failed to write large data: %v", err)
		}
	}()

	received := make([]byte, len(largeData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(relayClient, received)
	require.NoError(t, err)
	assert.Equal(t, len(largeData), n)
	assert.Equal(t, largeData, received)
}

func TestRelayServerMode(t *testing.T) {
	sourcePort := getFreePort(t)
	duplexPort := getFreePort(t)
	startRelay(t, t.Context(), sourcePort, []int{duplexPort}, nil, true)

	sourceConn, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", sourcePort), connectTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	relayClient, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer relayClient.Close()

	syncUplink(t, relayClient, sourceConn)

	// Downlink: source -> relay -> client
	testData := []byte("server mode test")
	_, err = sourceConn.Write(testData)
	require.NoError(t, err)

	received := make([]byte, len(testData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(relayClient, received)
	require.NoError(t, err)
	assert.Equal(t, len(testData), n)
	assert.Equal(t, testData, received)
}

// A client that stops reading must not stall the broadcast to others.
func TestRelaySlowClientDoesNotBlockOthers(t *testing.T) {
	source := newMockSource(t)
	duplexPort := getFreePort(t)
	startRelay(t, t.Context(), source.Port(), []int{duplexPort}, nil, false)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	// Slow client subscribes then never reads.
	slow, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer slow.Close()
	syncUplink(t, slow, sourceConn)

	// Healthy client reads normally.
	healthy, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer healthy.Close()
	syncUplink(t, healthy, sourceConn)

	// Flood downlink past the slow client's queue.
	chunk := bytes.Repeat([]byte("x"), 64*1024)
	go func() {
		for range 64 {
			if _, err := sourceConn.Write(chunk); err != nil {
				return
			}
		}
	}()

	// Healthy client keeps receiving despite the slow one being stuck.
	healthy.SetReadDeadline(time.Now().Add(testTimeout))
	buf := make([]byte, len(chunk))
	total := 0
	for total < 4*len(chunk) {
		n, err := healthy.Read(buf)
		require.NoError(t, err, "healthy client stalled after %d bytes (head-of-line blocking)", total)
		total += n
	}
}

// Client conns must be closed on shutdown, not leaked (EOF, not a read timeout).
func TestRelayClientClosedOnShutdown(t *testing.T) {
	source := newMockSource(t)
	duplexPort := getFreePort(t)

	ctx, cancel := context.WithCancel(context.Background())
	startRelay(t, ctx, source.Port(), []int{duplexPort}, nil, false)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	client, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer client.Close()
	syncUplink(t, client, sourceConn)

	cancel()

	// Read should return promptly (closed), not hit the deadline.
	client.SetReadDeadline(time.Now().Add(testTimeout))
	buf := make([]byte, 1)
	_, err = client.Read(buf)
	require.Error(t, err)
	assert.True(t, errors.Is(err, io.EOF), "connection should be closed on shutdown, not left to time out")
}

// In client mode, a failed source dial must make Start return an error.
func TestRelaySourceConnectFailure(t *testing.T) {
	// getFreePort releases the port, so the dial fails.
	deadPort := getFreePort(t)
	duplexPort := getFreePort(t)

	provider := &tcpRelayProvider{}
	params := Params{
		SourceAddress: "localhost",
		SourcePort:    deadPort,
		ServerMode:    false,
		DuplexPorts:   []int{duplexPort},
	}

	err := provider.Start(t.Context(), params, &mockConnectSession{})
	require.Error(t, err, "Start should fail when the source cannot be dialed")
	assert.Contains(t, err.Error(), "failed to connect to source")
}
