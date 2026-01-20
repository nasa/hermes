package cmd

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/nasa/hermes/pkg/pb"
)

func TestCmdLexer(t *testing.T) {
	assert.EqualValues(t, []string{
		"hello", "WORLD",
	}, Lex("hello WORLD   "))

	assert.EqualValues(t, []string{
		"hello", "WORLD",
	}, Lex("hello,WORLD ,,  "))

	assert.EqualValues(t, []string{
		"hello", "WORLD", "quoted string",
	}, Lex("hello,WORLD ,\"quoted string\",  "))

	assert.EqualValues(t, []string{
		"hello", "WORLD", "escaped \" string",
	}, Lex("hello,WORLD ,\"escaped \\\" string\",  "))
}

func TestCmdEmptyStringLex(t *testing.T) {
	assert.EqualValues(
		t, []string{
			"CBM_MOD_FP_UHF_WNDW",
			"5",
			"2000_BPS",
			"256000_BPS",
			"SHORT_UE_UHF_PRIME_8250",
			"BITSTREAM_8250",
			"1",
			"ALL",
			"1",
			"TEST_25K",
			"RUHF_PRIME",
			"",
		},
		Lex(`CBM_MOD_FP_UHF_WNDW 5 2000_BPS 256000_BPS SHORT_UE_UHF_PRIME_8250 BITSTREAM_8250 1 ALL 1 TEST_25K RUHF_PRIME ""`),
	)
}

var bitmaskType = &pb.Type{
	Value: &pb.Type_Bitmask{
		Bitmask: &pb.EnumType{
			Items: []*pb.EnumItem{
				{
					Name:  "MASK_0",
					Value: 1 << 0,
				},
				{
					Name:  "MASK_1",
					Value: 1 << 1,
				},
				{
					Name:  "MASK_2",
					Value: 1 << 2,
				},
				{
					Name:  "MASK_3",
					Value: 1 << 3,
				},
			},
		},
	},
}

var enumType = &pb.Type{
	Value: &pb.Type_Enum{
		Enum: &pb.EnumType{
			Items: []*pb.EnumItem{
				{
					Name:  "ITEM_0",
					Value: 0,
				},
				{
					Name:  "ITEM_1",
					Value: 1,
				},
				{
					Name:  "ITEM_2",
					Value: 2,
				},
				{
					Name:  "ITEM_3",
					Value: 3,
				},
			},
		},
	},
}

var boolType = &pb.Type{
	Value: &pb.Type_Bool{Bool: &pb.BooleanType{}},
}

var bytesType = &pb.Type{
	Value: &pb.Type_Bytes{Bytes: &pb.BytesType{}},
}

var floatType = &pb.Type{
	Value: &pb.Type_Float{Float: &pb.FloatType{}},
}

var i16Type = &pb.Type{
	Value: &pb.Type_Int{Int: &pb.IntType{
		Kind: pb.IntKind_INT_I16,
	}}}

var u16Type = &pb.Type{
	Value: &pb.Type_Int{Int: &pb.IntType{
		Kind: pb.IntKind_INT_U16,
	}},
}
var stringType = &pb.Type{
	Value: &pb.Type_String_{String_: &pb.StringType{}},
}

