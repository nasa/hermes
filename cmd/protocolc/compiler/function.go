package compiler

import (
	"fmt"
	"strings"
)

type Code interface {
	String(Context) string
}

var (
	_ Code = (*Func)(nil)
)

type FormalParam struct {
	Name string
	Type string
}

func (f *FormalParam) String() string {
	return fmt.Sprintf("%s %s", f.Name, f.Type)
}

type Func struct {
	Name       string
	Args       []*FormalParam
	ReturnType string
	Code       Statement

	// Method information
	forTypeIdent string
	forType      string
}

func (f *Func) Arg(arg *FormalParam) *Func {
	if arg != nil {
		f.Args = append(f.Args, arg)
	}

	return f
}

func (f *Func) String(Context) string {
	args := []string{}
	for _, arg := range f.Args {
		args = append(args, arg.String())
	}

	returnValue := f.ReturnType
	if returnValue != "" {
		returnValue = " " + returnValue
	}

	if f.forType == "" {
		// Standalone function
		return fmt.Sprintf(
			"func %s(%s)%s {\n%s\n}\n",
			f.Name, strings.Join(args, ", "), returnValue,
			strings.Join(f.Code.Lines(), "\n"),
		)
	} else {
		return fmt.Sprintf(
			"func (%s %s) %s(%s)%s {\n%s\n}\n",
			f.forTypeIdent, f.forType,
			f.Name, strings.Join(args, ", "), returnValue,
			strings.Join(f.Code.Lines(), "\n"),
		)
	}
}
