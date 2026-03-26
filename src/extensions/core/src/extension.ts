import * as vscode from 'vscode';
import * as util from 'util';
import winston from 'winston';

import * as grpc from '@grpc/grpc-js';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { CoreApi } from '@gov.nasa.jpl.hermes/vscode';

import { VscodeHermes } from './context';
import { VscodeApi } from './api';
import { VSCTransport } from './log';
import { LocalBackendProvider, LocalTaskProvider } from './api/Local';
import { RemoteBackendProvider } from './api/Remote';

export async function activate(context: vscode.ExtensionContext): Promise<CoreApi> {
    context.subscriptions.push(
        vscode.tasks.registerTaskProvider(
            'hermes-local',
            new LocalTaskProvider(context)
        )
    );

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
    const api = new VscodeApi(context, log);

    const vscodeContext = new VscodeHermes(context.extensionPath, log, api, context);
    await vscodeContext.activate();

    // Make sure things clean up properly when this extension shuts down
    context.subscriptions.push(
        api,
        vscodeContext,
        vscodeLogger,

        api.onContextRefresh(() => {
            vscodeContext.refresh();
        }),
        api.registerBackendProvider(new LocalBackendProvider(api)),
        api.registerBackendProvider(new RemoteBackendProvider(api)),
        vscode.commands.registerCommand('hermes.host.set', async <T>(type: string, state: T | null) => {
            try {
                await api.update(type, state);
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to update Hermes host: ${err}`);
                api.invalidate(`${err}`);
            }
        }),
        vscode.commands.registerCommand('hermes.host.changeMode', async () => {
            api.pickBackendModeDialog();
        }),
        vscode.commands.registerCommand('hermes.host.reconnect', () => {
            vscode.commands.executeCommand('hermes.host.set', api.currentProvider.type, api.currentState);
        }),
        vscode.commands.registerCommand('hermes.terminal.focusBackend', () => {
            for (const task of vscode.tasks.taskExecutions) {
                if (task.task.definition.type === "hermes-local") {
                    vscode.commands.executeCommand("workbench.action.tasks.showTask", task);
                }
            }
        }),
    );

    vscode.commands.executeCommand("hermes.host.reconnect");
    return vscodeContext;
}