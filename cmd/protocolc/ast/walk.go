package ast

import "fmt"

type Visitor interface {
	Visit(node Node) Visitor
}

func walkList[N Node](v Visitor, list []N) {
	for _, node := range list {
		Walk(v, node)
	}
}

// Walk traverses an AST in depth-first order: It starts by calling
// v.Visit(node); node must not be nil. If the visitor w returned by
// v.Visit(node) is not nil, Walk is invoked recursively with visitor
// w for each of the non-nil children of node, followed by a call of
// w.Visit(nil).
func Walk(v Visitor, node Node) {
	if v = v.Visit(node); v == nil {
		return
	}

	// walk children
	switch n := node.(type) {
	case Nodes:
		walkList(v, n)
	case *ArrayType:
		Walk(v, n.Elt)
	case *TypeCase:
		Walk(v, n.Cond)
		Walk(v, n.Type)
	case *MatchType:
		if n.Reader != nil {
			Walk(v, n.Reader)
		}
		walkList(v, n.Cases.Members)
	case *StringType:
		Walk(v, n.Size)
	case *TypeSize:
		if n.Dynamic != nil {
			Walk(v, n.Dynamic)
		} else if n.Static != nil {
			Walk(v, n.Static)
		}
	case *Field:
		if n.Name != nil {
			Walk(v, n.Name)
		}
		if n.Type != nil {
			Walk(v, n.Type)
		}
		if n.Initializer != nil {
			Walk(v, n.Initializer)
		}
		if n.Condition != nil {
			Walk(v, n.Condition)
		}
		if n.Literal != nil {
			Walk(v, n.Literal.Code)
		}
		if n.Arg != nil {
			Walk(v, n.Arg)
		}
	case *AliasTypeDecl:
		Walk(v, n.Name)
		Walk(v, n.Type)
	case *StructTypeDecl:
		Walk(v, n.Name)
		walkList(v, n.Fields.Members)
	case *EnumMember:
		Walk(v, n.Name)
		Walk(v, n.Value)
	case *BitmaskMember:
		if n.Name != nil {
			Walk(v, n.Name)
		}
		Walk(v, n.Value)
		if n.Type != nil {
			Walk(v, n.Type)
		}

		if n.Initializer != nil {
			Walk(v, n.Initializer)
		}
	case *EnumTypeDecl:
		Walk(v, n.Name)
		Walk(v, n.EncodeType)
		walkList(v, n.Members.Members)
	case *BitmaskType:
		walkList(v, n.Members.Members)
	case *PadType:
		Walk(v, n.Size)
	case *TransformType:
		Walk(v, n.Initial)
		Walk(v, n.Name)
		walkList(v, n.Args.Members)
	case *RefType:
		Walk(v, n.Name)
		walkList(v, n.Args.Members)
	case *SymbolDeclName:
		Walk(v, n.Name)
		walkList(v, n.Args.Members)
	case *Param:
		Walk(v, n.Name)
		Walk(v, n.Type)
	case *ExternDeclName:
		Walk(v, n.Name)
		walkList(v, n.Args.Members)
	case *ExternImport:
		Walk(v, n.Pkg)
	case *ExternTypeDecl:
		Walk(v, n.Name)
		Walk(v, n.Type)
	case *Ident:
	case *LitExpr:
		// Childless nodes
	default:
		panic(fmt.Sprintf("unhandled AST type %T", node))
	}
}
