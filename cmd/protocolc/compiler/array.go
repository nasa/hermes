package compiler

import (
	"fmt"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ Type = (*ArrayType)(nil)
)

type ArrayType struct {
	Size *TypeSize
	Elt  Type
}

// Field implements Type.
func (a *ArrayType) Field(b StructBuilder, name string) {
	b.Field(name, a.Name(b))
}

// Marshal implements Type.
func (a *ArrayType) Marshal(b BlockBuilder, name string) {
	WriteSize(b, a.Size, name)
	if a.Elt.Name(b) == "byte" {
		b.Appendf("w.Write(%s)", name)
	} else {
		loop := b.Block("for _, %s := range %s", b.LoopIterator(), name)
		a.Elt.Marshal(loop, b.LoopIterator())
	}
}

// Name implements Type.
func (a *ArrayType) Name(c Context) string {
	switch a.Size.Kind {
	case ast.DYNAMIC, ast.FILL, ast.FIELD:
		return fmt.Sprintf("[]%s", a.Elt.Name(c))
	case ast.STATIC:
		return fmt.Sprintf("[%d]%s", a.Size.Static, a.Elt.Name(c))
	default:
		panic("invalid size kind")
	}
}

// Unmarshal implements Type.
func (a *ArrayType) Unmarshal(b BlockBuilder, name string) {
	var lengthName string
	if a.Size.Kind == ast.FILL {
		if a.Elt.Name(b) == "byte" {
			b.Appendf("%s, err = r.Read(r.BytesLeft())", name)
			b.HandleError("array buffer read failed")
		} else {
			b.Import("io")
			b.Import("errors")
			loop := b.Block("for").ErrorHandlerf(`
			|if err != nil {
			|	if errors.Is(err, io.EOF) {
			|		break
			|	} else {
			|		return fmt.Errorf("{MSG}: %%w", err)
			|	}
			|}`)

			loop.Appendf("var %s %s", b.LoopIterator(), a.Elt.Name(b))
			a.Elt.Unmarshal(loop, b.LoopIterator())
			loop.Appendf("%s = append(%s, %s)", name, name, b.LoopIterator())
		}
	} else {
		lengthName = ReadSize(b, a.Size, name)

		// Special handling for byte arrays since they
		// can be read in a single operation
		if a.Elt.Name(b) == "byte" {
			b.Appendf("%s, err = r.Read(uint32(%s))", name, lengthName)
			b.HandleError("array buffer read failed")
		} else {
			// Pre-allocate an array
			switch a.Size.Kind {
			case ast.DYNAMIC, ast.FIELD:
				b.Appendf("%s = make(%s, %s)", name, a.Name(b), lengthName)
			}

			loop := b.Block("for %s := range %s", b.LoopIterator(), lengthName)
			a.Elt.Unmarshal(loop, fmt.Sprintf("%s[%s]", name, b.LoopIterator()))
		}
	}
}
