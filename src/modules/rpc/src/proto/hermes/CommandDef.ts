// Original file: proto/pb/dictionary.proto

import type { Field as _Field, Field__Output as _Field__Output } from './Field';

export interface CommandDef {
  'opcode'?: (number);
  'mnemonic'?: (string);
  'component'?: (string);
  'arguments'?: (_Field)[];
  'metadata'?: (string);
}

export interface CommandDef__Output {
  'opcode'?: (number);
  'mnemonic'?: (string);
  'component'?: (string);
  'arguments'?: (_Field__Output)[];
  'metadata'?: (string);
}
