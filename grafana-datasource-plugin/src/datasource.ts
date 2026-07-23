import { DataQueryRequest, DataSourceInstanceSettings, CoreApp, ScopedVars } from '@grafana/data';
import { DataSourceWithBackend, getTemplateSrv } from '@grafana/runtime';
import { map } from 'rxjs/operators';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY, ChannelRef, KeyRef, withDefaults } from './types';
import { buildQuery } from 'query';

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  query(request: DataQueryRequest<MyQuery>) {
    // Build raw SQL for each target if not already provided
    request.targets.forEach((target) => {
      const filled = withDefaults(target);
      Object.assign(target, filled);
      if (!target.rawSql) {
        target.rawSql = buildQuery(target, request);
      }
    });

    return super.query(request).pipe(
      map((response) => {
        for (const result of response.data) {
          const query = request.targets.find((t) => t.refId === result.refId);
          if (query?.queryType === 'events' && query.sources?.length) {
            result.fields = result.fields.filter((f: { name: string }) => f.name !== 'source');
          }
        }
        return response;
      })
    );
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  applyTemplateVariables(query: MyQuery, scopedVars: ScopedVars) {
    const templateSrv = getTemplateSrv();
    return {
      ...query,
      channels: query.channels?.map(ch => ({
        component: templateSrv.replace(ch.component, scopedVars),
        name: templateSrv.replace(ch.name, scopedVars),
      })) ?? [],
      sources: query.sources?.map(s => templateSrv.replace(s, scopedVars)) ?? [],
      keys: query.keys?.map(k => ({
        component: templateSrv.replace(k.component, scopedVars),
        channel: templateSrv.replace(k.channel, scopedVars),
        key: templateSrv.replace(k.key, scopedVars),
      })) ?? [],
    };
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

  async getKeys(channels: ChannelRef[]): Promise<KeyRef[]> {
    const components = [...new Set(channels.map(ch => ch.component))];
    const names = channels.map(ch => ch.name);
    return this.getResource('telemetry/keys', { components, channels: names });
  }

  async getEventSources(): Promise<string[]> {
    return this.getResource('events/sources');
  }
}
