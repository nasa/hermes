package spice

var (
	_ Value = Number(0)
	_ Value = NumberVector(nil)
	_ Value = String("")
	_ Value = StringVector(nil)
	_ Value = Date("")
	_ Value = DateVector(nil)
	_ Value = Vector(nil)
)

type Value interface {
	Kind() string
	Append(v Value) Value
}

type Number float64

// Append implements Value.
func (n Number) Append(v Value) Value {
	if an, ok := v.(Number); ok {
		return NumberVector{float64(n), float64(an)}
	}

	return Vector{n, v}
}

// Kind implements Value.
func (n Number) Kind() string {
	return "number"
}

type NumberVector []float64

// Append implements Value.
func (n NumberVector) Append(v Value) Value {
	if an, ok := v.(Number); ok {
		return append(n, float64(an))
	}

	out := Vector{}
	for _, i := range n {
		out = append(out, Number(i))
	}

	out = append(out, v)
	return out
}

// Kind implements Value.
func (n NumberVector) Kind() string {
	return "number vector"
}

type String string

// Append implements Value.
func (s String) Append(v Value) Value {
	if an, ok := v.(String); ok {
		return StringVector{string(s), string(an)}
	}

	return Vector{s, v}
}

// Kind implements Value.
func (s String) Kind() string {
	return "string"
}

type StringVector []string

// Append implements Value.
func (s StringVector) Append(v Value) Value {
	if an, ok := v.(String); ok {
		return append(s, string(an))
	}

	out := Vector{}
	for _, i := range s {
		out = append(out, String(i))
	}

	out = append(out, v)
	return out
}

// Kind implements Value.
func (s StringVector) Kind() string {
	return "string vector"
}

type Date string

// Append implements Value.
func (d Date) Append(v Value) Value {
	if an, ok := v.(Date); ok {
		return DateVector{string(d), string(an)}
	}

	return Vector{d, v}
}

// Kind implements Value.
func (d Date) Kind() string {
	return "date"
}

type DateVector []string

// Append implements Value.
func (d DateVector) Append(v Value) Value {
	if an, ok := v.(Date); ok {
		return append(d, string(an))
	}

	out := Vector{}
	for _, i := range d {
		out = append(out, Date(i))
	}

	out = append(out, v)
	return out
}

// Kind implements Value.
func (d DateVector) Kind() string {
	return "date vector"
}

type Vector []Value

// Append implements Value.
func (x Vector) Append(v Value) Value {
	return append(x, v)
}

// Kind implements Value.
func (v Vector) Kind() string {
	return "vector"
}
