package compiler

import (
	"errors"
	"fmt"
	"strconv"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ Expr = (*literalExpr)(nil)
	_ Expr = (*argExpr)(nil)
)

type Expr interface {
	Evaluate(b BlockBuilder) string
}

type literalExpr struct {
	value string
}

// Evaluate implements Expr.
func (l *literalExpr) Evaluate(b BlockBuilder) string {
	return l.value
}

type argExpr struct {
	name   string
	goType string
	pkg    string
}

// Evaluate implements Expr.
func (a *argExpr) Evaluate(b BlockBuilder) string {
	if a.pkg != "" {
		b.Import(a.pkg)
	}

	b.Argument(a.name, a.goType)
	return a.name
}

// Evaluate this expression as a runtime
func ToExpr(
	e ast.Expr,
	goType string,
	pkg string,
) Expr {
	switch et := e.(type) {
	case *ast.LitExpr:
		return &literalExpr{value: et.Value}
	case *ast.Ident:
		return &argExpr{
			name:   et.Name,
			goType: goType,
			pkg:    pkg,
		}
	default:
		panic(fmt.Errorf("invalid ast.Expr: %T", et))
	}
}

func LiteralInt(e ast.Expr) (int, error) {
	if l, ok := e.(*ast.LitExpr); ok {
		if l.Kind == ast.INT {
			v, err := strconv.ParseInt(l.Value, 0, 0)
			if err != nil {
				return 0, err
			} else {
				return int(v), nil
			}
		} else {
			return 0, NodeError(l, errors.New("expected literal integer"))
		}
	} else {
		return 0, NodeError(e, errors.New("expected literal integer expression"))
	}
}

func LiteralString(e ast.Expr) (string, error) {
	if l, ok := e.(*ast.LitExpr); ok {
		if l.Kind == ast.STRING {
			return l.Value, nil
		} else {
			return "", NodeError(l, errors.New("expected literal string"))
		}
	} else {
		return "", NodeError(e, errors.New("expected literal string expression"))
	}
}

func exprAsInt(c *compiler, l *ast.LitExpr) int {
	v, err := LiteralInt(l)
	if err != nil {
		c.Error(NodeError(l, err))
	}

	return v
}

func exprAsString(c *compiler, l *ast.LitExpr) string {
	v, err := LiteralString(l)
	if err != nil {
		c.Error(NodeError(l, err))
	}

	return v
}

func toTypeSize(c *compiler, a *ast.TypeSize) *TypeSize {
	switch a.Kind {
	case ast.DYNAMIC:
		return &TypeSize{
			Kind:    a.Kind,
			Dynamic: toType(c, a.Dynamic),
		}
	case ast.STATIC:
		switch a.Static.Kind {
		case ast.INT:
			return &TypeSize{
				Kind:   a.Kind,
				Static: exprAsInt(c, a.Static),
			}
		case ast.STRING:
			return &TypeSize{
				Kind:  ast.FIELD,
				Field: exprAsString(c, a.Static),
			}
		default:
			c.Error(NodeError(a, fmt.Errorf("expected int or string literal for array size")))
			return &TypeSize{}
		}
	case ast.FILL:
		return &TypeSize{Kind: a.Kind}
	default:
		panic("invalid TypeSize kind")
	}
}

type standinType struct {
	Type
}

func toType(c *compiler, a ast.Type) Type {
	if a == nil {
		return nil
	}

	switch ty := a.(type) {
	case *ast.RefType:
		// Construct the type
		cty, err := c.types[ty.Name.Name].Construct(ty.Args.Members)
		if err != nil {
			c.Error(NodeError(ty, err))
			return &standinType{}
		}

		return cty
	case *ast.ArrayType:
		return &ArrayType{
			Size: toTypeSize(c, ty.Size),
			Elt:  toType(c, ty.Elt),
		}
	case *ast.StringType:
		return &StringType{
			Size: toTypeSize(c, ty.Size),
		}
	case *ast.TransformType:
		initialType := toType(c, ty.Initial)

		tt, err := c.transformType[ty.Name.Name](initialType.Name(c), ty.Args.Members)
		if err != nil {
			c.Error(NodeError(ty.Name, err))
		}

		return &transformType{
			Impl:    tt,
			Initial: initialType,
		}
	case *ast.PadType:
		return &PadType{
			Size: exprAsInt(c, ty.Size),
		}
	case *ast.MatchType:
		mt := &MatchType{
			Reader: toType(c, ty.Reader),
			Cases:  toTypeCases(c, ty.Cases.Members),
		}

		if mt.Reader != nil && mt.Reader.Name(c) != "[]byte" {
			c.Error(NodeError(ty.Reader, fmt.Errorf("match type reader type must be '[]byte'")))
		}

		return mt
	case *ast.BitmaskType:
		return &BitmaskType{
			members: toBitmaskMembers(c, ty.Members.Members),
		}
	default:
		panic(fmt.Sprintf("unhandled type %T", a))
	}
}

