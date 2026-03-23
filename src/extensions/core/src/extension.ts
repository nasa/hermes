import * as vscode from 'vscode';
import * as util from 'util';
import winston from 'winston';

import * as grpc from '@grpc/grpc-js';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { CoreApi } from '@gov.nasa.jpl.hermes/vscode';

import { VscodeHermes } from './context';
import { BackendType, State, VscodeApi } from './api';
import { VSCTransport } from './log';
import { pickBackendModeDialog, pickRemoteDialog } from './dialog';
import { LocalTaskProvider } from './api/Local';

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
        vscode.commands.registerCommand('hermes.host.set', async (state: State) => {
            try {
                await api.update(state);
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to update Hermes host: ${err}`);
                api.invalidate(`${err}`);
            }
        }),
        vscode.commands.registerCommand('hermes.host.changeMode', async () => {
            const nextState = await pickBackendModeDialog(api.state);
            if (nextState) {
                vscode.commands.executeCommand('hermes.host.set', nextState);
            }
        }),
        vscode.commands.registerCommand('hermes.host.changeRemote', async () => {
            const newRemote = await pickRemoteDialog(api.state.type === BackendType.REMOTE ? api.state.remote : undefined);
            if (newRemote) {
                vscode.commands.executeCommand('hermes.host.set', { type: BackendType.REMOTE, remote: newRemote });
            }
        }),
        vscode.commands.registerCommand('hermes.host.reconnect', () => {
            vscode.commands.executeCommand('hermes.host.set', api.state);
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