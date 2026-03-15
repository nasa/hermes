import React, {
    useCallback,
    useState,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { createRoot } from 'react-dom/client';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
    VscodeCheckbox,
    VscodeSingleSelect,
    VscodeOption,
    VscodeTextfield,
    VscodeToolbarButton,
} from "@vscode-elements/react-elements";

import { TimeFormat } from '@gov.nasa.jpl.hermes/types';

import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser';
import type { BackendTableMessage, FrontendTableMessage, TelemetrySeries, TelemetrySeriesDataPoint } from '../../common/telemetry';

import './style.css';
import AnnotatedMultiSelect from '../common/AnnotatedMultiSelect';

const messages = getMessages<FrontendTableMessage, BackendTableMessage>();

interface ChannelInfo extends TelemetrySeries, TelemetrySeriesDataPoint {
    index: number;
    key: string;
}

const localTimeOffset = (new Date()).getTimezoneOffset() * 60000;

function formatTime(channel: ChannelInfo, format: TimeFormat): string {
    switch (format) {
        case TimeFormat.UTC:
            return new Date(channel.time).toISOString();
        case TimeFormat.LOCAL:
            return new Date(channel.time - localTimeOffset).toISOString().slice(0, -1);
        case TimeFormat.SCLK:
            return channel.sclk.toFixed(4);
        default:
            return new Date(channel.time).toISOString();
    }
}

