// Original file: proto/yamcs/protobuf/commanding/commands_service.proto

import type { CommandHistoryEntry as _yamcs_protobuf_commanding_CommandHistoryEntry, CommandHistoryEntry__Output as _yamcs_protobuf_commanding_CommandHistoryEntry__Output } from '../../../yamcs/protobuf/commanding/CommandHistoryEntry';

export interface ListCommandsResponse {
  'entry'?: (_yamcs_protobuf_commanding_CommandHistoryEntry)[];
  'continuationToken'?: (string);
  'commands'?: (_yamcs_protobuf_commanding_CommandHistoryEntry)[];
}

export interface ListCommandsResponse__Output {
  'entry'?: (_yamcs_protobuf_commanding_CommandHistoryEntry__Output)[];
  'continuationToken'?: (string);
  'commands'?: (_yamcs_protobuf_commanding_CommandHistoryEntry__Output)[];
}
