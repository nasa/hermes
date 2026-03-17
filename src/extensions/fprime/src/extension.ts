import * as vscode from 'vscode';

import {
    getApi,
    DictionaryLanguageItem
} from "@gov.nasa.jpl.hermes/vscode";

import { FPrimeNotebookSerializer } from './notebook';
import { FPrimeExtension } from './language';
import { FprimeNotebookLanguageProvider } from './language/notebook';
import { FprimeDeploymentProvider } from './task';
import { FprimeJsonDictionaryProvider, FprimeXmlDictionaryProvider } from './dictionary';

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

    // Create dictionary providers
    const jsonProvider = new FprimeJsonDictionaryProvider();
    const xmlProvider = new FprimeXmlDictionaryProvider();

    context.subscriptions.push(
        hermesVSCode.registerDictionaryProvider("fprime.json", jsonProvider),
        hermesVSCode.registerDictionaryProvider("fprime.xml", xmlProvider),
        hermesVSCode.registerLanguageDictionaryItem(dictionaryItem),
        hermesVSCode.registerNotebookLanguageProvider("fprime", nbLanguage),
        jsonProvider.startWatching(),

        // Register task provider for F Prime deployment auto-discovery
        vscode.tasks.registerTaskProvider(
            'hermes-fprime-deployment',
            new FprimeDeploymentProvider(hermesVSCode.api)
        ),

        vscode.commands.registerCommand(
            "hermes.fprime.uplink.file.cancel",
            async () => {
                // Look up all the 'fprime' FSWs connected
                const allFprime = (await hermesVSCode.api.allFsw()).filter((f) => f.type === "fprime" && f.request);
                if (allFprime.length > 1) {
                    // More than one connections made, show a prompt to see which one to send to
                    vscode.window.showQuickPick(allFprime.map(f => f.id))
                        .then(async (fswId) => {
                            if (fswId) {
                                const fsw = allFprime.find(f => f.id === fswId)!;
                                hermesVSCode.log.info(`Transmitting FILE_CANCEL packet to ${fsw.id}`);
                                try {
                                    await fsw.request!("cancel");
                                } catch (err) {
                                    vscode.window.showErrorMessage(`Failed to send FILE_CANCEL packet: ${err}`);
                                }
                            }
                        });
                } else if (allFprime.length === 1) {
                    const fsw = allFprime[0];
                    hermesVSCode.log.info(`Transmitting FILE_CANCEL packet to ${fsw.id}`);
                    try {
                        await fsw.request!("cancel");
                    } catch (err) {
                        vscode.window.showErrorMessage(`Failed to send FILE_CANCEL packet: ${err}`);
                    }
                } else {
                    vscode.window.showErrorMessage("No F Prime FSW connection to send FILE_CANCEL packet to");
                }
            }
        ),

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
