// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { Long } from '@grpc/proto-loader';

export interface RepeatInfo {
  'fixedCount'?: (number | string | Long);
  'dynamicCount'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
  'bitsBetween'?: (number);
}

export interface RepeatInfo__Output {
  'fixedCount'?: (string);
  'dynamicCount'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
  'bitsBetween'?: (number);
}
