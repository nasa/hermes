// Original file: proto/yamcs/protobuf/yamcs.proto

import type { ReplayRequest as _yamcs_protobuf_ReplayRequest, ReplayRequest__Output as _yamcs_protobuf_ReplayRequest__Output } from '../../yamcs/protobuf/ReplayRequest';

// Original file: proto/yamcs/protobuf/yamcs.proto

export const _yamcs_protobuf_ReplayStatus_ReplayState = {
  INITIALIZATION: 'INITIALIZATION',
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  ERROR: 'ERROR',
  PAUSED: 'PAUSED',
  CLOSED: 'CLOSED',
} as const;

export type _yamcs_protobuf_ReplayStatus_ReplayState =
  | 'INITIALIZATION'
  | 0
  | 'RUNNING'
  | 1
  | 'STOPPED'
  | 2
  | 'ERROR'
  | 3
  | 'PAUSED'
  | 4
  | 'CLOSED'
  | 5

export type _yamcs_protobuf_ReplayStatus_ReplayState__Output = typeof _yamcs_protobuf_ReplayStatus_ReplayState[keyof typeof _yamcs_protobuf_ReplayStatus_ReplayState]

export interface ReplayStatus {
  'state'?: (_yamcs_protobuf_ReplayStatus_ReplayState);
  'request'?: (_yamcs_protobuf_ReplayRequest | null);
  'errorMessage'?: (string);
}

export interface ReplayStatus__Output {
  'state'?: (_yamcs_protobuf_ReplayStatus_ReplayState__Output);
  'request'?: (_yamcs_protobuf_ReplayRequest__Output);
  'errorMessage'?: (string);
}
