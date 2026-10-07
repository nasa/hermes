// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { DataSourceType as _yamcs_protobuf_mdb_DataSourceType, DataSourceType__Output as _yamcs_protobuf_mdb_DataSourceType__Output } from '../../../yamcs/protobuf/mdb/DataSourceType';
import type { EnumValue as _yamcs_protobuf_mdb_EnumValue, EnumValue__Output as _yamcs_protobuf_mdb_EnumValue__Output } from '../../../yamcs/protobuf/mdb/EnumValue';
import type { EnumRange as _yamcs_protobuf_mdb_EnumRange, EnumRange__Output as _yamcs_protobuf_mdb_EnumRange__Output } from '../../../yamcs/protobuf/mdb/EnumRange';

export interface SubscribedParameterInfo {
  'parameter'?: (string);
  'units'?: (string);
  'dataSource'?: (_yamcs_protobuf_mdb_DataSourceType);
  'enumValues'?: (_yamcs_protobuf_mdb_EnumValue)[];
  'enumRanges'?: (_yamcs_protobuf_mdb_EnumRange)[];
}

export interface SubscribedParameterInfo__Output {
  'parameter'?: (string);
  'units'?: (string);
  'dataSource'?: (_yamcs_protobuf_mdb_DataSourceType__Output);
  'enumValues'?: (_yamcs_protobuf_mdb_EnumValue__Output)[];
  'enumRanges'?: (_yamcs_protobuf_mdb_EnumRange__Output)[];
}
