package pb

import (
	"encoding"
	"fmt"
)

var (
	_ encoding.TextUnmarshaler = (*IntKind)(nil)
	_ encoding.TextMarshaler   = (*IntKind)(nil)
)

func (d *IntKind) UnmarshalText(b []byte) error {
	switch string(b) {
	case "U8":
		*d = IntKind_INT_U8
	case "I8":
		*d = IntKind_INT_I8
	case "U16":
		*d = IntKind_INT_U16
	case "I16":
		*d = IntKind_INT_I16
	case "U32":
		*d = IntKind_INT_U32
	case "I32":
		*d = IntKind_INT_I32
	case "U64":
		*d = IntKind_INT_U64
	case "I64":
		*d = IntKind_INT_I64
	default:
		return fmt.Errorf("invalid integer kind: %s", string(b))
	}

	return nil
}

// MarshalText implements encoding.TextMarshaler.
func (d *IntKind) MarshalText() (text []byte, err error) {
	switch *d {
	case IntKind_INT_U8:
		return []byte("U8"), nil
	case IntKind_INT_I8:
		return []byte("I8"), nil
	case IntKind_INT_U16:
		return []byte("U16"), nil
	case IntKind_INT_I16:
		return []byte("I16"), nil
	case IntKind_INT_U32:
		return []byte("U32"), nil
	case IntKind_INT_I32:
		return []byte("I32"), nil
	case IntKind_INT_U64:
		return []byte("U64"), nil
	case IntKind_INT_I64:
		return []byte("I64"), nil
	default:
		return nil, fmt.Errorf("invalid integer kind: %v", *d)
	}
}
