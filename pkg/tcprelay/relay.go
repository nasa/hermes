package tcprelay

import (
	"context"
	"fmt"
	"io"
	"net"
	"sync"

	_ "embed"

	"github.com/nasa/hermes/pkg/host"
)

var (
	_ host.ProfileProvider[Params] = (*tcpRelayProvider)(nil)
)

//go:embed schema.json
var schema string

type Params struct {
	SourceAddress string `json:"sourceAddress"`
	SourcePort    int    `json:"sourcePort"`
	ServerMode    bool   `json:"serverMode"`
	DuplexPorts   []int  `json:"duplexPorts"`
	ReadablePorts []int  `json:"readablePorts"`
}

type tcpRelayProvider struct{}

// Default implements host.ProfileProvider.
func (t *tcpRelayProvider) Default() Params {
	return Params{
		SourceAddress: "localhost",
		ServerMode:    false,
		DuplexPorts:   []int{},
		ReadablePorts: []int{},
	}
}

// Source manages the connection to the source TCP socket and broadcasts data to all relay clients
type Source struct {
	mu       sync.RWMutex
	handlers map[int]func([]byte)
	nextID   int
	conn     net.Conn
	logger   host.ConnectSession
}

func newSource(session host.ConnectSession) *Source {
	return &Source{
		handlers: make(map[int]func([]byte)),
		logger:   session,
	}
}

func (s *Source) addHandler(handler func([]byte)) int {
	s.mu.Lock()
	defer s.mu.Unlock()
	id := s.nextID
	s.nextID++
	s.handlers[id] = handler
	return id
}

func (s *Source) removeHandler(id int) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.handlers, id)
}

func (s *Source) broadcast(data []byte) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, handler := range s.handlers {
		handler(data)
	}
}

func (s *Source) setConnection(conn net.Conn) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.conn != nil {
		s.logger.Log().Warn("got another source connection while one was still connected, closing previous connection")
		s.conn.Close()
	}
	s.conn = conn
}

func (s *Source) write(data []byte) error {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if s.conn == nil {
		return fmt.Errorf("no source connection available")
	}
	_, err := s.conn.Write(data)
	return err
}

func (s *Source) listen(ctx context.Context, conn net.Conn) {
	s.setConnection(conn)
	defer func() {
		s.mu.Lock()
		if s.conn == conn {
			s.conn = nil
		}
		s.mu.Unlock()
	}()

	buf := make([]byte, 32768)
	for {
		select {
		case <-ctx.Done():
			return
		default:
			n, err := conn.Read(buf)
			if err != nil {
				if err != io.EOF {
					s.logger.Log().Error("source connection read error", "err", err)
				}
				return
			}
			if n > 0 {
				data := make([]byte, n)
				copy(data, buf[:n])
				s.broadcast(data)
			}
		}
	}
}

func createRelayServer(
	ctx context.Context,
	source *Source,
	port int,
	isDuplex bool,
	session host.ConnectSession,
) error {
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return fmt.Errorf("failed to listen on port %d: %w", port, err)
	}

	mode := "readable"
	if isDuplex {
		mode = "duplex"
	}
	session.Log().Info("relay server listening", "port", port, "mode", mode)

	go func() {
		<-ctx.Done()
		listener.Close()
	}()

	go func() {
		for {
			conn, err := listener.Accept()
			if err != nil {
				select {
				case <-ctx.Done():
					return
				default:
					session.Log().Error("relay accept error", "port", port, "err", err)
					return
				}
			}

			handleRelayClient(ctx, conn, source, port, isDuplex, session)
		}
	}()

	return nil
}

func handleRelayClient(
	ctx context.Context,
	conn net.Conn,
	source *Source,
	port int,
	isDuplex bool,
	session host.ConnectSession,
) {
	addr := conn.RemoteAddr().String()

	clientCtx, cancel := context.WithCancel(ctx)

	handlerID := source.addHandler(func(data []byte) {
		select {
		case <-clientCtx.Done():
			return
		default:
			_, err := conn.Write(data)
			if err != nil {
				session.Log().Debug("failed to write to relay client", "port", port, "addr", addr, "err", err)
				cancel()
			}
		}
	})

	// Log connection after handler is registered
	session.Log().Info("relay client connected", "port", port, "addr", addr)

	go runRelayClientReadLoop(clientCtx, cancel, conn, source, handlerID, port, isDuplex, session, addr)
}

