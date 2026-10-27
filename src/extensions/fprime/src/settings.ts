import * as vscode from 'vscode';

export const names = {
    sequenceUplinkRoot: "hermes.fprime.sequenceUplinkRoot",
};

function getSetting<T>(sectionId: string, defaultV: T): T {
    return vscode.workspace.getConfiguration().get<T>(sectionId) ?? defaultV;
}

export function sequenceUplinkRoot(): string {
    return getSetting(names.sequenceUplinkRoot, "/seq");
}
