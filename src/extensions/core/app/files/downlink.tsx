import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
    VscodeIcon,
} from '@vscode-elements/react-elements';

import {
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
} from '@vscode/webview-ui-toolkit/react';

import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser';
import { Proto } from '@gov.nasa.jpl.hermes/types/src';

import { Frontend, Backend } from '../../common/downlink';
import { FileTransferRow } from './common';
import prettyBytes from './pretty_bytes';

function FileDownlinkRow({
    source,
    sourcePath,
    filePath,
    size,
    status,
    onOpenFile,
}: Proto.IFileDownlink & { onOpenFile: (filepath: string) => void }) {
    const bytesSize = useMemo(() => (
        prettyBytes(size as number, { binary: true, nonBreakingSpace: true })
    ), [size]);

    const [color, iconName, label] = useMemo(() => {
        switch (status ?? 0) {
            case Proto.FileDownlinkCompletionStatus.DOWNLINK_COMPLETED:
                return (
                    ["#73c991", "pass-filled", "Complete"]
                );
            default:
            case Proto.FileDownlinkCompletionStatus.DOWNLINK_UNKNOWN:
                return (
                    ["#f14c4c", "question", "Unknown or unset status"]
                );
            case Proto.FileDownlinkCompletionStatus.DOWNLINK_PARTIAL:
                return (
                    ["#73c991", "pass", "Partially downlinked"]
                );
            case Proto.FileDownlinkCompletionStatus.DOWNLINK_CRC_FAILED:
                return (
                    ["#f14c4c", "error", "Integrity check failed"]
                );
        }
    }, [status]);

    const onClick = useCallback(() => {
        if (filePath) {
            onOpenFile(filePath);
        }
    }, [filePath, onOpenFile]);

    return (
        <VSCodeDataGridRow>
            <VSCodeDataGridCell grid-column="1">{source}</VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="2"><a href="#" onClick={onClick}>{sourcePath}</a></VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="3">{bytesSize}</VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="4">
                <VscodeIcon
                    title={label}
                    style={{ color }}
                    name={iconName}
                />
            </VSCodeDataGridCell>
        </VSCodeDataGridRow>
    );
}

export function Downlink() {
    const messages = useMemo(() => getMessages<Frontend, Backend>(), []);
    const [inProgress, setInProgress] = useState<Proto.IFileTransfer[]>([]);
    const [finished, setFinished] = useState<Proto.IFileDownlink[]>([]);

    useEffect(() => {
        const dispose = messages.onDidReceiveMessage((msg) => {
            setInProgress(Object.values(msg.inProgress ?? []));
            setFinished(Object.values(msg.finished ?? []));
        });

        messages.postMessage({ type: "refresh" });

        return () => {
            dispose.dispose();
        };
    }, [messages]);

    const onOpenFilepath = useCallback((filePath: string) => {
        messages.postMessage({ type: "open", path: filePath });
    }, [messages]);

    if (inProgress.length === 0 && finished.length === 0) {
        return (
            <p style={{
                width: "100%",
                textAlign: "center"
            }}>No files have been downlinked</p >
        );
    }

    return (
        <VSCodeDataGrid grid-template-columns="fit-content(8ch) auto fit-content(12ch) fit-content(8ch)">
            {...inProgress.map((file) => <FileTransferRow key={"..." + file.uid} kind="DOWNLINK" {...file} />)}
            {...finished.reverse().map((file) => <FileDownlinkRow key={file.uid} onOpenFile={onOpenFilepath} {...file} />)}
        </VSCodeDataGrid>
    );
}
