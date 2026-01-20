package pb

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestValueToAny(t *testing.T) {
	opts := ConversionOptions{
		EnumAsInt:         false,
		IgnoreBytesEndian: false,
	}

	v, err := ValueToAny(&Value{Value: &Value_I{I: -10}}, opts)
	assert.NoError(t, err)
	assert.EqualValues(t, -10, v)

	v, err = ValueToAny(&Value{Value: &Value_U{U: 10}}, opts)
	assert.NoError(t, err)
	assert.EqualValues(t, 10, v)

	v, err = ValueToAny(&Value{Value: &Value_F{F: 25.4}}, opts)
	assert.NoError(t, err)
	assert.EqualValues(t, 25.4, v)

	v, err = ValueToAny(&Value{Value: &Value_B{B: true}}, opts)
	assert.NoError(t, err)
	assert.EqualValues(t, true, v)

	v, err = ValueToAny(&Value{Value: &Value_S{S: "Good day"}}, opts)
	assert.NoError(t, err)
	assert.EqualValues(t, "Good day", v)

	v, err = ValueToAny(&Value{Value: &Value_E{E: &EnumValue{
		Formatted: "VALUE-1",
		Raw:       1,
	}}}, opts)
	assert.NoError(t, err)
	assert.EqualValues(t, "VALUE-1", v)

	v, err = ValueToAny(&Value{Value: &Value_E{E: &EnumValue{
		Formatted: "VALUE-1",
		Raw:       1,
	}}}, ConversionOptions{EnumAsInt: true})
	assert.NoError(t, err)
	assert.EqualValues(t, 1, v)

	v, err = ValueToAny(&Value{Value: &Value_O{O: &ObjectValue{
		O: map[string]*Value{
			"key1": {Value: &Value_E{E: &EnumValue{
				Formatted: "VALUE-1",
				Raw:       1,
			}}},
			"key2": {Value: &Value_S{S: "Good day"}},
			"key3": {Value: &Value_U{U: 10}},
		},
	}}}, opts)
	assert.NoError(t, err)
	assert.EqualValues(t, map[string]any{
		"key1": "VALUE-1",
		"key2": "Good day",
		"key3": uint64(10),
	}, v)

	v, err = ValueToAny(&Value{Value: &Value_A{A: &ArrayValue{
		Value: []*Value{
			{Value: &Value_S{S: "S1"}},
			{Value: &Value_S{S: "S2"}},
			{Value: &Value_S{S: "S3"}},
			{Value: &Value_S{S: "S4"}},
		},
	}}}, opts)
	assert.NoError(t, err)
	assert.EqualValues(t, []any{
		"S1",
		"S2",
		"S3",
		"S4",
	}, v)
}

func TestValueToAnyBytesNativeEndian(t *testing.T) {
	raw := []byte{
		0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
		0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8,
		0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8,
	}

	bv := &BytesValue{Value: raw, BigEndian: isBigEndian}
	pbV := &Value{Value: &Value_R{R: bv}}

	bv.Kind = NumberKind_NUMBER_U8
	v, err := ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []uint8{
		0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
		0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8,
		0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8,
	}, v)

	bv.Kind = NumberKind_NUMBER_I8
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []int8{
		0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
		-95, -94, -93, -92, -91, -90, -89, -88,
		-79, -78, -77, -76, -75, -74, -73, -72,
	}, v)

	bv.Kind = NumberKind_NUMBER_U16
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []uint16{
		0x201, 0x403, 0x605, 0x807, 0xa2a1, 0xa4a3, 0xa6a5, 0xa8a7, 0xb2b1, 0xb4b3, 0xb6b5, 0xb8b7,
	}, v)

	bv.Kind = NumberKind_NUMBER_I16
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []int16{
		513, 1027, 1541, 2055, -23903, -23389, -22875, -22361, -19791, -19277, -18763, -18249,
	}, v)

	bv.Kind = NumberKind_NUMBER_U32
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []uint32{
		0x4030201, 0x8070605, 0xa4a3a2a1, 0xa8a7a6a5, 0xb4b3b2b1, 0xb8b7b6b5,
	}, v)

	bv.Kind = NumberKind_NUMBER_I32
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []int32{
		67305985, 134678021, -1532779871, -1465407835, -1263291727, -1195919691,
	}, v)

	bv.Kind = NumberKind_NUMBER_U64
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []uint64{
		0x807060504030201, 0xa8a7a6a5a4a3a2a1, 0xb8b7b6b5b4b3b2b1,
	}, v)

	bv.Kind = NumberKind_NUMBER_I64
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []int64{
		578437695752307201, -6293878723864976735, -5136435958455749967,
	}, v)

	// Reasonable bytestrings for f32 and f64
	rawF32 := []byte{
		0x00, 0x00, 0xcc, 0x41,
		0x00, 0x80, 0xa0, 0x42,
		0x00, 0x40, 0xfa, 0x42,
		0x00, 0x20, 0x17, 0x44,
		0x00, 0x00, 0x81, 0x3f,
		0x00, 0x00, 0x80, 0x3b,
	}

	rawF64 := []byte{
		0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x39, 0x40,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x54, 0x40,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x5f, 0x40,
		0x00, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x82, 0x40,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0xf0, 0x3f,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x70, 0x3f,
	}

	bv.Kind = NumberKind_NUMBER_F32
	bv.Value = rawF32
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []float32{
		25.5,
		80.25,
		125.125,
		604.5,
		1.0078125,
		0.00390625,
	}, v)

	bv.Kind = NumberKind_NUMBER_F64
	bv.Value = rawF64
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []float64{
		25.5,
		80.25,
		125.125,
		604.5,
		1.0078125,
		0.00390625,
	}, v)

}

