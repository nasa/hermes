import * as vscode from 'vscode';

import { Api } from '@gov.nasa.jpl.hermes/api';
import { Convert, Proto } from '@gov.nasa.jpl.hermes/types';
import prettyBytes from './prettyBytes';

interface TreeEntry {
    getTreeItem(): vscode.TreeItem;
    getChildren(): vscode.ProviderResult<TreeEntry[]>;
    getParent(): vscode.ProviderResult<TreeEntry>;
}

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

interface FileMetadataOptions extends vscode.TreeItem { }

class FileMetadata implements TreeEntry {
    children?: TreeEntry[];
    uri?: vscode.Uri;

    constructor(
        readonly parent: TreeEntry,
        readonly label: string,
        readonly description: string,
        readonly options?: FileMetadataOptions,
    ) {
        this.uri = options?.resourceUri;
    }

    child(
        label: string,
        description: string,
        options?: FileMetadataOptions,
    ): this {
        if (!this.children) {
            this.children = [];
        }

        this.children.push(new FileMetadata(this, label, description, options));
        return this;
    }

    getTreeItem(): vscode.TreeItem {
        const item = new vscode.TreeItem(this.label);
        item.description = this.description;
        if (this.options?.tooltip) {
            item.tooltip = this.options.tooltip;
        } else {
            item.tooltip = this.description;
        }

        if (this.options?.iconPath !== undefined) {
            item.iconPath = this.options.iconPath;
        }

        if (this.options?.resourceUri !== undefined) {
            item.resourceUri = this.options.resourceUri;
        }

        if (this.options?.command !== undefined) {
            item.command = this.options.command;
        }

        if (this.options?.resourceUri !== undefined) {
            item.resourceUri = this.options.resourceUri;
        }

        if (this.options?.contextValue !== undefined) {
            item.contextValue = this.options.contextValue;
        }

        if (this.children) {
            item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        }

        return item;
    }

    getChildren(): vscode.ProviderResult<TreeEntry[]> {
        return this.children;
    }

    getParent(): vscode.ProviderResult<TreeEntry> {
        return this.parent;
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

        return [
            new FileMetadata(
                this,
                "File Path",
                this.data.filePath ?? "",
                {
                    contextValue: "hermes.downlink.file",
                    iconPath: vscode.ThemeIcon.File,
                    resourceUri: this.uri,
                }
            ),
            new FileMetadata(this, "Source FSW", this.data.source ?? ""),
            new FileMetadata(this, "Status", downlinkFileStatusText(this.data.status ?? undefined)),
            new FileMetadata(this, "Source Path", this.data.sourcePath ?? ""),
            new FileMetadata(this, "Destination Path", this.data.destinationPath ?? ""),
            new FileMetadata(this, "Downlink Start", timestampToDate(this.data.timeStart).toTimeString()),
            new FileMetadata(this, "Downlink Finish", timestampToDate(this.data.timeEnd).toTimeString()),
            new FileMetadata(this, "Size", size),
            ((this.data.missingChunks ?? []).reduce((md, chunk) => {
                const offset = Convert.toNumber(chunk.offset);
                const size = Convert.toNumber(chunk.size);
                const sizeFormat = prettyBytes(size);

                return md.child(`${offset}:${offset + size}`, sizeFormat);
            }, new FileMetadata(
                this,
                "Missing Chunks",
                (this.data.missingChunks?.length ?? 0).toString(),
            ))),
            ((this.data.duplicateChunks ?? []).reduce((md, chunk) => {
                const offset = Convert.toNumber(chunk.offset);
                const size = Convert.toNumber(chunk.size);
                const sizeFormat = prettyBytes(size);

                return md.child(`${offset}:${offset + size}`, sizeFormat);
            }, new FileMetadata(
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
            this.api.onFileTransfer(this.update.bind(this))
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
