// Original file: proto/yamcs/api/annotations.proto

import type { HttpRoute as _yamcs_api_HttpRoute, HttpRoute__Output as _yamcs_api_HttpRoute__Output } from '../../yamcs/api/HttpRoute';

export interface HttpRoute {
  'get'?: (string);
  'put'?: (string);
  'post'?: (string);
  'delete'?: (string);
  'patch'?: (string);
  'deprecated'?: (boolean);
  'body'?: (string);
  'maxBodySize'?: (number);
  'offloaded'?: (boolean);
  'fieldMaskRoot'?: (string);
  'additionalBindings'?: (_yamcs_api_HttpRoute)[];
  'log'?: (string);
  'label'?: (string);
  'pattern'?: "get"|"put"|"post"|"delete"|"patch";
}

export interface HttpRoute__Output {
  'get'?: (string);
  'put'?: (string);
  'post'?: (string);
  'delete'?: (string);
  'patch'?: (string);
  'deprecated'?: (boolean);
  'body'?: (string);
  'maxBodySize'?: (number);
  'offloaded'?: (boolean);
  'fieldMaskRoot'?: (string);
  'additionalBindings'?: (_yamcs_api_HttpRoute__Output)[];
  'log'?: (string);
  'label'?: (string);
}
