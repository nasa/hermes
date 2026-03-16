import React, {
    useCallback,
    useState,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { createRoot } from 'react-dom/client';
import uPlot from 'uplot';

import { getMessages, vscode } from '@gov.nasa.jpl.hermes/vscode/browser';
import type { BackendPlotMessage, FrontendPlotMessage, TelemetrySeries, TelemetrySeriesData } from '../../common/telemetry';

import { UPlotChart, UPlotConfigBuilder, AxisPlacement, type ScaleProps, ScaleDirection, ScaleOrientation, LineInterpolation } from './uplot';
import { VizLegendTable, VizLegendItem } from './VizLegend';
import './plot.css';

import {
    VscodeButton,
    VscodeButtonGroup,
    VscodeOption,
    VscodeSingleSelect
} from '@vscode-elements/react-elements';

const messages = getMessages<FrontendPlotMessage, BackendPlotMessage>();

// Default time window: 5 minutes
const DEFAULT_TIME_WINDOW = 5 * 60 * 1000;

const TIME_WINDOWS = [
    { label: "1m", value: 60 * 1000 },
    { label: "5m", value: 5 * 60 * 1000 },
    { label: "30m", value: 30 * 60 * 1000 },
    { label: "1h", value: 60 * 60 * 1000 },
    { label: "3h", value: 3 * 60 * 60 * 1000 },
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

interface PlotState {
    timeWindow: number;
    interpolationMode: LineInterpolation;
}

const initialState = vscode.getState<PlotState | undefined>() ?? {
    timeWindow: DEFAULT_TIME_WINDOW,
    interpolationMode: LineInterpolation.Linear
};

function TelemetryPlot() {
    const [timeWindow, setTimeWindow] = useState(initialState.timeWindow);
    const [interpolationMode, setInterpolationMode] = useState(initialState.interpolationMode);

    const [plotInfo, setPlotInfo] = useState<Record<string, TelemetrySeries>>({});
    const [plotData, setPlotData] = useState<Record<string, TelemetrySeriesData>>({});
    const [plotDimensions, setPlotDimensions] = useState({ width: 800, height: 400 });
    // const [plotConfig, setPlotConfig] = useState<UPlotConfigBuilder | null>(null);

    const [tick, setTick] = useState(0); // Force periodic rerenders
    // const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
    const [disabledSeries, setDisabledSeries] = useState<Set<string>>(new Set());

    const plotContainerRef = useRef<HTMLDivElement>(null);

    // Initialize messages
    useEffect(() => {
        messages.postMessage({ type: 'refresh' });
    }, []);

    useEffect(() => {
        vscode.setState({
            timeWindow,
            interpolationMode,
        });
    }, [timeWindow, interpolationMode]);

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
                setPlotInfo(msg.info);
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
                        const existing = next[channelKey];
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
                            ...combinedData,
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
        // Filter out disabled series
        const enabledChannels = Object.entries(plotData)
            .filter(([channelKey]) => !disabledSeries.has(channelKey))
            .map(([_, data]) => data);

        if (enabledChannels.length === 0) {
            return [[], []];
        }

        return uPlot.join(
            enabledChannels.map((data) => [
                data.time,
                data.valueNum!
            ])
        );
    }, [plotData, disabledSeries]);

    const plotConfig = useMemo(() => {
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

        // Add series (only enabled ones)
        let index = 0;
        for (const [channelKey, info] of Object.entries(plotInfo)) {
            if (index >= palette.length) {
                break;
            }

            // Skip disabled series
            if (!disabledSeries.has(channelKey)) {
                builder.addSeries({
                    scaleKey: 'y',
                    label: `${info.component}.${info.name}`,
                    stroke: palette[index],
                    lineInterpolation: interpolationMode,
                    width: 2,
                });
            }

            index++;
        }

        return builder;
    }, [plotInfo, interpolationMode, disabledSeries]);

    // Periodic rerender to keep time axis relative to wall clock
    useEffect(() => {
        // Update every second to keep the time axis moving
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const realtimeData = useMemo<uPlot.AlignedData>(
        () => [...data], [data, tick]
    );

    // Handle resize and measure container using ResizeObserver
    useEffect(() => {
        if (!plotContainerRef.current) {
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setPlotDimensions({
                    width: width || 800,
                    height: height || 400,
                });
            }
        });

        resizeObserver.observe(plotContainerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const channelCount = Object.keys(plotData).length;

    // Create legend items from plot data
    const legendItems = useMemo<VizLegendItem[]>(() => {
        const items: VizLegendItem[] = [];
        let index = 0;

        for (const [channelKey, info] of Object.entries(plotInfo)) {
            if (index >= palette.length) {
                break;
            }

            const data = plotData[channelKey];
            const label = `${info.component}.${info.name}`;

            // Calculate statistics if numeric data is available
            const getDisplayValues = data?.valueNum && data.valueNum.length > 0 ? () => {
                const values = data.valueNum!;
                const latest = values[values.length - 1];
                const min = Math.min(...values);
                const max = Math.max(...values);

                return [
                    {
                        title: 'Min',
                        numeric: min,
                        text: min.toFixed(2),
                    },
                    {
                        title: 'Max',
                        numeric: max,
                        text: max.toFixed(2),
                    },
                    {
                        title: 'Last',
                        numeric: latest,
                        text: latest?.toFixed(2) ?? 'N/A',
                    },
                ];
            } : undefined;

            items.push({
                label,
                color: palette[index],
                yAxis: 1,
                disabled: disabledSeries.has(channelKey),
                fieldName: channelKey,
                getDisplayValues,
                getItemKey: () => channelKey,
                lineStyle: { fill: 'solid' },
            });

            index++;
        }

        return items;
    }, [plotInfo, plotData, disabledSeries]);

    const handleLegendClick = useCallback((item: VizLegendItem) => {
        const channelKey = item.fieldName;
        if (!channelKey) {
            return;
        }

        setDisabledSeries(prev => {
            const next = new Set(prev);
            if (next.has(channelKey)) {
                next.delete(channelKey);
            } else {
                next.add(channelKey);
            }
            return next;
        });
    }, []);

    // const handleLegendMouseOver = useCallback((item: VizLegendItem) => {
    //     setHoveredSeries(item.fieldName ?? null);
    // }, []);

    // const handleLegendMouseOut = useCallback(() => {
    //     setHoveredSeries(null);
    // }, []);

    return (
        <div className="telemetry-container">
            <div ref={plotContainerRef} className="plot-area">
                {(channelCount === 0 || plotConfig === null) ? (
                    <div className="plot-placeholder">
                        Select channels to plot in the table view
                    </div>
                ) : (
                    <div className="plot-container">
                        <UPlotChart
                            data={realtimeData}
                            config={plotConfig}
                            width={plotDimensions.width}
                            height={plotDimensions.height}
                        />
                    </div>
                )}
            </div>
            <div className="toolbar">
                <InterpolationModeButtonGroup
                    value={interpolationMode}
                    onChange={setInterpolationMode}
                />
                <VscodeSingleSelect
                    style={{ width: "5em" }}
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
            {legendItems.length > 0 && (
                <div className="legend-area">
                    <VizLegendTable
                        items={legendItems}
                        onLabelClick={handleLegendClick}
                        // onLabelMouseOver={handleLegendMouseOver}
                        // onLabelMouseOut={handleLegendMouseOut}
                        isSortable={true}
                    />
                </div>
            )}
        </div>
    );
}

function InterpolationModeButton({
    mode,
    value,
    onChange,
    children
}: React.PropsWithChildren<{ mode: LineInterpolation, value: LineInterpolation, onChange: (v: LineInterpolation) => void }>) {
    return (
        <VscodeButton onClick={() => onChange(mode)} secondary={value != mode} iconOnly>
            {children}
        </VscodeButton>
    );
}

function InterpolationModeButtonGroup({
    value, onChange
}: {
    value: LineInterpolation,
    onChange: (v: LineInterpolation) => void
}) {
    return (
        <VscodeButtonGroup className='interpolation-mode-select'>
            <InterpolationModeButton value={value} onChange={onChange} mode={LineInterpolation.Linear}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.5 20" aria-hidden="true" width="30" height="16"><circle cx="14.17" cy="2.67" r="2.67"></circle><circle cx="25.83" cy="17.33" r="2.67"></circle><rect x="19.25" y="-1.21" width="1.5" height="22.42" transform="translate(-1.79 15.03) rotate(-39.57)"></rect><circle cx="2.67" cy="17.33" r="2.67"></circle><rect x="-2.71" y="9.25" width="22.42" height="1.5" transform="translate(-4.62 10.18) rotate(-50.44)"></rect></svg>
            </InterpolationModeButton>
            <InterpolationModeButton value={value} onChange={onChange} mode={LineInterpolation.Smooth}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.34 20" aria-hidden="true" width="30" height="16"><circle cx="14.17" cy="2.67" r="2.67"></circle><circle cx="2.67" cy="17.33" r="2.67"></circle><path d="M3.42,17.33H1.92c0-6.46,4.39-15.41,12.64-15.41v1.5C7.29,3.42,3.42,11.5,3.42,17.33Z"></path><circle cx="25.67" cy="17.33" r="2.67"></circle><path d="M26.42,17.33h-1.5c0-5.83-3.87-13.91-11.14-13.91V1.92C22,1.92,26.42,10.87,26.42,17.33Z"></path></svg>
            </InterpolationModeButton>
            <InterpolationModeButton value={value} onChange={onChange} mode={LineInterpolation.StepBefore}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.34 20" aria-hidden="true" width="30" height="16"><circle cx="14.17" cy="2.67" r="2.67"></circle><circle cx="2.67" cy="17.33" r="2.67"></circle><circle cx="25.67" cy="17.33" r="2.67"></circle><polygon points="3.42 17.33 1.92 17.33 1.92 1.92 13.78 1.92 13.78 3.42 3.42 3.42 3.42 17.33"></polygon><polygon points="25.67 18.08 13.42 18.08 13.42 2.67 14.92 2.67 14.92 16.58 25.67 16.58 25.67 18.08"></polygon></svg>
            </InterpolationModeButton>
            <InterpolationModeButton value={value} onChange={onChange} mode={LineInterpolation.StepAfter}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.34 20" aria-hidden="true" width="30" height="16"><circle cx="14.17" cy="2.67" r="2.67"></circle><circle cx="25.67" cy="17.33" r="2.67"></circle><circle cx="2.67" cy="17.33" r="2.67"></circle><polygon points="26.42 17.33 24.92 17.33 24.92 3.42 14.56 3.42 14.56 1.92 26.42 1.92 26.42 17.33"></polygon><polygon points="14.92 18.08 2.67 18.08 2.67 16.58 13.42 16.58 13.42 2.67 14.92 2.67 14.92 18.08"></polygon></svg>
            </InterpolationModeButton>
        </VscodeButtonGroup>
    );
}

const rootDOM = document.getElementById('root');
if (rootDOM) {
    const root = createRoot(rootDOM);
    root.render(<TelemetryPlot />);
}
