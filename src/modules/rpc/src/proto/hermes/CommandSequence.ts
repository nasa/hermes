// Original file: proto/pb/fsw.proto

import type { CommandValue as _hermes_CommandValue, CommandValue__Output as _hermes_CommandValue__Output } from '../hermes/CommandValue';

export interface CommandSequence {
  'commands'?: (_hermes_CommandValue)[];
  'languageName'?: (string);
  'metadata'?: ({[key: string]: string});
}

export interface CommandSequence__Output {
  'commands'?: (_hermes_CommandValue__Output)[];
  'languageName'?: (string);
  'metadata'?: ({[key: string]: string});
}
