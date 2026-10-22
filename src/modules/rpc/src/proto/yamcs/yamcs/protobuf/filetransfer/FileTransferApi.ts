// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CancelTransferRequest as _yamcs_protobuf_filetransfer_CancelTransferRequest, CancelTransferRequest__Output as _yamcs_protobuf_filetransfer_CancelTransferRequest__Output } from '../../../yamcs/protobuf/filetransfer/CancelTransferRequest';
import type { CreateTransferRequest as _yamcs_protobuf_filetransfer_CreateTransferRequest, CreateTransferRequest__Output as _yamcs_protobuf_filetransfer_CreateTransferRequest__Output } from '../../../yamcs/protobuf/filetransfer/CreateTransferRequest';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../google/protobuf/Empty';
import type { FileTransferServiceInfo as _yamcs_protobuf_filetransfer_FileTransferServiceInfo, FileTransferServiceInfo__Output as _yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output } from '../../../yamcs/protobuf/filetransfer/FileTransferServiceInfo';
import type { GetFileTransferServiceRequest as _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, GetFileTransferServiceRequest__Output as _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest__Output } from '../../../yamcs/protobuf/filetransfer/GetFileTransferServiceRequest';
import type { GetTransferRequest as _yamcs_protobuf_filetransfer_GetTransferRequest, GetTransferRequest__Output as _yamcs_protobuf_filetransfer_GetTransferRequest__Output } from '../../../yamcs/protobuf/filetransfer/GetTransferRequest';
import type { ListFileTransferServicesRequest as _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, ListFileTransferServicesRequest__Output as _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest__Output } from '../../../yamcs/protobuf/filetransfer/ListFileTransferServicesRequest';
import type { ListFileTransferServicesResponse as _yamcs_protobuf_filetransfer_ListFileTransferServicesResponse, ListFileTransferServicesResponse__Output as _yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output } from '../../../yamcs/protobuf/filetransfer/ListFileTransferServicesResponse';
import type { ListFilesRequest as _yamcs_protobuf_filetransfer_ListFilesRequest, ListFilesRequest__Output as _yamcs_protobuf_filetransfer_ListFilesRequest__Output } from '../../../yamcs/protobuf/filetransfer/ListFilesRequest';
import type { ListFilesResponse as _yamcs_protobuf_filetransfer_ListFilesResponse, ListFilesResponse__Output as _yamcs_protobuf_filetransfer_ListFilesResponse__Output } from '../../../yamcs/protobuf/filetransfer/ListFilesResponse';
import type { ListTransfersRequest as _yamcs_protobuf_filetransfer_ListTransfersRequest, ListTransfersRequest__Output as _yamcs_protobuf_filetransfer_ListTransfersRequest__Output } from '../../../yamcs/protobuf/filetransfer/ListTransfersRequest';
import type { ListTransfersResponse as _yamcs_protobuf_filetransfer_ListTransfersResponse, ListTransfersResponse__Output as _yamcs_protobuf_filetransfer_ListTransfersResponse__Output } from '../../../yamcs/protobuf/filetransfer/ListTransfersResponse';
import type { PauseTransferRequest as _yamcs_protobuf_filetransfer_PauseTransferRequest, PauseTransferRequest__Output as _yamcs_protobuf_filetransfer_PauseTransferRequest__Output } from '../../../yamcs/protobuf/filetransfer/PauseTransferRequest';
import type { ResumeTransferRequest as _yamcs_protobuf_filetransfer_ResumeTransferRequest, ResumeTransferRequest__Output as _yamcs_protobuf_filetransfer_ResumeTransferRequest__Output } from '../../../yamcs/protobuf/filetransfer/ResumeTransferRequest';
import type { RunFileActionRequest as _yamcs_protobuf_filetransfer_RunFileActionRequest, RunFileActionRequest__Output as _yamcs_protobuf_filetransfer_RunFileActionRequest__Output } from '../../../yamcs/protobuf/filetransfer/RunFileActionRequest';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../google/protobuf/Struct';
import type { SubscribeTransfersRequest as _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, SubscribeTransfersRequest__Output as _yamcs_protobuf_filetransfer_SubscribeTransfersRequest__Output } from '../../../yamcs/protobuf/filetransfer/SubscribeTransfersRequest';
import type { TransferInfo as _yamcs_protobuf_filetransfer_TransferInfo, TransferInfo__Output as _yamcs_protobuf_filetransfer_TransferInfo__Output } from '../../../yamcs/protobuf/filetransfer/TransferInfo';

