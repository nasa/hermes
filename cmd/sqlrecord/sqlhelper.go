package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
)

type SQLTx struct {
	tx        *sql.Tx
	templates SQLTemplates
	inserts   map[string][]map[string]any
}

func NewSQLTx(db *sql.DB, templates SQLTemplates) (*SQLTx, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}
	return &SQLTx{
		tx:        tx,
		templates: templates,
		inserts:   make(map[string][]map[string]any),
	}, nil
}

func (tx *SQLTx) Insert(table string, values map[string]any) {
	if _, ok := tx.inserts[table]; !ok {
		tx.inserts[table] = make([]map[string]any, 0, 1)
	}
	tx.inserts[table] = append(tx.inserts[table], values)
}

const MAX_PLACEHOLDERS uint64 = 65535

func (tx *SQLTx) buildInsert(table string, values []map[string]any) error {
	// collect all columnIndicies present in the query
	columnIndicies := make(map[string]int)
	i := 0
	for _, r := range values {
		for c := range r {
			if _, ok := columnIndicies[c]; !ok {
				columnIndicies[c] = i
				i++
			}
		}
	}
	columnNames := make([]string, len(columnIndicies))
	for c, i := range columnIndicies {
		columnNames[i] = c
	}
	rowsStrs := make([]string, 0, len(values))
	var placeholderIdx uint64 = 1
valuesLoop:
	for i, row := range values {
		rowValsStr := make([]string, 0, len(row))
		for range columnNames {

			if placeholderIdx > MAX_PLACEHOLDERS {
				tx.buildInsert(table, values[i:])
				break valuesLoop
			}
			rowValsStr = append(rowValsStr, tx.templates.PlaceholderFormatter(placeholderIdx))
			placeholderIdx++
		}
		rowsStrs = append(rowsStrs, "("+strings.Join(rowValsStr, ", ")+")")
	}
	valuesMatrix := make([][]any, len(rowsStrs))
	for i, vs := range values {
		valuesMatrix[i] = make([]any, len(columnNames))
		for c, v := range vs {
			valuesMatrix[i][columnIndicies[c]] = v
		}
	}
	query := "INSERT INTO " + table + " (" + strings.Join(columnNames, ", ") + ") VALUES " + strings.Join(rowsStrs, ", ") + " ON CONFLICT DO NOTHING;"
	valuesFlat := make([]any, 0, len(rowsStrs)*len(columnNames))
	for _, row := range valuesMatrix {
		valuesFlat = append(valuesFlat, row...)
	}
	if _, err := tx.tx.Exec(query, valuesFlat...); err != nil {
		return err
	}

	return nil
}

func (tx *SQLTx) Commit() error {
	for table, values := range tx.inserts {
		tx.buildInsert(table, values)
	}

	return tx.tx.Commit()
}

type SQLTemplates struct {
	CreateEventDefs      string
	CreateEvents         string
	CreateTelemetryDefs  string
	CreateTelemetries    string
	TimeConverter        func(time.Time) any
	PlaceholderFormatter func(uint64) string
}

func (t *SQLTemplates) CreateTables(db *sql.DB, log log.Logger, extraColumn *ExtraColumn) error {
	log.Debug("creating eventDefs table")
	_, err := db.Exec(t.CreateEventDefs)
	if err != nil {
		return fmt.Errorf("failed to create event defs table in database: %w", err)
	}

	var eventsQuery string
	if extraColumn != nil {
		eventsQuery = fmt.Sprintf(t.CreateEvents, extraColumn.name+" "+extraColumn.type_+",")
	} else {
		eventsQuery = fmt.Sprintf(t.CreateEvents, "")
	}

	log.Debug("creating events table")
	_, err = db.Exec(eventsQuery)
	if err != nil {
		return fmt.Errorf("failed to create event table in database: %w", err)
	}

	log.Debug("creating telemetryDefs table")
	_, err = db.Exec(t.CreateTelemetryDefs)
	if err != nil {
		return fmt.Errorf("failed to create telmetry defs table in database: %w", err)
	}

	var telemetryQuery string
	if extraColumn != nil {
		telemetryQuery = fmt.Sprintf(t.CreateTelemetries, extraColumn.name+" "+extraColumn.type_+",")
	} else {
		telemetryQuery = fmt.Sprintf(t.CreateTelemetries, "")
	}

	log.Debug("creating telemetry table")
	_, err = db.Exec(telemetryQuery)
	if err != nil {
		return fmt.Errorf("failed to create telemetry table in database: %w", err)
	}

	return nil
}

