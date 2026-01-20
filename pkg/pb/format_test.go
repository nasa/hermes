package pb

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFormat(t *testing.T) {
	assert.Equal(t, "20", fmt.Sprintf("%v", &Value{Value: &Value_I{I: 20}}))
	assert.Equal(t, "-20", fmt.Sprintf("%s", &Value{Value: &Value_I{I: -20}}))
	assert.Equal(t, "30", fmt.Sprintf("%s", &Value{Value: &Value_U{U: 30}}))
	assert.Equal(t, "0x10", fmt.Sprintf("0x%x", &Value{Value: &Value_U{U: 16}}))
	assert.Equal(t, "345.5", fmt.Sprintf("%s", &Value{Value: &Value_F{F: 345.5}}))
	assert.Equal(t, "345.500", fmt.Sprintf("%.3f", &Value{Value: &Value_F{F: 345.5}}))
	assert.Equal(t, "false", fmt.Sprintf("%.3f", &Value{Value: &Value_B{B: false}}))
	assert.Equal(t, "true", fmt.Sprintf("%.3f", &Value{Value: &Value_B{B: true}}))
	assert.Equal(t, "STRING", fmt.Sprintf("%d", &Value{Value: &Value_S{S: "STRING"}}))
	assert.Equal(t, "ENUM", fmt.Sprintf("%d", &Value{Value: &Value_E{E: &EnumValue{Formatted: "ENUM"}}}))
	assert.Equal(t, "20", fmt.Sprintf("%d", &Value{Value: &Value_E{E: &EnumValue{Raw: 20}}}))
	assert.Equal(t, "[01 02 03 04]", fmt.Sprintf("%d", &Value{Value: &Value_R{R: &BytesValue{
		Value: []byte{1, 2, 3, 4},
	}}}))
	assert.Equal(t, "{\"key1\": \"A String\", \"key2\": 345.5, \"key3\": \"ENUM\", \"key4\": 20}", fmt.Sprintf("%d", &Value{Value: &Value_O{O: &ObjectValue{
		O: map[string]*Value{
			"key1": {Value: &Value_S{S: "A String"}},
			"key2": {Value: &Value_F{F: 345.5}},
			"key3": {Value: &Value_E{E: &EnumValue{Formatted: "ENUM"}}},
			"key4": {Value: &Value_E{E: &EnumValue{Raw: 20}}},
		},
	}}}))

	assert.Equal(t, "[\"A String\", 345.5, \"ENUM\", 20]", fmt.Sprintf("%d", &Value{Value: &Value_A{A: &ArrayValue{
		Value: []*Value{
			{Value: &Value_S{S: "A String"}},
			{Value: &Value_F{F: 345.5}},
			{Value: &Value_E{E: &EnumValue{Formatted: "ENUM"}}},
			{Value: &Value_E{E: &EnumValue{Raw: 20}}},
		},
	}}}))
}
