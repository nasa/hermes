// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { Long } from '@grpc/proto-loader';

export interface CommandId {
  'generationTime'?: (number | string | Long);
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'commandName'?: (string);
}

export interface CommandId__Output {
  'generationTime'?: (string);
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'commandName'?: (string);
}
