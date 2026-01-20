import datetime

from google.protobuf import timestamp_pb2 as _timestamp_pb2
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Time(_message.Message):
    __slots__ = ("unix", "sclk")
    UNIX_FIELD_NUMBER: _ClassVar[int]
    SCLK_FIELD_NUMBER: _ClassVar[int]
    unix: _timestamp_pb2.Timestamp
    sclk: float
    def __init__(self, unix: _Optional[_Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]] = ..., sclk: _Optional[float] = ...) -> None: ...
