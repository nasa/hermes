package otel

import (
	"context"

	_ "embed"

	"github.com/nasa/hermes/pkg/host"
)

var (
	_ host.ProfileProvider[Params] = (*otelProvider)(nil)
)

//go:embed schema.json
var schema string

type Params struct {
	Endpoint    string `json:"endpoint"`
	ServiceName string `json:"serviceName"`
	Events      bool   `json:"events"`
	Telemetry   bool   `json:"telemetry"`
}

type otelProvider struct{}

func (o *otelProvider) Default() Params {
	return Params{
		Endpoint:    "localhost:4317",
		ServiceName: "hermes",
		Events:      true,
		Telemetry:   false,
	}
}

func (o *otelProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	return nil
}

func Init() error {
	_, err := host.RegisterProfileProviderWithUiSchema(
		"OpenTelemetry",
		&otelProvider{},
		schema,
		`{"ui:order": ["endpoint", "serviceName", "events", "telemetry"]}`,
	)
	return err
}
