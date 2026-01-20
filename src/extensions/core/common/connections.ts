import type { Proto } from '@gov.nasa.jpl.hermes/types';

export interface State {
    dictionaryLoading?: boolean;
    writeDisabled?: boolean;

    profileProviders?: Proto.IProfileProvider[];
    dictionaryProviders?: string[];

    profiles?: Record<string, Proto.IStatefulProfile>;
    dictionaries?: Record<string, Proto.IDictionaryHead>;
    connections?: Proto.IFsw[];
}

export type Backend = State;

export type Frontend = (
    { type: "refresh" }
    | { type: "dictionaryOpen", provider: string }
    | { type: "dictionaryRename", id: string, name: string }
    | { type: "dictionaryDelete", id: string }

    | { type: "profileNew", provider: string }

    | { type: "profileUpdate", id: string, data: any }
    | { type: "profileStart", id: string }
    | { type: "profileStop", id: string }
    | { type: "profileDelete", id: string }

    | { type: "explorer.reveal", workspaceRelative: boolean, value: string }
    | { type: "editor.open", uri: string }
    | { type: "refreshArray", workspaceRelative: boolean, value: string }
);
