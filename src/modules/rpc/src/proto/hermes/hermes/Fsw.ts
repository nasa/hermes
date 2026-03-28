// Original file: proto/pb/fsw.proto

import type { FswCapability as _hermes_FswCapability, FswCapability__Output as _hermes_FswCapability__Output } from '../hermes/FswCapability';

export interface Fsw {
  'id'?: (string);
  'type'?: (string);
  'profileId'?: (string);
  'forwards'?: (string)[];
  'capabilities'?: (_hermes_FswCapability)[];
  'dictionary'?: (string);
}

export interface Fsw__Output {
  'id'?: (string);
  'type'?: (string);
  'profileId'?: (string);
  'forwards'?: (string)[];
  'capabilities'?: (_hermes_FswCapability__Output)[];
  'dictionary'?: (string);
}
