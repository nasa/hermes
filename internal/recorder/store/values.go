package store

import (
	"database/sql"
	"strconv"
	"strings"
)

// ValueType is a YAMCS Value.Type name, stored in parameter_values.value_type.
type ValueType string

const (
	TypeFloat      ValueType = "FLOAT"
	TypeDouble     ValueType = "DOUBLE"
	TypeUint32     ValueType = "UINT32"
	TypeSint32     ValueType = "SINT32"
	TypeUint64     ValueType = "UINT64"
	TypeSint64     ValueType = "SINT64"
	TypeBoolean    ValueType = "BOOLEAN"
	TypeString     ValueType = "STRING"
	TypeBinary     ValueType = "BINARY"
	TypeEnumerated ValueType = "ENUMERATED"
	TypeTimestamp  ValueType = "TIMESTAMP"
)

// Value is one scalar in the column layout of parameter_values. Build it with
// the constructors below so each type lands in the columns readers expect.
type Value struct {
	Type   ValueType
	Int    sql.NullInt64
	Float  sql.NullFloat64
	Bool   sql.NullBool
	String sql.NullString
	Binary []byte // nil is NULL
}

// FloatValue widens v through its shortest decimal form, so 0.1 is stored as
// 0.1 rather than 0.10000000149011612. float32 of the result is still v.
func FloatValue(v float32) Value {
	wide, _ := strconv.ParseFloat(strconv.FormatFloat(float64(v), 'g', -1, 32), 64)
	return Value{Type: TypeFloat, Float: sql.NullFloat64{Float64: wide, Valid: true}}
}

func DoubleValue(v float64) Value {
	return Value{Type: TypeDouble, Float: sql.NullFloat64{Float64: v, Valid: true}}
}

func Uint32Value(v uint32) Value {
	return Value{Type: TypeUint32, Int: sql.NullInt64{Int64: int64(v), Valid: true}}
}

func Sint32Value(v int32) Value {
	return Value{Type: TypeSint32, Int: sql.NullInt64{Int64: int64(v), Valid: true}}
}

// Uint64Value stores the raw 64 bits, so values above 2^63-1 read back
// negative. Readers recover them with int_value::numeric + 18446744073709551616
// when int_value < 0.
func Uint64Value(v uint64) Value {
	return Value{Type: TypeUint64, Int: sql.NullInt64{Int64: int64(v), Valid: true}}
}

func Sint64Value(v int64) Value {
	return Value{Type: TypeSint64, Int: sql.NullInt64{Int64: v, Valid: true}}
}

func BooleanValue(v bool) Value {
	return Value{Type: TypeBoolean, Bool: sql.NullBool{Bool: v, Valid: true}}
}

func StringValue(v string) Value {
	return Value{Type: TypeString, String: sql.NullString{String: pgText(v), Valid: true}}
}

func BinaryValue(v []byte) Value {
	if v == nil {
		v = []byte{}
	}
	return Value{Type: TypeBinary, Binary: v}
}

func EnumeratedValue(number int64, label string) Value {
	return Value{
		Type:   TypeEnumerated,
		Int:    sql.NullInt64{Int64: number, Valid: true},
		String: sql.NullString{String: pgText(label), Valid: true},
	}
}

// TimestampValue stores the UTC text YAMCS sends with a timestamp. YAMCS counts
// leap seconds, so the text can hold a :60 second that time.Time cannot.
func TimestampValue(utc string) Value {
	return Value{Type: TypeTimestamp, String: sql.NullString{String: pgText(utc), Valid: true}}
}

// pgText replaces NUL and invalid UTF-8, which Postgres TEXT rejects, with
// U+FFFD. One such value would otherwise fail its whole batch.
func pgText(s string) string {
	return strings.ReplaceAll(strings.ToValidUTF8(s, "\uFFFD"), "\x00", "\uFFFD")
}
