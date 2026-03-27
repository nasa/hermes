use crate::types::common::NamedObjectId;
use serde::{Deserialize, Serialize};

/// Mission Database information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MissionDatabase {
    pub config_name: String,
    pub name: String,
    pub version: String,
    pub space_systems: Vec<SpaceSystem>,
    pub parameter_count: u32,
    pub container_count: u32,
    pub command_count: u32,
    pub algorithm_count: u32,
    pub parameter_type_count: u32,
}

/// Base trait for MDB objects with name and description
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NameDescription {
    pub name: String,
    pub qualified_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub long_description: Option<String>,
}

/// Space system (namespace for MDB objects)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaceSystem {
    pub name: String,
    pub qualified_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub long_description: Option<String>,
    pub version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub history: Option<Vec<HistoryInfo>>,
    #[serde(rename = "sub")]
    pub sub_systems: Vec<SpaceSystem>,
}

/// Paginated space systems response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpaceSystemsPage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub space_systems: Option<Vec<SpaceSystem>>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Parameter {
    pub name: String,
    pub qualified_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub long_description: Option<String>,
    pub data_source: DataSource,
    #[serde(skip_serializing_if = "Option::is_none", rename = "type")]
    pub parameter_type: Option<Box<ParameterType>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub used_by: Option<UsedByInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub path: Option<Vec<String>>,
}

/// Information about where a parameter is used
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UsedByInfo {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub algorithm: Option<Vec<Algorithm>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub container: Option<Vec<Container>>,
}

/// Unit information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnitInfo {
    pub unit: String,
}

/// Parameter type definition
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterType {
    pub name: String,
    pub qualified_name: String,
    pub short_description: String,
    pub long_description: String,
    pub alias: Vec<NamedObjectId>,
    pub eng_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub array_info: Option<Box<ArrayInfo>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data_encoding: Option<DataEncoding>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unit_set: Option<Vec<UnitInfo>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default_alarm: Option<AlarmInfo>,
    pub context_alarm: Vec<ContextAlarmInfo>,
    pub enum_values: Vec<EnumValue>,
    pub enum_ranges: Vec<EnumRange>,
    pub absolute_time_info: Option<AbsoluteTimeInfo>,
    pub member: Vec<ParameterMember>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub signed: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub size_in_bits: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub one_string_value: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub zero_string_value: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub used_by: Option<Vec<Parameter>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub initial_value: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub raw_valid_range: Option<ValidRange>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
    pub dimensions: u32,
}

/// Member of an aggregate type
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterMember {
    pub name: String,
    #[serde(rename = "type")]
    pub member_type: Box<ParameterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub initial_value: Option<String>,
    pub short_description: String,
    pub long_description: String,
    pub alias: Vec<NamedObjectId>,
}

