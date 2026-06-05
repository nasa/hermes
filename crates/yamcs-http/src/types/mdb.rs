use crate::types::common::NamedObjectId;
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

/// Mission Database information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MissionDatabase {
    pub config_name: Option<String>,
    pub name: String,
    pub version: Option<String>,
    pub space_systems: Vec<SpaceSystem>,
    pub parameter_count: u32,
    pub container_count: u32,
    pub command_count: u32,
    pub algorithm_count: u32,
    pub parameter_type_count: u32,
}

/// Base trait for MDB objects with name and description
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NameDescription {
    pub name: String,
    pub qualified_name: String,
    pub alias: Option<Vec<NamedObjectId>>,
    pub short_description: Option<String>,
    pub long_description: Option<String>,
}

/// Space system (namespace for MDB objects)
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaceSystem {
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub qualified_name: String,
    pub alias: Option<Vec<NamedObjectId>>,
    pub short_description: Option<String>,
    pub long_description: Option<String>,
    pub version: Option<String>,
    pub history: Option<Vec<HistoryInfo>>,
    #[serde(rename = "sub")]
    pub sub_systems: Option<Vec<SpaceSystem>>,
}

/// Paginated space systems response
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaceSystemsPage {
    pub space_systems: Option<Vec<SpaceSystem>>,
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// History information for versioned objects
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistoryInfo {
    pub version: String,
    pub date: String,
    pub message: String,
    pub author: String,
}

/// Data source for parameters
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DataSource {
    Command,
    CommandHistory,
    Constant,
    Derived,
    External1,
    External2,
    External3,
    Ground,
    Local,
    System,
    Telemetered,
}

/// Telemetry parameter
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Parameter {
    pub name: String,
    pub qualified_name: String,
    #[serde(default)]
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(default)]
    pub short_description: Option<String>,
    #[serde(default)]
    pub long_description: Option<String>,
    #[serde(default)]
    pub data_source: Option<DataSource>,
    #[serde(rename = "type")]
    pub parameter_type: Option<Box<ParameterType>>,
    pub used_by: Option<UsedByInfo>,
    pub path: Option<Vec<String>>,
}

/// Information about where a parameter is used
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UsedByInfo {
    pub algorithm: Option<Vec<Algorithm>>,
    pub container: Option<Vec<Container>>,
}

/// Unit information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnitInfo {
    pub unit: String,
}

/// Parameter type definition
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterType {
    pub name: String,
    pub qualified_name: String,
    #[serde(default)]
    pub short_description: Option<String>,
    #[serde(default)]
    pub long_description: Option<String>,
    #[serde(default)]
    pub alias: Vec<NamedObjectId>,
    #[serde(default)]
    pub eng_type: String,
    pub array_info: Option<Box<ArrayInfo>>,
    pub data_encoding: Option<DataEncoding>,
    pub unit_set: Option<Vec<UnitInfo>>,
    pub default_alarm: Option<AlarmInfo>,
    #[serde(default)]
    pub context_alarm: Vec<ContextAlarmInfo>,
    #[serde(default)]
    pub enum_values: Vec<EnumValue>,
    #[serde(default)]
    pub enum_ranges: Vec<EnumRange>,
    pub absolute_time_info: Option<AbsoluteTimeInfo>,
    pub member: Option<Vec<ParameterMember>>,
    pub signed: Option<bool>,
    pub size_in_bits: Option<u32>,
    pub one_string_value: Option<String>,
    pub zero_string_value: Option<String>,
    pub used_by: Option<Vec<Parameter>>,
    pub initial_value: Option<String>,
    pub raw_valid_range: Option<ValidRange>,
    pub eng_valid_range: Option<ValidRange>,
}

/// Valid range for parameter values
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidRange {
    pub minimum: f64,
    pub maximum: f64,
    pub minimum_inclusive: bool,
    pub maximum_inclusive: bool,
}

/// Array type information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArrayInfo {
    #[serde(rename = "type")]
    pub element_type: ParameterType,
    pub dimensions: Vec<ParameterDimensionInfo>,
}

/// Parameter dimension information for arrays
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterDimensionInfo {
    #[serde(default)]
    pub fixed_value: String,
    pub parameter: Option<Box<Parameter>>,
    #[serde(default)]
    pub slope: String,
    #[serde(default)]
    pub intercept: String,
}

