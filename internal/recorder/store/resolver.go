package store

import (
	"context"
	"database/sql"
	"fmt"
)

// Parameter identifies a row of the parameters table. SpaceSystem is the
// qualified name of the containing space system, starting with '/'.
type Parameter struct {
	Instance    string
	SpaceSystem string
	Name        string
}

// DO UPDATE ... RETURNING id would save the SELECT below, but it locks the
// existing row, so it would wait for any uncommitted COPY whose rows reference
// that row.
const insertParameterSQL = `INSERT INTO parameters (instance, space_system, name) VALUES ($1, $2, $3)
	ON CONFLICT (instance, space_system, name) DO NOTHING`

const parameterIDSQL = `SELECT id FROM parameters WHERE instance = $1 AND space_system = $2 AND name = $3`

// Resolver caches parameter ids. Not safe for concurrent use.
type Resolver struct {
	ids map[Parameter]int32
}

func NewResolver() *Resolver {
	return &Resolver{ids: make(map[Parameter]int32)}
}

// ID returns p's id in the parameters table, adding the row if it isn't there
// yet. We run the INSERT and SELECT on db rather than in a transaction, so the
// row is committed before we cache its id. If we cached the id of a row that
// later rolled back, every later batch with rows for p would fail the foreign
// key check.
func (r *Resolver) ID(ctx context.Context, db *sql.DB, p Parameter) (int32, error) {
	if id, ok := r.ids[p]; ok {
		return id, nil
	}
	if _, err := db.ExecContext(ctx, insertParameterSQL, p.Instance, p.SpaceSystem, p.Name); err != nil {
		return 0, fmt.Errorf("failed to insert parameter %s %s/%s: %w", p.Instance, p.SpaceSystem, p.Name, err)
	}
	var id int32
	if err := db.QueryRowContext(ctx, parameterIDSQL, p.Instance, p.SpaceSystem, p.Name).Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to resolve parameter %s %s/%s: %w", p.Instance, p.SpaceSystem, p.Name, err)
	}
	r.ids[p] = id
	return id, nil
}
