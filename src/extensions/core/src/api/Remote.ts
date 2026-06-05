import * as vscode from 'vscode';
import * as grpc from '@grpc/grpc-js';

import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { BackendProvider, Settings } from '@gov.nasa.jpl.hermes/vscode';
import { VscodeApi } from '.';

class Remote extends Rpc.Client implements Hermes.Api {
    grpcClient: Rpc.GrpcClient;
    private closed: boolean;

    constructor(
        client: Rpc.GrpcClient,
        log: Hermes.Log
    ) {
        super(log, client);
        this.grpcClient = client;
        this.closed = false;

        this.waitLoop();
    }

    async waitLoop() {
        while (true) {
            const currentState = this.grpcClient.getChannel().getConnectivityState(false);
            switch (currentState) {
                case grpc.connectivityState.IDLE:
                case grpc.connectivityState.SHUTDOWN:
                    if (!this.closed) {
                        vscode.commands.executeCommand("hermes.backend.exit");
                    }
                    return;
                case grpc.connectivityState.TRANSIENT_FAILURE:
                    if (!this.closed) {
                        vscode.commands.executeCommand("hermes.backend.exit", "Transient Failure");
                    }
                    return;

                case grpc.connectivityState.CONNECTING:
                case grpc.connectivityState.READY: {
                    await new Promise((resolve) => this.grpcClient.getChannel().watchConnectivityState(
                        currentState,
                        // Re-poll every 30s
                        Date.now() + (30 * 1000),
                        resolve
                    ));
                }
            }
        }
    }

    dispose(): void {
        this.closed = true;
        super.dispose();
        this.grpcClient.close();
    }
}

class CredentialsPrompter implements vscode.Disposable {
    private usernameBox: vscode.InputBox;
    private passwordBox: vscode.InputBox;
    private tokenBox: vscode.InputBox;

    constructor() {
        this.usernameBox = vscode.window.createInputBox();
        this.usernameBox.title = "Username";
        this.usernameBox.prompt = "Hermes Login Username";
        this.usernameBox.onDidChangeValue(e => {
            if (e.length === 0) {
                this.usernameBox.validationMessage = "Username must be provided";
            } else if (e.includes(':')) {
                this.usernameBox.validationMessage = "HTTP Basic auth username cannot include ':'";
            } else {
                this.usernameBox.validationMessage = undefined;
            }
        });

        this.passwordBox = vscode.window.createInputBox();
        this.passwordBox.title = "Password";
        this.passwordBox.prompt = "Hermes Login Password";
        this.passwordBox.password = true;
        this.passwordBox.onDidChangeValue(e => {
            if (e.length === 0) {
                this.passwordBox.validationMessage = "Password must be provided";
            } else {
                this.passwordBox.validationMessage = undefined;
            }
        });

        this.tokenBox = vscode.window.createInputBox();
        this.tokenBox.title = "Authentication Token";
        this.tokenBox.prompt = "Hermes Authentication Token";
        this.tokenBox.password = true;
        this.tokenBox.onDidChangeValue(e => {
            if (e.length === 0) {
                this.tokenBox.validationMessage = "Token must be provided";
            } else {
                this.tokenBox.validationMessage = undefined;
            }
        });
    }

    async promptUsernamePassword(): Promise<string> {
        const username = await new Promise<string>((resolve, reject) => {
            this.usernameBox.show();
            this.usernameBox.onDidAccept(() => {
                this.usernameBox.hide();
                if (this.usernameBox.value.includes(':')) {
                    reject(new Error("HTTP Basic auth username cannot include ':'"));
                } else {
                    resolve(this.usernameBox.value);
                }
            });

            this.usernameBox.onDidHide(() => {
                reject(new Error("No username provided"));
            });
        });

        const password = await new Promise<string>((resolve, reject) => {
            this.passwordBox.show();
            this.passwordBox.onDidAccept(() => {
                this.passwordBox.hide();
                resolve(this.passwordBox.value);
            });

            this.passwordBox.onDidHide(() => {
                reject(new Error("No password provided"));
            });
        });

        return Buffer.from(`${username}:${password}`).toString('base64');
    }

    async promptAuthenticationToken() {
        return await new Promise<string>((resolve, reject) => {
            this.tokenBox.show();
            this.tokenBox.onDidAccept(() => {
                this.tokenBox.hide();
                resolve(this.tokenBox.value);
            });

            this.tokenBox.onDidHide(() => {
                reject(new Error("No token provided"));
            });
        });
    }

    async promptCredentials(authenticationMethod: Rpc.HostAuthenticationKind): Promise<string | undefined> {
        switch (authenticationMethod) {
            case Rpc.HostAuthenticationKind.NONE:
                return undefined;
            case Rpc.HostAuthenticationKind.USER_PASS:
                return await this.promptUsernamePassword();
            case Rpc.HostAuthenticationKind.TOKEN:
                return await this.promptAuthenticationToken();
        }
    }

    dispose() {
        this.usernameBox.dispose();
        this.passwordBox.dispose();
        this.tokenBox.dispose();
    }
}

export class RemoteBackendProvider implements BackendProvider<Settings.Remote> {
    type = "remote";
    title = "Remote";
    description = "For hardware testing and operation";
    detail = "Connect to Hermes remotely";
    icon = "radio-tower";
    priority = 20;

    disposables: readonly vscode.Disposable[];

    constructor(api: VscodeApi) {
        this.disposables = [
            vscode.commands.registerCommand('hermes.host.changeRemote', async () => {
                const newRemote = await pickRemoteDialog(api.currentProvider.type === this.type ? api.currentState : undefined);
                if (newRemote) {
                    vscode.commands.executeCommand('hermes.host.set', this.type, newRemote);
                }
            }),
        ];
    }

