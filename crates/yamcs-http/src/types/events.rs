use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;
use std::collections::HashMap;

/// Subscribe to events request
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribeEventsRequest {
    pub instance: String,
    pub filter: Option<String>,
}

/// Event severity level
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum EventSeverity {
    Info,
    Warning,
    /// Deprecated: Use Warning instead
    #[deprecated(note = "Use Warning instead")]
    Error,
    Watch,
    Distress,
    Critical,
    Severe,
}

/// Event from YAMCS
#[skip_serializing_none]
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
    pub created_by: Option<String>,
    pub extra: Option<HashMap<String, String>>,
}

/// Request to create an event
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateEventRequest {
    pub message: String,
    #[serde(rename = "type")]
    pub event_type: Option<String>,
    pub severity: Option<EventSeverity>,
    pub time: Option<String>,
    pub extra: Option<HashMap<String, String>>,
}

/// Options for querying events
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetEventsOptions {
    /// Inclusive lower bound
    pub start: Option<String>,
    /// Exclusive upper bound
    pub stop: Option<String>,
    /// Filter query
    pub filter: Option<String>,
    pub severity: Option<EventSeverity>,
    pub source: Option<Vec<String>>,
    pub limit: Option<u32>,
    pub order: Option<crate::types::monitoring::SortOrder>,
}

/// Options for downloading events
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadEventsOptions {
    /// Inclusive lower bound
    pub start: Option<String>,
    /// Exclusive upper bound
    pub stop: Option<String>,
    /// Filter query
    pub filter: Option<String>,
    pub severity: Option<EventSeverity>,
    pub source: Option<Vec<String>>,
    pub delimiter: Option<crate::types::monitoring::Delimiter>,
}
