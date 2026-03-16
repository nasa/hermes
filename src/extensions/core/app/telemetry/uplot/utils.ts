import { Options, PaddingSide } from 'uplot';

const paddingSide: PaddingSide = (u, side, sidesWithAxes) => {
  const hasCrossAxis = side % 2 ? sidesWithAxes[0] || sidesWithAxes[2] : sidesWithAxes[1] || sidesWithAxes[3];

  return sidesWithAxes[side] || !hasCrossAxis ? 0 : 8;
};

export const DEFAULT_PLOT_CONFIG: Partial<Options> = {
  ms: 1,
  focus: {
    alpha: 1,
  },
  cursor: {
    focus: {
      prox: 30,
    },
  },
  legend: {
    show: false,
  },
  padding: [paddingSide, paddingSide, paddingSide, paddingSide],
  series: [],
  hooks: {},
};

/**
 * Simple logging utility for development
 */
export function pluginLog(component: string, force: boolean, ...args: any[]) {
  if (force || process.env.NODE_ENV === 'development') {
    console.log(`[${component}]`, ...args);
  }
}
