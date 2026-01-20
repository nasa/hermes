package builtin

import (
	"fmt"

	"github.com/nasa/hermes/cmd/protocolc/ast"
	"github.com/nasa/hermes/cmd/protocolc/compiler"
)

var (
	_ compiler.Type = (*command)(nil)
)

type command struct {
	IdField    string
	DefField   string
	Dictionary compiler.Expr
}

// Field implements compiler.NamedType.
func (e *command) Field(b compiler.StructBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/pb")
	b.Import("github.com/nasa/hermes/pkg/host")
	b.Field(name, e.Name(b))
	b.Field(e.DefField, "*pb.CommandDef")
}

// Marshal implements compiler.NamedType.
func (e *command) Marshal(b compiler.BlockBuilder, name string) {
	b.Appendf(`
	|if len(%[1]s) != len(s.%[2]s.Arguments) {
	|	return fmt.Errorf("expected %%d arguments, got %%d", len(s.%[2]s.Arguments), len(%[1]s))
	|}
	|`, name, e.DefField)

	fl := b.Block("for %s, arg := range s.%s.Arguments", b.LoopIterator(), e.DefField)
	fl.Appendf("err = w.Type(arg.GetType(), %s[%s])", name, b.LoopIterator())
	fl.HandleError("failed to write dictionary type")
}

// Name implements compiler.NamedType.
func (e *command) Name(compiler.Context) string {
	return "[]*pb.Value"
}

// Unmarshal implements compiler.NamedType.
func (e *command) Unmarshal(b compiler.BlockBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/host")
	b.Import("github.com/nasa/hermes/pkg/pb")
	b.Import("fmt")

	dictName := e.Dictionary.Evaluate(b)

	b.Appendf(`
	|s.%[2]s = %[4]s.Commands.Get2(int32(s.%[3]s))
	|if s.%[2]s == nil {
	|	return fmt.Errorf("no command with id %%d in dictionary", s.%[3]s)
	|}
	|
	|%[1]s = []*pb.Value{}
	|for _, arg := range s.%[2]s.Arguments {
	|	argValue, err := r.Type(arg.GetType())
	|	if err != nil {
	|		// return fmt.Errorf("failed to read event argument '%%s' (index %%d): %%w", arg.Name, i, err)
	|		return err
	|	}
	|
	|	%[1]s = append(%[1]s, argValue)
	|}`,
		name,
		e.DefField,
		e.IdField,
		dictName,
	)
}

func Command(args []ast.Expr) (compiler.Type, error) {
	if len(args) != 3 {
		return nil, fmt.Errorf("command type expects exactly 3 arguments")
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

	return &command{
		IdField:    idField,
		DefField:   defField,
		Dictionary: dict,
	}, nil
}
