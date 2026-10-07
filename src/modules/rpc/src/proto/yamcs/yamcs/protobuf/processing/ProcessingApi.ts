// Original file: proto/yamcs/protobuf/processing/processing.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AlgorithmStatus as _yamcs_protobuf_processing_AlgorithmStatus, AlgorithmStatus__Output as _yamcs_protobuf_processing_AlgorithmStatus__Output } from '../../../yamcs/protobuf/processing/AlgorithmStatus';
import type { AlgorithmTrace as _yamcs_protobuf_processing_AlgorithmTrace, AlgorithmTrace__Output as _yamcs_protobuf_processing_AlgorithmTrace__Output } from '../../../yamcs/protobuf/processing/AlgorithmTrace';
import type { BatchGetParameterValuesRequest as _yamcs_protobuf_processing_BatchGetParameterValuesRequest, BatchGetParameterValuesRequest__Output as _yamcs_protobuf_processing_BatchGetParameterValuesRequest__Output } from '../../../yamcs/protobuf/processing/BatchGetParameterValuesRequest';
import type { BatchGetParameterValuesResponse as _yamcs_protobuf_processing_BatchGetParameterValuesResponse, BatchGetParameterValuesResponse__Output as _yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output } from '../../../yamcs/protobuf/processing/BatchGetParameterValuesResponse';
import type { BatchSetParameterValuesRequest as _yamcs_protobuf_processing_BatchSetParameterValuesRequest, BatchSetParameterValuesRequest__Output as _yamcs_protobuf_processing_BatchSetParameterValuesRequest__Output } from '../../../yamcs/protobuf/processing/BatchSetParameterValuesRequest';
import type { CreateProcessorRequest as _yamcs_protobuf_processing_CreateProcessorRequest, CreateProcessorRequest__Output as _yamcs_protobuf_processing_CreateProcessorRequest__Output } from '../../../yamcs/protobuf/processing/CreateProcessorRequest';
import type { DeleteProcessorRequest as _yamcs_protobuf_processing_DeleteProcessorRequest, DeleteProcessorRequest__Output as _yamcs_protobuf_processing_DeleteProcessorRequest__Output } from '../../../yamcs/protobuf/processing/DeleteProcessorRequest';
import type { EditAlgorithmTraceRequest as _yamcs_protobuf_processing_EditAlgorithmTraceRequest, EditAlgorithmTraceRequest__Output as _yamcs_protobuf_processing_EditAlgorithmTraceRequest__Output } from '../../../yamcs/protobuf/processing/EditAlgorithmTraceRequest';
import type { EditProcessorRequest as _yamcs_protobuf_processing_EditProcessorRequest, EditProcessorRequest__Output as _yamcs_protobuf_processing_EditProcessorRequest__Output } from '../../../yamcs/protobuf/processing/EditProcessorRequest';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../google/protobuf/Empty';
import type { GetAlgorithmStatusRequest as _yamcs_protobuf_processing_GetAlgorithmStatusRequest, GetAlgorithmStatusRequest__Output as _yamcs_protobuf_processing_GetAlgorithmStatusRequest__Output } from '../../../yamcs/protobuf/processing/GetAlgorithmStatusRequest';
import type { GetAlgorithmTraceRequest as _yamcs_protobuf_processing_GetAlgorithmTraceRequest, GetAlgorithmTraceRequest__Output as _yamcs_protobuf_processing_GetAlgorithmTraceRequest__Output } from '../../../yamcs/protobuf/processing/GetAlgorithmTraceRequest';
import type { GetParameterValueRequest as _yamcs_protobuf_processing_GetParameterValueRequest, GetParameterValueRequest__Output as _yamcs_protobuf_processing_GetParameterValueRequest__Output } from '../../../yamcs/protobuf/processing/GetParameterValueRequest';
import type { GetProcessorRequest as _yamcs_protobuf_processing_GetProcessorRequest, GetProcessorRequest__Output as _yamcs_protobuf_processing_GetProcessorRequest__Output } from '../../../yamcs/protobuf/processing/GetProcessorRequest';
import type { ListProcessorTypesResponse as _yamcs_protobuf_processing_ListProcessorTypesResponse, ListProcessorTypesResponse__Output as _yamcs_protobuf_processing_ListProcessorTypesResponse__Output } from '../../../yamcs/protobuf/processing/ListProcessorTypesResponse';
import type { ListProcessorsRequest as _yamcs_protobuf_processing_ListProcessorsRequest, ListProcessorsRequest__Output as _yamcs_protobuf_processing_ListProcessorsRequest__Output } from '../../../yamcs/protobuf/processing/ListProcessorsRequest';
import type { ListProcessorsResponse as _yamcs_protobuf_processing_ListProcessorsResponse, ListProcessorsResponse__Output as _yamcs_protobuf_processing_ListProcessorsResponse__Output } from '../../../yamcs/protobuf/processing/ListProcessorsResponse';
import type { ParameterValue as _yamcs_protobuf_pvalue_ParameterValue, ParameterValue__Output as _yamcs_protobuf_pvalue_ParameterValue__Output } from '../../../yamcs/protobuf/pvalue/ParameterValue';
import type { ProcessorInfo as _yamcs_protobuf_yamcsManagement_ProcessorInfo, ProcessorInfo__Output as _yamcs_protobuf_yamcsManagement_ProcessorInfo__Output } from '../../../yamcs/protobuf/yamcsManagement/ProcessorInfo';
import type { SetParameterValueRequest as _yamcs_protobuf_processing_SetParameterValueRequest, SetParameterValueRequest__Output as _yamcs_protobuf_processing_SetParameterValueRequest__Output } from '../../../yamcs/protobuf/processing/SetParameterValueRequest';
import type { Statistics as _yamcs_protobuf_yamcsManagement_Statistics, Statistics__Output as _yamcs_protobuf_yamcsManagement_Statistics__Output } from '../../../yamcs/protobuf/yamcsManagement/Statistics';
import type { SubscribeAlgorithmStatusRequest as _yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest, SubscribeAlgorithmStatusRequest__Output as _yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest__Output } from '../../../yamcs/protobuf/processing/SubscribeAlgorithmStatusRequest';
import type { SubscribeParametersData as _yamcs_protobuf_processing_SubscribeParametersData, SubscribeParametersData__Output as _yamcs_protobuf_processing_SubscribeParametersData__Output } from '../../../yamcs/protobuf/processing/SubscribeParametersData';
import type { SubscribeParametersRequest as _yamcs_protobuf_processing_SubscribeParametersRequest, SubscribeParametersRequest__Output as _yamcs_protobuf_processing_SubscribeParametersRequest__Output } from '../../../yamcs/protobuf/processing/SubscribeParametersRequest';
import type { SubscribeProcessorsRequest as _yamcs_protobuf_processing_SubscribeProcessorsRequest, SubscribeProcessorsRequest__Output as _yamcs_protobuf_processing_SubscribeProcessorsRequest__Output } from '../../../yamcs/protobuf/processing/SubscribeProcessorsRequest';
import type { SubscribeTMStatisticsRequest as _yamcs_protobuf_processing_SubscribeTMStatisticsRequest, SubscribeTMStatisticsRequest__Output as _yamcs_protobuf_processing_SubscribeTMStatisticsRequest__Output } from '../../../yamcs/protobuf/processing/SubscribeTMStatisticsRequest';

