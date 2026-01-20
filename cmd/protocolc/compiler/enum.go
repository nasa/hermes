package compiler

import (
	"fmt"
	"strings"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ Type   = (*EnumType)(nil)
	_ Symbol = (*EnumType)(nil)
	_ Code   = (*EnumType)(nil)
)

type EnumMember struct {
	Name  string
	Value int
}

type EnumType struct {
	NodeWithDocument

	name       string
	encodeType Type
	members    []*EnumMember

	// The values this type was constructed with
	args map[string]ast.Expr
}

// Field implements NamedType.
func (e *EnumType) Field(b StructBuilder, name string) {
	b.Field(name, e.Name(b))
}

// String implements Code.
func (e *EnumType) String(c Context) string {
	longestMemberName := 0
	for _, c := range e.members {
		if len(c.Name) > longestMemberName {
			longestMemberName = len(c.Name)
		}
	}

	out := []string{"const ("}
	for _, m := range e.members {
		out = append(out, fmt.Sprintf(
			"	%s_%-*s %s = %d", e.Name(c),
			longestMemberName, m.Name,
			e.Name(c), m.Value),
		)
	}
	out = append(out, ")")

	return strings.Join(out, "\n") + "\n"
}

// Build implements Buildable.
func (e *EnumType) Build(b DocumentBuilder) {
	b.Import("github.com/nasa/hermes/pkg/serial")
	b.Import("strconv")
	b.Import("fmt")

	b.Code(e)
	ty := b.Type(TypeConfig{
		Name:      e.name,
		Def:       e.encodeType.Name(b),
		IsPtr:     true,
		SelfIdent: "e",
	})

	unmarshal := ty.Method("Unmarshal", "(err error)")
	unmarshal.Argument("r", "*serial.Reader")

	unmarshal.Appendf("var raw %s", e.encodeType.Name(b))
	e.encodeType.Unmarshal(unmarshal, "raw")
	unmarshal.Appendf("*e = %s(raw)", e.name)
	unmarshal.Append(Line("return nil"))

	marshal := ty.Method("Marshal", "(err error)")
	marshal.Argument("w", "*serial.Writer")

	e.encodeType.Marshal(marshal, fmt.Sprintf("%s(*e)", e.encodeType.Name(b)))
	marshal.Append(Line("return nil"))

	stringF := b.Func(fmt.Sprintf("(e %s) String", e.name), "string")
	sw := stringF.Block("switch e")
	sw.Dedent()

	for _, member := range e.members {
		sw.Appendf("case %s_%s:", e.name, member.Name)
		sw.Indent().Appendf("return \"%s\"", member.Name)
	}

	sw.Appendf("default:")
	sw.Indent().Appendf("return strconv.FormatInt(int64(e), 10)")

	fromString := b.Func(fmt.Sprintf("(e *%s) FromString", e.name), "error")
	fromString.Argument("s", "string")

	sw = fromString.Block("switch s")
	sw.Dedent()

	for _, member := range e.members {
		sw.Appendf("case \"%s\":", member.Name)
		caseBlock := sw.Indent()
		caseBlock.Appendf("*e = %s_%s", e.name, member.Name)
		caseBlock.Appendf("return nil")
	}
	sw.Appendf("default:")
	sw.Indent().Appendf("return fmt.Errorf(\"'%%s' is not a valid member of %s\", s)", e.name)
}

// Name implements Type.
func (e *EnumType) Name(Context) string {
	return e.name
}

// Marshal implements Type.
func (e *EnumType) Marshal(b BlockBuilder, name string) {
	argCollector := &argCollector{
		ArgumentBuilder: b,
		argSource:       e.args,
		args:            []string{"w"},
		evaluated:       map[string]bool{},
	}

	e.encodeType.Marshal(argCollector, "")

	args := strings.Join(argCollector.args, ", ")
	b.Appendf("err = %s.Marshal(%s)", name, args)
	b.HandleError(fmt.Sprintf("%s marshal failed", e.name))
}

// Unmarshal implements Type.
func (e *EnumType) Unmarshal(b BlockBuilder, name string) {
	argCollector := &argCollector{
		ArgumentBuilder: b,
		argSource:       e.args,
		args:            []string{"r"},
		evaluated:       map[string]bool{},
	}

	e.encodeType.Unmarshal(argCollector, "")

	args := strings.Join(argCollector.args, ", ")
	b.Appendf("err = %s.Unmarshal(%s)", name, args)
	b.HandleError(fmt.Sprintf("%s unmarshal failed", e.name))
}
