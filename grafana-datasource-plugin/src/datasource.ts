import { DataQueryRequest, DataSourceInstanceSettings, CoreApp, ScopedVars } from '@grafana/data';
import { DataSourceWithBackend, getTemplateSrv } from '@grafana/runtime';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY, ChannelQuery, ChannelRef, KeyRef, ResolvedQuery, withDefaults } from './types';
import { aliasForLabels, buildQuery, resolveChannels, resolveQuery } from 'query';

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
  private knownChannels?: Promise<ChannelRef[]>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  // Fetch (and cache) the known channel list.
  private getKnownChannels(): Promise<ChannelRef[]> {
    if (!this.knownChannels) {
      this.knownChannels = this.getChannels().catch(() => []);
    }
    return this.knownChannels;
  }

  query(request: DataQueryRequest<MyQuery>) {
    const needsChannels = request.targets.some((t) =>
      (t.channels ?? []).some((c) => c.raw !== undefined)
    );
    const known$ = from(needsChannels ? this.getKnownChannels() : Promise.resolve<ChannelRef[]>([]));

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
          if (query?.queryType === 'events' && query.sources?.length) {
            result.fields = result.fields.filter((f: { name: string }) => f.name !== 'source');
          }
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

  private resolveTargetVariables(query: MyQuery, scopedVars: ScopedVars, known: ChannelRef[] = []): ResolvedQuery {
    const templateSrv = getTemplateSrv();
    const replace = (value: string) => templateSrv.replace(value, scopedVars);
    return resolveQuery(query, replace, known);
  }

  filterQuery(query: MyQuery): boolean {
    if (query.rawSql) {
      return true;
    }

    if (query.queryType === 'events') {
      return true;
    }

    return !!(query.channels && query.channels.length);
  }

  // Telemetry resources
  async getChannels(): Promise<ChannelRef[]> {
    return this.getResource('telemetry/channels');
  }

  async getSources(): Promise<string[]> {
    return this.getResource('telemetry/sources');
  }

  async getKeys(channels: ChannelQuery[]): Promise<KeyRef[]> {
    const templateSrv = getTemplateSrv();
    const known = channels.some((c) => c.raw !== undefined) ? await this.getKnownChannels() : [];
    const expanded = resolveChannels(channels, (value) => templateSrv.replace(value), known);
    const components = [...new Set(expanded.map((ch) => ch.component))];
    const names = expanded.map((ch) => ch.name);
    return this.getResource('telemetry/keys', { components, channels: names });
  }

  async getEventSources(): Promise<string[]> {
    return this.getResource('events/sources');
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
      component: labels.component,
      channel: labels.channel,
      key: labels.key,
    });
    if (alias) {
      field.config = { ...(field.config ?? {}), displayNameFromDS: alias };
    }
  }
}
