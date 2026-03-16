import uPlot, { Axis } from 'uplot';

export enum AxisPlacement {
    Auto = 'auto',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left',
    Hidden = 'hidden',
}

export interface AxisProps {
    scaleKey: string;
    label?: string;
    show?: boolean;
    size?: number | null;
    gap?: number;
    placement?: AxisPlacement;
    grid?: Axis.Grid;
    ticks?: Axis.Ticks;
    filter?: Axis.Filter;
    space?: Axis.Space;
    formatValue?: (v: any) => string;
    values?: Axis.Values;
    isTime?: boolean;
    stroke?: string;
    font?: string;
}

const UPLOT_AXIS_FONT_SIZE = 12;

// Tick spacing in CSS pixels
const Y_TICK_SPACING = 30;
const X_TICK_SPACING = 50;
const X_TICK_VALUE_GAP = 18;

export class UPlotAxisBuilder {
    constructor(public props: AxisProps) {}

    merge(props: AxisProps) {
        this.props.size = optMinMax('max', this.props.size, props.size);
        if (!this.props.label) {
            this.props.label = props.label;
        }
        if (this.props.placement === AxisPlacement.Auto) {
            this.props.placement = props.placement;
        }
    }

    getConfig(): Axis {
        const {
            scaleKey,
            label,
            show = true,
            placement = AxisPlacement.Auto,
            grid,
            ticks,
            space,
            filter,
            gap = 5,
            formatValue,
            values,
            isTime,
            stroke,
            font,
        } = this.props;

        const config: Axis = {
            scale: scaleKey,
            show,
            stroke: stroke || 'currentColor',
            side: getUPlotSideFromAxis(placement),
            font: font || `${UPLOT_AXIS_FONT_SIZE}px monospace`,
            size: this.props.size ?? calculateAxisSize,
            gap,
            labelGap: 0,
            grid: grid || {
                show: true,
                stroke: 'rgba(128, 128, 128, 0.2)',
                width: 1 / devicePixelRatio,
            },
            ticks: {
                show: true,
                stroke: 'rgba(128, 128, 128, 0.2)',
                width: 1 / devicePixelRatio,
                size: 4,
                ...ticks,
            },
            space: space ?? ((self, axisIdx, scaleMin, scaleMax, plotDim) => {
                return calculateSpace(self, axisIdx, scaleMin, scaleMax, plotDim);
            }),
            filter,
        };

        if (label != null && label.length > 0) {
            config.label = label;
            config.labelSize = UPLOT_AXIS_FONT_SIZE + 8;
            config.labelFont = config.font;
            config.labelGap = 8;
        }

        if (values) {
            config.values = values;
        } else if (formatValue) {
            config.values = (u: uPlot, splits) => {
                return splits.map((v) => (v == null ? '' : formatValue(v)));
            };
        } else if (isTime) {
            config.values = formatTime;
        }

        return config;
    }
}

/** Format time axis ticks */
export function formatTime(
    self: uPlot,
    splits: number[],
    axisIdx: number,
    foundSpace: number,
    foundIncr: number
): string[] {
    const scale = self.scales.x;
    const range = (scale?.max ?? 0) - (scale?.min ?? 0);

    // Time unit sizes in milliseconds
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;

    let formatStr = 'time';

    if (foundIncr < second) {
        // Milliseconds
        formatStr = 'ms';
    } else if (foundIncr <= minute) {
        // Seconds
        formatStr = 'sec';
    } else if (range <= day) {
        // Minutes/hours within a day
        formatStr = 'time';
    } else if (foundIncr <= day) {
        // Hours across days
        formatStr = 'datetime';
    } else {
        // Days/months/years
        formatStr = 'date';
    }

    return splits.map((v) => {
        if (v == null) {
            return '';
        }
        const date = new Date(v * 1000); // uPlot uses seconds
        if (formatStr === 'ms') {
            return date.toISOString().slice(-4, -1) + 'ms';
        } else if (formatStr === 'sec') {
            return date.toISOString().slice(11, 19);
        } else if (formatStr === 'time') {
            return date.toLocaleTimeString();
        } else if (formatStr === 'datetime') {
            return date.toLocaleString();
        } else {
            return date.toLocaleDateString();
        }
    });
}

/** Minimum grid & tick spacing in CSS pixels */
function calculateSpace(
    self: uPlot,
    axisIdx: number,
    scaleMin: number,
    scaleMax: number,
    plotDim: number
): number {
    const axis = self.axes[axisIdx];

    // For vertical axes (left & right)
    if (axis.side !== 2) {
        return Y_TICK_SPACING;
    }

    // For horizontal axis (bottom)
    return X_TICK_SPACING;
}

/** Height of x axis or width of y axis in CSS pixels */
function calculateAxisSize(self: uPlot, values: string[], axisIdx: number): number {
    const axis = self.axes[axisIdx];
    let axisSize = axis.ticks?.size ?? 4;

    if (axis.side === 2) {
        // Bottom axis (x-axis)
        axisSize += (axis.gap ?? 5) + UPLOT_AXIS_FONT_SIZE;
    } else if (values?.length) {
        // Left/right axis (y-axis)
        const maxTextWidth = Math.max(
            ...values.map((v) => measureTextWidth(v, UPLOT_AXIS_FONT_SIZE))
        );
        // Limit to 40% of plot width
        const textWidthWithLimit = Math.min(self.width * 0.4, maxTextWidth);
        axisSize += (axis.gap ?? 5) + (axis.labelGap ?? 0) + textWidthWithLimit;
    }

    return Math.ceil(axisSize);
}

/** Simple text width measurement */
function measureTextWidth(text: string, fontSize: number): number {
    // Rough estimate: ~0.6 * fontSize per character for monospace
    return text.length * fontSize * 0.6;
}

export function getUPlotSideFromAxis(axis: AxisPlacement): number {
    switch (axis) {
        case AxisPlacement.Top:
            return 0;
        case AxisPlacement.Right:
            return 1;
        case AxisPlacement.Bottom:
            return 2;
        case AxisPlacement.Left:
            return 3;
        default:
            return 3; // default to left
    }
}

function optMinMax(
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
