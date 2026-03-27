// Original file: proto/pb/type.proto

export const UIntKind = {
  UINT_U8: 0,
  UINT_U16: 1,
  UINT_U32: 2,
  UINT_U64: 3,
} as const;

export type UIntKind =
  | 'UINT_U8'
  | 0
  | 'UINT_U16'
  | 1
  | 'UINT_U32'
  | 2
  | 'UINT_U64'
  | 3

export type UIntKind__Output = typeof UIntKind[keyof typeof UIntKind]
