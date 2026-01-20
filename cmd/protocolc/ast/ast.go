package ast

type Pos int

// All node types implement the Node interface.
type Node interface {
	Pos() Pos // position of first character belonging to the node
	End() Pos // position of first character immediately after the node
}

type Decl interface {
	Node
	declNode()
}

type Expr interface {
	Node
	exprNode()
}

type Type interface {
	Node
	typeNode()
}

type TypeDecl interface {
	Type
	Decl
}

type SymbolDecl interface {
	Node
	symbolNode()
}

type LitKind int

const (
	INT LitKind = iota
	FLOAT
	STRING
)

type ByteOrderKind int

const (
	LITTLE ByteOrderKind = iota
	BIG
)

type SizeKind int

const (
	DYNAMIC SizeKind = iota
	FIELD
	STATIC
	FILL
)

type (
	Nodes []Node

	// An Ident node represents an identifier.
	Ident struct {
		NamePos Pos    // identifier position
		Name    string // identifier name
	}

	Group[T any] struct {
		Members T
		Open    Pos
		Close   Pos
	}

	LitExpr struct {
		ValuePos Pos     // literal position
		Kind     LitKind // INT, FLOAT, or STRING
		Value    string  // literal string; e.g. 42, 0x7f, 3.14, 1e-9, 2.4i, 'a', '\x7f', "foo" or `\m\n\o`
	}

	// An unresolved reference to a type
	// This is only used when initially constructing the AST
	// during the parsing stage.
	RefType struct {
		Name *Ident

		// Optional arguments to pass to the
		Args Group[[]Expr]
	}

	TypeSize struct {
		Open  Pos
		Close Pos

		Kind SizeKind

		// If this is not `nil`, this is the data type read dynamically for the type
		Dynamic Type

		// Static size
		Static *LitExpr
	}

	ArrayType struct {
		Size *TypeSize
		Elt  Type
	}

	StringType struct {
		Size  *TypeSize
		Token Pos
	}

	// A TransformType is a custom type that does not directly read
	// from the byte stream but rather applies some function over
	// some data that has already been read.
	TransformType struct {
		// Type to initially parse before passing to the
		// the transformation
		Initial Type

		// Name of the transformation
		Name *Ident

		// Arguments to pass to the transformer
		Args Group[[]Expr]
	}

	// Skips over 'Size' count of bytes in the reader
	// Writes this many zeros to the writer
	PadType struct {
		Size *LitExpr
	}

	TypeCase struct {
		Cond *LitExpr
		Type Type
	}

	// Match a condition given other field values
	// Given there is a matching condition, pass the
	// current reader to the type case
	MatchType struct {
		Reader Type
		Cases  Group[[]*TypeCase]
	}

	BitmaskMember struct {
		Name        *Ident
		Value       *LitExpr
		Type        Type
		Initializer *LitExpr
	}

	BitmaskType struct {
		Members Group[[]*BitmaskMember]
	}

	FieldLiteral struct {
		IsMarshal bool
		Code      *LitExpr
	}

	Param struct {
		IsMarshal bool
		Name      *Ident
		Type      *LitExpr
	}

	Field struct {
		// Name of the field
		// If this is nil, its a pad or a literal code string
		// and does not declare any field in the underlying Go struct
		Name *Ident

		// Struct type that defines how to marshal/unmarshal data
		// into/from a binary blob.
		Type Type

		// Value to initialize this field/value with during marshalling
		// This can also be used for 'private' fields to initialize inside
		// the function rather than require a parameter to be passed in
		Initializer *LitExpr

		// Conditional expression to check before attempting to encode/decode
		// this type. If the condition fails, decoding will leave the zero value
		// in place of the resulting member
		Condition *LitExpr

		// Psuedo struct field
		// Holds arbitrary Marshal/Unmarshal code
		// Name must be nil since this does not define a new struct field
		Literal *FieldLiteral

		// Psuedo struct field
		// Holds manually specified informatio
		Arg *Param
	}

	SymbolDeclName struct {
		Name *Ident
		Args Group[[]*Ident]
	}

	AliasTypeDecl struct {
		Name *SymbolDeclName
		Type Type
	}

	StructTypeDecl struct {
		Name      *SymbolDeclName
		Fields    Group[[]*Field]
		ByteOrder ByteOrderKind
	}

	EnumMember struct {
		Name  *Ident
		Value *LitExpr
	}

	EnumTypeDecl struct {
		Name       *SymbolDeclName
		EncodeType Type
		Members    Group[[]*EnumMember]
	}

	ExternImport struct {
		Pkg *LitExpr
	}

	ExternDeclName struct {
		Name *Ident
		Args Group[[]*LitExpr]
	}

	ExternTypeDecl struct {
		Name *ExternDeclName
		Type *LitExpr
	}
)

