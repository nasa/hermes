package store

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestResolverStableAndPerInstance(t *testing.T) {
	db := migratedDB(t)
	ids := NewResolver()
	ctx := context.Background()

	battery := Definition{Parameter: simParam("BatteryVoltage1"), Type: TypeDouble}
	otherInstance := Definition{Parameter: Parameter{Instance: "simulator2", SpaceSystem: "/YSS/SIMULATOR", Name: "BatteryVoltage1"}, Type: TypeDouble}

	first, err := ids.ID(ctx, db, battery)
	require.NoError(t, err)
	assert.Equal(t, first, ids.ids[battery])

	again, err := ids.ID(ctx, db, battery)
	require.NoError(t, err)
	assert.Equal(t, first, again)
	// A new process has an empty cache and must find the existing row.
	fresh, err := NewResolver().ID(ctx, db, battery)
	require.NoError(t, err)
	assert.Equal(t, first, fresh)

	other, err := ids.ID(ctx, db, otherInstance)
	require.NoError(t, err)
	assert.NotEqual(t, first, other)

	var rows int
	require.NoError(t, db.QueryRow(`SELECT COUNT(*) FROM parameters`).Scan(&rows))
	assert.Equal(t, 2, rows)
}

// A scalar whose type changes in a new dictionary gets a second parameters row,
// and changing back reuses the first.
func TestTypeChangeGetsNewDefinition(t *testing.T) {
	db := migratedDB(t)
	ids := NewResolver()
	ctx := context.Background()
	gen := time.Date(2026, 10, 14, 0, 0, 0, 0, time.UTC)
	a := simParam("A")

	var batch []Row
	for i, v := range []Value{Uint32Value(7), FloatValue(7.5), Uint32Value(8)} {
		batch = append(batch, Row{Parameter: a, GenerationTime: gen.Add(time.Duration(i) * time.Hour), Value: v})
	}
	require.NoError(t, Insert(ctx, db, ids, batch))

	rows, err := db.Query(`SELECT p.value_type, COUNT(*) FROM parameters p
		JOIN parameter_values v ON v.parameter_id = p.id GROUP BY p.id`)
	require.NoError(t, err)
	defer rows.Close()
	values := make(map[string]int)
	for rows.Next() {
		var valueType string
		var n int
		require.NoError(t, rows.Scan(&valueType, &n))
		values[valueType] = n
	}
	require.NoError(t, rows.Err())
	assert.Equal(t, map[string]int{"UINT32": 2, "FLOAT": 1}, values)

	// The startup skip takes the newest time over both rows.
	latest, err := LatestGenerationTimes(ctx, db, "simulator")
	require.NoError(t, err)
	assert.Equal(t, gen.Add(2*time.Hour), latest[a].UTC())
}
