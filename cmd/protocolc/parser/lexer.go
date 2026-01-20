package parser

import (
	"bytes"
	"errors"
	"unicode"

	"github.com/nasa/hermes/cmd/protocolc/ast"
)

type lex struct {
	*ast.Document

	line int
	char int
	pos  ast.Pos
	buf  bytes.Buffer

	input []byte
	errs  []error
}

var escape = map[byte]byte{
	'"':  '"',
	'`':  '`',
	'\\': '\\',
	'/':  '/',
	'b':  '\b',
	'f':  '\f',
	'n':  '\n',
	'r':  '\r',
	't':  '\t',
}

// Lex satisfies yyLexer.
func (l *lex) Lex(lval *yySymType) int {
	return l.scanNormal(lval)
}

func (l *lex) scanNormal(lval *yySymType) int {
	l.buf.Reset()

	for b := l.next(); b != 0; b = l.next() {
		lval.Pos = l.pos - 1

		switch {
		case b == '\n':
			l.nextLine()
			continue
		case b == '#':
			l.scanComment()
		case b == '/':
			if l.next() == '/' {
				l.scanComment()
			} else {
				l.backup()
				l.backup()
				return '/'
			}
		case unicode.IsSpace(rune(b)):
			// Skip over whitespace
			continue
		case b == '=':
			return EQUAL
		case b == ',':
			return COMMA
		case b == '{':
			return CURLY_OPEN
		case b == '}':
			return CURLY_CLOSE
		case b == '(':
			return PAREN_OPEN
		case b == ')':
			return PAREN_CLOSE
		case b == '[':
			return BRACKET_OPEN
		case b == ']':
			return BRACKET_CLOSE
		case b == '.':
			return DOT
		case b == '$':
			return DOLLAR
		case b == '*':
			return STAR
		case b == '>':
			return DIRECT
		case b == ';':
			return SEMI
		case b == ':':
			return COLON
		case b == '?':
			return QUESTION
		case b == '|':
			return PIPE
		case b == '"':
			return l.scanString(lval)
		case b == '`':
			return l.scanRaw(lval)
		case b == '-':
			n := rune(l.next())
			if unicode.IsDigit(n) {
				l.backup()
				l.buf.WriteByte('-')
				return l.scanInteger(lval, 10)
			} else if n == '>' {
				return ARROW
			} else {
				return int(n)
			}
		case b == '0':
			delim := l.next()
			// Base 2 for "0b", 8 for "0" or "0o", 16 for "0x", and 10 otherwise
			switch delim {
			case 'b':
				l.buf.WriteByte('0')
				l.buf.WriteByte(delim)
				return l.scanInteger(lval, 2)
			case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'o':
				l.buf.WriteByte('0')
				l.buf.WriteByte(delim)
				return l.scanInteger(lval, 8)
			case 'x':
				l.buf.WriteByte('0')
				l.buf.WriteByte(delim)
				return l.scanInteger(lval, 16)
			default:
				l.backup()
				l.backup()
				return l.scanInteger(lval, 10)
			}
		case unicode.IsDigit(rune(b)):
			l.backup()
			return l.scanInteger(lval, 10)
		case unicode.IsLetter(rune(b)), b == '_':
			l.backup()
			return l.scanIdentifier(lval)
		default:
			return int(b)
		}
	}

	return 0
}

func (l *lex) scanString(lval *yySymType) int {
	pos := l.pos
	for b := l.next(); b != 0; b = l.next() {
		switch b {
		case '\\':
			b2 := escape[l.next()]
			if b2 == 0 {
				return LexError
			}
			l.buf.WriteByte(b2)
		case '"':
			lval.LitExpr = &ast.LitExpr{
				Kind:     ast.STRING,
				ValuePos: pos,
				Value:    l.buf.String(),
			}
			return Literal
		default:
			l.buf.WriteByte(b)
		}
	}

	return 0
}

func (l *lex) scanRaw(lval *yySymType) int {
	buf := bytes.NewBuffer(nil)
	pos := l.pos
	for {
		b := l.next()

		switch b {
		case '\\':
			b2 := escape[l.next()]
			if b2 == 0 {
				return LexError
			}
			buf.WriteByte(b2)
		case '\n':
			l.nextLine()
			buf.WriteByte('\n')
		case '`':
			lval.LitExpr = &ast.LitExpr{
				Kind:     ast.STRING,
				ValuePos: pos,
				Value:    buf.String(),
			}

			return Literal
		default:
			buf.WriteByte(b)
		}
	}
}

func (l *lex) scanComment() {
	for b := l.next(); b != 0; b = l.next() {
		if b == '\n' {
			l.nextLine()
			return
		}
	}
}

func lower(c byte) byte {
	return c | ('x' - 'X')
}

func (l *lex) scanInteger(lval *yySymType, base int) int {
	for {
		b := l.next()

		var d byte
		var good bool

		switch {
		case '0' <= b && b <= '9':
			d = b - '0'
			good = true
		case 'a' <= lower(b) && lower(b) <= 'z':
			d = lower(b) - 'a' + 10
			good = true
		default:
			good = false
		}

		// Check if the number is within the base range
		if good && d >= byte(base) {
			good = false
		}

		if !good {
			// We don't know what this character is, backup and return what we have
			l.backup()

			lval.LitExpr = &ast.LitExpr{
				Kind:     ast.INT,
				ValuePos: lval.Pos,
				Value:    l.buf.String(),
			}

			return Literal
		}

		l.buf.WriteByte(b)
	}
}

func (l *lex) scanIdentifier(lval *yySymType) int {
	pos := l.pos
	buf := bytes.NewBuffer(nil)
	lval.Pos = pos
	for {
		b := l.next()

		switch {
		case unicode.IsLetter(rune(b)),
			unicode.IsDigit(rune(b)),
			b == '_',
			b == '-':
			buf.WriteByte(b)
		default:
			// We don't know what this character is, backup and return what we have
			l.backup()
			word := buf.String()

			// Handle keywords
			switch word {
			case "struct":
				return STRUCT
			case "string":
				return STRING
			case "enum":
				return ENUM
			case "type":
				return TYPE
			case "extern":
				return EXTERN
			case "bitmask":
				return BITMASK
			case "unmarshal":
				return UNMARSHAL
			case "marshal":
				return MARSHAL
			case "import":
				return IMPORT
			default:
				lval.Ident = &ast.Ident{
					NamePos: ast.Pos(pos),
					Name:    word,
				}

				return Ident
			}
		}
	}
}

func (l *lex) backup() {
	if l.pos == -1 {
		return
	}

	l.pos--
	l.char--
}

func (l *lex) nextLine() {
	l.line++
	l.char = 0
}

func (l *lex) next() byte {
	if int(l.pos) >= len(l.input) || l.pos == -1 {
		l.pos = -1
		return 0
	}

	l.char++
	l.pos++
	return l.input[l.pos-1]
}

var (
	_ ast.Node = localNode(0)
)

type localNode ast.Pos

// End implements ast.Node.
func (l localNode) End() ast.Pos {
	return ast.Pos(l) + 1
}

// Pos implements ast.Node.
func (l localNode) Pos() ast.Pos {
	return ast.Pos(l)
}

// Error satisfies yyLexer.
func (l *lex) Error(s string) {
	l.errs = append(l.errs, &ast.Message{
		IsError:  true,
		Document: l.Document,
		Node:     localNode(l.pos - 1),
		Message:  errors.New(s),
	})
}

func (l *lex) SetResult(nodes ast.Nodes) {
	l.Document.Ast = nodes
}
