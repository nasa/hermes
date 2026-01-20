package serial

import (
	"encoding/binary"
	"fmt"
	"io"
	"math"
	"sort"
	"strings"

	"github.com/nasa/hermes/pkg/pb"
)

type serialReadError struct {
	Err  error
	Size uint32
}

func (se *serialReadError) Error() string {
	return fmt.Sprintf("readSize=%d %s", se.Size, se.Err)
}

func (se *serialReadError) Unwrap() error {
	return se.Err
}

type Reader struct {
	order  binary.ByteOrder
	data   []byte
	offset uint32

	// Throw an error if we got a bad enum value (i.e. not in the definition)
	// By default this will return the string formatted raw integer value
	EnumErrorOnInvalid bool

	// By default an remainder on raw bitmask values will be formatted as hex
	// This will format it with decimal values
	BitmaskExtraAsDec bool
}

type readerOption func(r *Reader)

func WithByteOrder(bo binary.ByteOrder) readerOption {
	return func(r *Reader) {
		r.order = bo
	}
}

// Throw an error if we got a bad enum value (i.e. not in the definition)
// By default this will return the string formatted raw integer value
func WithEnumErrorOnInvalid(bo binary.ByteOrder) readerOption {
	return func(r *Reader) {
		r.EnumErrorOnInvalid = true
	}
}

// By default an remainder on raw bitmask values will be formatted as hex
// This will format it with decimal values
func WithBitmaskExtraAsDec(bo binary.ByteOrder) readerOption {
	return func(r *Reader) {
		r.BitmaskExtraAsDec = true
	}
}

func NewReader(buffer []byte, opts ...readerOption) *Reader {
	r := &Reader{
		data:   buffer,
		offset: 0,
		order:  binary.NativeEndian,
	}

	for _, opt := range opts {
		opt(r)
	}

	return r
}

func (r *Reader) Clone() *Reader {
	o := *r
	return &o
}

func (r *Reader) WithByteOrder(order binary.ByteOrder) *Reader {
	o := r.Clone()
	o.order = order
	return o
}

func (r *Reader) err(err error) error {
	return newSerialError(
		r.offset,
		err,
	)
}

func (r *Reader) checkEOF(n uint32) error {
	if r.offset+n <= uint32(len(r.data)) {
		return nil
	}

	return r.err(&serialReadError{
		Err:  io.EOF,
		Size: n,
	})
}

func (r *Reader) BytesLeft() uint32 {
	return uint32(len(r.data) - int(r.offset))
}

func (r *Reader) Read(n uint32) ([]byte, error) {
	if err := r.checkEOF(n); err != nil {
		return nil, err
	}

	b := r.data[r.offset : r.offset+n]
	r.offset += n

	return b, nil
}

func (r *Reader) U8() (uint8, error) {
	if err := r.checkEOF(1); err != nil {
		return 0, err
	}

	b := r.data[r.offset]
	r.offset += 1

	return uint8(b), nil
}

func (r *Reader) I8() (int8, error) {
	if err := r.checkEOF(1); err != nil {
		return 0, err
	}

	b := r.data[r.offset]
	r.offset += 1

	return int8(b), nil
}

func (r *Reader) U16() (uint16, error) {
	if err := r.checkEOF(2); err != nil {
		return 0, err
	}

	b := r.data[r.offset : r.offset+2]
	r.offset += 2

	return r.order.Uint16(b), nil
}

func (r *Reader) I16() (int16, error) {
	if err := r.checkEOF(2); err != nil {
		return 0, err
	}

	b := r.data[r.offset : r.offset+2]
	r.offset += 2

	return int16(r.order.Uint16(b)), nil
}

func (r *Reader) U32() (uint32, error) {
	if err := r.checkEOF(4); err != nil {
		return 0, err
	}

	b := r.data[r.offset : r.offset+4]
	r.offset += 4

	return r.order.Uint32(b), nil
}

func (r *Reader) I32() (int32, error) {
	if err := r.checkEOF(4); err != nil {
		return 0, err
	}

	b := r.data[r.offset : r.offset+4]
	r.offset += 4

	return int32(r.order.Uint32(b)), nil
}

