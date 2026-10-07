// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { AlarmRange as _yamcs_protobuf_mdb_AlarmRange, AlarmRange__Output as _yamcs_protobuf_mdb_AlarmRange__Output } from '../../../yamcs/protobuf/mdb/AlarmRange';
import type { EnumerationAlarm as _yamcs_protobuf_mdb_EnumerationAlarm, EnumerationAlarm__Output as _yamcs_protobuf_mdb_EnumerationAlarm__Output } from '../../../yamcs/protobuf/mdb/EnumerationAlarm';
import type { AlarmLevelType as _yamcs_protobuf_mdb_AlarmLevelType, AlarmLevelType__Output as _yamcs_protobuf_mdb_AlarmLevelType__Output } from '../../../yamcs/protobuf/mdb/AlarmLevelType';

export interface AlarmInfo {
  'minViolations'?: (number);
  'staticAlarmRange'?: (_yamcs_protobuf_mdb_AlarmRange)[];
  'enumerationAlarm'?: (_yamcs_protobuf_mdb_EnumerationAlarm)[];
  'staticAlarmRanges'?: (_yamcs_protobuf_mdb_AlarmRange)[];
  'enumerationAlarms'?: (_yamcs_protobuf_mdb_EnumerationAlarm)[];
  'defaultLevel'?: (_yamcs_protobuf_mdb_AlarmLevelType);
}

export interface AlarmInfo__Output {
  'minViolations'?: (number);
  'staticAlarmRange'?: (_yamcs_protobuf_mdb_AlarmRange__Output)[];
  'enumerationAlarm'?: (_yamcs_protobuf_mdb_EnumerationAlarm__Output)[];
  'staticAlarmRanges'?: (_yamcs_protobuf_mdb_AlarmRange__Output)[];
  'enumerationAlarms'?: (_yamcs_protobuf_mdb_EnumerationAlarm__Output)[];
  'defaultLevel'?: (_yamcs_protobuf_mdb_AlarmLevelType__Output);
}
