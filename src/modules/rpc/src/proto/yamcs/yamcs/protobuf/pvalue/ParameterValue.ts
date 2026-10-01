// Original file: proto/yamcs/protobuf/pvalue/pvalue.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from '../../../yamcs/protobuf/Value';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { AcquisitionStatus as _yamcs_protobuf_pvalue_AcquisitionStatus, AcquisitionStatus__Output as _yamcs_protobuf_pvalue_AcquisitionStatus__Output } from '../../../yamcs/protobuf/pvalue/AcquisitionStatus';
import type { MonitoringResult as _yamcs_protobuf_pvalue_MonitoringResult, MonitoringResult__Output as _yamcs_protobuf_pvalue_MonitoringResult__Output } from '../../../yamcs/protobuf/pvalue/MonitoringResult';
import type { RangeCondition as _yamcs_protobuf_pvalue_RangeCondition, RangeCondition__Output as _yamcs_protobuf_pvalue_RangeCondition__Output } from '../../../yamcs/protobuf/pvalue/RangeCondition';
import type { AlarmRange as _yamcs_protobuf_mdb_AlarmRange, AlarmRange__Output as _yamcs_protobuf_mdb_AlarmRange__Output } from '../../../yamcs/protobuf/mdb/AlarmRange';
import type { Long } from '@grpc/proto-loader';

export interface ParameterValue {
  'id'?: (_yamcs_protobuf_NamedObjectId | null);
  'rawValue'?: (_yamcs_protobuf_Value | null);
  'engValue'?: (_yamcs_protobuf_Value | null);
  'acquisitionTime'?: (_google_protobuf_Timestamp | null);
  'generationTime'?: (_google_protobuf_Timestamp | null);
  'acquisitionStatus'?: (_yamcs_protobuf_pvalue_AcquisitionStatus);
  'processingStatus'?: (boolean);
  'monitoringResult'?: (_yamcs_protobuf_pvalue_MonitoringResult);
  'rangeCondition'?: (_yamcs_protobuf_pvalue_RangeCondition);
  'alarmRange'?: (_yamcs_protobuf_mdb_AlarmRange)[];
  'expireMillis'?: (number | string | Long);
  'numericId'?: (number);
}

export interface ParameterValue__Output {
  'id'?: (_yamcs_protobuf_NamedObjectId__Output);
  'rawValue'?: (_yamcs_protobuf_Value__Output);
  'engValue'?: (_yamcs_protobuf_Value__Output);
  'acquisitionTime'?: (_google_protobuf_Timestamp__Output);
  'generationTime'?: (_google_protobuf_Timestamp__Output);
  'acquisitionStatus'?: (_yamcs_protobuf_pvalue_AcquisitionStatus__Output);
  'processingStatus'?: (boolean);
  'monitoringResult'?: (_yamcs_protobuf_pvalue_MonitoringResult__Output);
  'rangeCondition'?: (_yamcs_protobuf_pvalue_RangeCondition__Output);
  'alarmRange'?: (_yamcs_protobuf_mdb_AlarmRange__Output)[];
  'expireMillis'?: (string);
  'numericId'?: (number);
}
