import type_pb2 as _type_pb2
import dictionary_pb2 as _dictionary_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class FswCapability(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    COMMAND: _ClassVar[FswCapability]
    PARSE_COMMAND: _ClassVar[FswCapability]
    SEQUENCE: _ClassVar[FswCapability]
    PARSE_SEQUENCE: _ClassVar[FswCapability]
    FILE: _ClassVar[FswCapability]
    REQUEST: _ClassVar[FswCapability]
COMMAND: FswCapability
PARSE_COMMAND: FswCapability
SEQUENCE: FswCapability
PARSE_SEQUENCE: FswCapability
FILE: FswCapability
REQUEST: FswCapability

class Fsw(_message.Message):
    __slots__ = ("id", "type", "profile_id", "forwards", "capabilities", "dictionary")
    ID_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    PROFILE_ID_FIELD_NUMBER: _ClassVar[int]
    FORWARDS_FIELD_NUMBER: _ClassVar[int]
    CAPABILITIES_FIELD_NUMBER: _ClassVar[int]
    DICTIONARY_FIELD_NUMBER: _ClassVar[int]
    id: str
    type: str
    profile_id: str
    forwards: _containers.RepeatedScalarFieldContainer[str]
    capabilities: _containers.RepeatedScalarFieldContainer[FswCapability]
    dictionary: str
    def __init__(self, id: _Optional[str] = ..., type: _Optional[str] = ..., profile_id: _Optional[str] = ..., forwards: _Optional[_Iterable[str]] = ..., capabilities: _Optional[_Iterable[_Union[FswCapability, str]]] = ..., dictionary: _Optional[str] = ...) -> None: ...

class CommandOptions(_message.Message):
    __slots__ = ("no_wait",)
    NO_WAIT_FIELD_NUMBER: _ClassVar[int]
    no_wait: bool
    def __init__(self, no_wait: bool = ...) -> None: ...

class CommandValue(_message.Message):
    __slots__ = ("args", "options", "metadata")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    DEF_FIELD_NUMBER: _ClassVar[int]
    ARGS_FIELD_NUMBER: _ClassVar[int]
    OPTIONS_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    args: _containers.RepeatedCompositeFieldContainer[_type_pb2.Value]
    options: CommandOptions
    metadata: _containers.ScalarMap[str, str]
    def __init__(self, args: _Optional[_Iterable[_Union[_type_pb2.Value, _Mapping]]] = ..., options: _Optional[_Union[CommandOptions, _Mapping]] = ..., metadata: _Optional[_Mapping[str, str]] = ..., **kwargs) -> None: ...

class RawCommandValue(_message.Message):
    __slots__ = ("command", "options", "metadata")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    COMMAND_FIELD_NUMBER: _ClassVar[int]
    OPTIONS_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    command: str
    options: CommandOptions
    metadata: _containers.ScalarMap[str, str]
    def __init__(self, command: _Optional[str] = ..., options: _Optional[_Union[CommandOptions, _Mapping]] = ..., metadata: _Optional[_Mapping[str, str]] = ...) -> None: ...

class CommandSequence(_message.Message):
    __slots__ = ("commands", "language_name", "metadata")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    COMMANDS_FIELD_NUMBER: _ClassVar[int]
    LANGUAGE_NAME_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    commands: _containers.RepeatedCompositeFieldContainer[CommandValue]
    language_name: str
    metadata: _containers.ScalarMap[str, str]
    def __init__(self, commands: _Optional[_Iterable[_Union[CommandValue, _Mapping]]] = ..., language_name: _Optional[str] = ..., metadata: _Optional[_Mapping[str, str]] = ...) -> None: ...

class RawCommandSequence(_message.Message):
    __slots__ = ("sequence", "language_name", "metadata", "line_comment_prefix")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    SEQUENCE_FIELD_NUMBER: _ClassVar[int]
    LANGUAGE_NAME_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    LINE_COMMENT_PREFIX_FIELD_NUMBER: _ClassVar[int]
    sequence: str
    language_name: str
    metadata: _containers.ScalarMap[str, str]
    line_comment_prefix: str
    def __init__(self, sequence: _Optional[str] = ..., language_name: _Optional[str] = ..., metadata: _Optional[_Mapping[str, str]] = ..., line_comment_prefix: _Optional[str] = ...) -> None: ...

class RequestValue(_message.Message):
    __slots__ = ("kind", "data")
    KIND_FIELD_NUMBER: _ClassVar[int]
    DATA_FIELD_NUMBER: _ClassVar[int]
    kind: str
    data: bytes
    def __init__(self, kind: _Optional[str] = ..., data: _Optional[bytes] = ...) -> None: ...

class RequestReply(_message.Message):
    __slots__ = ("data",)
    DATA_FIELD_NUMBER: _ClassVar[int]
    data: bytes
    def __init__(self, data: _Optional[bytes] = ...) -> None: ...
