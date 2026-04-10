/// Alarm types
pub mod alarms;
/// Common types shared across the YAMCS API
pub mod common;
/// Event types
pub mod events;
/// Mission Database (MDB) types
pub mod mdb;
/// Monitoring and telemetry types
pub mod monitoring;
/// System information types
pub mod system;

// Re-export commonly used types
pub use alarms::{
    AcknowledgeAlarmOptions, Alarm, AlarmSeverity, ClearAlarmOptions, GetAlarmsOptions,
    GlobalAlarmStatus, ShelveAlarmOptions, SubscribeAlarmsRequest,
    SubscribeGlobalAlarmStatusRequest,
};
pub use common::{AggregateValue, MonitoringResult, NamedObjectId, Value};
pub use events::{
    CreateEventRequest, Event, EventSeverity, GetEventsOptions, SubscribeEventsRequest,
};
pub use mdb::{
    Algorithm, AlgorithmScope, AlgorithmStatus, AlgorithmType, Command, CommandsPage, Container,
    ContainersPage, DataSource, GetAlgorithmsOptions, GetCommandsOptions, GetContainersOptions,
    GetParametersOptions, MissionDatabase, Parameter, ParameterType, ParametersPage, SpaceSystem,
    SpaceSystemsPage,
};
pub use monitoring::{
    CommandHistoryEntry, CommandHistoryPage, CreateProcessorRequest, EditReplayProcessorRequest,
    GetCommandHistoryOptions, GetPacketsOptions, GetParameterValuesOptions, IssueCommandOptions,
    IssueCommandResponse, ListPacketsResponse, Packet, ParameterValue, Sample,
    SubscribeParametersAction, SubscribeParametersData, SubscribeParametersRequest,
    SubscribedParameterInfo,
};
pub use system::{
    GeneralInfo, GroupInfo, Instance, InstanceState, PluginInfo, Processor, ServiceState,
    SystemInfo, UserInfo,
};
