import * as vscode from "vscode";
import { Dictionary } from '@gov.nasa.jpl.hermes/types';

/**
 * DictionaryProvider is an interface that facilitates
 * loading dictionaries from "some" source. Sources can either
 * be prompted/selected by the user or programmatically scrapped.
 * 
 * These dictionaries are usually full command/event/telemetry/parameter
 * dictionaries so some projects may have dictionaries across
 * multiple files.
 */
export interface DictionaryProvider {
    title: string;

    /**
     * Signal fires when dictionaries provided by {@link provideExternalDictionaries}
     * needs to be called again.
     */
    onExternalDictionariesUpdated?: vscode.Event<void>;

    /**
     * When this is implemented, this loader supports loading a dictionary
     * without being explicitely prompted. This is usually used for loading
     * "official" dictionaries released to a fixed distribution.
     * 
     * If this listing needs to be updated, you can externally fire {@link onExternalDictionariesUpdated}
     */
    provideExternalDictionaries?(): vscode.ProviderResult<Dictionary[]>;

    /**
     * This function is called when a user explicitely requests to open a dictionary
     * through the Hermes VSCode side-panel. If this function is not implemented,
     * this provider will not show up in the side-panel drop-down.
     * 
     * It is up to the implementation to prompt the user (however that might work) and
     * to parse the dictionary into a {@link Dictionary} object.
     */
    provideDictionaryPrompt?(): vscode.ProviderResult<Dictionary>;
}
