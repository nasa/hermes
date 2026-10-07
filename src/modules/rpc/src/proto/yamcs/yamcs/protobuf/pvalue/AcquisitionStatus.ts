// Original file: proto/yamcs/protobuf/pvalue/pvalue.proto

export const AcquisitionStatus = {
  ACQUIRED: 'ACQUIRED',
  NOT_RECEIVED: 'NOT_RECEIVED',
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED',
} as const;

export type AcquisitionStatus =
  | 'ACQUIRED'
  | 0
  | 'NOT_RECEIVED'
  | 1
  | 'INVALID'
  | 2
  | 'EXPIRED'
  | 3

export type AcquisitionStatus__Output = typeof AcquisitionStatus[keyof typeof AcquisitionStatus]
