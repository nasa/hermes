// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { QueueState as _yamcs_protobuf_commanding_QueueState, QueueState__Output as _yamcs_protobuf_commanding_QueueState__Output } from '../../../yamcs/protobuf/commanding/QueueState';
import type { _yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType, _yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType__Output } from '../../../yamcs/protobuf/mdb/SignificanceInfo';
import type { CommandQueueEntry as _yamcs_protobuf_commanding_CommandQueueEntry, CommandQueueEntry__Output as _yamcs_protobuf_commanding_CommandQueueEntry__Output } from '../../../yamcs/protobuf/commanding/CommandQueueEntry';

export interface CommandQueueInfo {
  'instance'?: (string);
  'processorName'?: (string);
  'name'?: (string);
  'state'?: (_yamcs_protobuf_commanding_QueueState);
  'order'?: (number);
  'users'?: (string)[];
  'groups'?: (string)[];
  'minLevel'?: (_yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType);
  'tcPatterns'?: (string)[];
  'entries'?: (_yamcs_protobuf_commanding_CommandQueueEntry)[];
  'acceptedCommandsCount'?: (number);
  'rejectedCommandsCount'?: (number);
}

export interface CommandQueueInfo__Output {
  'instance'?: (string);
  'processorName'?: (string);
  'name'?: (string);
  'state'?: (_yamcs_protobuf_commanding_QueueState__Output);
  'order'?: (number);
  'users'?: (string)[];
  'groups'?: (string)[];
  'minLevel'?: (_yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType__Output);
  'tcPatterns'?: (string)[];
  'entries'?: (_yamcs_protobuf_commanding_CommandQueueEntry__Output)[];
  'acceptedCommandsCount'?: (number);
  'rejectedCommandsCount'?: (number);
}
