// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto

import type { Long } from '@grpc/proto-loader';

// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto

export const _yamcs_protobuf_yamcsManagement_StreamEvent_Type = {
  CREATED: 'CREATED',
  DELETED: 'DELETED',
  UPDATED: 'UPDATED',
} as const;

export type _yamcs_protobuf_yamcsManagement_StreamEvent_Type =
  | 'CREATED'
  | 1
  | 'DELETED'
  | 2
  | 'UPDATED'
  | 3

export type _yamcs_protobuf_yamcsManagement_StreamEvent_Type__Output = typeof _yamcs_protobuf_yamcsManagement_StreamEvent_Type[keyof typeof _yamcs_protobuf_yamcsManagement_StreamEvent_Type]

export interface StreamEvent {
  'type'?: (_yamcs_protobuf_yamcsManagement_StreamEvent_Type);
  'name'?: (string);
  'dataCount'?: (number | string | Long);
}

export interface StreamEvent__Output {
  'type'?: (_yamcs_protobuf_yamcsManagement_StreamEvent_Type__Output);
  'name'?: (string);
  'dataCount'?: (string);
}
