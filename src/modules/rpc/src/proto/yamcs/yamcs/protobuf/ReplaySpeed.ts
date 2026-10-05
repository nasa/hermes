// Original file: proto/yamcs/protobuf/yamcs.proto


// Original file: proto/yamcs/protobuf/yamcs.proto

export const _yamcs_protobuf_ReplaySpeed_ReplaySpeedType = {
  AFAP: 'AFAP',
  FIXED_DELAY: 'FIXED_DELAY',
  REALTIME: 'REALTIME',
  STEP_BY_STEP: 'STEP_BY_STEP',
} as const;

export type _yamcs_protobuf_ReplaySpeed_ReplaySpeedType =
  | 'AFAP'
  | 1
  | 'FIXED_DELAY'
  | 2
  | 'REALTIME'
  | 3
  | 'STEP_BY_STEP'
  | 4

export type _yamcs_protobuf_ReplaySpeed_ReplaySpeedType__Output = typeof _yamcs_protobuf_ReplaySpeed_ReplaySpeedType[keyof typeof _yamcs_protobuf_ReplaySpeed_ReplaySpeedType]

export interface ReplaySpeed {
  'type'?: (_yamcs_protobuf_ReplaySpeed_ReplaySpeedType);
  'param'?: (number | string);
}

export interface ReplaySpeed__Output {
  'type'?: (_yamcs_protobuf_ReplaySpeed_ReplaySpeedType__Output);
  'param'?: (number);
}
