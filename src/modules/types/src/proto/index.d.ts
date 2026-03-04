import * as $protobuf from "protobufjs";
import Long = require("long");
/** SourceContextFilter enum. */
export enum SourceContextFilter {
    REALTIME_ONLY = 0,
    RECORDED_ONLY = 1,
    ALL = 2
}

/** Properties of a BusFilter. */
export interface IBusFilter {

    /** BusFilter source */
    source?: (string|null);

    /** BusFilter names */
    names?: (string[]|null);

    /** BusFilter context */
    context?: (SourceContextFilter|null);
}

/** Represents a BusFilter. */
export class BusFilter implements IBusFilter {

    /**
     * Constructs a new BusFilter.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBusFilter);

    /** BusFilter source. */
    public source: string;

    /** BusFilter names. */
    public names: string[];

    /** BusFilter context. */
    public context: SourceContextFilter;

    /**
     * Creates a new BusFilter instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BusFilter instance
     */
    public static create(properties?: IBusFilter): BusFilter;

    /**
     * Encodes the specified BusFilter message. Does not implicitly {@link BusFilter.verify|verify} messages.
     * @param message BusFilter message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBusFilter, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified BusFilter message, length delimited. Does not implicitly {@link BusFilter.verify|verify} messages.
     * @param message BusFilter message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBusFilter, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BusFilter message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BusFilter
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BusFilter;

    /**
     * Decodes a BusFilter message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BusFilter
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): BusFilter;

    /**
     * Verifies a BusFilter message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BusFilter message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BusFilter
     */
    public static fromObject(object: { [k: string]: any }): BusFilter;

    /**
     * Creates a plain object from a BusFilter message. Also converts values to other types if specified.
     * @param message BusFilter
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BusFilter, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BusFilter to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BusFilter
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** SourceContext enum. */
export enum SourceContext {
    REALTIME = 0,
    RECORDED = 1
}

/** Properties of an Event. */
export interface IEvent {

    /** Event ref */
    ref?: (IEventRef|null);

    /** Event time */
    time?: (ITime|null);

    /** Event message */
    message?: (string|null);

    /** Event args */
    args?: (IValue[]|null);

    /** Event tags */
    tags?: ({ [k: string]: IValue }|null);
}

/** Represents an Event. */
export class Event implements IEvent {

    /**
     * Constructs a new Event.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEvent);

    /** Event ref. */
    public ref?: (IEventRef|null);

    /** Event time. */
    public time?: (ITime|null);

    /** Event message. */
    public message: string;

    /** Event args. */
    public args: IValue[];

    /** Event tags. */
    public tags: { [k: string]: IValue };

    /**
     * Creates a new Event instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Event instance
     */
    public static create(properties?: IEvent): Event;

    /**
     * Encodes the specified Event message. Does not implicitly {@link Event.verify|verify} messages.
     * @param message Event message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link Event.verify|verify} messages.
     * @param message Event message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Event;

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Event;

    /**
     * Verifies an Event message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Event
     */
    public static fromObject(object: { [k: string]: any }): Event;

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @param message Event
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Event to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Event
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a Telemetry. */
export interface ITelemetry {

    /** Telemetry ref */
    ref?: (ITelemetryRef|null);

    /** Telemetry time */
    time?: (ITime|null);

    /** Telemetry value */
    value?: (IValue|null);

    /** Telemetry labels */
    labels?: ({ [k: string]: string }|null);
}

/** Represents a Telemetry. */
export class Telemetry implements ITelemetry {

    /**
     * Constructs a new Telemetry.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITelemetry);

    /** Telemetry ref. */
    public ref?: (ITelemetryRef|null);

    /** Telemetry time. */
    public time?: (ITime|null);

    /** Telemetry value. */
    public value?: (IValue|null);

    /** Telemetry labels. */
    public labels: { [k: string]: string };

    /**
     * Creates a new Telemetry instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Telemetry instance
     */
    public static create(properties?: ITelemetry): Telemetry;

    /**
     * Encodes the specified Telemetry message. Does not implicitly {@link Telemetry.verify|verify} messages.
     * @param message Telemetry message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITelemetry, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Telemetry message, length delimited. Does not implicitly {@link Telemetry.verify|verify} messages.
     * @param message Telemetry message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITelemetry, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Telemetry message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Telemetry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Telemetry;

    /**
     * Decodes a Telemetry message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Telemetry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Telemetry;

    /**
     * Verifies a Telemetry message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Telemetry message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Telemetry
     */
    public static fromObject(object: { [k: string]: any }): Telemetry;

    /**
     * Creates a plain object from a Telemetry message. Also converts values to other types if specified.
     * @param message Telemetry
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Telemetry, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Telemetry to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Telemetry
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a SourcedEvent. */
export interface ISourcedEvent {

    /** SourcedEvent event */
    event?: (IEvent|null);

    /** SourcedEvent source */
    source?: (string|null);

    /** SourcedEvent context */
    context?: (SourceContext|null);
}

/** Represents a SourcedEvent. */
export class SourcedEvent implements ISourcedEvent {

    /**
     * Constructs a new SourcedEvent.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISourcedEvent);

    /** SourcedEvent event. */
    public event?: (IEvent|null);

    /** SourcedEvent source. */
    public source: string;

    /** SourcedEvent context. */
    public context: SourceContext;

    /**
     * Creates a new SourcedEvent instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SourcedEvent instance
     */
    public static create(properties?: ISourcedEvent): SourcedEvent;

    /**
     * Encodes the specified SourcedEvent message. Does not implicitly {@link SourcedEvent.verify|verify} messages.
     * @param message SourcedEvent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISourcedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SourcedEvent message, length delimited. Does not implicitly {@link SourcedEvent.verify|verify} messages.
     * @param message SourcedEvent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISourcedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SourcedEvent message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SourcedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SourcedEvent;

    /**
     * Decodes a SourcedEvent message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SourcedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SourcedEvent;

    /**
     * Verifies a SourcedEvent message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SourcedEvent message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SourcedEvent
     */
    public static fromObject(object: { [k: string]: any }): SourcedEvent;

    /**
     * Creates a plain object from a SourcedEvent message. Also converts values to other types if specified.
     * @param message SourcedEvent
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SourcedEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SourcedEvent to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SourcedEvent
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a SourcedTelemetry. */
export interface ISourcedTelemetry {

    /** SourcedTelemetry telemetry */
    telemetry?: (ITelemetry|null);

    /** SourcedTelemetry source */
    source?: (string|null);

    /** SourcedTelemetry context */
    context?: (SourceContext|null);
}

/** Represents a SourcedTelemetry. */
export class SourcedTelemetry implements ISourcedTelemetry {

    /**
     * Constructs a new SourcedTelemetry.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISourcedTelemetry);

    /** SourcedTelemetry telemetry. */
    public telemetry?: (ITelemetry|null);

    /** SourcedTelemetry source. */
    public source: string;

    /** SourcedTelemetry context. */
    public context: SourceContext;

    /**
     * Creates a new SourcedTelemetry instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SourcedTelemetry instance
     */
    public static create(properties?: ISourcedTelemetry): SourcedTelemetry;

    /**
     * Encodes the specified SourcedTelemetry message. Does not implicitly {@link SourcedTelemetry.verify|verify} messages.
     * @param message SourcedTelemetry message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISourcedTelemetry, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SourcedTelemetry message, length delimited. Does not implicitly {@link SourcedTelemetry.verify|verify} messages.
     * @param message SourcedTelemetry message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISourcedTelemetry, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SourcedTelemetry message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SourcedTelemetry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SourcedTelemetry;

    /**
     * Decodes a SourcedTelemetry message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SourcedTelemetry
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SourcedTelemetry;

    /**
     * Verifies a SourcedTelemetry message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SourcedTelemetry message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SourcedTelemetry
     */
    public static fromObject(object: { [k: string]: any }): SourcedTelemetry;

    /**
     * Creates a plain object from a SourcedTelemetry message. Also converts values to other types if specified.
     * @param message SourcedTelemetry
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SourcedTelemetry, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SourcedTelemetry to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SourcedTelemetry
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** FileDownlinkCompletionStatus enum. */
export enum FileDownlinkCompletionStatus {
    DOWNLINK_COMPLETED = 0,
    DOWNLINK_UNKNOWN = -1,
    DOWNLINK_PARTIAL = 1,
    DOWNLINK_CRC_FAILED = 2
}

/** Properties of a FileDownlinkChunk. */
export interface IFileDownlinkChunk {

    /** FileDownlinkChunk offset */
    offset?: (number|Long|null);

    /** FileDownlinkChunk size */
    size?: (number|Long|null);
}

/** Represents a FileDownlinkChunk. */
export class FileDownlinkChunk implements IFileDownlinkChunk {

    /**
     * Constructs a new FileDownlinkChunk.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFileDownlinkChunk);

    /** FileDownlinkChunk offset. */
    public offset: (number|Long);

    /** FileDownlinkChunk size. */
    public size: (number|Long);

    /**
     * Creates a new FileDownlinkChunk instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FileDownlinkChunk instance
     */
    public static create(properties?: IFileDownlinkChunk): FileDownlinkChunk;

    /**
     * Encodes the specified FileDownlinkChunk message. Does not implicitly {@link FileDownlinkChunk.verify|verify} messages.
     * @param message FileDownlinkChunk message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFileDownlinkChunk, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FileDownlinkChunk message, length delimited. Does not implicitly {@link FileDownlinkChunk.verify|verify} messages.
     * @param message FileDownlinkChunk message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFileDownlinkChunk, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FileDownlinkChunk message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FileDownlinkChunk
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FileDownlinkChunk;

    /**
     * Decodes a FileDownlinkChunk message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FileDownlinkChunk
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FileDownlinkChunk;

    /**
     * Verifies a FileDownlinkChunk message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FileDownlinkChunk message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FileDownlinkChunk
     */
    public static fromObject(object: { [k: string]: any }): FileDownlinkChunk;

    /**
     * Creates a plain object from a FileDownlinkChunk message. Also converts values to other types if specified.
     * @param message FileDownlinkChunk
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FileDownlinkChunk, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FileDownlinkChunk to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FileDownlinkChunk
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FileDownlink. */
export interface IFileDownlink {

    /** FileDownlink uid */
    uid?: (string|null);

    /** FileDownlink timeStart */
    timeStart?: (google.protobuf.ITimestamp|null);

    /** FileDownlink timeEnd */
    timeEnd?: (google.protobuf.ITimestamp|null);

    /** FileDownlink status */
    status?: (FileDownlinkCompletionStatus|null);

    /** FileDownlink source */
    source?: (string|null);

    /** FileDownlink sourcePath */
    sourcePath?: (string|null);

    /** FileDownlink destinationPath */
    destinationPath?: (string|null);

    /** FileDownlink filePath */
    filePath?: (string|null);

    /** FileDownlink missingChunks */
    missingChunks?: (IFileDownlinkChunk[]|null);

    /** FileDownlink duplicateChunks */
    duplicateChunks?: (IFileDownlinkChunk[]|null);

    /** FileDownlink size */
    size?: (number|Long|null);

    /** FileDownlink metadata */
    metadata?: ({ [k: string]: string }|null);
}

/** Represents a FileDownlink. */
export class FileDownlink implements IFileDownlink {

    /**
     * Constructs a new FileDownlink.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFileDownlink);

    /** FileDownlink uid. */
    public uid: string;

    /** FileDownlink timeStart. */
    public timeStart?: (google.protobuf.ITimestamp|null);

    /** FileDownlink timeEnd. */
    public timeEnd?: (google.protobuf.ITimestamp|null);

    /** FileDownlink status. */
    public status: FileDownlinkCompletionStatus;

    /** FileDownlink source. */
    public source: string;

    /** FileDownlink sourcePath. */
    public sourcePath: string;

    /** FileDownlink destinationPath. */
    public destinationPath: string;

    /** FileDownlink filePath. */
    public filePath: string;

    /** FileDownlink missingChunks. */
    public missingChunks: IFileDownlinkChunk[];

    /** FileDownlink duplicateChunks. */
    public duplicateChunks: IFileDownlinkChunk[];

    /** FileDownlink size. */
    public size: (number|Long);

    /** FileDownlink metadata. */
    public metadata: { [k: string]: string };

    /**
     * Creates a new FileDownlink instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FileDownlink instance
     */
    public static create(properties?: IFileDownlink): FileDownlink;

    /**
     * Encodes the specified FileDownlink message. Does not implicitly {@link FileDownlink.verify|verify} messages.
     * @param message FileDownlink message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFileDownlink, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FileDownlink message, length delimited. Does not implicitly {@link FileDownlink.verify|verify} messages.
     * @param message FileDownlink message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFileDownlink, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FileDownlink message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FileDownlink
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FileDownlink;

    /**
     * Decodes a FileDownlink message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FileDownlink
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FileDownlink;

    /**
     * Verifies a FileDownlink message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FileDownlink message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FileDownlink
     */
    public static fromObject(object: { [k: string]: any }): FileDownlink;

    /**
     * Creates a plain object from a FileDownlink message. Also converts values to other types if specified.
     * @param message FileDownlink
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FileDownlink, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FileDownlink to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FileDownlink
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FileUplink. */
export interface IFileUplink {

    /** FileUplink uid */
    uid?: (string|null);

    /** FileUplink timeStart */
    timeStart?: (google.protobuf.ITimestamp|null);

    /** FileUplink timeEnd */
    timeEnd?: (google.protobuf.ITimestamp|null);

    /** FileUplink fswId */
    fswId?: (string|null);

    /** FileUplink sourcePath */
    sourcePath?: (string|null);

    /** FileUplink destinationPath */
    destinationPath?: (string|null);

    /** FileUplink error */
    error?: (string|null);

    /** FileUplink size */
    size?: (number|Long|null);

    /** FileUplink metadata */
    metadata?: ({ [k: string]: string }|null);
}

/** Represents a FileUplink. */
export class FileUplink implements IFileUplink {

    /**
     * Constructs a new FileUplink.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFileUplink);

    /** FileUplink uid. */
    public uid: string;

    /** FileUplink timeStart. */
    public timeStart?: (google.protobuf.ITimestamp|null);

    /** FileUplink timeEnd. */
    public timeEnd?: (google.protobuf.ITimestamp|null);

    /** FileUplink fswId. */
    public fswId: string;

