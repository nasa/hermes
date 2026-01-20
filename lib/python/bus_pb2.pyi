import datetime

from google.protobuf import timestamp_pb2 as _timestamp_pb2
import type_pb2 as _type_pb2
import dictionary_pb2 as _dictionary_pb2
import time_pb2 as _time_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class SourceContextFilter(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    REALTIME_ONLY: _ClassVar[SourceContextFilter]
    RECORDED_ONLY: _ClassVar[SourceContextFilter]
    ALL: _ClassVar[SourceContextFilter]

class SourceContext(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    REALTIME: _ClassVar[SourceContext]
    RECORDED: _ClassVar[SourceContext]

class FileDownlinkCompletionStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    DOWNLINK_COMPLETED: _ClassVar[FileDownlinkCompletionStatus]
    DOWNLINK_UNKNOWN: _ClassVar[FileDownlinkCompletionStatus]
    DOWNLINK_PARTIAL: _ClassVar[FileDownlinkCompletionStatus]
    DOWNLINK_CRC_FAILED: _ClassVar[FileDownlinkCompletionStatus]
REALTIME_ONLY: SourceContextFilter
RECORDED_ONLY: SourceContextFilter
ALL: SourceContextFilter
REALTIME: SourceContext
RECORDED: SourceContext
DOWNLINK_COMPLETED: FileDownlinkCompletionStatus
DOWNLINK_UNKNOWN: FileDownlinkCompletionStatus
DOWNLINK_PARTIAL: FileDownlinkCompletionStatus
DOWNLINK_CRC_FAILED: FileDownlinkCompletionStatus

class BusFilter(_message.Message):
    __slots__ = ("source", "names", "context")
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    NAMES_FIELD_NUMBER: _ClassVar[int]
    CONTEXT_FIELD_NUMBER: _ClassVar[int]
    source: str
    names: _containers.RepeatedScalarFieldContainer[str]
    context: SourceContextFilter
    def __init__(self, source: _Optional[str] = ..., names: _Optional[_Iterable[str]] = ..., context: _Optional[_Union[SourceContextFilter, str]] = ...) -> None: ...

class Event(_message.Message):
    __slots__ = ("ref", "time", "message", "args", "tags")
    class TagsEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: _type_pb2.Value
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[_type_pb2.Value, _Mapping]] = ...) -> None: ...
    REF_FIELD_NUMBER: _ClassVar[int]
    TIME_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    ARGS_FIELD_NUMBER: _ClassVar[int]
    TAGS_FIELD_NUMBER: _ClassVar[int]
    ref: _dictionary_pb2.EventRef
    time: _time_pb2.Time
    message: str
    args: _containers.RepeatedCompositeFieldContainer[_type_pb2.Value]
    tags: _containers.MessageMap[str, _type_pb2.Value]
    def __init__(self, ref: _Optional[_Union[_dictionary_pb2.EventRef, _Mapping]] = ..., time: _Optional[_Union[_time_pb2.Time, _Mapping]] = ..., message: _Optional[str] = ..., args: _Optional[_Iterable[_Union[_type_pb2.Value, _Mapping]]] = ..., tags: _Optional[_Mapping[str, _type_pb2.Value]] = ...) -> None: ...

class Telemetry(_message.Message):
    __slots__ = ("ref", "time", "value", "labels")
    class LabelsEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    REF_FIELD_NUMBER: _ClassVar[int]
    TIME_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    LABELS_FIELD_NUMBER: _ClassVar[int]
    ref: _dictionary_pb2.TelemetryRef
    time: _time_pb2.Time
    value: _type_pb2.Value
    labels: _containers.ScalarMap[str, str]
    def __init__(self, ref: _Optional[_Union[_dictionary_pb2.TelemetryRef, _Mapping]] = ..., time: _Optional[_Union[_time_pb2.Time, _Mapping]] = ..., value: _Optional[_Union[_type_pb2.Value, _Mapping]] = ..., labels: _Optional[_Mapping[str, str]] = ...) -> None: ...

class SourcedEvent(_message.Message):
    __slots__ = ("event", "source", "context")
    EVENT_FIELD_NUMBER: _ClassVar[int]
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    CONTEXT_FIELD_NUMBER: _ClassVar[int]
    event: Event
    source: str
    context: SourceContext
    def __init__(self, event: _Optional[_Union[Event, _Mapping]] = ..., source: _Optional[str] = ..., context: _Optional[_Union[SourceContext, str]] = ...) -> None: ...

class SourcedTelemetry(_message.Message):
    __slots__ = ("telemetry", "source", "context")
    TELEMETRY_FIELD_NUMBER: _ClassVar[int]
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    CONTEXT_FIELD_NUMBER: _ClassVar[int]
    telemetry: Telemetry
    source: str
    context: SourceContext
    def __init__(self, telemetry: _Optional[_Union[Telemetry, _Mapping]] = ..., source: _Optional[str] = ..., context: _Optional[_Union[SourceContext, str]] = ...) -> None: ...

class FileDownlinkChunk(_message.Message):
    __slots__ = ("offset", "size")
    OFFSET_FIELD_NUMBER: _ClassVar[int]
    SIZE_FIELD_NUMBER: _ClassVar[int]
    offset: int
    size: int
    def __init__(self, offset: _Optional[int] = ..., size: _Optional[int] = ...) -> None: ...

class FileDownlink(_message.Message):
    __slots__ = ("uid", "timeStart", "timeEnd", "status", "source", "sourcePath", "destinationPath", "filePath", "missingChunks", "duplicateChunks", "size", "metadata")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    UID_FIELD_NUMBER: _ClassVar[int]
    TIMESTART_FIELD_NUMBER: _ClassVar[int]
    TIMEEND_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    SOURCEPATH_FIELD_NUMBER: _ClassVar[int]
    DESTINATIONPATH_FIELD_NUMBER: _ClassVar[int]
    FILEPATH_FIELD_NUMBER: _ClassVar[int]
    MISSINGCHUNKS_FIELD_NUMBER: _ClassVar[int]
    DUPLICATECHUNKS_FIELD_NUMBER: _ClassVar[int]
    SIZE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    uid: str
    timeStart: _timestamp_pb2.Timestamp
    timeEnd: _timestamp_pb2.Timestamp
    status: FileDownlinkCompletionStatus
    source: str
    sourcePath: str
    destinationPath: str
    filePath: str
    missingChunks: _containers.RepeatedCompositeFieldContainer[FileDownlinkChunk]
    duplicateChunks: _containers.RepeatedCompositeFieldContainer[FileDownlinkChunk]
    size: int
    metadata: _containers.ScalarMap[str, str]
    def __init__(self, uid: _Optional[str] = ..., timeStart: _Optional[_Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]] = ..., timeEnd: _Optional[_Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]] = ..., status: _Optional[_Union[FileDownlinkCompletionStatus, str]] = ..., source: _Optional[str] = ..., sourcePath: _Optional[str] = ..., destinationPath: _Optional[str] = ..., filePath: _Optional[str] = ..., missingChunks: _Optional[_Iterable[_Union[FileDownlinkChunk, _Mapping]]] = ..., duplicateChunks: _Optional[_Iterable[_Union[FileDownlinkChunk, _Mapping]]] = ..., size: _Optional[int] = ..., metadata: _Optional[_Mapping[str, str]] = ...) -> None: ...
