use crate::auth::{AuthInfo, AuthMethod};
use crate::error::Result;
use crate::http::HttpClient;
use crate::types::system::{GeneralInfo, SystemInfo, UserInfo};
use std::sync::Arc;

/// YAMCS HTTP/WebSocket client
///
/// This client provides access to the YAMCS REST API and WebSocket subscriptions.
///
/// # Example
///
/// ```no_run
/// use yamcs_http::{YamcsClient, AuthMethod};
///
/// #[tokio::main]
/// async fn main() -> Result<(), Box<dyn std::error::Error>> {
///     let client = YamcsClient::new("http://localhost:8090")?;
///     let info = client.get_general_info().await?;
///     println!("YAMCS version: {}", info.yamcs_version);
///     Ok(())
/// }
/// ```
pub struct YamcsClient {
    http: Arc<HttpClient>,
    #[cfg(feature = "websocket")]
    ws_client: Arc<tokio::sync::Mutex<Option<crate::websocket::WebSocketClient>>>,
}

impl YamcsClient {
    /// Create a new YAMCS client with no authentication
    ///
    /// # Arguments
    /// * `base_url` - Base URL for the YAMCS server (e.g., "http://localhost:8090")
    ///
    /// # Example
    ///
    /// ```no_run
    /// use yamcs_http::YamcsClient;
    ///
    /// let client = YamcsClient::new("http://localhost:8090")?;
    /// # Ok::<(), yamcs_http::YamcsError>(())
    /// ```
    pub fn new(base_url: impl AsRef<str>) -> Result<Self> {
        Self::with_auth(base_url, AuthMethod::None)
    }

    /// Create a new YAMCS client with authentication
    ///
    /// # Arguments
    /// * `base_url` - Base URL for the YAMCS server
    /// * `auth` - Authentication method to use
    ///
    /// # Example
    ///
    /// ```no_run
    /// use yamcs_http::{YamcsClient, AuthMethod};
    ///
    /// let client = YamcsClient::with_auth(
    ///     "http://localhost:8090",
    ///     AuthMethod::AccessToken("my-token".to_string())
    /// )?;
    /// # Ok::<(), yamcs_http::YamcsError>(())
    /// ```
    pub fn with_auth(base_url: impl AsRef<str>, auth: AuthMethod) -> Result<Self> {
        let http = HttpClient::new(base_url.as_ref(), auth)?;

        Ok(Self {
            http: Arc::new(http),
            #[cfg(feature = "websocket")]
            ws_client: Arc::new(tokio::sync::Mutex::new(Some(
                crate::websocket::WebSocketClient::new(base_url.as_ref()),
            ))),
        })
    }

    /// Create a new YAMCS client with a custom reqwest client
    ///
    /// This is useful when you need to configure TLS settings, timeouts, or other
    /// reqwest client options.
    ///
    /// # Arguments
    /// * `client` - Pre-configured reqwest client
    /// * `base_url` - Base URL for the YAMCS server
    /// * `auth` - Authentication method to use
    pub fn with_reqwest_client(
        client: reqwest::Client,
        base_url: impl AsRef<str>,
        auth: AuthMethod,
    ) -> Result<Self> {
        let http = HttpClient::with_client(client, base_url.as_ref(), auth)?;

        Ok(Self {
            http: Arc::new(http),
            #[cfg(feature = "websocket")]
            ws_client: Arc::new(tokio::sync::Mutex::new(Some(
                crate::websocket::WebSocketClient::new(base_url.as_ref()),
            ))),
        })
    }

    /// Set an HTTP interceptor
    ///
    /// The interceptor will be called for every HTTP request before it is sent,
    /// allowing you to modify the request or add custom headers.
    pub fn set_interceptor(&mut self, interceptor: Arc<dyn crate::http::HttpInterceptor>) {
        Arc::get_mut(&mut self.http)
            .expect("Cannot modify HTTP client with multiple references")
            .set_interceptor(interceptor);
    }

    /// Get general information about the YAMCS server
    ///
    /// Returns server version, plugins, and available command options.
    /// This endpoint does not require authentication.
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::YamcsClient;
    /// # async fn example() -> Result<(), yamcs_http::YamcsError> {
    /// let client = YamcsClient::new("http://localhost:8090")?;
    /// let info = client.get_general_info().await?;
    /// println!("YAMCS version: {}", info.yamcs_version);
    /// println!("Server ID: {}", info.server_id);
    /// # Ok(())
    /// # }
    /// ```
    pub async fn get_general_info(&self) -> Result<GeneralInfo> {
        self.http.get("/api").await
    }

