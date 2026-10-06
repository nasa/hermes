import { ChannelQuery, ChannelRef, MyQuery, ResolvedQuery, TransformRef } from "types";
import { DataQueryRequest } from "@grafana/data";

// token for user transforms
export const VALUE_TOKEN = '$__value';

const VALUE_TOKEN_PATTERN = /\$__value/g;
const NUMERIC_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
const NEAR_MISS_PATTERN = /\$(v|value)\b/;
const TRAILING_OP_PATTERN = /[-+*/%^<>=~|&]$/;
const LEADING_OP_PATTERN = /^[*/%^<>=|&]/;


// Resolve channel references to concrete { component, name } pairs.
export function resolveChannels(
    channels: ChannelQuery[],
    replace: (value: string) => string,
    known: ChannelRef[]
): ChannelRef[] {
    return channels.map((ch) => {
        if (ch.raw === undefined) {
            return { component: replace(ch.component), name: replace(ch.name) };
        }
        const expanded = replace(ch.raw);
        const match = known.find((k) => `${k.component}/${k.name}` === expanded);
        if (match) {
            return { component: match.component, name: match.name };
        }
        return { component: expanded, name: '' };
    });
}

// Expand all template variables in a query
export function resolveQuery(
    query: MyQuery,
    replace: (value: string) => string,
    known: ChannelRef[] = []
): ResolvedQuery {
    return {
        ...query,
        channels: resolveChannels(query.channels ?? [], replace, known),
        sources: query.sources?.map(replace) ?? [],
        keys: query.keys?.map((k) => ({
            component: replace(k.component),
            channel: replace(k.channel),
            key: replace(k.key),
        })) ?? [],
        transforms: query.transforms?.map((t) => ({
            component: replace(t.component),
            channel: replace(t.channel),
            targetKey: t.targetKey === undefined ? undefined : replace(t.targetKey),
            expr: replace(t.expr),
            name: t.name === undefined ? undefined : replace(t.name),
        })) ?? [],
    };
}

// Handle factor shorthand / full expression cases
export function normalizeTransform(raw: string): string | undefined {
    const trimmed = (raw ?? '').trim();
    if (!trimmed) {
        return undefined;
    }
    if (NUMERIC_PATTERN.test(trimmed)) {
        return `${VALUE_TOKEN} * ${trimmed}`;
    }
    return trimmed;
}

