import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';

import { Dictionary } from '@gov.nasa.jpl.hermes/types';
import { FileDictionaryProvider, } from "@gov.nasa.jpl.hermes/vscode";
import * as Proto from '@gov.nasa.jpl.hermes/types/src/proto';

import { parseFprimeXmlDictionary } from './xml';
import { parseFprimeJsonDictionary } from './json';

const execAsync = promisify(exec);

const textDecoder = new TextDecoder();

export class FprimeXmlDictionaryProvider extends FileDictionaryProvider {
    title = "F Prime (XML, <4.0)";

    constructor() {
        super({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'XML': ['xml'] }
        });
    }

    async parse(file: vscode.Uri): Promise<Dictionary> {
        const content = await vscode.workspace.fs.readFile(file);
        const [ns, topology] = parseFprimeXmlDictionary(textDecoder.decode(content));

        const name = path.basename(file.path, '.xml');

        const out = new Dictionary({
            name: topology ?? name,
            type: "fprime",
        });

        out.namespaces.set("", ns);
        return out;
    }
}

export class FprimeJsonDictionaryProvider extends FileDictionaryProvider {
    title = "F Prime (JSON, >=4.0)";

    private _onExternalDictionariesUpdated = new vscode.EventEmitter<void>();
    onExternalDictionariesUpdated = this._onExternalDictionariesUpdated.event;

    private dictionaryWatcher?: vscode.FileSystemWatcher;

    constructor() {
        super({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'JSON': ['json'] }
        });
    }

    /**
     * Find the Rust dictionary parser binary
     * Checks: 1) extension resources, 2) workspace out/, 3) PATH
     */
    private async findRustBinary(): Promise<string | null> {
        const binaryName = process.platform === 'win32'
            ? 'hermes-fprime-dictionary.exe'
            : 'hermes-fprime-dictionary';

        // Check workspace out/ directory
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const workspacePath = workspaceFolders[0].uri.fsPath;
            const workspaceBinary = path.join(workspacePath, 'out', binaryName);
            if (fs.existsSync(workspaceBinary)) {
                return workspaceBinary;
            }
        }

        // Check if it's in PATH (for development)
        try {
            const which = process.platform === 'win32' ? 'where' : 'which';
            await execAsync(`${which} ${binaryName}`);
            return binaryName; // Available in PATH
        } catch {
            // Not in PATH
        }

        return null;
    }

    async parse(file: vscode.Uri): Promise<Dictionary> {
        // Try to use Rust binary first
        const rustBinary = await this.findRustBinary();

        if (rustBinary) {
            try {
                // Call Rust binary to parse dictionary
                const { stdout } = await execAsync(`"${rustBinary}" "${file.fsPath}"`, {
                    encoding: 'buffer' as any,
                    maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large dictionaries
                });

                // Parse protobuf output
                const protoDictionary = Proto.Dictionary.decode(stdout as any);

                // Convert to TypeScript Dictionary object
                return Dictionary.fromProto(protoDictionary);
            } catch (err) {
                console.warn('Failed to parse dictionary with Rust binary, falling back to TypeScript parser:', err);
                // Fall through to TypeScript parser
            }
        }

        // Fallback to TypeScript parser
        const content = await vscode.workspace.fs.readFile(file);
        return parseFprimeJsonDictionary(textDecoder.decode(content));
    }

    /**
     * Provide auto-discovered dictionaries from build-artifacts
     * Returns dictionaries with deterministic IDs based on deployment name
     */
    async provideExternalDictionaries(): Promise<Dictionary[]> {
        const dictUris = await vscode.workspace.findFiles(
            '**/build-artifacts/**/dict/*.json'
        );

        const dictionaries: Dictionary[] = [];
        for (const uri of dictUris) {
            try {
                const dict = await this.parse(uri);
                dict.id = dict.name;

                dictionaries.push(dict);
            } catch (err) {
                console.error(`Failed to load dictionary ${uri.fsPath}:`, err);
            }
        }

        return dictionaries;
    }

    /**
     * Start watching workspace for dictionary changes
     * Called from extension activate(), not part of DictionaryProvider interface
     */
    startWatching(): vscode.Disposable {
        this.dictionaryWatcher = vscode.workspace.createFileSystemWatcher(
            '**/build-artifacts/**/dict/*.json'
        );

        this.dictionaryWatcher.onDidCreate(() => this._onExternalDictionariesUpdated.fire());
        this.dictionaryWatcher.onDidChange(() => this._onExternalDictionariesUpdated.fire());
        this.dictionaryWatcher.onDidDelete(() => this._onExternalDictionariesUpdated.fire());

        return vscode.Disposable.from(this.dictionaryWatcher, this._onExternalDictionariesUpdated);
    }
}