func TestValueToAnyBytesSwapEndian(t *testing.T) {
	raw := []byte{
		0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
		0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8,
		0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8,
	}

	bv := &BytesValue{Value: raw, BigEndian: !isBigEndian}
	pbV := &Value{Value: &Value_R{R: bv}}

	bv.Kind = NumberKind_NUMBER_U8
	v, err := ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []uint8{
		0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
		0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8,
		0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8,
	}, v)

	bv.Kind = NumberKind_NUMBER_I8
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []int8{
		0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
		-95, -94, -93, -92, -91, -90, -89, -88,
		-79, -78, -77, -76, -75, -74, -73, -72,
	}, v)

	bv.Kind = NumberKind_NUMBER_U16
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []uint16{
		0x102, 0x304, 0x506, 0x708, 0xa1a2, 0xa3a4, 0xa5a6, 0xa7a8, 0xb1b2, 0xb3b4, 0xb5b6, 0xb7b8,
	}, v)

	bv.Kind = NumberKind_NUMBER_I16
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []int16{
		258, 772, 1286, 1800, -24158, -23644, -23130, -22616, -20046, -19532, -19018, -18504,
	}, v)

	bv.Kind = NumberKind_NUMBER_U32
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []uint32{
		0x1020304, 0x5060708, 0xa1a2a3a4, 0xa5a6a7a8, 0xb1b2b3b4, 0xb5b6b7b8,
	}, v)

	bv.Kind = NumberKind_NUMBER_I32
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []int32{
		16909060, 84281096, -1583176796, -1515804760, -1313688652, -1246316616,
	}, v)

	bv.Kind = NumberKind_NUMBER_U64
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []uint64{
		0x102030405060708, 0xa1a2a3a4a5a6a7a8, 0xb1b2b3b4b5b6b7b8,
	}, v)

	bv.Kind = NumberKind_NUMBER_I64
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []int64{
		72623859790382856, -6799692559826901080, -5642249794417674312,
	}, v)

	// Reasonable bytestrings for f32 and f64
	rawF32 := []byte{
		0x41, 0xcc, 0x00, 0x00,
		0x42, 0xa0, 0x80, 0x00,
		0x42, 0xfa, 0x40, 0x00,
		0x44, 0x17, 0x20, 0x00,
		0x3f, 0x81, 0x00, 0x00,
		0x3b, 0x80, 0x00, 0x00,
	}

	rawF64 := []byte{
		0x40, 0x39, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x40, 0x54, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x40, 0x5f, 0x48, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x40, 0x82, 0xe4, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x3f, 0xf0, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x3f, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	}

	bv.Kind = NumberKind_NUMBER_F32
	bv.Value = rawF32
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []float32{
		25.5,
		80.25,
		125.125,
		604.5,
		1.0078125,
		0.00390625,
	}, v)

	bv.Kind = NumberKind_NUMBER_F64
	bv.Value = rawF64
	v, err = ValueToAny(pbV, ConversionOptions{})
	assert.NoError(t, err)
	assert.Equal(t, []float64{
		25.5,
		80.25,
		125.125,
		604.5,
		1.0078125,
		0.00390625,
	}, v)
}

func TestValueToAnyErr(t *testing.T) {
	raw := []byte{
		0x01, 0x02, 0x03,
	}

	bv := &BytesValue{Value: raw}
	pbV := &Value{Value: &Value_R{R: bv}}

	bv.Kind = NumberKind_NUMBER_U16
	_, err := ValueToAny(pbV, ConversionOptions{})
	assert.ErrorIs(t, err, ErrInvalidSize)

	bv.Kind = NumberKind_NUMBER_U32
	_, err = ValueToAny(pbV, ConversionOptions{})
	assert.ErrorIs(t, err, ErrInvalidSize)

	bv.Kind = NumberKind_NUMBER_U64
	_, err = ValueToAny(pbV, ConversionOptions{})
	assert.ErrorIs(t, err, ErrInvalidSize)

	bv.BigEndian = !isBigEndian

	bv.Kind = NumberKind_NUMBER_U16
	_, err = ValueToAny(pbV, ConversionOptions{})
	assert.ErrorIs(t, err, ErrInvalidSize)

	bv.Kind = NumberKind_NUMBER_U32
	_, err = ValueToAny(pbV, ConversionOptions{})
	assert.ErrorIs(t, err, ErrInvalidSize)

	bv.Kind = NumberKind_NUMBER_U64
	_, err = ValueToAny(pbV, ConversionOptions{})
	assert.ErrorIs(t, err, ErrInvalidSize)

	pov := &Value{Value: &Value_O{
		O: &ObjectValue{
			O: map[string]*Value{
				"key": pbV,
			},
		},
	}}
	_, err = ValueToAny(pov, ConversionOptions{})
	assert.ErrorIs(t, err, ErrInvalidSize)

	pav := &Value{Value: &Value_A{
		A: &ArrayValue{
			Value: []*Value{
				pbV,
			},
		},
	}}
	_, err = ValueToAny(pav, ConversionOptions{})
	assert.ErrorIs(t, err, ErrInvalidSize)

	bv.Kind = 0xFF
	_, err = ValueToAny(pbV, ConversionOptions{})
	assert.Error(t, err)

	_, err = ValueToAny(&Value{}, ConversionOptions{})
	assert.Error(t, err)
}
