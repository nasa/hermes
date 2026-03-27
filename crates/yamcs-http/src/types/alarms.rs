use crate::types::common::NamedObjectId;
use crate::types::events::Event;
use crate::types::mdb::Parameter;
use crate::types::monitoring::ParameterValue;
use serde::{Deserialize, Serialize};

/// Global alarm status summary
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlobalAlarmStatus {
    pub unacknowledged_count: u32,
    pub unacknowledged_active: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unacknowledged_severity: Option<String>,
    pub acknowledged_count: u32,
    pub acknowledged_active: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub acknowledged_severity: Option<String>,
    pub shelved_count: u32,
    pub shelved_active: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
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
    pub acknowledge_info: AlarmAcknowledgeInfo,
    pub shelve_info: ShelveInfo,
    pub clear_info: ClearInfo,
    pub severity: AlarmSeverity,
    #[serde(rename = "readonly")]
    pub read_only: bool,
    pub latching: bool,
    pub process_ok: bool,
    pub triggered: bool,
    pub acknowledged: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pending: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameter_detail: Option<ParameterAlarmData>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlarmAcknowledgeInfo {
    pub acknowledged_by: String,
    pub acknowledge_message: String,
    pub acknowledge_time: String,
}

/// Alarm shelve information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ShelveInfo {
    pub shelved_by: String,
    pub shelve_message: String,
    pub shelve_time: String,
    pub shelve_expiration: String,
}

/// Alarm clear information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClearInfo {
    pub cleared_by: String,
    pub clear_time: String,
    pub clear_message: String,
}

/// Options for querying alarms
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAlarmsOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub detail: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pos: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<crate::types::monitoring::SortOrder>,
}

/// Options for acknowledging an alarm
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgeAlarmOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub comment: Option<String>,
}

/// Options for shelving an alarm
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ShelveAlarmOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub comment: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub shelve_duration: Option<i64>,
}

/// Options for clearing an alarm
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClearAlarmOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub comment: Option<String>,
}
