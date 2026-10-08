import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from './google/protobuf/DescriptorProto';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from './google/protobuf/EnumDescriptorProto';
import type { EnumOptions as _google_protobuf_EnumOptions, EnumOptions__Output as _google_protobuf_EnumOptions__Output } from './google/protobuf/EnumOptions';
import type { EnumValueDescriptorProto as _google_protobuf_EnumValueDescriptorProto, EnumValueDescriptorProto__Output as _google_protobuf_EnumValueDescriptorProto__Output } from './google/protobuf/EnumValueDescriptorProto';
import type { EnumValueOptions as _google_protobuf_EnumValueOptions, EnumValueOptions__Output as _google_protobuf_EnumValueOptions__Output } from './google/protobuf/EnumValueOptions';
import type { ExtensionRangeOptions as _google_protobuf_ExtensionRangeOptions, ExtensionRangeOptions__Output as _google_protobuf_ExtensionRangeOptions__Output } from './google/protobuf/ExtensionRangeOptions';
import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from './google/protobuf/FeatureSet';
import type { FeatureSetDefaults as _google_protobuf_FeatureSetDefaults, FeatureSetDefaults__Output as _google_protobuf_FeatureSetDefaults__Output } from './google/protobuf/FeatureSetDefaults';
import type { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from './google/protobuf/FieldDescriptorProto';
import type { FieldOptions as _google_protobuf_FieldOptions, FieldOptions__Output as _google_protobuf_FieldOptions__Output } from './google/protobuf/FieldOptions';
import type { FileDescriptorProto as _google_protobuf_FileDescriptorProto, FileDescriptorProto__Output as _google_protobuf_FileDescriptorProto__Output } from './google/protobuf/FileDescriptorProto';
import type { FileDescriptorSet as _google_protobuf_FileDescriptorSet, FileDescriptorSet__Output as _google_protobuf_FileDescriptorSet__Output } from './google/protobuf/FileDescriptorSet';
import type { FileOptions as _google_protobuf_FileOptions, FileOptions__Output as _google_protobuf_FileOptions__Output } from './google/protobuf/FileOptions';
import type { GeneratedCodeInfo as _google_protobuf_GeneratedCodeInfo, GeneratedCodeInfo__Output as _google_protobuf_GeneratedCodeInfo__Output } from './google/protobuf/GeneratedCodeInfo';
import type { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from './google/protobuf/ListValue';
import type { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from './google/protobuf/MessageOptions';
import type { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from './google/protobuf/MethodDescriptorProto';
import type { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from './google/protobuf/MethodOptions';
import type { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from './google/protobuf/OneofDescriptorProto';
import type { OneofOptions as _google_protobuf_OneofOptions, OneofOptions__Output as _google_protobuf_OneofOptions__Output } from './google/protobuf/OneofOptions';
import type { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from './google/protobuf/ServiceDescriptorProto';
import type { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from './google/protobuf/ServiceOptions';
import type { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from './google/protobuf/SourceCodeInfo';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from './google/protobuf/UninterpretedOption';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from './google/protobuf/Value';
import type { HttpBody as _yamcs_api_HttpBody, HttpBody__Output as _yamcs_api_HttpBody__Output } from './yamcs/api/HttpBody';
import type { HttpRoute as _yamcs_api_HttpRoute, HttpRoute__Output as _yamcs_api_HttpRoute__Output } from './yamcs/api/HttpRoute';
import type { WebSocketTopic as _yamcs_api_WebSocketTopic, WebSocketTopic__Output as _yamcs_api_WebSocketTopic__Output } from './yamcs/api/WebSocketTopic';
import type { AggregateValue as _yamcs_protobuf_AggregateValue, AggregateValue__Output as _yamcs_protobuf_AggregateValue__Output } from './yamcs/protobuf/AggregateValue';
import type { ArchiveRecord as _yamcs_protobuf_ArchiveRecord, ArchiveRecord__Output as _yamcs_protobuf_ArchiveRecord__Output } from './yamcs/protobuf/ArchiveRecord';
import type { CommandHistoryReplayRequest as _yamcs_protobuf_CommandHistoryReplayRequest, CommandHistoryReplayRequest__Output as _yamcs_protobuf_CommandHistoryReplayRequest__Output } from './yamcs/protobuf/CommandHistoryReplayRequest';
import type { EventReplayRequest as _yamcs_protobuf_EventReplayRequest, EventReplayRequest__Output as _yamcs_protobuf_EventReplayRequest__Output } from './yamcs/protobuf/EventReplayRequest';
import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from './yamcs/protobuf/NamedObjectId';
import type { NamedObjectList as _yamcs_protobuf_NamedObjectList, NamedObjectList__Output as _yamcs_protobuf_NamedObjectList__Output } from './yamcs/protobuf/NamedObjectList';
import type { PacketReplayRequest as _yamcs_protobuf_PacketReplayRequest, PacketReplayRequest__Output as _yamcs_protobuf_PacketReplayRequest__Output } from './yamcs/protobuf/PacketReplayRequest';
import type { ParameterReplayRequest as _yamcs_protobuf_ParameterReplayRequest, ParameterReplayRequest__Output as _yamcs_protobuf_ParameterReplayRequest__Output } from './yamcs/protobuf/ParameterReplayRequest';
import type { PpReplayRequest as _yamcs_protobuf_PpReplayRequest, PpReplayRequest__Output as _yamcs_protobuf_PpReplayRequest__Output } from './yamcs/protobuf/PpReplayRequest';
import type { ReplayRequest as _yamcs_protobuf_ReplayRequest, ReplayRequest__Output as _yamcs_protobuf_ReplayRequest__Output } from './yamcs/protobuf/ReplayRequest';
import type { ReplaySpeed as _yamcs_protobuf_ReplaySpeed, ReplaySpeed__Output as _yamcs_protobuf_ReplaySpeed__Output } from './yamcs/protobuf/ReplaySpeed';
import type { ReplayStatus as _yamcs_protobuf_ReplayStatus, ReplayStatus__Output as _yamcs_protobuf_ReplayStatus__Output } from './yamcs/protobuf/ReplayStatus';
import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from './yamcs/protobuf/Value';
import type { CommandAssignment as _yamcs_protobuf_commanding_CommandAssignment, CommandAssignment__Output as _yamcs_protobuf_commanding_CommandAssignment__Output } from './yamcs/protobuf/commanding/CommandAssignment';
import type { CommandHistoryAttribute as _yamcs_protobuf_commanding_CommandHistoryAttribute, CommandHistoryAttribute__Output as _yamcs_protobuf_commanding_CommandHistoryAttribute__Output } from './yamcs/protobuf/commanding/CommandHistoryAttribute';
import type { CommandHistoryEntry as _yamcs_protobuf_commanding_CommandHistoryEntry, CommandHistoryEntry__Output as _yamcs_protobuf_commanding_CommandHistoryEntry__Output } from './yamcs/protobuf/commanding/CommandHistoryEntry';
import type { CommandId as _yamcs_protobuf_commanding_CommandId, CommandId__Output as _yamcs_protobuf_commanding_CommandId__Output } from './yamcs/protobuf/commanding/CommandId';
import type { CommandQueueEntry as _yamcs_protobuf_commanding_CommandQueueEntry, CommandQueueEntry__Output as _yamcs_protobuf_commanding_CommandQueueEntry__Output } from './yamcs/protobuf/commanding/CommandQueueEntry';
import type { CommandQueueEvent as _yamcs_protobuf_commanding_CommandQueueEvent, CommandQueueEvent__Output as _yamcs_protobuf_commanding_CommandQueueEvent__Output } from './yamcs/protobuf/commanding/CommandQueueEvent';
import type { CommandQueueInfo as _yamcs_protobuf_commanding_CommandQueueInfo, CommandQueueInfo__Output as _yamcs_protobuf_commanding_CommandQueueInfo__Output } from './yamcs/protobuf/commanding/CommandQueueInfo';
import type { CommandQueueRequest as _yamcs_protobuf_commanding_CommandQueueRequest, CommandQueueRequest__Output as _yamcs_protobuf_commanding_CommandQueueRequest__Output } from './yamcs/protobuf/commanding/CommandQueueRequest';
import type { CommandSignificance as _yamcs_protobuf_commanding_CommandSignificance, CommandSignificance__Output as _yamcs_protobuf_commanding_CommandSignificance__Output } from './yamcs/protobuf/commanding/CommandSignificance';
import type { CommandsApiClient as _yamcs_protobuf_commanding_CommandsApiClient, CommandsApiDefinition as _yamcs_protobuf_commanding_CommandsApiDefinition } from './yamcs/protobuf/commanding/CommandsApi';
import type { ExportCommandRequest as _yamcs_protobuf_commanding_ExportCommandRequest, ExportCommandRequest__Output as _yamcs_protobuf_commanding_ExportCommandRequest__Output } from './yamcs/protobuf/commanding/ExportCommandRequest';
import type { ExportCommandsRequest as _yamcs_protobuf_commanding_ExportCommandsRequest, ExportCommandsRequest__Output as _yamcs_protobuf_commanding_ExportCommandsRequest__Output } from './yamcs/protobuf/commanding/ExportCommandsRequest';
import type { GetCommandRequest as _yamcs_protobuf_commanding_GetCommandRequest, GetCommandRequest__Output as _yamcs_protobuf_commanding_GetCommandRequest__Output } from './yamcs/protobuf/commanding/GetCommandRequest';
import type { IssueCommandRequest as _yamcs_protobuf_commanding_IssueCommandRequest, IssueCommandRequest__Output as _yamcs_protobuf_commanding_IssueCommandRequest__Output } from './yamcs/protobuf/commanding/IssueCommandRequest';
import type { IssueCommandResponse as _yamcs_protobuf_commanding_IssueCommandResponse, IssueCommandResponse__Output as _yamcs_protobuf_commanding_IssueCommandResponse__Output } from './yamcs/protobuf/commanding/IssueCommandResponse';
import type { ListCommandsRequest as _yamcs_protobuf_commanding_ListCommandsRequest, ListCommandsRequest__Output as _yamcs_protobuf_commanding_ListCommandsRequest__Output } from './yamcs/protobuf/commanding/ListCommandsRequest';
import type { ListCommandsResponse as _yamcs_protobuf_commanding_ListCommandsResponse, ListCommandsResponse__Output as _yamcs_protobuf_commanding_ListCommandsResponse__Output } from './yamcs/protobuf/commanding/ListCommandsResponse';
import type { StreamCommandsRequest as _yamcs_protobuf_commanding_StreamCommandsRequest, StreamCommandsRequest__Output as _yamcs_protobuf_commanding_StreamCommandsRequest__Output } from './yamcs/protobuf/commanding/StreamCommandsRequest';
import type { SubscribeCommandsRequest as _yamcs_protobuf_commanding_SubscribeCommandsRequest, SubscribeCommandsRequest__Output as _yamcs_protobuf_commanding_SubscribeCommandsRequest__Output } from './yamcs/protobuf/commanding/SubscribeCommandsRequest';
import type { UpdateCommandHistoryRequest as _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, UpdateCommandHistoryRequest__Output as _yamcs_protobuf_commanding_UpdateCommandHistoryRequest__Output } from './yamcs/protobuf/commanding/UpdateCommandHistoryRequest';
import type { VerifierConfig as _yamcs_protobuf_commanding_VerifierConfig, VerifierConfig__Output as _yamcs_protobuf_commanding_VerifierConfig__Output } from './yamcs/protobuf/commanding/VerifierConfig';
import type { AbsoluteTimeInfo as _yamcs_protobuf_mdb_AbsoluteTimeInfo, AbsoluteTimeInfo__Output as _yamcs_protobuf_mdb_AbsoluteTimeInfo__Output } from './yamcs/protobuf/mdb/AbsoluteTimeInfo';
import type { AlarmInfo as _yamcs_protobuf_mdb_AlarmInfo, AlarmInfo__Output as _yamcs_protobuf_mdb_AlarmInfo__Output } from './yamcs/protobuf/mdb/AlarmInfo';
import type { AlarmRange as _yamcs_protobuf_mdb_AlarmRange, AlarmRange__Output as _yamcs_protobuf_mdb_AlarmRange__Output } from './yamcs/protobuf/mdb/AlarmRange';
import type { AlgorithmInfo as _yamcs_protobuf_mdb_AlgorithmInfo, AlgorithmInfo__Output as _yamcs_protobuf_mdb_AlgorithmInfo__Output } from './yamcs/protobuf/mdb/AlgorithmInfo';
import type { AncillaryDataInfo as _yamcs_protobuf_mdb_AncillaryDataInfo, AncillaryDataInfo__Output as _yamcs_protobuf_mdb_AncillaryDataInfo__Output } from './yamcs/protobuf/mdb/AncillaryDataInfo';
import type { ArgumentAssignmentInfo as _yamcs_protobuf_mdb_ArgumentAssignmentInfo, ArgumentAssignmentInfo__Output as _yamcs_protobuf_mdb_ArgumentAssignmentInfo__Output } from './yamcs/protobuf/mdb/ArgumentAssignmentInfo';
import type { ArgumentDimensionInfo as _yamcs_protobuf_mdb_ArgumentDimensionInfo, ArgumentDimensionInfo__Output as _yamcs_protobuf_mdb_ArgumentDimensionInfo__Output } from './yamcs/protobuf/mdb/ArgumentDimensionInfo';
import type { ArgumentInfo as _yamcs_protobuf_mdb_ArgumentInfo, ArgumentInfo__Output as _yamcs_protobuf_mdb_ArgumentInfo__Output } from './yamcs/protobuf/mdb/ArgumentInfo';
import type { ArgumentMemberInfo as _yamcs_protobuf_mdb_ArgumentMemberInfo, ArgumentMemberInfo__Output as _yamcs_protobuf_mdb_ArgumentMemberInfo__Output } from './yamcs/protobuf/mdb/ArgumentMemberInfo';
import type { ArgumentTypeInfo as _yamcs_protobuf_mdb_ArgumentTypeInfo, ArgumentTypeInfo__Output as _yamcs_protobuf_mdb_ArgumentTypeInfo__Output } from './yamcs/protobuf/mdb/ArgumentTypeInfo';
import type { ArrayInfo as _yamcs_protobuf_mdb_ArrayInfo, ArrayInfo__Output as _yamcs_protobuf_mdb_ArrayInfo__Output } from './yamcs/protobuf/mdb/ArrayInfo';
import type { BatchGetParametersRequest as _yamcs_protobuf_mdb_BatchGetParametersRequest, BatchGetParametersRequest__Output as _yamcs_protobuf_mdb_BatchGetParametersRequest__Output } from './yamcs/protobuf/mdb/BatchGetParametersRequest';
import type { BatchGetParametersResponse as _yamcs_protobuf_mdb_BatchGetParametersResponse, BatchGetParametersResponse__Output as _yamcs_protobuf_mdb_BatchGetParametersResponse__Output } from './yamcs/protobuf/mdb/BatchGetParametersResponse';
import type { CalibratorInfo as _yamcs_protobuf_mdb_CalibratorInfo, CalibratorInfo__Output as _yamcs_protobuf_mdb_CalibratorInfo__Output } from './yamcs/protobuf/mdb/CalibratorInfo';
import type { CheckWindowInfo as _yamcs_protobuf_mdb_CheckWindowInfo, CheckWindowInfo__Output as _yamcs_protobuf_mdb_CheckWindowInfo__Output } from './yamcs/protobuf/mdb/CheckWindowInfo';
import type { CommandContainerInfo as _yamcs_protobuf_mdb_CommandContainerInfo, CommandContainerInfo__Output as _yamcs_protobuf_mdb_CommandContainerInfo__Output } from './yamcs/protobuf/mdb/CommandContainerInfo';
import type { CommandInfo as _yamcs_protobuf_mdb_CommandInfo, CommandInfo__Output as _yamcs_protobuf_mdb_CommandInfo__Output } from './yamcs/protobuf/mdb/CommandInfo';
import type { ComparisonInfo as _yamcs_protobuf_mdb_ComparisonInfo, ComparisonInfo__Output as _yamcs_protobuf_mdb_ComparisonInfo__Output } from './yamcs/protobuf/mdb/ComparisonInfo';
import type { ContainerInfo as _yamcs_protobuf_mdb_ContainerInfo, ContainerInfo__Output as _yamcs_protobuf_mdb_ContainerInfo__Output } from './yamcs/protobuf/mdb/ContainerInfo';
import type { ContextAlarmInfo as _yamcs_protobuf_mdb_ContextAlarmInfo, ContextAlarmInfo__Output as _yamcs_protobuf_mdb_ContextAlarmInfo__Output } from './yamcs/protobuf/mdb/ContextAlarmInfo';
import type { ContextCalibratorInfo as _yamcs_protobuf_mdb_ContextCalibratorInfo, ContextCalibratorInfo__Output as _yamcs_protobuf_mdb_ContextCalibratorInfo__Output } from './yamcs/protobuf/mdb/ContextCalibratorInfo';
import type { CreateParameterRequest as _yamcs_protobuf_mdb_CreateParameterRequest, CreateParameterRequest__Output as _yamcs_protobuf_mdb_CreateParameterRequest__Output } from './yamcs/protobuf/mdb/CreateParameterRequest';
import type { CreateParameterTypeRequest as _yamcs_protobuf_mdb_CreateParameterTypeRequest, CreateParameterTypeRequest__Output as _yamcs_protobuf_mdb_CreateParameterTypeRequest__Output } from './yamcs/protobuf/mdb/CreateParameterTypeRequest';
import type { DataEncodingInfo as _yamcs_protobuf_mdb_DataEncodingInfo, DataEncodingInfo__Output as _yamcs_protobuf_mdb_DataEncodingInfo__Output } from './yamcs/protobuf/mdb/DataEncodingInfo';
import type { EnumRange as _yamcs_protobuf_mdb_EnumRange, EnumRange__Output as _yamcs_protobuf_mdb_EnumRange__Output } from './yamcs/protobuf/mdb/EnumRange';
import type { EnumValue as _yamcs_protobuf_mdb_EnumValue, EnumValue__Output as _yamcs_protobuf_mdb_EnumValue__Output } from './yamcs/protobuf/mdb/EnumValue';
import type { EnumerationAlarm as _yamcs_protobuf_mdb_EnumerationAlarm, EnumerationAlarm__Output as _yamcs_protobuf_mdb_EnumerationAlarm__Output } from './yamcs/protobuf/mdb/EnumerationAlarm';
import type { ExportJavaMissionDatabaseRequest as _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, ExportJavaMissionDatabaseRequest__Output as _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest__Output } from './yamcs/protobuf/mdb/ExportJavaMissionDatabaseRequest';
import type { ExportXtceRequest as _yamcs_protobuf_mdb_ExportXtceRequest, ExportXtceRequest__Output as _yamcs_protobuf_mdb_ExportXtceRequest__Output } from './yamcs/protobuf/mdb/ExportXtceRequest';
import type { FixedValueInfo as _yamcs_protobuf_mdb_FixedValueInfo, FixedValueInfo__Output as _yamcs_protobuf_mdb_FixedValueInfo__Output } from './yamcs/protobuf/mdb/FixedValueInfo';
import type { GetAlgorithmRequest as _yamcs_protobuf_mdb_GetAlgorithmRequest, GetAlgorithmRequest__Output as _yamcs_protobuf_mdb_GetAlgorithmRequest__Output } from './yamcs/protobuf/mdb/GetAlgorithmRequest';
import type { GetCommandRequest as _yamcs_protobuf_mdb_GetCommandRequest, GetCommandRequest__Output as _yamcs_protobuf_mdb_GetCommandRequest__Output } from './yamcs/protobuf/mdb/GetCommandRequest';
import type { GetContainerRequest as _yamcs_protobuf_mdb_GetContainerRequest, GetContainerRequest__Output as _yamcs_protobuf_mdb_GetContainerRequest__Output } from './yamcs/protobuf/mdb/GetContainerRequest';
import type { GetMissionDatabaseRequest as _yamcs_protobuf_mdb_GetMissionDatabaseRequest, GetMissionDatabaseRequest__Output as _yamcs_protobuf_mdb_GetMissionDatabaseRequest__Output } from './yamcs/protobuf/mdb/GetMissionDatabaseRequest';
import type { GetParameterRequest as _yamcs_protobuf_mdb_GetParameterRequest, GetParameterRequest__Output as _yamcs_protobuf_mdb_GetParameterRequest__Output } from './yamcs/protobuf/mdb/GetParameterRequest';
import type { GetParameterTypeRequest as _yamcs_protobuf_mdb_GetParameterTypeRequest, GetParameterTypeRequest__Output as _yamcs_protobuf_mdb_GetParameterTypeRequest__Output } from './yamcs/protobuf/mdb/GetParameterTypeRequest';
import type { GetSpaceSystemRequest as _yamcs_protobuf_mdb_GetSpaceSystemRequest, GetSpaceSystemRequest__Output as _yamcs_protobuf_mdb_GetSpaceSystemRequest__Output } from './yamcs/protobuf/mdb/GetSpaceSystemRequest';
import type { HistoryInfo as _yamcs_protobuf_mdb_HistoryInfo, HistoryInfo__Output as _yamcs_protobuf_mdb_HistoryInfo__Output } from './yamcs/protobuf/mdb/HistoryInfo';
import type { IndirectParameterRefInfo as _yamcs_protobuf_mdb_IndirectParameterRefInfo, IndirectParameterRefInfo__Output as _yamcs_protobuf_mdb_IndirectParameterRefInfo__Output } from './yamcs/protobuf/mdb/IndirectParameterRefInfo';
import type { InputParameterInfo as _yamcs_protobuf_mdb_InputParameterInfo, InputParameterInfo__Output as _yamcs_protobuf_mdb_InputParameterInfo__Output } from './yamcs/protobuf/mdb/InputParameterInfo';
import type { JavaExpressionCalibratorInfo as _yamcs_protobuf_mdb_JavaExpressionCalibratorInfo, JavaExpressionCalibratorInfo__Output as _yamcs_protobuf_mdb_JavaExpressionCalibratorInfo__Output } from './yamcs/protobuf/mdb/JavaExpressionCalibratorInfo';
import type { ListAlgorithmsRequest as _yamcs_protobuf_mdb_ListAlgorithmsRequest, ListAlgorithmsRequest__Output as _yamcs_protobuf_mdb_ListAlgorithmsRequest__Output } from './yamcs/protobuf/mdb/ListAlgorithmsRequest';
import type { ListAlgorithmsResponse as _yamcs_protobuf_mdb_ListAlgorithmsResponse, ListAlgorithmsResponse__Output as _yamcs_protobuf_mdb_ListAlgorithmsResponse__Output } from './yamcs/protobuf/mdb/ListAlgorithmsResponse';
import type { ListCommandsRequest as _yamcs_protobuf_mdb_ListCommandsRequest, ListCommandsRequest__Output as _yamcs_protobuf_mdb_ListCommandsRequest__Output } from './yamcs/protobuf/mdb/ListCommandsRequest';
import type { ListCommandsResponse as _yamcs_protobuf_mdb_ListCommandsResponse, ListCommandsResponse__Output as _yamcs_protobuf_mdb_ListCommandsResponse__Output } from './yamcs/protobuf/mdb/ListCommandsResponse';
import type { ListContainersRequest as _yamcs_protobuf_mdb_ListContainersRequest, ListContainersRequest__Output as _yamcs_protobuf_mdb_ListContainersRequest__Output } from './yamcs/protobuf/mdb/ListContainersRequest';
import type { ListContainersResponse as _yamcs_protobuf_mdb_ListContainersResponse, ListContainersResponse__Output as _yamcs_protobuf_mdb_ListContainersResponse__Output } from './yamcs/protobuf/mdb/ListContainersResponse';
import type { ListParameterTypesRequest as _yamcs_protobuf_mdb_ListParameterTypesRequest, ListParameterTypesRequest__Output as _yamcs_protobuf_mdb_ListParameterTypesRequest__Output } from './yamcs/protobuf/mdb/ListParameterTypesRequest';
import type { ListParameterTypesResponse as _yamcs_protobuf_mdb_ListParameterTypesResponse, ListParameterTypesResponse__Output as _yamcs_protobuf_mdb_ListParameterTypesResponse__Output } from './yamcs/protobuf/mdb/ListParameterTypesResponse';
import type { ListParametersRequest as _yamcs_protobuf_mdb_ListParametersRequest, ListParametersRequest__Output as _yamcs_protobuf_mdb_ListParametersRequest__Output } from './yamcs/protobuf/mdb/ListParametersRequest';
import type { ListParametersResponse as _yamcs_protobuf_mdb_ListParametersResponse, ListParametersResponse__Output as _yamcs_protobuf_mdb_ListParametersResponse__Output } from './yamcs/protobuf/mdb/ListParametersResponse';
import type { ListSpaceSystemsRequest as _yamcs_protobuf_mdb_ListSpaceSystemsRequest, ListSpaceSystemsRequest__Output as _yamcs_protobuf_mdb_ListSpaceSystemsRequest__Output } from './yamcs/protobuf/mdb/ListSpaceSystemsRequest';
import type { ListSpaceSystemsResponse as _yamcs_protobuf_mdb_ListSpaceSystemsResponse, ListSpaceSystemsResponse__Output as _yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output } from './yamcs/protobuf/mdb/ListSpaceSystemsResponse';
import type { MathElement as _yamcs_protobuf_mdb_MathElement, MathElement__Output as _yamcs_protobuf_mdb_MathElement__Output } from './yamcs/protobuf/mdb/MathElement';
import type { MdbApiClient as _yamcs_protobuf_mdb_MdbApiClient, MdbApiDefinition as _yamcs_protobuf_mdb_MdbApiDefinition } from './yamcs/protobuf/mdb/MdbApi';
import type { MemberInfo as _yamcs_protobuf_mdb_MemberInfo, MemberInfo__Output as _yamcs_protobuf_mdb_MemberInfo__Output } from './yamcs/protobuf/mdb/MemberInfo';
import type { MissionDatabase as _yamcs_protobuf_mdb_MissionDatabase, MissionDatabase__Output as _yamcs_protobuf_mdb_MissionDatabase__Output } from './yamcs/protobuf/mdb/MissionDatabase';
import type { MissionDatabaseItem as _yamcs_protobuf_mdb_MissionDatabaseItem, MissionDatabaseItem__Output as _yamcs_protobuf_mdb_MissionDatabaseItem__Output } from './yamcs/protobuf/mdb/MissionDatabaseItem';
import type { NumberFormatTypeInfo as _yamcs_protobuf_mdb_NumberFormatTypeInfo, NumberFormatTypeInfo__Output as _yamcs_protobuf_mdb_NumberFormatTypeInfo__Output } from './yamcs/protobuf/mdb/NumberFormatTypeInfo';
import type { OutputParameterInfo as _yamcs_protobuf_mdb_OutputParameterInfo, OutputParameterInfo__Output as _yamcs_protobuf_mdb_OutputParameterInfo__Output } from './yamcs/protobuf/mdb/OutputParameterInfo';
import type { ParameterDimensionInfo as _yamcs_protobuf_mdb_ParameterDimensionInfo, ParameterDimensionInfo__Output as _yamcs_protobuf_mdb_ParameterDimensionInfo__Output } from './yamcs/protobuf/mdb/ParameterDimensionInfo';
import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from './yamcs/protobuf/mdb/ParameterInfo';
import type { ParameterTypeInfo as _yamcs_protobuf_mdb_ParameterTypeInfo, ParameterTypeInfo__Output as _yamcs_protobuf_mdb_ParameterTypeInfo__Output } from './yamcs/protobuf/mdb/ParameterTypeInfo';
import type { PolynomialCalibratorInfo as _yamcs_protobuf_mdb_PolynomialCalibratorInfo, PolynomialCalibratorInfo__Output as _yamcs_protobuf_mdb_PolynomialCalibratorInfo__Output } from './yamcs/protobuf/mdb/PolynomialCalibratorInfo';
import type { RepeatInfo as _yamcs_protobuf_mdb_RepeatInfo, RepeatInfo__Output as _yamcs_protobuf_mdb_RepeatInfo__Output } from './yamcs/protobuf/mdb/RepeatInfo';
import type { SequenceEntryInfo as _yamcs_protobuf_mdb_SequenceEntryInfo, SequenceEntryInfo__Output as _yamcs_protobuf_mdb_SequenceEntryInfo__Output } from './yamcs/protobuf/mdb/SequenceEntryInfo';
import type { SignificanceInfo as _yamcs_protobuf_mdb_SignificanceInfo, SignificanceInfo__Output as _yamcs_protobuf_mdb_SignificanceInfo__Output } from './yamcs/protobuf/mdb/SignificanceInfo';
import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from './yamcs/protobuf/mdb/SpaceSystemInfo';
import type { SplineCalibratorInfo as _yamcs_protobuf_mdb_SplineCalibratorInfo, SplineCalibratorInfo__Output as _yamcs_protobuf_mdb_SplineCalibratorInfo__Output } from './yamcs/protobuf/mdb/SplineCalibratorInfo';
import type { StreamMissionDatabaseRequest as _yamcs_protobuf_mdb_StreamMissionDatabaseRequest, StreamMissionDatabaseRequest__Output as _yamcs_protobuf_mdb_StreamMissionDatabaseRequest__Output } from './yamcs/protobuf/mdb/StreamMissionDatabaseRequest';
import type { TransmissionConstraintInfo as _yamcs_protobuf_mdb_TransmissionConstraintInfo, TransmissionConstraintInfo__Output as _yamcs_protobuf_mdb_TransmissionConstraintInfo__Output } from './yamcs/protobuf/mdb/TransmissionConstraintInfo';
import type { UnitInfo as _yamcs_protobuf_mdb_UnitInfo, UnitInfo__Output as _yamcs_protobuf_mdb_UnitInfo__Output } from './yamcs/protobuf/mdb/UnitInfo';
import type { UsedByInfo as _yamcs_protobuf_mdb_UsedByInfo, UsedByInfo__Output as _yamcs_protobuf_mdb_UsedByInfo__Output } from './yamcs/protobuf/mdb/UsedByInfo';
import type { ValidRangeInfo as _yamcs_protobuf_mdb_ValidRangeInfo, ValidRangeInfo__Output as _yamcs_protobuf_mdb_ValidRangeInfo__Output } from './yamcs/protobuf/mdb/ValidRangeInfo';
import type { VerifierInfo as _yamcs_protobuf_mdb_VerifierInfo, VerifierInfo__Output as _yamcs_protobuf_mdb_VerifierInfo__Output } from './yamcs/protobuf/mdb/VerifierInfo';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      DescriptorProto: MessageTypeDefinition<_google_protobuf_DescriptorProto, _google_protobuf_DescriptorProto__Output>
      Edition: EnumTypeDefinition
      Empty: MessageTypeDefinition<_google_protobuf_Empty, _google_protobuf_Empty__Output>
      EnumDescriptorProto: MessageTypeDefinition<_google_protobuf_EnumDescriptorProto, _google_protobuf_EnumDescriptorProto__Output>
      EnumOptions: MessageTypeDefinition<_google_protobuf_EnumOptions, _google_protobuf_EnumOptions__Output>
      EnumValueDescriptorProto: MessageTypeDefinition<_google_protobuf_EnumValueDescriptorProto, _google_protobuf_EnumValueDescriptorProto__Output>
      EnumValueOptions: MessageTypeDefinition<_google_protobuf_EnumValueOptions, _google_protobuf_EnumValueOptions__Output>
      ExtensionRangeOptions: MessageTypeDefinition<_google_protobuf_ExtensionRangeOptions, _google_protobuf_ExtensionRangeOptions__Output>
      FeatureSet: MessageTypeDefinition<_google_protobuf_FeatureSet, _google_protobuf_FeatureSet__Output>
      FeatureSetDefaults: MessageTypeDefinition<_google_protobuf_FeatureSetDefaults, _google_protobuf_FeatureSetDefaults__Output>
      FieldDescriptorProto: MessageTypeDefinition<_google_protobuf_FieldDescriptorProto, _google_protobuf_FieldDescriptorProto__Output>
      FieldOptions: MessageTypeDefinition<_google_protobuf_FieldOptions, _google_protobuf_FieldOptions__Output>
      FileDescriptorProto: MessageTypeDefinition<_google_protobuf_FileDescriptorProto, _google_protobuf_FileDescriptorProto__Output>
      FileDescriptorSet: MessageTypeDefinition<_google_protobuf_FileDescriptorSet, _google_protobuf_FileDescriptorSet__Output>
      FileOptions: MessageTypeDefinition<_google_protobuf_FileOptions, _google_protobuf_FileOptions__Output>
      GeneratedCodeInfo: MessageTypeDefinition<_google_protobuf_GeneratedCodeInfo, _google_protobuf_GeneratedCodeInfo__Output>
      ListValue: MessageTypeDefinition<_google_protobuf_ListValue, _google_protobuf_ListValue__Output>
      MessageOptions: MessageTypeDefinition<_google_protobuf_MessageOptions, _google_protobuf_MessageOptions__Output>
      MethodDescriptorProto: MessageTypeDefinition<_google_protobuf_MethodDescriptorProto, _google_protobuf_MethodDescriptorProto__Output>
      MethodOptions: MessageTypeDefinition<_google_protobuf_MethodOptions, _google_protobuf_MethodOptions__Output>
      NullValue: EnumTypeDefinition
      OneofDescriptorProto: MessageTypeDefinition<_google_protobuf_OneofDescriptorProto, _google_protobuf_OneofDescriptorProto__Output>
      OneofOptions: MessageTypeDefinition<_google_protobuf_OneofOptions, _google_protobuf_OneofOptions__Output>
      ServiceDescriptorProto: MessageTypeDefinition<_google_protobuf_ServiceDescriptorProto, _google_protobuf_ServiceDescriptorProto__Output>
      ServiceOptions: MessageTypeDefinition<_google_protobuf_ServiceOptions, _google_protobuf_ServiceOptions__Output>
      SourceCodeInfo: MessageTypeDefinition<_google_protobuf_SourceCodeInfo, _google_protobuf_SourceCodeInfo__Output>
      Struct: MessageTypeDefinition<_google_protobuf_Struct, _google_protobuf_Struct__Output>
      SymbolVisibility: EnumTypeDefinition
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
      UninterpretedOption: MessageTypeDefinition<_google_protobuf_UninterpretedOption, _google_protobuf_UninterpretedOption__Output>
      Value: MessageTypeDefinition<_google_protobuf_Value, _google_protobuf_Value__Output>
    }
  }
  yamcs: {
    api: {
      FieldBehavior: EnumTypeDefinition
      HttpBody: MessageTypeDefinition<_yamcs_api_HttpBody, _yamcs_api_HttpBody__Output>
      HttpRoute: MessageTypeDefinition<_yamcs_api_HttpRoute, _yamcs_api_HttpRoute__Output>
      WebSocketTopic: MessageTypeDefinition<_yamcs_api_WebSocketTopic, _yamcs_api_WebSocketTopic__Output>
    }
    protobuf: {
      AggregateValue: MessageTypeDefinition<_yamcs_protobuf_AggregateValue, _yamcs_protobuf_AggregateValue__Output>
      ArchiveRecord: MessageTypeDefinition<_yamcs_protobuf_ArchiveRecord, _yamcs_protobuf_ArchiveRecord__Output>
      CommandHistoryReplayRequest: MessageTypeDefinition<_yamcs_protobuf_CommandHistoryReplayRequest, _yamcs_protobuf_CommandHistoryReplayRequest__Output>
      EndAction: EnumTypeDefinition
      EventReplayRequest: MessageTypeDefinition<_yamcs_protobuf_EventReplayRequest, _yamcs_protobuf_EventReplayRequest__Output>
      NamedObjectId: MessageTypeDefinition<_yamcs_protobuf_NamedObjectId, _yamcs_protobuf_NamedObjectId__Output>
      NamedObjectList: MessageTypeDefinition<_yamcs_protobuf_NamedObjectList, _yamcs_protobuf_NamedObjectList__Output>
      PacketReplayRequest: MessageTypeDefinition<_yamcs_protobuf_PacketReplayRequest, _yamcs_protobuf_PacketReplayRequest__Output>
      ParameterReplayRequest: MessageTypeDefinition<_yamcs_protobuf_ParameterReplayRequest, _yamcs_protobuf_ParameterReplayRequest__Output>
      PpReplayRequest: MessageTypeDefinition<_yamcs_protobuf_PpReplayRequest, _yamcs_protobuf_PpReplayRequest__Output>
      ReplayRequest: MessageTypeDefinition<_yamcs_protobuf_ReplayRequest, _yamcs_protobuf_ReplayRequest__Output>
      ReplaySpeed: MessageTypeDefinition<_yamcs_protobuf_ReplaySpeed, _yamcs_protobuf_ReplaySpeed__Output>
      ReplayStatus: MessageTypeDefinition<_yamcs_protobuf_ReplayStatus, _yamcs_protobuf_ReplayStatus__Output>
      Value: MessageTypeDefinition<_yamcs_protobuf_Value, _yamcs_protobuf_Value__Output>
      commanding: {
        CommandAssignment: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandAssignment, _yamcs_protobuf_commanding_CommandAssignment__Output>
        CommandHistoryAttribute: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandHistoryAttribute, _yamcs_protobuf_commanding_CommandHistoryAttribute__Output>
        CommandHistoryEntry: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandHistoryEntry, _yamcs_protobuf_commanding_CommandHistoryEntry__Output>
        CommandId: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandId, _yamcs_protobuf_commanding_CommandId__Output>
        CommandQueueEntry: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandQueueEntry, _yamcs_protobuf_commanding_CommandQueueEntry__Output>
        CommandQueueEvent: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandQueueEvent, _yamcs_protobuf_commanding_CommandQueueEvent__Output>
        CommandQueueInfo: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandQueueInfo, _yamcs_protobuf_commanding_CommandQueueInfo__Output>
        CommandQueueRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandQueueRequest, _yamcs_protobuf_commanding_CommandQueueRequest__Output>
        CommandSignificance: MessageTypeDefinition<_yamcs_protobuf_commanding_CommandSignificance, _yamcs_protobuf_commanding_CommandSignificance__Output>
        CommandsApi: SubtypeConstructor<typeof grpc.Client, _yamcs_protobuf_commanding_CommandsApiClient> & { service: _yamcs_protobuf_commanding_CommandsApiDefinition }
        ExportCommandRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_ExportCommandRequest, _yamcs_protobuf_commanding_ExportCommandRequest__Output>
        ExportCommandsRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_ExportCommandsRequest, _yamcs_protobuf_commanding_ExportCommandsRequest__Output>
        GetCommandRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_GetCommandRequest, _yamcs_protobuf_commanding_GetCommandRequest__Output>
        IssueCommandRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_IssueCommandRequest, _yamcs_protobuf_commanding_IssueCommandRequest__Output>
        IssueCommandResponse: MessageTypeDefinition<_yamcs_protobuf_commanding_IssueCommandResponse, _yamcs_protobuf_commanding_IssueCommandResponse__Output>
        ListCommandsRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_ListCommandsRequest, _yamcs_protobuf_commanding_ListCommandsRequest__Output>
        ListCommandsResponse: MessageTypeDefinition<_yamcs_protobuf_commanding_ListCommandsResponse, _yamcs_protobuf_commanding_ListCommandsResponse__Output>
        QueueState: EnumTypeDefinition
        StreamCommandsRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_StreamCommandsRequest, _yamcs_protobuf_commanding_StreamCommandsRequest__Output>
        SubscribeCommandsRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_SubscribeCommandsRequest, _yamcs_protobuf_commanding_SubscribeCommandsRequest__Output>
        UpdateCommandHistoryRequest: MessageTypeDefinition<_yamcs_protobuf_commanding_UpdateCommandHistoryRequest, _yamcs_protobuf_commanding_UpdateCommandHistoryRequest__Output>
        VerifierConfig: MessageTypeDefinition<_yamcs_protobuf_commanding_VerifierConfig, _yamcs_protobuf_commanding_VerifierConfig__Output>
      }
      mdb: {
        AbsoluteTimeInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_AbsoluteTimeInfo, _yamcs_protobuf_mdb_AbsoluteTimeInfo__Output>
        AlarmInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_AlarmInfo, _yamcs_protobuf_mdb_AlarmInfo__Output>
        AlarmLevelType: EnumTypeDefinition
        AlarmRange: MessageTypeDefinition<_yamcs_protobuf_mdb_AlarmRange, _yamcs_protobuf_mdb_AlarmRange__Output>
        AlgorithmInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_AlgorithmInfo, _yamcs_protobuf_mdb_AlgorithmInfo__Output>
        AncillaryDataInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_AncillaryDataInfo, _yamcs_protobuf_mdb_AncillaryDataInfo__Output>
        ArgumentAssignmentInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ArgumentAssignmentInfo, _yamcs_protobuf_mdb_ArgumentAssignmentInfo__Output>
        ArgumentDimensionInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ArgumentDimensionInfo, _yamcs_protobuf_mdb_ArgumentDimensionInfo__Output>
        ArgumentInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ArgumentInfo, _yamcs_protobuf_mdb_ArgumentInfo__Output>
        ArgumentMemberInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ArgumentMemberInfo, _yamcs_protobuf_mdb_ArgumentMemberInfo__Output>
        ArgumentTypeInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ArgumentTypeInfo, _yamcs_protobuf_mdb_ArgumentTypeInfo__Output>
        ArrayInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ArrayInfo, _yamcs_protobuf_mdb_ArrayInfo__Output>
        BatchGetParametersRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_BatchGetParametersRequest, _yamcs_protobuf_mdb_BatchGetParametersRequest__Output>
        BatchGetParametersResponse: MessageTypeDefinition<_yamcs_protobuf_mdb_BatchGetParametersResponse, _yamcs_protobuf_mdb_BatchGetParametersResponse__Output>
        CalibratorInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_CalibratorInfo, _yamcs_protobuf_mdb_CalibratorInfo__Output>
        CheckWindowInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_CheckWindowInfo, _yamcs_protobuf_mdb_CheckWindowInfo__Output>
        CommandContainerInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_CommandContainerInfo, _yamcs_protobuf_mdb_CommandContainerInfo__Output>
        CommandInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_CommandInfo, _yamcs_protobuf_mdb_CommandInfo__Output>
        ComparisonInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ComparisonInfo, _yamcs_protobuf_mdb_ComparisonInfo__Output>
        ContainerInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ContainerInfo, _yamcs_protobuf_mdb_ContainerInfo__Output>
        ContextAlarmInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ContextAlarmInfo, _yamcs_protobuf_mdb_ContextAlarmInfo__Output>
        ContextCalibratorInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ContextCalibratorInfo, _yamcs_protobuf_mdb_ContextCalibratorInfo__Output>
        CreateParameterRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_CreateParameterRequest, _yamcs_protobuf_mdb_CreateParameterRequest__Output>
        CreateParameterTypeRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_CreateParameterTypeRequest, _yamcs_protobuf_mdb_CreateParameterTypeRequest__Output>
        DataEncodingInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_DataEncodingInfo, _yamcs_protobuf_mdb_DataEncodingInfo__Output>
        DataSourceType: EnumTypeDefinition
        EnumRange: MessageTypeDefinition<_yamcs_protobuf_mdb_EnumRange, _yamcs_protobuf_mdb_EnumRange__Output>
        EnumValue: MessageTypeDefinition<_yamcs_protobuf_mdb_EnumValue, _yamcs_protobuf_mdb_EnumValue__Output>
        EnumerationAlarm: MessageTypeDefinition<_yamcs_protobuf_mdb_EnumerationAlarm, _yamcs_protobuf_mdb_EnumerationAlarm__Output>
        ExportJavaMissionDatabaseRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest__Output>
        ExportXtceRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_ExportXtceRequest, _yamcs_protobuf_mdb_ExportXtceRequest__Output>
        FixedValueInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_FixedValueInfo, _yamcs_protobuf_mdb_FixedValueInfo__Output>
        GetAlgorithmRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_GetAlgorithmRequest, _yamcs_protobuf_mdb_GetAlgorithmRequest__Output>
        GetCommandRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_GetCommandRequest, _yamcs_protobuf_mdb_GetCommandRequest__Output>
        GetContainerRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_GetContainerRequest, _yamcs_protobuf_mdb_GetContainerRequest__Output>
        GetMissionDatabaseRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_GetMissionDatabaseRequest, _yamcs_protobuf_mdb_GetMissionDatabaseRequest__Output>
        GetParameterRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_GetParameterRequest, _yamcs_protobuf_mdb_GetParameterRequest__Output>
        GetParameterTypeRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_GetParameterTypeRequest, _yamcs_protobuf_mdb_GetParameterTypeRequest__Output>
        GetSpaceSystemRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_GetSpaceSystemRequest, _yamcs_protobuf_mdb_GetSpaceSystemRequest__Output>
        HistoryInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_HistoryInfo, _yamcs_protobuf_mdb_HistoryInfo__Output>
        IndirectParameterRefInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_IndirectParameterRefInfo, _yamcs_protobuf_mdb_IndirectParameterRefInfo__Output>
        InputParameterInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_InputParameterInfo, _yamcs_protobuf_mdb_InputParameterInfo__Output>
        JavaExpressionCalibratorInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_JavaExpressionCalibratorInfo, _yamcs_protobuf_mdb_JavaExpressionCalibratorInfo__Output>
        ListAlgorithmsRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_ListAlgorithmsRequest, _yamcs_protobuf_mdb_ListAlgorithmsRequest__Output>
        ListAlgorithmsResponse: MessageTypeDefinition<_yamcs_protobuf_mdb_ListAlgorithmsResponse, _yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>
        ListCommandsRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_ListCommandsRequest, _yamcs_protobuf_mdb_ListCommandsRequest__Output>
        ListCommandsResponse: MessageTypeDefinition<_yamcs_protobuf_mdb_ListCommandsResponse, _yamcs_protobuf_mdb_ListCommandsResponse__Output>
        ListContainersRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_ListContainersRequest, _yamcs_protobuf_mdb_ListContainersRequest__Output>
        ListContainersResponse: MessageTypeDefinition<_yamcs_protobuf_mdb_ListContainersResponse, _yamcs_protobuf_mdb_ListContainersResponse__Output>
        ListParameterTypesRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_ListParameterTypesRequest, _yamcs_protobuf_mdb_ListParameterTypesRequest__Output>
        ListParameterTypesResponse: MessageTypeDefinition<_yamcs_protobuf_mdb_ListParameterTypesResponse, _yamcs_protobuf_mdb_ListParameterTypesResponse__Output>
        ListParametersRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_ListParametersRequest, _yamcs_protobuf_mdb_ListParametersRequest__Output>
        ListParametersResponse: MessageTypeDefinition<_yamcs_protobuf_mdb_ListParametersResponse, _yamcs_protobuf_mdb_ListParametersResponse__Output>
        ListSpaceSystemsRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_ListSpaceSystemsRequest, _yamcs_protobuf_mdb_ListSpaceSystemsRequest__Output>
        ListSpaceSystemsResponse: MessageTypeDefinition<_yamcs_protobuf_mdb_ListSpaceSystemsResponse, _yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>
        MathElement: MessageTypeDefinition<_yamcs_protobuf_mdb_MathElement, _yamcs_protobuf_mdb_MathElement__Output>
        MdbApi: SubtypeConstructor<typeof grpc.Client, _yamcs_protobuf_mdb_MdbApiClient> & { service: _yamcs_protobuf_mdb_MdbApiDefinition }
        MemberInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_MemberInfo, _yamcs_protobuf_mdb_MemberInfo__Output>
        MissionDatabase: MessageTypeDefinition<_yamcs_protobuf_mdb_MissionDatabase, _yamcs_protobuf_mdb_MissionDatabase__Output>
        MissionDatabaseItem: MessageTypeDefinition<_yamcs_protobuf_mdb_MissionDatabaseItem, _yamcs_protobuf_mdb_MissionDatabaseItem__Output>
        NumberFormatTypeInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_NumberFormatTypeInfo, _yamcs_protobuf_mdb_NumberFormatTypeInfo__Output>
        OutputParameterInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_OutputParameterInfo, _yamcs_protobuf_mdb_OutputParameterInfo__Output>
        ParameterDimensionInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ParameterDimensionInfo, _yamcs_protobuf_mdb_ParameterDimensionInfo__Output>
        ParameterInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ParameterInfo, _yamcs_protobuf_mdb_ParameterInfo__Output>
        ParameterTypeInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ParameterTypeInfo, _yamcs_protobuf_mdb_ParameterTypeInfo__Output>
        PolynomialCalibratorInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_PolynomialCalibratorInfo, _yamcs_protobuf_mdb_PolynomialCalibratorInfo__Output>
        RepeatInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_RepeatInfo, _yamcs_protobuf_mdb_RepeatInfo__Output>
        SequenceEntryInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_SequenceEntryInfo, _yamcs_protobuf_mdb_SequenceEntryInfo__Output>
        SignificanceInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_SignificanceInfo, _yamcs_protobuf_mdb_SignificanceInfo__Output>
        SpaceSystemInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_SpaceSystemInfo, _yamcs_protobuf_mdb_SpaceSystemInfo__Output>
        SplineCalibratorInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_SplineCalibratorInfo, _yamcs_protobuf_mdb_SplineCalibratorInfo__Output>
        StreamMissionDatabaseRequest: MessageTypeDefinition<_yamcs_protobuf_mdb_StreamMissionDatabaseRequest, _yamcs_protobuf_mdb_StreamMissionDatabaseRequest__Output>
        TransmissionConstraintInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_TransmissionConstraintInfo, _yamcs_protobuf_mdb_TransmissionConstraintInfo__Output>
        UnitInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_UnitInfo, _yamcs_protobuf_mdb_UnitInfo__Output>
        UsedByInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_UsedByInfo, _yamcs_protobuf_mdb_UsedByInfo__Output>
        ValidRangeInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_ValidRangeInfo, _yamcs_protobuf_mdb_ValidRangeInfo__Output>
        VerifierInfo: MessageTypeDefinition<_yamcs_protobuf_mdb_VerifierInfo, _yamcs_protobuf_mdb_VerifierInfo__Output>
      }
    }
  }
}

