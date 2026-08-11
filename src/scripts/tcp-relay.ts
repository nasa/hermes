import winston from "winston";
import * as net from "net";

import { Command, InvalidArgumentError } from '@commander-js/extra-typings';

const log = winston.createLogger({
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
        winston.format.prettyPrint(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.label({ label: "tcp-relay", message: true }),
                winston.format.simple(),
                winston.format.splat(),
                winston.format.colorize(),
                winston.format.printf(
                    ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`
                )
            )
        })
    ]
});

interface Disposable {
    dispose(): void;
}

interface CancellationToken {
    onCancellationRequested(listener: () => void): Disposable;
}

class CancellationTokenSource {
    token: CancellationToken;
    private listeners = new Set<() => void>();

    constructor() {
        this.token = {
            onCancellationRequested: (listener) => {
                this.listeners.add(listener);
                return {
                    dispose: () => {
                        this.listeners.delete(listener);
                    }
                };
            }
        };
    }

    cancel() {
        for (const listener of this.listeners) {
            listener();
        }
    }

    dispose() {
        this.listeners.clear();
    }
}

function createTerminationSource(): CancellationTokenSource {
    const source = new CancellationTokenSource();
    process.on("SIGTERM", () => {
        log.debug("Recieved signal SIGTERM");
        source.cancel();
    });
    process.on("SIGINT", () => {
        log.debug("Recieved signal SIGINT");
        source.cancel();
    });

    return source;
}

interface Source {
    on(event: "data", handler: (data: Buffer) => void): void;
    off(event: "data", handler: (data: Buffer) => void): void;
    write(data: Buffer): void;
}

class SourceImpl implements Source {
    handlers: Set<(data: Buffer) => void>;
    source?: net.Socket;

    constructor() {
        this.handlers = new Set();
    }

    listen(socket: net.Socket) {
        socket.on("data", (data) => {
            for (const handler of this.handlers) {
                handler(data);
            }
        });

        if (this.source) {
            log.warn("got another source connection while one was still connected, overriding the previous connection");
            this.source.destroy();
            setTimeout(() => {
                this.source = socket;
            }, 0);
        } else {
            this.source = socket;
        }

        socket.on("end", () => {
            this.source = undefined;
        });
    }

    on(event: "data", handler: (data: Buffer) => void): void {
        if (event === "data") {
            this.handlers.add(handler);
        }
    }

    off(event: "data", handler: (data: Buffer) => void): void {
        if (event === "data") {
            this.handlers.delete(handler);
        }
    }

    write(data: Buffer): void {
        if (this.source) {
            this.source.write(data);
        } else {
            log.warn(`no source connecting, dropping uplink packet of size ${data.length}`);
        }
    }
}

export function createServer(
    sourceSocket: Source,
    port: number,
    isDuplex: boolean,
    token: CancellationToken
) {

    const server = net.createServer((socket) => {
        const addr = `${socket.remoteAddress}:${socket.remotePort}`;

        function msg(message: string) {
            return `[${port} ${isDuplex ? 'D' : 'R'}] [${addr}] ${message}`;
        };

        function dataHandler(data: Buffer) {
            log.debug(msg(`relaying downlink ${data.byteLength}`));
            socket.write(data);
        }

        const closeDisposable = token.onCancellationRequested(() => {
            socket.destroy();
        });

        sourceSocket.on('data', dataHandler);

        log.info(msg('Connected'));

        socket.on('end', () => {
            sourceSocket.off('data', dataHandler);
            log.info(msg('Disconnected'));
        });

        socket.on('error', (err) => {
            sourceSocket.off('data', dataHandler);
            log.error(msg(`${err}`));
        });

        socket.on('close', () => {
            closeDisposable.dispose();
        });

        socket.on('data', (data) => {
            if (isDuplex) {
                log.debug(msg(`relaying uplink ${data.byteLength}`));
                sourceSocket.write(data);
            } else {
                log.warn(msg(`received ${data.byteLength} bytes, uplink is disabled, dropping...`));
            }
        });
    });

    server.on('error', (err) => {
        log.error(`Server on port ${port} error: ${err}`);
    });

    server.listen(port, () => {
        if (isDuplex) {
            log.info(`Duplex server listening on port ${port}`);
        } else {
            log.info(`Readable server listening on port ${port}`);
        }
    });

    token.onCancellationRequested(() => {
        server.close((err) => {
            if (err) {
                log.error(`Server on port ${port} errored during close ${err}`);
            } else {
                log.debug(`Server on port ${port} closed`);
            }
        });
    });
}

function argParseInt(value: string) {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
        throw new InvalidArgumentError('Not a number.');
    }

    return parsedValue;
}

function collectInts(value: string, previousValue: number[]) {
    const parsedValue = argParseInt(value);
    previousValue.push(parsedValue);
    return previousValue;
}

async function main() {
    const program = new Command();

    const keyboardInterrupt = createTerminationSource();

    program
        .name('tcp-relay')
        .description(`Relays a TCP port to another TCP port that supports multiple connections.

This program can listen uplink/downlink enabled ports (duplex) or just downlink (readable) ports.
Duplex ports will relay any data written to them back to the source. Readable ports will emit a warning 
when written to and the data will be dropped.`
        )
        .version("1.0.0")
        .usage('tcp-relay --source-address localhost --source-port 5050 --duplex-ports 5051 --readable-ports 5052');

    const args = program
        .option('--debug', 'Print debug log levels', false)
        .option('--server', 'Serve a TCP server for the source instead of connecting to an active server')
        .option('--source-address <address>', 'Address of Host TCP socket to connect to', 'localhost')
        .requiredOption('--source-port <port>', 'Port of Host TCP socket to connect to', argParseInt)
        .option('--duplex-ports <ports...>', 'Ports to relay from host, can be read and written to', collectInts, [])
        .option('--readable-ports <ports...>', 'Ports to relay from host, can be only be read from', collectInts, [])
        .parse(process.argv)
        .opts();

    if (args.debug) {
        log.level = 'debug';
    }

    const source = new SourceImpl();

    if (args.server) {
        const server = net.createServer((socket) => {
            const addr = `${socket.remoteAddress}:${socket.remotePort}`;

            function msg(message: string) {
                return `[${args.sourcePort} S] [${addr}] ${message}`;
            };

            const closeDisposable = keyboardInterrupt.token.onCancellationRequested(() => {
                socket.destroy();
            });

            socket.on('error', (err) => {
                log.error(msg(`${err}`));
            });

            socket.on('end', () => {
                log.info(msg('Disconnected'));
                closeDisposable.dispose();
            });

            log.info(msg('Connected'));
            source.listen(socket);
        });

        server.on('error', (err) => {
            log.error(`Source server on port ${args.sourcePort} error: ${err}`);
        });

        server.listen(args.sourcePort, () => {
            log.info(`Source server listening on port ${args.sourcePort}`);
        });

        keyboardInterrupt.token.onCancellationRequested(() => {
            server.close((err) => {
                if (err) {
                    log.error(`Source server on port ${args.sourcePort} errored during close ${err}`);
                } else {
                    log.debug(`Source server on port ${args.sourcePort} closed`);
                }
            });
        });
    } else {
        const sourceClient = new net.Socket();
        log.info(`Connecting to source socket at ${args.sourceAddress}:${args.sourcePort}`);
        try {
            await new Promise<void>((resolve, reject) => {
                sourceClient.once('error', reject);

                const disp = keyboardInterrupt.token.onCancellationRequested(() => {
                    sourceClient.destroy(new Error('Connection cancelled'));
                });

                sourceClient.connect({
                    host: args.sourceAddress,
                    port: args.sourcePort,
                    keepAlive: true
                }, () => {
                    disp.dispose();
                    sourceClient.off('error', reject);
                    resolve();
                });
            });
        } catch (err) {
            let msg;
            if ('errors' in (err as Error)) {
                msg = ((err as any).errors as Error[]).map(v => v.message).join(', ');
            } else {
                msg = `${err}`;
            }

            log.error(`Failed to connect: ${msg}`);
            return 1;
        }

        sourceClient.on('error', (err) => {
            log.error(`Source socket error: ${err}`);
        });

        keyboardInterrupt.token.onCancellationRequested(() => {
            sourceClient.destroy();
            log.debug('Source connection closed');
        });

        log.info('Source connection active');
        source.listen(sourceClient);
    }

    for (const duplexPort of args.duplexPorts) {
        createServer(
            source,
            duplexPort,
            true,
            keyboardInterrupt.token
        );
    }

    for (const readablePort of args.readablePorts) {
        createServer(
            source,
            readablePort,
            false,
            keyboardInterrupt.token
        );
    }
}

main();
