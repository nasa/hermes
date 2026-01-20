package parser

import (
	"errors"
	"os"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

func Parse(filename string, input []byte) (*ast.Document, error) {
	yyErrorVerbose = true

	lines := []int{0}
	for p, c := range input {
		if c == '\n' {
			lines = append(lines, p+1)
		}
	}

	l := &lex{
		Document: &ast.Document{
			Filename: filename,
			Content:  string(input),
			Lines:    lines,
		},

		input: input,
	}

	_ = yyParse(l)

	if len(l.errs) == 0 {
		return l.Document, nil
	} else {
		return nil, errors.Join(l.errs...)
	}
}

func ParseFile(filename string) (*ast.Document, error) {
	fileContent, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	d, err := Parse(filename, fileContent)
	if err != nil {
		return nil, err
	}

	return d, nil
}
