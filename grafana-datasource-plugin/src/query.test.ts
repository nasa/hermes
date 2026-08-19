import {
  bindValueToken,
  buildTelemetryQuery,
  buildTransformCase,
  normalizeTransform,
  resolveChannels,
  transformPreview,
  validateExpression,
  validateTransformInput,
  VALUE_TOKEN,
} from './query';
import { ChannelRef, MyQuery, ResolvedQuery } from './types';

function baseQuery(overrides: Partial<ResolvedQuery>): ResolvedQuery {
  return {
    refId: 'A',
    queryType: 'telemetry',
    channels: [],
    sources: [],
    keys: [],
    timeField: 'ert',
    aggregation: 'avg',
    ...overrides,
  } as ResolvedQuery;
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

describe('buildTelemetryQuery — aggregations', () => {
  const aggQuery = (aggregation: string, timeField = 'ert') =>
    baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      aggregation: aggregation as MyQuery['aggregation'],
      timeField: timeField as MyQuery['timeField'],
    });

  it.each([
    ['avg', 'AVG'],
    ['min', 'MIN'],
    ['max', 'MAX'],
    ['sum', 'SUM'],
  ])('wraps numeric columns with %s -> %s()', (agg, fn) => {
    const sql = buildTelemetryQuery(aggQuery(agg), FROM, TO);
    expect(sql).toContain(`${fn}(t.integral::double precision) AS val_int`);
    expect(sql).toContain(`${fn}(t.floating::double precision) AS val_float`);
    expect(sql).toContain(`${fn}(t.boolval::int::double precision) AS val_bool`);
    expect(sql).toContain('time_bucket($__interval, t.ert)');
    expect(sql).toContain('GROUP BY time_bucket');
  });

  it.each([
    ['avg'],
    ['sum'],
  ])('nulls out the string and bytes columns with %s', (agg) => {
    const sql = buildTelemetryQuery(aggQuery(agg), FROM, TO);
    expect(sql).toContain('NULL AS val_str');
    expect(sql).toContain('NULL AS val_bytes');
  });

  it.each([
    ['min'],
    ['max'],
  ])('applies %s to the string column and nulls bytes', (agg) => {
    const sql = buildTelemetryQuery(aggQuery(agg), FROM, TO);
    expect(sql).toContain(`${agg.toUpperCase()}(t.string) AS val_str`);
    expect(sql).toContain('NULL AS val_bytes');
  });

  it('casts count on the string column to text', () => {
    const sql = buildTelemetryQuery(aggQuery('count'), FROM, TO);
    expect(sql).toContain('COUNT(t.integral::double precision) AS val_int');
    expect(sql).toContain('COUNT(t.string)::text AS val_str');
    expect(sql).toContain('COUNT(t.bytes)::text AS val_bytes');
  });

  it.each([
    ['first'],
    ['last'],
  ])('uses two-argument %s(value, time) TimescaleDB syntax', (agg) => {
    const sql = buildTelemetryQuery(aggQuery(agg, 'ert'), FROM, TO);
    expect(sql).toContain(`${agg}(t.integral::double precision, t.ert) AS val_int`);
    expect(sql).toContain(`${agg}(t.floating::double precision, t.ert) AS val_float`);
    expect(sql).toContain(`${agg}(t.boolval::int::double precision, t.ert) AS val_bool`);
    expect(sql).toContain(`${agg}(t.string, t.ert) AS val_str`);
    expect(sql).toContain(`${agg}(t.bytes, t.ert) AS val_bytes`);
    expect(sql).toContain('GROUP BY time_bucket');
  });

  it('threads the selected timeField into first/last', () => {
    const sql = buildTelemetryQuery(aggQuery('last', 'time'), FROM, TO);
    expect(sql).toContain('last(t.integral::double precision, t.time) AS val_int');
  });

  it.each([
    ['raw'],
    ['deriv'],
  ])('does not aggregate or group for %s', (agg) => {
    const sql = buildTelemetryQuery(aggQuery(agg), FROM, TO);
    expect(sql).toContain('t.integral::double precision AS val_int');
    expect(sql).toContain('t.string AS val_str');
    expect(sql).toContain('t.bytes AS val_bytes');
    expect(sql).not.toContain('GROUP BY');
    expect(sql).not.toContain('time_bucket($__interval');
    expect(sql).toContain('t.ert AS time_bucket');
  });

  it('throws on an unknown aggregation', () => {
    expect(() => buildTelemetryQuery(aggQuery('bogus'), FROM, TO)).toThrow(
      /Invalid aggregation type/
    );
  });
});