// Nodes

var (
	_ Node = (Nodes)(nil)

	_ Node = (Group[int8])(Group[int8]{})
	_ Node = (*Param)(nil)
	_ Node = (*SymbolDeclName)(nil)
	_ Node = (*ExternDeclName)(nil)
	_ Node = (*TypeCase)(nil)
	_ Node = (*Field)(nil)
	_ Node = (*EnumMember)(nil)
	_ Node = (*BitmaskMember)(nil)
	_ Node = (*TypeSize)(nil)
)

func (t Group[T]) Pos() Pos { return t.Open }
func (t Group[T]) End() Pos { return t.Close }

func (t *Param) Pos() Pos { return t.Name.Pos() }
func (p *Param) End() Pos { return p.Type.End() }

func (t *SymbolDeclName) Pos() Pos { return t.Name.Pos() }
func (t *SymbolDeclName) End() Pos { return t.Name.End() }

func (t *ExternDeclName) Pos() Pos { return t.Name.Pos() }
func (t *ExternDeclName) End() Pos { return t.Name.End() }

func (i Nodes) Pos() Pos { return -1 }
func (i Nodes) End() Pos { return -1 }

func (i *TypeCase) Pos() Pos {
	if i.Cond == nil {
		return i.Type.Pos()
	} else {
		return i.Cond.Pos()
	}
}

func (i *TypeCase) End() Pos { return i.Type.End() }

func (i *Field) Pos() Pos { return i.Name.Pos() }
func (i *Field) End() Pos {
	if i.Literal != nil {
		return i.Literal.Code.End()
	} else if i.Initializer != nil {
		return i.Initializer.End()
	} else if i.Arg != nil {
		return i.Arg.End()
	} else {
		return i.Type.End()
	}
}

func (i *EnumMember) Pos() Pos { return i.Name.Pos() }
func (i *EnumMember) End() Pos { return i.Value.End() }

func (i *BitmaskMember) Pos() Pos {
	if i.Name != nil {
		return i.Name.Pos()
	} else {
		return i.Value.Pos()
	}
}

func (i *BitmaskMember) End() Pos {
	if i.Initializer != nil {
		return i.Initializer.End()
	}

	if i.Type == nil {
		return i.Value.End()
	} else {
		return i.Type.End()
	}
}

func (i *TypeSize) Pos() Pos { return i.Open }
func (i *TypeSize) End() Pos { return i.Close }

// Decl

var (
	_ Decl = (*AliasTypeDecl)(nil)
	_ Decl = (*StructTypeDecl)(nil)
	_ Decl = (*EnumTypeDecl)(nil)
	_ Decl = (*ExternTypeDecl)(nil)
	_ Decl = (*ExternImport)(nil)
)

func (a *AliasTypeDecl) declNode()  {}
func (a *StructTypeDecl) declNode() {}
func (a *EnumTypeDecl) declNode()   {}
func (a *ExternTypeDecl) declNode() {}
func (e *ExternImport) declNode()   {}

