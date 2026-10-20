package store

import (
	"context"
	"database/sql"
	"fmt"
)

// Parameter is a YAMCS parameter. SpaceSystem is the qualified name of the
// containing space system, starting with '/'.
type Parameter struct {
	Instance    string
	SpaceSystem string
	Name        string
}

// Definition identifies a row of the parameters table: one leaf of a parameter
// and the type of its values.
type Definition struct {
	Parameter
	MemberPath string
	Type       ValueType
}

// DO UPDATE ... RETURNING id would save the SELECT below, but it locks the
// existing row, so it would wait for any uncommitted COPY whose rows reference
// that row.
const insertDefinitionSQL = `INSERT INTO parameters (instance, space_system, name, member_path, value_type)
	VALUES ($1, $2, $3, $4, $5)
	ON CONFLICT (instance, space_system, name, member_path, value_type) DO NOTHING`

const definitionIDSQL = `SELECT id FROM parameters
	WHERE instance = $1 AND space_system = $2 AND name = $3 AND member_path = $4 AND value_type = $5`

// Resolver caches parameter ids. Not safe for concurrent use.
type Resolver struct {
	ids map[Definition]int32
}

func NewResolver() *Resolver {
	return &Resolver{ids: make(map[Definition]int32)}
}

// ID returns d's id in the parameters table, adding the row if it isn't there
// yet. We run the INSERT and SELECT on db rather than in a transaction, so the
// row is committed before we cache its id. If we cached the id of a row that
// later rolled back, every later batch with rows for d would fail the foreign
// key check.
func (r *Resolver) ID(ctx context.Context, db *sql.DB, d Definition) (int32, error) {
	if id, ok := r.ids[d]; ok {
		return id, nil
	}
	args := []any{d.Instance, d.SpaceSystem, d.Name, d.MemberPath, string(d.Type)}
	if _, err := db.ExecContext(ctx, insertDefinitionSQL, args...); err != nil {
		return 0, fmt.Errorf("failed to insert parameter %s %s/%s%s %s: %w", d.Instance, d.SpaceSystem, d.Name, d.MemberPath, d.Type, err)
	}
	var id int32
	if err := db.QueryRowContext(ctx, definitionIDSQL, args...).Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to resolve parameter %s %s/%s%s %s: %w", d.Instance, d.SpaceSystem, d.Name, d.MemberPath, d.Type, err)
	}
	r.ids[d] = id
	return id, nil
}
