// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AlgorithmInfo as _yamcs_protobuf_mdb_AlgorithmInfo, AlgorithmInfo__Output as _yamcs_protobuf_mdb_AlgorithmInfo__Output } from '../../../yamcs/protobuf/mdb/AlgorithmInfo';
import type { BatchGetParametersRequest as _yamcs_protobuf_mdb_BatchGetParametersRequest, BatchGetParametersRequest__Output as _yamcs_protobuf_mdb_BatchGetParametersRequest__Output } from '../../../yamcs/protobuf/mdb/BatchGetParametersRequest';
import type { BatchGetParametersResponse as _yamcs_protobuf_mdb_BatchGetParametersResponse, BatchGetParametersResponse__Output as _yamcs_protobuf_mdb_BatchGetParametersResponse__Output } from '../../../yamcs/protobuf/mdb/BatchGetParametersResponse';
import type { CommandInfo as _yamcs_protobuf_mdb_CommandInfo, CommandInfo__Output as _yamcs_protobuf_mdb_CommandInfo__Output } from '../../../yamcs/protobuf/mdb/CommandInfo';
import type { ContainerInfo as _yamcs_protobuf_mdb_ContainerInfo, ContainerInfo__Output as _yamcs_protobuf_mdb_ContainerInfo__Output } from '../../../yamcs/protobuf/mdb/ContainerInfo';
import type { CreateParameterRequest as _yamcs_protobuf_mdb_CreateParameterRequest, CreateParameterRequest__Output as _yamcs_protobuf_mdb_CreateParameterRequest__Output } from '../../../yamcs/protobuf/mdb/CreateParameterRequest';
import type { CreateParameterTypeRequest as _yamcs_protobuf_mdb_CreateParameterTypeRequest, CreateParameterTypeRequest__Output as _yamcs_protobuf_mdb_CreateParameterTypeRequest__Output } from '../../../yamcs/protobuf/mdb/CreateParameterTypeRequest';
import type { ExportJavaMissionDatabaseRequest as _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, ExportJavaMissionDatabaseRequest__Output as _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest__Output } from '../../../yamcs/protobuf/mdb/ExportJavaMissionDatabaseRequest';
import type { ExportXtceRequest as _yamcs_protobuf_mdb_ExportXtceRequest, ExportXtceRequest__Output as _yamcs_protobuf_mdb_ExportXtceRequest__Output } from '../../../yamcs/protobuf/mdb/ExportXtceRequest';
import type { GetAlgorithmRequest as _yamcs_protobuf_mdb_GetAlgorithmRequest, GetAlgorithmRequest__Output as _yamcs_protobuf_mdb_GetAlgorithmRequest__Output } from '../../../yamcs/protobuf/mdb/GetAlgorithmRequest';
import type { GetCommandRequest as _yamcs_protobuf_mdb_GetCommandRequest, GetCommandRequest__Output as _yamcs_protobuf_mdb_GetCommandRequest__Output } from '../../../yamcs/protobuf/mdb/GetCommandRequest';
import type { GetContainerRequest as _yamcs_protobuf_mdb_GetContainerRequest, GetContainerRequest__Output as _yamcs_protobuf_mdb_GetContainerRequest__Output } from '../../../yamcs/protobuf/mdb/GetContainerRequest';
import type { GetMissionDatabaseRequest as _yamcs_protobuf_mdb_GetMissionDatabaseRequest, GetMissionDatabaseRequest__Output as _yamcs_protobuf_mdb_GetMissionDatabaseRequest__Output } from '../../../yamcs/protobuf/mdb/GetMissionDatabaseRequest';
import type { GetParameterRequest as _yamcs_protobuf_mdb_GetParameterRequest, GetParameterRequest__Output as _yamcs_protobuf_mdb_GetParameterRequest__Output } from '../../../yamcs/protobuf/mdb/GetParameterRequest';
import type { GetParameterTypeRequest as _yamcs_protobuf_mdb_GetParameterTypeRequest, GetParameterTypeRequest__Output as _yamcs_protobuf_mdb_GetParameterTypeRequest__Output } from '../../../yamcs/protobuf/mdb/GetParameterTypeRequest';
import type { GetSpaceSystemRequest as _yamcs_protobuf_mdb_GetSpaceSystemRequest, GetSpaceSystemRequest__Output as _yamcs_protobuf_mdb_GetSpaceSystemRequest__Output } from '../../../yamcs/protobuf/mdb/GetSpaceSystemRequest';
import type { HttpBody as _yamcs_api_HttpBody, HttpBody__Output as _yamcs_api_HttpBody__Output } from '../../../yamcs/api/HttpBody';
import type { ListAlgorithmsRequest as _yamcs_protobuf_mdb_ListAlgorithmsRequest, ListAlgorithmsRequest__Output as _yamcs_protobuf_mdb_ListAlgorithmsRequest__Output } from '../../../yamcs/protobuf/mdb/ListAlgorithmsRequest';
import type { ListAlgorithmsResponse as _yamcs_protobuf_mdb_ListAlgorithmsResponse, ListAlgorithmsResponse__Output as _yamcs_protobuf_mdb_ListAlgorithmsResponse__Output } from '../../../yamcs/protobuf/mdb/ListAlgorithmsResponse';
import type { ListCommandsRequest as _yamcs_protobuf_mdb_ListCommandsRequest, ListCommandsRequest__Output as _yamcs_protobuf_mdb_ListCommandsRequest__Output } from '../../../yamcs/protobuf/mdb/ListCommandsRequest';
import type { ListCommandsResponse as _yamcs_protobuf_mdb_ListCommandsResponse, ListCommandsResponse__Output as _yamcs_protobuf_mdb_ListCommandsResponse__Output } from '../../../yamcs/protobuf/mdb/ListCommandsResponse';
import type { ListContainersRequest as _yamcs_protobuf_mdb_ListContainersRequest, ListContainersRequest__Output as _yamcs_protobuf_mdb_ListContainersRequest__Output } from '../../../yamcs/protobuf/mdb/ListContainersRequest';
import type { ListContainersResponse as _yamcs_protobuf_mdb_ListContainersResponse, ListContainersResponse__Output as _yamcs_protobuf_mdb_ListContainersResponse__Output } from '../../../yamcs/protobuf/mdb/ListContainersResponse';
import type { ListParameterTypesRequest as _yamcs_protobuf_mdb_ListParameterTypesRequest, ListParameterTypesRequest__Output as _yamcs_protobuf_mdb_ListParameterTypesRequest__Output } from '../../../yamcs/protobuf/mdb/ListParameterTypesRequest';
import type { ListParameterTypesResponse as _yamcs_protobuf_mdb_ListParameterTypesResponse, ListParameterTypesResponse__Output as _yamcs_protobuf_mdb_ListParameterTypesResponse__Output } from '../../../yamcs/protobuf/mdb/ListParameterTypesResponse';
import type { ListParametersRequest as _yamcs_protobuf_mdb_ListParametersRequest, ListParametersRequest__Output as _yamcs_protobuf_mdb_ListParametersRequest__Output } from '../../../yamcs/protobuf/mdb/ListParametersRequest';
import type { ListParametersResponse as _yamcs_protobuf_mdb_ListParametersResponse, ListParametersResponse__Output as _yamcs_protobuf_mdb_ListParametersResponse__Output } from '../../../yamcs/protobuf/mdb/ListParametersResponse';
import type { ListSpaceSystemsRequest as _yamcs_protobuf_mdb_ListSpaceSystemsRequest, ListSpaceSystemsRequest__Output as _yamcs_protobuf_mdb_ListSpaceSystemsRequest__Output } from '../../../yamcs/protobuf/mdb/ListSpaceSystemsRequest';
import type { ListSpaceSystemsResponse as _yamcs_protobuf_mdb_ListSpaceSystemsResponse, ListSpaceSystemsResponse__Output as _yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output } from '../../../yamcs/protobuf/mdb/ListSpaceSystemsResponse';
import type { MissionDatabase as _yamcs_protobuf_mdb_MissionDatabase, MissionDatabase__Output as _yamcs_protobuf_mdb_MissionDatabase__Output } from '../../../yamcs/protobuf/mdb/MissionDatabase';
import type { MissionDatabaseItem as _yamcs_protobuf_mdb_MissionDatabaseItem, MissionDatabaseItem__Output as _yamcs_protobuf_mdb_MissionDatabaseItem__Output } from '../../../yamcs/protobuf/mdb/MissionDatabaseItem';
import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { ParameterTypeInfo as _yamcs_protobuf_mdb_ParameterTypeInfo, ParameterTypeInfo__Output as _yamcs_protobuf_mdb_ParameterTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterTypeInfo';
import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';
import type { StreamMissionDatabaseRequest as _yamcs_protobuf_mdb_StreamMissionDatabaseRequest, StreamMissionDatabaseRequest__Output as _yamcs_protobuf_mdb_StreamMissionDatabaseRequest__Output } from '../../../yamcs/protobuf/mdb/StreamMissionDatabaseRequest';

export interface MdbApiClient extends grpc.Client {
  BatchGetParameters(argument: _yamcs_protobuf_mdb_BatchGetParametersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_BatchGetParametersResponse__Output>): grpc.ClientUnaryCall;
  BatchGetParameters(argument: _yamcs_protobuf_mdb_BatchGetParametersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_BatchGetParametersResponse__Output>): grpc.ClientUnaryCall;
  BatchGetParameters(argument: _yamcs_protobuf_mdb_BatchGetParametersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_BatchGetParametersResponse__Output>): grpc.ClientUnaryCall;
  BatchGetParameters(argument: _yamcs_protobuf_mdb_BatchGetParametersRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_BatchGetParametersResponse__Output>): grpc.ClientUnaryCall;
  batchGetParameters(argument: _yamcs_protobuf_mdb_BatchGetParametersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_BatchGetParametersResponse__Output>): grpc.ClientUnaryCall;
  batchGetParameters(argument: _yamcs_protobuf_mdb_BatchGetParametersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_BatchGetParametersResponse__Output>): grpc.ClientUnaryCall;
  batchGetParameters(argument: _yamcs_protobuf_mdb_BatchGetParametersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_BatchGetParametersResponse__Output>): grpc.ClientUnaryCall;
  batchGetParameters(argument: _yamcs_protobuf_mdb_BatchGetParametersRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_BatchGetParametersResponse__Output>): grpc.ClientUnaryCall;
  
  CreateParameter(argument: _yamcs_protobuf_mdb_CreateParameterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  CreateParameter(argument: _yamcs_protobuf_mdb_CreateParameterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  CreateParameter(argument: _yamcs_protobuf_mdb_CreateParameterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  CreateParameter(argument: _yamcs_protobuf_mdb_CreateParameterRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  createParameter(argument: _yamcs_protobuf_mdb_CreateParameterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  createParameter(argument: _yamcs_protobuf_mdb_CreateParameterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  createParameter(argument: _yamcs_protobuf_mdb_CreateParameterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  createParameter(argument: _yamcs_protobuf_mdb_CreateParameterRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  
  CreateParameterType(argument: _yamcs_protobuf_mdb_CreateParameterTypeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  CreateParameterType(argument: _yamcs_protobuf_mdb_CreateParameterTypeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  CreateParameterType(argument: _yamcs_protobuf_mdb_CreateParameterTypeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  CreateParameterType(argument: _yamcs_protobuf_mdb_CreateParameterTypeRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  createParameterType(argument: _yamcs_protobuf_mdb_CreateParameterTypeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  createParameterType(argument: _yamcs_protobuf_mdb_CreateParameterTypeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  createParameterType(argument: _yamcs_protobuf_mdb_CreateParameterTypeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  createParameterType(argument: _yamcs_protobuf_mdb_CreateParameterTypeRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  
  ExportJavaMissionDatabase(argument: _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportJavaMissionDatabase(argument: _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportJavaMissionDatabase(argument: _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportJavaMissionDatabase(argument: _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportJavaMissionDatabase(argument: _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportJavaMissionDatabase(argument: _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportJavaMissionDatabase(argument: _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportJavaMissionDatabase(argument: _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  
  ExportXtce(argument: _yamcs_protobuf_mdb_ExportXtceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportXtce(argument: _yamcs_protobuf_mdb_ExportXtceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportXtce(argument: _yamcs_protobuf_mdb_ExportXtceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  ExportXtce(argument: _yamcs_protobuf_mdb_ExportXtceRequest, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportXtce(argument: _yamcs_protobuf_mdb_ExportXtceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportXtce(argument: _yamcs_protobuf_mdb_ExportXtceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportXtce(argument: _yamcs_protobuf_mdb_ExportXtceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  exportXtce(argument: _yamcs_protobuf_mdb_ExportXtceRequest, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  
  GetAlgorithm(argument: _yamcs_protobuf_mdb_GetAlgorithmRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_AlgorithmInfo__Output>): grpc.ClientUnaryCall;
  GetAlgorithm(argument: _yamcs_protobuf_mdb_GetAlgorithmRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_AlgorithmInfo__Output>): grpc.ClientUnaryCall;
  GetAlgorithm(argument: _yamcs_protobuf_mdb_GetAlgorithmRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_AlgorithmInfo__Output>): grpc.ClientUnaryCall;
  GetAlgorithm(argument: _yamcs_protobuf_mdb_GetAlgorithmRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_AlgorithmInfo__Output>): grpc.ClientUnaryCall;
  getAlgorithm(argument: _yamcs_protobuf_mdb_GetAlgorithmRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_AlgorithmInfo__Output>): grpc.ClientUnaryCall;
  getAlgorithm(argument: _yamcs_protobuf_mdb_GetAlgorithmRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_AlgorithmInfo__Output>): grpc.ClientUnaryCall;
  getAlgorithm(argument: _yamcs_protobuf_mdb_GetAlgorithmRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_AlgorithmInfo__Output>): grpc.ClientUnaryCall;
  getAlgorithm(argument: _yamcs_protobuf_mdb_GetAlgorithmRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_AlgorithmInfo__Output>): grpc.ClientUnaryCall;
  
  GetCommand(argument: _yamcs_protobuf_mdb_GetCommandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_CommandInfo__Output>): grpc.ClientUnaryCall;
  GetCommand(argument: _yamcs_protobuf_mdb_GetCommandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_CommandInfo__Output>): grpc.ClientUnaryCall;
  GetCommand(argument: _yamcs_protobuf_mdb_GetCommandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_CommandInfo__Output>): grpc.ClientUnaryCall;
  GetCommand(argument: _yamcs_protobuf_mdb_GetCommandRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_CommandInfo__Output>): grpc.ClientUnaryCall;
  getCommand(argument: _yamcs_protobuf_mdb_GetCommandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_CommandInfo__Output>): grpc.ClientUnaryCall;
  getCommand(argument: _yamcs_protobuf_mdb_GetCommandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_CommandInfo__Output>): grpc.ClientUnaryCall;
  getCommand(argument: _yamcs_protobuf_mdb_GetCommandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_CommandInfo__Output>): grpc.ClientUnaryCall;
  getCommand(argument: _yamcs_protobuf_mdb_GetCommandRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_CommandInfo__Output>): grpc.ClientUnaryCall;
  
  GetContainer(argument: _yamcs_protobuf_mdb_GetContainerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ContainerInfo__Output>): grpc.ClientUnaryCall;
  GetContainer(argument: _yamcs_protobuf_mdb_GetContainerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ContainerInfo__Output>): grpc.ClientUnaryCall;
  GetContainer(argument: _yamcs_protobuf_mdb_GetContainerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ContainerInfo__Output>): grpc.ClientUnaryCall;
  GetContainer(argument: _yamcs_protobuf_mdb_GetContainerRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ContainerInfo__Output>): grpc.ClientUnaryCall;
  getContainer(argument: _yamcs_protobuf_mdb_GetContainerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ContainerInfo__Output>): grpc.ClientUnaryCall;
  getContainer(argument: _yamcs_protobuf_mdb_GetContainerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ContainerInfo__Output>): grpc.ClientUnaryCall;
  getContainer(argument: _yamcs_protobuf_mdb_GetContainerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ContainerInfo__Output>): grpc.ClientUnaryCall;
  getContainer(argument: _yamcs_protobuf_mdb_GetContainerRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ContainerInfo__Output>): grpc.ClientUnaryCall;
  
  GetMissionDatabase(argument: _yamcs_protobuf_mdb_GetMissionDatabaseRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_MissionDatabase__Output>): grpc.ClientUnaryCall;
  GetMissionDatabase(argument: _yamcs_protobuf_mdb_GetMissionDatabaseRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_MissionDatabase__Output>): grpc.ClientUnaryCall;
  GetMissionDatabase(argument: _yamcs_protobuf_mdb_GetMissionDatabaseRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_MissionDatabase__Output>): grpc.ClientUnaryCall;
  GetMissionDatabase(argument: _yamcs_protobuf_mdb_GetMissionDatabaseRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_MissionDatabase__Output>): grpc.ClientUnaryCall;
  getMissionDatabase(argument: _yamcs_protobuf_mdb_GetMissionDatabaseRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_MissionDatabase__Output>): grpc.ClientUnaryCall;
  getMissionDatabase(argument: _yamcs_protobuf_mdb_GetMissionDatabaseRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_MissionDatabase__Output>): grpc.ClientUnaryCall;
  getMissionDatabase(argument: _yamcs_protobuf_mdb_GetMissionDatabaseRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_MissionDatabase__Output>): grpc.ClientUnaryCall;
  getMissionDatabase(argument: _yamcs_protobuf_mdb_GetMissionDatabaseRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_MissionDatabase__Output>): grpc.ClientUnaryCall;
  
  GetParameter(argument: _yamcs_protobuf_mdb_GetParameterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  GetParameter(argument: _yamcs_protobuf_mdb_GetParameterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  GetParameter(argument: _yamcs_protobuf_mdb_GetParameterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  GetParameter(argument: _yamcs_protobuf_mdb_GetParameterRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  getParameter(argument: _yamcs_protobuf_mdb_GetParameterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  getParameter(argument: _yamcs_protobuf_mdb_GetParameterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  getParameter(argument: _yamcs_protobuf_mdb_GetParameterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  getParameter(argument: _yamcs_protobuf_mdb_GetParameterRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterInfo__Output>): grpc.ClientUnaryCall;
  
  GetParameterType(argument: _yamcs_protobuf_mdb_GetParameterTypeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  GetParameterType(argument: _yamcs_protobuf_mdb_GetParameterTypeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  GetParameterType(argument: _yamcs_protobuf_mdb_GetParameterTypeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  GetParameterType(argument: _yamcs_protobuf_mdb_GetParameterTypeRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  getParameterType(argument: _yamcs_protobuf_mdb_GetParameterTypeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  getParameterType(argument: _yamcs_protobuf_mdb_GetParameterTypeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  getParameterType(argument: _yamcs_protobuf_mdb_GetParameterTypeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  getParameterType(argument: _yamcs_protobuf_mdb_GetParameterTypeRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ParameterTypeInfo__Output>): grpc.ClientUnaryCall;
  
  GetSpaceSystem(argument: _yamcs_protobuf_mdb_GetSpaceSystemRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_SpaceSystemInfo__Output>): grpc.ClientUnaryCall;
  GetSpaceSystem(argument: _yamcs_protobuf_mdb_GetSpaceSystemRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_SpaceSystemInfo__Output>): grpc.ClientUnaryCall;
  GetSpaceSystem(argument: _yamcs_protobuf_mdb_GetSpaceSystemRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_SpaceSystemInfo__Output>): grpc.ClientUnaryCall;
  GetSpaceSystem(argument: _yamcs_protobuf_mdb_GetSpaceSystemRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_SpaceSystemInfo__Output>): grpc.ClientUnaryCall;
  getSpaceSystem(argument: _yamcs_protobuf_mdb_GetSpaceSystemRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_SpaceSystemInfo__Output>): grpc.ClientUnaryCall;
  getSpaceSystem(argument: _yamcs_protobuf_mdb_GetSpaceSystemRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_SpaceSystemInfo__Output>): grpc.ClientUnaryCall;
  getSpaceSystem(argument: _yamcs_protobuf_mdb_GetSpaceSystemRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_SpaceSystemInfo__Output>): grpc.ClientUnaryCall;
  getSpaceSystem(argument: _yamcs_protobuf_mdb_GetSpaceSystemRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_SpaceSystemInfo__Output>): grpc.ClientUnaryCall;
  
  ListAlgorithms(argument: _yamcs_protobuf_mdb_ListAlgorithmsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>): grpc.ClientUnaryCall;
  ListAlgorithms(argument: _yamcs_protobuf_mdb_ListAlgorithmsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>): grpc.ClientUnaryCall;
  ListAlgorithms(argument: _yamcs_protobuf_mdb_ListAlgorithmsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>): grpc.ClientUnaryCall;
  ListAlgorithms(argument: _yamcs_protobuf_mdb_ListAlgorithmsRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>): grpc.ClientUnaryCall;
  listAlgorithms(argument: _yamcs_protobuf_mdb_ListAlgorithmsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>): grpc.ClientUnaryCall;
  listAlgorithms(argument: _yamcs_protobuf_mdb_ListAlgorithmsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>): grpc.ClientUnaryCall;
  listAlgorithms(argument: _yamcs_protobuf_mdb_ListAlgorithmsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>): grpc.ClientUnaryCall;
  listAlgorithms(argument: _yamcs_protobuf_mdb_ListAlgorithmsRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>): grpc.ClientUnaryCall;
  
  ListCommands(argument: _yamcs_protobuf_mdb_ListCommandsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  ListCommands(argument: _yamcs_protobuf_mdb_ListCommandsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  ListCommands(argument: _yamcs_protobuf_mdb_ListCommandsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  ListCommands(argument: _yamcs_protobuf_mdb_ListCommandsRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  listCommands(argument: _yamcs_protobuf_mdb_ListCommandsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  listCommands(argument: _yamcs_protobuf_mdb_ListCommandsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  listCommands(argument: _yamcs_protobuf_mdb_ListCommandsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  listCommands(argument: _yamcs_protobuf_mdb_ListCommandsRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListCommandsResponse__Output>): grpc.ClientUnaryCall;
  
  ListContainers(argument: _yamcs_protobuf_mdb_ListContainersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListContainersResponse__Output>): grpc.ClientUnaryCall;
  ListContainers(argument: _yamcs_protobuf_mdb_ListContainersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListContainersResponse__Output>): grpc.ClientUnaryCall;
  ListContainers(argument: _yamcs_protobuf_mdb_ListContainersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListContainersResponse__Output>): grpc.ClientUnaryCall;
  ListContainers(argument: _yamcs_protobuf_mdb_ListContainersRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListContainersResponse__Output>): grpc.ClientUnaryCall;
  listContainers(argument: _yamcs_protobuf_mdb_ListContainersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListContainersResponse__Output>): grpc.ClientUnaryCall;
  listContainers(argument: _yamcs_protobuf_mdb_ListContainersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListContainersResponse__Output>): grpc.ClientUnaryCall;
  listContainers(argument: _yamcs_protobuf_mdb_ListContainersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListContainersResponse__Output>): grpc.ClientUnaryCall;
  listContainers(argument: _yamcs_protobuf_mdb_ListContainersRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListContainersResponse__Output>): grpc.ClientUnaryCall;
  
  ListParameterTypes(argument: _yamcs_protobuf_mdb_ListParameterTypesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParameterTypesResponse__Output>): grpc.ClientUnaryCall;
  ListParameterTypes(argument: _yamcs_protobuf_mdb_ListParameterTypesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParameterTypesResponse__Output>): grpc.ClientUnaryCall;
  ListParameterTypes(argument: _yamcs_protobuf_mdb_ListParameterTypesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParameterTypesResponse__Output>): grpc.ClientUnaryCall;
  ListParameterTypes(argument: _yamcs_protobuf_mdb_ListParameterTypesRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParameterTypesResponse__Output>): grpc.ClientUnaryCall;
  listParameterTypes(argument: _yamcs_protobuf_mdb_ListParameterTypesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParameterTypesResponse__Output>): grpc.ClientUnaryCall;
  listParameterTypes(argument: _yamcs_protobuf_mdb_ListParameterTypesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParameterTypesResponse__Output>): grpc.ClientUnaryCall;
  listParameterTypes(argument: _yamcs_protobuf_mdb_ListParameterTypesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParameterTypesResponse__Output>): grpc.ClientUnaryCall;
  listParameterTypes(argument: _yamcs_protobuf_mdb_ListParameterTypesRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParameterTypesResponse__Output>): grpc.ClientUnaryCall;
  
  ListParameters(argument: _yamcs_protobuf_mdb_ListParametersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParametersResponse__Output>): grpc.ClientUnaryCall;
  ListParameters(argument: _yamcs_protobuf_mdb_ListParametersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParametersResponse__Output>): grpc.ClientUnaryCall;
  ListParameters(argument: _yamcs_protobuf_mdb_ListParametersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParametersResponse__Output>): grpc.ClientUnaryCall;
  ListParameters(argument: _yamcs_protobuf_mdb_ListParametersRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParametersResponse__Output>): grpc.ClientUnaryCall;
  listParameters(argument: _yamcs_protobuf_mdb_ListParametersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParametersResponse__Output>): grpc.ClientUnaryCall;
  listParameters(argument: _yamcs_protobuf_mdb_ListParametersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParametersResponse__Output>): grpc.ClientUnaryCall;
  listParameters(argument: _yamcs_protobuf_mdb_ListParametersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParametersResponse__Output>): grpc.ClientUnaryCall;
  listParameters(argument: _yamcs_protobuf_mdb_ListParametersRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListParametersResponse__Output>): grpc.ClientUnaryCall;
  
  ListSpaceSystems(argument: _yamcs_protobuf_mdb_ListSpaceSystemsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>): grpc.ClientUnaryCall;
  ListSpaceSystems(argument: _yamcs_protobuf_mdb_ListSpaceSystemsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>): grpc.ClientUnaryCall;
  ListSpaceSystems(argument: _yamcs_protobuf_mdb_ListSpaceSystemsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>): grpc.ClientUnaryCall;
  ListSpaceSystems(argument: _yamcs_protobuf_mdb_ListSpaceSystemsRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>): grpc.ClientUnaryCall;
  listSpaceSystems(argument: _yamcs_protobuf_mdb_ListSpaceSystemsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>): grpc.ClientUnaryCall;
  listSpaceSystems(argument: _yamcs_protobuf_mdb_ListSpaceSystemsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>): grpc.ClientUnaryCall;
  listSpaceSystems(argument: _yamcs_protobuf_mdb_ListSpaceSystemsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>): grpc.ClientUnaryCall;
  listSpaceSystems(argument: _yamcs_protobuf_mdb_ListSpaceSystemsRequest, callback: grpc.requestCallback<_yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>): grpc.ClientUnaryCall;
  
  StreamMissionDatabase(argument: _yamcs_protobuf_mdb_StreamMissionDatabaseRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_mdb_MissionDatabaseItem__Output>;
  StreamMissionDatabase(argument: _yamcs_protobuf_mdb_StreamMissionDatabaseRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_mdb_MissionDatabaseItem__Output>;
  streamMissionDatabase(argument: _yamcs_protobuf_mdb_StreamMissionDatabaseRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_mdb_MissionDatabaseItem__Output>;
  streamMissionDatabase(argument: _yamcs_protobuf_mdb_StreamMissionDatabaseRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_mdb_MissionDatabaseItem__Output>;
  
}

export interface MdbApiHandlers extends grpc.UntypedServiceImplementation {
  BatchGetParameters: grpc.handleUnaryCall<_yamcs_protobuf_mdb_BatchGetParametersRequest__Output, _yamcs_protobuf_mdb_BatchGetParametersResponse>;
  
  CreateParameter: grpc.handleUnaryCall<_yamcs_protobuf_mdb_CreateParameterRequest__Output, _yamcs_protobuf_mdb_ParameterInfo>;
  
  CreateParameterType: grpc.handleUnaryCall<_yamcs_protobuf_mdb_CreateParameterTypeRequest__Output, _yamcs_protobuf_mdb_ParameterTypeInfo>;
  
  ExportJavaMissionDatabase: grpc.handleUnaryCall<_yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest__Output, _yamcs_api_HttpBody>;
  
  ExportXtce: grpc.handleUnaryCall<_yamcs_protobuf_mdb_ExportXtceRequest__Output, _yamcs_api_HttpBody>;
  
  GetAlgorithm: grpc.handleUnaryCall<_yamcs_protobuf_mdb_GetAlgorithmRequest__Output, _yamcs_protobuf_mdb_AlgorithmInfo>;
  
  GetCommand: grpc.handleUnaryCall<_yamcs_protobuf_mdb_GetCommandRequest__Output, _yamcs_protobuf_mdb_CommandInfo>;
  
  GetContainer: grpc.handleUnaryCall<_yamcs_protobuf_mdb_GetContainerRequest__Output, _yamcs_protobuf_mdb_ContainerInfo>;
  
  GetMissionDatabase: grpc.handleUnaryCall<_yamcs_protobuf_mdb_GetMissionDatabaseRequest__Output, _yamcs_protobuf_mdb_MissionDatabase>;
  
  GetParameter: grpc.handleUnaryCall<_yamcs_protobuf_mdb_GetParameterRequest__Output, _yamcs_protobuf_mdb_ParameterInfo>;
  
  GetParameterType: grpc.handleUnaryCall<_yamcs_protobuf_mdb_GetParameterTypeRequest__Output, _yamcs_protobuf_mdb_ParameterTypeInfo>;
  
  GetSpaceSystem: grpc.handleUnaryCall<_yamcs_protobuf_mdb_GetSpaceSystemRequest__Output, _yamcs_protobuf_mdb_SpaceSystemInfo>;
  
  ListAlgorithms: grpc.handleUnaryCall<_yamcs_protobuf_mdb_ListAlgorithmsRequest__Output, _yamcs_protobuf_mdb_ListAlgorithmsResponse>;
  
  ListCommands: grpc.handleUnaryCall<_yamcs_protobuf_mdb_ListCommandsRequest__Output, _yamcs_protobuf_mdb_ListCommandsResponse>;
  
  ListContainers: grpc.handleUnaryCall<_yamcs_protobuf_mdb_ListContainersRequest__Output, _yamcs_protobuf_mdb_ListContainersResponse>;
  
  ListParameterTypes: grpc.handleUnaryCall<_yamcs_protobuf_mdb_ListParameterTypesRequest__Output, _yamcs_protobuf_mdb_ListParameterTypesResponse>;
  
  ListParameters: grpc.handleUnaryCall<_yamcs_protobuf_mdb_ListParametersRequest__Output, _yamcs_protobuf_mdb_ListParametersResponse>;
  
  ListSpaceSystems: grpc.handleUnaryCall<_yamcs_protobuf_mdb_ListSpaceSystemsRequest__Output, _yamcs_protobuf_mdb_ListSpaceSystemsResponse>;
  
  StreamMissionDatabase: grpc.handleServerStreamingCall<_yamcs_protobuf_mdb_StreamMissionDatabaseRequest__Output, _yamcs_protobuf_mdb_MissionDatabaseItem>;
  
}

export interface MdbApiDefinition extends grpc.ServiceDefinition {
  BatchGetParameters: MethodDefinition<_yamcs_protobuf_mdb_BatchGetParametersRequest, _yamcs_protobuf_mdb_BatchGetParametersResponse, _yamcs_protobuf_mdb_BatchGetParametersRequest__Output, _yamcs_protobuf_mdb_BatchGetParametersResponse__Output>
  CreateParameter: MethodDefinition<_yamcs_protobuf_mdb_CreateParameterRequest, _yamcs_protobuf_mdb_ParameterInfo, _yamcs_protobuf_mdb_CreateParameterRequest__Output, _yamcs_protobuf_mdb_ParameterInfo__Output>
  CreateParameterType: MethodDefinition<_yamcs_protobuf_mdb_CreateParameterTypeRequest, _yamcs_protobuf_mdb_ParameterTypeInfo, _yamcs_protobuf_mdb_CreateParameterTypeRequest__Output, _yamcs_protobuf_mdb_ParameterTypeInfo__Output>
  ExportJavaMissionDatabase: MethodDefinition<_yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest, _yamcs_api_HttpBody, _yamcs_protobuf_mdb_ExportJavaMissionDatabaseRequest__Output, _yamcs_api_HttpBody__Output>
  ExportXtce: MethodDefinition<_yamcs_protobuf_mdb_ExportXtceRequest, _yamcs_api_HttpBody, _yamcs_protobuf_mdb_ExportXtceRequest__Output, _yamcs_api_HttpBody__Output>
  GetAlgorithm: MethodDefinition<_yamcs_protobuf_mdb_GetAlgorithmRequest, _yamcs_protobuf_mdb_AlgorithmInfo, _yamcs_protobuf_mdb_GetAlgorithmRequest__Output, _yamcs_protobuf_mdb_AlgorithmInfo__Output>
  GetCommand: MethodDefinition<_yamcs_protobuf_mdb_GetCommandRequest, _yamcs_protobuf_mdb_CommandInfo, _yamcs_protobuf_mdb_GetCommandRequest__Output, _yamcs_protobuf_mdb_CommandInfo__Output>
  GetContainer: MethodDefinition<_yamcs_protobuf_mdb_GetContainerRequest, _yamcs_protobuf_mdb_ContainerInfo, _yamcs_protobuf_mdb_GetContainerRequest__Output, _yamcs_protobuf_mdb_ContainerInfo__Output>
  GetMissionDatabase: MethodDefinition<_yamcs_protobuf_mdb_GetMissionDatabaseRequest, _yamcs_protobuf_mdb_MissionDatabase, _yamcs_protobuf_mdb_GetMissionDatabaseRequest__Output, _yamcs_protobuf_mdb_MissionDatabase__Output>
  GetParameter: MethodDefinition<_yamcs_protobuf_mdb_GetParameterRequest, _yamcs_protobuf_mdb_ParameterInfo, _yamcs_protobuf_mdb_GetParameterRequest__Output, _yamcs_protobuf_mdb_ParameterInfo__Output>
  GetParameterType: MethodDefinition<_yamcs_protobuf_mdb_GetParameterTypeRequest, _yamcs_protobuf_mdb_ParameterTypeInfo, _yamcs_protobuf_mdb_GetParameterTypeRequest__Output, _yamcs_protobuf_mdb_ParameterTypeInfo__Output>
  GetSpaceSystem: MethodDefinition<_yamcs_protobuf_mdb_GetSpaceSystemRequest, _yamcs_protobuf_mdb_SpaceSystemInfo, _yamcs_protobuf_mdb_GetSpaceSystemRequest__Output, _yamcs_protobuf_mdb_SpaceSystemInfo__Output>
  ListAlgorithms: MethodDefinition<_yamcs_protobuf_mdb_ListAlgorithmsRequest, _yamcs_protobuf_mdb_ListAlgorithmsResponse, _yamcs_protobuf_mdb_ListAlgorithmsRequest__Output, _yamcs_protobuf_mdb_ListAlgorithmsResponse__Output>
  ListCommands: MethodDefinition<_yamcs_protobuf_mdb_ListCommandsRequest, _yamcs_protobuf_mdb_ListCommandsResponse, _yamcs_protobuf_mdb_ListCommandsRequest__Output, _yamcs_protobuf_mdb_ListCommandsResponse__Output>
  ListContainers: MethodDefinition<_yamcs_protobuf_mdb_ListContainersRequest, _yamcs_protobuf_mdb_ListContainersResponse, _yamcs_protobuf_mdb_ListContainersRequest__Output, _yamcs_protobuf_mdb_ListContainersResponse__Output>
  ListParameterTypes: MethodDefinition<_yamcs_protobuf_mdb_ListParameterTypesRequest, _yamcs_protobuf_mdb_ListParameterTypesResponse, _yamcs_protobuf_mdb_ListParameterTypesRequest__Output, _yamcs_protobuf_mdb_ListParameterTypesResponse__Output>
  ListParameters: MethodDefinition<_yamcs_protobuf_mdb_ListParametersRequest, _yamcs_protobuf_mdb_ListParametersResponse, _yamcs_protobuf_mdb_ListParametersRequest__Output, _yamcs_protobuf_mdb_ListParametersResponse__Output>
  ListSpaceSystems: MethodDefinition<_yamcs_protobuf_mdb_ListSpaceSystemsRequest, _yamcs_protobuf_mdb_ListSpaceSystemsResponse, _yamcs_protobuf_mdb_ListSpaceSystemsRequest__Output, _yamcs_protobuf_mdb_ListSpaceSystemsResponse__Output>
  StreamMissionDatabase: MethodDefinition<_yamcs_protobuf_mdb_StreamMissionDatabaseRequest, _yamcs_protobuf_mdb_MissionDatabaseItem, _yamcs_protobuf_mdb_StreamMissionDatabaseRequest__Output, _yamcs_protobuf_mdb_MissionDatabaseItem__Output>
}
