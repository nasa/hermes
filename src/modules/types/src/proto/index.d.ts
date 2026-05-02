import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace hermes. */
export namespace hermes {

    /** SourceContextFilter enum. */
    enum SourceContextFilter {
        REALTIME_ONLY = 0,
        RECORDED_ONLY = 1,
        ALL = 2
    }

    /** Properties of a BusFilter. */
    interface IBusFilter {

        /** BusFilter source */
        source?: (string|null);

        /** BusFilter names */
        names?: (string[]|null);

        /** BusFilter context */
        context?: (hermes.SourceContextFilter|null);
    }

    /** Represents a BusFilter. */
    class BusFilter implements IBusFilter {

        /**
         * Constructs a new BusFilter.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IBusFilter);

        /** BusFilter source. */
        public source: string;

        /** BusFilter names. */
        public names: string[];

        /** BusFilter context. */
        public context: hermes.SourceContextFilter;

        /**
         * Creates a new BusFilter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BusFilter instance
         */
        public static create(properties?: hermes.IBusFilter): hermes.BusFilter;

        /**
         * Encodes the specified BusFilter message. Does not implicitly {@link hermes.BusFilter.verify|verify} messages.
         * @param message BusFilter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IBusFilter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BusFilter message, length delimited. Does not implicitly {@link hermes.BusFilter.verify|verify} messages.
         * @param message BusFilter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IBusFilter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BusFilter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BusFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.BusFilter;

        /**
         * Decodes a BusFilter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BusFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.BusFilter;

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
        public static fromObject(object: { [k: string]: any }): hermes.BusFilter;

        /**
         * Creates a plain object from a BusFilter message. Also converts values to other types if specified.
         * @param message BusFilter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.BusFilter, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    enum SourceContext {
        REALTIME = 0,
        RECORDED = 1
    }

    /** Properties of an Event. */
    interface IEvent {

        /** Event ref */
        ref?: (hermes.IEventRef|null);

        /** Event time */
        time?: (hermes.ITime|null);

        /** Event message */
        message?: (string|null);

        /** Event args */
        args?: (hermes.IValue[]|null);

        /** Event tags */
        tags?: ({ [k: string]: hermes.IValue }|null);
    }

    /** Represents an Event. */
    class Event implements IEvent {

        /**
         * Constructs a new Event.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IEvent);

        /** Event ref. */
        public ref?: (hermes.IEventRef|null);

        /** Event time. */
        public time?: (hermes.ITime|null);

        /** Event message. */
        public message: string;

        /** Event args. */
        public args: hermes.IValue[];

        /** Event tags. */
        public tags: { [k: string]: hermes.IValue };

        /**
         * Creates a new Event instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Event instance
         */
        public static create(properties?: hermes.IEvent): hermes.Event;

        /**
         * Encodes the specified Event message. Does not implicitly {@link hermes.Event.verify|verify} messages.
         * @param message Event message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Event message, length delimited. Does not implicitly {@link hermes.Event.verify|verify} messages.
         * @param message Event message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Event message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Event;

        /**
         * Decodes an Event message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Event;

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
        public static fromObject(object: { [k: string]: any }): hermes.Event;

        /**
         * Creates a plain object from an Event message. Also converts values to other types if specified.
         * @param message Event
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ITelemetry {

        /** Telemetry ref */
        ref?: (hermes.ITelemetryRef|null);

        /** Telemetry time */
        time?: (hermes.ITime|null);

        /** Telemetry value */
        value?: (hermes.IValue|null);

        /** Telemetry labels */
        labels?: ({ [k: string]: string }|null);
    }

    /** Represents a Telemetry. */
    class Telemetry implements ITelemetry {

        /**
         * Constructs a new Telemetry.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ITelemetry);

        /** Telemetry ref. */
        public ref?: (hermes.ITelemetryRef|null);

        /** Telemetry time. */
        public time?: (hermes.ITime|null);

        /** Telemetry value. */
        public value?: (hermes.IValue|null);

        /** Telemetry labels. */
        public labels: { [k: string]: string };

        /**
         * Creates a new Telemetry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Telemetry instance
         */
        public static create(properties?: hermes.ITelemetry): hermes.Telemetry;

        /**
         * Encodes the specified Telemetry message. Does not implicitly {@link hermes.Telemetry.verify|verify} messages.
         * @param message Telemetry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ITelemetry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Telemetry message, length delimited. Does not implicitly {@link hermes.Telemetry.verify|verify} messages.
         * @param message Telemetry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ITelemetry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Telemetry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Telemetry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Telemetry;

        /**
         * Decodes a Telemetry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Telemetry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Telemetry;

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
        public static fromObject(object: { [k: string]: any }): hermes.Telemetry;

        /**
         * Creates a plain object from a Telemetry message. Also converts values to other types if specified.
         * @param message Telemetry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Telemetry, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ISourcedEvent {

        /** SourcedEvent event */
        event?: (hermes.IEvent|null);

        /** SourcedEvent source */
        source?: (string|null);

        /** SourcedEvent context */
        context?: (hermes.SourceContext|null);
    }

    /** Represents a SourcedEvent. */
    class SourcedEvent implements ISourcedEvent {

        /**
         * Constructs a new SourcedEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ISourcedEvent);

        /** SourcedEvent event. */
        public event?: (hermes.IEvent|null);

        /** SourcedEvent source. */
        public source: string;

        /** SourcedEvent context. */
        public context: hermes.SourceContext;

        /**
         * Creates a new SourcedEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SourcedEvent instance
         */
        public static create(properties?: hermes.ISourcedEvent): hermes.SourcedEvent;

        /**
         * Encodes the specified SourcedEvent message. Does not implicitly {@link hermes.SourcedEvent.verify|verify} messages.
         * @param message SourcedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ISourcedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SourcedEvent message, length delimited. Does not implicitly {@link hermes.SourcedEvent.verify|verify} messages.
         * @param message SourcedEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ISourcedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SourcedEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SourcedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.SourcedEvent;

        /**
         * Decodes a SourcedEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SourcedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.SourcedEvent;

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
        public static fromObject(object: { [k: string]: any }): hermes.SourcedEvent;

        /**
         * Creates a plain object from a SourcedEvent message. Also converts values to other types if specified.
         * @param message SourcedEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.SourcedEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ISourcedTelemetry {

        /** SourcedTelemetry telemetry */
        telemetry?: (hermes.ITelemetry|null);

        /** SourcedTelemetry source */
        source?: (string|null);

        /** SourcedTelemetry context */
        context?: (hermes.SourceContext|null);
    }

    /** Represents a SourcedTelemetry. */
    class SourcedTelemetry implements ISourcedTelemetry {

        /**
         * Constructs a new SourcedTelemetry.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ISourcedTelemetry);

        /** SourcedTelemetry telemetry. */
        public telemetry?: (hermes.ITelemetry|null);

        /** SourcedTelemetry source. */
        public source: string;

        /** SourcedTelemetry context. */
        public context: hermes.SourceContext;

        /**
         * Creates a new SourcedTelemetry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SourcedTelemetry instance
         */
        public static create(properties?: hermes.ISourcedTelemetry): hermes.SourcedTelemetry;

        /**
         * Encodes the specified SourcedTelemetry message. Does not implicitly {@link hermes.SourcedTelemetry.verify|verify} messages.
         * @param message SourcedTelemetry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ISourcedTelemetry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SourcedTelemetry message, length delimited. Does not implicitly {@link hermes.SourcedTelemetry.verify|verify} messages.
         * @param message SourcedTelemetry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ISourcedTelemetry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SourcedTelemetry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SourcedTelemetry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.SourcedTelemetry;

        /**
         * Decodes a SourcedTelemetry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SourcedTelemetry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.SourcedTelemetry;

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
        public static fromObject(object: { [k: string]: any }): hermes.SourcedTelemetry;

        /**
         * Creates a plain object from a SourcedTelemetry message. Also converts values to other types if specified.
         * @param message SourcedTelemetry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.SourcedTelemetry, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    enum FileDownlinkCompletionStatus {
        DOWNLINK_COMPLETED = 0,
        DOWNLINK_UNKNOWN = -1,
        DOWNLINK_PARTIAL = 1,
        DOWNLINK_CRC_FAILED = 2
    }

    /** Properties of a FileDownlinkChunk. */
    interface IFileDownlinkChunk {

        /** FileDownlinkChunk offset */
        offset?: (number|Long|null);

        /** FileDownlinkChunk size */
        size?: (number|Long|null);
    }

    /** Represents a FileDownlinkChunk. */
    class FileDownlinkChunk implements IFileDownlinkChunk {

        /**
         * Constructs a new FileDownlinkChunk.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFileDownlinkChunk);

        /** FileDownlinkChunk offset. */
        public offset: (number|Long);

        /** FileDownlinkChunk size. */
        public size: (number|Long);

        /**
         * Creates a new FileDownlinkChunk instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FileDownlinkChunk instance
         */
        public static create(properties?: hermes.IFileDownlinkChunk): hermes.FileDownlinkChunk;

        /**
         * Encodes the specified FileDownlinkChunk message. Does not implicitly {@link hermes.FileDownlinkChunk.verify|verify} messages.
         * @param message FileDownlinkChunk message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFileDownlinkChunk, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileDownlinkChunk message, length delimited. Does not implicitly {@link hermes.FileDownlinkChunk.verify|verify} messages.
         * @param message FileDownlinkChunk message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFileDownlinkChunk, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileDownlinkChunk message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileDownlinkChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FileDownlinkChunk;

        /**
         * Decodes a FileDownlinkChunk message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileDownlinkChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FileDownlinkChunk;

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
        public static fromObject(object: { [k: string]: any }): hermes.FileDownlinkChunk;

        /**
         * Creates a plain object from a FileDownlinkChunk message. Also converts values to other types if specified.
         * @param message FileDownlinkChunk
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FileDownlinkChunk, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFileDownlink {

        /** FileDownlink uid */
        uid?: (string|null);

        /** FileDownlink timeStart */
        timeStart?: (google.protobuf.ITimestamp|null);

        /** FileDownlink timeEnd */
        timeEnd?: (google.protobuf.ITimestamp|null);

        /** FileDownlink status */
        status?: (hermes.FileDownlinkCompletionStatus|null);

        /** FileDownlink source */
        source?: (string|null);

        /** FileDownlink sourcePath */
        sourcePath?: (string|null);

        /** FileDownlink destinationPath */
        destinationPath?: (string|null);

        /** FileDownlink filePath */
        filePath?: (string|null);

        /** FileDownlink missingChunks */
        missingChunks?: (hermes.IFileDownlinkChunk[]|null);

        /** FileDownlink duplicateChunks */
        duplicateChunks?: (hermes.IFileDownlinkChunk[]|null);

        /** FileDownlink size */
        size?: (number|Long|null);

        /** FileDownlink metadata */
        metadata?: ({ [k: string]: string }|null);
    }

    /** Represents a FileDownlink. */
    class FileDownlink implements IFileDownlink {

        /**
         * Constructs a new FileDownlink.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFileDownlink);

        /** FileDownlink uid. */
        public uid: string;

        /** FileDownlink timeStart. */
        public timeStart?: (google.protobuf.ITimestamp|null);

        /** FileDownlink timeEnd. */
        public timeEnd?: (google.protobuf.ITimestamp|null);

        /** FileDownlink status. */
        public status: hermes.FileDownlinkCompletionStatus;

        /** FileDownlink source. */
        public source: string;

        /** FileDownlink sourcePath. */
        public sourcePath: string;

        /** FileDownlink destinationPath. */
        public destinationPath: string;

        /** FileDownlink filePath. */
        public filePath: string;

        /** FileDownlink missingChunks. */
        public missingChunks: hermes.IFileDownlinkChunk[];

        /** FileDownlink duplicateChunks. */
        public duplicateChunks: hermes.IFileDownlinkChunk[];

        /** FileDownlink size. */
        public size: (number|Long);

        /** FileDownlink metadata. */
        public metadata: { [k: string]: string };

        /**
         * Creates a new FileDownlink instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FileDownlink instance
         */
        public static create(properties?: hermes.IFileDownlink): hermes.FileDownlink;

        /**
         * Encodes the specified FileDownlink message. Does not implicitly {@link hermes.FileDownlink.verify|verify} messages.
         * @param message FileDownlink message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFileDownlink, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileDownlink message, length delimited. Does not implicitly {@link hermes.FileDownlink.verify|verify} messages.
         * @param message FileDownlink message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFileDownlink, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileDownlink message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileDownlink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FileDownlink;

        /**
         * Decodes a FileDownlink message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileDownlink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FileDownlink;

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
        public static fromObject(object: { [k: string]: any }): hermes.FileDownlink;

        /**
         * Creates a plain object from a FileDownlink message. Also converts values to other types if specified.
         * @param message FileDownlink
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FileDownlink, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFileUplink {

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
    class FileUplink implements IFileUplink {

        /**
         * Constructs a new FileUplink.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFileUplink);

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
        public static create(properties?: hermes.IFileUplink): hermes.FileUplink;

        /**
         * Encodes the specified FileUplink message. Does not implicitly {@link hermes.FileUplink.verify|verify} messages.
         * @param message FileUplink message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFileUplink, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileUplink message, length delimited. Does not implicitly {@link hermes.FileUplink.verify|verify} messages.
         * @param message FileUplink message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFileUplink, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileUplink message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileUplink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FileUplink;

        /**
         * Decodes a FileUplink message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileUplink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FileUplink;

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
        public static fromObject(object: { [k: string]: any }): hermes.FileUplink;

        /**
         * Creates a plain object from a FileUplink message. Also converts values to other types if specified.
         * @param message FileUplink
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FileUplink, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFileTransfer {

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
    class FileTransfer implements IFileTransfer {

        /**
         * Constructs a new FileTransfer.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFileTransfer);

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
        public static create(properties?: hermes.IFileTransfer): hermes.FileTransfer;

        /**
         * Encodes the specified FileTransfer message. Does not implicitly {@link hermes.FileTransfer.verify|verify} messages.
         * @param message FileTransfer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFileTransfer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileTransfer message, length delimited. Does not implicitly {@link hermes.FileTransfer.verify|verify} messages.
         * @param message FileTransfer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFileTransfer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileTransfer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileTransfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FileTransfer;

        /**
         * Decodes a FileTransfer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileTransfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FileTransfer;

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
        public static fromObject(object: { [k: string]: any }): hermes.FileTransfer;

        /**
         * Creates a plain object from a FileTransfer message. Also converts values to other types if specified.
         * @param message FileTransfer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FileTransfer, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFileTransferState {

        /** FileTransferState downlinkCompleted */
        downlinkCompleted?: (hermes.IFileDownlink[]|null);

