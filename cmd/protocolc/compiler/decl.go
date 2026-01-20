package compiler

import (
	"fmt"
	"strings"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ TypeConstructor = (*declConstructor[*AliasType])(nil)
	_ TypeConstructor = (*declConstructor[*StructType])(nil)
	_ TypeConstructor = (*declConstructor[*EnumType])(nil)
)

type declConstructor[T Type] struct {
	name        *ast.SymbolDeclName
	constructor func(args map[string]ast.Expr) (Type, error)
}

// Construct implements TypeConstructor.
func (d *declConstructor[T]) Construct(args []ast.Expr) (Type, error) {
	if len(d.name.Args.Members) == 0 && len(args) > 0 {
		return nil, fmt.Errorf("%s does not accept parameters", d.name.Name.Name)
	}

	if len(args) != len(d.name.Args.Members) {
		return nil, fmt.Errorf(
			"%s accepts exactly %d parameters",
			d.name.Name.Name,
			len(d.name.Args.Members),
		)
	}

	argsExpr := map[string]ast.Expr{}
	for i, e := range args {
		argsExpr[d.name.Args.Members[i].Name] = e
	}

	return d.constructor(argsExpr)
}

type externConstructor struct {
	c    *compiler
	decl *ast.ExternTypeDecl
}

type externArg struct {
	Unmarshal bool
	Marshal   bool
	Type      string
}

// Construct implements TypeConstructor.
func (d *externConstructor) Construct(args []ast.Expr) (Type, error) {
	if len(d.decl.Name.Args.Members) == 0 && len(args) > 0 {
		return nil, fmt.Errorf("%s does not accept parameters", d.decl.Name.Name.Name)
	}

	if len(args) != len(d.decl.Name.Args.Members) {
		return nil, fmt.Errorf(
			"%s accepts exactly %d parameters",
			d.decl.Name.Name.Name,
			len(d.decl.Name.Args.Members),
		)
	}

	argTypes := []externArg{}
	for _, argE := range d.decl.Name.Args.Members {
		arg := exprAsString(d.c, argE)

		s := strings.Split(arg, ":")
		if len(s) != 2 {
			d.c.Error(NodeError(argE, fmt.Errorf("expected form `UM:GO_TYPE`")))
		}

		ea := externArg{
			Type: s[1],
		}

		switch s[0] {
		case "U":
			ea.Marshal = false
			ea.Unmarshal = true
		case "M":
			ea.Marshal = true
			ea.Unmarshal = false
		case "UM":
			ea.Marshal = true
			ea.Unmarshal = true
		default:
			d.c.Error(NodeError(argE, fmt.Errorf("function selector prefix must be U|M|UM")))
		}

		argTypes = append(argTypes, ea)
	}

	typeName, err := LiteralString(d.decl.Type)
	if err != nil {
		return nil, err
	}

	unmarshalArgs := []Expr{}
	marshalArgs := []Expr{}
	for i, e := range args {
		ce := ToExpr(e, argTypes[i].Type, "")
		if argTypes[i].Marshal {
			marshalArgs = append(marshalArgs, ce)
		}

		if argTypes[i].Unmarshal {
			unmarshalArgs = append(unmarshalArgs, ce)
		}
	}

	if d.c.hasErrors {
		return &standinType{}, nil
	}

	o := &ExternalType{
		NodeWithDocument: &nodeWithDocument{
			Node: d.decl,
			doc:  d.c.currentDocument,
		},
		Type:          typeName,
		MarshalArgs:   marshalArgs,
		UnmarshalArgs: unmarshalArgs,
	}

	d.c.symbols = append(d.c.symbols, o)
	return o, nil
}
