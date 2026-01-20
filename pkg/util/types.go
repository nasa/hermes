package util

import (
	"encoding"
	"time"
)

var (
	_ encoding.TextMarshaler   = (*Duration)(nil)
	_ encoding.TextUnmarshaler = (*Duration)(nil)
)

// Wrapper around time.Duration to allow interop with text marshalers like json,yaml,toml etc
type Duration time.Duration

type Time time.Time

func (d Duration) String() string {
	return time.Duration(d).String()
}

func (d *Duration) UnmarshalText(b []byte) error {
	x, err := time.ParseDuration(string(b))
	if err != nil {
		return err
	}
	*d = Duration(x)
	return nil
}

// MarshalText implements encoding.TextMarshaler.
func (d Duration) MarshalText() (text []byte, err error) {
	return []byte(d.String()), nil
}

func (d Time) String() string {
	return time.Time(d).Format(time.RFC3339Nano)
}

func (d *Time) UnmarshalText(b []byte) error {
	x, err := time.Parse(time.RFC3339Nano, string(b))
	if err != nil {
		return err
	}
	*d = Time(x)
	return nil
}

// MarshalText implements encoding.TextMarshaler.
func (d Time) MarshalText() (text []byte, err error) {
	return []byte(d.String()), nil
}
