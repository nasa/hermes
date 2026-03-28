use hermes_pb::*;
use std::sync::Arc;
use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status};
use tracing::{debug, error, info, warn};
use yamcs_http::YamcsClient;

use crate::convert;

// Re-export the service trait from hermes_server
use hermes_server::api_server::Api;

pub struct YamcsApiService {
    yamcs_client: Arc<YamcsClient>,
    processor: String,
}

impl YamcsApiService {
    pub fn new(yamcs_client: YamcsClient, processor: String) -> Self {
        Self {
            yamcs_client: Arc::new(yamcs_client),
            processor,
        }
    }

    /// Extract FSW ID (YAMCS instance name) from gRPC request metadata
    fn extract_fsw_id<T>(request: &Request<T>) -> Result<String, Status> {
        request
            .metadata()
            .get("id")
            .and_then(|v| v.to_str().ok())
            .map(|s| s.to_string())
            .ok_or_else(|| {
                Status::invalid_argument("Missing 'id' metadata field specifying YAMCS instance")
            })
    }

    /// Ensure WebSocket is connected, connecting if necessary
    async fn ensure_ws_connected(&self) -> Result<(), Status> {
        use yamcs_http::websocket::ConnectionState;

        match self.yamcs_client.websocket_state().await {
            Some(ConnectionState::Connected) => Ok(()),
            _ => {
                debug!("Connecting to YAMCS WebSocket");
                self.yamcs_client.connect_websocket().await.map_err(|e| {
                    error!(error = %e, "Failed to connect to WebSocket");
                    Status::unavailable(format!("Failed to connect to WebSocket: {}", e))
                })
            }
        }
    }
}

#[tonic::async_trait]
impl Api for YamcsApiService {
    async fn sequence(
        &self,
        _request: Request<CommandSequence>,
    ) -> Result<Response<SequenceReply>, Status> {
        Err(Status::unimplemented("Sequence not implemented yet"))
    }

    async fn raw_sequence(
        &self,
        _request: Request<RawCommandSequence>,
    ) -> Result<Response<SequenceReply>, Status> {
        Err(Status::unimplemented("RawSequence not implemented yet"))
    }

    async fn command(&self, request: Request<CommandValue>) -> Result<Response<Reply>, Status> {
        // Extract YAMCS instance from metadata
        let instance = Self::extract_fsw_id(&request)?;

        let cmd_value = request.into_inner();

        // Extract command definition
        let cmd_def = cmd_value
            .def
            .as_ref()
            .ok_or_else(|| Status::invalid_argument("Command definition is required"))?;

        // Build command name from component and mnemonic
        let command_name = if cmd_def.component.is_empty() {
            format!("/{}", cmd_def.mnemonic)
        } else {
            format!("/{}/{}", cmd_def.component, cmd_def.mnemonic)
        };

        // Convert command arguments to YAMCS format
        let yamcs_options = convert::command_value_to_yamcs(&cmd_value, cmd_def)?;

        // Issue command to YAMCS
        let result = self
            .yamcs_client
            .issue_command(
                &instance,
                &self.processor,
                &command_name,
                &yamcs_options,
            )
            .await
            .map_err(|e| {
                error!(error = %e, command = %command_name, instance = %instance, "Failed to issue command");
                Status::internal(format!("Failed to issue command: {}", e))
            })?;

        info!(
            command_name = %result.command_name,
            command_id = %result.id,
            instance = %instance,
            "Command issued successfully"
        );

        Ok(Response::new(Reply { success: true }))
    }

    async fn request(
        &self,
        _request: Request<RequestValue>,
    ) -> Result<Response<RequestReply>, Status> {
        Err(Status::unimplemented("Request not implemented"))
    }

    async fn raw_command(
        &self,
        _request: Request<RawCommandValue>,
    ) -> Result<Response<Reply>, Status> {
        Err(Status::unimplemented("RawCommand not implemented yet"))
    }

    async fn uplink(
        &self,
        _request: Request<tonic::Streaming<UplinkFileChunk>>,
    ) -> Result<Response<Reply>, Status> {
        Err(Status::unimplemented("Uplink not implemented"))
    }

