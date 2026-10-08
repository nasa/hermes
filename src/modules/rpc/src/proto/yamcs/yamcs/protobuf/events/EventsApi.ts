// Original file: proto/yamcs/protobuf/events/events_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CreateEventRequest as _yamcs_protobuf_events_CreateEventRequest, CreateEventRequest__Output as _yamcs_protobuf_events_CreateEventRequest__Output } from '../../../yamcs/protobuf/events/CreateEventRequest';
import type { Event as _yamcs_protobuf_events_Event, Event__Output as _yamcs_protobuf_events_Event__Output } from '../../../yamcs/protobuf/events/Event';
import type { ExportEventsRequest as _yamcs_protobuf_events_ExportEventsRequest, ExportEventsRequest__Output as _yamcs_protobuf_events_ExportEventsRequest__Output } from '../../../yamcs/protobuf/events/ExportEventsRequest';
import type { HttpBody as _yamcs_api_HttpBody, HttpBody__Output as _yamcs_api_HttpBody__Output } from '../../../yamcs/api/HttpBody';
import type { ListEventSourcesRequest as _yamcs_protobuf_events_ListEventSourcesRequest, ListEventSourcesRequest__Output as _yamcs_protobuf_events_ListEventSourcesRequest__Output } from '../../../yamcs/protobuf/events/ListEventSourcesRequest';
import type { ListEventSourcesResponse as _yamcs_protobuf_events_ListEventSourcesResponse, ListEventSourcesResponse__Output as _yamcs_protobuf_events_ListEventSourcesResponse__Output } from '../../../yamcs/protobuf/events/ListEventSourcesResponse';
import type { ListEventsRequest as _yamcs_protobuf_events_ListEventsRequest, ListEventsRequest__Output as _yamcs_protobuf_events_ListEventsRequest__Output } from '../../../yamcs/protobuf/events/ListEventsRequest';
import type { ListEventsResponse as _yamcs_protobuf_events_ListEventsResponse, ListEventsResponse__Output as _yamcs_protobuf_events_ListEventsResponse__Output } from '../../../yamcs/protobuf/events/ListEventsResponse';
import type { StreamEventsRequest as _yamcs_protobuf_events_StreamEventsRequest, StreamEventsRequest__Output as _yamcs_protobuf_events_StreamEventsRequest__Output } from '../../../yamcs/protobuf/events/StreamEventsRequest';
import type { SubscribeEventsRequest as _yamcs_protobuf_events_SubscribeEventsRequest, SubscribeEventsRequest__Output as _yamcs_protobuf_events_SubscribeEventsRequest__Output } from '../../../yamcs/protobuf/events/SubscribeEventsRequest';

export interface EventsApiClient extends grpc.Client {
  CreateEvent(argument: _yamcs_protobuf_events_CreateEventRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_Event__Output>): grpc.ClientUnaryCall;
  CreateEvent(argument: _yamcs_protobuf_events_CreateEventRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_events_Event__Output>): grpc.ClientUnaryCall;
  CreateEvent(argument: _yamcs_protobuf_events_CreateEventRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_Event__Output>): grpc.ClientUnaryCall;
  CreateEvent(argument: _yamcs_protobuf_events_CreateEventRequest, callback: grpc.requestCallback<_yamcs_protobuf_events_Event__Output>): grpc.ClientUnaryCall;
  createEvent(argument: _yamcs_protobuf_events_CreateEventRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_Event__Output>): grpc.ClientUnaryCall;
  createEvent(argument: _yamcs_protobuf_events_CreateEventRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_events_Event__Output>): grpc.ClientUnaryCall;
  createEvent(argument: _yamcs_protobuf_events_CreateEventRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_Event__Output>): grpc.ClientUnaryCall;
  createEvent(argument: _yamcs_protobuf_events_CreateEventRequest, callback: grpc.requestCallback<_yamcs_protobuf_events_Event__Output>): grpc.ClientUnaryCall;
  
