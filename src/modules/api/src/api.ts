import type * as vscode from 'vscode';
import * as stream from "stream";

import {
    Proto,
    Sourced,
    Event as EventTelemetry,
    Telemetry
} from '@gov.nasa.jpl.hermes/types';

import {
    CommandValue
} from '@gov.nasa.jpl.hermes/sequence';

export interface CommandSequence {
    commands: CommandValue[];

    // Notebook cell block language to execute commands with
    language: string;

    // Additional fields associated with this command
    // This has flight-software specific meaning
    metadata?: Record<string, string>;
}

export interface FileHeader {
    // Source path of file (usually trancated for uplink bandwidth reasons)
    sourcePath: string;

    // Destination to tell FSW to write file to
    destinationPath: string;

    // File total size in bytes
    size: number;

    // Additional fields associated with this file uplink
    // This has flight-software specific meaning
    metadata?: Record<string, string>;
}

export interface Profile {
    // Name of the profile
    name: string;

    // Profile this corresponds to
    provider: string;

    // JSON parameters that fill in the provider schema
    setting: string;
}

export interface Fsw {
    // Unique identifier, name of the FSW
    // This is usually a human readable value rather than a uid.
    id: string;

    // FSW Type
    type: string

    // Profile that this connection belongs to
    profileId: string

    // Telemetry from these FSW IDs should be treated as though they
    // also came from this FSW. Useful for when you need a custom language
    // context that wraps multiple FSWs
    forwards?: string[]

    /**
     * Execute a set of commands as a sequence
     * This is usually preferrable to sequentially calling `command` as it
     * groups together commands into a single trace.
     * @param value command sequence to execute
     * @param token cancellation token
     */
    sequence?(
        value: CommandSequence,
        token?: vscode.CancellationToken
    ): Promise<boolean>;

    /**
     * Execute a single command as an immediate command
     * @param value Command to execute
     * @param token cancellation token
     */
    command?(
        value: CommandValue,
        token?: vscode.CancellationToken
    ): Promise<boolean>;

    /**
     * Uplink a file to the flight software
     * @param header Initial file metadata
     * @param file Readable stream of the file data to uplink
     * @param progress Progress reported by the uplink
     */
    uplink?(
        header: FileHeader,
        file: stream.Readable,
        progress: vscode.Progress<number>,
        token?: vscode.CancellationToken
    ): Promise<void>;

    /**
     * Send a generic request to this connection. The kind/data/reply
     * are defined by the connection implementation.
     * @param kind Request type
     * @param data Request payload
     * @param token cancellation token
     */
    request?(
        kind: string,
        data?: Buffer | Uint8Array | string,
        token?: vscode.CancellationToken
    ): Promise<Buffer>;
}

export interface Api extends vscode.Disposable {
    /**
     * Get FSW metadata given its ID
     */
    getFsw(id: string, token?: vscode.CancellationToken): Promise<Fsw>;

    /**
     * Get all the current connected FSWs
     */
    allFsw(token?: vscode.CancellationToken): Promise<Fsw[]>;

    /**
     * Start a profile and return once it's connected (cancellable)
     */
    startProfile(id: string, token?: vscode.CancellationToken): Promise<void>;

    /**
     * Stop profile given its name/id and reutrn once its stopped (cancellable)
     */
    stopProfile(id: string, token?: vscode.CancellationToken): Promise<void>;

    /**
     * Update a profile
     */
    updateProfile(
        id: string,
        settings: string,
        token?: vscode.CancellationToken,
    ): Promise<void>

    /**
     * Create a new profile, returns it's registered ID
     * @param profile Profile to add to registery
     */
    addProfile(
        profile: Profile,
        token?: vscode.CancellationToken,
    ): Promise<string>;

    /**
     * Delete a profile by its id
     * @param id Profile id
     */
    removeProfile(id: string, token?: vscode.CancellationToken): Promise<void>;

    /**
     * Get all the profiles
     */
    allProfiles(token?: vscode.CancellationToken): Promise<Record<string, Proto.IStatefulProfile>>;

    /**
     * Get all the registered profile providers
     */
    allProviders(token?: vscode.CancellationToken): Promise<Proto.IProfileProvider[]>;

    /**
     * Get a registered dictionary
     * @param id dictionary id
     * @param sections of the dictionary to include in reply
     *  This is a whitelist set of options to include. If this
     *  list is not provided or empty, the entire dictionary will be transmitted
     *
     *  A "section" includes two parts [namespace].[definition-id]
     *  - namespace: Name of the namespace to include
     *  - section: The portion of the namespace to include, the following sections are valid
     *    - "commands": All the command definitions in this namespace
     *    - "events": All event definitions this namespaces
     *    - "telemetry": All telemetry definitions this namespaces
     *    - "parameters": All parameter definitions this namespaces
     *    - "*": The entire namespace
     *  Example: "sections": [".events", "ns-1.*", "ns-2.telemetry"]
     * 
     */
    getDictionary(
        id: string,
        sections?: readonly string[],
        token?: vscode.CancellationToken,
    ): Promise<Proto.IDictionary>;

    /**
     * Add a new dictionary entry
     * @param dict dictionary to register
     * @returns registered id
     */
    addDictionary(dict: Proto.IDictionary, token?: vscode.CancellationToken): Promise<string>;

    /**
     * Get all registered dictionaries as a sequential stream
     */
    allDictionaries(token?: vscode.CancellationToken): Promise<Record<string, Proto.IDictionaryHead>>;

    /**
     * Get the current file uplink/downlink state
     */
    getFileTransferState(token?: vscode.CancellationToken): Promise<Proto.IFileTransferState>;

    /**
     * Clear the cached downlink file state
     */
    clearDownlinkTransferState(token?: vscode.CancellationToken): Promise<void>;

    /**
     * Clear the cached uplink file state
     */
    clearUplinkTransferState(token?: vscode.CancellationToken): Promise<void>;

    /**
     * Remove specified dictionary
     * @param id dictionary id
     */
    removeDictionary(id: string, token?: vscode.CancellationToken): Promise<void>;

    /**
     * Subscribe to any changes to FSW connections state
     */
    onFswChange: vscode.Event<Fsw[]>;

    /**
     * Get notified when the set of profile providers updates
     */
    onProvidersChange: vscode.Event<Proto.IProfileProvider[]>;

    /**
     * Get notified when the set of profile or their internal state updates
     */
    onProfilesChange: vscode.Event<Record<string, Proto.IStatefulProfile>>;

    /**
     * Subscribe to changes to the dictionary state. streams { id, type }
     */
    onDictionaryChange: vscode.Event<Record<string, Proto.IDictionaryHead>>;

    /**
     * Subscribe to the event message bus
     * @param handler function to run on every packet sent on this bus
     * @param filter optional filter to place on subscription
     */
    onEvent(
        handler: (pkt: Sourced<EventTelemetry>) => void,
        filter?: Proto.IBusFilter,
    ): vscode.Disposable;

    /**
     * Subscribe to the telemetry message bus
     * @param handler function to run on every packet sent on this bus
     * @param filter optional filter to place on subscription
     */
    onTelemetry(
        handler: (pkt: Sourced<Telemetry>) => void,
        filter?: Proto.IBusFilter
    ): vscode.Disposable;

    /**
     * Subscribe to file downlink updates
     */
    onFileDownlink: vscode.Event<Proto.IFileDownlink>;

    /**
     * Subscribe to file uplink updates
     */
    onFileUplink: vscode.Event<Proto.IFileUplink>;

    /**
     * Subscribe to file uplink and downlink progress
     */
    onFileTransfer: vscode.Event<Proto.IFileTransferState>;
}