describe('resolveChannels', () => {
  const known: ChannelRef[] = [
    { component: 'CDH', name: 'Temperature' },
    { component: 'CDH', name: 'Attitude' },
    // A component whose name legitimately contains a dot — positional
    // splitting would get this wrong; channel-list matching gets it right.
    { component: 'A.B', name: 'C.D' },
  ];

  const vars: Record<string, string> = {
    $component: 'CDH',
    $channel: 'Temperature',
    $full: 'CDH.Temperature',
    $dotted: 'A.B.C.D',
  };

  const replace = (value: string) =>
    value.replace(/\$\w+/g, (m) => (m in vars ? vars[m] : m));

  it('passes through concrete channels unchanged', () => {
    expect(resolveChannels([{ component: 'CDH', name: 'Attitude' }], replace, known)).toEqual([
      { component: 'CDH', name: 'Attitude' },
    ]);
  });

  it('resolves a single variable that expands to a full channel', () => {
    expect(resolveChannels([{ raw: '$full' }], replace, known)).toEqual([
      { component: 'CDH', name: 'Temperature' },
    ]);
  });

  it('resolves a $component.$channel combination', () => {
    expect(
      resolveChannels([{ raw: '$component.$channel' }], replace, known)
    ).toEqual([{ component: 'CDH', name: 'Temperature' }]);
  });

  it('splits at the boundary defined by the channel list, not by dots', () => {
    // $dotted expands to "A.B.C.D"; the correct split is component "A.B" / name "C.D".
    expect(resolveChannels([{ raw: '$dotted' }], replace, known)).toEqual([
      { component: 'A.B', name: 'C.D' },
    ]);
  });

  it('keeps an unmatched raw channel as a well-formed (empty-result) ref', () => {
    expect(resolveChannels([{ raw: '$component.Missing' }], replace, known)).toEqual([
      { component: 'CDH.Missing', name: '' },
    ]);
  });
});

describe('normalizeTransform', () => {
  it.each([
    ['2', '$__value * 2'],
    ['0.001', '$__value * 0.001'],
    ['-1.5', '$__value * -1.5'],
    ['+3', '$__value * +3'],
    ['1e-3', '$__value * 1e-3'],
    ['.5', '$__value * .5'],
    ['  2  ', '$__value * 2'],
  ])('expands the numeric shorthand %s -> %s', (raw, expected) => {
    expect(normalizeTransform(raw)).toBe(expected);
  });

  it('passes an expression through verbatim, trimmed', () => {
    expect(normalizeTransform('  $__value - 273.15 ')).toBe('$__value - 273.15');
  });

  it('returns undefined for blank input', () => {
    expect(normalizeTransform('')).toBeUndefined();
    expect(normalizeTransform('   ')).toBeUndefined();
  });
});

describe('validateExpression', () => {
  it('accepts expressions referencing the value token', () => {
    expect(validateExpression('$__value * 2')).toBeUndefined();
    expect(validateExpression('ABS($__value) - 1')).toBeUndefined();
    expect(validateExpression("GREATEST($__value, 0)")).toBeUndefined();
    expect(validateExpression('$__value * -3')).toBeUndefined();
    expect(validateExpression('-$__value')).toBeUndefined();
    expect(validateExpression("$__value || 'x'")).toBeUndefined();
    expect(validateExpression('$__value >= 0')).toBeUndefined();
  });

  it('requires the value token', () => {
    expect(validateExpression('42 * 2')).toMatch(/must reference \$__value/);
  });

  it('suggests the correct token for near misses', () => {
    expect(validateExpression('$v * 2')).toMatch(/Did you mean \$__value\?/);
    expect(validateExpression('$value * 2')).toMatch(/Did you mean \$__value\?/);
  });

  it.each([
    ['$__value * 2; DROP TABLE telemetry', /";"/],
    ['$__value * 2 -- comment', /comments/],
    ['$__value /* x */ * 2', /comments/],
    ['ABS($__value * 2', /Unbalanced parentheses/],
    ['ABS($__value) * 2)', /Unbalanced parentheses/],
    ["$__value || 'abc", /Unbalanced quotes/],
    ['$__value * ', /cannot end with an operator/],
    ['$__value +', /cannot end with an operator/],
    ['* $__value', /cannot begin with an operator/],
    ['/ $__value', /cannot begin with an operator/],
  ])('rejects %s', (expr, message) => {
    expect(validateExpression(expr)).toMatch(message);
  });
});

