package tcprelay

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"io"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const (
	testTimeout    = 10 * time.Second
	connectTimeout = 2 * time.Second
)

type relayProcess struct {
	cmd    *exec.Cmd
	cancel context.CancelFunc
	ready  chan struct{}
	t      *testing.T
}

func startRelay(t *testing.T, ctx context.Context, sourcePort int, duplexPorts []int, readablePorts []int, serverMode bool) relayProcess {
	scriptPath := filepath.Join("..", "..", "src", "scripts", "out", "tcp-relay")
	if _, err := os.Stat(scriptPath); os.IsNotExist(err) {
		require.FailNow(t, fmt.Sprintf("tcp-relay script not found at %s (run build first)", scriptPath))
	}

	// Build command line args
	args := []string{
		"--source-port", fmt.Sprintf("%d", sourcePort),
	}
	if serverMode {
		args = append(args, "--server")
	}
	for _, port := range duplexPorts {
		args = append(args, "--duplex-ports", fmt.Sprintf("%d", port))
	}
	for _, port := range readablePorts {
		args = append(args, "--readable-ports", fmt.Sprintf("%d", port))
	}

	cmdCtx, cancel := context.WithCancel(ctx)
	cmd := exec.CommandContext(cmdCtx, scriptPath, args...)

	stdout, err := cmd.StdoutPipe()
	require.NoError(t, err)
	stderr, err := cmd.StderrPipe()
	require.NoError(t, err)

	err = cmd.Start()
	require.NoError(t, err)

	t.Logf("Started tcp-relay (PID %d): %s", cmd.Process.Pid, strings.Join(cmd.Args, " "))

	go func() {
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			t.Logf("tcp-relay stderr: %s", scanner.Text())
		}
		if err := scanner.Err(); err != nil {
			t.Logf("Error reading tcp-relay stderr: %v", err)
		}
	}()

	proc := relayProcess{
		cmd:    cmd,
		cancel: cancel,
		ready:  make(chan struct{}),
		t:      t,
	}
	go proc.waitForRelayStartup(stdout)
	return proc
}

func (p *relayProcess) waitForRelayStartup(stdout io.Reader) {
	scanner := bufio.NewScanner(stdout)
	foundSource := false
	foundRelay := false

	for scanner.Scan() {
		line := scanner.Text()
		p.t.Logf("tcp-relay: %s", line)

		if strings.Contains(line, "Source connection active") || strings.Contains(line, "Source server listening") {
			foundSource = true
		}
		if strings.Contains(line, "listening on port") {
			foundRelay = true
		}

		if foundSource && foundRelay {
			close(p.ready)
			for scanner.Scan() {
				p.t.Logf("tcp-relay: %s", scanner.Text())
			}
			break
		}
	}

	if err := scanner.Err(); err != nil {
		p.t.Logf("Error reading tcp-relay stdout: %v", err)
	}
}

func (p *relayProcess) WaitReady(timeout time.Duration) error {
	select {
	case <-p.ready:
		return nil
	case <-time.After(timeout):
		return fmt.Errorf("timeout waiting for tcp-relay to be ready")
	}
}

