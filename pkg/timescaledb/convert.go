package timescaledb

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	stdtime "time"

	"github.com/jmoiron/sqlx"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/sqldefs"
)

const (
	insertEventSQL = `INSERT INTO events (eventDefId, time, timeSclk, message, source, args, ert)
		VALUES (:eventDefId, :time, :timeSclk, :message, :source, :args, :ert) ON CONFLICT DO NOTHING`
	insertTelemetrySQL = `INSERT INTO telemetry (time, telemetryDefId, timeSclk, source, labels, key, valueType, integral, floating, boolval, string, bytes, ert)
		VALUES (:time, :telemetryDefId, :timeSclk, :source, :labels, :key, :valueType, :integral, :floating, :boolval, :string, :bytes, :ert) ON CONFLICT DO NOTHING`
)

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

func InsertEvent(ctx context.Context, db *sqlx.DB, defs *sqldefs.Cache, msg *pb.SourcedEvent) error {
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

	tx, err := db.BeginTxx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	ref := event.GetRef()
	txDefs := defs.Begin()
	eventDefId, err := txDefs.EventDefID(
		ctx, tx, ref.GetComponent(), ref.GetName(), ref.GetSeverity(), string(defArgs),
	)
	if err != nil {
		return err
	}

	if _, err := tx.NamedExecContext(ctx, insertEventSQL, map[string]any{
		"eventDefId": eventDefId,
		"time":       event.GetTime().GetUnix().AsTime(),
		"timeSclk":   event.GetTime().GetSclk(),
		"message":    event.GetMessage(),
		"source":     msg.GetSource(),
		"args":       string(eventArgs),
		"ert":        stdtime.Now(),
	}); err != nil {
		return fmt.Errorf("failed to insert event: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	// Only now is the def row durable and safe to memoize process-wide.
	txDefs.Publish()
	return nil
}

func InsertTelemetry(ctx context.Context, db *sqlx.DB, defs *sqldefs.Cache, msg *pb.SourcedTelemetry) error {
	tlm := msg.GetTelemetry()
	def := tlm.GetRef()

	labelsByte, err := json.Marshal(tlm.GetLabels())
	if err != nil {
		return fmt.Errorf("failed to marshal telemetry labels: %w", err)
	}

	tx, err := db.BeginTxx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	txDefs := defs.Begin()
	telemetryDefId, err := txDefs.TelemetryDefID(ctx, tx, def.GetComponent(), def.GetName())
	if err != nil {
		return err
	}

	if err := insertValue(ctx, tx, tlm.GetTime(), telemetryDefId, msg.GetSource(), string(labelsByte), "value", tlm.GetValue()); err != nil {
		return fmt.Errorf("failed to insert telemetry value: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	// Only now is the def row durable and safe to memoize process-wide.
	txDefs.Publish()
	return nil
}

func insertValue(ctx context.Context, tx *sqlx.Tx, time *pb.Time, telemetryDefId int64, source string, labels string, path string, value *pb.Value) error {
	var (
		valueType          string
		integral, floating any
		boolval            any
		str                any
		bytes              any
	)

	switch valueTy := value.GetValue().(type) {
	case *pb.Value_I:
		valueType = "int"
		integral = valueTy.I
	case *pb.Value_U:
		valueType = "uint"
		integral = valueTy.U
	case *pb.Value_F:
		valueType = "float"
		floating = valueTy.F
	case *pb.Value_B:
		valueType = "bool"
		boolval = valueTy.B
	case *pb.Value_S:
		valueType = "string"
		str = valueTy.S
	case *pb.Value_E:
		valueType = "enum"
		integral = valueTy.E.Raw
		str = valueTy.E.Formatted
	case *pb.Value_O:
		for key, fieldValue := range valueTy.O.O {
			if err := insertValue(ctx, tx, time, telemetryDefId, source, labels, path+"."+key, fieldValue); err != nil {
				return fmt.Errorf("failed to insert telemetry key %s: %w", key, err)
			}
		}
		return nil
	case *pb.Value_A:
		for i, arrValue := range valueTy.A.GetValue() {
			if err := insertValue(ctx, tx, time, telemetryDefId, source, labels, path+"["+strconv.FormatUint(uint64(i), 10)+"]", arrValue); err != nil {
				return fmt.Errorf("failed to insert telemetry [%d]: %w", i, err)
			}
		}
		return nil
	case *pb.Value_R:
		valueType = "bytes"
		bytes = valueTy.R.Value
	}

	_, err := tx.NamedExecContext(ctx, insertTelemetrySQL, map[string]any{
		"time":           time.GetUnix().AsTime(),
		"telemetryDefId": telemetryDefId,
		"timeSclk":       time.GetSclk(),
		"source":         source,
		"labels":         labels,
		"key":            path,
		"valueType":      valueType,
		"integral":       integral,
		"floating":       floating,
		"boolval":        boolval,
		"string":         str,
		"bytes":          bytes,
		"ert":            stdtime.Now(),
	})
	return err
}
