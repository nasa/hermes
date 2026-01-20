import * as vscode from 'vscode';
import * as Seq from '@gov.nasa.jpl.hermes/sequence';

import { findNonIgnoredFiles } from '../gitIgnore';

export class SequenceDB extends vscode.EventEmitter<void> implements Seq.SequenceDB {
    private db: Map<string, Set<string>>;
    private subscriptions: vscode.Disposable[];

    constructor(readonly pathToName: (uri: vscode.Uri) => string) {
        super();
        this.db = new Map();

        const watcher = vscode.workspace.createFileSystemWatcher(
            '**/*.seq',
            /* ignoreCreateEvents */ false,
            /* ignoreChangeEvents */ true,
            /* ignoreDeleteEvents */ false
        );

        this.subscriptions = [
            watcher,
            watcher.onDidCreate((uri) => this.add(uri).fire()),
            watcher.onDidDelete((uri) => this.delete(uri).fire())
        ];

        // Perform the initial sequence search
        this.refresh();
    }

    async refresh() {
        try {
            const initialUris = await findNonIgnoredFiles("**/*.seq");
            for (const uri of initialUris) {
                this.add(uri);
            }
        } finally {
            this.fire();
        }
    }

    add(uri: vscode.Uri): this {
        const name = this.pathToName(uri);
        const uris = this.db.get(name) ?? new Set();
        uris.add(uri.toString());
        this.db.set(name, uris);

        return this;
    }

    delete(uri: vscode.Uri): this {
        const name = this.pathToName(uri);
        const uris = this.db.get(name) ?? new Set();
        uris.delete(uri.toString());

        if (uris.size > 0) {
            this.db.set(name, uris);
        } else {
            this.db.delete(name);
        }

        return this;
    }

    all(): string[] {
        return Array.from(this.db.keys());
    }

    get(name: string): vscode.Uri[] {
        const out: vscode.Uri[] = [];
        for (const v of this.db.get(name) ?? []) {
            out.push(vscode.Uri.parse(v));
        }

        return out;
    }

    dispose(): void {
        for (const disp of this.subscriptions) {
            disp.dispose();
        }

        super.dispose();
    }
}
