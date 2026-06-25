package timescaledb

import (
	"context"

	_ "embed"

	"github.com/nasa/hermes/pkg/host"
)

var (
	_ host.ProfileProvider[Params] = (*timescaleDbProvider)(nil)
)

//go:embed schema.json
var schema string

type Params struct {
	Url string `json:"url"`

	DefaultTags []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	} `json:"defaultTags"`

	Password string `json:"password"`
	Database string `json:"database"`
	Ert      bool   `json:"ert"`
}

type timescaleDbProvider struct{}

// Default implements host.ProfileProvider.
func (i *timescaleDbProvider) Default() Params {
	return Params{}
}

func (i *timescaleDbProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	// TODO Start
	return nil
}

func Init() error {
	_, err := host.RegisterProfileProviderWithUiSchema(
		"TimescaleDB",
		&timescaleDbProvider{},
		schema,
		`{"ui:order": ["url", "password", "database", "defaultTags", "ert"]}`,
	)

	if err != nil {
		return err
	}

	return nil
}
