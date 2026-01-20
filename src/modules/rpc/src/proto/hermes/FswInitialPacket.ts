// Original file: proto/pb/msg.proto

import type { Fsw as _Fsw, Fsw__Output as _Fsw__Output } from './Fsw';

export interface FswInitialPacket {
  'info'?: (_Fsw | null);
  'profile'?: (string);
}

export interface FswInitialPacket__Output {
  'info'?: (_Fsw__Output);
  'profile'?: (string);
}