    /// Get information about the authenticated user
    ///
    /// Returns details about the current user including their roles, privileges,
    /// and group memberships. Requires authentication.
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::{YamcsClient, AuthMethod};
    /// # async fn example() -> Result<(), yamcs_http::YamcsError> {
    /// let client = YamcsClient::with_auth(
    ///     "http://localhost:8090",
    ///     AuthMethod::AccessToken("token".to_string())
    /// )?;
    /// let user = client.get_user_info().await?;
    /// println!("User: {}", user.name);
    /// println!("Email: {}", user.email);
    /// # Ok(())
    /// # }
    /// ```
    pub async fn get_user_info(&self) -> Result<UserInfo> {
        self.http.get("/api/user").await
    }

    /// Get authentication information from the server
    ///
    /// Returns information about what authentication methods are required and
    /// supported by the server. This endpoint does not require authentication.
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::YamcsClient;
    /// # async fn example() -> Result<(), yamcs_http::YamcsError> {
    /// let client = YamcsClient::new("http://localhost:8090")?;
    /// let auth_info = client.get_auth_info().await?;
    /// if auth_info.require_authentication {
    ///     println!("Authentication is required");
    /// }
    /// # Ok(())
    /// # }
    /// ```
    pub async fn get_auth_info(&self) -> Result<AuthInfo> {
        self.http.get("/auth").await
    }

    /// Get system information including memory usage, CPU load, and process details
    ///
    /// Returns detailed information about the YAMCS server's runtime environment.
    /// Requires appropriate permissions.
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::YamcsClient;
    /// # async fn example() -> Result<(), yamcs_http::YamcsError> {
    /// let client = YamcsClient::new("http://localhost:8090")?;
    /// let sys_info = client.get_system_info().await?;
    /// println!("Uptime: {}ms", sys_info.uptime);
    /// println!("Heap usage: {}/{} bytes", sys_info.used_heap_memory, sys_info.max_heap_memory);
    /// # Ok(())
    /// # }
    /// ```
    pub async fn get_system_info(&self) -> Result<SystemInfo> {
        self.http.get("/api/sysinfo").await
    }

    /// Get a reference to the underlying HTTP client
    ///
    /// This can be used for making custom API calls not yet covered by this client.
    pub fn http_client(&self) -> &HttpClient {
        &self.http
    }

    // ========================================================================
    // Mission Database (MDB) APIs
    // ========================================================================

    /// Get the mission database for an instance
    pub async fn get_mission_database(&self, instance: &str) -> Result<crate::types::mdb::MissionDatabase> {
        self.http.get(&format!("/api/mdb/{}", instance)).await
    }

    /// Get space systems for an instance
    pub async fn get_space_systems(&self, instance: &str) -> Result<crate::types::mdb::SpaceSystemsPage> {
        self.http.get(&format!("/api/mdb/{}/space-systems", instance)).await
    }

    /// Get a specific space system
    pub async fn get_space_system(&self, instance: &str, qualified_name: &str) -> Result<crate::types::mdb::SpaceSystem> {
        self.http.get(&format!("/api/mdb/{}/space-systems{}", instance, qualified_name)).await
    }

    /// Get parameters with optional filtering
    pub async fn get_parameters(
        &self,
        instance: &str,
        options: &crate::types::mdb::GetParametersOptions,
    ) -> Result<crate::types::mdb::ParametersPage> {
        let query = serde_urlencoded::to_string(options)?;
        self.http.get(&format!("/api/mdb/{}/parameters?{}", instance, query)).await
    }

    /// Get a specific parameter by qualified name
    pub async fn get_parameter(&self, instance: &str, qualified_name: &str) -> Result<crate::types::mdb::Parameter> {
        self.http.get(&format!("/api/mdb/{}/parameters{}", instance, qualified_name)).await
    }

    /// Get parameter types with optional filtering
    pub async fn get_parameter_types(
        &self,
        instance: &str,
        options: &crate::types::mdb::GetParameterTypesOptions,
    ) -> Result<crate::types::mdb::ParameterTypesPage> {
        let query = serde_urlencoded::to_string(options)?;
        self.http.get(&format!("/api/mdb/{}/parameter-types?{}", instance, query)).await
    }

