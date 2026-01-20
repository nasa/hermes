package compiler

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

func ReadSize(
	b BlockBuilder,
	size *TypeSize,
	name string,
) string {
	lengthName := fmt.Sprintf("%sLen", normalizeName(name))

	switch size.Kind {
	case ast.DYNAMIC:
		b.Appendf("var %s %s", lengthName, size.Dynamic.Name(b))
		size.Dynamic.Unmarshal(b, lengthName)
	case ast.STATIC:
		return strconv.FormatInt(int64(size.Static), 10)
	case ast.FIELD:
		return size.Field
	case ast.FILL:
		panic("FILL array types need special handling")
	}

	return lengthName
}

func WriteSize(b BlockBuilder, size *TypeSize, name string) {
	switch size.Kind {
	case ast.DYNAMIC:
		size.Dynamic.Marshal(b, fmt.Sprintf("%s(len(%s))", size.Dynamic.Name(b), name))
	case ast.STATIC:
		b.Import("fmt")
		b.Appendf(`
		|if len(%[1]s) != %[2]d {
		|	return fmt.Errorf("expected 'len(%[1]s)' == %[2]d, got %%d", len(%[1]s))
		|}`,
			name,
			size.Static,
		)
	case ast.FIELD:
		// The field that holds this size already encodes the size
		// We don't need to write it here as well
		// Make sure the written size matches what we already wrote
		b.Appendf(`
		|if len(%[1]s) != int(%[2]s) {
		|	return fmt.Errorf("expected 'len(%[1]s)' == %[2]s, %%d != %%d", len(%[1]s), int(%[2]s))
		|}`,
			name,
			size.Field,
		)
	case ast.FILL:
		// No size needed
		// We can write as much of the object as we want
		// This is bound checked outside of the current builder
	}
}

func normalizeName(name string) string {
	name = strings.ReplaceAll(name, ".", "_")
	name = strings.ReplaceAll(name, "[", "_")
	name = strings.ReplaceAll(name, "]", "")
	return name
}

var matchFirstCap = regexp.MustCompile("(.)([A-Z][a-z]+)")
var matchAllCap = regexp.MustCompile("([a-z0-9])([A-Z])")

func toSnakeCase(str string) string {
	snake := matchFirstCap.ReplaceAllString(str, "${1}_${2}")
	snake = matchAllCap.ReplaceAllString(snake, "${1}_${2}")
	return strings.ToLower(snake)
}

type nodeError struct {
	node ast.Node
	err  error
}

func (e *nodeError) Error() string {
	return e.err.Error()
}

func (e *nodeError) Unwrap() error {
	return e.err
}

func NodeError(node ast.Node, err error) error {
	return &nodeError{
		node: node,
		err:  err,
	}
}

type nodeWithDocument struct {
	ast.Node
	doc *ast.Document
}

func (n *nodeWithDocument) Document() *ast.Document {
	return n.doc
}
