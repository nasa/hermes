import uPlot, { Series } from 'uplot';

export enum LineInterpolation {
    Linear = 'linear',
    Smooth = 'smooth',
    StepBefore = 'stepBefore',
    StepAfter = 'stepAfter',
}

export interface SeriesProps {
    scaleKey: string;
    label?: string;
    stroke?: string | Series.Stroke;
    width?: number;
    fill?: string | Series.Fill;
    fillOpacity?: number;
    dash?: number[];
    points?: {
        show?: boolean | Series.Points.Show;
        size?: number;
        stroke?: string | Series.Stroke;
        fill?: string | Series.Fill;
    };
    lineInterpolation?: LineInterpolation;
    spanGaps?: boolean;
    show?: boolean;
    value?: Series.Value;
}

export class UPlotSeriesBuilder {
    constructor(public props: SeriesProps) {}

    getConfig(): Series {
        const {
            scaleKey,
            label,
            stroke,
            width = 1,
            fill,
            fillOpacity = 0,
            dash,
            points,
            lineInterpolation = LineInterpolation.Linear,
            spanGaps = false,
            show = true,
            value,
        } = this.props;

        const config: Series = {
            scale: scaleKey,
            label: label || '',
            show,
            stroke: stroke || 'currentColor',
            width,
            spanGaps,
            value: value || (() => ''),
        };

        // Line styling
        if (dash) {
            config.dash = dash;
        }

        // Path builder for line interpolation
        config.paths = getPathBuilder(lineInterpolation);

        // Fill
        if (fill && fillOpacity > 0) {
            if (typeof fill === 'string') {
                // Convert hex/rgb to rgba with opacity
                config.fill = addAlpha(fill, fillOpacity);
            } else {
                config.fill = fill;
            }
        }

        // Points configuration
        if (points) {
            config.points = {
                show: points.show ?? false,
                size: points.size ?? 5,
                stroke: (points.stroke ?? stroke) || 'currentColor',
                fill: (points.fill ?? stroke) || 'currentColor',
            };
        }

        return config;
    }
}

interface PathBuilders {
    linear: Series.PathBuilder;
    smooth: Series.PathBuilder;
    stepBefore: Series.PathBuilder;
    stepAfter: Series.PathBuilder;
}

let builders: PathBuilders | undefined;

function getPathBuilder(interpolation: LineInterpolation): Series.PathBuilder {
    const pathBuilders = uPlot.paths;

    if (!builders) {
        builders = {
            linear: pathBuilders.linear!(),
            smooth: pathBuilders.spline!(),
            stepBefore: pathBuilders.stepped!({ align: -1 }),
            stepAfter: pathBuilders.stepped!({ align: 1 }),
        };
    }

    switch (interpolation) {
        case LineInterpolation.Smooth:
            return builders.smooth;
        case LineInterpolation.StepBefore:
            return builders.stepBefore;
        case LineInterpolation.StepAfter:
            return builders.stepAfter;
        default:
            return builders.linear;
    }
}

/** Add alpha channel to color string */
function addAlpha(color: string, alpha: number): string {
    // Normalize alpha to 0-1
    const a = Math.max(0, Math.min(1, alpha / 100));

    // Handle hex colors
    if (color.startsWith('#')) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // Handle rgb/rgba
    if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
            return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${a})`;
        }
    }

    // Handle hsl
    if (color.startsWith('hsl')) {
        return color.replace('hsl', 'hsla').replace(')', `, ${a})`);
    }

    // Fallback: just return the color
    return color;
}