    /// Get a specific parameter type
    pub async fn get_parameter_type(&self, instance: &str, qualified_name: &str) -> Result<crate::types::mdb::ParameterType> {
        self.http.get(&format!("/api/mdb/{}/parameter-types{}", instance, qualified_name)).await
    }

    /// Get commands with optional filtering
    pub async fn get_commands(
        &self,
        instance: &str,
        options: &crate::types::mdb::GetCommandsOptions,
    ) -> Result<crate::types::mdb::CommandsPage> {
        let query = serde_urlencoded::to_string(options)?;
        self.http.get(&format!("/api/mdb/{}/commands?{}", instance, query)).await
    }

    /// Get a specific command by qualified name
    pub async fn get_command(&self, instance: &str, qualified_name: &str) -> Result<crate::types::mdb::Command> {
        self.http.get(&format!("/api/mdb/{}/commands{}", instance, qualified_name)).await
    }

    /// Get containers with optional filtering
    pub async fn get_containers(
        &self,
        instance: &str,
        options: &crate::types::mdb::GetContainersOptions,
    ) -> Result<crate::types::mdb::ContainersPage> {
        let query = serde_urlencoded::to_string(options)?;
        self.http.get(&format!("/api/mdb/{}/containers?{}", instance, query)).await
    }

    /// Get a specific container by qualified name
    pub async fn get_container(&self, instance: &str, qualified_name: &str) -> Result<crate::types::mdb::Container> {
        self.http.get(&format!("/api/mdb/{}/containers{}", instance, qualified_name)).await
    }

    /// Get algorithms with optional filtering
    pub async fn get_algorithms(
        &self,
        instance: &str,
        options: &crate::types::mdb::GetAlgorithmsOptions,
    ) -> Result<crate::types::mdb::AlgorithmsPage> {
        let query = serde_urlencoded::to_string(options)?;
        self.http.get(&format!("/api/mdb/{}/algorithms?{}", instance, query)).await
    }

    /// Get a specific algorithm by qualified name
    pub async fn get_algorithm(&self, instance: &str, qualified_name: &str) -> Result<crate::types::mdb::Algorithm> {
        self.http.get(&format!("/api/mdb/{}/algorithms{}", instance, qualified_name)).await
    }

    /// Get algorithm status
    pub async fn get_algorithm_status(
        &self,
        instance: &str,
        processor: &str,
        qualified_name: &str,
    ) -> Result<crate::types::mdb::AlgorithmStatus> {
        self.http.get(&format!(
            "/api/processors/{}/{}/algorithms{}/status",
            instance, processor, qualified_name
        )).await
    }

    /// Get algorithm trace
    pub async fn get_algorithm_trace(
        &self,
        instance: &str,
        processor: &str,
        qualified_name: &str,
    ) -> Result<crate::types::mdb::AlgorithmTrace> {
        self.http.get(&format!(
            "/api/processors/{}/{}/algorithms{}/trace",
            instance, processor, qualified_name
        )).await
    }

    // ========================================================================
    // Real-time Operations APIs
    // ========================================================================

    /// Issue a command
    pub async fn issue_command(
        &self,
        instance: &str,
        processor: &str,
        command: &str,
        options: &crate::types::monitoring::IssueCommandOptions,
    ) -> Result<crate::types::monitoring::IssueCommandResponse> {
        let encoded_command = urlencoding::encode(command);
        self.http.post(
            &format!("/api/processors/{}/{}/commands/{}", instance, processor, encoded_command),
            options,
        ).await
    }

    /// Get command history entries
    pub async fn get_command_history(
        &self,
        instance: &str,
        options: &crate::types::monitoring::GetCommandHistoryOptions,
    ) -> Result<crate::types::monitoring::CommandHistoryPage> {
        let query = serde_urlencoded::to_string(options)?;
        self.http.get(&format!(
            "/api/archive/{}/commands?{}",
            instance, query
        )).await
    }

    /// Get a specific command history entry
    pub async fn get_command_history_entry(
        &self,
        instance: &str,
        command_id: &str,
    ) -> Result<crate::types::monitoring::CommandHistoryEntry> {
        self.http.get(&format!(
            "/api/archive/{}/commands/{}",
            instance, command_id
        )).await
    }

