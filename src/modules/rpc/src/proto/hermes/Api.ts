// Original file: proto/grpc/hermes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BusFilter as _BusFilter, BusFilter__Output as _BusFilter__Output } from './BusFilter';
import type { CommandSequence as _CommandSequence, CommandSequence__Output as _CommandSequence__Output } from './CommandSequence';
import type { CommandValue as _CommandValue, CommandValue__Output as _CommandValue__Output } from './CommandValue';
import type { Dictionary as _Dictionary, Dictionary__Output as _Dictionary__Output } from './Dictionary';
import type { DictionaryList as _DictionaryList, DictionaryList__Output as _DictionaryList__Output } from './DictionaryList';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { FileDownlink as _FileDownlink, FileDownlink__Output as _FileDownlink__Output } from './FileDownlink';
import type { FileTransferState as _FileTransferState, FileTransferState__Output as _FileTransferState__Output } from './FileTransferState';
import type { FileUplink as _FileUplink, FileUplink__Output as _FileUplink__Output } from './FileUplink';
import type { Fsw as _Fsw, Fsw__Output as _Fsw__Output } from './Fsw';
import type { FswList as _FswList, FswList__Output as _FswList__Output } from './FswList';
import type { Id as _Id, Id__Output as _Id__Output } from './Id';
import type { Profile as _Profile, Profile__Output as _Profile__Output } from './Profile';
import type { ProfileList as _ProfileList, ProfileList__Output as _ProfileList__Output } from './ProfileList';
import type { ProfileProviderList as _ProfileProviderList, ProfileProviderList__Output as _ProfileProviderList__Output } from './ProfileProviderList';
import type { ProfileUpdate as _ProfileUpdate, ProfileUpdate__Output as _ProfileUpdate__Output } from './ProfileUpdate';
import type { RawCommandSequence as _RawCommandSequence, RawCommandSequence__Output as _RawCommandSequence__Output } from './RawCommandSequence';
import type { RawCommandValue as _RawCommandValue, RawCommandValue__Output as _RawCommandValue__Output } from './RawCommandValue';
import type { Reply as _Reply, Reply__Output as _Reply__Output } from './Reply';
import type { SequenceReply as _SequenceReply, SequenceReply__Output as _SequenceReply__Output } from './SequenceReply';
import type { SourcedEvent as _SourcedEvent, SourcedEvent__Output as _SourcedEvent__Output } from './SourcedEvent';
import type { SourcedTelemetry as _SourcedTelemetry, SourcedTelemetry__Output as _SourcedTelemetry__Output } from './SourcedTelemetry';
import type { UplinkFileChunk as _UplinkFileChunk, UplinkFileChunk__Output as _UplinkFileChunk__Output } from './UplinkFileChunk';

