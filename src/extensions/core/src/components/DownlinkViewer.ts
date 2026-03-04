import * as vscode from 'vscode';

import { Api } from '@gov.nasa.jpl.hermes/api';
import { Convert, Proto } from '@gov.nasa.jpl.hermes/types';
import prettyBytes from './prettyBytes';
import { GeneralEntry, TreeEntry } from './TreeEntry';


class DownlinkFileTransferEntry implements TreeEntry {
    constructor(readonly data: Proto.IFileTransfer) { }

    getTreeItem(): vscode.TreeItem {
        const item = new vscode.TreeItem(this.data.sourcePath ?? this.data.targetPath ?? "[unknown]");

        const progress = (this.data.progress as number) ?? 0;
        const size = (this.data.size as number) ?? 0;

        const progressBytes = prettyBytes(progress);
        const totalBytes = prettyBytes(size);
        const percentage = ((progress / size) * 100.0).toFixed(0);

        item.iconPath = new vscode.ThemeIcon("cloud-download", new vscode.ThemeColor("testing.iconQueued"));
        item.description = `${progressBytes} / ${totalBytes} (${percentage}%)`;
        item.contextValue = "hermes.downlinkInProgress";

        return item;
    }

    getChildren(): vscode.ProviderResult<TreeEntry[]> {
        return [];
    }

    getParent(): vscode.ProviderResult<TreeEntry> {
        return null;
    }
}

function downlinkFileStatusText(value?: Proto.FileDownlinkCompletionStatus): string {
    switch (value ?? Proto.FileDownlinkCompletionStatus.DOWNLINK_COMPLETED) {
        case Proto.FileDownlinkCompletionStatus.DOWNLINK_COMPLETED:
            return "Complete";
        default:
        case Proto.FileDownlinkCompletionStatus.DOWNLINK_UNKNOWN:
            return "Unknown or unset";
        case Proto.FileDownlinkCompletionStatus.DOWNLINK_PARTIAL:
            return "Complete (Partial)";
        case Proto.FileDownlinkCompletionStatus.DOWNLINK_CRC_FAILED:
            return "Integrity Check Failed";
    }
}

function downlinkFileStatusIcon(value?: Proto.FileDownlinkCompletionStatus | null): vscode.ThemeIcon {
    switch (value ?? Proto.FileDownlinkCompletionStatus.DOWNLINK_COMPLETED) {
        case Proto.FileDownlinkCompletionStatus.DOWNLINK_COMPLETED:
            return new vscode.ThemeIcon("pass-filled", new vscode.ThemeColor("testing.iconPassed"));
        default:
        case Proto.FileDownlinkCompletionStatus.DOWNLINK_UNKNOWN:
            return new vscode.ThemeIcon("question", new vscode.ThemeColor("testing.iconUnset"));
        case Proto.FileDownlinkCompletionStatus.DOWNLINK_PARTIAL:
            return new vscode.ThemeIcon("pass", new vscode.ThemeColor("testing.iconPassed"));
        case Proto.FileDownlinkCompletionStatus.DOWNLINK_CRC_FAILED:
            return new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"));
    }
}

function timestampToDate(value?: Proto.google.protobuf.ITimestamp | null): Date {
    if (!value) {
        return new Date();
    }

    const sAsMs = Convert.toNumber(value.seconds) * 1e3;
    const nsAsMs = Convert.toNumber(value.nanos) / 1e6;

    return new Date(sAsMs + nsAsMs);
}

class DownlinkFileEntry implements TreeEntry {
    uri: vscode.Uri;

    constructor(readonly data: Proto.IFileDownlink) {
        this.uri = vscode.Uri.file(this.data.filePath ?? "");
    }

    getTreeItem(): vscode.TreeItem {
        const item = new vscode.TreeItem(this.data.sourcePath ?? this.data.destinationPath ?? "[unknown]");
        item.resourceUri = this.uri;
        const size = (this.data.size as number) ?? 0;
        const totalBytes = prettyBytes(size);

        item.iconPath = downlinkFileStatusIcon(this.data.status);
        item.description = totalBytes;
        item.contextValue = "hermes.downlink.file";
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

        return item;
    }

