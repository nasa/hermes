// Original file: proto/yamcs/protobuf/commanding/commands_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CommandHistoryEntry as _yamcs_protobuf_commanding_CommandHistoryEntry, CommandHistoryEntry__Output as _yamcs_protobuf_commanding_CommandHistoryEntry__Output } from '../../../yamcs/protobuf/commanding/CommandHistoryEntry';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../google/protobuf/Empty';
import type { ExportCommandRequest as _yamcs_protobuf_commanding_ExportCommandRequest, ExportCommandRequest__Output as _yamcs_protobuf_commanding_ExportCommandRequest__Output } from '../../../yamcs/protobuf/commanding/ExportCommandRequest';
import type { ExportCommandsRequest as _yamcs_protobuf_commanding_ExportCommandsRequest, ExportCommandsRequest__Output as _yamcs_protobuf_commanding_ExportCommandsRequest__Output } from '../../../yamcs/protobuf/commanding/ExportCommandsRequest';
import type { GetCommandRequest as _yamcs_protobuf_commanding_GetCommandRequest, GetCommandRequest__Output as _yamcs_protobuf_commanding_GetCommandRequest__Output } from '../../../yamcs/protobuf/commanding/GetCommandRequest';
import type { HttpBody as _yamcs_api_HttpBody, HttpBody__Output as _yamcs_api_HttpBody__Output } from '../../../yamcs/api/HttpBody';
import type { IssueCommandRequest as _yamcs_protobuf_commanding_IssueCommandRequest, IssueCommandRequest__Output as _yamcs_protobuf_commanding_IssueCommandRequest__Output } from '../../../yamcs/protobuf/commanding/IssueCommandRequest';
import type { IssueCommandResponse as _yamcs_protobuf_commanding_IssueCommandResponse, IssueCommandResponse__Output as _yamcs_protobuf_commanding_IssueCommandResponse__Output } from '../../../yamcs/protobuf/commanding/IssueCommandResponse';
import type { ListCommandsRequest as _yamcs_protobuf_commanding_ListCommandsRequest, ListCommandsRequest__Output as _yamcs_protobuf_commanding_ListCommandsRequest__Output } from '../../../yamcs/protobuf/commanding/ListCommandsRequest';
import type { ListCommandsResponse as _yamcs_protobuf_commanding_ListCommandsResponse, ListCommandsResponse__Output as _yamcs_protobuf_commanding_ListCommandsResponse__Output } from '../../../yamcs/protobuf/commanding/ListCommandsResponse';
import type { StreamCommandsRequest as _yamcs_protobuf_commanding_StreamCommandsRequest, StreamCommandsRequest__Output as _yamcs_protobuf_commanding_StreamCommandsRequest__Output } from '../../../yamcs/protobuf/commanding/StreamCommandsRequest';
import type { SubscribeCommandsRequest as _yamcs_protobuf_commanding_SubscribeCommandsRequest, SubscribeCommandsRequest__Output as _yamcs_protobuf_commanding_SubscribeCommandsRequest__Output } from '../../../yamcs/protobuf/commanding/SubscribeCommandsRequest';
import type { UpdateCommandHistoryRequest as _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, UpdateCommandHistoryRequest__Output as _yamcs_protobuf_commanding_UpdateCommandHistoryRequest__Output } from '../../../yamcs/protobuf/commanding/UpdateCommandHistoryRequest';

