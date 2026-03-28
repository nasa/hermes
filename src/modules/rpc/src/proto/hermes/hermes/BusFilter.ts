// Original file: proto/pb/bus.proto

import type { SourceContextFilter as _hermes_SourceContextFilter, SourceContextFilter__Output as _hermes_SourceContextFilter__Output } from '../hermes/SourceContextFilter';

export interface BusFilter {
  'source'?: (string);
  'names'?: (string)[];
  'context'?: (_hermes_SourceContextFilter);
}

export interface BusFilter__Output {
  'source'?: (string);
  'names'?: (string)[];
  'context'?: (_hermes_SourceContextFilter__Output);
}
