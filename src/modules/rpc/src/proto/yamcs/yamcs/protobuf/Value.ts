// Original file: proto/yamcs/protobuf/yamcs.proto

import type { AggregateValue as _yamcs_protobuf_AggregateValue, AggregateValue__Output as _yamcs_protobuf_AggregateValue__Output } from '../../yamcs/protobuf/AggregateValue';
import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from '../../yamcs/protobuf/Value';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/yamcs/protobuf/yamcs.proto

export const _yamcs_protobuf_Value_Type = {
  FLOAT: 'FLOAT',
  DOUBLE: 'DOUBLE',
  UINT32: 'UINT32',
  SINT32: 'SINT32',
  BINARY: 'BINARY',
  STRING: 'STRING',
  TIMESTAMP: 'TIMESTAMP',
  UINT64: 'UINT64',
  SINT64: 'SINT64',
  BOOLEAN: 'BOOLEAN',
  AGGREGATE: 'AGGREGATE',
  ARRAY: 'ARRAY',
  ENUMERATED: 'ENUMERATED',
  NONE: 'NONE',
} as const;

export type _yamcs_protobuf_Value_Type =
  | 'FLOAT'
  | 0
  | 'DOUBLE'
  | 1
  | 'UINT32'
  | 2
  | 'SINT32'
  | 3
  | 'BINARY'
  | 4
  | 'STRING'
  | 5
  | 'TIMESTAMP'
  | 6
  | 'UINT64'
  | 7
  | 'SINT64'
  | 8
  | 'BOOLEAN'
  | 9
  | 'AGGREGATE'
  | 10
  | 'ARRAY'
  | 11
  | 'ENUMERATED'
  | 12
  | 'NONE'
  | 13

export type _yamcs_protobuf_Value_Type__Output = typeof _yamcs_protobuf_Value_Type[keyof typeof _yamcs_protobuf_Value_Type]

export interface Value {
  'type'?: (_yamcs_protobuf_Value_Type);
  'floatValue'?: (number | string);
  'doubleValue'?: (number | string);
  'sint32Value'?: (number);
  'uint32Value'?: (number);
  'binaryValue'?: (Buffer | Uint8Array | string);
  'stringValue'?: (string);
  'timestampValue'?: (number | string | Long);
  'uint64Value'?: (number | string | Long);
  'sint64Value'?: (number | string | Long);
  'booleanValue'?: (boolean);
  'aggregateValue'?: (_yamcs_protobuf_AggregateValue | null);
  'arrayValue'?: (_yamcs_protobuf_Value)[];
}

export interface Value__Output {
  'type'?: (_yamcs_protobuf_Value_Type__Output);
  'floatValue'?: (number);
  'doubleValue'?: (number);
  'sint32Value'?: (number);
  'uint32Value'?: (number);
  'binaryValue'?: (Buffer);
  'stringValue'?: (string);
  'timestampValue'?: (string);
  'uint64Value'?: (string);
  'sint64Value'?: (string);
  'booleanValue'?: (boolean);
  'aggregateValue'?: (_yamcs_protobuf_AggregateValue__Output);
  'arrayValue'?: (_yamcs_protobuf_Value__Output)[];
}
