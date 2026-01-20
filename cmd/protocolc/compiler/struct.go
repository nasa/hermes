package compiler

import (
	"fmt"
	"strings"
	"unicode"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ Type   = (*StructType)(nil)
	_ Symbol = (*StructType)(nil)
)

type StructField struct {
	Name        string
	Type        Type
	Initializer string
	Condition   string
}

type StructType struct {
	NodeWithDocument

	name   string
	bo     ast.ByteOrderKind
	fields []*StructField

	// The values this type was constructed with
	args map[string]ast.Expr
}

// Field implements Type.
func (s *StructType) Field(b StructBuilder, name string) {
	b.Field(name, s.Name(b))
}

func fieldNameIsPrivate(name string) bool {
	if len(name) == 0 {
		return false
	}

	return unicode.IsLower(rune(name[0]))
}

// Build implements Buildable.
func (s *StructType) Build(b DocumentBuilder) {
	b.Import("github.com/nasa/hermes/pkg/serial")
	b.Import("encoding/binary")

	sb := b.Struct(s.name)

	for _, f := range s.fields {
		if !fieldNameIsPrivate(f.Name) {
			f.Type.Field(sb, f.Name)
		}
	}

	unmarshal := sb.Method("Unmarshal", "(err error)")
	unmarshal.Argument("ro", "*serial.Reader")

	var bo string
	switch s.bo {
	case ast.BIG:
		bo = "BigEndian"
	case ast.LITTLE:
		bo = "LittleEndian"
	default:
		panic("invalid byte order kind")
	}

	unmarshal.Appendf(`
	|r := ro.WithByteOrder(binary.%s)
	|defer func() { ro.SetOffset(r.Offset()) }()`, bo)
	unmarshal.Appendf("")

	for _, f := range s.fields {
		if f.Name != "" {
			unmarshal.Appendf("// Unmarshal %s", f.Name)
		}

		var block BlockBuilder = unmarshal
		var name string

		if f.Condition != "" {
			block = unmarshal.Block("if %s", f.Condition)
		}

		if fieldNameIsPrivate(f.Name) {
			unmarshal.Appendf("var %s %s", f.Name, f.Type.Name(unmarshal))
			name = f.Name
		} else {
			name = fmt.Sprintf("s.%s", f.Name)
		}

		f.Type.Unmarshal(block, name)
		unmarshal.Appendf("")
	}

	unmarshal.Appendf("return nil")

	marshal := sb.Method("Marshal", "(err error)")
	marshal.Argument("wo", "*serial.Writer")
	marshal.Appendf(`
	|w := wo.WithByteOrder(binary.%s)
	|defer func() { wo.Set(w.Get()) }()`, bo)
	marshal.Appendf("")

	for _, f := range s.fields {
		var block BlockBuilder = marshal
		var name string

		if f.Condition != "" {
			block = marshal.Block("if %s", f.Condition)
		}

		if fieldNameIsPrivate(f.Name) {
			// Check if this private field has an initializer
			// If it does, we don't need to ask for an argument
			if f.Initializer != "" {
				// Initialize the private field
				marshal.Appendf("%s := %s(%s)", f.Name, f.Type.Name(marshal), f.Initializer)
			} else {
				// Request an argument to fill this variable's value
				marshal.Argument(f.Name, f.Type.Name(marshal))
			}

			name = f.Name
		} else {
			name = fmt.Sprintf("s.%s", f.Name)
		}

		f.Type.Marshal(block, name)
	}
	marshal.Appendf("return nil")
}

var (
	_ BlockBuilder = (*argCollector)(nil)
)

type argCollector struct {
	ArgumentBuilder BlockBuilder
	argSource       map[string]ast.Expr
	evaluated       map[string]bool
	args            []string
}

// Append implements BlockBuilder.
func (c *argCollector) LoopIterator() string               { return "" }
func (c *argCollector) Append(stmt Statement)              {}
func (c *argCollector) Appendf(format string, args ...any) {}
func (c *argCollector) Return(stmt Statement)              {}
func (c *argCollector) Returnf(format string, args ...any) {}
func (c *argCollector) Dedent()                            {}
func (c *argCollector) HandleError(string)                 {}
func (c *argCollector) Error(err error)                    {}
func (c *argCollector) Warning(err error)                  {}
func (c *argCollector) Block(format string, args ...any) BlockBuilder {
	return c
}
func (c *argCollector) Indent() BlockBuilder {
	return c
}
func (c *argCollector) ErrorHandler(func(BaseBuilder, string) Statement) BlockBuilder {
	return c
}
func (c *argCollector) ErrorHandlerf(format string, args ...any) BlockBuilder {
	return c
}

func (c *argCollector) Import(pkg string) {
	c.ArgumentBuilder.Import(pkg)
}

func (c *argCollector) Argument(name string, typeName string) {
	if c.evaluated[name] {
		return
	}

	expr := ToExpr(c.argSource[name], typeName, "")
	c.args = append(c.args, expr.Evaluate(c.ArgumentBuilder))
	c.evaluated[name] = true
}

// Marshal implements Type.
func (s *StructType) Marshal(b BlockBuilder, name string) {
	argCollector := &argCollector{
		ArgumentBuilder: b,
		argSource:       s.args,
		evaluated:       map[string]bool{},
		args:            []string{"w"},
	}

	for _, f := range s.fields {
		if fieldNameIsPrivate(f.Name) {
			// Check if this private field has an initializer
			// If it does, we don't need to ask for an argument
			if f.Initializer != "" {
				// This field already has an initializer, we don't need a new argument
			} else {
				// Create a local parameter name to pass to this field argument
				varName := normalizeName(fmt.Sprintf("%s_%s", name, f.Name))
				b.Argument(varName, f.Type.Name(b))
				argCollector.args = append(argCollector.args, varName)
			}
		}
		f.Type.Marshal(argCollector, f.Name)
	}

	args := strings.Join(argCollector.args, ", ")
	b.Appendf("err = %s.Marshal(%s)", name, args)
	b.HandleError(fmt.Sprintf("marshal failed '%s'", s.name))
}

// Name implements Type.
func (s *StructType) Name(Context) string {
	return "*" + s.name
}

// Unmarshal implements Type.
func (s *StructType) Unmarshal(b BlockBuilder, name string) {
	argCollector := &argCollector{
		ArgumentBuilder: b,
		argSource:       s.args,
		args:            []string{"r"},
		evaluated:       map[string]bool{},
	}

	for _, f := range s.fields {
		f.Type.Unmarshal(argCollector, f.Name)
	}

	args := strings.Join(argCollector.args, ", ")
	b.Appendf("%s = &%s{}", name, s.name)
	b.Appendf("err = %s.Unmarshal(%s)", name, args)
	b.HandleError(fmt.Sprintf("unmarshal failed '%s'", s.name))
}
