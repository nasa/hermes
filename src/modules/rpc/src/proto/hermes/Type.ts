// Original file: proto/pb/type.proto

import type { ReferenceType as _ReferenceType, ReferenceType__Output as _ReferenceType__Output } from './ReferenceType';
import type { BooleanType as _BooleanType, BooleanType__Output as _BooleanType__Output } from './BooleanType';
import type { IntType as _IntType, IntType__Output as _IntType__Output } from './IntType';
import type { FloatType as _FloatType, FloatType__Output as _FloatType__Output } from './FloatType';
import type { StringType as _StringType, StringType__Output as _StringType__Output } from './StringType';
import type { EnumType as _EnumType, EnumType__Output as _EnumType__Output } from './EnumType';
import type { ObjectType as _ObjectType, ObjectType__Output as _ObjectType__Output } from './ObjectType';
import type { ArrayType as _ArrayType, ArrayType__Output as _ArrayType__Output } from './ArrayType';
import type { BytesType as _BytesType, BytesType__Output as _BytesType__Output } from './BytesType';
import type { VoidType as _VoidType, VoidType__Output as _VoidType__Output } from './VoidType';

export interface Type {
  'ref'?: (_ReferenceType | null);
  'bool'?: (_BooleanType | null);
  'int'?: (_IntType | null);
  'float'?: (_FloatType | null);
  'string'?: (_StringType | null);
  'enum'?: (_EnumType | null);
  'bitmask'?: (_EnumType | null);
  'object'?: (_ObjectType | null);
  'array'?: (_ArrayType | null);
  'bytes'?: (_BytesType | null);
  'void'?: (_VoidType | null);
  'metadata'?: (string);
  'value'?: "ref"|"bool"|"int"|"float"|"string"|"enum"|"bitmask"|"object"|"array"|"bytes"|"void";
}

export interface Type__Output {
  'ref'?: (_ReferenceType__Output);
  'bool'?: (_BooleanType__Output);
  'int'?: (_IntType__Output);
  'float'?: (_FloatType__Output);
  'string'?: (_StringType__Output);
  'enum'?: (_EnumType__Output);
  'bitmask'?: (_EnumType__Output);
  'object'?: (_ObjectType__Output);
  'array'?: (_ArrayType__Output);
  'bytes'?: (_BytesType__Output);
  'void'?: (_VoidType__Output);
  'metadata'?: (string);
}
