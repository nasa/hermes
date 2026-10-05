import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import yamcsDescriptor from './proto/yamcs.json';
import type { ProtoGrpcType } from './proto/yamcs/processing';
import type { MdbApiClient } from './proto/yamcs/yamcs/protobuf/mdb/MdbApi';
import type { ListParametersResponse__Output } from './proto/yamcs/yamcs/protobuf/mdb/ListParametersResponse';
import type { ProcessingApiClient } from './proto/yamcs/yamcs/protobuf/processing/ProcessingApi';
import type { SubscribeParametersData__Output } from './proto/yamcs/yamcs/protobuf/processing/SubscribeParametersData';
import type { ParameterValue__Output } from './proto/yamcs/yamcs/protobuf/pvalue/ParameterValue';
import type { ProcessorInfo__Output } from './proto/yamcs/yamcs/protobuf/yamcsManagement/ProcessorInfo';

export type { ParameterValue__Output as YamcsParameterValue } from './proto/yamcs/yamcs/protobuf/pvalue/ParameterValue';
export type { Value__Output as YamcsValue } from './proto/yamcs/yamcs/protobuf/Value';
export type { Timestamp__Output as YamcsTimestamp } from './proto/yamcs/google/protobuf/Timestamp';

// 64-bit integers decode as strings so they stay exact, and enums as their names.
// The generated types in ./proto/yamcs assume the same, so these options must match
// the --longs and --enums flags of the proto-ts-yamcs script in the root package.json.
const yamcsDefinition = protoLoader.fromJSON(yamcsDescriptor as any, {
    longs: String,
    enums: String,
});
const yamcsPackage = grpc.loadPackageDefinition(yamcsDefinition) as unknown as ProtoGrpcType;

/**
 * Client for the YAMCS API that the yamcs-grpc plugin serves over gRPC.
 */
export class YamcsClient {
    private readonly processing: ProcessingApiClient;
    private readonly mdb: MdbApiClient;

    constructor(address: string) {
        const credentials = grpc.credentials.createInsecure();
        this.processing = new yamcsPackage.yamcs.protobuf.processing.ProcessingApi(address, credentials, {
            // Ping after 5 quiet minutes so we notice a dead connection, as yamcs-recorder does.
            // The plugin, like any grpc-java server, closes the connection of a client that pings
            // more often than that.
            'grpc.keepalive_time_ms': 5 * 60 * 1000,
        });
        // MdbApi shares ProcessingApi's channel, so we only need to wait on and close processing.
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
     * Qualified names of instance's TELEMETERED parameters, the ones YAMCS
     * decodes from telemetry. YAMCS lists them a page at a time, so we keep
     * asking, passing back each page's continuation token, until a page comes
     * without one.
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
     * of each parameter, then every new value it receives. Names YAMCS does not
     * know are skipped rather than ending the subscription. Every value passed to
     * onValues has its qualified name in id.name. The subscription ends when the
     * processor stops.
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
        // YAMCS never ends a parameter subscription whose processor stops, for
        // example when someone restarts the instance. It just goes quiet. So we
        // watch the processor and end the subscription ourselves.
        const watch = this.processing.SubscribeProcessors({ instance, processor });
        let ended = false;
        const cancel = () => {
            ended = true;
            call.cancel();
            watch.cancel();
        };
        const end = (err: Error) => {
            if (!ended) {
                cancel();
                onEnd(err);
            }
        };
        watch.on('data', (info: ProcessorInfo__Output) => {
            if (info.state === 'STOPPING' || info.state === 'TERMINATED' || info.state === 'FAILED') {
                end(new Error(`YAMCS processor ${processor} is ${info.state}`));
            }
        });
        // For both streams, 'status' arrives once however the call ends. 'error'
        // still needs a listener or Node throws it.
        watch.on('error', () => { });
        watch.on('status', (status: grpc.StatusObject) => {
            if (status.code !== grpc.status.CANCELLED) {
                end(new Error(`YAMCS processor watch ended: ${grpc.status[status.code]} ${status.details}`));
            }
        });

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
                const name = nameById.get(pv.numericId ?? -1);
                if (name) {
                    values.push({ ...pv, id: { name } });
                }
            }
            if (values.length > 0) {
                onValues(values);
            }
        });

        call.on('error', () => { });
        call.on('status', (status: grpc.StatusObject) => {
            if (status.code !== grpc.status.CANCELLED) {
                end(new Error(`YAMCS parameter subscription ended: ${grpc.status[status.code]} ${status.details}`));
            }
        });

        call.write({
            instance,
            processor,
            id: names.map((name) => ({ name })),
            sendFromCache: true,
            abortOnInvalid: false,
        });

        return cancel;
    }

    close() {
        this.processing.close();
    }
}
