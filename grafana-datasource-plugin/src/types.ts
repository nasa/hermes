import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export type QueryType = 'telemetry' | 'events' | 'raw';
export type TimeField = 'generation_time' | 'acquisition_time';
export type Aggregation = 'avg' | 'min' | 'max' | 'count' | 'first' | 'last' | 'sum' | 'deriv' | 'raw' | 'latest';

// A YAMCS parameter, named by its space system (e.g. /Ref_Ref/Ref/systemResources)
// and its name within that space system.
export interface ParameterRef {
  spaceSystem: string;
  name: string;
  raw?: never;
}

export interface ParameterExpression {
  raw: string;
  spaceSystem?: never;
  name?: never;
}  // Raw is included for template variable queries as they may not yet be matchable

export type ParameterQuery = ParameterRef | ParameterExpression;

// One member of a YAMCS parameter.
export interface MemberRef {
  spaceSystem: string;
  parameter: string;
  member: string;  // member path, e.g. .x or [0]; '' when the parameter is not a struct or array
}

export interface TransformRef {
  spaceSystem: string;
  parameter: string;
  member?: string;  // if undefined, transform applies to the whole parameter
  expr: string;     // value expression; may be '' when only a name override is set
  name?: string;    // display-name override for the series (literal text)
}

export interface MyQuery extends DataQuery {
  queryType: QueryType;
  parameters: ParameterQuery[];
  instances: string[];  // YAMCS instances
  members: MemberRef[];
  timeField?: TimeField;
  timeOverrideFrom?: string;
  timeOverrideTo?: string;
  aggregation: Aggregation;
  transforms?: TransformRef[];
  rawSql?: string;
}

export type ResolvedQuery = Omit<MyQuery, 'parameters'> & { parameters: ParameterRef[] };

export const DEFAULT_QUERY: Partial<MyQuery> = { queryType: 'telemetry', parameters: [], instances: [], members: [], transforms: [], timeField: 'generation_time', aggregation: 'avg' };

// A query saved before the YAMCS names has no parameters, instances or members,
// so we give it empty lists and it opens with nothing picked. Its transforms still
// use the old field names, so they match no parameter and the first pick drops them.
export function withDefaults(query: MyQuery): MyQuery {
  return {
    ...query,
    queryType: query.queryType ?? DEFAULT_QUERY.queryType!,
    timeField: query.timeField ?? DEFAULT_QUERY.timeField!,
    aggregation: query.aggregation ?? DEFAULT_QUERY.aggregation!,
    parameters: query.parameters ?? [],
    instances: query.instances ?? [],
    members: query.members ?? [],
    transforms: query.transforms ?? [],
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
