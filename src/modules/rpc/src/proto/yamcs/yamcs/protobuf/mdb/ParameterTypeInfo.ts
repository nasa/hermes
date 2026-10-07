// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { DataEncodingInfo as _yamcs_protobuf_mdb_DataEncodingInfo, DataEncodingInfo__Output as _yamcs_protobuf_mdb_DataEncodingInfo__Output } from '../../../yamcs/protobuf/mdb/DataEncodingInfo';
import type { UnitInfo as _yamcs_protobuf_mdb_UnitInfo, UnitInfo__Output as _yamcs_protobuf_mdb_UnitInfo__Output } from '../../../yamcs/protobuf/mdb/UnitInfo';
import type { AlarmInfo as _yamcs_protobuf_mdb_AlarmInfo, AlarmInfo__Output as _yamcs_protobuf_mdb_AlarmInfo__Output } from '../../../yamcs/protobuf/mdb/AlarmInfo';
import type { EnumValue as _yamcs_protobuf_mdb_EnumValue, EnumValue__Output as _yamcs_protobuf_mdb_EnumValue__Output } from '../../../yamcs/protobuf/mdb/EnumValue';
import type { AbsoluteTimeInfo as _yamcs_protobuf_mdb_AbsoluteTimeInfo, AbsoluteTimeInfo__Output as _yamcs_protobuf_mdb_AbsoluteTimeInfo__Output } from '../../../yamcs/protobuf/mdb/AbsoluteTimeInfo';
import type { ContextAlarmInfo as _yamcs_protobuf_mdb_ContextAlarmInfo, ContextAlarmInfo__Output as _yamcs_protobuf_mdb_ContextAlarmInfo__Output } from '../../../yamcs/protobuf/mdb/ContextAlarmInfo';
import type { MemberInfo as _yamcs_protobuf_mdb_MemberInfo, MemberInfo__Output as _yamcs_protobuf_mdb_MemberInfo__Output } from '../../../yamcs/protobuf/mdb/MemberInfo';
import type { ArrayInfo as _yamcs_protobuf_mdb_ArrayInfo, ArrayInfo__Output as _yamcs_protobuf_mdb_ArrayInfo__Output } from '../../../yamcs/protobuf/mdb/ArrayInfo';
import type { AncillaryDataInfo as _yamcs_protobuf_mdb_AncillaryDataInfo, AncillaryDataInfo__Output as _yamcs_protobuf_mdb_AncillaryDataInfo__Output } from '../../../yamcs/protobuf/mdb/AncillaryDataInfo';
import type { NumberFormatTypeInfo as _yamcs_protobuf_mdb_NumberFormatTypeInfo, NumberFormatTypeInfo__Output as _yamcs_protobuf_mdb_NumberFormatTypeInfo__Output } from '../../../yamcs/protobuf/mdb/NumberFormatTypeInfo';
import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { EnumRange as _yamcs_protobuf_mdb_EnumRange, EnumRange__Output as _yamcs_protobuf_mdb_EnumRange__Output } from '../../../yamcs/protobuf/mdb/EnumRange';
import type { ValidRangeInfo as _yamcs_protobuf_mdb_ValidRangeInfo, ValidRangeInfo__Output as _yamcs_protobuf_mdb_ValidRangeInfo__Output } from '../../../yamcs/protobuf/mdb/ValidRangeInfo';

export interface ParameterTypeInfo {
  'engType'?: (string);
  'dataEncoding'?: (_yamcs_protobuf_mdb_DataEncodingInfo | null);
  'unitSet'?: (_yamcs_protobuf_mdb_UnitInfo)[];
  'defaultAlarm'?: (_yamcs_protobuf_mdb_AlarmInfo | null);
  'enumValue'?: (_yamcs_protobuf_mdb_EnumValue)[];
  'absoluteTimeInfo'?: (_yamcs_protobuf_mdb_AbsoluteTimeInfo | null);
  'contextAlarm'?: (_yamcs_protobuf_mdb_ContextAlarmInfo)[];
  'member'?: (_yamcs_protobuf_mdb_MemberInfo)[];
  'arrayInfo'?: (_yamcs_protobuf_mdb_ArrayInfo | null);
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo});
  'numberFormat'?: (_yamcs_protobuf_mdb_NumberFormatTypeInfo | null);
  'signed'?: (boolean);
  'zeroStringValue'?: (string);
  'oneStringValue'?: (string);
  'usedBy'?: (_yamcs_protobuf_mdb_ParameterInfo)[];
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'sizeInBits'?: (number);
  'enumValues'?: (_yamcs_protobuf_mdb_EnumValue)[];
  'enumRanges'?: (_yamcs_protobuf_mdb_EnumRange)[];
  'initialValue'?: (string);
  'rawValidRange'?: (_yamcs_protobuf_mdb_ValidRangeInfo | null);
  'engValidRange'?: (_yamcs_protobuf_mdb_ValidRangeInfo | null);
}

export interface ParameterTypeInfo__Output {
  'engType'?: (string);
  'dataEncoding'?: (_yamcs_protobuf_mdb_DataEncodingInfo__Output);
  'unitSet'?: (_yamcs_protobuf_mdb_UnitInfo__Output)[];
  'defaultAlarm'?: (_yamcs_protobuf_mdb_AlarmInfo__Output);
  'enumValue'?: (_yamcs_protobuf_mdb_EnumValue__Output)[];
  'absoluteTimeInfo'?: (_yamcs_protobuf_mdb_AbsoluteTimeInfo__Output);
  'contextAlarm'?: (_yamcs_protobuf_mdb_ContextAlarmInfo__Output)[];
  'member'?: (_yamcs_protobuf_mdb_MemberInfo__Output)[];
  'arrayInfo'?: (_yamcs_protobuf_mdb_ArrayInfo__Output);
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo__Output});
  'numberFormat'?: (_yamcs_protobuf_mdb_NumberFormatTypeInfo__Output);
  'signed'?: (boolean);
  'zeroStringValue'?: (string);
  'oneStringValue'?: (string);
  'usedBy'?: (_yamcs_protobuf_mdb_ParameterInfo__Output)[];
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'sizeInBits'?: (number);
  'enumValues'?: (_yamcs_protobuf_mdb_EnumValue__Output)[];
  'enumRanges'?: (_yamcs_protobuf_mdb_EnumRange__Output)[];
  'initialValue'?: (string);
  'rawValidRange'?: (_yamcs_protobuf_mdb_ValidRangeInfo__Output);
  'engValidRange'?: (_yamcs_protobuf_mdb_ValidRangeInfo__Output);
}
