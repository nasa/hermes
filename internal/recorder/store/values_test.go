package store

import (
	"math"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFloatValueWidensThroughShortestDecimal(t *testing.T) {
	assert.Equal(t, 0.1, FloatValue(0.1).Float.Float64)
	assert.Equal(t, 3.1415927, FloatValue(3.1415927).Float.Float64)
	assert.Equal(t, 16.0, FloatValue(16).Float.Float64)

	for _, v := range []float32{
		0.1, -2.5e-7, math.MaxFloat32, math.SmallestNonzeroFloat32, float32(math.Inf(1)), float32(math.Inf(-1)),
	} {
		assert.Equal(t, v, float32(FloatValue(v).Float.Float64), "%g", v)
	}
	assert.True(t, math.IsNaN(FloatValue(float32(math.NaN())).Float.Float64))
}

func TestTextValuesReplaceNulAndInvalidUTF8(t *testing.T) {
	assert.Equal(t, "abc�def", StringValue("abc\x00def").String.String)
	assert.Equal(t, "abc�def", StringValue("abc\xff\xfedef").String.String)
	assert.Equal(t, "��", StringValue("\x80\x00").String.String)
	assert.Equal(t, "héllo", StringValue("héllo").String.String)
	assert.Equal(t, "ON�", EnumeratedValue(1, "ON\x00").String.String)
}
