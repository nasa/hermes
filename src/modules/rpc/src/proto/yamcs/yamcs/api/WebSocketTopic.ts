// Original file: proto/yamcs/api/annotations.proto

import type { WebSocketTopic as _yamcs_api_WebSocketTopic, WebSocketTopic__Output as _yamcs_api_WebSocketTopic__Output } from '../../yamcs/api/WebSocketTopic';

export interface WebSocketTopic {
  'topic'?: (string);
  'deprecated'?: (boolean);
  'additionalBindings'?: (_yamcs_api_WebSocketTopic)[];
  'label'?: (string);
}

export interface WebSocketTopic__Output {
  'topic'?: (string);
  'deprecated'?: (boolean);
  'additionalBindings'?: (_yamcs_api_WebSocketTopic__Output)[];
  'label'?: (string);
}
