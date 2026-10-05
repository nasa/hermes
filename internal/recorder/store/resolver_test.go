package store

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestResolverStableAndPerInstance(t *testing.T) {
	db := migratedDB(t)
	ids := NewResolver()
	ctx := context.Background()

	battery := Parameter{Instance: "simulator", SpaceSystem: "/YSS/SIMULATOR", Name: "BatteryVoltage1"}
	otherInstance := Parameter{Instance: "simulator2", SpaceSystem: "/YSS/SIMULATOR", Name: "BatteryVoltage1"}

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