/// Member of an aggregate type
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterMember {
    pub name: String,
    #[serde(rename = "type")]
    pub member_type: Box<ParameterType>,
    pub initial_value: Option<String>,
    #[serde(default)]
    pub short_description: Option<String>,
    #[serde(default)]
    pub long_description: Option<String>,
    #[serde(default)]
    pub alias: Vec<NamedObjectId>,
}

/// Member of an aggregate argument type
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArgumentMember {
    pub name: String,
    #[serde(rename = "type")]
    pub member_type: Box<ArgumentType>,
    pub initial_value: Option<String>,
    #[serde(default)]
    pub short_description: Option<String>,
    #[serde(default)]
    pub long_description: Option<String>,
    #[serde(default)]
    pub alias: Vec<NamedObjectId>,
}

/// Absolute time information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AbsoluteTimeInfo {
    pub initial_value: String,
    pub scale: f64,
    pub offset: f64,
    pub offset_from: Box<Parameter>,
    pub epoch: String,
}

/// Alarm information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlarmInfo {
    pub min_violations: u32,
    pub static_alarm_ranges: Vec<AlarmRange>,
    pub enumeration_alarms: Vec<EnumerationAlarm>,
    pub default_level: Option<AlarmLevelType>,
}

/// Context-specific alarm
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextAlarmInfo {
    pub context: String,
    pub alarm: AlarmInfo,
}

/// Enumeration alarm
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnumerationAlarm {
    pub level: AlarmLevelType,
    pub label: String,
}

/// Data encoding information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataEncoding {
    #[serde(rename = "type")]
    pub encoding_type: String,
    #[serde(default)]
    pub little_endian: bool,
    pub size_in_bits: Option<u32>,
    #[serde(default)]
    pub encoding: String,
    pub default_calibrator: Option<Calibrator>,
    #[serde(default)]
    pub context_calibrators: Vec<ContextCalibrator>,
}

/// Calibrator for converting raw to engineering values
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Calibrator {
    #[serde(rename = "type")]
    pub calibrator_type: String,
    pub polynomial_calibrator: Option<PolynomialCalibrator>,
    pub spline_calibrator: Option<SplineCalibrator>,
    pub java_expression_calibrator: Option<JavaExpressionCalibrator>,
}

/// Context-specific calibrator
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextCalibrator {
    pub context: String,
    pub calibrator: Calibrator,
}

/// Polynomial calibrator
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PolynomialCalibrator {
    pub coefficients: Vec<f64>,
}

/// Spline calibrator
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SplineCalibrator {
    pub points: Vec<SplinePoint>,
}

/// Point in spline calibrator
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SplinePoint {
    pub raw: f64,
    pub calibrated: f64,
}

/// Java expression calibrator
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JavaExpressionCalibrator {
    pub formula: String,
}

/// Command definition
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Command {
    pub name: String,
    pub qualified_name: String,
    pub alias: Option<Vec<NamedObjectId>>,
    pub short_description: Option<String>,
    pub long_description: Option<String>,
    pub base_command: Option<Box<Command>>,
    #[serde(rename = "abstract", default)]
    pub is_abstract: bool,
    #[serde(default)]
    pub argument: Vec<Argument>,
    #[serde(default)]
    pub argument_assignment: Vec<ArgumentAssignment>,
    pub significance: Option<Significance>,
    pub effective_significance: Option<Significance>,
    #[serde(default)]
    pub constraint: Vec<TransmissionConstraint>,
    pub command_container: Option<CommandContainer>,
    pub verifier: Option<Vec<Verifier>>,
}

/// Termination action for command verifiers
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum TerminationActionType {
    Success,
    Fail,
}

/// Command verifier
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Verifier {
    pub stage: String,
    pub container: Option<Box<Container>>,
    pub algorithm: Option<Box<Algorithm>>,
    pub expression: Option<String>,
    pub on_success: TerminationActionType,
    pub on_fail: TerminationActionType,
    pub on_timeout: TerminationActionType,
    pub check_window: CheckWindow,
}

/// Check window for verifiers
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CheckWindow {
    #[serde(
        default,
        deserialize_with = "crate::types::common::deserialize_optional_string_or_number"
    )]
    pub time_to_start_checking: Option<i64>,
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub time_to_stop_checking: i64,
    pub relative_to: String,
}