    /// Get parameter values from archive
    pub async fn get_parameter_values(
        &self,
        instance: &str,
        qualified_name: &str,
        options: &crate::types::monitoring::GetParameterValuesOptions,
    ) -> Result<Vec<crate::types::monitoring::ParameterValue>> {
        let query = serde_urlencoded::to_string(options)?;
        #[derive(serde::Deserialize)]
        struct ParameterData {
            parameter: Option<Vec<crate::types::monitoring::ParameterValue>>,
        }
        let response: ParameterData = self.http.get(&format!(
            "/api/archive/{}/parameters{}?{}",
            instance, qualified_name, query
        )).await?;
        Ok(response.parameter.unwrap_or_default())
    }

    /// Get parameter samples (statistical aggregates)
    pub async fn get_parameter_samples(
        &self,
        instance: &str,
        qualified_name: &str,
        options: &crate::types::monitoring::GetParameterSamplesOptions,
    ) -> Result<Vec<crate::types::monitoring::Sample>> {
        let query = serde_urlencoded::to_string(options)?;
        #[derive(serde::Deserialize)]
        struct SamplesWrapper {
            sample: Option<Vec<crate::types::monitoring::Sample>>,
        }
        let response: SamplesWrapper = self.http.get(&format!(
            "/api/archive/{}/parameters{}/samples?{}",
            instance, qualified_name, query
        )).await?;
        Ok(response.sample.unwrap_or_default())
    }

    /// Get parameter ranges
    pub async fn get_parameter_ranges(
        &self,
        instance: &str,
        qualified_name: &str,
        options: &crate::types::monitoring::GetParameterRangesOptions,
    ) -> Result<Vec<crate::types::monitoring::Range>> {
        let query = serde_urlencoded::to_string(options)?;
        #[derive(serde::Deserialize)]
        struct RangesWrapper {
            range: Option<Vec<crate::types::monitoring::Range>>,
        }
        let response: RangesWrapper = self.http.get(&format!(
            "/api/archive/{}/parameters{}/ranges?{}",
            instance, qualified_name, query
        )).await?;
        Ok(response.range.unwrap_or_default())
    }

    /// Get packets
    pub async fn get_packets(
        &self,
        instance: &str,
        options: &crate::types::monitoring::GetPacketsOptions,
    ) -> Result<crate::types::monitoring::ListPacketsResponse> {
        self.http.post(&format!("/api/archive/{}/packets:list", instance), options).await
    }

    /// Create a processor
    pub async fn create_processor(
        &self,
        options: &crate::types::monitoring::CreateProcessorRequest,
    ) -> Result<crate::types::system::Processor> {
        self.http.post("/api/processors", options).await
    }

    /// Get processors for an instance
    pub async fn get_processors(&self, instance: &str) -> Result<Vec<crate::types::system::Processor>> {
        #[derive(serde::Deserialize)]
        struct ProcessorsWrapper {
            processors: Option<Vec<crate::types::system::Processor>>,
        }
        let response: ProcessorsWrapper = self.http.get(&format!("/api/processors/{}", instance)).await?;
        Ok(response.processors.unwrap_or_default())
    }

    /// Get a specific processor
    pub async fn get_processor(&self, instance: &str, name: &str) -> Result<crate::types::system::Processor> {
        self.http.get(&format!("/api/processors/{}/{}", instance, name)).await
    }

    /// Edit a replay processor
    pub async fn edit_replay_processor(
        &self,
        instance: &str,
        processor: &str,
        options: &crate::types::monitoring::EditReplayProcessorRequest,
    ) -> Result<()> {
        let _: serde_json::Value = self.http.patch(
            &format!("/api/processors/{}/{}", instance, processor),
            options,
        ).await?;
        Ok(())
    }

    // ========================================================================
    // Event APIs
    // ========================================================================

    /// Get events
    pub async fn get_events(
        &self,
        instance: &str,
        options: &crate::types::events::GetEventsOptions,
    ) -> Result<Vec<crate::types::events::Event>> {
        #[derive(serde::Deserialize)]
        struct EventsWrapper {
            event: Option<Vec<crate::types::events::Event>>,
        }
        let response: EventsWrapper = self.http.post(&format!("/api/archive/{}/events:list", instance), options).await?;
        Ok(response.event.unwrap_or_default())
    }

