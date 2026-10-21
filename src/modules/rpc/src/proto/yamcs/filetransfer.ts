import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from './google/protobuf/DescriptorProto';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from './google/protobuf/EnumDescriptorProto';
import type { EnumOptions as _google_protobuf_EnumOptions, EnumOptions__Output as _google_protobuf_EnumOptions__Output } from './google/protobuf/EnumOptions';
import type { EnumValueDescriptorProto as _google_protobuf_EnumValueDescriptorProto, EnumValueDescriptorProto__Output as _google_protobuf_EnumValueDescriptorProto__Output } from './google/protobuf/EnumValueDescriptorProto';
import type { EnumValueOptions as _google_protobuf_EnumValueOptions, EnumValueOptions__Output as _google_protobuf_EnumValueOptions__Output } from './google/protobuf/EnumValueOptions';
import type { ExtensionRangeOptions as _google_protobuf_ExtensionRangeOptions, ExtensionRangeOptions__Output as _google_protobuf_ExtensionRangeOptions__Output } from './google/protobuf/ExtensionRangeOptions';
import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from './google/protobuf/FeatureSet';
import type { FeatureSetDefaults as _google_protobuf_FeatureSetDefaults, FeatureSetDefaults__Output as _google_protobuf_FeatureSetDefaults__Output } from './google/protobuf/FeatureSetDefaults';
import type { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from './google/protobuf/FieldDescriptorProto';
import type { FieldOptions as _google_protobuf_FieldOptions, FieldOptions__Output as _google_protobuf_FieldOptions__Output } from './google/protobuf/FieldOptions';
import type { FileDescriptorProto as _google_protobuf_FileDescriptorProto, FileDescriptorProto__Output as _google_protobuf_FileDescriptorProto__Output } from './google/protobuf/FileDescriptorProto';
import type { FileDescriptorSet as _google_protobuf_FileDescriptorSet, FileDescriptorSet__Output as _google_protobuf_FileDescriptorSet__Output } from './google/protobuf/FileDescriptorSet';
import type { FileOptions as _google_protobuf_FileOptions, FileOptions__Output as _google_protobuf_FileOptions__Output } from './google/protobuf/FileOptions';
import type { GeneratedCodeInfo as _google_protobuf_GeneratedCodeInfo, GeneratedCodeInfo__Output as _google_protobuf_GeneratedCodeInfo__Output } from './google/protobuf/GeneratedCodeInfo';
import type { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from './google/protobuf/ListValue';
import type { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from './google/protobuf/MessageOptions';
import type { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from './google/protobuf/MethodDescriptorProto';
import type { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from './google/protobuf/MethodOptions';
import type { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from './google/protobuf/OneofDescriptorProto';
import type { OneofOptions as _google_protobuf_OneofOptions, OneofOptions__Output as _google_protobuf_OneofOptions__Output } from './google/protobuf/OneofOptions';
import type { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from './google/protobuf/ServiceDescriptorProto';
import type { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from './google/protobuf/ServiceOptions';
import type { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from './google/protobuf/SourceCodeInfo';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from './google/protobuf/UninterpretedOption';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from './google/protobuf/Value';
import type { HttpRoute as _yamcs_api_HttpRoute, HttpRoute__Output as _yamcs_api_HttpRoute__Output } from './yamcs/api/HttpRoute';
import type { WebSocketTopic as _yamcs_api_WebSocketTopic, WebSocketTopic__Output as _yamcs_api_WebSocketTopic__Output } from './yamcs/api/WebSocketTopic';
import type { ActionInfo as _yamcs_protobuf_actions_ActionInfo, ActionInfo__Output as _yamcs_protobuf_actions_ActionInfo__Output } from './yamcs/protobuf/actions/ActionInfo';
import type { OptionGroupInfo as _yamcs_protobuf_config_OptionGroupInfo, OptionGroupInfo__Output as _yamcs_protobuf_config_OptionGroupInfo__Output } from './yamcs/protobuf/config/OptionGroupInfo';
import type { OptionInfo as _yamcs_protobuf_config_OptionInfo, OptionInfo__Output as _yamcs_protobuf_config_OptionInfo__Output } from './yamcs/protobuf/config/OptionInfo';
import type { SpecInfo as _yamcs_protobuf_config_SpecInfo, SpecInfo__Output as _yamcs_protobuf_config_SpecInfo__Output } from './yamcs/protobuf/config/SpecInfo';
import type { WhenConditionInfo as _yamcs_protobuf_config_WhenConditionInfo, WhenConditionInfo__Output as _yamcs_protobuf_config_WhenConditionInfo__Output } from './yamcs/protobuf/config/WhenConditionInfo';
import type { CancelTransferRequest as _yamcs_protobuf_filetransfer_CancelTransferRequest, CancelTransferRequest__Output as _yamcs_protobuf_filetransfer_CancelTransferRequest__Output } from './yamcs/protobuf/filetransfer/CancelTransferRequest';
import type { CreateTransferRequest as _yamcs_protobuf_filetransfer_CreateTransferRequest, CreateTransferRequest__Output as _yamcs_protobuf_filetransfer_CreateTransferRequest__Output } from './yamcs/protobuf/filetransfer/CreateTransferRequest';
import type { EntityInfo as _yamcs_protobuf_filetransfer_EntityInfo, EntityInfo__Output as _yamcs_protobuf_filetransfer_EntityInfo__Output } from './yamcs/protobuf/filetransfer/EntityInfo';
import type { ExtraColumnInfo as _yamcs_protobuf_filetransfer_ExtraColumnInfo, ExtraColumnInfo__Output as _yamcs_protobuf_filetransfer_ExtraColumnInfo__Output } from './yamcs/protobuf/filetransfer/ExtraColumnInfo';
import type { FileTransferApiClient as _yamcs_protobuf_filetransfer_FileTransferApiClient, FileTransferApiDefinition as _yamcs_protobuf_filetransfer_FileTransferApiDefinition } from './yamcs/protobuf/filetransfer/FileTransferApi';
import type { FileTransferCapabilities as _yamcs_protobuf_filetransfer_FileTransferCapabilities, FileTransferCapabilities__Output as _yamcs_protobuf_filetransfer_FileTransferCapabilities__Output } from './yamcs/protobuf/filetransfer/FileTransferCapabilities';
import type { FileTransferOption as _yamcs_protobuf_filetransfer_FileTransferOption, FileTransferOption__Output as _yamcs_protobuf_filetransfer_FileTransferOption__Output } from './yamcs/protobuf/filetransfer/FileTransferOption';
import type { FileTransferServiceInfo as _yamcs_protobuf_filetransfer_FileTransferServiceInfo, FileTransferServiceInfo__Output as _yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output } from './yamcs/protobuf/filetransfer/FileTransferServiceInfo';
import type { GetFileTransferServiceRequest as _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, GetFileTransferServiceRequest__Output as _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest__Output } from './yamcs/protobuf/filetransfer/GetFileTransferServiceRequest';
import type { GetTransferRequest as _yamcs_protobuf_filetransfer_GetTransferRequest, GetTransferRequest__Output as _yamcs_protobuf_filetransfer_GetTransferRequest__Output } from './yamcs/protobuf/filetransfer/GetTransferRequest';
import type { ListFileTransferServicesRequest as _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, ListFileTransferServicesRequest__Output as _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest__Output } from './yamcs/protobuf/filetransfer/ListFileTransferServicesRequest';
import type { ListFileTransferServicesResponse as _yamcs_protobuf_filetransfer_ListFileTransferServicesResponse, ListFileTransferServicesResponse__Output as _yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output } from './yamcs/protobuf/filetransfer/ListFileTransferServicesResponse';
import type { ListFilesRequest as _yamcs_protobuf_filetransfer_ListFilesRequest, ListFilesRequest__Output as _yamcs_protobuf_filetransfer_ListFilesRequest__Output } from './yamcs/protobuf/filetransfer/ListFilesRequest';
import type { ListFilesResponse as _yamcs_protobuf_filetransfer_ListFilesResponse, ListFilesResponse__Output as _yamcs_protobuf_filetransfer_ListFilesResponse__Output } from './yamcs/protobuf/filetransfer/ListFilesResponse';
import type { ListTransfersRequest as _yamcs_protobuf_filetransfer_ListTransfersRequest, ListTransfersRequest__Output as _yamcs_protobuf_filetransfer_ListTransfersRequest__Output } from './yamcs/protobuf/filetransfer/ListTransfersRequest';
import type { ListTransfersResponse as _yamcs_protobuf_filetransfer_ListTransfersResponse, ListTransfersResponse__Output as _yamcs_protobuf_filetransfer_ListTransfersResponse__Output } from './yamcs/protobuf/filetransfer/ListTransfersResponse';
import type { PauseTransferRequest as _yamcs_protobuf_filetransfer_PauseTransferRequest, PauseTransferRequest__Output as _yamcs_protobuf_filetransfer_PauseTransferRequest__Output } from './yamcs/protobuf/filetransfer/PauseTransferRequest';
import type { RemoteFile as _yamcs_protobuf_filetransfer_RemoteFile, RemoteFile__Output as _yamcs_protobuf_filetransfer_RemoteFile__Output } from './yamcs/protobuf/filetransfer/RemoteFile';
import type { ResumeTransferRequest as _yamcs_protobuf_filetransfer_ResumeTransferRequest, ResumeTransferRequest__Output as _yamcs_protobuf_filetransfer_ResumeTransferRequest__Output } from './yamcs/protobuf/filetransfer/ResumeTransferRequest';
import type { RunFileActionRequest as _yamcs_protobuf_filetransfer_RunFileActionRequest, RunFileActionRequest__Output as _yamcs_protobuf_filetransfer_RunFileActionRequest__Output } from './yamcs/protobuf/filetransfer/RunFileActionRequest';
import type { SubscribeTransfersRequest as _yamcs_protobuf_filetransfer_SubscribeTransfersRequest, SubscribeTransfersRequest__Output as _yamcs_protobuf_filetransfer_SubscribeTransfersRequest__Output } from './yamcs/protobuf/filetransfer/SubscribeTransfersRequest';
import type { TransactionId as _yamcs_protobuf_filetransfer_TransactionId, TransactionId__Output as _yamcs_protobuf_filetransfer_TransactionId__Output } from './yamcs/protobuf/filetransfer/TransactionId';
import type { TransferInfo as _yamcs_protobuf_filetransfer_TransferInfo, TransferInfo__Output as _yamcs_protobuf_filetransfer_TransferInfo__Output } from './yamcs/protobuf/filetransfer/TransferInfo';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      DescriptorProto: MessageTypeDefinition<_google_protobuf_DescriptorProto, _google_protobuf_DescriptorProto__Output>
      Edition: EnumTypeDefinition
      Empty: MessageTypeDefinition<_google_protobuf_Empty, _google_protobuf_Empty__Output>
      EnumDescriptorProto: MessageTypeDefinition<_google_protobuf_EnumDescriptorProto, _google_protobuf_EnumDescriptorProto__Output>
      EnumOptions: MessageTypeDefinition<_google_protobuf_EnumOptions, _google_protobuf_EnumOptions__Output>
      EnumValueDescriptorProto: MessageTypeDefinition<_google_protobuf_EnumValueDescriptorProto, _google_protobuf_EnumValueDescriptorProto__Output>
      EnumValueOptions: MessageTypeDefinition<_google_protobuf_EnumValueOptions, _google_protobuf_EnumValueOptions__Output>
      ExtensionRangeOptions: MessageTypeDefinition<_google_protobuf_ExtensionRangeOptions, _google_protobuf_ExtensionRangeOptions__Output>
      FeatureSet: MessageTypeDefinition<_google_protobuf_FeatureSet, _google_protobuf_FeatureSet__Output>
      FeatureSetDefaults: MessageTypeDefinition<_google_protobuf_FeatureSetDefaults, _google_protobuf_FeatureSetDefaults__Output>
      FieldDescriptorProto: MessageTypeDefinition<_google_protobuf_FieldDescriptorProto, _google_protobuf_FieldDescriptorProto__Output>
      FieldOptions: MessageTypeDefinition<_google_protobuf_FieldOptions, _google_protobuf_FieldOptions__Output>
      FileDescriptorProto: MessageTypeDefinition<_google_protobuf_FileDescriptorProto, _google_protobuf_FileDescriptorProto__Output>
      FileDescriptorSet: MessageTypeDefinition<_google_protobuf_FileDescriptorSet, _google_protobuf_FileDescriptorSet__Output>
      FileOptions: MessageTypeDefinition<_google_protobuf_FileOptions, _google_protobuf_FileOptions__Output>
      GeneratedCodeInfo: MessageTypeDefinition<_google_protobuf_GeneratedCodeInfo, _google_protobuf_GeneratedCodeInfo__Output>
      ListValue: MessageTypeDefinition<_google_protobuf_ListValue, _google_protobuf_ListValue__Output>
      MessageOptions: MessageTypeDefinition<_google_protobuf_MessageOptions, _google_protobuf_MessageOptions__Output>
      MethodDescriptorProto: MessageTypeDefinition<_google_protobuf_MethodDescriptorProto, _google_protobuf_MethodDescriptorProto__Output>
      MethodOptions: MessageTypeDefinition<_google_protobuf_MethodOptions, _google_protobuf_MethodOptions__Output>
      NullValue: EnumTypeDefinition
      OneofDescriptorProto: MessageTypeDefinition<_google_protobuf_OneofDescriptorProto, _google_protobuf_OneofDescriptorProto__Output>
      OneofOptions: MessageTypeDefinition<_google_protobuf_OneofOptions, _google_protobuf_OneofOptions__Output>
      ServiceDescriptorProto: MessageTypeDefinition<_google_protobuf_ServiceDescriptorProto, _google_protobuf_ServiceDescriptorProto__Output>
      ServiceOptions: MessageTypeDefinition<_google_protobuf_ServiceOptions, _google_protobuf_ServiceOptions__Output>
      SourceCodeInfo: MessageTypeDefinition<_google_protobuf_SourceCodeInfo, _google_protobuf_SourceCodeInfo__Output>
      Struct: MessageTypeDefinition<_google_protobuf_Struct, _google_protobuf_Struct__Output>
      SymbolVisibility: EnumTypeDefinition
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
      UninterpretedOption: MessageTypeDefinition<_google_protobuf_UninterpretedOption, _google_protobuf_UninterpretedOption__Output>
      Value: MessageTypeDefinition<_google_protobuf_Value, _google_protobuf_Value__Output>
    }
  }
  yamcs: {
    api: {
      FieldBehavior: EnumTypeDefinition
      HttpRoute: MessageTypeDefinition<_yamcs_api_HttpRoute, _yamcs_api_HttpRoute__Output>
      WebSocketTopic: MessageTypeDefinition<_yamcs_api_WebSocketTopic, _yamcs_api_WebSocketTopic__Output>
    }
    protobuf: {
      actions: {
        ActionInfo: MessageTypeDefinition<_yamcs_protobuf_actions_ActionInfo, _yamcs_protobuf_actions_ActionInfo__Output>
      }
      config: {
        OptionGroupInfo: MessageTypeDefinition<_yamcs_protobuf_config_OptionGroupInfo, _yamcs_protobuf_config_OptionGroupInfo__Output>
        OptionInfo: MessageTypeDefinition<_yamcs_protobuf_config_OptionInfo, _yamcs_protobuf_config_OptionInfo__Output>
        OptionType: EnumTypeDefinition
        SpecInfo: MessageTypeDefinition<_yamcs_protobuf_config_SpecInfo, _yamcs_protobuf_config_SpecInfo__Output>
        WhenConditionInfo: MessageTypeDefinition<_yamcs_protobuf_config_WhenConditionInfo, _yamcs_protobuf_config_WhenConditionInfo__Output>
      }
      filetransfer: {
        CancelTransferRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_CancelTransferRequest, _yamcs_protobuf_filetransfer_CancelTransferRequest__Output>
        CreateTransferRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_CreateTransferRequest, _yamcs_protobuf_filetransfer_CreateTransferRequest__Output>
        EntityInfo: MessageTypeDefinition<_yamcs_protobuf_filetransfer_EntityInfo, _yamcs_protobuf_filetransfer_EntityInfo__Output>
        ExtraColumnInfo: MessageTypeDefinition<_yamcs_protobuf_filetransfer_ExtraColumnInfo, _yamcs_protobuf_filetransfer_ExtraColumnInfo__Output>
        FileTransferApi: SubtypeConstructor<typeof grpc.Client, _yamcs_protobuf_filetransfer_FileTransferApiClient> & { service: _yamcs_protobuf_filetransfer_FileTransferApiDefinition }
        FileTransferCapabilities: MessageTypeDefinition<_yamcs_protobuf_filetransfer_FileTransferCapabilities, _yamcs_protobuf_filetransfer_FileTransferCapabilities__Output>
        FileTransferOption: MessageTypeDefinition<_yamcs_protobuf_filetransfer_FileTransferOption, _yamcs_protobuf_filetransfer_FileTransferOption__Output>
        FileTransferServiceInfo: MessageTypeDefinition<_yamcs_protobuf_filetransfer_FileTransferServiceInfo, _yamcs_protobuf_filetransfer_FileTransferServiceInfo__Output>
        GetFileTransferServiceRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_GetFileTransferServiceRequest, _yamcs_protobuf_filetransfer_GetFileTransferServiceRequest__Output>
        GetTransferRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_GetTransferRequest, _yamcs_protobuf_filetransfer_GetTransferRequest__Output>
        ListFileTransferServicesRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_ListFileTransferServicesRequest, _yamcs_protobuf_filetransfer_ListFileTransferServicesRequest__Output>
        ListFileTransferServicesResponse: MessageTypeDefinition<_yamcs_protobuf_filetransfer_ListFileTransferServicesResponse, _yamcs_protobuf_filetransfer_ListFileTransferServicesResponse__Output>
        ListFilesRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_ListFilesRequest, _yamcs_protobuf_filetransfer_ListFilesRequest__Output>
        ListFilesResponse: MessageTypeDefinition<_yamcs_protobuf_filetransfer_ListFilesResponse, _yamcs_protobuf_filetransfer_ListFilesResponse__Output>
        ListTransfersRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_ListTransfersRequest, _yamcs_protobuf_filetransfer_ListTransfersRequest__Output>
        ListTransfersResponse: MessageTypeDefinition<_yamcs_protobuf_filetransfer_ListTransfersResponse, _yamcs_protobuf_filetransfer_ListTransfersResponse__Output>
        PauseTransferRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_PauseTransferRequest, _yamcs_protobuf_filetransfer_PauseTransferRequest__Output>
        RemoteFile: MessageTypeDefinition<_yamcs_protobuf_filetransfer_RemoteFile, _yamcs_protobuf_filetransfer_RemoteFile__Output>
        ResumeTransferRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_ResumeTransferRequest, _yamcs_protobuf_filetransfer_ResumeTransferRequest__Output>
        RunFileActionRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_RunFileActionRequest, _yamcs_protobuf_filetransfer_RunFileActionRequest__Output>
        SubscribeTransfersRequest: MessageTypeDefinition<_yamcs_protobuf_filetransfer_SubscribeTransfersRequest, _yamcs_protobuf_filetransfer_SubscribeTransfersRequest__Output>
        TransactionId: MessageTypeDefinition<_yamcs_protobuf_filetransfer_TransactionId, _yamcs_protobuf_filetransfer_TransactionId__Output>
        TransferDirection: EnumTypeDefinition
        TransferInfo: MessageTypeDefinition<_yamcs_protobuf_filetransfer_TransferInfo, _yamcs_protobuf_filetransfer_TransferInfo__Output>
        TransferState: EnumTypeDefinition
      }
    }
  }
}

