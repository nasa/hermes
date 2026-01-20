package serial

import (
	"encoding/binary"
	"io"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/nasa/hermes/pkg/pb"
	"google.golang.org/protobuf/proto"
)

func TestRBool(t *testing.T) {
	r := NewReader(
		[]byte{0x0, 0x1, 0x20},
		WithByteOrder(binary.LittleEndian),
	)

	vu, err := r.Boolean(nil)
	assert.NoError(t, err)
	assert.Equal(t, false, vu)

	vu, err = r.Boolean(&pb.BooleanType{EncodeType: pb.UIntKind_UINT_U8})
	assert.NoError(t, err)
	assert.Equal(t, true, vu)

	vu, err = r.Boolean(nil)
	assert.NoError(t, err)
	assert.Equal(t, true, vu)

	r.Reset()

	vu, err = r.Boolean(&pb.BooleanType{EncodeType: pb.UIntKind_UINT_U16})
	assert.NoError(t, err)
	assert.Equal(t, true, vu)
}

func TestR8(t *testing.T) {
	r := NewReader(
		[]byte{0x20},
		WithByteOrder(binary.LittleEndian),
	)

	vu, err := r.U8()
	assert.NoError(t, err)
	assert.Equal(t, uint8(0x20), vu)

	r.Reset()

	vi, err := r.I8()
	assert.NoError(t, err)
	assert.Equal(t, int8(0x20), vi)
}

func TestR16(t *testing.T) {
	content := []byte{0x20, 0x30}
	rl := NewReader(
		content,
		WithByteOrder(binary.LittleEndian),
	)

	rb := NewReader(
		content,
		WithByteOrder(binary.BigEndian),
	)

	vul, err := rl.U16()
	assert.NoError(t, err)
	assert.Equal(t, uint16(0x3020), vul)

	vub, err := rb.U16()
	assert.NoError(t, err)
	assert.Equal(t, uint16(0x2030), vub)

	rl.Reset()
	rb.Reset()

	vil, err := rl.I16()
	assert.NoError(t, err)
	assert.Equal(t, int16(0x3020), vil)

	vib, err := rb.I16()
	assert.NoError(t, err)
	assert.Equal(t, int16(0x2030), vib)
}

func TestR32(t *testing.T) {
	content := []byte{0x20, 0x30, 0x40, 0x50}
	rl := NewReader(
		content,
		WithByteOrder(binary.LittleEndian),
	)

	rb := NewReader(
		content,
		WithByteOrder(binary.BigEndian),
	)

	vul, err := rl.U32()
	assert.NoError(t, err)
	assert.Equal(t, uint32(0x50403020), vul)

	vub, err := rb.U32()
	assert.NoError(t, err)
	assert.Equal(t, uint32(0x20304050), vub)

	rl.Reset()
	rb.Reset()

	vil, err := rl.I32()
	assert.NoError(t, err)
	assert.Equal(t, int32(0x50403020), vil)

	vib, err := rb.I32()
	assert.NoError(t, err)
	assert.Equal(t, int32(0x20304050), vib)
}

func TestR64(t *testing.T) {
	content := []byte{0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80, 0x79}
	rl := NewReader(
		content,
		WithByteOrder(binary.LittleEndian),
	)

	rb := NewReader(
		content,
		WithByteOrder(binary.BigEndian),
	)

	vul, err := rl.U64()
	assert.NoError(t, err)
	assert.Equal(t, uint64(0x7980706050403020), vul)

	vub, err := rb.U64()
	assert.NoError(t, err)
	assert.Equal(t, uint64(0x2030405060708079), vub)

	rl.Reset()
	rb.Reset()

	vil, err := rl.I64()
	assert.NoError(t, err)
	assert.Equal(t, int64(0x7980706050403020), vil)

	vib, err := rb.I64()
	assert.NoError(t, err)
	assert.Equal(t, int64(0x2030405060708079), vib)
}

