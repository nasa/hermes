package stream

import "fmt"

var (
	_ error = (*ErrDecode)(nil)
)

type ErrDecode struct {
	parent       error
	stageName    string
	encodedValue any
}

func NewDecodeErr(stageName string, value any, err error) error {
	return &ErrDecode{
		parent:       err,
		stageName:    stageName,
		encodedValue: value,
	}
}

func (e *ErrDecode) Error() string {
	return fmt.Sprintf(
		"(%s) failed to decode %T %v: %s",
		e.stageName,
		e.encodedValue,
		e.encodedValue,
		e.parent,
	)
}

func (e *ErrDecode) Unwrap() error {
	return e.parent
}