export interface ProcessingApiClient extends grpc.Client {
  BatchGetParameterValues(argument: _yamcs_protobuf_processing_BatchGetParameterValuesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>): grpc.ClientUnaryCall;
  BatchGetParameterValues(argument: _yamcs_protobuf_processing_BatchGetParameterValuesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>): grpc.ClientUnaryCall;
  BatchGetParameterValues(argument: _yamcs_protobuf_processing_BatchGetParameterValuesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>): grpc.ClientUnaryCall;
  BatchGetParameterValues(argument: _yamcs_protobuf_processing_BatchGetParameterValuesRequest, callback: grpc.requestCallback<_yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>): grpc.ClientUnaryCall;
  batchGetParameterValues(argument: _yamcs_protobuf_processing_BatchGetParameterValuesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>): grpc.ClientUnaryCall;
  batchGetParameterValues(argument: _yamcs_protobuf_processing_BatchGetParameterValuesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>): grpc.ClientUnaryCall;
  batchGetParameterValues(argument: _yamcs_protobuf_processing_BatchGetParameterValuesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>): grpc.ClientUnaryCall;
  batchGetParameterValues(argument: _yamcs_protobuf_processing_BatchGetParameterValuesRequest, callback: grpc.requestCallback<_yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>): grpc.ClientUnaryCall;
  
