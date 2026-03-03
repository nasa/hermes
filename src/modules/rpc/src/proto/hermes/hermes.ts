import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ApiClient as _ApiClient, ApiDefinition as _ApiDefinition } from './Api';
import type { ProviderClient as _ProviderClient, ProviderDefinition as _ProviderDefinition } from './Provider';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Api: SubtypeConstructor<typeof grpc.Client, _ApiClient> & { service: _ApiDefinition }
  ArrayType: MessageTypeDefinition
  ArrayValue: MessageTypeDefinition
  BooleanType: MessageTypeDefinition
  BoundedArraySize: MessageTypeDefinition
  BusFilter: MessageTypeDefinition
  BytesType: MessageTypeDefinition
  BytesValue: MessageTypeDefinition
  CommandDef: MessageTypeDefinition
  CommandOptions: MessageTypeDefinition
  CommandSequence: MessageTypeDefinition
  CommandValue: MessageTypeDefinition
  Dictionary: MessageTypeDefinition
  DictionaryHead: MessageTypeDefinition
  DictionaryList: MessageTypeDefinition
  DictionaryNamespace: MessageTypeDefinition
  DownlinkFileChunk: MessageTypeDefinition
  DownlinkFileData: MessageTypeDefinition
  DownlinkFileMetadata: MessageTypeDefinition
  DownlinkFileValidation: MessageTypeDefinition
  EnumItem: MessageTypeDefinition
  EnumType: MessageTypeDefinition
  EnumValue: MessageTypeDefinition
  Event: MessageTypeDefinition
  EventDef: MessageTypeDefinition
  EventRef: MessageTypeDefinition
  EvrSeverity: EnumTypeDefinition
  Field: MessageTypeDefinition
  FileDownlink: MessageTypeDefinition
  FileDownlinkChunk: MessageTypeDefinition
  FileDownlinkCompletionStatus: EnumTypeDefinition
  FileHeader: MessageTypeDefinition
  FileTransfer: MessageTypeDefinition
  FileTransferState: MessageTypeDefinition
  FileUplink: MessageTypeDefinition
  FloatKind: EnumTypeDefinition
  FloatType: MessageTypeDefinition
  Fsw: MessageTypeDefinition
  FswCapability: EnumTypeDefinition
  FswConnectionPacket: MessageTypeDefinition
  FswInitialPacket: MessageTypeDefinition
  FswList: MessageTypeDefinition
  Id: MessageTypeDefinition
  IntKind: EnumTypeDefinition
  IntType: MessageTypeDefinition
  NumberKind: EnumTypeDefinition
  ObjectType: MessageTypeDefinition
  ObjectValue: MessageTypeDefinition
  ParameterDef: MessageTypeDefinition
  Profile: MessageTypeDefinition
  ProfileList: MessageTypeDefinition
  ProfileProvider: MessageTypeDefinition
  ProfileProviderList: MessageTypeDefinition
  ProfileState: EnumTypeDefinition
  ProfileUpdate: MessageTypeDefinition
  Provider: SubtypeConstructor<typeof grpc.Client, _ProviderClient> & { service: _ProviderDefinition }
  RawCommandSequence: MessageTypeDefinition
  RawCommandValue: MessageTypeDefinition
  ReferenceKind: EnumTypeDefinition
  ReferenceType: MessageTypeDefinition
  Reply: MessageTypeDefinition
  RequestReply: MessageTypeDefinition
  RequestValue: MessageTypeDefinition
  SIntKind: EnumTypeDefinition
  SequenceReply: MessageTypeDefinition
  SourceContext: EnumTypeDefinition
  SourceContextFilter: EnumTypeDefinition
  SourcedEvent: MessageTypeDefinition
  SourcedTelemetry: MessageTypeDefinition
  StatefulProfile: MessageTypeDefinition
  StringType: MessageTypeDefinition
  Telemetry: MessageTypeDefinition
  TelemetryDef: MessageTypeDefinition
  TelemetryRef: MessageTypeDefinition
  Time: MessageTypeDefinition
  Type: MessageTypeDefinition
  UIntKind: EnumTypeDefinition
  Uplink: MessageTypeDefinition
  UplinkFileChunk: MessageTypeDefinition
  UplinkReply: MessageTypeDefinition
  Value: MessageTypeDefinition
  VoidType: MessageTypeDefinition
  google: {
    protobuf: {
      Empty: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
    }
  }
}

