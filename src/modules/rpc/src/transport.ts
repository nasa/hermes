import type * as vscode from 'vscode';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import * as Hermes from '@gov.nasa.jpl.hermes/api';

import { ApiClient } from './proto/hermes/Api';
import hermesDescriptor from './proto/hermes.json';
import { ProtoGrpcType } from './proto/hermes/hermes';

const MAX_MESSAGE_SIZE = 1024 * 1024 * 1024 * 10;

const hermesDefinition = protoLoader.fromJSON(hermesDescriptor as any);
const hermesPackage = grpc.loadPackageDefinition(hermesDefinition) as unknown as ProtoGrpcType;


export enum HostAuthenticationKind {
    NONE = 'none',
    USER_PASS = 'userpass',
    TOKEN = 'token'
}

export interface GrpcClientOptions {
    hostAddress: string;
    authMethod?: HostAuthenticationKind;
    skipTLSVerify?: boolean;
    credentials?: string;
}

export class GrpcClient extends hermesPackage.Api implements ApiClient {
    url: string;

    constructor(
        readonly log: Hermes.Log,
        options: GrpcClientOptions,
        grpcOptions?: grpc.ClientOptions
    ) {
        const creds = createAuthenticationCredentials(options);

        let url: string;
        if (options.hostAddress.startsWith('http://')) {
            url = options.hostAddress.substring('http://'.length);
        } else if (options.hostAddress.startsWith('https://')) {
            url = options.hostAddress.substring('https://'.length);
        } else {
            url = options.hostAddress;
        }

        super(url, creds, {
            'grpc.max_send_message_length': MAX_MESSAGE_SIZE,
            'grpc.max_receive_message_length': MAX_MESSAGE_SIZE,
            ...grpcOptions,
        });

        this.url = url;
    }

    connect(token?: vscode.CancellationToken, retryCount: number = -1): Promise<void> {
        let cancelled = false;
        return new Promise((resolve, reject) => {
            const disposable = token?.onCancellationRequested(() => {
                cancelled = true;
                this.log.warn(`Connection to '${this.url}' was cancelled`);
                reject(`Connection to '${this.url}' was cancelled`);
            });

            this.log.debug(`Connecting to Hermes service at ${this.url}`);
            const tryConnect1Hz = () => {
                this.waitForReady(Date.now() + 1000, (err) => {
                    if (cancelled) {
                        return;
                    } else if (err) {
                        if (retryCount > 0) {
                            retryCount -= 1;
                        } else if (retryCount === 0) {
                            reject(err);
                            return;
                        }

                        this.log.warn(`Failed to connect to ${this.url}, retrying ${err}`);
                        tryConnect1Hz();
                    } else {
                        this.log.debug(`Connection to ${this.url} established`);
                        disposable?.dispose();
                        resolve();
                    }
                });
            };

            tryConnect1Hz();
        });
    }
}


function createSSLCredentials(skipTLSVerify: boolean) {
    return grpc.credentials.createSsl(null, null, null, {
        rejectUnauthorized: !skipTLSVerify
    });
}

function createAuthenticationCredentials(options: GrpcClientOptions): grpc.ChannelCredentials {
    let useSSL: boolean;
    const url = new URL(options.hostAddress.startsWith('http') ?
        options.hostAddress
        : 'http://' + options.hostAddress
    );

    switch (url.protocol) {
        case "http:":
        case 'unix:':
            useSSL = false;
            break;
        case "https:":
            useSSL = true;
            break;
        default:
            throw new Error(`Invalid host address ${url}, expected 'http://' or 'https://' address`);
    }

    switch (options.authMethod ?? HostAuthenticationKind.NONE) {
        case HostAuthenticationKind.NONE:
            return useSSL ? createSSLCredentials(options.skipTLSVerify ?? false) : grpc.credentials.createInsecure();
        case HostAuthenticationKind.USER_PASS:
        case HostAuthenticationKind.TOKEN:
            break;
    }

    if (!useSSL) {
        throw new Error(`Authentication is only supported with 'https://' host addresses`);
    }

    if (!options.credentials) {
        throw new Error(`No credentials provided with authentication method ${options.authMethod}`);
    }

    const authHeaderMethod = options.authMethod === HostAuthenticationKind.TOKEN
        ? 'Bearer' : 'Basic';

    return grpc.credentials.combineChannelCredentials(
        createSSLCredentials(options.skipTLSVerify ?? false),
        grpc.credentials.createFromMetadataGenerator((_, callback) => {
            const meta = new grpc.Metadata();
            meta.add('Authorization', `${authHeaderMethod} ${options.credentials}`);
            callback(null, meta);
        })
    );
}
