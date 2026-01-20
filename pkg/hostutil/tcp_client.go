package hostutil

import (
	"context"
	"fmt"
	"io"
	"net"
	"sync"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
)

type TcpClientParams struct {
	// Address to connect to
	Address string
}

func TcpClientProvider(
	ctx context.Context,
	name string,
	session host.ConnectSession,
	params TcpClientParams,
	connectionHandler func(io.ReadWriteCloser),
) error {
	var d net.Dialer
	logger := session.Log()

	logger.Info("connecting to tcp server", "address", params.Address)
	conn, err := d.DialContext(ctx, "tcp", params.Address)
	if err != nil {
		return fmt.Errorf("connection failed: %w", err)
	}

	logger.Info("connection active", "address", params.Address)

	session.Started()
	shutdown := make(chan struct{})

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()

		// Blocks until the connection is closed and all data is processed
		connectionHandler(infra.MonitoredReadWriter(conn, name))
		close(shutdown)
	}()

	// Wait for either the context to exit or the connection to break
	select {
	case <-shutdown:
	case <-ctx.Done():
	}

	conn.Close()
	logger.Info("closed connection", "address", params.Address)

	wg.Wait()

	return nil
}