    async fn get_fsw(&self, request: Request<Id>) -> Result<Response<Fsw>, Status> {
        let id = request.into_inner();

        // Fetch the specific YAMCS instance
        let instance = self.yamcs_client.get_instance(&id.id).await.map_err(|e| {
            error!(error = %e, instance_id = %id.id, "Failed to get YAMCS instance");
            Status::not_found(format!("YAMCS instance not found: {}", e))
        })?;

        // Convert to FSW
        let fsw = convert::yamcs_instance_to_fsw(&instance);

        debug!(fsw_id = %fsw.id, "Retrieved YAMCS instance as FSW");

        Ok(Response::new(fsw))
    }

    async fn all_fsw(&self, _request: Request<()>) -> Result<Response<FswList>, Status> {
        // Fetch all YAMCS instances
        let instances = self.yamcs_client.get_instances().await.map_err(|e| {
            error!(error = %e, "Failed to get YAMCS instances");
            Status::internal(format!("Failed to get YAMCS instances: {}", e))
        })?;

        // Convert each instance to an FSW object
        let fsw_list: Vec<Fsw> = instances
            .iter()
            .map(convert::yamcs_instance_to_fsw)
            .collect();

        debug!(
            count = fsw_list.len(),
            "Retrieved YAMCS instances as FSW list"
        );

        Ok(Response::new(FswList { all: fsw_list }))
    }

    type SubscribeFswStream = ReceiverStream<Result<FswList, Status>>;

