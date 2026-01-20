package serial

import (
	"encoding/binary"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/nasa/hermes/pkg/pb"
)

func TestWBool(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.LittleEndian))

	w.Boolean(&pb.BooleanType{EncodeType: pb.UIntKind_UINT_U8}, true)
	w.Boolean(&pb.BooleanType{EncodeType: pb.UIntKind_UINT_U8}, false)

	assert.Equal(
		t,
		w.Get(),
		[]byte{0x1, 0x0},
	)
}

func TestW8(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.LittleEndian))

	w.U8(0x10)
	w.I8(-124)

	assert.Equal(
		t,
		w.Get(),
		[]byte{0x10, 0x84},
	)
}

func TestW16(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.LittleEndian))

	w.U16(0x1245)
	w.I16(-32123)

	assert.Equal(
		t,
		w.Get(),
		[]byte{0x45, 0x12, 0x85, 0x82},
	)
}

func TestW32(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.LittleEndian))

	w.U32(0x12453413)
	w.I32(-12598123)

	assert.Equal(
		t,
		w.Get(),
		[]byte{
			0x13, 0x34, 0x45, 0x12,
			0x95, 0xC4, 0x3F, 0xFF,
		},
	)
}

func TestW64(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.LittleEndian))

	w.U64(0x123456789ABCDEFF)
	w.I64(-19496747175746414)

	assert.Equal(
		t,
		w.Get(),
		[]byte{
			0xFF, 0xDE, 0xBC, 0x9A, 0x78, 0x56, 0x34, 0x12,
			0x92, 0x64, 0x50, 0xCE, 0xCF, 0xBB, 0xBA, 0xFF,
		},
	)
}

func TestWF(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.BigEndian))

	w.F32(14.052)
	w.F64(14.052)

	assert.Equal(
		t,
		w.Get(),
		[]byte{
			0x41, 0x60, 0xD4, 0xFE,
			0x40, 0x2C, 0x1A, 0x9F, 0xBE, 0x76, 0xC8, 0xB4,
		},
	)
}

func TestWString(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.LittleEndian))

	w.String_(&pb.StringType{LengthType: pb.UIntKind_UINT_U8}, "Hello World")
	w.String_(&pb.StringType{LengthType: pb.UIntKind_UINT_U32}, "Hello World")

	assert.Equal(
		t,
		[]byte{
			11,
			'H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd',
			11, 0, 0, 0,
			'H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd',
		},
		w.Get(),
	)
}

func TestWEnum(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.LittleEndian))

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

	w.EnumInt(&ty, 32)
	w.EnumString(&ty, "ITEM-1")

	assert.Equal(
		t,
		[]byte{
			0x20, 0,
			0x20, 0x30,
		},
		w.Get(),
	)
}

func TestWBitmask(t *testing.T) {
	w := NewWriter(WithWriterByteOrder(binary.LittleEndian))

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

	err := w.BitmaskString(&ty, "M0|M1|M2|M3|0xf0|1")
	assert.NoError(t, err)

	err = w.BitmaskInt(&ty, 0xFF)
	assert.NoError(t, err)

	assert.Equal(
		t,
		[]byte{
			0xFF, 0, 0, 0,
			0xFF, 0, 0, 0,
		},
		w.Get(),
	)
}

func TestWBytes(t *testing.T) {
	bytes := [][]byte{
		{1, 2, 3},
		{1, 2, 3, 4},
		{1, 2, 3, 4, 5},
	}

	w := NewWriter(WithWriterByteOrder(binary.BigEndian))

	err := w.Bytes(
		&pb.BytesType{
			Kind:       pb.NumberKind_NUMBER_U8,
			LengthType: pb.UIntKind_UINT_U8,
		},
		&pb.BytesValue{
			BigEndian: true,
			Kind:      pb.NumberKind_NUMBER_U8,
			Value:     bytes[0],
		},
	)

	assert.NoError(t, err)

	err = w.Bytes(
		&pb.BytesType{
			Kind:       pb.NumberKind_NUMBER_U8,
			LengthType: pb.UIntKind_UINT_U16,
		},
		&pb.BytesValue{
			BigEndian: true,
			Kind:      pb.NumberKind_NUMBER_U8,
			Value:     bytes[1],
		},
	)

	assert.NoError(t, err)

	err = w.Bytes(
		&pb.BytesType{
			Kind:       pb.NumberKind_NUMBER_U8,
			LengthType: pb.UIntKind_UINT_U32,
		},
		&pb.BytesValue{
			BigEndian: true,
			Kind:      pb.NumberKind_NUMBER_U8,
			Value:     bytes[2],
		},
	)

	assert.NoError(t, err)

	err = w.Bytes(
		&pb.BytesType{
			Kind:       pb.NumberKind_NUMBER_U8,
			LengthType: pb.UIntKind_UINT_U32,
			Size: &pb.BytesType_Dynamic{
				Dynamic: &pb.BoundedArraySize{
					Min: 0,
					Max: 4,
				},
			},
		},
		&pb.BytesValue{
			BigEndian: true,
			Kind:      pb.NumberKind_NUMBER_U8,
			Value:     bytes[2],
		},
	)

	assert.EqualError(t, err, "bytes size out of bounds 0x1 <= 5 <= 4x1")

	err = w.Bytes(
		&pb.BytesType{
			Kind:       pb.NumberKind_NUMBER_U8,
			LengthType: pb.UIntKind_UINT_U32,
			Size: &pb.BytesType_Static{
				Static: 4,
			},
		},
		&pb.BytesValue{
			BigEndian: true,
			Kind:      pb.NumberKind_NUMBER_U8,
			Value:     bytes[2],
		},
	)

	assert.EqualError(t, err, "statically sized bytes invalid size (expected) 4x1 != (got) 5")

	err = w.Bytes(
		&pb.BytesType{
			Kind:       pb.NumberKind_NUMBER_U8,
			LengthType: pb.UIntKind_UINT_U32,
			Size: &pb.BytesType_Static{
				Static: 5,
			},
		},
		&pb.BytesValue{
			BigEndian: true,
			Kind:      pb.NumberKind_NUMBER_U8,
			Value:     bytes[2],
		},
	)

	assert.NoError(t, err)

	assert.EqualValues(
		t,
		[]byte{
			3, 1, 2, 3,
			0, 4, 1, 2, 3, 4,
			0, 0, 0, 5, 1, 2, 3, 4, 5,
			1, 2, 3, 4, 5,
		},
		w.Get(),
	)
}
