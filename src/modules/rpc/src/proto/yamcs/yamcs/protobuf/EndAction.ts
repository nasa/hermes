// Original file: proto/yamcs/protobuf/yamcs.proto

export const EndAction = {
  LOOP: 'LOOP',
  QUIT: 'QUIT',
  STOP: 'STOP',
} as const;

export type EndAction =
  | 'LOOP'
  | 1
  | 'QUIT'
  | 2
  | 'STOP'
  | 3

export type EndAction__Output = typeof EndAction[keyof typeof EndAction]
