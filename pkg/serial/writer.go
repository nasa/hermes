package serial

import (
	"encoding/binary"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"

	"github.com/nasa/hermes/pkg/pb"
)

type writerOption func(w *Writer)

// Override the default boolean 'true' value
// default = `1`
func WithBoolTrueValue(v uint) writerOption {
	return func(w *Writer) {
		w.BoolTrueValue = v
	}
}

// Override the default boolean 'false' value
// default = `0`
func WithBoolFalseValue(v uint) writerOption {
	return func(w *Writer) {
		w.BoolFalseValue = v
	}
}

func WithWriterByteOrder(bo binary.AppendByteOrder) writerOption {
	return func(w *Writer) {
		w.bo = bo
	}
}

type Writer struct {
	buffer []byte
	bo     binary.AppendByteOrder

	// Raw integer value to encode 'true' as
	// (default: 1) value is overriden to '1' if is the same as `BoolFalseValue`
	BoolTrueValue uint

	// Raw integer value to encode 'false' as
	// (default: 0)
	BoolFalseValue uint

	// TODO(tumbar) Validate ranges?
}

func NewWriter(opts ...writerOption) *Writer {
	w := &Writer{
		buffer:         make([]byte, 0),
		bo:             binary.NativeEndian,
		BoolTrueValue:  1,
		BoolFalseValue: 0,
	}

	for _, opt := range opts {
		opt(w)
	}

	return w
}

func (w *Writer) Clone() *Writer {
	o := *w
	return &o
}

func (w *Writer) WithByteOrder(bo binary.AppendByteOrder) *Writer {
	o := w.Clone()
	o.bo = bo
	return o
}

func (w *Writer) err(err error) error {
	return newSerialError(
		uint32(len(w.buffer)),
		err,
	)
}

func (w *Writer) Write(data []byte) {
	w.buffer = append(w.buffer, data...)
}

func (w *Writer) U8(v uint8) {
	w.buffer = append(w.buffer, v)
}

func (w *Writer) I8(v int8) {
	w.buffer = append(w.buffer, uint8(v))
}

func (w *Writer) U16(v uint16) {
	w.buffer = w.bo.AppendUint16(w.buffer, v)
}

func (w *Writer) I16(v int16) {
	w.buffer = w.bo.AppendUint16(w.buffer, uint16(v))
}

func (w *Writer) U32(v uint32) {
	w.buffer = w.bo.AppendUint32(w.buffer, v)
}

func (w *Writer) I32(v int32) {
	w.buffer = w.bo.AppendUint32(w.buffer, uint32(v))
}

func (w *Writer) U64(v uint64) {
	w.buffer = w.bo.AppendUint64(w.buffer, v)
}

func (w *Writer) I64(v int64) {
	w.buffer = w.bo.AppendUint64(w.buffer, uint64(v))
}

func (w *Writer) F32(v float32) {
	w.buffer = w.bo.AppendUint32(w.buffer, math.Float32bits(v))
}

func (w *Writer) F64(v float64) {
	w.buffer = w.bo.AppendUint64(w.buffer, math.Float64bits(v))
}

func (w *Writer) UIntKind(kind pb.UIntKind, v uint64) error {
	switch kind {
	case pb.UIntKind_UINT_U8:
		w.U8(uint8(v))
	case pb.UIntKind_UINT_U16:
		w.U16(uint16(v))
	case pb.UIntKind_UINT_U32:
		w.U32(uint32(v))
	case pb.UIntKind_UINT_U64:
		w.U64(uint64(v))
	default:
		return w.err(NewErrKind(kind))
	}

	return nil
}

func (w *Writer) Boolean(bt *pb.BooleanType, v bool) error {
	var rawV uint
	if v {
		rawV = w.BoolTrueValue
	} else {
		rawV = w.BoolFalseValue
	}

	if bt != nil {
		return w.UIntKind(bt.EncodeType, uint64(rawV))
	} else {
		return w.UIntKind(pb.UIntKind_UINT_U8, uint64(rawV))
	}
}

func (w *Writer) IntKind(kind pb.IntKind, v int64) error {
	switch kind {
	case pb.IntKind_INT_U8:
		w.U8(uint8(v))
	case pb.IntKind_INT_I8:
		w.I8(int8(v))
	case pb.IntKind_INT_U16:
		w.U16(uint16(v))
	case pb.IntKind_INT_I16:
		w.I16(int16(v))
	case pb.IntKind_INT_U32:
		w.U32(uint32(v))
	case pb.IntKind_INT_I32:
		w.I32(int32(v))
	case pb.IntKind_INT_U64:
		w.U64(uint64(v))
	case pb.IntKind_INT_I64:
		w.I64(int64(v))
	default:
		return w.err(NewErrKind(kind))
	}

	return nil
}

func (w *Writer) Int(t *pb.IntType, v int64) error {
	return w.IntKind(t.Kind, v)
}

