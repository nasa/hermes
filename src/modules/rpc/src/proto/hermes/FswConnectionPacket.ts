// Original file: proto/pb/msg.proto

import type { FswInitialPacket as _hermes_FswInitialPacket, FswInitialPacket__Output as _hermes_FswInitialPacket__Output } from '../hermes/FswInitialPacket';
import type { UplinkReply as _hermes_UplinkReply, UplinkReply__Output as _hermes_UplinkReply__Output } from '../hermes/UplinkReply';

export interface FswConnectionPacket {
  'info'?: (_hermes_FswInitialPacket | null);
  'reply'?: (_hermes_UplinkReply | null);
  'value'?: "info"|"reply";
}

export interface FswConnectionPacket__Output {
  'info'?: (_hermes_FswInitialPacket__Output);
  'reply'?: (_hermes_UplinkReply__Output);
}