    /** FileUplink sourcePath. */
    public sourcePath: string;

    /** FileUplink destinationPath. */
    public destinationPath: string;

    /** FileUplink error. */
    public error: string;

    /** FileUplink size. */
    public size: (number|Long);

    /** FileUplink metadata. */
    public metadata: { [k: string]: string };

    /**
     * Creates a new FileUplink instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FileUplink instance
     */
    public static create(properties?: IFileUplink): FileUplink;

    /**
     * Encodes the specified FileUplink message. Does not implicitly {@link FileUplink.verify|verify} messages.
     * @param message FileUplink message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFileUplink, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FileUplink message, length delimited. Does not implicitly {@link FileUplink.verify|verify} messages.
     * @param message FileUplink message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFileUplink, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FileUplink message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FileUplink
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FileUplink;

    /**
     * Decodes a FileUplink message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FileUplink
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FileUplink;

    /**
     * Verifies a FileUplink message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FileUplink message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FileUplink
     */
    public static fromObject(object: { [k: string]: any }): FileUplink;

    /**
     * Creates a plain object from a FileUplink message. Also converts values to other types if specified.
     * @param message FileUplink
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FileUplink, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FileUplink to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FileUplink
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FileTransfer. */
export interface IFileTransfer {

    /** FileTransfer uid */
    uid?: (string|null);

    /** FileTransfer fswId */
    fswId?: (string|null);

    /** FileTransfer sourcePath */
    sourcePath?: (string|null);

    /** FileTransfer targetPath */
    targetPath?: (string|null);

    /** FileTransfer size */
    size?: (number|Long|null);

    /** FileTransfer progress */
    progress?: (number|Long|null);
}

/** Represents a FileTransfer. */
export class FileTransfer implements IFileTransfer {

    /**
     * Constructs a new FileTransfer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFileTransfer);

    /** FileTransfer uid. */
    public uid: string;

    /** FileTransfer fswId. */
    public fswId: string;

    /** FileTransfer sourcePath. */
    public sourcePath: string;

    /** FileTransfer targetPath. */
    public targetPath: string;

    /** FileTransfer size. */
    public size: (number|Long);

    /** FileTransfer progress. */
    public progress: (number|Long);

    /**
     * Creates a new FileTransfer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FileTransfer instance
     */
    public static create(properties?: IFileTransfer): FileTransfer;

    /**
     * Encodes the specified FileTransfer message. Does not implicitly {@link FileTransfer.verify|verify} messages.
     * @param message FileTransfer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFileTransfer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FileTransfer message, length delimited. Does not implicitly {@link FileTransfer.verify|verify} messages.
     * @param message FileTransfer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFileTransfer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FileTransfer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FileTransfer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FileTransfer;

    /**
     * Decodes a FileTransfer message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FileTransfer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FileTransfer;

    /**
     * Verifies a FileTransfer message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FileTransfer message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FileTransfer
     */
    public static fromObject(object: { [k: string]: any }): FileTransfer;

    /**
     * Creates a plain object from a FileTransfer message. Also converts values to other types if specified.
     * @param message FileTransfer
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FileTransfer, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FileTransfer to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FileTransfer
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FileTransferState. */
export interface IFileTransferState {

    /** FileTransferState downlinkCompleted */
    downlinkCompleted?: (IFileDownlink[]|null);

    /** FileTransferState uplinkCompleted */
    uplinkCompleted?: (IFileUplink[]|null);

    /** FileTransferState downlinkInProgress */
    downlinkInProgress?: (IFileTransfer[]|null);

    /** FileTransferState uplinkInProgress */
    uplinkInProgress?: (IFileTransfer[]|null);
}

/** Represents a FileTransferState. */
export class FileTransferState implements IFileTransferState {

    /**
     * Constructs a new FileTransferState.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFileTransferState);

    /** FileTransferState downlinkCompleted. */
    public downlinkCompleted: IFileDownlink[];

    /** FileTransferState uplinkCompleted. */
    public uplinkCompleted: IFileUplink[];

    /** FileTransferState downlinkInProgress. */
    public downlinkInProgress: IFileTransfer[];

    /** FileTransferState uplinkInProgress. */
    public uplinkInProgress: IFileTransfer[];

    /**
     * Creates a new FileTransferState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FileTransferState instance
     */
    public static create(properties?: IFileTransferState): FileTransferState;

    /**
     * Encodes the specified FileTransferState message. Does not implicitly {@link FileTransferState.verify|verify} messages.
     * @param message FileTransferState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFileTransferState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FileTransferState message, length delimited. Does not implicitly {@link FileTransferState.verify|verify} messages.
     * @param message FileTransferState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFileTransferState, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FileTransferState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FileTransferState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FileTransferState;

    /**
     * Decodes a FileTransferState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FileTransferState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FileTransferState;

    /**
     * Verifies a FileTransferState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FileTransferState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FileTransferState
     */
    public static fromObject(object: { [k: string]: any }): FileTransferState;

    /**
     * Creates a plain object from a FileTransferState message. Also converts values to other types if specified.
     * @param message FileTransferState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FileTransferState, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FileTransferState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FileTransferState
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** IntKind enum. */
export enum IntKind {
    INT_U8 = 0,
    INT_I8 = 1,
    INT_U16 = 2,
    INT_I16 = 3,
    INT_U32 = 4,
    INT_I32 = 5,
    INT_U64 = 6,
    INT_I64 = 7
}

/** NumberKind enum. */
export enum NumberKind {
    NUMBER_U8 = 0,
    NUMBER_I8 = 1,
    NUMBER_U16 = 2,
    NUMBER_I16 = 3,
    NUMBER_U32 = 4,
    NUMBER_I32 = 5,
    NUMBER_U64 = 6,
    NUMBER_I64 = 7,
    NUMBER_F32 = 8,
    NUMBER_F64 = 9
}

/** UIntKind enum. */
export enum UIntKind {
    UINT_U8 = 0,
    UINT_U16 = 1,
    UINT_U32 = 2,
    UINT_U64 = 3
}

/** SIntKind enum. */
export enum SIntKind {
    SINT_I8 = 0,
    SINT_I16 = 1,
    SINT_I32 = 2,
    SINT_I64 = 3
}

/** FloatKind enum. */
export enum FloatKind {
    F_F32 = 0,
    F_F64 = 1
}

/** ReferenceKind enum. */
export enum ReferenceKind {
    REF_ENUM = 0,
    REF_BITMASK = 1,
    REF_OBJECT = 2,
    REF_ARRAY = 3,
    REF_BYTES = 4
}

/** Properties of a BooleanType. */
export interface IBooleanType {

    /** BooleanType encodeType */
    encodeType?: (UIntKind|null);
}

/** Represents a BooleanType. */
export class BooleanType implements IBooleanType {

    /**
     * Constructs a new BooleanType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBooleanType);

    /** BooleanType encodeType. */
    public encodeType: UIntKind;

    /**
     * Creates a new BooleanType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BooleanType instance
     */
    public static create(properties?: IBooleanType): BooleanType;

    /**
     * Encodes the specified BooleanType message. Does not implicitly {@link BooleanType.verify|verify} messages.
     * @param message BooleanType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBooleanType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified BooleanType message, length delimited. Does not implicitly {@link BooleanType.verify|verify} messages.
     * @param message BooleanType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBooleanType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BooleanType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BooleanType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BooleanType;

    /**
     * Decodes a BooleanType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BooleanType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): BooleanType;

    /**
     * Verifies a BooleanType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BooleanType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BooleanType
     */
    public static fromObject(object: { [k: string]: any }): BooleanType;

    /**
     * Creates a plain object from a BooleanType message. Also converts values to other types if specified.
     * @param message BooleanType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BooleanType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BooleanType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BooleanType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an IntType. */
export interface IIntType {

    /** IntType kind */
    kind?: (IntKind|null);

    /** Lower bound on valid values */
    min?: (number|Long|null);

    /** Upper bound on valid values */
    max?: (number|Long|null);
}

/** Represents an IntType. */
export class IntType implements IIntType {

    /**
     * Constructs a new IntType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IIntType);

    /** IntType kind. */
    public kind: IntKind;

    /** Lower bound on valid values */
    public min: (number|Long);

    /** Upper bound on valid values */
    public max: (number|Long);

    /**
     * Creates a new IntType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns IntType instance
     */
    public static create(properties?: IIntType): IntType;

    /**
     * Encodes the specified IntType message. Does not implicitly {@link IntType.verify|verify} messages.
     * @param message IntType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IIntType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified IntType message, length delimited. Does not implicitly {@link IntType.verify|verify} messages.
     * @param message IntType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IIntType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an IntType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns IntType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): IntType;

    /**
     * Decodes an IntType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns IntType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): IntType;

    /**
     * Verifies an IntType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an IntType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns IntType
     */
    public static fromObject(object: { [k: string]: any }): IntType;

    /**
     * Creates a plain object from an IntType message. Also converts values to other types if specified.
     * @param message IntType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: IntType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this IntType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for IntType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FloatType. */
export interface IFloatType {

    /** FloatType kind */
    kind?: (FloatKind|null);

    /** Lower bound on valid values */
    min?: (number|null);

    /** Upper bound on valid values */
    max?: (number|null);
}

/** Represents a FloatType. */
export class FloatType implements IFloatType {

    /**
     * Constructs a new FloatType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFloatType);

    /** FloatType kind. */
    public kind: FloatKind;

    /** Lower bound on valid values */
    public min: number;

    /** Upper bound on valid values */
    public max: number;

    /**
     * Creates a new FloatType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FloatType instance
     */
    public static create(properties?: IFloatType): FloatType;

    /**
     * Encodes the specified FloatType message. Does not implicitly {@link FloatType.verify|verify} messages.
     * @param message FloatType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFloatType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FloatType message, length delimited. Does not implicitly {@link FloatType.verify|verify} messages.
     * @param message FloatType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFloatType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FloatType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FloatType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FloatType;

    /**
     * Decodes a FloatType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FloatType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FloatType;

    /**
     * Verifies a FloatType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FloatType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FloatType
     */
    public static fromObject(object: { [k: string]: any }): FloatType;

    /**
     * Creates a plain object from a FloatType message. Also converts values to other types if specified.
     * @param message FloatType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FloatType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FloatType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FloatType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a StringType. */
export interface IStringType {

    /**
     * Type to serialize length of string with.
     *
     * When encoding strings, they will be prefixed by their
     * length using this type. If the length does not fit within
     * this type's representable size, it will throw an error.
     */
    lengthType?: (UIntKind|null);

    /** Optional check for maximum length */
    maxLength?: (number|null);
}

/** Represents a StringType. */
export class StringType implements IStringType {

    /**
     * Constructs a new StringType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStringType);

    /**
     * Type to serialize length of string with.
     *
     * When encoding strings, they will be prefixed by their
     * length using this type. If the length does not fit within
     * this type's representable size, it will throw an error.
     */
    public lengthType: UIntKind;

    /** Optional check for maximum length */
    public maxLength: number;

    /**
     * Creates a new StringType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StringType instance
     */
    public static create(properties?: IStringType): StringType;

    /**
     * Encodes the specified StringType message. Does not implicitly {@link StringType.verify|verify} messages.
     * @param message StringType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IStringType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified StringType message, length delimited. Does not implicitly {@link StringType.verify|verify} messages.
     * @param message StringType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IStringType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StringType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StringType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): StringType;

    /**
     * Decodes a StringType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StringType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): StringType;

    /**
     * Verifies a StringType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a StringType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StringType
     */
    public static fromObject(object: { [k: string]: any }): StringType;

    /**
     * Creates a plain object from a StringType message. Also converts values to other types if specified.
     * @param message StringType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: StringType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StringType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for StringType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an EnumItem. */
export interface IEnumItem {

    /** EnumItem value */
    value?: (number|null);

    /** EnumItem name */
    name?: (string|null);

    /** EnumItem metadata */
    metadata?: (string|null);
}

/** Represents an EnumItem. */
export class EnumItem implements IEnumItem {

    /**
     * Constructs a new EnumItem.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEnumItem);

    /** EnumItem value. */
    public value: number;

    /** EnumItem name. */
    public name: string;

    /** EnumItem metadata. */
    public metadata: string;

    /**
     * Creates a new EnumItem instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EnumItem instance
     */
    public static create(properties?: IEnumItem): EnumItem;

    /**
     * Encodes the specified EnumItem message. Does not implicitly {@link EnumItem.verify|verify} messages.
     * @param message EnumItem message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEnumItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified EnumItem message, length delimited. Does not implicitly {@link EnumItem.verify|verify} messages.
     * @param message EnumItem message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEnumItem, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an EnumItem message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EnumItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): EnumItem;

    /**
     * Decodes an EnumItem message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EnumItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): EnumItem;

    /**
     * Verifies an EnumItem message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an EnumItem message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EnumItem
     */
    public static fromObject(object: { [k: string]: any }): EnumItem;

    /**
     * Creates a plain object from an EnumItem message. Also converts values to other types if specified.
     * @param message EnumItem
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: EnumItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this EnumItem to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for EnumItem
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an EnumType. */
export interface IEnumType {

    /** Name of the enum */
    name?: (string|null);

    /**
     * Type to serialize enum with.
     * Use this on a per-enum basis. By default it will be I32. If this is
     * specified in the reference type it will override this.
     *
     * You can also override this behavior programmatically by overriding
     * `Serializable.writeEnum`.
     */
    encodeType?: (IntKind|null);

    /**
     * Members of the enum and their mapping to its
     * numeric value.
     */
    items?: (IEnumItem[]|null);
}

/** Represents an EnumType. */
export class EnumType implements IEnumType {

    /**
     * Constructs a new EnumType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEnumType);

    /** Name of the enum */
    public name: string;

    /**
     * Type to serialize enum with.
     * Use this on a per-enum basis. By default it will be I32. If this is
     * specified in the reference type it will override this.
     *
     * You can also override this behavior programmatically by overriding
     * `Serializable.writeEnum`.
     */
    public encodeType: IntKind;

    /**
     * Members of the enum and their mapping to its
     * numeric value.
     */
    public items: IEnumItem[];

    /**
     * Creates a new EnumType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EnumType instance
     */
    public static create(properties?: IEnumType): EnumType;

