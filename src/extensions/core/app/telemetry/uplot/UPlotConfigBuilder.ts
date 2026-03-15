import uPlot, { Cursor, Band, Hooks, Select, Padding, Series, Axis, Scale } from 'uplot';

import { PlotConfig } from './types';
import { DEFAULT_PLOT_CONFIG, pluginLog } from './utils';

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

export interface SeriesConfig {
  label?: string;
  stroke?: string;
  width?: number;
  fill?: string;
  points?: {
    show?: boolean;
    size?: number;
  };
  spanGaps?: boolean;
  scale?: string;
}

export interface AxisConfig {
  scale?: string;
  side?: 0 | 1 | 2 | 3; // 0=top, 1=right, 2=bottom, 3=left
  stroke?: string; // Text color for axis labels and values
  grid?: {
    show?: boolean;
    stroke?: string;
    width?: number;
  };
  label?: string;
  labelSize?: number;
  labelFont?: string;
  size?: number;
  values?: (u: uPlot, vals: any[]) => string[];
  font?: string;
}

export interface ScaleConfig {
  time?: boolean;
  auto?: boolean;
  range?: [number | null, number | null] | ((u: uPlot, min: number, max: number) => [number, number]);
  min?: number;
  max?: number;
}

export class UPlotConfigBuilder {
  readonly uid = Math.random().toString(36).slice(2);

  private seriesConfigs: SeriesConfig[] = [];
  private axisConfigs: Axis[] = [];
  private scaleConfigs: Record<string, ScaleConfig> = {};
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

  addAxis(config: AxisConfig) {
    this.axisConfigs.push(config as Axis);
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

  addSeries(config: SeriesConfig) {
    this.seriesConfigs.push(config);
    this.invalidateCache();
  }

  /** Add or update the scale with the scale key */
  addScale(scaleKey: string, config: ScaleConfig) {
    this.scaleConfigs[scaleKey] = config;
    this.invalidateCache();
  }

  addBand(band: Band) {
    this.bands.push(band);
    this.invalidateCache();
  }

  setPadding(padding: Padding) {
    this.padding = padding;
    this.invalidateCache();
  }

  private invalidateCache() {
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

    config.axes = this.axisConfigs;
    config.series = [...config.series, ...this.seriesConfigs as Series[]];
    config.scales = this.scaleConfigs as Record<string, Scale>;

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
