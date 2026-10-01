import type { YamcsTimestamp, YamcsValue } from '@gov.nasa.jpl.hermes/rpc';

export interface YamcsLeaf {
    /**
     * Where the leaf sits in the value, spelled as the recorder does:
     * "" for a scalar, ".Member" for an aggregate member, "[i]" for an array element
     */
    memberPath: string;

    /**
     * Text for the table. Exact for 64-bit integers, the label for ENUMERATED.
     */
    valueStr: string;

    /**
     * Value to plot, NaN when the leaf cannot be plotted
     */
    valueNum: number;
}

/**
 * Split a qualified name such as "/A/B/Param" into its space system "/A/B"
 * and name "Param". A parameter at the root, "/Param", is in "/".
 */
export function splitName(qualifiedName: string): [spaceSystem: string, name: string] {
    const i = qualifiedName.lastIndexOf('/');
    return [i > 0 ? qualifiedName.substring(0, i) : '/', qualifiedName.substring(i + 1)];
}

/**
 * YAMCS timestamp in UTC milliseconds
 */
export function millis(ts?: YamcsTimestamp): number | undefined {
    return ts ? Number(ts.seconds ?? 0) * 1000 + (ts.nanos ?? 0) / 1e6 : undefined;
}

/**
 * Flatten a value into one leaf per scalar. Scalars without a value are left out.
 */
export function leaves(v: YamcsValue | undefined, memberPath = '', out: YamcsLeaf[] = []): YamcsLeaf[] {
    switch (v?.type) {
        case 'AGGREGATE': {
            // Parallel arrays. YAMCS leaves null members out of both.
            const { name = [], value = [] } = v.aggregateValue ?? {};
            name.forEach((member, i) => leaves(value[i], `${memberPath}.${member}`, out));
            break;
        }
        case 'ARRAY':
            v.arrayValue?.forEach((element, i) => leaves(element, `${memberPath}[${i}]`, out));
            break;
        default: {
            const leaf = v && scalar(v);
            if (leaf) {
                out.push({ memberPath, ...leaf });
            }
        }
    }
    return out;
}

function scalar(v: YamcsValue): Omit<YamcsLeaf, 'memberPath'> | undefined {
    switch (v.type) {
        case 'FLOAT': return v.floatValue === undefined ? undefined : numeric(float32Text(v.floatValue));
        case 'DOUBLE': return v.doubleValue === undefined ? undefined : numeric(String(v.doubleValue));
        case 'UINT32': return v.uint32Value === undefined ? undefined : numeric(String(v.uint32Value));
        case 'SINT32': return v.sint32Value === undefined ? undefined : numeric(String(v.sint32Value));
        // Exact text; the plot gets the nearest double
        case 'UINT64': return v.uint64Value === undefined ? undefined : numeric(v.uint64Value);
        case 'SINT64': return v.sint64Value === undefined ? undefined : numeric(v.sint64Value);
        case 'BOOLEAN': return v.booleanValue === undefined ? undefined : { valueStr: String(v.booleanValue), valueNum: Number(v.booleanValue) };
        // The label for the table, the number for a state plot
        case 'ENUMERATED': return v.sint64Value === undefined ? undefined : { valueStr: v.stringValue ?? v.sint64Value, valueNum: Number(v.sint64Value) };
        // TIMESTAMP shows its UTC text: YAMCS's timestampValue counts leap seconds
        case 'STRING':
        case 'TIMESTAMP': return v.stringValue === undefined ? undefined : { valueStr: v.stringValue, valueNum: NaN };
        case 'BINARY': return { valueStr: v.binaryValue?.toString('hex') ?? '', valueNum: NaN };
    }
    return undefined;
}

function numeric(valueStr: string) {
    return { valueStr, valueNum: Number(valueStr) };
}

/**
 * The shortest decimal that reads back as the same float32, as the recorder
 * stores FLOAT values: 0.1 rather than 0.10000000149011612.
 */
function float32Text(f: number): string {
    for (let digits = 1; digits <= 9; digits++) {
        const text = f.toPrecision(digits);
        if (Math.fround(Number(text)) === f) {
            return String(Number(text));
        }
    }
    return String(f);
}

/**
 * Index at which inserting t keeps the ascending times sorted, after any equal times
 */
export function insertionIndex(times: readonly number[], t: number): number {
    let lo = 0;
    let hi = times.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (times[mid] <= t) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
}
