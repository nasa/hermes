import * as vscode from 'vscode';
import * as fs from "fs";

import { Api, Fsw } from '@gov.nasa.jpl.hermes/api';
import { Convert, Proto } from '@gov.nasa.jpl.hermes/types';
import prettyBytes from './prettyBytes';
import { GeneralEntry, TreeEntry } from './TreeEntry';

class UplinkFileTransferEntry implements TreeEntry {
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

function timestampToDate(value?: Proto.google.protobuf.ITimestamp | null): Date {
    if (!value) {
        return new Date();
    }

    const sAsMs = Convert.toNumber(value.seconds) * 1e3;
    const nsAsMs = Convert.toNumber(value.nanos) / 1e6;

    return new Date(sAsMs + nsAsMs);
}

class UplinkFileEntry implements TreeEntry {
    uri: vscode.Uri;

    constructor(readonly data: Proto.IFileUplink) {
        this.uri = vscode.Uri.file(this.data.sourcePath ?? "");
    }

    getTreeItem(): vscode.TreeItem {
        const item = new vscode.TreeItem(this.data.sourcePath ?? this.data.destinationPath ?? "[unknown]");
        item.resourceUri = this.uri;
        const size = (this.data.size as number) ?? 0;
        const totalBytes = prettyBytes(size);

        item.iconPath = this.data.error ?
            new vscode.ThemeIcon("error", new vscode.ThemeColor("testing.iconFailed"))
            : new vscode.ThemeIcon("pass-filled", new vscode.ThemeColor("testing.iconPassed"));
        item.description = totalBytes;
        item.contextValue = "hermes.uplink.file";
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

        return item;
    }

    getChildren(): vscode.ProviderResult<TreeEntry[]> {
        const size = prettyBytes(this.data.size as number ?? 0);
        const startDate = timestampToDate(this.data.timeStart);
        const endDate = timestampToDate(this.data.timeEnd);
        const elapsedMs = endDate.getTime() - startDate.getTime();
        const elapsedS = (elapsedMs / 1e3).toFixed(0);

        const out = [
            new GeneralEntry(this, "Target FSW", this.data.fswId ?? ""),
            new GeneralEntry(this, "Source Path", this.data.sourcePath ?? ""),
            new GeneralEntry(this, "Destination Path", this.data.destinationPath ?? ""),
            new GeneralEntry(this, "Downlink Start", startDate.toLocaleTimeString(), { tooltip: startDate.toString() }),
            new GeneralEntry(this, "Downlink Finish", endDate.toLocaleTimeString(), { tooltip: endDate.toString() }),
            new GeneralEntry(this, "Duration", `${elapsedS} seconds`, { tooltip: `${elapsedMs} ms` }),
            new GeneralEntry(this, "Size", size, { tooltip: `${this.data.size} bytes` }),
            // new GeneralEntry(this, "Metadata", ), TODO(tumbar) This is also a tree
        ];

        if (this.data.error) {
            out.push(
                new GeneralEntry(this, "Error", this.data.error),
            );
        }

        return out;
    }

    getParent(): vscode.ProviderResult<TreeEntry> {
        return null;
    }
}

class PendingFileUplink implements TreeEntry, vscode.Progress<number> {
    pendingDelete: boolean;

    private _cancel?: vscode.CancellationTokenSource;
    progress: number;
    targetId?: string;
    destination?: string;
    children: TreeEntry[];

    constructor(
        readonly provider: UplinkProvider,
        readonly uri: vscode.Uri,
        readonly stat: vscode.FileStat,
    ) {
        this.pendingDelete = false;
        this.progress = 0.0;
        this.children = [];
    }

    static async from(provider: UplinkProvider, uri: vscode.Uri): Promise<PendingFileUplink> {
        const stat = await vscode.workspace.fs.stat(uri);
        return new PendingFileUplink(provider, uri, stat);
    }

    delete() {
        this.pendingDelete = true;
        this.provider.didChangeTreeData.fire(null);
    }

    cancel() {
        this._cancel?.cancel();
    }

    report(value: number): void {
        this.progress += value;
        this.provider.didChangeTreeData.fire(this);
    }

    async start() {
        if (!this.targetId) {
            throw new Error("No target to uplink to");
        }

        if (!this.destination) {
            throw new Error("Destination is not set");
        }

        this._cancel = new vscode.CancellationTokenSource();
        const target = await this.provider.api.getFsw(this.targetId, this._cancel.token);

        if (!target.uplink) {
            throw new Error(`'${this.targetId} does not support file uplink'`);
        }

        const stat = await vscode.workspace.fs.stat(this.uri);

        target.uplink({
            sourcePath: this.uri.fsPath,
            destinationPath: this.destination,
            size: stat.size,
        }, fs.createReadStream(this.uri.fsPath), this, this._cancel.token)
            .finally(() => {
                this.delete();
            });

        this.provider.didChangeTreeData.fire(this);
    }

    async setTarget() {
        const pick = vscode.window.createQuickPick();
        pick.busy = true;
        pick.show();

        const source = new vscode.CancellationTokenSource();
        const cancelDisp = pick.onDidHide(() => {
            source.cancel();
            source.dispose();
            pick.dispose();
        });

        const all = (await this.provider.api.allFsw(source.token)).filter(f => f.uplink !== undefined);

        if (all.length === 0) {
            pick.title = "No connections support file uplink";
        } else {
            pick.items = all.map((fsw) => ({
                label: fsw.id,
                description: fsw.type,
                detail: fsw.profileId
            }));
        }

        cancelDisp.dispose();
        source.dispose();
        pick.busy = false;

        pick.onDidAccept(() => {
            if (pick.activeItems) {
                this.targetId = pick.activeItems[0].label;
                this.provider.didChangeTreeData.fire(this);
            }

            pick.dispose();
        });
    }

