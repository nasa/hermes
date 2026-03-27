// Original file: proto/pb/type.proto

export const IntKind = {
  INT_U8: 0,
  INT_I8: 1,
  INT_U16: 2,
  INT_I16: 3,
  INT_U32: 4,
  INT_I32: 5,
  INT_U64: 6,
  INT_I64: 7,
} as const;

export type IntKind =
  | 'INT_U8'
  | 0
  | 'INT_I8'
  | 1
  | 'INT_U16'
  | 2
  | 'INT_I16'
  | 3
  | 'INT_U32'
  | 4
  | 'INT_I32'
  | 5
  | 'INT_U64'
  | 6
  | 'INT_I64'
  | 7

export type IntKind__Output = typeof IntKind[keyof typeof IntKind]