    /**
     * Encodes the specified EnumType message. Does not implicitly {@link EnumType.verify|verify} messages.
     * @param message EnumType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEnumType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified EnumType message, length delimited. Does not implicitly {@link EnumType.verify|verify} messages.
     * @param message EnumType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEnumType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an EnumType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EnumType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): EnumType;

    /**
     * Decodes an EnumType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EnumType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): EnumType;

    /**
     * Verifies an EnumType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an EnumType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EnumType
     */
    public static fromObject(object: { [k: string]: any }): EnumType;

    /**
     * Creates a plain object from an EnumType message. Also converts values to other types if specified.
     * @param message EnumType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: EnumType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this EnumType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for EnumType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a BoundedArraySize. */
export interface IBoundedArraySize {

    /** BoundedArraySize min */
    min?: (number|null);

    /** BoundedArraySize max */
    max?: (number|null);
}

/** Represents a BoundedArraySize. */
export class BoundedArraySize implements IBoundedArraySize {

    /**
     * Constructs a new BoundedArraySize.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBoundedArraySize);

    /** BoundedArraySize min. */
    public min: number;

    /** BoundedArraySize max. */
    public max: number;

    /**
     * Creates a new BoundedArraySize instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BoundedArraySize instance
     */
    public static create(properties?: IBoundedArraySize): BoundedArraySize;

    /**
     * Encodes the specified BoundedArraySize message. Does not implicitly {@link BoundedArraySize.verify|verify} messages.
     * @param message BoundedArraySize message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBoundedArraySize, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified BoundedArraySize message, length delimited. Does not implicitly {@link BoundedArraySize.verify|verify} messages.
     * @param message BoundedArraySize message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBoundedArraySize, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BoundedArraySize message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BoundedArraySize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BoundedArraySize;

    /**
     * Decodes a BoundedArraySize message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BoundedArraySize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): BoundedArraySize;

    /**
     * Verifies a BoundedArraySize message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BoundedArraySize message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BoundedArraySize
     */
    public static fromObject(object: { [k: string]: any }): BoundedArraySize;

    /**
     * Creates a plain object from a BoundedArraySize message. Also converts values to other types if specified.
     * @param message BoundedArraySize
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BoundedArraySize, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BoundedArraySize to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BoundedArraySize
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an ArrayType. */
export interface IArrayType {

    /**
     * Name of the array if this is a typedef instead of
     * an inline array.
     */
    name?: (string|null);

    /** Element type */
    elType?: (IType|null);

    /** ArrayType static */
    "static"?: (number|null);

    /** ArrayType dynamic */
    dynamic?: (IBoundedArraySize|null);

    /**
     * Serialization type to use for dynamic array's prefixed length.
     * > Ignored on statically sized arrays.
     *
     * Default: {@link TypeKind.u32}
     */
    lengthType?: (UIntKind|null);
}

/** Represents an ArrayType. */
export class ArrayType implements IArrayType {

    /**
     * Constructs a new ArrayType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IArrayType);

    /**
     * Name of the array if this is a typedef instead of
     * an inline array.
     */
    public name: string;

    /** Element type */
    public elType?: (IType|null);

    /** ArrayType static. */
    public static?: (number|null);

    /** ArrayType dynamic. */
    public dynamic?: (IBoundedArraySize|null);

    /**
     * Serialization type to use for dynamic array's prefixed length.
     * > Ignored on statically sized arrays.
     *
     * Default: {@link TypeKind.u32}
     */
    public lengthType: UIntKind;

    /**
     * Either `number` for static array, or a 2-tuple for
     * a range of sizes (or undefined for unbounded).
     *
     * Static arrays do not prefix their encodings with sizes
     * since encoders and decoders both agree on their length
     * ahead of time.
     *
     * Dynamically sized arrays will prefix their size with
     */
    public size?: ("static"|"dynamic");

    /**
     * Creates a new ArrayType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ArrayType instance
     */
    public static create(properties?: IArrayType): ArrayType;

    /**
     * Encodes the specified ArrayType message. Does not implicitly {@link ArrayType.verify|verify} messages.
     * @param message ArrayType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IArrayType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ArrayType message, length delimited. Does not implicitly {@link ArrayType.verify|verify} messages.
     * @param message ArrayType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IArrayType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ArrayType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ArrayType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ArrayType;

    /**
     * Decodes an ArrayType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ArrayType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ArrayType;

    /**
     * Verifies an ArrayType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an ArrayType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ArrayType
     */
    public static fromObject(object: { [k: string]: any }): ArrayType;

    /**
     * Creates a plain object from an ArrayType message. Also converts values to other types if specified.
     * @param message ArrayType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ArrayType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ArrayType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ArrayType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a BytesType. */
export interface IBytesType {

    /**
     * Name of the bytes array if this is a typedef instead of
     * an inline array.
     */
    name?: (string|null);

    /** BytesType kind */
    kind?: (NumberKind|null);

    /** BytesType static */
    "static"?: (number|null);

    /** BytesType dynamic */
    dynamic?: (IBoundedArraySize|null);

    /**
     * Serialization type to use for dynamic array's prefixed length.
     * > Ignored on statically sized arrays.
     *
     * Default: {@link TypeKind.u32}
     */
    lengthType?: (UIntKind|null);
}

/**
 * Homogeneous array of numeric primitives, stored as raw bytes
 * In Python this decodes the array using NumPy
 * In JS/TS this decodes the array using DataView or TypedArray
 */
export class BytesType implements IBytesType {

    /**
     * Constructs a new BytesType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBytesType);

    /**
     * Name of the bytes array if this is a typedef instead of
     * an inline array.
     */
    public name: string;

    /** BytesType kind. */
    public kind: NumberKind;

    /** BytesType static. */
    public static?: (number|null);

    /** BytesType dynamic. */
    public dynamic?: (IBoundedArraySize|null);

    /**
     * Serialization type to use for dynamic array's prefixed length.
     * > Ignored on statically sized arrays.
     *
     * Default: {@link TypeKind.u32}
     */
    public lengthType: UIntKind;

    /**
     * Serialization type to use for dynamic array's prefixed length.
     * > Ignored on statically sized arrays.
     *
     * Default: {@link TypeKind.u32}
     */
    public size?: ("static"|"dynamic");

    /**
     * Creates a new BytesType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BytesType instance
     */
    public static create(properties?: IBytesType): BytesType;

    /**
     * Encodes the specified BytesType message. Does not implicitly {@link BytesType.verify|verify} messages.
     * @param message BytesType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBytesType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified BytesType message, length delimited. Does not implicitly {@link BytesType.verify|verify} messages.
     * @param message BytesType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBytesType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BytesType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BytesType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BytesType;

    /**
     * Decodes a BytesType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BytesType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): BytesType;

    /**
     * Verifies a BytesType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BytesType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BytesType
     */
    public static fromObject(object: { [k: string]: any }): BytesType;

    /**
     * Creates a plain object from a BytesType message. Also converts values to other types if specified.
     * @param message BytesType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BytesType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BytesType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BytesType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a Field. */
export interface IField {

    /** Field name */
    name?: (string|null);

    /** Field type */
    type?: (IType|null);

    /** Field metadata */
    metadata?: (string|null);

    /** Field value */
    value?: (IValue|null);
}

/** Represents a Field. */
export class Field implements IField {

    /**
     * Constructs a new Field.
     * @param [properties] Properties to set
     */
    constructor(properties?: IField);

    /** Field name. */
    public name: string;

    /** Field type. */
    public type?: (IType|null);

    /** Field metadata. */
    public metadata: string;

    /** Field value. */
    public value?: (IValue|null);

    /**
     * Creates a new Field instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Field instance
     */
    public static create(properties?: IField): Field;

    /**
     * Encodes the specified Field message. Does not implicitly {@link Field.verify|verify} messages.
     * @param message Field message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IField, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Field message, length delimited. Does not implicitly {@link Field.verify|verify} messages.
     * @param message Field message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IField, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Field message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Field
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Field;

    /**
     * Decodes a Field message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Field
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Field;

    /**
     * Verifies a Field message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Field message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Field
     */
    public static fromObject(object: { [k: string]: any }): Field;

    /**
     * Creates a plain object from a Field message. Also converts values to other types if specified.
     * @param message Field
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Field, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Field to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Field
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an ObjectType. */
export interface IObjectType {

    /** Name of the object/struct */
    name?: (string|null);

    /** Fields/members inside object. Ordered in order of serialization. */
    fields?: (IField[]|null);
}

/** Represents an ObjectType. */
export class ObjectType implements IObjectType {

    /**
     * Constructs a new ObjectType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IObjectType);

    /** Name of the object/struct */
    public name: string;

    /** Fields/members inside object. Ordered in order of serialization. */
    public fields: IField[];

    /**
     * Creates a new ObjectType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ObjectType instance
     */
    public static create(properties?: IObjectType): ObjectType;

    /**
     * Encodes the specified ObjectType message. Does not implicitly {@link ObjectType.verify|verify} messages.
     * @param message ObjectType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IObjectType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ObjectType message, length delimited. Does not implicitly {@link ObjectType.verify|verify} messages.
     * @param message ObjectType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IObjectType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ObjectType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ObjectType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ObjectType;

    /**
     * Decodes an ObjectType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ObjectType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ObjectType;

    /**
     * Verifies an ObjectType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an ObjectType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ObjectType
     */
    public static fromObject(object: { [k: string]: any }): ObjectType;

    /**
     * Creates a plain object from an ObjectType message. Also converts values to other types if specified.
     * @param message ObjectType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ObjectType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ObjectType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ObjectType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a ReferenceType. */
export interface IReferenceType {

    /** Name of the type */
    name?: (string|null);

    /** ReferenceType kind */
    kind?: (ReferenceKind|null);
}

/** Represents a ReferenceType. */
export class ReferenceType implements IReferenceType {

    /**
     * Constructs a new ReferenceType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IReferenceType);

    /** Name of the type */
    public name: string;

    /** ReferenceType kind. */
    public kind: ReferenceKind;

    /**
     * Creates a new ReferenceType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ReferenceType instance
     */
    public static create(properties?: IReferenceType): ReferenceType;

    /**
     * Encodes the specified ReferenceType message. Does not implicitly {@link ReferenceType.verify|verify} messages.
     * @param message ReferenceType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IReferenceType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ReferenceType message, length delimited. Does not implicitly {@link ReferenceType.verify|verify} messages.
     * @param message ReferenceType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IReferenceType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ReferenceType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ReferenceType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ReferenceType;

    /**
     * Decodes a ReferenceType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ReferenceType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ReferenceType;

    /**
     * Verifies a ReferenceType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ReferenceType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ReferenceType
     */
    public static fromObject(object: { [k: string]: any }): ReferenceType;

    /**
     * Creates a plain object from a ReferenceType message. Also converts values to other types if specified.
     * @param message ReferenceType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ReferenceType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ReferenceType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ReferenceType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a VoidType. */
export interface IVoidType {

    /** Size in bytes of this struct pad */
    size?: (number|null);
}

/** Represents a VoidType. */
export class VoidType implements IVoidType {

    /**
     * Constructs a new VoidType.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVoidType);

    /** Size in bytes of this struct pad */
    public size: number;

    /**
     * Creates a new VoidType instance using the specified properties.
     * @param [properties] Properties to set
     * @returns VoidType instance
     */
    public static create(properties?: IVoidType): VoidType;

    /**
     * Encodes the specified VoidType message. Does not implicitly {@link VoidType.verify|verify} messages.
     * @param message VoidType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVoidType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified VoidType message, length delimited. Does not implicitly {@link VoidType.verify|verify} messages.
     * @param message VoidType message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IVoidType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a VoidType message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns VoidType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VoidType;

    /**
     * Decodes a VoidType message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns VoidType
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VoidType;

    /**
     * Verifies a VoidType message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a VoidType message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns VoidType
     */
    public static fromObject(object: { [k: string]: any }): VoidType;

    /**
     * Creates a plain object from a VoidType message. Also converts values to other types if specified.
     * @param message VoidType
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: VoidType, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this VoidType to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for VoidType
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a Type. */
export interface IType {

    /** Type ref */
    ref?: (IReferenceType|null);

    /** Type bool */
    bool?: (IBooleanType|null);

    /** Type int */
    int?: (IIntType|null);

    /** Type float */
    float?: (IFloatType|null);

    /** Type string */
    string?: (IStringType|null);

    /** Type enum */
    "enum"?: (IEnumType|null);

    /** Type bitmask */
    bitmask?: (IEnumType|null);

    /** Type object */
    object?: (IObjectType|null);

    /** Type array */
    array?: (IArrayType|null);

    /** Type bytes */
    bytes?: (IBytesType|null);

    /** Type void */
    "void"?: (IVoidType|null);

    /** Type metadata */
    metadata?: (string|null);
}

/** Represents a Type. */
export class Type implements IType {

    /**
     * Constructs a new Type.
     * @param [properties] Properties to set
     */
    constructor(properties?: IType);

    /** Type ref. */
    public ref?: (IReferenceType|null);

    /** Type bool. */
    public bool?: (IBooleanType|null);

    /** Type int. */
    public int?: (IIntType|null);

    /** Type float. */
    public float?: (IFloatType|null);

    /** Type string. */
    public string?: (IStringType|null);

    /** Type enum. */
    public enum?: (IEnumType|null);

    /** Type bitmask. */
    public bitmask?: (IEnumType|null);

    /** Type object. */
    public object?: (IObjectType|null);

    /** Type array. */
    public array?: (IArrayType|null);

    /** Type bytes. */
    public bytes?: (IBytesType|null);

    /** Type void. */
    public void?: (IVoidType|null);

    /** Type metadata. */
    public metadata: string;

    /** Type value. */
    public value?: ("ref"|"bool"|"int"|"float"|"string"|"enum"|"bitmask"|"object"|"array"|"bytes"|"void");

    /**
     * Creates a new Type instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Type instance
     */
    public static create(properties?: IType): Type;

    /**
     * Encodes the specified Type message. Does not implicitly {@link Type.verify|verify} messages.
     * @param message Type message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Type message, length delimited. Does not implicitly {@link Type.verify|verify} messages.
     * @param message Type message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IType, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Type message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Type
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Type;

    /**
     * Decodes a Type message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Type
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Type;

    /**
     * Verifies a Type message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Type message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Type
     */
    public static fromObject(object: { [k: string]: any }): Type;