    private async getTarget(): Promise<Fsw | undefined> {
        const all = (await this.provider.api.allFsw()).filter((f) => f.uplink !== undefined);

        if (this.targetId) {
            const target = all.find((f) => f.id === this.targetId);
            if (target) {
                return target;
            }

            // Target must have disconnected, deselect it
            this.targetId = undefined;
        }

        // No target selected, autoselect the first target
        if (!this.targetId) {
            if (all.length > 0) {
                const target = all[0];
                this.targetId = target.id;
                return target;
            }
        }
    }

    async getTreeItem(): Promise<vscode.TreeItem> {
        const item = new vscode.TreeItem(this.uri);
        this.children = [];

        if (this._cancel) {
            // Activitely uplinking file
            item.contextValue = "hermes.uplink.active";
            item.iconPath = new vscode.ThemeIcon("cloud-upload", new vscode.ThemeColor("testing.iconQueued"));

            const progressS = prettyBytes(this.progress);
            const sizeS = prettyBytes(this.stat.size);
            const percentage = ((this.progress / this.stat.size) * 100).toFixed(0);

            item.description = `${progressS} / ${sizeS} (${percentage})%`;
        } else {
            // Pending file uplink
            item.contextValue = "hermes.uplink.pending";
            const target = await this.getTarget();

            if (target) {
                this.children.push(
                    new GeneralEntry(
                        this,
                        target.id,
                        "Target",
                        {
                            tooltip: "Target FSW to uplink to",
                            contextValue: "hermes.uplink.target",
                            iconPath: new vscode.ThemeIcon("radio-tower", new vscode.ThemeColor("testing.runAction"))
                        }
                    )
                );
            } else {
                this.children.push(
                    new GeneralEntry(
                        this,
                        "",
                        "Target",
                        {
                            tooltip: "Target FSW to uplink to",
                            contextValue: "hermes.uplink.target",
                            iconPath: new vscode.ThemeIcon("radio-tower", new vscode.ThemeColor("list.errorForeground"))
                        }
                    )
                );
            }

            this.children.push(
                new GeneralEntry(
                    this,
                    this.destination ?? "",
                    this.destination ? "Destination" : "Destination (empty)",
                    {
                        tooltip: "On-board path to uplink file to",
                        contextValue: "hermes.uplink.destination",
                        iconPath: new vscode.ThemeIcon("files")
                    }
                )
            );

            item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        }

        return item;
    }

    getChildren(): vscode.ProviderResult<TreeEntry[]> {
        return this.children;
    }

    getParent(): vscode.ProviderResult<TreeEntry> {
        return null;
    }
}

export class UplinkProvider implements vscode.TreeDataProvider<TreeEntry>, vscode.Disposable {
    pending: PendingFileUplink[];
    inProgress: Proto.IFileTransfer[];
    complete: Proto.IFileUplink[];

    didChangeTreeData = new vscode.EventEmitter<null | TreeEntry | TreeEntry[]>();
    onDidChangeTreeData = this.didChangeTreeData.event;

    subscriptions: vscode.Disposable[];

    constructor(readonly api: Api) {
        this.pending = [];
        this.inProgress = [];
        this.complete = [];

        this.subscriptions = [
            this.api.onFileTransfer(this.update.bind(this)),
            vscode.window.registerTreeDataProvider(
                'hermes.uplink',
                this,
            ),
            vscode.commands.registerCommand('hermes.uplink.clear', () => {
                this.api.clearUplinkTransferState();
            }),
            vscode.commands.registerCommand('hermes.uplink.targetEdit', (item: GeneralEntry<PendingFileUplink>) => {
                item.parent.setTarget();
            }),
            vscode.commands.registerCommand('hermes.uplink.destinationEdit', (item: GeneralEntry<PendingFileUplink>) => {
                vscode.window.showInputBox({
                    title: "File uplink on-board destination",
                    value: item.parent.destination,
                }).then((value) => {
                    if (value !== undefined) {
                        item.parent.destination = value;
                        this.didChangeTreeData.fire(item.parent);
                    }
                });
            }),
            vscode.commands.registerCommand('hermes.uplink.delete', (item: PendingFileUplink) => {
                item.delete();
            }),
            vscode.commands.registerCommand('hermes.uplink.start', async (item: PendingFileUplink) => {
                try {
                    await item.start();
                } catch (err) {
                    vscode.window.showErrorMessage(`Failed to uplink file: ${err}`);
                }
            }),
            vscode.commands.registerCommand('hermes.uplink.add', () => {
                vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectMany: true,
                    canSelectFolders: false,
                }).then(async (uris) => {
                    if (uris) {
                        for (const uri of uris) {
                            this.pending.push(
                                await PendingFileUplink.from(this, uri)
                            );
                        }

                        this.didChangeTreeData.fire(null);
                    }
                });
            }),
        ];
    }

    private update(state: Proto.IFileTransferState) {
        this.inProgress = state.uplinkInProgress ?? [];
        this.complete = state.uplinkCompleted ?? [];
        this.didChangeTreeData.fire(null);
    }

    async refresh() {
        this.update(await this.api.getFileTransferState());
    }

    getTreeItem(element: TreeEntry): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element.getTreeItem();
    }

    getChildren(element?: TreeEntry): vscode.ProviderResult<TreeEntry[]> {
        this.pending = this.pending.filter((f) => !f.pendingDelete);

        if (element) {
            return element.getChildren();
        } else {
            return [
                ...this.pending,
                ...this.inProgress.map((file) => new UplinkFileTransferEntry(file)),
                ...this.complete.reverse().map((file) => new UplinkFileEntry(file)),
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