func TestRInt(t *testing.T) {
	content := []byte{0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x78, 0x79}
	r := NewReader(
		content,
		WithByteOrder(binary.LittleEndian),
	)

	vu8, err := r.UIntKind(pb.UIntKind_UINT_U8)
	assert.NoError(t, err)
	assert.Equal(t, uint64(0x20), vu8)

	vu16, err := r.UIntKind(pb.UIntKind_UINT_U16)
	assert.NoError(t, err)
	assert.Equal(t, uint64(0x4030), vu16)

	vu32, err := r.UIntKind(pb.UIntKind_UINT_U32)
	assert.NoError(t, err)
	assert.Equal(t, uint64(0x78706050), vu32)

	r.Reset()

	vi8, err := r.IntKind(pb.IntKind_INT_I8)
	assert.NoError(t, err)
	assert.Equal(t, int64(0x20), vi8)

	vi16, err := r.IntKind(pb.IntKind_INT_I16)
	assert.NoError(t, err)
	assert.Equal(t, int64(0x4030), vi16)

	vi32, err := r.IntKind(pb.IntKind_INT_I32)
	assert.NoError(t, err)
	assert.Equal(t, int64(0x78706050), vi32)
}

func TestRFloat(t *testing.T) {
	// https://baseconvert.com/ieee-754-floating-point
	content := []byte{
		0x41, 0x60, 0xD4, 0xFE, // float 14.052
		0x40, 0x2C, 0x1A, 0x9F, 0xBE, 0x76, 0xC8, 0xB4, // double 14.052
	}

	r := NewReader(
		content,
		WithByteOrder(binary.BigEndian),
	)

	v32, err := r.F32()
	assert.NoError(t, err)
	assert.InEpsilon(t, float32(14.052), v32, 1e-6)

	v64, err := r.F64()
	assert.NoError(t, err)
	assert.InEpsilon(t, float64(14.052), v64, 1e-6)

	r.Reset()

	vf_32, err := r.FloatKind(pb.FloatKind_F_F32)
	assert.NoError(t, err)
	assert.InEpsilon(t, float64(14.052), vf_32, 1e-6)

	vf_64, err := r.FloatKind(pb.FloatKind_F_F64)
	assert.NoError(t, err)
	assert.InEpsilon(t, float64(14.052), vf_64, 1e-6)
}

func TestRString(t *testing.T) {
	c1 := []byte{
		11,
		'H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd',
	}

	c2 := []byte{
		11, 0, 0, 0,
		'H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd',
	}

	r1 := NewReader(
		c1,
		WithByteOrder(binary.LittleEndian),
	)

	r2 := NewReader(
		c2,
		WithByteOrder(binary.LittleEndian),
	)

	ty1 := &pb.StringType{
		LengthType: pb.UIntKind_UINT_U8,
	}

	ty2 := &pb.StringType{
		LengthType: pb.UIntKind_UINT_U32,
	}

	v1, err := r1.String_(ty1)
	assert.NoError(t, err)
	assert.Equal(t, "Hello World", v1)

	v2, err := r2.String_(ty2)
	assert.NoError(t, err)
	assert.Equal(t, "Hello World", v2)
}

func TestREnum(t *testing.T) {
	content := []byte{0x20, 0x30, 0x21, 0x30}
	r := NewReader(
		content,
		WithByteOrder(binary.LittleEndian),
	)

	ty := pb.EnumType{
		EncodeType: pb.IntKind_INT_I16,
		Items: []*pb.EnumItem{
			{
				Name:  "ITEM-1",
				Value: 0x3020,
			},
			{
				Name:  "ITEM-2",
				Value: 0x3021,
			},
		},
	}

	v, err := r.Enum(&ty)
	assert.NoError(t, err)
	assert.Equal(t, "ITEM-1", v.Formatted)
	assert.Equal(t, int64(0x3020), v.Raw)
}

func TestRBitmask(t *testing.T) {
	content := []byte{0xFF, 0, 0, 0}
	r := NewReader(
		content,
		WithByteOrder(binary.LittleEndian),
	)

	ty := pb.EnumType{
		EncodeType: pb.IntKind_INT_U32,
		Items: []*pb.EnumItem{
			{
				Name:  "M0",
				Value: 1 << 0,
			},
			{
				Name:  "M1",
				Value: 1 << 1,
			},
			{
				Name:  "M2",
				Value: 1 << 2,
			},
			{
				Name:  "M3",
				Value: 1 << 3,
			},
		},
	}

	v, err := r.Bitmask(&ty)
	assert.NoError(t, err)
	assert.Equal(t, "M0|M1|M2|M3|0xf0", v.Formatted)
	assert.Equal(t, int64(0xFF), v.Raw)

	r.BitmaskExtraAsDec = true
	r.Reset()

	v, err = r.Bitmask(&ty)
	assert.NoError(t, err)
	assert.Equal(t, "M0|M1|M2|M3|240", v.Formatted)
	assert.Equal(t, int64(0xFF), v.Raw)
}

