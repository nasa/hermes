// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Long } from '@grpc/proto-loader';

export interface PauseTransferRequest {
  'instance'?: (string);
  'id'?: (number | string | Long);
  'serviceName'?: (string);
}

export interface PauseTransferRequest__Output {
  'instance'?: (string);
  'id'?: (string);
  'serviceName'?: (string);
}