describe('validateTransformInput', () => {
  it('treats blank input as valid (no transform)', () => {
    expect(validateTransformInput('')).toBeUndefined();
  });

  it('accepts a bare number via the shorthand path', () => {
    expect(validateTransformInput('2')).toBeUndefined();
  });

  it('rejects free text that is neither a number nor a token expression', () => {
    expect(validateTransformInput('twice')).toMatch(/must reference \$__value/);
  });
});

describe('transformPreview', () => {
  // Substitute $name with vars[name] when defined; otherwise leave in place
  // (mirrors Grafana templateSrv.replace).
  const expandWith = (vars: Record<string, string>) => (value: string) =>
    value.replace(/\$\w+/g, (m) => (m.slice(1) in vars ? vars[m.slice(1)] : m));
  const noVars = (value: string) => value;

  it('previews the numeric shorthand expansion', () => {
    expect(transformPreview('2', noVars)).toBe('$__value * 2');
  });

  it('previews a template variable used in a full expression', () => {
    expect(transformPreview('$__value * $gain', expandWith({ gain: '2' }))).toBe('$__value * 2');
  });

  it('previews a template variable that resolves to a bare-number shorthand', () => {
    expect(transformPreview('$num', expandWith({ num: '8' }))).toBe('$__value * 8');
  });

  it('returns undefined when the resolved expression matches the input', () => {
    expect(transformPreview('$__value * 2', noVars)).toBeUndefined();
  });

  it('returns undefined for blank input', () => {
    expect(transformPreview('', noVars)).toBeUndefined();
    expect(transformPreview('   ', noVars)).toBeUndefined();
  });

  it('returns undefined when the resolved expression is invalid', () => {
    expect(transformPreview('$bad', expandWith({ bad: 'twice' }))).toBeUndefined();
    expect(transformPreview('$__value * ', noVars)).toBeUndefined();
  });

  it('ignores surrounding whitespace when deciding whether to preview', () => {
    expect(transformPreview('  $__value * 2  ', noVars)).toBeUndefined();
  });
});

describe('bindValueToken', () => {
  it('parenthesizes the column so precedence is preserved', () => {
    expect(bindValueToken('$__value * 2', 't.floating::double precision')).toBe(
      '(t.floating::double precision) * 2'
    );
    expect(bindValueToken('2 * $__value', 't.floating::double precision')).toBe(
      '2 * (t.floating::double precision)'
    );
  });

  it('binds every occurrence of the token', () => {
    expect(bindValueToken('$__value * $__value', 'col')).toBe('(col) * (col)');
  });
});

describe('buildTransformCase', () => {
  const col = 't.floating::double precision';

  it('returns the bare column when there are no transforms', () => {
    expect(buildTransformCase(baseQuery({ channels: [{ component: 'CDH', name: 'Temperature' }] }), col)).toBe(col);
  });

  it('ignores transforms for channels that are not selected', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'Other', channel: 'Thing', expr: '2' }],
    });
    expect(buildTransformCase(q, col)).toBe(col);
  });

  it('ignores invalid transforms rather than emitting broken SQL', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$__value; DROP TABLE telemetry' }],
    });
    expect(buildTransformCase(q, col)).toBe(col);
  });

  it('orders key-specific branches before channel-wide ones', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Attitude' }],
      transforms: [
        { component: 'CDH', channel: 'Attitude', expr: '10' },
        { component: 'CDH', channel: 'Attitude', targetKey: 'value.x', expr: '0.001' },
      ],
    });
    const sql = buildTransformCase(q, col);
    expect(sql.indexOf("t.key = 'value.x'")).toBeLessThan(sql.indexOf('THEN (t.floating::double precision) * 10'));
  });

  it('falls back to the bare column in the ELSE branch', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2' }],
    });
    expect(buildTransformCase(q, col)).toBe(
      `CASE WHEN d.component = 'CDH' AND d.name = 'Temperature' THEN (${col}) * 2 ELSE ${col} END`
    );
  });

  it('escapes quotes in component, channel, and key names', () => {
    const q = baseQuery({
      channels: [{ component: "O'Brien", name: 'Temp' }],
      transforms: [{ component: "O'Brien", channel: 'Temp', targetKey: "a'b", expr: '2' }],
    });
    expect(buildTransformCase(q, col)).toContain("d.component = 'O''Brien'");
    expect(buildTransformCase(q, col)).toContain("t.key = 'a''b'");
  });
});

