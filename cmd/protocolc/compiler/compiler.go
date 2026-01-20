package compiler

import (
	"errors"
	"fmt"
	"slices"
	"strings"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ ast.Visitor = (*compiler)(nil)
	_ Context     = (*compiler)(nil)
)

type TransformTypeConstructor = func(
	inputType string,
	args []ast.Expr,
) (TransformType, error)

type compiler struct {
	types         map[string]TypeConstructor
	transformType map[string]TransformTypeConstructor

	symbols []Symbol

	typeRefs map[string]*RefType

	documents       []*ast.Document
	currentDocument *ast.Document
	hasErrors       bool
	messages        []*ast.Message

	pass func(node ast.Node) bool
}

// An option that can apply a change to a compiler
type Option func(*compiler) error

// Construct this compiler with a custom type.
// These types can be used as if it were a standard type declaration
// like a struct, enum, or alias.
// This type will not accept any parameters
func WithType(name string, ty Type) Option {
	return func(c *compiler) error {
		if _, ok := c.types[name]; ok {
			return fmt.Errorf("duplicate type '%s'", name)
		}

		c.types[name] = newEmptyConstructor(name, ty)
		return nil
	}
}

// Construct this compiler with a custom type constructor.
//
// Type constructors are parameterized types that allow accessing
// parameters propagated from other types. These parameters are
// ultimately exposed to Unmarshal/Marshal (if they are used in the codegen)
func WithTypeConstructor(name string, tyConstructor TypeConstructor) Option {
	return func(c *compiler) error {
		if _, ok := c.types[name]; ok {
			return fmt.Errorf("duplicate reader type '%s'", name)
		}

		c.types[name] = tyConstructor
		return nil
	}
}

type tyC struct {
	f func(args []ast.Expr) (Type, error)
}

func (t *tyC) Construct(args []ast.Expr) (Type, error) {
	return t.f(args)
}

// See `WithTypeConstructor`, this is the function variant
func WithTypeConstructorF(name string, tyConstructor func(args []ast.Expr) (Type, error)) Option {
	return WithTypeConstructor(name, &tyC{f: tyConstructor})
}

// Construct this compiler with a custom transform type.
//
// Transform types are similar to Reader types however they do not
// need to access the underlying byte stream. They are passed an initially
// parsed form. The transformation should generate code that converts the parsed
// form into the fields registered by the type.
func WithTransformType(name string, tyConstructor TransformTypeConstructor) Option {
	return func(c *compiler) error {
		if _, ok := c.transformType[name]; ok {
			return fmt.Errorf("duplicate transform type '%s'", name)
		}

		c.transformType[name] = tyConstructor
		return nil
	}
}

// Add a document to the compiler to code generate with
// At least one document should be added to the compiler before calling `Compile()`
// otherwise you will get an empty file
func WithDocument(document *ast.Document) Option {
	return func(c *compiler) error {
		c.documents = append(c.documents, document)
		return nil
	}
}

func NewCompiler(opts ...Option) (*compiler, error) {
	c := &compiler{
		types: map[string]TypeConstructor{
			"U8":   U8,
			"I8":   I8,
			"U16":  U16,
			"I16":  I16,
			"U32":  U32,
			"I32":  I32,
			"U64":  U64,
			"I64":  I64,
			"F32":  F32,
			"F64":  F64,
			"byte": BYTE,
		},

		transformType: map[string]TransformTypeConstructor{},
		typeRefs:      map[string]*RefType{},
	}

	for _, opt := range opts {
		err := opt(c)
		if err != nil {
			return nil, err
		}
	}

	return c, nil
}

