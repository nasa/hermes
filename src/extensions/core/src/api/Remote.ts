import * as vscode from 'vscode';
import * as grpc from '@grpc/grpc-js';

import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Settings } from '@gov.nasa.jpl.hermes/vscode';

export class Remote extends Rpc.Client implements Hermes.Api {
    grpcClient: Rpc.GrpcClient;
    private closed: boolean;

    protected constructor(
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

    static async activate(remote: Settings.Remote, log: Hermes.Log, token?: vscode.CancellationToken) {
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
