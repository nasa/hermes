import * as vscode from 'vscode';

export const names = {
    sequenceUplinkRoot: "hermes.fprime.sequenceUplinkRoot",
    prmDb: {
        numDbEntries: "hermes.fprime.prmDb.numDbEntries",
        entryDelimiter: "hermes.fprime.prmDb.entryDelimiter"
    }
};

function getSetting<T>(sectionId: string, defaultV: T): T {
    return vscode.workspace.getConfiguration().get<T>(sectionId) ?? defaultV;
}

export function sequenceUplinkRoot(): string {
    return getSetting(names.sequenceUplinkRoot, "/seq");
}

export function prmDbNumDbEntries(): number {
    return getSetting(names.prmDb.numDbEntries, 25);
}

export function prmDbEntryDelimiter(): number {
    return getSetting(names.prmDb.entryDelimiter, 165);
}
