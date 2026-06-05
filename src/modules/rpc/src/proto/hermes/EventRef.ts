// Original file: proto/pb/dictionary.proto

import type { EvrSeverity as _hermes_EvrSeverity, EvrSeverity__Output as _hermes_EvrSeverity__Output } from '../hermes/EvrSeverity';

export interface EventRef {
  'id'?: (number);
  'name'?: (string);
  'component'?: (string);
  'severity'?: (_hermes_EvrSeverity);
  'arguments'?: (string)[];
  'dictionary'?: (string);
}

export interface EventRef__Output {
  'id'?: (number);
  'name'?: (string);
  'component'?: (string);
  'severity'?: (_hermes_EvrSeverity__Output);
  'arguments'?: (string)[];
  'dictionary'?: (string);
}
