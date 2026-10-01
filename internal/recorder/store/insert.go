package store

import (
	"cmp"
	"context"
	"database/sql"
	"fmt"
	"maps"
	"slices"
	"time"

	"github.com/lib/pq"
)

// Row is one leaf of a parameter value. MemberPath is "" for a whole value,
// ".name" for a struct member and "[i]" for an array element, combined as
// needed ("[0].x").
type Row struct {
	Parameter       Parameter
	MemberPath      string
	GenerationTime  time.Time
	AcquisitionTime sql.NullTime
	Value           Value
}

var copyColumns = []string{
	"parameter_id", "member_path", "generation_time", "acquisition_time", "value_type",
	"int_value", "float_value", "bool_value", "string_value", "binary_value",
}

// Insert writes rows in one transaction with a single COPY, creating any
// parameters rows they need. Ids are cached in ids only once the transaction
// commits.
func Insert(ctx context.Context, db *sql.DB, ids *Resolver, rows []Row) error {
	if len(rows) == 0 {
		return nil
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin insert transaction: %w", err)
	}
	defer tx.Rollback()

	paramIDs := make(map[Parameter]int32)
	for _, r := range rows {
		paramIDs[r.Parameter] = 0
	}
	// A fixed order keeps two writers from locking the same parameters rows
	// in opposite orders.
	params := slices.SortedFunc(maps.Keys(paramIDs), func(a, b Parameter) int {
		return cmp.Or(
			cmp.Compare(a.Instance, b.Instance),
			cmp.Compare(a.SpaceSystem, b.SpaceSystem),
			cmp.Compare(a.Name, b.Name),
		)
	})
	txIDs := ids.Begin()
	for _, p := range params {
		id, err := txIDs.ID(ctx, tx, p)
		if err != nil {
			return err
		}
		paramIDs[p] = id
	}

	stmt, err := tx.PrepareContext(ctx, pq.CopyIn("parameter_values", copyColumns...))
	if err != nil {
		return fmt.Errorf("failed to start copy: %w", err)
	}
	defer stmt.Close()

	for _, r := range rows {
		v := r.Value
		// A nil []byte reaches lib/pq as an empty bytea, not NULL.
		var binary any
		if v.Binary != nil {
			binary = v.Binary
		}
		if _, err := stmt.ExecContext(ctx,
			paramIDs[r.Parameter], r.MemberPath, r.GenerationTime, r.AcquisitionTime, string(v.Type),
			v.Int, v.Float, v.Bool, v.String, binary,
		); err != nil {
			return fmt.Errorf("failed to copy parameter value: %w", err)
		}
	}
	// Server-side COPY errors may not surface until this final flush.
	if _, err := stmt.ExecContext(ctx); err != nil {
		return fmt.Errorf("failed to copy parameter values: %w", err)
	}
	if err := stmt.Close(); err != nil {
		return fmt.Errorf("failed to end copy: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit parameter values: %w", err)
	}
	txIDs.Publish()
	return nil
}
