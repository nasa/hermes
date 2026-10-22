// Original file: proto/yamcs/protobuf/buckets/buckets.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BucketInfo as _yamcs_protobuf_buckets_BucketInfo, BucketInfo__Output as _yamcs_protobuf_buckets_BucketInfo__Output } from '../../../yamcs/protobuf/buckets/BucketInfo';
import type { CreateBucketRequest as _yamcs_protobuf_buckets_CreateBucketRequest, CreateBucketRequest__Output as _yamcs_protobuf_buckets_CreateBucketRequest__Output } from '../../../yamcs/protobuf/buckets/CreateBucketRequest';
import type { DeleteBucketRequest as _yamcs_protobuf_buckets_DeleteBucketRequest, DeleteBucketRequest__Output as _yamcs_protobuf_buckets_DeleteBucketRequest__Output } from '../../../yamcs/protobuf/buckets/DeleteBucketRequest';
import type { DeleteObjectRequest as _yamcs_protobuf_buckets_DeleteObjectRequest, DeleteObjectRequest__Output as _yamcs_protobuf_buckets_DeleteObjectRequest__Output } from '../../../yamcs/protobuf/buckets/DeleteObjectRequest';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../google/protobuf/Empty';
import type { GetBucketRequest as _yamcs_protobuf_buckets_GetBucketRequest, GetBucketRequest__Output as _yamcs_protobuf_buckets_GetBucketRequest__Output } from '../../../yamcs/protobuf/buckets/GetBucketRequest';
import type { GetObjectInfoRequest as _yamcs_protobuf_buckets_GetObjectInfoRequest, GetObjectInfoRequest__Output as _yamcs_protobuf_buckets_GetObjectInfoRequest__Output } from '../../../yamcs/protobuf/buckets/GetObjectInfoRequest';
import type { GetObjectRequest as _yamcs_protobuf_buckets_GetObjectRequest, GetObjectRequest__Output as _yamcs_protobuf_buckets_GetObjectRequest__Output } from '../../../yamcs/protobuf/buckets/GetObjectRequest';
import type { HttpBody as _yamcs_api_HttpBody, HttpBody__Output as _yamcs_api_HttpBody__Output } from '../../../yamcs/api/HttpBody';
import type { ListBucketsRequest as _yamcs_protobuf_buckets_ListBucketsRequest, ListBucketsRequest__Output as _yamcs_protobuf_buckets_ListBucketsRequest__Output } from '../../../yamcs/protobuf/buckets/ListBucketsRequest';
import type { ListBucketsResponse as _yamcs_protobuf_buckets_ListBucketsResponse, ListBucketsResponse__Output as _yamcs_protobuf_buckets_ListBucketsResponse__Output } from '../../../yamcs/protobuf/buckets/ListBucketsResponse';
import type { ListObjectsRequest as _yamcs_protobuf_buckets_ListObjectsRequest, ListObjectsRequest__Output as _yamcs_protobuf_buckets_ListObjectsRequest__Output } from '../../../yamcs/protobuf/buckets/ListObjectsRequest';
import type { ListObjectsResponse as _yamcs_protobuf_buckets_ListObjectsResponse, ListObjectsResponse__Output as _yamcs_protobuf_buckets_ListObjectsResponse__Output } from '../../../yamcs/protobuf/buckets/ListObjectsResponse';
import type { ObjectInfo as _yamcs_protobuf_buckets_ObjectInfo, ObjectInfo__Output as _yamcs_protobuf_buckets_ObjectInfo__Output } from '../../../yamcs/protobuf/buckets/ObjectInfo';
import type { UploadObjectRequest as _yamcs_protobuf_buckets_UploadObjectRequest, UploadObjectRequest__Output as _yamcs_protobuf_buckets_UploadObjectRequest__Output } from '../../../yamcs/protobuf/buckets/UploadObjectRequest';

