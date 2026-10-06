// Original file: proto/yamcs/protobuf/events/events.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

// Original file: proto/yamcs/protobuf/events/events.proto

export const _yamcs_protobuf_events_Event_EventSeverity = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  WATCH: 'WATCH',
  WARNING_NEW: 'WARNING_NEW',
  DISTRESS: 'DISTRESS',
  CRITICAL: 'CRITICAL',
  SEVERE: 'SEVERE',
} as const;

export type _yamcs_protobuf_events_Event_EventSeverity =
  | 'INFO'
  | 0
  | 'WARNING'
  | 1
  | 'ERROR'
  | 2
  | 'WATCH'
  | 3
  | 'WARNING_NEW'
  | 4
  | 'DISTRESS'
  | 5
  | 'CRITICAL'
  | 6
  | 'SEVERE'
  | 7

export type _yamcs_protobuf_events_Event_EventSeverity__Output = typeof _yamcs_protobuf_events_Event_EventSeverity[keyof typeof _yamcs_protobuf_events_Event_EventSeverity]

export interface Event {
  'source'?: (string);
  'generationTime'?: (_google_protobuf_Timestamp | null);
  'receptionTime'?: (_google_protobuf_Timestamp | null);
  'seqNumber'?: (number);
  'type'?: (string);
  'message'?: (string);
  'severity'?: (_yamcs_protobuf_events_Event_EventSeverity);
  'createdBy'?: (string);
  'extra'?: ({[key: string]: string});
}

export interface Event__Output {
  'source'?: (string);
  'generationTime'?: (_google_protobuf_Timestamp__Output);
  'receptionTime'?: (_google_protobuf_Timestamp__Output);
  'seqNumber'?: (number);
  'type'?: (string);
  'message'?: (string);
  'severity'?: (_yamcs_protobuf_events_Event_EventSeverity__Output);
  'createdBy'?: (string);
  'extra'?: ({[key: string]: string});
}
