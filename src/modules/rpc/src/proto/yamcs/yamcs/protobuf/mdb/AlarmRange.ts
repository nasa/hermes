// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { AlarmLevelType as _yamcs_protobuf_mdb_AlarmLevelType, AlarmLevelType__Output as _yamcs_protobuf_mdb_AlarmLevelType__Output } from '../../../yamcs/protobuf/mdb/AlarmLevelType';

export interface AlarmRange {
  'level'?: (_yamcs_protobuf_mdb_AlarmLevelType);
  'minInclusive'?: (number | string);
  'maxInclusive'?: (number | string);
  'minExclusive'?: (number | string);
  'maxExclusive'?: (number | string);
}

export interface AlarmRange__Output {
  'level'?: (_yamcs_protobuf_mdb_AlarmLevelType__Output);
  'minInclusive'?: (number);
  'maxInclusive'?: (number);
  'minExclusive'?: (number);
  'maxExclusive'?: (number);
}
