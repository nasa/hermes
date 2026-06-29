package timescaledb

import (
	"context"
	"database/sql"
	"encoding/json"
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
	event := msg.GetEvent()

	eventArgsArray, err := valuesToAnys(event.GetArgs())
	if err != nil {
		return fmt.Errorf("failed to convert event args: %w", err)
	}

	eventArgs, err := json.Marshal(eventArgsArray)
	if err != nil {
		return fmt.Errorf("failed to marshal event args: %w", err)
	}

	defArgs, err := json.Marshal(event.GetRef().GetArguments())
	if err != nil {
		return fmt.Errorf("failed to marshal def args: %w", err)
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	if err := execInsert(ctx, tx, "eventDefs", map[string]any{
		"id":        event.GetRef().GetId(),
		"component": event.GetRef().GetComponent(),
		"name":      event.GetRef().GetName(),
		"severity":  event.GetRef().GetSeverity(),
		"args":      string(defArgs),
	}); err != nil {
		return fmt.Errorf("failed to insert event def: %w", err)
	}

	if err := execInsert(ctx, tx, "events", map[string]any{
		"eventDefId": event.GetRef().GetId(),
		"time":       event.GetTime().GetUnix().AsTime(),
		"timeSclk":   event.GetTime().GetSclk(),
		"message":    event.GetMessage(),
		"source":     msg.GetSource(),
		"args":       string(eventArgs),
	}); err != nil {
		return fmt.Errorf("failed to insert event: %w", err)
	}

	return tx.Commit()
}

func InsertTelemetry(ctx context.Context, db *sql.DB, msg *pb.SourcedTelemetry) error {
	tlm := msg.GetTelemetry()
	def := tlm.GetRef()

	labelsByte, err := json.Marshal(tlm.GetLabels())
	if err != nil {
		return fmt.Errorf("failed to marshal telemetry labels: %w", err)
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	if err := execInsert(ctx, tx, "telemetryDefs", map[string]any{
		"id":        def.GetId(),
		"name":      def.GetName(),
		"component": def.GetComponent(),
	}); err != nil {
		return fmt.Errorf("failed to insert telemetry def: %w", err)
	}

	if err := insertValue(ctx, tx, tlm.GetTime(), def.GetId(), msg.GetSource(), string(labelsByte), "value", tlm.GetValue()); err != nil {
		return fmt.Errorf("failed to insert telemetry value: %w", err)
	}

	return tx.Commit()
}

func insertValue(ctx context.Context, tx *sql.Tx, time *pb.Time, telemetryDefId int32, source string, labels string, path string, value *pb.Value) error {
	telValues := map[string]any{
		"time":           time.GetUnix().AsTime(),
		"telemetryDefId": telemetryDefId,
		"timeSclk":       time.GetSclk(),
		"source":         source,
		"labels":         labels,
		"key":            path,
	}

	var err error
	switch valueTy := value.GetValue().(type) {
	case *pb.Value_I:
		telValues["valueType"] = "int"
		telValues["integral"] = valueTy.I
	case *pb.Value_U:
		telValues["valueType"] = "uint"
		telValues["integral"] = valueTy.U
	case *pb.Value_F:
		telValues["valueType"] = "float"
		telValues["floating"] = valueTy.F
	case *pb.Value_B:
		telValues["valueType"] = "bool"
		telValues["boolval"] = valueTy.B
	case *pb.Value_S:
		telValues["valueType"] = "string"
		telValues["string"] = valueTy.S
	case *pb.Value_E:
		telValues["valueType"] = "enum"
		telValues["integral"] = valueTy.E.Raw
		telValues["string"] = valueTy.E.Formatted
	case *pb.Value_O:
		for key, fieldValue := range valueTy.O.O {
			err = insertValue(ctx, tx, time, telemetryDefId, source, labels, path+"."+key, fieldValue)
			if err != nil {
				return fmt.Errorf("failed to insert telemetry key %s: %w", key, err)
			}
		}
		return nil
	case *pb.Value_A:
		for i, arrValue := range valueTy.A.GetValue() {
			err = insertValue(ctx, tx, time, telemetryDefId, source, labels, path+"["+strconv.FormatUint(uint64(i), 10)+"]", arrValue)
			if err != nil {
				return fmt.Errorf("failed to insert telemetry [%d]: %w", i, err)
			}
		}
		return nil
	case *pb.Value_R:
		telValues["valueType"] = "bytes"
		telValues["bytes"] = valueTy.R.Value
	}

	return execInsert(ctx, tx, "telemetry", telValues)
}
