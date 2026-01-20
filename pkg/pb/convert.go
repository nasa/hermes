package pb

import (
	"encoding/binary"
	"fmt"
	"reflect"
	"strings"
	"unsafe"
)

var isBigEndian = binary.NativeEndian.Uint16([]byte{0x12, 0x34}) == uint16(0x1234)

type ConversionOptions struct {
	// Convert enums & bitmasks to their raw int value instead of their string value
	EnumAsInt bool

	// Avoid byte-swapping BytesType into native endian if they are not already
	IgnoreBytesEndian bool
}

func ValueToAny(value *Value, cfg ConversionOptions) (any, error) {
	switch v := value.Value.(type) {
	case *Value_I:
		return v.I, nil
	case *Value_U:
		return v.U, nil
	case *Value_F:
		return v.F, nil
	case *Value_B:
		return v.B, nil
	case *Value_S:
		return v.S, nil
	case *Value_E:
		if cfg.EnumAsInt {
			return v.E.Raw, nil
		} else if v.E.Formatted != "" {
			return v.E.Formatted, nil
		} else {
			return v.E.Raw, nil
		}
	case *Value_O:
		out := map[string]any{}
		for key, val := range v.O.O {
			f, err := ValueToAny(val, cfg)
			if err != nil {
				return nil, fmt.Errorf("%s.%w", key, err)
			}

			out[key] = f
		}

		return out, nil
	case *Value_A:
		out := []any{}
		for i, val := range v.A.Value {
			e, err := ValueToAny(val, cfg)
			if err != nil {
				return nil, fmt.Errorf("[%d]%w", i, err)
			}

			out = append(out, e)
		}

		return out, nil
	case *Value_R:
		var raw []byte
		var err error

		if !cfg.IgnoreBytesEndian && v.R.BigEndian != isBigEndian {
			// We need to perform a bytes swap
			switch v.R.Kind {
			case NumberKind_NUMBER_U8, NumberKind_NUMBER_I8:
				raw = v.R.Value // no need for byte swap
			case NumberKind_NUMBER_U16, NumberKind_NUMBER_I16:
				raw, err = unsafeSwap2(v.R.Value)
				if err != nil {
					return nil, err
				}

			case NumberKind_NUMBER_U32, NumberKind_NUMBER_I32, NumberKind_NUMBER_F32:
				raw, err = unsafeSwap4(v.R.Value)
				if err != nil {
					return nil, err
				}

			case NumberKind_NUMBER_U64, NumberKind_NUMBER_I64, NumberKind_NUMBER_F64:
				raw, err = unsafeSwap8(v.R.Value)
				if err != nil {
					return nil, err
				}
			}
		} else {
			raw = v.R.Value
		}

		switch v.R.Kind {
		case NumberKind_NUMBER_U8:
			return unsafeBytesToSlice[uint8](raw)
		case NumberKind_NUMBER_I8:
			return unsafeBytesToSlice[int8](raw)
		case NumberKind_NUMBER_U16:
			return unsafeBytesToSlice[uint16](raw)
		case NumberKind_NUMBER_I16:
			return unsafeBytesToSlice[int16](raw)
		case NumberKind_NUMBER_U32:
			return unsafeBytesToSlice[uint32](raw)
		case NumberKind_NUMBER_I32:
			return unsafeBytesToSlice[int32](raw)
		case NumberKind_NUMBER_U64:
			return unsafeBytesToSlice[uint64](raw)
		case NumberKind_NUMBER_I64:
			return unsafeBytesToSlice[int64](raw)
		case NumberKind_NUMBER_F32:
			return unsafeBytesToSlice[float32](raw)
		case NumberKind_NUMBER_F64:
			return unsafeBytesToSlice[float64](raw)
		}

		return nil, fmt.Errorf("invalid type kind: (%T) %v", v.R.Kind, v.R.Kind)
	}

	return nil, fmt.Errorf("invalid type kind: (%T) %v", value, value)
}

