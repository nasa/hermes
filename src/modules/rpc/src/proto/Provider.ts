// Original file: proto/grpc/hermes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DownlinkFileChunk as _hermes_DownlinkFileChunk, DownlinkFileChunk__Output as _hermes_DownlinkFileChunk__Output } from './hermes/DownlinkFileChunk';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { FswConnectionPacket as _hermes_FswConnectionPacket, FswConnectionPacket__Output as _hermes_FswConnectionPacket__Output } from './hermes/FswConnectionPacket';
import type { SourcedEvent as _hermes_SourcedEvent, SourcedEvent__Output as _hermes_SourcedEvent__Output } from './hermes/SourcedEvent';
import type { SourcedTelemetry as _hermes_SourcedTelemetry, SourcedTelemetry__Output as _hermes_SourcedTelemetry__Output } from './hermes/SourcedTelemetry';
import type { Uplink as _hermes_Uplink, Uplink__Output as _hermes_Uplink__Output } from './hermes/Uplink';

export interface ProviderClient extends grpc.Client {
  Connection(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_hermes_FswConnectionPacket, _hermes_Uplink__Output>;
  Connection(options?: grpc.CallOptions): grpc.ClientDuplexStream<_hermes_FswConnectionPacket, _hermes_Uplink__Output>;
  connection(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_hermes_FswConnectionPacket, _hermes_Uplink__Output>;
  connection(options?: grpc.CallOptions): grpc.ClientDuplexStream<_hermes_FswConnectionPacket, _hermes_Uplink__Output>;
  
  Event(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedEvent>;
  Event(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedEvent>;
  Event(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedEvent>;
  Event(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedEvent>;
  event(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedEvent>;
  event(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedEvent>;
  event(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedEvent>;
  event(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedEvent>;
  
  File(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_DownlinkFileChunk>;
  File(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_DownlinkFileChunk>;
  File(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_DownlinkFileChunk>;
  File(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_DownlinkFileChunk>;
  file(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_DownlinkFileChunk>;
  file(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_DownlinkFileChunk>;
  file(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_DownlinkFileChunk>;
  file(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_DownlinkFileChunk>;
  
  Telemetry(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedTelemetry>;
  Telemetry(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedTelemetry>;
  Telemetry(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedTelemetry>;
  Telemetry(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedTelemetry>;
  telemetry(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedTelemetry>;
  telemetry(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedTelemetry>;
  telemetry(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedTelemetry>;
  telemetry(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_hermes_SourcedTelemetry>;
  
}

export interface ProviderHandlers extends grpc.UntypedServiceImplementation {
  Connection: grpc.handleBidiStreamingCall<_hermes_FswConnectionPacket__Output, _hermes_Uplink>;
  
  Event: grpc.handleClientStreamingCall<_hermes_SourcedEvent__Output, _google_protobuf_Empty>;
  
  File: grpc.handleClientStreamingCall<_hermes_DownlinkFileChunk__Output, _google_protobuf_Empty>;
  
  Telemetry: grpc.handleClientStreamingCall<_hermes_SourcedTelemetry__Output, _google_protobuf_Empty>;
  
}

export interface ProviderDefinition extends grpc.ServiceDefinition {
  Connection: MethodDefinition<_hermes_FswConnectionPacket, _hermes_Uplink, _hermes_FswConnectionPacket__Output, _hermes_Uplink__Output>
  Event: MethodDefinition<_hermes_SourcedEvent, _google_protobuf_Empty, _hermes_SourcedEvent__Output, _google_protobuf_Empty__Output>
  File: MethodDefinition<_hermes_DownlinkFileChunk, _google_protobuf_Empty, _hermes_DownlinkFileChunk__Output, _google_protobuf_Empty__Output>
  Telemetry: MethodDefinition<_hermes_SourcedTelemetry, _google_protobuf_Empty, _hermes_SourcedTelemetry__Output, _google_protobuf_Empty__Output>
}
