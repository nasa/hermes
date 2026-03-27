// Original file: proto/pb/bus.proto

export const FileDownlinkCompletionStatus = {
  DOWNLINK_COMPLETED: 0,
  DOWNLINK_UNKNOWN: -1,
  DOWNLINK_PARTIAL: 1,
  DOWNLINK_CRC_FAILED: 2,
} as const;

export type FileDownlinkCompletionStatus =
  | 'DOWNLINK_COMPLETED'
  | 0
  | 'DOWNLINK_UNKNOWN'
  | -1
  | 'DOWNLINK_PARTIAL'
  | 1
  | 'DOWNLINK_CRC_FAILED'
  | 2

export type FileDownlinkCompletionStatus__Output = typeof FileDownlinkCompletionStatus[keyof typeof FileDownlinkCompletionStatus]