func TestRArray(t *testing.T) {
	rs := NewReader(
		[]byte{0xA, 0xB, 0xC, 0xD},
		WithByteOrder(binary.LittleEndian),
	)

	rd := NewReader(
		[]byte{4, 0xA, 0xB, 0xC, 0xD},
		WithByteOrder(binary.LittleEndian),
	)

	ty := pb.ArrayType{
		LengthType: pb.UIntKind_UINT_U8,
		Size: &pb.ArrayType_Static{
			Static: 4,
		},
		ElType: &pb.Type{
			Value: &pb.Type_Int{
				Int: &pb.IntType{
					Kind: pb.IntKind_INT_I8,
				},
			},
		},
	}

	expected := &pb.ArrayValue{
		Value: []*pb.Value{
			{Value: &pb.Value_I{I: 0xA}},
			{Value: &pb.Value_I{I: 0xB}},
			{Value: &pb.Value_I{I: 0xC}},
			{Value: &pb.Value_I{I: 0xD}},
		},
	}

	enc, err := proto.Marshal(expected)
	assert.NoError(t, err)

	v1, err := rs.Array(&ty)
	assert.NoError(t, err)

	v1Enc, err := proto.Marshal(v1)
	assert.NoError(t, err)

	assert.EqualValues(t, enc, v1Enc)

	ty.Size = &pb.ArrayType_Dynamic{}

	v2, err := rd.Array(&ty)
	assert.NoError(t, err)

	v2Enc, err := proto.Marshal(v2)
	assert.NoError(t, err)

	assert.EqualValues(t, enc, v2Enc)
}

func TestRBytes(t *testing.T) {
	rs := NewReader(
		[]byte{0xA, 0xB, 0xC, 0xD},
		WithByteOrder(binary.LittleEndian),
	)

	rd := NewReader(
		[]byte{4, 0xA, 0xB, 0xC, 0xD},
		WithByteOrder(binary.LittleEndian),
	)

	ty := pb.BytesType{
		LengthType: pb.UIntKind_UINT_U8,
		Size: &pb.BytesType_Static{
			Static: 4,
		},
		Kind: pb.NumberKind_NUMBER_I8,
	}

	expected := &pb.BytesValue{
		Kind:      pb.NumberKind_NUMBER_I8,
		BigEndian: false,
		Value:     []byte{0xA, 0xB, 0xC, 0xD},
	}

	enc, err := proto.Marshal(expected)
	assert.NoError(t, err)

	v1, err := rs.Bytes(&ty)
	assert.NoError(t, err)

	v1Enc, err := proto.Marshal(v1)
	assert.NoError(t, err)

	assert.EqualValues(t, enc, v1Enc)

	ty.Size = &pb.BytesType_Dynamic{}

	v2, err := rd.Bytes(&ty)
	assert.NoError(t, err)

	v2Enc, err := proto.Marshal(v2)
	assert.NoError(t, err)

	assert.EqualValues(t, enc, v2Enc)
}

func TestRArrayBytesBounds(t *testing.T) {
	rd := NewReader(
		[]byte{5, 0xA, 0xB, 0xC, 0xD, 0xE},
		WithByteOrder(binary.LittleEndian),
	)

	tyA := pb.ArrayType{
		LengthType: pb.UIntKind_UINT_U8,
		Size: &pb.ArrayType_Dynamic{
			Dynamic: &pb.BoundedArraySize{
				Max: 4,
			},
		},
		ElType: &pb.Type{
			Value: &pb.Type_Int{
				Int: &pb.IntType{
					Kind: pb.IntKind_INT_I8,
				},
			},
		},
	}

	tyB := pb.BytesType{
		LengthType: pb.UIntKind_UINT_U8,
		Size: &pb.BytesType_Dynamic{
			Dynamic: &pb.BoundedArraySize{
				Max: 4,
			},
		},
		Kind: pb.NumberKind_NUMBER_I8,
	}

	_, err := rd.Array(&tyA)
	assert.ErrorIs(t, err, ErrBounds)

	rd.Reset()

	_, err = rd.Bytes(&tyB)
	assert.ErrorIs(t, err, ErrBounds)
}

