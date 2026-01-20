package builtin

import (
	"fmt"

	"github.com/nasa/hermes/cmd/protocolc/ast"
	"github.com/nasa/hermes/cmd/protocolc/compiler"
)

var (
	_ compiler.Type = (*telemetry)(nil)
)

type telemetry struct {
	IdField    string
	DefField   string
	Dictionary compiler.Expr
}

// Field implements compiler.NamedType.
func (t *telemetry) Field(b compiler.StructBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/pb")
	b.Field(t.DefField, "*pb.TelemetryDef")
	b.Field(name, t.Name(b))
}

// Marshal implements compiler.NamedType.
func (t *telemetry) Marshal(b compiler.BlockBuilder, name string) {
	b.Appendf(`err = w.Type(s.%s.GetType(), %s)`, t.DefField, name)
	b.HandleError("failed to write dictionary type")
}

// Name implements compiler.NamedType.
func (t *telemetry) Name(compiler.Context) string {
	return "*pb.Value"
}

// Unmarshal implements compiler.NamedType.
func (t *telemetry) Unmarshal(b compiler.BlockBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/host")
	b.Import("fmt")

	dictName := t.Dictionary.Evaluate(b)

	b.Appendf(`
	|if %[4]s == nil {
	|	return fmt.Errorf("no dictionary provided")
	|}
	|
	|s.%[2]s = %[4]s.Telemetry.Get2(int32(s.%[3]s))
	|if s.%[2]s == nil {
	|	return fmt.Errorf("no telemetry with id %%d in dictionary", s.%[3]s)
	|}
	|%[1]s, err = r.Type(s.%[2]s.GetType())
	`, name, t.DefField, t.IdField, dictName)
	b.HandleError("failed to read dictionary type")
}

func Telemetry(args []ast.Expr) (compiler.Type, error) {
	if len(args) != 3 {
		return nil, fmt.Errorf("telemetry type expects exactly 3 arguments")
	}

	idField, err := compiler.LiteralString(args[0])
	if err != nil {
		return nil, err
	}

	defField, err := compiler.LiteralString(args[1])
	if err != nil {
		return nil, err
	}

	dict := compiler.ToExpr(
		args[2],
		"*host.DictionaryNamespace",
		"github.com/nasa/hermes/pkg/host",
	)

	return &telemetry{
		IdField:    idField,
		DefField:   defField,
		Dictionary: dict,
	}, nil
}
