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

    /** Properties of a CommandDef. */
    interface ICommandDef {

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
        "arguments"?: (hermes.IField[]|null);

        /** CommandDef metadata */
        metadata?: (string|null);
    }

    /** Represents a CommandDef. */
    class CommandDef implements ICommandDef {

        /**
         * Constructs a new CommandDef.
         * @param [properties] Properties to set
         */
        constructor(properties?: hermes.ICommandDef);

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
        public arguments: hermes.IField[];

        /** CommandDef metadata. */
        public metadata: string;

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

        /** FormatSpecifier _precision. */
        public _precision?: "precision";

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
    }
}
