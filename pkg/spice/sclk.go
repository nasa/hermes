package spice

import (
	"fmt"
	"slices"
)

type formatDelim rune

const (
	delimDOT   = '.' // 1
	delimCOLON = ':' // 2
	delimDASH  = '-' // 3
	delimCOMMA = ',' // 4
	delimSPACE = ' ' // 5
)

type Partition struct {
	// The ``first tick'' of this partition.
	// Mathematically speaking, partitions may be thought of as
	// intervals that are closed on the left and open on the right.
	Start float64
	End   float64
}

type LinearInterval struct {
	// Sclk of the start of the interval
	Sclk float64

	// Time of the target time system
	ParallelTime float64

	// parallel time system units
	// ----------------------------
	// most significant clock count
	//
	// The units of the currently supported parallel
	// time systems TDT and TDB are seconds measured
	// in those respective systems. So clock rates may
	// be TDT or TDB seconds per most significant
	// clock count. For example, for the GLL orbiter
	// spacecraft clock, the rate unit is
	// ``TDB seconds per RIM.''
	Scale float64
}

func (l *LinearInterval) ToParallel(sclk float64) float64 {
	return l.ParallelTime + l.Scale*(sclk-l.Sclk)
}

func (l *LinearInterval) ToSclk(parallel float64) float64 {
	return ((parallel - l.ParallelTime) / l.Scale) + l.Sclk
}

// The [SclkKernel] struct implements a subset of the NAIF SPICE
// functionality for SCLK time conversions.
//
// See https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/FORTRAN/req/sclk.html
// for full specification on what sclk is and how it's used on spacecrafts for
// time conversions to/from other time systems.
type SclkKernel struct {
	// Spacecraft ID, usually a number
	Id string

	// Time system that these coefficients convert the SCLK to
	TimeSystem TimeSystemKind

	// Formatted time modulus/parameters
	Moduli  []uint64
	Offsets []float64

	Partitions []*Partition
	Piecewise  []*LinearInterval

	// These are optimized fields that allow for quick lookup
	// of sclk offsets and partition aggregations
	offsetSclk     []float64
	offsetParallel []float64
	partitionsSclk []float64
}

func (t *SclkKernel) convert(partNum int, sclk float64) float64 {
	// This is the 'true' continuous sclk
	contSclk := sclk + t.partitionsSclk[partNum]

	// Small optimization:
	// It is most likely that the sclk be in the
	// last linear period so we will try
	lastLine := t.Piecewise[len(t.Piecewise)-1]
	if contSclk >= lastLine.Sclk {
		return lastLine.ToParallel(contSclk)
	}

	// Find the linear function we lie between
	idx, _ := slices.BinarySearch(t.offsetSclk, contSclk)
	idx -= 1
	if idx < 0 {
		idx = 0
	}

	return t.Piecewise[idx].ToParallel(contSclk)
}

// Convert the SCLK to Ephermeris Time (TDB)
func (t *SclkKernel) ET(partNum int, sclk float64) ET {
	rawTime := t.convert(partNum, sclk)
	switch t.TimeSystem {
	case TimeSystem_TDB:
		return ET(rawTime)
	case TimeSystem_TT:
		return TT(rawTime).ET()
	default:
		panic("invalid time system")
	}
}

// Convert the SCLK to Terestrial Time (TT)
func (t *SclkKernel) TT(partNum int, sclk float64) TT {
	rawTime := t.convert(partNum, sclk)
	switch t.TimeSystem {
	case TimeSystem_TDB:
		return ET(rawTime).TT()
	case TimeSystem_TT:
		return TT(rawTime)
	default:
		panic("invalid time system")
	}
}

// Convert parallel time to SCLK
func (t *SclkKernel) toSclk(raw float64) (int, float64) {
	// Convert raw parallel time to absolute SCLK
	idx, _ := slices.BinarySearch(t.offsetParallel, raw)
	idx -= 1

	if idx < 0 {
		idx = 0
	}

	sclk := t.Piecewise[idx].ToSclk(raw)

	// Find the SCLK partition from the absolute SCLK
	part, _ := slices.BinarySearch(t.partitionsSclk, sclk)
	part -= 1
	if part < 0 {
		part = 0
	}

	// Convert continuous (absolute) sclk to partitioned sclk
	return part, sclk - t.partitionsSclk[part]
}

func (t *SclkKernel) FromET(et ET) (int, float64) {
	var rawIn float64
	switch t.TimeSystem {
	case TimeSystem_TDB:
		rawIn = float64(et)
	case TimeSystem_TT:
		rawIn = float64(et.TT())
	default:
		panic("invalid time system")
	}

	return t.toSclk(rawIn)
}

func (t *SclkKernel) FromTT(tt TT) (int, float64) {
	var rawIn float64
	switch t.TimeSystem {
	case TimeSystem_TDB:
		rawIn = float64(tt.ET())
	case TimeSystem_TT:
		rawIn = float64(tt)
	default:
		panic("invalid time system")
	}

	return t.toSclk(rawIn)
}

func (t *SclkKernel) Format(partNum int, sclk float64) string {
	return ""
}

