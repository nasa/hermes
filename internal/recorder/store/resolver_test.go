package store

import (
	"context"
	"database/sql"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func resolveCommitted(t *testing.T, db *sql.DB, ids *Resolver, p Parameter) int32 {
	t.Helper()
	ctx := context.Background()
	tx, err := db.BeginTx(ctx, nil)
	require.NoError(t, err)
	defer tx.Rollback()

	txIDs := ids.Begin()
	id, err := txIDs.ID(ctx, tx, p)
	require.NoError(t, err)
	again, err := txIDs.ID(ctx, tx, p)
	require.NoError(t, err)
	assert.Equal(t, id, again)

	require.NoError(t, tx.Commit())
	txIDs.Publish()
	return id
}

func TestResolverStableAndPerInstance(t *testing.T) {
	db := migratedDB(t)
	ids := NewResolver()

	battery := Parameter{Instance: "simulator", SpaceSystem: "/YSS/SIMULATOR", Name: "BatteryVoltage1"}
	otherInstance := Parameter{Instance: "simulator2", SpaceSystem: "/YSS/SIMULATOR", Name: "BatteryVoltage1"}

	first := resolveCommitted(t, db, ids, battery)
	cached, ok := ids.get(battery)
	require.True(t, ok)
	assert.Equal(t, first, cached)

	assert.Equal(t, first, resolveCommitted(t, db, ids, battery))
	// A new process has an empty cache and must find the existing row.
	assert.Equal(t, first, resolveCommitted(t, db, NewResolver(), battery))

	other := resolveCommitted(t, db, ids, otherInstance)
	assert.NotEqual(t, first, other)

	var rows int
	require.NoError(t, db.QueryRow(`SELECT COUNT(*) FROM parameters`).Scan(&rows))
	assert.Equal(t, 2, rows)
}

func TestResolverDoesNotCacheRolledBackIds(t *testing.T) {
	db := migratedDB(t)
	ids := NewResolver()
	ctx := context.Background()
	p := Parameter{Instance: "simulator", SpaceSystem: "/YSS/SIMULATOR", Name: "Mode"}

	tx, err := db.BeginTx(ctx, nil)
	require.NoError(t, err)
	txIDs := ids.Begin()
	_, err = txIDs.ID(ctx, tx, p)
	require.NoError(t, err)
	require.NoError(t, tx.Rollback())

	_, ok := ids.get(p)
	assert.False(t, ok)

	id := resolveCommitted(t, db, ids, p)
	var name string
	require.NoError(t, db.QueryRow(`SELECT name FROM parameters WHERE id = $1`, id).Scan(&name))
	assert.Equal(t, "Mode", name)
}
