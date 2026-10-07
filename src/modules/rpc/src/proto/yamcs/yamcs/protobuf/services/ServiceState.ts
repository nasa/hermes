// Original file: proto/yamcs/protobuf/services/services.proto

export const ServiceState = {
  NEW: 'NEW',
  STARTING: 'STARTING',
  RUNNING: 'RUNNING',
  STOPPING: 'STOPPING',
  TERMINATED: 'TERMINATED',
  FAILED: 'FAILED',
} as const;

export type ServiceState =
  | 'NEW'
  | 0
  | 'STARTING'
  | 1
  | 'RUNNING'
  | 2
  | 'STOPPING'
  | 3
  | 'TERMINATED'
  | 4
  | 'FAILED'
  | 5

export type ServiceState__Output = typeof ServiceState[keyof typeof ServiceState]
