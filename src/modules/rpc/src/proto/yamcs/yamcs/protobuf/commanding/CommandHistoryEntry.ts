// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { CommandId as _yamcs_protobuf_commanding_CommandId, CommandId__Output as _yamcs_protobuf_commanding_CommandId__Output } from '../../../yamcs/protobuf/commanding/CommandId';
import type { CommandHistoryAttribute as _yamcs_protobuf_commanding_CommandHistoryAttribute, CommandHistoryAttribute__Output as _yamcs_protobuf_commanding_CommandHistoryAttribute__Output } from '../../../yamcs/protobuf/commanding/CommandHistoryAttribute';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { CommandAssignment as _yamcs_protobuf_commanding_CommandAssignment, CommandAssignment__Output as _yamcs_protobuf_commanding_CommandAssignment__Output } from '../../../yamcs/protobuf/commanding/CommandAssignment';

export interface CommandHistoryEntry {
  'commandId'?: (_yamcs_protobuf_commanding_CommandId | null);
  'attr'?: (_yamcs_protobuf_commanding_CommandHistoryAttribute)[];
  'generationTime'?: (_google_protobuf_Timestamp | null);
  'id'?: (string);
  'commandName'?: (string);
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'assignments'?: (_yamcs_protobuf_commanding_CommandAssignment)[];
  'aliases'?: ({[key: string]: string});
}

export interface CommandHistoryEntry__Output {
  'commandId'?: (_yamcs_protobuf_commanding_CommandId__Output);
  'attr'?: (_yamcs_protobuf_commanding_CommandHistoryAttribute__Output)[];
  'generationTime'?: (_google_protobuf_Timestamp__Output);
  'id'?: (string);
  'commandName'?: (string);
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'assignments'?: (_yamcs_protobuf_commanding_CommandAssignment__Output)[];
  'aliases'?: ({[key: string]: string});
}