func AnyToValue(a any) (*Value, error) {
	// Fall back to reflection based conversion
	v := reflect.ValueOf(a)
	ty := v.Type()
	switch ty.Kind() {
	case reflect.Bool:
		return &Value{Value: &Value_B{B: v.Bool()}}, nil
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return &Value{Value: &Value_I{I: v.Int()}}, nil
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		return &Value{Value: &Value_U{U: v.Uint()}}, nil
	case reflect.Float32, reflect.Float64:
		return &Value{Value: &Value_F{F: v.Float()}}, nil
	case reflect.String:
		return &Value{Value: &Value_S{S: v.String()}}, nil
	case reflect.Slice, reflect.Array:
		isVarArray := true
		var typedArrayKind NumberKind
		var elemSize int
		switch ty.Elem().Kind() {
		case reflect.Int8:
			typedArrayKind = NumberKind_NUMBER_I8
			elemSize = 1
		case reflect.Int16:
			typedArrayKind = NumberKind_NUMBER_I16
			elemSize = 2
		case reflect.Int32:
			typedArrayKind = NumberKind_NUMBER_I32
			elemSize = 4
		case reflect.Int64:
			typedArrayKind = NumberKind_NUMBER_I64
			elemSize = 8

		case reflect.Uint8:
			typedArrayKind = NumberKind_NUMBER_U8
			elemSize = 1
		case reflect.Uint16:
			typedArrayKind = NumberKind_NUMBER_U16
			elemSize = 2
		case reflect.Uint32:
			typedArrayKind = NumberKind_NUMBER_U32
			elemSize = 4
		case reflect.Uint64:
			typedArrayKind = NumberKind_NUMBER_U64
			elemSize = 8

		case reflect.Float32:
			typedArrayKind = NumberKind_NUMBER_F32
			elemSize = 4
		case reflect.Float64:
			typedArrayKind = NumberKind_NUMBER_F64
			elemSize = 8
		default:
			isVarArray = false
		}

		if isVarArray && ty.Len() < 8 {
			// Use the raw array value if the array is relatively small
			// This is easier to read in consumers of this data
			isVarArray = false
		}

		if isVarArray {
			dst := reflect.MakeSlice(reflect.SliceOf(ty.Elem()), ty.Len(), ty.Len())
			n := reflect.Copy(dst, v)
			if n != ty.Len() {
				return nil, fmt.Errorf("failed to copy var array into slice %d != %d", n, ty.Len())
			}

			pbB := &BytesValue{
				BigEndian: isBigEndian,
				Kind:      typedArrayKind,
				Value:     unsafe.Slice((*byte)(dst.UnsafePointer()), ty.Len()*elemSize),
			}

			return &Value{Value: &Value_R{R: pbB}}, nil
		} else {
			pbA := &ArrayValue{}
			for i, vi := range v.Seq2() {
				if i.CanInterface() {
					ic, err := AnyToValue(vi.Interface())
					if err != nil {
						return nil, fmt.Errorf("[%d]%w", i.Int(), err)
					}

					pbA.Value = append(pbA.Value, ic)
				}
			}

			return &Value{Value: &Value_A{A: pbA}}, nil
		}
	case reflect.Struct:
		pbO := &ObjectValue{O: map[string]*Value{}}
		fieldsN := v.NumField()
		for i := range fieldsN {
			field := v.Field(i)
			fieldName, ok := ty.Field(i).Tag.Lookup("json")
			if !ok {
				fieldName = ty.Field(i).Name
			}

			if field.CanInterface() {
				ic, err := AnyToValue(field.Interface())
				if err != nil {
					return nil, fmt.Errorf(".%s %w", ty.Field(i).Name, err)
				}

				pbO.O[fieldName] = ic
			}
		}

		return &Value{Value: &Value_O{O: pbO}}, nil
	case reflect.Pointer:
		return AnyToValue(v.Elem().Interface())
	case reflect.Map:
		if ty.Key().Kind() != reflect.String {
			return nil, fmt.Errorf("maps must have string keys to be converted to *pb.Value: got %s", ty.Key().Kind().String())
		}

		pbO := &ObjectValue{O: map[string]*Value{}}
		for key, value := range v.Seq2() {
			conv, err := AnyToValue(value)
			if err != nil {
				return nil, fmt.Errorf(".%s %w", key, err)
			}

			pbO.O[key.String()] = conv
		}

		return &Value{Value: &Value_O{O: pbO}}, nil
	default:
		return nil, fmt.Errorf("type kind not supported to convert to *pb.Value: %s", v.Kind().String())
	}
}

