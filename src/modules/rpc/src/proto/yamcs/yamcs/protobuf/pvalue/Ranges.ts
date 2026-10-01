// Original file: proto/yamcs/protobuf/pvalue/pvalue.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from '../../../yamcs/protobuf/Value';

export interface _yamcs_protobuf_pvalue_Ranges_Range {
  'start'?: (_google_protobuf_Timestamp | null);
  'stop'?: (_google_protobuf_Timestamp | null);
  'count'?: (number);
  'engValues'?: (_yamcs_protobuf_Value)[];
  'counts'?: (number)[];
  'otherCount'?: (number);
}

export interface _yamcs_protobuf_pvalue_Ranges_Range__Output {
  'start'?: (_google_protobuf_Timestamp__Output);
  'stop'?: (_google_protobuf_Timestamp__Output);
  'count'?: (number);
  'engValues'?: (_yamcs_protobuf_Value__Output)[];
  'counts'?: (number)[];
  'otherCount'?: (number);
}

export interface Ranges {
  'range'?: (_yamcs_protobuf_pvalue_Ranges_Range)[];
}

export interface Ranges__Output {
  'range'?: (_yamcs_protobuf_pvalue_Ranges_Range__Output)[];
}
