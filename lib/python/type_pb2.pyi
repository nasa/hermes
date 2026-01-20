from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class IntKind(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    INT_U8: _ClassVar[IntKind]
    INT_I8: _ClassVar[IntKind]
    INT_U16: _ClassVar[IntKind]
    INT_I16: _ClassVar[IntKind]
    INT_U32: _ClassVar[IntKind]
    INT_I32: _ClassVar[IntKind]
    INT_U64: _ClassVar[IntKind]
    INT_I64: _ClassVar[IntKind]

class NumberKind(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    NUMBER_U8: _ClassVar[NumberKind]
    NUMBER_I8: _ClassVar[NumberKind]
    NUMBER_U16: _ClassVar[NumberKind]
    NUMBER_I16: _ClassVar[NumberKind]
    NUMBER_U32: _ClassVar[NumberKind]
    NUMBER_I32: _ClassVar[NumberKind]
    NUMBER_U64: _ClassVar[NumberKind]
    NUMBER_I64: _ClassVar[NumberKind]
    NUMBER_F32: _ClassVar[NumberKind]
    NUMBER_F64: _ClassVar[NumberKind]

class UIntKind(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    UINT_U8: _ClassVar[UIntKind]
    UINT_U16: _ClassVar[UIntKind]
    UINT_U32: _ClassVar[UIntKind]
    UINT_U64: _ClassVar[UIntKind]

class SIntKind(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    SINT_I8: _ClassVar[SIntKind]
    SINT_I16: _ClassVar[SIntKind]
    SINT_I32: _ClassVar[SIntKind]
    SINT_I64: _ClassVar[SIntKind]

class FloatKind(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    F_F32: _ClassVar[FloatKind]
    F_F64: _ClassVar[FloatKind]

class ReferenceKind(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    REF_ENUM: _ClassVar[ReferenceKind]
    REF_BITMASK: _ClassVar[ReferenceKind]
    REF_OBJECT: _ClassVar[ReferenceKind]
    REF_ARRAY: _ClassVar[ReferenceKind]
    REF_BYTES: _ClassVar[ReferenceKind]
INT_U8: IntKind
INT_I8: IntKind
INT_U16: IntKind
INT_I16: IntKind
INT_U32: IntKind
INT_I32: IntKind
INT_U64: IntKind
INT_I64: IntKind
NUMBER_U8: NumberKind
NUMBER_I8: NumberKind
NUMBER_U16: NumberKind
NUMBER_I16: NumberKind
NUMBER_U32: NumberKind
NUMBER_I32: NumberKind
NUMBER_U64: NumberKind
NUMBER_I64: NumberKind
NUMBER_F32: NumberKind
NUMBER_F64: NumberKind
UINT_U8: UIntKind
UINT_U16: UIntKind
UINT_U32: UIntKind
UINT_U64: UIntKind
SINT_I8: SIntKind
SINT_I16: SIntKind
SINT_I32: SIntKind
SINT_I64: SIntKind
F_F32: FloatKind
F_F64: FloatKind
REF_ENUM: ReferenceKind
REF_BITMASK: ReferenceKind
REF_OBJECT: ReferenceKind
REF_ARRAY: ReferenceKind
REF_BYTES: ReferenceKind

class BooleanType(_message.Message):
    __slots__ = ("encodeType",)
    ENCODETYPE_FIELD_NUMBER: _ClassVar[int]
    encodeType: UIntKind
    def __init__(self, encodeType: _Optional[_Union[UIntKind, str]] = ...) -> None: ...

class IntType(_message.Message):
    __slots__ = ("kind", "min", "max")
    KIND_FIELD_NUMBER: _ClassVar[int]
    MIN_FIELD_NUMBER: _ClassVar[int]
    MAX_FIELD_NUMBER: _ClassVar[int]
    kind: IntKind
    min: int
    max: int
    def __init__(self, kind: _Optional[_Union[IntKind, str]] = ..., min: _Optional[int] = ..., max: _Optional[int] = ...) -> None: ...

class FloatType(_message.Message):
    __slots__ = ("kind", "min", "max")
    KIND_FIELD_NUMBER: _ClassVar[int]
    MIN_FIELD_NUMBER: _ClassVar[int]
    MAX_FIELD_NUMBER: _ClassVar[int]
    kind: FloatKind
    min: float
    max: float
    def __init__(self, kind: _Optional[_Union[FloatKind, str]] = ..., min: _Optional[float] = ..., max: _Optional[float] = ...) -> None: ...

class StringType(_message.Message):
    __slots__ = ("lengthType", "maxLength")
    LENGTHTYPE_FIELD_NUMBER: _ClassVar[int]
    MAXLENGTH_FIELD_NUMBER: _ClassVar[int]
    lengthType: UIntKind
    maxLength: int
    def __init__(self, lengthType: _Optional[_Union[UIntKind, str]] = ..., maxLength: _Optional[int] = ...) -> None: ...

class EnumItem(_message.Message):
    __slots__ = ("value", "name", "metadata")
    VALUE_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    value: int
    name: str
    metadata: str
    def __init__(self, value: _Optional[int] = ..., name: _Optional[str] = ..., metadata: _Optional[str] = ...) -> None: ...

class EnumType(_message.Message):
    __slots__ = ("name", "encodeType", "items")
    NAME_FIELD_NUMBER: _ClassVar[int]
    ENCODETYPE_FIELD_NUMBER: _ClassVar[int]
    ITEMS_FIELD_NUMBER: _ClassVar[int]
    name: str
    encodeType: IntKind
    items: _containers.RepeatedCompositeFieldContainer[EnumItem]
    def __init__(self, name: _Optional[str] = ..., encodeType: _Optional[_Union[IntKind, str]] = ..., items: _Optional[_Iterable[_Union[EnumItem, _Mapping]]] = ...) -> None: ...

class BoundedArraySize(_message.Message):
    __slots__ = ("min", "max")
    MIN_FIELD_NUMBER: _ClassVar[int]
    MAX_FIELD_NUMBER: _ClassVar[int]
    min: int
    max: int
    def __init__(self, min: _Optional[int] = ..., max: _Optional[int] = ...) -> None: ...

class ArrayType(_message.Message):
    __slots__ = ("name", "elType", "static", "dynamic", "lengthType")
    NAME_FIELD_NUMBER: _ClassVar[int]
    ELTYPE_FIELD_NUMBER: _ClassVar[int]
    STATIC_FIELD_NUMBER: _ClassVar[int]
    DYNAMIC_FIELD_NUMBER: _ClassVar[int]
    LENGTHTYPE_FIELD_NUMBER: _ClassVar[int]
    name: str
    elType: Type
    static: int
    dynamic: BoundedArraySize
    lengthType: UIntKind
    def __init__(self, name: _Optional[str] = ..., elType: _Optional[_Union[Type, _Mapping]] = ..., static: _Optional[int] = ..., dynamic: _Optional[_Union[BoundedArraySize, _Mapping]] = ..., lengthType: _Optional[_Union[UIntKind, str]] = ...) -> None: ...

class BytesType(_message.Message):
    __slots__ = ("name", "kind", "static", "dynamic", "lengthType")
    NAME_FIELD_NUMBER: _ClassVar[int]
    KIND_FIELD_NUMBER: _ClassVar[int]
    STATIC_FIELD_NUMBER: _ClassVar[int]
    DYNAMIC_FIELD_NUMBER: _ClassVar[int]
    LENGTHTYPE_FIELD_NUMBER: _ClassVar[int]
    name: str
    kind: NumberKind
    static: int
    dynamic: BoundedArraySize
    lengthType: UIntKind
    def __init__(self, name: _Optional[str] = ..., kind: _Optional[_Union[NumberKind, str]] = ..., static: _Optional[int] = ..., dynamic: _Optional[_Union[BoundedArraySize, _Mapping]] = ..., lengthType: _Optional[_Union[UIntKind, str]] = ...) -> None: ...

class Field(_message.Message):
    __slots__ = ("name", "type", "metadata", "value")
    NAME_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    name: str
    type: Type
    metadata: str
    value: Value
    def __init__(self, name: _Optional[str] = ..., type: _Optional[_Union[Type, _Mapping]] = ..., metadata: _Optional[str] = ..., value: _Optional[_Union[Value, _Mapping]] = ...) -> None: ...

class ObjectType(_message.Message):
    __slots__ = ("name", "fields")
    NAME_FIELD_NUMBER: _ClassVar[int]
    FIELDS_FIELD_NUMBER: _ClassVar[int]
    name: str
    fields: _containers.RepeatedCompositeFieldContainer[Field]
    def __init__(self, name: _Optional[str] = ..., fields: _Optional[_Iterable[_Union[Field, _Mapping]]] = ...) -> None: ...

class ReferenceType(_message.Message):
    __slots__ = ("name", "kind")
    NAME_FIELD_NUMBER: _ClassVar[int]
    KIND_FIELD_NUMBER: _ClassVar[int]
    name: str
    kind: ReferenceKind
    def __init__(self, name: _Optional[str] = ..., kind: _Optional[_Union[ReferenceKind, str]] = ...) -> None: ...

class VoidType(_message.Message):
    __slots__ = ("size",)
    SIZE_FIELD_NUMBER: _ClassVar[int]
    size: int
    def __init__(self, size: _Optional[int] = ...) -> None: ...

class Type(_message.Message):
    __slots__ = ("ref", "bool", "int", "float", "string", "enum", "bitmask", "object", "array", "bytes", "void", "metadata")
    REF_FIELD_NUMBER: _ClassVar[int]
    BOOL_FIELD_NUMBER: _ClassVar[int]
    INT_FIELD_NUMBER: _ClassVar[int]
    FLOAT_FIELD_NUMBER: _ClassVar[int]
    STRING_FIELD_NUMBER: _ClassVar[int]
    ENUM_FIELD_NUMBER: _ClassVar[int]
    BITMASK_FIELD_NUMBER: _ClassVar[int]
    OBJECT_FIELD_NUMBER: _ClassVar[int]
    ARRAY_FIELD_NUMBER: _ClassVar[int]
    BYTES_FIELD_NUMBER: _ClassVar[int]
    VOID_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    ref: ReferenceType
    bool: BooleanType
    int: IntType
    float: FloatType
    string: StringType
    enum: EnumType
    bitmask: EnumType
    object: ObjectType
    array: ArrayType
    bytes: BytesType
    void: VoidType
    metadata: str
    def __init__(self, ref: _Optional[_Union[ReferenceType, _Mapping]] = ..., bool: _Optional[_Union[BooleanType, _Mapping]] = ..., int: _Optional[_Union[IntType, _Mapping]] = ..., float: _Optional[_Union[FloatType, _Mapping]] = ..., string: _Optional[_Union[StringType, _Mapping]] = ..., enum: _Optional[_Union[EnumType, _Mapping]] = ..., bitmask: _Optional[_Union[EnumType, _Mapping]] = ..., object: _Optional[_Union[ObjectType, _Mapping]] = ..., array: _Optional[_Union[ArrayType, _Mapping]] = ..., bytes: _Optional[_Union[BytesType, _Mapping]] = ..., void: _Optional[_Union[VoidType, _Mapping]] = ..., metadata: _Optional[str] = ...) -> None: ...

class ObjectValue(_message.Message):
    __slots__ = ("o",)
    class OEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: Value
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[Value, _Mapping]] = ...) -> None: ...
    O_FIELD_NUMBER: _ClassVar[int]
    o: _containers.MessageMap[str, Value]
    def __init__(self, o: _Optional[_Mapping[str, Value]] = ...) -> None: ...

class ArrayValue(_message.Message):
    __slots__ = ("value",)
    VALUE_FIELD_NUMBER: _ClassVar[int]
    value: _containers.RepeatedCompositeFieldContainer[Value]
    def __init__(self, value: _Optional[_Iterable[_Union[Value, _Mapping]]] = ...) -> None: ...

class BytesValue(_message.Message):
    __slots__ = ("kind", "bigEndian", "value")
    KIND_FIELD_NUMBER: _ClassVar[int]
    BIGENDIAN_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    kind: NumberKind
    bigEndian: bool
    value: bytes
    def __init__(self, kind: _Optional[_Union[NumberKind, str]] = ..., bigEndian: bool = ..., value: _Optional[bytes] = ...) -> None: ...

class EnumValue(_message.Message):
    __slots__ = ("raw", "formatted")
    RAW_FIELD_NUMBER: _ClassVar[int]
    FORMATTED_FIELD_NUMBER: _ClassVar[int]
    raw: int
    formatted: str
    def __init__(self, raw: _Optional[int] = ..., formatted: _Optional[str] = ...) -> None: ...

class Value(_message.Message):
    __slots__ = ("i", "u", "f", "b", "s", "e", "o", "a", "r")
    I_FIELD_NUMBER: _ClassVar[int]
    U_FIELD_NUMBER: _ClassVar[int]
    F_FIELD_NUMBER: _ClassVar[int]
    B_FIELD_NUMBER: _ClassVar[int]
    S_FIELD_NUMBER: _ClassVar[int]
    E_FIELD_NUMBER: _ClassVar[int]
    O_FIELD_NUMBER: _ClassVar[int]
    A_FIELD_NUMBER: _ClassVar[int]
    R_FIELD_NUMBER: _ClassVar[int]
    i: int
    u: int
    f: float
    b: bool
    s: str
    e: EnumValue
    o: ObjectValue
    a: ArrayValue
    r: BytesValue
    def __init__(self, i: _Optional[int] = ..., u: _Optional[int] = ..., f: _Optional[float] = ..., b: bool = ..., s: _Optional[str] = ..., e: _Optional[_Union[EnumValue, _Mapping]] = ..., o: _Optional[_Union[ObjectValue, _Mapping]] = ..., a: _Optional[_Union[ArrayValue, _Mapping]] = ..., r: _Optional[_Union[BytesValue, _Mapping]] = ...) -> None: ...