        /** FileTransferState uplinkCompleted */
        uplinkCompleted?: (hermes.IFileUplink[]|null);

        /** FileTransferState downlinkInProgress */
        downlinkInProgress?: (hermes.IFileTransfer[]|null);

        /** FileTransferState uplinkInProgress */
        uplinkInProgress?: (hermes.IFileTransfer[]|null);
    }

    /** Represents a FileTransferState. */
    class FileTransferState implements IFileTransferState {

        /**
         * Constructs a new FileTransferState.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFileTransferState);

        /** FileTransferState downlinkCompleted. */
        public downlinkCompleted: hermes.IFileDownlink[];

        /** FileTransferState uplinkCompleted. */
        public uplinkCompleted: hermes.IFileUplink[];

        /** FileTransferState downlinkInProgress. */
        public downlinkInProgress: hermes.IFileTransfer[];

        /** FileTransferState uplinkInProgress. */
        public uplinkInProgress: hermes.IFileTransfer[];

        /**
         * Creates a new FileTransferState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FileTransferState instance
         */
        public static create(properties?: hermes.IFileTransferState): hermes.FileTransferState;

        /**
         * Encodes the specified FileTransferState message. Does not implicitly {@link hermes.FileTransferState.verify|verify} messages.
         * @param message FileTransferState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFileTransferState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileTransferState message, length delimited. Does not implicitly {@link hermes.FileTransferState.verify|verify} messages.
         * @param message FileTransferState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFileTransferState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileTransferState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileTransferState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FileTransferState;

        /**
         * Decodes a FileTransferState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileTransferState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FileTransferState;

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
        public static fromObject(object: { [k: string]: any }): hermes.FileTransferState;

        /**
         * Creates a plain object from a FileTransferState message. Also converts values to other types if specified.
         * @param message FileTransferState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FileTransferState, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    enum IntKind {
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
    enum NumberKind {
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
    enum UIntKind {
        UINT_U8 = 0,
        UINT_U16 = 1,
        UINT_U32 = 2,
        UINT_U64 = 3
    }

    /** SIntKind enum. */
    enum SIntKind {
        SINT_I8 = 0,
        SINT_I16 = 1,
        SINT_I32 = 2,
        SINT_I64 = 3
    }

    /** FloatKind enum. */
    enum FloatKind {
        F_F32 = 0,
        F_F64 = 1
    }

    /** ReferenceKind enum. */
    enum ReferenceKind {
        REF_ENUM = 0,
        REF_BITMASK = 1,
        REF_OBJECT = 2,
        REF_ARRAY = 3,
        REF_BYTES = 4
    }

    /** Properties of a BooleanType. */
    interface IBooleanType {

        /** BooleanType encodeType */
        encodeType?: (hermes.UIntKind|null);
    }

    /** Represents a BooleanType. */
    class BooleanType implements IBooleanType {

        /**
         * Constructs a new BooleanType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IBooleanType);

        /** BooleanType encodeType. */
        public encodeType: hermes.UIntKind;

        /**
         * Creates a new BooleanType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BooleanType instance
         */
        public static create(properties?: hermes.IBooleanType): hermes.BooleanType;

        /**
         * Encodes the specified BooleanType message. Does not implicitly {@link hermes.BooleanType.verify|verify} messages.
         * @param message BooleanType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IBooleanType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BooleanType message, length delimited. Does not implicitly {@link hermes.BooleanType.verify|verify} messages.
         * @param message BooleanType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IBooleanType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BooleanType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BooleanType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.BooleanType;

        /**
         * Decodes a BooleanType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BooleanType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.BooleanType;

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
        public static fromObject(object: { [k: string]: any }): hermes.BooleanType;

        /**
         * Creates a plain object from a BooleanType message. Also converts values to other types if specified.
         * @param message BooleanType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.BooleanType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IIntType {

        /** IntType kind */
        kind?: (hermes.IntKind|null);

        /** Lower bound on valid values */
        min?: (number|Long|null);

        /** Upper bound on valid values */
        max?: (number|Long|null);
    }

    /** Represents an IntType. */
    class IntType implements IIntType {

        /**
         * Constructs a new IntType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IIntType);

        /** IntType kind. */
        public kind: hermes.IntKind;

        /** Lower bound on valid values */
        public min: (number|Long);

        /** Upper bound on valid values */
        public max: (number|Long);

        /**
         * Creates a new IntType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns IntType instance
         */
        public static create(properties?: hermes.IIntType): hermes.IntType;

        /**
         * Encodes the specified IntType message. Does not implicitly {@link hermes.IntType.verify|verify} messages.
         * @param message IntType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IIntType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified IntType message, length delimited. Does not implicitly {@link hermes.IntType.verify|verify} messages.
         * @param message IntType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IIntType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an IntType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns IntType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.IntType;

        /**
         * Decodes an IntType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns IntType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.IntType;

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
        public static fromObject(object: { [k: string]: any }): hermes.IntType;

        /**
         * Creates a plain object from an IntType message. Also converts values to other types if specified.
         * @param message IntType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.IntType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFloatType {

        /** FloatType kind */
        kind?: (hermes.FloatKind|null);

        /** Lower bound on valid values */
        min?: (number|null);

        /** Upper bound on valid values */
        max?: (number|null);
    }

    /** Represents a FloatType. */
    class FloatType implements IFloatType {

        /**
         * Constructs a new FloatType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFloatType);

        /** FloatType kind. */
        public kind: hermes.FloatKind;

        /** Lower bound on valid values */
        public min: number;

        /** Upper bound on valid values */
        public max: number;

        /**
         * Creates a new FloatType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FloatType instance
         */
        public static create(properties?: hermes.IFloatType): hermes.FloatType;

        /**
         * Encodes the specified FloatType message. Does not implicitly {@link hermes.FloatType.verify|verify} messages.
         * @param message FloatType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFloatType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FloatType message, length delimited. Does not implicitly {@link hermes.FloatType.verify|verify} messages.
         * @param message FloatType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFloatType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FloatType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FloatType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FloatType;

        /**
         * Decodes a FloatType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FloatType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FloatType;

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
        public static fromObject(object: { [k: string]: any }): hermes.FloatType;

        /**
         * Creates a plain object from a FloatType message. Also converts values to other types if specified.
         * @param message FloatType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FloatType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IStringType {

        /**
         * Type to serialize length of string with.
         *
         * When encoding strings, they will be prefixed by their
         * length using this type. If the length does not fit within
         * this type's representable size, it will throw an error.
         */
        lengthType?: (hermes.UIntKind|null);

        /** Optional check for maximum length */
        maxLength?: (number|null);
    }

    /** Represents a StringType. */
    class StringType implements IStringType {

        /**
         * Constructs a new StringType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IStringType);

        /**
         * Type to serialize length of string with.
         *
         * When encoding strings, they will be prefixed by their
         * length using this type. If the length does not fit within
         * this type's representable size, it will throw an error.
         */
        public lengthType: hermes.UIntKind;

        /** Optional check for maximum length */
        public maxLength: number;

        /**
         * Creates a new StringType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StringType instance
         */
        public static create(properties?: hermes.IStringType): hermes.StringType;

        /**
         * Encodes the specified StringType message. Does not implicitly {@link hermes.StringType.verify|verify} messages.
         * @param message StringType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IStringType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StringType message, length delimited. Does not implicitly {@link hermes.StringType.verify|verify} messages.
         * @param message StringType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IStringType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StringType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StringType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.StringType;

        /**
         * Decodes a StringType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StringType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.StringType;

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
        public static fromObject(object: { [k: string]: any }): hermes.StringType;

        /**
         * Creates a plain object from a StringType message. Also converts values to other types if specified.
         * @param message StringType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.StringType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IEnumItem {

        /** EnumItem value */
        value?: (number|null);

        /** EnumItem name */
        name?: (string|null);

        /** EnumItem metadata */
        metadata?: (string|null);
    }

    /** Represents an EnumItem. */
    class EnumItem implements IEnumItem {

        /**
         * Constructs a new EnumItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IEnumItem);

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
        public static create(properties?: hermes.IEnumItem): hermes.EnumItem;

        /**
         * Encodes the specified EnumItem message. Does not implicitly {@link hermes.EnumItem.verify|verify} messages.
         * @param message EnumItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IEnumItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnumItem message, length delimited. Does not implicitly {@link hermes.EnumItem.verify|verify} messages.
         * @param message EnumItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IEnumItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnumItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnumItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.EnumItem;

        /**
         * Decodes an EnumItem message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnumItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.EnumItem;

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
        public static fromObject(object: { [k: string]: any }): hermes.EnumItem;

        /**
         * Creates a plain object from an EnumItem message. Also converts values to other types if specified.
         * @param message EnumItem
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.EnumItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IEnumType {

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
        encodeType?: (hermes.IntKind|null);

        /**
         * Members of the enum and their mapping to its
         * numeric value.
         */
        items?: (hermes.IEnumItem[]|null);
    }

    /** Represents an EnumType. */
    class EnumType implements IEnumType {

        /**
         * Constructs a new EnumType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IEnumType);

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
        public encodeType: hermes.IntKind;

        /**
         * Members of the enum and their mapping to its
         * numeric value.
         */
        public items: hermes.IEnumItem[];

        /**
         * Creates a new EnumType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnumType instance
         */
        public static create(properties?: hermes.IEnumType): hermes.EnumType;

        /**
         * Encodes the specified EnumType message. Does not implicitly {@link hermes.EnumType.verify|verify} messages.
         * @param message EnumType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IEnumType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnumType message, length delimited. Does not implicitly {@link hermes.EnumType.verify|verify} messages.
         * @param message EnumType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IEnumType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnumType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnumType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.EnumType;

        /**
         * Decodes an EnumType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnumType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.EnumType;

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
        public static fromObject(object: { [k: string]: any }): hermes.EnumType;

        /**
         * Creates a plain object from an EnumType message. Also converts values to other types if specified.
         * @param message EnumType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.EnumType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IBoundedArraySize {

        /** BoundedArraySize min */
        min?: (number|null);

        /** BoundedArraySize max */
        max?: (number|null);
    }

    /** Represents a BoundedArraySize. */
    class BoundedArraySize implements IBoundedArraySize {

        /**
         * Constructs a new BoundedArraySize.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IBoundedArraySize);

        /** BoundedArraySize min. */
        public min: number;

        /** BoundedArraySize max. */
        public max: number;

        /**
         * Creates a new BoundedArraySize instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BoundedArraySize instance
         */
        public static create(properties?: hermes.IBoundedArraySize): hermes.BoundedArraySize;

        /**
         * Encodes the specified BoundedArraySize message. Does not implicitly {@link hermes.BoundedArraySize.verify|verify} messages.
         * @param message BoundedArraySize message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IBoundedArraySize, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BoundedArraySize message, length delimited. Does not implicitly {@link hermes.BoundedArraySize.verify|verify} messages.
         * @param message BoundedArraySize message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IBoundedArraySize, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BoundedArraySize message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BoundedArraySize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.BoundedArraySize;

        /**
         * Decodes a BoundedArraySize message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BoundedArraySize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.BoundedArraySize;

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
        public static fromObject(object: { [k: string]: any }): hermes.BoundedArraySize;

        /**
         * Creates a plain object from a BoundedArraySize message. Also converts values to other types if specified.
         * @param message BoundedArraySize
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.BoundedArraySize, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IArrayType {

        /**
         * Name of the array if this is a typedef instead of
         * an inline array.
         */
        name?: (string|null);

        /** Element type */
        elType?: (hermes.IType|null);

        /** ArrayType static */
        "static"?: (number|null);

        /** ArrayType dynamic */
        dynamic?: (hermes.IBoundedArraySize|null);

        /**
         * Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         *
         * Default: {@link TypeKind.u32}
         */
        lengthType?: (hermes.UIntKind|null);
    }

    /** Represents an ArrayType. */
    class ArrayType implements IArrayType {

        /**
         * Constructs a new ArrayType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IArrayType);

        /**
         * Name of the array if this is a typedef instead of
         * an inline array.
         */
        public name: string;

        /** Element type */
        public elType?: (hermes.IType|null);

        /** ArrayType static. */
        public static?: (number|null);

        /** ArrayType dynamic. */
        public dynamic?: (hermes.IBoundedArraySize|null);

        /**
         * Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         *
         * Default: {@link TypeKind.u32}
         */
        public lengthType: hermes.UIntKind;

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
        public static create(properties?: hermes.IArrayType): hermes.ArrayType;

        /**
         * Encodes the specified ArrayType message. Does not implicitly {@link hermes.ArrayType.verify|verify} messages.
         * @param message ArrayType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IArrayType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ArrayType message, length delimited. Does not implicitly {@link hermes.ArrayType.verify|verify} messages.
         * @param message ArrayType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IArrayType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ArrayType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ArrayType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ArrayType;

        /**
         * Decodes an ArrayType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ArrayType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ArrayType;

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
        public static fromObject(object: { [k: string]: any }): hermes.ArrayType;

        /**
         * Creates a plain object from an ArrayType message. Also converts values to other types if specified.
         * @param message ArrayType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ArrayType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IBytesType {

        /**
         * Name of the bytes array if this is a typedef instead of
         * an inline array.
         */
        name?: (string|null);

        /** BytesType kind */
        kind?: (hermes.NumberKind|null);

        /** BytesType static */
        "static"?: (number|null);

        /** BytesType dynamic */
        dynamic?: (hermes.IBoundedArraySize|null);

        /**
         * Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         *
         * Default: {@link TypeKind.u32}
         */
        lengthType?: (hermes.UIntKind|null);
    }

    /**
     * Homogeneous array of numeric primitives, stored as raw bytes
     * In Python this decodes the array using NumPy
     * In JS/TS this decodes the array using DataView or TypedArray
     */
    class BytesType implements IBytesType {

        /**
         * Constructs a new BytesType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IBytesType);

        /**
         * Name of the bytes array if this is a typedef instead of
         * an inline array.
         */
        public name: string;

        /** BytesType kind. */
        public kind: hermes.NumberKind;

        /** BytesType static. */
        public static?: (number|null);

        /** BytesType dynamic. */
        public dynamic?: (hermes.IBoundedArraySize|null);

        /**
         * Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         *
         * Default: {@link TypeKind.u32}
         */
        public lengthType: hermes.UIntKind;

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
        public static create(properties?: hermes.IBytesType): hermes.BytesType;

