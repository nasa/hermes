// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ArgumentTypeInfo as _yamcs_protobuf_mdb_ArgumentTypeInfo, ArgumentTypeInfo__Output as _yamcs_protobuf_mdb_ArgumentTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentTypeInfo';

export interface ArgumentInfo {
  'name'?: (string);
  'description'?: (string);
  'initialValue'?: (string);
  'type'?: (_yamcs_protobuf_mdb_ArgumentTypeInfo | null);
}

export interface ArgumentInfo__Output {
  'name'?: (string);
  'description'?: (string);
  'initialValue'?: (string);
  'type'?: (_yamcs_protobuf_mdb_ArgumentTypeInfo__Output);
}
