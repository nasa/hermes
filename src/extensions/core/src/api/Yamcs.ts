import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import type { CommandValue } from '@gov.nasa.jpl.hermes/sequence';
import { BackendProvider, Settings } from '@gov.nasa.jpl.hermes/vscode';

import { Offline } from './Offline';
import { commandSent, yamcsArguments, yamcsDictionary } from './yamcsCommands';

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

// Telemetry, events and commands straight from YAMCS through the yamcs-grpc plugin. Telemetry and
// events are named by YAMCS, so they don't need a Hermes dictionary. Commands go through the one
// flight software connection this mode offers, using a dictionary built from YAMCS's mission
// database. Everything else behaves as in Offline mode.
export class Yamcs extends Offline implements YamcsParameterSource, YamcsEventSource {
    private readonly parameters = new vscode.EventEmitter<Rpc.YamcsParameterValue[]>();
    // Handlers share one YAMCS subscription, opened for the first handler and cancelled when the last one is disposed
    private listeners = 0;
    private cancel?: () => void;

    private readonly events = new vscode.EventEmitter<Rpc.YamcsEvent[]>();
    private eventListeners = 0;
    private cancelEvents?: () => void;

    // Losing YAMCS ends the parameter and event subscriptions together, so we only exit the backend for the first one
    private exited = false;

    private readonly fsw: Hermes.Fsw;
    // YAMCS puts this in each command's id, so commands issued in the same millisecond get different ids
    private sequenceNumber = 0;

    constructor(
        context: vscode.ExtensionContext,
        log: Hermes.Log,
        readonly client: Rpc.YamcsClient,
        readonly state: Settings.Yamcs,
        readonly names: readonly string[],
        dictionaryId: string,
    ) {
        super(context, log);
        this.fsw = {
            id: `yamcs:${state.instance}`,
            type: 'yamcs',
            profileId: '',
            dictionary: dictionaryId,
            command: (value, token) => this.command(value, token),
            sequence: (value, token) => this.sequence(value, token),
        };
    }

