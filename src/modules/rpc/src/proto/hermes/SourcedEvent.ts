// Original file: proto/pb/bus.proto

import type { Event as _Event, Event__Output as _Event__Output } from './Event';
import type { SourceContext as _SourceContext, SourceContext__Output as _SourceContext__Output } from './SourceContext';

export interface SourcedEvent {
  'event'?: (_Event | null);
  'source'?: (string);
  'context'?: (_SourceContext);
}

export interface SourcedEvent__Output {
  'event'?: (_Event__Output);
  'source'?: (string);
  'context'?: (_SourceContext__Output);
}
