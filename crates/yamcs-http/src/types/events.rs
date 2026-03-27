use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Subscribe to events request
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribeEventsRequest {
    pub instance: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filter: Option<String>,
}

/// Event severity level
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum EventSeverity {
    Info,
    Warning,
    Error,
    Watch,
    Distress,
    Critical,
    Severe,
}

/// Event from YAMCS
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Event {
    pub source: String,
    pub generation_time: String,
    pub reception_time: String,
    pub seq_number: u64,
    #[serde(rename = "type")]
    pub event_type: String,
    pub message: String,
    pub severity: EventSeverity,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extra: Option<HashMap<String, String>>,
}

/// Request to create an event
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateEventRequest {
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none", rename = "type")]
    pub event_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub severity: Option<EventSeverity>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub time: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extra: Option<HashMap<String, String>>,
}

/// Options for querying events
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetEventsOptions {
    /// Inclusive lower bound
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    /// Exclusive upper bound
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    /// Filter query
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filter: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub severity: Option<EventSeverity>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<crate::types::monitoring::SortOrder>,
}

/// Options for downloading events
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadEventsOptions {
    /// Inclusive lower bound
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    /// Exclusive upper bound
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<String>,
    /// Filter query
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filter: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub severity: Option<EventSeverity>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub delimiter: Option<crate::types::monitoring::Delimiter>,
}