    getChildren(): vscode.ProviderResult<TreeEntry[]> {
        const size = prettyBytes(this.data.size as number ?? 0);
        const startDate = timestampToDate(this.data.timeStart);
        const endDate = timestampToDate(this.data.timeEnd);
        const elapsedMs = endDate.getTime() - startDate.getTime();
        const elapsedS = (elapsedMs / 1e3).toFixed(0);

        return [
            new GeneralEntry(
                this,
                "File Path",
                this.data.filePath ?? "",
                {
                    contextValue: "hermes.downlink.file",
                    iconPath: vscode.ThemeIcon.File,
                    resourceUri: this.uri,
                }
            ),
            new GeneralEntry(this, "Source FSW", this.data.source ?? ""),
            new GeneralEntry(this, "Status", downlinkFileStatusText(this.data.status ?? undefined)),
            new GeneralEntry(this, "Source Path", this.data.sourcePath ?? ""),
            new GeneralEntry(this, "Destination Path", this.data.destinationPath ?? ""),
            new GeneralEntry(this, "Downlink Start", startDate.toLocaleTimeString(), { tooltip: startDate.toString() }),
            new GeneralEntry(this, "Downlink Finish", endDate.toLocaleTimeString(), { tooltip: endDate.toString() }),
            new GeneralEntry(this, "Duration", `${elapsedS} seconds`, { tooltip: `${elapsedMs} ms` }),
            new GeneralEntry(this, "Size", size, { tooltip: `${this.data.size} bytes` }),
            ((this.data.missingChunks ?? []).reduce((md, chunk) => {
                const offset = Convert.toNumber(chunk.offset);
                const size = Convert.toNumber(chunk.size);
                const sizeFormat = prettyBytes(size);

                return md.child(`${offset}:${offset + size}`, sizeFormat);
            }, new GeneralEntry(
                this,
                "Missing Chunks",
                (this.data.missingChunks?.length ?? 0).toString(),
            ))),
            ((this.data.duplicateChunks ?? []).reduce((md, chunk) => {
                const offset = Convert.toNumber(chunk.offset);
                const size = Convert.toNumber(chunk.size);
                const sizeFormat = prettyBytes(size);

                return md.child(`${offset}:${offset + size}`, sizeFormat);
            }, new GeneralEntry(
                this,
                "Duplicate Chunks",
                (this.data.duplicateChunks?.length ?? 0).toString(),
            ))),
            // new FileMetadata(this, "Metadata", ), TODO(tumbar) This is also a tree
        ];
    }

    getParent(): vscode.ProviderResult<TreeEntry> {
        return null;
    }
}

export class DownlinkProvider implements vscode.TreeDataProvider<TreeEntry>, vscode.Disposable {
    inProgress: Proto.IFileTransfer[];
    complete: Proto.IFileDownlink[];

    didChangeTreeData = new vscode.EventEmitter<null | TreeEntry[]>();
    onDidChangeTreeData = this.didChangeTreeData.event;

    subscriptions: vscode.Disposable[];

    constructor(readonly api: Api) {
        this.inProgress = [];
        this.complete = [];

        this.subscriptions = [
            this.api.onFileTransfer(this.update.bind(this)),
            vscode.window.registerTreeDataProvider(
                'hermes.downlink',
                this,
            ),
            vscode.commands.registerCommand('hermes.downlink.clear', () => {
                this.api.clearDownlinkTransferState();
            }),
            vscode.commands.registerCommand('hermes.downlink.open', (item) => {
                const uri = item.uri as vscode.Uri;
                if (!vscode.workspace.getWorkspaceFolder(uri)) {
                    // This uri is not in the workspace
                    // Show it in finder
                    vscode.commands.executeCommand("revealFileInOS", uri);
                } else {
                    vscode.commands.executeCommand("revealFileInExplorer", uri);
                }
            }),
        ];
    }

    private update(state: Proto.IFileTransferState) {
        this.inProgress = state.downlinkInProgress ?? [];
        this.complete = state.downlinkCompleted ?? [];
        this.didChangeTreeData.fire(null);
    }

    async refresh() {
        this.update(await this.api.getFileTransferState());
    }

    getTreeItem(element: TreeEntry): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element.getTreeItem();
    }

    getChildren(element?: TreeEntry): vscode.ProviderResult<TreeEntry[]> {
        if (element) {
            return element.getChildren();
        } else {
            return [
                ...this.inProgress.map((file) => new DownlinkFileTransferEntry(file)),
                ...this.complete.reverse().map((file) => new DownlinkFileEntry(file)),
            ];
        }
    }

    getParent(element: TreeEntry): vscode.ProviderResult<TreeEntry> {
        return element.getParent();
    }

    dispose() {
        for (const s of this.subscriptions) {
            s.dispose();
        }

        this.subscriptions = [];
    }
}