  ExportEvents(argument: _yamcs_protobuf_events_ExportEventsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_api_HttpBody__Output>;
  ExportEvents(argument: _yamcs_protobuf_events_ExportEventsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_api_HttpBody__Output>;
  exportEvents(argument: _yamcs_protobuf_events_ExportEventsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_api_HttpBody__Output>;
  exportEvents(argument: _yamcs_protobuf_events_ExportEventsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_api_HttpBody__Output>;
  
  ListEventSources(argument: _yamcs_protobuf_events_ListEventSourcesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventSourcesResponse__Output>): grpc.ClientUnaryCall;
  ListEventSources(argument: _yamcs_protobuf_events_ListEventSourcesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventSourcesResponse__Output>): grpc.ClientUnaryCall;
  ListEventSources(argument: _yamcs_protobuf_events_ListEventSourcesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventSourcesResponse__Output>): grpc.ClientUnaryCall;
  ListEventSources(argument: _yamcs_protobuf_events_ListEventSourcesRequest, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventSourcesResponse__Output>): grpc.ClientUnaryCall;
  listEventSources(argument: _yamcs_protobuf_events_ListEventSourcesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventSourcesResponse__Output>): grpc.ClientUnaryCall;
  listEventSources(argument: _yamcs_protobuf_events_ListEventSourcesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventSourcesResponse__Output>): grpc.ClientUnaryCall;
  listEventSources(argument: _yamcs_protobuf_events_ListEventSourcesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventSourcesResponse__Output>): grpc.ClientUnaryCall;
  listEventSources(argument: _yamcs_protobuf_events_ListEventSourcesRequest, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventSourcesResponse__Output>): grpc.ClientUnaryCall;
  
  ListEvents(argument: _yamcs_protobuf_events_ListEventsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventsResponse__Output>): grpc.ClientUnaryCall;
  ListEvents(argument: _yamcs_protobuf_events_ListEventsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventsResponse__Output>): grpc.ClientUnaryCall;
  ListEvents(argument: _yamcs_protobuf_events_ListEventsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventsResponse__Output>): grpc.ClientUnaryCall;
  ListEvents(argument: _yamcs_protobuf_events_ListEventsRequest, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventsResponse__Output>): grpc.ClientUnaryCall;
  listEvents(argument: _yamcs_protobuf_events_ListEventsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventsResponse__Output>): grpc.ClientUnaryCall;
  listEvents(argument: _yamcs_protobuf_events_ListEventsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventsResponse__Output>): grpc.ClientUnaryCall;
  listEvents(argument: _yamcs_protobuf_events_ListEventsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventsResponse__Output>): grpc.ClientUnaryCall;
  listEvents(argument: _yamcs_protobuf_events_ListEventsRequest, callback: grpc.requestCallback<_yamcs_protobuf_events_ListEventsResponse__Output>): grpc.ClientUnaryCall;
  
  StreamEvents(argument: _yamcs_protobuf_events_StreamEventsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_events_Event__Output>;
  StreamEvents(argument: _yamcs_protobuf_events_StreamEventsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_events_Event__Output>;
  streamEvents(argument: _yamcs_protobuf_events_StreamEventsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_events_Event__Output>;
  streamEvents(argument: _yamcs_protobuf_events_StreamEventsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_events_Event__Output>;
  
  SubscribeEvents(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_yamcs_protobuf_events_SubscribeEventsRequest, _yamcs_protobuf_events_Event__Output>;
  SubscribeEvents(options?: grpc.CallOptions): grpc.ClientDuplexStream<_yamcs_protobuf_events_SubscribeEventsRequest, _yamcs_protobuf_events_Event__Output>;
  subscribeEvents(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_yamcs_protobuf_events_SubscribeEventsRequest, _yamcs_protobuf_events_Event__Output>;
  subscribeEvents(options?: grpc.CallOptions): grpc.ClientDuplexStream<_yamcs_protobuf_events_SubscribeEventsRequest, _yamcs_protobuf_events_Event__Output>;
  
}

export interface EventsApiHandlers extends grpc.UntypedServiceImplementation {
  CreateEvent: grpc.handleUnaryCall<_yamcs_protobuf_events_CreateEventRequest__Output, _yamcs_protobuf_events_Event>;
  
  ExportEvents: grpc.handleServerStreamingCall<_yamcs_protobuf_events_ExportEventsRequest__Output, _yamcs_api_HttpBody>;
  
  ListEventSources: grpc.handleUnaryCall<_yamcs_protobuf_events_ListEventSourcesRequest__Output, _yamcs_protobuf_events_ListEventSourcesResponse>;
  
  ListEvents: grpc.handleUnaryCall<_yamcs_protobuf_events_ListEventsRequest__Output, _yamcs_protobuf_events_ListEventsResponse>;
  
  StreamEvents: grpc.handleServerStreamingCall<_yamcs_protobuf_events_StreamEventsRequest__Output, _yamcs_protobuf_events_Event>;
  
  SubscribeEvents: grpc.handleBidiStreamingCall<_yamcs_protobuf_events_SubscribeEventsRequest__Output, _yamcs_protobuf_events_Event>;
  
}

export interface EventsApiDefinition extends grpc.ServiceDefinition {
  CreateEvent: MethodDefinition<_yamcs_protobuf_events_CreateEventRequest, _yamcs_protobuf_events_Event, _yamcs_protobuf_events_CreateEventRequest__Output, _yamcs_protobuf_events_Event__Output>
  ExportEvents: MethodDefinition<_yamcs_protobuf_events_ExportEventsRequest, _yamcs_api_HttpBody, _yamcs_protobuf_events_ExportEventsRequest__Output, _yamcs_api_HttpBody__Output>
  ListEventSources: MethodDefinition<_yamcs_protobuf_events_ListEventSourcesRequest, _yamcs_protobuf_events_ListEventSourcesResponse, _yamcs_protobuf_events_ListEventSourcesRequest__Output, _yamcs_protobuf_events_ListEventSourcesResponse__Output>
  ListEvents: MethodDefinition<_yamcs_protobuf_events_ListEventsRequest, _yamcs_protobuf_events_ListEventsResponse, _yamcs_protobuf_events_ListEventsRequest__Output, _yamcs_protobuf_events_ListEventsResponse__Output>
  StreamEvents: MethodDefinition<_yamcs_protobuf_events_StreamEventsRequest, _yamcs_protobuf_events_Event, _yamcs_protobuf_events_StreamEventsRequest__Output, _yamcs_protobuf_events_Event__Output>
  SubscribeEvents: MethodDefinition<_yamcs_protobuf_events_SubscribeEventsRequest, _yamcs_protobuf_events_Event, _yamcs_protobuf_events_SubscribeEventsRequest__Output, _yamcs_protobuf_events_Event__Output>
}
