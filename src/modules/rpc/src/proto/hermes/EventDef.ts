// Original file: proto/pb/dictionary.proto

import type { EvrSeverity as _hermes_EvrSeverity, EvrSeverity__Output as _hermes_EvrSeverity__Output } from '../hermes/EvrSeverity';
import type { Field as _hermes_Field, Field__Output as _hermes_Field__Output } from '../hermes/Field';
import type { FormatString as _hermes_FormatString, FormatString__Output as _hermes_FormatString__Output } from '../hermes/FormatString';

export interface EventDef {
  'id'?: (number);
  'component'?: (string);
  'name'?: (string);
  'severity'?: (_hermes_EvrSeverity);
  'formatString'?: (string);
  'arguments'?: (_hermes_Field)[];
  'metadata'?: (string);
  'format'?: (_hermes_FormatString | null);
}

export interface EventDef__Output {
  'id'?: (number);
  'component'?: (string);
  'name'?: (string);
  'severity'?: (_hermes_EvrSeverity__Output);
  'formatString'?: (string);
  'arguments'?: (_hermes_Field__Output)[];
  'metadata'?: (string);
  'format'?: (_hermes_FormatString__Output);
}
