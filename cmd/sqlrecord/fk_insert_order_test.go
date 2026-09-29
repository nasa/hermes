package main

// A batch containing both a telemetryDefs row and the telemetry rows that reference
// it must commit without violating the foreign key, regardless of Go's randomized
// map iteration order.
//
// Reverting the insertOrder change fails this within ~15 iterations. Worth noting how
// it fails on SQLite: a statement-level constraint failure does not abort the
// transaction, Commit() discards the insert error, and COMMIT succeeds anyway, so the
// value rows are lost with no error returned. The assertion below is on row counts
// rather than the commit error for that reason.

import (
	"fmt"
	"testing"

	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/assert"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func telemetryFor(id int32, name string) *pb.SourcedTelemetry {
	return &pb.SourcedTelemetry{
		Telemetry: &pb.Telemetry{
			Ref: &pb.TelemetryRef{
				Id:        id,
				Name:      name,
				Component: "bigDataComponent",
			},
			Time:  &pb.Time{Unix: timestamppb.Now(), Sclk: 1.0},
			Value: &pb.Value{Value: &pb.Value_U{U: 47}},
		},
		Source: "yamcs",
	}
}

// Each iteration uses a fresh in-memory DB, so the definition row never pre-exists.
// That is precisely the "first sighting of a channel" case the bug fires on.
func TestFKInsertOrderHoldsAcrossMapRandomization(t *testing.T) {
	const iterations = 50

	for i := 0; i < iterations; i++ {
		recorder, err := NewSQLiteRecorder(":memory:", nil)
		assert.NoError(t, err)
		assert.NoError(t, recorder.Initialize())

		tx, err := recorder.StartTransaction()
		assert.NoError(t, err)

		// Several distinct channels in one batch, so tx.inserts holds both
		// telemetryDefs and telemetry and the map has something to shuffle.
		for c := 0; c < 5; c++ {
			name := fmt.Sprintf("Counter%d", c)
			assert.NoError(t, recorder.InsertTelemetry(tx, telemetryFor(int32(1000+c), name)))
		}

		if err := tx.Commit(); err != nil {
			t.Fatalf("iteration %d: commit failed, FK ordering not held: %v", i, err)
		}

		var defs, vals int
		assert.NoError(t, recorder.db.QueryRow("SELECT COUNT(*) FROM telemetryDefs").Scan(&defs))
		assert.NoError(t, recorder.db.QueryRow("SELECT COUNT(*) FROM telemetry").Scan(&vals))

		if defs != 5 || vals != 5 {
			t.Fatalf("iteration %d: expected 5 defs and 5 values, got %d defs and %d values", i, defs, vals)
		}
		recorder.db.Close()
	}
}
