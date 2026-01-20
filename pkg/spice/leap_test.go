package spice

import (
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestLeapSecondLoad(t *testing.T) {
	c, err := os.ReadFile("testdata/m2020.tls")
	if !assert.NoError(t, err) {
		return
	}

	k := TextKernel{}
	err = k.Load("testdata/m2020.tls", string(c))
	if !assert.NoError(t, err) {
		return
	}

	err = LoadLeapSeconds(&k)
	if !assert.NoError(t, err) {
		return
	}

	assert.Equal(t, 1.657e-3, det.K)
	assert.Equal(t, 1.671e-2, det.EB)
	assert.EqualValues(t, [2]float64{6.239996e0, 1.99096871e-7}, det.M)
	assert.EqualValues(t, []int64{
		-883656000, // Jan 1972 (J2000)
		-867931200, // Jul 1972
		-852033600,
		-820497600,
	}, leapseconds.UtcTime[:4])
}

// Make sure the leap second dates can be parsed properly
func TestLoadDate(t *testing.T) {
	ti, err := time.Parse("2006-Jan-2", "1972-JAN-1")
	if !assert.NoError(t, err) {
		return
	}

	assert.EqualValues(
		t,
		time.Date(1972, time.January, 1, 0, 0, 0, 0, time.UTC),
		ti,
	)
}