export interface BucketsApiClient extends grpc.Client {
  CreateBucket(argument: _yamcs_protobuf_buckets_CreateBucketRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  CreateBucket(argument: _yamcs_protobuf_buckets_CreateBucketRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  CreateBucket(argument: _yamcs_protobuf_buckets_CreateBucketRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  CreateBucket(argument: _yamcs_protobuf_buckets_CreateBucketRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  createBucket(argument: _yamcs_protobuf_buckets_CreateBucketRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  createBucket(argument: _yamcs_protobuf_buckets_CreateBucketRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  createBucket(argument: _yamcs_protobuf_buckets_CreateBucketRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  createBucket(argument: _yamcs_protobuf_buckets_CreateBucketRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  
  DeleteBucket(argument: _yamcs_protobuf_buckets_DeleteBucketRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteBucket(argument: _yamcs_protobuf_buckets_DeleteBucketRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteBucket(argument: _yamcs_protobuf_buckets_DeleteBucketRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteBucket(argument: _yamcs_protobuf_buckets_DeleteBucketRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteBucket(argument: _yamcs_protobuf_buckets_DeleteBucketRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteBucket(argument: _yamcs_protobuf_buckets_DeleteBucketRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteBucket(argument: _yamcs_protobuf_buckets_DeleteBucketRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteBucket(argument: _yamcs_protobuf_buckets_DeleteBucketRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  DeleteObject(argument: _yamcs_protobuf_buckets_DeleteObjectRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteObject(argument: _yamcs_protobuf_buckets_DeleteObjectRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteObject(argument: _yamcs_protobuf_buckets_DeleteObjectRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  DeleteObject(argument: _yamcs_protobuf_buckets_DeleteObjectRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteObject(argument: _yamcs_protobuf_buckets_DeleteObjectRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteObject(argument: _yamcs_protobuf_buckets_DeleteObjectRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteObject(argument: _yamcs_protobuf_buckets_DeleteObjectRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  deleteObject(argument: _yamcs_protobuf_buckets_DeleteObjectRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  GetBucket(argument: _yamcs_protobuf_buckets_GetBucketRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  GetBucket(argument: _yamcs_protobuf_buckets_GetBucketRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  GetBucket(argument: _yamcs_protobuf_buckets_GetBucketRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  GetBucket(argument: _yamcs_protobuf_buckets_GetBucketRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  getBucket(argument: _yamcs_protobuf_buckets_GetBucketRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  getBucket(argument: _yamcs_protobuf_buckets_GetBucketRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  getBucket(argument: _yamcs_protobuf_buckets_GetBucketRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  getBucket(argument: _yamcs_protobuf_buckets_GetBucketRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_BucketInfo__Output>): grpc.ClientUnaryCall;
  
  GetObject(argument: _yamcs_protobuf_buckets_GetObjectRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  GetObject(argument: _yamcs_protobuf_buckets_GetObjectRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  GetObject(argument: _yamcs_protobuf_buckets_GetObjectRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  GetObject(argument: _yamcs_protobuf_buckets_GetObjectRequest, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  getObject(argument: _yamcs_protobuf_buckets_GetObjectRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  getObject(argument: _yamcs_protobuf_buckets_GetObjectRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  getObject(argument: _yamcs_protobuf_buckets_GetObjectRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  getObject(argument: _yamcs_protobuf_buckets_GetObjectRequest, callback: grpc.requestCallback<_yamcs_api_HttpBody__Output>): grpc.ClientUnaryCall;
  
  GetObjectInfo(argument: _yamcs_protobuf_buckets_GetObjectInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ObjectInfo__Output>): grpc.ClientUnaryCall;
  GetObjectInfo(argument: _yamcs_protobuf_buckets_GetObjectInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ObjectInfo__Output>): grpc.ClientUnaryCall;
  GetObjectInfo(argument: _yamcs_protobuf_buckets_GetObjectInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ObjectInfo__Output>): grpc.ClientUnaryCall;
  GetObjectInfo(argument: _yamcs_protobuf_buckets_GetObjectInfoRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ObjectInfo__Output>): grpc.ClientUnaryCall;
  getObjectInfo(argument: _yamcs_protobuf_buckets_GetObjectInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ObjectInfo__Output>): grpc.ClientUnaryCall;
  getObjectInfo(argument: _yamcs_protobuf_buckets_GetObjectInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ObjectInfo__Output>): grpc.ClientUnaryCall;
  getObjectInfo(argument: _yamcs_protobuf_buckets_GetObjectInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ObjectInfo__Output>): grpc.ClientUnaryCall;
  getObjectInfo(argument: _yamcs_protobuf_buckets_GetObjectInfoRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ObjectInfo__Output>): grpc.ClientUnaryCall;
  
  ListBuckets(argument: _yamcs_protobuf_buckets_ListBucketsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListBucketsResponse__Output>): grpc.ClientUnaryCall;
  ListBuckets(argument: _yamcs_protobuf_buckets_ListBucketsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListBucketsResponse__Output>): grpc.ClientUnaryCall;
  ListBuckets(argument: _yamcs_protobuf_buckets_ListBucketsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListBucketsResponse__Output>): grpc.ClientUnaryCall;
  ListBuckets(argument: _yamcs_protobuf_buckets_ListBucketsRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListBucketsResponse__Output>): grpc.ClientUnaryCall;
  listBuckets(argument: _yamcs_protobuf_buckets_ListBucketsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListBucketsResponse__Output>): grpc.ClientUnaryCall;
  listBuckets(argument: _yamcs_protobuf_buckets_ListBucketsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListBucketsResponse__Output>): grpc.ClientUnaryCall;
  listBuckets(argument: _yamcs_protobuf_buckets_ListBucketsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListBucketsResponse__Output>): grpc.ClientUnaryCall;
  listBuckets(argument: _yamcs_protobuf_buckets_ListBucketsRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListBucketsResponse__Output>): grpc.ClientUnaryCall;
  
  ListObjects(argument: _yamcs_protobuf_buckets_ListObjectsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListObjectsResponse__Output>): grpc.ClientUnaryCall;
  ListObjects(argument: _yamcs_protobuf_buckets_ListObjectsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListObjectsResponse__Output>): grpc.ClientUnaryCall;
  ListObjects(argument: _yamcs_protobuf_buckets_ListObjectsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListObjectsResponse__Output>): grpc.ClientUnaryCall;
  ListObjects(argument: _yamcs_protobuf_buckets_ListObjectsRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListObjectsResponse__Output>): grpc.ClientUnaryCall;
  listObjects(argument: _yamcs_protobuf_buckets_ListObjectsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListObjectsResponse__Output>): grpc.ClientUnaryCall;
  listObjects(argument: _yamcs_protobuf_buckets_ListObjectsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListObjectsResponse__Output>): grpc.ClientUnaryCall;
  listObjects(argument: _yamcs_protobuf_buckets_ListObjectsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListObjectsResponse__Output>): grpc.ClientUnaryCall;
  listObjects(argument: _yamcs_protobuf_buckets_ListObjectsRequest, callback: grpc.requestCallback<_yamcs_protobuf_buckets_ListObjectsResponse__Output>): grpc.ClientUnaryCall;
  
  UploadObject(argument: _yamcs_protobuf_buckets_UploadObjectRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UploadObject(argument: _yamcs_protobuf_buckets_UploadObjectRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UploadObject(argument: _yamcs_protobuf_buckets_UploadObjectRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UploadObject(argument: _yamcs_protobuf_buckets_UploadObjectRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  uploadObject(argument: _yamcs_protobuf_buckets_UploadObjectRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  uploadObject(argument: _yamcs_protobuf_buckets_UploadObjectRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  uploadObject(argument: _yamcs_protobuf_buckets_UploadObjectRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  uploadObject(argument: _yamcs_protobuf_buckets_UploadObjectRequest, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
}

export interface BucketsApiHandlers extends grpc.UntypedServiceImplementation {
  CreateBucket: grpc.handleUnaryCall<_yamcs_protobuf_buckets_CreateBucketRequest__Output, _yamcs_protobuf_buckets_BucketInfo>;
  
  DeleteBucket: grpc.handleUnaryCall<_yamcs_protobuf_buckets_DeleteBucketRequest__Output, _google_protobuf_Empty>;
  
  DeleteObject: grpc.handleUnaryCall<_yamcs_protobuf_buckets_DeleteObjectRequest__Output, _google_protobuf_Empty>;
  
  GetBucket: grpc.handleUnaryCall<_yamcs_protobuf_buckets_GetBucketRequest__Output, _yamcs_protobuf_buckets_BucketInfo>;
  
  GetObject: grpc.handleUnaryCall<_yamcs_protobuf_buckets_GetObjectRequest__Output, _yamcs_api_HttpBody>;
  
  GetObjectInfo: grpc.handleUnaryCall<_yamcs_protobuf_buckets_GetObjectInfoRequest__Output, _yamcs_protobuf_buckets_ObjectInfo>;
  
  ListBuckets: grpc.handleUnaryCall<_yamcs_protobuf_buckets_ListBucketsRequest__Output, _yamcs_protobuf_buckets_ListBucketsResponse>;
  
  ListObjects: grpc.handleUnaryCall<_yamcs_protobuf_buckets_ListObjectsRequest__Output, _yamcs_protobuf_buckets_ListObjectsResponse>;
  
  UploadObject: grpc.handleUnaryCall<_yamcs_protobuf_buckets_UploadObjectRequest__Output, _google_protobuf_Empty>;
  
}

export interface BucketsApiDefinition extends grpc.ServiceDefinition {
  CreateBucket: MethodDefinition<_yamcs_protobuf_buckets_CreateBucketRequest, _yamcs_protobuf_buckets_BucketInfo, _yamcs_protobuf_buckets_CreateBucketRequest__Output, _yamcs_protobuf_buckets_BucketInfo__Output>
  DeleteBucket: MethodDefinition<_yamcs_protobuf_buckets_DeleteBucketRequest, _google_protobuf_Empty, _yamcs_protobuf_buckets_DeleteBucketRequest__Output, _google_protobuf_Empty__Output>
  DeleteObject: MethodDefinition<_yamcs_protobuf_buckets_DeleteObjectRequest, _google_protobuf_Empty, _yamcs_protobuf_buckets_DeleteObjectRequest__Output, _google_protobuf_Empty__Output>
  GetBucket: MethodDefinition<_yamcs_protobuf_buckets_GetBucketRequest, _yamcs_protobuf_buckets_BucketInfo, _yamcs_protobuf_buckets_GetBucketRequest__Output, _yamcs_protobuf_buckets_BucketInfo__Output>
  GetObject: MethodDefinition<_yamcs_protobuf_buckets_GetObjectRequest, _yamcs_api_HttpBody, _yamcs_protobuf_buckets_GetObjectRequest__Output, _yamcs_api_HttpBody__Output>
  GetObjectInfo: MethodDefinition<_yamcs_protobuf_buckets_GetObjectInfoRequest, _yamcs_protobuf_buckets_ObjectInfo, _yamcs_protobuf_buckets_GetObjectInfoRequest__Output, _yamcs_protobuf_buckets_ObjectInfo__Output>
  ListBuckets: MethodDefinition<_yamcs_protobuf_buckets_ListBucketsRequest, _yamcs_protobuf_buckets_ListBucketsResponse, _yamcs_protobuf_buckets_ListBucketsRequest__Output, _yamcs_protobuf_buckets_ListBucketsResponse__Output>
  ListObjects: MethodDefinition<_yamcs_protobuf_buckets_ListObjectsRequest, _yamcs_protobuf_buckets_ListObjectsResponse, _yamcs_protobuf_buckets_ListObjectsRequest__Output, _yamcs_protobuf_buckets_ListObjectsResponse__Output>
  UploadObject: MethodDefinition<_yamcs_protobuf_buckets_UploadObjectRequest, _google_protobuf_Empty, _yamcs_protobuf_buckets_UploadObjectRequest__Output, _google_protobuf_Empty__Output>
}
