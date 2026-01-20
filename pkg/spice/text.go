package spice

import (
	"errors"
	"fmt"
)

type TextKernel struct {
	Type KernelType
	Data map[string]Value
}

type symbol struct {
	pos Pos
	end Pos

	num  float64
	str  string
	date string

	err error
}

func (s *symbol) Range() *textRange {
	return &textRange{
		Start: s.pos,
		End:   s.end,
	}
}

func (t *TextKernel) Load(filename string, content string) error {
	clear(t.Data)

	l := lex{pos: 0, input: content}

	lines := []int{0}
	for p, c := range content {
		if c == '\n' {
			lines = append(lines, p+1)
		}
	}

	doc := &Document{
		Filename: filename,
		Content:  content,
		Lines:    lines,
	}

	// Parse the kernel type
	kernelType := KernelType(l.scanToChar('\n'))
	switch kernelType {
	case FK, IK, LSK, MK, PCK_T, SCLK:
		t.Type = kernelType
	default:
		return fmt.Errorf("invalid text kernel type: %s", kernelType)
	}

	// Skip over start text
	l.scanToWord("\\begindata")

	var val symbol
	lex := func(lhs bool, expect token) (tok token, ok bool) {
		tok = l.lex(&val, lhs)
		switch tok {
		case tokInvalid:
			doc.Errors = append(doc.Errors, newInvalidError(doc, &val))
			return tok, false
		case tokEof:
			return tok, false
		default:
			if expect != tokInvalid && expect != tok {
				doc.Errors = append(doc.Errors, newWrongToken(doc, expect, tok, &val))
				return tok, false
			}

			return tok, true
		}
	}

	assignments := []*assignment{}

	// Scan all the variables in the data sections
	for !l.eof() {
		if len(doc.Errors) > 0 {
			break
		}

		// Variable name
		var varName node[string]
		if _, ok := lex(true, tokName); ok {
			varName = newNode(&val, val.str)
		} else {
			continue
		}

		// Separator
		sepTok, ok := lex(true, tokInvalid)
		if !ok {
			continue
		}

		var inc bool

		switch sepTok {
		case tokEqual:
			inc = false
		case tokPlusEqual:
			inc = true
		default:
			doc.Errors = append(doc.Errors, &Message{
				IsError:  true,
				Document: doc,
				Range:    val.Range(),
				Message:  fmt.Errorf("expected '=' or '+=', not %s", sepTok.String()),
			})

			continue
		}

		// Value
		valueTok, ok := lex(false, tokInvalid)
		if !ok {
			continue
		}

		value := []node[Value]{}

		switch valueTok {
		case tokPOpen:
			// Parse vector
		vectorLoop:
			for {
				valueTok, ok := lex(false, tokInvalid)
				if !ok {
					break
				}

				switch valueTok {
				case tokNumber:
					value = append(value, newNode(&val, Value(Number(val.num))))
				case tokString:
					value = append(value, newNode(&val, Value(String(val.str))))
				case tokDate:
					value = append(value, newNode(&val, Value(Date(val.date))))
				case tokComma:
					continue
				case tokPClose:
					break vectorLoop
				default:
					doc.Errors = append(doc.Errors, &Message{
						IsError:  true,
						Document: doc,
						Range:    val.Range(),
						Message:  fmt.Errorf("not a value"),
					})
					break vectorLoop
				}
			}
		case tokNumber:
			value = append(value, newNode(&val, Value(Number(val.num))))
		case tokString:
			value = append(value, newNode(&val, Value(String(val.str))))
		case tokDate:
			value = append(value, newNode(&val, Value(Date(val.date))))
		default:
			doc.Errors = append(doc.Errors, &Message{
				IsError:  true,
				Document: doc,
				Range:    val.Range(),
				Message:  fmt.Errorf("not a value"),
			})
		}

		if len(value) == 0 {
			doc.Errors = append(doc.Errors, &Message{
				IsError:  false,
				Document: doc,
				Range:    val.Range(),
				Message:  fmt.Errorf("empty vector"),
			})
		} else {
			assignments = append(assignments, &assignment{
				name:  varName,
				inc:   inc,
				value: value,
			})
		}
	}

	if len(doc.Errors) > 0 {
		errs := []error{fmt.Errorf("errors occured during parsing")}
		errs = append(errs, doc.Errors...)

		if len(errs) > 16 {
			errs = errs[:16]
			errs = append(errs, fmt.Errorf("too many errors, truncated after 15"))
		}

		return errors.Join(errs...)
	}

	// Reduce the AST
	t.Data = map[string]Value{}
	for _, assn := range assignments {
		var new Value

		// Append new values to old one
		if assn.inc {
			if old, ok := t.Data[assn.name.Value]; ok {
				new = old
			} else {
				// This variable does not exist yet
				// Declare it and append the value to it
				new = assn.value[0].Value
				assn.value = assn.value[1:]
			}
		} else {
			// Declare the new value
			new = assn.value[0].Value
			assn.value = assn.value[1:]
		}

		for _, val := range assn.value {
			new = new.Append(val.Value)
		}

		t.Data[assn.name.Value] = new
	}

	if len(doc.Errors) > 0 {
		errs := []error{fmt.Errorf("errors occured during compilation")}
		errs = append(errs, doc.Errors...)

		if len(errs) > 16 {
			errs = errs[:16]
			errs = append(errs, fmt.Errorf("too many errors, truncated after 15"))
		}

		return errors.Join(errs...)
	}

	return nil
}

