// Original file: proto/pb/profile.proto

export const ProfileState = {
  PROFILE_IDLE: 0,
  PROFILE_CONNECTING: 1,
  PROFILE_ACTIVE: 2,
  PROFILE_DISCONNECT: 3,
} as const;

export type ProfileState =
  | 'PROFILE_IDLE'
  | 0
  | 'PROFILE_CONNECTING'
  | 1
  | 'PROFILE_ACTIVE'
  | 2
  | 'PROFILE_DISCONNECT'
  | 3

export type ProfileState__Output = typeof ProfileState[keyof typeof ProfileState]
