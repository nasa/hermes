// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

export const TransferState = {
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
  QUEUED: 'QUEUED',
  CANCELLING: 'CANCELLING',
} as const;

export type TransferState =
  | 'RUNNING'
  | 1
  | 'PAUSED'
  | 2
  | 'FAILED'
  | 3
  | 'COMPLETED'
  | 4
  | 'QUEUED'
  | 5
  | 'CANCELLING'
  | 6

export type TransferState__Output = typeof TransferState[keyof typeof TransferState]
