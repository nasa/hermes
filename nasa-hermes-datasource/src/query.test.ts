import { buildTelemetryQuery } from './query';
import { MyQuery } from './types';

function baseQuery(overrides: Partial<MyQuery>): MyQuery {
  return {
    refId: 'A',
    queryType: 'telemetry',
    channels: [],
    sources: [],
    keys: [],
    timeField: 'ert',
    aggregation: 'avg',
    ...overrides,
  } as MyQuery;
}

const FROM = '2024-01-01T00:00:00.000Z';
const TO = '2024-01-01T01:00:00.000Z';

describe('buildTelemetryQuery — per-channel key scoping', () => {
  it('does not filter a scalar channel when a compound channel has keys selected', () => {
    const q = baseQuery({
      channels: [
        { component: 'CDH', name: 'Attitude' },
        { component: 'CDH', name: 'Temperature' },
      ],
      keys: [{ component: 'CDH', channel: 'Attitude', key: 'value.x' }],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    // Compound channel is scoped to its selected key.
    expect(sql).toContain(
      "(d.component = 'CDH' AND d.name = 'Attitude' AND t.key LIKE ANY('{\"value.x%\"}'))"
    );
    // Scalar channel has NO key restriction, so it is not filtered out.
    expect(sql).toContain("(d.component = 'CDH' AND d.name = 'Temperature')");
    // There is no global key filter anymore.
    expect(sql).not.toMatch(/t\.key LIKE ANY\(\$\d+\)\)\s*\n\s*ORDER/);
  });

  it('restricts a compound channel to only its selected subkeys', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Attitude' }],
      keys: [{ component: 'CDH', channel: 'Attitude', key: 'value.x' }],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    expect(sql).toContain(
      "(d.component = 'CDH' AND d.name = 'Attitude' AND t.key LIKE ANY('{\"value.x%\"}'))"
    );
    expect(sql).not.toContain('value.y');
  });

  it('matches all keys for a compound channel when none are selected', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Attitude' }],
      keys: [],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    expect(sql).toContain("(d.component = 'CDH' AND d.name = 'Attitude')");
    expect(sql).not.toContain('t.key LIKE ANY');
  });

  it('joins multiple channels with OR', () => {
    const q = baseQuery({
      channels: [
        { component: 'CDH', name: 'Attitude' },
        { component: 'Sensors', name: 'IMU' },
      ],
      keys: [],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    expect(sql).toContain("(d.component = 'CDH' AND d.name = 'Attitude')");
    expect(sql).toContain("(d.component = 'Sensors' AND d.name = 'IMU')");
    expect(sql).toMatch(/OR/);
  });

  it('inlines all values correctly with many channels', () => {
    const q = baseQuery({
      channels: [
        { component: 'C1', name: 'N1' },
        { component: 'C2', name: 'N2' },
        { component: 'C3', name: 'N3' },
        { component: 'C4', name: 'N4' },
      ],
      keys: [
        { component: 'C1', channel: 'N1', key: 'value.a' },
        { component: 'C2', channel: 'N2', key: 'value.b' },
        { component: 'C3', channel: 'N3', key: 'value.c' },
        { component: 'C4', channel: 'N4', key: 'value.d' },
      ],
      sources: ['fsw-1'],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    // All channel components, names, and keys are inlined.
    expect(sql).toContain("d.component = 'C4'");
    expect(sql).toContain("d.name = 'N4'");
    expect(sql).toContain('value.d');
    // Source and time bounds are inlined.
    expect(sql).toContain("t.source = ANY('{\"fsw-1\"}')");
    expect(sql).toContain("2024-01-01 00:00:00.000");
  });

  it('throws when no channels are provided', () => {
    expect(() => buildTelemetryQuery(baseQuery({ channels: [] }), FROM, TO)).toThrow();
  });
});
