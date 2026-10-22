// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Long } from '@grpc/proto-loader';

export interface TransactionId {
  'sequenceNumber'?: (number);
  'initiatorEntity'?: (number | string | Long);
}

export interface TransactionId__Output {
  'sequenceNumber'?: (number);
  'initiatorEntity'?: (string);
}