func toEnumMember(c *compiler, member *ast.EnumMember) *EnumMember {
	return &EnumMember{
		Name:  member.Name.Name,
		Value: exprAsInt(c, member.Value),
	}
}

func toEnumMembers(
	c *compiler,
	members []*ast.EnumMember,
) []*EnumMember {
	out := []*EnumMember{}
	for _, m := range members {
		out = append(out, toEnumMember(c, m))
	}

	return out
}

func toBitmaskMember(c *compiler, member *ast.BitmaskMember) *BitmaskMember {
	mask := &BitmaskMember{
		Bits: exprAsInt(c, member.Value),
	}

	if member.Name != nil {
		mask.Name = member.Name.Name
	}

	switch {
	case mask.Bits < 0:
		c.Error(NodeError(member.Value, fmt.Errorf("invalid negative bitfield size")))
	case mask.Bits == 0:
		c.Error(NodeError(member.Value, fmt.Errorf("invalid zero bitfield size")))
	case mask.Bits <= 8:
		mask.BitsType = U8
	case mask.Bits <= 16:
		mask.BitsType = U16
	case mask.Bits <= 32:
		mask.BitsType = U32
	case mask.Bits <= 64:
		mask.BitsType = U64
	default:
		c.Error(NodeError(member.Value, fmt.Errorf("unsupported bitfield size over 64-bits")))
	}

	if member.Type != nil {
		mask.Type = toType(c, member.Type)
		if mask.Type != nil {
			// Check if we can convert from bits to struct field
			switch mt := mask.Type.(type) {
			case ScalarType:
				switch mt {
				case U8, I8, U16, I16, U32, I32, U64, I64:
					c.Error(NodeError(member.Type, fmt.Errorf("bitfields should not be converted to alternate integral scalars due to possible loss of precision")))
				case F32:
					if mask.BitsType != U32 {
						c.Error(NodeError(member.Type, fmt.Errorf("F32 can only be converted from U32 in bitmask")))
					}
				case F64:
					if mask.BitsType != U64 {
						c.Error(NodeError(member.Type, fmt.Errorf("F64 can only be converted from U64 in bitmask")))
					}
				}
			case *EnumType:
				// All enums are OK to convert from any integral type
			case *ExternalType:
				// We don't have any information about this type
				// Assume this is ok and let the Go compiler catch any errors
			default:
				c.Error(NodeError(member.Type, fmt.Errorf("invalid bitfield type %T, cannot be converted from bits", mt)))
			}
		}
	} else {
		mask.Type = mask.BitsType
	}

	if member.Name != nil {
		if fieldNameIsPrivate(member.Name.Name) {
			if member.Initializer != nil {
				mask.Initializer = exprAsString(c, member.Initializer)
			} else {
				c.Error(NodeError(member.Name, fmt.Errorf("private bit-fields must have initializers")))
			}
		} else if member.Initializer != nil {
			c.Error(NodeError(member.Name, fmt.Errorf("only private bit-fields can have initializers")))
		}
	}

	return mask
}

func toBitmaskMembers(
	c *compiler,
	members []*ast.BitmaskMember,
) []*BitmaskMember {
	out := []*BitmaskMember{}
	for _, m := range members {
		out = append(out, toBitmaskMember(c, m))
	}

	return out
}

func toTypeCase(
	c *compiler,
	cs *ast.TypeCase,
) *TypeCase {
	var cond string
	if cs.Cond != nil {
		var err error
		cond, err = LiteralString(cs.Cond)
		if err != nil {
			c.Error(NodeError(cs.Cond, err))
		}
	}

	return &TypeCase{
		Condition: cond,
		Type:      toType(c, cs.Type),
	}
}

func toTypeCases(
	c *compiler,
	cases []*ast.TypeCase,
) []*TypeCase {
	out := []*TypeCase{}
	for _, cs := range cases {
		out = append(out, toTypeCase(c, cs))
	}

	return out
}

func symbolDeclName(decl ast.SymbolDecl) *ast.SymbolDeclName {
	switch ty := decl.(type) {
	case *ast.AliasTypeDecl:
		return ty.Name
	case *ast.EnumTypeDecl:
		return ty.Name
	case *ast.StructTypeDecl:
		return ty.Name
	default:
		panic("no implementation for symbol decl name")
	}
}

func declName(decl ast.Decl) *ast.Ident {
	switch ty := decl.(type) {
	case *ast.AliasTypeDecl:
		return ty.Name.Name
	case *ast.EnumTypeDecl:
		return ty.Name.Name
	case *ast.StructTypeDecl:
		return ty.Name.Name
	case *ast.ExternTypeDecl:
		return ty.Name.Name
	default:
		panic("no implementation for decl name")
	}
}

type ref struct {
	node ast.Node
	doc  *ast.Document
}

type RefType struct {
	TypeConstructor
	References []ref
}

func (r *RefType) AddReference(doc *ast.Document, a ast.Node) {
	r.References = append(r.References, ref{
		node: a,
		doc:  doc,
	})
}
