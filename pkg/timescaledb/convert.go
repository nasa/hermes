package timescaledb

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	stdtime "time"

	"github.com/nasa/hermes/pkg/pb"
)

const (
	insertEventDefSQL = `INSERT INTO eventDefs (id, component, name, severity, args)
		VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`
	insertEventSQL = `INSERT INTO events (eventDefId, time, timeSclk, message, source, args, ert)
		VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`
	insertTelemetryDefSQL = `INSERT INTO telemetryDefs (id, name, component)
		VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`
	insertTelemetrySQL = `INSERT INTO telemetry (time, telemetryDefId, timeSclk, source, labels, key, valueType, integral, floating, boolval, string, bytes, ert)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT DO NOTHING`
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

	ref := event.GetRef()
	if _, err := tx.ExecContext(ctx, insertEventDefSQL,
		ref.GetId(), ref.GetComponent(), ref.GetName(), ref.GetSeverity(), string(defArgs),
	); err != nil {
		return fmt.Errorf("failed to insert event def: %w", err)
	}

	if _, err := tx.ExecContext(ctx, insertEventSQL,
		ref.GetId(), event.GetTime().GetUnix().AsTime(), event.GetTime().GetSclk(),
		event.GetMessage(), msg.GetSource(), string(eventArgs), stdtime.Now(),
	); err != nil {
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

	if _, err := tx.ExecContext(ctx, insertTelemetryDefSQL,
		def.GetId(), def.GetName(), def.GetComponent(),
	); err != nil {
		return fmt.Errorf("failed to insert telemetry def: %w", err)
	}

	if err := insertValue(ctx, tx, tlm.GetTime(), def.GetId(), msg.GetSource(), string(labelsByte), "value", tlm.GetValue()); err != nil {
		return fmt.Errorf("failed to insert telemetry value: %w", err)
	}

	return tx.Commit()
}

func insertValue(ctx context.Context, tx *sql.Tx, time *pb.Time, telemetryDefId int32, source string, labels string, path string, value *pb.Value) error {
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

	now := stdtime.Now()
	_, err := tx.ExecContext(ctx, insertTelemetrySQL,
		time.GetUnix().AsTime(), telemetryDefId, time.GetSclk(),
		source, labels, path, valueType,
		integral, floating, boolval, str, bytes, now,
	)
	return err
}
