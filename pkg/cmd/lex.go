package cmd

import "strings"

type pos int

type lex struct {
	pos   pos
	input string
}

func (l *lex) eof() bool {
	return int(l.pos) >= len(l.input)
}

func (l *lex) next() byte {
	if l.eof() {
		return 0
	}

	l.pos++
	return l.input[l.pos-1]
}

func Lex(in string) []string {
	l := lex{input: strings.Trim(in, " ")}
	buf := []byte{}
	out := []string{}

	for b := l.next(); b != 0; b = l.next() {
		switch b {
		case ' ', ',', '\t':
			if len(buf) > 0 {
				out = append(out, string(buf))
				buf = []byte{}
			}
		case '"', '\'':
			literalClose := b
		literal:
			for b = l.next(); b != 0; b = l.next() {
				switch b {
				case '\\':
					escaped := l.next()
					buf = append(buf, escaped)
				case literalClose:
					out = append(out, string(buf))
					buf = []byte{}
					break literal
				default:
					buf = append(buf, b)
				}
			}
		case '\n': // no-op
		default:
			buf = append(buf, b)
		}
	}

	if len(buf) > 0 {
		out = append(out, string(buf))
	}

	return out
}
