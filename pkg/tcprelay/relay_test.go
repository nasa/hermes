package tcprelay

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const (
	testTimeout    = 5 * time.Second
	connectTimeout = 2 * time.Second
)

// mockTCPSource simulates a Hermes backend TCP source port
type mockTCPSource struct {
	listener net.Listener
	port     int
	conns    []net.Conn
	mu       sync.Mutex
}

func newMockTCPSource(t *testing.T) *mockTCPSource {
	listener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)

	port := listener.Addr().(*net.TCPAddr).Port

	mock := &mockTCPSource{
		listener: listener,
		port:     port,
	}

	// Accept connections in background
	go func() {
		for {
			conn, err := listener.Accept()
			if err != nil {
				return
			}
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

func (m *mockTCPSource) Address() string {
	return fmt.Sprintf("localhost:%d", m.port)
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

// TestSourceConnection tests connecting to a TCP source (client mode)
func TestSourceConnection(t *testing.T) {
	source := newMockTCPSource(t)

	// Connect to source
	ctx, cancel := context.WithTimeout(context.Background(), connectTimeout)
	defer cancel()

	dialer := &net.Dialer{}
	conn, err := dialer.DialContext(ctx, "tcp", source.Address())
	require.NoError(t, err)
	defer conn.Close()

	// Verify source received connection
	serverConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	assert.NotNil(t, serverConn)
}

// TestServerMode tests tcp-relay acting as a TCP server for the source
func TestServerMode(t *testing.T) {
	// Start a TCP server for the source to connect to (relay in server mode)
	relayListener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	defer relayListener.Close()

	relayPort := relayListener.Addr().(*net.TCPAddr).Port

	// Channel to receive the source connection
	sourceConnChan := make(chan net.Conn, 1)

	// Accept source connection
	go func() {
		conn, err := relayListener.Accept()
		if err != nil {
			return
		}
		sourceConnChan <- conn
	}()

	// Source connects to relay (relay is in server mode)
	sourceConn, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", relayPort))
	require.NoError(t, err)
	defer sourceConn.Close()

	// Get the relay's view of the source connection
	var relaySourceConn net.Conn
	select {
	case relaySourceConn = <-sourceConnChan:
	case <-time.After(testTimeout):
		t.Fatal("Relay did not accept source connection")
	}
	defer relaySourceConn.Close()

	// Test data flow from source through relay
	testData := []byte("data from source in server mode")
	_, err = sourceConn.Write(testData)
	require.NoError(t, err)

	received := make([]byte, len(testData))
	relaySourceConn.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(relaySourceConn, received)
	require.NoError(t, err)
	assert.Equal(t, len(testData), n)
	assert.Equal(t, testData, received)
}

// TestDuplexRelay tests bidirectional relay
func TestDuplexRelay(t *testing.T) {
	source := newMockTCPSource(t)

	// Connect relay to source
	sourceConn, err := net.Dial("tcp", source.Address())
	require.NoError(t, err)
	defer sourceConn.Close()

	// Get server-side connection
	serverConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer serverConn.Close()

	// Start relay server
	relayListener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	defer relayListener.Close()

	relayPort := relayListener.Addr().(*net.TCPAddr).Port

	// Handle relay connection with bidirectional forwarding
	go func() {
		relayConn, err := relayListener.Accept()
		if err != nil {
			return
		}
		defer relayConn.Close()

		done := make(chan struct{}, 2)
		// Downlink: source -> relay client
		go func() {
			io.Copy(relayConn, sourceConn)
			done <- struct{}{}
		}()
		// Uplink: relay client -> source
		go func() {
			io.Copy(sourceConn, relayConn)
			done <- struct{}{}
		}()
		<-done
		<-done
	}()

	// Connect client to relay
	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", relayPort))
	require.NoError(t, err)
	defer relayClient.Close()

	time.Sleep(50 * time.Millisecond)

	// Test uplink: client -> relay -> source
	uplinkData := []byte("uplink message")
	_, err = relayClient.Write(uplinkData)
	require.NoError(t, err)

	uplinkReceived := make([]byte, len(uplinkData))
	serverConn.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(serverConn, uplinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(uplinkData), n)
	assert.Equal(t, uplinkData, uplinkReceived)

	// Test downlink: source -> relay -> client
	downlinkData := []byte("downlink message")
	_, err = serverConn.Write(downlinkData)
	require.NoError(t, err)

	downlinkReceived := make([]byte, len(downlinkData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err = io.ReadFull(relayClient, downlinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(downlinkData), n)
	assert.Equal(t, downlinkData, downlinkReceived)
}

// TestReadableRelay tests downlink-only relay
func TestReadableRelay(t *testing.T) {
	source := newMockTCPSource(t)

	// Connect relay to source
	sourceConn, err := net.Dial("tcp", source.Address())
	require.NoError(t, err)
	defer sourceConn.Close()

	serverConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer serverConn.Close()

	// Start readable-only relay
	relayListener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	defer relayListener.Close()

	relayPort := relayListener.Addr().(*net.TCPAddr).Port

	// Handle relay: only forward downlink, drop uplink
	go func() {
		relayConn, err := relayListener.Accept()
		if err != nil {
			return
		}
		defer relayConn.Close()

		// Drop uplink data (readable mode)
		go func() {
			buf := make([]byte, 4096)
			for {
				_, err := relayConn.Read(buf)
				if err != nil {
					return
				}
				// Data is dropped
			}
		}()

		// Only copy downlink
		io.Copy(relayConn, sourceConn)
	}()

	// Connect client
	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", relayPort))
	require.NoError(t, err)
	defer relayClient.Close()

	time.Sleep(50 * time.Millisecond)

	// Test downlink works
	downlinkData := []byte("downlink only")
	_, err = serverConn.Write(downlinkData)
	require.NoError(t, err)

	downlinkReceived := make([]byte, len(downlinkData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(relayClient, downlinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(downlinkData), n)
	assert.Equal(t, downlinkData, downlinkReceived)

	// Test uplink is dropped
	uplinkData := []byte("uplink dropped")
	_, err = relayClient.Write(uplinkData)
	require.NoError(t, err)

	// Server should NOT receive uplink
	serverConn.SetReadDeadline(time.Now().Add(300 * time.Millisecond))
	buf := make([]byte, len(uplinkData))
	_, err = serverConn.Read(buf)
	assert.Error(t, err, "Source should not receive uplink in readable mode")
}

// TestMultipleRelayConnections tests one source broadcasting to multiple relay clients
func TestMultipleRelayConnections(t *testing.T) {
	source := newMockTCPSource(t)

	// Connect relay to source
	sourceConn, err := net.Dial("tcp", source.Address())
	require.NoError(t, err)
	defer sourceConn.Close()

	serverConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer serverConn.Close()

	// Start relay that broadcasts to multiple clients
	relayListener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	defer relayListener.Close()

	relayPort := relayListener.Addr().(*net.TCPAddr).Port

	// Track relay connections for broadcasting
	type relayConn struct {
		conn net.Conn
		mu   sync.Mutex
	}
	var relayConns []*relayConn
	var connMu sync.Mutex

	// Accept multiple connections and broadcast
	go func() {
		for {
			conn, err := relayListener.Accept()
			if err != nil {
				return
			}

			rc := &relayConn{conn: conn}
			connMu.Lock()
			relayConns = append(relayConns, rc)
			connMu.Unlock()
		}
	}()

	// Background goroutine to broadcast from source to all relay clients
	go func() {
		buf := make([]byte, 4096)
		for {
			n, err := sourceConn.Read(buf)
			if err != nil {
				return
			}

			data := make([]byte, n)
			copy(data, buf[:n])

			// Broadcast to all connected clients
			connMu.Lock()
			for _, rc := range relayConns {
				go func(rc *relayConn, data []byte) {
					rc.mu.Lock()
					rc.conn.Write(data)
					rc.mu.Unlock()
				}(rc, data)
			}
			connMu.Unlock()
		}
	}()

	// Connect multiple clients
	const numClients = 3
	clients := make([]net.Conn, numClients)
	for i := range numClients {
		client, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", relayPort))
		require.NoError(t, err)
		defer client.Close()
		clients[i] = client
	}

	// Wait for all connections
	time.Sleep(100 * time.Millisecond)

	// Send broadcast message from source
	testData := []byte("broadcast message")
	_, err = serverConn.Write(testData)
	require.NoError(t, err)

	// Each client should receive the message
	for i, client := range clients {
		received := make([]byte, len(testData))
		client.SetReadDeadline(time.Now().Add(testTimeout))
		n, err := io.ReadFull(client, received)
		require.NoError(t, err, "Client %d should receive", i)
		assert.Equal(t, len(testData), n)
		assert.Equal(t, testData, received)
	}
}

// TestSourceReconnection tests handling of source reconnection
func TestSourceReconnection(t *testing.T) {
	// Create two separate mock sources to avoid race conditions
	source1 := newMockTCPSource(t)

	// First connection
	conn1, err := net.Dial("tcp", source1.Address())
	require.NoError(t, err)

	serverConn1, err := source1.WaitForConnection(testTimeout)
	require.NoError(t, err)

	// Send some data
	testData := []byte("first connection")
	_, err = conn1.Write(testData)
	require.NoError(t, err)

	received := make([]byte, len(testData))
	serverConn1.SetReadDeadline(time.Now().Add(testTimeout))
	_, err = io.ReadFull(serverConn1, received)
	require.NoError(t, err)
	assert.Equal(t, testData, received)

	// Close first connection
	conn1.Close()
	serverConn1.Close()

	// Create new source for reconnection
	source2 := newMockTCPSource(t)

	// Second connection (reconnection to new source)
	conn2, err := net.Dial("tcp", source2.Address())
	require.NoError(t, err)
	defer conn2.Close()

	serverConn2, err := source2.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer serverConn2.Close()

	// Verify second connection works
	testData2 := []byte("second connection")
	_, err = conn2.Write(testData2)
	require.NoError(t, err)

	received2 := make([]byte, len(testData2))
	serverConn2.SetReadDeadline(time.Now().Add(testTimeout))
	_, err = io.ReadFull(serverConn2, received2)
	require.NoError(t, err)
	assert.Equal(t, testData2, received2)
}

// TestLargeDataTransfer tests relay with large payloads
func TestLargeDataTransfer(t *testing.T) {
	source := newMockTCPSource(t)

	// Connect relay to source
	sourceConn, err := net.Dial("tcp", source.Address())
	require.NoError(t, err)
	defer sourceConn.Close()

	serverConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer serverConn.Close()

	// Start relay
	relayListener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	defer relayListener.Close()

	relayPort := relayListener.Addr().(*net.TCPAddr).Port

	go func() {
		conn, err := relayListener.Accept()
		if err != nil {
			return
		}
		defer conn.Close()
		io.Copy(conn, sourceConn)
	}()

	// Connect client
	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", relayPort))
	require.NoError(t, err)
	defer relayClient.Close()

	time.Sleep(50 * time.Millisecond)

	// Large payload (1 MB)
	largeData := bytes.Repeat([]byte("ABCDEFGH"), 128*1024)

	// Send in background
	go func() {
		serverConn.Write(largeData)
	}()

	// Receive and verify
	received := make([]byte, len(largeData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(relayClient, received)
	require.NoError(t, err)
	assert.Equal(t, len(largeData), n)
	assert.Equal(t, largeData, received)
}

// TestConnectionClose tests cleanup when source closes
func TestConnectionClose(t *testing.T) {
	source := newMockTCPSource(t)

	// Connect relay to source
	sourceConn, err := net.Dial("tcp", source.Address())
	require.NoError(t, err)
	defer sourceConn.Close()

	serverConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)

	// Start relay
	relayListener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	defer relayListener.Close()

	relayPort := relayListener.Addr().(*net.TCPAddr).Port

	relayDone := make(chan struct{})
	go func() {
		conn, err := relayListener.Accept()
		if err != nil {
			return
		}
		io.Copy(conn, serverConn)
		conn.Close()
		relayDone <- struct{}{}
	}()

	// Connect client
	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", relayPort))
	require.NoError(t, err)

	time.Sleep(50 * time.Millisecond)

	// Close source
	serverConn.Close()

	// Relay should close
	select {
	case <-relayDone:
		// Success
	case <-time.After(testTimeout):
		t.Fatal("Relay did not close after source closed")
	}

	// Reading from relay should get EOF
	buf := make([]byte, 1024)
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	_, err = relayClient.Read(buf)
	assert.Error(t, err, "Should get error after source closes")
}

// TestConcurrentDataFlow tests simultaneous bidirectional data flow
func TestConcurrentDataFlow(t *testing.T) {
	source := newMockTCPSource(t)

	// Connect relay to source
	sourceConn, err := net.Dial("tcp", source.Address())
	require.NoError(t, err)
	defer sourceConn.Close()

	serverConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer serverConn.Close()

	// Start relay
	relayListener, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	defer relayListener.Close()

	relayPort := relayListener.Addr().(*net.TCPAddr).Port

	go func() {
		relayConn, err := relayListener.Accept()
		if err != nil {
			return
		}
		defer relayConn.Close()

		done := make(chan struct{}, 2)
		go func() {
			io.Copy(relayConn, sourceConn)
			done <- struct{}{}
		}()
		go func() {
			io.Copy(sourceConn, relayConn)
			done <- struct{}{}
		}()
		<-done
		<-done
	}()

	// Connect client
	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", relayPort))
	require.NoError(t, err)
	defer relayClient.Close()

	time.Sleep(50 * time.Millisecond)

	// Send multiple messages concurrently in both directions
	const numMessages = 5
	var wg sync.WaitGroup

	// Downlink messages
	wg.Add(1)
	go func() {
		defer wg.Done()
		for i := range numMessages {
			msg := []byte(fmt.Sprintf("down%d", i))
			serverConn.Write(msg)
			time.Sleep(10 * time.Millisecond)
		}
	}()

	// Uplink messages
	wg.Add(1)
	go func() {
		defer wg.Done()
		for i := range numMessages {
			msg := []byte(fmt.Sprintf("up%d", i))
			relayClient.Write(msg)
			time.Sleep(10 * time.Millisecond)
		}
	}()

	// Receive downlink
	wg.Add(1)
	go func() {
		defer wg.Done()
		for i := range numMessages {
			expected := []byte(fmt.Sprintf("down%d", i))
			received := make([]byte, len(expected))
			relayClient.SetReadDeadline(time.Now().Add(testTimeout))
			_, err := io.ReadFull(relayClient, received)
			assert.NoError(t, err)
			assert.Equal(t, expected, received)
		}
	}()

	// Receive uplink
	wg.Add(1)
	go func() {
		defer wg.Done()
		for i := range numMessages {
			expected := []byte(fmt.Sprintf("up%d", i))
			received := make([]byte, len(expected))
			serverConn.SetReadDeadline(time.Now().Add(testTimeout))
			_, err := io.ReadFull(serverConn, received)
			assert.NoError(t, err)
			assert.Equal(t, expected, received)
		}
	}()

	wg.Wait()
}
