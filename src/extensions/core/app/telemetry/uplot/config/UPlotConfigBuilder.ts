import uPlot, { Cursor, Band, Hooks, Select, Padding, Series } from 'uplot';

import { PlotConfig } from '../types';
import { DEFAULT_PLOT_CONFIG, pluginLog } from '../utils';
import { UPlotAxisBuilder, AxisProps } from './UPlotAxisBuilder';
import { UPlotScaleBuilder, ScaleProps } from './UPlotScaleBuilder';
import { UPlotSeriesBuilder, SeriesProps } from './UPlotSeriesBuilder';

const cursorDefaults: Cursor = {
    // prevent client-side zoom from triggering at the end of a selection
    drag: { setScale: false },
    points: {
        size: (u, seriesIdx) => u.series[seriesIdx].points?.size ? u.series[seriesIdx].points.size * 2 : 8,
        width: (u, seriesIdx, size) => size / 4,
    },
    focus: {
        prox: 30,
    },
};

export class UPlotConfigBuilder {
    readonly uid = Math.random().toString(36).slice(2);

    private series: UPlotSeriesBuilder[] = [];
    private axes: Record<string, UPlotAxisBuilder> = {};
    private scales: UPlotScaleBuilder[] = [];
    private bands: Band[] = [];
    private cursor: Cursor | undefined;
    private select: uPlot.Select | undefined;
    private hooks: Hooks.Arrays = {};
    private mode: uPlot.Mode = 1;
    private padding?: Padding = undefined;

    private cachedConfig?: PlotConfig;

    constructor() { }

    addHook<T extends keyof Hooks.Defs>(type: T, hook: Hooks.Defs[T]) {
        pluginLog('UPlotConfigBuilder', false, 'addHook', type);

        if (!this.hooks[type]) {
            this.hooks[type] = [];
        }

        this.hooks[type].push(hook);
    }

    addAxis(props: AxisProps) {
        const scaleKey = props.scaleKey;

        if (this.axes[scaleKey]) {
            this.axes[scaleKey].merge(props);
            return;
        }

        this.axes[scaleKey] = new UPlotAxisBuilder(props);
        this.invalidateCache();
    }

    addScale(props: ScaleProps) {
        const current = this.scales.find((s) => s.props.scaleKey === props.scaleKey);
        if (current) {
            current.merge(props);
            return;
        }
        this.scales.push(new UPlotScaleBuilder(props));
        this.invalidateCache();
    }

    addSeries(props: SeriesProps) {
        this.series.push(new UPlotSeriesBuilder(props));
        this.invalidateCache();
    }

    getSeries() {
        return this.series;
    }

    addBand(band: Band) {
        this.bands.push(band);
        this.invalidateCache();
    }

    setCursor(cursor?: Cursor) {
        this.cursor = { ...this.cursor, ...cursor };
        this.invalidateCache();
    }

    setMode(mode: uPlot.Mode) {
        this.mode = mode;
        this.invalidateCache();
    }

    setSelect(select: Select) {
        this.select = select;
        this.invalidateCache();
    }

    setPadding(padding: Padding) {
        this.padding = padding;
        this.invalidateCache();
    }

    invalidateCache() {
        this.cachedConfig = undefined;
    }

    getConfig(): PlotConfig {
        if (this.cachedConfig) {
            return this.cachedConfig;
        }

        const config: PlotConfig = {
            ...DEFAULT_PLOT_CONFIG,
            mode: this.mode,
            series: [
                this.mode === 2
                    ? (null as unknown as Series)
                    : {
                        value: () => '',
                    },
            ],
        };

        // Build axes
        config.axes = Object.values(this.axes).map((builder) => builder.getConfig());

        // Build series
        config.series = [...config.series, ...this.series.map((builder) => builder.getConfig())];

        // Build scales
        config.scales = this.scales.reduce((acc, builder) => {
            return { ...acc, ...builder.getConfig() };
        }, {});

        config.hooks = this.hooks;
        config.select = this.select;

        config.cursor = {
            ...cursorDefaults,
            ...this.cursor,
        };

        if (Array.isArray(this.padding)) {
            config.padding = this.padding;
        }

        if (this.bands.length) {
            config.bands = this.bands;
        }

        this.cachedConfig = config;

        return config;
    }
}
