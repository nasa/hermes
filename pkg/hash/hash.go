package hash

import (
	"errors"
	"fmt"
)

// The primary abstraction over a hashing algorithm
// Each of these functions should be called in order
// This interface is meant to wrap a stateful implementation
type Hash[T any] interface {
	// Reset the accumulator to the empty value
	Reset()

	// Update the hash with a new chunk of bytes
	Update([]byte)

	// Finish the hash and return the computed value
	Finish() T
}

var ErrChecksumInvalid error = errors.New("checksum mismatch")

func NewChecksumFailedErr(received any, computed any) error {
	return fmt.Errorf("%w: %v (received) != %v (computed)", ErrChecksumInvalid, received, computed)
}
