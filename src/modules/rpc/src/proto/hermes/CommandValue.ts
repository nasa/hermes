// Original file: proto/pb/fsw.proto

import type { CommandDef as _hermes_CommandDef, CommandDef__Output as _hermes_CommandDef__Output } from '../hermes/CommandDef';
import type { Value as _hermes_Value, Value__Output as _hermes_Value__Output } from '../hermes/Value';
import type { CommandOptions as _hermes_CommandOptions, CommandOptions__Output as _hermes_CommandOptions__Output } from '../hermes/CommandOptions';

export interface CommandValue {
  'def'?: (_hermes_CommandDef | null);
  'args'?: (_hermes_Value)[];
  'options'?: (_hermes_CommandOptions | null);
  'metadata'?: ({[key: string]: string});
}

export interface CommandValue__Output {
  'def'?: (_hermes_CommandDef__Output);
  'args'?: (_hermes_Value__Output)[];
  'options'?: (_hermes_CommandOptions__Output);
  'metadata'?: ({[key: string]: string});
}
