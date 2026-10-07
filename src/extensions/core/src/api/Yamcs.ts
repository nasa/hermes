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

/**
 * Whether a parameter sits directly in a top-level space system, YAMCS's
 * folder-like group of parameters, so its name has exactly two slashes, like
 * /Ref_Ref/FPrimeTime. fprime-yamcs puts the CCSDS and F Prime packet header
 * fields there, and every F Prime channel at least one level below.
 */
export function inTopLevelSpaceSystem(qualifiedName: string): boolean {
    return qualifiedName.split('/').length === 3;
}

// Telemetry straight from YAMCS through the yamcs-grpc plugin. Like Offline mode, dictionaries come
// from workspace storage and there's no flight software connection, so no commands or events.
export class Yamcs extends Offline implements YamcsParameterSource {
    private readonly parameters = new vscode.EventEmitter<Rpc.YamcsParameterValue[]>();
    // Handlers share one YAMCS subscription, opened for the first handler and cancelled when the last one is disposed
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

    /**
     * Connects to the yamcs-grpc plugin at state.address. We wait up to 5 s for the
     * plugin to answer, then list the instance's parameters, then load the workspace's
     * dictionaries as Offline mode does. The parameter subscription itself opens later,
     * when the first handler calls onYamcsParameters.
     */
    static async connect(
        state: Settings.Yamcs,
        context: vscode.ExtensionContext,
        log: Hermes.Log,
        token?: vscode.CancellationToken,
    ): Promise<Yamcs> {
        const client = new Rpc.YamcsClient(state.address);

        // If the user cancels while we wait on YAMCS, we reject right away rather than
        // waiting out the 5 s. Closing the client wouldn't do it, because grpc-js reopens
        // the channel until waitForReady's deadline. So each wait below races this promise.
        let onCancel: vscode.Disposable | undefined;
        const cancelled = new Promise<never>((_, reject) => {
            onCancel = token?.onCancellationRequested(() => reject('cancelled'));
        });
        // We don't race the last step, loading dictionaries, so a cancel during it rejects
        // cancelled with nothing awaiting it. Catching here keeps Node from reporting that.
        cancelled.catch(() => { });

        try {
            await Promise.race([client.waitForReady(5000), cancelled]);
            const all = await Promise.race([client.listTelemetered(state.instance), cancelled]);
            // Parameters directly in a top-level space system are packet header fields in fprime-yamcs, not channels
            const names = state.includeTopLevel ? all : all.filter((name) => !inTopLevelSpaceSystem(name));
            log.info(`Found ${all.length} TELEMETERED parameters in YAMCS instance ${state.instance}, subscribing to ${names.length}`);

            const api = new Yamcs(context, log, client, state, names);
            await api._activate();
            return api;
        } catch (err) {
            // A cancel or any failure above ends here, and we close the client so its channel doesn't linger
            client.close();
            throw new Error(`Could not connect to YAMCS at ${state.address}: ${err}`, { cause: err });
        } finally {
            onCancel?.dispose();
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

    // Address and instance entered last, to prefill the next prompt
    private last?: Pick<Settings.Yamcs, 'address' | 'instance'>;

    async promptForState(): Promise<Settings.Yamcs | null> {
        const defaults = { ...Settings.hostYamcs(), ...this.last };
        const address = await vscode.window.showInputBox({
            title: "YAMCS gRPC address",
            prompt: "host:port of the yamcs-grpc plugin",
            value: defaults.address,
        });
        if (!address) {
            return null;
        }
        const instance = await vscode.window.showInputBox({ title: "YAMCS instance", value: defaults.instance });
        if (!instance) {
            return null;
        }
        this.last = { address, instance };
        return { ...defaults, address, instance };
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
        // Leave the tooltip alone, since VscodeApi.invalidate already put the error there
        showServer(item, state);
    }
}

function showServer(item: vscode.StatusBarItem, state: Settings.Yamcs) {
    item.text = `$(broadcast) ${state.instance}`;
    item.command = {
        title: "Change YAMCS server",
        command: "hermes.host.set",
        arguments: ["yamcs"],
    };
    item.show();
}
