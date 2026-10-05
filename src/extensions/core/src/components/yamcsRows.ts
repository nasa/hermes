import type { YamcsTimestamp, YamcsValue } from '@gov.nasa.jpl.hermes/rpc';

export interface YamcsLeaf {
    /**
     * Where the leaf sits in the value, spelled as in yamcs-recorder's member_path column:
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
            // YAMCS drops a null member from both lists, so names and values still line up by index
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
        // 64-bit values arrive as exact strings, and the plot gets the nearest double
        case 'UINT64': return v.uint64Value === undefined ? undefined : numeric(v.uint64Value);
        case 'SINT64': return v.sint64Value === undefined ? undefined : numeric(v.sint64Value);
        case 'BOOLEAN': return v.booleanValue === undefined ? undefined : { valueStr: String(v.booleanValue), valueNum: Number(v.booleanValue) };
        // The label for the table, the number for a state plot
        case 'ENUMERATED': return v.sint64Value === undefined ? undefined : { valueStr: v.stringValue ?? v.sint64Value, valueNum: Number(v.sint64Value) };
        // For TIMESTAMP we show YAMCS's UTC text, since its timestampValue counts leap seconds
        case 'STRING':
        case 'TIMESTAMP': return v.stringValue === undefined ? undefined : { valueStr: v.stringValue, valueNum: NaN };
        case 'BINARY': return v.binaryValue === undefined ? undefined : { valueStr: v.binaryValue.toString('hex'), valueNum: NaN };
    }
    return undefined;
}

function numeric(valueStr: string) {
    return { valueStr, valueNum: Number(valueStr) };
}

/**
 * The shortest decimal that reads back as the same float32: 0.1 rather than
 * 0.10000000149011612. yamcs-recorder stores FLOAT values the same way, except
 * that when two such decimals are equally close, it can pick the other one, so
 * the last digit may differ.
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
