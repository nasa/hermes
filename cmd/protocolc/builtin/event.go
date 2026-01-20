package builtin

import (
	"fmt"

	"github.com/nasa/hermes/cmd/protocolc/ast"
	"github.com/nasa/hermes/cmd/protocolc/compiler"
)

var (
	_ compiler.Type          = (*event)(nil)
	_ compiler.TransformType = (*eventArgs)(nil)
)

type event struct {
	IdField    string
	DefField   string
	DictField  string
	Dictionary compiler.Expr
}

// Field implements compiler.NamedType.
func (e *event) Field(b compiler.StructBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/pb")
	b.Import("github.com/nasa/hermes/pkg/host")
	b.Field(name, e.Name(b))
	b.Field(e.DefField, "*pb.EventDef")
	b.Field(e.DictField, "*host.DictionaryNamespace")
}

// Marshal implements compiler.NamedType.
func (e *event) Marshal(b compiler.BlockBuilder, name string) {
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
func (e *event) Name(compiler.Context) string {
	return "[]*pb.Value"
}

// Unmarshal implements compiler.NamedType.
func (e *event) Unmarshal(b compiler.BlockBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/host")
	b.Import("github.com/nasa/hermes/pkg/pb")
	b.Import("fmt")

	dictName := e.Dictionary.Evaluate(b)

	b.Appendf(`
	|if %[4]s == nil {
	|	return fmt.Errorf("no dictionary provided")
	|}
	|
	|s.%[2]s = %[4]s.Events.Get2(int32(s.%[3]s))
	|if s.%[2]s == nil {
	|	return fmt.Errorf("no event with id %%d in dictionary", s.%[3]s)
	|}
	|
	|s.%[5]s = %[4]s
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
		e.DictField,
	)
}

func Event(args []ast.Expr) (compiler.Type, error) {
	if len(args) != 4 {
		return nil, fmt.Errorf("event type expects exactly 4 arguments")
	}

	idField, err := compiler.LiteralString(args[0])
	if err != nil {
		return nil, err
	}

	defField, err := compiler.LiteralString(args[1])
	if err != nil {
		return nil, err
	}

	dictField, err := compiler.LiteralString(args[2])
	if err != nil {
		return nil, err
	}

	dict := compiler.ToExpr(
		args[3],
		"*host.DictionaryNamespace",
		"github.com/nasa/hermes/pkg/host",
	)

	return &event{
		IdField:    idField,
		DefField:   defField,
		DictField:  dictField,
		Dictionary: dict,
	}, nil
}

type eventArgs struct {
	IdField    string
	DefField   string
	DictField  string
	Dictionary compiler.Expr
}

// Field implements compiler.NamedTransformTypeType.
func (e *eventArgs) Field(b compiler.StructBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/pb")
	b.Import("github.com/nasa/hermes/pkg/host")
	b.Field(name, e.Name())
	b.Field(e.DefField, "*pb.EventDef")
	b.Field(e.DictField, "*host.DictionaryNamespace")
}

// Marshal implements compiler.TransformType.
func (e *eventArgs) Marshal(b compiler.BlockBuilder, name string, tmpValue string) {}

func (e *eventArgs) HasMarshal() bool   { return false }
func (e *eventArgs) HasUnmarshal() bool { return true }

// Name implements compiler.TransformType.
func (e *eventArgs) Name() string {
	return "[]*pb.Value"
}

// Unmarshal implements compiler.TransformType.
func (e *eventArgs) Unmarshal(b compiler.BlockBuilder, name string, tmpName string) {
	b.Import("fmt")

	dictName := e.Dictionary.Evaluate(b)

	b.Appendf(`
	|if %[4]s == nil {
	|	return fmt.Errorf("no dictionary provided")
	|}
	|
	|s.%[2]s = %[4]s.Events.Get2(int32(s.%[3]s))
	|if s.%[2]s == nil {
	|	return fmt.Errorf("no event with id %%d in dictionary", s.%[3]s)
	|}
	|
	|s.%[5]s = %[4]s
	|%[1]s = []*pb.Value{}
	|tr := r.Clone()
	`,
		name,
		e.DefField,
		e.IdField,
		dictName,
		e.DictField,
	)

	loop := b.Block("for i, arg := range s.%s.Arguments", e.DefField)
	loop.Appendf(`
	|tr.Set(%[1]s[i])
	|// Current package must define how to handle each EVR argument
	|// You can pass this call through to DecodeEvrArg for default behavior
	|argValue, err := DecodeEvrArg(tr, arg)
	|if err != nil {
	|	// return fmt.Errorf("failed to read event argument '%%s' (index %%d): %%w", arg.Name, i, err)
	|	return err
	|}
	|
	|%[2]s = append(%[2]s, argValue)
	`,
		tmpName,
		name,
	)
}

func EventArgs(inputType string, args []ast.Expr) (compiler.TransformType, error) {
	if len(args) != 4 {
		return nil, fmt.Errorf("event type expects exactly 4 arguments")
	}

	if inputType != "[][]byte" {
		return nil, fmt.Errorf("input type to EventArgs should be [][]byte not %s", inputType)
	}

	idField, err := compiler.LiteralString(args[0])
	if err != nil {
		return nil, err
	}

	defField, err := compiler.LiteralString(args[1])
	if err != nil {
		return nil, err
	}

	dictField, err := compiler.LiteralString(args[2])
	if err != nil {
		return nil, err
	}

	dict := compiler.ToExpr(
		args[3],
		"*host.DictionaryNamespace",
		"github.com/nasa/hermes/pkg/host",
	)

	return &eventArgs{
		IdField:    idField,
		DefField:   defField,
		DictField:  dictField,
		Dictionary: dict,
	}, nil
}
