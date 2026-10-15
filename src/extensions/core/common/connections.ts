import type { Proto } from '@gov.nasa.jpl.hermes/types';

// A link that a YAMCS instance receives telemetry on or sends commands through
export interface Link {
    name: string;
    // OK, UNAVAIL, DISABLED or FAILED
    status: string;
    // Whether the link received or sent any data in the last five seconds
    receiving: boolean;
    sending: boolean;
}

export interface State {
    dictionaryLoading?: boolean;
    writeDisabled?: boolean;

    profileProviders?: Proto.IProfileProvider[];
    dictionaryProviders?: { key: string, title: string }[];

    profiles?: Record<string, Proto.IStatefulProfile>;
    dictionaries?: Record<string, Proto.IDictionaryHead>;
    connections?: Proto.IFsw[];
    // Each YAMCS instance's links, keyed by the id of the instance's profile
    links?: Record<string, Link[]>;
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
