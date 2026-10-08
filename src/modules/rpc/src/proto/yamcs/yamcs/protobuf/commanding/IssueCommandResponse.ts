// Original file: proto/yamcs/protobuf/commanding/commands_service.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { CommandAssignment as _yamcs_protobuf_commanding_CommandAssignment, CommandAssignment__Output as _yamcs_protobuf_commanding_CommandAssignment__Output } from '../../../yamcs/protobuf/commanding/CommandAssignment';

export interface IssueCommandResponse {
  'binary'?: (Buffer | Uint8Array | string);
  'id'?: (string);
  'generationTime'?: (_google_protobuf_Timestamp | null);
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'commandName'?: (string);
  'queue'?: (string);
  'username'?: (string);
  'assignments'?: (_yamcs_protobuf_commanding_CommandAssignment)[];
  'unprocessedBinary'?: (Buffer | Uint8Array | string);
  'aliases'?: ({[key: string]: string});
}

export interface IssueCommandResponse__Output {
  'binary'?: (Buffer);
  'id'?: (string);
  'generationTime'?: (_google_protobuf_Timestamp__Output);
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'commandName'?: (string);
  'queue'?: (string);
  'username'?: (string);
  'assignments'?: (_yamcs_protobuf_commanding_CommandAssignment__Output)[];
  'unprocessedBinary'?: (Buffer);
  'aliases'?: ({[key: string]: string});
}