    async promptForState(): Promise<Settings.Remote | null> {
        return await pickRemoteDialog() ?? null;
    }

    async provideBackendApi(
        remote: Settings.Remote,
        _context: vscode.ExtensionContext,
        log: Hermes.Log,
        token?: vscode.CancellationToken
    ): Promise<Hermes.Api> {
        const credPrompter = new CredentialsPrompter();
        const credentials = await credPrompter.promptCredentials(remote.authenticationMethod);
        credPrompter.dispose();

        const client = new Rpc.GrpcClient(log, {
            hostAddress: remote.url,
            authMethod: remote.authenticationMethod,
            skipTLSVerify: remote.skipTLSVerify,
            credentials
        });

        await client.connect(token);
        return new Remote(client, log);
    }

    activeStatusBarItem(item: vscode.StatusBarItem, state: Settings.Remote): void {
        item.color = state.color;
        item.text = `$(radio-tower) ${state.label}`;
        item.tooltip = "Change remote host";
        item.command = "hermes.host.changeRemote";
        item.show();
    }

    invalidStatusBarItem(item: vscode.StatusBarItem, state: Settings.Remote): void {
        item.text = `$(radio-tower) ${state.label}`;
        item.command = "hermes.host.changeRemote";
        item.tooltip = "Change host URL";
        item.show();
    }

    exitedStatusBarItem(item: vscode.StatusBarItem, state: Settings.Remote): void {
        item.text = `$(radio-tower) ${state.label}`;
        item.command = "hermes.host.changeRemote";
        item.show();
    }

    dispose(): void {
        for (const disp of this.disposables) {
            disp.dispose();
        }
    }

}

interface RemoteQuickPickItem extends vscode.QuickPickItem {
    createNew?: true;
    remote?: Settings.Remote;
    invalid?: boolean;
}

function remoteToQuickPickItem(key: string, remote: Settings.Remote): RemoteQuickPickItem {
    const saneRemote = { ...remote, key };
    const errors = [];

    if (!remote.label || remote.label === "") {
        saneRemote.label = saneRemote.url ?? "";
        if (saneRemote.label === "") {
            saneRemote.label = "<Untitled Remote>";
        }
    }

    if (!saneRemote.url || saneRemote.url === "") {
        saneRemote.url = "<unset url>";
        errors.push("URL must be set");
    }

    saneRemote.skipTLSVerify = remote.skipTLSVerify ?? false;
    saneRemote.authenticationMethod = remote.authenticationMethod ?? Rpc.HostAuthenticationKind.NONE;
    if (!saneRemote.color || saneRemote.color === "") {
        saneRemote.color = undefined;
    } else if (saneRemote.color) {
        const colorRegex = /^#([a-fA-F0-9]{3})|([a-fA-F0-9]{6})$/;
        if (!colorRegex.test(saneRemote.color)) {
            errors.push("Color must be a hex color in the form #RGB or #RRGGBB");
        }
    }

    return {
        label: saneRemote.label,
        description: saneRemote.url,
        detail: errors.length > 0 ? ("$(alert) Invalid Remote: " + errors.join(". ")) : undefined,
        remote: saneRemote,
        invalid: errors.length > 0
    };
}


async function pickRemoteDialog(current?: Settings.Remote): Promise<Settings.Remote | undefined> {
    const remotes = Settings.hostRemotes();
    const quickPick = vscode.window.createQuickPick<RemoteQuickPickItem>();
    quickPick.canSelectMany = false;

    const remoteQuickPickItems = Array.from(Object.entries(remotes).map(([key, remote]) => remoteToQuickPickItem(key, remote)));
    quickPick.title = "Select a Hermes remote host to connect to";
    quickPick.buttons = [
        {
            iconPath: new vscode.ThemeIcon("settings-gear"),
            location: vscode.QuickInputButtonLocation.Inline,
            tooltip: "Edit Remote Settings"
        }
    ];
    quickPick.items = [
        ...remoteQuickPickItems,
        {
            label: "",
            kind: vscode.QuickPickItemKind.Separator,
        },
        {
            iconPath: new vscode.ThemeIcon("plus"),
            label: "Add new Hermes remote",
            alwaysShow: true,
            createNew: true,
        }
    ];

    const selected = remoteQuickPickItems.find((v) => {
        if (v.remote && current) {
            return current.key === v.remote.key;
        } else {
            return false;
        }
    });

    quickPick.activeItems = selected ? [selected] : [];
    quickPick.show();

    const subs: vscode.Disposable[] = [];
    const pick = await new Promise<RemoteQuickPickItem | undefined>((resolve) => {
        subs.push(
            quickPick.onDidHide(() => {
                resolve(undefined);
            }),
            quickPick.onDidAccept(() => {
                if (quickPick.selectedItems.length > 0) {
                    if (quickPick.selectedItems[0].invalid) {
                        quickPick.selectedItems = [];
                    } else {
                        resolve(quickPick.selectedItems[0]);
                    }
                } else {
                    resolve(undefined);
                }
            }),
            quickPick.onDidTriggerButton(() => {
                // There is only one button
                // [Settings button]
                vscode.commands.executeCommand('workbench.action.openWorkspaceSettingsFile', {
                    revealSetting: {
                        key: 'hermes.host.remotes',
                        edit: false
                    }
                });
                // vscode.commands.executeCommand('workbench.action.openWorkspaceSettingsFile', {});
                resolve(undefined);
            })
        );
    });

    subs.forEach((d) => d.dispose());
    quickPick.dispose();

    if (pick?.remote) {
        return pick.remote;
    } else if (pick?.createNew) {
        return await createNewRemoteDialog();
    }
}

async function createNewRemoteDialog(): Promise<Settings.Remote | undefined> {
    return undefined;
}
