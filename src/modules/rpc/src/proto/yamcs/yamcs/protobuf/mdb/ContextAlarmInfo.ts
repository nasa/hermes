// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ComparisonInfo as _yamcs_protobuf_mdb_ComparisonInfo, ComparisonInfo__Output as _yamcs_protobuf_mdb_ComparisonInfo__Output } from '../../../yamcs/protobuf/mdb/ComparisonInfo';
import type { AlarmInfo as _yamcs_protobuf_mdb_AlarmInfo, AlarmInfo__Output as _yamcs_protobuf_mdb_AlarmInfo__Output } from '../../../yamcs/protobuf/mdb/AlarmInfo';

export interface ContextAlarmInfo {
  'comparison'?: (_yamcs_protobuf_mdb_ComparisonInfo)[];
  'alarm'?: (_yamcs_protobuf_mdb_AlarmInfo | null);
  'context'?: (string);
}

export interface ContextAlarmInfo__Output {
  'comparison'?: (_yamcs_protobuf_mdb_ComparisonInfo__Output)[];
  'alarm'?: (_yamcs_protobuf_mdb_AlarmInfo__Output);
  'context'?: (string);
}
