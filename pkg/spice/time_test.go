package spice_test

import (
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/nasa/hermes/pkg/spice"
)

func loadM20Sclk(t assert.TestingT) *spice.SclkKernel {
	c, err := os.ReadFile("testdata/m2020.tsc")
	if !assert.NoError(t, err) {
		return nil
	}

	k := spice.TextKernel{}
	err = k.Load("testdata/m2020.tsc", string(c))
	if !assert.NoError(t, err) {
		return nil
	}

	sclkKernel, err := spice.NewSclkKernel(&k, "168")
	if !assert.NoError(t, err) {
		return nil
	}

	c, err = os.ReadFile("testdata/m2020.tls")
	if !assert.NoError(t, err) {
		return nil
	}

	err = k.Load("testdata/m2020.tls", string(c))
	if !assert.NoError(t, err) {
		return nil
	}

	err = spice.LoadLeapSeconds(&k)
	if !assert.NoError(t, err) {
		return nil
	}

	return sclkKernel
}

func TestM20(t *testing.T) {
	sclkKernel := loadM20Sclk(t)
	if sclkKernel == nil {
		return
	}

	// Testcases using M20 SSim as a baseline
	inputs := []float64{
		684371162.929382,
		684371376.554382,
		711470561.303375,
		711470564.178375,
	}

	utc := []string{
		"2021-251T11:09:50.501",
		"2021-251T11:13:24.128",
		"2022-200T02:50:02.500",
		"2022-200T02:50:05.375",
	}

	for i, sclk := range inputs {
		t.Run(utc[i], func(t *testing.T) {
			tt := sclkKernel.TT(0, sclk)
			assert.EqualValues(t, utc[i], tt.TAI().UTC().Time().Format("2006-__2T15:04:05.000"))
			t.Log(sclk)
			t.Log(tt.TAI().UTC().Time().Unix())
			t.Log(tt.TAI().UTC().Time().Nanosecond())
		})
	}

	// lmst := []string{
	// 	"1/00196:20:48:57:24888",
	// 	"1/00196:20:50:27:27469",
	// 	"1/01262:13:40:33:76576",
	// }
}

func TestM20Sol0(t *testing.T) {
	sclkKernel := loadM20Sclk(t)
	if sclkKernel == nil {
		return
	}

	d := time.Date(2021, 02, 18, 04, 24, 15, 805800000, time.UTC)
	utc := spice.UTCFromTime(d)

	assert.Equal(t, float64(37), float64(utc.TAI())-utc.J2000())
	assert.InDelta(t, 666894324.990986, float64(utc.TAI().TT().ET()), 1e-5)
}

func BenchmarkSclkToTT(b *testing.B) {
	sclkKernel := loadM20Sclk(b)
	if sclkKernel == nil {
		return
	}

	for b.Loop() {
		_ = sclkKernel.TT(0, 684371162.929382)
	}
}

func BenchmarkTTToUTC(b *testing.B) {
	sclkKernel := loadM20Sclk(b)
	if sclkKernel == nil {
		return
	}

	for b.Loop() {
		_ = spice.TT(684371459.6855003).TAI().UTC()
	}
}
