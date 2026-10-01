// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ComparisonInfo as _yamcs_protobuf_mdb_ComparisonInfo, ComparisonInfo__Output as _yamcs_protobuf_mdb_ComparisonInfo__Output } from '../../../yamcs/protobuf/mdb/ComparisonInfo';
import type { CalibratorInfo as _yamcs_protobuf_mdb_CalibratorInfo, CalibratorInfo__Output as _yamcs_protobuf_mdb_CalibratorInfo__Output } from '../../../yamcs/protobuf/mdb/CalibratorInfo';

export interface ContextCalibratorInfo {
  'comparison'?: (_yamcs_protobuf_mdb_ComparisonInfo)[];
  'calibrator'?: (_yamcs_protobuf_mdb_CalibratorInfo | null);
  'context'?: (string);
}

export interface ContextCalibratorInfo__Output {
  'comparison'?: (_yamcs_protobuf_mdb_ComparisonInfo__Output)[];
  'calibrator'?: (_yamcs_protobuf_mdb_CalibratorInfo__Output);
  'context'?: (string);
}
