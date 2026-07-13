package plugin

import (
	"context"
	"database/sql"
	"fmt"
	"net"
	"net/http"
	"strings"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
	"github.com/nasa/hermes-datasource/pkg/models"

	_ "github.com/lib/pq"
)

// Make sure Datasource implements required interfaces. This is important to do
// since otherwise we will only get a not implemented error response from plugin in
// runtime. In this example datasource instance implements backend.QueryDataHandler,
// backend.CheckHealthHandler interfaces. Plugin should not implement all these
// interfaces - only those which are required for a particular task.
var (
	_ backend.QueryDataHandler      = (*Datasource)(nil)
	_ backend.CheckHealthHandler    = (*Datasource)(nil)
	_ instancemgmt.InstanceDisposer = (*Datasource)(nil)
)

// NewDatasource creates a new datasource instance.
func NewDatasource(_ context.Context, settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	config, err := models.LoadPluginSettings(settings)
	if err != nil {
		return nil, fmt.Errorf("unable to load settings")
	}

	host := config.Host
	port := "5432"
	if strings.Contains(host, ":") {
		h, p, err := net.SplitHostPort(host)
		if err == nil {
			host, port = h, p
		}
	}

	connectionString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, config.User, config.Secrets.Password, config.Database)

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return nil, fmt.Errorf("unable to initialize postgres database driver: %w", err)
	}

	ds := &Datasource{
		db:     db,
		config: config,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/telemetry/components", ds.handleGetTelemetryComponents)
	mux.HandleFunc("/telemetry/channels", ds.handleGetTelemetryChannels)
	mux.HandleFunc("/telemetry/sources", ds.handleGetTelemetrySources)
	mux.HandleFunc("/telemetry/keys", ds.handleGetTelemetryKeys)
	mux.HandleFunc("/events/sources", ds.handleGetEventSources)
	ds.CallResourceHandler = httpadapter.New(mux)

	return ds, nil
}

// Datasource is an example datasource which can respond to data queries, reports
// its health and has streaming skills.
type Datasource struct {
	db     *sql.DB
	config *models.PluginSettings
	backend.CallResourceHandler
}

// Dispose here tells plugin SDK that plugin wants to clean up resources when a new instance
// created. As soon as datasource settings change detected by SDK old datasource instance will
// be disposed and a new one will be created using NewSampleDatasource factory function.
func (d *Datasource) Dispose() {
	if d.db != nil {
		_ = d.db.Close()
	}
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (d *Datasource) CheckHealth(ctx context.Context, _ *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	res := &backend.CheckHealthResult{}

	if d.config.Host == "" {
		res.Status = backend.HealthStatusError
		res.Message = "Host configuration parameter is missing"
		return res, nil
	}
	if d.config.Database == "" {
		res.Status = backend.HealthStatusError
		res.Message = "Database configuration parameter is missing"
		return res, nil
	}

	if d.db == nil {
		res.Status = backend.HealthStatusError
		res.Message = "Internal database connection is null"
		return res, nil
	}

	err := d.db.PingContext(ctx)
	if err != nil {
		res.Status = backend.HealthStatusError
		res.Message = fmt.Sprintf("TimescaleDB ping refused: %s", err.Error())
		return res, nil
	}

	return &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: fmt.Sprintf("Successfully connected to database '%s' at '%s'", d.config.Database, d.config.Host),
	}, nil
}