        /**
         * Encodes the specified BytesType message. Does not implicitly {@link hermes.BytesType.verify|verify} messages.
         * @param message BytesType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IBytesType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BytesType message, length delimited. Does not implicitly {@link hermes.BytesType.verify|verify} messages.
         * @param message BytesType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IBytesType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BytesType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BytesType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.BytesType;

        /**
         * Decodes a BytesType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BytesType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.BytesType;

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
        public static fromObject(object: { [k: string]: any }): hermes.BytesType;

        /**
         * Creates a plain object from a BytesType message. Also converts values to other types if specified.
         * @param message BytesType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.BytesType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IField {

        /** Field name */
        name?: (string|null);

        /** Field type */
        type?: (hermes.IType|null);

        /** Field metadata */
        metadata?: (string|null);

        /** Field value */
        value?: (hermes.IValue|null);
    }

    /** Represents a Field. */
    class Field implements IField {

        /**
         * Constructs a new Field.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IField);

        /** Field name. */
        public name: string;

        /** Field type. */
        public type?: (hermes.IType|null);

        /** Field metadata. */
        public metadata: string;

        /** Field value. */
        public value?: (hermes.IValue|null);

        /**
         * Creates a new Field instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Field instance
         */
        public static create(properties?: hermes.IField): hermes.Field;

        /**
         * Encodes the specified Field message. Does not implicitly {@link hermes.Field.verify|verify} messages.
         * @param message Field message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IField, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Field message, length delimited. Does not implicitly {@link hermes.Field.verify|verify} messages.
         * @param message Field message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IField, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Field message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Field
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Field;

        /**
         * Decodes a Field message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Field
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Field;

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
        public static fromObject(object: { [k: string]: any }): hermes.Field;

        /**
         * Creates a plain object from a Field message. Also converts values to other types if specified.
         * @param message Field
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Field, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IObjectType {

        /** Name of the object/struct */
        name?: (string|null);

        /** Fields/members inside object. Ordered in order of serialization. */
        fields?: (hermes.IField[]|null);
    }

    /** Represents an ObjectType. */
    class ObjectType implements IObjectType {

        /**
         * Constructs a new ObjectType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IObjectType);

        /** Name of the object/struct */
        public name: string;

        /** Fields/members inside object. Ordered in order of serialization. */
        public fields: hermes.IField[];

        /**
         * Creates a new ObjectType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ObjectType instance
         */
        public static create(properties?: hermes.IObjectType): hermes.ObjectType;

        /**
         * Encodes the specified ObjectType message. Does not implicitly {@link hermes.ObjectType.verify|verify} messages.
         * @param message ObjectType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IObjectType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ObjectType message, length delimited. Does not implicitly {@link hermes.ObjectType.verify|verify} messages.
         * @param message ObjectType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IObjectType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ObjectType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ObjectType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ObjectType;

        /**
         * Decodes an ObjectType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ObjectType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ObjectType;

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
        public static fromObject(object: { [k: string]: any }): hermes.ObjectType;

        /**
         * Creates a plain object from an ObjectType message. Also converts values to other types if specified.
         * @param message ObjectType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ObjectType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IReferenceType {

        /** Name of the type */
        name?: (string|null);

        /** ReferenceType kind */
        kind?: (hermes.ReferenceKind|null);
    }

    /** Represents a ReferenceType. */
    class ReferenceType implements IReferenceType {

        /**
         * Constructs a new ReferenceType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IReferenceType);

        /** Name of the type */
        public name: string;

        /** ReferenceType kind. */
        public kind: hermes.ReferenceKind;

        /**
         * Creates a new ReferenceType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReferenceType instance
         */
        public static create(properties?: hermes.IReferenceType): hermes.ReferenceType;

        /**
         * Encodes the specified ReferenceType message. Does not implicitly {@link hermes.ReferenceType.verify|verify} messages.
         * @param message ReferenceType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IReferenceType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReferenceType message, length delimited. Does not implicitly {@link hermes.ReferenceType.verify|verify} messages.
         * @param message ReferenceType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IReferenceType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReferenceType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReferenceType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ReferenceType;

        /**
         * Decodes a ReferenceType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReferenceType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ReferenceType;

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
        public static fromObject(object: { [k: string]: any }): hermes.ReferenceType;

        /**
         * Creates a plain object from a ReferenceType message. Also converts values to other types if specified.
         * @param message ReferenceType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ReferenceType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IVoidType {

        /** Size in bytes of this struct pad */
        size?: (number|null);
    }

    /** Represents a VoidType. */
    class VoidType implements IVoidType {

        /**
         * Constructs a new VoidType.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IVoidType);

        /** Size in bytes of this struct pad */
        public size: number;

        /**
         * Creates a new VoidType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VoidType instance
         */
        public static create(properties?: hermes.IVoidType): hermes.VoidType;

        /**
         * Encodes the specified VoidType message. Does not implicitly {@link hermes.VoidType.verify|verify} messages.
         * @param message VoidType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IVoidType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VoidType message, length delimited. Does not implicitly {@link hermes.VoidType.verify|verify} messages.
         * @param message VoidType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IVoidType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VoidType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VoidType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.VoidType;

        /**
         * Decodes a VoidType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VoidType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.VoidType;

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
        public static fromObject(object: { [k: string]: any }): hermes.VoidType;

        /**
         * Creates a plain object from a VoidType message. Also converts values to other types if specified.
         * @param message VoidType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.VoidType, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IType {

        /** Type ref */
        ref?: (hermes.IReferenceType|null);

        /** Type bool */
        bool?: (hermes.IBooleanType|null);

        /** Type int */
        int?: (hermes.IIntType|null);

        /** Type float */
        float?: (hermes.IFloatType|null);

        /** Type string */
        string?: (hermes.IStringType|null);

        /** Type enum */
        "enum"?: (hermes.IEnumType|null);

        /** Type bitmask */
        bitmask?: (hermes.IEnumType|null);

        /** Type object */
        object?: (hermes.IObjectType|null);

        /** Type array */
        array?: (hermes.IArrayType|null);

        /** Type bytes */
        bytes?: (hermes.IBytesType|null);

        /** Type void */
        "void"?: (hermes.IVoidType|null);

        /** Type metadata */
        metadata?: (string|null);
    }

    /** Represents a Type. */
    class Type implements IType {

        /**
         * Constructs a new Type.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IType);

        /** Type ref. */
        public ref?: (hermes.IReferenceType|null);

        /** Type bool. */
        public bool?: (hermes.IBooleanType|null);

        /** Type int. */
        public int?: (hermes.IIntType|null);

        /** Type float. */
        public float?: (hermes.IFloatType|null);

        /** Type string. */
        public string?: (hermes.IStringType|null);

        /** Type enum. */
        public enum?: (hermes.IEnumType|null);

        /** Type bitmask. */
        public bitmask?: (hermes.IEnumType|null);

        /** Type object. */
        public object?: (hermes.IObjectType|null);

        /** Type array. */
        public array?: (hermes.IArrayType|null);

        /** Type bytes. */
        public bytes?: (hermes.IBytesType|null);

        /** Type void. */
        public void?: (hermes.IVoidType|null);

        /** Type metadata. */
        public metadata: string;

        /** Type value. */
        public value?: ("ref"|"bool"|"int"|"float"|"string"|"enum"|"bitmask"|"object"|"array"|"bytes"|"void");

        /**
         * Creates a new Type instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Type instance
         */
        public static create(properties?: hermes.IType): hermes.Type;

        /**
         * Encodes the specified Type message. Does not implicitly {@link hermes.Type.verify|verify} messages.
         * @param message Type message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Type message, length delimited. Does not implicitly {@link hermes.Type.verify|verify} messages.
         * @param message Type message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Type message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Type;

        /**
         * Decodes a Type message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Type;

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
        public static fromObject(object: { [k: string]: any }): hermes.Type;

        /**
         * Creates a plain object from a Type message. Also converts values to other types if specified.
         * @param message Type
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Type, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IObjectValue {

        /** ObjectValue o */
        o?: ({ [k: string]: hermes.IValue }|null);
    }

    /** Represents an ObjectValue. */
    class ObjectValue implements IObjectValue {

        /**
         * Constructs a new ObjectValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IObjectValue);

        /** ObjectValue o. */
        public o: { [k: string]: hermes.IValue };

        /**
         * Creates a new ObjectValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ObjectValue instance
         */
        public static create(properties?: hermes.IObjectValue): hermes.ObjectValue;

        /**
         * Encodes the specified ObjectValue message. Does not implicitly {@link hermes.ObjectValue.verify|verify} messages.
         * @param message ObjectValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IObjectValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ObjectValue message, length delimited. Does not implicitly {@link hermes.ObjectValue.verify|verify} messages.
         * @param message ObjectValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IObjectValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ObjectValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ObjectValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ObjectValue;

        /**
         * Decodes an ObjectValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ObjectValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ObjectValue;

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
        public static fromObject(object: { [k: string]: any }): hermes.ObjectValue;

        /**
         * Creates a plain object from an ObjectValue message. Also converts values to other types if specified.
         * @param message ObjectValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ObjectValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IArrayValue {

        /** ArrayValue value */
        value?: (hermes.IValue[]|null);
    }

    /** Represents an ArrayValue. */
    class ArrayValue implements IArrayValue {

        /**
         * Constructs a new ArrayValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IArrayValue);

        /** ArrayValue value. */
        public value: hermes.IValue[];

        /**
         * Creates a new ArrayValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ArrayValue instance
         */
        public static create(properties?: hermes.IArrayValue): hermes.ArrayValue;

        /**
         * Encodes the specified ArrayValue message. Does not implicitly {@link hermes.ArrayValue.verify|verify} messages.
         * @param message ArrayValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IArrayValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ArrayValue message, length delimited. Does not implicitly {@link hermes.ArrayValue.verify|verify} messages.
         * @param message ArrayValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IArrayValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ArrayValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ArrayValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ArrayValue;

        /**
         * Decodes an ArrayValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ArrayValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ArrayValue;

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
        public static fromObject(object: { [k: string]: any }): hermes.ArrayValue;

        /**
         * Creates a plain object from an ArrayValue message. Also converts values to other types if specified.
         * @param message ArrayValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ArrayValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IBytesValue {

        /** BytesValue kind */
        kind?: (hermes.NumberKind|null);

        /** BytesValue bigEndian */
        bigEndian?: (boolean|null);

        /** BytesValue value */
        value?: (Uint8Array|null);
    }

    /** Represents a BytesValue. */
    class BytesValue implements IBytesValue {

        /**
         * Constructs a new BytesValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IBytesValue);

        /** BytesValue kind. */
        public kind: hermes.NumberKind;

        /** BytesValue bigEndian. */
        public bigEndian: boolean;

        /** BytesValue value. */
        public value: Uint8Array;

        /**
         * Creates a new BytesValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BytesValue instance
         */
        public static create(properties?: hermes.IBytesValue): hermes.BytesValue;

        /**
         * Encodes the specified BytesValue message. Does not implicitly {@link hermes.BytesValue.verify|verify} messages.
         * @param message BytesValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link hermes.BytesValue.verify|verify} messages.
         * @param message BytesValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BytesValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BytesValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.BytesValue;

        /**
         * Decodes a BytesValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BytesValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.BytesValue;

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
        public static fromObject(object: { [k: string]: any }): hermes.BytesValue;

        /**
         * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
         * @param message BytesValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.BytesValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IEnumValue {

        /** EnumValue raw */
        raw?: (number|Long|null);

        /** EnumValue formatted */
        formatted?: (string|null);
    }

    /** Represents an EnumValue. */
    class EnumValue implements IEnumValue {

        /**
         * Constructs a new EnumValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IEnumValue);

        /** EnumValue raw. */
        public raw: (number|Long);

        /** EnumValue formatted. */
        public formatted: string;

        /**
         * Creates a new EnumValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnumValue instance
         */
        public static create(properties?: hermes.IEnumValue): hermes.EnumValue;

        /**
         * Encodes the specified EnumValue message. Does not implicitly {@link hermes.EnumValue.verify|verify} messages.
         * @param message EnumValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IEnumValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnumValue message, length delimited. Does not implicitly {@link hermes.EnumValue.verify|verify} messages.
         * @param message EnumValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IEnumValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnumValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnumValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.EnumValue;

        /**
         * Decodes an EnumValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnumValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.EnumValue;

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
        public static fromObject(object: { [k: string]: any }): hermes.EnumValue;

        /**
         * Creates a plain object from an EnumValue message. Also converts values to other types if specified.
         * @param message EnumValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.EnumValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IValue {

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
        e?: (hermes.IEnumValue|null);

        /** Value o */
        o?: (hermes.IObjectValue|null);

        /** Value a */
        a?: (hermes.IArrayValue|null);

        /** Value r */
        r?: (hermes.IBytesValue|null);
    }

    /** Represents a Value. */
    class Value implements IValue {

        /**
         * Constructs a new Value.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IValue);

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
        public e?: (hermes.IEnumValue|null);

        /** Value o. */
        public o?: (hermes.IObjectValue|null);

        /** Value a. */
        public a?: (hermes.IArrayValue|null);

        /** Value r. */
        public r?: (hermes.IBytesValue|null);

        /** Value value. */
        public value?: ("i"|"u"|"f"|"b"|"s"|"e"|"o"|"a"|"r");

        /**
         * Creates a new Value instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Value instance
         */
        public static create(properties?: hermes.IValue): hermes.Value;

        /**
         * Encodes the specified Value message. Does not implicitly {@link hermes.Value.verify|verify} messages.
         * @param message Value message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Value message, length delimited. Does not implicitly {@link hermes.Value.verify|verify} messages.
         * @param message Value message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Value message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Value
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Value;

        /**
         * Decodes a Value message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Value
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Value;

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
        public static fromObject(object: { [k: string]: any }): hermes.Value;

        /**
         * Creates a plain object from a Value message. Also converts values to other types if specified.
         * @param message Value
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IParameterDef {

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
        type?: (hermes.IType|null);

        /** ParameterDef metadata */
        metadata?: (string|null);
    }

    /** Represents a ParameterDef. */
    class ParameterDef implements IParameterDef {

        /**
         * Constructs a new ParameterDef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IParameterDef);

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
        public type?: (hermes.IType|null);

        /** ParameterDef metadata. */
        public metadata: string;

        /**
         * Creates a new ParameterDef instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ParameterDef instance
         */
        public static create(properties?: hermes.IParameterDef): hermes.ParameterDef;

