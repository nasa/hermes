import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';
import winston from "winston";
import Transport, { TransportStreamOptions } from "winston-transport";
import { MESSAGE } from 'triple-beam';

import * as Hermes from "@gov.nasa.jpl.hermes/api";
import { generateShortUid } from '@gov.nasa.jpl.hermes/util';

/**
 * Task definition for F Prime deployment
 * Creates profile and optionally starts FSW
 */
export interface FprimeDeploymentTaskDefinition {
    readonly type: 'hermes-fprime-deployment';

    /**
     * Profile name
     */
    title: string;

    /**
     * Profile provider type
     */
    profileProvider: "FPrime Server" | "FPrime Client";

    /**
     * Profile settings (address, dictionary, protocol)
     */
    profileSettings: {
        name: string;
        address: string;
        dictionary: string;
        protocol: string;
    };

    /**
     * FSW binary path (optional)
     * If provided, will start FSW after profile is created
     */
    fswCommand?: string;
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
 * Pseudoterminal for F Prime deployment
 * Creates profile and optionally starts FSW
 */
class FprimeDeploymentPseudoTerminal implements vscode.Pseudoterminal {
    private _onDidWrite = new vscode.EventEmitter<string>();
    onDidWrite = this._onDidWrite.event;

    private _onDidClose = new vscode.EventEmitter<void | number>();
    onDidClose = this._onDidClose.event;

    logger!: winston.Logger;
    private fswProcess?: child_process.ChildProcess;
    private profileId?: string;

    constructor(readonly api: Hermes.Api, readonly def: FprimeDeploymentTaskDefinition) { }

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

        try {
            // Step 1: Create and start profile
            this.logger.info(`Creating profile: ${this.def.title}`);
            this.logger.info(`  Provider: ${this.def.profileProvider}`);
            const settings = JSON.stringify(this.def.profileSettings);
            this.logger.info(`  Settings: ${settings}`);

            this.profileId = await this.api.addProfile({
                name: this.def.title,
                provider: this.def.profileProvider,
                settings,
                id: generateShortUid(),
            });

            this.onDidClose(async () => {
                if (this.profileId) {
                    const profileId = this.profileId;
                    this.profileId = undefined;

                    try {
                        await this.api.stopProfile(profileId);
                    } catch (err) {
                        this.logger.error(`failed to stop profile on close: ${err}`);
                    }
                }
            });

            this.logger.info(`Profile created successfully with ID: ${this.profileId}`);
            this.logger.info(`Starting profile...`);
            await this.api.startProfile(this.profileId);
            this.logger.info(`Profile started successfully`);
        } catch (err) {
            this.logger.error(`Failed to create/start deployment: ${err}`);
            this._onDidClose.fire(1);
            return;
        }

        // Step 2: Start FSW if requested
        if (this.def.fswCommand) {
            this.logger.info(`Starting FSW: ${this.def.fswCommand}`);

            try {
                // Spawn FSW process
                this.fswProcess = child_process.spawn(this.def.fswCommand, [], {
                    shell: true,
                    cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                });

                // Pipe stdout to terminal
                this.fswProcess.stdout?.on('data', (data: Buffer) => {
                    // Normalize line endings: replace \n with \r\n, and standalone \r with \r\n
                    const normalized = data.toString()
                        .replace(/\r\n/g, '\n')  // First normalize \r\n to \n
                        .replace(/\r/g, '\n')     // Then convert standalone \r to \n
                        .replace(/\n/g, '\r\n');  // Finally convert all \n to \r\n
                    this._onDidWrite.fire(normalized);
                });

                // Pipe stderr to terminal
                this.fswProcess.stderr?.on('data', (data: Buffer) => {
                    // Normalize line endings: replace \n with \r\n, and standalone \r with \r\n
                    const normalized = data.toString()
                        .replace(/\r\n/g, '\n')  // First normalize \r\n to \n
                        .replace(/\r/g, '\n')     // Then convert standalone \r to \n
                        .replace(/\n/g, '\r\n');  // Finally convert all \n to \r\n
                    this._onDidWrite.fire(normalized);
                });

                // Handle process exit
                this.fswProcess.on('exit', (code, signal) => {
                    if (code !== null) {
                        this.logger.info(`FSW process exited with code ${code}`);
                    } else if (signal) {
                        this.logger.info(`FSW process killed with signal ${signal}`);
                    }
                    this._onDidClose.fire(code ?? 0);
                });

                // Handle process errors
                this.fswProcess.on('error', (err) => {
                    this.logger.error(`Failed to start FSW process: ${err.message}`);
                    this._onDidClose.fire(1);
                });

                this.logger.info(`FSW process started with PID ${this.fswProcess.pid}`);
                // Keep terminal open - it will close when FSW exits
            } catch (err) {
                this.logger.error(`Failed to spawn FSW: ${err}`);
                this._onDidClose.fire(1);
            }
        } else {
            // Profile only, task completes after creation
            this._onDidClose.fire(0);
        }
    }

