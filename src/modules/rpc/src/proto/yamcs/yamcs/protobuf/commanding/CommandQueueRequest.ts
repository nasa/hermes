// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { CommandQueueInfo as _yamcs_protobuf_commanding_CommandQueueInfo, CommandQueueInfo__Output as _yamcs_protobuf_commanding_CommandQueueInfo__Output } from '../../../yamcs/protobuf/commanding/CommandQueueInfo';
import type { CommandQueueEntry as _yamcs_protobuf_commanding_CommandQueueEntry, CommandQueueEntry__Output as _yamcs_protobuf_commanding_CommandQueueEntry__Output } from '../../../yamcs/protobuf/commanding/CommandQueueEntry';

export interface CommandQueueRequest {
  'queueInfo'?: (_yamcs_protobuf_commanding_CommandQueueInfo | null);
  'queueEntry'?: (_yamcs_protobuf_commanding_CommandQueueEntry | null);
  'rebuild'?: (boolean);
}

export interface CommandQueueRequest__Output {
  'queueInfo'?: (_yamcs_protobuf_commanding_CommandQueueInfo__Output);
  'queueEntry'?: (_yamcs_protobuf_commanding_CommandQueueEntry__Output);
  'rebuild'?: (boolean);
}
