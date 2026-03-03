import * as vscode from 'vscode';
import * as grpc from '@grpc/grpc-js';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import {
    Sourced,
    Event,
    Telemetry,
    Proto,
    Convert,
} from '@gov.nasa.jpl.hermes/types';

import { ApiClient } from './proto/hermes/Api';
import { Dictionary } from './proto/hermes/Dictionary';
import { RpcFsw } from './fsw';
import { SourcedEvent__Output } from './proto/hermes/SourcedEvent';
import { SourcedTelemetry__Output } from './proto/hermes/SourcedTelemetry';

export { connectivityState as ClientState } from '@grpc/grpc-js';

class RpcSubscription<T, O> {
    listeners: Set<(data: O) => void>;
    call?: grpc.ClientReadableStream<T>;

    event: vscode.Event<O>;

    constructor(
        readonly name: string,
        readonly log: Hermes.Log,
        readonly request: () => grpc.ClientReadableStream<T>,
        readonly reply: (data: T) => O
    ) {
        this.listeners = new Set();
        this.event = (listener) => {
            this.listeners.add(listener);
            if (!this.call) {
                this.subscribe();
            }

            return {
                dispose: () => {
                    this.listeners.delete(listener);

                    if (this.listeners.size === 0) {
                        this.call?.cancel();
                        this.call = undefined;
                    }
                }
            };
        };
    }

    subscribe() {
        this.call = this.request();
        this.call.on("data", (data: T) => {
            let outData: O;
            try {
                outData = this.reply(data);
            } catch (err) {
                this.log.warn(`Failed to convert ${this.name} message: ${err}`);
                console.error(err);
                return;
            }

            for (const listener of this.listeners) {
                try {
                    listener(outData);
                } catch (err) {
                    this.log.warn(`Error while processing ${this.name} message: ${err}`);
                    console.error(err);
                }
            }
        });

        this.call.on("end", () => {
            if (this.listeners.size > 0) {
                this.subscribe();
            }
        });
    }
}

export class Client implements Hermes.Api {
    onFswChange: vscode.Event<Hermes.Fsw[]>;
    onProvidersChange: vscode.Event<Proto.IProfileProvider[]>;
    onProfilesChange: vscode.Event<Record<string, Proto.IStatefulProfile>>;
    onDictionaryChange: vscode.Event<Record<string, Proto.IDictionaryHead>>;

    onEvent: vscode.Event<Sourced<Event>>;
    onTelemetry: vscode.Event<Sourced<Telemetry>>;
    onDownlink: vscode.Event<Proto.IFileDownlink>;
    onUplink: vscode.Event<Proto.IFileUplink>;
    onFileTransfer: vscode.Event<Proto.IFileTransferState>;

    constructor(
        log: Hermes.Log,
        readonly client: ApiClient,
    ) {
        const fswListener = new RpcSubscription(
            "FswState",
            log,
            () => this.client.SubscribeFsw({}),
            (data) => data.all?.map((fsw) => new RpcFsw(this.client, fsw)) ?? []
        );

        this.onFswChange = fswListener.event;

        const providerListener = new RpcSubscription(
            "ProfileProvider",
            log,
            () => this.client.SubscribeProviders({}),
            (data) => data?.all ?? []
        );

        this.onProvidersChange = providerListener.event;

        const profilesListener = new RpcSubscription(
            "Profile",
            log,
            () => this.client.SubscribeProfiles({}),
            (data) => data?.all ?? {}
        );

        this.onProfilesChange = profilesListener.event;

        const dictionaryListener = new RpcSubscription(
            "Dictionary",
            log,
            () => this.client.SubscribeDictionary({}),
            (data) => data?.all ?? {}
        );

        this.onDictionaryChange = dictionaryListener.event;

        const eventListener = new RpcSubscription<
            SourcedEvent__Output,
            Sourced<Event>
        >(
            "Event",
            log,
            () => this.client.SubEvent({}),
            (data) => ({
                time: (
                    (Convert.toNumber(data.event?.time?.unix?.seconds) * 1000)
                    + (Convert.toNumber(data.event?.time?.unix?.nanos) / 1000000)
                ),
                sclk: data.event?.time?.sclk ?? 0,
                message: data.event?.message ?? "",
                args: data.event?.args?.map((arg, idx) => Convert.valueFromProto(
                    arg,
                    new Convert.ConversionContext([`arg[${idx}`]),
                )) ?? [],
                def: Convert.eventRefFromProto(
                    data.event?.ref ?? {},
                ),
                source: data.source ?? "[unknown]"
            })
        );

        this.onEvent = eventListener.event;

        const telemetryListener = new RpcSubscription<
            SourcedTelemetry__Output,
            Sourced<Telemetry>
        >(
            "Telemetry",
            log,
            () => this.client.SubTelemetry({}),
            (data) => ({
                time: (
                    (Convert.toNumber(data.telemetry?.time?.unix?.seconds?.toNumber()) * 1000)
                    + (Convert.toNumber(data.telemetry?.time?.unix?.nanos) / 1000000)
                ),
                sclk: data.telemetry?.time?.sclk ?? 0,
                value: data.telemetry?.value ? Convert.valueFromProto(
                    data.telemetry.value,
                    new Convert.ConversionContext(["value"]),
                ) : null,
                def: Convert.telemetryFromProto(
                    data.telemetry?.ref ?? {},
                    new Convert.ConversionContext(["def"]),
                ),
                source: data.source ?? "[unknown]"
            })
        );

        this.onTelemetry = telemetryListener.event;

        const downlinkListener = new RpcSubscription(
            "Downlink",
            log,
            () => this.client.SubFileDownlink({}),
            (data) => data
        );

        this.onDownlink = downlinkListener.event;

        const uplinkListener = new RpcSubscription(
            "Uplink",
            log,
            () => this.client.SubFileUplink({}),
            (data) => data
        );

        this.onUplink = uplinkListener.event;

        const fileTransferListener = new RpcSubscription(
            "FileTransfer",
            log,
            () => this.client.SubFileTransfer({}),
            (data) => Convert.fileTransferState(data)
        );

        this.onFileTransfer = fileTransferListener.event;
    }