        /**
         * Encodes the specified ParameterDef message. Does not implicitly {@link hermes.ParameterDef.verify|verify} messages.
         * @param message ParameterDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IParameterDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ParameterDef message, length delimited. Does not implicitly {@link hermes.ParameterDef.verify|verify} messages.
         * @param message ParameterDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IParameterDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ParameterDef message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ParameterDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ParameterDef;

        /**
         * Decodes a ParameterDef message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ParameterDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ParameterDef;

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
        public static fromObject(object: { [k: string]: any }): hermes.ParameterDef;

        /**
         * Creates a plain object from a ParameterDef message. Also converts values to other types if specified.
         * @param message ParameterDef
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ParameterDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

    /** Properties of a XtceDef. */
    interface IXtceDef {

        /** XtceDef name */
        name?: (string|null);

        /** XtceDef qualifiedName */
        qualifiedName?: (string|null);

        /** XtceDef shortDescription */
        shortDescription?: (string|null);

        /** XtceDef longDescription */
        longDescription?: (string|null);

        /** XtceDef ancillaryData */
        ancillaryData?: ({ [k: string]: string }|null);
    }

    /**
     * Common metadata shared by all XTCE definitions (commands, telemetry, parameters).
     * This is reusable across different XTCE item types.
     */
    class XtceDef implements IXtceDef {

        /**
         * Constructs a new XtceDef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IXtceDef);

        /** XtceDef name. */
        public name: string;

        /** XtceDef qualifiedName. */
        public qualifiedName: string;

        /** XtceDef shortDescription. */
        public shortDescription?: (string|null);

        /** XtceDef longDescription. */
        public longDescription?: (string|null);

        /** XtceDef ancillaryData. */
        public ancillaryData: { [k: string]: string };

        /**
         * Creates a new XtceDef instance using the specified properties.
         * @param [properties] Properties to set
         * @returns XtceDef instance
         */
        public static create(properties?: hermes.IXtceDef): hermes.XtceDef;

        /**
         * Encodes the specified XtceDef message. Does not implicitly {@link hermes.XtceDef.verify|verify} messages.
         * @param message XtceDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IXtceDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified XtceDef message, length delimited. Does not implicitly {@link hermes.XtceDef.verify|verify} messages.
         * @param message XtceDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IXtceDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a XtceDef message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns XtceDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.XtceDef;

        /**
         * Decodes a XtceDef message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns XtceDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.XtceDef;

        /**
         * Verifies a XtceDef message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a XtceDef message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns XtceDef
         */
        public static fromObject(object: { [k: string]: any }): hermes.XtceDef;

        /**
         * Creates a plain object from a XtceDef message. Also converts values to other types if specified.
         * @param message XtceDef
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.XtceDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this XtceDef to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for XtceDef
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CommandDef. */
    interface ICommandDef {

        /** CommandDef def */
        def?: (hermes.IXtceDef|null);

        /** CommandDef abstract */
        abstract?: (boolean|null);

        /** CommandDef arguments */
        "arguments"?: (hermes.IArgumentDef[]|null);

        /** CommandDef transmissionConstraints */
        transmissionConstraints?: (hermes.ITransmissionConstraint[]|null);
    }

    /**
     * XTCE command definition with flattened inheritance structure.
     * This represents a single command that can be sent to the spacecraft.
     */
    class CommandDef implements ICommandDef {

        /**
         * Constructs a new CommandDef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ICommandDef);

        /** CommandDef def. */
        public def?: (hermes.IXtceDef|null);

        /** CommandDef abstract. */
        public abstract: boolean;

        /** CommandDef arguments. */
        public arguments: hermes.IArgumentDef[];

        /** CommandDef transmissionConstraints. */
        public transmissionConstraints: hermes.ITransmissionConstraint[];

        /**
         * Creates a new CommandDef instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommandDef instance
         */
        public static create(properties?: hermes.ICommandDef): hermes.CommandDef;

        /**
         * Encodes the specified CommandDef message. Does not implicitly {@link hermes.CommandDef.verify|verify} messages.
         * @param message CommandDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ICommandDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommandDef message, length delimited. Does not implicitly {@link hermes.CommandDef.verify|verify} messages.
         * @param message CommandDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ICommandDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommandDef message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommandDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.CommandDef;

        /**
         * Decodes a CommandDef message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommandDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.CommandDef;

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
        public static fromObject(object: { [k: string]: any }): hermes.CommandDef;

        /**
         * Creates a plain object from a CommandDef message. Also converts values to other types if specified.
         * @param message CommandDef
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.CommandDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

    /** Properties of an ArgumentDef. */
    interface IArgumentDef {

        /** ArgumentDef def */
        def?: (hermes.IXtceDef|null);

        /** ArgumentDef type */
        type?: (hermes.IType|null);

        /** ArgumentDef initialValue */
        initialValue?: (hermes.IValue|null);
    }

    /**
     * Command argument definition.
     * Arguments are inputs that must be provided when sending the command.
     */
    class ArgumentDef implements IArgumentDef {

        /**
         * Constructs a new ArgumentDef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IArgumentDef);

        /** ArgumentDef def. */
        public def?: (hermes.IXtceDef|null);

        /** ArgumentDef type. */
        public type?: (hermes.IType|null);

        /** ArgumentDef initialValue. */
        public initialValue?: (hermes.IValue|null);

        /**
         * Creates a new ArgumentDef instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ArgumentDef instance
         */
        public static create(properties?: hermes.IArgumentDef): hermes.ArgumentDef;

        /**
         * Encodes the specified ArgumentDef message. Does not implicitly {@link hermes.ArgumentDef.verify|verify} messages.
         * @param message ArgumentDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IArgumentDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ArgumentDef message, length delimited. Does not implicitly {@link hermes.ArgumentDef.verify|verify} messages.
         * @param message ArgumentDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IArgumentDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ArgumentDef message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ArgumentDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ArgumentDef;

        /**
         * Decodes an ArgumentDef message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ArgumentDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ArgumentDef;

        /**
         * Verifies an ArgumentDef message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ArgumentDef message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ArgumentDef
         */
        public static fromObject(object: { [k: string]: any }): hermes.ArgumentDef;

        /**
         * Creates a plain object from an ArgumentDef message. Also converts values to other types if specified.
         * @param message ArgumentDef
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ArgumentDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ArgumentDef to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ArgumentDef
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Comparison operators for constraint checks. */
    enum ComparisonOperator {
        EQUAL = 0,
        NOT_EQUAL = 1,
        LESS_THAN = 2,
        GREATER_THAN = 3,
        LESS_THAN_OR_EQUAL = 4,
        GREATER_THAN_OR_EQUAL = 5
    }

    /** Properties of a ParameterComparison. */
    interface IParameterComparison {

        /** ParameterComparison parameterRef */
        parameterRef?: (string|null);

        /** ParameterComparison operator */
        operator?: (hermes.ComparisonOperator|null);

        /** ParameterComparison value */
        value?: (hermes.IValue|null);
    }

    /**
     * Parameter comparison constraint.
     * Command can only be sent if a telemetry parameter meets a condition.
     * Example: "MotorTemperature" < 80.0 (can't send motor command if too hot)
     */
    class ParameterComparison implements IParameterComparison {

        /**
         * Constructs a new ParameterComparison.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IParameterComparison);

        /** ParameterComparison parameterRef. */
        public parameterRef: string;

        /** ParameterComparison operator. */
        public operator: hermes.ComparisonOperator;

        /** ParameterComparison value. */
        public value?: (hermes.IValue|null);

        /**
         * Creates a new ParameterComparison instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ParameterComparison instance
         */
        public static create(properties?: hermes.IParameterComparison): hermes.ParameterComparison;

        /**
         * Encodes the specified ParameterComparison message. Does not implicitly {@link hermes.ParameterComparison.verify|verify} messages.
         * @param message ParameterComparison message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IParameterComparison, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ParameterComparison message, length delimited. Does not implicitly {@link hermes.ParameterComparison.verify|verify} messages.
         * @param message ParameterComparison message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IParameterComparison, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ParameterComparison message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ParameterComparison
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ParameterComparison;

        /**
         * Decodes a ParameterComparison message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ParameterComparison
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ParameterComparison;

        /**
         * Verifies a ParameterComparison message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ParameterComparison message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ParameterComparison
         */
        public static fromObject(object: { [k: string]: any }): hermes.ParameterComparison;

        /**
         * Creates a plain object from a ParameterComparison message. Also converts values to other types if specified.
         * @param message ParameterComparison
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ParameterComparison, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ParameterComparison to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ParameterComparison
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TimeWindow. */
    interface ITimeWindow {

        /** TimeWindow startTime */
        startTime?: (string|null);

        /** TimeWindow endTime */
        endTime?: (string|null);
    }

    /**
     * Time window constraint.
     * Command can only be sent within a specific time window.
     * Example: Software update commands only allowed during maintenance windows.
     */
    class TimeWindow implements ITimeWindow {

        /**
         * Constructs a new TimeWindow.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ITimeWindow);

        /** TimeWindow startTime. */
        public startTime?: (string|null);

        /** TimeWindow endTime. */
        public endTime?: (string|null);

        /**
         * Creates a new TimeWindow instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TimeWindow instance
         */
        public static create(properties?: hermes.ITimeWindow): hermes.TimeWindow;

        /**
         * Encodes the specified TimeWindow message. Does not implicitly {@link hermes.TimeWindow.verify|verify} messages.
         * @param message TimeWindow message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ITimeWindow, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TimeWindow message, length delimited. Does not implicitly {@link hermes.TimeWindow.verify|verify} messages.
         * @param message TimeWindow message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ITimeWindow, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TimeWindow message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TimeWindow
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.TimeWindow;

        /**
         * Decodes a TimeWindow message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TimeWindow
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.TimeWindow;

        /**
         * Verifies a TimeWindow message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TimeWindow message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TimeWindow
         */
        public static fromObject(object: { [k: string]: any }): hermes.TimeWindow;

        /**
         * Creates a plain object from a TimeWindow message. Also converts values to other types if specified.
         * @param message TimeWindow
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.TimeWindow, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TimeWindow to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TimeWindow
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BooleanExpression. */
    interface IBooleanExpression {

        /** BooleanExpression expression */
        expression?: (string|null);

        /** BooleanExpression description */
        description?: (string|null);
    }

    /**
     * Boolean expression constraint.
     * Logical expression of multiple conditions.
     */
    class BooleanExpression implements IBooleanExpression {

        /**
         * Constructs a new BooleanExpression.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IBooleanExpression);

        /** BooleanExpression expression. */
        public expression: string;

        /** BooleanExpression description. */
        public description: string;

        /**
         * Creates a new BooleanExpression instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BooleanExpression instance
         */
        public static create(properties?: hermes.IBooleanExpression): hermes.BooleanExpression;

        /**
         * Encodes the specified BooleanExpression message. Does not implicitly {@link hermes.BooleanExpression.verify|verify} messages.
         * @param message BooleanExpression message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IBooleanExpression, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BooleanExpression message, length delimited. Does not implicitly {@link hermes.BooleanExpression.verify|verify} messages.
         * @param message BooleanExpression message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IBooleanExpression, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BooleanExpression message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BooleanExpression
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.BooleanExpression;

        /**
         * Decodes a BooleanExpression message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BooleanExpression
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.BooleanExpression;

        /**
         * Verifies a BooleanExpression message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BooleanExpression message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BooleanExpression
         */
        public static fromObject(object: { [k: string]: any }): hermes.BooleanExpression;

        /**
         * Creates a plain object from a BooleanExpression message. Also converts values to other types if specified.
         * @param message BooleanExpression
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.BooleanExpression, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BooleanExpression to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for BooleanExpression
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TransmissionConstraint. */
    interface ITransmissionConstraint {

        /** TransmissionConstraint description */
        description?: (string|null);

        /** TransmissionConstraint parameterComparison */
        parameterComparison?: (hermes.IParameterComparison|null);

        /** TransmissionConstraint timeWindow */
        timeWindow?: (hermes.ITimeWindow|null);

        /** TransmissionConstraint booleanExpression */
        booleanExpression?: (hermes.IBooleanExpression|null);
    }

    /**
     * Transmission constraint from XTCE.
     * These must be satisfied BEFORE sending a command to determine if the
     * command CAN be sent. They validate argument values, system state, and time windows.
     */
    class TransmissionConstraint implements ITransmissionConstraint {

        /**
         * Constructs a new TransmissionConstraint.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ITransmissionConstraint);

        /** TransmissionConstraint description. */
        public description: string;

        /** TransmissionConstraint parameterComparison. */
        public parameterComparison?: (hermes.IParameterComparison|null);

        /** TransmissionConstraint timeWindow. */
        public timeWindow?: (hermes.ITimeWindow|null);

        /** TransmissionConstraint booleanExpression. */
        public booleanExpression?: (hermes.IBooleanExpression|null);

        /** TransmissionConstraint constraint. */
        public constraint?: ("parameterComparison"|"timeWindow"|"booleanExpression");

        /**
         * Creates a new TransmissionConstraint instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransmissionConstraint instance
         */
        public static create(properties?: hermes.ITransmissionConstraint): hermes.TransmissionConstraint;

        /**
         * Encodes the specified TransmissionConstraint message. Does not implicitly {@link hermes.TransmissionConstraint.verify|verify} messages.
         * @param message TransmissionConstraint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ITransmissionConstraint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransmissionConstraint message, length delimited. Does not implicitly {@link hermes.TransmissionConstraint.verify|verify} messages.
         * @param message TransmissionConstraint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ITransmissionConstraint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransmissionConstraint message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransmissionConstraint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.TransmissionConstraint;

        /**
         * Decodes a TransmissionConstraint message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransmissionConstraint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.TransmissionConstraint;

        /**
         * Verifies a TransmissionConstraint message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransmissionConstraint message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransmissionConstraint
         */
        public static fromObject(object: { [k: string]: any }): hermes.TransmissionConstraint;

        /**
         * Creates a plain object from a TransmissionConstraint message. Also converts values to other types if specified.
         * @param message TransmissionConstraint
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.TransmissionConstraint, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransmissionConstraint to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TransmissionConstraint
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** EvrSeverity enum. */
    enum EvrSeverity {
        EVR_DIAGNOSTIC = 0,
        EVR_ACTIVITY_LOW = 1,
        EVR_ACTIVITY_HIGH = 2,
        EVR_WARNING_LOW = 3,
        EVR_WARNING_HIGH = 4,
        EVR_COMMAND = 5,
        EVR_FATAL = 6
    }

