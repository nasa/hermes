package compiler

import (
	"fmt"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ Type = (*StringType)(nil)
)

type TypeSize struct {
	Kind    ast.SizeKind
	Static  int
	Field   string
	Dynamic Type
}

type StringType struct {
	Size *TypeSize
}

// Field implements NamedType.
func (s *StringType) Field(b StructBuilder, name string) {
	b.Field(name, s.Name(b))
}

// Name implements Type.
func (s *StringType) Name(Context) string {
	return "string"
}

// Unmarshal implements Type.
func (s *StringType) Unmarshal(b BlockBuilder, name string) {
	var lengthName string
	if s.Size.Kind == ast.FILL {
		lengthName = "r.BytesLeft()"
	} else {
		lengthName = ReadSize(b, s.Size, name)
	}

	rawName := fmt.Sprintf("%sRaw", normalizeName(name))

	b.Appendf("%s, err := r.Read(uint32(%s))", rawName, lengthName)
	b.HandleError(fmt.Sprintf("%s: read failed", name))
	b.Appendf("%s = string(%s)", name, rawName)
}

// Marshal implements Type.
func (s *StringType) Marshal(b BlockBuilder, name string) {
	WriteSize(b, s.Size, name)
	b.Appendf("w.Write([]byte(%s))", name)
}
