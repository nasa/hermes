// Original file: proto/pb/time.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';

export interface Time {
  'unix'?: (_google_protobuf_Timestamp | null);
  'sclk'?: (number | string);
}

export interface Time__Output {
  'unix'?: (_google_protobuf_Timestamp__Output);
  'sclk'?: (number);
}
