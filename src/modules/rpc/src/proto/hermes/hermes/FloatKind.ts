// Original file: proto/pb/type.proto

export const FloatKind = {
  F_F32: 0,
  F_F64: 1,
} as const;

export type FloatKind =
  | 'F_F32'
  | 0
  | 'F_F64'
  | 1

export type FloatKind__Output = typeof FloatKind[keyof typeof FloatKind]
