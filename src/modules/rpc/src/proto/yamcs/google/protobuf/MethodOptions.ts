// Original file: null

import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from '../../google/protobuf/FeatureSet';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { HttpRoute as _yamcs_api_HttpRoute, HttpRoute__Output as _yamcs_api_HttpRoute__Output } from '../../yamcs/api/HttpRoute';
import type { WebSocketTopic as _yamcs_api_WebSocketTopic, WebSocketTopic__Output as _yamcs_api_WebSocketTopic__Output } from '../../yamcs/api/WebSocketTopic';

// Original file: null

export const _google_protobuf_MethodOptions_IdempotencyLevel = {
  IDEMPOTENCY_UNKNOWN: 'IDEMPOTENCY_UNKNOWN',
  NO_SIDE_EFFECTS: 'NO_SIDE_EFFECTS',
  IDEMPOTENT: 'IDEMPOTENT',
} as const;

export type _google_protobuf_MethodOptions_IdempotencyLevel =
  | 'IDEMPOTENCY_UNKNOWN'
  | 0
  | 'NO_SIDE_EFFECTS'
  | 1
  | 'IDEMPOTENT'
  | 2

export type _google_protobuf_MethodOptions_IdempotencyLevel__Output = typeof _google_protobuf_MethodOptions_IdempotencyLevel[keyof typeof _google_protobuf_MethodOptions_IdempotencyLevel]

export interface MethodOptions {
  'deprecated'?: (boolean);
  'idempotencyLevel'?: (_google_protobuf_MethodOptions_IdempotencyLevel);
  'features'?: (_google_protobuf_FeatureSet | null);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.yamcs.api.route'?: (_yamcs_api_HttpRoute | null);
  '.yamcs.api.websocket'?: (_yamcs_api_WebSocketTopic | null);
}

export interface MethodOptions__Output {
  'deprecated'?: (boolean);
  'idempotencyLevel'?: (_google_protobuf_MethodOptions_IdempotencyLevel__Output);
  'features'?: (_google_protobuf_FeatureSet__Output);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption__Output)[];
  '.yamcs.api.route'?: (_yamcs_api_HttpRoute__Output);
  '.yamcs.api.websocket'?: (_yamcs_api_WebSocketTopic__Output);
}
