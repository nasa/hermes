import React, {
    useCallback,
    useState,
    useEffect,
    useMemo,
} from 'react';
import { createRoot } from 'react-dom/client';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
    VscodeCheckbox,
    VscodeSingleSelect,
    VscodeOption,
    VscodeTextfield,
    VscodeMultiSelect,
} from "@vscode-elements/react-elements";

import VscodeToolbarButton from "@vscode-elements/react-elements/dist/components/VscodeToolbarButton";

import { TimeFormat, DisplayEvent, EvrSeverity } from '@gov.nasa.jpl.hermes/types';

import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser';
import type { BackendMessage, FrontendMessage } from '../../common/evrs';

import './style.css';
import SourceFilterMultiSelect from './SourceFilterMultiSelect';

const messages = getMessages<FrontendMessage, BackendMessage>();

interface IndexedEvr extends DisplayEvent {
    index: number;
}

type EvrSeverityFilter = EvrSeverity | '*';

const localTimeOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

function formatTime(
    evr: DisplayEvent,
    format: TimeFormat
) {
    switch (format) {
        case TimeFormat.UTC:
            return new Date(evr.time).toISOString();
        case TimeFormat.LOCAL:
            return new Date(evr.time - localTimeOffset).toISOString().slice(0, -1);
        case TimeFormat.SCLK:
            return (evr.sclk).toFixed(4);
    }
}

