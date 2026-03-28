use crate::types::common::{NamedObjectId, Value};
use crate::types::mdb::AlarmRange;
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;
use std::collections::HashMap;

/// Parameter data from subscription (deprecated - use SubscribeParametersData)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterData {
    pub parameter: Vec<ParameterValue>,
    pub subscription_id: u32,
}

/// Request to subscribe to parameter updates
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribeParametersRequest {
    pub instance: String,
    pub processor: String,
    pub id: Vec<NamedObjectId>,
    pub abort_on_invalid: bool,
    pub update_on_expiration: bool,
    pub send_from_cache: bool,
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
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribedParameterInfo {
    pub parameter: String,
    pub data_source: crate::types::mdb::DataSource,
    pub units: Option<String>,
    pub enum_values: Option<Vec<crate::types::mdb::EnumValue>>,
    pub enum_ranges: Option<Vec<crate::types::mdb::EnumRange>>,
}

/// Parameter value with metadata
#[skip_serializing_none]
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
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Sample {
    pub time: Option<String>,
    pub avg: Option<f64>,
    pub min: Option<f64>,
    pub min_time: Option<String>,
    pub max: Option<f64>,
    pub max_time: Option<String>,
    pub first_time: Option<String>,
    pub last_time: Option<String>,
    pub n: Option<u64>,
}

/// Range of parameter values
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Range {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub count: Option<u32>,
    #[serde(default)]
    pub eng_values: Vec<Value>,
    #[serde(default)]
    pub counts: Vec<u32>,
    pub other_count: Option<u32>,
}

/// Options for issuing a command
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IssueCommandOptions {
    pub args: Option<HashMap<String, serde_json::Value>>,
    pub origin: Option<String>,
    pub sequence_number: Option<u32>,
    pub dry_run: Option<bool>,
    pub comment: Option<String>,
    pub disable_transmission_constraints: Option<bool>,
    pub disable_verifiers: Option<bool>,
    pub stream: Option<String>,
    pub extra: Option<HashMap<String, Value>>,
}

/// Response from issuing a command
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IssueCommandResponse {
    pub id: String,
    pub generation_time: String,
    pub origin: String,
    pub sequence_number: u32,
    pub command_name: String,
    pub aliases: Option<HashMap<String, String>>,
    pub binary: String,
    pub username: String,
    pub queue: Option<String>,
}

/// Options for starting a procedure
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StartProcedureOptions {
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
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandHistoryEntry {
    pub id: String,
    pub command_name: String,
    pub aliases: Option<HashMap<String, String>>,
    pub origin: String,
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub sequence_number: u32,
    pub generation_time: String,
    #[serde(default)]
    pub attr: Vec<CommandHistoryAttribute>,
    #[serde(default)]
    pub assignments: Vec<CommandAssignment>,
}

/// Paginated command history response
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandHistoryPage {
    pub commands: Option<Vec<CommandHistoryEntry>>,
    pub continuation_token: Option<String>,
}

/// Options for querying command history
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetCommandHistoryOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub limit: Option<u32>,
    pub next: Option<String>,
    pub q: Option<String>,
    pub queue: Option<String>,
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
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProcessorRequest {
    pub instance: String,
    pub name: String,
    #[serde(rename = "type")]
    pub processor_type: String,
    pub persistent: Option<bool>,
    pub config: Option<String>,
}

/// Request to edit a replay processor
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EditReplayProcessorRequest {
    pub state: Option<ReplayState>,
    pub seek: Option<String>,
    pub speed: Option<String>,
    pub start: Option<String>,
    pub stop: Option<String>,
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
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetPacketsOptions {
    /// Inclusive lower bound
    pub start: Option<String>,
    /// Exclusive upper bound
    pub stop: Option<String>,
    pub filter: Option<String>,
    pub name: Option<Vec<String>>,
    pub link: Option<String>,
    pub next: Option<String>,
    pub limit: Option<u32>,
    pub order: Option<SortOrder>,
}

/// Paginated packets response
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ListPacketsResponse {
    pub packets: Option<Vec<Packet>>,
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
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterValuesOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub pos: Option<u32>,
    pub limit: Option<u32>,
    pub norepeat: Option<bool>,
    pub format: Option<String>,
    pub source: Option<ParameterSource>,
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
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadParameterValuesOptions {
    pub parameters: Option<Vec<String>>,
    pub list: Option<String>,
    pub start: Option<String>,
    pub stop: Option<String>,
    pub norepeat: Option<bool>,
    pub delimiter: Option<Delimiter>,
    pub header: Option<HeaderStyle>,
    pub interval: Option<i64>,
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
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportParameterValuesOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub parameters: Option<Vec<String>>,
    pub list: Option<String>,
    pub namespace: Option<String>,
    pub delimiter: Option<Delimiter>,
    pub preserve_last_value: Option<bool>,
    pub interval: Option<i64>,
    pub limit: Option<u32>,
    pub order: Option<SortOrder>,
}

/// Options for getting parameter samples
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterSamplesOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub count: Option<u32>,
    pub gap_time: Option<i64>,
    pub source: Option<ParameterSource>,
    pub order: Option<SortOrder>,
}

/// Options for getting parameter ranges
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterRangesOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub min_gap: Option<i64>,
    pub max_gap: Option<i64>,
    pub min_range: Option<i64>,
    pub max_values: Option<u32>,
    pub source: Option<ParameterSource>,
}

/// Options for getting packet index
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetPacketIndexOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub limit: Option<u32>,
    pub merge_time: Option<i64>,
}

/// Options for streaming packet index
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamPacketIndexOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub merge_time: Option<i64>,
}

/// Options for getting parameter index
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterIndexOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub merge_time: Option<i64>,
    pub limit: Option<u32>,
}

/// Options for streaming parameter index
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamParameterIndexOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub merge_time: Option<i64>,
}

/// Options for getting command index
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetCommandIndexOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub merge_time: Option<i64>,
    pub limit: Option<u32>,
}

/// Options for streaming command index
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamCommandIndexOptions {
    pub start: Option<String>,
    pub stop: Option<String>,
    pub merge_time: Option<i64>,
}