// runRelayClientReadLoop consumes the client's uplink until the connection closes
// or the context is cancelled, cleaning up the downlink handler on exit.
func runRelayClientReadLoop(
	clientCtx context.Context,
	cancel context.CancelFunc,
	conn net.Conn,
	source *Source,
	handlerID int,
	port int,
	isDuplex bool,
	session host.ConnectSession,
	addr string,
) {
	defer cancel()
	defer source.removeHandler(handlerID)

	defer func() {
		conn.Close()
		session.Log().Info("relay client disconnected", "port", port, "addr", addr)
	}()

	if isDuplex {
		buf := make([]byte, 32768)
		for {
			select {
			case <-clientCtx.Done():
				return
			default:
				n, err := conn.Read(buf)
				if err != nil {
					if err != io.EOF {
						session.Log().Debug("relay client read error", "port", port, "addr", addr, "err", err)
					}
					return
				}
				if n > 0 {
					data := make([]byte, n)
					copy(data, buf[:n])
					err := source.write(data)
					if err != nil {
						session.Log().Warn("failed to relay uplink to source", "port", port, "addr", addr, "size", n, "err", err)
					} else {
						session.Log().Debug("relayed uplink to source", "port", port, "addr", addr, "size", n)
					}
				}
			}
		}
	} else {
		buf := make([]byte, 32768)
		for {
			select {
			case <-clientCtx.Done():
				return
			default:
				n, err := conn.Read(buf)
				if err != nil {
					if err != io.EOF {
						session.Log().Debug("relay client read error", "port", port, "addr", addr, "err", err)
					}
					return
				}
				if n > 0 {
					session.Log().Warn("received uplink data on readable-only port, dropping", "port", port, "addr", addr, "size", n)
				}
			}
		}
	}
}

// Start implements host.ProfileProvider.
func (t *tcpRelayProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	source := newSource(session)

	if settings.ServerMode {
		session.Log().Info(
			"starting source server",
			"port",
			settings.SourcePort,
		)

		listener, err := net.Listen("tcp", fmt.Sprintf(":%d", settings.SourcePort))
		if err != nil {
			return fmt.Errorf("failed to start source server: %w", err)
		}
		defer listener.Close()

		session.Log().Info("source server listening", "port", settings.SourcePort)

		go func() {
			<-ctx.Done()
			listener.Close()
		}()

		go func() {
			for {
				conn, err := listener.Accept()
				if err != nil {
					select {
					case <-ctx.Done():
						return
					default:
						session.Log().Error("source server accept error", "err", err)
						return
					}
				}

				addr := conn.RemoteAddr().String()
				session.Log().Info("source client connected", "addr", addr)
				go source.listen(ctx, conn)
			}
		}()
	} else {
		session.Log().Info(
			"connecting to source",
			"address",
			settings.SourceAddress,
			"port",
			settings.SourcePort,
		)

		addr := net.JoinHostPort(settings.SourceAddress, fmt.Sprintf("%d", settings.SourcePort))
		conn, err := net.Dial("tcp", addr)
		if err != nil {
			return fmt.Errorf("failed to connect to source: %w", err)
		}
		defer conn.Close()

		session.Log().Info("source connection established")
		go source.listen(ctx, conn)
	}

	for _, port := range settings.DuplexPorts {
		if err := createRelayServer(ctx, source, port, true, session); err != nil {
			return err
		}
	}

	for _, port := range settings.ReadablePorts {
		if err := createRelayServer(ctx, source, port, false, session); err != nil {
			return err
		}
	}

	session.Started()

	<-ctx.Done()
	session.Log().Info("tcp relay shutting down")
	return nil
}

func Init() error {
	_, err := host.RegisterProfileProvider(
		"TCP Relay",
		&tcpRelayProvider{},
		schema,
	)

	if err != nil {
		return err
	}

	return nil
}
