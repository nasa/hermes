// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { ArgumentTypeInfo as _yamcs_protobuf_mdb_ArgumentTypeInfo, ArgumentTypeInfo__Output as _yamcs_protobuf_mdb_ArgumentTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentTypeInfo';

export interface ArgumentMemberInfo {
  'name'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'type'?: (_yamcs_protobuf_mdb_ArgumentTypeInfo | null);
  'initialValue'?: (string);
}

export interface ArgumentMemberInfo__Output {
  'name'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'type'?: (_yamcs_protobuf_mdb_ArgumentTypeInfo__Output);
  'initialValue'?: (string);
}
