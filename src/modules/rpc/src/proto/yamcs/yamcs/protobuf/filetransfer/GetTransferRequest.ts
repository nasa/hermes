// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Long } from '@grpc/proto-loader';

export interface GetTransferRequest {
  'instance'?: (string);
  'id'?: (number | string | Long);
  'serviceName'?: (string);
}

export interface GetTransferRequest__Output {
  'instance'?: (string);
  'id'?: (string);
  'serviceName'?: (string);
}
