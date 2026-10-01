// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto

import type { TmStatistics as _yamcs_protobuf_yamcsManagement_TmStatistics, TmStatistics__Output as _yamcs_protobuf_yamcsManagement_TmStatistics__Output } from '../../../yamcs/protobuf/yamcsManagement/TmStatistics';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface Statistics {
  'instance'?: (string);
  'tmstats'?: (_yamcs_protobuf_yamcsManagement_TmStatistics)[];
  'lastUpdated'?: (_google_protobuf_Timestamp | null);
  'processor'?: (string);
}

export interface Statistics__Output {
  'instance'?: (string);
  'tmstats'?: (_yamcs_protobuf_yamcsManagement_TmStatistics__Output)[];
  'lastUpdated'?: (_google_protobuf_Timestamp__Output);
  'processor'?: (string);
}
