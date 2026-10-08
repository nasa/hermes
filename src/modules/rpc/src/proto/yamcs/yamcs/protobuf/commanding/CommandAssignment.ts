// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from '../../../yamcs/protobuf/Value';

export interface CommandAssignment {
  'name'?: (string);
  'value'?: (_yamcs_protobuf_Value | null);
  'userInput'?: (boolean);
}

export interface CommandAssignment__Output {
  'name'?: (string);
  'value'?: (_yamcs_protobuf_Value__Output);
  'userInput'?: (boolean);
}
