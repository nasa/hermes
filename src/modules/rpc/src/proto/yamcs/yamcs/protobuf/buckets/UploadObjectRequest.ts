// Original file: proto/yamcs/protobuf/buckets/buckets.proto

import type { HttpBody as _yamcs_api_HttpBody, HttpBody__Output as _yamcs_api_HttpBody__Output } from '../../../yamcs/api/HttpBody';

export interface UploadObjectRequest {
  'instance'?: (string);
  'bucketName'?: (string);
  'objectName'?: (string);
  'data'?: (_yamcs_api_HttpBody | null);
}

export interface UploadObjectRequest__Output {
  'instance'?: (string);
  'bucketName'?: (string);
  'objectName'?: (string);
  'data'?: (_yamcs_api_HttpBody__Output);
}
