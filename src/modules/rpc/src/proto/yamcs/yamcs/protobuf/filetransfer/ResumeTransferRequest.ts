// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Long } from '@grpc/proto-loader';

export interface ResumeTransferRequest {
  'instance'?: (string);
  'id'?: (number | string | Long);
  'serviceName'?: (string);
}

export interface ResumeTransferRequest__Output {
  'instance'?: (string);
  'id'?: (string);
  'serviceName'?: (string);
}
