import type_pb2 as _type_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ComparisonOperator(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    EQUAL: _ClassVar[ComparisonOperator]
    NOT_EQUAL: _ClassVar[ComparisonOperator]
    LESS_THAN: _ClassVar[ComparisonOperator]
    GREATER_THAN: _ClassVar[ComparisonOperator]
    LESS_THAN_OR_EQUAL: _ClassVar[ComparisonOperator]
    GREATER_THAN_OR_EQUAL: _ClassVar[ComparisonOperator]

class EvrSeverity(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    EVR_DIAGNOSTIC: _ClassVar[EvrSeverity]
    EVR_ACTIVITY_LOW: _ClassVar[EvrSeverity]
    EVR_ACTIVITY_HIGH: _ClassVar[EvrSeverity]
    EVR_WARNING_LOW: _ClassVar[EvrSeverity]
    EVR_WARNING_HIGH: _ClassVar[EvrSeverity]
    EVR_COMMAND: _ClassVar[EvrSeverity]
    EVR_FATAL: _ClassVar[EvrSeverity]

class FormatSpecifierType(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    FMT_DEFAULT: _ClassVar[FormatSpecifierType]
    FMT_CHAR: _ClassVar[FormatSpecifierType]
    FMT_DECIMAL: _ClassVar[FormatSpecifierType]
    FMT_HEX_LOWER: _ClassVar[FormatSpecifierType]
    FMT_HEX_UPPER: _ClassVar[FormatSpecifierType]
    FMT_OCTAL: _ClassVar[FormatSpecifierType]
    FMT_EXP_LOWER: _ClassVar[FormatSpecifierType]
    FMT_EXP_UPPER: _ClassVar[FormatSpecifierType]
    FMT_FIXED_LOWER: _ClassVar[FormatSpecifierType]
    FMT_FIXED_UPPER: _ClassVar[FormatSpecifierType]
    FMT_GENERAL_LOWER: _ClassVar[FormatSpecifierType]
    FMT_GENERAL_UPPER: _ClassVar[FormatSpecifierType]
EQUAL: ComparisonOperator
NOT_EQUAL: ComparisonOperator
LESS_THAN: ComparisonOperator
GREATER_THAN: ComparisonOperator
LESS_THAN_OR_EQUAL: ComparisonOperator
GREATER_THAN_OR_EQUAL: ComparisonOperator
EVR_DIAGNOSTIC: EvrSeverity
EVR_ACTIVITY_LOW: EvrSeverity
EVR_ACTIVITY_HIGH: EvrSeverity
EVR_WARNING_LOW: EvrSeverity
EVR_WARNING_HIGH: EvrSeverity
EVR_COMMAND: EvrSeverity
EVR_FATAL: EvrSeverity
FMT_DEFAULT: FormatSpecifierType
FMT_CHAR: FormatSpecifierType
FMT_DECIMAL: FormatSpecifierType
FMT_HEX_LOWER: FormatSpecifierType
FMT_HEX_UPPER: FormatSpecifierType
FMT_OCTAL: FormatSpecifierType
FMT_EXP_LOWER: FormatSpecifierType
FMT_EXP_UPPER: FormatSpecifierType
FMT_FIXED_LOWER: FormatSpecifierType
FMT_FIXED_UPPER: FormatSpecifierType
FMT_GENERAL_LOWER: FormatSpecifierType
FMT_GENERAL_UPPER: FormatSpecifierType

class ParameterDef(_message.Message):
    __slots__ = ("id", "component", "name", "type", "metadata")
    ID_FIELD_NUMBER: _ClassVar[int]
    COMPONENT_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    id: int
    component: str
    name: str
    type: _type_pb2.Type
    metadata: str
    def __init__(self, id: _Optional[int] = ..., component: _Optional[str] = ..., name: _Optional[str] = ..., type: _Optional[_Union[_type_pb2.Type, _Mapping]] = ..., metadata: _Optional[str] = ...) -> None: ...

class XtceDef(_message.Message):
    __slots__ = ("name", "qualified_name", "short_description", "long_description", "ancillary_data")
    class AncillaryDataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    NAME_FIELD_NUMBER: _ClassVar[int]
    QUALIFIED_NAME_FIELD_NUMBER: _ClassVar[int]
    SHORT_DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    LONG_DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    ANCILLARY_DATA_FIELD_NUMBER: _ClassVar[int]
    name: str
    qualified_name: str
    short_description: str
    long_description: str
    ancillary_data: _containers.ScalarMap[str, str]
    def __init__(self, name: _Optional[str] = ..., qualified_name: _Optional[str] = ..., short_description: _Optional[str] = ..., long_description: _Optional[str] = ..., ancillary_data: _Optional[_Mapping[str, str]] = ...) -> None: ...

class CommandDef(_message.Message):
    __slots__ = ("abstract", "arguments", "transmission_constraints")
    DEF_FIELD_NUMBER: _ClassVar[int]
    ABSTRACT_FIELD_NUMBER: _ClassVar[int]
    ARGUMENTS_FIELD_NUMBER: _ClassVar[int]
    TRANSMISSION_CONSTRAINTS_FIELD_NUMBER: _ClassVar[int]
    abstract: bool
    arguments: _containers.RepeatedCompositeFieldContainer[ArgumentDef]
    transmission_constraints: _containers.RepeatedCompositeFieldContainer[TransmissionConstraint]
    def __init__(self, abstract: bool = ..., arguments: _Optional[_Iterable[_Union[ArgumentDef, _Mapping]]] = ..., transmission_constraints: _Optional[_Iterable[_Union[TransmissionConstraint, _Mapping]]] = ..., **kwargs) -> None: ...

class ArgumentDef(_message.Message):
    __slots__ = ("type", "initial_value")
    DEF_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    INITIAL_VALUE_FIELD_NUMBER: _ClassVar[int]
    type: _type_pb2.Type
    initial_value: _type_pb2.Value
    def __init__(self, type: _Optional[_Union[_type_pb2.Type, _Mapping]] = ..., initial_value: _Optional[_Union[_type_pb2.Value, _Mapping]] = ..., **kwargs) -> None: ...

class ParameterComparison(_message.Message):
    __slots__ = ("parameter_ref", "operator", "value")
    PARAMETER_REF_FIELD_NUMBER: _ClassVar[int]
    OPERATOR_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    parameter_ref: str
    operator: ComparisonOperator
    value: _type_pb2.Value
    def __init__(self, parameter_ref: _Optional[str] = ..., operator: _Optional[_Union[ComparisonOperator, str]] = ..., value: _Optional[_Union[_type_pb2.Value, _Mapping]] = ...) -> None: ...

class TimeWindow(_message.Message):
    __slots__ = ("start_time", "end_time")
    START_TIME_FIELD_NUMBER: _ClassVar[int]
    END_TIME_FIELD_NUMBER: _ClassVar[int]
    start_time: str
    end_time: str
    def __init__(self, start_time: _Optional[str] = ..., end_time: _Optional[str] = ...) -> None: ...

class BooleanExpression(_message.Message):
    __slots__ = ("expression", "description")
    EXPRESSION_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    expression: str
    description: str
    def __init__(self, expression: _Optional[str] = ..., description: _Optional[str] = ...) -> None: ...

class TransmissionConstraint(_message.Message):
    __slots__ = ("description", "parameter_comparison", "time_window", "boolean_expression")
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    PARAMETER_COMPARISON_FIELD_NUMBER: _ClassVar[int]
    TIME_WINDOW_FIELD_NUMBER: _ClassVar[int]
    BOOLEAN_EXPRESSION_FIELD_NUMBER: _ClassVar[int]
    description: str
    parameter_comparison: ParameterComparison
    time_window: TimeWindow
    boolean_expression: BooleanExpression
    def __init__(self, description: _Optional[str] = ..., parameter_comparison: _Optional[_Union[ParameterComparison, _Mapping]] = ..., time_window: _Optional[_Union[TimeWindow, _Mapping]] = ..., boolean_expression: _Optional[_Union[BooleanExpression, _Mapping]] = ...) -> None: ...

class FormatSpecifier(_message.Message):
    __slots__ = ("type", "precision", "argument_index")
    TYPE_FIELD_NUMBER: _ClassVar[int]
    PRECISION_FIELD_NUMBER: _ClassVar[int]
    ARGUMENT_INDEX_FIELD_NUMBER: _ClassVar[int]
    type: FormatSpecifierType
    precision: int
    argument_index: int
    def __init__(self, type: _Optional[_Union[FormatSpecifierType, str]] = ..., precision: _Optional[int] = ..., argument_index: _Optional[int] = ...) -> None: ...

class FormatFragment(_message.Message):
    __slots__ = ("text", "specifier")
    TEXT_FIELD_NUMBER: _ClassVar[int]
    SPECIFIER_FIELD_NUMBER: _ClassVar[int]
    text: str
    specifier: FormatSpecifier
    def __init__(self, text: _Optional[str] = ..., specifier: _Optional[_Union[FormatSpecifier, _Mapping]] = ...) -> None: ...

class FormatString(_message.Message):
    __slots__ = ("fragments", "original")
    FRAGMENTS_FIELD_NUMBER: _ClassVar[int]
    ORIGINAL_FIELD_NUMBER: _ClassVar[int]
    fragments: _containers.RepeatedCompositeFieldContainer[FormatFragment]
    original: str
    def __init__(self, fragments: _Optional[_Iterable[_Union[FormatFragment, _Mapping]]] = ..., original: _Optional[str] = ...) -> None: ...

class EventDef(_message.Message):
    __slots__ = ("id", "component", "name", "severity", "format_string", "arguments", "metadata", "format")
    ID_FIELD_NUMBER: _ClassVar[int]
    COMPONENT_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    SEVERITY_FIELD_NUMBER: _ClassVar[int]
    FORMAT_STRING_FIELD_NUMBER: _ClassVar[int]
    ARGUMENTS_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    FORMAT_FIELD_NUMBER: _ClassVar[int]
    id: int
    component: str
    name: str
    severity: EvrSeverity
    format_string: str
    arguments: _containers.RepeatedCompositeFieldContainer[_type_pb2.Field]
    metadata: str
    format: FormatString
    def __init__(self, id: _Optional[int] = ..., component: _Optional[str] = ..., name: _Optional[str] = ..., severity: _Optional[_Union[EvrSeverity, str]] = ..., format_string: _Optional[str] = ..., arguments: _Optional[_Iterable[_Union[_type_pb2.Field, _Mapping]]] = ..., metadata: _Optional[str] = ..., format: _Optional[_Union[FormatString, _Mapping]] = ...) -> None: ...

class EventRef(_message.Message):
    __slots__ = ("id", "name", "component", "severity", "arguments", "dictionary")
    ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    COMPONENT_FIELD_NUMBER: _ClassVar[int]
    SEVERITY_FIELD_NUMBER: _ClassVar[int]
    ARGUMENTS_FIELD_NUMBER: _ClassVar[int]
    DICTIONARY_FIELD_NUMBER: _ClassVar[int]
    id: int
    name: str
    component: str
    severity: EvrSeverity
    arguments: _containers.RepeatedScalarFieldContainer[str]
    dictionary: str
    def __init__(self, id: _Optional[int] = ..., name: _Optional[str] = ..., component: _Optional[str] = ..., severity: _Optional[_Union[EvrSeverity, str]] = ..., arguments: _Optional[_Iterable[str]] = ..., dictionary: _Optional[str] = ...) -> None: ...

class TelemetryDef(_message.Message):
    __slots__ = ("id", "name", "component", "type", "metadata")
    ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    COMPONENT_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    id: int
    name: str
    component: str
    type: _type_pb2.Type
    metadata: str
    def __init__(self, id: _Optional[int] = ..., name: _Optional[str] = ..., component: _Optional[str] = ..., type: _Optional[_Union[_type_pb2.Type, _Mapping]] = ..., metadata: _Optional[str] = ...) -> None: ...

class TelemetryRef(_message.Message):
    __slots__ = ("instance_id", "qualified_name")
    INSTANCE_ID_FIELD_NUMBER: _ClassVar[int]
    QUALIFIED_NAME_FIELD_NUMBER: _ClassVar[int]
    instance_id: str
    qualified_name: str
    def __init__(self, instance_id: _Optional[str] = ..., qualified_name: _Optional[str] = ...) -> None: ...

class DictionaryHead(_message.Message):
    __slots__ = ("type", "name", "version")
    TYPE_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    type: str
    name: str
    version: str
    def __init__(self, type: _Optional[str] = ..., name: _Optional[str] = ..., version: _Optional[str] = ...) -> None: ...

class DictionaryNamespace(_message.Message):
    __slots__ = ("commands", "events", "telemetry", "parameters", "types")
    class CommandsEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: CommandDef
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[CommandDef, _Mapping]] = ...) -> None: ...
    class EventsEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: EventDef
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[EventDef, _Mapping]] = ...) -> None: ...
    class TelemetryEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: TelemetryDef
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[TelemetryDef, _Mapping]] = ...) -> None: ...
    class ParametersEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: ParameterDef
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[ParameterDef, _Mapping]] = ...) -> None: ...
    class TypesEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: _type_pb2.Type
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[_type_pb2.Type, _Mapping]] = ...) -> None: ...
    COMMANDS_FIELD_NUMBER: _ClassVar[int]
    EVENTS_FIELD_NUMBER: _ClassVar[int]
    TELEMETRY_FIELD_NUMBER: _ClassVar[int]
    PARAMETERS_FIELD_NUMBER: _ClassVar[int]
    TYPES_FIELD_NUMBER: _ClassVar[int]
    commands: _containers.MessageMap[str, CommandDef]
    events: _containers.MessageMap[str, EventDef]
    telemetry: _containers.MessageMap[str, TelemetryDef]
    parameters: _containers.MessageMap[str, ParameterDef]
    types: _containers.MessageMap[str, _type_pb2.Type]
    def __init__(self, commands: _Optional[_Mapping[str, CommandDef]] = ..., events: _Optional[_Mapping[str, EventDef]] = ..., telemetry: _Optional[_Mapping[str, TelemetryDef]] = ..., parameters: _Optional[_Mapping[str, ParameterDef]] = ..., types: _Optional[_Mapping[str, _type_pb2.Type]] = ...) -> None: ...

class Dictionary(_message.Message):
    __slots__ = ("head", "content", "metadata", "id")
    class ContentEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: DictionaryNamespace
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[DictionaryNamespace, _Mapping]] = ...) -> None: ...
    class MetadataEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    HEAD_FIELD_NUMBER: _ClassVar[int]
    CONTENT_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    head: DictionaryHead
    content: _containers.MessageMap[str, DictionaryNamespace]
    metadata: _containers.ScalarMap[str, str]
    id: str
    def __init__(self, head: _Optional[_Union[DictionaryHead, _Mapping]] = ..., content: _Optional[_Mapping[str, DictionaryNamespace]] = ..., metadata: _Optional[_Mapping[str, str]] = ..., id: _Optional[str] = ...) -> None: ...
