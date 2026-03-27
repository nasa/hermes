// Original file: proto/grpc/hermes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BusFilter as _hermes_BusFilter, BusFilter__Output as _hermes_BusFilter__Output } from './hermes/BusFilter';
import type { CommandSequence as _hermes_CommandSequence, CommandSequence__Output as _hermes_CommandSequence__Output } from './hermes/CommandSequence';
import type { CommandValue as _hermes_CommandValue, CommandValue__Output as _hermes_CommandValue__Output } from './hermes/CommandValue';
import type { Dictionary as _hermes_Dictionary, Dictionary__Output as _hermes_Dictionary__Output } from './hermes/Dictionary';
import type { DictionaryList as _hermes_DictionaryList, DictionaryList__Output as _hermes_DictionaryList__Output } from './hermes/DictionaryList';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { FileDownlink as _hermes_FileDownlink, FileDownlink__Output as _hermes_FileDownlink__Output } from './hermes/FileDownlink';
import type { FileTransferState as _hermes_FileTransferState, FileTransferState__Output as _hermes_FileTransferState__Output } from './hermes/FileTransferState';
import type { FileUplink as _hermes_FileUplink, FileUplink__Output as _hermes_FileUplink__Output } from './hermes/FileUplink';
import type { Fsw as _hermes_Fsw, Fsw__Output as _hermes_Fsw__Output } from './hermes/Fsw';
import type { FswList as _hermes_FswList, FswList__Output as _hermes_FswList__Output } from './hermes/FswList';
import type { Id as _hermes_Id, Id__Output as _hermes_Id__Output } from './hermes/Id';
import type { Profile as _hermes_Profile, Profile__Output as _hermes_Profile__Output } from './hermes/Profile';
import type { ProfileList as _hermes_ProfileList, ProfileList__Output as _hermes_ProfileList__Output } from './hermes/ProfileList';
import type { ProfileProviderList as _hermes_ProfileProviderList, ProfileProviderList__Output as _hermes_ProfileProviderList__Output } from './hermes/ProfileProviderList';
import type { ProfileUpdate as _hermes_ProfileUpdate, ProfileUpdate__Output as _hermes_ProfileUpdate__Output } from './hermes/ProfileUpdate';
import type { RawCommandSequence as _hermes_RawCommandSequence, RawCommandSequence__Output as _hermes_RawCommandSequence__Output } from './hermes/RawCommandSequence';
import type { RawCommandValue as _hermes_RawCommandValue, RawCommandValue__Output as _hermes_RawCommandValue__Output } from './hermes/RawCommandValue';
import type { Reply as _hermes_Reply, Reply__Output as _hermes_Reply__Output } from './hermes/Reply';
import type { RequestReply as _hermes_RequestReply, RequestReply__Output as _hermes_RequestReply__Output } from './hermes/RequestReply';
import type { RequestValue as _hermes_RequestValue, RequestValue__Output as _hermes_RequestValue__Output } from './hermes/RequestValue';
import type { SequenceReply as _hermes_SequenceReply, SequenceReply__Output as _hermes_SequenceReply__Output } from './hermes/SequenceReply';
import type { SourcedEvent as _hermes_SourcedEvent, SourcedEvent__Output as _hermes_SourcedEvent__Output } from './hermes/SourcedEvent';
import type { SourcedTelemetry as _hermes_SourcedTelemetry, SourcedTelemetry__Output as _hermes_SourcedTelemetry__Output } from './hermes/SourcedTelemetry';
import type { UplinkFileChunk as _hermes_UplinkFileChunk, UplinkFileChunk__Output as _hermes_UplinkFileChunk__Output } from './hermes/UplinkFileChunk';