export function EvrTable() {
    const jsScrolling = React.useRef<boolean>(false);
    const lastJsScroll = React.useRef<number>(0);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);
    const tableHeaderRef = React.useRef<HTMLTableSectionElement>(null);

    const [evrs, setEvrs] = useState<IndexedEvr[]>([]);
    const [autoscroll, setAutoscroll] = useState<boolean>(true);
    const [selected, setSelected] = useState<number>();
    const [filter, setFilter] = useState('');

    const [filteredSources, setFilteredSources] = useState<string[]>(['*']);
    const [filteredSeverities, setFilteredSeverities] = useState<EvrSeverityFilter[]>(['*']);

    const [timeFormat, setTimeFormat] = useState<TimeFormat>(TimeFormat.SCLK);

    const sourcesSevStr = useMemo(() => {
        const srcs = new Set<string>();
        const sevs = new Set<EvrSeverity>();
        for (const evr of evrs) {
            srcs.add(evr.source);
            sevs.add(evr.severity);
        }

        return JSON.stringify(
            [Array.from(srcs.values()).sort(), Array.from(sevs.values()).sort()]
        );
    }, [evrs]);

    const [sources, severities] = useMemo(() => {
        return JSON.parse(sourcesSevStr) as [string[], EvrSeverityFilter[]];
    }, [sourcesSevStr]);

    const filteredEvrs = useMemo(() => {
        let filteredEvrs = evrs;

        // Filter by sources
        const sourcesSet = new Set(filteredSources);
        if (!sourcesSet.has("*")) {
            filteredEvrs = filteredEvrs.filter(v => sourcesSet.has(v.source));
        }

        // Filter by severity
        const severitySet = new Set(filteredSeverities);
        if (!severitySet.has("*")) {
            filteredEvrs = filteredEvrs.filter(v => severitySet.has(v.severity));
        }

        // Filter my EVR message
        const filterLower = filter.toLowerCase();
        if (filterLower.length > 0) {
            filteredEvrs = filteredEvrs.filter(v => v.message.toLowerCase().includes(filterLower));
        }

        return filteredEvrs;
    }, [filter, filteredSources, filteredSeverities, evrs]);

    useEffect(() => {
        messages.postMessage({ type: 'refresh' });
    }, []);

    const resizeHeader = useCallback(() => {
        requestAnimationFrame(() => {
            if (tableBodyRef.current && tableHeaderRef.current) {
                const rows = tableBodyRef.current.querySelector('tr');
                tableHeaderRef.current.style.width = tableBodyRef.current.style.width;
                const columns = rows?.querySelectorAll('td');
                tableHeaderRef.current.querySelectorAll('th').forEach((th, idx) => {
                    th.style.width = (columns?.item(idx)?.offsetWidth ?? 0) + 'px';
                });
            }
        });
    }, []);

    const virtualizer = useVirtualizer({
        count: filteredEvrs.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 28,
        overscan: 20,
    });

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            jsScrolling.current = true;
            virtualizer.scrollToOffset(virtualizer.getTotalSize());
        });
    }, []);

    const handleMessages = useCallback((msg: BackendMessage) => {
        switch (msg.type) {
            case 'update':
                setEvrs(msg.events.map((v, i) => {
                    (v as IndexedEvr).index = i;
                    return v as IndexedEvr;
                }));
                break;
            case 'append':
                setEvrs(evrs.concat((
                    Array.isArray(msg.events) ? msg.events : [msg.events]).map((v, i) => {
                        (v as IndexedEvr).index = i + evrs.length;
                        return v as IndexedEvr;
                    }))
                );
                break;
        }
    }, [evrs, autoscroll, scrollToBottom]);

    useEffect(() => {
        const disp = messages.onDidReceiveMessage(handleMessages);

        return () => {
            disp.dispose();
        };
    }, [handleMessages]);

    // Resize the header table to match the virtualized table column widths
    if (tableBodyRef.current && tableHeaderRef.current) {
        resizeHeader();
    }

    if (autoscroll) {
        scrollToBottom();
    }

    const onScroll = useCallback(() => {
        if (jsScrolling.current) {
            // This scroll was triggered by JS
        } else {
            // This scroll with triggered by the user

            // Check if we are scrolling down
            if (scrollRef.current!.scrollTop > lastJsScroll.current) {
                // Check if we are close to the bottom (within 2 evrs)
                if (Math.abs(
                    scrollRef.current!.scrollTop - (
                        scrollRef.current!.scrollHeight - scrollRef.current!.clientHeight
                    )
                ) < 28 * 2) {
                    setAutoscroll(true);
                } else {
                    setAutoscroll(false);
                }
            } else {
                // Scrolling up with automatically disable the autoscroll
                setAutoscroll(false);
            }
        }

        lastJsScroll.current = scrollRef.current!.scrollTop;
        jsScrolling.current = false;
    }, []);

    const onClickEvr = useCallback((evrIndex: number) => {
        if (filter.length > 0) {
            // Reveal the EVR context by disabling the filter and keeping the scroll position the same
            setFilter('');
            requestAnimationFrame(() => {
                virtualizer.scrollToIndex(
                    evrIndex,
                    { align: 'center' }
                );
            });

            setSelected(evrIndex);
        } else {
            if (selected === evrIndex) {
                // Deselect
                setSelected(undefined);
            } else {
                // Select
                setSelected(evrIndex);
            }
        }
    }, [filter, selected]);

    const onClickClear = useCallback(() => {
        messages.postMessage({
            type: 'clear'
        });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', resizeHeader);

        return () => {
            window.removeEventListener('resize', resizeHeader);
        };
    }, []);

    useEffect(() => {
        // If '*' is select, auto-select the other sources
        if (filteredSources.includes("*")) {
            if (filteredSources.length - 1 < sources.length) {
                setFilteredSources(['*', ...sources]);
            }
        }
    }, [filteredSources, sources]);

    useEffect(() => {
        // If '*' is select, auto-select the other sources
        if (filteredSeverities.includes("*")) {
            if (filteredSeverities.length - 1 < severities.length) {
                setFilteredSeverities([
                    '*',
                    ...severities,
                ]);
            }
        }
    }, [filteredSeverities, severities]);

    const onSourceFilterChanged = useCallback((e: any) => {
        const newValue = (e.target as any).value as string[];

        // Check if '*' was disabled
        if (filteredSources.includes('*') && !newValue.includes('*')) {
            // Disable all sources
            setFilteredSources([]);
        } else {
            if (newValue.includes('*')) {
                // '*' is enabled, check if we actually need to disable it
                // This happens if another item is deselected
                if (filteredSources.includes('*')) {
                    setFilteredSources(newValue.filter(v => v !== '*'));
                } else {
                    // '*' was selected
                    setFilteredSources(['*', ...newValue]);
                }
            } else {
                // Check if all sources are selected, if so enable '*'
                if (newValue.length === sources.length) {
                    setFilteredSources(['*', ...newValue]);
                } else {
                    setFilteredSources(newValue);
                }
            }
        }
    }, [filteredSources, sources]);

    const onSeverityFilterChanged = useCallback((e: any) => {
        const newValue = (e.target as any).value as EvrSeverityFilter[];

        // Check if '*' was disabled
        if (filteredSeverities.includes('*') && !newValue.includes('*')) {
            // Disable all severities
            setFilteredSeverities([]);
        } else {
            if (newValue.includes('*')) {
                // '*' is enabled, check if we actually need to disable it
                // This happens if another item is deselected
                if (filteredSeverities.includes('*')) {
                    setFilteredSeverities(newValue.filter(v => v !== '*'));
                } else {
                    // '*' was selected
                    setFilteredSeverities(['*', ...newValue]);
                }
            } else {
                // Check if all severities are selected, if so enable '*'
                if (newValue.length === severities.length) {
                    setFilteredSeverities(['*', ...newValue]);
                } else {
                    setFilteredSeverities(newValue);
                }
            }
        }
    }, [filteredSeverities, severities]);

    if (evrs.length === 0) {
        return <p style={{
            width: "100%",
            textAlign: 'center'
        }}>Waiting for event records...</p>;
    }

    return (
        <>
            <div style={{
                display: 'flex',
                gap: '6px',
                margin: "0 6px"
            }}>
                <VscodeSingleSelect
                    style={{ width: "5em" }}
                    value={timeFormat}
                    onChange={e => {
                        setTimeFormat((e.target as any).value);
                    }}
                >
                    <VscodeOption value={TimeFormat.SCLK}>SCLK</VscodeOption>
                    <VscodeOption value={TimeFormat.LOCAL}>Local</VscodeOption>
                    <VscodeOption value={TimeFormat.UTC}>UTC</VscodeOption>
                </VscodeSingleSelect>
                {sources.length > 1 && <SourceFilterMultiSelect
                    style={{ width: "10em" }}
                    value={filteredSources}
                    onChange={onSourceFilterChanged}
                    label='Source'
                >
                    <VscodeOption value='*'>All</VscodeOption>
                    {sources?.map((src) => <VscodeOption key={src}>{src}</VscodeOption>)}
                </SourceFilterMultiSelect>}
                <VscodeMultiSelect
                    style={{ width: "10em" }}
                    value={filteredSeverities}
                    onChange={onSeverityFilterChanged}
                >
                    <VscodeOption value='*'>All</VscodeOption>
                    {severities?.map((src) => <VscodeOption key={src}>{src}</VscodeOption>)}
                </VscodeMultiSelect>
                <div style={{ flexGrow: 1, display: "flex" }}>
                    <VscodeTextfield
                        placeholder='Filter Events'
                        style={{ flexGrow: 1, fontWeight: 400 }}
                        value={filter}
                        onChange={(e: any) => setFilter(e.target.value)}
                    />
                </div>
                <VscodeCheckbox
                    onChange={(e: any) => setAutoscroll(e.target.checked)}
                    checked={autoscroll}
                    data-tooltip-content="Scroll to bottom when new EVRs arrive"
                >
                    Follow
                </VscodeCheckbox>

                <VscodeToolbarButton
                    title="Clear EVRs"
                    onClick={onClickClear}
                    icon='clear-all'
                />
            </div>
            <div ref={scrollRef} style={{
                overflow: "auto",
                flex: 1
            }} onScroll={onScroll}>
                <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
                    <table className={filter.length > 0 ? 'hasFilter' : undefined}>
                        <tbody ref={tableBodyRef}>
                            {virtualizer.getVirtualItems().map((virtualRow, index) => {
                                const evr = filteredEvrs[virtualRow.index];
                                return (
                                    <tr
                                        key={virtualRow.index}
                                        className={`${evr.severity} ${selected === evr.index ? 'selected' : ''}`}
                                        style={{
                                            transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                                        }}
                                        onClick={() => onClickEvr(evr.index)}
                                    >
                                        <td className='idx'>{evr.index + 1}</td>
                                        <td>{formatTime(evr, timeFormat)}</td>
                                        <td>{evr.severity}</td>
                                        <td>{evr.component}</td>
                                        <td>{evr.name}</td>
                                        <td>{evr.message}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div >
        </>
    );
}

const rootDOM = document.getElementById('root');
if (rootDOM) {
    const root = createRoot(rootDOM);
    root.render(<EvrTable />);
}
