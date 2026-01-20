package compiler_test

import (
	_ "embed"
	"fmt"
	"os"
	"strings"
	"testing"

	"github.com/nasa/hermes/cmd/protocolc/ast"
	"github.com/nasa/hermes/cmd/protocolc/builtin"
	"github.com/nasa/hermes/cmd/protocolc/compiler"
	"github.com/nasa/hermes/cmd/protocolc/parser"
	"github.com/stretchr/testify/assert"
)

func assertReferenceFile(
	t *testing.T,
	filename string,
	testOutput string,
) {
	if os.Getenv("UPDATE_REF") != "" {
		os.WriteFile(filename, []byte(testOutput), 0600)
		return
	}

	expected, err := os.ReadFile(filename)
	if !assert.NoError(t, err, "failed to open expected") {
		return
	}

	assert.Equal(t, string(expected), testOutput)
}

func testFile(name, ext string) string {
	return fmt.Sprintf("testdata/%s.%s", name, ext)
}

func test(t *testing.T, name string, opts ...compiler.Option) {
	testFileName := testFile(name, "protocol")
	input, err := os.ReadFile(testFileName)
	if err != nil {
		t.Fatalf("failed to open input: %s", err)
	}

	d, err := parser.Parse(testFileName, input)
	if err != nil {
		t.Fatalf("failed to parse input: %s", err)
	}

	opts = append(
		opts,
		compiler.WithTransformType("drop", builtin.Drop),
		compiler.WithDocument(d),
	)

	c, err := compiler.NewCompiler(opts...)
	if err != nil {
		t.Fatalf("failed to construct compiler: %s", err)
	}

	if !assert.True(t, c.Compile()) {
		t.Log(strings.Join(c.Messages(), "\n"))
		return
	}

	actual, err := c.Codegen("test")
	if err != nil {
		t.Log(strings.Join(c.Messages(), "\n"))
		t.Fatalf("failed to build document: %s", err)
	}

	assertReferenceFile(
		t,
		testFile(name, "go"),
		actual,
	)
}

func TestPrimitive(t *testing.T)    { test(t, "primitive") }
func TestEnum(t *testing.T)         { test(t, "enum") }
func TestBitmask(t *testing.T)      { test(t, "bitmask") }
func TestString(t *testing.T)       { test(t, "string") }
func TestNestedStruct(t *testing.T) { test(t, "nested_struct") }
func TestArray(t *testing.T)        { test(t, "array") }
func TestPad(t *testing.T)          { test(t, "pad") }
func TestTypeCase(t *testing.T)     { test(t, "type_case") }

var (
	_ compiler.Type = (*RType)(nil)
)

type RType struct {
	fields []*struct {
		Name      string
		Primitive compiler.ScalarType
	}
}

// Name implements compiler.Type.
func (r *RType) Name(c compiler.Context) string {
	c.Error(fmt.Errorf("cannot use RType as a named type"))
	return "INVALID"
}

// Field implements compiler.Type.
func (r *RType) Field(b compiler.StructBuilder, name string) {
	for _, f := range r.fields {
		b.Field(f.Name, f.Primitive.Name(b))
	}
}

// Marshal implements compiler.Type.
func (r *RType) Marshal(b compiler.BlockBuilder, name string) {
	for _, f := range r.fields {
		f.Primitive.Marshal(b, fmt.Sprintf("s.%s", f.Name))
	}
}

// Unmarshal implements compiler.Type.
func (r *RType) Unmarshal(b compiler.BlockBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/host")
	b.Argument("dictionary", "*host.DictionaryNamespace")

	for _, f := range r.fields {
		f.Primitive.Unmarshal(b, fmt.Sprintf("s.%s", f.Name))
	}
}

func TestCustomTypeImplicitArg(t *testing.T) {
	test(t, "custom_implicit_arg", compiler.WithTypeConstructorF("R", func(args []ast.Expr) (compiler.Type, error) {
		if len(args)%2 != 0 {
			return nil, fmt.Errorf("expected an even number of arguments")
		}

		out := &RType{}

		for i := 0; i < len(args); i++ {
			name, err := compiler.LiteralString(args[i])
			if err != nil {
				return nil, err
			}

			i++

			tyName, err := compiler.LiteralString(args[i])
			if err != nil {
				return nil, err
			}

			var pType compiler.ScalarType
			switch tyName {
			// We only need these for testing purposes
			case "U32":
				pType = compiler.U32
			case "F32":
				pType = compiler.F32
			default:
				return nil, compiler.NodeError(args[i], fmt.Errorf("expected U32 or F32"))
			}

			out.fields = append(out.fields, &struct {
				Name      string
				Primitive compiler.ScalarType
			}{
				Name:      name,
				Primitive: pType,
			})
		}

		return out, nil
	}))
}