func (r *Reader) U64() (uint64, error) {
	if err := r.checkEOF(8); err != nil {
		return 0, err
	}

	b := r.data[r.offset : r.offset+8]
	r.offset += 8

	return r.order.Uint64(b), nil
}

func (r *Reader) I64() (int64, error) {
	if err := r.checkEOF(8); err != nil {
		return 0, err
	}

	b := r.data[r.offset : r.offset+8]
	r.offset += 8

	return int64(r.order.Uint64(b)), nil
}

func (r *Reader) F32() (float32, error) {
	u32, err := r.U32()
	if err != nil {
		return 0, err
	}

	return math.Float32frombits(u32), nil
}

func (r *Reader) F64() (float64, error) {
	u64, err := r.U64()
	if err != nil {
		return 0, err
	}

	return math.Float64frombits(u64), nil
}

func (r *Reader) UIntKind(kind pb.UIntKind) (uint64, error) {
	switch kind {
	case pb.UIntKind_UINT_U8:
		o, err := r.U8()
		return uint64(o), err
	case pb.UIntKind_UINT_U16:
		o, err := r.U16()
		return uint64(o), err
	case pb.UIntKind_UINT_U32:
		o, err := r.U32()
		return uint64(o), err
	case pb.UIntKind_UINT_U64:
		o, err := r.U64()
		return uint64(o), err
	}

	return 0, r.err(NewErrKind(kind))
}

func (r *Reader) Boolean(bt *pb.BooleanType) (bool, error) {
	var b uint64
	var err error

	if bt != nil {
		b, err = r.UIntKind(bt.EncodeType)
		if err != nil {
			return false, err
		}
	} else {
		b, err = r.UIntKind(pb.UIntKind_UINT_U8)
		if err != nil {
			return false, err
		}
	}

	return b != 0, nil
}

func (r *Reader) IntKind(kind pb.IntKind) (int64, error) {
	switch kind {
	case pb.IntKind_INT_U8:
		o, err := r.U8()
		return int64(o), err
	case pb.IntKind_INT_I8:
		o, err := r.I8()
		return int64(o), err
	case pb.IntKind_INT_U16:
		o, err := r.U16()
		return int64(o), err
	case pb.IntKind_INT_I16:
		o, err := r.I16()
		return int64(o), err
	case pb.IntKind_INT_U32:
		o, err := r.U32()
		return int64(o), err
	case pb.IntKind_INT_I32:
		o, err := r.I32()
		return int64(o), err
	case pb.IntKind_INT_U64:
		o, err := r.U64()
		return int64(o), err
	case pb.IntKind_INT_I64:
		o, err := r.I64()
		return int64(o), err
	}

	return 0, r.err(NewErrKind(kind))
}

func (r *Reader) Int(t *pb.IntType) (*pb.Value, error) {
	switch t.Kind {
	case pb.IntKind_INT_U8:
		o, err := r.U8()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_U{
			U: uint64(o),
		}}, nil
	case pb.IntKind_INT_I8:
		o, err := r.I8()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_I{
			I: int64(o),
		}}, nil
	case pb.IntKind_INT_U16:
		o, err := r.U16()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_U{
			U: uint64(o),
		}}, nil
	case pb.IntKind_INT_I16:
		o, err := r.I16()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_I{
			I: int64(o),
		}}, nil
	case pb.IntKind_INT_U32:
		o, err := r.U32()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_U{
			U: uint64(o),
		}}, nil
	case pb.IntKind_INT_I32:
		o, err := r.I32()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_I{
			I: int64(o),
		}}, nil
	case pb.IntKind_INT_U64:
		o, err := r.U64()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_U{
			U: uint64(o),
		}}, nil
	case pb.IntKind_INT_I64:
		o, err := r.I64()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_I{
			I: int64(o),
		}}, nil
	}

	return nil, r.err(NewErrKind(t.Kind))
}

func (r *Reader) FloatKind(kind pb.FloatKind) (float64, error) {
	switch kind {
	case pb.FloatKind_F_F32:
		o, err := r.F32()
		return float64(o), err
	case pb.FloatKind_F_F64:
		return r.F64()
	}

	return 0, r.err(NewErrKind(kind))
}

