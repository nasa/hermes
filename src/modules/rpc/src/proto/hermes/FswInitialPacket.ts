// Original file: proto/pb/msg.proto

import type { Fsw as _hermes_Fsw, Fsw__Output as _hermes_Fsw__Output } from '../hermes/Fsw';

export interface FswInitialPacket {
  'info'?: (_hermes_Fsw | null);
  'profile'?: (string);
}

export interface FswInitialPacket__Output {
  'info'?: (_hermes_Fsw__Output);
  'profile'?: (string);
}
