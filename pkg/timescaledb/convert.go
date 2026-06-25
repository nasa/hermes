package timescaledb

import (
	"context"

	timescaledb "database/sql"

	"github.com/nasa/hermes/pkg/pb"
)

func InsertEvent(ctx context.Context, db *timescaledb.DB, msg *pb.SourcedEvent) error {
	return nil // TODO
}

func InsertTelemetry(ctx context.Context, db *timescaledb.DB, msg *pb.SourcedTelemetry) error {
	return nil // TODO
}
