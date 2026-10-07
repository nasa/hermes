// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { Long } from '@grpc/proto-loader';

export interface ArgumentDimensionInfo {
  'fixedValue'?: (number | string | Long);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
  'argument'?: (string);
  'slope'?: (number | string | Long);
  'intercept'?: (number | string | Long);
}

export interface ArgumentDimensionInfo__Output {
  'fixedValue'?: (string);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
  'argument'?: (string);
  'slope'?: (string);
  'intercept'?: (string);
}