    /**
     * Creates a plain object from a Type message. Also converts values to other types if specified.
     * @param message Type
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Type, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Type to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Type
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an ObjectValue. */
export interface IObjectValue {

    /** ObjectValue o */
    o?: ({ [k: string]: IValue }|null);
}

/** Represents an ObjectValue. */
export class ObjectValue implements IObjectValue {

    /**
     * Constructs a new ObjectValue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IObjectValue);

    /** ObjectValue o. */
    public o: { [k: string]: IValue };

    /**
     * Creates a new ObjectValue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ObjectValue instance
     */
    public static create(properties?: IObjectValue): ObjectValue;

    /**
     * Encodes the specified ObjectValue message. Does not implicitly {@link ObjectValue.verify|verify} messages.
     * @param message ObjectValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IObjectValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ObjectValue message, length delimited. Does not implicitly {@link ObjectValue.verify|verify} messages.
     * @param message ObjectValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IObjectValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ObjectValue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ObjectValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ObjectValue;

    /**
     * Decodes an ObjectValue message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ObjectValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ObjectValue;

    /**
     * Verifies an ObjectValue message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an ObjectValue message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ObjectValue
     */
    public static fromObject(object: { [k: string]: any }): ObjectValue;

    /**
     * Creates a plain object from an ObjectValue message. Also converts values to other types if specified.
     * @param message ObjectValue
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ObjectValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ObjectValue to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ObjectValue
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an ArrayValue. */
export interface IArrayValue {

    /** ArrayValue value */
    value?: (IValue[]|null);
}

/** Represents an ArrayValue. */
export class ArrayValue implements IArrayValue {

    /**
     * Constructs a new ArrayValue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IArrayValue);

    /** ArrayValue value. */
    public value: IValue[];

    /**
     * Creates a new ArrayValue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ArrayValue instance
     */
    public static create(properties?: IArrayValue): ArrayValue;

    /**
     * Encodes the specified ArrayValue message. Does not implicitly {@link ArrayValue.verify|verify} messages.
     * @param message ArrayValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IArrayValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ArrayValue message, length delimited. Does not implicitly {@link ArrayValue.verify|verify} messages.
     * @param message ArrayValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IArrayValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ArrayValue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ArrayValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ArrayValue;

    /**
     * Decodes an ArrayValue message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ArrayValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ArrayValue;

    /**
     * Verifies an ArrayValue message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an ArrayValue message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ArrayValue
     */
    public static fromObject(object: { [k: string]: any }): ArrayValue;

    /**
     * Creates a plain object from an ArrayValue message. Also converts values to other types if specified.
     * @param message ArrayValue
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ArrayValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ArrayValue to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ArrayValue
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a BytesValue. */
export interface IBytesValue {

    /** BytesValue kind */
    kind?: (NumberKind|null);

    /** BytesValue bigEndian */
    bigEndian?: (boolean|null);

    /** BytesValue value */
    value?: (Uint8Array|null);
}

/** Represents a BytesValue. */
export class BytesValue implements IBytesValue {

    /**
     * Constructs a new BytesValue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBytesValue);

    /** BytesValue kind. */
    public kind: NumberKind;

    /** BytesValue bigEndian. */
    public bigEndian: boolean;

    /** BytesValue value. */
    public value: Uint8Array;

    /**
     * Creates a new BytesValue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BytesValue instance
     */
    public static create(properties?: IBytesValue): BytesValue;

    /**
     * Encodes the specified BytesValue message. Does not implicitly {@link BytesValue.verify|verify} messages.
     * @param message BytesValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link BytesValue.verify|verify} messages.
     * @param message BytesValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a BytesValue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BytesValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): BytesValue;

    /**
     * Decodes a BytesValue message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BytesValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): BytesValue;

    /**
     * Verifies a BytesValue message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BytesValue
     */
    public static fromObject(object: { [k: string]: any }): BytesValue;

    /**
     * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
     * @param message BytesValue
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BytesValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BytesValue to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BytesValue
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an EnumValue. */
export interface IEnumValue {

    /** EnumValue raw */
    raw?: (number|Long|null);

    /** EnumValue formatted */
    formatted?: (string|null);
}

/** Represents an EnumValue. */
export class EnumValue implements IEnumValue {

    /**
     * Constructs a new EnumValue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEnumValue);

    /** EnumValue raw. */
    public raw: (number|Long);

    /** EnumValue formatted. */
    public formatted: string;

    /**
     * Creates a new EnumValue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EnumValue instance
     */
    public static create(properties?: IEnumValue): EnumValue;

    /**
     * Encodes the specified EnumValue message. Does not implicitly {@link EnumValue.verify|verify} messages.
     * @param message EnumValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEnumValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified EnumValue message, length delimited. Does not implicitly {@link EnumValue.verify|verify} messages.
     * @param message EnumValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEnumValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an EnumValue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EnumValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): EnumValue;

    /**
     * Decodes an EnumValue message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EnumValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): EnumValue;

    /**
     * Verifies an EnumValue message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an EnumValue message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EnumValue
     */
    public static fromObject(object: { [k: string]: any }): EnumValue;

    /**
     * Creates a plain object from an EnumValue message. Also converts values to other types if specified.
     * @param message EnumValue
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: EnumValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this EnumValue to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for EnumValue
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a Value. */
export interface IValue {

    /** Value i */
    i?: (number|Long|null);

    /** Value u */
    u?: (number|Long|null);

    /** Value f */
    f?: (number|null);

    /** Value b */
    b?: (boolean|null);

    /** Value s */
    s?: (string|null);

    /** Value e */
    e?: (IEnumValue|null);

    /** Value o */
    o?: (IObjectValue|null);

    /** Value a */
    a?: (IArrayValue|null);

    /** Value r */
    r?: (IBytesValue|null);
}

/** Represents a Value. */
export class Value implements IValue {

    /**
     * Constructs a new Value.
     * @param [properties] Properties to set
     */
    constructor(properties?: IValue);

    /** Value i. */
    public i?: (number|Long|null);

    /** Value u. */
    public u?: (number|Long|null);

    /** Value f. */
    public f?: (number|null);

    /** Value b. */
    public b?: (boolean|null);

    /** Value s. */
    public s?: (string|null);

    /** Value e. */
    public e?: (IEnumValue|null);

    /** Value o. */
    public o?: (IObjectValue|null);

    /** Value a. */
    public a?: (IArrayValue|null);

    /** Value r. */
    public r?: (IBytesValue|null);

    /** Value value. */
    public value?: ("i"|"u"|"f"|"b"|"s"|"e"|"o"|"a"|"r");

    /**
     * Creates a new Value instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Value instance
     */
    public static create(properties?: IValue): Value;

    /**
     * Encodes the specified Value message. Does not implicitly {@link Value.verify|verify} messages.
     * @param message Value message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Value message, length delimited. Does not implicitly {@link Value.verify|verify} messages.
     * @param message Value message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Value message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Value
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Value;

    /**
     * Decodes a Value message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Value
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Value;

    /**
     * Verifies a Value message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Value message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Value
     */
    public static fromObject(object: { [k: string]: any }): Value;

    /**
     * Creates a plain object from a Value message. Also converts values to other types if specified.
     * @param message Value
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Value to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Value
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a ParameterDef. */
export interface IParameterDef {

    /** ParameterDef id */
    id?: (number|null);

    /** Component or module that owns this parameter */
    component?: (string|null);

    /**
     * Name of the parameter
     * Scoped by its component
     */
    name?: (string|null);

    /** ParameterDef type */
    type?: (IType|null);

    /** ParameterDef metadata */
    metadata?: (string|null);
}

/** Represents a ParameterDef. */
export class ParameterDef implements IParameterDef {

    /**
     * Constructs a new ParameterDef.
     * @param [properties] Properties to set
     */
    constructor(properties?: IParameterDef);

    /** ParameterDef id. */
    public id: number;

    /** Component or module that owns this parameter */
    public component: string;

    /**
     * Name of the parameter
     * Scoped by its component
     */
    public name: string;

    /** ParameterDef type. */
    public type?: (IType|null);

    /** ParameterDef metadata. */
    public metadata: string;

    /**
     * Creates a new ParameterDef instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ParameterDef instance
     */
    public static create(properties?: IParameterDef): ParameterDef;

    /**
     * Encodes the specified ParameterDef message. Does not implicitly {@link ParameterDef.verify|verify} messages.
     * @param message ParameterDef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IParameterDef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ParameterDef message, length delimited. Does not implicitly {@link ParameterDef.verify|verify} messages.
     * @param message ParameterDef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IParameterDef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ParameterDef message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ParameterDef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ParameterDef;

    /**
     * Decodes a ParameterDef message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ParameterDef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ParameterDef;

    /**
     * Verifies a ParameterDef message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ParameterDef message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ParameterDef
     */
    public static fromObject(object: { [k: string]: any }): ParameterDef;

    /**
     * Creates a plain object from a ParameterDef message. Also converts values to other types if specified.
     * @param message ParameterDef
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ParameterDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ParameterDef to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ParameterDef
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a CommandDef. */
export interface ICommandDef {

    /** CommandDef opcode */
    opcode?: (number|null);

    /**
     * Mnemonic command used to identify this command.
     * FSW may or may not include the module name in the mnemonic and its
     * up to the language parsing software to identify the proper command from mnemonic information.
     *
     * This may have varying meaning across missions
     */
    mnemonic?: (string|null);

    /** Parent component or module owning this command */
    component?: (string|null);

    /** Command arguments */
    "arguments"?: (IField[]|null);

    /** CommandDef metadata */
    metadata?: (string|null);
}

/** Represents a CommandDef. */
export class CommandDef implements ICommandDef {

    /**
     * Constructs a new CommandDef.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICommandDef);

    /** CommandDef opcode. */
    public opcode: number;

    /**
     * Mnemonic command used to identify this command.
     * FSW may or may not include the module name in the mnemonic and its
     * up to the language parsing software to identify the proper command from mnemonic information.
     *
     * This may have varying meaning across missions
     */
    public mnemonic: string;

    /** Parent component or module owning this command */
    public component: string;

    /** Command arguments */
    public arguments: IField[];

    /** CommandDef metadata. */
    public metadata: string;

    /**
     * Creates a new CommandDef instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CommandDef instance
     */
    public static create(properties?: ICommandDef): CommandDef;

    /**
     * Encodes the specified CommandDef message. Does not implicitly {@link CommandDef.verify|verify} messages.
     * @param message CommandDef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICommandDef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CommandDef message, length delimited. Does not implicitly {@link CommandDef.verify|verify} messages.
     * @param message CommandDef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICommandDef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CommandDef message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CommandDef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CommandDef;

    /**
     * Decodes a CommandDef message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CommandDef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CommandDef;

    /**
     * Verifies a CommandDef message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CommandDef message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CommandDef
     */
    public static fromObject(object: { [k: string]: any }): CommandDef;

    /**
     * Creates a plain object from a CommandDef message. Also converts values to other types if specified.
     * @param message CommandDef
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CommandDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CommandDef to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CommandDef
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** EvrSeverity enum. */
export enum EvrSeverity {
    EVR_DIAGNOSTIC = 0,
    EVR_ACTIVITY_LOW = 1,
    EVR_ACTIVITY_HIGH = 2,
    EVR_WARNING_LOW = 3,
    EVR_WARNING_HIGH = 4,
    EVR_COMMAND = 5,
    EVR_FATAL = 6
}

/** Properties of an EventDef. */
export interface IEventDef {

    /** EventDef id */
    id?: (number|null);

    /** Component or module */
    component?: (string|null);

    /**
     * Name of the EVR.
     * Scoped by its component
     */
    name?: (string|null);

    /**
     * Log severity usually stored in the FSW event dictionary
     * For the most part this information is not held in the
     * EVR packet since its redundant for ground software.
     */
    severity?: (EvrSeverity|null);

    /** printf format string that will be formatted via sprintf */
    formatString?: (string|null);

    /** Arguments used inside the format string */
    "arguments"?: (IField[]|null);

    /** EventDef metadata */
    metadata?: (string|null);
}

/** Represents an EventDef. */
export class EventDef implements IEventDef {

    /**
     * Constructs a new EventDef.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEventDef);

    /** EventDef id. */
    public id: number;

    /** Component or module */
    public component: string;

    /**
     * Name of the EVR.
     * Scoped by its component
     */
    public name: string;

    /**
     * Log severity usually stored in the FSW event dictionary
     * For the most part this information is not held in the
     * EVR packet since its redundant for ground software.
     */
    public severity: EvrSeverity;

    /** printf format string that will be formatted via sprintf */
    public formatString: string;

    /** Arguments used inside the format string */
    public arguments: IField[];

    /** EventDef metadata. */
    public metadata: string;

    /**
     * Creates a new EventDef instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EventDef instance
     */
    public static create(properties?: IEventDef): EventDef;

    /**
     * Encodes the specified EventDef message. Does not implicitly {@link EventDef.verify|verify} messages.
     * @param message EventDef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEventDef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified EventDef message, length delimited. Does not implicitly {@link EventDef.verify|verify} messages.
     * @param message EventDef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEventDef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an EventDef message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EventDef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): EventDef;

    /**
     * Decodes an EventDef message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EventDef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): EventDef;

    /**
     * Verifies an EventDef message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an EventDef message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EventDef
     */
    public static fromObject(object: { [k: string]: any }): EventDef;

    /**
     * Creates a plain object from an EventDef message. Also converts values to other types if specified.
     * @param message EventDef
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: EventDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this EventDef to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for EventDef
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an EventRef. */
export interface IEventRef {

    /** EventRef id */
    id?: (number|null);

    /** EventRef name */
    name?: (string|null);

    /** EventRef component */
    component?: (string|null);

    /** EventRef severity */
    severity?: (EvrSeverity|null);

    /** EventRef arguments */
    "arguments"?: (string[]|null);

    /** EventRef dictionary */
    dictionary?: (string|null);
}

/** Represents an EventRef. */
export class EventRef implements IEventRef {

    /**
     * Constructs a new EventRef.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEventRef);

    /** EventRef id. */
    public id: number;

    /** EventRef name. */
    public name: string;

    /** EventRef component. */
    public component: string;

    /** EventRef severity. */
    public severity: EvrSeverity;

    /** EventRef arguments. */
    public arguments: string[];

    /** EventRef dictionary. */
    public dictionary: string;

