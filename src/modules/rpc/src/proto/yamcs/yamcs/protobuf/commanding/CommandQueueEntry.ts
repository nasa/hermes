// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { CommandAssignment as _yamcs_protobuf_commanding_CommandAssignment, CommandAssignment__Output as _yamcs_protobuf_commanding_CommandAssignment__Output } from '../../../yamcs/protobuf/commanding/CommandAssignment';

export interface CommandQueueEntry {
  'instance'?: (string);
  'processorName'?: (string);
  'queueName'?: (string);
  'binary'?: (Buffer | Uint8Array | string);
  'username'?: (string);
  'comment'?: (string);
  'generationTime'?: (_google_protobuf_Timestamp | null);
  'pendingTransmissionConstraints'?: (boolean);
  'id'?: (string);
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'commandName'?: (string);
  'assignments'?: (_yamcs_protobuf_commanding_CommandAssignment)[];
}

export interface CommandQueueEntry__Output {
  'instance'?: (string);
  'processorName'?: (string);
  'queueName'?: (string);
  'binary'?: (Buffer);
  'username'?: (string);
  'comment'?: (string);
  'generationTime'?: (_google_protobuf_Timestamp__Output);
  'pendingTransmissionConstraints'?: (boolean);
  'id'?: (string);
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'commandName'?: (string);
  'assignments'?: (_yamcs_protobuf_commanding_CommandAssignment__Output)[];
}