export function TelemetryTable() {
    const [channels, setChannels] = useState<ChannelInfo[]>([]);
    const [filter, setFilter] = useState('');
    const [filteredSources, setFilteredSources] = useState<string[]>(['*']);
    const [filteredComponents, setFilteredComponents] = useState<string[]>(['*']);
    const [timeFormat, setTimeFormat] = useState<TimeFormat>(TimeFormat.SCLK);
    const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set());

    const scrollRef = useRef<HTMLDivElement>(null);

    // Extract unique sources
    const sources = useMemo(() => {
        const srcs = new Set<string>();
        for (const ch of channels) {
            srcs.add(ch.source);
        }
        return Array.from(srcs.values()).sort();
    }, [channels]);

    // Extract unique components
    const components = useMemo(() => {
        const cmps = new Set<string>();
        for (const ch of channels) {
            cmps.add(ch.component);
        }
        return Array.from(cmps.values()).sort();
    }, [channels]);

    // Filter channels
    const filteredChannels = useMemo(() => {
        let filtered = channels;

        // Filter by sources
        const sourcesSet = new Set(filteredSources);
        if (!sourcesSet.has("*")) {
            filtered = filtered.filter(v => sourcesSet.has(v.source));
        }

        // Filter by components
        const componentSet = new Set(filteredComponents);
        if (!componentSet.has("*")) {
            filtered = filtered.filter(v => componentSet.has(v.component));
        }

        // Filter by text
        const filterLower = filter.trim().toLowerCase();
        if (filterLower.length > 0) {
            filtered = filtered.filter(v =>
                v.name.toLowerCase().includes(filterLower)
            );
        }

        return filtered;
    }, [filter, filteredComponents, filteredSources, channels]);

    const virtualizer = useVirtualizer({
        count: filteredChannels.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 30,
        overscan: 20,
    });

    // Initialize messages
    useEffect(() => {
        messages.postMessage({ type: 'refresh' });
    }, []);

    // Handle messages from backend
    const handleMessages = useCallback((msg: BackendTableMessage) => {
        switch (msg.type) {
            case 'latest':
                setChannels(Object.entries(msg.channels).map(([key, chn], index) => ({
                    key,
                    index,
                    ...chn
                })));
                break;
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
        }
    }, []);

    useEffect(() => {
        const disp = messages.onDidReceiveMessage(handleMessages);
        return () => disp.dispose();
    }, [handleMessages]);

    // Toggle channel selection for plotting
    const toggleChannel = useCallback((channelKey: string, isNumerical: boolean) => {
        if (!isNumerical) return;

        setSelectedChannels(prev => {
            const next = new Set(prev);
            if (next.has(channelKey)) {
                next.delete(channelKey);
            } else {
                next.add(channelKey);
            }
            return next;
        });
    }, []);

    // Send table state to backend when selected channels or time format changes
    useEffect(() => {
        messages.postMessage({
            type: 'tableState',
            state: {
                timeFormat,
                channels: Array.from(selectedChannels)
            }
        });
    }, [selectedChannels, timeFormat]);

    const onClickClear = useCallback(() => {
        messages.postMessage({ type: 'clear' });
        setSelectedChannels(new Set());
    }, []);

    const onSourceFilterChanged = useCallback((e: any) => {
        const newValue = (e.target as any).value as string[];

        if (filteredSources.includes('*') && !newValue.includes('*')) {
            setFilteredSources([]);
        } else {
            if (newValue.includes('*')) {
                if (filteredSources.includes('*')) {
                    setFilteredSources(newValue.filter(v => v !== '*'));
                } else {
                    setFilteredSources(['*', ...newValue]);
                }
            } else {
                if (newValue.length === sources.length) {
                    setFilteredSources(['*', ...newValue]);
                } else {
                    setFilteredSources(newValue);
                }
            }
        }
    }, [filteredSources, sources]);

    useEffect(() => {
        if (filteredSources.includes("*")) {
            if (filteredSources.length - 1 < sources.length) {
                setFilteredSources(['*', ...sources]);
            }
        }
    }, [filteredSources, sources]);

    const onComponentFilterChanged = useCallback((e: any) => {
        const newValue = (e.target as any).value as string[];

        if (filteredComponents.includes('*') && !newValue.includes('*')) {
            setFilteredComponents([]);
        } else {
            if (newValue.includes('*')) {
                if (filteredComponents.includes('*')) {
                    setFilteredComponents(newValue.filter(v => v !== '*'));
                } else {
                    setFilteredComponents(['*', ...newValue]);
                }
            } else {
                if (newValue.length === components.length) {
                    setFilteredComponents(['*', ...newValue]);
                } else {
                    setFilteredComponents(newValue);
                }
            }
        }
    }, [filteredComponents, components]);

    useEffect(() => {
        if (filteredComponents.includes("*")) {
            if (filteredComponents.length - 1 < components.length) {
                setFilteredComponents(['*', ...components]);
            }
        }
    }, [filteredComponents, components]);

    if (channels.length === 0) {
        return <p style={{ width: "100%", textAlign: 'center' }}>
            Waiting for telemetry...
        </p>;
    }

    return (
        <div className="telemetry-container">
            <div className="toolbar">
                <VscodeSingleSelect
                    style={{ width: "5em" }}
                    value={timeFormat}
                    onChange={e => setTimeFormat((e.target as any).value)}
                >
                    <VscodeOption value={TimeFormat.SCLK}>SCLK</VscodeOption>
                    <VscodeOption value={TimeFormat.LOCAL}>Local</VscodeOption>
                    <VscodeOption value={TimeFormat.UTC}>UTC</VscodeOption>
                </VscodeSingleSelect>

                {sources.length > 1 && <AnnotatedMultiSelect
                    multipleLabel="Sources"
                    style={{ width: "10em" }}
                    value={filteredSources}
                    onChange={onSourceFilterChanged}
                >
                    <VscodeOption value='*'>All</VscodeOption>
                    {sources.map((src) => <VscodeOption key={src}>{src}</VscodeOption>)}
                </AnnotatedMultiSelect>}
                {components.length > 1 && <AnnotatedMultiSelect
                    multipleLabel="Components"
                    className={'components-dropdown ' + (filteredComponents.length === 1 ? 'single' : '')}
                    style={{
                        // @ts-expect-error Pass custom attribute to CSS
                        "--component-width": `${filteredComponents[0]?.length}ch`
                    }}
                    value={filteredComponents}
                    onChange={onComponentFilterChanged}
                >
                    <VscodeOption value='*'>All</VscodeOption>
                    {components?.map((cmp) => <VscodeOption key={cmp}>{cmp}</VscodeOption>)}
                </AnnotatedMultiSelect>}

                <VscodeTextfield
                    placeholder='Filter Channels'
                    style={{ flexGrow: 2, fontWeight: 400 }}
                    value={filter}
                    onInput={(e: any) => setFilter(e.target.value)}
                />

                <VscodeToolbarButton
                    title="Clear Telemetry"
                    onClick={onClickClear}
                    icon='clear-all'
                />
            </div>

            <div className='channel-list' ref={scrollRef} style={{
                overflow: "auto",
                flex: 1
            }}>
                <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Plot</th>
                                {sources.length > 1 && <th>Source</th>}
                                <th>Component</th>
                                <th>Channel</th>
                                <th>Value</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {virtualizer.getVirtualItems().map((virtualRow, index) => {
                                const channel = filteredChannels[virtualRow.index];
                                const isSelected = selectedChannels.has(channel.key);

                                return (
                                    <tr
                                        key={channel.key}
                                        style={{
                                            transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                                        }}
                                    >
                                        <td>
                                            {channel.isNumerical && <VscodeCheckbox
                                                checked={isSelected}
                                                onChange={() => toggleChannel(channel.key, channel.isNumerical ?? false)}
                                            />}
                                        </td>
                                        {sources.length > 1 && <td>{channel.source}</td>}
                                        <td>{channel.component}</td>
                                        <td>{channel.name}</td>
                                        <td className={channel.isNumerical ? 'numerical' : 'non-numerical'}>
                                            {channel.valueStr}
                                        </td>
                                        <td className="time">{formatTime(channel, timeFormat)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const rootDOM = document.getElementById('root');
if (rootDOM) {
    const root = createRoot(rootDOM);
    root.render(<TelemetryTable />);
}
