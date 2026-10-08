// Original file: proto/yamcs/protobuf/commanding/commands_service.proto

import type { CommandHistoryAttribute as _yamcs_protobuf_commanding_CommandHistoryAttribute, CommandHistoryAttribute__Output as _yamcs_protobuf_commanding_CommandHistoryAttribute__Output } from '../../../yamcs/protobuf/commanding/CommandHistoryAttribute';

export interface UpdateCommandHistoryRequest {
  'instance'?: (string);
  'processor'?: (string);
  'name'?: (string);
  'id'?: (string);
  'attributes'?: (_yamcs_protobuf_commanding_CommandHistoryAttribute)[];
}

export interface UpdateCommandHistoryRequest__Output {
  'instance'?: (string);
  'processor'?: (string);
  'name'?: (string);
  'id'?: (string);
  'attributes'?: (_yamcs_protobuf_commanding_CommandHistoryAttribute__Output)[];
}
