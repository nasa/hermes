package hostutil

import (
	"encoding"
	"fmt"
	"os"
	"time"

	"github.com/nasa/hermes/pkg/spice"
	"github.com/nasa/hermes/pkg/util"
)

var (
	_ encoding.TextMarshaler   = timeSystemKind(0)
	_ encoding.TextUnmarshaler = (*timeSystemKind)(nil)

	_ TimeSystem = (*utcTime)(nil)
	_ TimeSystem = (taiTime)(0.0)
	_ TimeSystem = ephemerisTime{}
	_ TimeSystem = terrestrialTime{}
	_ TimeSystem = (*spiceTime)(nil)
)

// A general interface for working with time conversions
type TimeSystem interface {
	// Convert a flight software time to Golang time
	Convert(seconds int64, nanos int64) time.Time
}

type timeSystemKind int

const (
	// UTC time
	// This time includes an offset of leapseconds from monotonic TAI
	Time_UTC timeSystemKind = iota

	// TAI Time
	// This is a monotonically increasing clock relative to an epoch
	Time_TAI

	// Input time is in ephermeris seconds since
	Time_Ephemeris

	// Input time is in terrestrial seconds (same as TAI with a constant offset)
	Time_Terrestrial

	// A spice kernel (.tsc) should be loaded to convert time
	Time_SPICE

	// The time an event is processed, similar to earth return time
	Time_ERT
)

func (t timeSystemKind) String() string {
	switch t {
	case Time_UTC:
		return "utc"
	case Time_TAI:
		return "tai"
	case Time_Ephemeris:
		return "ephemeris"
	case Time_Terrestrial:
		return "terrestrial"
	case Time_SPICE:
		return "spice"
	case Time_ERT:
		return "ert"
	default:
		return "unknown"
	}
}

func (t *timeSystemKind) UnmarshalText(b []byte) error {
	switch string(b) {
	case "utc":
		*t = Time_UTC
	case "tai":
		*t = Time_TAI
	case "ephemeris":
		*t = Time_Ephemeris
	case "terrestrial":
		*t = Time_Terrestrial
	case "spice":
		*t = Time_SPICE
	case "ert":
		*t = Time_ERT
	default:
		return fmt.Errorf("unknown time system: %s", string(b))
	}

	return nil
}

// MarshalText implements encoding.TextMarshaler.
func (t timeSystemKind) MarshalText() (text []byte, err error) {
	return []byte(t.String()), nil
}

// A reusable configuration service that can be added to profiles
// for converting time/sclk from FSW into UTC or other time formats
type TimeSettings struct {
	TimeSystem         timeSystemKind `toml:"time-system" comment:"Time system type to convert SCLK times into UTC/Database times\nutc: UTC time (includes leap second skips)\ntai: TAI clock (atomic time scale)\nephemeris: (ET, TDB) Similar to TAI with periodic relativistic deltas\nterrestrial: (TT, TDT) Same as TAI with constant offset\nspice: Load a .tsc SPICE kernel to convert between SCLK and UTC\nert: The time an event is processed, similar to earth return time"`
	Epoch              util.Time      `toml:"epoch" comment:"Base epoch time (0 time)."`
	SpiceKernel        string         `toml:"spice-kernel" comment:".tsc SPICE kernel to load if using time-system='spice'"`
	SpiceSclkPartition int            `toml:"spice-sclk-partition" comment:"SCLK Parition index to use for input time (0 for absolute scaling/default)"`
	SpiceScid          string         `toml:"spice-scid" comment:"Spacecraft ID to load from SPICE kernel file.\nhint: look for SCLK01_TIME_SYSTEM_[SCID] in .tsc SPICE kernel."`
}

var DefaultTimeSettings = TimeSettings{
	TimeSystem:         Time_UTC,
	Epoch:              util.Time(time.Unix(0, 0).UTC()),
	SpiceKernel:        "",
	SpiceSclkPartition: 0,
}

func (t *TimeSettings) Load() (TimeSystem, error) {
	epoch := time.Time(t.Epoch)
	switch t.TimeSystem {
	case Time_UTC:
		return &utcTime{
			epochSec: epoch.Unix(),
			epochNs:  int64(epoch.Nanosecond()),
		}, nil
	case Time_TAI:
		return taiTime(spice.UTCFromTime(epoch).TAI()), nil
	case Time_Ephemeris:
		return ephemerisTime{}, nil
	case Time_Terrestrial:
		return terrestrialTime{}, nil
	case Time_SPICE:
		content, err := os.ReadFile(t.SpiceKernel)
		if err != nil {
			return nil, fmt.Errorf("failed to read SCLK SPICE kernel: %w", err)
		}

		textKernel := spice.TextKernel{}
		err = textKernel.Load(t.SpiceKernel, string(content))
		if err != nil {
			return nil, fmt.Errorf("failed to load SCLK SPICE kernel: %w", err)
		}

		sclkKernel, err := spice.NewSclkKernel(&textKernel, t.SpiceScid)
		if err != nil {
			return nil, fmt.Errorf("failed to initialize SCLK kernel: %w", err)
		}

		return &spiceTime{
			kernel: sclkKernel,
			part:   t.SpiceSclkPartition,
		}, nil
	case Time_ERT:
		return earthReturnTime{}, nil
	default:
		return nil, fmt.Errorf("invalid time system %s", t.TimeSystem)
	}
}

type utcTime struct {
	epochSec int64
	epochNs  int64
}

// Convert implements TimeSystem.
func (u *utcTime) Convert(seconds int64, nanos int64) time.Time {
	return time.Unix(seconds+u.epochSec, u.epochNs+nanos).UTC()
}

// Epoch offset from J2000
type taiTime spice.TAI

// Convert implements TimeSystem.
func (t taiTime) Convert(seconds int64, nanos int64) time.Time {
	k := float64(seconds) + (float64(nanos) / 1e9)
	return spice.TAI(float64(t) + k).UTC().Time()
}

type ephemerisTime struct{}

// Convert implements TimeSystem.
func (e ephemerisTime) Convert(seconds int64, nanos int64) time.Time {
	k := float64(seconds) + (float64(nanos) / 1e9)
	return spice.ET(k).TT().TAI().UTC().Time()
}

type terrestrialTime struct{}

// Convert implements TimeSystem.
func (e terrestrialTime) Convert(seconds int64, nanos int64) time.Time {
	k := float64(seconds) + (float64(nanos) / 1e9)
	return spice.TT(k).TAI().UTC().Time()
}

type spiceTime struct {
	kernel *spice.SclkKernel
	part   int
}

// Convert implements TimeSystem.
func (s *spiceTime) Convert(seconds int64, nanos int64) time.Time {
	// Convert time to floating sclk
	sclk := float64(seconds) + (float64(nanos) / 1e9)

	// Convert to UTC
	return s.kernel.TT(s.part, sclk).TAI().UTC().Time()
}

type earthReturnTime struct{}

func (e earthReturnTime) Convert(seconds int64, nanos int64) time.Time {
	return time.Now()
}
