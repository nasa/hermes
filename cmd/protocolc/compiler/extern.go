package compiler

import (
	"fmt"
	"strings"
)

var (
	_ Type   = (*ExternalType)(nil)
	_ Symbol = (*ExternalType)(nil)
	_ Symbol = (*ImportDecl)(nil)
)

type ImportDecl struct {
	NodeWithDocument

	Pkg string
}

// Build implements Symbol.
func (i *ImportDecl) Build(b DocumentBuilder) {
	b.Import(i.Pkg)
}

// Name implements Symbol.
func (i *ImportDecl) Name(Context) string {
	return i.Pkg
}

type ExternalType struct {
	NodeWithDocument

	Type          string
	MarshalArgs   []Expr
	UnmarshalArgs []Expr
}

// Build implements Symbol.
func (e *ExternalType) Build(b DocumentBuilder) {}

// Field implements NamedType.
func (e *ExternalType) Field(b StructBuilder, name string) {
	b.Field(name, e.Name(b))
}

// Marshal implements NamedType.
func (e *ExternalType) Marshal(b BlockBuilder, name string) {
	args := []string{"w"}
	for _, a := range e.MarshalArgs {
		args = append(args, a.Evaluate(b))
	}

	b.Appendf(`err = %s.Marshal(%s)`, name, strings.Join(args, ", "))
	b.HandleError(fmt.Sprintf("%s marshal failed", e.Type))
}

// Name implements NamedType.
func (e *ExternalType) Name(Context) string {
	return e.Type
}

// Unmarshal implements NamedType.
func (e *ExternalType) Unmarshal(b BlockBuilder, name string) {
	args := []string{"r"}
	for _, a := range e.UnmarshalArgs {
		args = append(args, a.Evaluate(b))
	}

	if e.Type[0] == '*' {
		// Allocate a new type
		b.Appendf(`%s = new(%s)`, name, e.Type[1:])
	}

	b.Appendf(`err = %s.Unmarshal(%s)`, name, strings.Join(args, ", "))
	b.HandleError(fmt.Sprintf("%s unmarshal failed", e.Type))
}
