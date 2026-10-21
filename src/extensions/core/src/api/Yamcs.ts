import * as vscode from 'vscode';
import * as os from 'os';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import type { CommandValue } from '@gov.nasa.jpl.hermes/sequence';
import type { Proto } from '@gov.nasa.jpl.hermes/types';
import { BackendProvider, Settings } from '@gov.nasa.jpl.hermes/vscode';

import { Offline } from './Offline';
import { commandComplete, commandSent, commandState, Verifier, yamcsArguments, yamcsDictionary } from './yamcsCommands';
import { buildLinks, LINK_PARAMETER, LinkHealth } from './yamcsLinks';

export type YamcsParameterHandler = (instance: string, values: Rpc.YamcsParameterValue[]) => void;

/**
 * A backend that streams YAMCS parameter values as YAMCS sends them
 */
export interface YamcsParameterSource {
    onYamcsParameters(handler: YamcsParameterHandler): vscode.Disposable;
}

export type YamcsEventHandler = (instance: string, events: Rpc.YamcsEvent[]) => void;

/**
 * A backend that, when its first handler subscribes, sends the newest YAMCS
 * events in the archive, oldest first, then events as YAMCS raises them. An
 * event raised while the archive is being listed can arrive twice, once
 * archived and once live, so handlers have to drop repeats.
 */
export interface YamcsEventSource {
    onYamcsEvents(handler: YamcsEventHandler): vscode.Disposable;
}

// How many archived events we send on connect. YAMCS's live subscription only
// sends events raised after it starts, so without the archived events the
// events panel would start empty.
const RECENT_EVENTS = 100;

/**
 * Whether a parameter sits directly in a top-level space system, YAMCS's
 * folder-like group of parameters, so its name has exactly two slashes, like
 * /Ref_Ref/FPrimeTime. fprime-yamcs puts the CCSDS and F Prime packet header
 * fields there, and every F Prime channel at least one level below.
 */
export function inTopLevelSpaceSystem(qualifiedName: string): boolean {
    return qualifiedName.split('/').length === 3;
}

// A running YAMCS instance, with the parameters we subscribe to and a dictionary built from its commands
interface Instance {
    name: string;
    parameters: readonly string[];
    linkParameters: readonly string[];
    dictionary: Proto.IDictionary;
}

// Telemetry and events straight from YAMCS, and commands to it, through the yamcs-grpc plugin.
// Telemetry and events are named by YAMCS, so they don't need a Hermes dictionary. Commands go
// through one flight software connection per instance, using a dictionary built from that
// instance's mission database. Everything else behaves as in Offline mode.
export class Yamcs extends Offline implements YamcsParameterSource, YamcsEventSource {
    private readonly parameters = new vscode.EventEmitter<{ instance: string; values: Rpc.YamcsParameterValue[] }>();
    // Handlers share one YAMCS subscription per instance, opened for the first handler and cancelled when the last one is disposed
    private listeners = 0;
    private cancel?: () => void;

    private readonly events = new vscode.EventEmitter<{ instance: string; events: Rpc.YamcsEvent[] }>();
    private eventListeners = 0;
    private cancelEvents?: () => void;

    // Losing YAMCS ends every subscription together, so we only exit the backend for the first one
    private exited = false;

    private readonly fsws: Hermes.Fsw[];
    // YAMCS puts this in each command's id, so commands issued in the same millisecond get different ids
    private sequenceNumber = 0;
    // YAMCS puts this in each command's id too. Without it YAMCS uses our IP address, which every window on one
    // machine shares, so we send our hostname and the process id of this window's extension host.
    private readonly origin = `${os.hostname()}:${process.pid}`;

    constructor(
        context: vscode.ExtensionContext,
        log: Hermes.Log,
        readonly client: Rpc.YamcsClient,
        readonly state: Settings.Yamcs,
        readonly instances: readonly Instance[],
    ) {
        super(context, log);
        this.fsws = instances.map(({ name, dictionary }) => ({
            id: `yamcs:${name}`,
            type: 'yamcs',
            profileId: '',
            dictionary: dictionary.id!,
            command: (value, token, onState) => this.command(name, value, token, onState),
            sequence: (value, token, onState) => this.sequence(name, value, token, onState),
        }));
    }