/// Member of an aggregate argument type
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArgumentMember {
    pub name: String,
    #[serde(rename = "type")]
    pub member_type: Box<ArgumentType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub initial_value: Option<String>,
    pub short_description: String,
    pub long_description: String,
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlarmInfo {
    pub min_violations: u32,
    pub static_alarm_ranges: Vec<AlarmRange>,
    pub enumeration_alarms: Vec<EnumerationAlarm>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataEncoding {
    #[serde(rename = "type")]
    pub encoding_type: String,
    pub little_endian: bool,
    pub size_in_bits: u32,
    pub encoding: String,
    pub default_calibrator: Option<Calibrator>,
    pub context_calibrators: Vec<ContextCalibrator>,
}

/// Calibrator for converting raw to engineering values
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Calibrator {
    #[serde(rename = "type")]
    pub calibrator_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub polynomial_calibrator: Option<PolynomialCalibrator>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub spline_calibrator: Option<SplineCalibrator>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Command {
    pub name: String,
    pub qualified_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub long_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base_command: Option<Box<Command>>,
    #[serde(rename = "abstract")]
    pub is_abstract: bool,
    pub argument: Vec<Argument>,
    pub argument_assignment: Vec<ArgumentAssignment>,
    pub significance: Significance,
    pub effective_significance: Significance,
    pub constraint: Vec<TransmissionConstraint>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub command_container: Option<CommandContainer>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Verifier {
    pub stage: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub container: Option<Box<Container>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub algorithm: Option<Box<Algorithm>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expression: Option<String>,
    pub on_success: TerminationActionType,
    pub on_fail: TerminationActionType,
    pub on_timeout: TerminationActionType,
    pub check_window: CheckWindow,
}

/// Check window for verifiers
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CheckWindow {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub time_to_start_checking: Option<i64>,
    pub time_to_stop_checking: i64,
    pub relative_to: String,
}

/// Command container
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandContainer {
    pub name: String,
    pub qualified_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub long_description: Option<String>,
    pub size_in_bits: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base_container: Option<Box<Container>>,
    pub entry: Vec<SequenceEntry>,
}

/// Command argument
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Argument {
    pub name: String,
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub initial_value: Option<String>,
    #[serde(rename = "type")]
    pub argument_type: ArgumentType,
}

/// Argument type definition
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArgumentType {
    pub eng_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data_encoding: Option<DataEncoding>,
    pub unit_set: Vec<UnitInfo>,
    pub enum_value: Vec<EnumValue>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub signed: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub range_min: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub range_max: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_chars: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_chars: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_bytes: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_bytes: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub member: Option<Vec<ArgumentMember>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub zero_string_value: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub one_string_value: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dimensions: Option<Vec<ArgumentDimension>>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
    pub timeout: i64,
}

/// Enumeration value
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnumValue {
    pub value: i64,
    pub label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

/// Enumeration range
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnumRange {
    pub min: i64,
    pub max: i64,
    pub min_inclusive: bool,
    pub max_inclusive: bool,
    pub label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Algorithm {
    pub name: String,
    pub qualified_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmStatus {
    pub active: bool,
    pub trace_enabled: bool,
    pub run_count: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_run: Option<String>,
    pub error_count: u64,
    pub exec_time_ns: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error_message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error_time: Option<String>,
}

/// Algorithm execution trace
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmTrace {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub runs: Option<Vec<AlgorithmRun>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub logs: Option<Vec<AlgorithmLog>>,
}

/// Single algorithm run information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmRun {
    pub time: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inputs: Option<Vec<crate::types::monitoring::ParameterValue>>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmOverrides {
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InputParameter {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameter: Option<Box<Parameter>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameter_instance: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Container {
    pub name: String,
    pub qualified_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alias: Option<Vec<NamedObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub long_description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_interval: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub size_in_bits: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base_container: Option<Box<Container>>,
    pub archive_partition: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub restriction_criteria_expression: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entry: Option<Vec<SequenceEntry>>,
}

/// Entry in a container sequence
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SequenceEntry {
    pub location_in_bits: u32,
    pub reference_location: ReferenceLocation,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub repeat: Option<RepeatInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub container: Option<Box<Container>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameter: Option<Box<Parameter>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub argument: Option<Box<Argument>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub fixed_value: Option<FixedValue>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
    pub size_in_bits: u32,
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
    pub fixed_count: u32,
    pub dynamic_count: Box<Parameter>,
    pub bits_between: u32,
}

// Query options

/// Options for querying parameters
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParametersOptions {
    #[serde(skip_serializing_if = "Option::is_none", rename = "type")]
    pub parameter_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub q: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub search_members: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pos: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next: Option<String>,
}

/// Options for querying parameter types
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetParameterTypesOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub q: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pos: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next: Option<String>,
}

/// Paginated parameters response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParametersPage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub systems: Option<Vec<SpaceSystem>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameters: Option<Vec<Parameter>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// Paginated parameter types response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParameterTypesPage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub systems: Option<Vec<SpaceSystem>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parameter_types: Option<Vec<ParameterType>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// Options for querying algorithms
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAlgorithmsOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scope: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub q: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pos: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
}

/// Paginated algorithms response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlgorithmsPage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub systems: Option<Vec<SpaceSystem>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub algorithms: Option<Vec<Algorithm>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// Options for querying containers
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetContainersOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub q: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pos: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
}

/// Paginated containers response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContainersPage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub systems: Option<Vec<SpaceSystem>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub containers: Option<Vec<Container>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub continuation_token: Option<String>,
    pub total_size: u32,
}

/// Options for querying commands
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetCommandsOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub no_abstract: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub q: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pos: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<bool>,
}

/// Paginated commands response
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandsPage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub systems: Option<Vec<SpaceSystem>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub commands: Option<Vec<Command>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub continuation_token: Option<String>,
    pub total_size: u32,
}
