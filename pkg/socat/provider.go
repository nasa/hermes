// Package socat provides a Profile Provider that bridges an F Prime/CCSDS connection over any socat-supported transport by running `socat <address> STDIO`.
package socat

import (
	"context"
	"fmt"

	_ "embed"

	"github.com/nasa/hermes/pkg/fprime"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
)

var (
	_ host.ProfileProvider[Params] = (*socatProvider)(nil)
)

//go:embed schema/socat.json
var schema string

//go:embed schema/uischema.json
var uiSchema string

const protocolCcsds = "ccsds"

type Params struct {
	Name string `json:"name,omitempty"`

	// socat far-side address spec, e.g. "/dev/ttyUSB0,b115200,raw" or "TCP:192.168.1.9:50000".
	Address string `json:"address"`

	Dictionary string `json:"dictionary,omitempty"`
	Protocol   string `json:"protocol"`
}

type socatProvider struct{}

func (s *socatProvider) Default() Params {
	return Params{
		Protocol: protocolCcsds,
	}
}

func (s *socatProvider) Start(
	ctx context.Context,
	settings Params,
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

	conn, err := spawnSocat(ctx, settings.Address, session.Log())
	if err != nil {
		return err
	}
	defer conn.Close()

	monitored := infra.MonitoredReadWriter(conn, "socat")

	session.Started()

	return fprime.ConnectGDS(
		ctx,
		session,
		monitored,
		settings.Dictionary,
		hostDict,
		settings.Name,
		settings.Protocol,
	)
}

func Init() error {
	_, err := host.RegisterProfileProviderWithUiSchema(
		"Socat",
		&socatProvider{},
		schema,
		uiSchema,
	)
	if err != nil {
		return err
	}

	return nil
}
