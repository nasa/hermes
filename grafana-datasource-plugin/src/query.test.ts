import {
  aliasForLabels,
  bindValueToken,
  buildTelemetryQuery,
  buildTransformCase,
  escArr,
  escDate,
  namePreview,
  normalizeTransform,
  resolveChannels,
  resolveQuery,
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
    timeField: 'generation_time',
    aggregation: 'avg',
    ...overrides,
  } as ResolvedQuery;
}

const FROM = '2024-01-01T00:00:00.000Z';
const TO = '2024-01-01T01:00:00.000Z';
const INT_COL =
  "(CASE WHEN v.value_type = 'UINT64' AND v.int_value < 0 THEN v.int_value + 18446744073709551616 ELSE v.int_value END)::double precision";

describe('buildTelemetryQuery — per-channel key scoping', () => {
  it('does not filter a scalar channel when a compound channel has keys selected', () => {
    const q = baseQuery({
      channels: [
        { component: 'CDH', name: 'Attitude' },
        { component: 'CDH', name: 'Temperature' },
      ],
      keys: [{ component: 'CDH', channel: 'Attitude', key: '.x' }],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    // Compound channel is scoped to its selected key.
    expect(sql).toContain(
      "(p.space_system = 'CDH' AND p.name = 'Attitude' AND v.member_path = ANY('{\".x\"}'))"
    );
    // Scalar channel has NO key restriction, so it is not filtered out.
    expect(sql).toContain("(p.space_system = 'CDH' AND p.name = 'Temperature')");
    // The member filter appears only in Attitude's clause, not across the whole query.
    expect(sql.match(/v\.member_path = ANY\(/g)).toHaveLength(1);
  });

  it('restricts a compound channel to only its selected subkeys', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Attitude' }],
      keys: [{ component: 'CDH', channel: 'Attitude', key: '.x' }],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    expect(sql).toContain(
      "(p.space_system = 'CDH' AND p.name = 'Attitude' AND v.member_path = ANY('{\".x\"}'))"
    );
    expect(sql).not.toContain('.y');
  });

  it('matches all keys for a compound channel when none are selected', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Attitude' }],
      keys: [],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    expect(sql).toContain("(p.space_system = 'CDH' AND p.name = 'Attitude')");
    expect(sql).not.toContain('v.member_path = ANY');
  });

  it('matches the whole value of a scalar by its empty member path', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      keys: [{ component: 'CDH', channel: 'Temperature', key: '' }],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    expect(sql).toContain(`(p.space_system = 'CDH' AND p.name = 'Temperature' AND v.member_path = ANY('{""}'))`);
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

    expect(sql).toContain("(p.space_system = 'CDH' AND p.name = 'Attitude')");
    expect(sql).toContain("(p.space_system = 'Sensors' AND p.name = 'IMU')");
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
        { component: 'C1', channel: 'N1', key: '.a' },
        { component: 'C2', channel: 'N2', key: '.b' },
        { component: 'C3', channel: 'N3', key: '.c' },
        { component: 'C4', channel: 'N4', key: '.d' },
      ],
      sources: ['fsw-1'],
    });

    const sql = buildTelemetryQuery(q, FROM, TO);

    // All channel space systems, names, and members are inlined.
    expect(sql).toContain("p.space_system = 'C4'");
    expect(sql).toContain("p.name = 'N4'");
    expect(sql).toContain("'{\".d\"}'");
    // Instance and time bounds are inlined.
    expect(sql).toContain("p.instance = ANY('{\"fsw-1\"}')");
    expect(sql).toContain("'2024-01-01 00:00:00.000Z'");
  });

  it('throws when no channels are provided', () => {
    expect(() => buildTelemetryQuery(baseQuery({ channels: [] }), FROM, TO)).toThrow();
  });
});

describe('escArr and escDate', () => {
  it('escapes quotes and backslashes in array values', () => {
    expect(escArr(['a"b', "c'd", 'e\\f'])).toBe(`'{"a\\"b","c''d","e\\\\f"}'`);
  });

  it('keeps the UTC zone on time bounds', () => {
    expect(escDate('2024-01-01T00:00:00.000Z')).toBe("'2024-01-01 00:00:00.000Z'");
  });
});

