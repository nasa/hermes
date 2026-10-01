// Original file: proto/yamcs/protobuf/pvalue/pvalue.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface _yamcs_protobuf_pvalue_TimeSeries_Sample {
  'time'?: (_google_protobuf_Timestamp | null);
  'avg'?: (number | string);
  'min'?: (number | string);
  'max'?: (number | string);
  'n'?: (number);
  'minTime'?: (_google_protobuf_Timestamp | null);
  'maxTime'?: (_google_protobuf_Timestamp | null);
  'firstTime'?: (_google_protobuf_Timestamp | null);
  'lastTime'?: (_google_protobuf_Timestamp | null);
}

export interface _yamcs_protobuf_pvalue_TimeSeries_Sample__Output {
  'time'?: (_google_protobuf_Timestamp__Output);
  'avg'?: (number);
  'min'?: (number);
  'max'?: (number);
  'n'?: (number);
  'minTime'?: (_google_protobuf_Timestamp__Output);
  'maxTime'?: (_google_protobuf_Timestamp__Output);
  'firstTime'?: (_google_protobuf_Timestamp__Output);
  'lastTime'?: (_google_protobuf_Timestamp__Output);
}

export interface TimeSeries {
  'sample'?: (_yamcs_protobuf_pvalue_TimeSeries_Sample)[];
}

export interface TimeSeries__Output {
  'sample'?: (_yamcs_protobuf_pvalue_TimeSeries_Sample__Output)[];
}
