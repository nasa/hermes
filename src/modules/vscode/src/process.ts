import * as vscode from 'vscode';
import * as child_process from 'child_process';
import winston from "winston";
import Transport, { TransportStreamOptions } from "winston-transport";
import { MESSAGE } from 'triple-beam';

export interface StandardPseudoTerminal {
    didWrite: vscode.EventEmitter<string>;
    didClose: vscode.EventEmitter<void | number>;
    logger: winston.Logger;
}

/**
 * Winston transport that writes to a VSCode EventEmitter
 */
class EventTransport extends Transport {
    emitter: vscode.EventEmitter<string>;
    constructor(options: TransportStreamOptions & { emitter: vscode.EventEmitter<string> }) {
        super(options);
        this.emitter = options.emitter;
    }

    log(info: any, callback: () => void) {
        setImmediate(() => this.emit('logged', info));
        if (this.format) {
            info = this.format.transform(info);
        }

        this.emitter.fire(`${info[MESSAGE]}\r\n`);
        callback();
    }
}

export function attachLoggerToPsuedoTerminal(
    terminal: StandardPseudoTerminal
) {
    terminal.logger = winston.createLogger({
        transports: [new EventTransport({ emitter: terminal.didWrite })],
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
        },
        format: winston.format.combine(
            winston.format.align(),
            winston.format(info => ({ ...info, level: info.level.toUpperCase() }))(),
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.printf(
                ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`
            )
        )
    });
}

export function attachProcessToPsuedoTerminal(
    terminal: StandardPseudoTerminal,
    command: string,
    args?: readonly string[],
    options?: child_process.SpawnOptionsWithoutStdio
): child_process.ChildProcess {
    try {
        // Spawn process
        const process = child_process.spawn(command, args, options);

        // Pipe stdout to terminal
        process.stdout?.on('data', (data: Buffer) => {
            // Normalize line endings: replace \n with \r\n, and standalone \r with \r\n
            const normalized = data.toString()
                .replace(/\r\n/g, '\n')  // First normalize \r\n to \n
                .replace(/\r/g, '\n')     // Then convert standalone \r to \n
                .replace(/\n/g, '\r\n');  // Finally convert all \n to \r\n
            terminal.didWrite.fire(normalized);
        });

        // Pipe stderr to terminal
        process.stderr?.on('data', (data: Buffer) => {
            // Normalize line endings: replace \n with \r\n, and standalone \r with \r\n
            const normalized = data.toString()
                .replace(/\r\n/g, '\n')  // First normalize \r\n to \n
                .replace(/\r/g, '\n')     // Then convert standalone \r to \n
                .replace(/\n/g, '\r\n');  // Finally convert all \n to \r\n
            terminal.didWrite.fire(normalized);
        });

        // Handle process exit
        process.on('exit', (code, signal) => {
            if (code !== null) {
                terminal.logger.info(`Process exited with code ${code}`);
            } else if (signal) {
                terminal.logger.info(`Process killed with signal ${signal}`);
            }
            terminal.didClose.fire(code ?? 0);
        });

        // Handle process errors
        process.on('error', (err) => {
            terminal.logger.error(`Failed to start process: ${err.message}`);
            terminal.didClose.fire(1);
        });

        terminal.logger.info(`Process started with PID ${process.pid}`);

        return process;
    } catch (err) {
        throw new Error(`Failed to spawn process: ${err}`);
    }
}