    /// Create an event
    pub async fn create_event(
        &self,
        instance: &str,
        options: &crate::types::events::CreateEventRequest,
    ) -> Result<()> {
        let _: serde_json::Value = self.http.post(&format!("/api/archive/{}/events", instance), options).await?;
        Ok(())
    }

    /// Get event sources
    pub async fn get_event_sources(&self, instance: &str) -> Result<Vec<String>> {
        #[derive(serde::Deserialize)]
        struct SourcesResponse {
            sources: Option<Vec<String>>,
        }
        let response: SourcesResponse = self.http.get(&format!("/api/archive/{}/events/sources", instance)).await?;
        Ok(response.sources.unwrap_or_default())
    }

    // ========================================================================
    // Alarm APIs
    // ========================================================================

    /// Get active alarms for a processor
    pub async fn get_active_alarms(
        &self,
        instance: &str,
        processor: &str,
        options: &crate::types::alarms::GetAlarmsOptions,
    ) -> Result<Vec<crate::types::alarms::Alarm>> {
        #[derive(serde::Deserialize)]
        struct AlarmsResponse {
            alarms: Option<Vec<crate::types::alarms::Alarm>>,
        }
        let query = serde_urlencoded::to_string(options)?;
        let response: AlarmsResponse = self.http.get(&format!(
            "/api/processors/{}/{}/alarms?{}",
            instance, processor, query
        )).await?;
        Ok(response.alarms.unwrap_or_default())
    }

    /// Get alarms with optional filtering
    pub async fn get_alarms(
        &self,
        instance: &str,
        options: &crate::types::alarms::GetAlarmsOptions,
    ) -> Result<Vec<crate::types::alarms::Alarm>> {
        #[derive(serde::Deserialize)]
        struct AlarmsWrapper {
            alarms: Option<Vec<crate::types::alarms::Alarm>>,
        }
        let query = serde_urlencoded::to_string(options)?;
        let response: AlarmsWrapper = self.http.get(&format!("/api/archive/{}/alarms?{}", instance, query)).await?;
        Ok(response.alarms.unwrap_or_default())
    }

    /// Acknowledge an alarm
    pub async fn acknowledge_alarm(
        &self,
        instance: &str,
        processor: &str,
        alarm_name: &str,
        seq_num: u64,
        options: &crate::types::alarms::AcknowledgeAlarmOptions,
    ) -> Result<()> {
        let _: serde_json::Value = self.http.post(
            &format!(
                "/api/processors/{}/{}/alarms{}/{}:acknowledge",
                instance, processor, alarm_name, seq_num
            ),
            options,
        ).await?;
        Ok(())
    }

    /// Shelve an alarm
    pub async fn shelve_alarm(
        &self,
        instance: &str,
        processor: &str,
        alarm_name: &str,
        seq_num: u64,
        options: &crate::types::alarms::ShelveAlarmOptions,
    ) -> Result<()> {
        let _: serde_json::Value = self.http.post(
            &format!(
                "/api/processors/{}/{}/alarms{}/{}:shelve",
                instance, processor, alarm_name, seq_num
            ),
            options,
        ).await?;
        Ok(())
    }

    /// Unshelve an alarm
    pub async fn unshelve_alarm(
        &self,
        instance: &str,
        processor: &str,
        alarm_name: &str,
        seq_num: u64,
    ) -> Result<()> {
        let _: serde_json::Value = self.http.post(
            &format!(
                "/api/processors/{}/{}/alarms{}/{}:unshelve",
                instance, processor, alarm_name, seq_num
            ),
            &serde_json::json!({}),
        ).await?;
        Ok(())
    }

    /// Clear an alarm
    pub async fn clear_alarm(
        &self,
        instance: &str,
        processor: &str,
        alarm_name: &str,
        seq_num: u64,
        options: &crate::types::alarms::ClearAlarmOptions,
    ) -> Result<()> {
        let _: serde_json::Value = self.http.post(
            &format!(
                "/api/processors/{}/{}/alarms{}/{}:clear",
                instance, processor, alarm_name, seq_num
            ),
            options,
        ).await?;
        Ok(())
    }

    /// Get global alarm status
    pub async fn get_global_alarm_status(
        &self,
        instance: &str,
        processor: &str,
    ) -> Result<crate::types::alarms::GlobalAlarmStatus> {
        self.http.get(&format!(
            "/api/processors/{}/{}/alarms/global-status",
            instance, processor
        )).await
    }

