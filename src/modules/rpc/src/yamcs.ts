import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import yamcsDescriptor from './proto/yamcs.json';
import type { ProtoGrpcType } from './proto/yamcs/processing';
import type { MdbApiClient } from './proto/yamcs/yamcs/protobuf/mdb/MdbApi';
import type { ListParametersResponse__Output } from './proto/yamcs/yamcs/protobuf/mdb/ListParametersResponse';
import type { ProcessingApiClient } from './proto/yamcs/yamcs/protobuf/processing/ProcessingApi';
import type { SubscribeParametersData__Output } from './proto/yamcs/yamcs/protobuf/processing/SubscribeParametersData';
import type { ParameterValue__Output } from './proto/yamcs/yamcs/protobuf/pvalue/ParameterValue';

export type { ParameterValue__Output as YamcsParameterValue } from './proto/yamcs/yamcs/protobuf/pvalue/ParameterValue';
export type { Value__Output as YamcsValue } from './proto/yamcs/yamcs/protobuf/Value';
export type { Timestamp__Output as YamcsTimestamp } from './proto/yamcs/google/protobuf/Timestamp';

// longs: String keeps 64-bit values exact. Must match the proto-ts-yamcs options.
const yamcsDefinition = protoLoader.fromJSON(yamcsDescriptor as any, {
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true,
});
const yamcsPackage = grpc.loadPackageDefinition(yamcsDefinition) as unknown as ProtoGrpcType;

/**
 * Whether a parameter sits directly in a top-level space system, such as
 * /BigData_YamcsDeployment/FPrimeTime. fprime-yamcs puts the CCSDS and F Prime
 * packet header fields there, and every F Prime channel at least one level below.
 */
export function inTopLevelSpaceSystem(qualifiedName: string): boolean {
    return /^\/[^/]+$/.test(qualifiedName.substring(0, qualifiedName.lastIndexOf('/')));
}

/**
 * Client for the YAMCS API that the yamcs-grpc plugin serves over gRPC.
 */
export class YamcsClient {
    private readonly processing: ProcessingApiClient;
    private readonly mdb: MdbApiClient;

    constructor(readonly address: string) {
        const credentials = grpc.credentials.createInsecure();
        this.processing = new yamcsPackage.yamcs.protobuf.processing.ProcessingApi(address, credentials, {
            // The plugin's message size limit
            'grpc.max_receive_message_length': 64 * 1024 * 1024,
        });
        this.mdb = new yamcsPackage.yamcs.protobuf.mdb.MdbApi(address, credentials, {
            channelOverride: this.processing.getChannel(),
        });
    }

    waitForReady(timeoutMs: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.processing.waitForReady(Date.now() + timeoutMs, (err) => err ? reject(err) : resolve());
        });
    }

    /**
     * Qualified names of every TELEMETERED parameter of instance
     */
    async listTelemetered(instance: string): Promise<string[]> {
        const names: string[] = [];
        let next: string | undefined;
        do {
            const page = await new Promise<ListParametersResponse__Output>((resolve, reject) => {
                this.mdb.ListParameters({ instance, source: 'TELEMETERED', next }, (err, res) => err ? reject(err) : resolve(res!));
            });
            for (const p of page.parameters ?? []) {
                if (p.qualifiedName) {
                    names.push(p.qualifiedName);
                }
            }
            next = page.continuationToken || undefined;
        } while (next);
        return names;
    }

    /**
     * Subscribe to parameters on a processor. YAMCS first sends the cached value
     * of each parameter, then values as they change. Every value passed to
     * onValues has its qualified name in id.name.
     * @returns a function that cancels the subscription
     */
    subscribeParameters(
        instance: string,
        processor: string,
        names: readonly string[],
        onValues: (values: ParameterValue__Output[]) => void,
        onEnd: (err: Error) => void,
    ): () => void {
        const call = this.processing.SubscribeParameters();

        // Values carry only a numericId. Its name is in the mapping of an
        // earlier (or the same) message on this stream.
        const nameById = new Map<number, string>();
        call.on('data', (data: SubscribeParametersData__Output) => {
            for (const [id, named] of Object.entries(data.mapping ?? {})) {
                if (named.name) {
                    nameById.set(Number(id), named.name);
                }
            }

            const values: ParameterValue__Output[] = [];
            for (const pv of data.values ?? []) {
                const name = pv.id?.name ?? nameById.get(pv.numericId ?? -1);
                if (name) {
                    values.push({ ...pv, id: { name } });
                }
            }
            if (values.length > 0) {
                onValues(values);
            }
        });

        // 'status' arrives once however the call ends. 'error' still needs a
        // listener or Node throws it.
        call.on('error', () => { });
        call.on('status', (status: grpc.StatusObject) => {
            if (status.code !== grpc.status.CANCELLED) {
                onEnd(new Error(`YAMCS parameter subscription ended: ${grpc.status[status.code]} ${status.details}`));
            }
        });

        call.write({
            instance,
            processor,
            id: names.map((name) => ({ name })),
            sendFromCache: true,
            abortOnInvalid: false,
        });

        return () => call.cancel();
    }

    close() {
        this.processing.close();
    }
}
