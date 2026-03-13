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
     *
     * Use this to notify Hermes when:
     * - New dictionaries are discovered in the workspace (e.g., file watching)
     * - Existing auto-discovered dictionaries have been modified
     * - Dictionary availability has changed
     */
    onExternalDictionariesUpdated?: vscode.Event<void>;

    /**
     * Provide dictionaries that are auto-discovered from the workspace,
     * without requiring explicit user prompting. This is typically used for:
     * - Auto-discovering dictionaries from standard build output locations
     * - Loading "official" dictionaries from fixed distribution paths
     * - Workspace-specific dictionary configurations
     *
     * This method should return all currently available auto-discovered
     * dictionaries. When the set of available dictionaries changes,
     * fire {@link onExternalDictionariesUpdated} to trigger a refresh.
     *
     * Common patterns:
     * - Scan build artifacts for dictionary files
     * - Watch specific workspace directories for dictionary changes
     * - Load dictionaries from workspace settings
     *
     * @returns Array of auto-discovered dictionaries, or null/undefined if none found
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