    getFileTransferState(token?: vscode.CancellationToken): Promise<Proto.IFileTransferState> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined = undefined;

            const call = this.client.GetFileTransferState({}, (err, response) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve(Convert.fileTransferState(response));
                }
            });

            disp = token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    clearDownlinkTransferState(token?: vscode.CancellationToken): Promise<void> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined = undefined;

            const call = this.client.ClearDownlinkTransferState({}, (err) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

            disp = token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    clearUplinkTransferState(token?: vscode.CancellationToken): Promise<void> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined = undefined;

            const call = this.client.ClearUplinkTransferState({}, (err) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

            disp = token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    getFsw(id: string, token?: vscode.CancellationToken): Promise<Hermes.Fsw> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined = undefined;

            const call = this.client.GetFsw({ id }, (err, value) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve(new RpcFsw(this.client, value));
                }
            });

            disp = token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    allFsw(token?: vscode.CancellationToken): Promise<Hermes.Fsw[]> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.AllFsw({}, (err, value) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve(value?.all?.map((fsw) => new RpcFsw(this.client, fsw)) ?? []);
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    startProfile(id: string, token?: vscode.CancellationToken): Promise<void> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.startProfile({ id }, (err) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    stopProfile(id: string, token?: vscode.CancellationToken): Promise<void> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.stopProfile({ id }, (err) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    updateProfile(id: string, settings: string, token?: vscode.CancellationToken): Promise<void> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.updateProfile({ id, settings }, (err) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    addProfile(profile: Hermes.Profile, token?: vscode.CancellationToken): Promise<string> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.addProfile(profile, (err, value) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else if (!value?.id) {
                    reject(new Error("empty response"));
                } else {
                    resolve(value.id);
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    removeProfile(id: string, token?: vscode.CancellationToken): Promise<void> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.removeProfile({ id }, (err) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    allProfiles(token?: vscode.CancellationToken): Promise<Record<string, Proto.IStatefulProfile>> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.allProfiles({}, (err, values) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve(values?.all ?? {});
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }
    allProviders(token?: vscode.CancellationToken): Promise<Proto.IProfileProvider[]> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.allProviders({}, (err, values) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve(values?.all ?? []);
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    getDictionary(id: string, sections?: readonly string[], token?: vscode.CancellationToken): Promise<Proto.IDictionary> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const md = new grpc.Metadata();
            for (const section of sections ?? []) {
                md.add("sections", section);
            }

            const call = this.client.getDictionary({ id }, md, (err, value) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else if (!value) {
                    reject(new Error("empty response"));
                } else {
                    resolve(value);
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    addDictionary(dict: Proto.IDictionary, token?: vscode.CancellationToken): Promise<string> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.addDictionary(dict as Dictionary, (err, value) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve(value?.id ?? "");
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    allDictionaries(token?: vscode.CancellationToken): Promise<Record<string, Proto.IDictionaryHead>> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.allDictionary({}, (err, value) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve(value?.all ?? {});
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    removeDictionary(id: string, token?: vscode.CancellationToken): Promise<void> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined;

            const call = this.client.removeDictionary({ id }, (err) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

            token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    state(): grpc.connectivityState {
        return this.client.getChannel().getConnectivityState(false);
    }

    get url(): string {
        return this.client.getChannel().getTarget();
    }

    dispose() {
        this.client.close();
    }
}
