// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const DataSourceType = {
  TELEMETERED: 'TELEMETERED',
  DERIVED: 'DERIVED',
  CONSTANT: 'CONSTANT',
  LOCAL: 'LOCAL',
  SYSTEM: 'SYSTEM',
  COMMAND: 'COMMAND',
  COMMAND_HISTORY: 'COMMAND_HISTORY',
  EXTERNAL1: 'EXTERNAL1',
  EXTERNAL2: 'EXTERNAL2',
  EXTERNAL3: 'EXTERNAL3',
  GROUND: 'GROUND',
} as const;

export type DataSourceType =
  | 'TELEMETERED'
  | 0
  | 'DERIVED'
  | 1
  | 'CONSTANT'
  | 2
  | 'LOCAL'
  | 3
  | 'SYSTEM'
  | 4
  | 'COMMAND'
  | 5
  | 'COMMAND_HISTORY'
  | 6
  | 'EXTERNAL1'
  | 7
  | 'EXTERNAL2'
  | 8
  | 'EXTERNAL3'
  | 9
  | 'GROUND'
  | 10

export type DataSourceType__Output = typeof DataSourceType[keyof typeof DataSourceType]
