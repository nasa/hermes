import * as vscode from 'vscode';
import * as tmp from 'tmp';

import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Settings } from '@gov.nasa.jpl.hermes/vscode';

export class Local extends Rpc.Client {
    grpcClient: Rpc.GrpcClient;

    constructor(
        client: Rpc.GrpcClient,
        readonly task: vscode.TaskExecution,
        readonly transportPipe: string,
        readonly configFile: tmp.FileResult,
        readonly exitWatcher: vscode.Disposable,
        log: Hermes.Log
    ) {
        super(log, client);
        this.grpcClient = client;
    }

    static async activate(
        context: vscode.ExtensionContext,
        log: Hermes.Log,
        token?: vscode.CancellationToken
    ): Promise<Local> {
        const workspaceDir = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceDir) {
            throw new Error("Cannot run local backend outside of workspace");
        }

        const transportPipe = tmp.tmpNameSync({ template: "hermes-transport-XXXXXX.sock" });;
        const configFile = tmp.fileSync({ template: "hermes-config-XXXXXX.json" });

        try {
            const workingDir = vscode.Uri.joinPath(workspaceDir.uri, ".hermes");
            await vscode.workspace.fs.createDirectory(workingDir);

            const task = new vscode.Task(
                {
                    label: "Hermes Backend",
                    type: "shell",
                    transportPipe: transportPipe,
                    configFile: configFile.name,
                },
                vscode.TaskScope.Workspace,
                "Hermes",
                "hermes",
                new vscode.ProcessExecution(
                    Settings.hostBinary() ?? context.asAbsolutePath("out/backend"),
                    [
                        "--root",
                        workingDir.fsPath,
                        "--bind-type",
                        "unix",
                        "--bind",
                        transportPipe,
                        // "--config",
                        // this.configFile.name
                    ],
                    {
                        cwd: workingDir.fsPath,
                    }
                )
            );

            task.presentationOptions.reveal = vscode.TaskRevealKind.Silent;
            task.presentationOptions.panel = vscode.TaskPanelKind.New;
            task.presentationOptions.echo = true;
            task.presentationOptions.focus = false;
            task.presentationOptions.clear = false;
            task.presentationOptions.close = false;
            task.isBackground = true;

            const execution = await vscode.tasks.executeTask(task);
            const exitTask = vscode.tasks.onDidEndTaskProcess((e) => {
                if (e.execution === execution) {
                    if (e.exitCode !== 0 && e.exitCode !== undefined) {
                        vscode.commands.executeCommand("hermes.backend.exit", `Backend exited with code: ${e.exitCode}`);
                    } else {
                        vscode.commands.executeCommand("hermes.backend.exit");
                    }
                }
            });

            const cancelTask = token?.onCancellationRequested(() => {
                execution.terminate();
            });

            const client = new Rpc.GrpcClient(log, {
                hostAddress: 'unix:///' + transportPipe,
                authMethod: Rpc.HostAuthenticationKind.NONE,
            });

            await client.connect(token);
            cancelTask?.dispose();

            return new Local(
                client,
                execution,
                transportPipe,
                configFile,
                exitTask,
                log,
            );
        } catch (err) {
            configFile.removeCallback();
            throw err;
        }
    }

    dispose(): void {
        super.dispose();

        this.grpcClient.close();
        this.exitWatcher.dispose();
        this.task.terminate();
        this.configFile.removeCallback();
    }
}