    /**
     * Creates a new EventRef instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EventRef instance
     */
    public static create(properties?: IEventRef): EventRef;

    /**
     * Encodes the specified EventRef message. Does not implicitly {@link EventRef.verify|verify} messages.
     * @param message EventRef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEventRef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified EventRef message, length delimited. Does not implicitly {@link EventRef.verify|verify} messages.
     * @param message EventRef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEventRef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an EventRef message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EventRef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): EventRef;

    /**
     * Decodes an EventRef message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EventRef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): EventRef;

    /**
     * Verifies an EventRef message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an EventRef message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EventRef
     */
    public static fromObject(object: { [k: string]: any }): EventRef;

    /**
     * Creates a plain object from an EventRef message. Also converts values to other types if specified.
     * @param message EventRef
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: EventRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this EventRef to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for EventRef
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a TelemetryDef. */
export interface ITelemetryDef {

    /** Raw ID used for identifying incoming serialized telemetry */
    id?: (number|null);

    /** Telemetry name */
    name?: (string|null);

    /** Component or module that owns this telemetry */
    component?: (string|null);

    /** Serialization type */
    type?: (IType|null);

    /** TelemetryDef metadata */
    metadata?: (string|null);
}

/** Represents a TelemetryDef. */
export class TelemetryDef implements ITelemetryDef {

    /**
     * Constructs a new TelemetryDef.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITelemetryDef);

    /** Raw ID used for identifying incoming serialized telemetry */
    public id: number;

    /** Telemetry name */
    public name: string;

    /** Component or module that owns this telemetry */
    public component: string;

    /** Serialization type */
    public type?: (IType|null);

    /** TelemetryDef metadata. */
    public metadata: string;

    /**
     * Creates a new TelemetryDef instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TelemetryDef instance
     */
    public static create(properties?: ITelemetryDef): TelemetryDef;

    /**
     * Encodes the specified TelemetryDef message. Does not implicitly {@link TelemetryDef.verify|verify} messages.
     * @param message TelemetryDef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITelemetryDef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TelemetryDef message, length delimited. Does not implicitly {@link TelemetryDef.verify|verify} messages.
     * @param message TelemetryDef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITelemetryDef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TelemetryDef message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TelemetryDef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TelemetryDef;

    /**
     * Decodes a TelemetryDef message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TelemetryDef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TelemetryDef;

    /**
     * Verifies a TelemetryDef message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TelemetryDef message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TelemetryDef
     */
    public static fromObject(object: { [k: string]: any }): TelemetryDef;

    /**
     * Creates a plain object from a TelemetryDef message. Also converts values to other types if specified.
     * @param message TelemetryDef
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TelemetryDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TelemetryDef to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for TelemetryDef
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a TelemetryRef. */
export interface ITelemetryRef {

    /** TelemetryRef id */
    id?: (number|null);

    /** TelemetryRef name */
    name?: (string|null);

    /** TelemetryRef component */
    component?: (string|null);

    /** TelemetryRef dictionary */
    dictionary?: (string|null);
}

/** Represents a TelemetryRef. */
export class TelemetryRef implements ITelemetryRef {

    /**
     * Constructs a new TelemetryRef.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITelemetryRef);

    /** TelemetryRef id. */
    public id: number;

    /** TelemetryRef name. */
    public name: string;

    /** TelemetryRef component. */
    public component: string;

    /** TelemetryRef dictionary. */
    public dictionary: string;

    /**
     * Creates a new TelemetryRef instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TelemetryRef instance
     */
    public static create(properties?: ITelemetryRef): TelemetryRef;

    /**
     * Encodes the specified TelemetryRef message. Does not implicitly {@link TelemetryRef.verify|verify} messages.
     * @param message TelemetryRef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITelemetryRef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TelemetryRef message, length delimited. Does not implicitly {@link TelemetryRef.verify|verify} messages.
     * @param message TelemetryRef message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITelemetryRef, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TelemetryRef message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TelemetryRef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TelemetryRef;

    /**
     * Decodes a TelemetryRef message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TelemetryRef
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TelemetryRef;

    /**
     * Verifies a TelemetryRef message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TelemetryRef message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TelemetryRef
     */
    public static fromObject(object: { [k: string]: any }): TelemetryRef;

    /**
     * Creates a plain object from a TelemetryRef message. Also converts values to other types if specified.
     * @param message TelemetryRef
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TelemetryRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TelemetryRef to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for TelemetryRef
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a DictionaryHead. */
export interface IDictionaryHead {

    /**
     * Type associated with the Fsw.type
     * This will filter the user's selection
     * of dictionaries that can be tracked.
     *
     * This is set by the provider.
     */
    type?: (string|null);

    /** Name given to dictionary, can be changed by the user */
    name?: (string|null);

    /** (optional) Dictionary/FSW release version */
    version?: (string|null);
}

/** Represents a DictionaryHead. */
export class DictionaryHead implements IDictionaryHead {

    /**
     * Constructs a new DictionaryHead.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDictionaryHead);

    /**
     * Type associated with the Fsw.type
     * This will filter the user's selection
     * of dictionaries that can be tracked.
     *
     * This is set by the provider.
     */
    public type: string;

    /** Name given to dictionary, can be changed by the user */
    public name: string;

    /** (optional) Dictionary/FSW release version */
    public version: string;

    /**
     * Creates a new DictionaryHead instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DictionaryHead instance
     */
    public static create(properties?: IDictionaryHead): DictionaryHead;

    /**
     * Encodes the specified DictionaryHead message. Does not implicitly {@link DictionaryHead.verify|verify} messages.
     * @param message DictionaryHead message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDictionaryHead, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DictionaryHead message, length delimited. Does not implicitly {@link DictionaryHead.verify|verify} messages.
     * @param message DictionaryHead message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDictionaryHead, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DictionaryHead message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DictionaryHead
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DictionaryHead;

    /**
     * Decodes a DictionaryHead message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DictionaryHead
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DictionaryHead;

    /**
     * Verifies a DictionaryHead message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DictionaryHead message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DictionaryHead
     */
    public static fromObject(object: { [k: string]: any }): DictionaryHead;

    /**
     * Creates a plain object from a DictionaryHead message. Also converts values to other types if specified.
     * @param message DictionaryHead
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DictionaryHead, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DictionaryHead to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DictionaryHead
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a DictionaryNamespace. */
export interface IDictionaryNamespace {

    /** DictionaryNamespace commands */
    commands?: ({ [k: string]: ICommandDef }|null);

    /** DictionaryNamespace events */
    events?: ({ [k: string]: IEventDef }|null);

    /** DictionaryNamespace telemetry */
    telemetry?: ({ [k: string]: ITelemetryDef }|null);

    /** DictionaryNamespace parameters */
    parameters?: ({ [k: string]: IParameterDef }|null);

    /** DictionaryNamespace types */
    types?: ({ [k: string]: IType }|null);
}

/** Represents a DictionaryNamespace. */
export class DictionaryNamespace implements IDictionaryNamespace {

    /**
     * Constructs a new DictionaryNamespace.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDictionaryNamespace);

    /** DictionaryNamespace commands. */
    public commands: { [k: string]: ICommandDef };

    /** DictionaryNamespace events. */
    public events: { [k: string]: IEventDef };

    /** DictionaryNamespace telemetry. */
    public telemetry: { [k: string]: ITelemetryDef };

    /** DictionaryNamespace parameters. */
    public parameters: { [k: string]: IParameterDef };

    /** DictionaryNamespace types. */
    public types: { [k: string]: IType };

    /**
     * Creates a new DictionaryNamespace instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DictionaryNamespace instance
     */
    public static create(properties?: IDictionaryNamespace): DictionaryNamespace;

    /**
     * Encodes the specified DictionaryNamespace message. Does not implicitly {@link DictionaryNamespace.verify|verify} messages.
     * @param message DictionaryNamespace message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDictionaryNamespace, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DictionaryNamespace message, length delimited. Does not implicitly {@link DictionaryNamespace.verify|verify} messages.
     * @param message DictionaryNamespace message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDictionaryNamespace, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DictionaryNamespace message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DictionaryNamespace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DictionaryNamespace;

    /**
     * Decodes a DictionaryNamespace message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DictionaryNamespace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DictionaryNamespace;

    /**
     * Verifies a DictionaryNamespace message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DictionaryNamespace message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DictionaryNamespace
     */
    public static fromObject(object: { [k: string]: any }): DictionaryNamespace;

    /**
     * Creates a plain object from a DictionaryNamespace message. Also converts values to other types if specified.
     * @param message DictionaryNamespace
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DictionaryNamespace, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DictionaryNamespace to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DictionaryNamespace
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a Dictionary. */
export interface IDictionary {

    /** Dictionary head */
    head?: (IDictionaryHead|null);

    /** Dictionary content */
    content?: ({ [k: string]: IDictionaryNamespace }|null);

    /** Dictionary metadata */
    metadata?: ({ [k: string]: string }|null);
}

/** Represents a Dictionary. */
export class Dictionary implements IDictionary {

    /**
     * Constructs a new Dictionary.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDictionary);

    /** Dictionary head. */
    public head?: (IDictionaryHead|null);

    /** Dictionary content. */
    public content: { [k: string]: IDictionaryNamespace };

    /** Dictionary metadata. */
    public metadata: { [k: string]: string };

    /**
     * Creates a new Dictionary instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Dictionary instance
     */
    public static create(properties?: IDictionary): Dictionary;

    /**
     * Encodes the specified Dictionary message. Does not implicitly {@link Dictionary.verify|verify} messages.
     * @param message Dictionary message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDictionary, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Dictionary message, length delimited. Does not implicitly {@link Dictionary.verify|verify} messages.
     * @param message Dictionary message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDictionary, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Dictionary message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Dictionary
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Dictionary;

    /**
     * Decodes a Dictionary message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Dictionary
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Dictionary;

    /**
     * Verifies a Dictionary message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Dictionary message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Dictionary
     */
    public static fromObject(object: { [k: string]: any }): Dictionary;

    /**
     * Creates a plain object from a Dictionary message. Also converts values to other types if specified.
     * @param message Dictionary
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Dictionary, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Dictionary to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Dictionary
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a Time. */
export interface ITime {

    /** Time unix */
    unix?: (google.protobuf.ITimestamp|null);

    /** Time sclk */
    sclk?: (number|null);
}

/** Represents a Time. */
export class Time implements ITime {

    /**
     * Constructs a new Time.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITime);

    /** Time unix. */
    public unix?: (google.protobuf.ITimestamp|null);

    /** Time sclk. */
    public sclk: number;

    /**
     * Creates a new Time instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Time instance
     */
    public static create(properties?: ITime): Time;

    /**
     * Encodes the specified Time message. Does not implicitly {@link Time.verify|verify} messages.
     * @param message Time message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITime, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Time message, length delimited. Does not implicitly {@link Time.verify|verify} messages.
     * @param message Time message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITime, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Time message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Time
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Time;

    /**
     * Decodes a Time message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Time
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Time;

    /**
     * Verifies a Time message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Time message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Time
     */
    public static fromObject(object: { [k: string]: any }): Time;

    /**
     * Creates a plain object from a Time message. Also converts values to other types if specified.
     * @param message Time
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Time, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Time to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Time
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FileHeader. */
export interface IFileHeader {

    /** FileHeader sourcePath */
    sourcePath?: (string|null);

    /** FileHeader destinationPath */
    destinationPath?: (string|null);

    /** FileHeader size */
    size?: (number|Long|null);

    /** FileHeader metadata */
    metadata?: ({ [k: string]: string }|null);
}

/** Represents a FileHeader. */
export class FileHeader implements IFileHeader {

    /**
     * Constructs a new FileHeader.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFileHeader);

    /** FileHeader sourcePath. */
    public sourcePath: string;

    /** FileHeader destinationPath. */
    public destinationPath: string;

    /** FileHeader size. */
    public size: (number|Long);

    /** FileHeader metadata. */
    public metadata: { [k: string]: string };

    /**
     * Creates a new FileHeader instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FileHeader instance
     */
    public static create(properties?: IFileHeader): FileHeader;

    /**
     * Encodes the specified FileHeader message. Does not implicitly {@link FileHeader.verify|verify} messages.
     * @param message FileHeader message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFileHeader, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FileHeader message, length delimited. Does not implicitly {@link FileHeader.verify|verify} messages.
     * @param message FileHeader message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFileHeader, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FileHeader message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FileHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FileHeader;

    /**
     * Decodes a FileHeader message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FileHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FileHeader;

    /**
     * Verifies a FileHeader message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FileHeader message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FileHeader
     */
    public static fromObject(object: { [k: string]: any }): FileHeader;

    /**
     * Creates a plain object from a FileHeader message. Also converts values to other types if specified.
     * @param message FileHeader
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FileHeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FileHeader to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FileHeader
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an UplinkFileChunk. */
export interface IUplinkFileChunk {

    /** UplinkFileChunk header */
    header?: (IFileHeader|null);

    /** UplinkFileChunk data */
    data?: (Uint8Array|null);
}

/** Represents an UplinkFileChunk. */
export class UplinkFileChunk implements IUplinkFileChunk {

    /**
     * Constructs a new UplinkFileChunk.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUplinkFileChunk);

    /** UplinkFileChunk header. */
    public header?: (IFileHeader|null);

    /** UplinkFileChunk data. */
    public data?: (Uint8Array|null);

    /** UplinkFileChunk value. */
    public value?: ("header"|"data");

    /**
     * Creates a new UplinkFileChunk instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UplinkFileChunk instance
     */
    public static create(properties?: IUplinkFileChunk): UplinkFileChunk;

    /**
     * Encodes the specified UplinkFileChunk message. Does not implicitly {@link UplinkFileChunk.verify|verify} messages.
     * @param message UplinkFileChunk message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUplinkFileChunk, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified UplinkFileChunk message, length delimited. Does not implicitly {@link UplinkFileChunk.verify|verify} messages.
     * @param message UplinkFileChunk message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUplinkFileChunk, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an UplinkFileChunk message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UplinkFileChunk
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): UplinkFileChunk;

    /**
     * Decodes an UplinkFileChunk message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UplinkFileChunk
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): UplinkFileChunk;

    /**
     * Verifies an UplinkFileChunk message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an UplinkFileChunk message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UplinkFileChunk
     */
    public static fromObject(object: { [k: string]: any }): UplinkFileChunk;

