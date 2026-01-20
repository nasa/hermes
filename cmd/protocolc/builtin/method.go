package builtin

import (
	"fmt"
	"strings"

	"github.com/nasa/hermes/cmd/protocolc/ast"
	"github.com/nasa/hermes/cmd/protocolc/compiler"
)

var (
	_ compiler.TransformType = (*method)(nil)
)

type method struct {
	MarshalMethod   string
	UnmarshalMethod string
	ReturnType      string
	HandleError     bool

	MarshalArgs   []compiler.Expr
	UnmarshalArgs []compiler.Expr
}

// Field implements compiler.TransformType.
func (m *method) Field(b compiler.StructBuilder, name string) {
	b.Field(name, m.Name())
}

// HasMarshal implements compiler.TransformType.
func (m *method) HasMarshal() bool {
	return m.MarshalMethod != ""
}

// HasUnmarshal implements compiler.TransformType.
func (m *method) HasUnmarshal() bool {
	return m.UnmarshalMethod != ""
}

// Marshal implements compiler.TransformType.
func (m *method) Marshal(b compiler.BlockBuilder, name string, tmpName string) {
	args := []string{}
	for _, arg := range m.MarshalArgs {
		args = append(args, arg.Evaluate(b))
	}

	if m.HandleError {
		b.Appendf("%s, err = %s.%s(%s)", name, tmpName, m.MarshalMethod, strings.Join(args, ", "))
		b.HandleError(fmt.Sprintf("failed to %s", m.MarshalMethod))
	} else {
		b.Appendf("%s = %s.%s(%s)", name, tmpName, m.MarshalMethod, strings.Join(args, ", "))
	}
}

// Name implements compiler.TransformType.
func (m *method) Name() string {
	return m.ReturnType
}

// Unmarshal implements compiler.TransformType.
func (m *method) Unmarshal(b compiler.BlockBuilder, name string, tmpName string) {
	args := []string{}
	for _, arg := range m.UnmarshalArgs {
		args = append(args, arg.Evaluate(b))
	}

	if m.HandleError {
		b.Appendf("%s, err = %s.%s(%s)", name, tmpName, m.UnmarshalMethod, strings.Join(args, ", "))
		b.HandleError(fmt.Sprintf("failed to %s", m.UnmarshalMethod))
	} else {
		b.Appendf("%s = %s.%s(%s)", name, tmpName, m.UnmarshalMethod, strings.Join(args, ", "))
	}
}

func newMethod(args []ast.Expr, handleError bool) (compiler.TransformType, error) {
	if len(args) < 3 {
		return nil, fmt.Errorf("Method() type expects at least 3 arguments")
	}

	returnType, err := compiler.LiteralString(args[0])
	if err != nil {
		return nil, err
	}

	marshalMethodName, err := compiler.LiteralString(args[1])
	if err != nil {
		return nil, err
	}

	unmarshalMethodName, err := compiler.LiteralString(args[2])
	if err != nil {
		return nil, err
	}

	marshalArgs := []compiler.Expr{}
	unmarshalArgs := []compiler.Expr{}

	if len(args) > 4 {
		marshalArgsN, err := compiler.LiteralInt(args[3])
		if err != nil {
			return nil, fmt.Errorf("Expected integer (num marshal args): %w", err)
		}

		if 4+marshalArgsN >= len(args) {
			return nil, fmt.Errorf(
				"not enough arguments since num marshal args == %d, expected %d more args",
				marshalArgsN,
				len(args)-(4+marshalArgsN),
			)
		}

		for m := range marshalArgsN {
			marshalArgs = append(marshalArgs, compiler.ToExpr(args[4+m], "", ""))
		}

		for _, unmarshalArg := range args[4+marshalArgsN:] {
			unmarshalArgs = append(unmarshalArgs, compiler.ToExpr(unmarshalArg, "", ""))
		}
	}

	return &method{
		MarshalMethod:   marshalMethodName,
		UnmarshalMethod: unmarshalMethodName,
		ReturnType:      returnType,
		HandleError:     handleError,

		MarshalArgs:   marshalArgs,
		UnmarshalArgs: unmarshalArgs,
	}, nil
}

func Method(inputType string, args []ast.Expr) (compiler.TransformType, error) {
	return newMethod(args, false)
}

func MethodWithErr(inputType string, args []ast.Expr) (compiler.TransformType, error) {
	return newMethod(args, true)
}
