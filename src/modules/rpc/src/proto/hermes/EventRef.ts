// Original file: proto/pb/dictionary.proto

import type { EvrSeverity as _EvrSeverity, EvrSeverity__Output as _EvrSeverity__Output } from './EvrSeverity';

export interface EventRef {
  'id'?: (number);
  'name'?: (string);
  'component'?: (string);
  'severity'?: (_EvrSeverity);
  'arguments'?: (string)[];
  'dictionary'?: (string);
}

export interface EventRef__Output {
  'id'?: (number);
  'name'?: (string);
  'component'?: (string);
  'severity'?: (_EvrSeverity__Output);
  'arguments'?: (string)[];
  'dictionary'?: (string);
}