func (a *AliasTypeDecl) Pos() Pos { return a.Name.Pos() }
func (a *AliasTypeDecl) End() Pos { return a.Type.End() }

func (a *StructTypeDecl) Pos() Pos { return a.Name.Pos() }
func (a *StructTypeDecl) End() Pos { return a.Fields.Close }

func (a *EnumTypeDecl) Pos() Pos { return a.Name.Pos() }
func (a *EnumTypeDecl) End() Pos { return a.Members.Close }

func (a *ExternTypeDecl) Pos() Pos { return a.Name.Pos() }
func (a *ExternTypeDecl) End() Pos { return a.Type.End() }

func (e *ExternImport) End() Pos { return e.Pkg.End() }
func (e *ExternImport) Pos() Pos { return e.Pkg.Pos() }

// SymbolDecl

var (
	_ SymbolDecl = (*AliasTypeDecl)(nil)
	_ SymbolDecl = (*StructTypeDecl)(nil)
	_ SymbolDecl = (*EnumTypeDecl)(nil)
)

func (a *AliasTypeDecl) symbolNode()  {}
func (a *StructTypeDecl) symbolNode() {}
func (a *EnumTypeDecl) symbolNode()   {}

// Expr

var (
	_ Expr = (*LitExpr)(nil)
	_ Expr = (*Ident)(nil)
)

func (a *LitExpr) exprNode() {}
func (a *Ident) exprNode()   {}

func (a *LitExpr) Pos() Pos { return a.ValuePos }
func (a *LitExpr) End() Pos { return a.ValuePos + Pos(len(a.Value)) }

func (i *Ident) Pos() Pos { return i.NamePos }
func (i *Ident) End() Pos { return i.NamePos + Pos(len(i.Name)) }

// Type

var (
	_ Type = (*RefType)(nil)
	_ Type = (*ArrayType)(nil)
	_ Type = (*StringType)(nil)
	_ Type = (*TransformType)(nil)
	_ Type = (*PadType)(nil)
	_ Type = (*MatchType)(nil)

	_ Type = (*EnumTypeDecl)(nil)
	_ Type = (*BitmaskType)(nil)
	_ Type = (*StructTypeDecl)(nil)
	_ Type = (*AliasTypeDecl)(nil)
	_ Type = (*ExternTypeDecl)(nil)
)

func (a *RefType) typeNode()        {}
func (a *ArrayType) typeNode()      {}
func (a *StringType) typeNode()     {}
func (a *TransformType) typeNode()  {}
func (a *PadType) typeNode()        {}
func (a *MatchType) typeNode()      {}
func (a *EnumTypeDecl) typeNode()   {}
func (a *BitmaskType) typeNode()    {}
func (a *StructTypeDecl) typeNode() {}
func (a *AliasTypeDecl) typeNode()  {}
func (a *ExternTypeDecl) typeNode() {}

func (a *RefType) Pos() Pos { return a.Name.NamePos }
func (a *RefType) End() Pos { return a.Name.End() }

func (a *ArrayType) Pos() Pos { return a.Size.Open }
func (a *ArrayType) End() Pos { return a.Elt.End() }

func (a *StringType) Pos() Pos { return a.Size.Open }
func (a *StringType) End() Pos { return a.Token }

func (a *TransformType) Pos() Pos { return a.Initial.Pos() }
func (a *TransformType) End() Pos { return a.Args.Close }

func (a *PadType) Pos() Pos { return a.Size.Pos() }
func (a *PadType) End() Pos { return a.Size.End() }

func (a *BitmaskType) Pos() Pos { return a.Members.Pos() }
func (a *BitmaskType) End() Pos { return a.Members.Close }

func (a *MatchType) Pos() Pos {
	if a.Reader != nil {
		return a.Reader.Pos()
	} else {
		return a.Cases.Open
	}
}
func (a *MatchType) End() Pos { return a.Cases.Close }
