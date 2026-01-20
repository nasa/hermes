// Original file: proto/pb/fsw.proto

import type { CommandOptions as _CommandOptions, CommandOptions__Output as _CommandOptions__Output } from './CommandOptions';

export interface RawCommandValue {
  'command'?: (string);
  'options'?: (_CommandOptions | null);
  'metadata'?: ({[key: string]: string});
}

export interface RawCommandValue__Output {
  'command'?: (string);
  'options'?: (_CommandOptions__Output);
  'metadata'?: ({[key: string]: string});
}
