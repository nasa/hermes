use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;
use std::collections::HashMap;

/// General information about the YAMCS server
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GeneralInfo {
    /// YAMCS version
    pub yamcs_version: String,
    /// Git revision
    pub revision: String,
    /// Server ID
    pub server_id: String,
    /// Installed plugins
    pub plugins: Vec<PluginInfo>,
    /// Available command options
    #[serde(default)]
    pub command_options: Vec<CommandOption>,
}

/// Information about a YAMCS plugin
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PluginInfo {
    /// Plugin name
    pub name: String,
    /// Plugin description
    pub description: String,
    /// Plugin version
    pub version: String,
    /// Plugin vendor
    pub vendor: String,
}

/// Command option type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum CommandOptionType {
    Boolean,
    String,
    Number,
    Timestamp,
}

/// Command option definition
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandOption {
    /// Option ID
    pub id: String,
    /// Human-readable name
    pub verbose_name: String,
    /// Option type
    #[serde(rename = "type")]
    pub option_type: CommandOptionType,
    /// Help text
    pub help: String,
}

/// Service state
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ServiceState {
    New,
    Starting,
    Running,
    Stopping,
    Terminated,
    Failed,
}

/// Service information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ServiceInfo {
    /// Instance name
    pub instance: Option<String>,
    /// Service name
    pub name: String,
    /// Service state
    pub state: ServiceState,
    /// Service time
    pub time: Option<String>,
}

/// Acknowledgment configuration information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcknowledgmentInfo {
    /// Acknowledgment name
    pub name: String,
    /// Acknowledgment description
    pub description: Option<String>,
}

/// Instance state
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum InstanceState {
    Offline,
    Initializing,
    Initialized,
    Starting,
    Running,
    Stopping,
    Failed,
}

/// YAMCS instance information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Instance {
    /// Instance name
    pub name: String,
    /// Instance state
    pub state: InstanceState,
    /// Instance processors
    #[serde(default)]
    pub processors: Vec<Processor>,
    /// Instance labels
    pub labels: Option<HashMap<String, String>>,
    /// Mission time
    pub mission_time: String,
    /// Instance capabilities
    #[serde(default)]
    pub capabilities: Vec<String>,
    /// Template name if instance was created from template
    pub template: Option<String>,
    /// Template arguments
    pub template_args: Option<HashMap<String, String>>,
    /// Whether template is available
    #[serde(default)]
    pub template_available: bool,
    /// Whether template has changed
    #[serde(default)]
    pub template_changed: bool,
}

/// Processor information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Processor {
    /// Instance name
    pub instance: String,
    /// Processor name
    pub name: String,
    /// Processor type
    #[serde(rename = "type")]
    pub processor_type: String,
    /// Processor specification
    pub spec: Option<String>,
    /// Creator username
    pub creator: Option<String>,
    /// Whether processor has alarms
    #[serde(default)]
    pub has_alarms: bool,
    /// Whether processor has commanding enabled
    #[serde(default)]
    pub has_commanding: bool,
    /// Processor state
    pub state: ServiceState,
    /// Replay request if this is a replay processor
    pub replay_request: Option<ReplayRequest>,
    /// Replay state if this is a replay processor
    pub replay_state: Option<ReplayState>,
    /// Services running in this processor
    pub services: Option<Vec<ServiceInfo>>,
    /// Whether processor is persistent
    #[serde(default)]
    pub persistent: bool,
    /// Processor time
    pub time: Option<String>,
    /// Whether this is a replay processor
    #[serde(default)]
    pub replay: bool,
    /// Whether command clearance checking is enabled
    #[serde(default)]
    pub check_command_clearance: bool,
    /// Whether processor is protected
    #[serde(default)]
    pub protected: bool,
    /// Acknowledgment configurations
    pub acknowledgments: Option<Vec<AcknowledgmentInfo>>,
}

/// Replay request parameters
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReplayRequest {
    /// Start time
    pub start: Option<String>,
    /// Stop time
    pub stop: Option<String>,
}

/// Replay state
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReplayState {
    /// Current replay time
    pub replay_time: String,
    /// Replay speed
    pub speed: f64,
}

/// User information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserInfo {
    /// Username
    pub name: String,
    /// Display name
    pub display_name: String,
    /// Email address
    pub email: String,
    /// Whether user is active
    pub active: bool,
    /// Whether user is superuser
    pub superuser: bool,
    /// User who created this user
    pub created_by: Option<Box<UserInfo>>,
    /// Creation time
    pub creation_time: String,
    /// Confirmation time
    pub confirmation_time: Option<String>,
    /// Last login time
    pub last_login_time: Option<String>,
    /// User groups
    pub groups: Option<Vec<GroupInfo>>,
    /// User roles
    pub roles: Option<Vec<RoleInfo>>,
    /// External identities
    pub identities: Option<Vec<ExternalIdentity>>,
    /// Security clearance level
    pub clearance: String,
    /// System-level privileges
    pub system_privileges: Option<Vec<String>>,
    /// Object-level privileges
    pub object_privileges: Option<Vec<ObjectPrivilege>>,
}

