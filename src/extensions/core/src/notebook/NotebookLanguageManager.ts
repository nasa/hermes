import * as vscode from 'vscode';
import { NotebookLanguageProvider } from '@gov.nasa.jpl.hermes/vscode';

export class NotebookLanguageManager implements vscode.NotebookCellStatusBarItemProvider {
    private languageProviders = new Map<string, NotebookLanguageProvider>();

    didChangeCellStatusBarItems = new vscode.EventEmitter<void>();
    onDidChangeCellStatusBarItems = this.didChangeCellStatusBarItems.event;

    provideCellStatusBarItems(cell: vscode.NotebookCell, token: vscode.CancellationToken): vscode.ProviderResult<vscode.NotebookCellStatusBarItem | vscode.NotebookCellStatusBarItem[]> {
        // Get the provider for this language
        const provider = this.languageProviders.get(cell.document.languageId);
        if (!provider) {
            return null;
        }

        return provider.provideCellStatusBarItems?.(cell, token);
    }

    get(languageId: string): NotebookLanguageProvider | undefined {
        return this.languageProviders.get(languageId);
    }

    register(langaugeId: string, provider: NotebookLanguageProvider): vscode.Disposable {
        if (this.languageProviders.has(langaugeId)) {
            // TODO(tumbar) It may be possible to support multiple providers per language
            // We could do this by including a supplementary status bar item in a 'wrapped'
            // provider that supports 'N' provider registrations.
            throw new Error(`Language provider for ${langaugeId} is already registered`);
        }

        this.languageProviders.set(langaugeId, provider);

        const statusBarItemListener = provider.onDidChangeCellStatusBarItems?.(() => {
            this.didChangeCellStatusBarItems.fire();
        });

        // Re-ping all the language to refresh the cell status bars
        // The initial status-bar updates have already been processed so they are now
        // out of date as this provider depends on all the registered providers.
        this.didChangeCellStatusBarItems.fire();

        return {
            dispose: () => {
                statusBarItemListener?.dispose();
                this.languageProviders.delete(langaugeId);
            }
        };
    }
}