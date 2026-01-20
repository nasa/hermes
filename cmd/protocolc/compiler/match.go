package compiler

import "fmt"

var (
	_ Type = (*MatchType)(nil)
)

type TypeCase struct {
	Condition string
	Type      Type
}

type MatchType struct {
	Reader   Type
	Cases    []*TypeCase
	TypeName string
}

type matchBuilder struct {
	StructBuilder
	Name     string
	TypeName string
}

func (m *matchBuilder) Field(name string, typeName string) {
	if m.Name == name {
		if m.TypeName == "" {
			m.TypeName = typeName
		} else if m.TypeName != typeName {
			m.TypeName = "any"
		}
	} else {
		m.StructBuilder.Field(name, typeName)
	}
}

// Name implements Type.
func (m *MatchType) Name(c Context) string {
	c.Error(fmt.Errorf("match type does not have a type name"))
	return "INVALID"
}

// Field implements Type.
func (m *MatchType) Field(b StructBuilder, name string) {
	mb := &matchBuilder{
		StructBuilder: b,
		Name:          name,
		TypeName:      "",
	}

	for _, cs := range m.Cases {
		cs.Type.Field(mb, name)
	}

	if mb.TypeName == "" {
		// No field was registered with this name
	} else {
		b.Field(name, mb.TypeName)
		m.TypeName = mb.TypeName
	}
}

// Marshal implements Type.
func (m *MatchType) Marshal(b BlockBuilder, name string) {
	b.Import("fmt")

	writerTmpName := normalizeName(fmt.Sprintf("w%sTmp", name))
	if m.Reader != nil {
		b.Appendf(`
		|%s := w
		|w = w.Clone()
		|w.Set(make([]byte, 0))`, writerTmpName)
	}

	sw := b.Block("switch")
	sw.Dedent()

	tmpName := normalizeName(name)

	var hasDefault bool
	for _, c := range m.Cases {
		if c.Condition == "" {
			hasDefault = true
			sw.Appendf("default:")
		} else {
			sw.Appendf("case %s:", c.Condition)
		}

		caseB := sw.Indent()
		if m.TypeName != "any" {
			caseB.Appendf(`
			|%[1]s := %[2]s
			|_ = %[1]s
			`, tmpName, name)
		} else {
			caseB.Appendf(`
			|%[1]s, ok := %[2]s.(%[3]s)
			|_ = %[1]s
			|if !ok {
			|	return fmt.Errorf("expected %[2]s to be %[3]s, got %%T", %[2]s)
			|}
			`, tmpName, name, c.Type.Name(b))
		}

		c.Type.Marshal(caseB, tmpName)
	}

	if !hasDefault {
		sw.Appendf("default:")
		sw.Indent().Appendf(`return fmt.Errorf("no case matched")`)
	}

	if m.Reader != nil {
		b.Appendf(`%s2 := w`, writerTmpName)
		b.Appendf(`w = %s`, writerTmpName)
		m.Reader.Marshal(b, fmt.Sprintf("%s2.Get()", writerTmpName))
	}
}

// Unmarshal implements Type.
func (m *MatchType) Unmarshal(b BlockBuilder, name string) {
	readerTmpName := normalizeName(fmt.Sprintf("r%sTmp", name))
	if m.Reader != nil {
		tmpBuffer := normalizeName(fmt.Sprintf("s%sTmp", name))
		b.Appendf("var %s []byte", tmpBuffer)
		m.Reader.Unmarshal(b, tmpBuffer)

		b.Appendf(`
		|%s := r
		|defer func() { r = %s }()
		|r = r.Clone()
		|r.Set(%s)`, readerTmpName, readerTmpName, tmpBuffer)
	}

	sw := b.Block("switch")
	sw.Dedent()

	tmpName := normalizeName(name)

	var hasDefault bool
	for _, c := range m.Cases {
		if c.Condition == "" {
			hasDefault = true
			sw.Appendf("default:")
		} else {
			sw.Appendf("case %s:", c.Condition)
		}

		caseB := sw.Indent()
		caseB.Appendf(`
		|var %[1]s %[2]s
		|_ = %[1]s`, tmpName, c.Type.Name(b))
		c.Type.Unmarshal(caseB, tmpName)
		caseB.Appendf("%s = %s", name, tmpName)
	}

	if !hasDefault {
		b.Import("fmt")
		sw.Appendf("default:")
		sw.Indent().Appendf(`return fmt.Errorf("no case matched")`)
	}

	if m.Reader != nil {
		b.Appendf(`r = %s`, readerTmpName)
	}
}
