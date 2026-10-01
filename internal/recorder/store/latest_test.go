package store

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestLatestGenerationTimes(t *testing.T) {
	db := migratedDB(t)
	ids := NewResolver()
	ctx := context.Background()
	day := time.Date(2026, 9, 1, 0, 0, 0, 0, time.UTC)

	scalar := simParam("Scalar")
	member := simParam("Struct")
	other := Parameter{Instance: "simulator2", SpaceSystem: "/YSS/SIMULATOR", Name: "Scalar"}
	noValues := simParam("NoValues")

	var rows []Row
	// Two days, so two chunks.
	for i := range 3 {
		rows = append(rows, Row{Parameter: scalar, GenerationTime: day.Add(time.Duration(i) * 20 * time.Hour), Value: DoubleValue(1)})
	}
	for i := range 2 {
		for _, path := range []string{".a", ".b"} {
			rows = append(rows, Row{Parameter: member, MemberPath: path, GenerationTime: day.Add(time.Duration(i) * time.Hour), Value: DoubleValue(1)})
		}
	}
	rows = append(rows, Row{Parameter: other, GenerationTime: day.Add(72 * time.Hour), Value: DoubleValue(1)})
	require.NoError(t, Insert(ctx, db, ids, rows))
	resolveCommitted(t, db, ids, noValues)

	got, err := LatestGenerationTimes(ctx, db, "simulator")
	require.NoError(t, err)
	for p, ts := range got {
		got[p] = ts.UTC()
	}
	assert.Equal(t, map[Parameter]time.Time{
		scalar: day.Add(40 * time.Hour),
		member: day.Add(time.Hour),
	}, got)

	got, err = LatestGenerationTimes(ctx, db, "unknown")
	require.NoError(t, err)
	assert.Empty(t, got)
}
