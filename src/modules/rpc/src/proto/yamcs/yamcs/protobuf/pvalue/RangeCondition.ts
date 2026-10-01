// Original file: proto/yamcs/protobuf/pvalue/pvalue.proto

export const RangeCondition = {
  LOW: 'LOW',
  HIGH: 'HIGH',
} as const;

export type RangeCondition =
  | 'LOW'
  | 0
  | 'HIGH'
  | 1

export type RangeCondition__Output = typeof RangeCondition[keyof typeof RangeCondition]
