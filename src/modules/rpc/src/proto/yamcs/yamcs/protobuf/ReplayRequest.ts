// Original file: proto/yamcs/protobuf/yamcs.proto

import type { EndAction as _yamcs_protobuf_EndAction, EndAction__Output as _yamcs_protobuf_EndAction__Output } from '../../yamcs/protobuf/EndAction';
import type { ReplaySpeed as _yamcs_protobuf_ReplaySpeed, ReplaySpeed__Output as _yamcs_protobuf_ReplaySpeed__Output } from '../../yamcs/protobuf/ReplaySpeed';
import type { ParameterReplayRequest as _yamcs_protobuf_ParameterReplayRequest, ParameterReplayRequest__Output as _yamcs_protobuf_ParameterReplayRequest__Output } from '../../yamcs/protobuf/ParameterReplayRequest';
import type { PacketReplayRequest as _yamcs_protobuf_PacketReplayRequest, PacketReplayRequest__Output as _yamcs_protobuf_PacketReplayRequest__Output } from '../../yamcs/protobuf/PacketReplayRequest';
import type { EventReplayRequest as _yamcs_protobuf_EventReplayRequest, EventReplayRequest__Output as _yamcs_protobuf_EventReplayRequest__Output } from '../../yamcs/protobuf/EventReplayRequest';
import type { CommandHistoryReplayRequest as _yamcs_protobuf_CommandHistoryReplayRequest, CommandHistoryReplayRequest__Output as _yamcs_protobuf_CommandHistoryReplayRequest__Output } from '../../yamcs/protobuf/CommandHistoryReplayRequest';
import type { PpReplayRequest as _yamcs_protobuf_PpReplayRequest, PpReplayRequest__Output as _yamcs_protobuf_PpReplayRequest__Output } from '../../yamcs/protobuf/PpReplayRequest';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface ReplayRequest {
  'endAction'?: (_yamcs_protobuf_EndAction);
  'speed'?: (_yamcs_protobuf_ReplaySpeed | null);
  'parameterRequest'?: (_yamcs_protobuf_ParameterReplayRequest | null);
  'packetRequest'?: (_yamcs_protobuf_PacketReplayRequest | null);
  'eventRequest'?: (_yamcs_protobuf_EventReplayRequest | null);
  'commandHistoryRequest'?: (_yamcs_protobuf_CommandHistoryReplayRequest | null);
  'ppRequest'?: (_yamcs_protobuf_PpReplayRequest | null);
  'start'?: (_google_protobuf_Timestamp | null);
  'stop'?: (_google_protobuf_Timestamp | null);
  'reverse'?: (boolean);
  'autostart'?: (boolean);
}

export interface ReplayRequest__Output {
  'endAction'?: (_yamcs_protobuf_EndAction__Output);
  'speed'?: (_yamcs_protobuf_ReplaySpeed__Output);
  'parameterRequest'?: (_yamcs_protobuf_ParameterReplayRequest__Output);
  'packetRequest'?: (_yamcs_protobuf_PacketReplayRequest__Output);
  'eventRequest'?: (_yamcs_protobuf_EventReplayRequest__Output);
  'commandHistoryRequest'?: (_yamcs_protobuf_CommandHistoryReplayRequest__Output);
  'ppRequest'?: (_yamcs_protobuf_PpReplayRequest__Output);
  'start'?: (_google_protobuf_Timestamp__Output);
  'stop'?: (_google_protobuf_Timestamp__Output);
  'reverse'?: (boolean);
  'autostart'?: (boolean);
}
