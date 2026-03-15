import uPlot, { Scale, Range } from 'uplot';

export enum ScaleOrientation {
    Horizontal = 0,
    Vertical = 1,
}

export enum ScaleDirection {
    Right = 1,
    Left = -1,
    Up = -1,
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    Down = 1,
}

export interface ScaleProps {
    scaleKey: string;
    isTime?: boolean;
    auto?: boolean;
    min?: number | null;
    max?: number | null;
    softMin?: number | null;
    softMax?: number | null;
    range?: Scale.Range;
    orientation?: ScaleOrientation;
    direction?: ScaleDirection;
}

export class UPlotScaleBuilder {
    constructor(public props: ScaleProps) { }

    merge(props: ScaleProps) {
        this.props.min = optMinMax('min', this.props.min, props.min);
        this.props.max = optMinMax('max', this.props.max, props.max);
    }

    getConfig(): Record<string, Scale> {
        const {
            isTime,
            auto,
            scaleKey,
            min: hardMin,
            max: hardMax,
            softMin,
            softMax,
            range,
            direction = ScaleDirection.Right,
            orientation = ScaleOrientation.Horizontal,
        } = this.props;

        // uPlot's default ranging config
        const softMinMode: Range.SoftMode = softMin == null ? 3 : 1;
        const softMaxMode: Range.SoftMode = softMax == null ? 3 : 1;

        const rangeConfig: Range.Config = {
            min: {
                pad: 0.1,
                hard: hardMin ?? -Infinity,
                soft: softMin ?? 0,
                mode: softMinMode,
            },
            max: {
                pad: 0.1,
                hard: hardMax ?? Infinity,
                soft: softMax ?? 0,
                mode: softMaxMode,
            },
        };

        const hasFixedRange = hardMin != null && hardMax != null && softMin == null && softMax == null;

        const rangeFn: uPlot.Range.Function = (
            u: uPlot,
            dataMin: number | null,
            dataMax: number | null,
            _scaleKey: string
        ) => {
            let minMax: uPlot.Range.MinMax = [dataMin, dataMax];

            // Auto-disable axis if no data
            if (!hasFixedRange && dataMin == null && dataMax == null) {
                return minMax;
            }

            minMax = uPlot.rangeNum(dataMin!, dataMax!, rangeConfig);

            // Guard against invalid ranges
            if (minMax[0]! >= minMax[1]!) {
                minMax[0] = 0;
                minMax[1] = 100;
            }

            return minMax;
        };

        const autoScale = auto ?? (!isTime && !hasFixedRange);

        return {
            [scaleKey]: {
                time: isTime,
                auto: autoScale,
                range: range ?? rangeFn,
                dir: direction,
                ori: orientation,
            },
        };
    }
}

export function optMinMax(
    minmax: 'min' | 'max',
    a?: number | null,
    b?: number | null
): undefined | number | null {
    const hasA = !(a === undefined || a === null);
    const hasB = !(b === undefined || b === null);
    if (hasA) {
        if (!hasB) {
            return a;
        }
        if (minmax === 'min') {
            return a! < b! ? a : b;
        }
        return a! > b! ? a : b;
    }
    return b;
}
