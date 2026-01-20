// Original file: proto/pb/msg.proto

import type { FswInitialPacket as _FswInitialPacket, FswInitialPacket__Output as _FswInitialPacket__Output } from './FswInitialPacket';
import type { UplinkReply as _UplinkReply, UplinkReply__Output as _UplinkReply__Output } from './UplinkReply';

export interface FswConnectionPacket {
  'info'?: (_FswInitialPacket | null);
  'reply'?: (_UplinkReply | null);
  'value'?: "info"|"reply";
}

export interface FswConnectionPacket__Output {
  'info'?: (_FswInitialPacket__Output);
  'reply'?: (_UplinkReply__Output);
}
