// Original file: proto/yamcs/protobuf/pvalue/pvalue.proto

export const MonitoringResult = {
  DISABLED: 'DISABLED',
  IN_LIMITS: 'IN_LIMITS',
  WATCH: 'WATCH',
  WARNING: 'WARNING',
  DISTRESS: 'DISTRESS',
  CRITICAL: 'CRITICAL',
  SEVERE: 'SEVERE',
} as const;

export type MonitoringResult =
  | 'DISABLED'
  | 0
  | 'IN_LIMITS'
  | 1
  | 'WATCH'
  | 7
  | 'WARNING'
  | 10
  | 'DISTRESS'
  | 13
  | 'CRITICAL'
  | 16
  | 'SEVERE'
  | 19

export type MonitoringResult__Output = typeof MonitoringResult[keyof typeof MonitoringResult]
