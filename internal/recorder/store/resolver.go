package store

import (
	"context"
	"database/sql"
	"fmt"
	"sync"
)

// Parameter identifies a row of the parameters table. SpaceSystem is the
// qualified name of the containing space system, starting with '/'.
type Parameter struct {
	Instance    string
	SpaceSystem string
	Name        string
}

// DO UPDATE rather than DO NOTHING so the conflict path still returns the id.
const upsertParameterSQL = `INSERT INTO parameters (instance, space_system, name) VALUES ($1, $2, $3)
	ON CONFLICT (instance, space_system, name) DO UPDATE SET name = EXCLUDED.name
	RETURNING id`

// Resolver memoizes parameter ids across transactions. Safe for concurrent
// use. Resolve ids through a per-transaction view from Begin.
type Resolver struct {
	mu  sync.RWMutex
	ids map[Parameter]int32
}

func NewResolver() *Resolver {
	return &Resolver{ids: make(map[Parameter]int32)}
}

func (r *Resolver) get(p Parameter) (int32, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	id, ok := r.ids[p]
	return id, ok
}

// Begin returns a view whose new ids stay staged until Publish. Caching an id
// from a transaction that later rolls back would hand out an id whose row
// does not exist.
func (r *Resolver) Begin() *TxResolver {
	return &TxResolver{parent: r}
}

// TxResolver resolves ids within one transaction. Not safe for concurrent use.
type TxResolver struct {
	parent *Resolver
	staged map[Parameter]int32
}

// ID returns the parameters id for p, inserting the row on first sight.
func (t *TxResolver) ID(ctx context.Context, tx *sql.Tx, p Parameter) (int32, error) {
	if id, ok := t.staged[p]; ok {
		return id, nil
	}
	if id, ok := t.parent.get(p); ok {
		return id, nil
	}

	var id int32
	if err := tx.QueryRowContext(ctx, upsertParameterSQL, p.Instance, p.SpaceSystem, p.Name).Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to resolve parameter %s %s/%s: %w", p.Instance, p.SpaceSystem, p.Name, err)
	}

	if t.staged == nil {
		t.staged = make(map[Parameter]int32)
	}
	t.staged[p] = id
	return id, nil
}

// Publish folds the staged ids into the shared cache. Call it only after the
// transaction has committed.
func (t *TxResolver) Publish() {
	if len(t.staged) == 0 {
		return
	}
	t.parent.mu.Lock()
	defer t.parent.mu.Unlock()
	for p, id := range t.staged {
		t.parent.ids[p] = id
	}
	t.staged = nil
}