func (r *Reader) Float(t *pb.FloatType) (float64, error) {
	return r.FloatKind(t.Kind)
}

func (r *Reader) String_(t *pb.StringType) (string, error) {
	l, err := r.UIntKind(t.LengthType)
	if err != nil {
		return "", r.err(fmt.Errorf("failed to read string length: %w", err))
	}

	s, err := r.Read(uint32(l))
	if err != nil {
		return "", r.err(fmt.Errorf("failed to read string: %w", err))
	}

	return string(s), nil
}

func (r *Reader) Enum(t *pb.EnumType) (*pb.EnumValue, error) {
	i, err := r.IntKind(t.EncodeType)
	if err != nil {
		return nil, err
	}

	// Lookup the number
	for _, def := range t.Items {
		if def.Value == int32(i) {
			return &pb.EnumValue{
				Raw:       int64(i),
				Formatted: def.Name,
			}, nil
		}
	}

	if r.EnumErrorOnInvalid {
		return nil, r.err(fmt.Errorf("invalid enum value: %d", i))
	} else {
		return &pb.EnumValue{
			Raw:       int64(i),
			Formatted: fmt.Sprintf("%v", i),
		}, nil
	}
}

func (r *Reader) Bitmask(t *pb.EnumType) (*pb.EnumValue, error) {
	i, err := r.IntKind(t.EncodeType)
	if err != nil {
		return nil, err
	}

	u := uint64(i)

	values := []string{}
	for _, item := range t.Items {
		valueU := uint64(item.Value)

		if (valueU & u) == valueU {
			values = append(values, item.Name)

			// Strip off this mask
			u &= ^valueU
		}
	}

	// Presort the values
	sort.Strings(values)

	// Remainder always at the end
	if u != 0 {
		if r.BitmaskExtraAsDec {
			values = append(values, fmt.Sprintf("%v", u))
		} else {
			values = append(values, fmt.Sprintf("0x%02x", u))
		}
	}

	return &pb.EnumValue{
		Raw:       int64(i),
		Formatted: strings.Join(values, "|"),
	}, nil
}

func (r *Reader) Object(t *pb.ObjectType) (*pb.ObjectValue, error) {
	out := &pb.ObjectValue{
		O: map[string]*pb.Value{},
	}

	for _, fieldDef := range t.Fields {
		field, err := r.Type(fieldDef.Type)
		if err != nil {
			return nil, fmt.Errorf("%s.%w", fieldDef.Name, err)
		}

		if field == nil {
			// void field, ignore
			continue
		}

		out.O[fieldDef.Name] = field
	}

	return out, nil
}

func (r *Reader) Array(t *pb.ArrayType) (*pb.ArrayValue, error) {
	var l uint64
	var err error

	if t.Size == nil {
		l, err = r.UIntKind(t.LengthType)
		if err != nil {
			return nil, fmt.Errorf("len,%w", err)
		}
	} else {
		switch size := t.Size.(type) {
		case *pb.ArrayType_Dynamic:
			l, err = r.UIntKind(t.LengthType)
			if err != nil {
				return nil, fmt.Errorf("len,%w", err)
			}

			if dyn := t.GetDynamic(); dyn != nil && dyn.Max != 0 {
				// Check max bound
				if l > uint64(dyn.Max) || l < uint64(dyn.Min) {
					return nil, r.err(fmt.Errorf(
						"%w: (%d [%d, %d])",
						ErrBounds,
						l,
						dyn.Min,
						dyn.Max,
					))
				}
			}
		case *pb.ArrayType_Static:
			l = uint64(size.Static)
		default:
			return nil, fmt.Errorf("invalid array type: %v", t)
		}
	}

	out := &pb.ArrayValue{
		Value: []*pb.Value{},
	}

	for i := 0; i < int(l); i++ {
		e, err := r.Type(t.ElType)
		if err != nil {
			return nil, fmt.Errorf("[%d]%w", i, err)
		}

		if e == nil {
			return nil, fmt.Errorf("[%d] got void array element", i)
		}

		out.Value = append(out.Value, e)
	}

	return out, nil
}