    /**
     * Connects to the yamcs-grpc plugin at state.address. We wait up to 5 s for the
     * plugin to answer, then list the instance's parameters and commands, then load the
     * workspace's dictionaries as Offline mode does, plus one built from the commands.
     * The parameter subscription itself opens later, when the first handler calls
     * onYamcsParameters.
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
        // the channel until waitForReady's deadline. So we make each wait below cancellable.
        try {
            await cancellable(client.waitForReady(5000), token);
            const all = await cancellable(client.listTelemetered(state.instance), token);
            // Parameters directly in a top-level space system are packet header fields in fprime-yamcs, not channels
            const names = state.includeTopLevel ? all : all.filter((name) => !inTopLevelSpaceSystem(name));
            log.info(`Found ${all.length} TELEMETERED parameters in YAMCS instance ${state.instance}, subscribing to ${names.length}`);

            const commands = await cancellable(client.listCommands(state.instance), token);
            log.info(`Found ${commands.length} commands in YAMCS instance ${state.instance}`);
            const dictionary = yamcsDictionary(state.instance, commands);

            const api = new Yamcs(context, log, client, state, names, dictionary.id!);
            await api._activate();
            // The dictionary has an id, so Offline keeps it in memory rather than saving it to workspace storage.
            // Its commands have no opcodes, and a saved copy would load back with every opcode 0, which
            // Dictionary rejects as duplicates.
            await api.addDictionary(dictionary);
            return api;
        } catch (err) {
            // A cancel or any failure above ends here, and we close the client so its channel doesn't linger
            client.close();
            throw new Error(`Could not connect to YAMCS at ${state.address}: ${err}`, { cause: err });
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
                (err) => this.exit(err),
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

    onYamcsEvents(handler: YamcsEventHandler): vscode.Disposable {
        const subscription = this.events.event((events) => handler(this.state.instance, events));
        if (this.eventListeners++ === 0) {
            this.cancelEvents = this.subscribeEvents();
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

    // We subscribe before calling listEvents so an event raised during the
    // listing still arrives live. We hold live events back until we send the
    // archived ones, so handlers get the archived events first.
    private subscribeEvents(): () => void {
        let held: Rpc.YamcsEvent[] | undefined = [];
        let cancelled = false;
        const cancel = this.client.subscribeEvents(
            this.state.instance,
            (event) => held ? held.push(event) : this.events.fire([event]),
            (err) => this.exit(err),
        );

        this.client.listEvents(this.state.instance, RECENT_EVENTS).catch((err) => {
            this.log.warn(`Could not list recent YAMCS events: ${err}`);
            return [];
        }).then((newest) => {
            if (!cancelled) {
                this.events.fire([...newest.reverse(), ...held!]);
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
        return [this.fsw];
    }

    async getFsw(id: string): Promise<Hermes.Fsw> {
        return id === this.fsw.id ? this.fsw : super.getFsw(id);
    }

    // Our list never changes, so each listener gets it once, as soon as it subscribes. VscodeApi
    // subscribes right after we connect, so this is how its listeners hear of our connection.
    onFswChange: vscode.Event<Hermes.Fsw[]> = (listener) => {
        listener([this.fsw]);
        return { dispose: () => { } };
    };

    /**
     * Issues a command on state.processor by the qualified name in its metadata,
     * and resolves once YAMCS has sent it. YAMCS records whether the flight software
     * ran a command only when its mission database entry has verifiers, so we treat
     * a command as done once YAMCS has sent it.
     *
     * We poll GetCommand for the command's history, since SubscribeCommands streams
     * every command on the processor with no way to ask for one. YAMCS usually sends
     * a command a millisecond or two after queuing it, so polling every 50 ms adds
     * little delay. A call on a connection that dropped without closing waits minutes
     * for grpc-js's keepalive, so we race each call against the token to let the user
     * stop the cell.
     */
    private async command(value: CommandValue, token?: vscode.CancellationToken): Promise<boolean> {
        const name = value.def.metadata?.qualifiedName;
        if (!name) {
            throw new Error(`${value.def.component}.${value.def.mnemonic} has no YAMCS qualified name. Select a dictionary built from YAMCS as this cell language's dictionary.`);
        }

        // cancellable only stops us waiting, and issueCommand sends the request as soon as we call it,
        // so we check for a stopped cell before issuing
        if (token?.isCancellationRequested) {
            throw new Error('Cancelled');
        }
        const issued = this.client.issueCommand(this.state.instance, this.state.processor, name, yamcsArguments(value), this.sequenceNumber++);
        try {
            const id = await cancellable(issued, token).catch((err) => {
                // grpc-js puts YAMCS's reason in details, without the status code in front
                throw new Error(`Could not issue ${name}: ${err.details ?? err.message}`, { cause: err });
            });
            while (!commandSent(await cancellable(this.client.getCommand(this.state.instance, id), token))) {
                await cancellable(delay(50), token);
            }
        } catch (err) {
            if (token?.isCancellationRequested) {
                // A command can wait in YAMCS, for example in a blocked queue, and go out later. Or YAMCS may have
                // queued or sent it without our hearing back, as when the connection dropped. Stopping the cell
                // changes neither.
                throw new Error(`Cancelled before Hermes saw YAMCS send ${name}. YAMCS may already have sent it, or may send it later.`, { cause: err });
            }
            throw err;
        }
        return true;
    }

    // Issues a cell's commands one at a time, each once YAMCS has sent the one before
    private async sequence(value: Hermes.CommandSequence, token?: vscode.CancellationToken): Promise<boolean> {
        for (const cmd of value.commands) {
            await this.command(cmd, token);
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
    description = "Telemetry and events straight from YAMCS";
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

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Settles as promise does, or rejects as soon as token is cancelled
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
    item.text = `$(broadcast) ${state.instance}`;
    item.command = {
        title: "Change YAMCS server",
        command: "hermes.host.set",
        arguments: ["yamcs"],
    };
    item.show();
}
