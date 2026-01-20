package compiler

import (
	"fmt"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ Type   = (*AliasType)(nil)
	_ Symbol = (*AliasType)(nil)
	_ Code   = (*AliasType)(nil)
)

type AliasType struct {
	NodeWithDocument

	name           string
	underlyingType Type
	args           map[string]ast.Expr
}

// Field implements NamedType.
func (a *AliasType) Field(b StructBuilder, name string) {
	a.underlyingType.Field(b, name)
}

// String implements codegen.Code.
func (a *AliasType) String(c Context) string {
	return fmt.Sprintf("type %s = %s", a.name, a.underlyingType.Name(c))
}

// Build implements Buildable.
func (a *AliasType) Build(b DocumentBuilder) {
	b.Code(a)
}

// Marshal implements Type.
func (a *AliasType) Marshal(b BlockBuilder, name string) {
	a.underlyingType.Marshal(b, name)
}

// Name implements Type.
func (a *AliasType) Name(Context) string {
	return a.name
}

// Unmarshal implements Type.
func (a *AliasType) Unmarshal(b BlockBuilder, name string) {
	a.underlyingType.Unmarshal(b, name)
}
