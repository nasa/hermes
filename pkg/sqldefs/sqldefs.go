// Package sqldefs resolves the surrogate primary keys of the telemetryDefs and
// eventDefs tables from a (component, name) pair.
//
// Refs arriving on the message busses carry no numeric id: providers that build
// them from string names (F Prime telemetry packets) have nothing to put there.
// So the def tables' SERIAL ids are allocated by the database and looked up
// here, keyed by the only thing every provider does supply.
//
// Lookups are memoized. A mission emits the same few thousand channels over and
// over, so after warmup resolution costs no round trip at all.
package sqldefs

import (
	"context"
	"database/sql"
	"fmt"
	"sync"
)

// rowQuerier is satisfied by *sql.Tx and *sqlx.Tx.
//
// Resolution deliberately runs inside the caller's transaction rather than on
// the database handle: the SQLite recorder caps the pool at a single
// connection, so reaching for a second one while the transaction holds the
// first deadlocks.
type rowQuerier interface {
	QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row
}

// Queries holds the dialect-specific def upserts. Both must return the def's
// id, on the insert path and on the already-exists path alike.
type Queries struct {
	// UpsertTelemetryDef takes (name, component).
	UpsertTelemetryDef string
	// UpsertEventDef takes (component, name, severity, args).
	UpsertEventDef string
}

// DO UPDATE rather than DO NOTHING: DO NOTHING returns zero rows when the def
// already exists, which would make RETURNING useless and force a second query.
// Assigning a column to itself is the cheapest way to make the conflict path
// still produce a row.
var Postgres = Queries{
	UpsertTelemetryDef: `INSERT INTO telemetryDefs (name, component) VALUES ($1, $2)
		ON CONFLICT (name, component) DO UPDATE SET name = EXCLUDED.name
		RETURNING id`,
	UpsertEventDef: `INSERT INTO eventDefs (component, name, severity, args) VALUES ($1, $2, $3, $4)
		ON CONFLICT (component, name) DO UPDATE SET severity = EXCLUDED.severity, args = EXCLUDED.args
		RETURNING id`,
}

var SQLite = Queries{
	UpsertTelemetryDef: `INSERT INTO telemetryDefs (name, component) VALUES (?, ?)
		ON CONFLICT (name, component) DO UPDATE SET name = excluded.name
		RETURNING id`,
	UpsertEventDef: `INSERT INTO eventDefs (component, name, severity, args) VALUES (?, ?, ?, ?)
		ON CONFLICT (component, name) DO UPDATE SET severity = excluded.severity, args = excluded.args
		RETURNING id`,
}

// Cache memoizes def ids by (component, name) across transactions. Safe for
// concurrent use. Obtain a per-transaction view with Begin.
type Cache struct {
	queries Queries

	mu        sync.RWMutex
	telemetry map[string]int64
	events    map[string]int64
}

func New(queries Queries) *Cache {
	return &Cache{
		queries:   queries,
		telemetry: make(map[string]int64),
		events:    make(map[string]int64),
	}
}

// key uses a NUL separator so a component containing the separator character
// cannot collide with a different (component, name) split.
func key(component, name string) string {
	return component + "\x00" + name
}

func (c *Cache) get(events bool, k string) (int64, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	if events {
		id, ok := c.events[k]
		return id, ok
	}
	id, ok := c.telemetry[k]
	return id, ok
}

// Begin returns a transaction-scoped view of the cache.
//
// Ids it resolves are staged locally and only folded into the shared cache when
// the caller reports a successful commit via Publish. Caching them any earlier
// would be unsound: if the transaction rolled back, the def row would not
// exist, and every later insert for that channel would fail the foreign key
// against a cached id that went away.
func (c *Cache) Begin() *TxCache {
	return &TxCache{parent: c}
}

// TxCache resolves def ids within a single transaction. Not safe for concurrent
// use — a transaction belongs to one goroutine.
type TxCache struct {
	parent *Cache

	// Staged on first resolution, published on commit. Nil until used, since
	// most transactions touch only already-cached defs.
	telemetry map[string]int64
	events    map[string]int64
}

// TelemetryDefID returns the telemetryDefs id for a channel, inserting the def
// if this is the first time it has been seen.
func (t *TxCache) TelemetryDefID(ctx context.Context, tx rowQuerier, component, name string) (int64, error) {
	return t.resolve(ctx, tx, false, component, name, nil)
}

// EventDefID returns the eventDefs id for an event, inserting the def if this
// is the first time it has been seen.
//
// Because the result is memoized, severity and args are only written on first
// sight within a process. Reloading a dictionary mid-run will not rewrite them
// — the same was true before, when the insert used ON CONFLICT DO NOTHING.
func (t *TxCache) EventDefID(
	ctx context.Context,
	tx rowQuerier,
	component, name string,
	severity any,
	args string,
) (int64, error) {
	return t.resolve(ctx, tx, true, component, name, []any{component, name, severity, args})
}

func (t *TxCache) resolve(
	ctx context.Context,
	tx rowQuerier,
	events bool,
	component, name string,
	eventArgs []any,
) (int64, error) {
	k := key(component, name)

	staged := t.telemetry
	if events {
		staged = t.events
	}
	if id, ok := staged[k]; ok {
		return id, nil
	}
	if id, ok := t.parent.get(events, k); ok {
		return id, nil
	}

	query := t.parent.queries.UpsertTelemetryDef
	args := []any{name, component}
	kind := "telemetry"
	if events {
		query = t.parent.queries.UpsertEventDef
		args = eventArgs
		kind = "event"
	}

	var id int64
	if err := tx.QueryRowContext(ctx, query, args...).Scan(&id); err != nil {
		return 0, fmt.Errorf("failed to resolve %s def %s.%s: %w", kind, component, name, err)
	}

	if events {
		if t.events == nil {
			t.events = make(map[string]int64)
		}
		t.events[k] = id
	} else {
		if t.telemetry == nil {
			t.telemetry = make(map[string]int64)
		}
		t.telemetry[k] = id
	}

	return id, nil
}

// Publish folds this transaction's resolutions into the shared cache. Call it
// only after the transaction has committed successfully.
func (t *TxCache) Publish() {
	if t.telemetry == nil && t.events == nil {
		return
	}

	t.parent.mu.Lock()
	defer t.parent.mu.Unlock()

	for k, id := range t.telemetry {
		t.parent.telemetry[k] = id
	}
	for k, id := range t.events {
		t.parent.events[k] = id
	}

	t.telemetry = nil
	t.events = nil
}