/// External identity (e.g., from OAuth provider)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExternalIdentity {
    /// Identity string
    pub identity: String,
    /// Provider name
    pub provider: String,
}

/// Group information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GroupInfo {
    /// Group name
    pub name: String,
    /// Group description
    pub description: String,
    /// Group members (users)
    pub users: Option<Vec<UserInfo>>,
    /// Service accounts in group
    pub service_accounts: Option<Vec<ServiceAccount>>,
}

/// Service account information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ServiceAccount {
    /// Service account name
    pub name: String,
    /// Whether service account is active
    pub active: bool,
}

/// Role information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoleInfo {
    /// Role name
    pub name: String,
    /// Role description
    pub description: String,
    /// Whether this is a default role
    #[serde(default)]
    pub default: bool,
    /// System-level privileges
    pub system_privileges: Option<Vec<String>>,
    /// Object-level privileges
    pub object_privileges: Option<Vec<ObjectPrivilege>>,
}

/// Object-level privilege
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObjectPrivilege {
    /// Object type
    #[serde(rename = "type")]
    pub object_type: String,
    /// Object names
    pub objects: Vec<String>,
}

/// System information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemInfo {
    /// YAMCS version
    pub yamcs_version: String,
    /// Git revision
    pub revision: String,
    /// Server ID
    pub server_id: String,
    /// Server uptime in milliseconds
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub uptime: u64,
    /// CPU time in milliseconds
    #[serde(
        default,
        deserialize_with = "crate::types::common::deserialize_optional_string_or_number"
    )]
    pub cpu_time: Option<u64>,
    /// JVM version
    pub jvm: String,
    /// Working directory
    pub working_directory: String,
    /// Configuration directory
    pub config_directory: String,
    /// Data directory
    pub data_directory: String,
    /// Cache directory
    pub cache_directory: String,
    /// Operating system
    pub os: String,
    /// Architecture
    pub arch: String,
    /// Number of available processors
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub available_processors: u32,
    /// System load average
    pub load_average: f64,
    /// Total heap memory
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub heap_memory: u64,
    /// Used heap memory
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub used_heap_memory: u64,
    /// Maximum heap memory
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub max_heap_memory: u64,
    /// Total non-heap memory
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub non_heap_memory: u64,
    /// Used non-heap memory
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub used_non_heap_memory: u64,
    /// Used/max heap memory ratio
    #[serde(
        default,
        deserialize_with = "crate::types::common::deserialize_optional_string_or_number"
    )]
    pub used_max_heap_memory: Option<u64>,
    /// Maximum non-heap memory
    #[serde(
        default,
        deserialize_with = "crate::types::common::deserialize_optional_string_or_number"
    )]
    pub max_non_heap_memory: Option<u64>,
    /// JVM thread count
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub jvm_thread_count: u32,
    /// CPU load percentage
    #[serde(default)]
    pub cpu_load: f64,
    /// Process CPU load percentage
    #[serde(default)]
    pub process_cpu_load: f64,
    /// Free system memory
    #[serde(
        default,
        deserialize_with = "crate::types::common::deserialize_string_or_number"
    )]
    pub free_memory: u64,
    /// Total system memory
    #[serde(
        default,
        deserialize_with = "crate::types::common::deserialize_string_or_number"
    )]
    pub total_memory: u64,
    /// Free swap space
    #[serde(
        default,
        deserialize_with = "crate::types::common::deserialize_string_or_number"
    )]
    pub free_swap_space: u64,
    /// Total swap space
    #[serde(
        default,
        deserialize_with = "crate::types::common::deserialize_string_or_number"
    )]
    pub total_swap_space: u64,
    /// Root directories
    pub root_directories: Vec<RootDirectory>,
    /// Process information
    pub process: ProcessInfo,
}

/// Root directory information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RootDirectory {
    /// Directory path
    pub directory: String,
    /// File system type
    #[serde(rename = "type")]
    pub fs_type: String,
    /// Total space in bytes
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub total_space: u64,
    /// Unallocated space in bytes
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub unallocated_space: u64,
    /// Usable space in bytes
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub usable_space: u64,
}

/// Process information
#[skip_serializing_none]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessInfo {
    /// Process ID
    #[serde(deserialize_with = "crate::types::common::deserialize_string_or_number")]
    pub pid: u32,
    /// User running the process
    pub user: String,
    /// Command
    pub command: String,
    /// Command arguments
    pub arguments: Option<Vec<String>>,
    /// Process start time
    pub start_time: String,
    /// Total CPU duration
    #[serde(default)]
    pub total_cpu_duration: String,
    /// Child processes
    pub children: Option<Vec<ProcessInfo>>,
}
