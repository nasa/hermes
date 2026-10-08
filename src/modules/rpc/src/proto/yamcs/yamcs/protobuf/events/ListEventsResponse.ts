// Original file: proto/yamcs/protobuf/events/events_service.proto

import type { Event as _yamcs_protobuf_events_Event, Event__Output as _yamcs_protobuf_events_Event__Output } from '../../../yamcs/protobuf/events/Event';

export interface ListEventsResponse {
  'event'?: (_yamcs_protobuf_events_Event)[];
  'continuationToken'?: (string);
  'events'?: (_yamcs_protobuf_events_Event)[];
}

export interface ListEventsResponse__Output {
  'event'?: (_yamcs_protobuf_events_Event__Output)[];
  'continuationToken'?: (string);
  'events'?: (_yamcs_protobuf_events_Event__Output)[];
}
