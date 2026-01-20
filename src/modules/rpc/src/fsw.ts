import * as vscode from 'vscode';
import { Readable } from 'stream';
import * as grpc from '@grpc/grpc-js';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import * as Seq from '@gov.nasa.jpl.hermes/sequence';
import {
    Proto,
    Convert
} from '@gov.nasa.jpl.hermes/types';

import { ApiClient } from './proto/hermes/Api';
import { CommandDef } from './proto/hermes/CommandDef';
import { Value } from './proto/hermes/Value';
import { UplinkFileChunk } from './proto/hermes/UplinkFileChunk';
import { CommandValue } from './proto/hermes/CommandValue';
import { CommandSequence } from './proto/hermes/CommandSequence';

function commandToProto(value: Seq.CommandValue): CommandValue {
    return {
        def: Convert.commandToProto(value.def) as CommandDef,
        args: value.args.map((arg, idx) =>
            Convert.valueToProto(arg, value.def.arguments[idx].type) as Value
        ),
        metadata: value.metadata,
        options: value.options,
    };
}

function sequenceToProto(value: Hermes.CommandSequence): CommandSequence {
    return {
        commands: value.commands.map(commandToProto),
        languageName: value.language,
        metadata: value.metadata,
    };
}

export class RpcFsw implements Hermes.Fsw {
    id: string;
    type: string;
    profileId: string;
    forwards?: string[] | undefined;

    private metadata: grpc.Metadata;

    constructor(
        readonly client: ApiClient,
        proto: Proto.IFsw | undefined,
    ) {
        this.id = proto?.id ?? "";
        this.type = proto?.type ?? "";
        this.profileId = proto?.profileId ?? "";
        this.forwards = proto?.forwards ?? undefined;

        this.metadata = new grpc.Metadata();
        this.metadata.set("id", this.id);

        if (!proto?.capabilities?.includes(Proto.FswCapability.COMMAND)) {
            this.sequence = undefined;
            // this.command = undefined;
        }

        if (!proto?.capabilities?.includes(Proto.FswCapability.FILE)) {
            this.uplink = undefined;
        }
    }

    async sequence?(
        value: Hermes.CommandSequence,
        token?: vscode.CancellationToken
    ): Promise<boolean> {
        const sequence = sequenceToProto(value);

        return await new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined = undefined;

            const call = this.client.Sequence(
                sequence,
                this.metadata,
                (err, reply) => {
                    disp?.dispose();

                    if (err) {
                        reject(err);
                    } else {
                        resolve(reply?.success ?? false);
                    }
                }
            );

            disp = token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    command(
        value: Seq.CommandValue,
        token?: vscode.CancellationToken,
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let disp: vscode.Disposable | undefined = undefined;

            const call = this.client.Command(commandToProto(value), this.metadata, {}, (err, reply) => {
                disp?.dispose();

                if (err) {
                    reject(err);
                } else {
                    resolve(reply?.success ?? false);
                }
            });

            disp = token?.onCancellationRequested(() => {
                call.cancel();
            });
        });
    }

    uplink?(
        header: Hermes.FileHeader,
        file: Readable,
        progress: vscode.Progress<number>,
        token?: vscode.CancellationToken
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                let disp: vscode.Disposable | undefined = undefined;

                const call = this.client.Uplink(this.metadata, (err, value) => {
                    disp?.dispose();

                    if (err) {
                        reject(err);
                    } else if (!value?.success) {
                        reject(new Error("Uplink failed"));
                    } else {
                        resolve();
                    }
                });

                disp = token?.onCancellationRequested(() => {
                    call.cancel();
                });

                function sendChunk(chunk: UplinkFileChunk) {
                    return new Promise<void>((resolve, reject) => {
                        call.write(chunk, (err: any) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                }

                await sendChunk({ header });
                for await (const chunk of file) {
                    await sendChunk({ data: chunk });
                    progress.report((chunk as Buffer).length / header.size);
                }

                call.end();
            } catch (err) {
                reject(err);
            }
        });
    }
}
