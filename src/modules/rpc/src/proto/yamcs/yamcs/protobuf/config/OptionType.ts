// Original file: proto/yamcs/protobuf/config/config.proto

export const OptionType = {
  ANY: 'ANY',
  BOOLEAN: 'BOOLEAN',
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  LIST: 'LIST',
  LIST_OR_ELEMENT: 'LIST_OR_ELEMENT',
  MAP: 'MAP',
  STRING: 'STRING',
} as const;

export type OptionType =
  | 'ANY'
  | 1
  | 'BOOLEAN'
  | 2
  | 'INTEGER'
  | 3
  | 'FLOAT'
  | 4
  | 'LIST'
  | 5
  | 'LIST_OR_ELEMENT'
  | 6
  | 'MAP'
  | 7
  | 'STRING'
  | 8

export type OptionType__Output = typeof OptionType[keyof typeof OptionType]
