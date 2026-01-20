// Original file: proto/grpc/hermes.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DownlinkFileChunk as _DownlinkFileChunk, DownlinkFileChunk__Output as _DownlinkFileChunk__Output } from './DownlinkFileChunk';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { FswConnectionPacket as _FswConnectionPacket, FswConnectionPacket__Output as _FswConnectionPacket__Output } from './FswConnectionPacket';
import type { SourcedEvent as _SourcedEvent, SourcedEvent__Output as _SourcedEvent__Output } from './SourcedEvent';
import type { SourcedTelemetry as _SourcedTelemetry, SourcedTelemetry__Output as _SourcedTelemetry__Output } from './SourcedTelemetry';
import type { Uplink as _Uplink, Uplink__Output as _Uplink__Output } from './Uplink';

export interface ProviderClient extends grpc.Client {
  Connection(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_FswConnectionPacket, _Uplink__Output>;
  Connection(options?: grpc.CallOptions): grpc.ClientDuplexStream<_FswConnectionPacket, _Uplink__Output>;
  connection(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_FswConnectionPacket, _Uplink__Output>;
  connection(options?: grpc.CallOptions): grpc.ClientDuplexStream<_FswConnectionPacket, _Uplink__Output>;
  
  Event(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedEvent>;
  Event(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedEvent>;
  Event(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedEvent>;
  Event(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedEvent>;
  event(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedEvent>;
  event(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedEvent>;
  event(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedEvent>;
  event(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedEvent>;
  
  File(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_DownlinkFileChunk>;
  File(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_DownlinkFileChunk>;
  File(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_DownlinkFileChunk>;
  File(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_DownlinkFileChunk>;
  file(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_DownlinkFileChunk>;
  file(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_DownlinkFileChunk>;
  file(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_DownlinkFileChunk>;
  file(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_DownlinkFileChunk>;
  
  Telemetry(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedTelemetry>;
  Telemetry(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedTelemetry>;
  Telemetry(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedTelemetry>;
  Telemetry(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedTelemetry>;
  telemetry(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedTelemetry>;
  telemetry(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedTelemetry>;
  telemetry(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedTelemetry>;
  telemetry(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_SourcedTelemetry>;
  
}

export interface ProviderHandlers extends grpc.UntypedServiceImplementation {
  Connection: grpc.handleBidiStreamingCall<_FswConnectionPacket__Output, _Uplink>;
  
  Event: grpc.handleClientStreamingCall<_SourcedEvent__Output, _google_protobuf_Empty>;
  
  File: grpc.handleClientStreamingCall<_DownlinkFileChunk__Output, _google_protobuf_Empty>;
  
  Telemetry: grpc.handleClientStreamingCall<_SourcedTelemetry__Output, _google_protobuf_Empty>;
  
}

export interface ProviderDefinition extends grpc.ServiceDefinition {
  Connection: MethodDefinition<_FswConnectionPacket, _Uplink, _FswConnectionPacket__Output, _Uplink__Output>
  Event: MethodDefinition<_SourcedEvent, _google_protobuf_Empty, _SourcedEvent__Output, _google_protobuf_Empty__Output>
  File: MethodDefinition<_DownlinkFileChunk, _google_protobuf_Empty, _DownlinkFileChunk__Output, _google_protobuf_Empty__Output>
  Telemetry: MethodDefinition<_SourcedTelemetry, _google_protobuf_Empty, _SourcedTelemetry__Output, _google_protobuf_Empty__Output>
}