export interface ApiClient extends grpc.Client {
  AddDictionary(argument: _hermes_Dictionary, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  AddDictionary(argument: _hermes_Dictionary, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  AddDictionary(argument: _hermes_Dictionary, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  AddDictionary(argument: _hermes_Dictionary, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  addDictionary(argument: _hermes_Dictionary, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  addDictionary(argument: _hermes_Dictionary, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  addDictionary(argument: _hermes_Dictionary, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  addDictionary(argument: _hermes_Dictionary, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  
  AddProfile(argument: _hermes_Profile, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  AddProfile(argument: _hermes_Profile, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  AddProfile(argument: _hermes_Profile, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  AddProfile(argument: _hermes_Profile, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  addProfile(argument: _hermes_Profile, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  addProfile(argument: _hermes_Profile, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  addProfile(argument: _hermes_Profile, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  addProfile(argument: _hermes_Profile, callback: grpc.requestCallback<_hermes_Id__Output>): grpc.ClientUnaryCall;
  
  AllDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_DictionaryList__Output>): grpc.ClientUnaryCall;
  AllDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_DictionaryList__Output>): grpc.ClientUnaryCall;
  AllDictionary(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_DictionaryList__Output>): grpc.ClientUnaryCall;
  AllDictionary(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_DictionaryList__Output>): grpc.ClientUnaryCall;
  allDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_DictionaryList__Output>): grpc.ClientUnaryCall;
  allDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_DictionaryList__Output>): grpc.ClientUnaryCall;
  allDictionary(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_DictionaryList__Output>): grpc.ClientUnaryCall;
  allDictionary(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_DictionaryList__Output>): grpc.ClientUnaryCall;
  
  AllFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_FswList__Output>): grpc.ClientUnaryCall;
  AllFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_FswList__Output>): grpc.ClientUnaryCall;
  AllFsw(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_FswList__Output>): grpc.ClientUnaryCall;
  AllFsw(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_FswList__Output>): grpc.ClientUnaryCall;
  allFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_FswList__Output>): grpc.ClientUnaryCall;
  allFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_FswList__Output>): grpc.ClientUnaryCall;
  allFsw(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_FswList__Output>): grpc.ClientUnaryCall;
  allFsw(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_FswList__Output>): grpc.ClientUnaryCall;
  
  AllProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_ProfileList__Output>): grpc.ClientUnaryCall;
  AllProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_ProfileList__Output>): grpc.ClientUnaryCall;
  AllProfiles(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_ProfileList__Output>): grpc.ClientUnaryCall;
  AllProfiles(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_ProfileList__Output>): grpc.ClientUnaryCall;
  allProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_ProfileList__Output>): grpc.ClientUnaryCall;
  allProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_ProfileList__Output>): grpc.ClientUnaryCall;
  allProfiles(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_ProfileList__Output>): grpc.ClientUnaryCall;
  allProfiles(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_ProfileList__Output>): grpc.ClientUnaryCall;
  
  AllProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  AllProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  AllProviders(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  AllProviders(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  allProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  allProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  allProviders(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  allProviders(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  
  ClearDownlinkTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ClearDownlinkTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ClearDownlinkTransferState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ClearDownlinkTransferState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  clearDownlinkTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  clearDownlinkTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  clearDownlinkTransferState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  clearDownlinkTransferState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  ClearUplinkTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ClearUplinkTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ClearUplinkTransferState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ClearUplinkTransferState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  clearUplinkTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  clearUplinkTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  clearUplinkTransferState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  clearUplinkTransferState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  Command(argument: _hermes_CommandValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  Command(argument: _hermes_CommandValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  Command(argument: _hermes_CommandValue, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  Command(argument: _hermes_CommandValue, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  command(argument: _hermes_CommandValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  command(argument: _hermes_CommandValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  command(argument: _hermes_CommandValue, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  command(argument: _hermes_CommandValue, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  
  GetDictionary(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Dictionary__Output>): grpc.ClientUnaryCall;
  GetDictionary(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Dictionary__Output>): grpc.ClientUnaryCall;
  GetDictionary(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Dictionary__Output>): grpc.ClientUnaryCall;
  GetDictionary(argument: _hermes_Id, callback: grpc.requestCallback<_hermes_Dictionary__Output>): grpc.ClientUnaryCall;
  getDictionary(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Dictionary__Output>): grpc.ClientUnaryCall;
  getDictionary(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Dictionary__Output>): grpc.ClientUnaryCall;
  getDictionary(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Dictionary__Output>): grpc.ClientUnaryCall;
  getDictionary(argument: _hermes_Id, callback: grpc.requestCallback<_hermes_Dictionary__Output>): grpc.ClientUnaryCall;
  
  GetFileTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_FileTransferState__Output>): grpc.ClientUnaryCall;
  GetFileTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_FileTransferState__Output>): grpc.ClientUnaryCall;
  GetFileTransferState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_FileTransferState__Output>): grpc.ClientUnaryCall;
  GetFileTransferState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_FileTransferState__Output>): grpc.ClientUnaryCall;
  getFileTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_FileTransferState__Output>): grpc.ClientUnaryCall;
  getFileTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_FileTransferState__Output>): grpc.ClientUnaryCall;
  getFileTransferState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_FileTransferState__Output>): grpc.ClientUnaryCall;
  getFileTransferState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_hermes_FileTransferState__Output>): grpc.ClientUnaryCall;
  
  GetFsw(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Fsw__Output>): grpc.ClientUnaryCall;
  GetFsw(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Fsw__Output>): grpc.ClientUnaryCall;
  GetFsw(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Fsw__Output>): grpc.ClientUnaryCall;
  GetFsw(argument: _hermes_Id, callback: grpc.requestCallback<_hermes_Fsw__Output>): grpc.ClientUnaryCall;
  getFsw(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Fsw__Output>): grpc.ClientUnaryCall;
  getFsw(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Fsw__Output>): grpc.ClientUnaryCall;
  getFsw(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Fsw__Output>): grpc.ClientUnaryCall;
  getFsw(argument: _hermes_Id, callback: grpc.requestCallback<_hermes_Fsw__Output>): grpc.ClientUnaryCall;
  
  RawCommand(argument: _hermes_RawCommandValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  RawCommand(argument: _hermes_RawCommandValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  RawCommand(argument: _hermes_RawCommandValue, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  RawCommand(argument: _hermes_RawCommandValue, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  rawCommand(argument: _hermes_RawCommandValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  rawCommand(argument: _hermes_RawCommandValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  rawCommand(argument: _hermes_RawCommandValue, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  rawCommand(argument: _hermes_RawCommandValue, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientUnaryCall;
  
  RawSequence(argument: _hermes_RawCommandSequence, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  RawSequence(argument: _hermes_RawCommandSequence, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  RawSequence(argument: _hermes_RawCommandSequence, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  RawSequence(argument: _hermes_RawCommandSequence, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  rawSequence(argument: _hermes_RawCommandSequence, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  rawSequence(argument: _hermes_RawCommandSequence, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  rawSequence(argument: _hermes_RawCommandSequence, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  rawSequence(argument: _hermes_RawCommandSequence, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  
  RemoveDictionary(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveDictionary(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveDictionary(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveDictionary(argument: _hermes_Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeDictionary(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeDictionary(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeDictionary(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeDictionary(argument: _hermes_Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  RemoveProfile(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveProfile(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveProfile(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveProfile(argument: _hermes_Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeProfile(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeProfile(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeProfile(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeProfile(argument: _hermes_Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  Request(argument: _hermes_RequestValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_RequestReply__Output>): grpc.ClientUnaryCall;
  Request(argument: _hermes_RequestValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_RequestReply__Output>): grpc.ClientUnaryCall;
  Request(argument: _hermes_RequestValue, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_RequestReply__Output>): grpc.ClientUnaryCall;
  Request(argument: _hermes_RequestValue, callback: grpc.requestCallback<_hermes_RequestReply__Output>): grpc.ClientUnaryCall;
  request(argument: _hermes_RequestValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_RequestReply__Output>): grpc.ClientUnaryCall;
  request(argument: _hermes_RequestValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_RequestReply__Output>): grpc.ClientUnaryCall;
  request(argument: _hermes_RequestValue, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_RequestReply__Output>): grpc.ClientUnaryCall;
  request(argument: _hermes_RequestValue, callback: grpc.requestCallback<_hermes_RequestReply__Output>): grpc.ClientUnaryCall;
  
  Sequence(argument: _hermes_CommandSequence, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  Sequence(argument: _hermes_CommandSequence, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  Sequence(argument: _hermes_CommandSequence, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  Sequence(argument: _hermes_CommandSequence, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  sequence(argument: _hermes_CommandSequence, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  sequence(argument: _hermes_CommandSequence, metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  sequence(argument: _hermes_CommandSequence, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  sequence(argument: _hermes_CommandSequence, callback: grpc.requestCallback<_hermes_SequenceReply__Output>): grpc.ClientUnaryCall;
  
  StartProfile(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StartProfile(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StartProfile(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StartProfile(argument: _hermes_Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  startProfile(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  startProfile(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  startProfile(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  startProfile(argument: _hermes_Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  StopProfile(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StopProfile(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StopProfile(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StopProfile(argument: _hermes_Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  stopProfile(argument: _hermes_Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  stopProfile(argument: _hermes_Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  stopProfile(argument: _hermes_Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  stopProfile(argument: _hermes_Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  SubEvent(argument: _hermes_BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_SourcedEvent__Output>;
  SubEvent(argument: _hermes_BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_SourcedEvent__Output>;
  subEvent(argument: _hermes_BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_SourcedEvent__Output>;
  subEvent(argument: _hermes_BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_SourcedEvent__Output>;
  
  SubFileDownlink(argument: _hermes_BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileDownlink__Output>;
  SubFileDownlink(argument: _hermes_BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileDownlink__Output>;
  subFileDownlink(argument: _hermes_BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileDownlink__Output>;
  subFileDownlink(argument: _hermes_BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileDownlink__Output>;
  
  SubFileTransfer(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileTransferState__Output>;
  SubFileTransfer(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileTransferState__Output>;
  subFileTransfer(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileTransferState__Output>;
  subFileTransfer(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileTransferState__Output>;
  
  SubFileUplink(argument: _hermes_BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileUplink__Output>;
  SubFileUplink(argument: _hermes_BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileUplink__Output>;
  subFileUplink(argument: _hermes_BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileUplink__Output>;
  subFileUplink(argument: _hermes_BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FileUplink__Output>;
  
  SubTelemetry(argument: _hermes_BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_SourcedTelemetry__Output>;
  SubTelemetry(argument: _hermes_BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_SourcedTelemetry__Output>;
  subTelemetry(argument: _hermes_BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_SourcedTelemetry__Output>;
  subTelemetry(argument: _hermes_BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_SourcedTelemetry__Output>;
  
  SubscribeDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_DictionaryList__Output>;
  SubscribeDictionary(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_DictionaryList__Output>;
  subscribeDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_DictionaryList__Output>;
  subscribeDictionary(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_DictionaryList__Output>;
  
  SubscribeFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FswList__Output>;
  SubscribeFsw(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FswList__Output>;
  subscribeFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FswList__Output>;
  subscribeFsw(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_FswList__Output>;
  
  SubscribeProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_ProfileList__Output>;
  SubscribeProfiles(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_ProfileList__Output>;
  subscribeProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_ProfileList__Output>;
  subscribeProfiles(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_ProfileList__Output>;
  
  SubscribeProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_ProfileProviderList__Output>;
  SubscribeProviders(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_ProfileProviderList__Output>;
  subscribeProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_ProfileProviderList__Output>;
  subscribeProviders(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_hermes_ProfileProviderList__Output>;
  
  UpdateProfile(argument: _hermes_ProfileUpdate, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateProfile(argument: _hermes_ProfileUpdate, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateProfile(argument: _hermes_ProfileUpdate, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateProfile(argument: _hermes_ProfileUpdate, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateProfile(argument: _hermes_ProfileUpdate, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateProfile(argument: _hermes_ProfileUpdate, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateProfile(argument: _hermes_ProfileUpdate, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateProfile(argument: _hermes_ProfileUpdate, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  Uplink(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientWritableStream<_hermes_UplinkFileChunk>;
  Uplink(metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientWritableStream<_hermes_UplinkFileChunk>;
  Uplink(options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientWritableStream<_hermes_UplinkFileChunk>;
  Uplink(callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientWritableStream<_hermes_UplinkFileChunk>;
  uplink(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientWritableStream<_hermes_UplinkFileChunk>;
  uplink(metadata: grpc.Metadata, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientWritableStream<_hermes_UplinkFileChunk>;
  uplink(options: grpc.CallOptions, callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientWritableStream<_hermes_UplinkFileChunk>;
  uplink(callback: grpc.requestCallback<_hermes_Reply__Output>): grpc.ClientWritableStream<_hermes_UplinkFileChunk>;
  
}

export interface ApiHandlers extends grpc.UntypedServiceImplementation {
  AddDictionary: grpc.handleUnaryCall<_hermes_Dictionary__Output, _hermes_Id>;
  
  AddProfile: grpc.handleUnaryCall<_hermes_Profile__Output, _hermes_Id>;
  
  AllDictionary: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _hermes_DictionaryList>;
  
  AllFsw: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _hermes_FswList>;
  
  AllProfiles: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _hermes_ProfileList>;
  
  AllProviders: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _hermes_ProfileProviderList>;
  
  ClearDownlinkTransferState: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _google_protobuf_Empty>;
  
  ClearUplinkTransferState: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _google_protobuf_Empty>;
  
  Command: grpc.handleUnaryCall<_hermes_CommandValue__Output, _hermes_Reply>;
  
  GetDictionary: grpc.handleUnaryCall<_hermes_Id__Output, _hermes_Dictionary>;
  
  GetFileTransferState: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _hermes_FileTransferState>;
  
  GetFsw: grpc.handleUnaryCall<_hermes_Id__Output, _hermes_Fsw>;
  
  RawCommand: grpc.handleUnaryCall<_hermes_RawCommandValue__Output, _hermes_Reply>;
  
  RawSequence: grpc.handleUnaryCall<_hermes_RawCommandSequence__Output, _hermes_SequenceReply>;
  
  RemoveDictionary: grpc.handleUnaryCall<_hermes_Id__Output, _google_protobuf_Empty>;
  
  RemoveProfile: grpc.handleUnaryCall<_hermes_Id__Output, _google_protobuf_Empty>;
  
  Request: grpc.handleUnaryCall<_hermes_RequestValue__Output, _hermes_RequestReply>;
  
  Sequence: grpc.handleUnaryCall<_hermes_CommandSequence__Output, _hermes_SequenceReply>;
  
  StartProfile: grpc.handleUnaryCall<_hermes_Id__Output, _google_protobuf_Empty>;
  
  StopProfile: grpc.handleUnaryCall<_hermes_Id__Output, _google_protobuf_Empty>;
  
  SubEvent: grpc.handleServerStreamingCall<_hermes_BusFilter__Output, _hermes_SourcedEvent>;
  
  SubFileDownlink: grpc.handleServerStreamingCall<_hermes_BusFilter__Output, _hermes_FileDownlink>;
  
  SubFileTransfer: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _hermes_FileTransferState>;
  
  SubFileUplink: grpc.handleServerStreamingCall<_hermes_BusFilter__Output, _hermes_FileUplink>;
  
  SubTelemetry: grpc.handleServerStreamingCall<_hermes_BusFilter__Output, _hermes_SourcedTelemetry>;
  
  SubscribeDictionary: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _hermes_DictionaryList>;
  
  SubscribeFsw: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _hermes_FswList>;
  
  SubscribeProfiles: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _hermes_ProfileList>;
  
  SubscribeProviders: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _hermes_ProfileProviderList>;
  
  UpdateProfile: grpc.handleUnaryCall<_hermes_ProfileUpdate__Output, _google_protobuf_Empty>;
  
  Uplink: grpc.handleClientStreamingCall<_hermes_UplinkFileChunk__Output, _hermes_Reply>;
  
}

export interface ApiDefinition extends grpc.ServiceDefinition {
  AddDictionary: MethodDefinition<_hermes_Dictionary, _hermes_Id, _hermes_Dictionary__Output, _hermes_Id__Output>
  AddProfile: MethodDefinition<_hermes_Profile, _hermes_Id, _hermes_Profile__Output, _hermes_Id__Output>
  AllDictionary: MethodDefinition<_google_protobuf_Empty, _hermes_DictionaryList, _google_protobuf_Empty__Output, _hermes_DictionaryList__Output>
  AllFsw: MethodDefinition<_google_protobuf_Empty, _hermes_FswList, _google_protobuf_Empty__Output, _hermes_FswList__Output>
  AllProfiles: MethodDefinition<_google_protobuf_Empty, _hermes_ProfileList, _google_protobuf_Empty__Output, _hermes_ProfileList__Output>
  AllProviders: MethodDefinition<_google_protobuf_Empty, _hermes_ProfileProviderList, _google_protobuf_Empty__Output, _hermes_ProfileProviderList__Output>
  ClearDownlinkTransferState: MethodDefinition<_google_protobuf_Empty, _google_protobuf_Empty, _google_protobuf_Empty__Output, _google_protobuf_Empty__Output>
  ClearUplinkTransferState: MethodDefinition<_google_protobuf_Empty, _google_protobuf_Empty, _google_protobuf_Empty__Output, _google_protobuf_Empty__Output>
  Command: MethodDefinition<_hermes_CommandValue, _hermes_Reply, _hermes_CommandValue__Output, _hermes_Reply__Output>
  GetDictionary: MethodDefinition<_hermes_Id, _hermes_Dictionary, _hermes_Id__Output, _hermes_Dictionary__Output>
  GetFileTransferState: MethodDefinition<_google_protobuf_Empty, _hermes_FileTransferState, _google_protobuf_Empty__Output, _hermes_FileTransferState__Output>
  GetFsw: MethodDefinition<_hermes_Id, _hermes_Fsw, _hermes_Id__Output, _hermes_Fsw__Output>
  RawCommand: MethodDefinition<_hermes_RawCommandValue, _hermes_Reply, _hermes_RawCommandValue__Output, _hermes_Reply__Output>
  RawSequence: MethodDefinition<_hermes_RawCommandSequence, _hermes_SequenceReply, _hermes_RawCommandSequence__Output, _hermes_SequenceReply__Output>
  RemoveDictionary: MethodDefinition<_hermes_Id, _google_protobuf_Empty, _hermes_Id__Output, _google_protobuf_Empty__Output>
  RemoveProfile: MethodDefinition<_hermes_Id, _google_protobuf_Empty, _hermes_Id__Output, _google_protobuf_Empty__Output>
  Request: MethodDefinition<_hermes_RequestValue, _hermes_RequestReply, _hermes_RequestValue__Output, _hermes_RequestReply__Output>
  Sequence: MethodDefinition<_hermes_CommandSequence, _hermes_SequenceReply, _hermes_CommandSequence__Output, _hermes_SequenceReply__Output>
  StartProfile: MethodDefinition<_hermes_Id, _google_protobuf_Empty, _hermes_Id__Output, _google_protobuf_Empty__Output>
  StopProfile: MethodDefinition<_hermes_Id, _google_protobuf_Empty, _hermes_Id__Output, _google_protobuf_Empty__Output>
  SubEvent: MethodDefinition<_hermes_BusFilter, _hermes_SourcedEvent, _hermes_BusFilter__Output, _hermes_SourcedEvent__Output>
  SubFileDownlink: MethodDefinition<_hermes_BusFilter, _hermes_FileDownlink, _hermes_BusFilter__Output, _hermes_FileDownlink__Output>
  SubFileTransfer: MethodDefinition<_google_protobuf_Empty, _hermes_FileTransferState, _google_protobuf_Empty__Output, _hermes_FileTransferState__Output>
  SubFileUplink: MethodDefinition<_hermes_BusFilter, _hermes_FileUplink, _hermes_BusFilter__Output, _hermes_FileUplink__Output>
  SubTelemetry: MethodDefinition<_hermes_BusFilter, _hermes_SourcedTelemetry, _hermes_BusFilter__Output, _hermes_SourcedTelemetry__Output>
  SubscribeDictionary: MethodDefinition<_google_protobuf_Empty, _hermes_DictionaryList, _google_protobuf_Empty__Output, _hermes_DictionaryList__Output>
  SubscribeFsw: MethodDefinition<_google_protobuf_Empty, _hermes_FswList, _google_protobuf_Empty__Output, _hermes_FswList__Output>
  SubscribeProfiles: MethodDefinition<_google_protobuf_Empty, _hermes_ProfileList, _google_protobuf_Empty__Output, _hermes_ProfileList__Output>
  SubscribeProviders: MethodDefinition<_google_protobuf_Empty, _hermes_ProfileProviderList, _google_protobuf_Empty__Output, _hermes_ProfileProviderList__Output>
  UpdateProfile: MethodDefinition<_hermes_ProfileUpdate, _google_protobuf_Empty, _hermes_ProfileUpdate__Output, _google_protobuf_Empty__Output>
  Uplink: MethodDefinition<_hermes_UplinkFileChunk, _hermes_Reply, _hermes_UplinkFileChunk__Output, _hermes_Reply__Output>
}
