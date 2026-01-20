package fprime

import (
	"encoding/binary"
	"errors"

	"github.com/nasa/hermes/pkg/serial"
)

var ErrDictEntryNotFound = errors.New("dictionary entry not found")

func NewWriter() *serial.Writer {
	return serial.NewWriter(
		serial.WithWriterByteOrder(binary.BigEndian),
		serial.WithBoolFalseValue(Config.FalseValue),
		serial.WithBoolTrueValue(Config.TrueValue),
	)
}
