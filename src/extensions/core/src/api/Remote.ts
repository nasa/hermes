import * as vscode from 'vscode';

import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Settings } from '@gov.nasa.jpl.hermes/vscode';
import { CredentialsPrompter } from '../credentials';

export class Remote extends Rpc.Client implements Hermes.Api {
    grpcClient: Rpc.GrpcClient;

    constructor(client: Rpc.GrpcClient, log: Hermes.Log) {
        super(log, client);
        this.grpcClient = client;
    }

    static async activate(log: Hermes.Log, token?: vscode.CancellationToken) {
        const credPrompter = new CredentialsPrompter();
        const credentials = await credPrompter.promptCredentials();
        credPrompter.dispose();

        const client = new Rpc.GrpcClient(log, {
            hostAddress: Settings.hostUrl(),
            authMethod: Settings.authenticationMethod(),
            skipTLSVerify: Settings.skipTLSVerify(),
            credentials
        });

        await client.connect(token);
        return new Remote(client, log);
    }

    dispose(): void {
        super.dispose();
        this.grpcClient.close();
    }
}