func (w *Writer) FloatKind(kind pb.FloatKind, v float64) error {
	switch kind {
	case pb.FloatKind_F_F32:
		w.F32(float32(v))
	case pb.FloatKind_F_F64:
		w.F64(v)
	default:
		return w.err(NewErrKind(kind))
	}

	return nil
}

func (w *Writer) Float(t *pb.FloatType, v float64) error {
	return w.FloatKind(t.Kind, v)
}

func (w *Writer) String_(t *pb.StringType, v string) error {
	err := w.UIntKind(t.LengthType, uint64(len(v)))
	if err != nil {
		return err
	}

	w.Write([]byte(v))
	return nil
}

func findEnumEntry(t *pb.EnumType, name string) *pb.EnumItem {
	for _, item := range t.Items {
		if item.Name == name {
			return item
		}
	}

	return nil
}

func (w *Writer) EnumString(t *pb.EnumType, v string) error {
	entry := findEnumEntry(t, v)
	if entry == nil {
		return w.err(fmt.Errorf("missing enum entry in %s: '%s'", t.Name, v))
	}

	return w.IntKind(t.EncodeType, int64(entry.Value))
}

func (w *Writer) EnumInt(t *pb.EnumType, v int64) error {
	return w.IntKind(t.EncodeType, v)
}

func (w *Writer) Enum(t *pb.EnumType, v *pb.EnumValue) error {
	if v.Formatted == "" {
		return w.EnumInt(t, v.Raw)
	} else {
		return w.EnumString(t, v.Formatted)
	}
}

var bitmaskRawHex = regexp.MustCompile("^0x[A-Fa-f0-9]+$")
var bitmaskRawDec = regexp.MustCompile("^[0-9]+$")

func (w *Writer) BitmaskString(t *pb.EnumType, v string) error {
	masks := strings.Split(v, "|")
	ve := uint32(0)

	for _, mask := range masks {
		mask = strings.Trim(mask, " ")
		if bitmaskRawHex.MatchString(mask) {
			// hex value
			rawV, err := strconv.ParseUint(mask[2:], 16, 32)
			if err != nil {
				return w.err(fmt.Errorf("failed to parse hex mask %s: %w", mask, err))
			}

			ve |= uint32(rawV)
		} else if bitmaskRawDec.MatchString(mask) {
			// dec value
			rawV, err := strconv.ParseUint(mask, 10, 32)
			if err != nil {
				return w.err(fmt.Errorf("failed to parse decimal mask %s: %w", mask, err))
			}

			ve |= uint32(rawV)
		} else {
			entry := findEnumEntry(t, mask)
			if entry == nil {
				return w.err(fmt.Errorf("missing bitmask entry in %s: '%s'", t.Name, mask))
			}

			ve |= uint32(entry.Value)
		}
	}

	return w.IntKind(t.EncodeType, int64(ve))
}

func (w *Writer) BitmaskInt(t *pb.EnumType, v uint64) error {
	return w.IntKind(t.EncodeType, int64(v))
}

func (w *Writer) Bitmask(t *pb.EnumType, v *pb.EnumValue) error {
	if v.Formatted == "" {
		return w.BitmaskInt(t, uint64(v.Raw))
	} else {
		return w.BitmaskString(t, v.Formatted)
	}
}

func (w *Writer) Object(t *pb.ObjectType, v *pb.ObjectValue) error {
	for _, field := range t.Fields {
		if value, ok := v.O[field.Name]; ok {
			err := w.Type(field.Type, value)
			if err != nil {
				return fmt.Errorf(".%s%w", field.Name, err)
			}
		} else {
			return fmt.Errorf(".%s field not found in value map", field.Name)
		}
	}

	return nil
}

func (w *Writer) Array(t *pb.ArrayType, v *pb.ArrayValue) error {
	if t.ElType == nil {
		return fmt.Errorf("no ElType provided")
	}

	var writeSize bool

	if t.Size == nil {
		// Dynamically sized array with no bounds
		writeSize = true
	} else {
		switch sizeType := t.Size.(type) {
		case *pb.ArrayType_Static:
			// Statically sized arrays don't need a size prefix
			// Validate the value is the proper size
			if len(v.Value) != int(sizeType.Static) {
				return fmt.Errorf(
					"statically sized array invalid size (expected) %d != (got) %d",
					sizeType.Static,
					len(v.Value),
				)
			}

			writeSize = false
		case *pb.ArrayType_Dynamic:
			// Check if bounds are actually used
			if sizeType.Dynamic.GetMin() < sizeType.Dynamic.GetMax() {
				if len(v.Value) < int(sizeType.Dynamic.Min) || len(v.Value) > int(sizeType.Dynamic.Max) {
					return fmt.Errorf(
						"array size out of bounds %d <= %d <= %d",
						sizeType.Dynamic.Min,
						len(v.Value),
						sizeType.Dynamic.Max,
					)
				}
			}

			writeSize = true
		}
	}

	if writeSize {
		if err := w.UIntKind(t.LengthType, uint64(len(v.Value))); err != nil {
			return fmt.Errorf("failed to write array length: %w", err)
		}
	}

	for i, item := range v.Value {
		if err := w.Type(t.ElType, item); err != nil {
			return fmt.Errorf("[%d]%w", i, err)
		}
	}

	return nil
}