func (t *SQLTemplates) InsertEvent(tx Tx, srcEvent *pb.SourcedEvent, extraColumn *ExtraColumn) error {
	event := srcEvent.GetEvent()

	eventArgsArray, err := valuesToAnys(event.GetArgs())
	if err != nil {
		return fmt.Errorf("failed to convert event args to json: %w", err)
	}

	eventArgs, err := json.Marshal(eventArgsArray)
	if err != nil {
		return fmt.Errorf("failed to convert event args to json: %w", err)
	}

	defArgs, err := json.Marshal(event.GetRef().GetArguments())
	if err != nil {
		return fmt.Errorf("failed to convert def args to json: %w", err)
	}

	tx.Insert("eventDefs", map[string]any{
		"id":        event.GetRef().GetId(),
		"component": event.GetRef().GetComponent(),
		"name":      event.GetRef().GetName(),
		"severity":  event.GetRef().GetSeverity(),
		"args":      string(defArgs),
	})

	eventValues := map[string]any{
		"eventDefId": event.GetRef().GetId(),
		"time":       t.TimeConverter(event.GetTime().GetUnix().AsTime()),
		"timeSclk":   event.GetTime().GetSclk(),
		"message":    event.GetMessage(),
		"source":     srcEvent.GetSource(),
		"args":       string(eventArgs),
	}
	if extraColumn != nil {
		eventValues[extraColumn.name] = extraColumn.value
	}
	tx.Insert("events", eventValues)

	return nil
}

func (t *SQLTemplates) InsertTelemetry(tx Tx, srcTlm *pb.SourcedTelemetry, extraColumn *ExtraColumn) error {
	tlm := srcTlm.GetTelemetry()
	def := tlm.GetRef()

	labelsByte, err := json.Marshal(srcTlm.GetTelemetry().GetLabels())
	if err != nil {
		return fmt.Errorf("failed to convert telemetry label to json byte: %w", err)
	}
	labelsString := string(labelsByte)

	tx.Insert("telemetryDefs", map[string]any{
		"id":        def.GetId(),
		"name":      def.GetName(),
		"component": def.GetComponent(),
	})

	err = t.insertValue(tx, extraColumn, tlm.GetTime(), def.GetId(), srcTlm.GetSource(), labelsString, "value", tlm.GetValue())
	if err != nil {
		return fmt.Errorf("failed to insert telemetry value: %w", err)
	}

	return nil
}

func (t *SQLTemplates) insertValue(tx Tx, extraColumn *ExtraColumn, time *pb.Time, telemetryDefId int32, source string, labels string, path string, value *pb.Value) error {
	telValues := map[string]any{
		"time":           t.TimeConverter(time.GetUnix().AsTime()),
		"telemetryDefId": telemetryDefId,
		"timeSclk":       time.GetSclk(),
		"source":         source,
		"labels":         labels,
		"key":            path,
	}

	var err error = nil
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
			err = t.insertValue(tx, extraColumn, time, telemetryDefId, source, labels, path+"."+key, fieldValue)
			if err != nil {
				return fmt.Errorf("failed to insert telemetry key %s: %w", key, err)
			}
		}

		return nil
	case *pb.Value_A:
		for i, arrValue := range valueTy.A.GetValue() {
			err = t.insertValue(tx, extraColumn, time, telemetryDefId, source, labels, path+"["+strconv.FormatUint(uint64(i), 10)+"]", arrValue)
			if err != nil {
				return fmt.Errorf("failed to insert telemetery [%d]: %w", i, err)
			}
		}

		return nil
	case *pb.Value_R:
		telValues["valueType"] = "bytes"
		telValues["bytes"] = valueTy.R.Value
	}

	if extraColumn != nil {
		telValues[extraColumn.name] = "?"
	}

	tx.Insert("telemetry", telValues)
	return nil
}
