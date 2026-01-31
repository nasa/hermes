from google.protobuf import empty_pb2 as _empty_pb2
import dictionary_pb2 as _dictionary_pb2
import fsw_pb2 as _fsw_pb2
import profile_pb2 as _profile_pb2
import file_pb2 as _file_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Id(_message.Message):
    __slots__ = ("id",)
    ID_FIELD_NUMBER: _ClassVar[int]
    id: str
    def __init__(self, id: _Optional[str] = ...) -> None: ...

class FswList(_message.Message):
    __slots__ = ("all",)
    ALL_FIELD_NUMBER: _ClassVar[int]
    all: _containers.RepeatedCompositeFieldContainer[_fsw_pb2.Fsw]
    def __init__(self, all: _Optional[_Iterable[_Union[_fsw_pb2.Fsw, _Mapping]]] = ...) -> None: ...

class Reply(_message.Message):
    __slots__ = ("success",)
    SUCCESS_FIELD_NUMBER: _ClassVar[int]
    success: bool
    def __init__(self, success: bool = ...) -> None: ...

class SequenceReply(_message.Message):
    __slots__ = ("success", "command_index")
    SUCCESS_FIELD_NUMBER: _ClassVar[int]
    COMMAND_INDEX_FIELD_NUMBER: _ClassVar[int]
    success: bool
    command_index: int
    def __init__(self, success: bool = ..., command_index: _Optional[int] = ...) -> None: ...

class StatefulProfile(_message.Message):
    __slots__ = ("value", "state", "runtime_only")
    VALUE_FIELD_NUMBER: _ClassVar[int]
    STATE_FIELD_NUMBER: _ClassVar[int]
    RUNTIME_ONLY_FIELD_NUMBER: _ClassVar[int]
    value: _profile_pb2.Profile
    state: _profile_pb2.ProfileState
    runtime_only: bool
    def __init__(self, value: _Optional[_Union[_profile_pb2.Profile, _Mapping]] = ..., state: _Optional[_Union[_profile_pb2.ProfileState, str]] = ..., runtime_only: bool = ...) -> None: ...

class ProfileList(_message.Message):
    __slots__ = ("all",)
    class AllEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: StatefulProfile
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[StatefulProfile, _Mapping]] = ...) -> None: ...
    ALL_FIELD_NUMBER: _ClassVar[int]
    all: _containers.MessageMap[str, StatefulProfile]
    def __init__(self, all: _Optional[_Mapping[str, StatefulProfile]] = ...) -> None: ...

class ProfileProviderList(_message.Message):
    __slots__ = ("all",)
    ALL_FIELD_NUMBER: _ClassVar[int]
    all: _containers.RepeatedCompositeFieldContainer[_profile_pb2.ProfileProvider]
    def __init__(self, all: _Optional[_Iterable[_Union[_profile_pb2.ProfileProvider, _Mapping]]] = ...) -> None: ...

class ProfileUpdate(_message.Message):
    __slots__ = ("id", "settings")
    ID_FIELD_NUMBER: _ClassVar[int]
    SETTINGS_FIELD_NUMBER: _ClassVar[int]
    id: str
    settings: str
    def __init__(self, id: _Optional[str] = ..., settings: _Optional[str] = ...) -> None: ...

class DictionaryList(_message.Message):
    __slots__ = ("all",)
    class AllEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: _dictionary_pb2.DictionaryHead
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[_dictionary_pb2.DictionaryHead, _Mapping]] = ...) -> None: ...
    ALL_FIELD_NUMBER: _ClassVar[int]
    all: _containers.MessageMap[str, _dictionary_pb2.DictionaryHead]
    def __init__(self, all: _Optional[_Mapping[str, _dictionary_pb2.DictionaryHead]] = ...) -> None: ...

class Uplink(_message.Message):
    __slots__ = ("id", "cmd", "parse_cmd", "seq", "parse_seq", "file", "cancel", "final")
    ID_FIELD_NUMBER: _ClassVar[int]
    CMD_FIELD_NUMBER: _ClassVar[int]
    PARSE_CMD_FIELD_NUMBER: _ClassVar[int]
    SEQ_FIELD_NUMBER: _ClassVar[int]
    PARSE_SEQ_FIELD_NUMBER: _ClassVar[int]
    FILE_FIELD_NUMBER: _ClassVar[int]
    CANCEL_FIELD_NUMBER: _ClassVar[int]
    FINAL_FIELD_NUMBER: _ClassVar[int]
    id: str
    cmd: _fsw_pb2.CommandValue
    parse_cmd: _fsw_pb2.RawCommandValue
    seq: _fsw_pb2.CommandSequence
    parse_seq: _fsw_pb2.RawCommandSequence
    file: _file_pb2.UplinkFileChunk
    cancel: _empty_pb2.Empty
    final: _empty_pb2.Empty
    def __init__(self, id: _Optional[str] = ..., cmd: _Optional[_Union[_fsw_pb2.CommandValue, _Mapping]] = ..., parse_cmd: _Optional[_Union[_fsw_pb2.RawCommandValue, _Mapping]] = ..., seq: _Optional[_Union[_fsw_pb2.CommandSequence, _Mapping]] = ..., parse_seq: _Optional[_Union[_fsw_pb2.RawCommandSequence, _Mapping]] = ..., file: _Optional[_Union[_file_pb2.UplinkFileChunk, _Mapping]] = ..., cancel: _Optional[_Union[_empty_pb2.Empty, _Mapping]] = ..., final: _Optional[_Union[_empty_pb2.Empty, _Mapping]] = ...) -> None: ...

class UplinkReply(_message.Message):
    __slots__ = ("id", "reply", "error")
    ID_FIELD_NUMBER: _ClassVar[int]
    REPLY_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    id: str
    reply: bytes
    error: str
    def __init__(self, id: _Optional[str] = ..., reply: _Optional[bytes] = ..., error: _Optional[str] = ...) -> None: ...

class FswInitialPacket(_message.Message):
    __slots__ = ("info", "profile")
    INFO_FIELD_NUMBER: _ClassVar[int]
    PROFILE_FIELD_NUMBER: _ClassVar[int]
    info: _fsw_pb2.Fsw
    profile: str
    def __init__(self, info: _Optional[_Union[_fsw_pb2.Fsw, _Mapping]] = ..., profile: _Optional[str] = ...) -> None: ...

class FswConnectionPacket(_message.Message):
    __slots__ = ("info", "reply")
    INFO_FIELD_NUMBER: _ClassVar[int]
    REPLY_FIELD_NUMBER: _ClassVar[int]
    info: FswInitialPacket
    reply: UplinkReply
    def __init__(self, info: _Optional[_Union[FswInitialPacket, _Mapping]] = ..., reply: _Optional[_Union[UplinkReply, _Mapping]] = ...) -> None: ...
