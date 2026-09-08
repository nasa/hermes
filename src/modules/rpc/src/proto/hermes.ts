import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ApiClient as _ApiClient, ApiDefinition as _ApiDefinition } from './Api';
import type { ProviderClient as _ProviderClient, ProviderDefinition as _ProviderDefinition } from './Provider';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { ArrayType as _hermes_ArrayType, ArrayType__Output as _hermes_ArrayType__Output } from './hermes/ArrayType';
import type { ArrayValue as _hermes_ArrayValue, ArrayValue__Output as _hermes_ArrayValue__Output } from './hermes/ArrayValue';
import type { BooleanType as _hermes_BooleanType, BooleanType__Output as _hermes_BooleanType__Output } from './hermes/BooleanType';
import type { BoundedArraySize as _hermes_BoundedArraySize, BoundedArraySize__Output as _hermes_BoundedArraySize__Output } from './hermes/BoundedArraySize';
import type { BusFilter as _hermes_BusFilter, BusFilter__Output as _hermes_BusFilter__Output } from './hermes/BusFilter';
import type { BytesType as _hermes_BytesType, BytesType__Output as _hermes_BytesType__Output } from './hermes/BytesType';
import type { BytesValue as _hermes_BytesValue, BytesValue__Output as _hermes_BytesValue__Output } from './hermes/BytesValue';
import type { CommandDef as _hermes_CommandDef, CommandDef__Output as _hermes_CommandDef__Output } from './hermes/CommandDef';
import type { CommandOptions as _hermes_CommandOptions, CommandOptions__Output as _hermes_CommandOptions__Output } from './hermes/CommandOptions';
import type { CommandSequence as _hermes_CommandSequence, CommandSequence__Output as _hermes_CommandSequence__Output } from './hermes/CommandSequence';
import type { CommandValue as _hermes_CommandValue, CommandValue__Output as _hermes_CommandValue__Output } from './hermes/CommandValue';
import type { Dictionary as _hermes_Dictionary, Dictionary__Output as _hermes_Dictionary__Output } from './hermes/Dictionary';
import type { DictionaryHead as _hermes_DictionaryHead, DictionaryHead__Output as _hermes_DictionaryHead__Output } from './hermes/DictionaryHead';
import type { DictionaryList as _hermes_DictionaryList, DictionaryList__Output as _hermes_DictionaryList__Output } from './hermes/DictionaryList';
import type { DictionaryNamespace as _hermes_DictionaryNamespace, DictionaryNamespace__Output as _hermes_DictionaryNamespace__Output } from './hermes/DictionaryNamespace';
import type { DownlinkFileChunk as _hermes_DownlinkFileChunk, DownlinkFileChunk__Output as _hermes_DownlinkFileChunk__Output } from './hermes/DownlinkFileChunk';
import type { DownlinkFileData as _hermes_DownlinkFileData, DownlinkFileData__Output as _hermes_DownlinkFileData__Output } from './hermes/DownlinkFileData';
import type { DownlinkFileMetadata as _hermes_DownlinkFileMetadata, DownlinkFileMetadata__Output as _hermes_DownlinkFileMetadata__Output } from './hermes/DownlinkFileMetadata';
import type { DownlinkFileValidation as _hermes_DownlinkFileValidation, DownlinkFileValidation__Output as _hermes_DownlinkFileValidation__Output } from './hermes/DownlinkFileValidation';
import type { EnumItem as _hermes_EnumItem, EnumItem__Output as _hermes_EnumItem__Output } from './hermes/EnumItem';
import type { EnumType as _hermes_EnumType, EnumType__Output as _hermes_EnumType__Output } from './hermes/EnumType';
import type { EnumValue as _hermes_EnumValue, EnumValue__Output as _hermes_EnumValue__Output } from './hermes/EnumValue';
import type { Event as _hermes_Event, Event__Output as _hermes_Event__Output } from './hermes/Event';
import type { EventDef as _hermes_EventDef, EventDef__Output as _hermes_EventDef__Output } from './hermes/EventDef';
import type { EventRef as _hermes_EventRef, EventRef__Output as _hermes_EventRef__Output } from './hermes/EventRef';
import type { Field as _hermes_Field, Field__Output as _hermes_Field__Output } from './hermes/Field';
import type { FileDownlink as _hermes_FileDownlink, FileDownlink__Output as _hermes_FileDownlink__Output } from './hermes/FileDownlink';
import type { FileDownlinkChunk as _hermes_FileDownlinkChunk, FileDownlinkChunk__Output as _hermes_FileDownlinkChunk__Output } from './hermes/FileDownlinkChunk';
import type { FileHeader as _hermes_FileHeader, FileHeader__Output as _hermes_FileHeader__Output } from './hermes/FileHeader';
import type { FileTransfer as _hermes_FileTransfer, FileTransfer__Output as _hermes_FileTransfer__Output } from './hermes/FileTransfer';
import type { FileTransferState as _hermes_FileTransferState, FileTransferState__Output as _hermes_FileTransferState__Output } from './hermes/FileTransferState';
import type { FileUplink as _hermes_FileUplink, FileUplink__Output as _hermes_FileUplink__Output } from './hermes/FileUplink';
import type { FloatType as _hermes_FloatType, FloatType__Output as _hermes_FloatType__Output } from './hermes/FloatType';
import type { FormatFragment as _hermes_FormatFragment, FormatFragment__Output as _hermes_FormatFragment__Output } from './hermes/FormatFragment';
import type { FormatSpecifier as _hermes_FormatSpecifier, FormatSpecifier__Output as _hermes_FormatSpecifier__Output } from './hermes/FormatSpecifier';
import type { FormatString as _hermes_FormatString, FormatString__Output as _hermes_FormatString__Output } from './hermes/FormatString';
import type { Fsw as _hermes_Fsw, Fsw__Output as _hermes_Fsw__Output } from './hermes/Fsw';
import type { FswConnectionPacket as _hermes_FswConnectionPacket, FswConnectionPacket__Output as _hermes_FswConnectionPacket__Output } from './hermes/FswConnectionPacket';
import type { FswInitialPacket as _hermes_FswInitialPacket, FswInitialPacket__Output as _hermes_FswInitialPacket__Output } from './hermes/FswInitialPacket';
import type { FswList as _hermes_FswList, FswList__Output as _hermes_FswList__Output } from './hermes/FswList';
import type { Id as _hermes_Id, Id__Output as _hermes_Id__Output } from './hermes/Id';
import type { IntType as _hermes_IntType, IntType__Output as _hermes_IntType__Output } from './hermes/IntType';
import type { ObjectType as _hermes_ObjectType, ObjectType__Output as _hermes_ObjectType__Output } from './hermes/ObjectType';
import type { ObjectValue as _hermes_ObjectValue, ObjectValue__Output as _hermes_ObjectValue__Output } from './hermes/ObjectValue';
import type { ParameterDef as _hermes_ParameterDef, ParameterDef__Output as _hermes_ParameterDef__Output } from './hermes/ParameterDef';
import type { Profile as _hermes_Profile, Profile__Output as _hermes_Profile__Output } from './hermes/Profile';
import type { ProfileList as _hermes_ProfileList, ProfileList__Output as _hermes_ProfileList__Output } from './hermes/ProfileList';
import type { ProfileProvider as _hermes_ProfileProvider, ProfileProvider__Output as _hermes_ProfileProvider__Output } from './hermes/ProfileProvider';
import type { ProfileProviderList as _hermes_ProfileProviderList, ProfileProviderList__Output as _hermes_ProfileProviderList__Output } from './hermes/ProfileProviderList';
import type { ProfileUpdate as _hermes_ProfileUpdate, ProfileUpdate__Output as _hermes_ProfileUpdate__Output } from './hermes/ProfileUpdate';
import type { RawCommandSequence as _hermes_RawCommandSequence, RawCommandSequence__Output as _hermes_RawCommandSequence__Output } from './hermes/RawCommandSequence';
import type { RawCommandValue as _hermes_RawCommandValue, RawCommandValue__Output as _hermes_RawCommandValue__Output } from './hermes/RawCommandValue';
import type { ReferenceType as _hermes_ReferenceType, ReferenceType__Output as _hermes_ReferenceType__Output } from './hermes/ReferenceType';
import type { Reply as _hermes_Reply, Reply__Output as _hermes_Reply__Output } from './hermes/Reply';
import type { RequestReply as _hermes_RequestReply, RequestReply__Output as _hermes_RequestReply__Output } from './hermes/RequestReply';
import type { RequestValue as _hermes_RequestValue, RequestValue__Output as _hermes_RequestValue__Output } from './hermes/RequestValue';
import type { SequenceReply as _hermes_SequenceReply, SequenceReply__Output as _hermes_SequenceReply__Output } from './hermes/SequenceReply';
import type { SourcedEvent as _hermes_SourcedEvent, SourcedEvent__Output as _hermes_SourcedEvent__Output } from './hermes/SourcedEvent';
import type { SourcedTelemetry as _hermes_SourcedTelemetry, SourcedTelemetry__Output as _hermes_SourcedTelemetry__Output } from './hermes/SourcedTelemetry';
import type { StatefulProfile as _hermes_StatefulProfile, StatefulProfile__Output as _hermes_StatefulProfile__Output } from './hermes/StatefulProfile';
import type { StringType as _hermes_StringType, StringType__Output as _hermes_StringType__Output } from './hermes/StringType';
import type { Telemetry as _hermes_Telemetry, Telemetry__Output as _hermes_Telemetry__Output } from './hermes/Telemetry';
import type { TelemetryDef as _hermes_TelemetryDef, TelemetryDef__Output as _hermes_TelemetryDef__Output } from './hermes/TelemetryDef';
import type { TelemetryRef as _hermes_TelemetryRef, TelemetryRef__Output as _hermes_TelemetryRef__Output } from './hermes/TelemetryRef';
import type { Time as _hermes_Time, Time__Output as _hermes_Time__Output } from './hermes/Time';
import type { Type as _hermes_Type, Type__Output as _hermes_Type__Output } from './hermes/Type';
import type { Uplink as _hermes_Uplink, Uplink__Output as _hermes_Uplink__Output } from './hermes/Uplink';
import type { UplinkFileChunk as _hermes_UplinkFileChunk, UplinkFileChunk__Output as _hermes_UplinkFileChunk__Output } from './hermes/UplinkFileChunk';
import type { UplinkReply as _hermes_UplinkReply, UplinkReply__Output as _hermes_UplinkReply__Output } from './hermes/UplinkReply';
import type { Value as _hermes_Value, Value__Output as _hermes_Value__Output } from './hermes/Value';
import type { VoidType as _hermes_VoidType, VoidType__Output as _hermes_VoidType__Output } from './hermes/VoidType';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Api: SubtypeConstructor<typeof grpc.Client, _ApiClient> & { service: _ApiDefinition }
  Provider: SubtypeConstructor<typeof grpc.Client, _ProviderClient> & { service: _ProviderDefinition }
  google: {
    protobuf: {
      Empty: MessageTypeDefinition<_google_protobuf_Empty, _google_protobuf_Empty__Output>
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
    }
  }
  hermes: {
    ArrayType: MessageTypeDefinition<_hermes_ArrayType, _hermes_ArrayType__Output>
    ArrayValue: MessageTypeDefinition<_hermes_ArrayValue, _hermes_ArrayValue__Output>
    BooleanType: MessageTypeDefinition<_hermes_BooleanType, _hermes_BooleanType__Output>
    BoundedArraySize: MessageTypeDefinition<_hermes_BoundedArraySize, _hermes_BoundedArraySize__Output>
    BusFilter: MessageTypeDefinition<_hermes_BusFilter, _hermes_BusFilter__Output>
    BytesType: MessageTypeDefinition<_hermes_BytesType, _hermes_BytesType__Output>
    BytesValue: MessageTypeDefinition<_hermes_BytesValue, _hermes_BytesValue__Output>
    CommandDef: MessageTypeDefinition<_hermes_CommandDef, _hermes_CommandDef__Output>
    CommandOptions: MessageTypeDefinition<_hermes_CommandOptions, _hermes_CommandOptions__Output>
    CommandSequence: MessageTypeDefinition<_hermes_CommandSequence, _hermes_CommandSequence__Output>
    CommandValue: MessageTypeDefinition<_hermes_CommandValue, _hermes_CommandValue__Output>
    Dictionary: MessageTypeDefinition<_hermes_Dictionary, _hermes_Dictionary__Output>
    DictionaryHead: MessageTypeDefinition<_hermes_DictionaryHead, _hermes_DictionaryHead__Output>
    DictionaryList: MessageTypeDefinition<_hermes_DictionaryList, _hermes_DictionaryList__Output>
    DictionaryNamespace: MessageTypeDefinition<_hermes_DictionaryNamespace, _hermes_DictionaryNamespace__Output>
    DownlinkFileChunk: MessageTypeDefinition<_hermes_DownlinkFileChunk, _hermes_DownlinkFileChunk__Output>
    DownlinkFileData: MessageTypeDefinition<_hermes_DownlinkFileData, _hermes_DownlinkFileData__Output>
    DownlinkFileMetadata: MessageTypeDefinition<_hermes_DownlinkFileMetadata, _hermes_DownlinkFileMetadata__Output>
    DownlinkFileValidation: MessageTypeDefinition<_hermes_DownlinkFileValidation, _hermes_DownlinkFileValidation__Output>
    EnumItem: MessageTypeDefinition<_hermes_EnumItem, _hermes_EnumItem__Output>
    EnumType: MessageTypeDefinition<_hermes_EnumType, _hermes_EnumType__Output>
    EnumValue: MessageTypeDefinition<_hermes_EnumValue, _hermes_EnumValue__Output>
    Event: MessageTypeDefinition<_hermes_Event, _hermes_Event__Output>
    EventDef: MessageTypeDefinition<_hermes_EventDef, _hermes_EventDef__Output>
    EventRef: MessageTypeDefinition<_hermes_EventRef, _hermes_EventRef__Output>
    EvrSeverity: EnumTypeDefinition
    Field: MessageTypeDefinition<_hermes_Field, _hermes_Field__Output>
    FileDownlink: MessageTypeDefinition<_hermes_FileDownlink, _hermes_FileDownlink__Output>
    FileDownlinkChunk: MessageTypeDefinition<_hermes_FileDownlinkChunk, _hermes_FileDownlinkChunk__Output>
    FileDownlinkCompletionStatus: EnumTypeDefinition
    FileHeader: MessageTypeDefinition<_hermes_FileHeader, _hermes_FileHeader__Output>
    FileTransfer: MessageTypeDefinition<_hermes_FileTransfer, _hermes_FileTransfer__Output>
    FileTransferState: MessageTypeDefinition<_hermes_FileTransferState, _hermes_FileTransferState__Output>
    FileUplink: MessageTypeDefinition<_hermes_FileUplink, _hermes_FileUplink__Output>
    FloatKind: EnumTypeDefinition
    FloatType: MessageTypeDefinition<_hermes_FloatType, _hermes_FloatType__Output>
    FormatFragment: MessageTypeDefinition<_hermes_FormatFragment, _hermes_FormatFragment__Output>
    FormatSpecifier: MessageTypeDefinition<_hermes_FormatSpecifier, _hermes_FormatSpecifier__Output>
    FormatSpecifierType: EnumTypeDefinition
    FormatString: MessageTypeDefinition<_hermes_FormatString, _hermes_FormatString__Output>
    Fsw: MessageTypeDefinition<_hermes_Fsw, _hermes_Fsw__Output>
    FswCapability: EnumTypeDefinition
    FswConnectionPacket: MessageTypeDefinition<_hermes_FswConnectionPacket, _hermes_FswConnectionPacket__Output>
    FswInitialPacket: MessageTypeDefinition<_hermes_FswInitialPacket, _hermes_FswInitialPacket__Output>
    FswList: MessageTypeDefinition<_hermes_FswList, _hermes_FswList__Output>
    Id: MessageTypeDefinition<_hermes_Id, _hermes_Id__Output>
    IntKind: EnumTypeDefinition
    IntType: MessageTypeDefinition<_hermes_IntType, _hermes_IntType__Output>
    NumberKind: EnumTypeDefinition
    ObjectType: MessageTypeDefinition<_hermes_ObjectType, _hermes_ObjectType__Output>
    ObjectValue: MessageTypeDefinition<_hermes_ObjectValue, _hermes_ObjectValue__Output>
    ParameterDef: MessageTypeDefinition<_hermes_ParameterDef, _hermes_ParameterDef__Output>
    Profile: MessageTypeDefinition<_hermes_Profile, _hermes_Profile__Output>
    ProfileList: MessageTypeDefinition<_hermes_ProfileList, _hermes_ProfileList__Output>
    ProfileProvider: MessageTypeDefinition<_hermes_ProfileProvider, _hermes_ProfileProvider__Output>
    ProfileProviderList: MessageTypeDefinition<_hermes_ProfileProviderList, _hermes_ProfileProviderList__Output>
    ProfileState: EnumTypeDefinition
    ProfileUpdate: MessageTypeDefinition<_hermes_ProfileUpdate, _hermes_ProfileUpdate__Output>
    RawCommandSequence: MessageTypeDefinition<_hermes_RawCommandSequence, _hermes_RawCommandSequence__Output>
    RawCommandValue: MessageTypeDefinition<_hermes_RawCommandValue, _hermes_RawCommandValue__Output>
    ReferenceKind: EnumTypeDefinition
    ReferenceType: MessageTypeDefinition<_hermes_ReferenceType, _hermes_ReferenceType__Output>
    Reply: MessageTypeDefinition<_hermes_Reply, _hermes_Reply__Output>
    RequestReply: MessageTypeDefinition<_hermes_RequestReply, _hermes_RequestReply__Output>
    RequestValue: MessageTypeDefinition<_hermes_RequestValue, _hermes_RequestValue__Output>
    SIntKind: EnumTypeDefinition
    SequenceReply: MessageTypeDefinition<_hermes_SequenceReply, _hermes_SequenceReply__Output>
    SourceContext: EnumTypeDefinition
    SourceContextFilter: EnumTypeDefinition
    SourcedEvent: MessageTypeDefinition<_hermes_SourcedEvent, _hermes_SourcedEvent__Output>
    SourcedTelemetry: MessageTypeDefinition<_hermes_SourcedTelemetry, _hermes_SourcedTelemetry__Output>
    StatefulProfile: MessageTypeDefinition<_hermes_StatefulProfile, _hermes_StatefulProfile__Output>
    StringType: MessageTypeDefinition<_hermes_StringType, _hermes_StringType__Output>
    Telemetry: MessageTypeDefinition<_hermes_Telemetry, _hermes_Telemetry__Output>
    TelemetryDef: MessageTypeDefinition<_hermes_TelemetryDef, _hermes_TelemetryDef__Output>
    TelemetryRef: MessageTypeDefinition<_hermes_TelemetryRef, _hermes_TelemetryRef__Output>
    Time: MessageTypeDefinition<_hermes_Time, _hermes_Time__Output>
    Type: MessageTypeDefinition<_hermes_Type, _hermes_Type__Output>
    UIntKind: EnumTypeDefinition
    Uplink: MessageTypeDefinition<_hermes_Uplink, _hermes_Uplink__Output>
    UplinkFileChunk: MessageTypeDefinition<_hermes_UplinkFileChunk, _hermes_UplinkFileChunk__Output>
    UplinkReply: MessageTypeDefinition<_hermes_UplinkReply, _hermes_UplinkReply__Output>
    Value: MessageTypeDefinition<_hermes_Value, _hermes_Value__Output>
    VoidType: MessageTypeDefinition<_hermes_VoidType, _hermes_VoidType__Output>
  }
}