/// Command container
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandContainer {
    pub name: String,
    pub qualified_name: String,
    pub alias: Option<Vec<NamedObjectId>>,
    pub short_description: Option<String>,
    pub long_description: Option<String>,
    pub size_in_bits: Option<u32>,
    pub base_container: Option<Box<Container>>,
    #[serde(default)]
    pub entry: Vec<SequenceEntry>,
}

/// Command argument
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Argument {
    pub name: String,
    #[serde(default)]
    pub description: Option<String>,
    pub initial_value: Option<String>,
    #[serde(rename = "type")]
    pub argument_type: ArgumentType,
}

/// Argument type definition
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArgumentType {
    pub eng_type: String,
    pub data_encoding: Option<DataEncoding>,
    #[serde(default)]
    pub unit_set: Vec<UnitInfo>,
    #[serde(default)]
    pub enum_value: Vec<EnumValue>,
    pub signed: Option<bool>,
    pub range_min: Option<f64>,
    pub range_max: Option<f64>,
    pub min_chars: Option<u32>,
    pub max_chars: Option<u32>,
    pub min_bytes: Option<u32>,
    pub max_bytes: Option<u32>,
    pub member: Option<Vec<ArgumentMember>>,
    pub zero_string_value: Option<String>,
    pub one_string_value: Option<String>,
    pub dimensions: Option<Vec<ArgumentDimension>>,
    pub element_type: Option<Box<ArgumentType>>,
}

/// Array dimension specification
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArgumentDimension {
    pub fixed_value: String,
    pub argument: String,
    pub parameter: Box<Parameter>,
    pub slope: String,
    pub intercept: String,
}

/// Argument assignment
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArgumentAssignment {
    pub name: String,
    pub value: String,
}

/// Command significance
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Significance {
    pub consequence_level: ConsequenceLevel,
    pub reason_for_warning: String,
}

/// Consequence level for commands
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ConsequenceLevel {
    None,
    Watch,
    Warning,
    Distress,
    Critical,
    Severe,
}

/// Transmission constraint
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransmissionConstraint {
    pub expression: String,
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub timeout: i64,
}

/// Enumeration value
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnumValue {
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub value: i64,
    pub label: String,
    pub description: Option<String>,
}

/// Enumeration range
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnumRange {
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub min: i64,
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub max: i64,
    pub min_inclusive: bool,
    pub max_inclusive: bool,
    pub label: String,
    pub description: Option<String>,
}

/// Alarm level type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AlarmLevelType {
    Normal,
    Watch,
    Warning,
    Distress,
    Critical,
    Severe,
}

/// Alarm range
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlarmRange {
    pub level: AlarmLevelType,
    pub min_inclusive: f64,
    pub max_inclusive: f64,
    pub min_exclusive: f64,
    pub max_exclusive: f64,
}

/// Algorithm definition
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Algorithm {
    pub name: String,
    pub qualified_name: String,
    pub alias: Option<Vec<NamedObjectId>>,
    pub short_description: Option<String>,
    pub long_description: Option<String>,
    pub scope: AlgorithmScope,
    #[serde(rename = "type")]
    pub algorithm_type: AlgorithmType,
    pub language: String,
    pub text: String,
    pub input_parameter: Vec<InputParameter>,
    pub output_parameter: Vec<OutputParameter>,
    pub on_parameter_update: Vec<Parameter>,
    pub on_periodic_rate: Vec<i64>,
    pub math_elements: Vec<serde_json::Value>,
}

/// Algorithm scope
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AlgorithmScope {
    Global,
    CommandVerification,
    ContainerProcessing,
}

/// Algorithm type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AlgorithmType {
    Custom,
    Math,
}

/// Algorithm runtime status
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmStatus {
    pub active: bool,
    pub trace_enabled: bool,
    pub run_count: u64,
    pub last_run: Option<String>,
    pub error_count: u64,
    pub exec_time_ns: u64,
    pub error_message: Option<String>,
    pub error_time: Option<String>,
}

/// Algorithm execution trace
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmTrace {
    pub runs: Option<Vec<AlgorithmRun>>,
    pub logs: Option<Vec<AlgorithmLog>>,
}

/// Single algorithm run information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmRun {
    pub time: String,
    pub inputs: Option<Vec<crate::types::monitoring::ParameterValue>>,
    pub outputs: Option<Vec<crate::types::monitoring::ParameterValue>>,
    pub return_value: String,
    pub error: String,
}

/// Algorithm log entry
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmLog {
    pub time: String,
    pub msg: String,
}

