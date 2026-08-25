package socat

import (
	"io"
	"os/exec"
	"testing"
	"time"

	"github.com/nasa/hermes/pkg/log"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Exercises the subprocess->io.ReadWriteCloser adapter against `cat`, which echoes stdin to stdout.
func TestSpawnProcessEcho(t *testing.T) {
	if _, err := exec.LookPath("cat"); err != nil {
		t.Skip("cat not available")
	}

	logger := log.GetLogger(t.Context())

	conn, err := spawnProcess(t.Context(), "cat", nil, logger)
	require.NoError(t, err)
	defer conn.Close()

	payload := []byte("hello spacecraft\n")
	_, err = conn.Write(payload)
	require.NoError(t, err)

	got := make([]byte, len(payload))
	_, err = io.ReadFull(conn, got)
	require.NoError(t, err)
	assert.Equal(t, payload, got)
}

// Verifies Close() tears down the subprocess so a subsequent read unblocks instead of hanging.
func TestSpawnProcessCloseReaps(t *testing.T) {
	if _, err := exec.LookPath("cat"); err != nil {
		t.Skip("cat not available")
	}

	logger := log.GetLogger(t.Context())

	conn, err := spawnProcess(t.Context(), "cat", nil, logger)
	require.NoError(t, err)

	require.NoError(t, conn.Close())

	done := make(chan error, 1)
	go func() {
		buf := make([]byte, 16)
		_, readErr := conn.Read(buf)
		done <- readErr
	}()

	select {
	case readErr := <-done:
		assert.Error(t, readErr, "read should not succeed after close")
	case <-time.After(5 * time.Second):
		t.Fatal("read did not unblock after Close()")
	}
}

// Drives the real socat binary end-to-end: `socat EXEC:cat STDIO` echoes bytes back through the conn.
func TestSpawnSocatEcho(t *testing.T) {
	if _, err := exec.LookPath("socat"); err != nil {
		t.Skip("socat not installed")
	}

	logger := log.GetLogger(t.Context())

	conn, err := spawnSocat(t.Context(), "EXEC:cat", logger)
	require.NoError(t, err)
	defer conn.Close()

	payload := []byte("hello spacecraft\n")
	_, err = conn.Write(payload)
	require.NoError(t, err)

	got := make([]byte, len(payload))
	_, err = io.ReadFull(conn, got)
	require.NoError(t, err)
	assert.Equal(t, payload, got)
}

// Verifies a clear error when socat is not installed.
func TestSpawnSocatMissing(t *testing.T) {
	if _, err := exec.LookPath("socat"); err == nil {
		t.Skip("socat is installed; not-found path not exercised")
	}

	logger := log.GetLogger(t.Context())

	_, err := spawnSocat(t.Context(), "TCP:localhost:9", logger)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "socat executable not found")
}