    /** FormatSpecifierType enum. */
    enum FormatSpecifierType {
        FMT_DEFAULT = 0,
        FMT_CHAR = 1,
        FMT_DECIMAL = 2,
        FMT_HEX_LOWER = 3,
        FMT_HEX_UPPER = 4,
        FMT_OCTAL = 5,
        FMT_EXP_LOWER = 6,
        FMT_EXP_UPPER = 7,
        FMT_FIXED_LOWER = 8,
        FMT_FIXED_UPPER = 9,
        FMT_GENERAL_LOWER = 10,
        FMT_GENERAL_UPPER = 11
    }

    /** Properties of a FormatSpecifier. */
    interface IFormatSpecifier {

        /** FormatSpecifier type */
        type?: (hermes.FormatSpecifierType|null);

        /** FormatSpecifier precision */
        precision?: (number|null);

        /** FormatSpecifier argumentIndex */
        argumentIndex?: (number|null);
    }

    /** Represents a FormatSpecifier. */
    class FormatSpecifier implements IFormatSpecifier {

        /**
         * Constructs a new FormatSpecifier.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFormatSpecifier);

        /** FormatSpecifier type. */
        public type: hermes.FormatSpecifierType;

        /** FormatSpecifier precision. */
        public precision?: (number|null);

        /** FormatSpecifier argumentIndex. */
        public argumentIndex: number;

        /**
         * Creates a new FormatSpecifier instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FormatSpecifier instance
         */
        public static create(properties?: hermes.IFormatSpecifier): hermes.FormatSpecifier;

        /**
         * Encodes the specified FormatSpecifier message. Does not implicitly {@link hermes.FormatSpecifier.verify|verify} messages.
         * @param message FormatSpecifier message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFormatSpecifier, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FormatSpecifier message, length delimited. Does not implicitly {@link hermes.FormatSpecifier.verify|verify} messages.
         * @param message FormatSpecifier message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFormatSpecifier, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FormatSpecifier message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FormatSpecifier
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FormatSpecifier;

        /**
         * Decodes a FormatSpecifier message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FormatSpecifier
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FormatSpecifier;

        /**
         * Verifies a FormatSpecifier message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FormatSpecifier message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FormatSpecifier
         */
        public static fromObject(object: { [k: string]: any }): hermes.FormatSpecifier;

        /**
         * Creates a plain object from a FormatSpecifier message. Also converts values to other types if specified.
         * @param message FormatSpecifier
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FormatSpecifier, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FormatSpecifier to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FormatSpecifier
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FormatFragment. */
    interface IFormatFragment {

        /** FormatFragment text */
        text?: (string|null);

        /** FormatFragment specifier */
        specifier?: (hermes.IFormatSpecifier|null);
    }

    /** Represents a FormatFragment. */
    class FormatFragment implements IFormatFragment {

        /**
         * Constructs a new FormatFragment.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFormatFragment);

        /** FormatFragment text. */
        public text?: (string|null);

        /** FormatFragment specifier. */
        public specifier?: (hermes.IFormatSpecifier|null);

        /** FormatFragment fragment. */
        public fragment?: ("text"|"specifier");

        /**
         * Creates a new FormatFragment instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FormatFragment instance
         */
        public static create(properties?: hermes.IFormatFragment): hermes.FormatFragment;

        /**
         * Encodes the specified FormatFragment message. Does not implicitly {@link hermes.FormatFragment.verify|verify} messages.
         * @param message FormatFragment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFormatFragment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FormatFragment message, length delimited. Does not implicitly {@link hermes.FormatFragment.verify|verify} messages.
         * @param message FormatFragment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFormatFragment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FormatFragment message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FormatFragment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FormatFragment;

        /**
         * Decodes a FormatFragment message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FormatFragment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FormatFragment;

        /**
         * Verifies a FormatFragment message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FormatFragment message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FormatFragment
         */
        public static fromObject(object: { [k: string]: any }): hermes.FormatFragment;

        /**
         * Creates a plain object from a FormatFragment message. Also converts values to other types if specified.
         * @param message FormatFragment
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FormatFragment, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FormatFragment to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FormatFragment
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FormatString. */
    interface IFormatString {

        /** FormatString fragments */
        fragments?: (hermes.IFormatFragment[]|null);

        /** FormatString original */
        original?: (string|null);
    }

    /** Represents a FormatString. */
    class FormatString implements IFormatString {

        /**
         * Constructs a new FormatString.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFormatString);

        /** FormatString fragments. */
        public fragments: hermes.IFormatFragment[];

        /** FormatString original. */
        public original: string;

        /**
         * Creates a new FormatString instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FormatString instance
         */
        public static create(properties?: hermes.IFormatString): hermes.FormatString;

        /**
         * Encodes the specified FormatString message. Does not implicitly {@link hermes.FormatString.verify|verify} messages.
         * @param message FormatString message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFormatString, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FormatString message, length delimited. Does not implicitly {@link hermes.FormatString.verify|verify} messages.
         * @param message FormatString message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFormatString, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FormatString message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FormatString
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FormatString;

        /**
         * Decodes a FormatString message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FormatString
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FormatString;

        /**
         * Verifies a FormatString message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FormatString message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FormatString
         */
        public static fromObject(object: { [k: string]: any }): hermes.FormatString;

        /**
         * Creates a plain object from a FormatString message. Also converts values to other types if specified.
         * @param message FormatString
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FormatString, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FormatString to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FormatString
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EventDef. */
    interface IEventDef {

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
        severity?: (hermes.EvrSeverity|null);

        /**
         * DEPRECATED: Use format instead
         * printf format string that will be formatted via sprintf
         */
        formatString?: (string|null);

        /** Arguments used inside the format string */
        "arguments"?: (hermes.IField[]|null);

        /** EventDef metadata */
        metadata?: (string|null);

        /** Structured format string with parsed fragments */
        format?: (hermes.IFormatString|null);
    }

    /** Represents an EventDef. */
    class EventDef implements IEventDef {

        /**
         * Constructs a new EventDef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IEventDef);

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
        public severity: hermes.EvrSeverity;

        /**
         * DEPRECATED: Use format instead
         * printf format string that will be formatted via sprintf
         */
        public formatString: string;

        /** Arguments used inside the format string */
        public arguments: hermes.IField[];

        /** EventDef metadata. */
        public metadata: string;

        /** Structured format string with parsed fragments */
        public format?: (hermes.IFormatString|null);

        /**
         * Creates a new EventDef instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventDef instance
         */
        public static create(properties?: hermes.IEventDef): hermes.EventDef;

        /**
         * Encodes the specified EventDef message. Does not implicitly {@link hermes.EventDef.verify|verify} messages.
         * @param message EventDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IEventDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventDef message, length delimited. Does not implicitly {@link hermes.EventDef.verify|verify} messages.
         * @param message EventDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IEventDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventDef message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.EventDef;

        /**
         * Decodes an EventDef message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.EventDef;

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
        public static fromObject(object: { [k: string]: any }): hermes.EventDef;

        /**
         * Creates a plain object from an EventDef message. Also converts values to other types if specified.
         * @param message EventDef
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.EventDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IEventRef {

        /** EventRef id */
        id?: (number|null);

        /** EventRef name */
        name?: (string|null);

        /** EventRef component */
        component?: (string|null);

        /** EventRef severity */
        severity?: (hermes.EvrSeverity|null);

        /** EventRef arguments */
        "arguments"?: (string[]|null);

        /** EventRef dictionary */
        dictionary?: (string|null);
    }

    /** Represents an EventRef. */
    class EventRef implements IEventRef {

        /**
         * Constructs a new EventRef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IEventRef);

        /** EventRef id. */
        public id: number;

        /** EventRef name. */
        public name: string;

        /** EventRef component. */
        public component: string;

        /** EventRef severity. */
        public severity: hermes.EvrSeverity;

        /** EventRef arguments. */
        public arguments: string[];

        /** EventRef dictionary. */
        public dictionary: string;

        /**
         * Creates a new EventRef instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventRef instance
         */
        public static create(properties?: hermes.IEventRef): hermes.EventRef;

        /**
         * Encodes the specified EventRef message. Does not implicitly {@link hermes.EventRef.verify|verify} messages.
         * @param message EventRef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IEventRef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventRef message, length delimited. Does not implicitly {@link hermes.EventRef.verify|verify} messages.
         * @param message EventRef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IEventRef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventRef message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventRef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.EventRef;

        /**
         * Decodes an EventRef message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventRef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.EventRef;

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
        public static fromObject(object: { [k: string]: any }): hermes.EventRef;

        /**
         * Creates a plain object from an EventRef message. Also converts values to other types if specified.
         * @param message EventRef
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.EventRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ITelemetryDef {

        /** Raw ID used for identifying incoming serialized telemetry */
        id?: (number|null);

        /** Telemetry name */
        name?: (string|null);

        /** Component or module that owns this telemetry */
        component?: (string|null);

        /** Serialization type */
        type?: (hermes.IType|null);

        /** TelemetryDef metadata */
        metadata?: (string|null);
    }

    /** Represents a TelemetryDef. */
    class TelemetryDef implements ITelemetryDef {

        /**
         * Constructs a new TelemetryDef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ITelemetryDef);

        /** Raw ID used for identifying incoming serialized telemetry */
        public id: number;

        /** Telemetry name */
        public name: string;

        /** Component or module that owns this telemetry */
        public component: string;

        /** Serialization type */
        public type?: (hermes.IType|null);

        /** TelemetryDef metadata. */
        public metadata: string;

        /**
         * Creates a new TelemetryDef instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TelemetryDef instance
         */
        public static create(properties?: hermes.ITelemetryDef): hermes.TelemetryDef;

        /**
         * Encodes the specified TelemetryDef message. Does not implicitly {@link hermes.TelemetryDef.verify|verify} messages.
         * @param message TelemetryDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ITelemetryDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TelemetryDef message, length delimited. Does not implicitly {@link hermes.TelemetryDef.verify|verify} messages.
         * @param message TelemetryDef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ITelemetryDef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TelemetryDef message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TelemetryDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.TelemetryDef;

        /**
         * Decodes a TelemetryDef message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TelemetryDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.TelemetryDef;

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
        public static fromObject(object: { [k: string]: any }): hermes.TelemetryDef;

        /**
         * Creates a plain object from a TelemetryDef message. Also converts values to other types if specified.
         * @param message TelemetryDef
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.TelemetryDef, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ITelemetryRef {

        /** TelemetryRef instanceId */
        instanceId?: (string|null);

        /** TelemetryRef qualifiedName */
        qualifiedName?: (string|null);
    }

    /** Represents a TelemetryRef. */
    class TelemetryRef implements ITelemetryRef {

        /**
         * Constructs a new TelemetryRef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ITelemetryRef);

        /** TelemetryRef instanceId. */
        public instanceId: string;

        /** TelemetryRef qualifiedName. */
        public qualifiedName: string;

        /**
         * Creates a new TelemetryRef instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TelemetryRef instance
         */
        public static create(properties?: hermes.ITelemetryRef): hermes.TelemetryRef;

        /**
         * Encodes the specified TelemetryRef message. Does not implicitly {@link hermes.TelemetryRef.verify|verify} messages.
         * @param message TelemetryRef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ITelemetryRef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TelemetryRef message, length delimited. Does not implicitly {@link hermes.TelemetryRef.verify|verify} messages.
         * @param message TelemetryRef message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ITelemetryRef, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TelemetryRef message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TelemetryRef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.TelemetryRef;

        /**
         * Decodes a TelemetryRef message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TelemetryRef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.TelemetryRef;

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
        public static fromObject(object: { [k: string]: any }): hermes.TelemetryRef;

        /**
         * Creates a plain object from a TelemetryRef message. Also converts values to other types if specified.
         * @param message TelemetryRef
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.TelemetryRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IDictionaryHead {

        /**
         * Type associated with the Fsw.type
         * This will filter the user's selection
         * of dictionaries that can be tracked.
         *
         * This is set by the provider.
         */
        type?: (string|null);

        /** DictionaryHead name */
        name?: (string|null);

        /** DictionaryHead version */
        version?: (string|null);
    }

    /** Represents a DictionaryHead. */
    class DictionaryHead implements IDictionaryHead {

        /**
         * Constructs a new DictionaryHead.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IDictionaryHead);

        /**
         * Type associated with the Fsw.type
         * This will filter the user's selection
         * of dictionaries that can be tracked.
         *
         * This is set by the provider.
         */
        public type: string;

        /** DictionaryHead name. */
        public name: string;

        /** DictionaryHead version. */
        public version: string;

        /**
         * Creates a new DictionaryHead instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DictionaryHead instance
         */
        public static create(properties?: hermes.IDictionaryHead): hermes.DictionaryHead;

        /**
         * Encodes the specified DictionaryHead message. Does not implicitly {@link hermes.DictionaryHead.verify|verify} messages.
         * @param message DictionaryHead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IDictionaryHead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DictionaryHead message, length delimited. Does not implicitly {@link hermes.DictionaryHead.verify|verify} messages.
         * @param message DictionaryHead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IDictionaryHead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DictionaryHead message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DictionaryHead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.DictionaryHead;

        /**
         * Decodes a DictionaryHead message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DictionaryHead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.DictionaryHead;

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
        public static fromObject(object: { [k: string]: any }): hermes.DictionaryHead;

        /**
         * Creates a plain object from a DictionaryHead message. Also converts values to other types if specified.
         * @param message DictionaryHead
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.DictionaryHead, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IDictionaryNamespace {

        /** DictionaryNamespace commands */
        commands?: ({ [k: string]: hermes.ICommandDef }|null);

        /** DictionaryNamespace events */
        events?: ({ [k: string]: hermes.IEventDef }|null);

        /** DictionaryNamespace telemetry */
        telemetry?: ({ [k: string]: hermes.ITelemetryDef }|null);

        /** DictionaryNamespace parameters */
        parameters?: ({ [k: string]: hermes.IParameterDef }|null);

        /** DictionaryNamespace types */
        types?: ({ [k: string]: hermes.IType }|null);
    }

    /** Represents a DictionaryNamespace. */
    class DictionaryNamespace implements IDictionaryNamespace {

        /**
         * Constructs a new DictionaryNamespace.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IDictionaryNamespace);

        /** DictionaryNamespace commands. */
        public commands: { [k: string]: hermes.ICommandDef };

        /** DictionaryNamespace events. */
        public events: { [k: string]: hermes.IEventDef };

        /** DictionaryNamespace telemetry. */
        public telemetry: { [k: string]: hermes.ITelemetryDef };

        /** DictionaryNamespace parameters. */
        public parameters: { [k: string]: hermes.IParameterDef };

        /** DictionaryNamespace types. */
        public types: { [k: string]: hermes.IType };

