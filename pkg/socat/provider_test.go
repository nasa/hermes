package socat

import (
	"context"
	"fmt"
	"io"
	"net"
	"os/exec"
	"testing"
	"time"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockConnectSession struct{ started chan struct{} }

func newMockSession() *mockConnectSession {
	return &mockConnectSession{started: make(chan struct{}, 1)}
}

func (m *mockConnectSession) Log() log.Logger { return log.GetLogger(context.Background()) }
func (m *mockConnectSession) Started() {
	select {
	case m.started <- struct{}{}:
	default:
	}
}
func (m *mockConnectSession) Connect(host.Fsw)    {}
func (m *mockConnectSession) Disconnect(host.Fsw) {}

func freePort(t *testing.T) int {
	t.Helper()
	l, err := net.Listen("tcp", "localhost:0")
	require.NoError(t, err)
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port
}

func requireSocat(t *testing.T) {
	t.Helper()
	if _, err := exec.LookPath("socat"); err != nil {
		t.Skip("socat not installed")
	}
}

// Runs socat as a real relay between two TCP endpoints and proves bytes flow
// through: socat listens on portA, connects to a server we run on portB.
func TestRelayBetweenTCPEndpoints(t *testing.T) {
	requireSocat(t)

	portA := freePort(t)
	server, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", freePort(t)))
	require.NoError(t, err)
	defer server.Close()
	portB := server.Addr().(*net.TCPAddr).Port

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	session := newMockSession()
	go func() {
		provider := &socatProvider{}
		params := Params{
			Address1: fmt.Sprintf("tcp-listen:%d,reuseaddr", portA),
			Address2: fmt.Sprintf("tcp-connect:localhost:%d", portB),
		}
		_ = provider.Start(ctx, params, session)
	}()

	select {
	case <-session.started:
	case <-time.After(5 * time.Second):
		t.Fatal("provider never reported Started()")
	}

	// A client dials socat's listen side; socat then dials our server.
	var client net.Conn
	for i := 0; i < 50; i++ {
		client, err = net.DialTimeout("tcp", fmt.Sprintf("localhost:%d", portA), 100*time.Millisecond)
		if err == nil {
			break
		}
		time.Sleep(50 * time.Millisecond)
	}
	require.NoError(t, err, "could not connect to socat listen endpoint")
	defer client.Close()

	downstream, err := server.Accept()
	require.NoError(t, err)
	defer downstream.Close()

	// client -> socat -> server
	payload := []byte("hello spacecraft\n")
	_, err = client.Write(payload)
	require.NoError(t, err)

	got := make([]byte, len(payload))
	downstream.SetReadDeadline(time.Now().Add(5 * time.Second))
	_, err = io.ReadFull(downstream, got)
	require.NoError(t, err)
	assert.Equal(t, payload, got)

	// server -> socat -> client (relay is bidirectional)
	reply := []byte("ack\n")
	_, err = downstream.Write(reply)
	require.NoError(t, err)

	gotReply := make([]byte, len(reply))
	client.SetReadDeadline(time.Now().Add(5 * time.Second))
	_, err = io.ReadFull(client, gotReply)
	require.NoError(t, err)
	assert.Equal(t, reply, gotReply)
}

// Cancelling the context kills socat and lets Start return without error.
func TestContextCancelStopsSocat(t *testing.T) {
	requireSocat(t)

	ctx, cancel := context.WithCancel(context.Background())
	session := newMockSession()

	done := make(chan error, 1)
	go func() {
		provider := &socatProvider{}
		params := Params{
			Address1: fmt.Sprintf("tcp-listen:%d,reuseaddr", freePort(t)),
			Address2: fmt.Sprintf("tcp-listen:%d,reuseaddr", freePort(t)),
		}
		done <- provider.Start(ctx, params, session)
	}()

	select {
	case <-session.started:
	case <-time.After(5 * time.Second):
		t.Fatal("provider never reported Started()")
	}

	cancel()

	select {
	case err := <-done:
		assert.NoError(t, err, "clean shutdown should not be an error")
	case <-time.After(5 * time.Second):
		t.Fatal("Start did not return after context cancel")
	}
}

// A bad address makes socat exit non-zero, surfaced as an error from Start.
func TestBadAddressReturnsError(t *testing.T) {
	requireSocat(t)

	provider := &socatProvider{}
	params := Params{
		Address1: "definitely-not-a-valid-socat-address",
		Address2: "another-bogus-address",
	}
	err := provider.Start(context.Background(), params, newMockSession())
	require.Error(t, err)
	assert.Contains(t, err.Error(), "socat exited")
}

func TestMissingSocatReturnsError(t *testing.T) {
	if _, err := exec.LookPath("socat"); err == nil {
		t.Skip("socat is installed; not-found path not exercised")
	}

	provider := &socatProvider{}
	params := Params{Address1: "a", Address2: "b"}
	err := provider.Start(context.Background(), params, newMockSession())
	require.Error(t, err)
	assert.Contains(t, err.Error(), "socat executable not found")
}
