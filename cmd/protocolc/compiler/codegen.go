package compiler

import (
	"fmt"
	"strings"
)

type Statement interface {
	Lines() []string
}

func IndentLine(line string) string {
	return strings.TrimRight("\t"+line, " \t")
}

func Indent(lines []string) []string {
	out := []string{}
	for _, line := range lines {
		out = append(out, IndentLine(line))
	}

	return out
}

type Line string

// Lines implements Statement.
func (l Line) Lines() []string {
	return []string{string(l)}
}

type Lines []string

// Lines implements Statement.
func (l Lines) Lines() []string {
	return l
}

func Linesf(lns string, args ...any) Statement {
	formatted := fmt.Sprintf(lns, args...)
	formatted = strings.Trim(formatted, "\n\t")
	linesRaw := strings.Split(formatted, "\n")

	out := []string{}
	for _, line := range linesRaw {
		out = append(out, line[strings.Index(line, "|")+1:])
	}

	return Lines(out)
}
