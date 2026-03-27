use crate::types::common::{NamedObjectId, Value};
use crate::types::mdb::AlarmRange;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Parameter data from subscription (deprecated - use SubscribeParametersData)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterData {
    pub parameter: Vec<ParameterValue>,
    pub subscription_id: u32,
}

/// Request to subscribe to parameter updates
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribeParametersRequest {
    pub instance: String,
    pub processor: String,
    pub id: Vec<NamedObjectId>,
    pub abort_on_invalid: bool,
    pub update_on_expiration: bool,
    pub send_from_cache: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_bytes: Option<u64>,
    pub action: SubscribeParametersAction,
}

/// Action for parameter subscription
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SubscribeParametersAction {
    Replace,
    Add,
    Remove,
}

/// Parameter subscription data response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribeParametersData {
    #[serde(default)]
    pub mapping: HashMap<u32, NamedObjectId>,
    #[serde(default)]
    pub info: HashMap<u32, SubscribedParameterInfo>,
    #[serde(default)]
    pub invalid: Vec<NamedObjectId>,
    #[serde(default)]
    pub values: Vec<ParameterValue>,
}

/// Information about a subscribed parameter
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribedParameterInfo {
    pub parameter: String,
    pub data_source: crate::types::mdb::DataSource,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub units: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enum_values: Option<Vec<crate::types::mdb::EnumValue>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enum_ranges: Option<Vec<crate::types::mdb::EnumRange>>,
}

/// Parameter value with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterValue {
    pub numeric_id: u32,
    pub id: NamedObjectId,
    pub raw_value: Value,
    pub eng_value: Value,
    pub acquisition_time: String,
    pub generation_time: String,
    pub acquisition_status: AcquisitionStatus,
    pub monitoring_result: crate::types::common::MonitoringResult,
    pub alarm_range: Vec<AlarmRange>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub range_condition: Option<RangeCondition>,
    pub expire_millis: i64,
}

/// Acquisition status for parameter values
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AcquisitionStatus {
    Acquired,
    NotReceived,
    Invalid,
    Expired,
}

/// Range condition
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RangeCondition {
    Low,
    High,
}

/// Statistical sample of parameter values
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Sample {
    pub time: String,
    pub avg: f64,
    pub min: f64,
    pub min_time: String,
    pub max: f64,
    pub max_time: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub first_time: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_time: Option<String>,
    pub n: u64,
}

/// Range of parameter values
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Range {
    pub start: String,
    pub stop: String,
    pub eng_values: Vec<Value>,
    pub counts: Vec<u64>,
    pub other_count: u64,
}

/// Options for issuing a command
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IssueCommandOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub args: Option<HashMap<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub origin: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sequence_number: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dry_run: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub comment: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub disable_transmission_constraints: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub disable_verifiers: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stream: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extra: Option<HashMap<String, Value>>,
}

/// Response from issuing a command
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IssueCommandResponse {
    pub id: String,
    pub generation_time: String,
    pub origin: String,
    pub sequence_number: u32,
    pub command_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub aliases: Option<HashMap<String, String>>,
    pub binary: String,
    pub username: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub queue: Option<String>,
}

/// Options for starting a procedure
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StartProcedureOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub arguments: Option<HashMap<String, String>>,
}

/// Executor information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExecutorInfo {
    pub id: String,
}

/// Command history attribute
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandHistoryAttribute {
    pub name: String,
    pub value: Value,
}

/// Command assignment
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandAssignment {
    pub name: String,
    pub value: Value,
    pub user_input: bool,
}

/// Command history entry
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandHistoryEntry {
    pub id: String,
    pub command_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub aliases: Option<HashMap<String, String>>,
    pub origin: String,
    pub sequence_number: u32,
    pub generation_time: String,
    pub attr: Vec<CommandHistoryAttribute>,
    pub assignments: Vec<CommandAssignment>,
}

/// Paginated command history response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandHistoryPage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub commands: Option<Vec<CommandHistoryEntry>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub continuation_token: Option<String>,
}

/// Options for querying command history
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetCommandHistoryOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub q: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub queue: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<SortOrder>,
}

/// Sort order for queries
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SortOrder {
    Asc,
    Desc,
}

/// Request to create a processor
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProcessorRequest {
    pub instance: String,
    pub name: String,
    #[serde(rename = "type")]
    pub processor_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub persistent: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub config: Option<String>,
}

/// Request to edit a replay processor
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EditReplayProcessorRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<ReplayState>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub seek: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub speed: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub loop_replay: Option<bool>,
}

/// Replay processor state
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ReplayState {
    Running,
    Paused,
}

/// Options for querying packets
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetPacketsOptions {
    /// Inclusive lower bound
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    /// Exclusive upper bound
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filter: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub link: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<SortOrder>,
}

/// Paginated packets response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ListPacketsResponse {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub packets: Option<Vec<Packet>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub continuation_token: Option<String>,
}

/// Packet information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Packet {
    pub id: NamedObjectId,
    pub reception_time: String,
    pub earth_reception_time: String,
    pub generation_time: String,
    pub sequence_number: u32,
    pub packet: String,
    pub size: u32,
    pub link: String,
}

/// Options for querying parameter values
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterValuesOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pos: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub norepeat: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<ParameterSource>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<SortOrder>,
}

/// Parameter value source
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ParameterSource {
    ParameterArchive,
    #[serde(rename = "replay")]
    Replay,
}

/// Options for downloading parameter values
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadParameterValuesOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameters: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub list: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub norepeat: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub delimiter: Option<Delimiter>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub header: Option<HeaderStyle>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub interval: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filename: Option<String>,
}

/// CSV delimiter
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Delimiter {
    Tab,
    Comma,
    Semicolon,
}

/// CSV header style
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum HeaderStyle {
    QualifiedName,
    ShortName,
    None,
}

/// Options for exporting parameter values
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportParameterValuesOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameters: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub list: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub namespace: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub delimiter: Option<Delimiter>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub preserve_last_value: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub interval: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<SortOrder>,
}

/// Options for getting parameter samples
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterSamplesOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub count: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gap_time: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<ParameterSource>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<SortOrder>,
}

/// Options for getting parameter ranges
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterRangesOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_gap: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_gap: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_range: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_values: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<ParameterSource>,
}

/// Options for getting packet index
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetPacketIndexOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub merge_time: Option<i64>,
}

/// Options for streaming packet index
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamPacketIndexOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub merge_time: Option<i64>,
}

/// Options for getting parameter index
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterIndexOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub merge_time: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
}

/// Options for streaming parameter index
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamParameterIndexOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub merge_time: Option<i64>,
}

/// Options for getting command index
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetCommandIndexOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub merge_time: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
}

/// Options for streaming command index
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamCommandIndexOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub merge_time: Option<i64>,
}