func (w *Writer) Bytes(t *pb.BytesType, v *pb.BytesValue) error {
	if v.Kind != t.Kind {
		return fmt.Errorf(
			"%w (type.Kind) %s != (value.Kind) %s",
			ErrKindMismatch,
			t.Kind.String(),
			v.Kind.String(),
		)
	}

	var writeSize bool

	elLength := int(SizeOfNumberKind(t.Kind))

	if t.Size == nil {
		// Dynamically sized bytes with no bounds
		writeSize = true
	} else {
		if t.GetDynamic() != nil {
			// Check if bounds are actually used
			if t.GetDynamic().GetMin() < t.GetDynamic().GetMax() {
				if len(v.Value) < int(t.GetDynamic().GetMin())*elLength || len(v.Value) > int(t.GetDynamic().GetMax())*elLength {
					return fmt.Errorf(
						"bytes size out of bounds %dx%d <= %d <= %dx%d",
						t.GetDynamic().GetMin(),
						elLength,
						len(v.Value),
						t.GetDynamic().GetMax(),
						elLength,
					)
				}
			}

			writeSize = true
		} else {
			// Statically sized bytes don't need a size prefix
			// Validate the value is the proper size
			if len(v.Value) != int(t.GetStatic())*elLength {
				return fmt.Errorf(
					"statically sized bytes invalid size (expected) %dx%d != (got) %d",
					t.GetStatic(),
					elLength,
					len(v.Value),
				)
			}

			writeSize = false
		}
	}

	if writeSize {
		if err := w.UIntKind(t.LengthType, uint64(len(v.Value))); err != nil {
			return fmt.Errorf("failed to write bytes length: %w", err)
		}
	}

	w.Write(v.Value)
	return nil
}

func (w *Writer) Type(ta *pb.Type, v *pb.Value) error {
	if ta == nil {
		return fmt.Errorf("nil type: %w", ErrKind)
	}

	switch ty := ta.Value.(type) {
	case *pb.Type_Bool:
		if x, ok := v.Value.(*pb.Value_B); ok {
			return w.Boolean(ty.Bool, x.B)
		} else {
			return fmt.Errorf("%w expected boolean value for BooleanType: %T", ErrKind, v)
		}
	case *pb.Type_Int:
		if x, ok := v.Value.(*pb.Value_I); ok {
			return w.IntKind(ty.Int.Kind, x.I)
		} else if x, ok := v.Value.(*pb.Value_U); ok {
			return w.IntKind(ty.Int.Kind, int64(x.U))
		} else {
			return fmt.Errorf("%w expected I or U value for IntType: %T", ErrKind, v)
		}
	case *pb.Type_Float:
		if x, ok := v.Value.(*pb.Value_F); ok {
			return w.Float(ty.Float, x.F)
		} else {
			return fmt.Errorf("%w expected F value for FloatType: %T", ErrKind, v)
		}
	case *pb.Type_String_:
		if x, ok := v.Value.(*pb.Value_S); ok {
			return w.String_(ty.String_, x.S)
		} else {
			return fmt.Errorf("%w expected S value for StringType: %T", ErrKind, v)
		}
	case *pb.Type_Enum:
		if x, ok := v.Value.(*pb.Value_E); ok {
			return w.Enum(ty.Enum, x.E)
		} else {
			return fmt.Errorf("%w expected E value for EnumType: %T", ErrKind, v)
		}
	case *pb.Type_Bitmask:
		if x, ok := v.Value.(*pb.Value_E); ok {
			return w.Enum(ty.Bitmask, x.E)
		} else {
			return fmt.Errorf("%w expected E value for EnumType: %T", ErrKind, v)
		}
	case *pb.Type_Object:
		if x, ok := v.Value.(*pb.Value_O); ok {
			return w.Object(ty.Object, x.O)
		} else {
			return fmt.Errorf("%w expected O value for ObjectType: %T", ErrKind, v)
		}
	case *pb.Type_Array:
		if x, ok := v.Value.(*pb.Value_A); ok {
			return w.Array(ty.Array, x.A)
		} else {
			return fmt.Errorf("%w expected A value for ArrayType: %T", ErrKind, v)
		}
	case *pb.Type_Bytes:
		if x, ok := v.Value.(*pb.Value_R); ok {
			return w.Bytes(ty.Bytes, x.R)
		} else {
			return fmt.Errorf("%w expected R value for BytesType: %T", ErrKind, v)
		}
	case *pb.Type_Void:
		w.Write(make([]byte, ty.Void.Size))
		return nil
	}

	return fmt.Errorf("invalid type: %s", ta.String())
}

func (w *Writer) Get() []byte {
	return w.buffer
}

func (w *Writer) Set(b []byte) {
	w.buffer = b
}

func (w *Writer) Reset() {
	w.buffer = make([]byte, 0)
}
