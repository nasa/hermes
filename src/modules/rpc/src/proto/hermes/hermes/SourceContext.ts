// Original file: proto/pb/bus.proto

export const SourceContext = {
  REALTIME: 0,
  RECORDED: 1,
} as const;

export type SourceContext =
  | 'REALTIME'
  | 0
  | 'RECORDED'
  | 1

export type SourceContext__Output = typeof SourceContext[keyof typeof SourceContext]
