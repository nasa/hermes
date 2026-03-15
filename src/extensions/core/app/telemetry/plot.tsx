import React, {
    useCallback,
    useState,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { createRoot } from 'react-dom/client';
import uPlot from 'uplot';

import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser';
import type { BackendPlotMessage, FrontendPlotMessage, TelemetrySeries, TelemetrySeriesData } from '../../common/telemetry';

import { UPlotChart, UPlotConfigBuilder, AxisPlacement, type ScaleProps, ScaleDirection, ScaleOrientation } from './uplot';
import './plot.css';

import { VscodeOption, VscodeSingleSelect } from '@vscode-elements/react-elements';

const messages = getMessages<FrontendPlotMessage, BackendPlotMessage>();

// Default time window: 5 minutes
const DEFAULT_TIME_WINDOW = 5 * 60 * 1000;

const TIME_WINDOWS = [
    { label: "1m", value: 60 * 1000 },
    { label: "5m", value: 5 * 60 * 1000 },
    { label: "30m", value: 30 * 60 * 1000 },
    { label: "1h", value: 60 * 60 * 1000 },
    { label: "All", value: Infinity },
];

const palette = [
    '#7EB26D', // 0: pale green
    '#EAB839', // 1: mustard
    '#6ED0E0', // 2: light blue
    '#EF843C', // 3: orange
    '#E24D42', // 4: red
    '#1F78C1', // 5: ocean
    '#BA43A9', // 6: purple
    '#705DA0', // 7: violet
    '#508642', // 8: dark green
    '#CCA300', // 9: dark sand
];

// Helper to get CSS variable value
function getCSSVariable(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Creates an x-axis scale configuration with a fixed time range.
 * For finite time windows, the scale shows the last N milliseconds from "now".
 * For infinite time windows (All mode), the scale shows all available data.
 */
function createTimeScaleProps(timeWindow: number): ScaleProps {
    return {
        scaleKey: 'x',
        isTime: true,
        range: (_u, dataMin, dataMax) => {
            if (timeWindow === Infinity) {
                // For "All" mode, show all data
                return [dataMin, dataMax];
            }
            // For fixed time windows, show the last N milliseconds
            const now = Date.now();
            const min = now - (timeWindow);
            return [min, now];
        },
    };
}

function TelemetryPlot() {
    const [timeWindow, setTimeWindow] = useState<number>(DEFAULT_TIME_WINDOW);
    const [plotData, setPlotData] = useState<Record<string, { info: TelemetrySeries; data: TelemetrySeriesData }>>({});
    const [plotDimensions, setPlotDimensions] = useState({ width: 800, height: 400 });
    const [plotConfig, setPlotConfig] = useState<UPlotConfigBuilder | null>(null);
    const [tick, setTick] = useState(0); // Force periodic rerenders

    const plotContainerRef = useRef<HTMLDivElement>(null);

    // Periodic rerender to keep time axis relative to wall clock
    useEffect(() => {
        if (timeWindow === Infinity) {
            return; // No need to update time axis in "All" mode
        }

        // Update every second to keep the time axis moving
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 100);

        return () => clearInterval(interval);
    }, [timeWindow]);

    // Initialize messages
    useEffect(() => {
        messages.postMessage({ type: 'refresh' });
    }, []);

    // Send time window to backend when it changes
    useEffect(() => {
        messages.postMessage({ type: 'timeWindow', timeWindow });
    }, [timeWindow]);

    // Handle messages from backend
    const handleMessages = useCallback((msg: BackendPlotMessage) => {
        switch (msg.type) {
            case 'full': {
                // Replace all data with new full dataset
                setPlotData(msg.data);

                // Rebuild config when channel list changes (full refresh)
                const channelEntries = Object.entries(msg.data);
                const builder = new UPlotConfigBuilder();

                // Add scales with fixed time range
                builder.addScale(createTimeScaleProps(timeWindow));
                builder.addScale({
                    scaleKey: 'y',
                    auto: true,
                    direction: ScaleDirection.Down,
                    orientation: ScaleOrientation.Vertical
                });

                builder.setCursor({
                    points: {
                        size: (u, seriesIdx) => (u.series[seriesIdx].points?.size ?? 0) * 1.5,
                        width: (u, seriesIdx, size) => size / 4,
                        // @ts-expect-error Stroke is a callback
                        stroke: (u, seriesIdx) => (u.series[seriesIdx].points?.stroke?.(u, seriesIdx) ?? "") + '90',
                        fill: () => "#fff",
                    }
                });

                const axisColor = getCSSVariable('--vscode-editor-foreground') ?? '#c7d0d9';

                // Add axes
                builder.addAxis({
                    scaleKey: 'x',
                    placement: AxisPlacement.Bottom,
                    stroke: axisColor,
                    grid: {
                        width: 1 / devicePixelRatio,
                        stroke: "#2c3235",
                    },
                    ticks: {
                        width: 1 / devicePixelRatio,
                        stroke: "#2c3235",
                    }
                });
                builder.addAxis({
                    scaleKey: 'y', placement: AxisPlacement.Left,
                    stroke: axisColor,
                    grid: {
                        width: 1 / devicePixelRatio,
                        stroke: "#2c3235",
                    },
                    ticks: {
                        width: 1 / devicePixelRatio,
                        stroke: "#2c3235",
                    }
                });

                // Add series
                let index = 0;
                for (const [_, { info }] of channelEntries) {
                    if (index >= palette.length) {
                        break;
                    }

                    builder.addSeries({
                        scaleKey: 'y',
                        label: `${info.component}.${info.name}`,
                        stroke: palette[index],
                        width: 2,
                    });

                    index++;
                }

                setPlotConfig(builder);
                break;
            }

            case 'append':
                // Append new points to existing data
                setPlotData(prev => {
                    const next = { ...prev };
                    const now = Date.now();
                    const cutoffTime = timeWindow === Infinity ? 0 : now - timeWindow;

                    for (const [channelKey, newData] of Object.entries(msg.data)) {
                        if (!next[channelKey]) {
                            continue; // Skip if channel not in current data
                        }

                        // Append new data points
                        const existing = next[channelKey].data;
                        const combinedData = {
                            time: [...existing.time, ...newData.time],
                            sclk: [...existing.sclk, ...newData.sclk],
                            valueStr: existing.valueStr && newData.valueStr
                                ? [...existing.valueStr, ...newData.valueStr]
                                : undefined,
                            valueNum: existing.valueNum && newData.valueNum
                                ? [...existing.valueNum, ...newData.valueNum]
                                : undefined,
                        };

                        // Cull points outside the time window
                        if (timeWindow !== Infinity) {
                            const startIdx = combinedData.time.findIndex(t => t >= cutoffTime);
                            if (startIdx > 0) {
                                combinedData.time = combinedData.time.slice(startIdx);
                                combinedData.sclk = combinedData.sclk.slice(startIdx);
                                if (combinedData.valueStr) {
                                    combinedData.valueStr = combinedData.valueStr.slice(startIdx);
                                }
                                if (combinedData.valueNum) {
                                    combinedData.valueNum = combinedData.valueNum.slice(startIdx);
                                }
                            }
                        }

                        next[channelKey] = {
                            ...next[channelKey],
                            data: combinedData,
                        };
                    }
                    return next;
                });
                break;
        }
    }, [timeWindow]);

    useEffect(() => {
        const disp = messages.onDidReceiveMessage(handleMessages);

        return () => disp.dispose();
    }, [handleMessages]);

    // Build uPlot data (separate from config)
    // Depends on tick to force rerender even when no new data arrives
    const data = useMemo<uPlot.AlignedData>(() => {
        const channels = Object.values(plotData);
        if (channels.length === 0) {
            return [[], []];
        }

        return uPlot.join(
            channels.map(({ data }) => [
                data.time,
                data.valueNum!
            ])
        );
    }, [plotData]);

    const realtimeData = useMemo<uPlot.AlignedData>(() => [...data], [data, tick]);

    // Handle window resize and measure container
    useEffect(() => {
        const updateDimensions = () => {
            if (plotContainerRef.current) {
                const rect = plotContainerRef.current.getBoundingClientRect();
                setPlotDimensions({
                    width: rect.width || 800,
                    height: 400,
                });
            }
        };

        // Initial measurement
        updateDimensions();

        // Update on resize
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const channelCount = Object.keys(plotData).length;

    return (
        <div className="telemetry-container">
            <div className="toolbar">
                <VscodeSingleSelect
                    style={{ width: "6em" }}
                    value={timeWindow.toString()}
                    onChange={e => setTimeWindow(parseInt((e.target as any).value))}
                >
                    {TIME_WINDOWS.map(tw => (
                        <VscodeOption key={tw.label} value={tw.value.toString()}>
                            {tw.label}
                        </VscodeOption>
                    ))}
                </VscodeSingleSelect>
            </div>

            <div className="plot-area">
                {channelCount === 0 ? (
                    <div className="plot-placeholder">
                        Select channels to plot in the table view
                    </div>
                ) : (
                    <div ref={plotContainerRef} className="plot-container">
                        <UPlotChart
                            data={realtimeData}
                            config={plotConfig}
                            width={plotDimensions.width}
                            height={plotDimensions.height}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

const rootDOM = document.getElementById('root');
if (rootDOM) {
    const root = createRoot(rootDOM);
    root.render(<TelemetryPlot />);
}
