// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Long } from '@grpc/proto-loader';

export interface EntityInfo {
  'name'?: (string);
  'id'?: (number | string | Long);
}

export interface EntityInfo__Output {
  'name'?: (string);
  'id'?: (string);
}