        /**
         * Creates a new DictionaryNamespace instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DictionaryNamespace instance
         */
        public static create(properties?: hermes.IDictionaryNamespace): hermes.DictionaryNamespace;

        /**
         * Encodes the specified DictionaryNamespace message. Does not implicitly {@link hermes.DictionaryNamespace.verify|verify} messages.
         * @param message DictionaryNamespace message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IDictionaryNamespace, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DictionaryNamespace message, length delimited. Does not implicitly {@link hermes.DictionaryNamespace.verify|verify} messages.
         * @param message DictionaryNamespace message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IDictionaryNamespace, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DictionaryNamespace message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DictionaryNamespace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.DictionaryNamespace;

        /**
         * Decodes a DictionaryNamespace message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DictionaryNamespace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.DictionaryNamespace;

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
        public static fromObject(object: { [k: string]: any }): hermes.DictionaryNamespace;

        /**
         * Creates a plain object from a DictionaryNamespace message. Also converts values to other types if specified.
         * @param message DictionaryNamespace
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.DictionaryNamespace, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IDictionary {

        /** Dictionary head */
        head?: (hermes.IDictionaryHead|null);

        /** Dictionary content */
        content?: ({ [k: string]: hermes.IDictionaryNamespace }|null);

        /** Dictionary metadata */
        metadata?: ({ [k: string]: string }|null);

        /** Dictionary id */
        id?: (string|null);
    }

    /** Represents a Dictionary. */
    class Dictionary implements IDictionary {

        /**
         * Constructs a new Dictionary.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IDictionary);

        /** Dictionary head. */
        public head?: (hermes.IDictionaryHead|null);

        /** Dictionary content. */
        public content: { [k: string]: hermes.IDictionaryNamespace };

        /** Dictionary metadata. */
        public metadata: { [k: string]: string };

        /** Dictionary id. */
        public id: string;

        /**
         * Creates a new Dictionary instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Dictionary instance
         */
        public static create(properties?: hermes.IDictionary): hermes.Dictionary;

        /**
         * Encodes the specified Dictionary message. Does not implicitly {@link hermes.Dictionary.verify|verify} messages.
         * @param message Dictionary message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IDictionary, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Dictionary message, length delimited. Does not implicitly {@link hermes.Dictionary.verify|verify} messages.
         * @param message Dictionary message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IDictionary, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Dictionary message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Dictionary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Dictionary;

        /**
         * Decodes a Dictionary message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Dictionary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Dictionary;

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
        public static fromObject(object: { [k: string]: any }): hermes.Dictionary;

        /**
         * Creates a plain object from a Dictionary message. Also converts values to other types if specified.
         * @param message Dictionary
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Dictionary, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ITime {

        /** Time unix */
        unix?: (google.protobuf.ITimestamp|null);

        /** Time sclk */
        sclk?: (number|null);
    }

    /** Represents a Time. */
    class Time implements ITime {

        /**
         * Constructs a new Time.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ITime);

        /** Time unix. */
        public unix?: (google.protobuf.ITimestamp|null);

        /** Time sclk. */
        public sclk: number;

        /**
         * Creates a new Time instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Time instance
         */
        public static create(properties?: hermes.ITime): hermes.Time;

        /**
         * Encodes the specified Time message. Does not implicitly {@link hermes.Time.verify|verify} messages.
         * @param message Time message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ITime, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Time message, length delimited. Does not implicitly {@link hermes.Time.verify|verify} messages.
         * @param message Time message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ITime, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Time message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Time;

        /**
         * Decodes a Time message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Time;

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
        public static fromObject(object: { [k: string]: any }): hermes.Time;

        /**
         * Creates a plain object from a Time message. Also converts values to other types if specified.
         * @param message Time
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Time, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFileHeader {

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
    class FileHeader implements IFileHeader {

        /**
         * Constructs a new FileHeader.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFileHeader);

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
        public static create(properties?: hermes.IFileHeader): hermes.FileHeader;

        /**
         * Encodes the specified FileHeader message. Does not implicitly {@link hermes.FileHeader.verify|verify} messages.
         * @param message FileHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFileHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FileHeader message, length delimited. Does not implicitly {@link hermes.FileHeader.verify|verify} messages.
         * @param message FileHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFileHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FileHeader message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FileHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FileHeader;

        /**
         * Decodes a FileHeader message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FileHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FileHeader;

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
        public static fromObject(object: { [k: string]: any }): hermes.FileHeader;

        /**
         * Creates a plain object from a FileHeader message. Also converts values to other types if specified.
         * @param message FileHeader
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FileHeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IUplinkFileChunk {

        /** UplinkFileChunk header */
        header?: (hermes.IFileHeader|null);

        /** UplinkFileChunk data */
        data?: (Uint8Array|null);
    }

    /** Represents an UplinkFileChunk. */
    class UplinkFileChunk implements IUplinkFileChunk {

        /**
         * Constructs a new UplinkFileChunk.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IUplinkFileChunk);

        /** UplinkFileChunk header. */
        public header?: (hermes.IFileHeader|null);

        /** UplinkFileChunk data. */
        public data?: (Uint8Array|null);

        /** UplinkFileChunk value. */
        public value?: ("header"|"data");

        /**
         * Creates a new UplinkFileChunk instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UplinkFileChunk instance
         */
        public static create(properties?: hermes.IUplinkFileChunk): hermes.UplinkFileChunk;

        /**
         * Encodes the specified UplinkFileChunk message. Does not implicitly {@link hermes.UplinkFileChunk.verify|verify} messages.
         * @param message UplinkFileChunk message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IUplinkFileChunk, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UplinkFileChunk message, length delimited. Does not implicitly {@link hermes.UplinkFileChunk.verify|verify} messages.
         * @param message UplinkFileChunk message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IUplinkFileChunk, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UplinkFileChunk message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UplinkFileChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.UplinkFileChunk;

        /**
         * Decodes an UplinkFileChunk message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UplinkFileChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.UplinkFileChunk;

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
        public static fromObject(object: { [k: string]: any }): hermes.UplinkFileChunk;

        /**
         * Creates a plain object from an UplinkFileChunk message. Also converts values to other types if specified.
         * @param message UplinkFileChunk
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.UplinkFileChunk, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IDownlinkFileData {

        /** DownlinkFileData offset */
        offset?: (number|Long|null);

        /** DownlinkFileData data */
        data?: (Uint8Array|null);

        /** DownlinkFileData md */
        md?: ({ [k: string]: string }|null);
    }

    /** Represents a DownlinkFileData. */
    class DownlinkFileData implements IDownlinkFileData {

        /**
         * Constructs a new DownlinkFileData.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IDownlinkFileData);

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
        public static create(properties?: hermes.IDownlinkFileData): hermes.DownlinkFileData;

        /**
         * Encodes the specified DownlinkFileData message. Does not implicitly {@link hermes.DownlinkFileData.verify|verify} messages.
         * @param message DownlinkFileData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IDownlinkFileData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DownlinkFileData message, length delimited. Does not implicitly {@link hermes.DownlinkFileData.verify|verify} messages.
         * @param message DownlinkFileData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IDownlinkFileData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DownlinkFileData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DownlinkFileData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.DownlinkFileData;

        /**
         * Decodes a DownlinkFileData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DownlinkFileData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.DownlinkFileData;

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
        public static fromObject(object: { [k: string]: any }): hermes.DownlinkFileData;

        /**
         * Creates a plain object from a DownlinkFileData message. Also converts values to other types if specified.
         * @param message DownlinkFileData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.DownlinkFileData, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IDownlinkFileMetadata {

        /** DownlinkFileMetadata key */
        key?: (string|null);

        /** DownlinkFileMetadata data */
        data?: (Uint8Array|null);
    }

    /** Represents a DownlinkFileMetadata. */
    class DownlinkFileMetadata implements IDownlinkFileMetadata {

        /**
         * Constructs a new DownlinkFileMetadata.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IDownlinkFileMetadata);

        /** DownlinkFileMetadata key. */
        public key: string;

        /** DownlinkFileMetadata data. */
        public data: Uint8Array;

        /**
         * Creates a new DownlinkFileMetadata instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DownlinkFileMetadata instance
         */
        public static create(properties?: hermes.IDownlinkFileMetadata): hermes.DownlinkFileMetadata;

        /**
         * Encodes the specified DownlinkFileMetadata message. Does not implicitly {@link hermes.DownlinkFileMetadata.verify|verify} messages.
         * @param message DownlinkFileMetadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IDownlinkFileMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DownlinkFileMetadata message, length delimited. Does not implicitly {@link hermes.DownlinkFileMetadata.verify|verify} messages.
         * @param message DownlinkFileMetadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IDownlinkFileMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DownlinkFileMetadata message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DownlinkFileMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.DownlinkFileMetadata;

        /**
         * Decodes a DownlinkFileMetadata message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DownlinkFileMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.DownlinkFileMetadata;

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
        public static fromObject(object: { [k: string]: any }): hermes.DownlinkFileMetadata;

        /**
         * Creates a plain object from a DownlinkFileMetadata message. Also converts values to other types if specified.
         * @param message DownlinkFileMetadata
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.DownlinkFileMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IDownlinkFileValidation {
    }

    /** Represents a DownlinkFileValidation. */
    class DownlinkFileValidation implements IDownlinkFileValidation {

        /**
         * Constructs a new DownlinkFileValidation.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IDownlinkFileValidation);

        /**
         * Creates a new DownlinkFileValidation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DownlinkFileValidation instance
         */
        public static create(properties?: hermes.IDownlinkFileValidation): hermes.DownlinkFileValidation;

        /**
         * Encodes the specified DownlinkFileValidation message. Does not implicitly {@link hermes.DownlinkFileValidation.verify|verify} messages.
         * @param message DownlinkFileValidation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IDownlinkFileValidation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DownlinkFileValidation message, length delimited. Does not implicitly {@link hermes.DownlinkFileValidation.verify|verify} messages.
         * @param message DownlinkFileValidation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IDownlinkFileValidation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DownlinkFileValidation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DownlinkFileValidation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.DownlinkFileValidation;

        /**
         * Decodes a DownlinkFileValidation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DownlinkFileValidation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.DownlinkFileValidation;

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
        public static fromObject(object: { [k: string]: any }): hermes.DownlinkFileValidation;

        /**
         * Creates a plain object from a DownlinkFileValidation message. Also converts values to other types if specified.
         * @param message DownlinkFileValidation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.DownlinkFileValidation, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IDownlinkFileChunk {

        /** DownlinkFileChunk header */
        header?: (hermes.IFileHeader|null);

        /** DownlinkFileChunk data */
        data?: (hermes.IDownlinkFileData|null);

        /** DownlinkFileChunk metadata */
        metadata?: (hermes.IDownlinkFileMetadata|null);

        /** DownlinkFileChunk validation */
        validation?: (hermes.IDownlinkFileValidation|null);
    }

    /** Represents a DownlinkFileChunk. */
    class DownlinkFileChunk implements IDownlinkFileChunk {

        /**
         * Constructs a new DownlinkFileChunk.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IDownlinkFileChunk);

        /** DownlinkFileChunk header. */
        public header?: (hermes.IFileHeader|null);

        /** DownlinkFileChunk data. */
        public data?: (hermes.IDownlinkFileData|null);

        /** DownlinkFileChunk metadata. */
        public metadata?: (hermes.IDownlinkFileMetadata|null);

        /** DownlinkFileChunk validation. */
        public validation?: (hermes.IDownlinkFileValidation|null);

        /** DownlinkFileChunk value. */
        public value?: ("header"|"data"|"metadata"|"validation");

        /**
         * Creates a new DownlinkFileChunk instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DownlinkFileChunk instance
         */
        public static create(properties?: hermes.IDownlinkFileChunk): hermes.DownlinkFileChunk;

        /**
         * Encodes the specified DownlinkFileChunk message. Does not implicitly {@link hermes.DownlinkFileChunk.verify|verify} messages.
         * @param message DownlinkFileChunk message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IDownlinkFileChunk, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DownlinkFileChunk message, length delimited. Does not implicitly {@link hermes.DownlinkFileChunk.verify|verify} messages.
         * @param message DownlinkFileChunk message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IDownlinkFileChunk, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DownlinkFileChunk message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DownlinkFileChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.DownlinkFileChunk;

        /**
         * Decodes a DownlinkFileChunk message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DownlinkFileChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.DownlinkFileChunk;

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
        public static fromObject(object: { [k: string]: any }): hermes.DownlinkFileChunk;

        /**
         * Creates a plain object from a DownlinkFileChunk message. Also converts values to other types if specified.
         * @param message DownlinkFileChunk
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.DownlinkFileChunk, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    enum FswCapability {
        COMMAND = 0,
        PARSE_COMMAND = 1,
        SEQUENCE = 2,
        PARSE_SEQUENCE = 3,
        FILE = 4,
        REQUEST = 5
    }

    /** Properties of a Fsw. */
    interface IFsw {

        /** Fsw id */
        id?: (string|null);

        /** Fsw type */
        type?: (string|null);

        /** Fsw profileId */
        profileId?: (string|null);

        /** Fsw forwards */
        forwards?: (string[]|null);

        /** Fsw capabilities */
        capabilities?: (hermes.FswCapability[]|null);

        /** Fsw dictionary */
        dictionary?: (string|null);
    }

    /** Represents a Fsw. */
    class Fsw implements IFsw {

        /**
         * Constructs a new Fsw.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFsw);

        /** Fsw id. */
        public id: string;

        /** Fsw type. */
        public type: string;

        /** Fsw profileId. */
        public profileId: string;

        /** Fsw forwards. */
        public forwards: string[];

        /** Fsw capabilities. */
        public capabilities: hermes.FswCapability[];

        /** Fsw dictionary. */
        public dictionary: string;

        /**
         * Creates a new Fsw instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Fsw instance
         */
        public static create(properties?: hermes.IFsw): hermes.Fsw;

        /**
         * Encodes the specified Fsw message. Does not implicitly {@link hermes.Fsw.verify|verify} messages.
         * @param message Fsw message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFsw, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Fsw message, length delimited. Does not implicitly {@link hermes.Fsw.verify|verify} messages.
         * @param message Fsw message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFsw, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Fsw message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Fsw
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Fsw;

        /**
         * Decodes a Fsw message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Fsw
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Fsw;

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
        public static fromObject(object: { [k: string]: any }): hermes.Fsw;

        /**
         * Creates a plain object from a Fsw message. Also converts values to other types if specified.
         * @param message Fsw
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Fsw, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ICommandOptions {

        /**
         * Don't wait for the command to reply before resolving the command promise
         * This promise will resolve once the command is sent to the FSW.
         */
        noWait?: (boolean|null);
    }

