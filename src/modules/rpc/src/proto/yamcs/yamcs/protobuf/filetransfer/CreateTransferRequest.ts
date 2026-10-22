// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { TransferDirection as _yamcs_protobuf_filetransfer_TransferDirection, TransferDirection__Output as _yamcs_protobuf_filetransfer_TransferDirection__Output } from '../../../yamcs/protobuf/filetransfer/TransferDirection';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../google/protobuf/Struct';

export interface CreateTransferRequest {
  'instance'?: (string);
  'direction'?: (_yamcs_protobuf_filetransfer_TransferDirection);
  'bucket'?: (string);
  'objectName'?: (string);
  'remotePath'?: (string);
  'serviceName'?: (string);
  'source'?: (string);
  'destination'?: (string);
  'options'?: (_google_protobuf_Struct | null);
}

export interface CreateTransferRequest__Output {
  'instance'?: (string);
  'direction'?: (_yamcs_protobuf_filetransfer_TransferDirection__Output);
  'bucket'?: (string);
  'objectName'?: (string);
  'remotePath'?: (string);
  'serviceName'?: (string);
  'source'?: (string);
  'destination'?: (string);
  'options'?: (_google_protobuf_Struct__Output);
}
