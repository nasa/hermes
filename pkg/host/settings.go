package host

import (
	"fmt"
	"io"

	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/pelletier/go-toml/v2"
)

var _settings = map[string]any{}
var _settingsCallbacks = []struct {
	sectionName string
	callback    func() error
}{}

type registerSettingsOption func(string)

// Call a function after the configuration successfully loads into the host
// This is not called if there was a TOML configuration decoding error
func WithCallback(cb func() error) registerSettingsOption {
	return func(sectionName string) {
		_settingsCallbacks = append(_settingsCallbacks, struct {
			sectionName string
			callback    func() error
		}{
			sectionName: sectionName,
			callback:    cb,
		})
	}
}

// Register a new settings field to the host configuration
// Usually points to a static structure within the module consuming the configuration
func RegisterSettings[T any](
	sectionName string,
	settings *T,
	options ...registerSettingsOption,
) {
	_settings[sectionName] = settings
	for _, opt := range options {
		opt(sectionName)
	}
}

var Config = struct {
	DownlinkRoot   string `json:"downlinkRoot" toml:"downlink-root" comment:"Path to store files downlinked from connected sources"`
	RootPath       string `json:"rootPath" toml:"root-path" comment:"Root path to load profile configuration and dictionaries from"`
	BindType       string `json:"bindType" toml:"bind-type" comment:"Bind type gRPC. Options: 'tcp', 'tcp4', 'tcp6', 'unix' or 'unixpacket'"`
	BindAddress    string `json:"bindAddress" toml:"bind-address" comment:"Bind gRPC service to this address"`
	StartProfiles  bool   `json:"startProfiles" toml:"start-profiles" comment:"Start all profiles on backend startup"`
	OtelExport     *bool  `json:"otelExport" toml:"otel-export" comment:"Export logs, metrics, & traces to an OpenTelemetry gRPC Collector"`
	EventAsOtel    bool   `json:"eventAsOtel" toml:"event-as-otel" comment:"Export flight-software emitted events as OpenTelemetry logs records"`
	ChannelAsOtel  bool   `json:"channelAsOtel" toml:"channel-as-otel" comment:"Export flight-software emitted channelized telemetry (numeric only) as OpenTelemetry metrics.\nNote: This logs all datapoints using wall-clock time instead of flight-software time"`
	DownlinkAsOtel bool   `json:"downlinkAsOtel" toml:"downlink-as-otel" comment:"Export file downlink events as OpenTelemetry log records"`
	UseErt         *bool  `json:"useErt" toml:"use-ert" comment:"Export OpenTelemetry channels and events using Earth-Return-Time instead of FSW time"`
}{
	DownlinkRoot:   ".",
	RootPath:       ".",
	BindType:       "tcp",
	BindAddress:    "localhost:6880",
	StartProfiles:  false,
	OtelExport:     &infra.OtelExport,
	EventAsOtel:    true,
	ChannelAsOtel:  true,
	DownlinkAsOtel: true,
	UseErt:         &pb.UseErt,
}

func init() {
	RegisterSettings("host", &Config)
}

// Generate a TOML configuration by dumping out the current settings
// to the given writer
func GenerateConfiguration(w io.Writer) error {
	return toml.NewEncoder(w).Encode(_settings)
}

func runSettingsCallbacks() error {
	var err error
	for _, cb := range _settingsCallbacks {
		err = cb.callback()
		if err != nil {
			return fmt.Errorf("failed to process configuration [%s]: %w", cb.sectionName, err)
		}
	}

	return nil
}

func LoadConfiguration(r io.Reader) error {
	err := toml.NewDecoder(r).Decode(&_settings)
	if err != nil {
		return err
	}

	return runSettingsCallbacks()
}

func DefaultConfiguration() error {
	return runSettingsCallbacks()
}
