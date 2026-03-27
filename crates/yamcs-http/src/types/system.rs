use serde::{Deserialize, Serialize};
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
    #[serde(skip_serializing_if = "Option::is_none")]
    pub labels: Option<HashMap<String, String>>,
    /// Mission time
    pub mission_time: String,
    /// Instance capabilities
    #[serde(default)]
    pub capabilities: Vec<String>,
    /// Template name if instance was created from template
    #[serde(skip_serializing_if = "Option::is_none")]
    pub template: Option<String>,
    /// Template arguments
    #[serde(skip_serializing_if = "Option::is_none")]
    pub template_args: Option<HashMap<String, String>>,
    /// Whether template is available
    #[serde(default)]
    pub template_available: bool,
    /// Whether template has changed
    #[serde(default)]
    pub template_changed: bool,
}

/// Processor information
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
    /// Creator username
    #[serde(skip_serializing_if = "Option::is_none")]
    pub creator: Option<String>,
    /// Whether processor has commanding enabled
    #[serde(default)]
    pub has_commanding: bool,
    /// Processor state
    pub state: ServiceState,
    /// Replay request if this is a replay processor
    #[serde(skip_serializing_if = "Option::is_none")]
    pub replay_request: Option<ReplayRequest>,
    /// Replay state if this is a replay processor
    #[serde(skip_serializing_if = "Option::is_none")]
    pub replay_state: Option<ReplayState>,
}

/// Replay request parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReplayRequest {
    /// Start time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    /// Stop time
    #[serde(skip_serializing_if = "Option::is_none")]
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
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_by: Option<Box<UserInfo>>,
    /// Creation time
    pub creation_time: String,
    /// Confirmation time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub confirmation_time: Option<String>,
    /// Last login time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_login_time: Option<String>,
    /// User groups
    #[serde(skip_serializing_if = "Option::is_none")]
    pub groups: Option<Vec<GroupInfo>>,
    /// User roles
    #[serde(skip_serializing_if = "Option::is_none")]
    pub roles: Option<Vec<RoleInfo>>,
    /// External identities
    #[serde(skip_serializing_if = "Option::is_none")]
    pub identities: Option<Vec<ExternalIdentity>>,
    /// Security clearance level
    pub clearance: String,
    /// System-level privileges
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system_privileges: Option<Vec<String>>,
    /// Object-level privileges
    #[serde(skip_serializing_if = "Option::is_none")]
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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GroupInfo {
    /// Group name
    pub name: String,
    /// Group description
    pub description: String,
    /// Group members (users)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub users: Option<Vec<UserInfo>>,
    /// Service accounts in group
    #[serde(skip_serializing_if = "Option::is_none")]
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
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system_privileges: Option<Vec<String>>,
    /// Object-level privileges
    #[serde(skip_serializing_if = "Option::is_none")]
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
    pub uptime: u64,
    /// CPU time in milliseconds
    pub cpu_time: u64,
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
    pub available_processors: u32,
    /// System load average
    pub load_average: f64,
    /// Total heap memory
    pub heap_memory: u64,
    /// Used heap memory
    pub used_heap_memory: u64,
    /// Maximum heap memory
    pub max_heap_memory: u64,
    /// Total non-heap memory
    pub non_heap_memory: u64,
    /// Used non-heap memory
    pub used_non_heap_memory: u64,
    /// Used/max heap memory ratio
    pub used_max_heap_memory: u64,
    /// Maximum non-heap memory
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_non_heap_memory: Option<u64>,
    /// JVM thread count
    pub jvm_thread_count: u32,
    /// CPU load percentage
    pub cpu_load: f64,
    /// Process CPU load percentage
    pub process_cpu_load: f64,
    /// Free system memory
    pub free_memory: u64,
    /// Total system memory
    pub total_memory: u64,
    /// Free swap space
    pub free_swap_space: u64,
    /// Total swap space
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
    pub total_space: u64,
    /// Unallocated space in bytes
    pub unallocated_space: u64,
    /// Usable space in bytes
    pub usable_space: u64,
}

/// Process information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessInfo {
    /// Process ID
    pub pid: u32,
    /// User running the process
    pub user: String,
    /// Command
    pub command: String,
    /// Command arguments
    #[serde(skip_serializing_if = "Option::is_none")]
    pub arguments: Option<Vec<String>>,
    /// Process start time
    pub start_time: String,
    /// Total CPU duration
    pub total_cpu_duration: String,
    /// Child processes
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<ProcessInfo>>,
}
