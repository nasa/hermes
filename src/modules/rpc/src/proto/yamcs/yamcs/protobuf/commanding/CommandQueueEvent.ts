// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { CommandQueueEntry as _yamcs_protobuf_commanding_CommandQueueEntry, CommandQueueEntry__Output as _yamcs_protobuf_commanding_CommandQueueEntry__Output } from '../../../yamcs/protobuf/commanding/CommandQueueEntry';

// Original file: proto/yamcs/protobuf/commanding/commanding.proto

export const _yamcs_protobuf_commanding_CommandQueueEvent_Type = {
  COMMAND_ADDED: 'COMMAND_ADDED',
  COMMAND_REJECTED: 'COMMAND_REJECTED',
  COMMAND_SENT: 'COMMAND_SENT',
  COMMAND_UPDATED: 'COMMAND_UPDATED',
} as const;

export type _yamcs_protobuf_commanding_CommandQueueEvent_Type =
  | 'COMMAND_ADDED'
  | 1
  | 'COMMAND_REJECTED'
  | 2
  | 'COMMAND_SENT'
  | 3
  | 'COMMAND_UPDATED'
  | 4

export type _yamcs_protobuf_commanding_CommandQueueEvent_Type__Output = typeof _yamcs_protobuf_commanding_CommandQueueEvent_Type[keyof typeof _yamcs_protobuf_commanding_CommandQueueEvent_Type]

export interface CommandQueueEvent {
  'type'?: (_yamcs_protobuf_commanding_CommandQueueEvent_Type);
  'data'?: (_yamcs_protobuf_commanding_CommandQueueEntry | null);
}

export interface CommandQueueEvent__Output {
  'type'?: (_yamcs_protobuf_commanding_CommandQueueEvent_Type__Output);
  'data'?: (_yamcs_protobuf_commanding_CommandQueueEntry__Output);
}