export interface ApiClient extends grpc.Client {
  AddDictionary(argument: _Dictionary, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  AddDictionary(argument: _Dictionary, metadata: grpc.Metadata, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  AddDictionary(argument: _Dictionary, options: grpc.CallOptions, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  AddDictionary(argument: _Dictionary, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  addDictionary(argument: _Dictionary, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  addDictionary(argument: _Dictionary, metadata: grpc.Metadata, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  addDictionary(argument: _Dictionary, options: grpc.CallOptions, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  addDictionary(argument: _Dictionary, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  
  AddProfile(argument: _Profile, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  AddProfile(argument: _Profile, metadata: grpc.Metadata, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  AddProfile(argument: _Profile, options: grpc.CallOptions, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  AddProfile(argument: _Profile, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  addProfile(argument: _Profile, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  addProfile(argument: _Profile, metadata: grpc.Metadata, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  addProfile(argument: _Profile, options: grpc.CallOptions, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  addProfile(argument: _Profile, callback: grpc.requestCallback<_Id__Output>): grpc.ClientUnaryCall;
  
  AllDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_DictionaryList__Output>): grpc.ClientUnaryCall;
  AllDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_DictionaryList__Output>): grpc.ClientUnaryCall;
  AllDictionary(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_DictionaryList__Output>): grpc.ClientUnaryCall;
  AllDictionary(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_DictionaryList__Output>): grpc.ClientUnaryCall;
  allDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_DictionaryList__Output>): grpc.ClientUnaryCall;
  allDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_DictionaryList__Output>): grpc.ClientUnaryCall;
  allDictionary(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_DictionaryList__Output>): grpc.ClientUnaryCall;
  allDictionary(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_DictionaryList__Output>): grpc.ClientUnaryCall;
  
  AllFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FswList__Output>): grpc.ClientUnaryCall;
  AllFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_FswList__Output>): grpc.ClientUnaryCall;
  AllFsw(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_FswList__Output>): grpc.ClientUnaryCall;
  AllFsw(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_FswList__Output>): grpc.ClientUnaryCall;
  allFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FswList__Output>): grpc.ClientUnaryCall;
  allFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_FswList__Output>): grpc.ClientUnaryCall;
  allFsw(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_FswList__Output>): grpc.ClientUnaryCall;
  allFsw(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_FswList__Output>): grpc.ClientUnaryCall;
  
  AllProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ProfileList__Output>): grpc.ClientUnaryCall;
  AllProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_ProfileList__Output>): grpc.ClientUnaryCall;
  AllProfiles(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_ProfileList__Output>): grpc.ClientUnaryCall;
  AllProfiles(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_ProfileList__Output>): grpc.ClientUnaryCall;
  allProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ProfileList__Output>): grpc.ClientUnaryCall;
  allProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_ProfileList__Output>): grpc.ClientUnaryCall;
  allProfiles(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_ProfileList__Output>): grpc.ClientUnaryCall;
  allProfiles(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_ProfileList__Output>): grpc.ClientUnaryCall;
  
  AllProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  AllProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  AllProviders(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  AllProviders(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  allProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  allProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  allProviders(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  allProviders(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_ProfileProviderList__Output>): grpc.ClientUnaryCall;
  
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
  
  Command(argument: _CommandValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  Command(argument: _CommandValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  Command(argument: _CommandValue, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  Command(argument: _CommandValue, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  command(argument: _CommandValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  command(argument: _CommandValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  command(argument: _CommandValue, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  command(argument: _CommandValue, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  
  GetDictionary(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Dictionary__Output>): grpc.ClientUnaryCall;
  GetDictionary(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_Dictionary__Output>): grpc.ClientUnaryCall;
  GetDictionary(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_Dictionary__Output>): grpc.ClientUnaryCall;
  GetDictionary(argument: _Id, callback: grpc.requestCallback<_Dictionary__Output>): grpc.ClientUnaryCall;
  getDictionary(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Dictionary__Output>): grpc.ClientUnaryCall;
  getDictionary(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_Dictionary__Output>): grpc.ClientUnaryCall;
  getDictionary(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_Dictionary__Output>): grpc.ClientUnaryCall;
  getDictionary(argument: _Id, callback: grpc.requestCallback<_Dictionary__Output>): grpc.ClientUnaryCall;
  
  GetFileTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FileTransferState__Output>): grpc.ClientUnaryCall;
  GetFileTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_FileTransferState__Output>): grpc.ClientUnaryCall;
  GetFileTransferState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_FileTransferState__Output>): grpc.ClientUnaryCall;
  GetFileTransferState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_FileTransferState__Output>): grpc.ClientUnaryCall;
  getFileTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FileTransferState__Output>): grpc.ClientUnaryCall;
  getFileTransferState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_FileTransferState__Output>): grpc.ClientUnaryCall;
  getFileTransferState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_FileTransferState__Output>): grpc.ClientUnaryCall;
  getFileTransferState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_FileTransferState__Output>): grpc.ClientUnaryCall;
  
  GetFsw(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Fsw__Output>): grpc.ClientUnaryCall;
  GetFsw(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_Fsw__Output>): grpc.ClientUnaryCall;
  GetFsw(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_Fsw__Output>): grpc.ClientUnaryCall;
  GetFsw(argument: _Id, callback: grpc.requestCallback<_Fsw__Output>): grpc.ClientUnaryCall;
  getFsw(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Fsw__Output>): grpc.ClientUnaryCall;
  getFsw(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_Fsw__Output>): grpc.ClientUnaryCall;
  getFsw(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_Fsw__Output>): grpc.ClientUnaryCall;
  getFsw(argument: _Id, callback: grpc.requestCallback<_Fsw__Output>): grpc.ClientUnaryCall;
  
  RawCommand(argument: _RawCommandValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  RawCommand(argument: _RawCommandValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  RawCommand(argument: _RawCommandValue, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  RawCommand(argument: _RawCommandValue, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  rawCommand(argument: _RawCommandValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  rawCommand(argument: _RawCommandValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  rawCommand(argument: _RawCommandValue, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  rawCommand(argument: _RawCommandValue, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientUnaryCall;
  
  RawSequence(argument: _RawCommandSequence, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  RawSequence(argument: _RawCommandSequence, metadata: grpc.Metadata, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  RawSequence(argument: _RawCommandSequence, options: grpc.CallOptions, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  RawSequence(argument: _RawCommandSequence, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  rawSequence(argument: _RawCommandSequence, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  rawSequence(argument: _RawCommandSequence, metadata: grpc.Metadata, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  rawSequence(argument: _RawCommandSequence, options: grpc.CallOptions, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  rawSequence(argument: _RawCommandSequence, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  
  RemoveDictionary(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveDictionary(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveDictionary(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveDictionary(argument: _Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeDictionary(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeDictionary(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeDictionary(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeDictionary(argument: _Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  RemoveProfile(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveProfile(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveProfile(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  RemoveProfile(argument: _Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeProfile(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeProfile(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeProfile(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  removeProfile(argument: _Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  Sequence(argument: _CommandSequence, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  Sequence(argument: _CommandSequence, metadata: grpc.Metadata, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  Sequence(argument: _CommandSequence, options: grpc.CallOptions, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  Sequence(argument: _CommandSequence, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  sequence(argument: _CommandSequence, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  sequence(argument: _CommandSequence, metadata: grpc.Metadata, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  sequence(argument: _CommandSequence, options: grpc.CallOptions, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  sequence(argument: _CommandSequence, callback: grpc.requestCallback<_SequenceReply__Output>): grpc.ClientUnaryCall;
  
  StartProfile(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StartProfile(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StartProfile(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StartProfile(argument: _Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  startProfile(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  startProfile(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  startProfile(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  startProfile(argument: _Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  StopProfile(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StopProfile(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StopProfile(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  StopProfile(argument: _Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  stopProfile(argument: _Id, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  stopProfile(argument: _Id, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  stopProfile(argument: _Id, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  stopProfile(argument: _Id, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  SubEvent(argument: _BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_SourcedEvent__Output>;
  SubEvent(argument: _BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_SourcedEvent__Output>;
  subEvent(argument: _BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_SourcedEvent__Output>;
  subEvent(argument: _BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_SourcedEvent__Output>;
  
  SubFileDownlink(argument: _BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileDownlink__Output>;
  SubFileDownlink(argument: _BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileDownlink__Output>;
  subFileDownlink(argument: _BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileDownlink__Output>;
  subFileDownlink(argument: _BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileDownlink__Output>;
  
  SubFileTransfer(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileTransferState__Output>;
  SubFileTransfer(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileTransferState__Output>;
  subFileTransfer(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileTransferState__Output>;
  subFileTransfer(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileTransferState__Output>;
  
  SubFileUplink(argument: _BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileUplink__Output>;
  SubFileUplink(argument: _BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileUplink__Output>;
  subFileUplink(argument: _BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileUplink__Output>;
  subFileUplink(argument: _BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_FileUplink__Output>;
  
  SubTelemetry(argument: _BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_SourcedTelemetry__Output>;
  SubTelemetry(argument: _BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_SourcedTelemetry__Output>;
  subTelemetry(argument: _BusFilter, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_SourcedTelemetry__Output>;
  subTelemetry(argument: _BusFilter, options?: grpc.CallOptions): grpc.ClientReadableStream<_SourcedTelemetry__Output>;
  
  SubscribeDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DictionaryList__Output>;
  SubscribeDictionary(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_DictionaryList__Output>;
  subscribeDictionary(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DictionaryList__Output>;
  subscribeDictionary(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_DictionaryList__Output>;
  
  SubscribeFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_FswList__Output>;
  SubscribeFsw(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_FswList__Output>;
  subscribeFsw(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_FswList__Output>;
  subscribeFsw(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_FswList__Output>;
  
  SubscribeProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_ProfileList__Output>;
  SubscribeProfiles(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_ProfileList__Output>;
  subscribeProfiles(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_ProfileList__Output>;
  subscribeProfiles(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_ProfileList__Output>;
  
  SubscribeProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_ProfileProviderList__Output>;
  SubscribeProviders(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_ProfileProviderList__Output>;
  subscribeProviders(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_ProfileProviderList__Output>;
  subscribeProviders(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_ProfileProviderList__Output>;
  
  UpdateProfile(argument: _ProfileUpdate, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateProfile(argument: _ProfileUpdate, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateProfile(argument: _ProfileUpdate, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateProfile(argument: _ProfileUpdate, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateProfile(argument: _ProfileUpdate, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateProfile(argument: _ProfileUpdate, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateProfile(argument: _ProfileUpdate, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateProfile(argument: _ProfileUpdate, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  Uplink(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientWritableStream<_UplinkFileChunk>;
  Uplink(metadata: grpc.Metadata, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientWritableStream<_UplinkFileChunk>;
  Uplink(options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientWritableStream<_UplinkFileChunk>;
  Uplink(callback: grpc.requestCallback<_Reply__Output>): grpc.ClientWritableStream<_UplinkFileChunk>;
  uplink(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientWritableStream<_UplinkFileChunk>;
  uplink(metadata: grpc.Metadata, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientWritableStream<_UplinkFileChunk>;
  uplink(options: grpc.CallOptions, callback: grpc.requestCallback<_Reply__Output>): grpc.ClientWritableStream<_UplinkFileChunk>;
  uplink(callback: grpc.requestCallback<_Reply__Output>): grpc.ClientWritableStream<_UplinkFileChunk>;
  
}

export interface ApiHandlers extends grpc.UntypedServiceImplementation {
  AddDictionary: grpc.handleUnaryCall<_Dictionary__Output, _Id>;
  
  AddProfile: grpc.handleUnaryCall<_Profile__Output, _Id>;
  
  AllDictionary: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _DictionaryList>;
  
  AllFsw: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _FswList>;
  
  AllProfiles: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _ProfileList>;
  
  AllProviders: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _ProfileProviderList>;
  
  ClearDownlinkTransferState: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _google_protobuf_Empty>;
  
  ClearUplinkTransferState: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _google_protobuf_Empty>;
  
  Command: grpc.handleUnaryCall<_CommandValue__Output, _Reply>;
  
  GetDictionary: grpc.handleUnaryCall<_Id__Output, _Dictionary>;
  
  GetFileTransferState: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _FileTransferState>;
  
  GetFsw: grpc.handleUnaryCall<_Id__Output, _Fsw>;
  
  RawCommand: grpc.handleUnaryCall<_RawCommandValue__Output, _Reply>;
  
  RawSequence: grpc.handleUnaryCall<_RawCommandSequence__Output, _SequenceReply>;
  
  RemoveDictionary: grpc.handleUnaryCall<_Id__Output, _google_protobuf_Empty>;
  
  RemoveProfile: grpc.handleUnaryCall<_Id__Output, _google_protobuf_Empty>;
  
  Sequence: grpc.handleUnaryCall<_CommandSequence__Output, _SequenceReply>;
  
  StartProfile: grpc.handleUnaryCall<_Id__Output, _google_protobuf_Empty>;
  
  StopProfile: grpc.handleUnaryCall<_Id__Output, _google_protobuf_Empty>;
  
  SubEvent: grpc.handleServerStreamingCall<_BusFilter__Output, _SourcedEvent>;
  
  SubFileDownlink: grpc.handleServerStreamingCall<_BusFilter__Output, _FileDownlink>;
  
  SubFileTransfer: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _FileTransferState>;
  
  SubFileUplink: grpc.handleServerStreamingCall<_BusFilter__Output, _FileUplink>;
  
  SubTelemetry: grpc.handleServerStreamingCall<_BusFilter__Output, _SourcedTelemetry>;
  
  SubscribeDictionary: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _DictionaryList>;
  
  SubscribeFsw: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _FswList>;
  
  SubscribeProfiles: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _ProfileList>;
  
  SubscribeProviders: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _ProfileProviderList>;
  
  UpdateProfile: grpc.handleUnaryCall<_ProfileUpdate__Output, _google_protobuf_Empty>;
  
  Uplink: grpc.handleClientStreamingCall<_UplinkFileChunk__Output, _Reply>;
  
}

export interface ApiDefinition extends grpc.ServiceDefinition {
  AddDictionary: MethodDefinition<_Dictionary, _Id, _Dictionary__Output, _Id__Output>
  AddProfile: MethodDefinition<_Profile, _Id, _Profile__Output, _Id__Output>
  AllDictionary: MethodDefinition<_google_protobuf_Empty, _DictionaryList, _google_protobuf_Empty__Output, _DictionaryList__Output>
  AllFsw: MethodDefinition<_google_protobuf_Empty, _FswList, _google_protobuf_Empty__Output, _FswList__Output>
  AllProfiles: MethodDefinition<_google_protobuf_Empty, _ProfileList, _google_protobuf_Empty__Output, _ProfileList__Output>
  AllProviders: MethodDefinition<_google_protobuf_Empty, _ProfileProviderList, _google_protobuf_Empty__Output, _ProfileProviderList__Output>
  ClearDownlinkTransferState: MethodDefinition<_google_protobuf_Empty, _google_protobuf_Empty, _google_protobuf_Empty__Output, _google_protobuf_Empty__Output>
  ClearUplinkTransferState: MethodDefinition<_google_protobuf_Empty, _google_protobuf_Empty, _google_protobuf_Empty__Output, _google_protobuf_Empty__Output>
  Command: MethodDefinition<_CommandValue, _Reply, _CommandValue__Output, _Reply__Output>
  GetDictionary: MethodDefinition<_Id, _Dictionary, _Id__Output, _Dictionary__Output>
  GetFileTransferState: MethodDefinition<_google_protobuf_Empty, _FileTransferState, _google_protobuf_Empty__Output, _FileTransferState__Output>
  GetFsw: MethodDefinition<_Id, _Fsw, _Id__Output, _Fsw__Output>
  RawCommand: MethodDefinition<_RawCommandValue, _Reply, _RawCommandValue__Output, _Reply__Output>
  RawSequence: MethodDefinition<_RawCommandSequence, _SequenceReply, _RawCommandSequence__Output, _SequenceReply__Output>
  RemoveDictionary: MethodDefinition<_Id, _google_protobuf_Empty, _Id__Output, _google_protobuf_Empty__Output>
  RemoveProfile: MethodDefinition<_Id, _google_protobuf_Empty, _Id__Output, _google_protobuf_Empty__Output>
  Sequence: MethodDefinition<_CommandSequence, _SequenceReply, _CommandSequence__Output, _SequenceReply__Output>
  StartProfile: MethodDefinition<_Id, _google_protobuf_Empty, _Id__Output, _google_protobuf_Empty__Output>
  StopProfile: MethodDefinition<_Id, _google_protobuf_Empty, _Id__Output, _google_protobuf_Empty__Output>
  SubEvent: MethodDefinition<_BusFilter, _SourcedEvent, _BusFilter__Output, _SourcedEvent__Output>
  SubFileDownlink: MethodDefinition<_BusFilter, _FileDownlink, _BusFilter__Output, _FileDownlink__Output>
  SubFileTransfer: MethodDefinition<_google_protobuf_Empty, _FileTransferState, _google_protobuf_Empty__Output, _FileTransferState__Output>
  SubFileUplink: MethodDefinition<_BusFilter, _FileUplink, _BusFilter__Output, _FileUplink__Output>
  SubTelemetry: MethodDefinition<_BusFilter, _SourcedTelemetry, _BusFilter__Output, _SourcedTelemetry__Output>
  SubscribeDictionary: MethodDefinition<_google_protobuf_Empty, _DictionaryList, _google_protobuf_Empty__Output, _DictionaryList__Output>
  SubscribeFsw: MethodDefinition<_google_protobuf_Empty, _FswList, _google_protobuf_Empty__Output, _FswList__Output>
  SubscribeProfiles: MethodDefinition<_google_protobuf_Empty, _ProfileList, _google_protobuf_Empty__Output, _ProfileList__Output>
  SubscribeProviders: MethodDefinition<_google_protobuf_Empty, _ProfileProviderList, _google_protobuf_Empty__Output, _ProfileProviderList__Output>
  UpdateProfile: MethodDefinition<_ProfileUpdate, _google_protobuf_Empty, _ProfileUpdate__Output, _google_protobuf_Empty__Output>
  Uplink: MethodDefinition<_UplinkFileChunk, _Reply, _UplinkFileChunk__Output, _Reply__Output>
}
