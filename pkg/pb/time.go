package pb

import (
	"fmt"

	"google.golang.org/protobuf/types/known/timestamppb"
)

// Format the sclk to a string
func (t *Time) SclkS() string {
	return fmt.Sprintf("%.06f", t.Sclk)
}

// Check if this timestamp has a sclk attached to it
func (t *Time) HasSclk() bool {
	if t == nil {
		return false
	}

	return t.GetSclk() > 0
}

func TimeNow() *Time {
	return &Time{
		Unix: timestamppb.Now(),
	}
}
