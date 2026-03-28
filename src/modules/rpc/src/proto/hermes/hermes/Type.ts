// Original file: proto/pb/type.proto

import type { ReferenceType as _hermes_ReferenceType, ReferenceType__Output as _hermes_ReferenceType__Output } from '../hermes/ReferenceType';
import type { BooleanType as _hermes_BooleanType, BooleanType__Output as _hermes_BooleanType__Output } from '../hermes/BooleanType';
import type { IntType as _hermes_IntType, IntType__Output as _hermes_IntType__Output } from '../hermes/IntType';
import type { FloatType as _hermes_FloatType, FloatType__Output as _hermes_FloatType__Output } from '../hermes/FloatType';
import type { StringType as _hermes_StringType, StringType__Output as _hermes_StringType__Output } from '../hermes/StringType';
import type { EnumType as _hermes_EnumType, EnumType__Output as _hermes_EnumType__Output } from '../hermes/EnumType';
import type { ObjectType as _hermes_ObjectType, ObjectType__Output as _hermes_ObjectType__Output } from '../hermes/ObjectType';
import type { ArrayType as _hermes_ArrayType, ArrayType__Output as _hermes_ArrayType__Output } from '../hermes/ArrayType';
import type { BytesType as _hermes_BytesType, BytesType__Output as _hermes_BytesType__Output } from '../hermes/BytesType';
import type { VoidType as _hermes_VoidType, VoidType__Output as _hermes_VoidType__Output } from '../hermes/VoidType';

export interface Type {
  'ref'?: (_hermes_ReferenceType | null);
  'bool'?: (_hermes_BooleanType | null);
  'int'?: (_hermes_IntType | null);
  'float'?: (_hermes_FloatType | null);
  'string'?: (_hermes_StringType | null);
  'enum'?: (_hermes_EnumType | null);
  'bitmask'?: (_hermes_EnumType | null);
  'object'?: (_hermes_ObjectType | null);
  'array'?: (_hermes_ArrayType | null);
  'bytes'?: (_hermes_BytesType | null);
  'void'?: (_hermes_VoidType | null);
  'metadata'?: (string);
  'value'?: "ref"|"bool"|"int"|"float"|"string"|"enum"|"bitmask"|"object"|"array"|"bytes"|"void";
}

export interface Type__Output {
  'ref'?: (_hermes_ReferenceType__Output);
  'bool'?: (_hermes_BooleanType__Output);
  'int'?: (_hermes_IntType__Output);
  'float'?: (_hermes_FloatType__Output);
  'string'?: (_hermes_StringType__Output);
  'enum'?: (_hermes_EnumType__Output);
  'bitmask'?: (_hermes_EnumType__Output);
  'object'?: (_hermes_ObjectType__Output);
  'array'?: (_hermes_ArrayType__Output);
  'bytes'?: (_hermes_BytesType__Output);
  'void'?: (_hermes_VoidType__Output);
  'metadata'?: (string);
}
