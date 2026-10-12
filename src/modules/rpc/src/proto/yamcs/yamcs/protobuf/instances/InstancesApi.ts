// Original file: proto/yamcs/protobuf/instances/instances_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CreateInstanceRequest as _yamcs_protobuf_instances_CreateInstanceRequest, CreateInstanceRequest__Output as _yamcs_protobuf_instances_CreateInstanceRequest__Output } from '../../../yamcs/protobuf/instances/CreateInstanceRequest';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../google/protobuf/Empty';
import type { GetInstanceRequest as _yamcs_protobuf_instances_GetInstanceRequest, GetInstanceRequest__Output as _yamcs_protobuf_instances_GetInstanceRequest__Output } from '../../../yamcs/protobuf/instances/GetInstanceRequest';
import type { GetInstanceTemplateRequest as _yamcs_protobuf_instances_GetInstanceTemplateRequest, GetInstanceTemplateRequest__Output as _yamcs_protobuf_instances_GetInstanceTemplateRequest__Output } from '../../../yamcs/protobuf/instances/GetInstanceTemplateRequest';
import type { InstanceTemplate as _yamcs_protobuf_instances_InstanceTemplate, InstanceTemplate__Output as _yamcs_protobuf_instances_InstanceTemplate__Output } from '../../../yamcs/protobuf/instances/InstanceTemplate';
import type { ListInstanceTemplatesResponse as _yamcs_protobuf_instances_ListInstanceTemplatesResponse, ListInstanceTemplatesResponse__Output as _yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output } from '../../../yamcs/protobuf/instances/ListInstanceTemplatesResponse';
import type { ListInstancesRequest as _yamcs_protobuf_instances_ListInstancesRequest, ListInstancesRequest__Output as _yamcs_protobuf_instances_ListInstancesRequest__Output } from '../../../yamcs/protobuf/instances/ListInstancesRequest';
import type { ListInstancesResponse as _yamcs_protobuf_instances_ListInstancesResponse, ListInstancesResponse__Output as _yamcs_protobuf_instances_ListInstancesResponse__Output } from '../../../yamcs/protobuf/instances/ListInstancesResponse';
import type { ReconfigureInstanceRequest as _yamcs_protobuf_instances_ReconfigureInstanceRequest, ReconfigureInstanceRequest__Output as _yamcs_protobuf_instances_ReconfigureInstanceRequest__Output } from '../../../yamcs/protobuf/instances/ReconfigureInstanceRequest';
import type { RestartInstanceRequest as _yamcs_protobuf_instances_RestartInstanceRequest, RestartInstanceRequest__Output as _yamcs_protobuf_instances_RestartInstanceRequest__Output } from '../../../yamcs/protobuf/instances/RestartInstanceRequest';
import type { StartInstanceRequest as _yamcs_protobuf_instances_StartInstanceRequest, StartInstanceRequest__Output as _yamcs_protobuf_instances_StartInstanceRequest__Output } from '../../../yamcs/protobuf/instances/StartInstanceRequest';
import type { StopInstanceRequest as _yamcs_protobuf_instances_StopInstanceRequest, StopInstanceRequest__Output as _yamcs_protobuf_instances_StopInstanceRequest__Output } from '../../../yamcs/protobuf/instances/StopInstanceRequest';
import type { YamcsInstance as _yamcs_protobuf_instances_YamcsInstance, YamcsInstance__Output as _yamcs_protobuf_instances_YamcsInstance__Output } from '../../../yamcs/protobuf/instances/YamcsInstance';

