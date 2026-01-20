package ast

import (
	"fmt"
	"slices"
	"strings"
)

type (
	TextPosition struct {
		Line   int
		Column int
	}

	Document struct {
		Filename string
		Content  string
		Lines    []int
		Ast      Node
	}
)

func (d *Document) Position(pos Pos) TextPosition {
	line, _ := slices.BinarySearch(d.Lines, int(pos))
	line--
	if line < 0 {
		line = len(d.Lines) - 1
	}

	startPos := d.Lines[line]
	return TextPosition{
		Line:   line,
		Column: int(pos) - startPos,
	}
}

func (d *Document) Line(line int) string {
	if line >= len(d.Lines) {
		line = len(d.Lines) - 1
	}

	startPos := d.Lines[line]
	var endPos int

	if line+1 < len(d.Lines) {
		endPos = d.Lines[line+1] - 1
	} else {
		endPos = len(d.Content)
	}

	return d.Content[startPos:endPos]
}

type Message struct {
	IsError  bool
	Document *Document
	Node     Node
	Message  error
}

// Error implements error.
func (c *Message) Error() string {
	startPos := c.Document.Position(c.Node.Pos())
	endPos := c.Document.Position(c.Node.End())

	var kind string
	if c.IsError {
		kind = "error"
	} else {
		kind = "warning"
	}

	line := c.Document.Line(startPos.Line)
	indent := len(line) - len(strings.TrimLeft(line, "\t"))

	lines := []string{
		fmt.Sprintf("%s:%d:%d: %s: %s",
			c.Document.Filename,
			startPos.Line+1,
			startPos.Column+1,
			kind,
			c.Message,
		),
		line,
	}

	if endPos.Line == startPos.Line {
		lines = append(lines, (strings.Repeat("\t", indent) +
			strings.Repeat(" ", startPos.Column-indent) +
			"^" + strings.Repeat("~", max(endPos.Column-startPos.Column-1, 0))))
	} else {
		lines = append(lines, (strings.Repeat("\t", indent) +
			strings.Repeat(" ", startPos.Column-indent) +
			"^" + strings.Repeat("~", max(len(line)-startPos.Column-1, 0))))

		for i := startPos.Line + 1; i <= endPos.Line; i++ {
			lines = append(lines, c.Document.Line(i))
		}
	}

	return strings.Join(lines, "\n")
}
