import * as vscode from 'vscode';
import * as util from 'util';
import winston from 'winston';

import * as grpc from '@grpc/grpc-js';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Settings, CoreApi } from '@gov.nasa.jpl.hermes/vscode';

import { VscodeHermes } from './context';
import { VscodeApi } from './api/VscodeApi';
import { VSCTransport } from './log';

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

    // Create reconnectable API wrapper
    const reconnectableApi = new VscodeApi(context, log);

    const vscodeContext = new VscodeHermes(context.extensionPath, log, reconnectableApi, context);
    await vscodeContext.activate();

    // Make sure things clean up properly when this extension shuts down
    context.subscriptions.push(
        reconnectableApi,
        vscodeContext,
        vscodeLogger,

        vscode.workspace.onDidChangeConfiguration(async (e) => {
            if (e.affectsConfiguration(Settings.names.host.type) ||
                e.affectsConfiguration(Settings.names.host.url) ||
                e.affectsConfiguration(Settings.names.host.authenticationMethod) ||
                e.affectsConfiguration(Settings.names.host.skipTLSVerify)
            ) {
                vscode.commands.executeCommand("hermes.host.reconnect");
            }
        }),
        vscode.commands.registerCommand('hermes.host.changeMode', async () => {
            const currentMode = Settings.hostType();
            const offlineCheck = currentMode === Settings.BackendType.OFFLINE ? "$(check) " : "";
            const localCheck = currentMode === Settings.BackendType.LOCAL ? "$(check) " : "";
            const remoteCheck = currentMode === Settings.BackendType.REMOTE ? "$(check) " : "";

            vscode.window.showQuickPick<vscode.QuickPickItem & {
                type?: Settings.BackendType;
                reconnect?: true;
            }>([
                {
                    label: offlineCheck + "$(home) Offline",
                    description: "Use offline backend stub",
                    detail: "Offline backends are just for writing sequences and procedures. You can load dictionaries and create notebooks with this backend.",
                    type: Settings.BackendType.OFFLINE,
                },
                {
                    label: localCheck + "$(remote) Local",
                    description: "Use builtin local backend",
                    detail: "Local backends will start and manage a Hermes backend and connect to it locally.",
                    type: Settings.BackendType.LOCAL,
                },
                {
                    label: remoteCheck + "$(remote) Remote",
                    description: "Connect to an Hermes backend",
                    detail: "Remote backends support creating run profiles for connecting to flight-software and processing telemetry.",
                    type: Settings.BackendType.REMOTE,
                },
                {
                    label: "",
                    kind: vscode.QuickPickItemKind.Separator,
                },
                {
                    label: "$(sync) Reconnect",
                    detail: "Try to reconnect/rerun the current backend",
                    reconnect: true,
                }
            ], {
                title: 'Hermes Backend Mode',
            }).then((value) => {
                if (value) {
                    if (value.reconnect) {
                        vscode.commands.executeCommand("hermes.host.reconnect");
                    } else {
                        vscode.workspace.getConfiguration().update(Settings.names.host.type, value.type);
                    }
                }
            });
        }),
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
        vscode.commands.registerCommand('hermes.host.reconnect', async () => {
            try {
                await reconnectableApi.update();
                vscodeContext.refresh();
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to update Hermes host: ${err}`);
                reconnectableApi.invalidate(`${err}`);
                vscodeContext.refresh();
            }
        }),
        vscode.commands.registerCommand('hermes.terminal.focusBackend', () => {
            const terminal = vscode.window.terminals.find((t) => {
                return t.creationOptions.name === "Hermes";
            });

            terminal?.show();
        }),

    );

    vscode.commands.executeCommand("hermes.host.reconnect");
    return vscodeContext;
}