import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';
import winston from "winston";

import * as Hermes from "@gov.nasa.jpl.hermes/api";
import { generateShortUid } from '@gov.nasa.jpl.hermes/util';
import { attachLoggerToPsuedoTerminal, attachProcessToPsuedoTerminal, StandardPseudoTerminal } from '@gov.nasa.jpl.hermes/vscode';

const textDecoder = new TextDecoder();

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
 * Pseudoterminal for F Prime deployment
 * Creates profile and optionally starts FSW
 */
class FprimeDeploymentPseudoTerminal implements vscode.Pseudoterminal, StandardPseudoTerminal {
    didWrite = new vscode.EventEmitter<string>();
    onDidWrite = this.didWrite.event;

    didClose = new vscode.EventEmitter<void | number>();
    onDidClose = this.didClose.event;

    logger!: winston.Logger;
    private fswProcess?: child_process.ChildProcess;
    private profileId?: string;

    constructor(readonly api: Hermes.Api, readonly def: FprimeDeploymentTaskDefinition) { }

    async open(_initialDimensions: vscode.TerminalDimensions | undefined): Promise<void> {
        attachLoggerToPsuedoTerminal(this);

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
            this.logger.info(`Profile created successfully with ID: ${this.profileId}`);

            this.onDidClose(async () => {
                if (this.profileId) {
                    const profileId = this.profileId;
                    this.profileId = undefined;

                    try {
                        await this.api.stopProfile(profileId);
                    } catch (err) {
                        this.logger.error(`failed to stop profile on close: ${err}`);
                        this.api.removeProfile(profileId);
                    }
                }
            });

            // If we are the server, we should host the server immediately
            if (this.def.profileProvider === "FPrime Server") {
                this.logger.info(`Starting profile...`);
                await this.api.startProfile(this.profileId);
                this.logger.info(`Profile started successfully`);
            }
        } catch (err) {
            this.logger.error(`Failed to create/start deployment: ${err}`);
            this.didClose.fire(1);
            return;
        }

        // Step 2: Start FSW if requested
        if (this.def.fswCommand) {
            this.logger.info(`Starting FSW: ${this.def.fswCommand}`);
            this.fswProcess = attachProcessToPsuedoTerminal(
                this,
                this.def.fswCommand,
                [],
                {
                    shell: true,
                    cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
                }
            );

            // If we are the client, we should attempt to connect to the server hosted by the FSW
            if (this.def.profileProvider === "FPrime Client") {
                for (let i = 0; i < 5; i++) {
                    this.logger.info(`Starting profile...`);
                    try {
                        await this.api.startProfile(this.profileId);
                        this.logger.info(`Profile started successfully`);
                        break;
                    } catch (err) {
                        this.logger.warn(`Failed to connect to FSW: ${err}`);
                        this.logger.info(`${i + 1} / 5 Retrying in 1s`);
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
            }
        } else {
            // Profile only, task completes after creation
            this.didClose.fire(0);
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

                for (const [deploymentModule, fileType] of deployments) {
                    if (fileType !== vscode.FileType.Directory) continue;

                    // Check for dictionary
                    const dictPath = vscode.Uri.joinPath(builtToolchain, deploymentModule, "dict");
                    let deploymentName: string;
                    try {
                        const dictionaryFiles = await vscode.workspace.fs.readDirectory(dictPath);

                        const dictionaryFile = dictionaryFiles.find(v => v[0].endsWith(".json"));
                        if (!dictionaryFile) continue;

                        const dictContent = await vscode.workspace.fs.readFile(
                            vscode.Uri.joinPath(dictPath, dictionaryFile[0])
                        );

                        const dict = JSON.parse(textDecoder.decode(dictContent));
                        deploymentName = dict.metadata.deploymentName;
                        if (!deploymentName) {
                            throw new Error(`invalid deployment name: ${deploymentName}`);
                        }
                    } catch {
                        continue; // No dict directory or failed to read dict, skip
                    }

                    const binaryPath = vscode.workspace.asRelativePath(vscode.Uri.joinPath(
                        builtToolchain,
                        deploymentModule,
                        "bin",
                        deploymentModule
                    ));

                    // Create F Prime deployment task
                    const taskDef: FprimeDeploymentTaskDefinition = {
                        type: 'hermes-fprime-deployment',
                        title: deploymentModule,
                        profileProvider: 'FPrime Server',
                        profileSettings: {
                            name: deploymentName,
                            address: `0.0.0.0:${basePort}`,
                            dictionary: deploymentName,
                            protocol: 'ccsds',
                        },
                        fswCommand: `${binaryPath} -a 0.0.0.0 -p ${basePort}`,
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