    /**
     * Creates a plain object from an UplinkFileChunk message. Also converts values to other types if specified.
     * @param message UplinkFileChunk
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: UplinkFileChunk, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UplinkFileChunk to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for UplinkFileChunk
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a DownlinkFileData. */
export interface IDownlinkFileData {

    /** DownlinkFileData offset */
    offset?: (number|Long|null);

    /** DownlinkFileData data */
    data?: (Uint8Array|null);

    /** DownlinkFileData md */
    md?: ({ [k: string]: string }|null);
}

/** Represents a DownlinkFileData. */
export class DownlinkFileData implements IDownlinkFileData {

    /**
     * Constructs a new DownlinkFileData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDownlinkFileData);

    /** DownlinkFileData offset. */
    public offset: (number|Long);

    /** DownlinkFileData data. */
    public data: Uint8Array;

    /** DownlinkFileData md. */
    public md: { [k: string]: string };

    /**
     * Creates a new DownlinkFileData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DownlinkFileData instance
     */
    public static create(properties?: IDownlinkFileData): DownlinkFileData;

    /**
     * Encodes the specified DownlinkFileData message. Does not implicitly {@link DownlinkFileData.verify|verify} messages.
     * @param message DownlinkFileData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDownlinkFileData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DownlinkFileData message, length delimited. Does not implicitly {@link DownlinkFileData.verify|verify} messages.
     * @param message DownlinkFileData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDownlinkFileData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DownlinkFileData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DownlinkFileData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DownlinkFileData;

    /**
     * Decodes a DownlinkFileData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DownlinkFileData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DownlinkFileData;

    /**
     * Verifies a DownlinkFileData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DownlinkFileData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DownlinkFileData
     */
    public static fromObject(object: { [k: string]: any }): DownlinkFileData;

    /**
     * Creates a plain object from a DownlinkFileData message. Also converts values to other types if specified.
     * @param message DownlinkFileData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DownlinkFileData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DownlinkFileData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DownlinkFileData
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a DownlinkFileMetadata. */
export interface IDownlinkFileMetadata {

    /** DownlinkFileMetadata key */
    key?: (string|null);

    /** DownlinkFileMetadata data */
    data?: (Uint8Array|null);
}

/** Represents a DownlinkFileMetadata. */
export class DownlinkFileMetadata implements IDownlinkFileMetadata {

    /**
     * Constructs a new DownlinkFileMetadata.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDownlinkFileMetadata);

    /** DownlinkFileMetadata key. */
    public key: string;

    /** DownlinkFileMetadata data. */
    public data: Uint8Array;

    /**
     * Creates a new DownlinkFileMetadata instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DownlinkFileMetadata instance
     */
    public static create(properties?: IDownlinkFileMetadata): DownlinkFileMetadata;

    /**
     * Encodes the specified DownlinkFileMetadata message. Does not implicitly {@link DownlinkFileMetadata.verify|verify} messages.
     * @param message DownlinkFileMetadata message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDownlinkFileMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DownlinkFileMetadata message, length delimited. Does not implicitly {@link DownlinkFileMetadata.verify|verify} messages.
     * @param message DownlinkFileMetadata message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDownlinkFileMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DownlinkFileMetadata message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DownlinkFileMetadata
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DownlinkFileMetadata;

    /**
     * Decodes a DownlinkFileMetadata message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DownlinkFileMetadata
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DownlinkFileMetadata;

    /**
     * Verifies a DownlinkFileMetadata message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DownlinkFileMetadata message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DownlinkFileMetadata
     */
    public static fromObject(object: { [k: string]: any }): DownlinkFileMetadata;

    /**
     * Creates a plain object from a DownlinkFileMetadata message. Also converts values to other types if specified.
     * @param message DownlinkFileMetadata
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DownlinkFileMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DownlinkFileMetadata to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DownlinkFileMetadata
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a DownlinkFileValidation. */
export interface IDownlinkFileValidation {
}

/** Represents a DownlinkFileValidation. */
export class DownlinkFileValidation implements IDownlinkFileValidation {

    /**
     * Constructs a new DownlinkFileValidation.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDownlinkFileValidation);

    /**
     * Creates a new DownlinkFileValidation instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DownlinkFileValidation instance
     */
    public static create(properties?: IDownlinkFileValidation): DownlinkFileValidation;

    /**
     * Encodes the specified DownlinkFileValidation message. Does not implicitly {@link DownlinkFileValidation.verify|verify} messages.
     * @param message DownlinkFileValidation message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDownlinkFileValidation, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DownlinkFileValidation message, length delimited. Does not implicitly {@link DownlinkFileValidation.verify|verify} messages.
     * @param message DownlinkFileValidation message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDownlinkFileValidation, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DownlinkFileValidation message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DownlinkFileValidation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DownlinkFileValidation;

    /**
     * Decodes a DownlinkFileValidation message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DownlinkFileValidation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DownlinkFileValidation;

    /**
     * Verifies a DownlinkFileValidation message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DownlinkFileValidation message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DownlinkFileValidation
     */
    public static fromObject(object: { [k: string]: any }): DownlinkFileValidation;

    /**
     * Creates a plain object from a DownlinkFileValidation message. Also converts values to other types if specified.
     * @param message DownlinkFileValidation
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DownlinkFileValidation, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DownlinkFileValidation to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DownlinkFileValidation
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a DownlinkFileChunk. */
export interface IDownlinkFileChunk {

    /** DownlinkFileChunk header */
    header?: (IFileHeader|null);

    /** DownlinkFileChunk data */
    data?: (IDownlinkFileData|null);

    /** DownlinkFileChunk metadata */
    metadata?: (IDownlinkFileMetadata|null);

    /** DownlinkFileChunk validation */
    validation?: (IDownlinkFileValidation|null);
}

/** Represents a DownlinkFileChunk. */
export class DownlinkFileChunk implements IDownlinkFileChunk {

    /**
     * Constructs a new DownlinkFileChunk.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDownlinkFileChunk);

    /** DownlinkFileChunk header. */
    public header?: (IFileHeader|null);

    /** DownlinkFileChunk data. */
    public data?: (IDownlinkFileData|null);

    /** DownlinkFileChunk metadata. */
    public metadata?: (IDownlinkFileMetadata|null);

    /** DownlinkFileChunk validation. */
    public validation?: (IDownlinkFileValidation|null);

    /** DownlinkFileChunk value. */
    public value?: ("header"|"data"|"metadata"|"validation");

    /**
     * Creates a new DownlinkFileChunk instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DownlinkFileChunk instance
     */
    public static create(properties?: IDownlinkFileChunk): DownlinkFileChunk;

    /**
     * Encodes the specified DownlinkFileChunk message. Does not implicitly {@link DownlinkFileChunk.verify|verify} messages.
     * @param message DownlinkFileChunk message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDownlinkFileChunk, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DownlinkFileChunk message, length delimited. Does not implicitly {@link DownlinkFileChunk.verify|verify} messages.
     * @param message DownlinkFileChunk message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDownlinkFileChunk, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DownlinkFileChunk message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DownlinkFileChunk
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DownlinkFileChunk;

    /**
     * Decodes a DownlinkFileChunk message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DownlinkFileChunk
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DownlinkFileChunk;

    /**
     * Verifies a DownlinkFileChunk message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DownlinkFileChunk message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DownlinkFileChunk
     */
    public static fromObject(object: { [k: string]: any }): DownlinkFileChunk;

    /**
     * Creates a plain object from a DownlinkFileChunk message. Also converts values to other types if specified.
     * @param message DownlinkFileChunk
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DownlinkFileChunk, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DownlinkFileChunk to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DownlinkFileChunk
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** FswCapability enum. */
export enum FswCapability {
    COMMAND = 0,
    PARSE_COMMAND = 1,
    SEQUENCE = 2,
    PARSE_SEQUENCE = 3,
    FILE = 4,
    REQUEST = 5
}

/** Properties of a Fsw. */
export interface IFsw {

    /** Fsw id */
    id?: (string|null);

    /** Fsw type */
    type?: (string|null);

    /** Fsw profileId */
    profileId?: (string|null);

    /** Fsw forwards */
    forwards?: (string[]|null);

    /** Fsw capabilities */
    capabilities?: (FswCapability[]|null);
}

/** Represents a Fsw. */
export class Fsw implements IFsw {

    /**
     * Constructs a new Fsw.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFsw);

    /** Fsw id. */
    public id: string;

    /** Fsw type. */
    public type: string;

    /** Fsw profileId. */
    public profileId: string;

    /** Fsw forwards. */
    public forwards: string[];

    /** Fsw capabilities. */
    public capabilities: FswCapability[];

    /**
     * Creates a new Fsw instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Fsw instance
     */
    public static create(properties?: IFsw): Fsw;

    /**
     * Encodes the specified Fsw message. Does not implicitly {@link Fsw.verify|verify} messages.
     * @param message Fsw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFsw, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Fsw message, length delimited. Does not implicitly {@link Fsw.verify|verify} messages.
     * @param message Fsw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFsw, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Fsw message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Fsw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Fsw;

    /**
     * Decodes a Fsw message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Fsw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Fsw;

    /**
     * Verifies a Fsw message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Fsw message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Fsw
     */
    public static fromObject(object: { [k: string]: any }): Fsw;

    /**
     * Creates a plain object from a Fsw message. Also converts values to other types if specified.
     * @param message Fsw
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Fsw, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Fsw to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Fsw
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a CommandOptions. */
export interface ICommandOptions {

    /**
     * Don't wait for the command to reply before resolving the command promise
     * This promise will resolve once the command is sent to the FSW.
     */
    noWait?: (boolean|null);
}

/** Represents a CommandOptions. */
export class CommandOptions implements ICommandOptions {

    /**
     * Constructs a new CommandOptions.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICommandOptions);

    /**
     * Don't wait for the command to reply before resolving the command promise
     * This promise will resolve once the command is sent to the FSW.
     */
    public noWait: boolean;

    /**
     * Creates a new CommandOptions instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CommandOptions instance
     */
    public static create(properties?: ICommandOptions): CommandOptions;

    /**
     * Encodes the specified CommandOptions message. Does not implicitly {@link CommandOptions.verify|verify} messages.
     * @param message CommandOptions message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICommandOptions, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CommandOptions message, length delimited. Does not implicitly {@link CommandOptions.verify|verify} messages.
     * @param message CommandOptions message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICommandOptions, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CommandOptions message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CommandOptions
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CommandOptions;

    /**
     * Decodes a CommandOptions message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CommandOptions
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CommandOptions;

    /**
     * Verifies a CommandOptions message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CommandOptions message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CommandOptions
     */
    public static fromObject(object: { [k: string]: any }): CommandOptions;

    /**
     * Creates a plain object from a CommandOptions message. Also converts values to other types if specified.
     * @param message CommandOptions
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CommandOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CommandOptions to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CommandOptions
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a CommandValue. */
export interface ICommandValue {

    /** CommandValue def */
    def?: (ICommandDef|null);

    /** CommandValue args */
    args?: (IValue[]|null);

    /** CommandValue options */
    options?: (ICommandOptions|null);

    /** CommandValue metadata */
    metadata?: ({ [k: string]: string }|null);
}

/** Represents a CommandValue. */
export class CommandValue implements ICommandValue {

    /**
     * Constructs a new CommandValue.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICommandValue);

    /** CommandValue def. */
    public def?: (ICommandDef|null);

    /** CommandValue args. */
    public args: IValue[];

    /** CommandValue options. */
    public options?: (ICommandOptions|null);

    /** CommandValue metadata. */
    public metadata: { [k: string]: string };

    /**
     * Creates a new CommandValue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CommandValue instance
     */
    public static create(properties?: ICommandValue): CommandValue;

    /**
     * Encodes the specified CommandValue message. Does not implicitly {@link CommandValue.verify|verify} messages.
     * @param message CommandValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICommandValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CommandValue message, length delimited. Does not implicitly {@link CommandValue.verify|verify} messages.
     * @param message CommandValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICommandValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CommandValue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CommandValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CommandValue;

    /**
     * Decodes a CommandValue message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CommandValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CommandValue;

    /**
     * Verifies a CommandValue message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CommandValue message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CommandValue
     */
    public static fromObject(object: { [k: string]: any }): CommandValue;

    /**
     * Creates a plain object from a CommandValue message. Also converts values to other types if specified.
     * @param message CommandValue
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CommandValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CommandValue to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CommandValue
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a RawCommandValue. */
export interface IRawCommandValue {

    /** RawCommandValue command */
    command?: (string|null);

    /** RawCommandValue options */
    options?: (ICommandOptions|null);

    /** RawCommandValue metadata */
    metadata?: ({ [k: string]: string }|null);
}

/**
 * RawCommandValue is meant for commanding FSWs from clients that do not parse
 * the dictionary and command fully. This is useful for thin clients that will
 * rely on the backend to perform type checks.
 */
export class RawCommandValue implements IRawCommandValue {

    /**
     * Constructs a new RawCommandValue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRawCommandValue);

    /** RawCommandValue command. */
    public command: string;

    /** RawCommandValue options. */
    public options?: (ICommandOptions|null);

    /** RawCommandValue metadata. */
    public metadata: { [k: string]: string };

    /**
     * Creates a new RawCommandValue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RawCommandValue instance
     */
    public static create(properties?: IRawCommandValue): RawCommandValue;

    /**
     * Encodes the specified RawCommandValue message. Does not implicitly {@link RawCommandValue.verify|verify} messages.
     * @param message RawCommandValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRawCommandValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RawCommandValue message, length delimited. Does not implicitly {@link RawCommandValue.verify|verify} messages.
     * @param message RawCommandValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRawCommandValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RawCommandValue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RawCommandValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RawCommandValue;

    /**
     * Decodes a RawCommandValue message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RawCommandValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RawCommandValue;

    /**
     * Verifies a RawCommandValue message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RawCommandValue message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RawCommandValue
     */
    public static fromObject(object: { [k: string]: any }): RawCommandValue;

    /**
     * Creates a plain object from a RawCommandValue message. Also converts values to other types if specified.
     * @param message RawCommandValue
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RawCommandValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RawCommandValue to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for RawCommandValue
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a CommandSequence. */
export interface ICommandSequence {

