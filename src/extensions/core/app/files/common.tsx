import React, { useMemo } from 'react';

import { Proto } from '@gov.nasa.jpl.hermes/types';

import prettyBytes from './pretty_bytes';
import { VSCodeDataGridCell, VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';

type TransferKind = "DOWNLINK" | "UPLINK";

export const FileTransferRow: React.FC<Proto.IFileTransfer & { kind: TransferKind }> = ({
    fswId,
    sourcePath,
    targetPath,
    size,
    kind,
    progress,
}) => {
    const percentage = ((progress as number) ?? 0) / ((size as number) ?? 0);
    const percentageS = `${(percentage * 100).toFixed(0)}%`;

    const bytesSize = useMemo(() => (
        prettyBytes(size as number, { binary: true, nonBreakingSpace: true })
    ), [size]);

    return (
        <VSCodeDataGridRow>
            <VSCodeDataGridCell grid-column="1">{fswId}</VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="2">{(kind === "UPLINK" ? targetPath : sourcePath) ?? ""}</VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="3">{bytesSize}</VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="4">{percentageS}</VSCodeDataGridCell>
        </VSCodeDataGridRow>
    );
};