func (c *compiler) Compile() bool {
	// Collect type references
	// This is to create a a stand-in compiler ref
	// which we can resolve later
	c.Pass(func(n ast.Node) bool {
		if r, ok := n.(*ast.RefType); ok {
			// See if we know what this type is already
			if dt, ok := c.types[r.Name.Name]; ok {
				// This type either already has a stand-in
				// or it is a builtin type

				if rt, ok := dt.(*RefType); ok {
					// Keep track of all references to stand-ins
					rt.AddReference(c.currentDocument, n)
				}

				return true
			}

			rt := &RefType{
				// We can't resolve this yet since we haven't
				// generated the compiler types yet
				TypeConstructor: nil,
			}

			rt.AddReference(c.currentDocument, n)

			// Create the stand-in
			c.types[r.Name.Name] = rt

			// Register this to be resolved later
			c.typeRefs[r.Name.Name] = rt
		}

		return true
	})

	// Make sure the transform types are defined
	c.Pass(func(n ast.Node) bool {
		switch ty := n.(type) {
		case *ast.TransformType:
			if _, ok := c.transformType[ty.Name.Name]; !ok {
				c.Error(NodeError(ty.Name, fmt.Errorf("transform type not registered")))
			}
		}

		return true
	})

	// Check expression references have parent definitions
	// Checks if identifier arguments/variable names are actually defined
	// variable parameters.

	// Build the type definitions from the AST into the compiler
	c.Pass(func(node ast.Node) bool {
		// Check for duplicate definition
		if decl, ok := node.(ast.TypeDecl); ok {
			name := declName(decl)
			if def, ok := c.types[name.Name]; ok {
				if _, ok := def.(*RefType); ok {
					// This is just a stand-in reference
					// (not an actual declaration)
				} else {
					// There already is a definition
					c.Error(NodeError(name, fmt.Errorf("duplicate definition of '%s'", name.Name)))
					return true
				}
			}
		}

		switch decl := node.(type) {
		case *ast.AliasTypeDecl:
			c.types[decl.Name.Name.Name] = &declConstructor[*AliasType]{
				name: decl.Name,
				constructor: func(args map[string]ast.Expr) (Type, error) {
					// TODO(tumbar) This should be possible
					if len(args) > 0 {
						return nil, NodeError(decl.Name, errors.New("type aliases do not support type parameters yet"))
					}

					return &AliasType{
						NodeWithDocument: &nodeWithDocument{
							Node: decl,
							doc:  c.currentDocument,
						},
						name:           decl.Name.Name.Name,
						underlyingType: toType(c, decl.Type),
						args:           args,
					}, nil
				},
			}
		case *ast.EnumTypeDecl:
			c.types[decl.Name.Name.Name] = &declConstructor[*EnumType]{
				name: decl.Name,
				constructor: func(args map[string]ast.Expr) (Type, error) {
					return &EnumType{
						NodeWithDocument: &nodeWithDocument{
							Node: decl,
							doc:  c.currentDocument,
						},

						name:       decl.Name.Name.Name,
						args:       args,
						encodeType: toType(c, decl.EncodeType),
						members:    toEnumMembers(c, decl.Members.Members),
					}, nil
				},
			}
		case *ast.StructTypeDecl:
			c.types[decl.Name.Name.Name] = &declConstructor[*StructType]{
				name: decl.Name,
				constructor: func(args map[string]ast.Expr) (Type, error) {
					fields := []*StructField{}

					for _, f := range decl.Fields.Members {
						var fieldName string
						var fieldInit string
						var condition string
						var ty Type

						if f.Name != nil {
							fieldName = f.Name.Name
							if f.Initializer != nil {
								if fieldNameIsPrivate(fieldName) {
									fieldInit = exprAsString(c, f.Initializer)
								} else {
									c.Error(NodeError(f.Initializer, fmt.Errorf("only private fields can have initializers")))
								}
							}

							if f.Condition != nil {
								condition = exprAsString(c, f.Condition)
							}

							ty = toType(c, f.Type)
						} else if f.Arg != nil {
							ty = &LiteralArg{
								name:    f.Arg.Name.Name,
								ty:      exprAsString(c, f.Arg.Type),
								marshal: f.Arg.IsMarshal,
							}
						} else if f.Literal != nil {
							ty = &LiteralType{
								code:    exprAsString(c, f.Literal.Code),
								marshal: f.Literal.IsMarshal,
							}
						} else {
							switch f.Type.(type) {
							case *ast.BitmaskType:
							case *ast.PadType:
							default:
								c.Error(NodeError(f, fmt.Errorf("invalid unamed struct field")))
							}

							ty = toType(c, f.Type)
						}

						fields = append(fields, &StructField{
							Name:        fieldName,
							Type:        ty,
							Initializer: fieldInit,
							Condition:   condition,
						})
					}

					return &StructType{
						NodeWithDocument: &nodeWithDocument{
							Node: decl,
							doc:  c.currentDocument,
						},
						name:   decl.Name.Name.Name,
						fields: fields,
						bo:     decl.ByteOrder,
						args:   args,
					}, nil
				},
			}
		case *ast.ExternTypeDecl:
			c.types[decl.Name.Name.Name] = &externConstructor{
				decl: decl,
				c:    c,
			}
		case *ast.ExternImport:
			c.symbols = append(c.symbols, &ImportDecl{
				NodeWithDocument: &nodeWithDocument{
					Node: decl,
					doc:  c.currentDocument,
				},
				Pkg: exprAsString(c, decl.Pkg),
			})
		}

		// Keep searching for the decls
		return true
	})

	// Resolve the type references
	for name, typeRef := range c.typeRefs {
		// Stand-in types should be replaced with their concrete type
		resolved := c.types[name]
		if rt, ok := resolved.(*RefType); ok {
			// This stand-in was not replaced
			// Place an error on all the references
			for _, ref := range rt.References {
				c.currentDocument = ref.doc
				c.Error(NodeError(ref.node, fmt.Errorf("type not defined")))
			}
		} else {
			// Resolve the type reference
			typeRef.TypeConstructor = resolved
		}
	}

	// If we have errors up to this point we can't do the next step
	// Resolved types may be nil which will cause panic
	// We will break out of compilation early
	if c.hasErrors {
		return false
	}

	// Construct the global symbols and register them with the codegen generator
	c.Pass(func(node ast.Node) bool {
		if decl, ok := node.(ast.SymbolDecl); ok {
			name := symbolDeclName(decl)

			// Build empty arguments
			// These don't need to be filled because we are not instatiating the type,
			// we just want to trigger the codegen for it.
			args := []ast.Expr{}
			for range len(name.Args.Members) {
				args = append(args, nil)
			}

			ty, err := c.types[name.Name.Name].Construct(args)
			if err != nil {
				c.Error(NodeError(decl, err))
				return false
			} else {
				c.symbols = append(c.symbols, ty.(Symbol))
			}
		}

		return true
	})

	return !c.hasErrors
}

