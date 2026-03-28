// Original file: proto/pb/dictionary.proto

import type { Field as _hermes_Field, Field__Output as _hermes_Field__Output } from '../hermes/Field';

export interface CommandDef {
  'opcode'?: (number);
  'mnemonic'?: (string);
  'component'?: (string);
  'arguments'?: (_hermes_Field)[];
  'metadata'?: (string);
}

export interface CommandDef__Output {
  'opcode'?: (number);
  'mnemonic'?: (string);
  'component'?: (string);
  'arguments'?: (_hermes_Field__Output)[];
  'metadata'?: (string);
}
