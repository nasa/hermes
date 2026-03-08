import * as vscode from 'vscode';

import { HostAuthenticationKind } from '@gov.nasa.jpl.hermes/rpc';
import { TimeFormat } from '@gov.nasa.jpl.hermes/types';

export const names = {
    notebook: {
        signoff: {
            template: "hermes.notebook.signoff.template",
            datetime: "hermes.notebook.signoff.datetime",
            name: "hermes.notebook.signoff.name",
        },
        evrFilter: {
            diagnostic: "hermes.notebook.evrDiagnostic",
            command: "hermes.notebook.evrCommand",
            activityLow: "hermes.notebook.evrActivityLow",
            activityHigh: "hermes.notebook.evrActivityHigh",
            warningLow: "hermes.notebook.evrWarningLow",
            warningHigh: "hermes.notebook.evrWarningHigh",
            fatal: "hermes.notebook.evrFatal"
        },
        evr: {
            timeFormat: "hermes.notebook.evr.timeFormat"
        }
    },
    host: {
        type: "hermes.host.type",
        url: "hermes.host.url",
        authenticationMethod: "hermes.host.authenticationMethod",
        skipTLSVerify: "hermes.host.skipTLSVerify",
        binary: "hermes.host.binary",
    }
};

function getSetting<T>(sectionId: string, defaultV: T): T {
    return vscode.workspace.getConfiguration().get<T>(sectionId) ?? defaultV;
}

export function showEvr(severity: "DIAGNOSTIC" | "COMMAND" | "ACTIVITY_LO" | "ACTIVITY_HI" | "WARNING_LO" | "WARNING_HI" | "FATAL" | string): boolean {
    switch (severity) {
        case "DIAGNOSTIC":
            return getSetting(names.notebook.evrFilter.diagnostic, true);
        case "COMMAND":
            return getSetting(names.notebook.evrFilter.command, true);
        case "ACTIVITY_LO":
            return getSetting(names.notebook.evrFilter.activityLow, true);
        case "ACTIVITY_HI":
            return getSetting(names.notebook.evrFilter.activityHigh, true);
        case "WARNING_LO":
            return getSetting(names.notebook.evrFilter.warningLow, true);
        case "WARNING_HI":
            return getSetting(names.notebook.evrFilter.warningHigh, true);
        case "FATAL":
            return getSetting(names.notebook.evrFilter.fatal, true);
        default:
            return true;
    }
}

export function getNotebookEvrTimeFormat(): TimeFormat {
    return getSetting(names.notebook.evr.timeFormat, TimeFormat.SCLK);
}

export function signoffTemplate(): string {
    return getSetting(names.notebook.signoff.template, "> {date} {name}");
}

export function signoffDatetime(): string {
    return getSetting(names.notebook.signoff.datetime, "MMMM Do YYYY, h:mm:ss a");
}

export function signoffName(): string {
    return getSetting(names.notebook.signoff.name, "OPERATOR NAME");
}

/**
 * Controls what backend to use
 */
export enum BackendType {
    /**
     * Offline only allows loading dictionaries and writing notebooks/sequences
     * You cannot connect to anything and send command/receive telemetry
     */
    OFFLINE = 'offline',

    /**
     * Connect to a Hermes backend that is managed by this VSCode extension to allow
     * configuring/running profiles Telemetry can be subscribed to show up in the
     * frontend.
     */
    LOCAL = 'local',

    /**
     * Connect to a Hermes backend to allow configuring/running profiles
     * Telemetry can be subscribed to show up in the frontend
     */
    REMOTE = 'remote',
}

export function hostType(): BackendType {
    return getSetting(names.host.type, BackendType.LOCAL);
}

export function hostUrl(): string {
    return getSetting(names.host.url, "http://localhost:6880");
}

export function authenticationMethod(): HostAuthenticationKind {
    return getSetting(names.host.authenticationMethod, HostAuthenticationKind.NONE);
}

export function skipTLSVerify(): boolean {
    return getSetting(names.host.skipTLSVerify, false);
}

export function hostBinary(): string | undefined {
    const b = getSetting(names.host.binary, undefined);
    return b === "" ? undefined : b;
}
