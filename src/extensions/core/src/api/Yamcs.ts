import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import { BackendProvider, Settings } from '@gov.nasa.jpl.hermes/vscode';

import { Offline } from './Offline';

export type YamcsParameterHandler = (instance: string, values: Rpc.YamcsParameterValue[]) => void;

/**
 * A backend that streams YAMCS parameter values as YAMCS sends them
 */
export interface YamcsParameterSource {
    onYamcsParameters(handler: YamcsParameterHandler): vscode.Disposable;
}

export function isYamcsParameterSource(api: object): api is YamcsParameterSource {
    return 'onYamcsParameters' in api;
}

// Telemetry straight from YAMCS through the yamcs-grpc plugin.
// Everything else behaves as in Offline mode.
class Yamcs extends Offline implements YamcsParameterSource {
    private readonly parameters = new vscode.EventEmitter<Rpc.YamcsParameterValue[]>();
    private listeners = 0;
    private cancel?: () => void;

    constructor(
        context: vscode.ExtensionContext,
        log: Hermes.Log,
        readonly client: Rpc.YamcsClient,
        readonly state: Settings.Yamcs,
        readonly names: readonly string[],
    ) {
        super(context, log);
    }

    static async connect(
        state: Settings.Yamcs,
        context: vscode.ExtensionContext,
        log: Hermes.Log,
        token?: vscode.CancellationToken,
    ): Promise<Yamcs> {
        const client = new Rpc.YamcsClient(state.address);
        const cancelled = token?.onCancellationRequested(() => client.close());
        try {
            await client.waitForReady(5000);
            const names = await client.listTelemetered(state.instance);
            log.info(`Found ${names.length} TELEMETERED parameters in YAMCS instance ${state.instance}`);

            const api = new Yamcs(context, log, client, state, names);
            await api._activate();
            return api;
        } catch (err) {
            client.close();
            throw new Error(`Could not connect to YAMCS at ${state.address}: ${err}`, { cause: err });
        } finally {
            cancelled?.dispose();
        }
    }

    onYamcsParameters(handler: YamcsParameterHandler): vscode.Disposable {
        const subscription = this.parameters.event((values) => handler(this.state.instance, values));
        if (this.listeners++ === 0) {
            this.cancel = this.client.subscribeParameters(
                this.state.instance,
                this.state.processor,
                this.names,
                (values) => this.parameters.fire(values),
                (err) => vscode.commands.executeCommand('hermes.backend.exit', err.message),
            );
        }

        return {
            dispose: () => {
                subscription.dispose();
                if (--this.listeners === 0) {
                    this.cancel?.();
                    this.cancel = undefined;
                }
            }
        };
    }

    dispose(): void {
        this.cancel?.();
        this.parameters.dispose();
        this.client.close();
        super.dispose();
    }
}

export class YamcsBackendProvider implements BackendProvider<Settings.Yamcs> {
    type = "yamcs";
    title = "YAMCS";
    description = "Telemetry straight from YAMCS";
    detail = "Connect to a YAMCS server running the yamcs-grpc plugin";
    icon = "broadcast";
    priority = 30;

    async promptForState(): Promise<Settings.Yamcs> {
        return Settings.hostYamcs();
    }

    provideBackendApi(
        state: Settings.Yamcs,
        context: vscode.ExtensionContext,
        log: Hermes.Log,
        token?: vscode.CancellationToken
    ): Promise<Hermes.Api> {
        return Yamcs.connect(state, context, log, token);
    }

    activeStatusBarItem(item: vscode.StatusBarItem, state: Settings.Yamcs): void {
        showServer(item, state);
        item.tooltip = `YAMCS gRPC at ${state.address}, processor ${state.processor}`;
    }

    invalidStatusBarItem(item: vscode.StatusBarItem, state: Settings.Yamcs): void {
        // Keeps the tooltip, which holds the error
        showServer(item, state);
    }
}

function showServer(item: vscode.StatusBarItem, state: Settings.Yamcs) {
    item.text = `$(broadcast) ${state.instance}`;
    item.command = {
        title: "Change YAMCS server",
        command: "workbench.action.openSettings",
        arguments: [Settings.names.host.yamcs],
    };
    item.show();
}
