package compiler

import (
	"fmt"
	"slices"
	"strings"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

var (
	_ DocumentBuilder = (*documentBuilder)(nil)
	_ Context         = (*documentBuilder)(nil)

	_ FunctionBuilder = (*functionBuilder)(nil)
	_ Code            = (*functionBuilder)(nil)

	_ StructBuilder = (*structBuilder)(nil)
	_ Code          = (*structBuilder)(nil)

	_ TypeBuilder = (*typeBuilder)(nil)
	_ Code        = (*typeBuilder)(nil)

	_ BlockBuilder = (*blockBuilder)(nil)
	_ Statement    = (*blockBuilder)(nil)
)

// Base builder implements the common code-generation hooks
type BaseBuilder interface {
	Context

	// Register an import dependency with the file
	Import(pkg string)
}

type TypeConfig struct {
	// Type of the type, Go identifier
	Name string

	// Code to define new type with
	// (Go underlying type)
	Def string

	// Should methods be placed on pointer to this type?
	IsPtr bool

	// Identifier of 'self' on methods
	SelfIdent string
}

// Document builder is a builder that generates the entry points into the
// function builder. It is the top level builder.
type DocumentBuilder interface {
	BaseBuilder

	String() string

	// Add a block of code to the file at the global scope
	// and move the cursor to the end of the code block
	Code(code Code)

	// Build a standalone function
	Func(name string, returnType string) BlockBuilder

	// Build a structure definition with methods
	// Methods are added to `func (x [name]) Method()`
	Struct(name string) StructBuilder

	// Build a generic `type [name] [def]`
	// Methods are added to `func (x [name]) Method()`
	Type(cfg TypeConfig) TypeBuilder
}

type TypeBuilder interface {
	BaseBuilder
	Method(name string, returnType string) BlockBuilder
	Implements(interfaceName string)
}

type StructBuilder interface {
	TypeBuilder
	Field(name string, typeName string)
}

// Function builder is scoped in a function and allows adding to the
// functions code and argument list. The return type is predetermined.
type FunctionBuilder interface {
	BaseBuilder

	// Type declarations are optionally parameterized
	// This allows you to access a local variable
	//
	// name: Name of the local variable passed to the type
	// typeName: Go type that this variable is expected to be
	//    Note: If another statement uses this variable and the types
	//          don't match, compilation will fail
	Argument(name string, typeName string)
}

// Block builder is the backbone of this code-generator. It allows
// creating nested blocks with statements and tracks stateful information
// during code generation.
// It also propagates the functionality from the parent function and document
// to allow interacting with the context
type BlockBuilder interface {
	FunctionBuilder

	// Get the loop iterator name
	// i, ii, iii, iiii, etc.
	// This is dependent on how many layers deep in block nesting we are
	LoopIterator() string

	// Add a statement at the end of the current block
	Appendf(format string, args ...any)
	Append(stmt Statement)

	// Add a `panic` statement and disable appending to this block
	Returnf(format string, args ...any)
	Return(stmt Statement)

	// Append a statement that handles `err`
	// This is always preferred over doing error handling yourself
	// since some types might need to override the error handling behavior
	HandleError(msg string)

	// Create a new block builder based on this one with a custom
	// error handling statement.
	ErrorHandler(func(builder BaseBuilder, msg string) Statement) BlockBuilder
	ErrorHandlerf(format string, args ...any) BlockBuilder

	// Adds a statement block which creates a sub-scope
	// Essentially does:
	// [formatedString] {
	//      // Returned function builder puts code here
	// }
	// Current function builder puts new statements here.
	Block(format string, args ...any) BlockBuilder

	// Return another builder that has indented statements
	// Useful for switch cases
	Indent() BlockBuilder

	// Un-indent the block entire block
	// Note: this is
	Dedent()
}

type documentBuilder struct {
	c *compiler
	n ast.Node

	pkg        string
	stdImports []string
	imports    []string
	code       []Code
}

// Node implements DocumentBuilder.
func (d *documentBuilder) Node() ast.Node {
	return d.n
}

// Error implements DocumentBuilder.
func (d *documentBuilder) Error(err error) {
	d.c.Error(NodeError(d.n, err))
}

// Warning implements DocumentBuilder.
func (d *documentBuilder) Warning(err error) {
	d.c.Warning(NodeError(d.n, err))
}

// Func implements DocumentBuilder.
func (d *documentBuilder) Func(name string, returnType string) BlockBuilder {
	f := &functionBuilder{
		BaseBuilder: d,

		Name:       name,
		Args:       make([]*FormalParam, 0),
		ReturnType: returnType,
	}

	b := &blockBuilder{
		FunctionBuilder: f,
		iterName:        "i",
		errorHandler:    defaultErrHandler,
	}
	f.Code = b
	d.Code(f)

	return b
}

// Struct implements DocumentBuilder.
func (d *documentBuilder) Struct(name string) StructBuilder {
	s := &structBuilder{
		BaseBuilder: d,
		typeBuilderBase: &typeBuilderBase{
			BaseBuilder: d,
			name:        name,
			methodSelf:  "s",
			isPtr:       true,
		},
	}

	d.Code(s)
	return s
}

type typeBuilder struct {
	BaseBuilder
	*typeBuilderBase

	def string
}

// String implements Code.
func (t *typeBuilder) String(Context) string {
	out := []string{}
	out = append(out, t.typeBuilderBase.interfaceLines()...)
	out = append(out, fmt.Sprintf("type %s %s", t.name, t.def))
	out = append(out, "")
	out = append(out, t.typeBuilderBase.methodLines()...)

	return strings.Join(out, "\n")
}

// Type implements DocumentBuilder.
func (d *documentBuilder) Type(cfg TypeConfig) TypeBuilder {
	b := &typeBuilder{
		BaseBuilder: d,
		typeBuilderBase: &typeBuilderBase{
			BaseBuilder: d,
			name:        cfg.Name,
			methodSelf:  cfg.SelfIdent,
			isPtr:       cfg.IsPtr,
		},

		def: cfg.Def,
	}

	d.Code(b)
	return b
}

// Code implements DocumentBuilder.
func (d *documentBuilder) Code(code Code) {
	d.code = append(d.code, code)
}

// Import implements DocumentBuilder.
func (d *documentBuilder) Import(pkg string) {
	if strings.Contains(pkg, "github") {
		if !slices.Contains(d.imports, pkg) {
			d.imports = append(d.imports, pkg)
		}
	} else {
		if !slices.Contains(d.stdImports, pkg) {
			d.stdImports = append(d.stdImports, pkg)
		}
	}
}

// String implements DocumentBuilder.
func (d *documentBuilder) String() string {
	var sb strings.Builder
	sb.WriteString(d.header())

	for _, code := range d.code {
		sb.WriteRune('\n')
		sb.WriteString(code.String(d))
	}

	return sb.String()
}

func (d *documentBuilder) header() string {
	slices.Sort(d.imports)
	slices.Sort(d.stdImports)

	out := fmt.Sprintf(`// Code generated by protocolc. DO NOT EDIT.

package %s
`, d.pkg)

	if len(d.imports)+len(d.stdImports) > 0 {
		standardImports := []string{}
		for _, imp := range d.stdImports {
			standardImports = append(standardImports, fmt.Sprintf(`	"%s"`, imp))
		}

		// Place some spacing between the import types
		if len(standardImports) > 0 {
			standardImports = append(standardImports, "")
		}

		imports := []string{}
		for _, imp := range d.imports {
			imports = append(imports, fmt.Sprintf(`	"%s"`, imp))
		}

		si := strings.Join(standardImports, "\n")
		if si != "" {
			si += "\n"
		}

		ii := strings.Join(imports, "\n")
		if ii != "" {
			ii += "\n"
		}

		out += fmt.Sprintf("\nimport (\n%s%s)", si, ii)
	}

	return out + "\n"
}

type functionBuilder struct {
	BaseBuilder

	Name       string
	Args       []*FormalParam
	ReturnType string
	Code       Statement

	// Method information
	forTypeIdent string
	forType      string
}

// String implements Code.
func (f *functionBuilder) String(Context) string {
	args := []string{}
	for _, arg := range f.Args {
		args = append(args, arg.String())
	}

	returnValue := f.ReturnType
	if returnValue != "" {
		returnValue = " " + returnValue
	}

	if f.forType == "" {
		// Standalone function
		return fmt.Sprintf(
			"func %s(%s)%s {\n%s\n}\n",
			f.Name, strings.Join(args, ", "), returnValue,
			strings.Join(f.Code.Lines(), "\n"),
		)
	} else {
		return fmt.Sprintf(
			"func (%s %s) %s(%s)%s {\n%s\n}\n",
			f.forTypeIdent, f.forType,
			f.Name, strings.Join(args, ", "), returnValue,
			strings.Join(f.Code.Lines(), "\n"),
		)
	}
}

// Argument implements FunctionBuilder.
func (f *functionBuilder) Argument(name string, typeName string) {
	for _, a := range f.Args {
		if a.Name == name {
			if a.Type == typeName {
				// This argument is already requested
				// We can just drop it since it is identical
				return
			} else {
				panic(fmt.Sprintf(
					"overlapping parameter name %s with differing types (%s, %s)",
					a.Name,
					a.Type,
					typeName,
				))
			}
		}
	}

	f.Args = append(f.Args, &FormalParam{
		Name: name,
		Type: typeName,
	})
}

type blockBuilder struct {
	FunctionBuilder
	returned bool
	stmts    []Statement
	iterName string
	dedent   bool

	errorHandler func(builder BaseBuilder, msg string) Statement
}

// ErrorHandler implements BlockBuilder.
func (b *blockBuilder) ErrorHandler(stmt func(builder BaseBuilder, msg string) Statement) BlockBuilder {
	bb := &blockBuilder{
		FunctionBuilder: b,
		iterName:        b.iterName,
		dedent:          true,
		errorHandler:    stmt,
	}

	b.Append(bb)
	return bb
}

// ErrorHandlerf implements BlockBuilder.
func (b *blockBuilder) ErrorHandlerf(format string, args ...any) BlockBuilder {
	return b.ErrorHandler(func(builder BaseBuilder, msg string) Statement {
		actualFormat := strings.ReplaceAll(format, "{MSG}", msg)
		return Linesf(actualFormat, args...)
	})
}

// HandleError implements BlockBuilder.
func (b *blockBuilder) HandleError(msg string) {
	if b.errorHandler != nil {
		b.Append(b.errorHandler(b, msg))
	}
}

// LoopIterator implements BlockBuilder.
func (b *blockBuilder) LoopIterator() string {
	return b.iterName
}

// LoopIterator implements BlockBuilder.
func (b *blockBuilder) Dedent() {
	b.dedent = true
}

// Lines implements Statement.
func (b *blockBuilder) Lines() []string {
	lines := []string{}

	if b.dedent {
		for _, stmt := range b.stmts {
			lines = append(lines, stmt.Lines()...)
		}
	} else {
		for _, stmt := range b.stmts {
			lines = append(lines, Indent(stmt.Lines())...)
		}
	}

	return lines
}

// Append implements FunctionBuilder.
func (b *blockBuilder) Append(stmt Statement) {
	if !b.returned {
		b.stmts = append(b.stmts, stmt)
	}
}

// Appendf implements BlockBuilder.
func (b *blockBuilder) Appendf(format string, args ...any) {
	b.Append(Linesf(format, args...))
}

func (b *blockBuilder) Return(stmt Statement) {
	b.Append(stmt)
	b.returned = true
}

func (b *blockBuilder) Returnf(format string, args ...any) {
	b.Appendf(format, args...)
	b.returned = true
}

// Block implements BlockBuilder.
func (b *blockBuilder) Block(format string, args ...any) BlockBuilder {
	inner := &blockBuilder{
		FunctionBuilder: b,
		stmts:           make([]Statement, 0),
		iterName:        b.iterName + "i",
		errorHandler:    b.errorHandler,
	}

	if format == "" {
		b.Append(Line("{"))
	} else {
		b.Appendf(format+" {", args...)
	}

	b.Append(inner)
	b.Append(Line("}"))

	return inner
}

// Block implements BlockBuilder.
func (b *blockBuilder) Indent() BlockBuilder {
	inner := &blockBuilder{
		FunctionBuilder: b,
		stmts:           make([]Statement, 0),
		iterName:        b.iterName,
		errorHandler:    b.errorHandler,
	}

	b.Append(inner)
	return inner
}

type typeBuilderBase struct {
	BaseBuilder

	name       string
	isPtr      bool
	methodSelf string
	methods    []*functionBuilder
	interfaces []string
}

// Implements implements TypeBuilder.
func (t *typeBuilderBase) Implements(interfaceName string) {
	t.interfaces = append(t.interfaces, interfaceName)
}

func defaultErrHandler(builder BaseBuilder, msg string) Statement {
	builder.Import("fmt")

	return Linesf(`
	|if err != nil {
	|	return fmt.Errorf("%s: %%w", err)
	|}`, msg)
}

// Method implements TypeBuilder.
func (t *typeBuilderBase) Method(name string, returnType string) BlockBuilder {
	forType := t.name
	if t.isPtr {
		forType = "*" + t.name
	}

	f := &functionBuilder{
		BaseBuilder:  t.BaseBuilder,
		Name:         name,
		Args:         []*FormalParam{},
		ReturnType:   returnType,
		forType:      forType,
		forTypeIdent: t.methodSelf,
	}

	b := &blockBuilder{
		FunctionBuilder: f,
		iterName:        "i",
		errorHandler:    defaultErrHandler,
	}
	f.Code = b
	t.methods = append(t.methods, f)
	return b
}

func (t *typeBuilderBase) interfaceLines() []string {
	out := []string{}
	if len(t.interfaces) > 0 {
		out = append(out, "var (")
		for _, iface := range t.interfaces {
			out = append(out, fmt.Sprintf("\t_ %s = (*%s)(nil)", iface, t.name))
		}
		out = append(out, ")", "")
	}

	return out
}

func (t *typeBuilderBase) methodLines() []string {
	out := []string{}
	for _, method := range t.methods {
		out = append(out, method.String(t.BaseBuilder))
	}

	return out
}

type structFieldCode struct {
	Name string
	Type string
}

type structBuilder struct {
	BaseBuilder
	*typeBuilderBase
	fields []*structFieldCode
}

// String implements Code.
func (s *structBuilder) String(Context) string {
	out := []string{}
	out = append(out, s.interfaceLines()...)

	longestFieldName := 0
	longestTypeName := 0

	for _, field := range s.fields {
		if len(field.Name) > longestFieldName {
			longestFieldName = len(field.Name)
		}

		if len(field.Type) > longestTypeName {
			longestTypeName = len(field.Type)
		}
	}

	out = append(out, fmt.Sprintf("type %s struct {", s.name))
	for _, field := range s.fields {
		out = append(out, fmt.Sprintf(
			"\t%-*s %-*s `json:\"%s\"`",
			longestFieldName,
			field.Name,
			longestTypeName,
			field.Type,
			toSnakeCase(field.Name),
		))
	}

	out = append(out, "}", "")
	out = append(out, s.methodLines()...)

	return strings.Join(out, "\n")
}

// Field implements StructBuilder.
func (s *structBuilder) Field(name string, typeName string) {
	s.fields = append(s.fields, &structFieldCode{
		Name: name,
		Type: typeName,
	})
}
