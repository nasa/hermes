// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { SignificanceInfo as _yamcs_protobuf_mdb_SignificanceInfo, SignificanceInfo__Output as _yamcs_protobuf_mdb_SignificanceInfo__Output } from '../../../yamcs/protobuf/mdb/SignificanceInfo';

export interface CommandSignificance {
  'sequenceNumber'?: (number);
  'significance'?: (_yamcs_protobuf_mdb_SignificanceInfo | null);
}

export interface CommandSignificance__Output {
  'sequenceNumber'?: (number);
  'significance'?: (_yamcs_protobuf_mdb_SignificanceInfo__Output);
}
