// Original file: proto/pb/bus.proto

import type { EventRef as _hermes_EventRef, EventRef__Output as _hermes_EventRef__Output } from '../hermes/EventRef';
import type { Time as _hermes_Time, Time__Output as _hermes_Time__Output } from '../hermes/Time';
import type { Value as _hermes_Value, Value__Output as _hermes_Value__Output } from '../hermes/Value';

export interface Event {
  'ref'?: (_hermes_EventRef | null);
  'time'?: (_hermes_Time | null);
  'message'?: (string);
  'args'?: (_hermes_Value)[];
  'tags'?: ({[key: string]: _hermes_Value});
}

export interface Event__Output {
  'ref'?: (_hermes_EventRef__Output);
  'time'?: (_hermes_Time__Output);
  'message'?: (string);
  'args'?: (_hermes_Value__Output)[];
  'tags'?: ({[key: string]: _hermes_Value__Output});
}
