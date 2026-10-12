// Original file: proto/yamcs/protobuf/instances/instances.proto

import type { MissionDatabase as _yamcs_protobuf_mdb_MissionDatabase, MissionDatabase__Output as _yamcs_protobuf_mdb_MissionDatabase__Output } from '../../../yamcs/protobuf/mdb/MissionDatabase';
import type { ProcessorInfo as _yamcs_protobuf_yamcsManagement_ProcessorInfo, ProcessorInfo__Output as _yamcs_protobuf_yamcsManagement_ProcessorInfo__Output } from '../../../yamcs/protobuf/yamcsManagement/ProcessorInfo';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

// Original file: proto/yamcs/protobuf/instances/instances.proto

export const _yamcs_protobuf_instances_YamcsInstance_InstanceState = {
  OFFLINE: 'OFFLINE',
  INITIALIZING: 'INITIALIZING',
  INITIALIZED: 'INITIALIZED',
  STARTING: 'STARTING',
  RUNNING: 'RUNNING',
  STOPPING: 'STOPPING',
  FAILED: 'FAILED',
} as const;

export type _yamcs_protobuf_instances_YamcsInstance_InstanceState =
  | 'OFFLINE'
  | 0
  | 'INITIALIZING'
  | 1
  | 'INITIALIZED'
  | 2
  | 'STARTING'
  | 3
  | 'RUNNING'
  | 4
  | 'STOPPING'
  | 5
  | 'FAILED'
  | 6

export type _yamcs_protobuf_instances_YamcsInstance_InstanceState__Output = typeof _yamcs_protobuf_instances_YamcsInstance_InstanceState[keyof typeof _yamcs_protobuf_instances_YamcsInstance_InstanceState]

export interface YamcsInstance {
  'name'?: (string);
  'missionDatabase'?: (_yamcs_protobuf_mdb_MissionDatabase | null);
  'processors'?: (_yamcs_protobuf_yamcsManagement_ProcessorInfo)[];
  'failureCause'?: (string);
  'missionTime'?: (_google_protobuf_Timestamp | null);
  'state'?: (_yamcs_protobuf_instances_YamcsInstance_InstanceState);
  'labels'?: ({[key: string]: string});
  'capabilities'?: (string)[];
  'template'?: (string);
  'templateArgs'?: ({[key: string]: string});
  'templateAvailable'?: (boolean);
  'templateChanged'?: (boolean);
}

export interface YamcsInstance__Output {
  'name'?: (string);
  'missionDatabase'?: (_yamcs_protobuf_mdb_MissionDatabase__Output);
  'processors'?: (_yamcs_protobuf_yamcsManagement_ProcessorInfo__Output)[];
  'failureCause'?: (string);
  'missionTime'?: (_google_protobuf_Timestamp__Output);
  'state'?: (_yamcs_protobuf_instances_YamcsInstance_InstanceState__Output);
  'labels'?: ({[key: string]: string});
  'capabilities'?: (string)[];
  'template'?: (string);
  'templateArgs'?: ({[key: string]: string});
  'templateAvailable'?: (boolean);
  'templateChanged'?: (boolean);
}
