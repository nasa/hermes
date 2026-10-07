package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/lib/pq"
)

// Row is one leaf of a parameter value. MemberPath is "" for a whole value,
// ".name" for an aggregate member and "[i]" for an array element, combined as
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

// Insert writes rows in one transaction with a single COPY. It first creates
// any parameters rows they need outside that transaction, so those rows stay
// even if the batch fails.
func Insert(ctx context.Context, db *sql.DB, ids *Resolver, rows []Row) error {
	if len(rows) == 0 {
		return nil
	}

	// We resolve ids before opening the transaction. A COPY that starts a new
	// chunk gives the chunk a foreign key referencing parameters, which locks the
	// parameters table. If this transaction had also inserted a parameters row,
	// another recorder inserting the same row would hold its own lock on
	// parameters while it waited for our commit. Our COPY would then wait for it
	// and it for us, and Postgres would abort one of the two transactions.
	paramIDs := make(map[Parameter]int32)
	for _, r := range rows {
		id, err := ids.ID(ctx, db, r.Parameter)
		if err != nil {
			return err
		}
		paramIDs[r.Parameter] = id
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin insert transaction: %w", err)
	}
	defer tx.Rollback()

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
	return nil
}
