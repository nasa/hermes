// Original file: proto/pb/dictionary.proto

import type { EvrSeverity as _EvrSeverity, EvrSeverity__Output as _EvrSeverity__Output } from './EvrSeverity';
import type { Field as _Field, Field__Output as _Field__Output } from './Field';

export interface EventDef {
  'id'?: (number);
  'component'?: (string);
  'name'?: (string);
  'severity'?: (_EvrSeverity);
  'formatString'?: (string);
  'arguments'?: (_Field)[];
  'metadata'?: (string);
}

export interface EventDef__Output {
  'id'?: (number);
  'component'?: (string);
  'name'?: (string);
  'severity'?: (_EvrSeverity__Output);
  'formatString'?: (string);
  'arguments'?: (_Field__Output)[];
  'metadata'?: (string);
}
