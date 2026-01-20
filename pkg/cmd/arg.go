package cmd

import (
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"

	"github.com/nasa/hermes/pkg/pb"
)

type arguments struct {
	in []string
}

func (c *arguments) Peek() (string, error) {
	if len(c.in) > 0 {
		return c.in[0], nil
	} else {
		return "", fmt.Errorf("missing argument: %w", io.EOF)
	}
}

func (c *arguments) Pop() (string, error) {
	if len(c.in) > 0 {
		o := c.in[0]
		c.in = c.in[1:]
		return o, nil
	} else {
		return "", fmt.Errorf("missing argument: %w", io.EOF)
	}
}

func argGet(
	args *arguments,
	defTy *pb.Type,
	cmdOpts *cmdOption,
	opts ArgumentOptions,
) (*pb.Value, error) {
	switch ty := defTy.Value.(type) {
	case *pb.Type_Array:
		switch size := ty.Array.Size.(type) {
		case *pb.ArrayType_Dynamic:
			arrVal := pb.ArrayValue{Value: []*pb.Value{}}

			// There is a special option on field metadata that makes dynamically sized arrays read until the end of the tokens
			if opts.OmitLengthPrefix {
				// Keep grabbing tokens until we run out of tokens
				i := 0
				for {
					newVal, err := argGet(args, ty.Array.GetElType(), cmdOpts, ArgumentOptions{})
					if errors.Is(err, io.EOF) {
						break
					} else if err != nil {
						return nil, fmt.Errorf("index %d: %w", i, err)
					}

					arrVal.Value = append(arrVal.Value, newVal)
					i++
				}
			} else {
				// Dynamic sized array, first argument should be an integer noting the number (or array)
				sizeVal, err := args.Pop()
				if err != nil {
					return nil, err
				}

				len, err := strconv.ParseInt(sizeVal, 0, 64)
				if err != nil {
					return nil, fmt.Errorf("invalid array length '%s': %w", sizeVal, err)
				}

				if len < 0 {
					return nil, fmt.Errorf("invalid array length less than zero: %d", len)
				}

				// Read out the array
				for i := range len {
					newVal, err := argGet(args, ty.Array.GetElType(), cmdOpts, ArgumentOptions{})
					if err != nil {
						return nil, fmt.Errorf("index %d: %w", i, err)
					}

					arrVal.Value = append(arrVal.Value, newVal)
				}
			}

			// Check if bounds are actually used
			if size.Dynamic.GetMin() < size.Dynamic.GetMax() {
				// Validate our length
				if len(arrVal.Value) < int(size.Dynamic.GetMin()) {
					return nil, fmt.Errorf("array length less than minimum: %d < %d", len(arrVal.Value), size.Dynamic.GetMin())
				}

				if len(arrVal.Value) > int(size.Dynamic.GetMax()) {
					return nil, fmt.Errorf("array length greater than maximum: %d > %d", len(arrVal.Value), size.Dynamic.GetMax())
				}
			}

			return &pb.Value{Value: &pb.Value_A{A: &arrVal}}, nil
		case *pb.ArrayType_Static:
			arrVal := pb.ArrayValue{Value: []*pb.Value{}}

			// Read out the array
			for i := range size.Static {
				newVal, err := argGet(args, ty.Array.GetElType(), cmdOpts, ArgumentOptions{})
				if err != nil {
					return nil, fmt.Errorf("index %d: %w", i, err)
				}

				arrVal.Value = append(arrVal.Value, newVal)
			}

			return &pb.Value{Value: &pb.Value_A{A: &arrVal}}, nil
		default:
			panic(fmt.Sprintf("unexpected pb.isArrayType_Size: %#v", size))
		}
	case *pb.Type_Bitmask:
		arg, err := args.Pop()
		if err != nil {
			return nil, err
		}

		out := &pb.EnumValue{
			Raw:       0,
			Formatted: arg,
		}

		for mask := range strings.SplitSeq(arg, "|") {
			mask = strings.Trim(mask, " ")
			found := false

			// Look for this mask in the enum def
			for _, item := range ty.Bitmask.Items {
				if mask == item.Name {
					out.Raw |= int64(item.Value)
					found = true
					break
				}
			}

			if !found {
				maskU, err := strconv.ParseInt(mask, 0, 64)
				if err != nil {
					return nil, fmt.Errorf("invalid bitmask: '%s': %w", mask, err)
				} else {
					out.Raw |= maskU
				}
			}
		}

		return &pb.Value{Value: &pb.Value_E{E: out}}, nil
	case *pb.Type_Bool:
		arg, err := args.Pop()
		if err != nil {
			return nil, err
		}

		if strings.ToLower(arg) == "false" {
			return &pb.Value{Value: &pb.Value_B{B: false}}, nil
		} else if strings.ToLower(arg) == "true" {
			return &pb.Value{Value: &pb.Value_B{B: true}}, nil
		} else {
			i, err := strconv.ParseInt(arg, 0, 64)
			if err != nil {
				return nil, fmt.Errorf("invalid boolean value '%s'", arg)
			}

			return &pb.Value{Value: &pb.Value_B{B: i != 0}}, nil
		}
	case *pb.Type_Bytes:
		arg, err := args.Pop()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_R{R: &pb.BytesValue{Value: []byte(arg)}}}, nil
	case *pb.Type_Enum:
		arg, err := args.Pop()
		if err != nil {
			return nil, err
		}

		arg = strings.Trim(arg, " ")
		for _, item := range ty.Enum.Items {
			if arg == item.Name {
				return &pb.Value{Value: &pb.Value_E{E: &pb.EnumValue{
					Raw:       int64(item.Value),
					Formatted: item.Name,
				}}}, nil
			}
		}

		argI, err := strconv.ParseInt(arg, 0, 64)
		if err != nil {
			return nil, fmt.Errorf("no matching enum item '%s'", arg)
		}

		return &pb.Value{Value: &pb.Value_E{E: &pb.EnumValue{
			Raw:       argI,
			Formatted: arg,
		}}}, nil
	case *pb.Type_Float:
		arg, err := args.Pop()
		if err != nil {
			return nil, err
		}

		f, err := strconv.ParseFloat(arg, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid float: %w", err)
		}

		return &pb.Value{Value: &pb.Value_F{F: f}}, nil
	case *pb.Type_Int:
		arg, err := args.Pop()
		if err != nil {
			return nil, err
		}

		switch ty.Int.Kind {
		case pb.IntKind_INT_U8, pb.IntKind_INT_U16, pb.IntKind_INT_U32, pb.IntKind_INT_U64:
			u, err := strconv.ParseUint(arg, 0, 64)
			if err != nil {
				return nil, fmt.Errorf("invalid uint: %w", err)
			}

			return &pb.Value{Value: &pb.Value_U{U: u}}, nil
		case pb.IntKind_INT_I8, pb.IntKind_INT_I16, pb.IntKind_INT_I32, pb.IntKind_INT_I64:
			i, err := strconv.ParseInt(arg, 0, 64)
			if err != nil {
				return nil, fmt.Errorf("invalid int: %w", err)
			}

			return &pb.Value{Value: &pb.Value_I{I: i}}, nil
		default:
			panic(fmt.Sprintf("unexpected pb.IntKind: %#v", ty.Int.Kind))
		}

	case *pb.Type_Object:
		out := map[string]*pb.Value{}
		for _, field := range ty.Object.Fields {
			if field.Value != nil {
				out[field.Name] = field.Value
			} else {
				argOpt := ArgumentOptions{}
				if cmdOpts.fieldOptions != nil {
					argOpt = cmdOpts.fieldOptions(field)
				}

				m, err := argGet(args, field.Type, cmdOpts, argOpt)
				if err != nil {
					return nil, fmt.Errorf("invalid '%s': %w", field.Name, err)
				}

				out[field.Name] = m
			}
		}

		return &pb.Value{Value: &pb.Value_O{O: &pb.ObjectValue{O: out}}}, nil
	case *pb.Type_String_:
		arg, err := args.Pop()
		if err != nil {
			return nil, err
		}

		return &pb.Value{Value: &pb.Value_S{S: arg}}, nil
	case *pb.Type_Ref:
		return nil, fmt.Errorf("invalid dictionary command argument type 'ref'")
	case *pb.Type_Void:
		return nil, fmt.Errorf("invalid dictionary command argument type 'void'")
	default:
		panic(fmt.Sprintf("unexpected pb.isType_Value: %#v", ty))
	}
}
