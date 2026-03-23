import * as vscode from 'vscode';
import * as tmp from 'tmp';
import * as child_process from 'child_process';
import winston from "winston";

import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { attachLoggerToPsuedoTerminal, attachProcessToPsuedoTerminal, Settings, StandardPseudoTerminal } from '@gov.nasa.jpl.hermes/vscode';

interface LocalTaskDefinition extends vscode.TaskDefinition {
    type: "hermes-local";
    bindType: "unix" | "tcp";
    bind: string;
    configFile?: string;
    workingDir?: string;
}

export class LocalTaskProvider implements vscode.TaskProvider {
    constructor(readonly context: vscode.ExtensionContext) { }

    provideTasks(): vscode.ProviderResult<vscode.Task[]> {
        return [
            this.resolveTask(new vscode.Task(
                {
                    type: "hermes-local",
                    bindType: "tcp",
                    bind: "localhost:6880",
                },
                vscode.TaskScope.Workspace,
                "Hermes (TCP)",
                "hermes"
            ))!,
            this.resolveTask(new vscode.Task(
                {
                    type: "hermes-local",
                    bindType: "unix",
                    bind: "hermes.sock",
                },
                vscode.TaskScope.Workspace,
                "Hermes (Unix Socket)",
                "hermes"
            ))!
        ];
    }

    resolveTask(task: vscode.Task): vscode.Task | undefined {
        const def = task.definition as LocalTaskDefinition;
        if (def.type !== 'hermes-local') {
            return undefined;
        }

        const resolved = new vscode.Task(
            def,
            task.scope ?? vscode.TaskScope.Workspace,
            task.name,
            'hermes',
            new vscode.CustomExecution(async (def) => (
                new LocalBackendExecution(
                    Settings.hostBinary() ?? this.context.asAbsolutePath("out/backend"),
                    def as LocalTaskDefinition,
                )
            ))
        );

        resolved.problemMatchers = [];
        resolved.isBackground = true;
        return resolved;
    }
}

export class LocalBackendExecution implements vscode.Pseudoterminal, StandardPseudoTerminal {
    process?: child_process.ChildProcess;

    didWrite = new vscode.EventEmitter<string>();
    onDidWrite = this.didWrite.event;

    didClose = new vscode.EventEmitter<void | number>();
    onDidClose = this.didClose.event;
    logger!: winston.Logger;

    constructor(
        readonly binary: string,
        readonly def: LocalTaskDefinition
    ) { }

    async connect(
        connectLog: Hermes.Log,
        token?: vscode.CancellationToken
    ): Promise<Local> {
        let url: string;
        switch (this.def.bindType) {
            case "tcp":
                url = "http://" + this.def.bind;
                break;
            case "unix":
                url = "unix://" + this.def.bind;
                break;
        }

        const client = new Rpc.GrpcClient(connectLog, {
            hostAddress: url,
            authMethod: Rpc.HostAuthenticationKind.NONE,
        });

        await client.connect(token);
        return new Local(client, this, this.logger);
    }

    private async _open() {
        let workingDir: vscode.Uri;
        const workspaceDir = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceDir) {
            throw new Error(`Cannot run local backend outside of workspace`);
            return;
        }

        if (this.def.workingDir) {
            workingDir = vscode.Uri.file(this.def.workingDir.replace("${workspaceDir}", workspaceDir.uri.fsPath));
        } else {
            workingDir = vscode.Uri.joinPath(workspaceDir.uri, ".hermes");
        }

        try {
            await vscode.workspace.fs.createDirectory(workingDir);
        } catch (err) {
            this.logger.error(`Failed to create working directory: ${err}`);
            this.didClose.fire(1);
            return;
        }

        const args = [
            "--root",
            workingDir.fsPath,
            "--bind-type",
            this.def.bindType,
            "--bind",
            this.def.bind,
        ];

        if (this.def.configFile) {
            args.push(
                "--config",
                this.def.configFile
            );
        }

        this.logger.info(`Starting Backend: ${this.binary} ${args.join(" ")}`);
        this.process = attachProcessToPsuedoTerminal(
            this,
            this.binary,
            args,
            {
                shell: true,
                cwd: this.def.workingDir,
            }
        );
    }

    async open() {
        attachLoggerToPsuedoTerminal(this);

        try {
            await this._open();
            vscode.commands.executeCommand(
                "hermes.backend.local.activate",
                this
            );
        } catch (err) {
            this.logger.error(err);
            this.didClose.fire(1);
            vscode.commands.executeCommand(
                "hermes.backend.local.failed",
                err
            );
        }
    }

    close(): void {
        if (this.process) {
            this.logger.info("Stopping backend...");
            this.process.kill('SIGTERM');

            setTimeout(() => {
                if (this.process && !this.process.killed) {
                    this.logger.info("Backend did not stop in 5s, killing...");
                    this.process.kill('SIGKILL');
                }
            }, 5000);
        }
    }
}

export class Local extends Rpc.Client {
    grpcClient: Rpc.GrpcClient;

    constructor(
        client: Rpc.GrpcClient,
        readonly execution: LocalBackendExecution,
        log: Hermes.Log
    ) {
        super(log, client);
        this.grpcClient = client;
    }

    static async startTask(context: vscode.ExtensionContext): Promise<vscode.TaskExecution> {
        const workspaceDir = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceDir) {
            throw new Error("Cannot run local backend outside of workspace");
        }

        const transportPipe = tmp.tmpNameSync({ template: "hermes-transport-XXXXXX.sock" });;
        const workingDir = vscode.Uri.joinPath(workspaceDir.uri, ".hermes");
        const task = new vscode.Task(
            {
                label: "Hermes Backend",
                type: "hermes-local",
                bindType: "unix",
                bind: transportPipe,
                workingDir: workingDir.fsPath,
                $hermesAutoGenerated: true,
            },
            vscode.TaskScope.Workspace,
            "Hermes",
            "hermes"
        );

        task.presentationOptions.reveal = vscode.TaskRevealKind.Silent;
        task.presentationOptions.panel = vscode.TaskPanelKind.New;
        task.presentationOptions.echo = true;
        task.presentationOptions.focus = false;
        task.presentationOptions.clear = false;
        task.presentationOptions.close = false;
        task.isBackground = true;

        return await vscode.tasks.executeTask(
            new LocalTaskProvider(context).resolveTask(task)!
        );
    }

    dispose(): void {
        super.dispose();

        this.grpcClient.close();
        this.execution.close();
    }
}
