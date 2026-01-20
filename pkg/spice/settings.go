package spice

// TT - TAI
const tt_tai = 32.184

// Unix time at J2000 Epoch
// Provides an offset for converting J2000 time to Unix time
const UtcAtJ2000 = 946728000
const TaiAtJ2000 = UtcAtJ2000 + 32

// Nominal DELTAET values
// Can be changed by loading in a leap second SPICE kernel
var det = struct {
	K  float64
	M  [2]float64
	EB float64
}{
	K:  1.657e-3,
	EB: 1.671e-2,
	M:  [2]float64{6.239996e0, 1.99096871e-7},
}

var leapseconds struct {
	// Time in J2000 epoch TAI seconds where leap second boundaries are
	TaiTime []int64

	// Time in J2000 epoch UTC seconds where leap second boundaries are
	UtcTime []int64

	// UTC-TAI
	UtcTai []int64
}
