// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';

export interface AbsoluteTimeInfo {
  'initialValue'?: (string);
  'scale'?: (number | string);
  'offset'?: (number | string);
  'offsetFrom'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
  'epoch'?: (string);
}

export interface AbsoluteTimeInfo__Output {
  'initialValue'?: (string);
  'scale'?: (number);
  'offset'?: (number);
  'offsetFrom'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
  'epoch'?: (string);
}
