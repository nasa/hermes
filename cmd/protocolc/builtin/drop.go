package builtin

import (
	"fmt"
	"strings"

	"github.com/nasa/hermes/cmd/protocolc/ast"
	"github.com/nasa/hermes/cmd/protocolc/compiler"
)

var (
	_ compiler.TransformType = (*drop)(nil)
)

type drop struct {
	args string
}

func (d *drop) HasMarshal() bool   { return false }
func (d *drop) HasUnmarshal() bool { return true }
func (d *drop) Field(b compiler.StructBuilder, name string) {
}
func (d *drop) Marshal(b compiler.BlockBuilder, name string, tmpName string) {}
func (d *drop) Name() string                                                 { return "[]byte" }

// Unmarshal implements compiler.TransformType.
func (d *drop) Unmarshal(b compiler.BlockBuilder, name string, tmpName string) {
	b.Import("fmt")
	b.Appendf(`
	|if len(%s) > 0 {
	|	return fmt.Errorf(%s)
	|}`, tmpName, d.args)
}

// Drop the packet
func Drop(inputType string, args []ast.Expr) (compiler.TransformType, error) {
	if inputType != "[]byte" {
		return nil, fmt.Errorf("drop only accepts []byte inputs")
	}

	if len(args) < 1 {
		return nil, fmt.Errorf("drop requires at least one argument (error message)")
	}

	valueArgs := []string{}
	for i, a := range args {
		argS, err := compiler.LiteralString(a)
		if err != nil {
			return nil, fmt.Errorf("drop accepts only literal string arguments")
		}

		if i == 0 {
			// First argument is the format string
			argS = fmt.Sprintf(`"%s"`, argS)
		}

		valueArgs = append(valueArgs, argS)
	}

	return &drop{args: strings.Join(valueArgs, ", ")}, nil
}
