// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { TransferState as _yamcs_protobuf_filetransfer_TransferState, TransferState__Output as _yamcs_protobuf_filetransfer_TransferState__Output } from '../../../yamcs/protobuf/filetransfer/TransferState';
import type { TransferDirection as _yamcs_protobuf_filetransfer_TransferDirection, TransferDirection__Output as _yamcs_protobuf_filetransfer_TransferDirection__Output } from '../../../yamcs/protobuf/filetransfer/TransferDirection';
import type { TransactionId as _yamcs_protobuf_filetransfer_TransactionId, TransactionId__Output as _yamcs_protobuf_filetransfer_TransactionId__Output } from '../../../yamcs/protobuf/filetransfer/TransactionId';
import type { EntityInfo as _yamcs_protobuf_filetransfer_EntityInfo, EntityInfo__Output as _yamcs_protobuf_filetransfer_EntityInfo__Output } from '../../../yamcs/protobuf/filetransfer/EntityInfo';
import type { Long } from '@grpc/proto-loader';

export interface TransferInfo {
  'id'?: (number | string | Long);
  'startTime'?: (_google_protobuf_Timestamp | null);
  'state'?: (_yamcs_protobuf_filetransfer_TransferState);
  'bucket'?: (string);
  'objectName'?: (string);
  'remotePath'?: (string);
  'direction'?: (_yamcs_protobuf_filetransfer_TransferDirection);
  'totalSize'?: (number | string | Long);
  'sizeTransferred'?: (number | string | Long);
  'reliable'?: (boolean);
  'failureReason'?: (string);
  'transactionId'?: (_yamcs_protobuf_filetransfer_TransactionId | null);
  'creationTime'?: (_google_protobuf_Timestamp | null);
  'transferType'?: (string);
  'localEntity'?: (_yamcs_protobuf_filetransfer_EntityInfo | null);
  'remoteEntity'?: (_yamcs_protobuf_filetransfer_EntityInfo | null);
}

export interface TransferInfo__Output {
  'id'?: (string);
  'startTime'?: (_google_protobuf_Timestamp__Output);
  'state'?: (_yamcs_protobuf_filetransfer_TransferState__Output);
  'bucket'?: (string);
  'objectName'?: (string);
  'remotePath'?: (string);
  'direction'?: (_yamcs_protobuf_filetransfer_TransferDirection__Output);
  'totalSize'?: (string);
  'sizeTransferred'?: (string);
  'reliable'?: (boolean);
  'failureReason'?: (string);
  'transactionId'?: (_yamcs_protobuf_filetransfer_TransactionId__Output);
  'creationTime'?: (_google_protobuf_Timestamp__Output);
  'transferType'?: (string);
  'localEntity'?: (_yamcs_protobuf_filetransfer_EntityInfo__Output);
  'remoteEntity'?: (_yamcs_protobuf_filetransfer_EntityInfo__Output);
}
