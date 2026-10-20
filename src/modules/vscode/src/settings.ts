import * as vscode from 'vscode';

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
        yamcs: "hermes.host.yamcs",
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
    return getSetting(names.notebook.evr.timeFormat, TimeFormat.UTC);
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

export interface Yamcs {
    // host:port of the yamcs-grpc plugin
    address: string;
    processor: string;
    // Also include parameters directly in a top-level space system
    includeTopLevel?: boolean;
}

export function hostYamcs(): Yamcs {
    return {
        address: "localhost:8091",
        processor: "realtime",
        ...getSetting<Partial<Yamcs>>(names.host.yamcs, {}),
    };
}
