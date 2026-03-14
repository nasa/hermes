import React, {
    useCallback,
    useState,
    useEffect,
    useRef,
} from 'react';
import { createRoot } from 'react-dom/client';
import uPlot from 'uplot';

import { TimeFormat } from '@gov.nasa.jpl.hermes/types';

import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser';
import type { BackendMessage, FrontendMessage, TelemetrySeriesData } from '../../common/telemetry';

import 'uplot/dist/uPlot.min.css';
import './style.css';

const messages = getMessages<FrontendMessage, BackendMessage>();

interface ChannelInfo {
    index: number;
    key: string;
    source: string;
    component: string;
    name: string;
    // Latest values for table display
    time: number;
    sclk: number;
    valueStr: string;
    valueNum?: number;
    isNumerical: boolean;
}

const localTimeOffset = (new Date()).getTimezoneOffset() * 60000;

function formatTimeForPlot(time: number, format: TimeFormat): string {
    const date = new Date(time);
    switch (format) {
        case TimeFormat.UTC:
            return date.toISOString().slice(11, 19); // HH:MM:SS
        case TimeFormat.LOCAL:
            return new Date(time - localTimeOffset).toISOString().slice(11, 19);
        case TimeFormat.SCLK:
            return (time / 1000).toFixed(1); // Convert to seconds
        default:
            return date.toISOString().slice(11, 19);
    }
}

function TelemetryPlot() {
    const [channels, setChannels] = useState<ChannelInfo[]>([]);
    const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set());
    const [plotDataMap, setPlotDataMap] = useState<Map<string, TelemetrySeriesData>>(new Map());

    const plotContainerRef = useRef<HTMLDivElement>(null);
    const plotRef = useRef<uPlot | null>(null);

    // Initialize messages
    useEffect(() => {
        messages.postMessage({ type: 'refresh' });
    }, []);

    // Handle messages from backend
    const handleMessages = useCallback((msg: BackendMessage) => {
        switch (msg.type) {
            case 'append':
                setChannels(prev => {
                    const channelMap = new Map(prev.map(ch => [ch.key, ch]));

                    // Process each telemetry point
                    for (const telem of msg.points) {
                        const component = telem.def.component ?? '';
                        const name = telem.def.name ?? '';
                        const key = `${telem.source}.${component}.${name}`;
                        const existing = channelMap.get(key);

                        const time = telem.time ?? Date.now();
                        const sclk = telem.time ?? 0;
                        const value = telem.value;

                        // Process value based on type
                        let valueStr: string = '';
                        let valueNum: number | undefined = undefined;

                        if (value !== null && value !== undefined) {
                            switch (typeof value) {
                                case 'string':
                                    valueStr = value;
                                    break;
                                case 'number':
                                    valueStr = value.toFixed(3);
                                    valueNum = value;
                                    break;
                                case 'bigint':
                                    valueNum = Number(value);
                                    valueStr = String(valueNum);
                                    break;
                                case 'boolean':
                                    valueStr = value.toString();
                                    break;
                                default:
                                    valueStr = JSON.stringify(value);
                                    break;
                            }
                        }

                        channelMap.set(key, {
                            source: telem.source,
                            component,
                            name,
                            index: existing?.index ?? channelMap.size,
                            key,
                            time,
                            sclk,
                            valueStr,
                            valueNum,
                            isNumerical: valueNum !== undefined && !isNaN(valueNum)
                        });
                    }

                    return Array.from(channelMap.values()).sort((a, b) => a.index - b.index);
                });
                break;

            case 'history':
                setPlotDataMap(prev => {
                    const next = new Map(prev);
                    next.set(msg.channelKey, msg.data);
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
        if (!plotContainerRef.current || selectedChannels.size === 0) {
            if (plotRef.current) {
                plotRef.current.destroy();
                plotRef.current = null;
            }
            return;
        }

        // Prepare data for uplot
        const selectedData = Array.from(selectedChannels)
            .map(key => ({
                key,
                data: plotDataMap.get(key),
                channel: channels.find(ch => ch.key === key)
            }))
            .filter(d => d.data && d.channel);

        if (selectedData.length === 0) {
            return;
        }

        // Merge all timestamps and create aligned data
        const allTimes = new Set<number>();
        selectedData.forEach(d => {
            d.data!.time.forEach((t: number) => allTimes.add(t));
        });

        const sortedTimes = Array.from(allTimes).sort((a, b) => a - b);

        // Filter by time window
        const cutoffTime = Date.now() - timeWindow;
        const filteredTimes = sortedTimes.filter(t => t >= cutoffTime);

        // Build uplot data structure: [times, series1, series2, ...]
        const plotData: uPlot.AlignedData = [filteredTimes.map(t => t / 1000)]; // Convert to seconds

        selectedData.forEach(({ data }) => {
            const seriesValues: (number | null)[] = [];
            const dataMap = new Map<number, number>();

            // Build map from time to value
            data!.time.forEach((t: number, i: number) => {
                const value = data!.valueNum?.[i];
                if (value !== undefined) {
                    dataMap.set(t, value);
                }
            });

            filteredTimes.forEach(t => {
                seriesValues.push(dataMap.get(t) ?? null);
            });

            plotData.push(seriesValues);
        });

        // Create or update plot
        const opts: uPlot.Options = {
            width: plotContainerRef.current.clientWidth,
            height: 400,
            scales: {
                x: {
                    time: false,
                },
            },
            axes: [
                {
                    label: timeFormat === TimeFormat.SCLK ? "SCLK (s)" : "Time",
                    values: (u, vals) => vals.map(v => formatTimeForPlot(v * 1000, timeFormat)),
                },
                {
                    label: "Value",
                },
            ],
            series: [
                { label: "Time" },
                ...selectedData.map(({ channel }) => ({
                    label: `${channel!.component}.${channel!.name}`,
                    stroke: `hsl(${Math.abs(hashCode(channel!.key)) % 360}, 70%, 50%)`,
                    width: 2,
                })),
            ],
        };

        // Destroy and recreate if series count changed, otherwise just update data
        if (!plotRef.current ||
            (plotRef.current.series.length - 1) !== selectedData.length) {
            if (plotRef.current) {
                plotRef.current.destroy();
            }

            plotRef.current = new uPlot(opts, plotData, plotContainerRef.current);
        } else {
            plotRef.current.setData(plotData);
        }
    }, [selectedChannels, plotDataMap, channels, timeWindow, timeFormat]);

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

    if (channels.length === 0) {
        return <p style={{ width: "100%", textAlign: 'center' }}>
            Waiting for telemetry...
        </p>;
    }

    return (
        <div className="telemetry-container">
            <div className="plot-area">
                {selectedChannels.size === 0 ? (
                    <div className="plot-placeholder">
                        Select channels to plot
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
