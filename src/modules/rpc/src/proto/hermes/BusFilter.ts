// Original file: proto/pb/bus.proto

import type { SourceContextFilter as _SourceContextFilter, SourceContextFilter__Output as _SourceContextFilter__Output } from './SourceContextFilter';

export interface BusFilter {
  'source'?: (string);
  'names'?: (string)[];
  'context'?: (_SourceContextFilter);
}

export interface BusFilter__Output {
  'source'?: (string);
  'names'?: (string)[];
  'context'?: (_SourceContextFilter__Output);
}
