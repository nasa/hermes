// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const AlarmLevelType = {
  NORMAL: 'NORMAL',
  WATCH: 'WATCH',
  WARNING: 'WARNING',
  DISTRESS: 'DISTRESS',
  CRITICAL: 'CRITICAL',
  SEVERE: 'SEVERE',
} as const;

export type AlarmLevelType =
  | 'NORMAL'
  | 0
  | 'WATCH'
  | 1
  | 'WARNING'
  | 2
  | 'DISTRESS'
  | 3
  | 'CRITICAL'
  | 4
  | 'SEVERE'
  | 5

export type AlarmLevelType__Output = typeof AlarmLevelType[keyof typeof AlarmLevelType]
