import { DisplayEvent, TimeFormat } from '@gov.nasa.jpl.hermes/types';

import type { ActivationFunction, RendererContext } from 'vscode-notebook-renderer';
import { h, render } from 'preact';
import { useMemo, useState, useEffect } from "preact/hooks";

import './style.css';

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
        default:
            return (evr.sclk ?? (evr.time / 1000)).toFixed(4);
    }
}

function EvrRow({
    index, evr, timeFormat
}: {
    index: number;
    evr: DisplayEvent;
    timeFormat: TimeFormat;
}) {
    if ('def' in evr) {
        const formattedTime = useMemo(() => formatTime(evr, timeFormat), [evr.time, timeFormat]);
        const className = useMemo(() => evr.severity.toLowerCase(), [evr.severity]);

        return (
            <tr className={className}>
                <td>{index}</td>
                <td>{formattedTime}</td>
                <td>{evr.severity}</td>
                <td>{evr.component}</td>
                <td>{evr.name}</td>
                <td>{evr.message}</td>
            </tr>
        );
    } else {
        const formattedTime = useMemo(() => formatTime(evr, timeFormat), [evr.time, timeFormat]);
        const className = useMemo(() => evr.severity.toLowerCase(), [evr.severity]);

        return (
            <tr className={className}>
                <td>{index}</td>
                <td>{formattedTime}</td>
                <td>{evr.severity}</td>
                <td>{evr.component}</td>
                <td>{evr.name}</td>
                <td>{evr.message}</td>
            </tr>
        );
    }
}

let __timeFormat: TimeFormat = TimeFormat.SCLK;

function Evrs({ evrs, context }: {
    evrs: DisplayEvent[];
    context: RendererContext<any>
}) {
    const [timeFormat, setTimeFormat] = useState(__timeFormat);

    useEffect(() => {
        const disposable = context.onDidReceiveMessage?.((msg) => {
            if (msg.type === 'configUpdate') {
                if (msg.config === 'hermes.notebook.evr.timeFormat') {
                    setTimeFormat(msg.value as TimeFormat);
                }
            }
        });

        return () => {
            disposable?.dispose();
        };
    }, [context]);

    return (
        <table id="root">
            {evrs.map((evr, index) => (
                <EvrRow index={index} evr={evr} timeFormat={timeFormat} />
            ))}
        </table>
    );
}
export const activate: ActivationFunction = (context) => {
    context.postMessage?.({
        type: "refreshConfigs"
    });

    const disposable = context.onDidReceiveMessage?.((msg) => {
        if (msg.type === 'configUpdate') {
            if (msg.config === 'hermes.notebook.evr.timeFormat') {
                __timeFormat = msg.value as TimeFormat;
            }
        }
    });

    return {
        renderOutputItem(outputItem, element) {
            const lines = outputItem.text().trim();

            let evrs: DisplayEvent[];
            if (lines.length === 0) {
                evrs = [];
            } else {
                evrs = lines.split("\n").map(v => JSON.parse(v));
            }

            render(<Evrs evrs={evrs} context={context} />, element);
            element.style.maxHeight = 'calc(28px * 10.5)';
            element.scrollTop = element.scrollHeight;
        },
        disposeOutputItem() {
            disposable?.dispose();
        }
    };
};
