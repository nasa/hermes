# Protocol Language

The protocol language is a language that lets you describe
a protocol's encoding/decoding and generate Go code to perform
it. It has a fairly advanced type system that can model a wide
variety of protocols.

# Type System

The protocol language will generate `Marshal` and `Unmarshal` functions
for types declared in the input file (as well as any other code needed such as struct definitions and constants).

Types that are declared in the file will have their own `Marshal`/`Unmarshal` while types that are simply referenced or are considered
"inline" can be referenced by type declarations and be placed in the `Marshal`/`Unmarshal` code of their parent but not define their own version.

## Primitives

The usual suspects.

- Unsigned integers `U8`, `U16`, `U32`, `U64`
- Signed integers `I8`, `I16`, `I32`, `I64`
- Floating points `F32`, `F64`
- Raw byte `byte`
  - Using this in arrays rather than `U8` will provide a performance gain

## Struct

Structures are 'packed' (i.e. no padding by default) in order fields that extract binary
information into a `map[string]any` value:

```
struct S * {
    Field1: F32
    Field2: F64
}
```

> Note: The `*` after the structure name denotes that this structure is "Big Endian" byte order. Little endian structs should be marked with `.` instead.

### Pads

Structure pads are "spaces" that are skipped in a structure's encoding. They
can be used as:

```
struct S * {
    Field1: F32
    [4]
    Field2: F64
}
```

## Strings

There are two types of strings:

- Static sized arrays: `[4]string`. This will read 4 bytes and convert them to a string
- Dynamically sized: `[U8]string`. This will read a `U8` prefix (any integer type is supported) as use that as the length for the actual string

## Arrays

Arrays are repeated types with either ahead of time known size or a runtime size.

### Static size

Statically sized arrays are arrays with their size known ahead of time.
They just have their types repeated one after the other

```
[6]U32
```

### Dynamic size

Dynamically sized arrays will have a "length" prefix which is a integer scalar type that will be read before the actual array is read. This scalar
will denote the number of items to read. It is recommended to read the length using an unsigned scalar type (`U*`)

```
[U8]U32
```

The above code will first read a `U8` _L_ and then it will read _L_ `U32`s into a `[]uint32` array.

### Fill size

Array size "fill" is an array that does not have a static size or a prefix. It signals to the decoder to keep reading until we run out of data in the input
packet.

```
[*]ElementType
```

### Field size

Field size is similar to dynamic size however it allows providing `Go` code
to get the length to read. This code will be converted to `uint32`.

> Note: To read from the current structure, use `s.FieldName`

```
[`s.PayloadSize`]byte
```

## Enums

Enum types are integer types that can be converted into strings if they match one of the fields in the enum:

```
enum EnumType I32 {
    VALUE_0 = 0
    VALUE_1 = 1
    VALUE_2 = 2
}
```

This above enum will first decode a 32-bit signed integer and then attempt to
match that value to one of the enum members.

## Bitmasks

Bitmasks will generate structs that will read bits into their fields.
All fields are scalar integers. You can convert the integers into other
types that support integral underlying types using `-> Type` syntax. This
is useful for reading enum bitfields

```
bitmask BA {
    # Read an entire byte
    F1: 4
    F2: 3 -> E_BA
    F3: 1

    :5

    F7: 57
}
```

> Note: The maximum bitfield size is `64-bits` since that is the largest integer scalar type natively supported in Go.

> You can skip over reserved bits by not providing a field name.

## Alias

A type alias is an alternate name to a type. Usually this is used for configuration
of variable types.

```
type NewTypeName = U32
```

## Type Calls

Some types are actually "type constructors" and take a set of parameters.
Parameters can be constants at compile-time or be propagated up to the runtime `Marshal`/`Unmarshal` functions.

To propagate type parameters, you can define structures with the parameters to propagate:

```
struct LogPacket(dict) * {
    Id: U32
    Args: EventArgs(dict)
}

```

## Match Type

A match type is a special type that can be used in a structure
to allow selecting decoding paths based on a set of conditions.
It allows variably decoding the payload of packets given the value of other
fields that have already been decoded.

```
struct Packet * {
    Type: PacketType
    Payload: {
        `s.Type == PacketType_LOG`: LogPacket
        `s.Type == PacketType_TELEM`: TelemPacket

        # Default case
        [*]byte
    }
}
```

This will generate a structure like this:

```go
type Packet struct {
    Type PacketType
    Payload any
}
```

The `any` field can be `*LogPacket`, `*TelemPacket` or `[]byte`. Which one
will depend on the value of `Packet.Type`.

### With Reader

The standard match type will use the struct's `serial.Reader` to read bytes from the current stream. There are some cases where we need to a subset of the current reader (usually where there is a size prefix).

You can specify to use a sub-reader using this syntax:

```
struct Packet * {
    Type: PacketType
    Payload: [U32]byte -> {
        `s.Type == PacketType_LOG`: LogPacket
        `s.Type == PacketType_TELEM`: TelemPacket

        # Default case
        [*]byte
    }
}
```

This syntax will read a `U32` before the payload and then create another reader with the size stored in that `U32` to read the match conditions.

The default case will then not necessarily exhaust all the bytes in the parent reader's byte stream.

## Transform Type

A transform type is a special type that can be registered with the compiler
that acts as a function over data at runtime. It has an "initial" type
which is a standard type that is passed to the transform. It then converts
the value of "initial" to the proper fields defined by the transform type.

A transform type may define more that one field in a struct. It is the transform's responsibility to fill these fields during `Unmarshal`ing

```
struct LogValue(dict) * {
    Id: U32
    Args: [U8][U8]byte -> EventArgs(dict)
}
```

The `Args` field will be read by first reading this nested array into a
`[][]byte` in Go. Then it will pass it to the `EventArgs` transform type
who will convert it to the proper type.

## Extern Type

An extern type is a type that is specified in another `.protocol` file or
externally in Go. You need to tell the compiler how to use the type and
where to find it.

**Simple Extern Type Declarations**

These are type declarations that exist in the _same_ package we are generating code into.

```
# Enums are referenced with non-pointer types
extern EnumTypeName: "GoEnumName"

# Structures should be referened with their pointer types (not required but recommended to match standard codegen)
extern StructTypeName: "*GoStructName"

extern CustomType: "GoType"
```

Referenced types must exist in Go and implement the following basic interface:

```go
type Type interface {
    Marshal(w *serial.Writer) error
    Unmarshal(r *serial.Reader) error
}
```

**Extern Type With Parameters**

If an external type is actually a type constructor (takes parameters),
you must declare that in the `extern` specifier as well. This is done
by providing string literal arguments that include a special prefix

```
extern CustomType(
    # Parameter in the "Unmarshal" only
    `U:*GoParameterType`,

    # Parameter included in "Marshal" only
    `M:*AnotherType`,

    `UM:FinalType`
)
```

This example code will require the referenced go type implement the following interface:

```go
type I_CustomType interface {
    Unmarshal(r *serial.Reader, *GoParameterType, FinalType) error
    Marshal(r *serial.Writer, *AnotherType, FinalType) error
}
```

**Referencing Types Outside of Current Package**

To reference Go code/type definitions outside the current package,
you can put optional imports to the extern:

```
# Single import
extern CustomType([...params]) -> "go/pkg/to/import"

# Multiple import
extern CustomTypeMulti([...params]) -> [
    "go/pkg/to/import1",
    "go/pkg/to/import2"
]

```
