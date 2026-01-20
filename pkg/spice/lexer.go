package spice

import (
	"bytes"
	"fmt"
	"strconv"
	"unicode"
)

const (
	tokInvalid token = iota
	tokEof
	tokName
	tokEqual
	tokPlusEqual
	tokPOpen
	tokPClose
	tokComma
	tokNumber
	tokString
	tokDate
)

type token int

func (t token) String() string {
	switch t {
	case tokInvalid:
		return "invalid"
	case tokEof:
		return "<EOF>"
	case tokName:
		return "name"
	case tokEqual:
		return "="
	case tokPlusEqual:
		return "+="
	case tokPOpen:
		return "("
	case tokPClose:
		return ")"
	case tokNumber:
		return "number"
	case tokString:
		return "string"
	case tokDate:
		return "date"
	default:
		return "<unknown>"
	}
}

type lex struct {
	pos   Pos
	input string
}

func (l *lex) scanToChar(c byte) string {
	startPos := l.pos
	for b := l.next(); !l.eof(); b = l.next() {
		if b == c {
			return l.input[startPos : l.pos-1]
		}
	}

	return l.input[startPos:l.pos]
}

func (l *lex) scanToWord(word string) string {
	startPos := l.pos

	for !l.eof() {
		l.scanToChar(word[0])

		candidatePos := l.pos - 1
		if l.eof() {
			break
		}

		// Check if the rest of the input matches the word
		if l.input[candidatePos:candidatePos+Pos(len(word))] == word {
			// Read the rest of the word
			for range len(word) - 1 {
				l.next()
			}

			return l.input[startPos:candidatePos]
		}
	}

	return l.input[startPos:l.pos]
}

// scan out the next token and place the value into the lval
// lhs specifies if
func (l *lex) lex(lval *symbol, lhs bool) token {
	defer func() { lval.end = l.pos }()

	for b := l.next(); b != 0; b = l.next() {
		lval.pos = l.pos - 1

		switch {
		case b == '\\':
			if l.peekN(len("begintext")) == "begintext" {
				l.pos += Pos(len("begintext"))
				l.scanToWord("\\begindata")
				continue
			} else {
				lval.err = fmt.Errorf("invalid separator word")
				return tokInvalid
			}
			// Whitespace
		case b == ' ', b == '\t', b == '\n':
			continue
		case b == '(':
			return tokPOpen
		case b == ')':
			return tokPClose
		case b == ',':
			return tokComma
		case b == '=':
			return tokEqual
		case b == '+' && l.peek() == '=':
			l.next() // absorb '='
			return tokPlusEqual
		case (b == '-' || b == '+') && !lhs:
			return l.scanNumber(lval, b == '-')
		case b == '\'':
			return l.scanString(lval)
		case b == '@':
			return l.scanDate(lval)
		case !lhs && unicode.IsDigit(rune(b)):
			l.backup()
			return l.scanNumber(lval, false)
		case lhs:
			// Variable name
			l.backup()
			return l.scanVariableName(lval)
		default:
			lval.err = fmt.Errorf("invalid token")
			return tokInvalid
		}
	}

	return tokEof
}

func (l *lex) scanNumber(lval *symbol, negative bool) token {
	var whole, frac, exponent string
	expSign := '+'

	buf := bytes.NewBuffer(nil)

	const (
		sWhole = iota
		sFraction
		sExponentSign
		sExponent
	)

	state := sWhole

charLoop:
	for {
		b := l.next()

		switch b {
		case 'E', 'e', 'D', 'd':
			switch state {
			case sWhole:
				whole = buf.String()
				buf.Reset()
				state = sExponentSign
			case sFraction:
				frac = buf.String()
				buf.Reset()
				state = sExponentSign
			case sExponent, sExponentSign:
				l.backup()
				break charLoop
			}
		case '.':
			switch state {
			case sWhole:
				whole = buf.String()
				buf.Reset()
				state = sFraction
			case sFraction, sExponent, sExponentSign:
				l.backup()
				break charLoop
			}
		case '+', '-':
			if state == sExponentSign {
				expSign = rune(b)
				state = sExponent
			} else {
				l.backup()
				break charLoop
			}
		default:
			if unicode.IsDigit(rune(b)) {
				buf.WriteByte(b)

				if state == sExponentSign {
					state = sExponent
				}
			} else {
				l.backup()
				break charLoop
			}
		}
	}

	switch state {
	case sWhole:
		whole = buf.String()
	case sFraction:
		frac = buf.String()
	case sExponent, sExponentSign:
		exponent = buf.String()
	}

	// Reformat the number
	if whole == "" {
		whole = "0"
	}

	if frac == "" {
		frac = "0"
	}

	var formatted string
	if exponent == "" {
		formatted = fmt.Sprintf("%s.%s", whole, frac)
	} else {
		formatted = fmt.Sprintf("%s.%sE%c%s", whole, frac, expSign, exponent)
	}

	flt, err := strconv.ParseFloat(formatted, 64)
	if err != nil {
		lval.err = err
		return tokInvalid
	} else {
		lval.num = flt
		if negative {
			lval.num *= -1
		}

		return tokNumber
	}
}

func (l *lex) scanString(lval *symbol) token {
	buf := bytes.NewBuffer(nil)

	for b := l.next(); b != 0; b = l.next() {
		switch b {
		case '\'':
			if l.next() == '\'' {
				// Escaped quote
				buf.WriteByte('\'')
			} else {
				// Close the string
				l.backup()
				lval.str = buf.String()
				return tokString
			}
		default:
			buf.WriteByte(b)
		}
	}

	lval.str = buf.String()
	return tokString
}

func (l *lex) scanDate(lval *symbol) token {
	start := l.pos
	for b := l.next(); b != 0; b = l.next() {
		switch b {
		case '(', ')', ' ', '\t', '=', '+', ',', '\n':
			l.backup()
			lval.date = l.input[start:l.pos]
			return tokDate
		}
	}

	lval.date = l.input[start:l.pos]
	return tokDate
}

func (l *lex) scanVariableName(lval *symbol) token {
	start := l.pos
	for b := l.next(); b != 0; b = l.next() {
		switch b {
		case '(', ')', ' ', '\t', '=', '+', ',':
			l.backup()
			lval.str = l.input[start:l.pos]
			return tokName
		}
	}

	lval.str = l.input[start:l.pos]
	return tokName
}

func (l *lex) backup() {
	if l.pos == -1 {
		return
	}

	l.pos--
}

func (l *lex) peekN(n int) string {
	if int(l.pos)+n >= len(l.input) {
		return l.input[l.pos:]
	} else {
		return l.input[l.pos : int(l.pos)+n]
	}
}

func (l *lex) peek() byte {
	if int(l.pos) >= len(l.input) {
		return 0
	}

	return l.input[l.pos]
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
