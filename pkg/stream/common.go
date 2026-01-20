package stream

import (
	"errors"
	"fmt"
)

var _ error = (*ErrDroppedBytes)(nil)
var _ error = (*ErrCrcMismatch)(nil)
var ErrStreamClosed = errors.New("stream closed")
var ErrPipelinePropagated = errors.New("propagated error")
var ErrInvalidReply = errors.New("invalid reply from premature channel closure")

type ErrDroppedBytes struct {
	// Number of dropped bytes
	N int
}

// Error implements error.
func (e *ErrDroppedBytes) Error() string {
	return fmt.Sprintf("dropped %d bytes", e.N)
}

type ErrCrcMismatch struct {
	Computed uint32
	Received uint32
}

// Error implements error.
func (e *ErrCrcMismatch) Error() string {
	return fmt.Sprintf("crc mismatch: computed 0x%x got 0x%x", e.Computed, e.Received)
}
