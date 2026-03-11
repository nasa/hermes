import * as vscode from 'vscode';
import { platform as nodePlatform } from "os";
import * as child_process from "child_process";
import winston from "winston";
import Transport, { TransportStreamOptions } from "winston-transport";
import { MESSAGE } from 'triple-beam';

import * as Hermes from "@gov.nasa.jpl.hermes/api";

interface FprimeDeploymentTaskDefinition extends vscode.TaskDefinition {
    /**
     * Name of the connection
     */
    name: string;

    /**
     * Path to the dictionary for this deployment
     */
    dictionary: string;

    /**
     * The command to execute to start the flight software
     * after the ground system has been started
     */
    command?: string;

    /**
     * The protocol to use when communicating with the FSW
     */
    protocol: "ccsds" | "fprime";

    /**
     * When provided, the ground system will host a TCP
     * server at this port which the FSW will connect to
     */
    serverPort?: number;

    /**
     * When provided, the ground system will connect to a
     * TCP port at this address
     */
    clientAddress?: string;
}

export class FprimeDeploymentProvider implements vscode.TaskProvider {
    constructor(readonly api: Hermes.Api) { }

    async provideTasks(token: vscode.CancellationToken): Promise<vscode.Task[]> {
        const files = await vscode.workspace.findFiles('**/build-artifacts/*', null, undefined, token);
        const buildArtifactsSet = new Set<string>();
        for (const file of files) {
            buildArtifactsSet.add(file.toString());
        }

        let toolchainName: string;
        switch (nodePlatform()) {
            case 'aix':
            case 'android':
            case 'freebsd':
            case 'haiku':
            case 'openbsd':
            case 'sunos':
            case 'cygwin':
            case 'netbsd':
            case 'win32': // TODO(tumbar) How does this interact with WSL2?
            default:
                return [];
            case 'darwin':
                toolchainName = 'Darwin';
                break;
            case 'linux':
                toolchainName = 'Linux';
                break;
        }

        const buildArtifacts = Array.from(buildArtifactsSet).map(
            v => vscode.Uri.parse(v)
        );

        const deployments: FprimeDeploymentTaskDefinition[] = [];
        const tasks: vscode.TaskDefinition[] = [];
        let basePort = 8000;

        for (const artifact of buildArtifacts) {
            // We can only support running builds that are for the current system
            const builtToolchain = vscode.Uri.joinPath(artifact, toolchainName);
            for (const [deploymentName, deployment] of await vscode.workspace.fs.readDirectory(builtToolchain)) {
                if (deployment === vscode.FileType.Directory) {
                    // Get dictionary
                    const dictionaryFiles = await vscode.workspace.fs.readDirectory(
                        vscode.Uri.joinPath(artifact, toolchainName, deploymentName, "dict")
                    );

                    const dictionaryFile = dictionaryFiles.find(v => v[0].endsWith(".json"));
                    if (dictionaryFile) {
                        const binary = vscode.Uri.joinPath(
                            artifact, toolchainName, deploymentName,
                            "bin", deploymentName
                        );

                        // TODO(tumbar) Look at fprime-gds.yaml?
                        tasks.push(
                            {
                                type: "hermes.load-dictionary",
                                loader: "fprime.json",
                                file: vscode.Uri.joinPath(
                                    artifact, toolchainName, deploymentName,
                                    "dict", dictionaryFile[0],
                                ).fsPath,
                            }
                        );
                        deployments.push({
                            type: "hermes-fprime-deployment",
                            name: deploymentName,
                            dictionary: "",
                            protocol: "ccsds",
                            command: `${binary.fsPath} -a 0.0.0.0 -p ${basePort}`,
                            serverPort: basePort,
                        });

                        basePort += 1;
                    }
                }
            }
        }

        const tasks: vscode.Task[] = [];
        for (const def of deployments) {
            tasks.push(new vscode.Task(
                def, vscode.TaskScope.Workspace, def.name, "hermes"
            ));
        }

        return deployments.map(def => );
    }

    resolveTask(task: vscode.Task, _token: vscode.CancellationToken): vscode.Task | undefined {
        task.execution = new vscode.CustomExecution(async (def1) => {
            const def: FprimeDeploymentTaskDefinition = <any>def1;
            return new FprimeDeploymentPsuedoTerminal(this.api, def);
        });

        return task;
    }
}

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

class FprimeDeploymentPsuedoTerminal implements vscode.Pseudoterminal {
    private _onDidWrite = new vscode.EventEmitter<string>();
    onDidWrite = this._onDidWrite.event;

    private _onDidClose = new vscode.EventEmitter<void | number>();
    onDidClose = this._onDidClose.event;

    logger!: winston.Logger;
    exec?: child_process.ChildProcessWithoutNullStreams;

    constructor(readonly api: Hermes.Api, readonly def: FprimeDeploymentTaskDefinition) { }

    open(_initialDimensions: vscode.TerminalDimensions | undefined): void {
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

        if (this.def.command) {
            this.logger.info("Spawning F Prime FSW deployment");
            this.logger.info(this.def.command);
            this.exec = child_process.spawn(this.def.command);

            this.exec.stdout.on('data', (out) => {
                this._onDidWrite.fire(out);
            });

            this.exec.stderr.on('data', (out) => {
                this._onDidWrite.fire(out);
            });

            this.exec.on("close", (code) => {
                if (code !== 0) {
                    this.logger.error(`F Prime FSW deployment exited with code: ${code}`);
                } else {
                    this.logger.info(`F Prime FSW deployment exited with code: 0`);
                }

                this._onDidClose.fire(code ?? 0);
            });
        } else {
            this.logger.info(`F Prime FSW deployment exited with code: 0`);
        }
    }

    close(): void {

    }
}
