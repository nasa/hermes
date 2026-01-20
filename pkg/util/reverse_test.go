package util

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReverse(t *testing.T) {
	input := []int{1, 2, 3, 4, 5}
	assert.EqualValues(t, []int{5, 4, 3, 2, 1}, Reverse(input))
}
