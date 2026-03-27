// Original file: proto/pb/msg.proto

import type { Profile as _hermes_Profile, Profile__Output as _hermes_Profile__Output } from '../hermes/Profile';
import type { ProfileState as _hermes_ProfileState, ProfileState__Output as _hermes_ProfileState__Output } from '../hermes/ProfileState';

export interface StatefulProfile {
  'value'?: (_hermes_Profile | null);
  'state'?: (_hermes_ProfileState);
  'runtimeOnly'?: (boolean);
}

export interface StatefulProfile__Output {
  'value'?: (_hermes_Profile__Output);
  'state'?: (_hermes_ProfileState__Output);
  'runtimeOnly'?: (boolean);
}
