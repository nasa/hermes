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
import type { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from './google/protobuf/MessageOptions';
import type { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from './google/protobuf/MethodDescriptorProto';
import type { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from './google/protobuf/MethodOptions';
import type { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from './google/protobuf/OneofDescriptorProto';
import type { OneofOptions as _google_protobuf_OneofOptions, OneofOptions__Output as _google_protobuf_OneofOptions__Output } from './google/protobuf/OneofOptions';
import type { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from './google/protobuf/ServiceDescriptorProto';
import type { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from './google/protobuf/ServiceOptions';
import type { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from './google/protobuf/SourceCodeInfo';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from './google/protobuf/UninterpretedOption';
import type { HttpBody as _yamcs_api_HttpBody, HttpBody__Output as _yamcs_api_HttpBody__Output } from './yamcs/api/HttpBody';
import type { HttpRoute as _yamcs_api_HttpRoute, HttpRoute__Output as _yamcs_api_HttpRoute__Output } from './yamcs/api/HttpRoute';
import type { WebSocketTopic as _yamcs_api_WebSocketTopic, WebSocketTopic__Output as _yamcs_api_WebSocketTopic__Output } from './yamcs/api/WebSocketTopic';
import type { BucketInfo as _yamcs_protobuf_buckets_BucketInfo, BucketInfo__Output as _yamcs_protobuf_buckets_BucketInfo__Output } from './yamcs/protobuf/buckets/BucketInfo';
import type { BucketLocation as _yamcs_protobuf_buckets_BucketLocation, BucketLocation__Output as _yamcs_protobuf_buckets_BucketLocation__Output } from './yamcs/protobuf/buckets/BucketLocation';
import type { BucketsApiClient as _yamcs_protobuf_buckets_BucketsApiClient, BucketsApiDefinition as _yamcs_protobuf_buckets_BucketsApiDefinition } from './yamcs/protobuf/buckets/BucketsApi';
import type { CreateBucketRequest as _yamcs_protobuf_buckets_CreateBucketRequest, CreateBucketRequest__Output as _yamcs_protobuf_buckets_CreateBucketRequest__Output } from './yamcs/protobuf/buckets/CreateBucketRequest';
import type { DeleteBucketRequest as _yamcs_protobuf_buckets_DeleteBucketRequest, DeleteBucketRequest__Output as _yamcs_protobuf_buckets_DeleteBucketRequest__Output } from './yamcs/protobuf/buckets/DeleteBucketRequest';
import type { DeleteObjectRequest as _yamcs_protobuf_buckets_DeleteObjectRequest, DeleteObjectRequest__Output as _yamcs_protobuf_buckets_DeleteObjectRequest__Output } from './yamcs/protobuf/buckets/DeleteObjectRequest';
import type { GetBucketRequest as _yamcs_protobuf_buckets_GetBucketRequest, GetBucketRequest__Output as _yamcs_protobuf_buckets_GetBucketRequest__Output } from './yamcs/protobuf/buckets/GetBucketRequest';
import type { GetObjectInfoRequest as _yamcs_protobuf_buckets_GetObjectInfoRequest, GetObjectInfoRequest__Output as _yamcs_protobuf_buckets_GetObjectInfoRequest__Output } from './yamcs/protobuf/buckets/GetObjectInfoRequest';
import type { GetObjectRequest as _yamcs_protobuf_buckets_GetObjectRequest, GetObjectRequest__Output as _yamcs_protobuf_buckets_GetObjectRequest__Output } from './yamcs/protobuf/buckets/GetObjectRequest';
import type { ListBucketsRequest as _yamcs_protobuf_buckets_ListBucketsRequest, ListBucketsRequest__Output as _yamcs_protobuf_buckets_ListBucketsRequest__Output } from './yamcs/protobuf/buckets/ListBucketsRequest';
import type { ListBucketsResponse as _yamcs_protobuf_buckets_ListBucketsResponse, ListBucketsResponse__Output as _yamcs_protobuf_buckets_ListBucketsResponse__Output } from './yamcs/protobuf/buckets/ListBucketsResponse';
import type { ListObjectsRequest as _yamcs_protobuf_buckets_ListObjectsRequest, ListObjectsRequest__Output as _yamcs_protobuf_buckets_ListObjectsRequest__Output } from './yamcs/protobuf/buckets/ListObjectsRequest';
import type { ListObjectsResponse as _yamcs_protobuf_buckets_ListObjectsResponse, ListObjectsResponse__Output as _yamcs_protobuf_buckets_ListObjectsResponse__Output } from './yamcs/protobuf/buckets/ListObjectsResponse';
import type { ObjectInfo as _yamcs_protobuf_buckets_ObjectInfo, ObjectInfo__Output as _yamcs_protobuf_buckets_ObjectInfo__Output } from './yamcs/protobuf/buckets/ObjectInfo';
import type { UploadObjectRequest as _yamcs_protobuf_buckets_UploadObjectRequest, UploadObjectRequest__Output as _yamcs_protobuf_buckets_UploadObjectRequest__Output } from './yamcs/protobuf/buckets/UploadObjectRequest';

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
      MessageOptions: MessageTypeDefinition<_google_protobuf_MessageOptions, _google_protobuf_MessageOptions__Output>
      MethodDescriptorProto: MessageTypeDefinition<_google_protobuf_MethodDescriptorProto, _google_protobuf_MethodDescriptorProto__Output>
      MethodOptions: MessageTypeDefinition<_google_protobuf_MethodOptions, _google_protobuf_MethodOptions__Output>
      OneofDescriptorProto: MessageTypeDefinition<_google_protobuf_OneofDescriptorProto, _google_protobuf_OneofDescriptorProto__Output>
      OneofOptions: MessageTypeDefinition<_google_protobuf_OneofOptions, _google_protobuf_OneofOptions__Output>
      ServiceDescriptorProto: MessageTypeDefinition<_google_protobuf_ServiceDescriptorProto, _google_protobuf_ServiceDescriptorProto__Output>
      ServiceOptions: MessageTypeDefinition<_google_protobuf_ServiceOptions, _google_protobuf_ServiceOptions__Output>
      SourceCodeInfo: MessageTypeDefinition<_google_protobuf_SourceCodeInfo, _google_protobuf_SourceCodeInfo__Output>
      SymbolVisibility: EnumTypeDefinition
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
      UninterpretedOption: MessageTypeDefinition<_google_protobuf_UninterpretedOption, _google_protobuf_UninterpretedOption__Output>
    }
  }
  yamcs: {
    api: {
      FieldBehavior: EnumTypeDefinition
      HttpBody: MessageTypeDefinition<_yamcs_api_HttpBody, _yamcs_api_HttpBody__Output>
      HttpRoute: MessageTypeDefinition<_yamcs_api_HttpRoute, _yamcs_api_HttpRoute__Output>
      WebSocketTopic: MessageTypeDefinition<_yamcs_api_WebSocketTopic, _yamcs_api_WebSocketTopic__Output>
    }
    protobuf: {
      buckets: {
        BucketInfo: MessageTypeDefinition<_yamcs_protobuf_buckets_BucketInfo, _yamcs_protobuf_buckets_BucketInfo__Output>
        BucketLocation: MessageTypeDefinition<_yamcs_protobuf_buckets_BucketLocation, _yamcs_protobuf_buckets_BucketLocation__Output>
        BucketsApi: SubtypeConstructor<typeof grpc.Client, _yamcs_protobuf_buckets_BucketsApiClient> & { service: _yamcs_protobuf_buckets_BucketsApiDefinition }
        CreateBucketRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_CreateBucketRequest, _yamcs_protobuf_buckets_CreateBucketRequest__Output>
        DeleteBucketRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_DeleteBucketRequest, _yamcs_protobuf_buckets_DeleteBucketRequest__Output>
        DeleteObjectRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_DeleteObjectRequest, _yamcs_protobuf_buckets_DeleteObjectRequest__Output>
        GetBucketRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_GetBucketRequest, _yamcs_protobuf_buckets_GetBucketRequest__Output>
        GetObjectInfoRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_GetObjectInfoRequest, _yamcs_protobuf_buckets_GetObjectInfoRequest__Output>
        GetObjectRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_GetObjectRequest, _yamcs_protobuf_buckets_GetObjectRequest__Output>
        ListBucketsRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_ListBucketsRequest, _yamcs_protobuf_buckets_ListBucketsRequest__Output>
        ListBucketsResponse: MessageTypeDefinition<_yamcs_protobuf_buckets_ListBucketsResponse, _yamcs_protobuf_buckets_ListBucketsResponse__Output>
        ListObjectsRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_ListObjectsRequest, _yamcs_protobuf_buckets_ListObjectsRequest__Output>
        ListObjectsResponse: MessageTypeDefinition<_yamcs_protobuf_buckets_ListObjectsResponse, _yamcs_protobuf_buckets_ListObjectsResponse__Output>
        ObjectInfo: MessageTypeDefinition<_yamcs_protobuf_buckets_ObjectInfo, _yamcs_protobuf_buckets_ObjectInfo__Output>
        UploadObjectRequest: MessageTypeDefinition<_yamcs_protobuf_buckets_UploadObjectRequest, _yamcs_protobuf_buckets_UploadObjectRequest__Output>
      }
    }
  }
}

