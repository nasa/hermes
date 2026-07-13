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
    const queryArgs = [q.sources, from, to];
    const eventSql = format(`
		SELECT 
			e.%s,
			d.component,
			d.name,
			d.severity,
			e.message,
			e.source,
			e.args::text AS arguments
		FROM eventDefs d
		JOIN events e ON e.eventDefId = d.id
		WHERE ($1::text[] = '{}' OR e.source = ANY($1))
		  AND e.%s >= $2
		  AND e.%s <= $3
		ORDER BY e.%s ASC;`, q.timeField, q.timeField, q.timeField, q.timeField);
    return formatSql(eventSql, ...queryArgs);
}

export function buildTelemetryQuery(q: MyQuery, from: string, to: string): string {
    if (q.channels.length === 0) {
        throw new Error("No telemetry channels specified for query");
    }

    const components = [...new Set(q.channels.map(ch => ch.component))];
    const channels = q.channels.map(ch => ch.name);
    const keys = q.keys.map(k => k.key + "%");
    const queryArgs = [components, channels, q.sources, from, to, keys];

    let intervalExpr;
    if (q.aggregation !== "raw" && q.aggregation !== "deriv") {
        intervalExpr = `time_bucket($__interval, t.${q.timeField})`;
    } else {
        intervalExpr = `t.${q.timeField}`;
    }

    let aggregationExpr;
    let aggregationStringExpr = "MAX";
    let groupByExpr = `GROUP BY time_bucket, d.component, d.name, t.source, t.valueType, t.key`;
    switch (q.aggregation) {
        case "raw":
            aggregationExpr = "";
            aggregationStringExpr = "";
            groupByExpr = "";
            break;
        case "avg":
            aggregationExpr = "AVG";
            break;
        case "min":
            aggregationExpr = "MIN";
            break;
        case "max":
            aggregationExpr = "MAX";
            break;
        case "first":
            aggregationExpr = "FIRST";
            break;
        case "last":
            aggregationExpr = "LAST";
            break;
        case "deriv":
            aggregationExpr = "";
            aggregationStringExpr = "";
            groupByExpr = "";
            break;
        case "sum":
            aggregationExpr = "SUM";
            break;
        case "count":
            aggregationExpr = "COUNT";
            break;
        default:
            throw new Error(`Invalid aggregation type: ${q.aggregation}`);
    }

    const telemetrySql = format(`
        SELECT
			%s AS time_bucket,
			d.component,
			d.name,
			t.source,
			t.valueType,
			t.key,
			%s(t.integral::double precision) AS val_int,
			%s(t.floating::double precision) AS val_float,
			%s(t.boolval::int::double precision) AS val_bool,
			%s(t.string) AS val_str 
		FROM telemetryDefs d
		JOIN telemetry t ON t.telemetryDefId = d.id
		WHERE d.component = ANY($1)
		  AND d.name = ANY($2)
		  AND ($3::text[] = '{}' OR t.source = ANY($3))
		  AND t.%s >= $4 AND t.%s <= $5
		  AND ($6::text[] = '{}' OR t.key LIKE ANY($6))
		%s
		ORDER BY time_bucket ASC;`, intervalExpr, aggregationExpr, aggregationExpr, aggregationExpr, aggregationStringExpr, q.timeField, q.timeField, groupByExpr);

    return formatSql(telemetrySql, ...queryArgs);
}

export function format(sql: string, ...args: any): string {
    let i = 0;
    return sql.replace(/%s/g, () => args[i++]);
}

export function formatSql(sql: string, ...args: any): string {
  let result = sql;

  for (const [index, arg] of args.entries()) {
    let argStr = "";

    if (arg === null || arg === undefined) {
      argStr = "NULL";
    } else if (Array.isArray(arg)) {
      argStr = `'{${arg.map(v => `"${v}"`).join(",")}}'`;
    } else if (typeof arg === "string" && !isNaN(Date.parse(arg)) && (arg.includes("-") || arg.includes("T"))) {
      argStr = `'${arg.replace("T", " ").replace("Z", "")}'`;
    } else if (typeof arg === "string") {
      argStr = `'${arg.replace(/'/g, "''")}'`;
    } else {
      argStr = String(arg);
    }

    result = result.split(`$${index + 1}`).join(argStr);
  }

  return result;
}
