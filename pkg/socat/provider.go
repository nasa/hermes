package socat

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os/exec"
	"strings"

	_ "embed"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
)

var (
	_ host.ProfileProvider[Params] = (*socatProvider)(nil)
)

//go:embed schema/socat.json
var schema string

type Params struct {
	Name string `json:"name,omitempty"`

	// The two socat endpoint specs, each passed verbatim as a single argument,
	// e.g. "/dev/ttyUSB0,raw,b9600" and "tcp-connect:localhost:8000".
	Address1 string `json:"address1"`
	Address2 string `json:"address2"`

	// Optional socat global options preceding the endpoints, e.g. "-d -d -T 30".
	// Whitespace-separated; not shell-parsed.
	GlobalOptions string `json:"globalOptions,omitempty"`
}

type socatProvider struct{}

func (s *socatProvider) Default() Params {
	return Params{}
}

func (s *socatProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	socatPath, err := exec.LookPath("socat")
	if err != nil {
		return fmt.Errorf("socat executable not found on PATH: %w", err)
	}

	// Global options (whitespace-split) precede the two endpoint args. The
	// endpoints are passed as single tokens, so their comma-separated options
	// (raw, b115200, ...) reach socat unmodified and no shell is involved.
	args := strings.Fields(settings.GlobalOptions)
	args = append(args, settings.Address1, settings.Address2)

	cmd := exec.CommandContext(ctx, socatPath, args...)

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return fmt.Errorf("failed to open socat stderr: %w", err)
	}

	logger := session.Log()
	logger.Info("spawning socat", "args", args)
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start socat: %w", err)
	}

	go pipeToLog(stderr, logger)

	session.Started()

	// Block until socat exits or the context is cancelled (which kills it via
	// CommandContext). A clean stop is not an error; an unexpected exit is.
	err = cmd.Wait()
	if ctx.Err() != nil {
		return nil
	}
	if err != nil {
		return fmt.Errorf("socat exited: %w", err)
	}
	return nil
}

func pipeToLog(r io.Reader, logger log.Logger) {
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		logger.Warn("socat", "msg", scanner.Text())
	}
}

func Init() error {
	_, err := host.RegisterProfileProvider(
		"Socat",
		&socatProvider{},
		schema,
	)
	if err != nil {
		return err
	}

	return nil
}