export interface CommandsApiClient extends grpc.Client {
  ExportCommand(argument: _yamcs_protobuf_commanding_ExportCommandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportCommand(argument: _yamcs_protobuf_commanding_ExportCommandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportCommand(argument: _yamcs_protobuf_commanding_ExportCommandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportCommand(argument: _yamcs_protobuf_commanding_ExportCommandRequest, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportCommand(argument: _yamcs_protobuf_commanding_ExportCommandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportCommand(argument: _yamcs_protobuf_commanding_ExportCommandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportCommand(argument: _yamcs_protobuf_commanding_ExportCommandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportCommand(argument: _yamcs_protobuf_commanding_ExportCommandRequest, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  
  ExportCommands(argument: _yamcs_protobuf_commanding_ExportCommandsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_api_HttpBody__Output>;
  ExportCommands(argument: _yamcs_protobuf_commanding_ExportCommandsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_api_HttpBody__Output>;
  exportCommands(argument: _yamcs_protobuf_commanding_ExportCommandsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_api_HttpBody__Output>;
  exportCommands(argument: _yamcs_protobuf_commanding_ExportCommandsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_api_HttpBody__Output>;
  
  GetCommand(argument: _yamcs_protobuf_commanding_GetCommandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>): grpc.ClientUnaryCall;
  GetCommand(argument: _yamcs_protobuf_commanding_GetCommandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>): grpc.ClientUnaryCall;
  GetCommand(argument: _yamcs_protobuf_commanding_GetCommandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>): grpc.ClientUnaryCall;
  GetCommand(argument: _yamcs_protobuf_commanding_GetCommandRequest, callback: grpc.requestCallback<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>): grpc.ClientUnaryCall;
  getCommand(argument: _yamcs_protobuf_commanding_GetCommandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>): grpc.ClientUnaryCall;
  getCommand(argument: _yamcs_protobuf_commanding_GetCommandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>): grpc.ClientUnaryCall;
  getCommand(argument: _yamcs_protobuf_commanding_GetCommandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>): grpc.ClientUnaryCall;
  getCommand(argument: _yamcs_protobuf_commanding_GetCommandRequest, callback: grpc.requestCallback<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>): grpc.ClientUnaryCall;
  
  IssueCommand(argument: _yamcs_protobuf_commanding_IssueCommandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_IssueCommandResponse__Output>): grpc.ClientUnaryCall;
  IssueCommand(argument: _yamcs_protobuf_commanding_IssueCommandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_commanding_IssueCommandResponse__Output>): grpc.ClientUnaryCall;
  IssueCommand(argument: _yamcs_protobuf_commanding_IssueCommandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_IssueCommandResponse__Output>): grpc.ClientUnaryCall;
  IssueCommand(argument: _yamcs_protobuf_commanding_IssueCommandRequest, callback: grpc.requestCallback<_yamcs_protobuf_commanding_IssueCommandResponse__Output>): grpc.ClientUnaryCall;
  issueCommand(argument: _yamcs_protobuf_commanding_IssueCommandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_IssueCommandResponse__Output>): grpc.ClientUnaryCall;
  issueCommand(argument: _yamcs_protobuf_commanding_IssueCommandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_commanding_IssueCommandResponse__Output>): grpc.ClientUnaryCall;
  issueCommand(argument: _yamcs_protobuf_commanding_IssueCommandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_IssueCommandResponse__Output>): grpc.ClientUnaryCall;
  issueCommand(argument: _yamcs_protobuf_commanding_IssueCommandRequest, callback: grpc.requestCallback<_yamcs_protobuf_commanding_IssueCommandResponse__Output>): grpc.ClientUnaryCall;
  
  ListCommands(argument: _yamcs_protobuf_commanding_ListCommandsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  ListCommands(argument: _yamcs_protobuf_commanding_ListCommandsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_commanding_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  ListCommands(argument: _yamcs_protobuf_commanding_ListCommandsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  ListCommands(argument: _yamcs_protobuf_commanding_ListCommandsRequest, callback: grpc.requestCallback<_yamcs_protobuf_commanding_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  listCommands(argument: _yamcs_protobuf_commanding_ListCommandsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  listCommands(argument: _yamcs_protobuf_commanding_ListCommandsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_commanding_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  listCommands(argument: _yamcs_protobuf_commanding_ListCommandsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_commanding_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  listCommands(argument: _yamcs_protobuf_commanding_ListCommandsRequest, callback: grpc.requestCallback<_yamcs_protobuf_commanding_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  
  StreamCommands(argument: _yamcs_protobuf_commanding_StreamCommandsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>;
  StreamCommands(argument: _yamcs_protobuf_commanding_StreamCommandsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>;
  streamCommands(argument: _yamcs_protobuf_commanding_StreamCommandsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>;
  streamCommands(argument: _yamcs_protobuf_commanding_StreamCommandsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>;
  
  SubscribeCommands(argument: _yamcs_protobuf_commanding_SubscribeCommandsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>;
  SubscribeCommands(argument: _yamcs_protobuf_commanding_SubscribeCommandsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>;
  subscribeCommands(argument: _yamcs_protobuf_commanding_SubscribeCommandsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>;
  subscribeCommands(argument: _yamcs_protobuf_commanding_SubscribeCommandsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_commanding_CommandHistoryEntry__Output>;
  
  UpdateCommandHistory(argument: _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateCommandHistory(argument: _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateCommandHistory(argument: _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateCommandHistory(argument: _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateCommandHistory(argument: _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateCommandHistory(argument: _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateCommandHistory(argument: _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateCommandHistory(argument: _yamcs_protobuf_commanding_UpdateCommandHistoryRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
}

export interface CommandsApiHandlers extends grpc.UntypedServiceImplementation {
  ExportCommand: grpc.handleUnaryCall<_yamcs_protobuf_commanding_ExportCommandRequest__Output, _yamcs_api_HttpBody>;
  
  ExportCommands: grpc.handleServerStreamingCall<_yamcs_protobuf_commanding_ExportCommandsRequest__Output, _yamcs_api_HttpBody>;
  
  GetCommand: grpc.handleUnaryCall<_yamcs_protobuf_commanding_GetCommandRequest__Output, _yamcs_protobuf_commanding_CommandHistoryEntry>;
  
  IssueCommand: grpc.handleUnaryCall<_yamcs_protobuf_commanding_IssueCommandRequest__Output, _yamcs_protobuf_commanding_IssueCommandResponse>;
  
  ListCommands: grpc.handleUnaryCall<_yamcs_protobuf_commanding_ListCommandsRequest__Output, _yamcs_protobuf_commanding_ListCommandsResponse>;
  
  StreamCommands: grpc.handleServerStreamingCall<_yamcs_protobuf_commanding_StreamCommandsRequest__Output, _yamcs_protobuf_commanding_CommandHistoryEntry>;
  
  SubscribeCommands: grpc.handleServerStreamingCall<_yamcs_protobuf_commanding_SubscribeCommandsRequest__Output, _yamcs_protobuf_commanding_CommandHistoryEntry>;
  
  UpdateCommandHistory: grpc.handleUnaryCall<_yamcs_protobuf_commanding_UpdateCommandHistoryRequest__Output, _google_protobuf_Empty>;
  
}

export interface CommandsApiDefinition extends grpc.ServiceDefinition {
  ExportCommand: MethodDefinition<_yamcs_protobuf_commanding_ExportCommandRequest, _yamcs_api_HttpBody, _yamcs_protobuf_commanding_ExportCommandRequest__Output, _yamcs_api_HttpBody__Output>
  ExportCommands: MethodDefinition<_yamcs_protobuf_commanding_ExportCommandsRequest, _yamcs_api_HttpBody, _yamcs_protobuf_commanding_ExportCommandsRequest__Output, _yamcs_api_HttpBody__Output>
  GetCommand: MethodDefinition<_yamcs_protobuf_commanding_GetCommandRequest, _yamcs_protobuf_commanding_CommandHistoryEntry, _yamcs_protobuf_commanding_GetCommandRequest__Output, _yamcs_protobuf_commanding_CommandHistoryEntry__Output>
  IssueCommand: MethodDefinition<_yamcs_protobuf_commanding_IssueCommandRequest, _yamcs_protobuf_commanding_IssueCommandResponse, _yamcs_protobuf_commanding_IssueCommandRequest__Output, _yamcs_protobuf_commanding_IssueCommandResponse__Output>
  ListCommands: MethodDefinition<_yamcs_protobuf_commanding_ListCommandsRequest, _yamcs_protobuf_commanding_ListCommandsResponse, _yamcs_protobuf_commanding_ListCommandsRequest__Output, _yamcs_protobuf_commanding_ListCommandsResponse__Output>
  StreamCommands: MethodDefinition<_yamcs_protobuf_commanding_StreamCommandsRequest, _yamcs_protobuf_commanding_CommandHistoryEntry, _yamcs_protobuf_commanding_StreamCommandsRequest__Output, _yamcs_protobuf_commanding_CommandHistoryEntry__Output>
  SubscribeCommands: MethodDefinition<_yamcs_protobuf_commanding_SubscribeCommandsRequest, _yamcs_protobuf_commanding_CommandHistoryEntry, _yamcs_protobuf_commanding_SubscribeCommandsRequest__Output, _yamcs_protobuf_commanding_CommandHistoryEntry__Output>
  UpdateCommandHistory: MethodDefinition<_yamcs_protobuf_commanding_UpdateCommandHistoryRequest, _google_protobuf_Empty, _yamcs_protobuf_commanding_UpdateCommandHistoryRequest__Output, _google_protobuf_Empty__Output>
}
