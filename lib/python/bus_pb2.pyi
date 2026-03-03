import datetime

import type_pb2 as _type_pb2
from google.protobuf import timestamp_pb2 as _timestamp_pb2
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
    __slots__ = ("uid", "time_start", "time_end", "status", "source", "source_path", "destination_path", "file_path", "missing_chunks", "duplicate_chunks", "size", "metadata")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    UID_FIELD_NUMBER: _ClassVar[int]
    TIME_START_FIELD_NUMBER: _ClassVar[int]
    TIME_END_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    SOURCE_PATH_FIELD_NUMBER: _ClassVar[int]
    DESTINATION_PATH_FIELD_NUMBER: _ClassVar[int]
    FILE_PATH_FIELD_NUMBER: _ClassVar[int]
    MISSING_CHUNKS_FIELD_NUMBER: _ClassVar[int]
    DUPLICATE_CHUNKS_FIELD_NUMBER: _ClassVar[int]
    SIZE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    uid: str
    time_start: _timestamp_pb2.Timestamp
    time_end: _timestamp_pb2.Timestamp
    status: FileDownlinkCompletionStatus
    source: str
    source_path: str
    destination_path: str
    file_path: str
    missing_chunks: _containers.RepeatedCompositeFieldContainer[FileDownlinkChunk]
    duplicate_chunks: _containers.RepeatedCompositeFieldContainer[FileDownlinkChunk]
    size: int
    metadata: _containers.ScalarMap[str, str]
    def __init__(self, uid: _Optional[str] = ..., time_start: _Optional[_Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]] = ..., time_end: _Optional[_Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]] = ..., status: _Optional[_Union[FileDownlinkCompletionStatus, str]] = ..., source: _Optional[str] = ..., source_path: _Optional[str] = ..., destination_path: _Optional[str] = ..., file_path: _Optional[str] = ..., missing_chunks: _Optional[_Iterable[_Union[FileDownlinkChunk, _Mapping]]] = ..., duplicate_chunks: _Optional[_Iterable[_Union[FileDownlinkChunk, _Mapping]]] = ..., size: _Optional[int] = ..., metadata: _Optional[_Mapping[str, str]] = ...) -> None: ...

class FileUplink(_message.Message):
    __slots__ = ("uid", "time_start", "time_end", "fsw_id", "source_path", "destination_path", "error", "size", "metadata")
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    UID_FIELD_NUMBER: _ClassVar[int]
    TIME_START_FIELD_NUMBER: _ClassVar[int]
    TIME_END_FIELD_NUMBER: _ClassVar[int]
    FSW_ID_FIELD_NUMBER: _ClassVar[int]
    SOURCE_PATH_FIELD_NUMBER: _ClassVar[int]
    DESTINATION_PATH_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    SIZE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    uid: str
    time_start: _timestamp_pb2.Timestamp
    time_end: _timestamp_pb2.Timestamp
    fsw_id: str
    source_path: str
    destination_path: str
    error: str
    size: int
    metadata: _containers.ScalarMap[str, str]
    def __init__(self, uid: _Optional[str] = ..., time_start: _Optional[_Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]] = ..., time_end: _Optional[_Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]] = ..., fsw_id: _Optional[str] = ..., source_path: _Optional[str] = ..., destination_path: _Optional[str] = ..., error: _Optional[str] = ..., size: _Optional[int] = ..., metadata: _Optional[_Mapping[str, str]] = ...) -> None: ...

class FileTransfer(_message.Message):
    __slots__ = ("uid", "fsw_id", "source_path", "target_path", "size", "progress")
    UID_FIELD_NUMBER: _ClassVar[int]
    FSW_ID_FIELD_NUMBER: _ClassVar[int]
    SOURCE_PATH_FIELD_NUMBER: _ClassVar[int]
    TARGET_PATH_FIELD_NUMBER: _ClassVar[int]
    SIZE_FIELD_NUMBER: _ClassVar[int]
    PROGRESS_FIELD_NUMBER: _ClassVar[int]
    uid: str
    fsw_id: str
    source_path: str
    target_path: str
    size: int
    progress: int
    def __init__(self, uid: _Optional[str] = ..., fsw_id: _Optional[str] = ..., source_path: _Optional[str] = ..., target_path: _Optional[str] = ..., size: _Optional[int] = ..., progress: _Optional[int] = ...) -> None: ...

class FileTransferState(_message.Message):
    __slots__ = ("downlink_completed", "uplink_completed", "downlink_in_progress", "uplink_in_progress")
    DOWNLINK_COMPLETED_FIELD_NUMBER: _ClassVar[int]
    UPLINK_COMPLETED_FIELD_NUMBER: _ClassVar[int]
    DOWNLINK_IN_PROGRESS_FIELD_NUMBER: _ClassVar[int]
    UPLINK_IN_PROGRESS_FIELD_NUMBER: _ClassVar[int]
    downlink_completed: _containers.RepeatedCompositeFieldContainer[FileDownlink]
    uplink_completed: _containers.RepeatedCompositeFieldContainer[FileUplink]
    downlink_in_progress: _containers.RepeatedCompositeFieldContainer[FileTransfer]
    uplink_in_progress: _containers.RepeatedCompositeFieldContainer[FileTransfer]
    def __init__(self, downlink_completed: _Optional[_Iterable[_Union[FileDownlink, _Mapping]]] = ..., uplink_completed: _Optional[_Iterable[_Union[FileUplink, _Mapping]]] = ..., downlink_in_progress: _Optional[_Iterable[_Union[FileTransfer, _Mapping]]] = ..., uplink_in_progress: _Optional[_Iterable[_Union[FileTransfer, _Mapping]]] = ...) -> None: ...
