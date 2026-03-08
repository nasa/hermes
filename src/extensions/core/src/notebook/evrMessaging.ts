import * as vscode from "vscode";
import { Settings } from '@gov.nasa.jpl.hermes/vscode';

export function eventMessaging(): vscode.Disposable {
    const toDispose: vscode.Disposable[] = [];

    const messageChannel = vscode.notebooks.createRendererMessaging('hermes-evr-renderer');
    const subscribedConfigs = [
        Settings.names.notebook.evr.timeFormat
    ];

    function pushConfig(cfg: string) {
        messageChannel.postMessage({
            type: 'configUpdate',
            config: cfg,
            value: vscode.workspace.getConfiguration().get(cfg)
        });
    }

    toDispose.push(vscode.workspace.onDidChangeConfiguration((cfgE) => {
        for (const cfg of subscribedConfigs) {
            if (cfgE.affectsConfiguration(cfg)) {
                pushConfig(cfg);
            }
        }
    }));

    messageChannel.onDidReceiveMessage((e) => {
        if (e.message.type === "refreshConfigs") {
            for (const cfg of subscribedConfigs) {
                pushConfig(cfg);
            }
        }
    });

    return {
        dispose: () => {
            for (const d of toDispose) {
                d.dispose();
            }
        }
    };
}