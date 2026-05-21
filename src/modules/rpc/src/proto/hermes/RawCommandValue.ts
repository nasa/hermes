// Original file: proto/pb/fsw.proto

import type { CommandOptions as _hermes_CommandOptions, CommandOptions__Output as _hermes_CommandOptions__Output } from '../hermes/CommandOptions';

export interface RawCommandValue {
  'command'?: (string);
  'options'?: (_hermes_CommandOptions | null);
  'metadata'?: ({[key: string]: string});
}

export interface RawCommandValue__Output {
  'command'?: (string);
  'options'?: (_hermes_CommandOptions__Output);
  'metadata'?: ({[key: string]: string});
}
