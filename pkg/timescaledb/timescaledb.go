package timescaledb

import (
	"context"
	"fmt"

	_ "embed"

	"database/sql"

	_ "github.com/lib/pq"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
)

var (
	_ host.ProfileProvider[Params] = (*timescaleDbProvider)(nil)
)

//go:embed schema.json
var schema string

var uiSchema = `{"ui:order": ["host", "user", "password", "database", "events", "telemetry"]}`

//go:embed schema.sql
var schemaSql string

type Params struct {
	Host      string `json:"host"`
	User      string `json:"user"`
	Password  string `json:"password"`
	Database  string `json:"database"`
	Events    *bool  `json:"events,omitempty"`
	Telemetry *bool  `json:"telemetry,omitempty"`
}

// EventsEnabled reports whether events should be pushed. Profiles saved
// before this option existed have no key and must stay enabled.
func (p Params) EventsEnabled() bool {
	return p.Events == nil || *p.Events
}

// TelemetryEnabled reports whether telemetry should be pushed. Profiles
// saved before this option existed have no key and must stay enabled.
func (p Params) TelemetryEnabled() bool {
	return p.Telemetry == nil || *p.Telemetry
}

type timescaleDbProvider struct{}

// Default implements host.ProfileProvider.
func (i *timescaleDbProvider) Default() Params {
	return Params{
		Host: "localhost:5432",
	}
}

// Start implements host.ProfileProvider
func (t *timescaleDbProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	dsn := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
		settings.User, settings.Password, settings.Host, settings.Database)

	session.Log().Info(
		"connecting to timescaledb endpoint",
		"address",
		dsn,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("failed to open timescaledb connection: %w", err)
	}

	if err := db.PingContext(ctx); err != nil {
		return fmt.Errorf("failed to ping timescaledb: %w", err)
	}

	defer db.Close()

	if _, err := db.ExecContext(ctx, schemaSql); err != nil {
		return fmt.Errorf("failed to execute schema: %w", err)
	}

	session.Started()

	if settings.EventsEnabled() {
		session.Log().Info("creating event bus listener to push to timescaledb")
		host.Event.On(ctx, func(msg *pb.SourcedEvent) {
			if err := InsertEvent(ctx, db, msg); err != nil {
				session.Log().Error("failed to insert event to timescaledb", "err", err)
			}
		})
	} else {
		session.Log().Info("event logging to timescaledb is disabled by profile settings")
	}

	if settings.TelemetryEnabled() {
		session.Log().Info("creating telemetry bus listener to push to timescaledb")
		host.Telemetry.On(ctx, func(msg *pb.SourcedTelemetry) {
			if err := InsertTelemetry(ctx, db, msg); err != nil {
				session.Log().Error("failed to insert telemetry to timescaledb", "err", err)
			}
		})
	} else {
		session.Log().Info("telemetry logging to timescaledb is disabled by profile settings")
	}

	<-ctx.Done()
	return nil
}

func Init() error {
	_, err := host.RegisterProfileProviderWithUiSchema(
		"TimescaleDB",
		&timescaleDbProvider{},
		schema,
		uiSchema,
	)

	if err != nil {
		return err
	}

	return nil
}