describe('buildTelemetryQuery — value transforms', () => {
  const withTransform = (expr: string, targetKey?: string) =>
    baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', targetKey, expr }],
    });

  it('leaves numeric columns untouched when no transform is set', () => {
    const sql = buildTelemetryQuery(baseQuery({ channels: [{ component: 'CDH', name: 'Temperature' }] }), FROM, TO);
    expect(sql).toContain('AVG(t.integral::double precision) AS val_int');
    expect(sql).toContain('AVG(t.floating::double precision) AS val_float');
    expect(sql).not.toContain('CASE');
  });

  it('binds the token to the matching column for each numeric output', () => {
    const sql = buildTelemetryQuery(withTransform('2'), FROM, TO);
    expect(sql).toContain('THEN (t.integral::double precision) * 2 ELSE t.integral::double precision END) AS val_int');
    expect(sql).toContain('THEN (t.floating::double precision) * 2 ELSE t.floating::double precision END) AS val_float');
  });

  it('nests the transform inside the aggregate', () => {
    const sql = buildTelemetryQuery(withTransform('$__value - 273.15'), FROM, TO);
    expect(sql).toContain('AVG(CASE WHEN');
    expect(sql).toContain('THEN (t.floating::double precision) - 273.15');
  });

  it('scopes a key-specific transform with an exact key match', () => {
    const sql = buildTelemetryQuery(withTransform('0.001', 'value.x'), FROM, TO);
    expect(sql).toContain("d.component = 'CDH' AND d.name = 'Temperature' AND t.key = 'value.x'");
  });

  it('never transforms the bool, string, or bytes columns', () => {
    const sql = buildTelemetryQuery(withTransform('2'), FROM, TO);
    expect(sql).toContain('AVG(t.boolval::int::double precision) AS val_bool');
    expect(sql).toContain('NULL AS val_str');
    expect(sql).toContain('NULL AS val_bytes');
  });

  it.each([['raw'], ['deriv']])('applies the transform without an aggregate wrapper for %s', (agg) => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      aggregation: agg as MyQuery['aggregation'],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2' }],
    });
    const sql = buildTelemetryQuery(q, FROM, TO);
    expect(sql).toContain('END AS val_int');
    expect(sql).not.toContain('AVG(CASE');
    expect(sql).not.toContain('GROUP BY');
  });

  it('emits one branch per transformed channel', () => {
    const q = baseQuery({
      channels: [
        { component: 'CDH', name: 'Temperature' },
        { component: 'Sensors', name: 'Voltage' },
      ],
      transforms: [
        { component: 'CDH', channel: 'Temperature', expr: '$__value - 273.15' },
        { component: 'Sensors', channel: 'Voltage', expr: '0.001' },
      ],
    });
    const sql = buildTelemetryQuery(q, FROM, TO);
    expect(sql).toContain("WHEN d.component = 'CDH' AND d.name = 'Temperature' THEN (t.floating::double precision) - 273.15");
    expect(sql).toContain("WHEN d.component = 'Sensors' AND d.name = 'Voltage' THEN (t.floating::double precision) * 0.001");
  });
});

describe('value token vs. Grafana template expansion', () => {
  // Mirrors Grafana's templateSrv.replace semantics: substitute $name when the
  // variable exists, otherwise leave the text in place.
  const replaceWith = (vars: Record<string, string>) => (value: string) =>
    value.replace(/\$\w+/g, (m) => (m.slice(1) in vars ? vars[m.slice(1)] : m));

  it('leaves the token intact while expanding other variables', () => {
    const replace = replaceWith({ gain: '2' });
    expect(replace('$__value * $gain')).toBe('$__value * 2');
  });

  it('is not clobbered by a dashboard variable named v', () => {
    const replace = replaceWith({ v: '7' });
    expect(replace(`${VALUE_TOKEN} * 2`)).toBe('$__value * 2');
  });

  it('routes a variable that resolves to a bare number through the shorthand path', () => {
    const replace = replaceWith({ gain: '0.5' });
    expect(normalizeTransform(replace('$gain'))).toBe('$__value * 0.5');
  });
});
