package compiler

var (
	_ Type = (*LiteralType)(nil)
	_ Type = (*LiteralArg)(nil)
)

type LiteralArg struct {
	NodeWithDocument

	marshal bool
	name    string
	ty      string
}

// Field implements Type.
func (l *LiteralArg) Field(b StructBuilder, name string) {}

// Marshal implements Type.
func (l *LiteralArg) Marshal(b BlockBuilder, name string) {
	if l.marshal {
		b.Argument(l.name, l.ty)
	}
}

// Name implements Type.
func (l *LiteralArg) Name(Context) string {
	return ""
}

// Unmarshal implements Type.
func (l *LiteralArg) Unmarshal(b BlockBuilder, name string) {
	if !l.marshal {
		b.Argument(l.name, l.ty)
	}
}

type LiteralType struct {
	NodeWithDocument

	code    string
	marshal bool
}

// Field implements Type.
func (a *LiteralType) Field(b StructBuilder, name string) {}

// Marshal implements Type.
func (a *LiteralType) Marshal(b BlockBuilder, name string) {
	if a.marshal {
		b.Appendf("%s", a.code)
	}
}

// Name implements Type.
func (a *LiteralType) Name(Context) string {
	return ""
}

// Unmarshal implements Type.
func (a *LiteralType) Unmarshal(b BlockBuilder, name string) {
	if !a.marshal {
		b.Appendf("%s", a.code)
	}
}
