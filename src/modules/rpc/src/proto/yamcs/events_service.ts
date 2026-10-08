import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from './google/protobuf/DescriptorProto';
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
import type { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from './google/protobuf/MessageOptions';
import type { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from './google/protobuf/MethodDescriptorProto';
import type { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from './google/protobuf/MethodOptions';
import type { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from './google/protobuf/OneofDescriptorProto';
import type { OneofOptions as _google_protobuf_OneofOptions, OneofOptions__Output as _google_protobuf_OneofOptions__Output } from './google/protobuf/OneofOptions';
import type { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from './google/protobuf/ServiceDescriptorProto';
import type { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from './google/protobuf/ServiceOptions';
import type { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from './google/protobuf/SourceCodeInfo';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from './google/protobuf/UninterpretedOption';
import type { HttpBody as _yamcs_api_HttpBody, HttpBody__Output as _yamcs_api_HttpBody__Output } from './yamcs/api/HttpBody';
import type { HttpRoute as _yamcs_api_HttpRoute, HttpRoute__Output as _yamcs_api_HttpRoute__Output } from './yamcs/api/HttpRoute';
import type { WebSocketTopic as _yamcs_api_WebSocketTopic, WebSocketTopic__Output as _yamcs_api_WebSocketTopic__Output } from './yamcs/api/WebSocketTopic';
import type { CreateEventRequest as _yamcs_protobuf_events_CreateEventRequest, CreateEventRequest__Output as _yamcs_protobuf_events_CreateEventRequest__Output } from './yamcs/protobuf/events/CreateEventRequest';
import type { Event as _yamcs_protobuf_events_Event, Event__Output as _yamcs_protobuf_events_Event__Output } from './yamcs/protobuf/events/Event';
import type { EventsApiClient as _yamcs_protobuf_events_EventsApiClient, EventsApiDefinition as _yamcs_protobuf_events_EventsApiDefinition } from './yamcs/protobuf/events/EventsApi';
import type { ExportEventsRequest as _yamcs_protobuf_events_ExportEventsRequest, ExportEventsRequest__Output as _yamcs_protobuf_events_ExportEventsRequest__Output } from './yamcs/protobuf/events/ExportEventsRequest';
import type { ListEventSourcesRequest as _yamcs_protobuf_events_ListEventSourcesRequest, ListEventSourcesRequest__Output as _yamcs_protobuf_events_ListEventSourcesRequest__Output } from './yamcs/protobuf/events/ListEventSourcesRequest';
import type { ListEventSourcesResponse as _yamcs_protobuf_events_ListEventSourcesResponse, ListEventSourcesResponse__Output as _yamcs_protobuf_events_ListEventSourcesResponse__Output } from './yamcs/protobuf/events/ListEventSourcesResponse';
import type { ListEventsRequest as _yamcs_protobuf_events_ListEventsRequest, ListEventsRequest__Output as _yamcs_protobuf_events_ListEventsRequest__Output } from './yamcs/protobuf/events/ListEventsRequest';
import type { ListEventsResponse as _yamcs_protobuf_events_ListEventsResponse, ListEventsResponse__Output as _yamcs_protobuf_events_ListEventsResponse__Output } from './yamcs/protobuf/events/ListEventsResponse';
import type { StreamEventsRequest as _yamcs_protobuf_events_StreamEventsRequest, StreamEventsRequest__Output as _yamcs_protobuf_events_StreamEventsRequest__Output } from './yamcs/protobuf/events/StreamEventsRequest';
import type { SubscribeEventsRequest as _yamcs_protobuf_events_SubscribeEventsRequest, SubscribeEventsRequest__Output as _yamcs_protobuf_events_SubscribeEventsRequest__Output } from './yamcs/protobuf/events/SubscribeEventsRequest';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      DescriptorProto: MessageTypeDefinition<_google_protobuf_DescriptorProto, _google_protobuf_DescriptorProto__Output>
      Edition: EnumTypeDefinition
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
      MessageOptions: MessageTypeDefinition<_google_protobuf_MessageOptions, _google_protobuf_MessageOptions__Output>
      MethodDescriptorProto: MessageTypeDefinition<_google_protobuf_MethodDescriptorProto, _google_protobuf_MethodDescriptorProto__Output>
      MethodOptions: MessageTypeDefinition<_google_protobuf_MethodOptions, _google_protobuf_MethodOptions__Output>
      OneofDescriptorProto: MessageTypeDefinition<_google_protobuf_OneofDescriptorProto, _google_protobuf_OneofDescriptorProto__Output>
      OneofOptions: MessageTypeDefinition<_google_protobuf_OneofOptions, _google_protobuf_OneofOptions__Output>
      ServiceDescriptorProto: MessageTypeDefinition<_google_protobuf_ServiceDescriptorProto, _google_protobuf_ServiceDescriptorProto__Output>
      ServiceOptions: MessageTypeDefinition<_google_protobuf_ServiceOptions, _google_protobuf_ServiceOptions__Output>
      SourceCodeInfo: MessageTypeDefinition<_google_protobuf_SourceCodeInfo, _google_protobuf_SourceCodeInfo__Output>
      SymbolVisibility: EnumTypeDefinition
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
      UninterpretedOption: MessageTypeDefinition<_google_protobuf_UninterpretedOption, _google_protobuf_UninterpretedOption__Output>
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
      events: {
        CreateEventRequest: MessageTypeDefinition<_yamcs_protobuf_events_CreateEventRequest, _yamcs_protobuf_events_CreateEventRequest__Output>
        Event: MessageTypeDefinition<_yamcs_protobuf_events_Event, _yamcs_protobuf_events_Event__Output>
        EventsApi: SubtypeConstructor<typeof grpc.Client, _yamcs_protobuf_events_EventsApiClient> & { service: _yamcs_protobuf_events_EventsApiDefinition }
        ExportEventsRequest: MessageTypeDefinition<_yamcs_protobuf_events_ExportEventsRequest, _yamcs_protobuf_events_ExportEventsRequest__Output>
        ListEventSourcesRequest: MessageTypeDefinition<_yamcs_protobuf_events_ListEventSourcesRequest, _yamcs_protobuf_events_ListEventSourcesRequest__Output>
        ListEventSourcesResponse: MessageTypeDefinition<_yamcs_protobuf_events_ListEventSourcesResponse, _yamcs_protobuf_events_ListEventSourcesResponse__Output>
        ListEventsRequest: MessageTypeDefinition<_yamcs_protobuf_events_ListEventsRequest, _yamcs_protobuf_events_ListEventsRequest__Output>
        ListEventsResponse: MessageTypeDefinition<_yamcs_protobuf_events_ListEventsResponse, _yamcs_protobuf_events_ListEventsResponse__Output>
        StreamEventsRequest: MessageTypeDefinition<_yamcs_protobuf_events_StreamEventsRequest, _yamcs_protobuf_events_StreamEventsRequest__Output>
        SubscribeEventsRequest: MessageTypeDefinition<_yamcs_protobuf_events_SubscribeEventsRequest, _yamcs_protobuf_events_SubscribeEventsRequest__Output>
      }
    }
  }
}