/// Algorithm overrides
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmOverrides {
    pub text_override: Option<AlgorithmTextOverride>,
}

/// Algorithm text override
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmTextOverride {
    pub algorithm: String,
    pub text: String,
}

/// Algorithm input parameter
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InputParameter {
    pub parameter: Option<Box<Parameter>>,
    pub parameter_instance: Option<i32>,
    pub argument: Option<Box<Argument>>,
    pub input_name: String,
    pub mandatory: bool,
}

/// Algorithm output parameter
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OutputParameter {
    pub parameter: Box<Parameter>,
    pub output_name: String,
}

/// Container (packet structure)
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Container {
    pub name: String,
    pub qualified_name: String,
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(default)]
    pub short_description: Option<String>,
    #[serde(default)]
    pub long_description: Option<String>,
    pub max_interval: Option<i64>,
    pub size_in_bits: Option<u32>,
    pub base_container: Option<Box<Container>>,
    #[serde(default)]
    pub archive_partition: bool,
    pub restriction_criteria_expression: Option<String>,
    pub entry: Option<Vec<SequenceEntry>>,
    #[serde(default)]
    pub data_source: Option<DataSource>,
}

/// Entry in a container sequence
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SequenceEntry {
    pub location_in_bits: u32,
    pub reference_location: ReferenceLocation,
    pub repeat: Option<RepeatInfo>,
    pub container: Option<Box<Container>>,
    pub parameter: Option<Box<Parameter>>,
    pub argument: Option<Box<Argument>>,
    pub fixed_value: Option<FixedValue>,
    pub indirect_parameter_ref: Option<IndirectParameterRef>,
}

/// Reference location for sequence entries
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ReferenceLocation {
    ContainerStart,
    PreviousEntry,
}

/// Fixed value in container
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FixedValue {
    pub name: String,
    pub hex_value: String,
    pub size_in_bits: Option<u32>,
}

/// Indirect parameter reference
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IndirectParameterRef {
    pub parameter: Box<Parameter>,
    pub alias_namespace: String,
}

/// Repeat information for array entries
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RepeatInfo {
    pub fixed_count: String,
    pub dynamic_count: Box<Parameter>,
    pub bits_between: u32,
}

// Query options

/// Options for querying parameters
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParametersOptions {
    #[serde(rename = "type")]
    pub parameter_type: Option<String>,
    pub source: Option<String>,
    pub q: Option<String>,
    pub system: Option<String>,
    pub search_members: Option<bool>,
    pub details: Option<bool>,
    pub pos: Option<u32>,
    pub limit: Option<u32>,
    pub next: Option<String>,
}

/// Options for querying parameter types
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterTypesOptions {
    pub q: Option<String>,
    pub system: Option<String>,
    pub pos: Option<u32>,
    pub limit: Option<u32>,
    pub next: Option<String>,
}

/// Paginated parameters response
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParametersPage {
    pub systems: Option<Vec<SpaceSystem>>,
    pub parameters: Option<Vec<Parameter>>,
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// Paginated parameter types response
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterTypesPage {
    pub systems: Option<Vec<SpaceSystem>>,
    pub parameter_types: Option<Vec<ParameterType>>,
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// Options for querying algorithms
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAlgorithmsOptions {
    pub scope: Option<String>,
    pub q: Option<String>,
    pub system: Option<String>,
    pub pos: Option<u32>,
    pub limit: Option<u32>,
}

/// Paginated algorithms response
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmsPage {
    pub systems: Option<Vec<SpaceSystem>>,
    pub algorithms: Option<Vec<Algorithm>>,
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// Options for querying containers
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetContainersOptions {
    pub q: Option<String>,
    pub system: Option<String>,
    pub pos: Option<u32>,
    pub limit: Option<u32>,
}

/// Paginated containers response
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContainersPage {
    pub systems: Option<Vec<SpaceSystem>>,
    pub containers: Option<Vec<Container>>,
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// Options for querying commands
#[skip_serializing_none]
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetCommandsOptions {
    pub no_abstract: Option<bool>,
    pub q: Option<String>,
    pub system: Option<String>,
    pub pos: Option<u32>,
    pub limit: Option<u32>,
    pub details: Option<bool>,
}

/// Paginated commands response
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandsPage {
    pub systems: Option<Vec<SpaceSystem>>,
    pub commands: Option<Vec<Command>>,
    pub continuation_token: Option<String>,
    pub total_size: u32,
}
