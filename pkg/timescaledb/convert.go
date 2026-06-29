package timescaledb

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"
	"strings"

	"github.com/nasa/hermes/pkg/pb"
)

func execInsert(ctx context.Context, tx *sql.Tx, table string, values map[string]any) error {
	cols := make([]string, 0, len(values))
	vals := make([]any, 0, len(values))
	placeholders := make([]string, 0, len(values))
	i := 1
	for col, val := range values {
		cols = append(cols, col)
		vals = append(vals, val)
		placeholders = append(placeholders, "$"+strconv.Itoa(i))
		i++
	}
	query := "INSERT INTO " + table +
		" (" + strings.Join(cols, ", ") + ")" +
		" VALUES (" + strings.Join(placeholders, ", ") + ")" +
		" ON CONFLICT DO NOTHING"
	_, err := tx.ExecContext(ctx, query, vals...)
	return err
}

func valuesToAnys(values []*pb.Value) ([]any, error) {
	valueAnys := make([]any, len(values))
	for i, arg := range values {
		valueAny, err := pb.ValueToAny(arg, pb.ConversionOptions{})
		if err != nil {
			return nil, fmt.Errorf("failed to convert event args: %w", err)
		}
		valueAnys[i] = valueAny
	}
	return valueAnys, nil
}

func InsertEvent(ctx context.Context, db *sql.DB, msg *pb.SourcedEvent) error {
	return nil // TODO
}

func InsertTelemetry(ctx context.Context, db *sql.DB, msg *pb.SourcedTelemetry) error {
	return nil // TODO
}
