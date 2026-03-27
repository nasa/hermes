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
    instance: String,
    processor: String,
}

impl YamcsApiService {
    pub fn new(yamcs_client: YamcsClient, instance: String, processor: String) -> Self {
        Self {
            yamcs_client: Arc::new(yamcs_client),
            instance,
            processor,
        }
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
                &self.instance,
                &self.processor,
                &command_name,
                &yamcs_options,
            )
            .await
            .map_err(|e| {
                error!(error = %e, command = %command_name, "Failed to issue command");
                Status::internal(format!("Failed to issue command: {}", e))
            })?;

        info!(
            command_name = %result.command_name,
            command_id = %result.id,
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

    async fn get_fsw(&self, _request: Request<Id>) -> Result<Response<Fsw>, Status> {
        Err(Status::unimplemented("GetFsw not implemented"))
    }

    async fn all_fsw(&self, _request: Request<()>) -> Result<Response<FswList>, Status> {
        Err(Status::unimplemented("AllFsw not implemented"))
    }

    type SubscribeFswStream = ReceiverStream<Result<FswList, Status>>;

    async fn subscribe_fsw(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubscribeFswStream>, Status> {
        Err(Status::unimplemented("SubscribeFsw not implemented"))
    }

    async fn start_profile(&self, _request: Request<Id>) -> Result<Response<()>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    async fn stop_profile(&self, _request: Request<Id>) -> Result<Response<()>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    async fn update_profile(
        &self,
        _request: Request<ProfileUpdate>,
    ) -> Result<Response<()>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    async fn add_profile(&self, _request: Request<Profile>) -> Result<Response<Id>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    async fn remove_profile(&self, _request: Request<Id>) -> Result<Response<()>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    async fn all_profiles(&self, _request: Request<()>) -> Result<Response<ProfileList>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    async fn all_providers(
        &self,
        _request: Request<()>,
    ) -> Result<Response<ProfileProviderList>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    async fn get_file_transfer_state(
        &self,
        _request: Request<()>,
    ) -> Result<Response<FileTransferState>, Status> {
        Err(Status::unimplemented("File transfer not implemented"))
    }

    async fn clear_downlink_transfer_state(
        &self,
        _request: Request<()>,
    ) -> Result<Response<()>, Status> {
        Err(Status::unimplemented("File transfer not implemented"))
    }

    async fn clear_uplink_transfer_state(
        &self,
        _request: Request<()>,
    ) -> Result<Response<()>, Status> {
        Err(Status::unimplemented("File transfer not implemented"))
    }

    type SubscribeProvidersStream = ReceiverStream<Result<ProfileProviderList, Status>>;

    async fn subscribe_providers(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubscribeProvidersStream>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    type SubscribeProfilesStream = ReceiverStream<Result<ProfileList, Status>>;

    async fn subscribe_profiles(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubscribeProfilesStream>, Status> {
        Err(Status::unimplemented("Profiles not implemented"))
    }

    async fn get_dictionary(&self, _request: Request<Id>) -> Result<Response<Dictionary>, Status> {
        Err(Status::unimplemented("Dictionary not implemented"))
    }

    async fn add_dictionary(&self, _request: Request<Dictionary>) -> Result<Response<Id>, Status> {
        Err(Status::unimplemented("Dictionary not implemented"))
    }

    async fn remove_dictionary(&self, _request: Request<Id>) -> Result<Response<()>, Status> {
        Err(Status::unimplemented("Dictionary not implemented"))
    }

    async fn all_dictionary(
        &self,
        _request: Request<()>,
    ) -> Result<Response<DictionaryList>, Status> {
        Err(Status::unimplemented("Dictionary not implemented"))
    }

    type SubscribeDictionaryStream = ReceiverStream<Result<DictionaryList, Status>>;

    async fn subscribe_dictionary(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubscribeDictionaryStream>, Status> {
        Err(Status::unimplemented("Dictionary not implemented"))
    }

    type SubEventStream = ReceiverStream<Result<SourcedEvent, Status>>;

    async fn sub_event(
        &self,
        request: Request<BusFilter>,
    ) -> Result<Response<Self::SubEventStream>, Status> {
        let filter = request.into_inner();
        debug!(
            source = ?filter.source,
            names = ?filter.names,
            "Event subscription requested"
        );

        // Ensure WebSocket is connected
        self.ensure_ws_connected().await?;

        // Create channel for streaming events
        let (tx, rx) = tokio::sync::mpsc::channel(100);

        // Subscribe to YAMCS events
        let instance = self.instance.clone();

        let mut events = self
            .yamcs_client
            .subscribe_events(&yamcs_http::SubscribeEventsRequest {
                instance: instance.clone(),
                filter: None,
            })
            .await
            .map_err(|e| {
                error!(error = %e, instance = %instance, "Failed to subscribe to events");
                Status::internal(format!("Failed to subscribe to telemetry: {}", e))
            })?;

        tokio::spawn(async move {
            loop {
                tokio::select! {
                    event = events.recv() => {
                        if let Some(event) = event {
                            match convert::yamcs_event_to_hermes(&event, &filter) {
                                Ok(Some(hermes_event)) => {
                                    debug!(event = ?hermes_event, "passing event to hermes subscriber");
                                    if tx.send(Ok(hermes_event)).await.is_err() {
                                        debug!("Event stream closed by client");
                                        break;
                                    }
                                }
                                Ok(None) => {
                                    // Filtered out
                                    debug!(event_type = %event.event_type, "Event filtered out");
                                }
                                Err(e) => {
                                    error!(error = %e, event_type = %event.event_type, "Failed to convert event");
                                }
                            }
                        } else {
                            warn!("event subscription closed unexpectedly");
                            break;
                        }
                    }
                    _ = tx.closed() => {
                        debug!("Event stream closed by client");
                        break;
                    }
                }
            }

            debug!("closing event subscription");
        });

        info!(instance = %instance, "Event subscription established");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubTelemetryStream = ReceiverStream<Result<SourcedTelemetry, Status>>;

    async fn sub_telemetry(
        &self,
        request: Request<BusFilter>,
    ) -> Result<Response<Self::SubTelemetryStream>, Status> {
        let filter = request.into_inner();
        debug!(
            source = ?filter.source,
            names = ?filter.names,
            "Telemetry subscription requested"
        );

        // Ensure WebSocket is connected
        self.ensure_ws_connected().await?;

        // Create channel for streaming telemetry
        let (tx, rx) = tokio::sync::mpsc::channel(100);

        // Subscribe to YAMCS parameters
        let instance = self.instance.clone();
        let processor = self.processor.clone();

        // Build parameter ID list from filter
        let param_ids: Vec<yamcs_http::types::common::NamedObjectId> = if filter.names.is_empty() {
            vec![]
        } else {
            filter
                .names
                .iter()
                .map(|name| yamcs_http::types::common::NamedObjectId {
                    name: name.clone(),
                    namespace: None,
                })
                .collect()
        };

        let subscribe_request = yamcs_http::types::monitoring::SubscribeParametersRequest {
            instance: instance.clone(),
            processor: processor.clone(),
            id: param_ids.clone(),
            abort_on_invalid: false,
            update_on_expiration: false,
            send_from_cache: false,
            max_bytes: None,
            action: yamcs_http::types::monitoring::SubscribeParametersAction::Replace,
        };

        let mut params = self
            .yamcs_client
            .subscribe_parameters(&subscribe_request)
            .await
            .map_err(|e| {
                error!(error = %e, instance = %instance, processor = %processor, "Failed to subscribe to telemetry");
                Status::internal(format!("Failed to subscribe to telemetry: {}", e))
            })?;

        tokio::spawn(async move {
            'outer: loop {
                tokio::select! {
                    data = params.recv() => {
                        if let Some(data) = data {
                            // Convert each parameter value to Hermes telemetry
                            for param_value in data.values {
                                match convert::yamcs_param_to_hermes(&param_value, &filter) {
                                    Ok(Some(hermes_telem)) => {
                                        if tx.send(Ok(hermes_telem)).await.is_err() {
                                            debug!("Telemetry stream closed by client");
                                            break 'outer;
                                        }
                                    }
                                    Ok(None) => {
                                        // Filtered out
                                        debug!(param_name = %param_value.id.name, "Parameter filtered out");
                                    }
                                    Err(e) => {
                                        error!(error = %e, param_name = %param_value.id.name, "Failed to convert telemetry");
                                    }
                                }
                            }
                        } else {
                            warn!("telemetry subscription closed unexpectedly");
                            break;
                        }
                    }
                    _ = tx.closed() => {
                        debug!("Telemetry stream closed by client");
                        break;
                    }
                }
            }

            debug!("closing telemetry subscription");
        });

        info!(instance = %instance, processor = %processor, param_count = param_ids.len(), "Telemetry subscription established");
        Ok(Response::new(ReceiverStream::new(rx)))
    }

    type SubFileDownlinkStream = ReceiverStream<Result<FileDownlink, Status>>;

    async fn sub_file_downlink(
        &self,
        _request: Request<BusFilter>,
    ) -> Result<Response<Self::SubFileDownlinkStream>, Status> {
        Err(Status::unimplemented(
            "File downlink subscription not implemented",
        ))
    }

    type SubFileUplinkStream = ReceiverStream<Result<FileUplink, Status>>;

    async fn sub_file_uplink(
        &self,
        _request: Request<BusFilter>,
    ) -> Result<Response<Self::SubFileUplinkStream>, Status> {
        Err(Status::unimplemented(
            "File uplink subscription not implemented",
        ))
    }

    type SubFileTransferStream = ReceiverStream<Result<FileTransferState, Status>>;

    async fn sub_file_transfer(
        &self,
        _request: Request<()>,
    ) -> Result<Response<Self::SubFileTransferStream>, Status> {
        Err(Status::unimplemented(
            "File transfer subscription not implemented",
        ))
    }
}
