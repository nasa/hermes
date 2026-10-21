// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { TransferState as _yamcs_protobuf_filetransfer_TransferState, TransferState__Output as _yamcs_protobuf_filetransfer_TransferState__Output } from '../../../yamcs/protobuf/filetransfer/TransferState';
import type { TransferDirection as _yamcs_protobuf_filetransfer_TransferDirection, TransferDirection__Output as _yamcs_protobuf_filetransfer_TransferDirection__Output } from '../../../yamcs/protobuf/filetransfer/TransferDirection';
import type { Long } from '@grpc/proto-loader';

export interface ListTransfersRequest {
  'instance'?: (string);
  'serviceName'?: (string);
  'start'?: (_google_protobuf_Timestamp | null);
  'stop'?: (_google_protobuf_Timestamp | null);
  'localEntityId'?: (number | string | Long);
  'remoteEntityId'?: (number | string | Long);
  'state'?: (_yamcs_protobuf_filetransfer_TransferState)[];
  'direction'?: (_yamcs_protobuf_filetransfer_TransferDirection);
  'limit'?: (number);
  'order'?: (string);
}

export interface ListTransfersRequest__Output {
  'instance'?: (string);
  'serviceName'?: (string);
  'start'?: (_google_protobuf_Timestamp__Output);
  'stop'?: (_google_protobuf_Timestamp__Output);
  'localEntityId'?: (string);
  'remoteEntityId'?: (string);
  'state'?: (_yamcs_protobuf_filetransfer_TransferState__Output)[];
  'direction'?: (_yamcs_protobuf_filetransfer_TransferDirection__Output);
  'limit'?: (number);
  'order'?: (string);
}