func TestRObject(t *testing.T) {
	r := NewReader(
		[]byte{
			0xA, 0xB, 0xC, 0xD, // u32
			0x1, 0x2, // i16
			0x00, 0x00, // pad
			6, 'S', 't', 'r', 'i', 'n', 'g',
			0x48, 0x43, 0xA6, 0x40, // f32 200345
		},
		WithByteOrder(binary.BigEndian),
	)

	ty := pb.ObjectType{
		Fields: []*pb.Field{
			{
				Name: "f1",
				Type: &pb.Type{
					Value: &pb.Type_Int{
						Int: &pb.IntType{
							Kind: pb.IntKind_INT_U32,
						},
					},
				},
			},
			{
				Name: "f2",
				Type: &pb.Type{
					Value: &pb.Type_Int{
						Int: &pb.IntType{
							Kind: pb.IntKind_INT_I16,
						},
					},
				},
			},
			{
				Name: "",
				Type: &pb.Type{
					Value: &pb.Type_Void{
						Void: &pb.VoidType{
							Size: 2,
						},
					},
				},
			},
			{
				Name: "f3",
				Type: &pb.Type{
					Value: &pb.Type_String_{
						String_: &pb.StringType{
							LengthType: pb.UIntKind_UINT_U8,
						},
					},
				},
			},
			{
				Name: "f4",
				Type: &pb.Type{
					Value: &pb.Type_Float{
						Float: &pb.FloatType{
							Kind: pb.FloatKind_F_F32,
						},
					},
				},
			},
		},
	}

	expected := &pb.ObjectValue{
		O: map[string]*pb.Value{
			"f1": {
				Value: &pb.Value_U{
					U: 0x0A0B0C0D,
				},
			},
			"f2": {
				Value: &pb.Value_I{
					I: 0x0102,
				},
			},
			"f3": {
				Value: &pb.Value_S{
					S: "String",
				},
			},
			"f4": {
				Value: &pb.Value_F{
					F: 200345,
				},
			},
		},
	}

	v1, err := r.Object(&ty)
	assert.NoError(t, err)
	assert.EqualValues(t, expected, v1)
}

func TestREOF(t *testing.T) {
	r := NewReader(
		[]byte{},
		WithByteOrder(binary.BigEndian),
	)

	_, err := r.U8()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.I8()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.U16()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.I16()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.U32()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.I32()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.U64()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.I64()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.F32()
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.F64()
	assert.ErrorIs(t, err, io.EOF)

	_, err = r.UIntKind(pb.UIntKind_UINT_U8)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.UIntKind(pb.UIntKind_UINT_U16)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.UIntKind(pb.UIntKind_UINT_U32)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.UIntKind(pb.UIntKind_UINT_U64)
	assert.ErrorIs(t, err, io.EOF)

	_, err = r.IntKind(pb.IntKind_INT_I8)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.IntKind(pb.IntKind_INT_I16)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.IntKind(pb.IntKind_INT_I32)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.IntKind(pb.IntKind_INT_I64)
	assert.ErrorIs(t, err, io.EOF)

	_, err = r.IntKind(pb.IntKind_INT_U8)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.IntKind(pb.IntKind_INT_U16)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.IntKind(pb.IntKind_INT_U32)
	assert.ErrorIs(t, err, io.EOF)
	_, err = r.IntKind(pb.IntKind_INT_U64)
	assert.ErrorIs(t, err, io.EOF)
}

func TestRErrKind(t *testing.T) {
	r := NewReader(
		[]byte{},
		WithByteOrder(binary.BigEndian),
	)

	_, err := r.IntKind(0xFF)
	assert.ErrorIs(t, err, ErrKind)

	_, err = r.UIntKind(0xFF)
	assert.ErrorIs(t, err, ErrKind)

	_, err = r.FloatKind(0xFF)
	assert.ErrorIs(t, err, ErrKind)

	_, err = r.Type(nil)
	assert.ErrorIs(t, err, ErrKind)
}
