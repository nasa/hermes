package fprime

import (
	"context"
	"fmt"
	"io"
	"sync"

	_ "embed"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/hostutil"
)

var (
	_ host.ProfileProvider[ServerParams] = (*serverProvider)(nil)
	_ host.ProfileProvider[ClientParams] = (*clientProvider)(nil)
)

//go:embed schema/server.json
var serverSchema string

//go:embed schema/client.json
var clientSchema string

//go:embed schema/uischema.json
var uiSchema string

const (
	protocolFprime = "fprime"
	protocolCcsds  = "ccsds"
)

type (
	ServerParams struct {
		Name       string `json:"name,omitempty"`
		Address    string `json:"address"`
		Dictionary string `json:"dictionary,omitempty"`
		Protocol   string `json:"protocol"`
	}

	ClientParams struct {
		// Name of the FSW when we connect to it
		Name     string `json:"name,omitempty"`
		Protocol string `json:"protocol"`

		// Address to connect to FSW server
		Address    string `json:"address"`
		Dictionary string `json:"dictionary,omitempty"`
	}

	serverProvider struct{}
	clientProvider struct{}
)

func gdsProvider(
	ctx context.Context,
	session host.ConnectSession,
	conn io.ReadWriteCloser,
	dict *host.Dictionary,
	fswName string,
	protocolKind string,
) error {
	primaryDict := dict.Namespace("")
	tlmPacketDict := dict.Namespace("telemetry-packets")

	wg := sync.WaitGroup{}
	fsw := NewFprimeFsw(
		session.Log(),
		fswName,
		primaryDict,
	)

	var err error
	var protocol framer

	switch protocolKind {
	case protocolCcsds:
		protocol, err = NewCcsdsProtocol(conn, session.Log(), dict)
		if err != nil {
			return fmt.Errorf("failed to initialize protocol: %w", err)
		}
	case protocolFprime:
		protocol = NewFprimeProtocol(conn, primaryDict)
	default:
		return fmt.Errorf("invalid protocol kind '%s'", protocolKind)
	}

	ConnectPipeline(
		ctx,
		fsw.Logger,
		&wg,
		fsw.dictionary,
		tlmPacketDict,
		conn,
		protocol,
		fsw.Down,
		fsw.Up,
	)

	session.Connect(fsw)

	// Wait until the connection is closed and all the messages are processed
	// Close events are handled by the TcpServerProvider
	wg.Wait()

	session.Disconnect(fsw)
	return nil
}

// Default implements profile.ProfileProvider.
func (c *serverProvider) Default() ServerParams {
	return ServerParams{
		Name:    "fprime",
		Address: "0.0.0.0:8000",
	}
}

// Start implements profile.ProfileSession.
func (s *serverProvider) Start(
	ctx context.Context,
	settings ServerParams,
	session host.ConnectSession,
) error {
	dictionary := host.Dictionaries.Get(settings.Dictionary)
	if dictionary == nil {
		return fmt.Errorf("dictionary '%s' not found", settings.Dictionary)
	}

	hostDict, err := host.DictionaryFromProto(dictionary)
	if err != nil {
		return fmt.Errorf("failed to load dictionary: %w", err)
	}

	return hostutil.TcpServerProvider(
		ctx,
		"fprime-gds",
		session,
		hostutil.TcpServerParams{
			Address:      settings.Address,
			SingleClient: true,
		},
		func(conn io.ReadWriteCloser) error {
			return gdsProvider(
				ctx,
				session,
				conn,
				hostDict,
				settings.Name,
				settings.Protocol,
			)
		},
	)
}

// Default implements profile.ProfileProvider.
func (c *clientProvider) Default() ClientParams {
	return ClientParams{
		Name:    "fprime",
		Address: "localhost:8000",
	}
}

// Start implements profile.ProfileSession.
func (c *clientProvider) Start(
	ctx context.Context,
	settings ClientParams,
	session host.ConnectSession,
) error {
	dictionary := host.Dictionaries.Get(settings.Dictionary)
	if dictionary == nil {
		return fmt.Errorf("dictionary '%s' not found", settings.Dictionary)
	}

	hostDict, err := host.DictionaryFromProto(dictionary)
	if err != nil {
		return fmt.Errorf("failed to load dictionary: %w", err)
	}

	return hostutil.TcpClientProvider(
		ctx,
		"fprime-gds",
		session,
		hostutil.TcpClientParams{
			Address: settings.Address,
		},
		func(conn io.ReadWriteCloser) {
			gdsProvider(
				ctx,
				session,
				conn,
				hostDict,
				settings.Name,
				settings.Protocol,
			)
		},
	)
}

func Init() error {
	_, err := host.RegisterProfileProviderWithUiSchema(
		"FPrime Server",
		&serverProvider{},
		serverSchema,
		uiSchema,
	)
	if err != nil {
		return err
	}

	_, err = host.RegisterProfileProviderWithUiSchema(
		"FPrime Client",
		&clientProvider{},
		clientSchema,
		uiSchema,
	)
	if err != nil {
		return err
	}

	return nil
}