describe('buildTelemetryQuery — aggregations', () => {
  const aggQuery = (aggregation: string, timeField = 'generation_time') =>
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
    expect(sql).toContain(`${fn}(${INT_COL}) AS val_int`);
    expect(sql).toContain(`${fn}(v.float_value) AS val_float`);
    expect(sql).toContain(`${fn}(v.bool_value::int::double precision) AS val_bool`);
    expect(sql).toContain('time_bucket($__interval, v.generation_time)');
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
    expect(sql).toContain(`${agg.toUpperCase()}(v.string_value) AS val_str`);
    expect(sql).toContain('NULL AS val_bytes');
  });

  it('casts count on the string column to text', () => {
    const sql = buildTelemetryQuery(aggQuery('count'), FROM, TO);
    expect(sql).toContain(`COUNT(${INT_COL}) AS val_int`);
    expect(sql).toContain('COUNT(v.string_value)::text AS val_str');
    expect(sql).toContain('COUNT(v.binary_value)::text AS val_bytes');
  });

  it.each([
    ['first'],
    ['last'],
  ])('uses two-argument %s(value, time) TimescaleDB syntax', (agg) => {
    const sql = buildTelemetryQuery(aggQuery(agg, 'generation_time'), FROM, TO);
    expect(sql).toContain(`${agg}(${INT_COL}, v.generation_time) AS val_int`);
    expect(sql).toContain(`${agg}(v.float_value, v.generation_time) AS val_float`);
    expect(sql).toContain(`${agg}(v.bool_value::int::double precision, v.generation_time) AS val_bool`);
    expect(sql).toContain(`${agg}(v.string_value, v.generation_time) AS val_str`);
    expect(sql).toContain(`${agg}(v.binary_value, v.generation_time) AS val_bytes`);
    expect(sql).toContain('GROUP BY time_bucket');
  });

  it('threads the selected timeField into first/last', () => {
    const sql = buildTelemetryQuery(aggQuery('last', 'acquisition_time'), FROM, TO);
    expect(sql).toContain(`last(${INT_COL}, v.acquisition_time) AS val_int`);
  });

  it.each([
    ['raw'],
    ['deriv'],
    ['latest'],
  ])('does not aggregate or group for %s', (agg) => {
    const sql = buildTelemetryQuery(aggQuery(agg), FROM, TO);
    expect(sql).toContain(`${INT_COL} AS val_int`);
    expect(sql).toContain('v.string_value AS val_str');
    expect(sql).toContain('v.binary_value AS val_bytes');
    expect(sql).not.toContain('GROUP BY');
    expect(sql).not.toContain('time_bucket($__interval');
    expect(sql).toContain('v.generation_time AS time_bucket');
  });

  it('throws on an unknown aggregation', () => {
    expect(() => buildTelemetryQuery(aggQuery('bogus'), FROM, TO)).toThrow(
      /Invalid aggregation type/
    );
  });
});

