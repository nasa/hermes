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

import { UPlotChart, UPlotConfigBuilder } from './uplot';
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

function TelemetryPlot() {
    const [timeWindow, setTimeWindow] = useState<number>(DEFAULT_TIME_WINDOW);
    const [plotData, setPlotData] = useState<Record<string, { info: TelemetrySeries; data: TelemetrySeriesData }>>({});
    const [plotDimensions, setPlotDimensions] = useState({ width: 800, height: 400 });
    const [plotConfig, setPlotConfig] = useState<UPlotConfigBuilder>(() => {
        const builder = new UPlotConfigBuilder();
        builder.addScale('x', { time: true });
        builder.addScale('y', { auto: true });
        builder.addAxis({ scale: 'x', side: 2, label: 'Time' });
        builder.addAxis({ scale: 'y', side: 3, label: 'Value' });
        return builder;
    });

    const plotContainerRef = useRef<HTMLDivElement>(null);

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

                // Add scales
                builder.addScale('x', { time: true });
                builder.addScale('y', { auto: true });

                // Add axes
                builder.addAxis({ scale: 'x', side: 2, label: 'Time' });
                builder.addAxis({ scale: 'y', side: 3 });

                // Add series
                channelEntries.forEach(([key, { info }]) => {
                    builder.addSeries({
                        label: `${info.component}.${info.name}`,
                        stroke: `hsl(${Math.abs(hashCode(key)) % 360}, 70%, 50%)`,
                        width: 2,
                        scale: 'y',
                    });
                });

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
    const data = useMemo(() => {
        const channelEntries = Object.entries(plotData);

        if (channelEntries.length === 0) {
            return [[], []] as uPlot.AlignedData;
        }

        // Merge all timestamps and create aligned data
        const allTimes = new Set<number>();
        channelEntries.forEach(([, { data }]) => {
            data.time.forEach((t: number) => allTimes.add(t));
        });

        const sortedTimes = Array.from(allTimes).sort((a, b) => a - b);

        // Build uplot data structure: [times, series1, series2, ...]
        const uplotData: uPlot.AlignedData = [sortedTimes];

        channelEntries.forEach(([, { data }]) => {
            const seriesValues: (number | null)[] = [];
            const dataMap = new Map<number, number>();

            // Build map from time to value
            data.time.forEach((t: number, i: number) => {
                const value = data.valueNum?.[i];
                if (value !== undefined) {
                    dataMap.set(t, value);
                }
            });

            sortedTimes.forEach(t => {
                seriesValues.push(dataMap.get(t) ?? null);
            });

            uplotData.push(seriesValues);
        });

        return uplotData;
    }, [plotData]);

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
                            data={data}
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

// Simple hash function for consistent colors
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

const rootDOM = document.getElementById('root');
if (rootDOM) {
    const root = createRoot(rootDOM);
    root.render(<TelemetryPlot />);
}
