// Original file: proto/pb/type.proto

export const NumberKind = {
  NUMBER_U8: 0,
  NUMBER_I8: 1,
  NUMBER_U16: 2,
  NUMBER_I16: 3,
  NUMBER_U32: 4,
  NUMBER_I32: 5,
  NUMBER_U64: 6,
  NUMBER_I64: 7,
  NUMBER_F32: 8,
  NUMBER_F64: 9,
} as const;

export type NumberKind =
  | 'NUMBER_U8'
  | 0
  | 'NUMBER_I8'
  | 1
  | 'NUMBER_U16'
  | 2
  | 'NUMBER_I16'
  | 3
  | 'NUMBER_U32'
  | 4
  | 'NUMBER_I32'
  | 5
  | 'NUMBER_U64'
  | 6
  | 'NUMBER_I64'
  | 7
  | 'NUMBER_F32'
  | 8
  | 'NUMBER_F64'
  | 9

export type NumberKind__Output = typeof NumberKind[keyof typeof NumberKind]
