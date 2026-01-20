// Original file: proto/pb/fsw.proto

import type { FswCapability as _FswCapability, FswCapability__Output as _FswCapability__Output } from './FswCapability';

export interface Fsw {
  'id'?: (string);
  'type'?: (string);
  'profileId'?: (string);
  'forwards'?: (string)[];
  'capabilities'?: (_FswCapability)[];
}

export interface Fsw__Output {
  'id'?: (string);
  'type'?: (string);
  'profileId'?: (string);
  'forwards'?: (string)[];
  'capabilities'?: (_FswCapability__Output)[];
}
