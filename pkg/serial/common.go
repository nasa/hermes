package serial

import (
	"errors"
	"fmt"

	"github.com/nasa/hermes/pkg/pb"
)

var (
	_ error = (*errSerialField)(nil)
	_       = (*errSerial)(nil)
)

type errSerial struct {
	Err    error
	Offset uint32
}

func (se *errSerial) Error() string {
	return fmt.Sprintf("offset=%d %s", se.Offset, se.Err)
}

func (se *errSerial) Unwrap() error {
	return se.Err
}

func newSerialError(offset uint32, err error) error {
	return &errSerial{Err: err, Offset: offset}
}

var ErrKind = errors.New("invalid type kind")
var ErrBounds = errors.New("out of bounds")
var ErrKindMismatch = errors.New("type kind mismatch")

func NewErrKind(value interface{}) error {
	return fmt.Errorf("%w: (%T) %v", ErrKind, value, value)
}

type errSerialField struct {
	Err   error
	Field string
}

func (e *errSerialField) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Err)
}

func (e *errSerialField) Unwrap() error {
	return e.Err
}

func UIntKindToNumberKind(kind pb.UIntKind) (pb.NumberKind, error) {
	switch kind {
	case pb.UIntKind_UINT_U8:
		return pb.NumberKind_NUMBER_U8, nil
	case pb.UIntKind_UINT_U16:
		return pb.NumberKind_NUMBER_U16, nil
	case pb.UIntKind_UINT_U32:
		return pb.NumberKind_NUMBER_U32, nil
	case pb.UIntKind_UINT_U64:
		return pb.NumberKind_NUMBER_U64, nil
	}

	return 0, NewErrKind(kind)
}

func IntKindToNumberKind(kind pb.IntKind) (pb.NumberKind, error) {
	switch kind {
	case pb.IntKind_INT_U8:
		return pb.NumberKind_NUMBER_U8, nil
	case pb.IntKind_INT_I8:
		return pb.NumberKind_NUMBER_I8, nil
	case pb.IntKind_INT_U16:
		return pb.NumberKind_NUMBER_U16, nil
	case pb.IntKind_INT_I16:
		return pb.NumberKind_NUMBER_I16, nil
	case pb.IntKind_INT_U32:
		return pb.NumberKind_NUMBER_U32, nil
	case pb.IntKind_INT_I32:
		return pb.NumberKind_NUMBER_I32, nil
	case pb.IntKind_INT_U64:
		return pb.NumberKind_NUMBER_U64, nil
	case pb.IntKind_INT_I64:
		return pb.NumberKind_NUMBER_I64, nil
	}

	return 0, NewErrKind(kind)
}

func FloatKindToNumberKind(kind pb.FloatKind) (pb.NumberKind, error) {
	switch kind {
	case pb.FloatKind_F_F32:
		return pb.NumberKind_NUMBER_F32, nil
	case pb.FloatKind_F_F64:
		return pb.NumberKind_NUMBER_F64, nil
	}

	return 0, NewErrKind(kind)
}

func TypeToNumberKind(ty *pb.Type) (pb.NumberKind, error) {
	switch ty := ty.Value.(type) {
	case *pb.Type_Bool:
		return UIntKindToNumberKind(ty.Bool.EncodeType)
	case *pb.Type_Int:
		return IntKindToNumberKind(ty.Int.Kind)
	case *pb.Type_Float:
		return FloatKindToNumberKind(ty.Float.Kind)
	case *pb.Type_String_:
		return 0, fmt.Errorf("string is not a numeric type")
	case *pb.Type_Enum:
		return IntKindToNumberKind(ty.Enum.EncodeType)
	case *pb.Type_Bitmask:
		return IntKindToNumberKind(ty.Bitmask.EncodeType)
	case *pb.Type_Object:
		return 0, fmt.Errorf("object is not a numeric type")
	case *pb.Type_Array:
		return 0, fmt.Errorf("array is not a numeric type")
	case *pb.Type_Void:
		return pb.NumberKind_NUMBER_U8, nil
	}

	return 0, errors.New("invalid type")
}