    /** Represents a CommandOptions. */
    class CommandOptions implements ICommandOptions {

        /**
         * Constructs a new CommandOptions.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ICommandOptions);

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
        public static create(properties?: hermes.ICommandOptions): hermes.CommandOptions;

        /**
         * Encodes the specified CommandOptions message. Does not implicitly {@link hermes.CommandOptions.verify|verify} messages.
         * @param message CommandOptions message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ICommandOptions, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommandOptions message, length delimited. Does not implicitly {@link hermes.CommandOptions.verify|verify} messages.
         * @param message CommandOptions message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ICommandOptions, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommandOptions message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommandOptions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.CommandOptions;

        /**
         * Decodes a CommandOptions message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommandOptions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.CommandOptions;

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
        public static fromObject(object: { [k: string]: any }): hermes.CommandOptions;

        /**
         * Creates a plain object from a CommandOptions message. Also converts values to other types if specified.
         * @param message CommandOptions
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.CommandOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ICommandValue {

        /** CommandValue def */
        def?: (hermes.ICommandDef|null);

        /** CommandValue args */
        args?: (hermes.IValue[]|null);

        /** CommandValue options */
        options?: (hermes.ICommandOptions|null);

        /** CommandValue metadata */
        metadata?: ({ [k: string]: string }|null);
    }

    /** Represents a CommandValue. */
    class CommandValue implements ICommandValue {

        /**
         * Constructs a new CommandValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ICommandValue);

        /** CommandValue def. */
        public def?: (hermes.ICommandDef|null);

        /** CommandValue args. */
        public args: hermes.IValue[];

        /** CommandValue options. */
        public options?: (hermes.ICommandOptions|null);

        /** CommandValue metadata. */
        public metadata: { [k: string]: string };

        /**
         * Creates a new CommandValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommandValue instance
         */
        public static create(properties?: hermes.ICommandValue): hermes.CommandValue;

        /**
         * Encodes the specified CommandValue message. Does not implicitly {@link hermes.CommandValue.verify|verify} messages.
         * @param message CommandValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ICommandValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommandValue message, length delimited. Does not implicitly {@link hermes.CommandValue.verify|verify} messages.
         * @param message CommandValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ICommandValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommandValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommandValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.CommandValue;

        /**
         * Decodes a CommandValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommandValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.CommandValue;

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
        public static fromObject(object: { [k: string]: any }): hermes.CommandValue;

        /**
         * Creates a plain object from a CommandValue message. Also converts values to other types if specified.
         * @param message CommandValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.CommandValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IRawCommandValue {

        /** RawCommandValue command */
        command?: (string|null);

        /** RawCommandValue options */
        options?: (hermes.ICommandOptions|null);

        /** RawCommandValue metadata */
        metadata?: ({ [k: string]: string }|null);
    }

    /**
     * RawCommandValue is meant for commanding FSWs from clients that do not parse
     * the dictionary and command fully. This is useful for thin clients that will
     * rely on the backend to perform type checks.
     */
    class RawCommandValue implements IRawCommandValue {

        /**
         * Constructs a new RawCommandValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IRawCommandValue);

        /** RawCommandValue command. */
        public command: string;

        /** RawCommandValue options. */
        public options?: (hermes.ICommandOptions|null);

        /** RawCommandValue metadata. */
        public metadata: { [k: string]: string };

        /**
         * Creates a new RawCommandValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RawCommandValue instance
         */
        public static create(properties?: hermes.IRawCommandValue): hermes.RawCommandValue;

        /**
         * Encodes the specified RawCommandValue message. Does not implicitly {@link hermes.RawCommandValue.verify|verify} messages.
         * @param message RawCommandValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IRawCommandValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RawCommandValue message, length delimited. Does not implicitly {@link hermes.RawCommandValue.verify|verify} messages.
         * @param message RawCommandValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IRawCommandValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RawCommandValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RawCommandValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.RawCommandValue;

        /**
         * Decodes a RawCommandValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RawCommandValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.RawCommandValue;

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
        public static fromObject(object: { [k: string]: any }): hermes.RawCommandValue;

        /**
         * Creates a plain object from a RawCommandValue message. Also converts values to other types if specified.
         * @param message RawCommandValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.RawCommandValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ICommandSequence {

        /** CommandSequence commands */
        commands?: (hermes.ICommandValue[]|null);

        /** CommandSequence languageName */
        languageName?: (string|null);

        /** CommandSequence metadata */
        metadata?: ({ [k: string]: string }|null);
    }

    /** Represents a CommandSequence. */
    class CommandSequence implements ICommandSequence {

        /**
         * Constructs a new CommandSequence.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ICommandSequence);

        /** CommandSequence commands. */
        public commands: hermes.ICommandValue[];

        /** CommandSequence languageName. */
        public languageName: string;

        /** CommandSequence metadata. */
        public metadata: { [k: string]: string };

        /**
         * Creates a new CommandSequence instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommandSequence instance
         */
        public static create(properties?: hermes.ICommandSequence): hermes.CommandSequence;

        /**
         * Encodes the specified CommandSequence message. Does not implicitly {@link hermes.CommandSequence.verify|verify} messages.
         * @param message CommandSequence message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ICommandSequence, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommandSequence message, length delimited. Does not implicitly {@link hermes.CommandSequence.verify|verify} messages.
         * @param message CommandSequence message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ICommandSequence, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommandSequence message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommandSequence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.CommandSequence;

        /**
         * Decodes a CommandSequence message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommandSequence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.CommandSequence;

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
        public static fromObject(object: { [k: string]: any }): hermes.CommandSequence;

        /**
         * Creates a plain object from a CommandSequence message. Also converts values to other types if specified.
         * @param message CommandSequence
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.CommandSequence, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IRawCommandSequence {

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
    class RawCommandSequence implements IRawCommandSequence {

        /**
         * Constructs a new RawCommandSequence.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IRawCommandSequence);

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
        public static create(properties?: hermes.IRawCommandSequence): hermes.RawCommandSequence;

        /**
         * Encodes the specified RawCommandSequence message. Does not implicitly {@link hermes.RawCommandSequence.verify|verify} messages.
         * @param message RawCommandSequence message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IRawCommandSequence, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RawCommandSequence message, length delimited. Does not implicitly {@link hermes.RawCommandSequence.verify|verify} messages.
         * @param message RawCommandSequence message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IRawCommandSequence, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RawCommandSequence message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RawCommandSequence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.RawCommandSequence;

        /**
         * Decodes a RawCommandSequence message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RawCommandSequence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.RawCommandSequence;

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
        public static fromObject(object: { [k: string]: any }): hermes.RawCommandSequence;

        /**
         * Creates a plain object from a RawCommandSequence message. Also converts values to other types if specified.
         * @param message RawCommandSequence
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.RawCommandSequence, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IRequestValue {

        /** RequestValue kind */
        kind?: (string|null);

        /** RequestValue data */
        data?: (Uint8Array|null);
    }

    /**
     * FSW Requests are non-dictionary defined items. These are connection
     * specific commands meant to be exposed by custom UI in the frontend.
     */
    class RequestValue implements IRequestValue {

        /**
         * Constructs a new RequestValue.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IRequestValue);

        /** RequestValue kind. */
        public kind: string;

        /** RequestValue data. */
        public data: Uint8Array;

        /**
         * Creates a new RequestValue instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RequestValue instance
         */
        public static create(properties?: hermes.IRequestValue): hermes.RequestValue;

        /**
         * Encodes the specified RequestValue message. Does not implicitly {@link hermes.RequestValue.verify|verify} messages.
         * @param message RequestValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IRequestValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RequestValue message, length delimited. Does not implicitly {@link hermes.RequestValue.verify|verify} messages.
         * @param message RequestValue message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IRequestValue, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RequestValue message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RequestValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.RequestValue;

        /**
         * Decodes a RequestValue message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RequestValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.RequestValue;

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
        public static fromObject(object: { [k: string]: any }): hermes.RequestValue;

        /**
         * Creates a plain object from a RequestValue message. Also converts values to other types if specified.
         * @param message RequestValue
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.RequestValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IRequestReply {

        /** RequestReply data */
        data?: (Uint8Array|null);
    }

    /** Represents a RequestReply. */
    class RequestReply implements IRequestReply {

        /**
         * Constructs a new RequestReply.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IRequestReply);

        /** RequestReply data. */
        public data: Uint8Array;

        /**
         * Creates a new RequestReply instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RequestReply instance
         */
        public static create(properties?: hermes.IRequestReply): hermes.RequestReply;

        /**
         * Encodes the specified RequestReply message. Does not implicitly {@link hermes.RequestReply.verify|verify} messages.
         * @param message RequestReply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IRequestReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RequestReply message, length delimited. Does not implicitly {@link hermes.RequestReply.verify|verify} messages.
         * @param message RequestReply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IRequestReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RequestReply message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RequestReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.RequestReply;

        /**
         * Decodes a RequestReply message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RequestReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.RequestReply;

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
        public static fromObject(object: { [k: string]: any }): hermes.RequestReply;

        /**
         * Creates a plain object from a RequestReply message. Also converts values to other types if specified.
         * @param message RequestReply
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.RequestReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IId {

        /** Id id */
        id?: (string|null);
    }

    /** Represents an Id. */
    class Id implements IId {

        /**
         * Constructs a new Id.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IId);

        /** Id id. */
        public id: string;

        /**
         * Creates a new Id instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Id instance
         */
        public static create(properties?: hermes.IId): hermes.Id;

        /**
         * Encodes the specified Id message. Does not implicitly {@link hermes.Id.verify|verify} messages.
         * @param message Id message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IId, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Id message, length delimited. Does not implicitly {@link hermes.Id.verify|verify} messages.
         * @param message Id message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IId, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Id message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Id
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Id;

        /**
         * Decodes an Id message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Id
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Id;

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
        public static fromObject(object: { [k: string]: any }): hermes.Id;

        /**
         * Creates a plain object from an Id message. Also converts values to other types if specified.
         * @param message Id
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Id, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFswList {

        /** FswList all */
        all?: (hermes.IFsw[]|null);
    }

    /** Represents a FswList. */
    class FswList implements IFswList {

        /**
         * Constructs a new FswList.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFswList);

        /** FswList all. */
        public all: hermes.IFsw[];

        /**
         * Creates a new FswList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FswList instance
         */
        public static create(properties?: hermes.IFswList): hermes.FswList;

        /**
         * Encodes the specified FswList message. Does not implicitly {@link hermes.FswList.verify|verify} messages.
         * @param message FswList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFswList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FswList message, length delimited. Does not implicitly {@link hermes.FswList.verify|verify} messages.
         * @param message FswList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFswList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FswList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FswList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FswList;

        /**
         * Decodes a FswList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FswList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FswList;

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
        public static fromObject(object: { [k: string]: any }): hermes.FswList;

        /**
         * Creates a plain object from a FswList message. Also converts values to other types if specified.
         * @param message FswList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FswList, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IReply {

        /** Reply success */
        success?: (boolean|null);
    }

    /** Represents a Reply. */
    class Reply implements IReply {

        /**
         * Constructs a new Reply.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IReply);

        /** Reply success. */
        public success: boolean;

        /**
         * Creates a new Reply instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Reply instance
         */
        public static create(properties?: hermes.IReply): hermes.Reply;

        /**
         * Encodes the specified Reply message. Does not implicitly {@link hermes.Reply.verify|verify} messages.
         * @param message Reply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Reply message, length delimited. Does not implicitly {@link hermes.Reply.verify|verify} messages.
         * @param message Reply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Reply message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Reply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Reply;

        /**
         * Decodes a Reply message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Reply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Reply;

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
        public static fromObject(object: { [k: string]: any }): hermes.Reply;

        /**
         * Creates a plain object from a Reply message. Also converts values to other types if specified.
         * @param message Reply
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Reply, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface ISequenceReply {

        /** SequenceReply success */
        success?: (boolean|null);

        /** SequenceReply commandIndex */
        commandIndex?: (number|null);
    }

    /** Represents a SequenceReply. */
    class SequenceReply implements ISequenceReply {

        /**
         * Constructs a new SequenceReply.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ISequenceReply);

        /** SequenceReply success. */
        public success: boolean;

        /** SequenceReply commandIndex. */
        public commandIndex: number;

        /**
         * Creates a new SequenceReply instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SequenceReply instance
         */
        public static create(properties?: hermes.ISequenceReply): hermes.SequenceReply;

        /**
         * Encodes the specified SequenceReply message. Does not implicitly {@link hermes.SequenceReply.verify|verify} messages.
         * @param message SequenceReply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.ISequenceReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SequenceReply message, length delimited. Does not implicitly {@link hermes.SequenceReply.verify|verify} messages.
         * @param message SequenceReply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.ISequenceReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SequenceReply message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SequenceReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.SequenceReply;

        /**
         * Decodes a SequenceReply message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SequenceReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.SequenceReply;

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
        public static fromObject(object: { [k: string]: any }): hermes.SequenceReply;

        /**
         * Creates a plain object from a SequenceReply message. Also converts values to other types if specified.
         * @param message SequenceReply
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.SequenceReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IStatefulProfile {

        /** StatefulProfile value */
        value?: (hermes.IProfile|null);

        /** StatefulProfile state */
        state?: (hermes.ProfileState|null);

        /** StatefulProfile runtimeOnly */
        runtimeOnly?: (boolean|null);
    }

    /** Represents a StatefulProfile. */
    class StatefulProfile implements IStatefulProfile {

        /**
         * Constructs a new StatefulProfile.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IStatefulProfile);

        /** StatefulProfile value. */
        public value?: (hermes.IProfile|null);

        /** StatefulProfile state. */
        public state: hermes.ProfileState;

        /** StatefulProfile runtimeOnly. */
        public runtimeOnly: boolean;

        /**
         * Creates a new StatefulProfile instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StatefulProfile instance
         */
        public static create(properties?: hermes.IStatefulProfile): hermes.StatefulProfile;