export interface InstancesApiClient extends grpc.Client {
  CreateInstance(argument: _yamcs_protobuf_instances_CreateInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  CreateInstance(argument: _yamcs_protobuf_instances_CreateInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  CreateInstance(argument: _yamcs_protobuf_instances_CreateInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  CreateInstance(argument: _yamcs_protobuf_instances_CreateInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  createInstance(argument: _yamcs_protobuf_instances_CreateInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  createInstance(argument: _yamcs_protobuf_instances_CreateInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  createInstance(argument: _yamcs_protobuf_instances_CreateInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  createInstance(argument: _yamcs_protobuf_instances_CreateInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  
  GetInstance(argument: _yamcs_protobuf_instances_GetInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  GetInstance(argument: _yamcs_protobuf_instances_GetInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  GetInstance(argument: _yamcs_protobuf_instances_GetInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  GetInstance(argument: _yamcs_protobuf_instances_GetInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  getInstance(argument: _yamcs_protobuf_instances_GetInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  getInstance(argument: _yamcs_protobuf_instances_GetInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  getInstance(argument: _yamcs_protobuf_instances_GetInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  getInstance(argument: _yamcs_protobuf_instances_GetInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  
  GetInstanceTemplate(argument: _yamcs_protobuf_instances_GetInstanceTemplateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_InstanceTemplate__Output>): grpc.ClientUnaryCall;
  GetInstanceTemplate(argument: _yamcs_protobuf_instances_GetInstanceTemplateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_InstanceTemplate__Output>): grpc.ClientUnaryCall;
  GetInstanceTemplate(argument: _yamcs_protobuf_instances_GetInstanceTemplateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_InstanceTemplate__Output>): grpc.ClientUnaryCall;
  GetInstanceTemplate(argument: _yamcs_protobuf_instances_GetInstanceTemplateRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_InstanceTemplate__Output>): grpc.ClientUnaryCall;
  getInstanceTemplate(argument: _yamcs_protobuf_instances_GetInstanceTemplateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_InstanceTemplate__Output>): grpc.ClientUnaryCall;
  getInstanceTemplate(argument: _yamcs_protobuf_instances_GetInstanceTemplateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_InstanceTemplate__Output>): grpc.ClientUnaryCall;
  getInstanceTemplate(argument: _yamcs_protobuf_instances_GetInstanceTemplateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_InstanceTemplate__Output>): grpc.ClientUnaryCall;
  getInstanceTemplate(argument: _yamcs_protobuf_instances_GetInstanceTemplateRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_InstanceTemplate__Output>): grpc.ClientUnaryCall;
  
  ListInstanceTemplates(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>): grpc.ClientUnaryCall;
  ListInstanceTemplates(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>): grpc.ClientUnaryCall;
  ListInstanceTemplates(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>): grpc.ClientUnaryCall;
  ListInstanceTemplates(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>): grpc.ClientUnaryCall;
  listInstanceTemplates(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>): grpc.ClientUnaryCall;
  listInstanceTemplates(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>): grpc.ClientUnaryCall;
  listInstanceTemplates(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>): grpc.ClientUnaryCall;
  listInstanceTemplates(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>): grpc.ClientUnaryCall;
  
  ListInstances(argument: _yamcs_protobuf_instances_ListInstancesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstancesResponse__Output>): grpc.ClientUnaryCall;
  ListInstances(argument: _yamcs_protobuf_instances_ListInstancesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstancesResponse__Output>): grpc.ClientUnaryCall;
  ListInstances(argument: _yamcs_protobuf_instances_ListInstancesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstancesResponse__Output>): grpc.ClientUnaryCall;
  ListInstances(argument: _yamcs_protobuf_instances_ListInstancesRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstancesResponse__Output>): grpc.ClientUnaryCall;
  listInstances(argument: _yamcs_protobuf_instances_ListInstancesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstancesResponse__Output>): grpc.ClientUnaryCall;
  listInstances(argument: _yamcs_protobuf_instances_ListInstancesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstancesResponse__Output>): grpc.ClientUnaryCall;
  listInstances(argument: _yamcs_protobuf_instances_ListInstancesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstancesResponse__Output>): grpc.ClientUnaryCall;
  listInstances(argument: _yamcs_protobuf_instances_ListInstancesRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_ListInstancesResponse__Output>): grpc.ClientUnaryCall;
  
  ReconfigureInstance(argument: _yamcs_protobuf_instances_ReconfigureInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  ReconfigureInstance(argument: _yamcs_protobuf_instances_ReconfigureInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  ReconfigureInstance(argument: _yamcs_protobuf_instances_ReconfigureInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  ReconfigureInstance(argument: _yamcs_protobuf_instances_ReconfigureInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  reconfigureInstance(argument: _yamcs_protobuf_instances_ReconfigureInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  reconfigureInstance(argument: _yamcs_protobuf_instances_ReconfigureInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  reconfigureInstance(argument: _yamcs_protobuf_instances_ReconfigureInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  reconfigureInstance(argument: _yamcs_protobuf_instances_ReconfigureInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  
  RestartInstance(argument: _yamcs_protobuf_instances_RestartInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  RestartInstance(argument: _yamcs_protobuf_instances_RestartInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  RestartInstance(argument: _yamcs_protobuf_instances_RestartInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  RestartInstance(argument: _yamcs_protobuf_instances_RestartInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  restartInstance(argument: _yamcs_protobuf_instances_RestartInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  restartInstance(argument: _yamcs_protobuf_instances_RestartInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  restartInstance(argument: _yamcs_protobuf_instances_RestartInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  restartInstance(argument: _yamcs_protobuf_instances_RestartInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  
  StartInstance(argument: _yamcs_protobuf_instances_StartInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  StartInstance(argument: _yamcs_protobuf_instances_StartInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  StartInstance(argument: _yamcs_protobuf_instances_StartInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  StartInstance(argument: _yamcs_protobuf_instances_StartInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  startInstance(argument: _yamcs_protobuf_instances_StartInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  startInstance(argument: _yamcs_protobuf_instances_StartInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  startInstance(argument: _yamcs_protobuf_instances_StartInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  startInstance(argument: _yamcs_protobuf_instances_StartInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  
  StopInstance(argument: _yamcs_protobuf_instances_StopInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  StopInstance(argument: _yamcs_protobuf_instances_StopInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  StopInstance(argument: _yamcs_protobuf_instances_StopInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  StopInstance(argument: _yamcs_protobuf_instances_StopInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  stopInstance(argument: _yamcs_protobuf_instances_StopInstanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  stopInstance(argument: _yamcs_protobuf_instances_StopInstanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  stopInstance(argument: _yamcs_protobuf_instances_StopInstanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  stopInstance(argument: _yamcs_protobuf_instances_StopInstanceRequest, callback: grpc.requestCallback<_yamcs_protobuf_instances_YamcsInstance__Output>): grpc.ClientUnaryCall;
  
  SubscribeInstances(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_instances_YamcsInstance__Output>;
  SubscribeInstances(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_instances_YamcsInstance__Output>;
  subscribeInstances(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_instances_YamcsInstance__Output>;
  subscribeInstances(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_instances_YamcsInstance__Output>;
  
}

export interface InstancesApiHandlers extends grpc.UntypedServiceImplementation {
  CreateInstance: grpc.handleUnaryCall<_yamcs_protobuf_instances_CreateInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance>;
  
  GetInstance: grpc.handleUnaryCall<_yamcs_protobuf_instances_GetInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance>;
  
  GetInstanceTemplate: grpc.handleUnaryCall<_yamcs_protobuf_instances_GetInstanceTemplateRequest__Output, _yamcs_protobuf_instances_InstanceTemplate>;
  
  ListInstanceTemplates: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _yamcs_protobuf_instances_ListInstanceTemplatesResponse>;
  
  ListInstances: grpc.handleUnaryCall<_yamcs_protobuf_instances_ListInstancesRequest__Output, _yamcs_protobuf_instances_ListInstancesResponse>;
  
  ReconfigureInstance: grpc.handleUnaryCall<_yamcs_protobuf_instances_ReconfigureInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance>;
  
  RestartInstance: grpc.handleUnaryCall<_yamcs_protobuf_instances_RestartInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance>;
  
  StartInstance: grpc.handleUnaryCall<_yamcs_protobuf_instances_StartInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance>;
  
  StopInstance: grpc.handleUnaryCall<_yamcs_protobuf_instances_StopInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance>;
  
  SubscribeInstances: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _yamcs_protobuf_instances_YamcsInstance>;
  
}

export interface InstancesApiDefinition extends grpc.ServiceDefinition {
  CreateInstance: MethodDefinition<_yamcs_protobuf_instances_CreateInstanceRequest, _yamcs_protobuf_instances_YamcsInstance, _yamcs_protobuf_instances_CreateInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance__Output>
  GetInstance: MethodDefinition<_yamcs_protobuf_instances_GetInstanceRequest, _yamcs_protobuf_instances_YamcsInstance, _yamcs_protobuf_instances_GetInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance__Output>
  GetInstanceTemplate: MethodDefinition<_yamcs_protobuf_instances_GetInstanceTemplateRequest, _yamcs_protobuf_instances_InstanceTemplate, _yamcs_protobuf_instances_GetInstanceTemplateRequest__Output, _yamcs_protobuf_instances_InstanceTemplate__Output>
  ListInstanceTemplates: MethodDefinition<_google_protobuf_Empty, _yamcs_protobuf_instances_ListInstanceTemplatesResponse, _google_protobuf_Empty__Output, _yamcs_protobuf_instances_ListInstanceTemplatesResponse__Output>
  ListInstances: MethodDefinition<_yamcs_protobuf_instances_ListInstancesRequest, _yamcs_protobuf_instances_ListInstancesResponse, _yamcs_protobuf_instances_ListInstancesRequest__Output, _yamcs_protobuf_instances_ListInstancesResponse__Output>
  ReconfigureInstance: MethodDefinition<_yamcs_protobuf_instances_ReconfigureInstanceRequest, _yamcs_protobuf_instances_YamcsInstance, _yamcs_protobuf_instances_ReconfigureInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance__Output>
  RestartInstance: MethodDefinition<_yamcs_protobuf_instances_RestartInstanceRequest, _yamcs_protobuf_instances_YamcsInstance, _yamcs_protobuf_instances_RestartInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance__Output>
  StartInstance: MethodDefinition<_yamcs_protobuf_instances_StartInstanceRequest, _yamcs_protobuf_instances_YamcsInstance, _yamcs_protobuf_instances_StartInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance__Output>
  StopInstance: MethodDefinition<_yamcs_protobuf_instances_StopInstanceRequest, _yamcs_protobuf_instances_YamcsInstance, _yamcs_protobuf_instances_StopInstanceRequest__Output, _yamcs_protobuf_instances_YamcsInstance__Output>
  SubscribeInstances: MethodDefinition<_google_protobuf_Empty, _yamcs_protobuf_instances_YamcsInstance, _google_protobuf_Empty__Output, _yamcs_protobuf_instances_YamcsInstance__Output>
}
