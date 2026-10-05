// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface TmStatistics {
  'packetName'?: (string);
  'receivedPackets'?: (number | string | Long);
  'subscribedParameterCount'?: (number);
  'qualifiedName'?: (string);
  'lastReceived'?: (_google_protobuf_Timestamp | null);
  'lastPacketTime'?: (_google_protobuf_Timestamp | null);
  'packetRate'?: (number | string | Long);
  'dataRate'?: (number | string | Long);
}

export interface TmStatistics__Output {
  'packetName'?: (string);
  'receivedPackets'?: (string);
  'subscribedParameterCount'?: (number);
  'qualifiedName'?: (string);
  'lastReceived'?: (_google_protobuf_Timestamp__Output);
  'lastPacketTime'?: (_google_protobuf_Timestamp__Output);
  'packetRate'?: (string);
  'dataRate'?: (string);
}
