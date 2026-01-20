package compiler

import (
	"fmt"
)

var (
	_ Type = (*BitmaskType)(nil)
)

type BitmaskMember struct {
	Name        string
	Bits        int
	BitsType    ScalarType
	Type        Type
	Initializer string
}

type BitmaskType struct {
	members []*BitmaskMember
}

func maskFromBitCount(n int) string {
	x := 0
	for range n {
		x <<= 1
		x |= 1
	}

	return fmt.Sprintf("0x%02X", x)
}

// Field implements Type.
func (t *BitmaskType) Field(b StructBuilder, name string) {
	for _, member := range t.members {
		if member.Name != "" && !fieldNameIsPrivate(member.Name) {
			b.Field(member.Name, member.Type.Name(b))
		}
	}
}

// Marshal implements Type.
func (t *BitmaskType) Marshal(b BlockBuilder, _ string) {
	// Count the total bit size to determine how many
	// bytes we should read in total
	bitCount := 0
	for _, member := range t.members {
		bitCount += member.Bits
	}

	if bitCount%8 != 0 {
		b.Warning(fmt.Errorf("%d left over bits should be reserved at the end of bitmask", bitCount%8))
	}

	for _, member := range t.members {
		if fieldNameIsPrivate(member.Name) {
			// Check if this private field has an initializer
			// If it does, we don't need to ask for an argument
			if member.Initializer != "" {
				// Initialize the private field
				b.Appendf(`
				|var %s = %s
				|_ = %[1]s`, member.Name, member.Initializer)
			} else {
				// Request an argument to fill this variable's value
				b.Argument(member.Name, member.Type.Name(b))
			}
		}
	}

	b = b.Block("")

	b.Appendf("var raw [%d]byte", bitCount/8)
	b.Appendf("")

	// Extract the fields from the raw data
	currentBit := 0
	for _, member := range t.members {
		// Only read the data out if this is not reserved bits
		if member.Name != "" {
			b.Appendf(`// %s (%d bits)`, member.Name, member.Bits)

			read := 0

			// Read as much as possible from each byte
			for read < member.Bits {
				index := currentBit / 8
				offset := currentBit % 8

				currentRead := min(member.Bits-read, 8-offset)
				mask := maskFromBitCount(currentRead)
				maskShift := 8 - (offset + currentRead)
				readOffset := member.Bits - read - currentRead

				var valueW string
				if fieldNameIsPrivate(member.Name) {
					valueW = member.Name
				} else {
					valueW = fmt.Sprintf("s.%s", member.Name)
				}

				if member.BitsType != member.Type {
					switch mt := member.Type.(type) {
					case ScalarType:
						switch mt {
						case F32:
							b.Import("math")
							valueW = fmt.Sprintf("math.Float32bits(s.%s)", member.Name)
						case F64:
							b.Import("math")
							valueW = fmt.Sprintf("math.Float64bits(s.%s)", member.Name)
						default:
							panic("reached invalid branch")
						}
					case *EnumType:
						valueW = fmt.Sprintf("%s(%s)", member.BitsType.Name(b), valueW)
					case *ExternalType:
						valueW = fmt.Sprintf("%s(%s)", member.BitsType.Name(b), valueW)
					default:
						panic("reached invalid branch")
					}
				}

				b.Append(Line(fmt.Sprintf(
					`raw[%d] |= byte(((%s >> %d) & %s) << %d)`,
					index,
					valueW,
					readOffset,
					mask,
					maskShift,
				)))

				read += currentRead
				currentBit += currentRead
			}
		} else {
			// Reserved bits
			// Skip over them
			b.Appendf("// <reserved> (%d bits)", member.Bits)
			currentBit += member.Bits
		}
	}

	if bitCount%8 > 0 {
		b.Appendf("// <left over> (%d bits)", bitCount%8)
	}

	b.Appendf("")
	b.Appendf("w.Write(raw[:])")
}

// Name implements Type.
func (b *BitmaskType) Name(c Context) string {
	c.Error(fmt.Errorf("bitmask type does not have a type name"))
	return "INVALID"
}

// Unmarshal implements Type.
func (t *BitmaskType) Unmarshal(b BlockBuilder, _ string) {
	// Count the total bit size to determine how many
	// bytes we should read in total
	bitCount := 0
	for _, member := range t.members {
		bitCount += member.Bits
	}

	if bitCount%8 != 0 {
		b.Warning(fmt.Errorf("%d left over bits should be reserved at the end of bitmask", bitCount%8))
	}

	// Declare all private fields from the bitmask
	for _, member := range t.members {
		if fieldNameIsPrivate(member.Name) {
			b.Appendf(`
			|var %s %s
			|_ = %[1]s`, member.Name, member.Type.Name(b))
		}
	}

	b = b.Block("")

	b.Appendf("raw, err := r.Read(%d)", bitCount/8)
	b.HandleError("failed to read bitmask value")
	b.Appendf("")

	// Extract the fields from the raw data
	currentBit := 0
	for _, member := range t.members {
		// Only read the data out if this is not reserved bits
		if member.Name != "" {
			tmpName := fmt.Sprintf("%sTmp", member.Name)
			b.Appendf(`
				|// %s (%d bits)
				|%s := %s(0)`,
				member.Name, member.Bits,
				tmpName, member.BitsType.Name(b))

			read := 0

			// Read as much as possible from each byte
			for read < member.Bits {
				index := currentBit / 8
				offset := currentBit % 8

				currentRead := min(member.Bits-read, 8-offset)
				mask := maskFromBitCount(currentRead)
				maskShift := 8 - (offset + currentRead)
				readOffset := member.Bits - read - currentRead

				valueR := fmt.Sprintf(
					`%s((raw[%d]>>%d)&%s) << %d`,
					member.BitsType.Name(b),
					index,
					maskShift,
					mask,
					readOffset,
				)

				b.Append(Line(fmt.Sprintf(`%s |= %s`, tmpName, valueR)))

				read += currentRead
				currentBit += currentRead
			}

			var destName string
			if fieldNameIsPrivate(member.Name) {
				destName = member.Name
			} else {
				destName = fmt.Sprintf("s.%s", member.Name)
			}

			// 'tmpName' now has the raw bit value loaded into the BitsType
			// We need to convert it to Type
			if member.BitsType == member.Type {
				b.Appendf("%s = %s(%s)", destName, member.Type.Name(b), tmpName)
			} else {
				switch mt := member.Type.(type) {
				case ScalarType:
					switch mt {
					case F32:
						b.Import("math")
						b.Appendf("%s = math.Float32frombits(%s)", destName, tmpName)
					case F64:
						b.Import("math")
						b.Appendf("%s = math.Float64frombits(%s)", destName, tmpName)
					default:
						panic("reached invalid branch")
					}
				case *EnumType:
					// Should we verify the enum values here?
					b.Appendf("%s = %s(%s)", destName, member.Type.Name(b), tmpName)
				case *ExternalType:
					b.Appendf("%s = %s(%s)", destName, member.Type.Name(b), tmpName)
				default:
					panic("reached invalid branch")
				}
			}
		} else {
			// Reserved bits
			// Skip over them
			b.Appendf("// <reserved> (%d bits)", member.Bits)
			currentBit += member.Bits
		}
	}

	if bitCount%8 > 0 {
		b.Appendf("// <left over> (%d bits)", bitCount%8)
	}
}
