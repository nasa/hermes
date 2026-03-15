import React, {
    useCallback,
    useState,
    useEffect,
    useRef,
} from 'react';
import { createRoot } from 'react-dom/client';
import uPlot from 'uplot';


import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser';
import type { BackendPlotMessage, FrontendPlotMessage, TelemetrySeries, TelemetrySeriesData } from '../../common/telemetry';

import 'uplot/dist/uPlot.min.css';
import './style.css';
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

    const plotContainerRef = useRef<HTMLDivElement>(null);
    const plotRef = useRef<uPlot | null>(null);

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
            case 'full':
                // Replace all data with new full dataset
                setPlotData(msg.data);
                break;

            case 'append':
                // Append new points to existing data
                setPlotData(prev => {
                    const next = { ...prev };
                    for (const [channelKey, newData] of Object.entries(msg.data)) {
                        if (!next[channelKey]) {
                            continue; // Skip if channel not in current data
                        }

                        // Append new data points
                        const existing = next[channelKey].data;
                        next[channelKey] = {
                            ...next[channelKey],
                            data: {
                                time: [...existing.time, ...newData.time],
                                sclk: [...existing.sclk, ...newData.sclk],
                                valueStr: existing.valueStr && newData.valueStr
                                    ? [...existing.valueStr, ...newData.valueStr]
                                    : undefined,
                                valueNum: existing.valueNum && newData.valueNum
                                    ? [...existing.valueNum, ...newData.valueNum]
                                    : undefined,
                            }
                        };
                    }
                    return next;
                });
                break;
        }
    }, []);

    useEffect(() => {
        const disp = messages.onDidReceiveMessage(handleMessages);
        return () => disp.dispose();
    }, [handleMessages]);

    // Update plot when data changes
    useEffect(() => {
        const channelEntries = Object.entries(plotData);

        if (!plotContainerRef.current || channelEntries.length === 0) {
            if (plotRef.current) {
                plotRef.current.destroy();
                plotRef.current = null;
            }
            return;
        }

        // Merge all timestamps and create aligned data
        const allTimes = new Set<number>();
        channelEntries.forEach(([, { data }]) => {
            data.time.forEach((t: number) => allTimes.add(t));
        });

        const sortedTimes = Array.from(allTimes).sort((a, b) => a - b);

        if (sortedTimes.length === 0) {
            return;
        }

        // Build uplot data structure: [times, series1, series2, ...]
        const uplotData: uPlot.AlignedData = [sortedTimes.map(t => t / 1000)]; // Convert to seconds

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

        // Create or update plot
        const opts: uPlot.Options = {
            width: plotContainerRef.current.clientWidth,
            height: 400,
            scales: {
                x: {
                    time: true,
                },
            },
            axes: [
                {
                    label: "Time",
                },
                {
                    label: "Value",
                },
            ],
            series: [
                { label: "Time" },
                ...channelEntries.map(([key, { info }]) => ({
                    label: `${info.component}.${info.name}`,
                    stroke: `hsl(${Math.abs(hashCode(key)) % 360}, 70%, 50%)`,
                    width: 2,
                })),
            ],
        };

        // Destroy and recreate if series count changed, otherwise just update data
        if (!plotRef.current ||
            (plotRef.current.series.length - 1) !== channelEntries.length) {
            if (plotRef.current) {
                plotRef.current.destroy();
            }

            plotRef.current = new uPlot(opts, uplotData, plotContainerRef.current);
        } else {
            plotRef.current.setData(uplotData);
        }
    }, [plotData]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (plotRef.current && plotContainerRef.current) {
                plotRef.current.setSize({
                    width: plotContainerRef.current.clientWidth,
                    height: 400
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Cleanup plot on unmount
    useEffect(() => {
        return () => {
            if (plotRef.current) {
                plotRef.current.destroy();
                plotRef.current = null;
            }
        };
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
                    <div ref={plotContainerRef} className="plot-container" />
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
