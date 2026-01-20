package pb

import (
	"fmt"
	"maps"
	"slices"
	"strconv"

	"go.opentelemetry.io/otel/attribute"
)

var _ fmt.Formatter = (*Value)(nil)

func safeUIntVerb(verb rune) rune {
	switch verb {
	case 'x', 'X', 'b', 'c':
		return verb
	default:
		return 'd'
	}
}

func safeFloatVerb(verb rune) rune {
	switch verb {
	case 'b', 'x', 'X', 'e', 'E', 'f', 'g', 'G':
		return verb
	default:
		return 'f'
	}
}

// Format implements fmt.Formatter.
func (x *Value) Format(f fmt.State, verb rune) {
	switch v := x.Value.(type) {
	case *Value_I:
		switch verb {
		case 'x', 'X':
			f.Write([]byte(strconv.FormatInt(v.I, 16)))
		default:
			f.Write([]byte(strconv.FormatInt(v.I, 10)))
		}
	case *Value_U:
		f.Write(fmt.Appendf(nil, fmt.Sprintf("%%%c", safeUIntVerb(verb)), v.U))
	case *Value_F:
		if prec, ok := f.Precision(); ok {
			f.Write([]byte(strconv.FormatFloat(v.F, byte(safeFloatVerb(verb)), prec, 64)))
		} else {
			f.Write([]byte(strconv.FormatFloat(v.F, byte(safeFloatVerb(verb)), -1, 64)))
		}
	case *Value_B:
		if v.B {
			f.Write([]byte("true"))
		} else {
			f.Write([]byte("false"))
		}
	case *Value_S:
		if f.Flag('#') {
			f.Write([]byte("\""))
		}
		f.Write([]byte(v.S))
		if f.Flag('#') {
			f.Write([]byte("\""))
		}
	case *Value_E:
		if v.E.GetFormatted() != "" {
			if f.Flag('#') {
				f.Write([]byte("\""))
			}
			f.Write([]byte(v.E.Formatted))
			if f.Flag('#') {
				f.Write([]byte("\""))
			}
		} else {
			f.Write([]byte(strconv.FormatInt(v.E.GetRaw(), 10)))
		}
	case *Value_O:
		f.Write([]byte("{"))
		obj := v.O.GetO()
		keys := slices.Sorted(maps.Keys(obj))
		for i, key := range keys {
			if i > 0 {
				f.Write([]byte(", "))
			}

			f.Write([]byte{'"'})
			f.Write([]byte(key))
			f.Write([]byte("\": "))
			f.Write(fmt.Appendf(nil, "%#v", obj[key]))
		}
		f.Write([]byte("}"))
	case *Value_A:
		f.Write([]byte("["))
		for i, item := range v.A.GetValue() {
			if i > 0 {
				f.Write([]byte(", "))
			}

			f.Write(fmt.Appendf(nil, "%#v", item))
		}
		f.Write([]byte("]"))
	case *Value_R:
		// TODO(tumbar) Do we care about showing the 'kPind'?
		f.Write(fmt.Appendf(nil, "[% x]", v.R.Value))
	default:
		f.Write(fmt.Appendf(nil, "%#v", v))
	}
}

func ArgsToMap(args []*Value, argNames []string) map[string]string {
	out := map[string]string{}
	for i, arg := range args {
		if i < len(argNames) {
			out[argNames[i]] = fmt.Sprintf("%s", arg)
		} else {
			out[strconv.FormatInt(int64(i), 10)] = fmt.Sprintf("%s", arg)
		}
	}

	return out
}

func ValueToAttribute(name string, value *Value) attribute.KeyValue {
	switch v := value.Value.(type) {
	case *Value_I:
		return attribute.Int64(name, v.I)
	case *Value_U:
		return attribute.Int64(name, int64(v.U))
	case *Value_F:
		return attribute.Float64(name, v.F)
	case *Value_E:
		if v.E.GetFormatted() != "" {
			return attribute.String(name, v.E.GetFormatted())
		} else {
			return attribute.Int64(name, v.E.GetRaw())
		}
	default:
		return attribute.String(name, fmt.Sprintf("%v", value))
	}
}

func ArgsToAttributes(args []*Value, defs []*Field) []attribute.KeyValue {
	out := []attribute.KeyValue{}
	for i, arg := range args {
		if i < len(defs) {
			out = append(out, ValueToAttribute(defs[i].GetName(), arg))
		} else {
			out = append(out, ValueToAttribute(strconv.FormatInt(int64(i), 10), arg))
		}
	}

	return out
}