export interface FileTransferApiClient extends grpc.Client {
  CancelTransfer(argument: _yamcs_protobuf_filetransfer_CancelTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CancelTransfer(argument: _yamcs_protobuf_filetransfer_CancelTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CancelTransfer(argument: _yamcs_protobuf_filetransfer_CancelTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CancelTransfer(argument: _yamcs_protobuf_filetransfer_CancelTransferRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  cancelTransfer(argument: _yamcs_protobuf_filetransfer_CancelTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  cancelTransfer(argument: _yamcs_protobuf_filetransfer_CancelTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  cancelTransfer(argument: _yamcs_protobuf_filetransfer_CancelTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  cancelTransfer(argument: _yamcs_protobuf_filetransfer_CancelTransferRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  CreateTransfer(argument: _yamcs_protobuf_filetransfer_CreateTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  CreateTransfer(argument: _yamcs_protobuf_filetransfer_CreateTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  CreateTransfer(argument: _yamcs_protobuf_filetransfer_CreateTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  CreateTransfer(argument: _yamcs_protobuf_filetransfer_CreateTransferRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  createTransfer(argument: _yamcs_protobuf_filetransfer_CreateTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  createTransfer(argument: _yamcs_protobuf_filetransfer_CreateTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  createTransfer(argument: _yamcs_protobuf_filetransfer_CreateTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  createTransfer(argument: _yamcs_protobuf_filetransfer_CreateTransferRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  
  FetchFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  FetchFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  FetchFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  FetchFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  fetchFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  fetchFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  fetchFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  fetchFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  GetFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>): grpc.ClientUnaryCall;
  GetFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>): grpc.ClientUnaryCall;
  GetFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>): grpc.ClientUnaryCall;
  GetFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>): grpc.ClientUnaryCall;
  getFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>): grpc.ClientUnaryCall;
  getFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>): grpc.ClientUnaryCall;
  getFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>): grpc.ClientUnaryCall;
  getFileList(argument: _yamcs_protobuf_filetransfer_ListFilesRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>): grpc.ClientUnaryCall;
  
  GetFileTransferService(argument: _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>): grpc.ClientUnaryCall;
  GetFileTransferService(argument: _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>): grpc.ClientUnaryCall;
  GetFileTransferService(argument: _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>): grpc.ClientUnaryCall;
  GetFileTransferService(argument: _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>): grpc.ClientUnaryCall;
  getFileTransferService(argument: _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>): grpc.ClientUnaryCall;
  getFileTransferService(argument: _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>): grpc.ClientUnaryCall;
  getFileTransferService(argument: _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>): grpc.ClientUnaryCall;
  getFileTransferService(argument: _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>): grpc.ClientUnaryCall;
  
  GetTransfer(argument: _yamcs_protobuf_filetransfer_GetTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  GetTransfer(argument: _yamcs_protobuf_filetransfer_GetTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  GetTransfer(argument: _yamcs_protobuf_filetransfer_GetTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  GetTransfer(argument: _yamcs_protobuf_filetransfer_GetTransferRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  getTransfer(argument: _yamcs_protobuf_filetransfer_GetTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  getTransfer(argument: _yamcs_protobuf_filetransfer_GetTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  getTransfer(argument: _yamcs_protobuf_filetransfer_GetTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  getTransfer(argument: _yamcs_protobuf_filetransfer_GetTransferRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_TransferInfo__Output>): grpc.ClientUnaryCall;
  
  ListFileTransferServices(argument: _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>): grpc.ClientUnaryCall;
  ListFileTransferServices(argument: _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>): grpc.ClientUnaryCall;
  ListFileTransferServices(argument: _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>): grpc.ClientUnaryCall;
  ListFileTransferServices(argument: _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>): grpc.ClientUnaryCall;
  listFileTransferServices(argument: _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>): grpc.ClientUnaryCall;
  listFileTransferServices(argument: _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>): grpc.ClientUnaryCall;
  listFileTransferServices(argument: _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>): grpc.ClientUnaryCall;
  listFileTransferServices(argument: _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>): grpc.ClientUnaryCall;
  
  ListTransfers(argument: _yamcs_protobuf_filetransfer_ListTransfersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListTransfersResponse__Output>): grpc.ClientUnaryCall;
  ListTransfers(argument: _yamcs_protobuf_filetransfer_ListTransfersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListTransfersResponse__Output>): grpc.ClientUnaryCall;
  ListTransfers(argument: _yamcs_protobuf_filetransfer_ListTransfersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListTransfersResponse__Output>): grpc.ClientUnaryCall;
  ListTransfers(argument: _yamcs_protobuf_filetransfer_ListTransfersRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListTransfersResponse__Output>): grpc.ClientUnaryCall;
  listTransfers(argument: _yamcs_protobuf_filetransfer_ListTransfersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListTransfersResponse__Output>): grpc.ClientUnaryCall;
  listTransfers(argument: _yamcs_protobuf_filetransfer_ListTransfersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListTransfersResponse__Output>): grpc.ClientUnaryCall;
  listTransfers(argument: _yamcs_protobuf_filetransfer_ListTransfersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListTransfersResponse__Output>): grpc.ClientUnaryCall;
  listTransfers(argument: _yamcs_protobuf_filetransfer_ListTransfersRequest, callback: grpc.requestCallback<_yamcs_protobuf_filetransfer_ListTransfersResponse__Output>): grpc.ClientUnaryCall;
  
  PauseTransfer(argument: _yamcs_protobuf_filetransfer_PauseTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  PauseTransfer(argument: _yamcs_protobuf_filetransfer_PauseTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  PauseTransfer(argument: _yamcs_protobuf_filetransfer_PauseTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  PauseTransfer(argument: _yamcs_protobuf_filetransfer_PauseTransferRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  pauseTransfer(argument: _yamcs_protobuf_filetransfer_PauseTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  pauseTransfer(argument: _yamcs_protobuf_filetransfer_PauseTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  pauseTransfer(argument: _yamcs_protobuf_filetransfer_PauseTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  pauseTransfer(argument: _yamcs_protobuf_filetransfer_PauseTransferRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  ResumeTransfer(argument: _yamcs_protobuf_filetransfer_ResumeTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ResumeTransfer(argument: _yamcs_protobuf_filetransfer_ResumeTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ResumeTransfer(argument: _yamcs_protobuf_filetransfer_ResumeTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  ResumeTransfer(argument: _yamcs_protobuf_filetransfer_ResumeTransferRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  resumeTransfer(argument: _yamcs_protobuf_filetransfer_ResumeTransferRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  resumeTransfer(argument: _yamcs_protobuf_filetransfer_ResumeTransferRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  resumeTransfer(argument: _yamcs_protobuf_filetransfer_ResumeTransferRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  resumeTransfer(argument: _yamcs_protobuf_filetransfer_ResumeTransferRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  RunFileAction(argument: _yamcs_protobuf_filetransfer_RunFileActionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Struct__Output>): grpc.ClientUnaryCall;
  RunFileAction(argument: _yamcs_protobuf_filetransfer_RunFileActionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Struct__Output>): grpc.ClientUnaryCall;
  RunFileAction(argument: _yamcs_protobuf_filetransfer_RunFileActionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Struct__Output>): grpc.ClientUnaryCall;
  RunFileAction(argument: _yamcs_protobuf_filetransfer_RunFileActionRequest, callback: grpc.requestCallback<_google_protobuf_Struct__Output>): grpc.ClientUnaryCall;
  runFileAction(argument: _yamcs_protobuf_filetransfer_RunFileActionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Struct__Output>): grpc.ClientUnaryCall;
  runFileAction(argument: _yamcs_protobuf_filetransfer_RunFileActionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Struct__Output>): grpc.ClientUnaryCall;
  runFileAction(argument: _yamcs_protobuf_filetransfer_RunFileActionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Struct__Output>): grpc.ClientUnaryCall;
  runFileAction(argument: _yamcs_protobuf_filetransfer_RunFileActionRequest, callback: grpc.requestCallback<_google_protobuf_Struct__Output>): grpc.ClientUnaryCall;
  
  SubscribeRemoteFileList(argument: _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>;
  SubscribeRemoteFileList(argument: _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>;
  subscribeRemoteFileList(argument: _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>;
  subscribeRemoteFileList(argument: _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_filetransfer_ListFilesResponse__Output>;
  
  SubscribeTransfers(argument: _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_filetransfer_TransferInfo__Output>;
  SubscribeTransfers(argument: _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_filetransfer_TransferInfo__Output>;
  subscribeTransfers(argument: _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_filetransfer_TransferInfo__Output>;
  subscribeTransfers(argument: _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_yamcs_protobuf_filetransfer_TransferInfo__Output>;
  
}

export interface FileTransferApiHandlers extends grpc.UntypedServiceImplementation {
  CancelTransfer: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_CancelTransferRequest__Output, _google_protobuf_Empty>;
  
  CreateTransfer: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_CreateTransferRequest__Output, _yamcs_protobuf_filetransfer_TransferInfo>;
  
  FetchFileList: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_ListFilesRequest__Output, _google_protobuf_Empty>;
  
  GetFileList: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_ListFilesRequest__Output, _yamcs_protobuf_filetransfer_ListFilesResponse>;
  
  GetFileTransferService: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_GetFileTransferServiceRequest__Output, _yamcs_protobuf_filetransfer_FileTransferServiceInfo>;
  
  GetTransfer: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_GetTransferRequest__Output, _yamcs_protobuf_filetransfer_TransferInfo>;
  
  ListFileTransferServices: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_ListFileTransferServicesRequest__Output, _yamcs_protobuf_filetransfer_ListFileTransferServicesResponse>;
  
  ListTransfers: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_ListTransfersRequest__Output, _yamcs_protobuf_filetransfer_ListTransfersResponse>;
  
  PauseTransfer: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_PauseTransferRequest__Output, _google_protobuf_Empty>;
  
  ResumeTransfer: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_ResumeTransferRequest__Output, _google_protobuf_Empty>;
  
  RunFileAction: grpc.handleUnaryCall<_yamcs_protobuf_filetransfer_RunFileActionRequest__Output, _google_protobuf_Struct>;
  
  SubscribeRemoteFileList: grpc.handleServerStreamingCall<_yamcs_protobuf_filetransfer_SubscribeTransfersRequest__Output, _yamcs_protobuf_filetransfer_ListFilesResponse>;
  
  SubscribeTransfers: grpc.handleServerStreamingCall<_yamcs_protobuf_filetransfer_SubscribeTransfersRequest__Output, _yamcs_protobuf_filetransfer_TransferInfo>;
  
}

export interface FileTransferApiDefinition extends grpc.ServiceDefinition {
  CancelTransfer: MethodDefinition<_yamcs_protobuf_filetransfer_CancelTransferRequest, _google_protobuf_Empty, _yamcs_protobuf_filetransfer_CancelTransferRequest__Output, _google_protobuf_Empty__Output>
  CreateTransfer: MethodDefinition<_yamcs_protobuf_filetransfer_CreateTransferRequest, _yamcs_protobuf_filetransfer_TransferInfo, _yamcs_protobuf_filetransfer_CreateTransferRequest__Output, _yamcs_protobuf_filetransfer_TransferInfo__Output>
  FetchFileList: MethodDefinition<_yamcs_protobuf_filetransfer_ListFilesRequest, _google_protobuf_Empty, _yamcs_protobuf_filetransfer_ListFilesRequest__Output, _google_protobuf_Empty__Output>
  GetFileList: MethodDefinition<_yamcs_protobuf_filetransfer_ListFilesRequest, _yamcs_protobuf_filetransfer_ListFilesResponse, _yamcs_protobuf_filetransfer_ListFilesRequest__Output, _yamcs_protobuf_filetransfer_ListFilesResponse__Output>
  GetFileTransferService: MethodDefinition<_yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, _yamcs_protobuf_filetransfer_FileTransferServiceInfo, _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest__Output, _yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>
  GetTransfer: MethodDefinition<_yamcs_protobuf_filetransfer_GetTransferRequest, _yamcs_protobuf_filetransfer_TransferInfo, _yamcs_protobuf_filetransfer_GetTransferRequest__Output, _yamcs_protobuf_filetransfer_TransferInfo__Output>
  ListFileTransferServices: MethodDefinition<_yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, _yamcs_protobuf_filetransfer_ListFileTransferServicesResponse, _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest__Output, _yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>
  ListTransfers: MethodDefinition<_yamcs_protobuf_filetransfer_ListTransfersRequest, _yamcs_protobuf_filetransfer_ListTransfersResponse, _yamcs_protobuf_filetransfer_ListTransfersRequest__Output, _yamcs_protobuf_filetransfer_ListTransfersResponse__Output>
  PauseTransfer: MethodDefinition<_yamcs_protobuf_filetransfer_PauseTransferRequest, _google_protobuf_Empty, _yamcs_protobuf_filetransfer_PauseTransferRequest__Output, _google_protobuf_Empty__Output>
  ResumeTransfer: MethodDefinition<_yamcs_protobuf_filetransfer_ResumeTransferRequest, _google_protobuf_Empty, _yamcs_protobuf_filetransfer_ResumeTransferRequest__Output, _google_protobuf_Empty__Output>
  RunFileAction: MethodDefinition<_yamcs_protobuf_filetransfer_RunFileActionRequest, _google_protobuf_Struct, _yamcs_protobuf_filetransfer_RunFileActionRequest__Output, _google_protobuf_Struct__Output>
  SubscribeRemoteFileList: MethodDefinition<_yamcs_protobuf_filetransfer_SubscribeTransfersRequest, _yamcs_protobuf_filetransfer_ListFilesResponse, _yamcs_protobuf_filetransfer_SubscribeTransfersRequest__Output, _yamcs_protobuf_filetransfer_ListFilesResponse__Output>
  SubscribeTransfers: MethodDefinition<_yamcs_protobuf_filetransfer_SubscribeTransfersRequest, _yamcs_protobuf_filetransfer_TransferInfo, _yamcs_protobuf_filetransfer_SubscribeTransfersRequest__Output, _yamcs_protobuf_filetransfer_TransferInfo__Output>
}
