import * as vscode from 'vscode';
import winston from "winston";
import Transport, { TransportStreamOptions } from "winston-transport";
import { MESSAGE } from 'triple-beam';

import * as Hermes from "@gov.nasa.jpl.hermes/api";

/**
 * Task definition for creating and starting a Hermes profile
 */
export interface CreateProfileTaskDefinition extends vscode.TaskDefinition {
    type: 'hermes-create-profile';

    /**
     * Profile ID, unique
     */
    id: string;

    /**
     * Name of the profile
     */
    name: string;

    /**
     * Profile provider type (e.g., "FPrime Server", "FPrime Client")
     */
    provider: string;

    /**
     * JSON string or object containing the profile settings
     * The structure depends on the provider type
     */
    settings: string | object;

    /**
     * Whether to start the profile after creation (default: true)
     */
    autoStart?: boolean;
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

/**
 * Pseudo terminal for creating and starting a Hermes profile
 */
export class CreateProfilePseudoTerminal implements vscode.Pseudoterminal {
    private _onDidWrite = new vscode.EventEmitter<string>();
    onDidWrite = this._onDidWrite.event;

    private _onDidClose = new vscode.EventEmitter<void | number>();
    onDidClose = this._onDidClose.event;

    logger!: winston.Logger;

    constructor(readonly api: Hermes.Api, readonly def: CreateProfileTaskDefinition) { }

    async open(_initialDimensions: vscode.TerminalDimensions | undefined): Promise<void> {
        this.logger = winston.createLogger({
            transports: [new EventTransport({ emitter: this._onDidWrite })],
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

        const autoStart = this.def.autoStart ?? true;

        try {
            this.logger.info(`Creating profile: ${this.def.name}`);
            this.logger.info(`  Provider: ${this.def.provider}`);

            const settingsStr = typeof this.def.settings === 'string'
                ? this.def.settings
                : JSON.stringify(this.def.settings);

            const profileId = await this.api.addProfile({
                name: this.def.name,
                provider: this.def.provider,
                settings: settingsStr,
                id: this.def.id
            });

            this.logger.info(`Profile created successfully with ID: ${profileId}`);

            if (autoStart) {
                this.logger.info(`Starting profile...`);
                await this.api.startProfile(profileId);
                this.logger.info(`Profile started successfully`);
            }

            this._onDidClose.fire(0);
        } catch (err) {
            this.logger.error(`Failed to create/start profile: ${err}`);
            this._onDidClose.fire(1);
        }
    }

    close(): void { }
}

/**
 * Task provider for generic Hermes profile creation
 */
export class ProfileTaskProvider implements vscode.TaskProvider {
    constructor(readonly api: Hermes.Api) { }

    async provideTasks(_token: vscode.CancellationToken): Promise<vscode.Task[]> {
        // This provider doesn't auto-discover tasks
        // Tasks must be defined in tasks.json or created programmatically
        return [];
    }

    resolveTask(task: vscode.Task, _token: vscode.CancellationToken): vscode.Task | undefined {
        const def = task.definition as CreateProfileTaskDefinition;

        if (def.type !== 'hermes-create-profile') {
            return undefined;
        }

        task.execution = new vscode.CustomExecution(async (resolvedDef) => {
            const profileDef = resolvedDef as CreateProfileTaskDefinition;
            return new CreateProfilePseudoTerminal(this.api, profileDef);
        });

        return task;
    }
}
