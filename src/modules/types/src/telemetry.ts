import { Value } from "./types";
import * as Def from './def';

export enum EvrSeverity {
    diagnostic = "DIAGNOSTIC",
    activityLow = "ACTIVITY_LO",
    activityHigh = "ACTIVITY_HI",
    warningLow = "WARNING_LO",
    warningHigh = "WARNING_HI",
    command = "COMMAND",
    fatal = "FATAL"
}

export interface EvrArgument {
    name: string;
    value: string;
}

export enum TimeFormat {
    UTC = 'utc',
    LOCAL = 'local',
    SCLK = 'sclk'
}

export type Sourced<T> = T & {
    source: string;
}

/**
 * Event report or log message message
 */
export interface Event {
    /**
     * Time in UTC milliseconds
     */
    time: number;

    /**
     * Raw on-board sclk value
     */
    sclk: number;

    message: string;

    args: Value[];

    def: Def.EventRef;
}

/**
 * A reduced form of the full in memory `Event` for saving and displaying.
 * This is the format that should be used when serializing.
 */
export interface DisplayEvent {
    /**
     * Time in UTC milliseconds
     */
    time: number;

    /**
     * Raw on-board sclk value
     */
    sclk: number;

    /**
     * FSW id of the emitting evr
     */
    source: string;

    /**
     * Component or module
     */
    component: string;

    /**
     * Name of the EVR.
     * Scoped by its component
     */
    name: string;

    /**
     * Log severity usually stored in the FSW event dictionary
     * For the most part this information is not held in the
     * EVR packet since its redundant for ground software.
     */
    severity: EvrSeverity;

    /**
     * Formatted EVR
     */
    message: string;
}

/**
 * Single channelized telemetry value at a stamped time
 */
export interface Telemetry {
    /**
     * Time in UTC milliseconds
     */
    time: number;

    /**
     * Raw on-board sclk value
     */
    sclk: number;

    /**
     * Value of the telemetry channel at this time
     */
    value: any;

    def: Def.TelemetryRef;
}

export interface DownlinkedFile {
    uri: string;
    fswPath: string;
}
