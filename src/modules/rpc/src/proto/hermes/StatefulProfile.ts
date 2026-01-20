// Original file: proto/pb/msg.proto

import type { Profile as _Profile, Profile__Output as _Profile__Output } from './Profile';
import type { ProfileState as _ProfileState, ProfileState__Output as _ProfileState__Output } from './ProfileState';

export interface StatefulProfile {
  'value'?: (_Profile | null);
  'state'?: (_ProfileState);
  'runtimeOnly'?: (boolean);
}

export interface StatefulProfile__Output {
  'value'?: (_Profile__Output);
  'state'?: (_ProfileState__Output);
  'runtimeOnly'?: (boolean);
}
