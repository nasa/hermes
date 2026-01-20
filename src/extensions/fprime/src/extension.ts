import * as vscode from 'vscode';
import * as path from 'path';

import { Dictionary } from '@gov.nasa.jpl.hermes/types';
import {
    getApi,
    FileDictionaryProvider,
    DictionaryLanguageItem
} from "@gov.nasa.jpl.hermes/vscode";

import { FPrimeNotebookSerializer } from './notebook';
import { FPrimeExtension } from './language';
import { parseFprimeXmlDictionary } from './dictionaryXml';
import { FprimeNotebookLanguageProvider } from './language/notebook';
import { parseFprimeJsonDictionary } from './dictionaryJson';

const textDecoder = new TextDecoder();

class FprimeXmlDictionaryProvider extends FileDictionaryProvider {
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

class FprimeJsonDictionaryProvider extends FileDictionaryProvider {
    constructor() {
        super({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'JSON': ['json'] }
        });
    }

    async parse(file: vscode.Uri): Promise<Dictionary> {
        const content = await vscode.workspace.fs.readFile(file);
        return parseFprimeJsonDictionary(textDecoder.decode(content));
    }
}

export async function activate(context: vscode.ExtensionContext) {
    const hermesVSCode = getApi();
    const dictionaryItem = new DictionaryLanguageItem(
        context,
        hermesVSCode.api,
        'fprime',
        (head) => head.type === "fprime",
    );

    const ext = new FPrimeExtension(dictionaryItem);
    const nbLanguage = new FprimeNotebookLanguageProvider(hermesVSCode.api, ext);

    context.subscriptions.push(
        hermesVSCode.registerDictionaryProvider("FPrime (XML)", new FprimeXmlDictionaryProvider()),
        hermesVSCode.registerDictionaryProvider("FPrime (JSON)", new FprimeJsonDictionaryProvider()),
        hermesVSCode.registerLanguageDictionaryItem(dictionaryItem),
        hermesVSCode.registerNotebookLanguageProvider("fprime", nbLanguage),

        // Parameter Database
        // vscode.workspace.registerFileSystemProvider("fprimeprm", new ParamDbFsSerializer(dict)),
        // vscode.workspace.registerTextDocumentContentProvider("fprimeschema", new FPrimeParameterJsonSchemaProvider(dict)),
        // vscode.commands.registerCommand("hermes.fprime.prm.open", async (t: vscode.Uri) => {
        //     try {
        //         const doc = await vscode.workspace.openTextDocument(vscode.Uri.from({ scheme: "fprimeprm", path: t.path }));
        //         await vscode.window.showTextDocument(doc, { preview: false });
        //     } catch (e) {
        //         vscode.window.showErrorMessage(`${e}`);
        //     }
        // }),

        // Notebook
        hermesVSCode.registerNotebookType("fprime-notebook"),
        vscode.workspace.registerNotebookSerializer('fprime-notebook', new FPrimeNotebookSerializer()),
        dictionaryItem,
        ext,
        nbLanguage,
    );
}
