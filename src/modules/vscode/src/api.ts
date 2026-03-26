import * as vscode from 'vscode';

import { Api, Log } from "@gov.nasa.jpl.hermes/api";

import { DictionaryLanguageItem, DictionaryProvider } from "./dictionary";
import { NotebookLanguageProvider } from "./notebook";

/**
 * Provider interface for connecting to Hermes backend instances.
 * Supports multiple backend modes (offline, local, remote) with customizable state and UI controls.
 */
export interface BackendProvider<State> {
    /**
     * A unique ID for this provider
     */
    type: string;

    /**
     * Human readable title to display in the status bar and quick pick dialog
     */
    title: string;

    /**
     * A description to display inline in the quick pick dialog
     */
    description?: string;

    /**
     * Detail to display on another line under the title in the dialog
     */
    detail?: string;

    /**
     * An optional priority level where higher is displayed closer to
     * the bottom of the dialog
     */
    priority?: number;

    /**
     * Icon to display in the dialog and the status bar
     */
    icon: string;

    /**
     * Prompt this provider for state if not already provided to the
     * top level API
     * @param context (Hermes Core) VSCode Extension Context
     * @param log Log object to show in the Hermes output panel
     * @returns Returns the state to pass to `provideBackendApi`. If this is `null`, the state change is cancelled
     */
    promptForState(
        context: vscode.ExtensionContext,
        log: Log,
    ): Promise<State | null>

    /**
     * Connect to this backend and return the API to it
     * @param state Provider specific state
     * @param context (Hermes Core) VSCode Extension Context
     * @param log Log object to show in the Hermes output panel
     * @param token Connection cancellation token
     */
    provideBackendApi(
        state: State,
        context: vscode.ExtensionContext,
        log: Log,
        token?: vscode.CancellationToken
    ): Promise<Api>;

    /**
     * Implement this function to display the secondary status bar item to control
     * the state of the connection when the connection is valid.
     * @param item Secondary status bar item, call item.show() to display it
     * @param state The provider-specific state
     */
    activeStatusBarItem?(
        item: vscode.StatusBarItem,
        state: State,
    ): void;

    /**
     * Implement this function to display the secondary status bar item to control
     * the state of the connection.
     * @param item Secondary status bar item, call item.show() to display it
     * @param state The provider-specific state
     */
    invalidStatusBarItem?(
        item: vscode.StatusBarItem,
        state: State,
    ): void;

    /**
     * An optional function to display the secondary status bar item when the backend has exited.
     * If not implemented, the provider will fall back to offline mode.
     * @param item Secondary status bar item, call item.show() to display it
     * @param state The provider-specific state
     */
    exitedStatusBarItem?(item: vscode.StatusBarItem, state: State): void;

    /**
     * Optional call to dispose any resources held by this provider
     */
    dispose?(): void;
}

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
     * Register a backend provider to connect to Hermes or another backend that
     * implements (or partially implements) the Hermes API
     * @param provider 
     */
    registerBackendProvider<T>(provider: BackendProvider<T>): vscode.Disposable;

    /**
     * Register a new dictionary provider for loading dictionaries
     * @param id ID of provider
     * @param title Name of the provider
     * @param dictionaryProvider Dictionary provider
     */
    registerDictionaryProvider(
        id: string,
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
