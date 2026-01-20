from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class FileHeader(_message.Message):
    __slots__ = ("sourcePath", "destinationPath", "size", "metadata")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    SOURCEPATH_FIELD_NUMBER: _ClassVar[int]
    DESTINATIONPATH_FIELD_NUMBER: _ClassVar[int]
    SIZE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    sourcePath: str
    destinationPath: str
    size: int
    metadata: _containers.ScalarMap[str, str]
    def __init__(self, sourcePath: _Optional[str] = ..., destinationPath: _Optional[str] = ..., size: _Optional[int] = ..., metadata: _Optional[_Mapping[str, str]] = ...) -> None: ...

class UplinkFileChunk(_message.Message):
    __slots__ = ("header", "data")
    HEADER_FIELD_NUMBER: _ClassVar[int]
    DATA_FIELD_NUMBER: _ClassVar[int]
    header: FileHeader
    data: bytes
    def __init__(self, header: _Optional[_Union[FileHeader, _Mapping]] = ..., data: _Optional[bytes] = ...) -> None: ...

class DownlinkFileData(_message.Message):
    __slots__ = ("offset", "data", "md")
    class MdEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    OFFSET_FIELD_NUMBER: _ClassVar[int]
    DATA_FIELD_NUMBER: _ClassVar[int]
    MD_FIELD_NUMBER: _ClassVar[int]
    offset: int
    data: bytes
    md: _containers.ScalarMap[str, str]
    def __init__(self, offset: _Optional[int] = ..., data: _Optional[bytes] = ..., md: _Optional[_Mapping[str, str]] = ...) -> None: ...

class DownlinkFileMetadata(_message.Message):
    __slots__ = ("key", "data")
    KEY_FIELD_NUMBER: _ClassVar[int]
    DATA_FIELD_NUMBER: _ClassVar[int]
    key: str
    data: bytes
    def __init__(self, key: _Optional[str] = ..., data: _Optional[bytes] = ...) -> None: ...

class DownlinkFileValidation(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class DownlinkFileChunk(_message.Message):
    __slots__ = ("header", "data", "metadata", "validation")
    HEADER_FIELD_NUMBER: _ClassVar[int]
    DATA_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    VALIDATION_FIELD_NUMBER: _ClassVar[int]
    header: FileHeader
    data: DownlinkFileData
    metadata: DownlinkFileMetadata
    validation: DownlinkFileValidation
    def __init__(self, header: _Optional[_Union[FileHeader, _Mapping]] = ..., data: _Optional[_Union[DownlinkFileData, _Mapping]] = ..., metadata: _Optional[_Union[DownlinkFileMetadata, _Mapping]] = ..., validation: _Optional[_Union[DownlinkFileValidation, _Mapping]] = ...) -> None: ...
