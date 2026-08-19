import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export type QueryType = 'telemetry' | 'events' | 'raw';
export type TimeField = 'time' | 'ert';
export type Aggregation = 'avg' | 'min' | 'max' | 'count' | 'first' | 'last' | 'sum' | 'deriv' | 'raw' | 'latest';

export interface ChannelRef {
  component: string;
  name: string;
  raw?: never;
}

export interface ChannelExpression {
  raw: string;
  component?: never;
  name?: never;
}  // Raw is included for template variable queries as they may not yet be matchable

export type ChannelQuery = ChannelRef | ChannelExpression;

export interface KeyRef {
  component: string;
  channel: string;
  key: string;
}

export interface TransformRef {
  component: string;
  channel: string;
  targetKey?: string;  // if undefined, transform applies to the whole channel
  expr: string;
}

export interface MyQuery extends DataQuery {
  queryType: QueryType;
  channels: ChannelQuery[];
  sources: string[];
  keys: KeyRef[];
  timeField?: TimeField;
  timeOverrideFrom?: string;
  timeOverrideTo?: string;
  aggregation: Aggregation;
  transforms?: TransformRef[];
  rawSql?: string;
}

export type ResolvedQuery = Omit<MyQuery, 'channels'> & { channels: ChannelRef[] };

export const DEFAULT_QUERY: Partial<MyQuery> = { queryType: 'telemetry', channels: [], sources: [], keys: [], transforms: [], timeField: 'ert', aggregation: 'avg' };

export function withDefaults(query: MyQuery): MyQuery {
  return {
    ...query,
    queryType: query.queryType ?? DEFAULT_QUERY.queryType!,
    timeField: query.timeField ?? DEFAULT_QUERY.timeField!,
    aggregation: query.aggregation ?? DEFAULT_QUERY.aggregation!,
  };
}

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
