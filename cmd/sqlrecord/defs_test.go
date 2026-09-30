package main

import (
	"testing"

	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func telemetryFor(component, name string, value int64) *pb.SourcedTelemetry {
	return &pb.SourcedTelemetry{
		Source: "test-fsw",
		Telemetry: &pb.Telemetry{
			// No id: this is what a provider building refs from string names
			// (an F Prime telemetry packet) produces.
			Ref: &pb.TelemetryRef{
				Component: component,
				Name:      name,
			},
			Time:  &pb.Time{Sclk: 1},
			Value: &pb.Value{Value: &pb.Value_I{I: value}},
		},
	}
}

// Every id-less ref used to write telemetryDefs.id = 0, and ON CONFLICT DO
// NOTHING collapsed all of them onto a single row, so an entire mission's
// telemetry was attributed to whichever channel arrived first.
func TestDistinctChannelsGetDistinctDefs(t *testing.T) {
	recorder, err := NewSQLiteRecorder(":memory:", nil)
	require.NoError(t, err)
	require.NoError(t, recorder.Initialize())

	channels := []struct{ component, name string }{
		{"mot", "MotTlmHstReqStart"},
		{"cmdDisp", "CommandsDispatched"},
		{"mot", "MotTlmHstReqEnd"},
		// Same name under a different component must not alias.
		{"cmdDisp", "MotTlmHstReqStart"},
	}

	tx, err := recorder.StartTransaction()
	require.NoError(t, err)
	for i, c := range channels {
		require.NoError(t, recorder.InsertTelemetry(tx, telemetryFor(c.component, c.name, int64(i))))
	}
	require.NoError(t, tx.Commit())

	var defCount int
	require.NoError(t, recorder.db.QueryRow("SELECT COUNT(*) FROM telemetryDefs").Scan(&defCount))
	assert.Equal(t, len(channels), defCount, "each channel needs its own def row")

	// No def may be left at 0, and every telemetry row must join back to the
	// component/name it was emitted under.
	rows, err := recorder.db.Query(`
		SELECT d.component, d.name, d.id, t.integral
		FROM telemetry t JOIN telemetryDefs d ON t.telemetryDefId = d.id`)
	require.NoError(t, err)
	defer rows.Close()

	got := map[string]int64{}
	for rows.Next() {
		var component, name string
		var defId, value int64
		require.NoError(t, rows.Scan(&component, &name, &defId, &value))
		assert.NotZero(t, defId, "def id must be database-assigned, not 0")
		got[component+"."+name] = value
	}
	require.NoError(t, rows.Err())

	assert.Equal(t, map[string]int64{
		"mot.MotTlmHstReqStart":      0,
		"cmdDisp.CommandsDispatched": 1,
		"mot.MotTlmHstReqEnd":        2,
		"cmdDisp.MotTlmHstReqStart":  3,
	}, got)
}

// Re-emitting a channel must reuse its def rather than create a second one,
// both within a transaction and across transactions (where the answer comes
// from the published cache instead of the database).
func TestRepeatedChannelReusesDef(t *testing.T) {
	recorder, err := NewSQLiteRecorder(":memory:", nil)
	require.NoError(t, err)
	require.NoError(t, recorder.Initialize())

	for range 3 {
		tx, err := recorder.StartTransaction()
		require.NoError(t, err)
		for range 2 {
			require.NoError(t, recorder.InsertTelemetry(tx, telemetryFor("mot", "Voltage", 7)))
		}
		require.NoError(t, tx.Commit())
	}

	var defCount, telCount int
	require.NoError(t, recorder.db.QueryRow("SELECT COUNT(*) FROM telemetryDefs").Scan(&defCount))
	require.NoError(t, recorder.db.QueryRow("SELECT COUNT(*) FROM telemetry").Scan(&telCount))

	assert.Equal(t, 1, defCount)
	assert.Equal(t, 6, telCount)
}

// A rolled-back transaction must not leave its def ids in the shared cache:
// the rows are gone, so a cached id would dangle and fail the foreign key on
// every subsequent insert for that channel.
func TestRollbackDoesNotPoisonDefCache(t *testing.T) {
	recorder, err := NewSQLiteRecorder(":memory:", nil)
	require.NoError(t, err)
	require.NoError(t, recorder.Initialize())

	tx, err := recorder.StartTransaction()
	require.NoError(t, err)
	require.NoError(t, recorder.InsertTelemetry(tx, telemetryFor("mot", "Current", 1)))

	// Abandon the transaction without committing.
	sqlTx, ok := tx.(*SQLTx)
	require.True(t, ok)
	require.NoError(t, sqlTx.tx.Rollback())

	// The same channel again, in a fresh transaction. If the rolled-back id had
	// been cached, this would reference a def row that no longer exists.
	tx, err = recorder.StartTransaction()
	require.NoError(t, err)
	require.NoError(t, recorder.InsertTelemetry(tx, telemetryFor("mot", "Current", 2)))
	require.NoError(t, tx.Commit())

	var joined int
	require.NoError(t, recorder.db.QueryRow(`
		SELECT COUNT(*) FROM telemetry t
		JOIN telemetryDefs d ON t.telemetryDefId = d.id
		WHERE d.component = 'mot' AND d.name = 'Current'`).Scan(&joined))
	assert.Equal(t, 1, joined, "telemetry must resolve to a def that actually exists")
}
