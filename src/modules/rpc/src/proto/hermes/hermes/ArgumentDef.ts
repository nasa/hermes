// Original file: proto/pb/dictionary.proto

import type { XtceDef as _hermes_XtceDef, XtceDef__Output as _hermes_XtceDef__Output } from '../hermes/XtceDef';
import type { Type as _hermes_Type, Type__Output as _hermes_Type__Output } from '../hermes/Type';
import type { Value as _hermes_Value, Value__Output as _hermes_Value__Output } from '../hermes/Value';

export interface ArgumentDef {
  'def'?: (_hermes_XtceDef | null);
  'type'?: (_hermes_Type | null);
  'initialValue'?: (_hermes_Value | null);
  '_initialValue'?: "initialValue";
}

export interface ArgumentDef__Output {
  'def'?: (_hermes_XtceDef__Output);
  'type'?: (_hermes_Type__Output);
  'initialValue'?: (_hermes_Value__Output);
}
