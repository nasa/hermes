package spice

import (
	_ "embed"
	"fmt"
	"time"
)

func LoadLeapSeconds(kernel *TextKernel) error {
	delta_t_a, err := kernel.GetNumber("DELTET/DELTA_T_A")
	if err != nil {
		return fmt.Errorf("failed to load DELTET/DELTA_T_A: %w", err)
	}

	if delta_t_a != tt_tai {
		return fmt.Errorf("expected DELTET/DELTA_T_A to be %f", tt_tai)
	}

	deltaet_k, err := kernel.GetNumber("DELTET/K")
	if err != nil {
		return fmt.Errorf("failed to load DELTET/K: %w", err)
	}

	deltaet_eb, err := kernel.GetNumber("DELTET/EB")
	if err != nil {
		return fmt.Errorf("failed to load DELTET/EB: %w", err)
	}

	deltaet_m, err := kernel.GetNumberVector("DELTET/M")
	if err != nil {
		return fmt.Errorf("failed to load DELTET/M: %w", err)
	}

	if len(deltaet_m) != 2 {
		return fmt.Errorf("expected len(DELTET/M) == 2: %v", deltaet_m)
	}

	delta_at, err := kernel.GetVector("DELTET/DELTA_AT")
	if err != nil {
		return fmt.Errorf("failed load DELTET/DELTA_AT: %w", err)
	}

	if len(delta_at)%2 != 0 {
		return fmt.Errorf("expected len(DELTET/DELTA_AT)%%2 == 0: %d", len(delta_at))
	}

	// Load the DeltaAT pairs
	leapStaging := []struct {
		delta int64
		date  time.Time
	}{}

	for i := range len(delta_at) / 2 {
		var delta int64
		var date time.Time

		if dt, ok := delta_at[i*2].(Number); ok {
			delta = int64(dt)
		} else {
			return fmt.Errorf("expected first item in leap second pair to be number (idx=%d): %T", i, delta_at[i])
		}

		if dt, ok := delta_at[i*2+1].(Date); ok {
			date, err = time.Parse("2006-Jan-2", string(dt))
			if err != nil {
				return fmt.Errorf("failed to parse date at index %d: %w", i+1, err)
			}
		} else {
			return fmt.Errorf("expected first item in leap second pair to be number (idx=%d): %T", i, delta_at[i])
		}

		leapStaging = append(leapStaging, struct {
			delta int64
			date  time.Time
		}{
			delta: delta,
			date:  date,
		})
	}

	// Load the eccentricity parameters
	det.K = deltaet_k
	det.EB = deltaet_eb
	det.M[0] = deltaet_m[0]
	det.M[1] = deltaet_m[1]

	// Load the leap second parameters
	leapseconds.TaiTime = []int64{}
	leapseconds.UtcTime = []int64{}
	leapseconds.UtcTai = []int64{}
	for _, leap := range leapStaging {
		u := leap.date.Unix()
		leapseconds.UtcTime = append(leapseconds.UtcTime, u-UtcAtJ2000)
		leapseconds.TaiTime = append(leapseconds.TaiTime, u-UtcAtJ2000-leap.delta)
		leapseconds.UtcTai = append(leapseconds.UtcTai, leap.delta)
	}

	return nil
}

//go:embed leap.tls
var leapSecondKernelText string

func init() {
	tlsk := TextKernel{}
	err := tlsk.Load("leap.tls", leapSecondKernelText)
	if err != nil {
		panic(fmt.Errorf("failed to load built-in leap-second kernel: %w", err))
	}

	err = LoadLeapSeconds(&tlsk)
	if err != nil {
		panic(fmt.Errorf("failed to load built-in leap-second kernel: %w", err))
	}
}
