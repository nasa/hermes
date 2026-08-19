package tcprelay

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
)

// captureLogger records log messages so tests can assert on log-only paths.
type captureLogger struct {
	mu      sync.Mutex
	records []string
}

func (c *captureLogger) record(msg string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.records = append(c.records, msg)
}

func (c *captureLogger) has(substr string) bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	for _, r := range c.records {
		if strings.Contains(r, substr) {
			return true
		}
	}
	return false
}

func (c *captureLogger) Debug(msg string, args ...any) { c.record(msg) }
func (c *captureLogger) Info(msg string, args ...any)  { c.record(msg) }
func (c *captureLogger) Warn(msg string, args ...any)  { c.record(msg) }
func (c *captureLogger) Error(msg string, args ...any) { c.record(msg) }
func (c *captureLogger) With(args ...any) log.Logger   { return c }
func (c *captureLogger) WithContext(ctx context.Context) log.Logger {
	return c
}
func (c *captureLogger) Context() context.Context         { return context.Background() }
func (c *captureLogger) WithGroup(name string) log.Logger { return c }

// captureSession is a ConnectSession backed by a captureLogger.
type captureSession struct{ logger *captureLogger }

func newCaptureSession() *captureSession { return &captureSession{logger: &captureLogger{}} }

func (s *captureSession) Log() log.Logger         { return s.logger }
func (s *captureSession) Started()                {}
func (s *captureSession) Connect(fsw host.Fsw)    {}
func (s *captureSession) Disconnect(fsw host.Fsw) {}

// eventually polls cond until true or timeout.
func eventually(t *testing.T, timeout time.Duration, cond func() bool, msg string) {
	t.Helper()
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		if cond() {
			return
		}
		time.Sleep(10 * time.Millisecond)
	}
	t.Fatalf("condition not met within %s: %s", timeout, msg)
}

// Uplink with no source connected is dropped and logged, not fatal.
func TestRelayUplinkWithNoSource(t *testing.T) {
	// Server mode with no source ever connecting.
	sourcePort := getFreePort(t)
	duplexPort := getFreePort(t)
	session := newCaptureSession()
	startRelaySession(t, t.Context(), session, sourcePort, []int{duplexPort}, nil, true)

	relayClient, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer relayClient.Close()

	eventually(t, testTimeout, func() bool {
		return session.logger.has("relay client connected")
	}, "relay client never connected")

	_, err = relayClient.Write([]byte("uplink with no source"))
	require.NoError(t, err)

	eventually(t, testTimeout, func() bool {
		return session.logger.has("failed to relay uplink to source")
	}, "expected a dropped-uplink log when no source is connected")
}

// A second source connection replaces the first; its downlink reaches the client.
func TestRelaySourceReconnect(t *testing.T) {
	sourcePort := getFreePort(t)
	duplexPort := getFreePort(t)
	session := newCaptureSession()
	startRelaySession(t, t.Context(), session, sourcePort, []int{duplexPort}, nil, true)

	source1, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", sourcePort), connectTimeout)
	require.NoError(t, err)
	defer source1.Close()

	relayClient, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer relayClient.Close()

	eventually(t, testTimeout, func() bool { return session.logger.has("relay client connected") }, "client never connected")
	syncUplink(t, relayClient, source1)

	first := []byte("from source 1")
	_, err = source1.Write(first)
	require.NoError(t, err)
	got := make([]byte, len(first))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	_, err = io.ReadFull(relayClient, got)
	require.NoError(t, err)
	assert.Equal(t, first, got)

	// Second source replaces the first.
	source2, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", sourcePort), connectTimeout)
	require.NoError(t, err)
	defer source2.Close()

	eventually(t, testTimeout, func() bool {
		return session.logger.has("got another source connection while one was still connected")
	}, "expected a warning when a second source connects")

	second := []byte("from source 2")
	_, err = source2.Write(second)
	require.NoError(t, err)
	got2 := make([]byte, len(second))
	relayClient.SetReadDeadline(time.Now().Add(testTimeout))
	_, err = io.ReadFull(relayClient, got2)
	require.NoError(t, err)
	assert.Equal(t, second, got2)
}

// An overflowing slow client is dropped with a log.
func TestRelaySlowClientLogsDrop(t *testing.T) {
	source := newMockSource(t)
	duplexPort := getFreePort(t)
	session := newCaptureSession()
	startRelaySession(t, t.Context(), session, source.Port(), []int{duplexPort}, nil, false)

	sourceConn, err := source.WaitForConnection(testTimeout)
	require.NoError(t, err)
	defer sourceConn.Close()

	// Slow client subscribes then never reads.
	slow, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
	require.NoError(t, err)
	defer slow.Close()
	syncUplink(t, slow, sourceConn)

	// Flood past the queue bound so it overflows.
	chunk := bytes.Repeat([]byte("x"), 64*1024)
	go func() {
		for range 4 * downlinkQueueSize {
			if _, err := sourceConn.Write(chunk); err != nil {
				return
			}
		}
	}()

	eventually(t, testTimeout, func() bool {
		return session.logger.has("relay client too slow, dropping connection")
	}, "expected a slow-client drop log")
}
