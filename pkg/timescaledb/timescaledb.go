package timescaledb

import (
	"context"
	"fmt"

	_ "embed"

	timescaledb "database/sql"

	_ "github.com/lib/pq"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
)

var (
	_ host.ProfileProvider[Params] = (*timescaleDbProvider)(nil)
)

//go:embed schema.json
var schema string

//go:embed schema.sql
var schemaSql string

type Params struct {
	Url string `json:"url"`
	Ert bool   `json:"ert"`

	// TODO: Add more parameters
}

type timescaleDbProvider struct{}

// Default implements host.ProfileProvider.
func (i *timescaleDbProvider) Default() Params {
	return Params{}
}

// Start implements host.ProfileProvider
func (t *timescaleDbProvider) Start(
	ctx context.Context,
	settings Params,
	session host.ConnectSession,
) error {
	session.Log().Info(
		"connecting to timescaledb endpoint",
		"address",
		settings.Url,
	)

	db, err := timescaledb.Open("postgres", settings.Url)
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

	session.Log().Info("creating event bus listener to push to timescaledb")
	host.Event.On(ctx, func(msg *pb.SourcedEvent) {
		if err := InsertEvent(ctx, db, msg); err != nil {
			session.Log().Error("failed to insert event to timescaledb", "err", err)
		}
	})

	session.Log().Info("creating telemetry bus listener to push to timescaledb")
	host.Telemetry.On(ctx, func(msg *pb.SourcedTelemetry) {
		if err := InsertTelemetry(ctx, db, msg); err != nil {
			session.Log().Error("failed to insert telemetry to timescaledb", "err", err)
		}
	})

	<-ctx.Done()
	return nil
}