describe('resolveChannels', () => {
  const known: ChannelRef[] = [
    { component: '/CDH', name: 'Temperature' },
    { component: '/CDH', name: 'Attitude' },
    // A parameter in a nested space system, so its full name /A/B/C has three slashes.
    { component: '/A/B', name: 'C' },
  ];

  const vars: Record<string, string> = {
    $component: '/CDH',
    $channel: 'Temperature',
    $full: '/CDH/Temperature',
    $nested: '/A/B/C',
  };

  const replace = (value: string) =>
    value.replace(/\$\w+/g, (m) => (m in vars ? vars[m] : m));

  it('passes through concrete channels unchanged', () => {
    expect(resolveChannels([{ component: '/CDH', name: 'Attitude' }], replace, known)).toEqual([
      { component: '/CDH', name: 'Attitude' },
    ]);
  });

  it('resolves a single variable that expands to a full channel', () => {
    expect(resolveChannels([{ raw: '$full' }], replace, known)).toEqual([
      { component: '/CDH', name: 'Temperature' },
    ]);
  });

  it('resolves a $component/$channel combination', () => {
    expect(
      resolveChannels([{ raw: '$component/$channel' }], replace, known)
    ).toEqual([{ component: '/CDH', name: 'Temperature' }]);
  });

  it('splits at the boundary defined by the channel list, not by slashes', () => {
    // $nested expands to "/A/B/C"; the correct split is space system "/A/B" / name "C".
    expect(resolveChannels([{ raw: '$nested' }], replace, known)).toEqual([
      { component: '/A/B', name: 'C' },
    ]);
  });

  it('keeps an unmatched raw channel as a well-formed (empty-result) ref', () => {
    expect(resolveChannels([{ raw: '$component/Missing' }], replace, known)).toEqual([
      { component: '/CDH/Missing', name: '' },
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
    expect(bindValueToken('$__value * 2', 'v.float_value')).toBe(
      '(v.float_value) * 2'
    );
    expect(bindValueToken('2 * $__value', 'v.float_value')).toBe(
      '2 * (v.float_value)'
    );
  });

  it('binds every occurrence of the token', () => {
    expect(bindValueToken('$__value * $__value', 'col')).toBe('(col) * (col)');
  });
});

describe('buildTransformCase', () => {
  const col = 'v.float_value';

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
        { component: 'CDH', channel: 'Attitude', targetKey: '.x', expr: '0.001' },
      ],
    });
    const sql = buildTransformCase(q, col);
    expect(sql.indexOf("v.member_path = '.x'")).toBeLessThan(sql.indexOf('THEN (v.float_value) * 10'));
  });

  it('limits a transform on the empty member path to that member', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Attitude' }],
      transforms: [{ component: 'CDH', channel: 'Attitude', targetKey: '', expr: '2' }],
    });
    expect(buildTransformCase(q, col)).toContain("p.name = 'Attitude' AND v.member_path = '' THEN");
  });

  it('falls back to the bare column in the ELSE branch', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2' }],
    });
    expect(buildTransformCase(q, col)).toBe(
      `CASE WHEN p.space_system = 'CDH' AND p.name = 'Temperature' THEN (${col}) * 2 ELSE ${col} END`
    );
  });

  it('escapes quotes in component, channel, and key names', () => {
    const q = baseQuery({
      channels: [{ component: "O'Brien", name: 'Temp' }],
      transforms: [{ component: "O'Brien", channel: 'Temp', targetKey: "a'b", expr: '2' }],
    });
    expect(buildTransformCase(q, col)).toContain("p.space_system = 'O''Brien'");
    expect(buildTransformCase(q, col)).toContain("v.member_path = 'a''b'");
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
    expect(sql).toContain(`AVG(${INT_COL}) AS val_int`);
    expect(sql).toContain('AVG(v.float_value) AS val_float');
    // The int column always has the UINT64 CASE, so only check that no transform CASE was added.
    expect(sql).not.toContain('CASE WHEN p.');
  });

  it('binds the token to the matching column for each numeric output', () => {
    const sql = buildTelemetryQuery(withTransform('2'), FROM, TO);
    expect(sql).toContain(`THEN (${INT_COL}) * 2 ELSE ${INT_COL} END) AS val_int`);
    expect(sql).toContain('THEN (v.float_value) * 2 ELSE v.float_value END) AS val_float');
  });

  it('nests the transform inside the aggregate', () => {
    const sql = buildTelemetryQuery(withTransform('$__value - 273.15'), FROM, TO);
    expect(sql).toContain('AVG(CASE WHEN');
    expect(sql).toContain('THEN (v.float_value) - 273.15');
  });

  it('scopes a key-specific transform with an exact key match', () => {
    const sql = buildTelemetryQuery(withTransform('0.001', '.x'), FROM, TO);
    expect(sql).toContain("p.space_system = 'CDH' AND p.name = 'Temperature' AND v.member_path = '.x'");
  });

  it('never transforms the bool, string, or bytes columns', () => {
    const sql = buildTelemetryQuery(withTransform('2'), FROM, TO);
    expect(sql).toContain('AVG(v.bool_value::int::double precision) AS val_bool');
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
    expect(sql).toContain("WHEN p.space_system = 'CDH' AND p.name = 'Temperature' THEN (v.float_value) - 273.15");
    expect(sql).toContain("WHEN p.space_system = 'Sensors' AND p.name = 'Voltage' THEN (v.float_value) * 0.001");
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

describe('aliasForLabels', () => {
  const labels = (key = '') => ({ component: 'CDH', channel: 'Temperature', key });

  it('returns the name for a matching whole-channel transform', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: 'Reactor Temp' }],
    });
    expect(aliasForLabels(q, labels())).toBe('Reactor Temp');
  });

  it('returns undefined when the channel is not selected', () => {
    const q = baseQuery({
      channels: [{ component: 'Other', name: 'Thing' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: 'Reactor Temp' }],
    });
    expect(aliasForLabels(q, labels())).toBeUndefined();
  });

  it('returns undefined when no transform carries a name', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2' }],
    });
    expect(aliasForLabels(q, labels())).toBeUndefined();
  });

  it('treats a whitespace-only name as no override', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: '   ' }],
    });
    expect(aliasForLabels(q, labels())).toBeUndefined();
  });

  it('matches a key-specific override only on the matching key', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', targetKey: '.x', expr: '', name: 'X axis' }],
    });
    expect(aliasForLabels(q, labels('.x'))).toBe('X axis');
    expect(aliasForLabels(q, labels('.y'))).toBeUndefined();
  });

  it('prefers a key-specific override over a channel-wide one', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [
        { component: 'CDH', channel: 'Temperature', expr: '', name: 'Whole channel' },
        { component: 'CDH', channel: 'Temperature', targetKey: '.x', expr: '', name: 'X axis' },
      ],
    });
    expect(aliasForLabels(q, labels('.x'))).toBe('X axis');
    expect(aliasForLabels(q, labels('.y'))).toBe('Whole channel');
  });

  it('trims surrounding whitespace from the name', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: '  Reactor Temp  ' }],
    });
    expect(aliasForLabels(q, labels())).toBe('Reactor Temp');
  });
});

