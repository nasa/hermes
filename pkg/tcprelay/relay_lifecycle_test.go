package tcprelay

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

// Keep the parent live after Start fails: the provider owns its resources.
func TestRelayStartupFailureReleasesListeners(t *testing.T) {
	for _, serverMode := range []bool{false, true} {
		for _, failReadable := range []bool{false, true} {
			name := fmt.Sprintf("server=%t/readable=%t", serverMode, failReadable)
			t.Run(name, func(t *testing.T) {
				blocked, err := net.Listen("tcp", ":0")
				require.NoError(t, err)
				defer blocked.Close()
				blockedPort := blocked.Addr().(*net.TCPAddr).Port
				sourcePort := getFreePort(t)
				if !serverMode {
					sourcePort = newMockSource(t).Port()
				}
				duplexPort := getFreePort(t)
				params := Params{
					SourceAddress: "localhost", SourcePort: sourcePort,
					ServerMode: serverMode, DuplexPorts: []int{duplexPort},
				}
				ports := []int{duplexPort}
				if failReadable {
					readablePort := getFreePort(t)
					params.ReadablePorts = []int{readablePort, blockedPort}
					ports = append(ports, readablePort)
				} else {
					params.DuplexPorts = append(params.DuplexPorts, blockedPort)
				}
				ctx, cancel := context.WithCancel(t.Context())
				defer cancel()
				err = (&tcpRelayProvider{}).Start(ctx, params, newCaptureSession())
				require.ErrorContains(t, err, "failed to listen on port")
				require.NoError(t, ctx.Err(), "startup must not cancel its caller")
				if serverMode {
					ports = append(ports, sourcePort)
				}
				for _, port := range ports {
					listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
					require.NoError(t, err, "port %d remained bound after Start returned", port)
					listener.Close()
				}
			})
		}
	}
}

type closeObservedConn struct {
	net.Conn
	once   sync.Once
	closed chan struct{}
}

func (c *closeObservedConn) Close() error {
	err := c.Conn.Close()
	c.once.Do(func() { close(c.closed) })
	return err
}

func TestSourceClosesConnectionOnEOF(t *testing.T) {
	local, peer := net.Pipe()
	defer local.Close()
	conn := &closeObservedConn{Conn: local, closed: make(chan struct{})}
	source := newSource(newCaptureSession())
	peer.Close()

	source.listen(t.Context(), conn)
	select {
	case <-conn.closed:
	default:
		t.Fatal("source reader returned without closing its connection")
	}
	source.mu.RLock()
	defer source.mu.RUnlock()
	require.Nil(t, source.conn)
}

func TestSourceDelayedReaderCannotReplaceNewConnection(t *testing.T) {
	first, firstPeer := net.Pipe()
	defer first.Close()
	defer firstPeer.Close()
	second, secondPeer := net.Pipe()
	defer second.Close()
	defer secondPeer.Close()
	source := newSource(newCaptureSession())

	// Model two accepts before the first reader goroutine is scheduled.
	source.setConnection(first)
	source.setConnection(second)
	source.listen(t.Context(), first)

	source.mu.RLock()
	defer source.mu.RUnlock()
	require.True(t, source.conn == second, "an obsolete reader replaced the newer source")
}

func TestRelayCanceledSourceDial(t *testing.T) {
	source := newMockSource(t)
	ctx, cancel := context.WithCancel(t.Context())
	cancel()
	err := (&tcpRelayProvider{}).Start(ctx, Params{
		SourceAddress: "localhost", SourcePort: source.Port(),
	}, newCaptureSession())
	require.True(t, errors.Is(err, context.Canceled), "got %v, want a canceled dial", err)
}

type lifecycleSession struct {
	*captureSession
	ready chan struct{}
}

func (s *lifecycleSession) Started() { close(s.ready) }

func TestRelayShutdownReleasesConnections(t *testing.T) {
	for _, serverMode := range []bool{false, true} {
		t.Run(fmt.Sprintf("server=%t", serverMode), func(t *testing.T) {
			sourcePort := getFreePort(t)
			var mock *mockTCPSource
			if !serverMode {
				mock = newMockSource(t)
				sourcePort = mock.Port()
			}
			duplexPort := getFreePort(t)
			readablePort := getFreePort(t)
			session := &lifecycleSession{captureSession: newCaptureSession(), ready: make(chan struct{})}
			ctx, cancel := context.WithCancel(t.Context())
			defer cancel()
			done := make(chan error, 1)
			go func() {
				done <- (&tcpRelayProvider{}).Start(ctx, Params{
					SourceAddress: "localhost", SourcePort: sourcePort, ServerMode: serverMode,
					DuplexPorts: []int{duplexPort}, ReadablePorts: []int{readablePort},
				}, session)
			}()
			select {
			case <-session.ready:
			case err := <-done:
				t.Fatalf("startup failed: %v", err)
			case <-time.After(testTimeout):
				t.Fatal("startup timed out")
			}
			var sourceConn net.Conn
			var err error
			if serverMode {
				sourceConn, err = net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", sourcePort), connectTimeout)
			} else {
				sourceConn, err = mock.WaitForConnection(testTimeout)
			}
			require.NoError(t, err)
			defer sourceConn.Close()
			client, err := net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", duplexPort), connectTimeout)
			require.NoError(t, err)
			defer client.Close()
			eventually(t, testTimeout, func() bool { return session.logger.has("relay client connected") },
				"relay client was never subscribed")
			// A downlink proves the source reader is active before testing uplink.
			require.NoError(t, sourceConn.SetWriteDeadline(time.Now().Add(testTimeout)))
			_, err = sourceConn.Write([]byte{1})
			require.NoError(t, err)
			require.NoError(t, client.SetReadDeadline(time.Now().Add(testTimeout)))
			received := make([]byte, 1)
			_, err = io.ReadFull(client, received)
			require.NoError(t, err)
			require.Equal(t, []byte{1}, received)
			syncUplink(t, client, sourceConn)
			cancel()
			select {
			case err := <-done:
				require.NoError(t, err)
			case <-time.After(testTimeout):
				t.Fatal("shutdown timed out")
			}
			for _, conn := range []net.Conn{sourceConn, client} {
				require.NoError(t, conn.SetReadDeadline(time.Now().Add(testTimeout)))
				_, err := conn.Read(make([]byte, 1))
				require.ErrorIs(t, err, io.EOF)
			}
			ports := []int{duplexPort, readablePort}
			if serverMode {
				ports = append(ports, sourcePort)
			}
			for _, port := range ports {
				listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
				require.NoError(t, err, "port %d remained bound after shutdown", port)
				listener.Close()
			}
		})
	}
}