// Create a sclk converter from a loaded SCLK type spice kernel.
//
// sclkKernel is a loaded `.tsc` SPICE kernel for SCLK -> ET conversions.
// scid is needed for properly extracting fields from the sclkKernel as there
// may be multiple sclk conversions in a single kernel
func NewSclkKernel(
	sclkKernel *TextKernel,
	scid string,
) (*SclkKernel, error) {
	if sclkKernel.Type != SCLK {
		return nil, fmt.Errorf("kernel is not a SCLK spice kernel (%s)", sclkKernel.Type)
	}

	out := &SclkKernel{Id: scid}

	dataType, err := sclkKernel.GetNumber(fmt.Sprintf("SCLK_DATA_TYPE_%s", scid))
	if err != nil {
		return nil, fmt.Errorf("failed to get sclk data type: %w", err)
	}

	if int(dataType) != 1 {
		return nil, fmt.Errorf("got invalid sclk data type: %d, only '1' is supported", int(dataType))
	}

	timeSystem, err := sclkKernel.GetNumber(fmt.Sprintf("SCLK01_TIME_SYSTEM_%s", scid))
	if err != nil {
		return nil, fmt.Errorf("failed to get parallel time system: %w", err)
	}

	switch TimeSystemKind(timeSystem) {
	case TimeSystem_TDB, TimeSystem_TT:
		out.TimeSystem = TimeSystemKind(timeSystem)
	default:
		return nil, fmt.Errorf(
			"invalid parallel time system, TDB (%d) and TT/TDT (%d) supported, got %d",
			TimeSystem_TDB,
			TimeSystem_TT,
			TimeSystemKind(timeSystem),
		)
	}

	nfields, err := sclkKernel.GetNumber(fmt.Sprintf("SCLK01_N_FIELDS_%s", scid))
	if err != nil {
		return nil, fmt.Errorf("failed to get SCLK01_N_FIELDS: %w", err)
	}

	moduli, err := sclkKernel.GetNumberVector(fmt.Sprintf("SCLK01_MODULI_%s", scid))
	if err != nil {
		return nil, fmt.Errorf("failed to get SCLK01_MODULI: %w", err)
	}

	offsets, err := sclkKernel.GetNumberVector(fmt.Sprintf("SCLK01_OFFSETS_%s", scid))
	if err != nil {
		return nil, fmt.Errorf("failed to get SCLK01_OFFSETS: %w", err)
	}

	if len(moduli) != int(nfields) {
		return nil, fmt.Errorf("expected len(SCLK01_MODULI) == SCLK01_N_FIELDS, %d != %d", len(moduli), int(nfields))
	}

	if len(offsets) != int(nfields) {
		return nil, fmt.Errorf("expected len(SCLK01_OFFSETS) == SCLK01_N_FIELDS, %d != %d", len(offsets), int(nfields))
	}

	for _, m := range moduli {
		out.Moduli = append(out.Moduli, uint64(m))
	}

	for _, m := range offsets {
		out.Offsets = append(out.Offsets, m)
	}

	partitionStart, err := sclkKernel.GetNumberVector(fmt.Sprintf("SCLK_PARTITION_START_%s", scid))
	if err != nil {
		return nil, fmt.Errorf("failed to get SCLK_PARTITION_START: %w", err)
	}

	partitionEnd, err := sclkKernel.GetNumberVector(fmt.Sprintf("SCLK_PARTITION_END_%s", scid))
	if err != nil {
		return nil, fmt.Errorf("failed to get SCLK_PARTITION_END: %w", err)
	}

	if len(partitionStart) != len(partitionEnd) {
		return nil, fmt.Errorf(
			"expected len(SCLK_PARTITION_START) == len(SCLK_PARTITION_END), %d != %d",
			len(partitionStart), len(partitionEnd),
		)
	}

	partOffset := float64(0)
	for i, start := range partitionStart {
		out.Partitions = append(out.Partitions, &Partition{
			Start: start,
			End:   partitionEnd[i],
		})

		out.partitionsSclk = append(out.partitionsSclk, partOffset)

		duration := partitionEnd[i] - start
		partOffset += duration
	}

	coeff, err := sclkKernel.GetNumberVector(fmt.Sprintf("SCLK01_COEFFICIENTS_%s", scid))
	if err != nil {
		return nil, fmt.Errorf("failed to get SCLK01_COEFFICIENTS: %w", err)
	}

	if len(coeff)%3 != 0 {
		return nil, fmt.Errorf("SCLK01_COEFFICIENTS must be a multiple of 3: got %d", len(coeff))
	}

	for i := range len(coeff) / 3 {
		sclkStart := coeff[i*3+0] / 65536
		parallelStart := coeff[i*3+1]
		scale := coeff[i*3+2]

		out.offsetSclk = append(out.offsetSclk, sclkStart)
		out.offsetParallel = append(out.offsetParallel, parallelStart)
		out.Piecewise = append(out.Piecewise, &LinearInterval{
			Sclk:         sclkStart,
			ParallelTime: parallelStart,
			Scale:        scale,
		})
	}

	return out, nil
}