func unmarshalValue(from *Value, v reflect.Value) error {
	if v.Kind() == reflect.Pointer {
		v = v.Elem()
	}

	t := v.Type()

	switch f := from.Value.(type) {
	case *Value_I:
		if v.CanInt() {
			v.SetInt(f.I)
		} else if v.CanUint() {
			v.SetUint(uint64(f.I))
		} else if v.CanFloat() {
			v.SetFloat(float64(f.I))
		} else {
			return fmt.Errorf("cannot convert int to %s", t.Kind().String())
		}
	case *Value_U:
		if v.CanUint() {
			v.SetUint(f.U)
		} else if v.CanInt() {
			v.SetInt(int64(f.U))
		} else if v.CanFloat() {
			v.SetFloat(float64(f.U))
		} else {
			return fmt.Errorf("cannot convert uint to %s", t.Kind().String())
		}
	case *Value_F:
		if v.CanFloat() {
			v.SetFloat(f.F)
		} else if v.CanInt() {
			v.SetInt(int64(f.F))
		} else if v.CanUint() {
			v.SetUint(uint64(f.F))
		} else {
			return fmt.Errorf("cannot convert float to %s", t.Kind().String())
		}
	case *Value_B:
		if v.Kind() == reflect.Bool {
			v.SetBool(f.B)
		} else {
			return fmt.Errorf("cannot convert bool to %s", t.Kind().String())
		}
	case *Value_S:
		if v.Kind() == reflect.String {
			v.SetString(f.S)
		} else {
			return fmt.Errorf("cannot convert string to %s", t.Kind().String())
		}
	case *Value_E:
		switch v.Kind() {
		case reflect.String:
			v.SetString(f.E.Formatted)
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			v.SetInt(f.E.Raw)
		case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
			v.SetUint(uint64(f.E.Raw))
		default:
			return fmt.Errorf("cannot convert enum to %s", t.Kind().String())
		}
	case *Value_O:
		switch t.Kind() {
		case reflect.Map:
			if t.Key().Kind() != reflect.String {
				return fmt.Errorf("only string map keys are supported")
			}

			if v.IsNil() {
				v.Set(reflect.MakeMap(t))
			} else {
				v.Clear()
			}

			for key, value := range f.O.O {
				vv := reflect.New(t.Elem())
				err := unmarshalValue(value, vv)
				if err != nil {
					return fmt.Errorf("%s: %w", key, err)
				}

				v.SetMapIndex(reflect.ValueOf(key), vv)
			}
		case reflect.Struct:
			for key, value := range f.O.O {
				field := v.FieldByNameFunc(func(s string) bool {
					return strings.EqualFold(s, key)
				})
				if !field.IsValid() {
					// Field not found
					continue
				}

				vv := reflect.New(field.Type())
				err := unmarshalValue(value, vv)
				if err != nil {
					return fmt.Errorf("'%s': %w", key, err)
				}

				field.Set(vv.Elem())
			}
		default:
			return fmt.Errorf("cannot convert object to %s", t.Kind().String())
		}
	case *Value_A:
		switch t.Kind() {
		case reflect.Array:
			if t.Len() != len(f.A.Value) {
				return fmt.Errorf("array length mismatch, got %d, expected %d", len(f.A.Value), t.Len())
			}

			for i, value := range f.A.Value {
				vv := reflect.New(t.Elem())
				err := unmarshalValue(value, vv)
				if err != nil {
					return fmt.Errorf("[%d]: %w", i, err)
				}

				v.Index(i).Set(vv)
			}
		case reflect.Slice:
			v.Set(reflect.MakeSlice(t.Elem(), len(f.A.Value), len(f.A.Value)))

			for i, value := range f.A.Value {
				vv := reflect.New(t.Elem())
				err := unmarshalValue(value, vv)
				if err != nil {
					return fmt.Errorf("[%d]: %w", i, err)
				}

				v.Index(i).Set(vv)
			}
		default:
			return fmt.Errorf("cannot convert array to %s", t.Kind().String())
		}
	case *Value_R:
		switch t.Kind() {
		case reflect.Array:
			conv, err := ValueToAny(from, ConversionOptions{})
			if err != nil {
				return fmt.Errorf("failed to process raw bytes value: %w", err)
			}

			convV := reflect.ValueOf(conv)
			if convV.Len() != v.Len() {
				return fmt.Errorf("array length mismatch, got %d, expected %d", convV.Len(), v.Len())
			}

			if !convV.Elem().Type().AssignableTo(t.Elem()) {
				return fmt.Errorf("cannot assign array element type %s to %s", convV.Type().Elem().String(), t.Elem().String())
			}

			for i, ii := range convV.Seq2() {
				v.Index(int(i.Int())).Set(ii)
			}
		case reflect.Slice:
			conv, err := ValueToAny(from, ConversionOptions{})
			if err != nil {
				return fmt.Errorf("failed to process raw bytes value: %w", err)
			}

			convV := reflect.ValueOf(conv)
			if !convV.Type().AssignableTo(t) {
				return fmt.Errorf("cannot assign bytes type %s to %s", convV.Type().String(), t.String())
			}

			v.Set(convV)
		default:
			return fmt.Errorf("cannot convert raw bytes to %s", t.Kind().String())
		}
	default:
		return fmt.Errorf("invalid value type: %T", f)
	}

	return nil
}

// A utility function to convert a protobuf value to a compile-time Go value
// This is useful when you know the structure of the value and you want to
// access the fields in a type-safe way.
func Unmarshal(value *Value, to any) error {
	toVal := reflect.ValueOf(to)
	if toVal.Kind() != reflect.Pointer || toVal.IsNil() {
		return fmt.Errorf("'to' must be a pointer")
	}

	err := unmarshalValue(value, toVal.Elem())
	if err != nil {
		return fmt.Errorf("failed to unmarshal: %w", err)
	}

	return nil
}
