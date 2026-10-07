// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { AlarmInfo as _yamcs_protobuf_mdb_AlarmInfo, AlarmInfo__Output as _yamcs_protobuf_mdb_AlarmInfo__Output } from '../../../yamcs/protobuf/mdb/AlarmInfo';
import type { ContextAlarmInfo as _yamcs_protobuf_mdb_ContextAlarmInfo, ContextAlarmInfo__Output as _yamcs_protobuf_mdb_ContextAlarmInfo__Output } from '../../../yamcs/protobuf/mdb/ContextAlarmInfo';
import type { EnumValue as _yamcs_protobuf_mdb_EnumValue, EnumValue__Output as _yamcs_protobuf_mdb_EnumValue__Output } from '../../../yamcs/protobuf/mdb/EnumValue';

export interface CreateParameterTypeRequest {
  'instance'?: (string);
  'name'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'aliases'?: ({[key: string]: string});
  'engType'?: (string);
  'unit'?: (string);
  'signed'?: (boolean);
  'defaultAlarm'?: (_yamcs_protobuf_mdb_AlarmInfo | null);
  'contextAlarms'?: (_yamcs_protobuf_mdb_ContextAlarmInfo)[];
  'enumerationValues'?: (_yamcs_protobuf_mdb_EnumValue)[];
  'zeroStringValue'?: (string);
  'oneStringValue'?: (string);
}

export interface CreateParameterTypeRequest__Output {
  'instance'?: (string);
  'name'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'aliases'?: ({[key: string]: string});
  'engType'?: (string);
  'unit'?: (string);
  'signed'?: (boolean);
  'defaultAlarm'?: (_yamcs_protobuf_mdb_AlarmInfo__Output);
  'contextAlarms'?: (_yamcs_protobuf_mdb_ContextAlarmInfo__Output)[];
  'enumerationValues'?: (_yamcs_protobuf_mdb_EnumValue__Output)[];
  'zeroStringValue'?: (string);
  'oneStringValue'?: (string);
}