func (p *relayProcess) Stop() {
	if p.cancel != nil {
		p.cancel()
	}

	if p.cmd != nil && p.cmd.Process != nil {
		p.t.Logf("Stopping tcp-relay (PID %d)", p.cmd.Process.Pid)
		p.cmd.Process.Signal(os.Interrupt)

		done := make(chan error, 1)
		go func() {
			done <- p.cmd.Wait()
		}()

		select {
		case <-done:
		case <-time.After(2 * time.Second):
			p.cmd.Process.Kill()
		}
	}
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

func TestRelayDuplex(t *testing.T) {
	source := newMockSource(t)
	ctx := context.Background()

	duplexPort := getFreePort(t)
	relay := startRelay(t, ctx, source.Port(), []int{duplexPort}, nil, false)
	defer relay.Stop()
	err := relay.WaitReady(5 * time.Second)
	require.NoError(t, err)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", duplexPort))
	require.NoError(t, err)
	defer relayClient.Close()
	time.Sleep(100 * time.Millisecond)

	// Test uplink: client -> relay -> source
	uplinkData := []byte("uplink test")
	_, err = relayClient.Write(uplinkData)
	require.NoError(t, err)

	uplinkReceived := make([]byte, len(uplinkData))
	sourceConn.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(sourceConn, uplinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(uplinkData), n)
	assert.Equal(t, uplinkData, uplinkReceived, "Uplink data should be relayed")

	// Test downlink: source -> relay -> client
	downlinkData := []byte("downlink test")
	_, err = sourceConn.Write(downlinkData)
	require.NoError(t, err)

	downlinkReceived := make([]byte, len(downlinkData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err = io.ReadFull(relayClient, downlinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(downlinkData), n)
	assert.Equal(t, downlinkData, downlinkReceived, "Downlink data should be relayed")
}

func TestRelayReadable(t *testing.T) {
	source := newMockSource(t)
	ctx := context.Background()

	readablePort := getFreePort(t)
	relay := startRelay(t, ctx, source.Port(), nil, []int{readablePort}, false)
	defer relay.Stop()
	err := relay.WaitReady(5 * time.Second)
	require.NoError(t, err)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", readablePort))
	require.NoError(t, err)
	defer relayClient.Close()
	time.Sleep(100 * time.Millisecond)

	// Test downlink works
	downlinkData := []byte("downlink only")
	_, err = sourceConn.Write(downlinkData)
	require.NoError(t, err)

	downlinkReceived := make([]byte, len(downlinkData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(relayClient, downlinkReceived)
	require.NoError(t, err)
	assert.Equal(t, len(downlinkData), n)
	assert.Equal(t, downlinkData, downlinkReceived)

	// Test uplink is dropped (not sent to source)
	uplinkData := []byte("uplink should be dropped")
	_, err = relayClient.Write(uplinkData)
	require.NoError(t, err)

	// Source should NOT receive uplink
	sourceConn.SetReadDeadline(time.Now().Add(500 * time.Millisecond))
	buf := make([]byte, len(uplinkData))
	_, err = sourceConn.Read(buf)
	assert.Error(t, err, "Source should not receive uplink in readable mode")
}

func TestRelayMultipleClients(t *testing.T) {
	source := newMockSource(t)
	ctx := context.Background()

	duplexPort := getFreePort(t)
	relay := startRelay(t, ctx, source.Port(), []int{duplexPort}, nil, false)
	defer relay.Stop()
	err := relay.WaitReady(5 * time.Second)
	require.NoError(t, err)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	// Connect multiple clients
	const numClients = 3
	clients := make([]net.Conn, numClients)
	for i := range numClients {
		client, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", duplexPort))
		require.NoError(t, err)
		defer client.Close()
		clients[i] = client
		time.Sleep(50 * time.Millisecond)
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
	ctx := context.Background()

	duplexPort := getFreePort(t)
	relay := startRelay(t, ctx, source.Port(), []int{duplexPort}, nil, false)
	defer relay.Stop()
	err := relay.WaitReady(5 * time.Second)
	require.NoError(t, err)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", duplexPort))
	require.NoError(t, err)
	defer relayClient.Close()
	time.Sleep(100 * time.Millisecond)

	// Large payload (100 KB)
	largeData := bytes.Repeat([]byte("NASA/JPL"), 12800)

	// Send downlink data in background
	go func() {
		sourceConn.Write(largeData)
	}()

	// Receive and verify
	received := make([]byte, len(largeData))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	n, err := io.ReadFull(relayClient, received)
	require.NoError(t, err)
	assert.Equal(t, len(largeData), n)
	assert.Equal(t, largeData, received)
}

func TestRelayServerMode(t *testing.T) {
	ctx := context.Background()

	sourcePort := getFreePort(t)
	duplexPort := getFreePort(t)
	relay := startRelay(t, ctx, sourcePort, []int{duplexPort}, nil, true)
	defer relay.Stop()
	err := relay.WaitReady(5 * time.Second)
	require.NoError(t, err)

	// Connect source to the relay server
	sourceConn, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", sourcePort))
	require.NoError(t, err)
	defer sourceConn.Close()
	time.Sleep(100 * time.Millisecond)

	// Connect client to relay
	relayClient, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", duplexPort))
	require.NoError(t, err)
	defer relayClient.Close()
	time.Sleep(100 * time.Millisecond)

	// Test downlink: source -> relay -> client
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
