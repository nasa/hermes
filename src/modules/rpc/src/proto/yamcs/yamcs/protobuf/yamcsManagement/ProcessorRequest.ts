// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto

import type { ReplaySpeed as _yamcs_protobuf_ReplaySpeed, ReplaySpeed__Output as _yamcs_protobuf_ReplaySpeed__Output } from '../../../yamcs/protobuf/ReplaySpeed';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto

export const _yamcs_protobuf_yamcsManagement_ProcessorRequest_Operation = {
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  SEEK: 'SEEK',
  CHANGE_SPEED: 'CHANGE_SPEED',
} as const;

export type _yamcs_protobuf_yamcsManagement_ProcessorRequest_Operation =
  | 'PAUSE'
  | 2
  | 'RESUME'
  | 3
  | 'SEEK'
  | 4
  | 'CHANGE_SPEED'
  | 5

export type _yamcs_protobuf_yamcsManagement_ProcessorRequest_Operation__Output = typeof _yamcs_protobuf_yamcsManagement_ProcessorRequest_Operation[keyof typeof _yamcs_protobuf_yamcsManagement_ProcessorRequest_Operation]

export interface ProcessorRequest {
  'operation'?: (_yamcs_protobuf_yamcsManagement_ProcessorRequest_Operation);
  'instance'?: (string);
  'name'?: (string);
  'seekTime'?: (number | string | Long);
  'replaySpeed'?: (_yamcs_protobuf_ReplaySpeed | null);
}

export interface ProcessorRequest__Output {
  'operation'?: (_yamcs_protobuf_yamcsManagement_ProcessorRequest_Operation__Output);
  'instance'?: (string);
  'name'?: (string);
  'seekTime'?: (string);
  'replaySpeed'?: (_yamcs_protobuf_ReplaySpeed__Output);
}
