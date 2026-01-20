// Original file: proto/pb/fsw.proto

import type { CommandDef as _CommandDef, CommandDef__Output as _CommandDef__Output } from './CommandDef';
import type { Value as _Value, Value__Output as _Value__Output } from './Value';
import type { CommandOptions as _CommandOptions, CommandOptions__Output as _CommandOptions__Output } from './CommandOptions';

export interface CommandValue {
  'def'?: (_CommandDef | null);
  'args'?: (_Value)[];
  'options'?: (_CommandOptions | null);
  'metadata'?: ({[key: string]: string});
}

export interface CommandValue__Output {
  'def'?: (_CommandDef__Output);
  'args'?: (_Value__Output)[];
  'options'?: (_CommandOptions__Output);
  'metadata'?: ({[key: string]: string});
}
