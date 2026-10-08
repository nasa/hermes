// Original file: proto/yamcs/protobuf/commanding/commanding.proto

export const QueueState = {
  BLOCKED: 'BLOCKED',
  DISABLED: 'DISABLED',
  ENABLED: 'ENABLED',
} as const;

export type QueueState =
  | 'BLOCKED'
  | 1
  | 'DISABLED'
  | 2
  | 'ENABLED'
  | 3

export type QueueState__Output = typeof QueueState[keyof typeof QueueState]
