import * as vscode from 'vscode';

import { Fsw } from '@gov.nasa.jpl.hermes/api';
import { DictionaryLanguageItem, getApi } from '@gov.nasa.jpl.hermes/vscode';

import { YamcsLanguage, YamcsNotebookLanguageProvider } from './language';

export async function activate(context: vscode.ExtensionContext) {
    const hermesVSCode = getApi();
    const dictionaryItem = new DictionaryLanguageItem(context, hermesVSCode.api, 'yamcs', (head) => head.type === 'yamcs');
    const language = new YamcsLanguage(dictionaryItem);
    const notebook = new YamcsNotebookLanguageProvider(hermesVSCode.api, language);

    // YAMCS mode's connection holds the id of the dictionary it built from YAMCS, so we select that one
    // whenever YAMCS mode connects, including if it connected before we activated. Only Local and
    // Remote modes can fail to list the connections, and their client logs the error, so we ignore it
    // and wait for the next onFswChange.
    const select = (fsws: Fsw[]) => {
        const dictionary = fsws.find((f) => f.type === 'yamcs')?.dictionary;
        if (dictionary) {
            dictionaryItem.set(dictionary);
        }
    };
    hermesVSCode.api.allFsw().then(select, () => { });

    context.subscriptions.push(
        hermesVSCode.registerLanguageDictionaryItem(dictionaryItem),
        hermesVSCode.registerNotebookLanguageProvider('yamcs', notebook),
        hermesVSCode.api.onFswChange(select),
        dictionaryItem,
        language,
        notebook,
    );
}
