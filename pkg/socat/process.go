package socat

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os/exec"
	"sync"

	"github.com/nasa/hermes/pkg/log"
)

// socatConn adapts a subprocess's stdio into an io.ReadWriteCloser: reads pull from stdout, writes push to stdin.
type socatConn struct {
	stdin  io.WriteCloser
	stdout io.ReadCloser
	cancel context.CancelFunc

	closeOnce sync.Once
}

var _ io.ReadWriteCloser = (*socatConn)(nil)

func (c *socatConn) Read(p []byte) (int, error) {
	return c.stdout.Read(p)
}

func (c *socatConn) Write(p []byte) (int, error) {
	return c.stdin.Write(p)
}

func (c *socatConn) Close() error {
	c.closeOnce.Do(func() {
		c.cancel()
		c.stdin.Close()
	})
	return nil
}

func spawnSocat(
	ctx context.Context,
	address string,
	logger log.Logger,
) (io.ReadWriteCloser, error) {
	socatPath, err := exec.LookPath("socat")
	if err != nil {
		return nil, fmt.Errorf("socat executable not found on PATH: %w", err)
	}

	// Args passed as a slice (no shell): address is a single argv token, so no shell injection.
	return spawnProcess(ctx, socatPath, []string{address, "STDIO"}, logger)
}

func spawnProcess(
	ctx context.Context,
	path string,
	args []string,
	logger log.Logger,
) (io.ReadWriteCloser, error) {
	procCtx, cancel := context.WithCancel(ctx)

	cmd := exec.CommandContext(procCtx, path, args...)

	stdin, err := cmd.StdinPipe()
	if err != nil {
		cancel()
		return nil, fmt.Errorf("failed to open %s stdin: %w", path, err)
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		cancel()
		return nil, fmt.Errorf("failed to open %s stdout: %w", path, err)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		cancel()
		return nil, fmt.Errorf("failed to open %s stderr: %w", path, err)
	}

	logger.Info("spawning process", "path", path, "args", args)
	if err := cmd.Start(); err != nil {
		cancel()
		return nil, fmt.Errorf("failed to start %s: %w", path, err)
	}

	go func() {
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			logger.Warn("subprocess", "path", path, "msg", scanner.Text())
		}
	}()

	// If the process exits on its own, cancel so pending reads/writes unblock and the pipeline tears down.
	go func() {
		err := cmd.Wait()
		if err != nil && procCtx.Err() == nil {
			logger.Error("subprocess exited", "path", path, "err", err)
		} else {
			logger.Info("subprocess exited", "path", path)
		}
		cancel()
	}()

	return &socatConn{
		stdin:  stdin,
		stdout: stdout,
		cancel: cancel,
	}, nil
}
