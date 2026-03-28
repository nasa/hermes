// Original file: proto/pb/fsw.proto

export const FswCapability = {
  COMMAND: 0,
  PARSE_COMMAND: 1,
  SEQUENCE: 2,
  PARSE_SEQUENCE: 3,
  FILE: 4,
  REQUEST: 5,
} as const;

export type FswCapability =
  | 'COMMAND'
  | 0
  | 'PARSE_COMMAND'
  | 1
  | 'SEQUENCE'
  | 2
  | 'PARSE_SEQUENCE'
  | 3
  | 'FILE'
  | 4
  | 'REQUEST'
  | 5

export type FswCapability__Output = typeof FswCapability[keyof typeof FswCapability]
