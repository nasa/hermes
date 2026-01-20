package compiler

import (
	"fmt"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ Type            = U8
	_ Type            = BYTE
	_ TypeConstructor = U8
	_ TypeConstructor = BYTE
)

const (
	U8 ScalarType = iota
	I8
	U16
	I16
	U32
	I32
	U64
	I64
	F32
	F64

	BYTE ByteType = 0
)

type ScalarType int32

const (
	IntKind_INT_U8 ScalarType = iota
	IntKind_INT_I8
	IntKind_INT_U16
	IntKind_INT_I16
	IntKind_INT_U32
	IntKind_INT_I32
	IntKind_INT_U64
	IntKind_INT_I64
)

// Construct implements TypeConstructor.
func (k ScalarType) Construct(args []ast.Expr) (Type, error) {
	if len(args) > 0 {
		return nil, fmt.Errorf("scalar types do not accept parameters")
	}

	return k, nil
}

// Field implements Type.
func (k ScalarType) Field(b StructBuilder, name string) {
	b.Field(name, k.Name(b))
}

// Name implements Type.
func (k ScalarType) Name(Context) string {
	switch k {
	case U8:
		return "uint8"
	case I8:
		return "int8"
	case U16:
		return "uint16"
	case I16:
		return "int16"
	case U32:
		return "uint32"
	case I32:
		return "int32"
	case U64:
		return "uint64"
	case I64:
		return "int64"
	case F32:
		return "float32"
	case F64:
		return "float64"
	default:
		panic("invalid scalar type kind")
	}
}

// String implements TypeName.
func (k ScalarType) funcName() string {
	switch k {
	case U8:
		return "U8"
	case I8:
		return "I8"
	case U16:
		return "U16"
	case I16:
		return "I16"
	case U32:
		return "U32"
	case I32:
		return "I32"
	case U64:
		return "U64"
	case I64:
		return "I64"
	case F32:
		return "F32"
	case F64:
		return "F64"
	default:
		panic("invalid integral type kind")
	}
}

// Marshal implements Type.
func (k ScalarType) Marshal(b BlockBuilder, name string) {
	b.Appendf("w.%s(%s)", k.funcName(), name)
}

// Unmarshal implements Type.
func (k ScalarType) Unmarshal(b BlockBuilder, name string) {
	b.Appendf("%s, err = r.%s()", name, k.funcName())
	b.HandleError(name)
}

type ByteType int

// Construct implements TypeConstructor.
func (t ByteType) Construct(args []ast.Expr) (Type, error) {
	if len(args) > 0 {
		return nil, fmt.Errorf("byte type does not accept parameters")
	}

	return t, nil
}

// Field implements Type.
func (t ByteType) Field(b StructBuilder, name string) {
	b.Field(name, t.Name(b))
}

// Marshal implements Type.
func (ByteType) Marshal(b BlockBuilder, name string) {
	b.Appendf("w.U8(uint8(%s))", name)
}

// Unmarshal implements Type.
func (ByteType) Unmarshal(b BlockBuilder, name string) {
	b.Appendf("%s, err = r.U8()", name)
	b.HandleError("byte")
}

// Name implements Type.
func (b ByteType) Name(Context) string {
	return "byte"
}
