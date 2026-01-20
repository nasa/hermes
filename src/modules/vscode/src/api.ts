import * as vscode from 'vscode';

import { Api, Log } from "@gov.nasa.jpl.hermes/api";

import { DictionaryLanguageItem, DictionaryProvider } from "./dictionary";
import { NotebookLanguageProvider } from "./notebook";

export interface CoreApi {
    /**
     * The primary API to the Hermes host
     */
    api: Api;

    /**
     * Client-side logger that logs to the VSCode output panel
     */
    log: Log;

    /**
     * Register a new dictionary provider for loading dictionaries
     * @param name Name of the provider
     * @param dictionaryProvider Dictionary provider
     */
    registerDictionaryProvider(
        name: string,
        dictionaryProvider: DictionaryProvider,
    ): vscode.Disposable;

    /**
     * Register a new dictionary status item that tracks an active/selected
     * dictionary in the text editor.
     * @param item Dictionary language item to register with the core extension
     */
    registerLanguageDictionaryItem(
        item: DictionaryLanguageItem
    ): vscode.Disposable;

    /**
     * Get a previously registered dictionary status item
     * @param id ID of the dictionary status
     */
    getLanguageDictionaryItem(id: string): DictionaryLanguageItem | undefined;

    /**
     * Register a language provider to allow parsing a code block cell
     * into a set of FSW commands to serially send to an active connection
     * @param languageId languageId to register provider for
     * @param languageProvider Language provider
     */
    registerNotebookLanguageProvider(
        languageId: string | string[],
        languageProvider: NotebookLanguageProvider,
    ): vscode.Disposable;

    /**
     * Register a new notebook type to hook executor into
     * @param notebookType Notebook type to hook to Hermes controller
     */
    registerNotebookType(notebookType: string): vscode.Disposable;

    /**
     * If your VSCode plugin include builtin executables, register the path here.
     * There paths will be append to the `PATH` environment for `shellscript` code cells
     * @param path Path to extra executables
     */
    registerShellscriptBinPath(path: string): vscode.Disposable;
}

export function getApi() {
    const api = vscode.extensions.getExtension<CoreApi>('jet-propulsion-laboratory.hermes')?.exports;
    if (!api) {
        throw new Error("jet-propulsion-laboratory.hermes is not installed or active!");
    }

    return api;
}