  BatchSetParameterValues(argument: _yamcs_protobuf_processing_BatchSetParameterValuesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  BatchSetParameterValues(argument: _yamcs_protobuf_processing_BatchSetParameterValuesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  BatchSetParameterValues(argument: _yamcs_protobuf_processing_BatchSetParameterValuesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  BatchSetParameterValues(argument: _yamcs_protobuf_processing_BatchSetParameterValuesRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  batchSetParameterValues(argument: _yamcs_protobuf_processing_BatchSetParameterValuesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  batchSetParameterValues(argument: _yamcs_protobuf_processing_BatchSetParameterValuesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  batchSetParameterValues(argument: _yamcs_protobuf_processing_BatchSetParameterValuesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  batchSetParameterValues(argument: _yamcs_protobuf_processing_BatchSetParameterValuesRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  CreateProcessor(argument: _yamcs_protobuf_processing_CreateProcessorRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CreateProcessor(argument: _yamcs_protobuf_processing_CreateProcessorRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CreateProcessor(argument: _yamcs_protobuf_processing_CreateProcessorRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CreateProcessor(argument: _yamcs_protobuf_processing_CreateProcessorRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  createProcessor(argument: _yamcs_protobuf_processing_CreateProcessorRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  createProcessor(argument: _yamcs_protobuf_processing_CreateProcessorRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  createProcessor(argument: _yamcs_protobuf_processing_CreateProcessorRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  createProcessor(argument: _yamcs_protobuf_processing_CreateProcessorRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  DeleteProcessor(argument: _yamcs_protobuf_processing_DeleteProcessorRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteProcessor(argument: _yamcs_protobuf_processing_DeleteProcessorRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteProcessor(argument: _yamcs_protobuf_processing_DeleteProcessorRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteProcessor(argument: _yamcs_protobuf_processing_DeleteProcessorRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteProcessor(argument: _yamcs_protobuf_processing_DeleteProcessorRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteProcessor(argument: _yamcs_protobuf_processing_DeleteProcessorRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteProcessor(argument: _yamcs_protobuf_processing_DeleteProcessorRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteProcessor(argument: _yamcs_protobuf_processing_DeleteProcessorRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  EditAlgorithmTrace(argument: _yamcs_protobuf_processing_EditAlgorithmTraceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  EditAlgorithmTrace(argument: _yamcs_protobuf_processing_EditAlgorithmTraceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  EditAlgorithmTrace(argument: _yamcs_protobuf_processing_EditAlgorithmTraceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  EditAlgorithmTrace(argument: _yamcs_protobuf_processing_EditAlgorithmTraceRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  editAlgorithmTrace(argument: _yamcs_protobuf_processing_EditAlgorithmTraceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  editAlgorithmTrace(argument: _yamcs_protobuf_processing_EditAlgorithmTraceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  editAlgorithmTrace(argument: _yamcs_protobuf_processing_EditAlgorithmTraceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  editAlgorithmTrace(argument: _yamcs_protobuf_processing_EditAlgorithmTraceRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  EditProcessor(argument: _yamcs_protobuf_processing_EditProcessorRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  EditProcessor(argument: _yamcs_protobuf_processing_EditProcessorRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  EditProcessor(argument: _yamcs_protobuf_processing_EditProcessorRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  EditProcessor(argument: _yamcs_protobuf_processing_EditProcessorRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  editProcessor(argument: _yamcs_protobuf_processing_EditProcessorRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  editProcessor(argument: _yamcs_protobuf_processing_EditProcessorRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  editProcessor(argument: _yamcs_protobuf_processing_EditProcessorRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  editProcessor(argument: _yamcs_protobuf_processing_EditProcessorRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  GetAlgorithmStatus(argument: _yamcs_protobuf_processing_GetAlgorithmStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmStatus__Output>): grpc.ClientUnaryCall;
  GetAlgorithmStatus(argument: _yamcs_protobuf_processing_GetAlgorithmStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmStatus__Output>): grpc.ClientUnaryCall;
  GetAlgorithmStatus(argument: _yamcs_protobuf_processing_GetAlgorithmStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmStatus__Output>): grpc.ClientUnaryCall;
  GetAlgorithmStatus(argument: _yamcs_protobuf_processing_GetAlgorithmStatusRequest, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmStatus__Output>): grpc.ClientUnaryCall;
  getAlgorithmStatus(argument: _yamcs_protobuf_processing_GetAlgorithmStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmStatus__Output>): grpc.ClientUnaryCall;
  getAlgorithmStatus(argument: _yamcs_protobuf_processing_GetAlgorithmStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmStatus__Output>): grpc.ClientUnaryCall;
  getAlgorithmStatus(argument: _yamcs_protobuf_processing_GetAlgorithmStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmStatus__Output>): grpc.ClientUnaryCall;
  getAlgorithmStatus(argument: _yamcs_protobuf_processing_GetAlgorithmStatusRequest, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmStatus__Output>): grpc.ClientUnaryCall;
  
  GetAlgorithmTrace(argument: _yamcs_protobuf_processing_GetAlgorithmTraceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmTrace__Output>): grpc.ClientUnaryCall;
  GetAlgorithmTrace(argument: _yamcs_protobuf_processing_GetAlgorithmTraceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmTrace__Output>): grpc.ClientUnaryCall;
  GetAlgorithmTrace(argument: _yamcs_protobuf_processing_GetAlgorithmTraceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmTrace__Output>): grpc.ClientUnaryCall;
  GetAlgorithmTrace(argument: _yamcs_protobuf_processing_GetAlgorithmTraceRequest, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmTrace__Output>): grpc.ClientUnaryCall;
  getAlgorithmTrace(argument: _yamcs_protobuf_processing_GetAlgorithmTraceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmTrace__Output>): grpc.ClientUnaryCall;
  getAlgorithmTrace(argument: _yamcs_protobuf_processing_GetAlgorithmTraceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmTrace__Output>): grpc.ClientUnaryCall;
  getAlgorithmTrace(argument: _yamcs_protobuf_processing_GetAlgorithmTraceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmTrace__Output>): grpc.ClientUnaryCall;
  getAlgorithmTrace(argument: _yamcs_protobuf_processing_GetAlgorithmTraceRequest, callback: grpc.requestCallback<_yamcs_protobuf_processing_AlgorithmTrace__Output>): grpc.ClientUnaryCall;
  
  GetParameterValue(argument: _yamcs_protobuf_processing_GetParameterValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_pvalue_ParameterValue__Output>): grpc.ClientUnaryCall;
  GetParameterValue(argument: _yamcs_protobuf_processing_GetParameterValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_pvalue_ParameterValue__Output>): grpc.ClientUnaryCall;
  GetParameterValue(argument: _yamcs_protobuf_processing_GetParameterValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_pvalue_ParameterValue__Output>): grpc.ClientUnaryCall;
  GetParameterValue(argument: _yamcs_protobuf_processing_GetParameterValueRequest, callback: grpc.requestCallback<_yamcs_protobuf_pvalue_ParameterValue__Output>): grpc.ClientUnaryCall;
  getParameterValue(argument: _yamcs_protobuf_processing_GetParameterValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_pvalue_ParameterValue__Output>): grpc.ClientUnaryCall;
  getParameterValue(argument: _yamcs_protobuf_processing_GetParameterValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_pvalue_ParameterValue__Output>): grpc.ClientUnaryCall;
  getParameterValue(argument: _yamcs_protobuf_processing_GetParameterValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_pvalue_ParameterValue__Output>): grpc.ClientUnaryCall;
  getParameterValue(argument: _yamcs_protobuf_processing_GetParameterValueRequest, callback: grpc.requestCallback<_yamcs_protobuf_pvalue_ParameterValue__Output>): grpc.ClientUnaryCall;
  
  GetProcessor(argument: _yamcs_protobuf_processing_GetProcessorRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>): grpc.ClientUnaryCall;
  GetProcessor(argument: _yamcs_protobuf_processing_GetProcessorRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>): grpc.ClientUnaryCall;
  GetProcessor(argument: _yamcs_protobuf_processing_GetProcessorRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>): grpc.ClientUnaryCall;
  GetProcessor(argument: _yamcs_protobuf_processing_GetProcessorRequest, callback: grpc.requestCallback<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>): grpc.ClientUnaryCall;
  getProcessor(argument: _yamcs_protobuf_processing_GetProcessorRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>): grpc.ClientUnaryCall;
  getProcessor(argument: _yamcs_protobuf_processing_GetProcessorRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>): grpc.ClientUnaryCall;
  getProcessor(argument: _yamcs_protobuf_processing_GetProcessorRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>): grpc.ClientUnaryCall;
  getProcessor(argument: _yamcs_protobuf_processing_GetProcessorRequest, callback: grpc.requestCallback<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>): grpc.ClientUnaryCall;
  
  ListProcessorTypes(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorTypesResponse__Output>): grpc.ClientUnaryCall;
  ListProcessorTypes(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorTypesResponse__Output>): grpc.ClientUnaryCall;
  ListProcessorTypes(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorTypesResponse__Output>): grpc.ClientUnaryCall;
  ListProcessorTypes(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorTypesResponse__Output>): grpc.ClientUnaryCall;
  listProcessorTypes(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorTypesResponse__Output>): grpc.ClientUnaryCall;
  listProcessorTypes(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorTypesResponse__Output>): grpc.ClientUnaryCall;
  listProcessorTypes(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorTypesResponse__Output>): grpc.ClientUnaryCall;
  listProcessorTypes(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorTypesResponse__Output>): grpc.ClientUnaryCall;
  
  ListProcessors(argument: _yamcs_protobuf_processing_ListProcessorsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorsResponse__Output>): grpc.ClientUnaryCall;
  ListProcessors(argument: _yamcs_protobuf_processing_ListProcessorsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorsResponse__Output>): grpc.ClientUnaryCall;
  ListProcessors(argument: _yamcs_protobuf_processing_ListProcessorsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorsResponse__Output>): grpc.ClientUnaryCall;
  ListProcessors(argument: _yamcs_protobuf_processing_ListProcessorsRequest, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorsResponse__Output>): grpc.ClientUnaryCall;
  listProcessors(argument: _yamcs_protobuf_processing_ListProcessorsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorsResponse__Output>): grpc.ClientUnaryCall;
  listProcessors(argument: _yamcs_protobuf_processing_ListProcessorsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorsResponse__Output>): grpc.ClientUnaryCall;
  listProcessors(argument: _yamcs_protobuf_processing_ListProcessorsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorsResponse__Output>): grpc.ClientUnaryCall;
  listProcessors(argument: _yamcs_protobuf_processing_ListProcessorsRequest, callback: grpc.requestCallback<_yamcs_protobuf_processing_ListProcessorsResponse__Output>): grpc.ClientUnaryCall;
  
  SetParameterValue(argument: _yamcs_protobuf_processing_SetParameterValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetParameterValue(argument: _yamcs_protobuf_processing_SetParameterValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetParameterValue(argument: _yamcs_protobuf_processing_SetParameterValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetParameterValue(argument: _yamcs_protobuf_processing_SetParameterValueRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setParameterValue(argument: _yamcs_protobuf_processing_SetParameterValueRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setParameterValue(argument: _yamcs_protobuf_processing_SetParameterValueRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setParameterValue(argument: _yamcs_protobuf_processing_SetParameterValueRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setParameterValue(argument: _yamcs_protobuf_processing_SetParameterValueRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  SubscribeAlgorithmStatus(argument: _yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_processing_AlgorithmStatus__Output>;
  SubscribeAlgorithmStatus(argument: _yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_processing_AlgorithmStatus__Output>;
  subscribeAlgorithmStatus(argument: _yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_processing_AlgorithmStatus__Output>;
  subscribeAlgorithmStatus(argument: _yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_processing_AlgorithmStatus__Output>;
  
  SubscribeParameters(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_yamcs_protobuf_processing_SubscribeParametersRequest, _yamcs_protobuf_processing_SubscribeParametersData__Output>;
  SubscribeParameters(options?: grpc.CallOptions): grpc.ClientDuplexStream<_yamcs_protobuf_processing_SubscribeParametersRequest, _yamcs_protobuf_processing_SubscribeParametersData__Output>;
  subscribeParameters(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_yamcs_protobuf_processing_SubscribeParametersRequest, _yamcs_protobuf_processing_SubscribeParametersData__Output>;
  subscribeParameters(options?: grpc.CallOptions): grpc.ClientDuplexStream<_yamcs_protobuf_processing_SubscribeParametersRequest, _yamcs_protobuf_processing_SubscribeParametersData__Output>;
  
  SubscribeProcessors(argument: _yamcs_protobuf_processing_SubscribeProcessorsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>;
  SubscribeProcessors(argument: _yamcs_protobuf_processing_SubscribeProcessorsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>;
  subscribeProcessors(argument: _yamcs_protobuf_processing_SubscribeProcessorsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>;
  subscribeProcessors(argument: _yamcs_protobuf_processing_SubscribeProcessorsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>;
  
  SubscribeTMStatistics(argument: _yamcs_protobuf_processing_SubscribeTMStatisticsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_yamcsManagement_Statistics__Output>;
  SubscribeTMStatistics(argument: _yamcs_protobuf_processing_SubscribeTMStatisticsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_yamcsManagement_Statistics__Output>;
  subscribeTmStatistics(argument: _yamcs_protobuf_processing_SubscribeTMStatisticsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_yamcsManagement_Statistics__Output>;
  subscribeTmStatistics(argument: _yamcs_protobuf_processing_SubscribeTMStatisticsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_yamcsManagement_Statistics__Output>;
  
}

export interface ProcessingApiHandlers extends grpc.UntypedServiceImplementation {
  BatchGetParameterValues: grpc.handleUnaryCall<_yamcs_protobuf_processing_BatchGetParameterValuesRequest__Output, _yamcs_protobuf_processing_BatchGetParameterValuesResponse>;
  
  BatchSetParameterValues: grpc.handleUnaryCall<_yamcs_protobuf_processing_BatchSetParameterValuesRequest__Output, _google_protobuf_Empty>;
  
  CreateProcessor: grpc.handleUnaryCall<_yamcs_protobuf_processing_CreateProcessorRequest__Output, _google_protobuf_Empty>;
  
  DeleteProcessor: grpc.handleUnaryCall<_yamcs_protobuf_processing_DeleteProcessorRequest__Output, _google_protobuf_Empty>;
  
  EditAlgorithmTrace: grpc.handleUnaryCall<_yamcs_protobuf_processing_EditAlgorithmTraceRequest__Output, _google_protobuf_Empty>;
  
  EditProcessor: grpc.handleUnaryCall<_yamcs_protobuf_processing_EditProcessorRequest__Output, _google_protobuf_Empty>;
  
  GetAlgorithmStatus: grpc.handleUnaryCall<_yamcs_protobuf_processing_GetAlgorithmStatusRequest__Output, _yamcs_protobuf_processing_AlgorithmStatus>;
  
  GetAlgorithmTrace: grpc.handleUnaryCall<_yamcs_protobuf_processing_GetAlgorithmTraceRequest__Output, _yamcs_protobuf_processing_AlgorithmTrace>;
  
  GetParameterValue: grpc.handleUnaryCall<_yamcs_protobuf_processing_GetParameterValueRequest__Output, _yamcs_protobuf_pvalue_ParameterValue>;
  
  GetProcessor: grpc.handleUnaryCall<_yamcs_protobuf_processing_GetProcessorRequest__Output, _yamcs_protobuf_yamcsManagement_ProcessorInfo>;
  
  ListProcessorTypes: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _yamcs_protobuf_processing_ListProcessorTypesResponse>;
  
  ListProcessors: grpc.handleUnaryCall<_yamcs_protobuf_processing_ListProcessorsRequest__Output, _yamcs_protobuf_processing_ListProcessorsResponse>;
  
  SetParameterValue: grpc.handleUnaryCall<_yamcs_protobuf_processing_SetParameterValueRequest__Output, _google_protobuf_Empty>;
  
  SubscribeAlgorithmStatus: grpc.handleServerStreamingCall<_yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest__Output, _yamcs_protobuf_processing_AlgorithmStatus>;
  
  SubscribeParameters: grpc.handleBidiStreamingCall<_yamcs_protobuf_processing_SubscribeParametersRequest__Output, _yamcs_protobuf_processing_SubscribeParametersData>;
  
  SubscribeProcessors: grpc.handleServerStreamingCall<_yamcs_protobuf_processing_SubscribeProcessorsRequest__Output, _yamcs_protobuf_yamcsManagement_ProcessorInfo>;
  
  SubscribeTMStatistics: grpc.handleServerStreamingCall<_yamcs_protobuf_processing_SubscribeTMStatisticsRequest__Output, _yamcs_protobuf_yamcsManagement_Statistics>;
  
}

export interface ProcessingApiDefinition extends grpc.ServiceDefinition {
  BatchGetParameterValues: MethodDefinition<_yamcs_protobuf_processing_BatchGetParameterValuesRequest, _yamcs_protobuf_processing_BatchGetParameterValuesResponse, _yamcs_protobuf_processing_BatchGetParameterValuesRequest__Output, _yamcs_protobuf_processing_BatchGetParameterValuesResponse__Output>
  BatchSetParameterValues: MethodDefinition<_yamcs_protobuf_processing_BatchSetParameterValuesRequest, _google_protobuf_Empty, _yamcs_protobuf_processing_BatchSetParameterValuesRequest__Output, _google_protobuf_Empty__Output>
  CreateProcessor: MethodDefinition<_yamcs_protobuf_processing_CreateProcessorRequest, _google_protobuf_Empty, _yamcs_protobuf_processing_CreateProcessorRequest__Output, _google_protobuf_Empty__Output>
  DeleteProcessor: MethodDefinition<_yamcs_protobuf_processing_DeleteProcessorRequest, _google_protobuf_Empty, _yamcs_protobuf_processing_DeleteProcessorRequest__Output, _google_protobuf_Empty__Output>
  EditAlgorithmTrace: MethodDefinition<_yamcs_protobuf_processing_EditAlgorithmTraceRequest, _google_protobuf_Empty, _yamcs_protobuf_processing_EditAlgorithmTraceRequest__Output, _google_protobuf_Empty__Output>
  EditProcessor: MethodDefinition<_yamcs_protobuf_processing_EditProcessorRequest, _google_protobuf_Empty, _yamcs_protobuf_processing_EditProcessorRequest__Output, _google_protobuf_Empty__Output>
  GetAlgorithmStatus: MethodDefinition<_yamcs_protobuf_processing_GetAlgorithmStatusRequest, _yamcs_protobuf_processing_AlgorithmStatus, _yamcs_protobuf_processing_GetAlgorithmStatusRequest__Output, _yamcs_protobuf_processing_AlgorithmStatus__Output>
  GetAlgorithmTrace: MethodDefinition<_yamcs_protobuf_processing_GetAlgorithmTraceRequest, _yamcs_protobuf_processing_AlgorithmTrace, _yamcs_protobuf_processing_GetAlgorithmTraceRequest__Output, _yamcs_protobuf_processing_AlgorithmTrace__Output>
  GetParameterValue: MethodDefinition<_yamcs_protobuf_processing_GetParameterValueRequest, _yamcs_protobuf_pvalue_ParameterValue, _yamcs_protobuf_processing_GetParameterValueRequest__Output, _yamcs_protobuf_pvalue_ParameterValue__Output>
  GetProcessor: MethodDefinition<_yamcs_protobuf_processing_GetProcessorRequest, _yamcs_protobuf_yamcsManagement_ProcessorInfo, _yamcs_protobuf_processing_GetProcessorRequest__Output, _yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>
  ListProcessorTypes: MethodDefinition<_google_protobuf_Empty, _yamcs_protobuf_processing_ListProcessorTypesResponse, _google_protobuf_Empty__Output, _yamcs_protobuf_processing_ListProcessorTypesResponse__Output>
  ListProcessors: MethodDefinition<_yamcs_protobuf_processing_ListProcessorsRequest, _yamcs_protobuf_processing_ListProcessorsResponse, _yamcs_protobuf_processing_ListProcessorsRequest__Output, _yamcs_protobuf_processing_ListProcessorsResponse__Output>
  SetParameterValue: MethodDefinition<_yamcs_protobuf_processing_SetParameterValueRequest, _google_protobuf_Empty, _yamcs_protobuf_processing_SetParameterValueRequest__Output, _google_protobuf_Empty__Output>
  SubscribeAlgorithmStatus: MethodDefinition<_yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest, _yamcs_protobuf_processing_AlgorithmStatus, _yamcs_protobuf_processing_SubscribeAlgorithmStatusRequest__Output, _yamcs_protobuf_processing_AlgorithmStatus__Output>
  SubscribeParameters: MethodDefinition<_yamcs_protobuf_processing_SubscribeParametersRequest, _yamcs_protobuf_processing_SubscribeParametersData, _yamcs_protobuf_processing_SubscribeParametersRequest__Output, _yamcs_protobuf_processing_SubscribeParametersData__Output>
  SubscribeProcessors: MethodDefinition<_yamcs_protobuf_processing_SubscribeProcessorsRequest, _yamcs_protobuf_yamcsManagement_ProcessorInfo, _yamcs_protobuf_processing_SubscribeProcessorsRequest__Output, _yamcs_protobuf_yamcsManagement_ProcessorInfo__Output>
  SubscribeTMStatistics: MethodDefinition<_yamcs_protobuf_processing_SubscribeTMStatisticsRequest, _yamcs_protobuf_yamcsManagement_Statistics, _yamcs_protobuf_processing_SubscribeTMStatisticsRequest__Output, _yamcs_protobuf_yamcsManagement_Statistics__Output>
}
