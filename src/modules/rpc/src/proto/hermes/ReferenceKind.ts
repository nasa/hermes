// Original file: proto/pb/type.proto

export const ReferenceKind = {
  REF_ENUM: 0,
  REF_BITMASK: 1,
  REF_OBJECT: 2,
  REF_ARRAY: 3,
  REF_BYTES: 4,
} as const;

export type ReferenceKind =
  | 'REF_ENUM'
  | 0
  | 'REF_BITMASK'
  | 1
  | 'REF_OBJECT'
  | 2
  | 'REF_ARRAY'
  | 3
  | 'REF_BYTES'
  | 4

export type ReferenceKind__Output = typeof ReferenceKind[keyof typeof ReferenceKind]