type CType struct {
	arg1 string
	arg2 compiler.Expr
}

// Name implements compiler.Type.
func (r *CType) Name(c compiler.Context) string {
	c.Error(fmt.Errorf("cannot use CType as a named type"))
	return "INVALID"
}

// Field implements compiler.Type.
func (c *CType) Field(b compiler.StructBuilder, name string) {
	b.Import("github.com/nasa/hermes/pkg/host")
	b.Field(c.arg1, "*host.DictinaryNamespace")
}

// Marshal implements compiler.Type.
func (c *CType) Marshal(b compiler.BlockBuilder, name string) {}

// Unmarshal implements compiler.Type.
func (c *CType) Unmarshal(b compiler.BlockBuilder, name string) {
	b.Appendf("s.%s = %s.Namespaces[\"\"]", c.arg1, c.arg2.Evaluate(b))
}

func TestCustomTypeExplicitArg(t *testing.T) {
	test(t, "custom_explicit_arg", compiler.WithTypeConstructorF("C", func(args []ast.Expr) (compiler.Type, error) {
		if len(args) != 2 {
			return nil, fmt.Errorf("expected 2 arguments")
		}

		arg1, err := compiler.LiteralString(args[0])
		if err != nil {
			return nil, err
		}

		arg2 := compiler.ToExpr(
			args[1],
			"*host.Dictionary",
			"github.com/nasa/hermes/pkg/host",
		)

		return &CType{
			arg1: arg1,
			arg2: arg2,
		}, nil
	}))
}

var (
	_ compiler.TransformType = (*transformType)(nil)
)

type transformType struct {
	extraField string
}

// HasMarshal implements compiler.TransformType.
func (t *transformType) HasMarshal() bool {
	return true
}

// HasUnmarshal implements compiler.TransformType.
func (t *transformType) HasUnmarshal() bool {
	return true
}

// Name implements compiler.TransformType.
func (t *transformType) Name() string {
	return "[]byte"
}

// Field implements compiler.TransformType.
func (t *transformType) Field(b compiler.StructBuilder, name string) {
	b.Field(name, t.Name())
	b.Field(t.extraField, "*int")
}

// Marshal implements compiler.TransformType.
func (t *transformType) Marshal(b compiler.BlockBuilder, name string, tmpName string) {}

// Unmarshal implements compiler.TransformType.
func (t *transformType) Unmarshal(b compiler.BlockBuilder, name string, tmpName string) {
	b.Argument("d", "*int")
	b.Import("slices")
	b.Appendf("%s = slices.Concat(%s...)", name, tmpName)
	b.Appendf("s.%s = d", t.extraField)
}

func constructArgsTransform(typeName string, args []ast.Expr) (compiler.TransformType, error) {
	if typeName != "[][]byte" {
		return nil, fmt.Errorf("expected [][]byte input type, got %s", typeName)
	}

	ef, err := compiler.LiteralString(args[0])
	if err != nil {
		return nil, err
	}

	return &transformType{
		extraField: ef,
	}, nil
}

func TestTransformType(t *testing.T) {
	test(t, "transform", compiler.WithTransformType("Args", constructArgsTransform))
}

func TestInvalid(t *testing.T) {
	testFileName := testFile("invalid", "protocol")
	input, err := os.ReadFile(testFileName)
	if err != nil {
		t.Fatalf("failed to open input: %s", err)
	}

	d, err := parser.Parse(testFileName, input)
	if err != nil {
		t.Fatalf("failed to open input: %s", err)
	}

	c, err := compiler.NewCompiler(
		compiler.WithDocument(d),
	)
	if err != nil {
		t.Fatalf("failed to construct compiler: %s", err)
	}

	assert.False(t, c.Compile())
	if !assert.Equal(t, `testdata/invalid.protocol:2:15: error: type not defined
	InvalidEnum: UndefinedEnum
	             ^~~~~~~~~~~~~
testdata/invalid.protocol:3:21: error: type not defined
    AnotherInvalid: UndefinedEnum
                    ^~~~~~~~~~~~~
testdata/invalid.protocol:7:14: error: type not defined
type Alias = A
             ^
testdata/invalid.protocol:8:6: error: duplicate definition of 'Alias'
type Alias = A
     ^~~~~
testdata/invalid.protocol:8:14: error: type not defined
type Alias = A
             ^`,
		strings.Join(c.Messages(), "\n"),
	) {
		fmt.Print(strings.Join(c.Messages(), "\n"))
	}
}
