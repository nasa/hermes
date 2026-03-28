// Original file: proto/pb/bus.proto

export const SourceContextFilter = {
  REALTIME_ONLY: 0,
  RECORDED_ONLY: 1,
  ALL: 2,
} as const;

export type SourceContextFilter =
  | 'REALTIME_ONLY'
  | 0
  | 'RECORDED_ONLY'
  | 1
  | 'ALL'
  | 2

export type SourceContextFilter__Output = typeof SourceContextFilter[keyof typeof SourceContextFilter]
