// Original file: proto/pb/dictionary.proto

export const ComparisonOperator = {
  EQUAL: 0,
  NOT_EQUAL: 1,
  LESS_THAN: 2,
  GREATER_THAN: 3,
  LESS_THAN_OR_EQUAL: 4,
  GREATER_THAN_OR_EQUAL: 5,
} as const;

export type ComparisonOperator =
  | 'EQUAL'
  | 0
  | 'NOT_EQUAL'
  | 1
  | 'LESS_THAN'
  | 2
  | 'GREATER_THAN'
  | 3
  | 'LESS_THAN_OR_EQUAL'
  | 4
  | 'GREATER_THAN_OR_EQUAL'
  | 5

export type ComparisonOperator__Output = typeof ComparisonOperator[keyof typeof ComparisonOperator]