    /** CommandSequence commands */
    commands?: (ICommandValue[]|null);

    /** CommandSequence languageName */
    languageName?: (string|null);

    /** CommandSequence metadata */
    metadata?: ({ [k: string]: string }|null);
}

/** Represents a CommandSequence. */
export class CommandSequence implements ICommandSequence {

    /**
     * Constructs a new CommandSequence.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICommandSequence);

    /** CommandSequence commands. */
    public commands: ICommandValue[];

    /** CommandSequence languageName. */
    public languageName: string;

    /** CommandSequence metadata. */
    public metadata: { [k: string]: string };

    /**
     * Creates a new CommandSequence instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CommandSequence instance
     */
    public static create(properties?: ICommandSequence): CommandSequence;

    /**
     * Encodes the specified CommandSequence message. Does not implicitly {@link CommandSequence.verify|verify} messages.
     * @param message CommandSequence message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICommandSequence, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CommandSequence message, length delimited. Does not implicitly {@link CommandSequence.verify|verify} messages.
     * @param message CommandSequence message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICommandSequence, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CommandSequence message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CommandSequence
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CommandSequence;

    /**
     * Decodes a CommandSequence message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CommandSequence
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CommandSequence;

    /**
     * Verifies a CommandSequence message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CommandSequence message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CommandSequence
     */
    public static fromObject(object: { [k: string]: any }): CommandSequence;

    /**
     * Creates a plain object from a CommandSequence message. Also converts values to other types if specified.
     * @param message CommandSequence
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CommandSequence, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CommandSequence to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CommandSequence
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a RawCommandSequence. */
export interface IRawCommandSequence {

    /** RawCommandSequence sequence */
    sequence?: (string|null);

    /** RawCommandSequence languageName */
    languageName?: (string|null);

    /** RawCommandSequence metadata */
    metadata?: ({ [k: string]: string }|null);

    /** RawCommandSequence lineCommentPrefix */
    lineCommentPrefix?: (string|null);
}

/** Represents a RawCommandSequence. */
export class RawCommandSequence implements IRawCommandSequence {

    /**
     * Constructs a new RawCommandSequence.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRawCommandSequence);

    /** RawCommandSequence sequence. */
    public sequence: string;

    /** RawCommandSequence languageName. */
    public languageName: string;

    /** RawCommandSequence metadata. */
    public metadata: { [k: string]: string };

    /** RawCommandSequence lineCommentPrefix. */
    public lineCommentPrefix: string;

    /**
     * Creates a new RawCommandSequence instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RawCommandSequence instance
     */
    public static create(properties?: IRawCommandSequence): RawCommandSequence;

    /**
     * Encodes the specified RawCommandSequence message. Does not implicitly {@link RawCommandSequence.verify|verify} messages.
     * @param message RawCommandSequence message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRawCommandSequence, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RawCommandSequence message, length delimited. Does not implicitly {@link RawCommandSequence.verify|verify} messages.
     * @param message RawCommandSequence message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRawCommandSequence, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RawCommandSequence message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RawCommandSequence
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RawCommandSequence;

    /**
     * Decodes a RawCommandSequence message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RawCommandSequence
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RawCommandSequence;

    /**
     * Verifies a RawCommandSequence message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RawCommandSequence message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RawCommandSequence
     */
    public static fromObject(object: { [k: string]: any }): RawCommandSequence;

    /**
     * Creates a plain object from a RawCommandSequence message. Also converts values to other types if specified.
     * @param message RawCommandSequence
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RawCommandSequence, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RawCommandSequence to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for RawCommandSequence
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a RequestValue. */
export interface IRequestValue {

    /** RequestValue kind */
    kind?: (string|null);

    /** RequestValue data */
    data?: (Uint8Array|null);
}

/**
 * FSW Requests are non-dictionary defined items. These are connection
 * specific commands meant to be exposed by custom UI in the frontend.
 */
export class RequestValue implements IRequestValue {

    /**
     * Constructs a new RequestValue.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRequestValue);

    /** RequestValue kind. */
    public kind: string;

    /** RequestValue data. */
    public data: Uint8Array;

    /**
     * Creates a new RequestValue instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RequestValue instance
     */
    public static create(properties?: IRequestValue): RequestValue;

    /**
     * Encodes the specified RequestValue message. Does not implicitly {@link RequestValue.verify|verify} messages.
     * @param message RequestValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRequestValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RequestValue message, length delimited. Does not implicitly {@link RequestValue.verify|verify} messages.
     * @param message RequestValue message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRequestValue, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RequestValue message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RequestValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RequestValue;

    /**
     * Decodes a RequestValue message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RequestValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RequestValue;

    /**
     * Verifies a RequestValue message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RequestValue message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RequestValue
     */
    public static fromObject(object: { [k: string]: any }): RequestValue;

    /**
     * Creates a plain object from a RequestValue message. Also converts values to other types if specified.
     * @param message RequestValue
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RequestValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RequestValue to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for RequestValue
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a RequestReply. */
export interface IRequestReply {

    /** RequestReply data */
    data?: (Uint8Array|null);
}

/** Represents a RequestReply. */
export class RequestReply implements IRequestReply {

    /**
     * Constructs a new RequestReply.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRequestReply);

    /** RequestReply data. */
    public data: Uint8Array;

    /**
     * Creates a new RequestReply instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RequestReply instance
     */
    public static create(properties?: IRequestReply): RequestReply;

    /**
     * Encodes the specified RequestReply message. Does not implicitly {@link RequestReply.verify|verify} messages.
     * @param message RequestReply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRequestReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RequestReply message, length delimited. Does not implicitly {@link RequestReply.verify|verify} messages.
     * @param message RequestReply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRequestReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RequestReply message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RequestReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RequestReply;

    /**
     * Decodes a RequestReply message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RequestReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RequestReply;

    /**
     * Verifies a RequestReply message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RequestReply message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RequestReply
     */
    public static fromObject(object: { [k: string]: any }): RequestReply;

    /**
     * Creates a plain object from a RequestReply message. Also converts values to other types if specified.
     * @param message RequestReply
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RequestReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RequestReply to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for RequestReply
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an Id. */
export interface IId {

    /** Id id */
    id?: (string|null);
}

/** Represents an Id. */
export class Id implements IId {

    /**
     * Constructs a new Id.
     * @param [properties] Properties to set
     */
    constructor(properties?: IId);

    /** Id id. */
    public id: string;

    /**
     * Creates a new Id instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Id instance
     */
    public static create(properties?: IId): Id;

    /**
     * Encodes the specified Id message. Does not implicitly {@link Id.verify|verify} messages.
     * @param message Id message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IId, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Id message, length delimited. Does not implicitly {@link Id.verify|verify} messages.
     * @param message Id message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IId, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Id message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Id;

    /**
     * Decodes an Id message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Id;

    /**
     * Verifies an Id message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Id message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Id
     */
    public static fromObject(object: { [k: string]: any }): Id;

    /**
     * Creates a plain object from an Id message. Also converts values to other types if specified.
     * @param message Id
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Id, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Id to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Id
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FswList. */
export interface IFswList {

    /** FswList all */
    all?: (IFsw[]|null);
}

/** Represents a FswList. */
export class FswList implements IFswList {

    /**
     * Constructs a new FswList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFswList);

    /** FswList all. */
    public all: IFsw[];

    /**
     * Creates a new FswList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FswList instance
     */
    public static create(properties?: IFswList): FswList;

    /**
     * Encodes the specified FswList message. Does not implicitly {@link FswList.verify|verify} messages.
     * @param message FswList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFswList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FswList message, length delimited. Does not implicitly {@link FswList.verify|verify} messages.
     * @param message FswList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFswList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FswList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FswList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FswList;

    /**
     * Decodes a FswList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FswList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FswList;

    /**
     * Verifies a FswList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FswList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FswList
     */
    public static fromObject(object: { [k: string]: any }): FswList;

    /**
     * Creates a plain object from a FswList message. Also converts values to other types if specified.
     * @param message FswList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FswList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FswList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FswList
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a Reply. */
export interface IReply {

    /** Reply success */
    success?: (boolean|null);
}

/** Represents a Reply. */
export class Reply implements IReply {

    /**
     * Constructs a new Reply.
     * @param [properties] Properties to set
     */
    constructor(properties?: IReply);

    /** Reply success. */
    public success: boolean;

    /**
     * Creates a new Reply instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Reply instance
     */
    public static create(properties?: IReply): Reply;

    /**
     * Encodes the specified Reply message. Does not implicitly {@link Reply.verify|verify} messages.
     * @param message Reply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Reply message, length delimited. Does not implicitly {@link Reply.verify|verify} messages.
     * @param message Reply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Reply message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Reply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Reply;

    /**
     * Decodes a Reply message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Reply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Reply;

    /**
     * Verifies a Reply message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Reply message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Reply
     */
    public static fromObject(object: { [k: string]: any }): Reply;

    /**
     * Creates a plain object from a Reply message. Also converts values to other types if specified.
     * @param message Reply
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Reply, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Reply to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Reply
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a SequenceReply. */
export interface ISequenceReply {

    /** SequenceReply success */
    success?: (boolean|null);

    /** SequenceReply commandIndex */
    commandIndex?: (number|null);
}

/** Represents a SequenceReply. */
export class SequenceReply implements ISequenceReply {

    /**
     * Constructs a new SequenceReply.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISequenceReply);

    /** SequenceReply success. */
    public success: boolean;

    /** SequenceReply commandIndex. */
    public commandIndex: number;

    /**
     * Creates a new SequenceReply instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SequenceReply instance
     */
    public static create(properties?: ISequenceReply): SequenceReply;

    /**
     * Encodes the specified SequenceReply message. Does not implicitly {@link SequenceReply.verify|verify} messages.
     * @param message SequenceReply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISequenceReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SequenceReply message, length delimited. Does not implicitly {@link SequenceReply.verify|verify} messages.
     * @param message SequenceReply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISequenceReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SequenceReply message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SequenceReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SequenceReply;

    /**
     * Decodes a SequenceReply message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SequenceReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SequenceReply;

    /**
     * Verifies a SequenceReply message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SequenceReply message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SequenceReply
     */
    public static fromObject(object: { [k: string]: any }): SequenceReply;

    /**
     * Creates a plain object from a SequenceReply message. Also converts values to other types if specified.
     * @param message SequenceReply
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SequenceReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SequenceReply to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SequenceReply
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a StatefulProfile. */
export interface IStatefulProfile {

    /** StatefulProfile value */
    value?: (IProfile|null);

    /** StatefulProfile state */
    state?: (ProfileState|null);

    /** StatefulProfile runtimeOnly */
    runtimeOnly?: (boolean|null);
}

/** Represents a StatefulProfile. */
export class StatefulProfile implements IStatefulProfile {

    /**
     * Constructs a new StatefulProfile.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStatefulProfile);

    /** StatefulProfile value. */
    public value?: (IProfile|null);

    /** StatefulProfile state. */
    public state: ProfileState;

    /** StatefulProfile runtimeOnly. */
    public runtimeOnly: boolean;

    /**
     * Creates a new StatefulProfile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StatefulProfile instance
     */
    public static create(properties?: IStatefulProfile): StatefulProfile;

    /**
     * Encodes the specified StatefulProfile message. Does not implicitly {@link StatefulProfile.verify|verify} messages.
     * @param message StatefulProfile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IStatefulProfile, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified StatefulProfile message, length delimited. Does not implicitly {@link StatefulProfile.verify|verify} messages.
     * @param message StatefulProfile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IStatefulProfile, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StatefulProfile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StatefulProfile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): StatefulProfile;

    /**
     * Decodes a StatefulProfile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StatefulProfile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): StatefulProfile;

    /**
     * Verifies a StatefulProfile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a StatefulProfile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StatefulProfile
     */
    public static fromObject(object: { [k: string]: any }): StatefulProfile;

    /**
     * Creates a plain object from a StatefulProfile message. Also converts values to other types if specified.
     * @param message StatefulProfile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: StatefulProfile, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StatefulProfile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for StatefulProfile
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a ProfileList. */
export interface IProfileList {

    /** ProfileList all */
    all?: ({ [k: string]: IStatefulProfile }|null);
}

/** Represents a ProfileList. */
export class ProfileList implements IProfileList {

    /**
     * Constructs a new ProfileList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IProfileList);

    /** ProfileList all. */
    public all: { [k: string]: IStatefulProfile };

    /**
     * Creates a new ProfileList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ProfileList instance
     */
    public static create(properties?: IProfileList): ProfileList;

    /**
     * Encodes the specified ProfileList message. Does not implicitly {@link ProfileList.verify|verify} messages.
     * @param message ProfileList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IProfileList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ProfileList message, length delimited. Does not implicitly {@link ProfileList.verify|verify} messages.
     * @param message ProfileList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IProfileList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ProfileList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ProfileList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ProfileList;

    /**
     * Decodes a ProfileList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ProfileList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ProfileList;

    /**
     * Verifies a ProfileList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ProfileList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ProfileList
     */
    public static fromObject(object: { [k: string]: any }): ProfileList;

    /**
     * Creates a plain object from a ProfileList message. Also converts values to other types if specified.
     * @param message ProfileList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ProfileList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ProfileList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ProfileList
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a ProfileProviderList. */
export interface IProfileProviderList {

    /** ProfileProviderList all */
    all?: (IProfileProvider[]|null);
}

/** Represents a ProfileProviderList. */
export class ProfileProviderList implements IProfileProviderList {

    /**
     * Constructs a new ProfileProviderList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IProfileProviderList);

    /** ProfileProviderList all. */
    public all: IProfileProvider[];

    /**
     * Creates a new ProfileProviderList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ProfileProviderList instance
     */
    public static create(properties?: IProfileProviderList): ProfileProviderList;

    /**
     * Encodes the specified ProfileProviderList message. Does not implicitly {@link ProfileProviderList.verify|verify} messages.
     * @param message ProfileProviderList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IProfileProviderList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ProfileProviderList message, length delimited. Does not implicitly {@link ProfileProviderList.verify|verify} messages.
     * @param message ProfileProviderList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IProfileProviderList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ProfileProviderList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ProfileProviderList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ProfileProviderList;

    /**
     * Decodes a ProfileProviderList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ProfileProviderList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ProfileProviderList;

    /**
     * Verifies a ProfileProviderList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ProfileProviderList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ProfileProviderList
     */
    public static fromObject(object: { [k: string]: any }): ProfileProviderList;

