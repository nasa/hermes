use crate::types::common::NamedObjectId;
use crate::types::events::Event;
use crate::types::mdb::Parameter;
use crate::types::monitoring::ParameterValue;
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

/// Global alarm status summary
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlobalAlarmStatus {
    pub unacknowledged_count: u32,
    pub unacknowledged_active: bool,
    pub unacknowledged_severity: Option<String>,
    pub acknowledged_count: u32,
    pub acknowledged_active: bool,
    pub acknowledged_severity: Option<String>,
    pub shelved_count: u32,
    pub shelved_active: bool,
    pub shelved_severity: Option<String>,
}

/// Request to subscribe to global alarm status
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribeGlobalAlarmStatusRequest {
    pub instance: String,
    pub processor: String,
}

/// Request to subscribe to alarms
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribeAlarmsRequest {
    pub instance: String,
    pub processor: String,
    pub include_pending: bool,
}

/// List of alarms response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ListAlarmsResponse {
    pub alarms: Vec<Alarm>,
}

/// Alarm notification type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AlarmNotificationType {
    Active,
    TriggeredPending,
    Triggered,
    SeverityIncreased,
    ValueUpdated,
    Acknowledged,
    Cleared,
    Rtn,
    Shelved,
    Unshelved,
    Reset,
}

/// Alarm severity level
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AlarmSeverity {
    Watch,
    Warning,
    Distress,
    Critical,
    Severe,
}

/// Alarm type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AlarmType {
    Event,
    Parameter,
}

/// Alarm information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Alarm {
    pub seq_num: u64,
    #[serde(rename = "type")]
    pub alarm_type: AlarmType,
    pub notification_type: AlarmNotificationType,
    pub id: NamedObjectId,
    pub update_time: String,
    pub trigger_time: String,
    pub violations: u32,
    pub count: u32,
    pub acknowledge_info: Option<AlarmAcknowledgeInfo>,
    pub shelve_info: Option<ShelveInfo>,
    pub clear_info: Option<ClearInfo>,
    pub severity: AlarmSeverity,
    #[serde(rename = "readonly")]
    pub read_only: bool,
    pub latching: bool,
    pub process_ok: bool,
    pub triggered: bool,
    pub acknowledged: bool,
    pub pending: Option<bool>,
    pub parameter_detail: Option<ParameterAlarmData>,
    pub event_detail: Option<EventAlarmData>,
}

/// Parameter alarm detail
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterAlarmData {
    pub trigger_value: ParameterValue,
    pub most_severe_value: ParameterValue,
    pub current_value: ParameterValue,
    pub parameter: Parameter,
}

/// Event alarm detail
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EventAlarmData {
    pub trigger_event: Event,
    pub most_severe_event: Event,
    pub current_event: Event,
}

/// Alarm acknowledge information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlarmAcknowledgeInfo {
    pub acknowledged_by: Option<String>,
    pub acknowledge_message: Option<String>,
    pub acknowledge_time: Option<String>,
}

/// Alarm shelve information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ShelveInfo {
    pub shelved_by: Option<String>,
    pub shelve_message: Option<String>,
    pub shelve_time: Option<String>,
    pub shelve_expiration: Option<String>,
}

/// Alarm clear information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClearInfo {
    pub cleared_by: Option<String>,
    pub clear_time: Option<String>,
    pub clear_message: Option<String>,
}

/// Options for querying alarms
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAlarmsOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub detail: Option<bool>,
    pub pos: Option<u32>,
    pub limit: Option<u32>,
    pub order: Option<crate::types::monitoring::SortOrder>,
}

/// Options for acknowledging an alarm
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgeAlarmOptions {
    pub comment: Option<String>,
}

/// Options for shelving an alarm
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ShelveAlarmOptions {
    pub comment: Option<String>,
    pub shelve_duration: Option<i64>,
}

/// Options for clearing an alarm
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClearAlarmOptions {
    pub comment: Option<String>,
}
