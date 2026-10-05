// Original file: proto/yamcs/api/annotations.proto

export const FieldBehavior = {
  FIELD_BEHAVIOR_UNSPECIFIED: 'FIELD_BEHAVIOR_UNSPECIFIED',
  SECRET: 'SECRET',
} as const;

export type FieldBehavior =
  | 'FIELD_BEHAVIOR_UNSPECIFIED'
  | 0
  | 'SECRET'
  | 1

export type FieldBehavior__Output = typeof FieldBehavior[keyof typeof FieldBehavior]