    /**
     * Creates a plain object from a ProfileProviderList message. Also converts values to other types if specified.
     * @param message ProfileProviderList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ProfileProviderList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ProfileProviderList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ProfileProviderList
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a ProfileUpdate. */
export interface IProfileUpdate {

    /** ProfileUpdate id */
    id?: (string|null);

    /** ProfileUpdate settings */
    settings?: (string|null);
}

/** Represents a ProfileUpdate. */
export class ProfileUpdate implements IProfileUpdate {

    /**
     * Constructs a new ProfileUpdate.
     * @param [properties] Properties to set
     */
    constructor(properties?: IProfileUpdate);

    /** ProfileUpdate id. */
    public id: string;

    /** ProfileUpdate settings. */
    public settings: string;

    /**
     * Creates a new ProfileUpdate instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ProfileUpdate instance
     */
    public static create(properties?: IProfileUpdate): ProfileUpdate;

    /**
     * Encodes the specified ProfileUpdate message. Does not implicitly {@link ProfileUpdate.verify|verify} messages.
     * @param message ProfileUpdate message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IProfileUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ProfileUpdate message, length delimited. Does not implicitly {@link ProfileUpdate.verify|verify} messages.
     * @param message ProfileUpdate message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IProfileUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ProfileUpdate message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ProfileUpdate
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ProfileUpdate;

    /**
     * Decodes a ProfileUpdate message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ProfileUpdate
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ProfileUpdate;

    /**
     * Verifies a ProfileUpdate message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ProfileUpdate message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ProfileUpdate
     */
    public static fromObject(object: { [k: string]: any }): ProfileUpdate;

    /**
     * Creates a plain object from a ProfileUpdate message. Also converts values to other types if specified.
     * @param message ProfileUpdate
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ProfileUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ProfileUpdate to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ProfileUpdate
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a DictionaryList. */
export interface IDictionaryList {

    /** DictionaryList all */
    all?: ({ [k: string]: IDictionaryHead }|null);
}

/** Represents a DictionaryList. */
export class DictionaryList implements IDictionaryList {

    /**
     * Constructs a new DictionaryList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDictionaryList);

    /** DictionaryList all. */
    public all: { [k: string]: IDictionaryHead };

    /**
     * Creates a new DictionaryList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DictionaryList instance
     */
    public static create(properties?: IDictionaryList): DictionaryList;

    /**
     * Encodes the specified DictionaryList message. Does not implicitly {@link DictionaryList.verify|verify} messages.
     * @param message DictionaryList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDictionaryList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DictionaryList message, length delimited. Does not implicitly {@link DictionaryList.verify|verify} messages.
     * @param message DictionaryList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDictionaryList, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DictionaryList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DictionaryList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DictionaryList;

    /**
     * Decodes a DictionaryList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DictionaryList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DictionaryList;

    /**
     * Verifies a DictionaryList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DictionaryList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DictionaryList
     */
    public static fromObject(object: { [k: string]: any }): DictionaryList;

    /**
     * Creates a plain object from a DictionaryList message. Also converts values to other types if specified.
     * @param message DictionaryList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DictionaryList, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DictionaryList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DictionaryList
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an Uplink. */
export interface IUplink {

    /** Uplink id */
    id?: (string|null);

    /** Uplink cmd */
    cmd?: (ICommandValue|null);

    /** Uplink parseCmd */
    parseCmd?: (IRawCommandValue|null);

    /** Uplink seq */
    seq?: (ICommandSequence|null);

    /** Uplink parseSeq */
    parseSeq?: (IRawCommandSequence|null);

    /** Uplink file */
    file?: (IUplinkFileChunk|null);

    /** Uplink request */
    request?: (IRequestValue|null);

    /** Uplink cancel */
    cancel?: (google.protobuf.IEmpty|null);

    /** Uplink final */
    final?: (google.protobuf.IEmpty|null);
}

/** Represents an Uplink. */
export class Uplink implements IUplink {

    /**
     * Constructs a new Uplink.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUplink);

    /** Uplink id. */
    public id: string;

    /** Uplink cmd. */
    public cmd?: (ICommandValue|null);

    /** Uplink parseCmd. */
    public parseCmd?: (IRawCommandValue|null);

    /** Uplink seq. */
    public seq?: (ICommandSequence|null);

    /** Uplink parseSeq. */
    public parseSeq?: (IRawCommandSequence|null);

    /** Uplink file. */
    public file?: (IUplinkFileChunk|null);

    /** Uplink request. */
    public request?: (IRequestValue|null);

    /** Uplink cancel. */
    public cancel?: (google.protobuf.IEmpty|null);

    /** Uplink final. */
    public final?: (google.protobuf.IEmpty|null);

    /** Uplink value. */
    public value?: ("cmd"|"parseCmd"|"seq"|"parseSeq"|"file"|"request"|"cancel"|"final");

    /**
     * Creates a new Uplink instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Uplink instance
     */
    public static create(properties?: IUplink): Uplink;

    /**
     * Encodes the specified Uplink message. Does not implicitly {@link Uplink.verify|verify} messages.
     * @param message Uplink message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUplink, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Uplink message, length delimited. Does not implicitly {@link Uplink.verify|verify} messages.
     * @param message Uplink message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUplink, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Uplink message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Uplink
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Uplink;

    /**
     * Decodes an Uplink message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Uplink
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Uplink;

    /**
     * Verifies an Uplink message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Uplink message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Uplink
     */
    public static fromObject(object: { [k: string]: any }): Uplink;

    /**
     * Creates a plain object from an Uplink message. Also converts values to other types if specified.
     * @param message Uplink
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Uplink, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Uplink to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Uplink
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of an UplinkReply. */
export interface IUplinkReply {

    /** UplinkReply id */
    id?: (string|null);

    /** UplinkReply reply */
    reply?: (Uint8Array|null);

    /** UplinkReply error */
    error?: (string|null);
}

/** Represents an UplinkReply. */
export class UplinkReply implements IUplinkReply {

    /**
     * Constructs a new UplinkReply.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUplinkReply);

    /** UplinkReply id. */
    public id: string;

    /** UplinkReply reply. */
    public reply?: (Uint8Array|null);

    /** UplinkReply error. */
    public error?: (string|null);

    /** UplinkReply status. */
    public status?: ("reply"|"error");

    /**
     * Creates a new UplinkReply instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UplinkReply instance
     */
    public static create(properties?: IUplinkReply): UplinkReply;

    /**
     * Encodes the specified UplinkReply message. Does not implicitly {@link UplinkReply.verify|verify} messages.
     * @param message UplinkReply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUplinkReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified UplinkReply message, length delimited. Does not implicitly {@link UplinkReply.verify|verify} messages.
     * @param message UplinkReply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUplinkReply, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an UplinkReply message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UplinkReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): UplinkReply;

    /**
     * Decodes an UplinkReply message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UplinkReply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): UplinkReply;

    /**
     * Verifies an UplinkReply message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an UplinkReply message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UplinkReply
     */
    public static fromObject(object: { [k: string]: any }): UplinkReply;

    /**
     * Creates a plain object from an UplinkReply message. Also converts values to other types if specified.
     * @param message UplinkReply
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: UplinkReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UplinkReply to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for UplinkReply
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FswInitialPacket. */
export interface IFswInitialPacket {

    /** FswInitialPacket info */
    info?: (IFsw|null);

    /** FswInitialPacket profile */
    profile?: (string|null);
}

/** Represents a FswInitialPacket. */
export class FswInitialPacket implements IFswInitialPacket {

    /**
     * Constructs a new FswInitialPacket.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFswInitialPacket);

    /** FswInitialPacket info. */
    public info?: (IFsw|null);

    /** FswInitialPacket profile. */
    public profile: string;

    /**
     * Creates a new FswInitialPacket instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FswInitialPacket instance
     */
    public static create(properties?: IFswInitialPacket): FswInitialPacket;

    /**
     * Encodes the specified FswInitialPacket message. Does not implicitly {@link FswInitialPacket.verify|verify} messages.
     * @param message FswInitialPacket message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFswInitialPacket, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FswInitialPacket message, length delimited. Does not implicitly {@link FswInitialPacket.verify|verify} messages.
     * @param message FswInitialPacket message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFswInitialPacket, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FswInitialPacket message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FswInitialPacket
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FswInitialPacket;

    /**
     * Decodes a FswInitialPacket message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FswInitialPacket
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FswInitialPacket;

    /**
     * Verifies a FswInitialPacket message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FswInitialPacket message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FswInitialPacket
     */
    public static fromObject(object: { [k: string]: any }): FswInitialPacket;

    /**
     * Creates a plain object from a FswInitialPacket message. Also converts values to other types if specified.
     * @param message FswInitialPacket
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FswInitialPacket, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FswInitialPacket to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FswInitialPacket
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a FswConnectionPacket. */
export interface IFswConnectionPacket {

    /** FswConnectionPacket info */
    info?: (IFswInitialPacket|null);

    /** FswConnectionPacket reply */
    reply?: (IUplinkReply|null);
}

/** Represents a FswConnectionPacket. */
export class FswConnectionPacket implements IFswConnectionPacket {

    /**
     * Constructs a new FswConnectionPacket.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFswConnectionPacket);

    /** FswConnectionPacket info. */
    public info?: (IFswInitialPacket|null);

    /** FswConnectionPacket reply. */
    public reply?: (IUplinkReply|null);

    /** FswConnectionPacket value. */
    public value?: ("info"|"reply");

    /**
     * Creates a new FswConnectionPacket instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FswConnectionPacket instance
     */
    public static create(properties?: IFswConnectionPacket): FswConnectionPacket;

    /**
     * Encodes the specified FswConnectionPacket message. Does not implicitly {@link FswConnectionPacket.verify|verify} messages.
     * @param message FswConnectionPacket message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFswConnectionPacket, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FswConnectionPacket message, length delimited. Does not implicitly {@link FswConnectionPacket.verify|verify} messages.
     * @param message FswConnectionPacket message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFswConnectionPacket, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FswConnectionPacket message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FswConnectionPacket
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FswConnectionPacket;

    /**
     * Decodes a FswConnectionPacket message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FswConnectionPacket
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FswConnectionPacket;

    /**
     * Verifies a FswConnectionPacket message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FswConnectionPacket message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FswConnectionPacket
     */
    public static fromObject(object: { [k: string]: any }): FswConnectionPacket;

    /**
     * Creates a plain object from a FswConnectionPacket message. Also converts values to other types if specified.
     * @param message FswConnectionPacket
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FswConnectionPacket, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FswConnectionPacket to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FswConnectionPacket
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Timestamp
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an Empty. */
        interface IEmpty {
        }

        /** Represents an Empty. */
        class Empty implements IEmpty {

            /**
             * Constructs a new Empty.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEmpty);

            /**
             * Creates a new Empty instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Empty instance
             */
            public static create(properties?: google.protobuf.IEmpty): google.protobuf.Empty;

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Empty;

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Empty;

            /**
             * Verifies an Empty message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Empty
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Empty;

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @param message Empty
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Empty, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Empty to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Empty
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}

/** Properties of a ProfileProvider. */
export interface IProfileProvider {

    /** ProfileProvider name */
    name?: (string|null);

    /** ProfileProvider schema */
    schema?: (string|null);

    /** ProfileProvider uiSchema */
    uiSchema?: (string|null);
}

/** Represents a ProfileProvider. */
export class ProfileProvider implements IProfileProvider {

    /**
     * Constructs a new ProfileProvider.
     * @param [properties] Properties to set
     */
    constructor(properties?: IProfileProvider);

    /** ProfileProvider name. */
    public name: string;

    /** ProfileProvider schema. */
    public schema: string;

    /** ProfileProvider uiSchema. */
    public uiSchema: string;

    /**
     * Creates a new ProfileProvider instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ProfileProvider instance
     */
    public static create(properties?: IProfileProvider): ProfileProvider;

    /**
     * Encodes the specified ProfileProvider message. Does not implicitly {@link ProfileProvider.verify|verify} messages.
     * @param message ProfileProvider message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IProfileProvider, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ProfileProvider message, length delimited. Does not implicitly {@link ProfileProvider.verify|verify} messages.
     * @param message ProfileProvider message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IProfileProvider, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ProfileProvider message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ProfileProvider
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ProfileProvider;

    /**
     * Decodes a ProfileProvider message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ProfileProvider
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ProfileProvider;

    /**
     * Verifies a ProfileProvider message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ProfileProvider message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ProfileProvider
     */
    public static fromObject(object: { [k: string]: any }): ProfileProvider;

    /**
     * Creates a plain object from a ProfileProvider message. Also converts values to other types if specified.
     * @param message ProfileProvider
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ProfileProvider, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ProfileProvider to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ProfileProvider
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a Profile. */
export interface IProfile {

    /** Profile name */
    name?: (string|null);

    /** Profile provider */
    provider?: (string|null);

    /** Profile settings */
    settings?: (string|null);
}

/** Represents a Profile. */
export class Profile implements IProfile {

    /**
     * Constructs a new Profile.
     * @param [properties] Properties to set
     */
    constructor(properties?: IProfile);

    /** Profile name. */
    public name: string;

    /** Profile provider. */
    public provider: string;

    /** Profile settings. */
    public settings: string;

    /**
     * Creates a new Profile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Profile instance
     */
    public static create(properties?: IProfile): Profile;

    /**
     * Encodes the specified Profile message. Does not implicitly {@link Profile.verify|verify} messages.
     * @param message Profile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IProfile, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Profile message, length delimited. Does not implicitly {@link Profile.verify|verify} messages.
     * @param message Profile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IProfile, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Profile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Profile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Profile;

    /**
     * Decodes a Profile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Profile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Profile;

    /**
     * Verifies a Profile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Profile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Profile
     */
    public static fromObject(object: { [k: string]: any }): Profile;

    /**
     * Creates a plain object from a Profile message. Also converts values to other types if specified.
     * @param message Profile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Profile, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Profile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Profile
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** ProfileState enum. */
export enum ProfileState {
    PROFILE_IDLE = 0,
    PROFILE_CONNECTING = 1,
    PROFILE_ACTIVE = 2,
    PROFILE_DISCONNECT = 3
}
