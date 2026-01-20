import * as vscode from 'vscode';
import { Settings } from '@gov.nasa.jpl.hermes/vscode';
import * as Rpc from '@gov.nasa.jpl.hermes/rpc';

export class BackendStatus implements vscode.Disposable {
    private subscriptions: vscode.Disposable[];

    private clientItem: vscode.StatusBarItem;
    private modeItem: vscode.StatusBarItem;

    private listener: NodeJS.Timeout;
    private client?: Rpc.Client;

    private lastState: Rpc.ClientState;
    private clientBecomesReady = new vscode.EventEmitter<void>();
    onClientBecomesReady = this.clientBecomesReady.event;

    constructor() {
        this.lastState = Rpc.ClientState.IDLE;
        this.clientItem = vscode.window.createStatusBarItem(
            'hermes.host', vscode.StatusBarAlignment.Left, 0
        );

        this.clientItem.command = 'hermes.host.changeUrl';

        this.modeItem = vscode.window.createStatusBarItem(
            'hermes.host.mode', vscode.StatusBarAlignment.Left, 0
        );

        this.modeItem.command = 'hermes.host.changeMode';
        this.modeItem.tooltip = 'Change Hermes connection mode';
        this.setClient(undefined);

        this.modeItem.show();

        this.listener = setInterval(() => {
            this.update();
        }, 500);

        this.subscriptions = [
            vscode.commands.registerCommand('hermes.host.changeUrl', async () => {
                vscode.window.showInputBox({
                    title: 'Hermes Host Address',
                    value: await vscode.workspace.getConfiguration().get(Settings.names.host.url)
                }).then((value) => {
                    if (value) {
                        vscode.workspace.getConfiguration().update(Settings.names.host.url, value);
                    }
                });
            }),
            vscode.commands.registerCommand('hermes.host.changeMode', async () => {
                vscode.window.showQuickPick([
                    {
                        label: "$(home) Local",
                        description: "Use builtin local backend",
                        detail: "Local backends are just for writing sequences and procedures. You can load dictionaries and create notebooks with this backend.",
                        type: Settings.BackendType.LOCAL,
                    },
                    {
                        label: "$(remote) Remote",
                        description: "Connect to an Hermes backend",
                        detail: "Remote backends support creating run profiles for connecting to flight-software and processing telemetry.",
                        type: Settings.BackendType.REMOTE,
                    }
                ], {
                    title: 'Hermes Backend Mode',
                }).then((value) => {
                    if (value) {
                        vscode.workspace.getConfiguration().update(Settings.names.host.type, value.type);
                    }
                });
            })
        ];
    }

    private static getStateText(state: Rpc.ClientState): string {
        switch (state) {
            case Rpc.ClientState.IDLE:
                return "IDLE";
            case Rpc.ClientState.CONNECTING:
                return "CONNECTING";
            case Rpc.ClientState.READY:
                return "READY";
            case Rpc.ClientState.TRANSIENT_FAILURE:
                return "TRANSIENT_FAILURE";
            case Rpc.ClientState.SHUTDOWN:
                return "SHUTDOWN";
        }
    }

    private static getStateBackgroundColorId(state: Rpc.ClientState): vscode.ThemeColor | undefined {
        switch (state) {
            case Rpc.ClientState.IDLE:
            case Rpc.ClientState.CONNECTING:
                return new vscode.ThemeColor("statusBarItem.warningBackground");
            case Rpc.ClientState.READY:
                return undefined;
            case Rpc.ClientState.TRANSIENT_FAILURE:
            case Rpc.ClientState.SHUTDOWN:
                return new vscode.ThemeColor("statusBarItem.errorBackground");
        }
    }

    private update() {
        if (!this.client) {
            this.clientItem.hide();
        } else {
            const state = this.client.state();

            if (state === Rpc.ClientState.READY && this.lastState !== Rpc.ClientState.READY) {
                this.clientBecomesReady.fire();
            }

            this.lastState = state;

            this.clientItem.show();
            this.clientItem.text = `$(extensions-remote) REMOTE ${this.client.url} ${BackendStatus.getStateText(state)}`;
            this.clientItem.tooltip = 'Change Hermes client url';
            this.clientItem.backgroundColor = BackendStatus.getStateBackgroundColorId(state);
        }
    }

    setClient(client?: Rpc.Client) {
        this.client = client;

        if (this.client) {
            this.modeItem.text = '$(vm-connect) Hermes: Remote';
        } else {
            this.modeItem.text = '$(vm-connect) Hermes: Local';
        }
    }

    dispose() {
        clearInterval(this.listener);
        this.clientItem.dispose();
        this.modeItem.dispose();

        for (const sub of this.subscriptions) {
            sub.dispose();
        }
    }
}
