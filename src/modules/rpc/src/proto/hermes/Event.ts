// Original file: proto/pb/bus.proto

import type { EventRef as _EventRef, EventRef__Output as _EventRef__Output } from './EventRef';
import type { Time as _Time, Time__Output as _Time__Output } from './Time';
import type { Value as _Value, Value__Output as _Value__Output } from './Value';

export interface Event {
  'ref'?: (_EventRef | null);
  'time'?: (_Time | null);
  'message'?: (string);
  'args'?: (_Value)[];
  'tags'?: ({[key: string]: _Value});
}

export interface Event__Output {
  'ref'?: (_EventRef__Output);
  'time'?: (_Time__Output);
  'message'?: (string);
  'args'?: (_Value__Output)[];
  'tags'?: ({[key: string]: _Value__Output});
}