func (t *TextKernel) GetNumber(name string) (float64, error) {
	if v, ok := t.Data[name]; ok {
		if k, ok := v.(Number); ok {
			return float64(k), nil
		} else {
			return 0, fmt.Errorf("expected '%s' to be a number", name)
		}
	} else {
		return 0, fmt.Errorf("'%s' not defined", name)
	}
}

func (t *TextKernel) GetNumberVector(name string) ([]float64, error) {
	if v, ok := t.Data[name]; ok {
		if k, ok := v.(NumberVector); ok {
			return []float64(k), nil
		} else if k, ok := v.(Number); ok {
			return []float64{float64(k)}, nil
		} else {
			return nil, fmt.Errorf("expected '%s' to be a number vector, got %T", name, v)
		}
	} else {
		return nil, fmt.Errorf("'%s' not defined", name)
	}
}

func (t *TextKernel) GetString(name string) (string, error) {
	if v, ok := t.Data[name]; ok {
		if k, ok := v.(String); ok {
			return string(k), nil
		} else {
			return "", fmt.Errorf("expected '%s' to be a string, got %T", name, v)
		}
	} else {
		return "", fmt.Errorf("'%s' not defined", name)
	}
}

func (t *TextKernel) GetStringVector(name string) ([]string, error) {
	if v, ok := t.Data[name]; ok {
		if k, ok := v.(StringVector); ok {
			return []string(k), nil
		} else if k, ok := v.(String); ok {
			return []string{string(k)}, nil
		} else {
			return nil, fmt.Errorf("expected '%s' to be a string vector, got %T", name, v)
		}
	} else {
		return nil, fmt.Errorf("'%s' not defined", name)
	}
}

func (t *TextKernel) GetDate(name string) (string, error) {
	if v, ok := t.Data[name]; ok {
		if k, ok := v.(Date); ok {
			return string(k), nil
		} else {
			return "", fmt.Errorf("expected '%s' to be a date, got %T", name, v)
		}
	} else {
		return "", fmt.Errorf("'%s' not defined", name)
	}
}

func (t *TextKernel) GetDateVector(name string) ([]string, error) {
	if v, ok := t.Data[name]; ok {
		if k, ok := v.(DateVector); ok {
			return []string(k), nil
		} else if k, ok := v.(Date); ok {
			return []string{string(k)}, nil
		} else {
			return nil, fmt.Errorf("expected '%s' to be a date vector, got %T", name, v)
		}
	} else {
		return nil, fmt.Errorf("'%s' not defined", name)
	}
}

func (t *TextKernel) Get(name string) (Value, error) {
	if v, ok := t.Data[name]; ok {
		return v, nil
	} else {
		return nil, fmt.Errorf("'%s' not defined", name)
	}
}

func (t *TextKernel) GetVector(name string) (Vector, error) {
	if v, ok := t.Data[name]; ok {
		switch tv := v.(type) {
		case Number:
			return Vector{tv}, nil
		case NumberVector:
			vs := Vector{}
			for _, i := range tv {
				vs = append(vs, Number(i))
			}
			return Vector{vs}, nil
		case String:
			return Vector{tv}, nil
		case StringVector:
			vs := Vector{}
			for _, i := range tv {
				vs = append(vs, String(i))
			}
			return Vector{vs}, nil
		case Date:
			return Vector{tv}, nil
		case DateVector:
			vs := Vector{}
			for _, i := range tv {
				vs = append(vs, Date(i))
			}
			return Vector{vs}, nil
		case Vector:
			return tv, nil
		default:
			return nil, fmt.Errorf("invalid value type %T", tv)
		}
	} else {
		return nil, fmt.Errorf("'%s' not defined", name)
	}
}

type node[T any] struct {
	Range *textRange
	Value T
}

func newNode[T any](sym *symbol, value T) node[T] {
	return node[T]{
		Range: sym.Range(),
		Value: value,
	}
}

type assignment struct {
	name  node[string]
	inc   bool
	value []node[Value]
}
