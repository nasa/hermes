package spice

import (
	"fmt"
	"slices"
	"strings"
)

type (
	// Positional index in a file
	// Must be matched against line position to get
	// text position
	Pos int

	textPosition struct {
		Line   int
		Column int
	}

	textRange struct {
		Start Pos
		End   Pos
	}

	Document struct {
		Filename string
		Content  string
		Lines    []int
		Errors   []error
	}

	Message struct {
		IsError  bool
		Document *Document
		Range    *textRange
		Message  error
	}
)

func (d *Document) TextPosition(pos Pos) textPosition {
	line, _ := slices.BinarySearch(d.Lines, int(pos))
	line--
	if line < 0 {
		line = len(d.Lines) - 1
	}

	startPos := d.Lines[line]
	return textPosition{
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

// Error implements error.
func (c *Message) Error() string {
	startPos := c.Document.TextPosition(c.Range.Start)
	endPos := c.Document.TextPosition(c.Range.End)

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

func newInvalidError(doc *Document, val *symbol) *Message {
	return &Message{
		IsError:  true,
		Document: doc,
		Range:    val.Range(),
		Message:  val.err,
	}
}

func newWrongToken(doc *Document, expected token, got token, val *symbol) *Message {
	return &Message{
		IsError:  true,
		Document: doc,
		Range:    val.Range(),
		Message:  fmt.Errorf("expected %s, not %s", expected.String(), got.String()),
	}
}
