import * as vscode from 'vscode';

export interface TreeEntry {
    getTreeItem(): vscode.TreeItem | Thenable<vscode.TreeItem>;
    getChildren(): vscode.ProviderResult<TreeEntry[]>;
    getParent(): vscode.ProviderResult<TreeEntry>;
}

export interface GeneralEntryOptions extends vscode.TreeItem { }

export class GeneralEntry<ParentT extends TreeEntry = TreeEntry> implements TreeEntry {
    children?: TreeEntry[];
    uri?: vscode.Uri;

    constructor(
        readonly parent: ParentT,
        readonly label: string,
        readonly description: string,
        readonly options?: GeneralEntryOptions,
    ) {
        this.uri = options?.resourceUri;
    }

    child(
        label: string,
        description: string,
        options?: GeneralEntryOptions,
    ): this {
        if (!this.children) {
            this.children = [];
        }

        this.children.push(new GeneralEntry(this, label, description, options));
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
