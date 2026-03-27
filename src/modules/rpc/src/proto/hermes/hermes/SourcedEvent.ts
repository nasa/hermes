// Original file: proto/pb/bus.proto

import type { Event as _hermes_Event, Event__Output as _hermes_Event__Output } from '../hermes/Event';
import type { SourceContext as _hermes_SourceContext, SourceContext__Output as _hermes_SourceContext__Output } from '../hermes/SourceContext';

export interface SourcedEvent {
  'event'?: (_hermes_Event | null);
  'source'?: (string);
  'context'?: (_hermes_SourceContext);
}

export interface SourcedEvent__Output {
  'event'?: (_hermes_Event__Output);
  'source'?: (string);
  'context'?: (_hermes_SourceContext__Output);
}
