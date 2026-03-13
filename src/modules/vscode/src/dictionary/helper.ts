import * as vscode from "vscode";
import { Dictionary } from '@gov.nasa.jpl.hermes/types';

import { DictionaryProvider } from "./provider";

export abstract class FileDictionaryProvider implements DictionaryProvider {
    abstract title: string;

    constructor(readonly options?: vscode.OpenDialogOptions) { }

    /**
     * Parse the contents of the file
     */
    abstract parse(...files: vscode.Uri[]): vscode.ProviderResult<Dictionary>;

    async provideDictionaryPrompt() {
        const files = await vscode.window.showOpenDialog(this.options);
        if (!files || files.length === 0) {
            return;
        }

        return await this.parse(...files);
    }
}
