package main

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/nasa/hermes/pkg/pb"
)

type ExtraColumn struct {
	name  string
	type_ string
	value string
}

func ExtraColumnFromString(str string) (*ExtraColumn, error) {
	components := strings.Split(str, " ")
	if len(components) != 3 {
		return nil, fmt.Errorf("failed to parse columns from string: %s", str)
	}
	return &ExtraColumn{
		name:  components[0],
		type_: components[1],
		value: components[2],
	}, nil
}

type Tx interface {
	Insert(table string, values map[string]any)
	Commit() error
}

type Recorder interface {
	Close() error
	Initialize() error
	StartTransaction() (Tx, error)
	InsertEvent(tx Tx, event *pb.SourcedEvent) error
	InsertTelemetry(tx Tx, telemetry *pb.SourcedTelemetry) error
	MaxConnections() int
	DB() *sql.DB
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