    close(): void {
        // Kill FSW process if still running
        if (this.fswProcess && !this.fswProcess.killed) {
            this.logger.info("Stopping FSW...");
            this.fswProcess.kill('SIGTERM');



            // Force kill after 5 seconds if still alive
            setTimeout(() => {
                if (this.fswProcess && !this.fswProcess.killed) {
                    this.logger.info("FSW did not stop in 5s, killing...");
                    this.fswProcess.kill('SIGKILL');
                }
            }, 5000);
        }
    }
}

/**
 * Task provider for F Prime deployments
 * Auto-discovers deployments from build-artifacts and creates tasks for deployment
 */
export class FprimeDeploymentProvider implements vscode.TaskProvider {
    constructor(readonly api: Hermes.Api) { }

    async provideTasks(token: vscode.CancellationToken): Promise<vscode.Task[]> {
        // Find all build artifact directories
        const buildArtifactsFiles = await vscode.workspace.findFiles('**/build-artifacts/*', null, undefined, token);
        const tasks: vscode.Task[] = [];
        let basePort = 8000; // F Prime convention

        const buildArtifactsSet = new Set(buildArtifactsFiles.map((v) => path.dirname(v.fsPath)));
        const buildArtifacts = Array.from(buildArtifactsSet).map(v => vscode.Uri.file(v));

        for (const artifactDir of buildArtifacts) {
            // Discover all toolchains in build-artifacts
            let toolchains: [string, vscode.FileType][];
            try {
                toolchains = await vscode.workspace.fs.readDirectory(artifactDir);
            } catch (_err) {
                continue; // Can't read build-artifacts directory
            }

            for (const [toolchainName, toolchainType] of toolchains) {
                if (toolchainType !== vscode.FileType.Directory) {
                    continue;
                }

                const builtToolchain = vscode.Uri.joinPath(artifactDir, toolchainName);

                let deployments: [string, vscode.FileType][];
                try {
                    deployments = await vscode.workspace.fs.readDirectory(builtToolchain);
                } catch (_err) {
                    continue; // Can't read toolchain directory
                }

                for (const [deploymentName, fileType] of deployments) {
                    if (fileType !== vscode.FileType.Directory) continue;

                    // Check for dictionary
                    const dictPath = vscode.Uri.joinPath(builtToolchain, deploymentName, "dict");
                    let dictionaryFiles: [string, vscode.FileType][];
                    try {
                        dictionaryFiles = await vscode.workspace.fs.readDirectory(dictPath);
                    } catch {
                        continue; // No dict directory, skip
                    }

                    const dictionaryFile = dictionaryFiles.find(v => v[0].endsWith(".json"));
                    if (!dictionaryFile) continue;

                    const binaryPath = vscode.workspace.asRelativePath(vscode.Uri.joinPath(
                        builtToolchain,
                        deploymentName,
                        "bin",
                        deploymentName
                    ));

                    // Create F Prime deployment task
                    const taskDef: FprimeDeploymentTaskDefinition = {
                        type: 'hermes-fprime-deployment',
                        title: deploymentName,
                        profileProvider: 'FPrime Server',
                        profileSettings: {
                            name: deploymentName,
                            address: `0.0.0.0:${basePort}`,
                            dictionary: deploymentName,
                            protocol: 'ccsds',
                        },
                        fswCommand: `\${workspaceFolder}/${binaryPath} -a 0.0.0.0 -p ${basePort}`,
                    };

                    const task = new vscode.Task(
                        taskDef,
                        vscode.TaskScope.Workspace,
                        `${deploymentName}: Deploy`,
                        'fprime',
                        new vscode.CustomExecution(async () => {
                            return new FprimeDeploymentPseudoTerminal(this.api, taskDef);
                        })
                    );

                    task.isBackground = true;
                    task.problemMatchers = [];
                    task.detail = `Create profile and optionally start FSW for ${deploymentName}`;
                    task.group = vscode.TaskGroup.Build;

                    tasks.push(task);

                    basePort += 1;
                }
            }
        }

        return tasks;
    }

    resolveTask(task: vscode.Task, _token: vscode.CancellationToken): vscode.Task | undefined {
        const def = task.definition as FprimeDeploymentTaskDefinition;

        if (def.type !== 'hermes-fprime-deployment') {
            return undefined;
        }

        return new vscode.Task(
            task.definition,
            vscode.TaskScope.Workspace,
            task.name,
            "fprime",
            new vscode.CustomExecution(async (resolvedDef) => {
                const deploymentDef = resolvedDef as FprimeDeploymentTaskDefinition;
                return new FprimeDeploymentPseudoTerminal(this.api, deploymentDef);
            })
        );
    }
}