    // ========================================================================
    // Instance APIs
    // ========================================================================

    /// Get all instances
    pub async fn get_instances(&self) -> Result<Vec<crate::types::system::Instance>> {
        #[derive(serde::Deserialize)]
        struct InstancesResponse {
            instances: Vec<crate::types::system::Instance>,
        }
        let response: InstancesResponse = self.http.get("/api/instances").await?;
        Ok(response.instances)
    }

    /// Get a specific instance
    pub async fn get_instance(&self, name: &str) -> Result<crate::types::system::Instance> {
        self.http.get(&format!("/api/instances/{}", name)).await
    }

    // ========================================================================
    // WebSocket APIs (requires `websocket` feature)
    // ========================================================================

    #[cfg(feature = "websocket")]
    /// Connect to the WebSocket endpoint for real-time subscriptions
    ///
    /// This must be called before creating any subscriptions.
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::YamcsClient;
    /// # async fn example(client: &YamcsClient) -> Result<(), Box<dyn std::error::Error>> {
    /// client.connect_websocket().await?;
    /// # Ok(())
    /// # }
    /// ```
    pub async fn connect_websocket(&self) -> Result<()> {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            client.connect().await
        } else {
            Err(crate::error::YamcsError::WebSocket(
                "WebSocket client not initialized".to_string(),
            ))
        }
    }

    #[cfg(feature = "websocket")]
    /// Get the WebSocket connection state
    pub async fn websocket_state(&self) -> Option<crate::websocket::ConnectionState> {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            Some(client.state().await)
        } else {
            None
        }
    }

    #[cfg(feature = "websocket")]
    /// Set a callback for WebSocket frame loss detection
    pub async fn set_frame_loss_callback<F>(&self, callback: F)
    where
        F: Fn() + Send + Sync + 'static,
    {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            client.set_frame_loss_callback(callback).await;
        }
    }

    #[cfg(feature = "websocket")]
    /// Subscribe to parameter updates
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::{YamcsClient, types::monitoring::{SubscribeParametersRequest, SubscribeParametersAction, SubscribeParametersData}, types::common::NamedObjectId};
    /// # async fn example(client: &YamcsClient) -> Result<(), Box<dyn std::error::Error>> {
    /// let request = SubscribeParametersRequest {
    ///     instance: "myinstance".to_string(),
    ///     processor: "realtime".to_string(),
    ///     id: vec![NamedObjectId { name: "/MySystem/MyParameter".to_string(), namespace: None }],
    ///     abort_on_invalid: false,
    ///     update_on_expiration: false,
    ///     send_from_cache: true,
    ///     max_bytes: None,
    ///     action: SubscribeParametersAction::Replace,
    /// };
    /// let handle = client.subscribe_parameters(&request, |data: SubscribeParametersData| {
    ///     println!("Parameter update: {:?}", data);
    /// }).await?;
    /// # Ok(())
    /// # }
    /// ```
    pub async fn subscribe_parameters<F>(
        &self,
        request: &crate::types::monitoring::SubscribeParametersRequest,
        callback: F,
    ) -> Result<crate::websocket::SubscriptionHandle>
    where
        F: Fn(crate::types::monitoring::SubscribeParametersData) + Send + Sync + 'static,
    {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            client
                .subscribe("parameters", serde_json::to_value(request)?, callback)
                .await
        } else {
            Err(crate::error::YamcsError::WebSocket(
                "WebSocket client not initialized".to_string(),
            ))
        }
    }

    #[cfg(feature = "websocket")]
    /// Subscribe to events
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::{YamcsClient, types::events::{Event, SubscribeEventsRequest}};
    /// # async fn example(client: &YamcsClient) -> Result<(), Box<dyn std::error::Error>> {
    /// let request = SubscribeEventsRequest {
    ///     instance: "myinstance".to_string(),
    ///     filter: None,
    /// };
    /// let handle = client.subscribe_events(&request, |event: Event| {
    ///     println!("Event: {:?}", event);
    /// }).await?;
    /// # Ok(())
    /// # }
    /// ```
    pub async fn subscribe_events<F>(
        &self,
        request: &crate::types::events::SubscribeEventsRequest,
        callback: F,
    ) -> Result<crate::websocket::SubscriptionHandle>
    where
        F: Fn(crate::types::events::Event) + Send + Sync + 'static,
    {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            client.subscribe("events", serde_json::to_value(request)?, callback).await
        } else {
            Err(crate::error::YamcsError::WebSocket(
                "WebSocket client not initialized".to_string(),
            ))
        }
    }

    #[cfg(feature = "websocket")]
    /// Subscribe to alarms
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::{YamcsClient, types::alarms::{Alarm, SubscribeAlarmsRequest}};
    /// # async fn example(client: &YamcsClient) -> Result<(), Box<dyn std::error::Error>> {
    /// let request = SubscribeAlarmsRequest {
    ///     instance: "myinstance".to_string(),
    ///     processor: "realtime".to_string(),
    ///     include_pending: true,
    /// };
    /// let handle = client.subscribe_alarms(&request, |alarm: Alarm| {
    ///     println!("Alarm: {:?}", alarm);
    /// }).await?;
    /// # Ok(())
    /// # }
    /// ```
    pub async fn subscribe_alarms<F>(
        &self,
        request: &crate::types::alarms::SubscribeAlarmsRequest,
        callback: F,
    ) -> Result<crate::websocket::SubscriptionHandle>
    where
        F: Fn(crate::types::alarms::Alarm) + Send + Sync + 'static,
    {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            client.subscribe("alarms", serde_json::to_value(request)?, callback).await
        } else {
            Err(crate::error::YamcsError::WebSocket(
                "WebSocket client not initialized".to_string(),
            ))
        }
    }

    #[cfg(feature = "websocket")]
    /// Subscribe to global alarm status
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::{YamcsClient, types::alarms::{GlobalAlarmStatus, SubscribeGlobalAlarmStatusRequest}};
    /// # async fn example(client: &YamcsClient) -> Result<(), Box<dyn std::error::Error>> {
    /// let request = SubscribeGlobalAlarmStatusRequest {
    ///     instance: "myinstance".to_string(),
    ///     processor: "realtime".to_string(),
    /// };
    /// let handle = client.subscribe_global_alarm_status(&request, |status: GlobalAlarmStatus| {
    ///     println!("Alarm status: {:?}", status);
    /// }).await?;
    /// # Ok(())
    /// # }
    /// ```
    pub async fn subscribe_global_alarm_status<F>(
        &self,
        request: &crate::types::alarms::SubscribeGlobalAlarmStatusRequest,
        callback: F,
    ) -> Result<crate::websocket::SubscriptionHandle>
    where
        F: Fn(crate::types::alarms::GlobalAlarmStatus) + Send + Sync + 'static,
    {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            client
                .subscribe("global-alarm-status", serde_json::to_value(request)?, callback)
                .await
        } else {
            Err(crate::error::YamcsError::WebSocket(
                "WebSocket client not initialized".to_string(),
            ))
        }
    }

    #[cfg(feature = "websocket")]
    /// Cancel a WebSocket subscription
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::YamcsClient;
    /// # use yamcs_http::websocket::SubscriptionHandle;
    /// # async fn example(client: &YamcsClient, handle: SubscriptionHandle) -> Result<(), Box<dyn std::error::Error>> {
    /// client.cancel_subscription(handle).await?;
    /// # Ok(())
    /// # }
    /// ```
    pub async fn cancel_subscription(
        &self,
        handle: crate::websocket::SubscriptionHandle,
    ) -> Result<()> {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            client.cancel_subscription(handle).await
        } else {
            Ok(())
        }
    }

    #[cfg(feature = "websocket")]
    /// Close the WebSocket connection
    ///
    /// # Example
    ///
    /// ```no_run
    /// # use yamcs_http::YamcsClient;
    /// # async fn example(client: &YamcsClient) {
    /// client.close_websocket().await;
    /// # }
    /// ```
    pub async fn close_websocket(&self) {
        let ws = self.ws_client.lock().await;
        if let Some(client) = ws.as_ref() {
            client.close().await;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_client_creation() {
        let client = YamcsClient::new("http://localhost:8090");
        assert!(client.is_ok());
    }

    #[test]
    fn test_client_with_auth() {
        let client = YamcsClient::with_auth(
            "http://localhost:8090",
            AuthMethod::AccessToken("test-token".to_string()),
        );
        assert!(client.is_ok());
    }

    #[test]
    fn test_invalid_url() {
        let client = YamcsClient::new("not-a-valid-url");
        assert!(client.is_err());
    }
}