    /**
     * Connects to the yamcs-grpc plugin at state.address. We wait up to 5 s for the
     * plugin to answer, then list the running instances and each one's parameters,
     * commands and links, then load the workspace's dictionaries as Offline mode does, plus one
     * built from each instance's commands, which we also save to workspace storage. The
     * parameter subscriptions open later, when the first handler calls onYamcsParameters.
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
        // the channel until waitForReady's deadline.
        try {
            await cancellable(client.waitForReady(5000), token);
            // We leave out an instance without state.processor. We subscribe on that processor in every instance, and
            // one failed subscription disconnects them all.
            const running = (await cancellable(client.listInstances(), token))
                .filter((i) => i.state === 'RUNNING' && i.processors?.some((p) => p.name === state.processor));
            if (running.length === 0) {
                throw new Error(`No YAMCS instance is running with processor ${state.processor}`);
            }
            const instances = await cancellable(Promise.all(running.map((i) => loadInstance(client, i.name!, state, log))), token);

            const api = new Yamcs(context, log, client, state, instances);
            await api._activate();
            for (const instance of instances) {
                await api.addDictionary(instance.dictionary);
            }
            return api;
        } catch (err) {
            // A cancel or any failure above ends here, and we close the client so its channel doesn't linger
            client.close();
            throw new Error(`Could not connect to YAMCS at ${state.address}: ${err}`, { cause: err });
        }
    }

    onYamcsParameters(handler: YamcsParameterHandler): vscode.Disposable {
        const subscription = this.parameters.event(({ instance, values }) => handler(instance, values));
        if (this.listeners++ === 0) {
            const cancels = this.instances.map(({ name, parameters }) => this.client.subscribeParameters(
                name,
                this.state.processor,
                parameters,
                (values) => this.parameters.fire({ instance: name, values }),
                (err) => this.exit(err),
            ));
            this.cancel = () => cancels.forEach((cancel) => cancel());
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

    onYamcsEvents(handler: YamcsEventHandler): vscode.Disposable {
        const subscription = this.events.event(({ instance, events }) => handler(instance, events));
        if (this.eventListeners++ === 0) {
            const cancels = this.instances.map(({ name }) => this.subscribeEvents(name));
            this.cancelEvents = () => cancels.forEach((cancel) => cancel());
        }

        return {
            dispose: () => {
                subscription.dispose();
                if (--this.eventListeners === 0) {
                    this.cancelEvents?.();
                    this.cancelEvents = undefined;
                }
            }
        };
    }

    // Shows the health of each instance's links in the status bar, until the returned disposable is disposed
    showLinkHealth(): vscode.Disposable {
        const health = new LinkHealth(this.state, this.instances.map(({ name }) => name));
        const cancels = this.instances.map(({ name, linkParameters }) => this.client.subscribeParameters(
            name,
            this.state.processor,
            linkParameters,
            (values) => health.update(name, buildLinks(values)),
            (err) => this.exit(err),
        ));
        return {
            dispose: () => {
                cancels.forEach((cancel) => cancel());
                health.dispose();
            }
        };
    }

    // We subscribe before calling listEvents so an event raised during the
    // listing still arrives live. We hold live events back until we send the
    // archived ones, so handlers get the archived events first.
    private subscribeEvents(instance: string): () => void {
        let held: Rpc.YamcsEvent[] | undefined = [];
        let cancelled = false;
        const cancel = this.client.subscribeEvents(
            instance,
            (event) => held ? held.push(event) : this.events.fire({ instance, events: [event] }),
            (err) => this.exit(err),
        );

        this.client.listEvents(instance, RECENT_EVENTS).catch((err) => {
            this.log.warn(`Could not list recent events in YAMCS instance ${instance}: ${err}`);
            return [];
        }).then((newest) => {
            if (!cancelled) {
                this.events.fire({ instance, events: [...newest.reverse(), ...held!] });
                held = undefined;
            }
        });

        return () => {
            cancelled = true;
            cancel();
        };
    }

    private exit(err: Error) {
        if (!this.exited) {
            this.exited = true;
            vscode.commands.executeCommand('hermes.backend.exit', err.message);
        }
    }

    async allFsw(): Promise<Hermes.Fsw[]> {
        return this.fsws;
    }

    async getFsw(id: string): Promise<Hermes.Fsw> {
        return this.fsws.find((fsw) => fsw.id === id) ?? super.getFsw(id);
    }

    // We call each listener with our flight software connections as soon as it subscribes. The
    // connections never change, so a listener would never hear of them otherwise.
    onFswChange: vscode.Event<Hermes.Fsw[]> = (listener) => {
        listener(this.fsws);
        return { dispose: () => { } };
    };

    /**
     * Issues a command on state.processor in the given instance, by the qualified name in its metadata, then
     * checks its history every 50 ms and resolves once YAMCS has sent it and, if the
     * mission database gives it verifiers, has finished verifying it. We poll because
     * SubscribeCommands streams every command on the processor, with no way to ask for
     * one.
     *
     * grpc-js can leave a call waiting for minutes on a dead connection, so we make each
     * wait cancellable to let the user stop the cell.
     */
    private async command(instance: string, value: CommandValue, token?: vscode.CancellationToken, onState?: Hermes.CommandStateHandler): Promise<boolean> {
        const name = value.def.metadata?.qualifiedName;
        if (!name) {
            throw new Error(`${value.def.component}.${value.def.mnemonic} has no YAMCS qualified name. Select a dictionary built from YAMCS as this cell language's dictionary.`);
        }

        // We check for a stopped cell before issuing. Calling issueCommand sends the request at once,
        // and cancellable only stops us waiting.
        if (token?.isCancellationRequested) {
            throw new Error('Cancelled');
        }
        const verifiers: Verifier[] = value.def.metadata?.verifiers ?? [];
        const issued = this.client.issueCommand(instance, this.state.processor, name, yamcsArguments(value), this.origin, this.sequenceNumber++);
        let sent = false;
        try {
            const id = await cancellable(issued, token).catch((err) => {
                // grpc-js puts YAMCS's reason in details, without the status code in front
                throw new Error(`Could not issue ${name}: ${err.details ?? err.message}`, { cause: err });
            });
            let reported = '';
            for (; ;) {
                const entry = await cancellable(this.client.getCommand(instance, id), token);
                // commandSent and commandComplete throw when the command failed, so we report its state first
                const state = commandState(entry, verifiers);
                if (state.detail !== reported) {
                    reported = state.detail;
                    onState?.(state);
                }
                sent = commandSent(entry);
                if (sent && commandComplete(entry, verifiers)) {
                    // Tell the cell this command is done, so it moves on to the next one
                    onState?.({ ...state, passed: true });
                    return true;
                }
                await cancellable(delay(50), token);
            }
        } catch (err) {
            if (token?.isCancellationRequested) {
                // Stopping the cell doesn't withdraw the command from YAMCS. A command YAMCS hasn't sent may still
                // wait there in a blocked queue.
                throw new Error(sent
                    ? `Cancelled before ${name} completed. YAMCS already sent it.`
                    : `Cancelled before Hermes saw YAMCS send ${name}. YAMCS may already have sent it, or may send it later.`, { cause: err });
            }
            throw err;
        }
    }

