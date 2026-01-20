// Original file: proto/pb/dictionary.proto

export const EvrSeverity = {
  EVR_DIAGNOSTIC: 0,
  EVR_ACTIVITY_LOW: 1,
  EVR_ACTIVITY_HIGH: 2,
  EVR_WARNING_LOW: 3,
  EVR_WARNING_HIGH: 4,
  EVR_COMMAND: 5,
  EVR_FATAL: 6,
} as const;

export type EvrSeverity =
  | 'EVR_DIAGNOSTIC'
  | 0
  | 'EVR_ACTIVITY_LOW'
  | 1
  | 'EVR_ACTIVITY_HIGH'
  | 2
  | 'EVR_WARNING_LOW'
  | 3
  | 'EVR_WARNING_HIGH'
  | 4
  | 'EVR_COMMAND'
  | 5
  | 'EVR_FATAL'
  | 6

export type EvrSeverity__Output = typeof EvrSeverity[keyof typeof EvrSeverity]
