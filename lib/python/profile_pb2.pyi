from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class ProfileState(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    PROFILE_IDLE: _ClassVar[ProfileState]
    PROFILE_CONNECTING: _ClassVar[ProfileState]
    PROFILE_ACTIVE: _ClassVar[ProfileState]
    PROFILE_DISCONNECT: _ClassVar[ProfileState]
PROFILE_IDLE: ProfileState
PROFILE_CONNECTING: ProfileState
PROFILE_ACTIVE: ProfileState
PROFILE_DISCONNECT: ProfileState

class ProfileProvider(_message.Message):
    __slots__ = ("name", "schema", "ui_schema")
    NAME_FIELD_NUMBER: _ClassVar[int]
    SCHEMA_FIELD_NUMBER: _ClassVar[int]
    UI_SCHEMA_FIELD_NUMBER: _ClassVar[int]
    name: str
    schema: str
    ui_schema: str
    def __init__(self, name: _Optional[str] = ..., schema: _Optional[str] = ..., ui_schema: _Optional[str] = ...) -> None: ...

class Profile(_message.Message):
    __slots__ = ("name", "provider", "settings", "id")
    NAME_FIELD_NUMBER: _ClassVar[int]
    PROVIDER_FIELD_NUMBER: _ClassVar[int]
    SETTINGS_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    name: str
    provider: str
    settings: str
    id: str
    def __init__(self, name: _Optional[str] = ..., provider: _Optional[str] = ..., settings: _Optional[str] = ..., id: _Optional[str] = ...) -> None: ...
