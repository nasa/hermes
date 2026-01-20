package compiler

import (
	"fmt"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

type Context interface {
	// Report an error to the compiler context
	// To report a positional error, use NewNodeError() to
	// link the error with an AST Node
	Error(err error)

	// Report a warning to the compiler context
	// To report a positional warning, use NewNodeError() to
	// link the warning with an AST Node
	Warning(err error)
}

type Type interface {
	// The Go representation of the type
	Name(Context) string

	// Generate code for decoding data into the type
	// Assume there is a `r serial.Reader` variable in
	// this scope. If this value is ok, `name` should be
	// set to the decoded value.
	// This should be the code that is generated inline
	// when decoding the data NOT the entire function
	// Return 'true' if `err` handling was already appended to the block
	Unmarshal(b BlockBuilder, name string)

	// Generate code for encoding a value stored in `name`
	// into the writer `w`
	// Return 'true' if `err` handling was already appended to the block
	Marshal(b BlockBuilder, name string)

	// Register a fields that are set by this type
	// The name comes from the field name of the ast member
	Field(b StructBuilder, name string)
}

// A Type constructor is the mechanism in which types are exposed
// to the compiler. All types in this language are technically functions
// that can take a variable number of parameters. It is up to the type itself
// to accept or reject the parameters at compile time.
type TypeConstructor interface {
	Construct(args []ast.Expr) (Type, error)
}

// Transform type is an externally defined type that can read
type TransformType interface {
	// Go type name that this transformation returns
	Name() string

	HasUnmarshal() bool
	HasMarshal() bool

	// Similar to Type.Unmarshal however instead of reading from
	// the 'r' reader, you need can use the value stored in tmpName
	Unmarshal(b BlockBuilder, name string, tmpName string)

	// Similar to Type.Marshal however you need to create a tmpName
	Marshal(b BlockBuilder, name string, tmpName string)

	// Register a fields that are set by this type
	// The name comes from the field name of the ast member
	Field(b StructBuilder, name string)
}

type NodeWithDocument interface {
	ast.Node
	Document() *ast.Document
}

type Symbol interface {
	// Corresponding AST node that defines this symbol
	// as well as document where this symbol was defined
	NodeWithDocument

	// Identifier of the symbol
	Name(Context) string

	// Build all the global symbols and embed them into the
	// code generation target.
	Build(b DocumentBuilder)
}

type emptyConstructor struct {
	name string
	ty   Type
}

func (e *emptyConstructor) Construct(args []ast.Expr) (Type, error) {
	if len(args) > 0 {
		return nil, fmt.Errorf("%s does not accept parameters", e.name)
	}

	return e.ty, nil
}

func newEmptyConstructor(name string, ty Type) TypeConstructor {
	return &emptyConstructor{
		name: name,
		ty:   ty,
	}
}
