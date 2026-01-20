package compiler

import "fmt"

var (
	_ Type = (*PadType)(nil)
	_ Type = (*transformType)(nil)
)

type PadType struct {
	Size int
}

// Name implements Type.
func (p *PadType) Name(c Context) string {
	c.Error(fmt.Errorf("pad type does not have a type name"))
	return "INVALID"
}

// Field implements Type.
func (p *PadType) Field(b StructBuilder, name string) {
	// Pads don't declare any fields
}

// Marshal implements Type.
func (p *PadType) Marshal(b BlockBuilder, name string) {
	b.Appendf("w.Write(make([]byte, %d))", p.Size)
}

// Unmarshal implements Type.
func (p *PadType) Unmarshal(b BlockBuilder, name string) {
	b.Appendf("_, err = r.Read(%d)", p.Size)
	b.HandleError("pad read failed")
}

type transformType struct {
	Impl    TransformType
	Initial Type
}

// Name implements Type.
func (t *transformType) Name(Context) string {
	return t.Impl.Name()
}

// Field implements Type.
func (t *transformType) Field(b StructBuilder, name string) {
	t.Impl.Field(b, name)
}

// Marshal implements Type.
func (t *transformType) Marshal(b BlockBuilder, name string) {
	if t.Impl.HasMarshal() {
		tmpName := normalizeName(name) + "Tmp"
		b.Appendf("var %s %s", tmpName, t.Initial.Name(b))
		t.Impl.Marshal(b, name, tmpName)
		t.Initial.Marshal(b, tmpName)
	}
}

// Unmarshal implements Type.
func (t *transformType) Unmarshal(b BlockBuilder, name string) {
	if t.Impl.HasUnmarshal() {
		tmpName := normalizeName(name) + "Tmp"
		b.Appendf("var %s %s", tmpName, t.Initial.Name(b))
		t.Initial.Unmarshal(b, tmpName)
		t.Impl.Unmarshal(b, name, tmpName)
	}
}