        /**
         * Encodes the specified StatefulProfile message. Does not implicitly {@link hermes.StatefulProfile.verify|verify} messages.
         * @param message StatefulProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IStatefulProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StatefulProfile message, length delimited. Does not implicitly {@link hermes.StatefulProfile.verify|verify} messages.
         * @param message StatefulProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IStatefulProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StatefulProfile message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StatefulProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.StatefulProfile;

        /**
         * Decodes a StatefulProfile message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StatefulProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.StatefulProfile;

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
        public static fromObject(object: { [k: string]: any }): hermes.StatefulProfile;

        /**
         * Creates a plain object from a StatefulProfile message. Also converts values to other types if specified.
         * @param message StatefulProfile
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.StatefulProfile, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IProfileList {

        /** ProfileList all */
        all?: ({ [k: string]: hermes.IStatefulProfile }|null);
    }

    /** Represents a ProfileList. */
    class ProfileList implements IProfileList {

        /**
         * Constructs a new ProfileList.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IProfileList);

        /** ProfileList all. */
        public all: { [k: string]: hermes.IStatefulProfile };

        /**
         * Creates a new ProfileList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProfileList instance
         */
        public static create(properties?: hermes.IProfileList): hermes.ProfileList;

        /**
         * Encodes the specified ProfileList message. Does not implicitly {@link hermes.ProfileList.verify|verify} messages.
         * @param message ProfileList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IProfileList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProfileList message, length delimited. Does not implicitly {@link hermes.ProfileList.verify|verify} messages.
         * @param message ProfileList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IProfileList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProfileList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProfileList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ProfileList;

        /**
         * Decodes a ProfileList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProfileList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ProfileList;

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
        public static fromObject(object: { [k: string]: any }): hermes.ProfileList;

        /**
         * Creates a plain object from a ProfileList message. Also converts values to other types if specified.
         * @param message ProfileList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ProfileList, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IProfileProviderList {

        /** ProfileProviderList all */
        all?: (hermes.IProfileProvider[]|null);
    }

    /** Represents a ProfileProviderList. */
    class ProfileProviderList implements IProfileProviderList {

        /**
         * Constructs a new ProfileProviderList.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IProfileProviderList);

        /** ProfileProviderList all. */
        public all: hermes.IProfileProvider[];

        /**
         * Creates a new ProfileProviderList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProfileProviderList instance
         */
        public static create(properties?: hermes.IProfileProviderList): hermes.ProfileProviderList;

        /**
         * Encodes the specified ProfileProviderList message. Does not implicitly {@link hermes.ProfileProviderList.verify|verify} messages.
         * @param message ProfileProviderList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IProfileProviderList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProfileProviderList message, length delimited. Does not implicitly {@link hermes.ProfileProviderList.verify|verify} messages.
         * @param message ProfileProviderList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IProfileProviderList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProfileProviderList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProfileProviderList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ProfileProviderList;

        /**
         * Decodes a ProfileProviderList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProfileProviderList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ProfileProviderList;

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
        public static fromObject(object: { [k: string]: any }): hermes.ProfileProviderList;

        /**
         * Creates a plain object from a ProfileProviderList message. Also converts values to other types if specified.
         * @param message ProfileProviderList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ProfileProviderList, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IProfileUpdate {

        /** ProfileUpdate id */
        id?: (string|null);

        /** ProfileUpdate settings */
        settings?: (string|null);
    }

    /** Represents a ProfileUpdate. */
    class ProfileUpdate implements IProfileUpdate {

        /**
         * Constructs a new ProfileUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IProfileUpdate);

        /** ProfileUpdate id. */
        public id: string;

        /** ProfileUpdate settings. */
        public settings: string;

        /**
         * Creates a new ProfileUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProfileUpdate instance
         */
        public static create(properties?: hermes.IProfileUpdate): hermes.ProfileUpdate;

        /**
         * Encodes the specified ProfileUpdate message. Does not implicitly {@link hermes.ProfileUpdate.verify|verify} messages.
         * @param message ProfileUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IProfileUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProfileUpdate message, length delimited. Does not implicitly {@link hermes.ProfileUpdate.verify|verify} messages.
         * @param message ProfileUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IProfileUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProfileUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProfileUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ProfileUpdate;

        /**
         * Decodes a ProfileUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProfileUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ProfileUpdate;

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
        public static fromObject(object: { [k: string]: any }): hermes.ProfileUpdate;

        /**
         * Creates a plain object from a ProfileUpdate message. Also converts values to other types if specified.
         * @param message ProfileUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ProfileUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IDictionaryList {

        /** DictionaryList all */
        all?: ({ [k: string]: hermes.IDictionaryHead }|null);
    }

    /** Represents a DictionaryList. */
    class DictionaryList implements IDictionaryList {

        /**
         * Constructs a new DictionaryList.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IDictionaryList);

        /** DictionaryList all. */
        public all: { [k: string]: hermes.IDictionaryHead };

        /**
         * Creates a new DictionaryList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DictionaryList instance
         */
        public static create(properties?: hermes.IDictionaryList): hermes.DictionaryList;

        /**
         * Encodes the specified DictionaryList message. Does not implicitly {@link hermes.DictionaryList.verify|verify} messages.
         * @param message DictionaryList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IDictionaryList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DictionaryList message, length delimited. Does not implicitly {@link hermes.DictionaryList.verify|verify} messages.
         * @param message DictionaryList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IDictionaryList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DictionaryList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DictionaryList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.DictionaryList;

        /**
         * Decodes a DictionaryList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DictionaryList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.DictionaryList;

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
        public static fromObject(object: { [k: string]: any }): hermes.DictionaryList;

        /**
         * Creates a plain object from a DictionaryList message. Also converts values to other types if specified.
         * @param message DictionaryList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.DictionaryList, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IUplink {

        /** Uplink id */
        id?: (string|null);

        /** Uplink cmd */
        cmd?: (hermes.ICommandValue|null);

        /** Uplink parseCmd */
        parseCmd?: (hermes.IRawCommandValue|null);

        /** Uplink seq */
        seq?: (hermes.ICommandSequence|null);

        /** Uplink parseSeq */
        parseSeq?: (hermes.IRawCommandSequence|null);

        /** Uplink file */
        file?: (hermes.IUplinkFileChunk|null);

        /** Uplink request */
        request?: (hermes.IRequestValue|null);

        /** Uplink cancel */
        cancel?: (google.protobuf.IEmpty|null);

        /** Uplink final */
        final?: (google.protobuf.IEmpty|null);
    }

    /** Represents an Uplink. */
    class Uplink implements IUplink {

        /**
         * Constructs a new Uplink.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IUplink);

        /** Uplink id. */
        public id: string;

        /** Uplink cmd. */
        public cmd?: (hermes.ICommandValue|null);

        /** Uplink parseCmd. */
        public parseCmd?: (hermes.IRawCommandValue|null);

        /** Uplink seq. */
        public seq?: (hermes.ICommandSequence|null);

        /** Uplink parseSeq. */
        public parseSeq?: (hermes.IRawCommandSequence|null);

        /** Uplink file. */
        public file?: (hermes.IUplinkFileChunk|null);

        /** Uplink request. */
        public request?: (hermes.IRequestValue|null);

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
        public static create(properties?: hermes.IUplink): hermes.Uplink;

        /**
         * Encodes the specified Uplink message. Does not implicitly {@link hermes.Uplink.verify|verify} messages.
         * @param message Uplink message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IUplink, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Uplink message, length delimited. Does not implicitly {@link hermes.Uplink.verify|verify} messages.
         * @param message Uplink message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IUplink, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Uplink message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Uplink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Uplink;

        /**
         * Decodes an Uplink message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Uplink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Uplink;

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
        public static fromObject(object: { [k: string]: any }): hermes.Uplink;

        /**
         * Creates a plain object from an Uplink message. Also converts values to other types if specified.
         * @param message Uplink
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Uplink, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IUplinkReply {

        /** UplinkReply id */
        id?: (string|null);

        /** UplinkReply reply */
        reply?: (Uint8Array|null);

        /** UplinkReply error */
        error?: (string|null);
    }

    /** Represents an UplinkReply. */
    class UplinkReply implements IUplinkReply {

        /**
         * Constructs a new UplinkReply.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IUplinkReply);

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
        public static create(properties?: hermes.IUplinkReply): hermes.UplinkReply;

        /**
         * Encodes the specified UplinkReply message. Does not implicitly {@link hermes.UplinkReply.verify|verify} messages.
         * @param message UplinkReply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IUplinkReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UplinkReply message, length delimited. Does not implicitly {@link hermes.UplinkReply.verify|verify} messages.
         * @param message UplinkReply message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IUplinkReply, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UplinkReply message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UplinkReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.UplinkReply;

        /**
         * Decodes an UplinkReply message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UplinkReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.UplinkReply;

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
        public static fromObject(object: { [k: string]: any }): hermes.UplinkReply;

        /**
         * Creates a plain object from an UplinkReply message. Also converts values to other types if specified.
         * @param message UplinkReply
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.UplinkReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFswInitialPacket {

        /** FswInitialPacket info */
        info?: (hermes.IFsw|null);

        /** FswInitialPacket profile */
        profile?: (string|null);
    }

    /** Represents a FswInitialPacket. */
    class FswInitialPacket implements IFswInitialPacket {

        /**
         * Constructs a new FswInitialPacket.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFswInitialPacket);

        /** FswInitialPacket info. */
        public info?: (hermes.IFsw|null);

        /** FswInitialPacket profile. */
        public profile: string;

        /**
         * Creates a new FswInitialPacket instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FswInitialPacket instance
         */
        public static create(properties?: hermes.IFswInitialPacket): hermes.FswInitialPacket;

        /**
         * Encodes the specified FswInitialPacket message. Does not implicitly {@link hermes.FswInitialPacket.verify|verify} messages.
         * @param message FswInitialPacket message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFswInitialPacket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FswInitialPacket message, length delimited. Does not implicitly {@link hermes.FswInitialPacket.verify|verify} messages.
         * @param message FswInitialPacket message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFswInitialPacket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FswInitialPacket message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FswInitialPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FswInitialPacket;

        /**
         * Decodes a FswInitialPacket message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FswInitialPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FswInitialPacket;

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
        public static fromObject(object: { [k: string]: any }): hermes.FswInitialPacket;

        /**
         * Creates a plain object from a FswInitialPacket message. Also converts values to other types if specified.
         * @param message FswInitialPacket
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FswInitialPacket, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IFswConnectionPacket {

        /** FswConnectionPacket info */
        info?: (hermes.IFswInitialPacket|null);

        /** FswConnectionPacket reply */
        reply?: (hermes.IUplinkReply|null);
    }

    /** Represents a FswConnectionPacket. */
    class FswConnectionPacket implements IFswConnectionPacket {

        /**
         * Constructs a new FswConnectionPacket.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IFswConnectionPacket);

        /** FswConnectionPacket info. */
        public info?: (hermes.IFswInitialPacket|null);

        /** FswConnectionPacket reply. */
        public reply?: (hermes.IUplinkReply|null);

        /** FswConnectionPacket value. */
        public value?: ("info"|"reply");

        /**
         * Creates a new FswConnectionPacket instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FswConnectionPacket instance
         */
        public static create(properties?: hermes.IFswConnectionPacket): hermes.FswConnectionPacket;

        /**
         * Encodes the specified FswConnectionPacket message. Does not implicitly {@link hermes.FswConnectionPacket.verify|verify} messages.
         * @param message FswConnectionPacket message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IFswConnectionPacket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FswConnectionPacket message, length delimited. Does not implicitly {@link hermes.FswConnectionPacket.verify|verify} messages.
         * @param message FswConnectionPacket message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IFswConnectionPacket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FswConnectionPacket message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FswConnectionPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.FswConnectionPacket;

        /**
         * Decodes a FswConnectionPacket message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FswConnectionPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.FswConnectionPacket;

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
        public static fromObject(object: { [k: string]: any }): hermes.FswConnectionPacket;

        /**
         * Creates a plain object from a FswConnectionPacket message. Also converts values to other types if specified.
         * @param message FswConnectionPacket
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.FswConnectionPacket, options?: $protobuf.IConversionOptions): { [k: string]: any };

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

    /** Properties of a ProfileProvider. */
    interface IProfileProvider {

        /** ProfileProvider name */
        name?: (string|null);

        /** ProfileProvider schema */
        schema?: (string|null);

        /** ProfileProvider uiSchema */
        uiSchema?: (string|null);
    }

    /** Represents a ProfileProvider. */
    class ProfileProvider implements IProfileProvider {

        /**
         * Constructs a new ProfileProvider.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IProfileProvider);

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
        public static create(properties?: hermes.IProfileProvider): hermes.ProfileProvider;

        /**
         * Encodes the specified ProfileProvider message. Does not implicitly {@link hermes.ProfileProvider.verify|verify} messages.
         * @param message ProfileProvider message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IProfileProvider, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProfileProvider message, length delimited. Does not implicitly {@link hermes.ProfileProvider.verify|verify} messages.
         * @param message ProfileProvider message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IProfileProvider, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProfileProvider message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProfileProvider
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.ProfileProvider;

        /**
         * Decodes a ProfileProvider message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProfileProvider
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.ProfileProvider;

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
        public static fromObject(object: { [k: string]: any }): hermes.ProfileProvider;

        /**
         * Creates a plain object from a ProfileProvider message. Also converts values to other types if specified.
         * @param message ProfileProvider
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.ProfileProvider, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    interface IProfile {

        /** Profile name */
        name?: (string|null);

        /** Profile provider */
        provider?: (string|null);

        /** Profile settings */
        settings?: (string|null);

        /** Profile id */
        id?: (string|null);
    }

    /** Represents a Profile. */
    class Profile implements IProfile {

        /**
         * Constructs a new Profile.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.IProfile);

        /** Profile name. */
        public name: string;

        /** Profile provider. */
        public provider: string;

        /** Profile settings. */
        public settings: string;

        /** Profile id. */
        public id: string;

        /**
         * Creates a new Profile instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Profile instance
         */
        public static create(properties?: hermes.IProfile): hermes.Profile;

        /**
         * Encodes the specified Profile message. Does not implicitly {@link hermes.Profile.verify|verify} messages.
         * @param message Profile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hermes.IProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Profile message, length delimited. Does not implicitly {@link hermes.Profile.verify|verify} messages.
         * @param message Profile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: hermes.IProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Profile message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Profile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hermes.Profile;

        /**
         * Decodes a Profile message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Profile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): hermes.Profile;

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
        public static fromObject(object: { [k: string]: any }): hermes.Profile;

        /**
         * Creates a plain object from a Profile message. Also converts values to other types if specified.
         * @param message Profile
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: hermes.Profile, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
    enum ProfileState {
        PROFILE_IDLE = 0,
        PROFILE_CONNECTING = 1,
        PROFILE_ACTIVE = 2,
        PROFILE_DISCONNECT = 3
    }
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