export function validateExpression(expr: string): string | undefined {
    if (!expr.includes(VALUE_TOKEN)) {
        if (NEAR_MISS_PATTERN.test(expr)) {
            return `Unknown value token. Did you mean ${VALUE_TOKEN}?`;
        }
        return `Expression must reference ${VALUE_TOKEN} (or be a plain number).`;
    }
    const trimmed = expr.trim();
    if (TRAILING_OP_PATTERN.test(trimmed)) {
        return 'Expression cannot end with an operator.';
    }
    if (LEADING_OP_PATTERN.test(trimmed)) {
        return 'Expression cannot begin with an operator.';
    }
    if (expr.includes(';')) {
        return 'Expression cannot contain ";".';
    }
    if (expr.includes('--') || expr.includes('/*') || expr.includes('*/')) {
        return 'Expression cannot contain SQL comments.';
    }
    let depth = 0;
    for (const ch of expr) {
        if (ch === '(') {
            depth++;
        } else if (ch === ')') {
            depth--;
            if (depth < 0) {
                return 'Unbalanced parentheses.';
            }
        }
    }
    if (depth !== 0) {
        return 'Unbalanced parentheses.';
    }
    if ((expr.match(/'/g) ?? []).length % 2 !== 0) {
        return 'Unbalanced quotes.';
    }
    return undefined;
}

export function validateTransformInput(raw: string): string | undefined {
    const expr = normalizeTransform(raw);
    return expr === undefined ? undefined : validateExpression(expr);
}

export function transformPreview(raw: string, expand: (value: string) => string): string | undefined {
    const expanded = expand(raw ?? '');
    if (validateTransformInput(expanded) !== undefined) {
        return undefined;
    }
    const normalized = normalizeTransform(expanded);
    if (normalized === undefined || normalized === (raw ?? '').trim()) {
        return undefined;
    }
    return normalized;
}

// Preview the template-expanded display name, but only when expansion actually
// changed the text (i.e. a template variable resolved to something).
export function namePreview(raw: string, expand: (value: string) => string): string | undefined {
    const trimmed = (raw ?? '').trim();
    if (!trimmed) {
        return undefined;
    }
    const expanded = expand(raw).trim();
    return expanded && expanded !== trimmed ? expanded : undefined;
}

export function bindValueToken(expr: string, column: string): string {
    return expr.replace(VALUE_TOKEN_PATTERN, `(${column})`);
}

function applicableTransforms(q: ResolvedQuery): Array<{ t: TransformRef; expr: string }> {
    const channels = q.channels ?? [];
    const matchesSelectedChannel = (t: TransformRef) =>
        channels.some((ch) => t.component === ch.component && t.channel === ch.name);

    const usable = (q.transforms ?? [])
        .map((t) => ({ t, expr: normalizeTransform(t.expr) }))
        .filter((e): e is { t: TransformRef; expr: string } => e.expr !== undefined)
        .filter(({ expr }) => validateExpression(expr) === undefined)
        .filter(({ t }) => matchesSelectedChannel(t));

    return [
        ...usable.filter(({ t }) => t.targetKey !== undefined),
        ...usable.filter(({ t }) => t.targetKey === undefined),
    ];
}

export function buildTransformCase(q: ResolvedQuery, column: string): string {
    const entries = applicableTransforms(q);
    if (entries.length === 0) {
        return column;
    }
    const branches = entries.map(({ t, expr }) => {
        const conditions = [`p.space_system = ${esc(t.component)}`, `p.name = ${esc(t.channel)}`];
        // A scalar's member path is '', so only undefined means the whole parameter.
        if (t.targetKey !== undefined) {
            conditions.push(`v.member_path = ${esc(t.targetKey)}`);
        }
        return `WHEN ${conditions.join(' AND ')} THEN ${bindValueToken(expr, column)}`;
    });
    return `CASE ${branches.join(' ')} ELSE ${column} END`;
}

// Resolve the display-name override for a series identified by its labels, or
// undefined when no matching transform carries a (non-empty) name. Matching
// mirrors applicableTransforms: only transforms on a selected channel apply,
// and a key-specific override wins over a channel-wide one.
export function aliasForLabels(
    q: ResolvedQuery,
    labels: { component: string; channel: string; key: string }
): string | undefined {
    const channels = q.channels ?? [];
    const onSelectedChannel = channels.some(
        (ch) => ch.component === labels.component && ch.name === labels.channel
    );
    if (!onSelectedChannel) {
        return undefined;
    }

    const candidates = (q.transforms ?? []).filter(
        (t) =>
            t.component === labels.component &&
            t.channel === labels.channel &&
            (t.name ?? '').trim() !== '' &&
            (t.targetKey === undefined || t.targetKey === labels.key)
    );
    // Prefer a key-specific override over a channel-wide one.
    const match =
        candidates.find((t) => t.targetKey !== undefined) ??
        candidates.find((t) => t.targetKey === undefined);
    return match ? match.name!.trim() : undefined;
}

export function buildQuery(q: ResolvedQuery, options: DataQueryRequest): string {
    const { from, to } = buildQueryOptions(q, options);
    switch (q.queryType) {
        case "events":
            return buildEventsQuery(q, from, to);
        case "telemetry":
            return buildTelemetryQuery(q, from, to);
        default:
            throw new Error(`Invalid query type: ${q.queryType}`);
    }
}

export function buildQueryOptions(q: ResolvedQuery, options: DataQueryRequest): { from: string; to: string } {
    let from = options.range.from.toISOString();
    let to = options.range.to.toISOString();
    if (q.timeOverrideFrom) {
        from = q.timeOverrideFrom;
    }
    if (q.timeOverrideTo) {
        to = q.timeOverrideTo;
    }

    return { from, to }
}

export function buildEventsQuery(q: ResolvedQuery, from: string, to: string): string {
    return format(
`SELECT
	e.%s,
	d.component,
	d.name,
	d.severity,
	e.message,
	e.source,
	e.args::text AS arguments
FROM eventDefs d
JOIN events e ON e.eventDefId = d.id
WHERE (%s::text[] = '{}' OR e.source = ANY(%s))
  AND e.%s >= %s
  AND e.%s <= %s
ORDER BY e.%s ASC;`,
        q.timeField, escArr(q.sources), escArr(q.sources),
        q.timeField, escDate(from), q.timeField, escDate(to), q.timeField);
}

export function buildTelemetryQuery(q: ResolvedQuery, from: string, to: string): string {
    if (!q.channels || q.channels.length === 0) {
        throw new Error("No parameters specified for query");
    }

    // Each channel gets its own clause so members picked for one channel don't
    // filter out another channel's rows. A channel with none picked matches all
    // of its members.
    const channelClauses = q.channels.map((ch) => {
        const chKeys = q.keys.filter(
            (k) => k.component === ch.component && k.channel === ch.name
        );
        if (chKeys.length) {
            return `(p.space_system = ${esc(ch.component)} AND p.name = ${esc(ch.name)} AND v.member_path = ANY(${escArr(chKeys.map(k => k.key))}))`;
        }
        return `(p.space_system = ${esc(ch.component)} AND p.name = ${esc(ch.name)})`;
    });
    const channelPredicate = channelClauses.join("\n\t\t       OR ");

    let intervalExpr;
    if (q.aggregation !== "raw" && q.aggregation !== "deriv" && q.aggregation !== "latest") {
        intervalExpr = `time_bucket($__interval, v.${q.timeField})`;
    } else {
        intervalExpr = `v.${q.timeField}`;
    }

    // Apply transforms to numeric columns ONLY. The recorder stores UINT64 as
    // its raw 64 bits, so we add 2^64 back when int_value comes out negative.
    const intCol = buildTransformCase(q, "(CASE WHEN v.value_type = 'UINT64' AND v.int_value < 0 THEN v.int_value + 18446744073709551616 ELSE v.int_value END)::double precision");
    const floatCol = buildTransformCase(q, "v.float_value");
    const boolCol = "v.bool_value::int::double precision";
    const strCol = "v.string_value";
    const bytesCol = "v.binary_value";

    // wrap builds the aggregation expression for a column. numFn is applied to
    // numeric columns and strFn to the string column (defaults to numFn).
    const wrap = (numFn: (col: string) => string, strFn: (col: string) => string = numFn, bytesFn: (col: string) => string = strFn) =>
        [numFn(intCol), numFn(floatCol), numFn(boolCol), strFn(strCol), bytesFn(bytesCol)];

    // Usages of null should match validate aggregation on the backend in query.go
    const nullify = () => "NULL";
    const plain = (col: string) => col;
    const call = (fn: string) => (col: string) => `${fn}(${col})`;
    const ordered = (fn: string) => (col: string) => `${fn}(${col}, v.${q.timeField})`;

    let groupByExpr = `GROUP BY time_bucket, p.space_system, p.name, p.instance, v.value_type, v.member_path`;
    let aggInt: string, aggFloat: string, aggBool: string, aggStr: string, aggBytes: string;
    switch (q.aggregation) {
        case "raw":
        case "deriv":
        case "latest":
            [aggInt, aggFloat, aggBool, aggStr, aggBytes] = wrap(plain);
            groupByExpr = "";
            break;
        case "avg":
        case "sum":
            [aggInt, aggFloat, aggBool, aggStr, aggBytes] = wrap(call(q.aggregation.toUpperCase()), nullify);
            break;
        case "min":
        case "max":
            [aggInt, aggFloat, aggBool, aggStr, aggBytes] = wrap(call(q.aggregation.toUpperCase()), call(q.aggregation.toUpperCase()), nullify);
            break;
        case "count":
            [aggInt, aggFloat, aggBool, aggStr, aggBytes] = wrap(call("COUNT"), (col) => `COUNT(${col})::text`);
            break;
        case "first":
        case "last":
            [aggInt, aggFloat, aggBool, aggStr, aggBytes] = wrap(ordered(q.aggregation));
            break;
        default:
            throw new Error(`Invalid aggregation type: ${q.aggregation}`);
    }

    const telemetrySql = format(
        `SELECT
	%s AS time_bucket,
	p.space_system,
	p.name,
	p.instance,
	v.value_type,
	v.member_path,
	%s AS val_int,
	%s AS val_float,
	%s AS val_bool,
	%s AS val_str,
	%s AS val_bytes
FROM parameters p
JOIN parameter_values v ON v.parameter_id = p.id
WHERE (%s)
  AND (%s::text[] = '{}' OR p.instance = ANY(%s))
  AND v.%s >= %s AND v.%s <= %s
%s
ORDER BY time_bucket ASC;`,
        intervalExpr, aggInt, aggFloat, aggBool, aggStr, aggBytes,
        channelPredicate, escArr(q.sources), escArr(q.sources),
        q.timeField, escDate(from), q.timeField, escDate(to), groupByExpr);

    return telemetrySql;
}

export function format(sql: string, ...args: any): string {
    let i = 0;
    return sql.replace(/%s/g, () => args[i++]);
}

export function esc(v: string): string {
    return `'${v.replace(/'/g, "''")}'`;
}

// Inside a Postgres array literal, " and \ need a backslash. esc then handles '.
export function escArr(arr: string[]): string {
    return esc(`{${arr.map(v => `"${v.replace(/[\\"]/g, "\\$&")}"`).join(",")}}`);
}

// Keeps the trailing Z, so Postgres reads the bound as UTC rather than in the session's time zone
export function escDate(d: string): string {
    return esc(d.replace("T", " "));
}
