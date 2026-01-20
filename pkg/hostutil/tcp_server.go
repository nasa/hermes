package hostutil

import (
	"context"
	"fmt"
	"io"
	"net"
	"sync"
	"sync/atomic"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
)

type TcpServerParams struct {
	// Address to listen TCP server on
	Address string

	// Allow only one client connection at a time
	SingleClient bool
}

func TcpServerProvider(
	ctx context.Context,
	name string,
	session host.ConnectSession,
	params TcpServerParams,
	connectionHandler func(io.ReadWriteCloser) error,
) error {
	var lc net.ListenConfig
	wg := sync.WaitGroup{}
	shutdown := make(chan struct{})

	logger := session.Log()

	logger.Info("binding tcp server", "address", params.Address)
	listener, err := lc.Listen(ctx, "tcp", params.Address)
	if err != nil {
		return fmt.Errorf("failed to bind server: %w", err)
	}

	var numActiveConnections atomic.Int32

	wg.Add(1)
	go func() {
		defer wg.Done()

		session.Started()

		for {
			select {
			case <-shutdown:
				return
			default:
			}

			conn, err := listener.Accept()
			if err != nil {
				select {
				case <-shutdown:
					return
				default:
					logger.Info("failed to accept connection", "err", err)
					continue
				}
			}

			logger.Info("accepted connection", "localAddr", conn.LocalAddr(), "remoteAddr", conn.RemoteAddr())

			if params.SingleClient && numActiveConnections.Load() > 0 {
				logger.Warn(
					"only one active connection is allowed at a time, closing",
					"localAddr", conn.LocalAddr(), "remoteAddr", conn.RemoteAddr(),
				)
				conn.Close()
				continue
			}

			numActiveConnections.Add(1)

			connClosed := make(chan struct{})

			wg.Add(1)
			go func() {
				defer wg.Done()
				select {
				case <-connClosed:
					return
				case <-shutdown:
					conn.Close()
				}
			}()

			wg.Add(1)
			go func() {
				defer func() {
					conn.Close()
					numActiveConnections.Add(-1)

					session.Log().Info("closed connection", "localAddr", conn.LocalAddr(), "remoteAddr", conn.RemoteAddr())
					close(connClosed)

					wg.Done()
				}()

				// Blocks until the connection is closed and all data is processed
				if err := connectionHandler(infra.MonitoredReadWriter(conn, name)); err != nil {
					session.Log().Error("failed to handle connection", "err", err)
				}
			}()
		}
	}()

	<-ctx.Done()
	close(shutdown)
	listener.Close()

	wg.Wait()
	logger.Info("tcp server shutdown", "address", params.Address)

	return nil
}
