import * as vscode from 'vscode';
import { BackendType, State } from './api';
import { Settings } from '@gov.nasa.jpl.hermes/vscode';
import { HostAuthenticationKind } from '@gov.nasa.jpl.hermes/rpc/src';

export async function pickBackendModeDialog(current: State): Promise<State | undefined> {
    const currentMode = current.type;
    const offlineCheck = currentMode === BackendType.OFFLINE ? "$(check) " : "";
    const localCheck = currentMode === BackendType.LOCAL ? "$(check) " : "";
    const remoteCheck = currentMode === BackendType.REMOTE ? "$(check) " : "";

    const currentRemote = (current.type === BackendType.REMOTE) ? current.remote : undefined;

    const pick = await vscode.window.showQuickPick<vscode.QuickPickItem & {
        type?: BackendType;
        reconnect?: true;
    }>([
        {
            iconPath: new vscode.ThemeIcon("debug-disconnect"),
            label: offlineCheck + "Offline",
            description: "Sequence authoring with no live interactions",
            detail: "Load dictionaries. Write sequences, procedures, and notebooks",
            type: BackendType.OFFLINE,
        },
        {
            iconPath: new vscode.ThemeIcon("terminal"),
            label: localCheck + "Local",
            description: "For local development",
            detail: "Start Hermes locally in a VSCode terminal and connect to it",
            type: BackendType.LOCAL,
        },
        {
            iconPath: new vscode.ThemeIcon("radio-tower"),
            label: remoteCheck + "Remote",
            description: "For hardware testing and operation",
            detail: "Connect to Hermes remotely",
            type: BackendType.REMOTE,
        },
        {
            label: "",
            kind: vscode.QuickPickItemKind.Separator,
        },
        {
            iconPath: new vscode.ThemeIcon("sync"),
            label: "Reconnect",
            description: "Reconnect/Rerun the current backend",
            reconnect: true,
        }
    ], {
        title: 'Hermes Backend Mode',
    });

    if (pick) {
        if (pick.reconnect) {
            vscode.commands.executeCommand("hermes.host.reconnect");
        } else if (pick.type !== undefined) {
            switch (pick.type) {
                case BackendType.OFFLINE:
                case BackendType.LOCAL:
                    return { type: pick.type };
                case BackendType.REMOTE: {
                    const pickedRemote = await pickRemoteDialog(currentRemote);
                    if (pickedRemote) {
                        return { type: pick.type, remote: pickedRemote };
                    }
                }
            }
        }
    }
}


interface RemoteQuickPickItem extends vscode.QuickPickItem {
    createNew?: true;
    remote?: Settings.Remote;
}

function remoteToQuickPickItem(key: string, remote: Settings.Remote): RemoteQuickPickItem {
    const saneRemote = { ...remote, key };
    const errors = [];

    if (!remote.label || remote.label === "") {
        saneRemote.label = saneRemote.url ?? "";
        if (saneRemote.label === "") {
            saneRemote.label = "<Untitled Remote>";
        }
    }

    if (!saneRemote.url || saneRemote.url === "") {
        saneRemote.url = "<unset url>";
        errors.push("URL must be set");
    }

    saneRemote.skipTLSVerify = remote.skipTLSVerify ?? false;
    saneRemote.authenticationMethod = remote.authenticationMethod ?? HostAuthenticationKind.NONE;
    if (!saneRemote.color || saneRemote.color === "") {
        saneRemote.color = undefined;
    } else if (saneRemote.color) {
        const colorRegex = /^#([a-fA-F0-9]{3})|([a-fA-F0-9]{6})$/;
        if (!colorRegex.test(saneRemote.color)) {
            errors.push("Color must be a hex color in the form #RGB or #RRGGBB");
        }
    }

    return {
        label: saneRemote.label,
        description: saneRemote.url,
        detail: errors.length > 0 ? ("$(alert) Invalid Remote: " + errors.join(". ")) : undefined,
        remote: saneRemote,
    };
}

export async function pickRemoteDialog(current?: Settings.Remote): Promise<Settings.Remote | undefined> {
    const remotes = Settings.hostRemotes();
    const quickPick = vscode.window.createQuickPick<RemoteQuickPickItem>();
    quickPick.canSelectMany = false;

    const remoteQuickPickItems = Array.from(Object.entries(remotes).map(([key, remote]) => remoteToQuickPickItem(key, remote)));
    quickPick.title = "Select a Hermes remote host to connect to";
    quickPick.buttons = [
        {
            iconPath: new vscode.ThemeIcon("settings-gear"),
            location: vscode.QuickInputButtonLocation.Inline,
            tooltip: "Edit Remote Settings"
        }
    ];
    quickPick.items = [
        ...remoteQuickPickItems,
        {
            label: "",
            kind: vscode.QuickPickItemKind.Separator,
        },
        {
            iconPath: new vscode.ThemeIcon("plus"),
            label: "Add new Hermes remote",
            alwaysShow: true,
            createNew: true,
        }
    ];

    const selected = remoteQuickPickItems.find((v) => {
        if (v.remote && current) {
            return current.key === v.remote.key;
        } else {
            return false;
        }
    });

    quickPick.activeItems = selected ? [selected] : [];
    quickPick.show();

    const subs: vscode.Disposable[] = [];
    const pick = await new Promise<RemoteQuickPickItem | undefined>((resolve) => {
        subs.push(
            quickPick.onDidHide(() => {
                resolve(undefined);
            }),
            quickPick.onDidAccept(() => {
                if (quickPick.selectedItems.length > 0) {
                    resolve(quickPick.selectedItems[0]);
                } else {
                    resolve(undefined);
                }
            }),
            quickPick.onDidTriggerButton(() => {
                // There is only one button
                // [Settings button]
                vscode.commands.executeCommand('workbench.action.openWorkspaceSettingsFile', {
                    revealSetting: {
                        key: 'hermes.host.remotes',
                        edit: false
                    }
                });
                // vscode.commands.executeCommand('workbench.action.openWorkspaceSettingsFile', {});
                resolve(undefined);
            })
        );
    });

    subs.forEach((d) => d.dispose());
    quickPick.dispose();

    if (pick?.remote) {
        return pick.remote;
    } else if (pick?.createNew) {
        return await createNewRemoteDialog();
    }
}

export async function createNewRemoteDialog(): Promise<Settings.Remote | undefined> {
    return undefined;
}
