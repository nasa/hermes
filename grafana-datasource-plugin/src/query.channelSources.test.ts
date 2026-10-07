import { buildTelemetryQuery, resolveChannels, resolveQuery } from './query';
import { ChannelRef, MyQuery, ResolvedQuery } from './types';

const channels: ChannelRef[] = [
  { component: 'CDH', name: 'Temperature', source: 'FSW-A' },
  { component: 'CDH', name: 'Temperature', source: 'FSW-B' },
];
const query: ResolvedQuery = {
  refId: 'A', queryType: 'telemetry', aggregation: 'raw', timeField: 'ert',
  channels, sources: [], keys: [],
};
const sql = (overrides: Partial<ResolvedQuery> = {}) =>
  buildTelemetryQuery({ ...query, ...overrides }, '2026-08-28T00:00:00Z', '2026-08-29T00:00:00Z');

it('preserves source identity during template resolution', () => {
  expect(resolveChannels(channels, value => value, [])).toEqual(channels);
  const templated: MyQuery = { ...query, channels: [{ component: '$component', name: 'Temperature', source: '$source' }] };
  expect(resolveQuery(templated, value => value.replace('$component', 'CDH').replace('$source', 'FSW-B')).channels)
    .toEqual([channels[1]]);
});

it('keeps legacy and unqualified template channels source-agnostic', () => {
  const legacy = { component: 'CDH', name: 'Temperature' };
  expect(resolveChannels([legacy], value => value, channels)).toStrictEqual([legacy]);
  expect(resolveChannels([{ raw: '$channel' }], () => 'CDH.Temperature', channels)).toStrictEqual([legacy]);
  expect(sql({ channels: [legacy] })).toContain("WHERE ((d.component = 'CDH' AND d.name = 'Temperature'))");
});

it('binds each source to its own channel instead of admitting cross-pairs', () => {
  const result = sql({ channels: [channels[0], { component: 'PWR', name: 'Voltage', source: 'FSW-B' }] });
  expect(result).toContain("(d.component = 'CDH' AND d.name = 'Temperature' AND t.source = 'FSW-A')");
  expect(result).toContain("OR (d.component = 'PWR' AND d.name = 'Voltage' AND t.source = 'FSW-B')");
  expect(result).not.toContain("d.name = 'Temperature' AND t.source = 'FSW-B'");
});

it('allows selecting both sources of the same channel', () => {
  expect(sql()).toContain("(d.component = 'CDH' AND d.name = 'Temperature' AND t.source = 'FSW-A')");
  expect(sql()).toContain("OR (d.component = 'CDH' AND d.name = 'Temperature' AND t.source = 'FSW-B')");
});

it('escapes quoted source identifiers and preserves empty identifiers', () => {
  expect(sql({ channels: [{ ...channels[0], source: "FSW's test" }] })).toContain("t.source = 'FSW''s test'");
  expect(sql({ channels: [{ ...channels[0], source: '' }] })).toContain("t.source = ''");
});

it('keeps per-channel keys and the global source filter', () => {
  const result = sql({
    channels: [channels[0]], sources: ['FSW-A'],
    keys: [{ component: 'CDH', channel: 'Temperature', key: 'value.x' }],
  });
  expect(result).toContain("AND t.source = 'FSW-A' AND t.key LIKE ANY('{\"value.x%\"}')");
  expect(result).toContain("AND ('{\"FSW-A\"}'::text[] = '{}' OR t.source = ANY('{\"FSW-A\"}'))");
});
