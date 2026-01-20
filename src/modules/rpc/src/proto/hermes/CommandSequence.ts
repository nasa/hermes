// Original file: proto/pb/fsw.proto

import type { CommandValue as _CommandValue, CommandValue__Output as _CommandValue__Output } from './CommandValue';

export interface CommandSequence {
  'commands'?: (_CommandValue)[];
  'languageName'?: (string);
  'metadata'?: ({[key: string]: string});
}

export interface CommandSequence__Output {
  'commands'?: (_CommandValue__Output)[];
  'languageName'?: (string);
  'metadata'?: ({[key: string]: string});
}
