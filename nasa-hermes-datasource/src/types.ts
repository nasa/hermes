import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export type QueryType = 'telemetry' | 'events';
export type TimeField = 'time' | 'ert';
export type Aggregation = 'avg' | 'min' | 'max' | 'count';

export interface ChannelRef {
  component: string;
  name: string;
}

export interface KeyRef {
  component: string;
  channel: string;
  key: string;
}

export interface MyQuery extends DataQuery {
  queryType: QueryType;
  channels: ChannelRef[];
  sources: string[];
  keys: KeyRef[];
  timeField?: TimeField;
  timeOverrideFrom?: string;
  timeOverrideTo?: string;
  aggregation: Aggregation;
}

export const DEFAULT_QUERY: Partial<MyQuery> = { queryType: 'telemetry', channels: [], sources: [], keys: [], timeField: 'time', aggregation: 'avg' };

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  host?: string;
  user?: string;
  database?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  password?: string;
}