describe('namePreview', () => {
  const replaceWith = (vars: Record<string, string>) => (value: string) =>
    value.replace(/\$\w+/g, (m) => (m.slice(1) in vars ? vars[m.slice(1)] : m));

  it('shows the expanded name when a template variable resolves', () => {
    expect(namePreview('$label Temp', replaceWith({ label: 'Reactor' }))).toBe('Reactor Temp');
  });

  it('returns undefined for a literal name with no variables', () => {
    expect(namePreview('Reactor Temp', replaceWith({}))).toBeUndefined();
  });

  it('returns undefined when a variable does not resolve (text unchanged)', () => {
    expect(namePreview('$missing Temp', replaceWith({}))).toBeUndefined();
  });

  it('returns undefined for an empty name', () => {
    expect(namePreview('', replaceWith({ label: 'Reactor' }))).toBeUndefined();
  });
});

describe('name-only transforms', () => {
  const replaceWith = (vars: Record<string, string>) => (value: string) =>
    value.replace(/\$\w+/g, (m) => (m.slice(1) in vars ? vars[m.slice(1)] : m));

  it('resolveQuery expands template variables in the name', () => {
    const resolved = resolveQuery(
      baseQuery({
        channels: [{ component: 'CDH', name: 'Temperature' }],
        transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: '$label Temp' }],
      }) as MyQuery,
      replaceWith({ label: 'Reactor' })
    );
    expect(resolved.transforms?.[0].name).toBe('Reactor Temp');
  });

  it('emits no CASE/SQL for a name-only transform', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: 'Reactor Temp' }],
    });
    expect(buildTransformCase(q, 'v.float_value')).toBe('v.float_value');
    expect(buildTelemetryQuery(q, FROM, TO)).not.toContain('CASE WHEN p.');
  });

  it('still emits SQL when both an expression and a name are set', () => {
    const q = baseQuery({
      channels: [{ component: 'CDH', name: 'Temperature' }],
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2', name: 'Reactor Temp' }],
    });
    expect(buildTelemetryQuery(q, FROM, TO)).toContain('THEN (v.float_value) * 2');
  });
});
