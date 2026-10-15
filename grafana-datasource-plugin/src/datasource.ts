import { DataQueryRequest, DataSourceInstanceSettings, CoreApp, ScopedVars } from '@grafana/data';
import { DataSourceWithBackend, getTemplateSrv } from '@grafana/runtime';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY, MemberRef, ParameterQuery, ParameterRef, ResolvedQuery, withDefaults } from './types';
import { aliasForLabels, buildQuery, resolveParameters, resolveQuery } from 'query';

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
  private knownParameters?: Promise<ParameterRef[]>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  // Fetch (and cache) the known parameter list.
  private getKnownParameters(): Promise<ParameterRef[]> {
    if (!this.knownParameters) {
      this.knownParameters = this.getParameters().catch(() => []);
    }
    return this.knownParameters;
  }

  query(request: DataQueryRequest<MyQuery>) {
    const needsParameters = request.targets.some((t) =>
      (t.parameters ?? []).some((p) => p.raw !== undefined)
    );
    const known$ = from(needsParameters ? this.getKnownParameters() : Promise.resolve<ParameterRef[]>([]));

    return known$.pipe(
      switchMap((known) => {
        request.targets.forEach((target) => {
          const resolved = this.resolveTargetVariables(withDefaults(target), request.scopedVars, known);
          Object.assign(target, resolved);

          if (!target.rawSql) {
            target.rawSql = buildQuery(resolved, request);
          }
        });

        return super.query(request);
      }),
      map((response) => {
        for (const result of response.data) {
          const query = request.targets.find((t) => t.refId === result.refId);
          if (query?.queryType === 'telemetry' && query.transforms?.some((t) => t.name)) {
            applySeriesAliases(result, query as ResolvedQuery);
          }
        }
        return response;
      })
    );
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  private resolveTargetVariables(query: MyQuery, scopedVars: ScopedVars, known: ParameterRef[] = []): ResolvedQuery {
    const templateSrv = getTemplateSrv();
    // We pass $__interval and $__interval_ms through as written so the backend can expand them. Leaving them out of
    // scopedVars is not enough, since dashboards then fill in the previous run's interval, like 10s.
    const vars = {
      ...scopedVars,
      __interval: { text: '$__interval', value: '$__interval' },
      __interval_ms: { text: '$__interval_ms', value: '$__interval_ms' },
    };
    const replace = (value: string) => templateSrv.replace(value, vars);
    return resolveQuery(query, replace, known);
  }

  filterQuery(query: MyQuery): boolean {
    if (query.rawSql) {
      return true;
    }

    return !!(query.parameters && query.parameters.length);
  }

  // Telemetry resources
  async getParameters(): Promise<ParameterRef[]> {
    return this.getResource('telemetry/parameters');
  }

  async getInstances(): Promise<string[]> {
    return this.getResource('telemetry/instances');
  }

  async getMembers(parameters: ParameterQuery[]): Promise<MemberRef[]> {
    const templateSrv = getTemplateSrv();
    const known = parameters.some((p) => p.raw !== undefined) ? await this.getKnownParameters() : [];
    const expanded = resolveParameters(parameters, (value) => templateSrv.replace(value), known);
    return this.postResource('telemetry/members', expanded);
  }

}

// Handle value transform overrides to the datasource "auto name"; purposefully loses to panel override
function applySeriesAliases(frame: { fields: any[] }, query: ResolvedQuery): void {
  for (const field of frame.fields) {
    const labels = field.labels as Record<string, string> | undefined;
    if (!labels) {
      continue;
    }
    const alias = aliasForLabels(query, {
      space_system: labels.space_system,
      parameter: labels.parameter,
      member: labels.member,
    });
    if (alias) {
      field.config = { ...(field.config ?? {}), displayNameFromDS: alias };
    }
  }
}
