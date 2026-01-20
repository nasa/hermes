// Original file: proto/pb/type.proto

export const SIntKind = {
  SINT_I8: 0,
  SINT_I16: 1,
  SINT_I32: 2,
  SINT_I64: 3,
} as const;

export type SIntKind =
  | 'SINT_I8'
  | 0
  | 'SINT_I16'
  | 1
  | 'SINT_I32'
  | 2
  | 'SINT_I64'
  | 3

export type SIntKind__Output = typeof SIntKind[keyof typeof SIntKind]