func TestCmdParserPrimitives(t *testing.T) {
	args, err := ParseCommand(&pb.CommandDef{
		Arguments: []*pb.Field{
			{Name: "1", Type: bitmaskType},
			{Name: "2", Type: enumType},
			{Name: "3", Type: boolType},
			{Name: "4", Type: bytesType},
			{Name: "5", Type: floatType},
			{Name: "6", Type: i16Type},
			{Name: "7", Type: u16Type},
			{Name: "8", Type: stringType},
		},
	}, []string{
		"MASK_0|MASK_1|0x10",
		"ITEM_2",
		"TRUE",
		"hello world",
		"3.14",
		"-32",
		"32",
		"another string",
	})

	assert.NoError(t, err)

	assert.EqualValues(t, []*pb.Value{
		{Value: &pb.Value_E{E: &pb.EnumValue{
			Raw:       (1 << 0) | (1 << 1) | 0x10,
			Formatted: "MASK_0|MASK_1|0x10",
		}}},
		{Value: &pb.Value_E{E: &pb.EnumValue{
			Raw:       2,
			Formatted: "ITEM_2",
		}}},
		{Value: &pb.Value_B{B: true}},
		{Value: &pb.Value_R{R: &pb.BytesValue{
			Value: []byte("hello world"),
		}}},
		{Value: &pb.Value_F{F: 3.14}},
		{Value: &pb.Value_I{I: -32}},
		{Value: &pb.Value_U{U: 32}},
		{Value: &pb.Value_S{S: "another string"}},
	}, args)
}

func TestCmdParserArrays(t *testing.T) {
	args, err := ParseCommand(&pb.CommandDef{
		Arguments: []*pb.Field{
			{Name: "1", Type: &pb.Type{
				Value: &pb.Type_Array{Array: &pb.ArrayType{
					ElType: floatType,
					Size: &pb.ArrayType_Static{
						Static: 2,
					},
				}},
			}},
			{Name: "2", Type: &pb.Type{
				Value: &pb.Type_Array{Array: &pb.ArrayType{
					ElType: floatType,
					Size:   &pb.ArrayType_Dynamic{},
				}},
			}},
			{Name: "3", Type: &pb.Type{
				Value: &pb.Type_Array{Array: &pb.ArrayType{
					ElType: floatType,
					Size:   &pb.ArrayType_Dynamic{},
				}}},
				Metadata: `{"omitLengthPrefix":true}`,
			},
		},
	}, []string{
		"5.12",
		"6.12",

		"3",
		"7.12",
		"8.12",
		"9.12",

		"10.12",
		"11.12",
		"12.12",
		"13.12",
	})

	assert.NoError(t, err)

	assert.EqualValues(t, []*pb.Value{
		{Value: &pb.Value_A{A: &pb.ArrayValue{
			Value: []*pb.Value{
				{Value: &pb.Value_F{F: 5.12}},
				{Value: &pb.Value_F{F: 6.12}},
			},
		}}},
		{Value: &pb.Value_A{A: &pb.ArrayValue{
			Value: []*pb.Value{
				{Value: &pb.Value_F{F: 7.12}},
				{Value: &pb.Value_F{F: 8.12}},
				{Value: &pb.Value_F{F: 9.12}},
			},
		}}},
		{Value: &pb.Value_A{A: &pb.ArrayValue{
			Value: []*pb.Value{
				{Value: &pb.Value_F{F: 10.12}},
				{Value: &pb.Value_F{F: 11.12}},
				{Value: &pb.Value_F{F: 12.12}},
				{Value: &pb.Value_F{F: 13.12}},
			},
		}}},
	}, args)
}

func TestCmdWithoutOmitLengthPrefix(t *testing.T) {
	args, err := ParseCommand(&pb.CommandDef{
		Arguments: []*pb.Field{
			{Name: "3", Type: &pb.Type{
				Value: &pb.Type_Array{Array: &pb.ArrayType{
					ElType: floatType,
					Size:   &pb.ArrayType_Dynamic{},
				}}},
				Metadata: `{"omitLengthPrefix":true}`,
			},
		},
	}, []string{
		"4",
		"10.12",
		"11.12",
		"12.12",
		"13.12",
	}, WithoutOmitLengthPrefix())

	assert.NoError(t, err)

	assert.EqualValues(t, []*pb.Value{
		{Value: &pb.Value_A{A: &pb.ArrayValue{
			Value: []*pb.Value{
				{Value: &pb.Value_F{F: 10.12}},
				{Value: &pb.Value_F{F: 11.12}},
				{Value: &pb.Value_F{F: 12.12}},
				{Value: &pb.Value_F{F: 13.12}},
			},
		}}},
	}, args)
}