func (r *Reader) Bytes(t *pb.BytesType) (*pb.BytesValue, error) {
	var l uint64
	var err error

	if t.Size == nil {
		l, err = r.UIntKind(t.LengthType)
		if err != nil {
			return nil, fmt.Errorf("len,%w", err)
		}
	} else {
		switch size := t.Size.(type) {
		case *pb.BytesType_Dynamic:
			l, err = r.UIntKind(t.LengthType)
			if err != nil {
				return nil, fmt.Errorf("len,%w", err)
			}

			if dyn := t.GetDynamic(); dyn != nil && dyn.Max != 0 {
				// Check max bound
				if l > uint64(dyn.Max) || l < uint64(dyn.Min) {
					return nil, r.err(fmt.Errorf(
						"%w: (%d [%d, %d])",
						ErrBounds,
						l,
						dyn.Min,
						dyn.Max,
					))
				}
			}
		case *pb.BytesType_Static:
			l = uint64(size.Static)
		default:
			return nil, fmt.Errorf("invalid array type: %v", t)
		}
	}

	v, err := r.Read(uint32(l))
	if err != nil {
		return nil, err
	}

	return &pb.BytesValue{
		Kind:      t.Kind,
		BigEndian: r.order == binary.BigEndian,
		Value:     v,
	}, nil
}

func (r *Reader) Type(ta *pb.Type) (*pb.Value, error) {
	if ta == nil {
		return nil, fmt.Errorf("nil type: %w", ErrKind)
	}

	switch ty := ta.Value.(type) {
	case *pb.Type_Bool:
		v, err := r.Boolean(ty.Bool)
		if err != nil {
			return nil, err
		}

		return &pb.Value{
			Value: &pb.Value_B{
				B: v,
			},
		}, nil

	case *pb.Type_Int:
		return r.Int(ty.Int)
	case *pb.Type_Float:
		v, err := r.Float(ty.Float)
		if err != nil {
			return nil, err
		}

		return &pb.Value{
			Value: &pb.Value_F{
				F: float64(v),
			},
		}, nil
	case *pb.Type_String_:
		v, err := r.String_(ty.String_)
		if err != nil {
			return nil, err
		}

		return &pb.Value{
			Value: &pb.Value_S{
				S: v,
			},
		}, nil
	case *pb.Type_Enum:
		v, err := r.Enum(ty.Enum)
		if err != nil {
			return nil, err
		}

		return &pb.Value{
			Value: &pb.Value_E{
				E: v,
			},
		}, nil
	case *pb.Type_Bitmask:
		v, err := r.Bitmask(ty.Bitmask)
		if err != nil {
			return nil, err
		}

		return &pb.Value{
			Value: &pb.Value_E{
				E: v,
			},
		}, nil
	case *pb.Type_Object:
		v, err := r.Object(ty.Object)
		if err != nil {
			return nil, err
		}

		return &pb.Value{
			Value: &pb.Value_O{
				O: v,
			},
		}, nil
	case *pb.Type_Array:
		v, err := r.Array(ty.Array)
		if err != nil {
			return nil, err
		}

		return &pb.Value{
			Value: &pb.Value_A{
				A: v,
			},
		}, nil
	case *pb.Type_Bytes:
		v, err := r.Bytes(ty.Bytes)
		if err != nil {
			return nil, err
		}

		return &pb.Value{
			Value: &pb.Value_R{
				R: v,
			},
		}, nil
	case *pb.Type_Void:
		err := r.checkEOF(ty.Void.Size)
		if err != nil {
			return nil, err
		}

		r.offset += ty.Void.Size
		return nil, nil
	}

	return nil, fmt.Errorf("invalid type: %T %s", ta.GetValue(), ta.String())
}

// Set the read buffer
func (r *Reader) Set(buffer []byte) {
	r.data = buffer
	r.offset = 0
}

// Set the read offset
func (r *Reader) SetOffset(o uint32) {
	r.offset = o
}

// Get the current read offset
func (r *Reader) Offset() uint32 {
	return r.offset
}

// Reset the read offset
func (r *Reader) Reset() {
	r.offset = 0
}