    async fn subscribe_fsw(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubscribeFswStream>, Status> {
        // Create channel for streaming FSW list
        let (tx, rx) = tokio::sync::mpsc::channel(1);

        let yamcs_client = self.yamcs_client.clone();

        tokio::spawn(async move {
            // Fetch all YAMCS instances and send initial FSW list
            match yamcs_client.get_instances().await {
                Ok(instances) => {
                    let fsw_list: Vec<Fsw> = instances
                        .iter()
                        .map(convert::yamcs_instance_to_fsw)
                        .collect();

                    if tx.send(Ok(FswList { all: fsw_list })).await.is_err() {
                        debug!("FSW subscription closed before initial send");
                        return;
                    }
                }
                Err(e) => {
                    error!(error = %e, "Failed to get YAMCS instances for FSW subscription");
                    let _ = tx
                        .send(Err(Status::internal(format!(
                            "Failed to get YAMCS instances: {}",
                            e
                        ))))
                        .await;
                    return;
                }
            }

            // Keep channel open until receiver is dropped
            tx.closed().await;
            debug!("FSW subscription closed by client");
        });

        info!("FSW subscription established");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    async fn start_profile(&self, _request: Request<Id>) -> Result<Response<()>, Status> {
        Err(Status::failed_precondition(
            "YAMCS backend manages its own connection lifecycle",
        ))
    }

    async fn stop_profile(&self, _request: Request<Id>) -> Result<Response<()>, Status> {
        Err(Status::failed_precondition(
            "YAMCS backend manages its own connection lifecycle",
        ))
    }

    async fn update_profile(
        &self,
        _request: Request<ProfileUpdate>,
    ) -> Result<Response<()>, Status> {
        Err(Status::failed_precondition(
            "YAMCS backend profile cannot be modified",
        ))
    }

    async fn add_profile(&self, _request: Request<Profile>) -> Result<Response<Id>, Status> {
        Err(Status::failed_precondition(
            "YAMCS backend profile is automatically created and cannot be added",
        ))
    }

    async fn remove_profile(&self, _request: Request<Id>) -> Result<Response<()>, Status> {
        Err(Status::failed_precondition(
            "YAMCS backend profile cannot be removed",
        ))
    }

    async fn all_profiles(&self, _request: Request<()>) -> Result<Response<ProfileList>, Status> {
        use std::collections::HashMap;

        let profile = Profile {
            name: format!("YAMCS (processor: {})", self.processor),
            provider: "yamcs".to_string(),
            settings: format!(r#"{{"processor": "{}"}}"#, self.processor),
            id: "yamcs".to_string(),
        };

        let stateful_profile = StatefulProfile {
            value: Some(profile),
            state: ProfileState::ProfileActive.into(),
            runtime_only: true,
        };

        let mut profiles = HashMap::new();
        profiles.insert("yamcs".to_string(), stateful_profile);

        debug!(processor = %self.processor, "Retrieved YAMCS profile");
        Ok(Response::new(ProfileList { all: profiles }))
    }

    async fn all_providers(
        &self,
        _request: Request<()>,
    ) -> Result<Response<ProfileProviderList>, Status> {
        // No providers for YAMCS backend
        debug!("Retrieved empty provider list");
        Ok(Response::new(ProfileProviderList { all: vec![] }))
    }

    async fn get_file_transfer_state(
        &self,
        _request: Request<()>,
    ) -> Result<Response<FileTransferState>, Status> {
        // Return empty file transfer state (stub)
        debug!("File transfer state requested (stub - returning empty state)");
        Ok(Response::new(FileTransferState {
            downlink_completed: vec![],
            uplink_completed: vec![],
            downlink_in_progress: vec![],
            uplink_in_progress: vec![],
        }))
    }

    async fn clear_downlink_transfer_state(
        &self,
        _request: Request<()>,
    ) -> Result<Response<()>, Status> {
        // No-op for stub implementation
        debug!("Clear downlink transfer state requested (stub - no-op)");
        Ok(Response::new(()))
    }

    async fn clear_uplink_transfer_state(
        &self,
        _request: Request<()>,
    ) -> Result<Response<()>, Status> {
        // No-op for stub implementation
        debug!("Clear uplink transfer state requested (stub - no-op)");
        Ok(Response::new(()))
    }

    type SubscribeProvidersStream = ReceiverStream<Result<ProfileProviderList, Status>>;

    async fn subscribe_providers(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubscribeProvidersStream>, Status> {
        // Create channel for streaming providers
        let (tx, rx) = tokio::sync::mpsc::channel(1);

        // Send empty provider list (no providers needed for YAMCS)
        tokio::spawn(async move {
            let _ = tx.send(Ok(ProfileProviderList { all: vec![] })).await;
            // Keep channel open until receiver is dropped
            tx.closed().await;
            debug!("Provider subscription closed by client");
        });

        debug!("Provider subscription established (empty list)");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubscribeProfilesStream = ReceiverStream<Result<ProfileList, Status>>;

    async fn subscribe_profiles(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubscribeProfilesStream>, Status> {
        // Create channel for streaming profiles
        let (tx, rx) = tokio::sync::mpsc::channel(1);

        // Create a single profile representing the YAMCS connection
        let processor = self.processor.clone();

        tokio::spawn(async move {
            use std::collections::HashMap;

            let profile = Profile {
                name: format!("YAMCS (processor: {})", processor),
                provider: "yamcs".to_string(),
                settings: format!(r#"{{"processor": "{}"}}"#, processor),
                id: "yamcs".to_string(),
            };

            let stateful_profile = StatefulProfile {
                value: Some(profile),
                state: ProfileState::ProfileActive.into(),
                runtime_only: true,
            };

            let mut profiles = HashMap::new();
            profiles.insert("yamcs".to_string(), stateful_profile);

            let _ = tx.send(Ok(ProfileList { all: profiles })).await;

            // Keep channel open until receiver is dropped
            tx.closed().await;
            debug!("Profile subscription closed by client");
        });

        info!(processor = %self.processor, "Profile subscription established");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    async fn get_dictionary(&self, request: Request<Id>) -> Result<Response<Dictionary>, Status> {
        let id = request.into_inner();

        // Verify the instance exists
        let instance = self.yamcs_client.get_instance(&id.id).await.map_err(|e| {
            error!(error = %e, instance_id = %id.id, "Failed to get YAMCS instance for dictionary");
            Status::not_found(format!("Dictionary not found: {}", e))
        })?;

        // Create a stub dictionary for this instance
        let dictionary = Dictionary {
            head: Some(DictionaryHead {
                r#type: "yamcs".to_string(),
                name: instance.name.clone(),
                version: String::new(),
            }),
            content: std::collections::HashMap::new(),
            metadata: std::collections::HashMap::new(),
            id: instance.name.clone(),
        };

        debug!(dictionary_id = %id.id, "Retrieved YAMCS instance dictionary");
        Ok(Response::new(dictionary))
    }

    async fn add_dictionary(&self, _request: Request<Dictionary>) -> Result<Response<Id>, Status> {
        Err(Status::failed_precondition(
            "Dictionaries are managed by YAMCS instances and cannot be added directly",
        ))
    }

    async fn remove_dictionary(&self, _request: Request<Id>) -> Result<Response<()>, Status> {
        Err(Status::failed_precondition(
            "Dictionaries are managed by YAMCS instances and cannot be removed directly",
        ))
    }

    async fn all_dictionary(
        &self,
        _request: Request<()>,
    ) -> Result<Response<DictionaryList>, Status> {
        // Fetch all YAMCS instances
        let instances = self.yamcs_client.get_instances().await.map_err(|e| {
            error!(error = %e, "Failed to get YAMCS instances for dictionaries");
            Status::internal(format!("Failed to get dictionaries: {}", e))
        })?;

        // Create a dictionary entry for each instance
        let dictionaries: std::collections::HashMap<String, DictionaryHead> = instances
            .iter()
            .map(|instance| {
                (
                    instance.name.clone(),
                    DictionaryHead {
                        r#type: "yamcs".to_string(),
                        name: instance.name.clone(),
                        version: String::new(),
                    },
                )
            })
            .collect();

        debug!(
            count = dictionaries.len(),
            "Retrieved YAMCS instance dictionaries"
        );
        Ok(Response::new(DictionaryList { all: dictionaries }))
    }

    type SubscribeDictionaryStream = ReceiverStream<Result<DictionaryList, Status>>;

    async fn subscribe_dictionary(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubscribeDictionaryStream>, Status> {
        // Create channel for streaming dictionaries
        let (tx, rx) = tokio::sync::mpsc::channel(1);

        let yamcs_client = self.yamcs_client.clone();

        tokio::spawn(async move {
            // Fetch all YAMCS instances and send initial dictionary list
            match yamcs_client.get_instances().await {
                Ok(instances) => {
                    let dictionaries: std::collections::HashMap<String, DictionaryHead> = instances
                        .iter()
                        .map(|instance| {
                            (
                                instance.name.clone(),
                                DictionaryHead {
                                    r#type: "yamcs".to_string(),
                                    name: instance.name.clone(),
                                    version: String::new(),
                                },
                            )
                        })
                        .collect();

                    if tx
                        .send(Ok(DictionaryList { all: dictionaries }))
                        .await
                        .is_err()
                    {
                        debug!("Dictionary subscription closed before initial send");
                        return;
                    }
                }
                Err(e) => {
                    error!(error = %e, "Failed to get YAMCS instances for dictionary subscription");
                    let _ = tx
                        .send(Err(Status::internal(format!(
                            "Failed to get dictionaries: {}",
                            e
                        ))))
                        .await;
                    return;
                }
            }

            // Keep channel open until receiver is dropped
            tx.closed().await;
            debug!("Dictionary subscription closed by client");
        });

        info!("Dictionary subscription established");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubEventStream = ReceiverStream<Result<SourcedEvent, Status>>;

    async fn sub_event(
        &self,
        request: Request<BusFilter>,
    ) -> Result<Response<Self::SubEventStream>, Status> {
        let filter = request.into_inner();

        // Determine which instances to subscribe to
        let instances = if filter.source.is_empty() {
            // Empty source = subscribe to ALL instances
            let all_instances = self.yamcs_client.get_instances().await.map_err(|e| {
                error!(error = %e, "Failed to get YAMCS instances for event subscription");
                Status::internal(format!("Failed to get instances: {}", e))
            })?;
            all_instances
                .into_iter()
                .map(|i| i.name)
                .collect::<Vec<_>>()
        } else {
            // Specific source = subscribe to single instance
            vec![filter.source.clone()]
        };

        debug!(
            instances = ?instances,
            names = ?filter.names,
            "Event subscription requested"
        );

        // Ensure WebSocket is connected
        self.ensure_ws_connected().await?;

        // Create channel for streaming events
        let (tx, rx) = tokio::sync::mpsc::channel(100);

        let yamcs_client = self.yamcs_client.clone();
        let filter_clone = filter.clone();
        let instance_count = instances.len();

        tokio::spawn(async move {
            // Create subscription futures for each instance
            let mut subscriptions = Vec::new();

            for instance in instances {
                match yamcs_client
                    .subscribe_events(&yamcs_http::SubscribeEventsRequest {
                        instance: instance.clone(),
                        filter: None,
                    })
                    .await
                {
                    Ok(mut events_stream) => {
                        let tx = tx.clone();
                        let filter = filter_clone.clone();
                        let instance_name = instance.clone();

                        // Spawn a task for each instance's event stream
                        subscriptions.push(tokio::spawn(async move {
                            loop {
                                tokio::select! {
                                    event = events_stream.recv() => {
                                        if let Some(event) = event {
                                            match convert::yamcs_event_to_hermes(&event, &filter) {
                                                Ok(Some(mut hermes_event)) => {
                                                    // Ensure source is set to the instance name
                                                    hermes_event.source = instance_name.clone();
                                                    if tx.send(Ok(hermes_event)).await.is_err() {
                                                        debug!("Event stream closed by client");
                                                        break;
                                                    }
                                                }
                                                Ok(None) => {
                                                    // Filtered out
                                                }
                                                Err(e) => {
                                                    error!(error = %e, instance = %instance_name, "Failed to convert event");
                                                }
                                            }
                                        } else {
                                            warn!(instance = %instance_name, "Event subscription closed");
                                            break;
                                        }
                                    }
                                    _ = tx.closed() => {
                                        debug!("Event stream closed by client");
                                        break;
                                    }
                                }
                            }
                        }));
                    }
                    Err(e) => {
                        error!(error = %e, instance = %instance, "Failed to subscribe to events");
                    }
                }
            }

            // Wait for all subscription tasks to complete
            for task in subscriptions {
                let _ = task.await;
            }

            debug!("All event subscriptions closed");
        });

        info!(
            instance_count = instance_count,
            "Event subscription established"
        );
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubTelemetryStream = ReceiverStream<Result<SourcedTelemetry, Status>>;

    async fn sub_telemetry(
        &self,
        request: Request<BusFilter>,
    ) -> Result<Response<Self::SubTelemetryStream>, Status> {
        let filter = request.into_inner();

        // Determine which instances to subscribe to
        let instances = if filter.source.is_empty() {
            // Empty source = subscribe to ALL instances
            let all_instances = self.yamcs_client.get_instances().await.map_err(|e| {
                error!(error = %e, "Failed to get YAMCS instances for telemetry subscription");
                Status::internal(format!("Failed to get instances: {}", e))
            })?;
            all_instances
                .into_iter()
                .map(|i| i.name)
                .collect::<Vec<_>>()
        } else {
            // Specific source = subscribe to single instance
            vec![filter.source.clone()]
        };

        debug!(
            instances = ?instances,
            names = ?filter.names,
            "Telemetry subscription requested"
        );

        // Ensure WebSocket is connected
        self.ensure_ws_connected().await?;

        // Create channel for streaming telemetry
        let (tx, rx) = tokio::sync::mpsc::channel(100);

        let yamcs_client = self.yamcs_client.clone();
        let processor = self.processor.clone();
        let filter_clone = filter.clone();

        let instance_count = instances.len();
        let processor_name = processor.clone();

        tokio::spawn(async move {
            // Create subscription futures for each instance
            let mut subscriptions = Vec::new();

            for instance in instances {
                // Build parameter ID list per instance
                let param_ids: Vec<yamcs_http::types::common::NamedObjectId> = if filter_clone
                    .names
                    .is_empty()
                {
                    // No specific names requested - subscribe to ALL parameters in this instance
                    match yamcs_client
                        .get_parameters(
                            &instance,
                            &yamcs_http::types::mdb::GetParametersOptions::default(),
                        )
                        .await
                    {
                        Ok(params_page) => {
                            if let Some(parameters) = params_page.parameters {
                                parameters
                                    .iter()
                                    .map(|p| yamcs_http::types::common::NamedObjectId {
                                        name: p.qualified_name.clone(),
                                        namespace: None,
                                    })
                                    .collect()
                            } else {
                                warn!(instance = %instance, "No parameters found");
                                vec![]
                            }
                        }
                        Err(e) => {
                            error!(error = %e, instance = %instance, "Failed to fetch parameters");
                            vec![]
                        }
                    }
                } else {
                    // Use specific parameter names from filter
                    filter_clone
                        .names
                        .iter()
                        .map(|name| yamcs_http::types::common::NamedObjectId {
                            name: name.clone(),
                            namespace: None,
                        })
                        .collect()
                };

                let param_count = param_ids.len();
                debug!(instance = %instance, param_count = param_count, "Subscribing to parameters");

                let subscribe_request = yamcs_http::types::monitoring::SubscribeParametersRequest {
                    instance: instance.clone(),
                    processor: processor.clone(),
                    id: param_ids,
                    abort_on_invalid: false,
                    update_on_expiration: false,
                    send_from_cache: false,
                    max_bytes: None,
                    action: yamcs_http::types::monitoring::SubscribeParametersAction::Replace,
                };

                match yamcs_client.subscribe_parameters(&subscribe_request).await {
                    Ok(mut params_stream) => {
                        let tx = tx.clone();
                        let filter = filter_clone.clone();
                        let instance_name = instance.clone();

                        // Spawn a task for each instance's telemetry stream
                        subscriptions.push(tokio::spawn(async move {
                            'outer: loop {
                                tokio::select! {
                                    data = params_stream.recv() => {
                                        if let Some(data) = data {
                                            // Convert each parameter value to Hermes telemetry
                                            for param_value in data.values {
                                                match convert::yamcs_param_to_hermes(&param_value, &filter) {
                                                    Ok(Some(mut hermes_telem)) => {
                                                        // Ensure source is set to the instance name
                                                        hermes_telem.source = instance_name.clone();
                                                        if tx.send(Ok(hermes_telem)).await.is_err() {
                                                            debug!("Telemetry stream closed by client");
                                                            break 'outer;
                                                        }
                                                    }
                                                    Ok(None) => {
                                                        // Filtered out
                                                    }
                                                    Err(e) => {
                                                        error!(error = %e, instance = %instance_name, param = %param_value.id.name, "Failed to convert telemetry");
                                                    }
                                                }
                                            }
                                        } else {
                                            warn!(instance = %instance_name, "Telemetry subscription closed");
                                            break;
                                        }
                                    }
                                    _ = tx.closed() => {
                                        debug!("Telemetry stream closed by client");
                                        break;
                                    }
                                }
                            }
                        }));
                    }
                    Err(e) => {
                        error!(error = %e, instance = %instance, processor = %processor, "Failed to subscribe to telemetry");
                    }
                }
            }

            // Wait for all subscription tasks to complete
            for task in subscriptions {
                let _ = task.await;
            }

            debug!("All telemetry subscriptions closed");
        });

        info!(instance_count = instance_count, processor = %processor_name, "Telemetry subscription established");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubFileDownlinkStream = ReceiverStream<Result<FileDownlink, Status>>;

    async fn sub_file_downlink(
        &self,
        _request: Request<BusFilter>,
    ) -> Result<Response<Self::SubFileDownlinkStream>, Status> {
        // Create channel for file downlink stream (stub - no data sent)
        let (tx, rx) = tokio::sync::mpsc::channel(1);

        tokio::spawn(async move {
            // Keep channel open until receiver is dropped
            tx.closed().await;
            debug!("File downlink subscription closed by client");
        });

        debug!("File downlink subscription established (stub)");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubFileUplinkStream = ReceiverStream<Result<FileUplink, Status>>;

    async fn sub_file_uplink(
        &self,
        _request: Request<BusFilter>,
    ) -> Result<Response<Self::SubFileUplinkStream>, Status> {
        // Create channel for file uplink stream (stub - no data sent)
        let (tx, rx) = tokio::sync::mpsc::channel(1);

        tokio::spawn(async move {
            // Keep channel open until receiver is dropped
            tx.closed().await;
            debug!("File uplink subscription closed by client");
        });

        debug!("File uplink subscription established (stub)");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubFileTransferStream = ReceiverStream<Result<FileTransferState, Status>>;

    async fn sub_file_transfer(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubFileTransferStream>, Status> {
        // Create channel for file transfer stream (stub - no data sent)
        let (tx, rx) = tokio::sync::mpsc::channel(1);

        tokio::spawn(async move {
            // Keep channel open until receiver is dropped
            tx.closed().await;
            debug!("File transfer subscription closed by client");
        });

        debug!("File transfer subscription established (stub)");
        Ok(Response::new(ReceiverStream::new(rx)))
    }
}
