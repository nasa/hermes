// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';

// Original file: proto/yamcs/protobuf/processing/processing.proto

export const _yamcs_protobuf_processing_SubscribeParametersRequest_Action = {
  REPLACE: 'REPLACE',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
} as const;

export type _yamcs_protobuf_processing_SubscribeParametersRequest_Action =
  | 'REPLACE'
  | 0
  | 'ADD'
  | 1
  | 'REMOVE'
  | 2

export type _yamcs_protobuf_processing_SubscribeParametersRequest_Action__Output = typeof _yamcs_protobuf_processing_SubscribeParametersRequest_Action[keyof typeof _yamcs_protobuf_processing_SubscribeParametersRequest_Action]

export interface SubscribeParametersRequest {
  'instance'?: (string);
  'processor'?: (string);
  'id'?: (_yamcs_protobuf_NamedObjectId)[];
  'abortOnInvalid'?: (boolean);
  'updateOnExpiration'?: (boolean);
  'sendFromCache'?: (boolean);
  'action'?: (_yamcs_protobuf_processing_SubscribeParametersRequest_Action);
  'maxBytes'?: (number);
}

export interface SubscribeParametersRequest__Output {
  'instance'?: (string);
  'processor'?: (string);
  'id'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'abortOnInvalid'?: (boolean);
  'updateOnExpiration'?: (boolean);
  'sendFromCache'?: (boolean);
  'action'?: (_yamcs_protobuf_processing_SubscribeParametersRequest_Action__Output);
  'maxBytes'?: (number);
}