func (c *compiler) Codegen(pkg string) (string, error) {
	b := &documentBuilder{
		c:   c,
		pkg: pkg,
	}

	slices.SortFunc(c.symbols, func(a Symbol, b Symbol) int {
		return strings.Compare(a.Name(c), b.Name(c))
	})

	for _, v := range c.symbols {
		b.n = v
		c.currentDocument = v.Document()
		v.Build(b)
	}

	if c.hasErrors {
		return "", fmt.Errorf("errors encountered while building document")
	}

	return b.String(), nil
}

func (c *compiler) Pass(p func(ast.Node) bool) {
	defer func() { c.currentDocument = nil }()
	c.pass = p
	for _, doc := range c.documents {
		c.currentDocument = doc
		ast.Walk(c, doc.Ast)
	}
}

// Visit implements ast.Visitor.
// Compiler visits all nodes with `c.pass()`
func (c *compiler) Visit(node ast.Node) ast.Visitor {
	if c.pass(node) {
		return c
	} else {
		return nil
	}
}

func (c *compiler) Error(err error) {
	var nodeErr *nodeError
	var node ast.Node
	if errors.As(err, &nodeErr) {
		node = nodeErr.node
		err = nodeErr.err
	}

	c.messages = append(c.messages, &ast.Message{
		IsError:  true,
		Node:     node,
		Message:  err,
		Document: c.currentDocument,
	})

	c.hasErrors = true
}

func (c *compiler) Warning(err error) {
	var nodeErr *nodeError
	var node ast.Node
	if errors.As(err, &nodeErr) {
		node = nodeErr.node
		err = nodeErr.err
	}

	c.messages = append(c.messages, &ast.Message{
		IsError:  false,
		Node:     node,
		Message:  err,
		Document: c.currentDocument,
	})
}

func (c *compiler) Messages() []string {
	slices.SortFunc(c.messages, func(a, b *ast.Message) int {
		if a.Node == nil && b.Node != nil {
			return 1
		} else if a.Node != nil && b.Node == nil {
			return -1
		} else if a.Node == nil && b.Node == nil {
			return 0
		}

		ap, bp := a.Node.Pos(), b.Node.Pos()
		if ap == bp {
			return strings.Compare(a.Message.Error(), b.Message.Error())
		} else {
			return int(a.Node.Pos() - b.Node.Pos())
		}
	})

	out := []string{}
	for _, msg := range c.messages {
		out = append(out, msg.Error())
	}

	return out
}
