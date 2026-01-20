// Original file: proto/pb/type.proto

import type { Long } from '@grpc/proto-loader';

export interface EnumValue {
  'raw'?: (number | string | Long);
  'formatted'?: (string);
}

export interface EnumValue__Output {
  'raw'?: (Long);
  'formatted'?: (string);
}
