import { MyQuery } from "types";
import { DataQueryRequest } from "@grafana/data";

export function buildQuery(q: MyQuery, options: DataQueryRequest): string {
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

export function buildQueryOptions(q: MyQuery, options: DataQueryRequest): { from: string; to: string } {
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

export function buildEventsQuery(q: MyQuery, from: string, to: string): string {
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

export function buildTelemetryQuery(q: MyQuery, from: string, to: string): string {
    if (!q.channels || q.channels.length === 0) {
        throw new Error("No telemetry channels specified for query");
    }

    // Build a per-channel predicate so that keys selected on one channel do not
    // filter out rows from other channels (e.g. scalar channels whose only key
    // is "value"). Each channel matches all of its keys unless specific keys are
    // selected for that channel.
    const channelClauses = q.channels.map((ch) => {
        const chKeys = q.keys.filter(
            (k) => k.component === ch.component && k.channel === ch.name
        );
        if (chKeys.length) {
            return `(d.component = ${esc(ch.component)} AND d.name = ${esc(ch.name)} AND t.key LIKE ANY(${escArr(chKeys.map(k => k.key + "%"))}))`;
        }
        return `(d.component = ${esc(ch.component)} AND d.name = ${esc(ch.name)})`;
    });
    const channelPredicate = channelClauses.join("\n\t\t       OR ");

    let intervalExpr;
    if (q.aggregation !== "raw" && q.aggregation !== "deriv") {
        intervalExpr = `time_bucket($__interval, t.${q.timeField})`;
    } else {
        intervalExpr = `t.${q.timeField}`;
    }

    const intCol = "t.integral::double precision";
    const floatCol = "t.floating::double precision";
    const boolCol = "t.boolval::int::double precision";
    const strCol = "t.string";

    // wrap builds the aggregation expression for a column. numFn is applied to
    // numeric columns and strFn to the string column (defaults to numFn).
    const wrap = (numFn: (col: string) => string, strFn: (col: string) => string = numFn) =>
        [numFn(intCol), numFn(floatCol), numFn(boolCol), strFn(strCol)];

    const plain = (col: string) => col;
    const call = (fn: string) => (col: string) => `${fn}(${col})`;
    const ordered = (fn: string) => (col: string) => `${fn}(${col}, t.${q.timeField})`;

    let groupByExpr = `GROUP BY time_bucket, d.component, d.name, t.source, t.valueType, t.key`;
    let aggInt: string, aggFloat: string, aggBool: string, aggStr: string;
    switch (q.aggregation) {
        case "raw":
        case "deriv":
            [aggInt, aggFloat, aggBool, aggStr] = wrap(plain);
            groupByExpr = "";
            break;
        case "avg":
        case "sum":
            [aggInt, aggFloat, aggBool, aggStr] = wrap(call(q.aggregation.toUpperCase()), call("MAX"));
            break;
        case "min":
        case "max":
            [aggInt, aggFloat, aggBool, aggStr] = wrap(call(q.aggregation.toUpperCase()));
            break;
        case "count":
            [aggInt, aggFloat, aggBool, aggStr] = wrap(call("COUNT"), (col) => `COUNT(${col})::text`);
            break;
        case "first":
        case "last":
            [aggInt, aggFloat, aggBool, aggStr] = wrap(ordered(q.aggregation));
            break;
        default:
            throw new Error(`Invalid aggregation type: ${q.aggregation}`);
    }

    const telemetrySql = format(
        `SELECT
	%s AS time_bucket,
	d.component,
	d.name,
	t.source,
	t.valueType,
	t.key,
	%s AS val_int,
	%s AS val_float,
	%s AS val_bool,
	%s AS val_str
FROM telemetryDefs d
JOIN telemetry t ON t.telemetryDefId = d.id
WHERE (%s)
  AND (%s::text[] = '{}' OR t.source = ANY(%s))
  AND t.%s >= %s AND t.%s <= %s
%s
ORDER BY time_bucket ASC;`,
        intervalExpr, aggInt, aggFloat, aggBool, aggStr,
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

export function escArr(arr: string[]): string {
    return `'{${arr.map(v => `"${v}"`).join(",")}}'`;
}

export function escDate(d: string): string {
    return `'${d.replace("T", " ").replace("Z", "")}'`;
}
