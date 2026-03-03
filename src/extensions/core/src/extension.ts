import * as vscode from 'vscode';
import * as util from 'util';
import winston from 'winston';

import * as grpc from '@grpc/grpc-js';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import { Settings, CoreApi } from '@gov.nasa.jpl.hermes/vscode';

import { VscodeHermes } from './context';
import { BackendStatus } from './status';
import { VSCTransport } from './log';
import { LocalApi } from './utils/LocalApi';
import { CredentialsPrompter } from './credentials';

interface ErrorAction {
    name: string;
    action: () => void;
}

class BackendError extends Error {
    constructor(message: string, readonly actions?: ErrorAction[]) {
        super(message);
    }
}

async function initializeMiddleware(
    status: BackendStatus,
    context: vscode.ExtensionContext,
    log: Hermes.Log,
): Promise<Hermes.Api> {
    let clientOptions: Rpc.GrpcClientOptions | undefined;

    grpc.setLogger({
        error: (message?: any, ...optionalParams: any[]) => {
            log.error(util.format('GRPC', message, ...optionalParams));
        },
        info: (message?: any, ...optionalParams: any[]) => {
            log.info(util.format('GRPC', message, ...optionalParams));
        },
        debug: (message?: any, ...optionalParams: any[]) => {
            log.info(util.format(message, ...optionalParams));
        }
    });

    if (Settings.hostType() === Settings.BackendType.LOCAL) {
        vscode.commands.executeCommand('setContext', 'hermes.mode.isHost', true);
        status.setClient(undefined);
        const api = new LocalApi(context, log);
        await api.activate();
        return api;
    } else {
        try {
            vscode.commands.executeCommand('setContext', 'hermes.mode.isHost', false);
            return await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Connecting to remote Hermes backend",
                cancellable: true
            }, async (_, token) => {
                const credPrompter = new CredentialsPrompter();

                let clientTransport: Rpc.GrpcClient | undefined;
                let client: Rpc.Client;

                while (true) {
                    clientTransport?.close();
                    clientOptions = {
                        hostAddress: Settings.hostUrl(),
                        authMethod: Settings.authenticationMethod(),
                        skipTLSVerify: Settings.skipTLSVerify(),
                        credentials: await credPrompter.promptCredentials()
                    };

                    clientTransport = new Rpc.GrpcClient(log, clientOptions);

                    await clientTransport.connect(token);

                    client = new Rpc.Client(log, clientTransport);
                    status.setClient(client);

                    try {
                        // Execute the initial request with the service to have the server discover us as a client
                        break;
                    } catch (e) {
                        const se = e as grpc.ServiceError;
                        if (se.code === grpc.status.UNAUTHENTICATED) {
                            switch (Settings.authenticationMethod()) {
                                case Rpc.HostAuthenticationKind.NONE:
                                    throw new BackendError(
                                        'No authentication provided but server has requested authentication',
                                        [{
                                            name: "Edit Auth Method",
                                            action: () => {
                                                vscode.commands.executeCommand(
                                                    'workbench.action.openSettings',
                                                    Settings.names.host.authenticationMethod
                                                );
                                            }
                                        }]
                                    );
                                case Rpc.HostAuthenticationKind.USER_PASS:
                                case Rpc.HostAuthenticationKind.TOKEN:
                                    vscode.window.showWarningMessage('Failed to authenticate with Hermes server');
                                    break;
                            }
                        }
                    }
                }

                vscode.window.showInformationMessage("Hermes connected to server successfully");
                return client;
            });
        } catch (e) {
            const actions = e instanceof BackendError ? e.actions ?? [] : [];
            actions.push({
                name: "Retry",
                action: () => vscode.commands.executeCommand('workbench.action.reloadWindow')
            });

            vscode.window.showWarningMessage(
                `Failed to connect to remote Hermes backend: ${e}. ` +
                "Falling back to local backend mode",
                ...actions.map(v => v.name)
            ).then((choice) => {
                // Run the action if we find a match
                actions.find(v => v.name === choice)?.action();
            });

            vscode.commands.executeCommand('setContext', 'hermes.mode.isHost', true);
            status.setClient(undefined);

            const api = new LocalApi(context, log);
            await api.activate();
            return api;
        }
    }
}

export async function activate(context: vscode.ExtensionContext): Promise<CoreApi> {
    const vscodeLogger = new VSCTransport({
        name: "Hermes",
        window: vscode.window,
        json: false,
    });

    const log: Hermes.Log = winston.createLogger({
        transports: [vscodeLogger],
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
        },
        format: winston.format.combine(
            winston.format(info => ({ ...info, level: info.level.toUpperCase() }))(),
            winston.format.align(),
            winston.format.errors({ stack: true }),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.printf(({ level, message, timestamp }) => {
                return `${timestamp} ${level}: ${message}`;
            }),
        )
    });

    const status = new BackendStatus();
    const api = await initializeMiddleware(status, context, log);
    const vscodeContext = new VscodeHermes(context.extensionPath, log, api, context);

    status.onClientBecomesReady(() => {
        vscodeContext.refresh();
    });

    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(Settings.names.host.type) ||
            e.affectsConfiguration(Settings.names.host.url) ||
            e.affectsConfiguration(Settings.names.host.authenticationMethod) ||
            e.affectsConfiguration(Settings.names.host.skipTLSVerify)
        ) {
            vscode.window.showInformationMessage(
                "Hermes Backend settings changed",
                "Restart Window"
            ).then((v) => {
                if (v === "Restart Window") {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        }
    });

    await vscodeContext.activate();

    // Make sure things clean up properly when this extension shuts down
    context.subscriptions.push(
        api,
        vscodeContext,
        vscodeLogger,
    );

    return vscodeContext;
}