    // Issues a cell's commands one at a time, each once the one before has completed
    private async sequence(instance: string, value: Hermes.CommandSequence, token?: vscode.CancellationToken, onState?: Hermes.CommandStateHandler): Promise<boolean> {
        for (const cmd of value.commands) {
            await this.command(instance, cmd, token, onState);
        }
        return true;
    }

    dispose(): void {
        this.cancel?.();
        this.parameters.dispose();
        this.cancelEvents?.();
        this.events.dispose();
        this.client.close();
        super.dispose();
    }
}

export class YamcsBackendProvider implements BackendProvider<Settings.Yamcs> {
    type = "yamcs";
    title = "YAMCS";
    description = "Telemetry, events and commands straight from YAMCS";
    detail = "Connect to a YAMCS server running the yamcs-grpc plugin";
    icon = "broadcast";
    priority = 30;

    // Address entered last, to prefill the next prompt
    private last?: Pick<Settings.Yamcs, 'address'>;

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
        this.last = { address };
        return { ...defaults, address };
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

// Lists an instance's parameters, commands and links
async function loadInstance(client: Rpc.YamcsClient, name: string, state: Settings.Yamcs, log: Hermes.Log): Promise<Instance> {
    const all = await client.listTelemetered(name);
    // Parameters directly in a top-level space system are packet header fields in fprime-yamcs, not channels
    const parameters = state.includeTopLevel ? all : all.filter((parameter) => !inTopLevelSpaceSystem(parameter));
    log.info(`Found ${all.length} TELEMETERED parameters in YAMCS instance ${name}, subscribing to ${parameters.length}`);

    const commands = await client.listCommands(name);
    log.info(`Found ${commands.length} commands in YAMCS instance ${name}`);

    const linkParameters = (await client.listLinkParameters(name)).filter((parameter) => LINK_PARAMETER.test(parameter));
    return { name, parameters, linkParameters, dictionary: yamcsDictionary(name, commands) };
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Waits for promise, but rejects as soon as token is cancelled
function cancellable<T>(promise: Promise<T>, token?: vscode.CancellationToken): Promise<T> {
    return new Promise((resolve, reject) => {
        const onCancel = token?.onCancellationRequested(() => reject(new Error('Cancelled')));
        if (token?.isCancellationRequested) {
            reject(new Error('Cancelled'));
        }
        promise.then(resolve, reject).finally(() => onCancel?.dispose());
    });
}

function showServer(item: vscode.StatusBarItem, state: Settings.Yamcs) {
    item.text = `$(broadcast) ${state.address}`;
    item.command = {
        title: "Change YAMCS server",
        command: "hermes.host.set",
        arguments: ["yamcs"],
    };
    item.show();
}
