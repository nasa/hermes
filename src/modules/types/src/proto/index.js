/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.hermes = (function() {

    /**
     * Namespace hermes.
     * @exports hermes
     * @namespace
     */
    var hermes = {};

    /**
     * SourceContextFilter enum.
     * @name hermes.SourceContextFilter
     * @enum {number}
     * @property {number} REALTIME_ONLY=0 REALTIME_ONLY value
     * @property {number} RECORDED_ONLY=1 RECORDED_ONLY value
     * @property {number} ALL=2 ALL value
     */
    hermes.SourceContextFilter = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "REALTIME_ONLY"] = 0;
        values[valuesById[1] = "RECORDED_ONLY"] = 1;
        values[valuesById[2] = "ALL"] = 2;
        return values;
    })();

    hermes.BusFilter = (function() {

        /**
         * Properties of a BusFilter.
         * @memberof hermes
         * @interface IBusFilter
         * @property {string|null} [source] BusFilter source
         * @property {Array.<string>|null} [names] BusFilter names
         * @property {hermes.SourceContextFilter|null} [context] BusFilter context
         */

        /**
         * Constructs a new BusFilter.
         * @memberof hermes
         * @classdesc Represents a BusFilter.
         * @implements IBusFilter
         * @constructor
         * @param {hermes.IBusFilter=} [properties] Properties to set
         */
        function BusFilter(properties) {
            this.names = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BusFilter source.
         * @member {string} source
         * @memberof hermes.BusFilter
         * @instance
         */
        BusFilter.prototype.source = "";

        /**
         * BusFilter names.
         * @member {Array.<string>} names
         * @memberof hermes.BusFilter
         * @instance
         */
        BusFilter.prototype.names = $util.emptyArray;

        /**
         * BusFilter context.
         * @member {hermes.SourceContextFilter} context
         * @memberof hermes.BusFilter
         * @instance
         */
        BusFilter.prototype.context = 0;

        /**
         * Creates a new BusFilter instance using the specified properties.
         * @function create
         * @memberof hermes.BusFilter
         * @static
         * @param {hermes.IBusFilter=} [properties] Properties to set
         * @returns {hermes.BusFilter} BusFilter instance
         */
        BusFilter.create = function create(properties) {
            return new BusFilter(properties);
        };

        /**
         * Encodes the specified BusFilter message. Does not implicitly {@link hermes.BusFilter.verify|verify} messages.
         * @function encode
         * @memberof hermes.BusFilter
         * @static
         * @param {hermes.IBusFilter} message BusFilter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BusFilter.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
            if (message.names != null && message.names.length)
                for (var i = 0; i < message.names.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.names[i]);
            if (message.context != null && Object.hasOwnProperty.call(message, "context"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.context);
            return writer;
        };

        /**
         * Encodes the specified BusFilter message, length delimited. Does not implicitly {@link hermes.BusFilter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.BusFilter
         * @static
         * @param {hermes.IBusFilter} message BusFilter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BusFilter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BusFilter message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.BusFilter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.BusFilter} BusFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BusFilter.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BusFilter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.source = reader.string();
                        break;
                    }
                case 2: {
                        if (!(message.names && message.names.length))
                            message.names = [];
                        message.names.push(reader.string());
                        break;
                    }
                case 3: {
                        message.context = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BusFilter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.BusFilter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.BusFilter} BusFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BusFilter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BusFilter message.
         * @function verify
         * @memberof hermes.BusFilter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BusFilter.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.names != null && Object.hasOwnProperty.call(message, "names")) {
                if (!Array.isArray(message.names))
                    return "names: array expected";
                for (var i = 0; i < message.names.length; ++i)
                    if (!$util.isString(message.names[i]))
                        return "names: string[] expected";
            }
            if (message.context != null && Object.hasOwnProperty.call(message, "context"))
                switch (message.context) {
                default:
                    return "context: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a BusFilter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.BusFilter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.BusFilter} BusFilter
         */
        BusFilter.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.BusFilter)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.BusFilter: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.BusFilter();
            if (object.source != null)
                message.source = String(object.source);
            if (object.names) {
                if (!Array.isArray(object.names))
                    throw TypeError(".hermes.BusFilter.names: array expected");
                message.names = [];
                for (var i = 0; i < object.names.length; ++i)
                    message.names[i] = String(object.names[i]);
            }
            switch (object.context) {
            default:
                if (typeof object.context === "number") {
                    message.context = object.context;
                    break;
                }
                break;
            case "REALTIME_ONLY":
            case 0:
                message.context = 0;
                break;
            case "RECORDED_ONLY":
            case 1:
                message.context = 1;
                break;
            case "ALL":
            case 2:
                message.context = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a BusFilter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.BusFilter
         * @static
         * @param {hermes.BusFilter} message BusFilter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BusFilter.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults)
                object.names = [];
            if (options.defaults) {
                object.source = "";
                object.context = options.enums === String ? "REALTIME_ONLY" : 0;
            }
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                object.source = message.source;
            if (message.names && message.names.length) {
                object.names = [];
                for (var j = 0; j < message.names.length; ++j)
                    object.names[j] = message.names[j];
            }
            if (message.context != null && Object.hasOwnProperty.call(message, "context"))
                object.context = options.enums === String ? $root.hermes.SourceContextFilter[message.context] === undefined ? message.context : $root.hermes.SourceContextFilter[message.context] : message.context;
            return object;
        };

        /**
         * Converts this BusFilter to JSON.
         * @function toJSON
         * @memberof hermes.BusFilter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BusFilter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BusFilter
         * @function getTypeUrl
         * @memberof hermes.BusFilter
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BusFilter.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.BusFilter";
        };

        return BusFilter;
    })();

    /**
     * FileDownlinkCompletionStatus enum.
     * @name hermes.FileDownlinkCompletionStatus
     * @enum {number}
     * @property {number} DOWNLINK_COMPLETED=0 DOWNLINK_COMPLETED value
     * @property {number} DOWNLINK_UNKNOWN=-1 DOWNLINK_UNKNOWN value
     * @property {number} DOWNLINK_PARTIAL=1 DOWNLINK_PARTIAL value
     * @property {number} DOWNLINK_CRC_FAILED=2 DOWNLINK_CRC_FAILED value
     */
    hermes.FileDownlinkCompletionStatus = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DOWNLINK_COMPLETED"] = 0;
        values[valuesById[-1] = "DOWNLINK_UNKNOWN"] = -1;
        values[valuesById[1] = "DOWNLINK_PARTIAL"] = 1;
        values[valuesById[2] = "DOWNLINK_CRC_FAILED"] = 2;
        return values;
    })();

    hermes.FileDownlinkChunk = (function() {

        /**
         * Properties of a FileDownlinkChunk.
         * @memberof hermes
         * @interface IFileDownlinkChunk
         * @property {number|Long|null} [offset] FileDownlinkChunk offset
         * @property {number|Long|null} [size] FileDownlinkChunk size
         */

        /**
         * Constructs a new FileDownlinkChunk.
         * @memberof hermes
         * @classdesc Represents a FileDownlinkChunk.
         * @implements IFileDownlinkChunk
         * @constructor
         * @param {hermes.IFileDownlinkChunk=} [properties] Properties to set
         */
        function FileDownlinkChunk(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FileDownlinkChunk offset.
         * @member {number|Long} offset
         * @memberof hermes.FileDownlinkChunk
         * @instance
         */
        FileDownlinkChunk.prototype.offset = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FileDownlinkChunk size.
         * @member {number|Long} size
         * @memberof hermes.FileDownlinkChunk
         * @instance
         */
        FileDownlinkChunk.prototype.size = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new FileDownlinkChunk instance using the specified properties.
         * @function create
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {hermes.IFileDownlinkChunk=} [properties] Properties to set
         * @returns {hermes.FileDownlinkChunk} FileDownlinkChunk instance
         */
        FileDownlinkChunk.create = function create(properties) {
            return new FileDownlinkChunk(properties);
        };

        /**
         * Encodes the specified FileDownlinkChunk message. Does not implicitly {@link hermes.FileDownlinkChunk.verify|verify} messages.
         * @function encode
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {hermes.IFileDownlinkChunk} message FileDownlinkChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileDownlinkChunk.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.offset);
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.size);
            return writer;
        };

        /**
         * Encodes the specified FileDownlinkChunk message, length delimited. Does not implicitly {@link hermes.FileDownlinkChunk.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {hermes.IFileDownlinkChunk} message FileDownlinkChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileDownlinkChunk.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FileDownlinkChunk message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FileDownlinkChunk} FileDownlinkChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileDownlinkChunk.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileDownlinkChunk();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.offset = reader.uint64();
                        break;
                    }
                case 2: {
                        message.size = reader.uint64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FileDownlinkChunk message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FileDownlinkChunk} FileDownlinkChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileDownlinkChunk.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FileDownlinkChunk message.
         * @function verify
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FileDownlinkChunk.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                if (!$util.isInteger(message.offset) && !(message.offset && $util.isInteger(message.offset.low) && $util.isInteger(message.offset.high)))
                    return "offset: integer|Long expected";
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                    return "size: integer|Long expected";
            return null;
        };

        /**
         * Creates a FileDownlinkChunk message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FileDownlinkChunk} FileDownlinkChunk
         */
        FileDownlinkChunk.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FileDownlinkChunk)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FileDownlinkChunk: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FileDownlinkChunk();
            if (object.offset != null)
                if ($util.Long)
                    message.offset = $util.Long.fromValue(object.offset, true);
                else if (typeof object.offset === "string")
                    message.offset = parseInt(object.offset, 10);
                else if (typeof object.offset === "number")
                    message.offset = object.offset;
                else if (typeof object.offset === "object")
                    message.offset = new $util.LongBits(object.offset.low >>> 0, object.offset.high >>> 0).toNumber(true);
            if (object.size != null)
                if ($util.Long)
                    message.size = $util.Long.fromValue(object.size, true);
                else if (typeof object.size === "string")
                    message.size = parseInt(object.size, 10);
                else if (typeof object.size === "number")
                    message.size = object.size;
                else if (typeof object.size === "object")
                    message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a FileDownlinkChunk message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {hermes.FileDownlinkChunk} message FileDownlinkChunk
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FileDownlinkChunk.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.offset = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.offset = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.size = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
            }
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.offset = typeof message.offset === "number" ? BigInt(message.offset) : $util.Long.fromBits(message.offset.low >>> 0, message.offset.high >>> 0, true).toBigInt();
                else if (typeof message.offset === "number")
                    object.offset = options.longs === String ? String(message.offset) : message.offset;
                else
                    object.offset = options.longs === String ? $util.Long.prototype.toString.call(message.offset) : options.longs === Number ? new $util.LongBits(message.offset.low >>> 0, message.offset.high >>> 0).toNumber(true) : message.offset;
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.size = typeof message.size === "number" ? BigInt(message.size) : $util.Long.fromBits(message.size.low >>> 0, message.size.high >>> 0, true).toBigInt();
                else if (typeof message.size === "number")
                    object.size = options.longs === String ? String(message.size) : message.size;
                else
                    object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
            return object;
        };

        /**
         * Converts this FileDownlinkChunk to JSON.
         * @function toJSON
         * @memberof hermes.FileDownlinkChunk
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FileDownlinkChunk.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FileDownlinkChunk
         * @function getTypeUrl
         * @memberof hermes.FileDownlinkChunk
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FileDownlinkChunk.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FileDownlinkChunk";
        };

        return FileDownlinkChunk;
    })();

    hermes.FileDownlink = (function() {

        /**
         * Properties of a FileDownlink.
         * @memberof hermes
         * @interface IFileDownlink
         * @property {string|null} [uid] FileDownlink uid
         * @property {google.protobuf.ITimestamp|null} [timeStart] FileDownlink timeStart
         * @property {google.protobuf.ITimestamp|null} [timeEnd] FileDownlink timeEnd
         * @property {hermes.FileDownlinkCompletionStatus|null} [status] FileDownlink status
         * @property {string|null} [source] FileDownlink source
         * @property {string|null} [sourcePath] FileDownlink sourcePath
         * @property {string|null} [destinationPath] FileDownlink destinationPath
         * @property {string|null} [filePath] FileDownlink filePath
         * @property {Array.<hermes.IFileDownlinkChunk>|null} [missingChunks] FileDownlink missingChunks
         * @property {Array.<hermes.IFileDownlinkChunk>|null} [duplicateChunks] FileDownlink duplicateChunks
         * @property {number|Long|null} [size] FileDownlink size
         * @property {Object.<string,string>|null} [metadata] FileDownlink metadata
         */

        /**
         * Constructs a new FileDownlink.
         * @memberof hermes
         * @classdesc Represents a FileDownlink.
         * @implements IFileDownlink
         * @constructor
         * @param {hermes.IFileDownlink=} [properties] Properties to set
         */
        function FileDownlink(properties) {
            this.missingChunks = [];
            this.duplicateChunks = [];
            this.metadata = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FileDownlink uid.
         * @member {string} uid
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.uid = "";

        /**
         * FileDownlink timeStart.
         * @member {google.protobuf.ITimestamp|null|undefined} timeStart
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.timeStart = null;

        /**
         * FileDownlink timeEnd.
         * @member {google.protobuf.ITimestamp|null|undefined} timeEnd
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.timeEnd = null;

        /**
         * FileDownlink status.
         * @member {hermes.FileDownlinkCompletionStatus} status
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.status = 0;

        /**
         * FileDownlink source.
         * @member {string} source
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.source = "";

        /**
         * FileDownlink sourcePath.
         * @member {string} sourcePath
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.sourcePath = "";

        /**
         * FileDownlink destinationPath.
         * @member {string} destinationPath
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.destinationPath = "";

        /**
         * FileDownlink filePath.
         * @member {string} filePath
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.filePath = "";

        /**
         * FileDownlink missingChunks.
         * @member {Array.<hermes.IFileDownlinkChunk>} missingChunks
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.missingChunks = $util.emptyArray;

        /**
         * FileDownlink duplicateChunks.
         * @member {Array.<hermes.IFileDownlinkChunk>} duplicateChunks
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.duplicateChunks = $util.emptyArray;

        /**
         * FileDownlink size.
         * @member {number|Long} size
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.size = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FileDownlink metadata.
         * @member {Object.<string,string>} metadata
         * @memberof hermes.FileDownlink
         * @instance
         */
        FileDownlink.prototype.metadata = $util.emptyObject;

        /**
         * Creates a new FileDownlink instance using the specified properties.
         * @function create
         * @memberof hermes.FileDownlink
         * @static
         * @param {hermes.IFileDownlink=} [properties] Properties to set
         * @returns {hermes.FileDownlink} FileDownlink instance
         */
        FileDownlink.create = function create(properties) {
            return new FileDownlink(properties);
        };

        /**
         * Encodes the specified FileDownlink message. Does not implicitly {@link hermes.FileDownlink.verify|verify} messages.
         * @function encode
         * @memberof hermes.FileDownlink
         * @static
         * @param {hermes.IFileDownlink} message FileDownlink message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileDownlink.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
            if (message.timeStart != null && Object.hasOwnProperty.call(message, "timeStart"))
                $root.google.protobuf.Timestamp.encode(message.timeStart, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
            if (message.timeEnd != null && Object.hasOwnProperty.call(message, "timeEnd"))
                $root.google.protobuf.Timestamp.encode(message.timeEnd, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.status);
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.source);
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.sourcePath);
            if (message.destinationPath != null && Object.hasOwnProperty.call(message, "destinationPath"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.destinationPath);
            if (message.filePath != null && Object.hasOwnProperty.call(message, "filePath"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.filePath);
            if (message.missingChunks != null && message.missingChunks.length)
                for (var i = 0; i < message.missingChunks.length; ++i)
                    $root.hermes.FileDownlinkChunk.encode(message.missingChunks[i], writer.uint32(/* id 9, wireType 2 =*/74).fork(), q + 1).ldelim();
            if (message.duplicateChunks != null && message.duplicateChunks.length)
                for (var i = 0; i < message.duplicateChunks.length; ++i)
                    $root.hermes.FileDownlinkChunk.encode(message.duplicateChunks[i], writer.uint32(/* id 10, wireType 2 =*/82).fork(), q + 1).ldelim();
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 11, wireType 0 =*/88).uint64(message.size);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 12, wireType 2 =*/98).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FileDownlink message, length delimited. Does not implicitly {@link hermes.FileDownlink.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FileDownlink
         * @static
         * @param {hermes.IFileDownlink} message FileDownlink message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileDownlink.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FileDownlink message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FileDownlink
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FileDownlink} FileDownlink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileDownlink.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileDownlink(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.uid = reader.string();
                        break;
                    }
                case 2: {
                        message.timeStart = $root.google.protobuf.Timestamp.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 3: {
                        message.timeEnd = $root.google.protobuf.Timestamp.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 4: {
                        message.status = reader.int32();
                        break;
                    }
                case 5: {
                        message.source = reader.string();
                        break;
                    }
                case 6: {
                        message.sourcePath = reader.string();
                        break;
                    }
                case 7: {
                        message.destinationPath = reader.string();
                        break;
                    }
                case 8: {
                        message.filePath = reader.string();
                        break;
                    }
                case 9: {
                        if (!(message.missingChunks && message.missingChunks.length))
                            message.missingChunks = [];
                        message.missingChunks.push($root.hermes.FileDownlinkChunk.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                case 10: {
                        if (!(message.duplicateChunks && message.duplicateChunks.length))
                            message.duplicateChunks = [];
                        message.duplicateChunks.push($root.hermes.FileDownlinkChunk.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                case 11: {
                        message.size = reader.uint64();
                        break;
                    }
                case 12: {
                        if (message.metadata === $util.emptyObject)
                            message.metadata = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = "";
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.string();
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.metadata, key);
                        message.metadata[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FileDownlink message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FileDownlink
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FileDownlink} FileDownlink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileDownlink.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FileDownlink message.
         * @function verify
         * @memberof hermes.FileDownlink
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FileDownlink.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.timeStart != null && Object.hasOwnProperty.call(message, "timeStart")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeStart, long + 1);
                if (error)
                    return "timeStart." + error;
            }
            if (message.timeEnd != null && Object.hasOwnProperty.call(message, "timeEnd")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeEnd, long + 1);
                if (error)
                    return "timeEnd." + error;
            }
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 0:
                case -1:
                case 1:
                case 2:
                    break;
                }
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                if (!$util.isString(message.sourcePath))
                    return "sourcePath: string expected";
            if (message.destinationPath != null && Object.hasOwnProperty.call(message, "destinationPath"))
                if (!$util.isString(message.destinationPath))
                    return "destinationPath: string expected";
            if (message.filePath != null && Object.hasOwnProperty.call(message, "filePath"))
                if (!$util.isString(message.filePath))
                    return "filePath: string expected";
            if (message.missingChunks != null && Object.hasOwnProperty.call(message, "missingChunks")) {
                if (!Array.isArray(message.missingChunks))
                    return "missingChunks: array expected";
                for (var i = 0; i < message.missingChunks.length; ++i) {
                    var error = $root.hermes.FileDownlinkChunk.verify(message.missingChunks[i], long + 1);
                    if (error)
                        return "missingChunks." + error;
                }
            }
            if (message.duplicateChunks != null && Object.hasOwnProperty.call(message, "duplicateChunks")) {
                if (!Array.isArray(message.duplicateChunks))
                    return "duplicateChunks: array expected";
                for (var i = 0; i < message.duplicateChunks.length; ++i) {
                    var error = $root.hermes.FileDownlinkChunk.verify(message.duplicateChunks[i], long + 1);
                    if (error)
                        return "duplicateChunks." + error;
                }
            }
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                    return "size: integer|Long expected";
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata")) {
                if (!$util.isObject(message.metadata))
                    return "metadata: object expected";
                var key = Object.keys(message.metadata);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.metadata[key[i]]))
                        return "metadata: string{k:string} expected";
            }
            return null;
        };

        /**
         * Creates a FileDownlink message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FileDownlink
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FileDownlink} FileDownlink
         */
        FileDownlink.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FileDownlink)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FileDownlink: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FileDownlink();
            if (object.uid != null)
                message.uid = String(object.uid);
            if (object.timeStart != null) {
                if (!$util.isObject(object.timeStart))
                    throw TypeError(".hermes.FileDownlink.timeStart: object expected");
                message.timeStart = $root.google.protobuf.Timestamp.fromObject(object.timeStart, long + 1);
            }
            if (object.timeEnd != null) {
                if (!$util.isObject(object.timeEnd))
                    throw TypeError(".hermes.FileDownlink.timeEnd: object expected");
                message.timeEnd = $root.google.protobuf.Timestamp.fromObject(object.timeEnd, long + 1);
            }
            switch (object.status) {
            default:
                if (typeof object.status === "number") {
                    message.status = object.status;
                    break;
                }
                break;
            case "DOWNLINK_COMPLETED":
            case 0:
                message.status = 0;
                break;
            case "DOWNLINK_UNKNOWN":
            case -1:
                message.status = -1;
                break;
            case "DOWNLINK_PARTIAL":
            case 1:
                message.status = 1;
                break;
            case "DOWNLINK_CRC_FAILED":
            case 2:
                message.status = 2;
                break;
            }
            if (object.source != null)
                message.source = String(object.source);
            if (object.sourcePath != null)
                message.sourcePath = String(object.sourcePath);
            if (object.destinationPath != null)
                message.destinationPath = String(object.destinationPath);
            if (object.filePath != null)
                message.filePath = String(object.filePath);
            if (object.missingChunks) {
                if (!Array.isArray(object.missingChunks))
                    throw TypeError(".hermes.FileDownlink.missingChunks: array expected");
                message.missingChunks = [];
                for (var i = 0; i < object.missingChunks.length; ++i) {
                    if (!$util.isObject(object.missingChunks[i]))
                        throw TypeError(".hermes.FileDownlink.missingChunks: object expected");
                    message.missingChunks[i] = $root.hermes.FileDownlinkChunk.fromObject(object.missingChunks[i], long + 1);
                }
            }
            if (object.duplicateChunks) {
                if (!Array.isArray(object.duplicateChunks))
                    throw TypeError(".hermes.FileDownlink.duplicateChunks: array expected");
                message.duplicateChunks = [];
                for (var i = 0; i < object.duplicateChunks.length; ++i) {
                    if (!$util.isObject(object.duplicateChunks[i]))
                        throw TypeError(".hermes.FileDownlink.duplicateChunks: object expected");
                    message.duplicateChunks[i] = $root.hermes.FileDownlinkChunk.fromObject(object.duplicateChunks[i], long + 1);
                }
            }
            if (object.size != null)
                if ($util.Long)
                    message.size = $util.Long.fromValue(object.size, true);
                else if (typeof object.size === "string")
                    message.size = parseInt(object.size, 10);
                else if (typeof object.size === "number")
                    message.size = object.size;
                else if (typeof object.size === "object")
                    message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
            if (object.metadata) {
                if (!$util.isObject(object.metadata))
                    throw TypeError(".hermes.FileDownlink.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.metadata, keys[i]);
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a FileDownlink message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FileDownlink
         * @static
         * @param {hermes.FileDownlink} message FileDownlink
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FileDownlink.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults) {
                object.missingChunks = [];
                object.duplicateChunks = [];
            }
            if (options.objects || options.defaults)
                object.metadata = {};
            if (options.defaults) {
                object.uid = "";
                object.timeStart = null;
                object.timeEnd = null;
                object.status = options.enums === String ? "DOWNLINK_COMPLETED" : 0;
                object.source = "";
                object.sourcePath = "";
                object.destinationPath = "";
                object.filePath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.size = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
            }
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                object.uid = message.uid;
            if (message.timeStart != null && Object.hasOwnProperty.call(message, "timeStart"))
                object.timeStart = $root.google.protobuf.Timestamp.toObject(message.timeStart, options, q + 1);
            if (message.timeEnd != null && Object.hasOwnProperty.call(message, "timeEnd"))
                object.timeEnd = $root.google.protobuf.Timestamp.toObject(message.timeEnd, options, q + 1);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                object.status = options.enums === String ? $root.hermes.FileDownlinkCompletionStatus[message.status] === undefined ? message.status : $root.hermes.FileDownlinkCompletionStatus[message.status] : message.status;
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                object.source = message.source;
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                object.sourcePath = message.sourcePath;
            if (message.destinationPath != null && Object.hasOwnProperty.call(message, "destinationPath"))
                object.destinationPath = message.destinationPath;
            if (message.filePath != null && Object.hasOwnProperty.call(message, "filePath"))
                object.filePath = message.filePath;
            if (message.missingChunks && message.missingChunks.length) {
                object.missingChunks = [];
                for (var j = 0; j < message.missingChunks.length; ++j)
                    object.missingChunks[j] = $root.hermes.FileDownlinkChunk.toObject(message.missingChunks[j], options, q + 1);
            }
            if (message.duplicateChunks && message.duplicateChunks.length) {
                object.duplicateChunks = [];
                for (var j = 0; j < message.duplicateChunks.length; ++j)
                    object.duplicateChunks[j] = $root.hermes.FileDownlinkChunk.toObject(message.duplicateChunks[j], options, q + 1);
            }
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.size = typeof message.size === "number" ? BigInt(message.size) : $util.Long.fromBits(message.size.low >>> 0, message.size.high >>> 0, true).toBigInt();
                else if (typeof message.size === "number")
                    object.size = options.longs === String ? String(message.size) : message.size;
                else
                    object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.metadata, keys2[j]);
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
                }
            }
            return object;
        };

        /**
         * Converts this FileDownlink to JSON.
         * @function toJSON
         * @memberof hermes.FileDownlink
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FileDownlink.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FileDownlink
         * @function getTypeUrl
         * @memberof hermes.FileDownlink
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FileDownlink.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FileDownlink";
        };

        return FileDownlink;
    })();

    hermes.FileUplink = (function() {

        /**
         * Properties of a FileUplink.
         * @memberof hermes
         * @interface IFileUplink
         * @property {string|null} [uid] FileUplink uid
         * @property {google.protobuf.ITimestamp|null} [timeStart] FileUplink timeStart
         * @property {google.protobuf.ITimestamp|null} [timeEnd] FileUplink timeEnd
         * @property {string|null} [fswId] FileUplink fswId
         * @property {string|null} [sourcePath] FileUplink sourcePath
         * @property {string|null} [destinationPath] FileUplink destinationPath
         * @property {string|null} [error] FileUplink error
         * @property {number|Long|null} [size] FileUplink size
         * @property {Object.<string,string>|null} [metadata] FileUplink metadata
         */

        /**
         * Constructs a new FileUplink.
         * @memberof hermes
         * @classdesc Represents a FileUplink.
         * @implements IFileUplink
         * @constructor
         * @param {hermes.IFileUplink=} [properties] Properties to set
         */
        function FileUplink(properties) {
            this.metadata = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FileUplink uid.
         * @member {string} uid
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.uid = "";

        /**
         * FileUplink timeStart.
         * @member {google.protobuf.ITimestamp|null|undefined} timeStart
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.timeStart = null;

        /**
         * FileUplink timeEnd.
         * @member {google.protobuf.ITimestamp|null|undefined} timeEnd
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.timeEnd = null;

        /**
         * FileUplink fswId.
         * @member {string} fswId
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.fswId = "";

        /**
         * FileUplink sourcePath.
         * @member {string} sourcePath
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.sourcePath = "";

        /**
         * FileUplink destinationPath.
         * @member {string} destinationPath
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.destinationPath = "";

        /**
         * FileUplink error.
         * @member {string} error
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.error = "";

        /**
         * FileUplink size.
         * @member {number|Long} size
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.size = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FileUplink metadata.
         * @member {Object.<string,string>} metadata
         * @memberof hermes.FileUplink
         * @instance
         */
        FileUplink.prototype.metadata = $util.emptyObject;

        /**
         * Creates a new FileUplink instance using the specified properties.
         * @function create
         * @memberof hermes.FileUplink
         * @static
         * @param {hermes.IFileUplink=} [properties] Properties to set
         * @returns {hermes.FileUplink} FileUplink instance
         */
        FileUplink.create = function create(properties) {
            return new FileUplink(properties);
        };

        /**
         * Encodes the specified FileUplink message. Does not implicitly {@link hermes.FileUplink.verify|verify} messages.
         * @function encode
         * @memberof hermes.FileUplink
         * @static
         * @param {hermes.IFileUplink} message FileUplink message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileUplink.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
            if (message.timeStart != null && Object.hasOwnProperty.call(message, "timeStart"))
                $root.google.protobuf.Timestamp.encode(message.timeStart, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
            if (message.timeEnd != null && Object.hasOwnProperty.call(message, "timeEnd"))
                $root.google.protobuf.Timestamp.encode(message.timeEnd, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
            if (message.fswId != null && Object.hasOwnProperty.call(message, "fswId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.fswId);
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.sourcePath);
            if (message.destinationPath != null && Object.hasOwnProperty.call(message, "destinationPath"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.destinationPath);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.error);
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.size);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 10, wireType 2 =*/82).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FileUplink message, length delimited. Does not implicitly {@link hermes.FileUplink.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FileUplink
         * @static
         * @param {hermes.IFileUplink} message FileUplink message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileUplink.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FileUplink message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FileUplink
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FileUplink} FileUplink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileUplink.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileUplink(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.uid = reader.string();
                        break;
                    }
                case 2: {
                        message.timeStart = $root.google.protobuf.Timestamp.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 3: {
                        message.timeEnd = $root.google.protobuf.Timestamp.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 5: {
                        message.fswId = reader.string();
                        break;
                    }
                case 6: {
                        message.sourcePath = reader.string();
                        break;
                    }
                case 7: {
                        message.destinationPath = reader.string();
                        break;
                    }
                case 8: {
                        message.error = reader.string();
                        break;
                    }
                case 9: {
                        message.size = reader.uint64();
                        break;
                    }
                case 10: {
                        if (message.metadata === $util.emptyObject)
                            message.metadata = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = "";
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.string();
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.metadata, key);
                        message.metadata[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FileUplink message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FileUplink
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FileUplink} FileUplink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileUplink.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FileUplink message.
         * @function verify
         * @memberof hermes.FileUplink
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FileUplink.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.timeStart != null && Object.hasOwnProperty.call(message, "timeStart")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeStart, long + 1);
                if (error)
                    return "timeStart." + error;
            }
            if (message.timeEnd != null && Object.hasOwnProperty.call(message, "timeEnd")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeEnd, long + 1);
                if (error)
                    return "timeEnd." + error;
            }
            if (message.fswId != null && Object.hasOwnProperty.call(message, "fswId"))
                if (!$util.isString(message.fswId))
                    return "fswId: string expected";
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                if (!$util.isString(message.sourcePath))
                    return "sourcePath: string expected";
            if (message.destinationPath != null && Object.hasOwnProperty.call(message, "destinationPath"))
                if (!$util.isString(message.destinationPath))
                    return "destinationPath: string expected";
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                    return "size: integer|Long expected";
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata")) {
                if (!$util.isObject(message.metadata))
                    return "metadata: object expected";
                var key = Object.keys(message.metadata);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.metadata[key[i]]))
                        return "metadata: string{k:string} expected";
            }
            return null;
        };

        /**
         * Creates a FileUplink message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FileUplink
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FileUplink} FileUplink
         */
        FileUplink.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FileUplink)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FileUplink: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FileUplink();
            if (object.uid != null)
                message.uid = String(object.uid);
            if (object.timeStart != null) {
                if (!$util.isObject(object.timeStart))
                    throw TypeError(".hermes.FileUplink.timeStart: object expected");
                message.timeStart = $root.google.protobuf.Timestamp.fromObject(object.timeStart, long + 1);
            }
            if (object.timeEnd != null) {
                if (!$util.isObject(object.timeEnd))
                    throw TypeError(".hermes.FileUplink.timeEnd: object expected");
                message.timeEnd = $root.google.protobuf.Timestamp.fromObject(object.timeEnd, long + 1);
            }
            if (object.fswId != null)
                message.fswId = String(object.fswId);
            if (object.sourcePath != null)
                message.sourcePath = String(object.sourcePath);
            if (object.destinationPath != null)
                message.destinationPath = String(object.destinationPath);
            if (object.error != null)
                message.error = String(object.error);
            if (object.size != null)
                if ($util.Long)
                    message.size = $util.Long.fromValue(object.size, true);
                else if (typeof object.size === "string")
                    message.size = parseInt(object.size, 10);
                else if (typeof object.size === "number")
                    message.size = object.size;
                else if (typeof object.size === "object")
                    message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
            if (object.metadata) {
                if (!$util.isObject(object.metadata))
                    throw TypeError(".hermes.FileUplink.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.metadata, keys[i]);
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a FileUplink message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FileUplink
         * @static
         * @param {hermes.FileUplink} message FileUplink
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FileUplink.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.objects || options.defaults)
                object.metadata = {};
            if (options.defaults) {
                object.uid = "";
                object.timeStart = null;
                object.timeEnd = null;
                object.fswId = "";
                object.sourcePath = "";
                object.destinationPath = "";
                object.error = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.size = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
            }
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                object.uid = message.uid;
            if (message.timeStart != null && Object.hasOwnProperty.call(message, "timeStart"))
                object.timeStart = $root.google.protobuf.Timestamp.toObject(message.timeStart, options, q + 1);
            if (message.timeEnd != null && Object.hasOwnProperty.call(message, "timeEnd"))
                object.timeEnd = $root.google.protobuf.Timestamp.toObject(message.timeEnd, options, q + 1);
            if (message.fswId != null && Object.hasOwnProperty.call(message, "fswId"))
                object.fswId = message.fswId;
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                object.sourcePath = message.sourcePath;
            if (message.destinationPath != null && Object.hasOwnProperty.call(message, "destinationPath"))
                object.destinationPath = message.destinationPath;
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                object.error = message.error;
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.size = typeof message.size === "number" ? BigInt(message.size) : $util.Long.fromBits(message.size.low >>> 0, message.size.high >>> 0, true).toBigInt();
                else if (typeof message.size === "number")
                    object.size = options.longs === String ? String(message.size) : message.size;
                else
                    object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.metadata, keys2[j]);
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
                }
            }
            return object;
        };

        /**
         * Converts this FileUplink to JSON.
         * @function toJSON
         * @memberof hermes.FileUplink
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FileUplink.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FileUplink
         * @function getTypeUrl
         * @memberof hermes.FileUplink
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FileUplink.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FileUplink";
        };

        return FileUplink;
    })();

    hermes.FileTransfer = (function() {

        /**
         * Properties of a FileTransfer.
         * @memberof hermes
         * @interface IFileTransfer
         * @property {string|null} [uid] FileTransfer uid
         * @property {string|null} [fswId] FileTransfer fswId
         * @property {string|null} [sourcePath] FileTransfer sourcePath
         * @property {string|null} [targetPath] FileTransfer targetPath
         * @property {number|Long|null} [size] FileTransfer size
         * @property {number|Long|null} [progress] FileTransfer progress
         */

        /**
         * Constructs a new FileTransfer.
         * @memberof hermes
         * @classdesc Represents a FileTransfer.
         * @implements IFileTransfer
         * @constructor
         * @param {hermes.IFileTransfer=} [properties] Properties to set
         */
        function FileTransfer(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FileTransfer uid.
         * @member {string} uid
         * @memberof hermes.FileTransfer
         * @instance
         */
        FileTransfer.prototype.uid = "";

        /**
         * FileTransfer fswId.
         * @member {string} fswId
         * @memberof hermes.FileTransfer
         * @instance
         */
        FileTransfer.prototype.fswId = "";

        /**
         * FileTransfer sourcePath.
         * @member {string} sourcePath
         * @memberof hermes.FileTransfer
         * @instance
         */
        FileTransfer.prototype.sourcePath = "";

        /**
         * FileTransfer targetPath.
         * @member {string} targetPath
         * @memberof hermes.FileTransfer
         * @instance
         */
        FileTransfer.prototype.targetPath = "";

        /**
         * FileTransfer size.
         * @member {number|Long} size
         * @memberof hermes.FileTransfer
         * @instance
         */
        FileTransfer.prototype.size = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FileTransfer progress.
         * @member {number|Long} progress
         * @memberof hermes.FileTransfer
         * @instance
         */
        FileTransfer.prototype.progress = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new FileTransfer instance using the specified properties.
         * @function create
         * @memberof hermes.FileTransfer
         * @static
         * @param {hermes.IFileTransfer=} [properties] Properties to set
         * @returns {hermes.FileTransfer} FileTransfer instance
         */
        FileTransfer.create = function create(properties) {
            return new FileTransfer(properties);
        };

        /**
         * Encodes the specified FileTransfer message. Does not implicitly {@link hermes.FileTransfer.verify|verify} messages.
         * @function encode
         * @memberof hermes.FileTransfer
         * @static
         * @param {hermes.IFileTransfer} message FileTransfer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileTransfer.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
            if (message.fswId != null && Object.hasOwnProperty.call(message, "fswId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.fswId);
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.sourcePath);
            if (message.targetPath != null && Object.hasOwnProperty.call(message, "targetPath"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.targetPath);
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.size);
            if (message.progress != null && Object.hasOwnProperty.call(message, "progress"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.progress);
            return writer;
        };

        /**
         * Encodes the specified FileTransfer message, length delimited. Does not implicitly {@link hermes.FileTransfer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FileTransfer
         * @static
         * @param {hermes.IFileTransfer} message FileTransfer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileTransfer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FileTransfer message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FileTransfer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FileTransfer} FileTransfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileTransfer.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileTransfer();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.uid = reader.string();
                        break;
                    }
                case 2: {
                        message.fswId = reader.string();
                        break;
                    }
                case 3: {
                        message.sourcePath = reader.string();
                        break;
                    }
                case 4: {
                        message.targetPath = reader.string();
                        break;
                    }
                case 5: {
                        message.size = reader.uint64();
                        break;
                    }
                case 6: {
                        message.progress = reader.uint64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FileTransfer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FileTransfer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FileTransfer} FileTransfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileTransfer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FileTransfer message.
         * @function verify
         * @memberof hermes.FileTransfer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FileTransfer.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.fswId != null && Object.hasOwnProperty.call(message, "fswId"))
                if (!$util.isString(message.fswId))
                    return "fswId: string expected";
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                if (!$util.isString(message.sourcePath))
                    return "sourcePath: string expected";
            if (message.targetPath != null && Object.hasOwnProperty.call(message, "targetPath"))
                if (!$util.isString(message.targetPath))
                    return "targetPath: string expected";
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                    return "size: integer|Long expected";
            if (message.progress != null && Object.hasOwnProperty.call(message, "progress"))
                if (!$util.isInteger(message.progress) && !(message.progress && $util.isInteger(message.progress.low) && $util.isInteger(message.progress.high)))
                    return "progress: integer|Long expected";
            return null;
        };

        /**
         * Creates a FileTransfer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FileTransfer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FileTransfer} FileTransfer
         */
        FileTransfer.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FileTransfer)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FileTransfer: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FileTransfer();
            if (object.uid != null)
                message.uid = String(object.uid);
            if (object.fswId != null)
                message.fswId = String(object.fswId);
            if (object.sourcePath != null)
                message.sourcePath = String(object.sourcePath);
            if (object.targetPath != null)
                message.targetPath = String(object.targetPath);
            if (object.size != null)
                if ($util.Long)
                    message.size = $util.Long.fromValue(object.size, true);
                else if (typeof object.size === "string")
                    message.size = parseInt(object.size, 10);
                else if (typeof object.size === "number")
                    message.size = object.size;
                else if (typeof object.size === "object")
                    message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
            if (object.progress != null)
                if ($util.Long)
                    message.progress = $util.Long.fromValue(object.progress, true);
                else if (typeof object.progress === "string")
                    message.progress = parseInt(object.progress, 10);
                else if (typeof object.progress === "number")
                    message.progress = object.progress;
                else if (typeof object.progress === "object")
                    message.progress = new $util.LongBits(object.progress.low >>> 0, object.progress.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a FileTransfer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FileTransfer
         * @static
         * @param {hermes.FileTransfer} message FileTransfer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FileTransfer.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.uid = "";
                object.fswId = "";
                object.sourcePath = "";
                object.targetPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.size = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.progress = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.progress = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
            }
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                object.uid = message.uid;
            if (message.fswId != null && Object.hasOwnProperty.call(message, "fswId"))
                object.fswId = message.fswId;
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                object.sourcePath = message.sourcePath;
            if (message.targetPath != null && Object.hasOwnProperty.call(message, "targetPath"))
                object.targetPath = message.targetPath;
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.size = typeof message.size === "number" ? BigInt(message.size) : $util.Long.fromBits(message.size.low >>> 0, message.size.high >>> 0, true).toBigInt();
                else if (typeof message.size === "number")
                    object.size = options.longs === String ? String(message.size) : message.size;
                else
                    object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
            if (message.progress != null && Object.hasOwnProperty.call(message, "progress"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.progress = typeof message.progress === "number" ? BigInt(message.progress) : $util.Long.fromBits(message.progress.low >>> 0, message.progress.high >>> 0, true).toBigInt();
                else if (typeof message.progress === "number")
                    object.progress = options.longs === String ? String(message.progress) : message.progress;
                else
                    object.progress = options.longs === String ? $util.Long.prototype.toString.call(message.progress) : options.longs === Number ? new $util.LongBits(message.progress.low >>> 0, message.progress.high >>> 0).toNumber(true) : message.progress;
            return object;
        };

        /**
         * Converts this FileTransfer to JSON.
         * @function toJSON
         * @memberof hermes.FileTransfer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FileTransfer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FileTransfer
         * @function getTypeUrl
         * @memberof hermes.FileTransfer
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FileTransfer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FileTransfer";
        };

        return FileTransfer;
    })();

    hermes.FileTransferState = (function() {

        /**
         * Properties of a FileTransferState.
         * @memberof hermes
         * @interface IFileTransferState
         * @property {Array.<hermes.IFileDownlink>|null} [downlinkCompleted] FileTransferState downlinkCompleted
         * @property {Array.<hermes.IFileUplink>|null} [uplinkCompleted] FileTransferState uplinkCompleted
         * @property {Array.<hermes.IFileTransfer>|null} [downlinkInProgress] FileTransferState downlinkInProgress
         * @property {Array.<hermes.IFileTransfer>|null} [uplinkInProgress] FileTransferState uplinkInProgress
         */

        /**
         * Constructs a new FileTransferState.
         * @memberof hermes
         * @classdesc Represents a FileTransferState.
         * @implements IFileTransferState
         * @constructor
         * @param {hermes.IFileTransferState=} [properties] Properties to set
         */
        function FileTransferState(properties) {
            this.downlinkCompleted = [];
            this.uplinkCompleted = [];
            this.downlinkInProgress = [];
            this.uplinkInProgress = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FileTransferState downlinkCompleted.
         * @member {Array.<hermes.IFileDownlink>} downlinkCompleted
         * @memberof hermes.FileTransferState
         * @instance
         */
        FileTransferState.prototype.downlinkCompleted = $util.emptyArray;

        /**
         * FileTransferState uplinkCompleted.
         * @member {Array.<hermes.IFileUplink>} uplinkCompleted
         * @memberof hermes.FileTransferState
         * @instance
         */
        FileTransferState.prototype.uplinkCompleted = $util.emptyArray;

        /**
         * FileTransferState downlinkInProgress.
         * @member {Array.<hermes.IFileTransfer>} downlinkInProgress
         * @memberof hermes.FileTransferState
         * @instance
         */
        FileTransferState.prototype.downlinkInProgress = $util.emptyArray;

        /**
         * FileTransferState uplinkInProgress.
         * @member {Array.<hermes.IFileTransfer>} uplinkInProgress
         * @memberof hermes.FileTransferState
         * @instance
         */
        FileTransferState.prototype.uplinkInProgress = $util.emptyArray;

        /**
         * Creates a new FileTransferState instance using the specified properties.
         * @function create
         * @memberof hermes.FileTransferState
         * @static
         * @param {hermes.IFileTransferState=} [properties] Properties to set
         * @returns {hermes.FileTransferState} FileTransferState instance
         */
        FileTransferState.create = function create(properties) {
            return new FileTransferState(properties);
        };

        /**
         * Encodes the specified FileTransferState message. Does not implicitly {@link hermes.FileTransferState.verify|verify} messages.
         * @function encode
         * @memberof hermes.FileTransferState
         * @static
         * @param {hermes.IFileTransferState} message FileTransferState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileTransferState.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.downlinkCompleted != null && message.downlinkCompleted.length)
                for (var i = 0; i < message.downlinkCompleted.length; ++i)
                    $root.hermes.FileDownlink.encode(message.downlinkCompleted[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
            if (message.uplinkCompleted != null && message.uplinkCompleted.length)
                for (var i = 0; i < message.uplinkCompleted.length; ++i)
                    $root.hermes.FileUplink.encode(message.uplinkCompleted[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
            if (message.downlinkInProgress != null && message.downlinkInProgress.length)
                for (var i = 0; i < message.downlinkInProgress.length; ++i)
                    $root.hermes.FileTransfer.encode(message.downlinkInProgress[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
            if (message.uplinkInProgress != null && message.uplinkInProgress.length)
                for (var i = 0; i < message.uplinkInProgress.length; ++i)
                    $root.hermes.FileTransfer.encode(message.uplinkInProgress[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FileTransferState message, length delimited. Does not implicitly {@link hermes.FileTransferState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FileTransferState
         * @static
         * @param {hermes.IFileTransferState} message FileTransferState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileTransferState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FileTransferState message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FileTransferState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FileTransferState} FileTransferState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileTransferState.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileTransferState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.downlinkCompleted && message.downlinkCompleted.length))
                            message.downlinkCompleted = [];
                        message.downlinkCompleted.push($root.hermes.FileDownlink.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                case 2: {
                        if (!(message.uplinkCompleted && message.uplinkCompleted.length))
                            message.uplinkCompleted = [];
                        message.uplinkCompleted.push($root.hermes.FileUplink.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                case 3: {
                        if (!(message.downlinkInProgress && message.downlinkInProgress.length))
                            message.downlinkInProgress = [];
                        message.downlinkInProgress.push($root.hermes.FileTransfer.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                case 4: {
                        if (!(message.uplinkInProgress && message.uplinkInProgress.length))
                            message.uplinkInProgress = [];
                        message.uplinkInProgress.push($root.hermes.FileTransfer.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FileTransferState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FileTransferState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FileTransferState} FileTransferState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileTransferState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FileTransferState message.
         * @function verify
         * @memberof hermes.FileTransferState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FileTransferState.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.downlinkCompleted != null && Object.hasOwnProperty.call(message, "downlinkCompleted")) {
                if (!Array.isArray(message.downlinkCompleted))
                    return "downlinkCompleted: array expected";
                for (var i = 0; i < message.downlinkCompleted.length; ++i) {
                    var error = $root.hermes.FileDownlink.verify(message.downlinkCompleted[i], long + 1);
                    if (error)
                        return "downlinkCompleted." + error;
                }
            }
            if (message.uplinkCompleted != null && Object.hasOwnProperty.call(message, "uplinkCompleted")) {
                if (!Array.isArray(message.uplinkCompleted))
                    return "uplinkCompleted: array expected";
                for (var i = 0; i < message.uplinkCompleted.length; ++i) {
                    var error = $root.hermes.FileUplink.verify(message.uplinkCompleted[i], long + 1);
                    if (error)
                        return "uplinkCompleted." + error;
                }
            }
            if (message.downlinkInProgress != null && Object.hasOwnProperty.call(message, "downlinkInProgress")) {
                if (!Array.isArray(message.downlinkInProgress))
                    return "downlinkInProgress: array expected";
                for (var i = 0; i < message.downlinkInProgress.length; ++i) {
                    var error = $root.hermes.FileTransfer.verify(message.downlinkInProgress[i], long + 1);
                    if (error)
                        return "downlinkInProgress." + error;
                }
            }
            if (message.uplinkInProgress != null && Object.hasOwnProperty.call(message, "uplinkInProgress")) {
                if (!Array.isArray(message.uplinkInProgress))
                    return "uplinkInProgress: array expected";
                for (var i = 0; i < message.uplinkInProgress.length; ++i) {
                    var error = $root.hermes.FileTransfer.verify(message.uplinkInProgress[i], long + 1);
                    if (error)
                        return "uplinkInProgress." + error;
                }
            }
            return null;
        };

        /**
         * Creates a FileTransferState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FileTransferState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FileTransferState} FileTransferState
         */
        FileTransferState.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FileTransferState)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FileTransferState: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FileTransferState();
            if (object.downlinkCompleted) {
                if (!Array.isArray(object.downlinkCompleted))
                    throw TypeError(".hermes.FileTransferState.downlinkCompleted: array expected");
                message.downlinkCompleted = [];
                for (var i = 0; i < object.downlinkCompleted.length; ++i) {
                    if (!$util.isObject(object.downlinkCompleted[i]))
                        throw TypeError(".hermes.FileTransferState.downlinkCompleted: object expected");
                    message.downlinkCompleted[i] = $root.hermes.FileDownlink.fromObject(object.downlinkCompleted[i], long + 1);
                }
            }
            if (object.uplinkCompleted) {
                if (!Array.isArray(object.uplinkCompleted))
                    throw TypeError(".hermes.FileTransferState.uplinkCompleted: array expected");
                message.uplinkCompleted = [];
                for (var i = 0; i < object.uplinkCompleted.length; ++i) {
                    if (!$util.isObject(object.uplinkCompleted[i]))
                        throw TypeError(".hermes.FileTransferState.uplinkCompleted: object expected");
                    message.uplinkCompleted[i] = $root.hermes.FileUplink.fromObject(object.uplinkCompleted[i], long + 1);
                }
            }
            if (object.downlinkInProgress) {
                if (!Array.isArray(object.downlinkInProgress))
                    throw TypeError(".hermes.FileTransferState.downlinkInProgress: array expected");
                message.downlinkInProgress = [];
                for (var i = 0; i < object.downlinkInProgress.length; ++i) {
                    if (!$util.isObject(object.downlinkInProgress[i]))
                        throw TypeError(".hermes.FileTransferState.downlinkInProgress: object expected");
                    message.downlinkInProgress[i] = $root.hermes.FileTransfer.fromObject(object.downlinkInProgress[i], long + 1);
                }
            }
            if (object.uplinkInProgress) {
                if (!Array.isArray(object.uplinkInProgress))
                    throw TypeError(".hermes.FileTransferState.uplinkInProgress: array expected");
                message.uplinkInProgress = [];
                for (var i = 0; i < object.uplinkInProgress.length; ++i) {
                    if (!$util.isObject(object.uplinkInProgress[i]))
                        throw TypeError(".hermes.FileTransferState.uplinkInProgress: object expected");
                    message.uplinkInProgress[i] = $root.hermes.FileTransfer.fromObject(object.uplinkInProgress[i], long + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a FileTransferState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FileTransferState
         * @static
         * @param {hermes.FileTransferState} message FileTransferState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FileTransferState.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults) {
                object.downlinkCompleted = [];
                object.uplinkCompleted = [];
                object.downlinkInProgress = [];
                object.uplinkInProgress = [];
            }
            if (message.downlinkCompleted && message.downlinkCompleted.length) {
                object.downlinkCompleted = [];
                for (var j = 0; j < message.downlinkCompleted.length; ++j)
                    object.downlinkCompleted[j] = $root.hermes.FileDownlink.toObject(message.downlinkCompleted[j], options, q + 1);
            }
            if (message.uplinkCompleted && message.uplinkCompleted.length) {
                object.uplinkCompleted = [];
                for (var j = 0; j < message.uplinkCompleted.length; ++j)
                    object.uplinkCompleted[j] = $root.hermes.FileUplink.toObject(message.uplinkCompleted[j], options, q + 1);
            }
            if (message.downlinkInProgress && message.downlinkInProgress.length) {
                object.downlinkInProgress = [];
                for (var j = 0; j < message.downlinkInProgress.length; ++j)
                    object.downlinkInProgress[j] = $root.hermes.FileTransfer.toObject(message.downlinkInProgress[j], options, q + 1);
            }
            if (message.uplinkInProgress && message.uplinkInProgress.length) {
                object.uplinkInProgress = [];
                for (var j = 0; j < message.uplinkInProgress.length; ++j)
                    object.uplinkInProgress[j] = $root.hermes.FileTransfer.toObject(message.uplinkInProgress[j], options, q + 1);
            }
            return object;
        };

        /**
         * Converts this FileTransferState to JSON.
         * @function toJSON
         * @memberof hermes.FileTransferState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FileTransferState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FileTransferState
         * @function getTypeUrl
         * @memberof hermes.FileTransferState
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FileTransferState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FileTransferState";
        };

        return FileTransferState;
    })();

    hermes.ParameterDef = (function() {

        /**
         * Properties of a ParameterDef.
         * @memberof hermes
         * @interface IParameterDef
         * @property {number|null} [id] ParameterDef id
         * @property {string|null} [component] Component or module that owns this parameter
         * @property {string|null} [name] Name of the parameter
         * Scoped by its component
         * @property {hermes.IType|null} [type] ParameterDef type
         * @property {string|null} [metadata] ParameterDef metadata
         */

        /**
         * Constructs a new ParameterDef.
         * @memberof hermes
         * @classdesc Represents a ParameterDef.
         * @implements IParameterDef
         * @constructor
         * @param {hermes.IParameterDef=} [properties] Properties to set
         */
        function ParameterDef(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ParameterDef id.
         * @member {number} id
         * @memberof hermes.ParameterDef
         * @instance
         */
        ParameterDef.prototype.id = 0;

        /**
         * Component or module that owns this parameter
         * @member {string} component
         * @memberof hermes.ParameterDef
         * @instance
         */
        ParameterDef.prototype.component = "";

        /**
         * Name of the parameter
         * Scoped by its component
         * @member {string} name
         * @memberof hermes.ParameterDef
         * @instance
         */
        ParameterDef.prototype.name = "";

        /**
         * ParameterDef type.
         * @member {hermes.IType|null|undefined} type
         * @memberof hermes.ParameterDef
         * @instance
         */
        ParameterDef.prototype.type = null;

        /**
         * ParameterDef metadata.
         * @member {string} metadata
         * @memberof hermes.ParameterDef
         * @instance
         */
        ParameterDef.prototype.metadata = "";

        /**
         * Creates a new ParameterDef instance using the specified properties.
         * @function create
         * @memberof hermes.ParameterDef
         * @static
         * @param {hermes.IParameterDef=} [properties] Properties to set
         * @returns {hermes.ParameterDef} ParameterDef instance
         */
        ParameterDef.create = function create(properties) {
            return new ParameterDef(properties);
        };

        /**
         * Encodes the specified ParameterDef message. Does not implicitly {@link hermes.ParameterDef.verify|verify} messages.
         * @function encode
         * @memberof hermes.ParameterDef
         * @static
         * @param {hermes.IParameterDef} message ParameterDef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ParameterDef.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.component);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                $root.hermes.Type.encode(message.type, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.metadata);
            return writer;
        };

        /**
         * Encodes the specified ParameterDef message, length delimited. Does not implicitly {@link hermes.ParameterDef.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ParameterDef
         * @static
         * @param {hermes.IParameterDef} message ParameterDef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ParameterDef.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ParameterDef message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ParameterDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ParameterDef} ParameterDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ParameterDef.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ParameterDef();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.int32();
                        break;
                    }
                case 2: {
                        message.component = reader.string();
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.type = $root.hermes.Type.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 5: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ParameterDef message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ParameterDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ParameterDef} ParameterDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ParameterDef.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ParameterDef message.
         * @function verify
         * @memberof hermes.ParameterDef
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ParameterDef.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.type != null && Object.hasOwnProperty.call(message, "type")) {
                var error = $root.hermes.Type.verify(message.type, long + 1);
                if (error)
                    return "type." + error;
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            return null;
        };

        /**
         * Creates a ParameterDef message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ParameterDef
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ParameterDef} ParameterDef
         */
        ParameterDef.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.ParameterDef)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.ParameterDef: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.ParameterDef();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.component != null)
                message.component = String(object.component);
            if (object.name != null)
                message.name = String(object.name);
            if (object.type != null) {
                if (!$util.isObject(object.type))
                    throw TypeError(".hermes.ParameterDef.type: object expected");
                message.type = $root.hermes.Type.fromObject(object.type, long + 1);
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            return message;
        };

        /**
         * Creates a plain object from a ParameterDef message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ParameterDef
         * @static
         * @param {hermes.ParameterDef} message ParameterDef
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ParameterDef.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.component = "";
                object.name = "";
                object.type = null;
                object.metadata = "";
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                object.component = message.component;
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                object.type = $root.hermes.Type.toObject(message.type, options, q + 1);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                object.metadata = message.metadata;
            return object;
        };

        /**
         * Converts this ParameterDef to JSON.
         * @function toJSON
         * @memberof hermes.ParameterDef
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ParameterDef.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ParameterDef
         * @function getTypeUrl
         * @memberof hermes.ParameterDef
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ParameterDef.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ParameterDef";
        };

        return ParameterDef;
    })();

    hermes.CommandDef = (function() {

        /**
         * Properties of a CommandDef.
         * @memberof hermes
         * @interface ICommandDef
         * @property {number|null} [opcode] CommandDef opcode
         * @property {string|null} [mnemonic] Mnemonic command used to identify this command.
         * FSW may or may not include the module name in the mnemonic and its
         * up to the language parsing software to identify the proper command from mnemonic information.
         * 
         * This may have varying meaning across missions
         * @property {string|null} [component] Parent component or module owning this command
         * @property {Array.<hermes.IField>|null} ["arguments"] Command arguments
         * @property {string|null} [metadata] CommandDef metadata
         */

        /**
         * Constructs a new CommandDef.
         * @memberof hermes
         * @classdesc Represents a CommandDef.
         * @implements ICommandDef
         * @constructor
         * @param {hermes.ICommandDef=} [properties] Properties to set
         */
        function CommandDef(properties) {
            this["arguments"] = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommandDef opcode.
         * @member {number} opcode
         * @memberof hermes.CommandDef
         * @instance
         */
        CommandDef.prototype.opcode = 0;

        /**
         * Mnemonic command used to identify this command.
         * FSW may or may not include the module name in the mnemonic and its
         * up to the language parsing software to identify the proper command from mnemonic information.
         * 
         * This may have varying meaning across missions
         * @member {string} mnemonic
         * @memberof hermes.CommandDef
         * @instance
         */
        CommandDef.prototype.mnemonic = "";

        /**
         * Parent component or module owning this command
         * @member {string} component
         * @memberof hermes.CommandDef
         * @instance
         */
        CommandDef.prototype.component = "";

        /**
         * Command arguments
         * @member {Array.<hermes.IField>} arguments
         * @memberof hermes.CommandDef
         * @instance
         */
        CommandDef.prototype["arguments"] = $util.emptyArray;

        /**
         * CommandDef metadata.
         * @member {string} metadata
         * @memberof hermes.CommandDef
         * @instance
         */
        CommandDef.prototype.metadata = "";

        /**
         * Creates a new CommandDef instance using the specified properties.
         * @function create
         * @memberof hermes.CommandDef
         * @static
         * @param {hermes.ICommandDef=} [properties] Properties to set
         * @returns {hermes.CommandDef} CommandDef instance
         */
        CommandDef.create = function create(properties) {
            return new CommandDef(properties);
        };

        /**
         * Encodes the specified CommandDef message. Does not implicitly {@link hermes.CommandDef.verify|verify} messages.
         * @function encode
         * @memberof hermes.CommandDef
         * @static
         * @param {hermes.ICommandDef} message CommandDef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommandDef.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.opcode != null && Object.hasOwnProperty.call(message, "opcode"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.opcode);
            if (message.mnemonic != null && Object.hasOwnProperty.call(message, "mnemonic"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.mnemonic);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.component);
            if (message["arguments"] != null && message["arguments"].length)
                for (var i = 0; i < message["arguments"].length; ++i)
                    $root.hermes.Field.encode(message["arguments"][i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.metadata);
            return writer;
        };

        /**
         * Encodes the specified CommandDef message, length delimited. Does not implicitly {@link hermes.CommandDef.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.CommandDef
         * @static
         * @param {hermes.ICommandDef} message CommandDef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommandDef.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommandDef message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.CommandDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.CommandDef} CommandDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommandDef.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.CommandDef();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.opcode = reader.int32();
                        break;
                    }
                case 2: {
                        message.mnemonic = reader.string();
                        break;
                    }
                case 3: {
                        message.component = reader.string();
                        break;
                    }
                case 4: {
                        if (!(message["arguments"] && message["arguments"].length))
                            message["arguments"] = [];
                        message["arguments"].push($root.hermes.Field.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                case 5: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommandDef message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.CommandDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.CommandDef} CommandDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommandDef.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommandDef message.
         * @function verify
         * @memberof hermes.CommandDef
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommandDef.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.opcode != null && Object.hasOwnProperty.call(message, "opcode"))
                if (!$util.isInteger(message.opcode))
                    return "opcode: integer expected";
            if (message.mnemonic != null && Object.hasOwnProperty.call(message, "mnemonic"))
                if (!$util.isString(message.mnemonic))
                    return "mnemonic: string expected";
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message["arguments"] != null && Object.hasOwnProperty.call(message, "arguments")) {
                if (!Array.isArray(message["arguments"]))
                    return "arguments: array expected";
                for (var i = 0; i < message["arguments"].length; ++i) {
                    var error = $root.hermes.Field.verify(message["arguments"][i], long + 1);
                    if (error)
                        return "arguments." + error;
                }
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            return null;
        };

        /**
         * Creates a CommandDef message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.CommandDef
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.CommandDef} CommandDef
         */
        CommandDef.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.CommandDef)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.CommandDef: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.CommandDef();
            if (object.opcode != null)
                message.opcode = object.opcode | 0;
            if (object.mnemonic != null)
                message.mnemonic = String(object.mnemonic);
            if (object.component != null)
                message.component = String(object.component);
            if (object["arguments"]) {
                if (!Array.isArray(object["arguments"]))
                    throw TypeError(".hermes.CommandDef.arguments: array expected");
                message["arguments"] = [];
                for (var i = 0; i < object["arguments"].length; ++i) {
                    if (!$util.isObject(object["arguments"][i]))
                        throw TypeError(".hermes.CommandDef.arguments: object expected");
                    message["arguments"][i] = $root.hermes.Field.fromObject(object["arguments"][i], long + 1);
                }
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            return message;
        };

        /**
         * Creates a plain object from a CommandDef message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.CommandDef
         * @static
         * @param {hermes.CommandDef} message CommandDef
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommandDef.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults)
                object["arguments"] = [];
            if (options.defaults) {
                object.opcode = 0;
                object.mnemonic = "";
                object.component = "";
                object.metadata = "";
            }
            if (message.opcode != null && Object.hasOwnProperty.call(message, "opcode"))
                object.opcode = message.opcode;
            if (message.mnemonic != null && Object.hasOwnProperty.call(message, "mnemonic"))
                object.mnemonic = message.mnemonic;
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                object.component = message.component;
            if (message["arguments"] && message["arguments"].length) {
                object["arguments"] = [];
                for (var j = 0; j < message["arguments"].length; ++j)
                    object["arguments"][j] = $root.hermes.Field.toObject(message["arguments"][j], options, q + 1);
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                object.metadata = message.metadata;
            return object;
        };

        /**
         * Converts this CommandDef to JSON.
         * @function toJSON
         * @memberof hermes.CommandDef
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommandDef.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CommandDef
         * @function getTypeUrl
         * @memberof hermes.CommandDef
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CommandDef.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.CommandDef";
        };

        return CommandDef;
    })();

    /**
     * EvrSeverity enum.
     * @name hermes.EvrSeverity
     * @enum {number}
     * @property {number} EVR_DIAGNOSTIC=0 EVR_DIAGNOSTIC value
     * @property {number} EVR_ACTIVITY_LOW=1 EVR_ACTIVITY_LOW value
     * @property {number} EVR_ACTIVITY_HIGH=2 EVR_ACTIVITY_HIGH value
     * @property {number} EVR_WARNING_LOW=3 EVR_WARNING_LOW value
     * @property {number} EVR_WARNING_HIGH=4 EVR_WARNING_HIGH value
     * @property {number} EVR_COMMAND=5 EVR_COMMAND value
     * @property {number} EVR_FATAL=6 EVR_FATAL value
     */
    hermes.EvrSeverity = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "EVR_DIAGNOSTIC"] = 0;
        values[valuesById[1] = "EVR_ACTIVITY_LOW"] = 1;
        values[valuesById[2] = "EVR_ACTIVITY_HIGH"] = 2;
        values[valuesById[3] = "EVR_WARNING_LOW"] = 3;
        values[valuesById[4] = "EVR_WARNING_HIGH"] = 4;
        values[valuesById[5] = "EVR_COMMAND"] = 5;
        values[valuesById[6] = "EVR_FATAL"] = 6;
        return values;
    })();

    /**
     * FormatSpecifierType enum.
     * @name hermes.FormatSpecifierType
     * @enum {number}
     * @property {number} FMT_DEFAULT=0 FMT_DEFAULT value
     * @property {number} FMT_CHAR=1 FMT_CHAR value
     * @property {number} FMT_DECIMAL=2 FMT_DECIMAL value
     * @property {number} FMT_HEX_LOWER=3 FMT_HEX_LOWER value
     * @property {number} FMT_HEX_UPPER=4 FMT_HEX_UPPER value
     * @property {number} FMT_OCTAL=5 FMT_OCTAL value
     * @property {number} FMT_EXP_LOWER=6 FMT_EXP_LOWER value
     * @property {number} FMT_EXP_UPPER=7 FMT_EXP_UPPER value
     * @property {number} FMT_FIXED_LOWER=8 FMT_FIXED_LOWER value
     * @property {number} FMT_FIXED_UPPER=9 FMT_FIXED_UPPER value
     * @property {number} FMT_GENERAL_LOWER=10 FMT_GENERAL_LOWER value
     * @property {number} FMT_GENERAL_UPPER=11 FMT_GENERAL_UPPER value
     */
    hermes.FormatSpecifierType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "FMT_DEFAULT"] = 0;
        values[valuesById[1] = "FMT_CHAR"] = 1;
        values[valuesById[2] = "FMT_DECIMAL"] = 2;
        values[valuesById[3] = "FMT_HEX_LOWER"] = 3;
        values[valuesById[4] = "FMT_HEX_UPPER"] = 4;
        values[valuesById[5] = "FMT_OCTAL"] = 5;
        values[valuesById[6] = "FMT_EXP_LOWER"] = 6;
        values[valuesById[7] = "FMT_EXP_UPPER"] = 7;
        values[valuesById[8] = "FMT_FIXED_LOWER"] = 8;
        values[valuesById[9] = "FMT_FIXED_UPPER"] = 9;
        values[valuesById[10] = "FMT_GENERAL_LOWER"] = 10;
        values[valuesById[11] = "FMT_GENERAL_UPPER"] = 11;
        return values;
    })();

    hermes.FormatSpecifier = (function() {

        /**
         * Properties of a FormatSpecifier.
         * @memberof hermes
         * @interface IFormatSpecifier
         * @property {hermes.FormatSpecifierType|null} [type] FormatSpecifier type
         * @property {number|null} [precision] FormatSpecifier precision
         * @property {number|null} [argumentIndex] FormatSpecifier argumentIndex
         */

        /**
         * Constructs a new FormatSpecifier.
         * @memberof hermes
         * @classdesc Represents a FormatSpecifier.
         * @implements IFormatSpecifier
         * @constructor
         * @param {hermes.IFormatSpecifier=} [properties] Properties to set
         */
        function FormatSpecifier(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FormatSpecifier type.
         * @member {hermes.FormatSpecifierType} type
         * @memberof hermes.FormatSpecifier
         * @instance
         */
        FormatSpecifier.prototype.type = 0;

        /**
         * FormatSpecifier precision.
         * @member {number|null|undefined} precision
         * @memberof hermes.FormatSpecifier
         * @instance
         */
        FormatSpecifier.prototype.precision = null;

        /**
         * FormatSpecifier argumentIndex.
         * @member {number} argumentIndex
         * @memberof hermes.FormatSpecifier
         * @instance
         */
        FormatSpecifier.prototype.argumentIndex = 0;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * FormatSpecifier _precision.
         * @member {"precision"|undefined} _precision
         * @memberof hermes.FormatSpecifier
         * @instance
         */
        Object.defineProperty(FormatSpecifier.prototype, "_precision", {
            get: $util.oneOfGetter($oneOfFields = ["precision"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new FormatSpecifier instance using the specified properties.
         * @function create
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {hermes.IFormatSpecifier=} [properties] Properties to set
         * @returns {hermes.FormatSpecifier} FormatSpecifier instance
         */
        FormatSpecifier.create = function create(properties) {
            return new FormatSpecifier(properties);
        };

        /**
         * Encodes the specified FormatSpecifier message. Does not implicitly {@link hermes.FormatSpecifier.verify|verify} messages.
         * @function encode
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {hermes.IFormatSpecifier} message FormatSpecifier message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FormatSpecifier.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.precision != null && Object.hasOwnProperty.call(message, "precision"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.precision);
            if (message.argumentIndex != null && Object.hasOwnProperty.call(message, "argumentIndex"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.argumentIndex);
            return writer;
        };

        /**
         * Encodes the specified FormatSpecifier message, length delimited. Does not implicitly {@link hermes.FormatSpecifier.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {hermes.IFormatSpecifier} message FormatSpecifier message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FormatSpecifier.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FormatSpecifier message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FormatSpecifier} FormatSpecifier
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FormatSpecifier.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FormatSpecifier();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.int32();
                        break;
                    }
                case 2: {
                        message.precision = reader.uint32();
                        break;
                    }
                case 3: {
                        message.argumentIndex = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FormatSpecifier message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FormatSpecifier} FormatSpecifier
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FormatSpecifier.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FormatSpecifier message.
         * @function verify
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FormatSpecifier.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            var properties = {};
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    break;
                }
            if (message.precision != null && Object.hasOwnProperty.call(message, "precision")) {
                properties._precision = 1;
                if (!$util.isInteger(message.precision))
                    return "precision: integer expected";
            }
            if (message.argumentIndex != null && Object.hasOwnProperty.call(message, "argumentIndex"))
                if (!$util.isInteger(message.argumentIndex))
                    return "argumentIndex: integer expected";
            return null;
        };

        /**
         * Creates a FormatSpecifier message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FormatSpecifier} FormatSpecifier
         */
        FormatSpecifier.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FormatSpecifier)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FormatSpecifier: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FormatSpecifier();
            switch (object.type) {
            default:
                if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                }
                break;
            case "FMT_DEFAULT":
            case 0:
                message.type = 0;
                break;
            case "FMT_CHAR":
            case 1:
                message.type = 1;
                break;
            case "FMT_DECIMAL":
            case 2:
                message.type = 2;
                break;
            case "FMT_HEX_LOWER":
            case 3:
                message.type = 3;
                break;
            case "FMT_HEX_UPPER":
            case 4:
                message.type = 4;
                break;
            case "FMT_OCTAL":
            case 5:
                message.type = 5;
                break;
            case "FMT_EXP_LOWER":
            case 6:
                message.type = 6;
                break;
            case "FMT_EXP_UPPER":
            case 7:
                message.type = 7;
                break;
            case "FMT_FIXED_LOWER":
            case 8:
                message.type = 8;
                break;
            case "FMT_FIXED_UPPER":
            case 9:
                message.type = 9;
                break;
            case "FMT_GENERAL_LOWER":
            case 10:
                message.type = 10;
                break;
            case "FMT_GENERAL_UPPER":
            case 11:
                message.type = 11;
                break;
            }
            if (object.precision != null)
                message.precision = object.precision >>> 0;
            if (object.argumentIndex != null)
                message.argumentIndex = object.argumentIndex >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a FormatSpecifier message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {hermes.FormatSpecifier} message FormatSpecifier
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FormatSpecifier.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "FMT_DEFAULT" : 0;
                object.argumentIndex = 0;
            }
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                object.type = options.enums === String ? $root.hermes.FormatSpecifierType[message.type] === undefined ? message.type : $root.hermes.FormatSpecifierType[message.type] : message.type;
            if (message.precision != null && Object.hasOwnProperty.call(message, "precision")) {
                object.precision = message.precision;
                if (options.oneofs)
                    object._precision = "precision";
            }
            if (message.argumentIndex != null && Object.hasOwnProperty.call(message, "argumentIndex"))
                object.argumentIndex = message.argumentIndex;
            return object;
        };

        /**
         * Converts this FormatSpecifier to JSON.
         * @function toJSON
         * @memberof hermes.FormatSpecifier
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FormatSpecifier.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FormatSpecifier
         * @function getTypeUrl
         * @memberof hermes.FormatSpecifier
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FormatSpecifier.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FormatSpecifier";
        };

        return FormatSpecifier;
    })();

    hermes.FormatFragment = (function() {

        /**
         * Properties of a FormatFragment.
         * @memberof hermes
         * @interface IFormatFragment
         * @property {string|null} [text] FormatFragment text
         * @property {hermes.IFormatSpecifier|null} [specifier] FormatFragment specifier
         */

        /**
         * Constructs a new FormatFragment.
         * @memberof hermes
         * @classdesc Represents a FormatFragment.
         * @implements IFormatFragment
         * @constructor
         * @param {hermes.IFormatFragment=} [properties] Properties to set
         */
        function FormatFragment(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FormatFragment text.
         * @member {string|null|undefined} text
         * @memberof hermes.FormatFragment
         * @instance
         */
        FormatFragment.prototype.text = null;

        /**
         * FormatFragment specifier.
         * @member {hermes.IFormatSpecifier|null|undefined} specifier
         * @memberof hermes.FormatFragment
         * @instance
         */
        FormatFragment.prototype.specifier = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * FormatFragment fragment.
         * @member {"text"|"specifier"|undefined} fragment
         * @memberof hermes.FormatFragment
         * @instance
         */
        Object.defineProperty(FormatFragment.prototype, "fragment", {
            get: $util.oneOfGetter($oneOfFields = ["text", "specifier"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new FormatFragment instance using the specified properties.
         * @function create
         * @memberof hermes.FormatFragment
         * @static
         * @param {hermes.IFormatFragment=} [properties] Properties to set
         * @returns {hermes.FormatFragment} FormatFragment instance
         */
        FormatFragment.create = function create(properties) {
            return new FormatFragment(properties);
        };

        /**
         * Encodes the specified FormatFragment message. Does not implicitly {@link hermes.FormatFragment.verify|verify} messages.
         * @function encode
         * @memberof hermes.FormatFragment
         * @static
         * @param {hermes.IFormatFragment} message FormatFragment message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FormatFragment.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
            if (message.specifier != null && Object.hasOwnProperty.call(message, "specifier"))
                $root.hermes.FormatSpecifier.encode(message.specifier, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FormatFragment message, length delimited. Does not implicitly {@link hermes.FormatFragment.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FormatFragment
         * @static
         * @param {hermes.IFormatFragment} message FormatFragment message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FormatFragment.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FormatFragment message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FormatFragment
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FormatFragment} FormatFragment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FormatFragment.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FormatFragment();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.text = reader.string();
                        break;
                    }
                case 2: {
                        message.specifier = $root.hermes.FormatSpecifier.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FormatFragment message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FormatFragment
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FormatFragment} FormatFragment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FormatFragment.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FormatFragment message.
         * @function verify
         * @memberof hermes.FormatFragment
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FormatFragment.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            var properties = {};
            if (message.text != null && Object.hasOwnProperty.call(message, "text")) {
                properties.fragment = 1;
                if (!$util.isString(message.text))
                    return "text: string expected";
            }
            if (message.specifier != null && Object.hasOwnProperty.call(message, "specifier")) {
                if (properties.fragment === 1)
                    return "fragment: multiple values";
                properties.fragment = 1;
                {
                    var error = $root.hermes.FormatSpecifier.verify(message.specifier, long + 1);
                    if (error)
                        return "specifier." + error;
                }
            }
            return null;
        };

        /**
         * Creates a FormatFragment message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FormatFragment
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FormatFragment} FormatFragment
         */
        FormatFragment.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FormatFragment)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FormatFragment: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FormatFragment();
            if (object.text != null)
                message.text = String(object.text);
            if (object.specifier != null) {
                if (!$util.isObject(object.specifier))
                    throw TypeError(".hermes.FormatFragment.specifier: object expected");
                message.specifier = $root.hermes.FormatSpecifier.fromObject(object.specifier, long + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a FormatFragment message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FormatFragment
         * @static
         * @param {hermes.FormatFragment} message FormatFragment
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FormatFragment.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (message.text != null && Object.hasOwnProperty.call(message, "text")) {
                object.text = message.text;
                if (options.oneofs)
                    object.fragment = "text";
            }
            if (message.specifier != null && Object.hasOwnProperty.call(message, "specifier")) {
                object.specifier = $root.hermes.FormatSpecifier.toObject(message.specifier, options, q + 1);
                if (options.oneofs)
                    object.fragment = "specifier";
            }
            return object;
        };

        /**
         * Converts this FormatFragment to JSON.
         * @function toJSON
         * @memberof hermes.FormatFragment
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FormatFragment.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FormatFragment
         * @function getTypeUrl
         * @memberof hermes.FormatFragment
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FormatFragment.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FormatFragment";
        };

        return FormatFragment;
    })();

    hermes.FormatString = (function() {

        /**
         * Properties of a FormatString.
         * @memberof hermes
         * @interface IFormatString
         * @property {Array.<hermes.IFormatFragment>|null} [fragments] FormatString fragments
         * @property {string|null} [original] FormatString original
         */

        /**
         * Constructs a new FormatString.
         * @memberof hermes
         * @classdesc Represents a FormatString.
         * @implements IFormatString
         * @constructor
         * @param {hermes.IFormatString=} [properties] Properties to set
         */
        function FormatString(properties) {
            this.fragments = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FormatString fragments.
         * @member {Array.<hermes.IFormatFragment>} fragments
         * @memberof hermes.FormatString
         * @instance
         */
        FormatString.prototype.fragments = $util.emptyArray;

        /**
         * FormatString original.
         * @member {string} original
         * @memberof hermes.FormatString
         * @instance
         */
        FormatString.prototype.original = "";

        /**
         * Creates a new FormatString instance using the specified properties.
         * @function create
         * @memberof hermes.FormatString
         * @static
         * @param {hermes.IFormatString=} [properties] Properties to set
         * @returns {hermes.FormatString} FormatString instance
         */
        FormatString.create = function create(properties) {
            return new FormatString(properties);
        };

        /**
         * Encodes the specified FormatString message. Does not implicitly {@link hermes.FormatString.verify|verify} messages.
         * @function encode
         * @memberof hermes.FormatString
         * @static
         * @param {hermes.IFormatString} message FormatString message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FormatString.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.fragments != null && message.fragments.length)
                for (var i = 0; i < message.fragments.length; ++i)
                    $root.hermes.FormatFragment.encode(message.fragments[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
            if (message.original != null && Object.hasOwnProperty.call(message, "original"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.original);
            return writer;
        };

        /**
         * Encodes the specified FormatString message, length delimited. Does not implicitly {@link hermes.FormatString.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FormatString
         * @static
         * @param {hermes.IFormatString} message FormatString message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FormatString.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FormatString message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FormatString
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FormatString} FormatString
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FormatString.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FormatString();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.fragments && message.fragments.length))
                            message.fragments = [];
                        message.fragments.push($root.hermes.FormatFragment.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                case 2: {
                        message.original = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FormatString message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FormatString
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FormatString} FormatString
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FormatString.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FormatString message.
         * @function verify
         * @memberof hermes.FormatString
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FormatString.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.fragments != null && Object.hasOwnProperty.call(message, "fragments")) {
                if (!Array.isArray(message.fragments))
                    return "fragments: array expected";
                for (var i = 0; i < message.fragments.length; ++i) {
                    var error = $root.hermes.FormatFragment.verify(message.fragments[i], long + 1);
                    if (error)
                        return "fragments." + error;
                }
            }
            if (message.original != null && Object.hasOwnProperty.call(message, "original"))
                if (!$util.isString(message.original))
                    return "original: string expected";
            return null;
        };

        /**
         * Creates a FormatString message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FormatString
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FormatString} FormatString
         */
        FormatString.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FormatString)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FormatString: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FormatString();
            if (object.fragments) {
                if (!Array.isArray(object.fragments))
                    throw TypeError(".hermes.FormatString.fragments: array expected");
                message.fragments = [];
                for (var i = 0; i < object.fragments.length; ++i) {
                    if (!$util.isObject(object.fragments[i]))
                        throw TypeError(".hermes.FormatString.fragments: object expected");
                    message.fragments[i] = $root.hermes.FormatFragment.fromObject(object.fragments[i], long + 1);
                }
            }
            if (object.original != null)
                message.original = String(object.original);
            return message;
        };

        /**
         * Creates a plain object from a FormatString message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FormatString
         * @static
         * @param {hermes.FormatString} message FormatString
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FormatString.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults)
                object.fragments = [];
            if (options.defaults)
                object.original = "";
            if (message.fragments && message.fragments.length) {
                object.fragments = [];
                for (var j = 0; j < message.fragments.length; ++j)
                    object.fragments[j] = $root.hermes.FormatFragment.toObject(message.fragments[j], options, q + 1);
            }
            if (message.original != null && Object.hasOwnProperty.call(message, "original"))
                object.original = message.original;
            return object;
        };

        /**
         * Converts this FormatString to JSON.
         * @function toJSON
         * @memberof hermes.FormatString
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FormatString.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FormatString
         * @function getTypeUrl
         * @memberof hermes.FormatString
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FormatString.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FormatString";
        };

        return FormatString;
    })();

    hermes.EventDef = (function() {

        /**
         * Properties of an EventDef.
         * @memberof hermes
         * @interface IEventDef
         * @property {number|null} [id] EventDef id
         * @property {string|null} [component] Component or module
         * @property {string|null} [name] Name of the EVR.
         * Scoped by its component
         * @property {hermes.EvrSeverity|null} [severity] Log severity usually stored in the FSW event dictionary
         * For the most part this information is not held in the
         * EVR packet since its redundant for ground software.
         * @property {string|null} [formatString] DEPRECATED: Use format instead
         * printf format string that will be formatted via sprintf
         * @property {Array.<hermes.IField>|null} ["arguments"] Arguments used inside the format string
         * @property {string|null} [metadata] EventDef metadata
         * @property {hermes.IFormatString|null} [format] Structured format string with parsed fragments
         */

        /**
         * Constructs a new EventDef.
         * @memberof hermes
         * @classdesc Represents an EventDef.
         * @implements IEventDef
         * @constructor
         * @param {hermes.IEventDef=} [properties] Properties to set
         */
        function EventDef(properties) {
            this["arguments"] = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EventDef id.
         * @member {number} id
         * @memberof hermes.EventDef
         * @instance
         */
        EventDef.prototype.id = 0;

        /**
         * Component or module
         * @member {string} component
         * @memberof hermes.EventDef
         * @instance
         */
        EventDef.prototype.component = "";

        /**
         * Name of the EVR.
         * Scoped by its component
         * @member {string} name
         * @memberof hermes.EventDef
         * @instance
         */
        EventDef.prototype.name = "";

        /**
         * Log severity usually stored in the FSW event dictionary
         * For the most part this information is not held in the
         * EVR packet since its redundant for ground software.
         * @member {hermes.EvrSeverity} severity
         * @memberof hermes.EventDef
         * @instance
         */
        EventDef.prototype.severity = 0;

        /**
         * DEPRECATED: Use format instead
         * printf format string that will be formatted via sprintf
         * @member {string} formatString
         * @memberof hermes.EventDef
         * @instance
         */
        EventDef.prototype.formatString = "";

        /**
         * Arguments used inside the format string
         * @member {Array.<hermes.IField>} arguments
         * @memberof hermes.EventDef
         * @instance
         */
        EventDef.prototype["arguments"] = $util.emptyArray;

        /**
         * EventDef metadata.
         * @member {string} metadata
         * @memberof hermes.EventDef
         * @instance
         */
        EventDef.prototype.metadata = "";

        /**
         * Structured format string with parsed fragments
         * @member {hermes.IFormatString|null|undefined} format
         * @memberof hermes.EventDef
         * @instance
         */
        EventDef.prototype.format = null;

        /**
         * Creates a new EventDef instance using the specified properties.
         * @function create
         * @memberof hermes.EventDef
         * @static
         * @param {hermes.IEventDef=} [properties] Properties to set
         * @returns {hermes.EventDef} EventDef instance
         */
        EventDef.create = function create(properties) {
            return new EventDef(properties);
        };

        /**
         * Encodes the specified EventDef message. Does not implicitly {@link hermes.EventDef.verify|verify} messages.
         * @function encode
         * @memberof hermes.EventDef
         * @static
         * @param {hermes.IEventDef} message EventDef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EventDef.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.component);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.severity != null && Object.hasOwnProperty.call(message, "severity"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.severity);
            if (message.formatString != null && Object.hasOwnProperty.call(message, "formatString"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.formatString);
            if (message["arguments"] != null && message["arguments"].length)
                for (var i = 0; i < message["arguments"].length; ++i)
                    $root.hermes.Field.encode(message["arguments"][i], writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.metadata);
            if (message.format != null && Object.hasOwnProperty.call(message, "format"))
                $root.hermes.FormatString.encode(message.format, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EventDef message, length delimited. Does not implicitly {@link hermes.EventDef.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.EventDef
         * @static
         * @param {hermes.IEventDef} message EventDef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EventDef.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EventDef message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.EventDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.EventDef} EventDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EventDef.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EventDef();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.int32();
                        break;
                    }
                case 2: {
                        message.component = reader.string();
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.severity = reader.int32();
                        break;
                    }
                case 5: {
                        message.formatString = reader.string();
                        break;
                    }
                case 6: {
                        if (!(message["arguments"] && message["arguments"].length))
                            message["arguments"] = [];
                        message["arguments"].push($root.hermes.Field.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                case 7: {
                        message.metadata = reader.string();
                        break;
                    }
                case 8: {
                        message.format = $root.hermes.FormatString.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EventDef message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.EventDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.EventDef} EventDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EventDef.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EventDef message.
         * @function verify
         * @memberof hermes.EventDef
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EventDef.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.severity != null && Object.hasOwnProperty.call(message, "severity"))
                switch (message.severity) {
                default:
                    return "severity: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    break;
                }
            if (message.formatString != null && Object.hasOwnProperty.call(message, "formatString"))
                if (!$util.isString(message.formatString))
                    return "formatString: string expected";
            if (message["arguments"] != null && Object.hasOwnProperty.call(message, "arguments")) {
                if (!Array.isArray(message["arguments"]))
                    return "arguments: array expected";
                for (var i = 0; i < message["arguments"].length; ++i) {
                    var error = $root.hermes.Field.verify(message["arguments"][i], long + 1);
                    if (error)
                        return "arguments." + error;
                }
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            if (message.format != null && Object.hasOwnProperty.call(message, "format")) {
                var error = $root.hermes.FormatString.verify(message.format, long + 1);
                if (error)
                    return "format." + error;
            }
            return null;
        };

        /**
         * Creates an EventDef message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.EventDef
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.EventDef} EventDef
         */
        EventDef.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.EventDef)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.EventDef: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.EventDef();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.component != null)
                message.component = String(object.component);
            if (object.name != null)
                message.name = String(object.name);
            switch (object.severity) {
            default:
                if (typeof object.severity === "number") {
                    message.severity = object.severity;
                    break;
                }
                break;
            case "EVR_DIAGNOSTIC":
            case 0:
                message.severity = 0;
                break;
            case "EVR_ACTIVITY_LOW":
            case 1:
                message.severity = 1;
                break;
            case "EVR_ACTIVITY_HIGH":
            case 2:
                message.severity = 2;
                break;
            case "EVR_WARNING_LOW":
            case 3:
                message.severity = 3;
                break;
            case "EVR_WARNING_HIGH":
            case 4:
                message.severity = 4;
                break;
            case "EVR_COMMAND":
            case 5:
                message.severity = 5;
                break;
            case "EVR_FATAL":
            case 6:
                message.severity = 6;
                break;
            }
            if (object.formatString != null)
                message.formatString = String(object.formatString);
            if (object["arguments"]) {
                if (!Array.isArray(object["arguments"]))
                    throw TypeError(".hermes.EventDef.arguments: array expected");
                message["arguments"] = [];
                for (var i = 0; i < object["arguments"].length; ++i) {
                    if (!$util.isObject(object["arguments"][i]))
                        throw TypeError(".hermes.EventDef.arguments: object expected");
                    message["arguments"][i] = $root.hermes.Field.fromObject(object["arguments"][i], long + 1);
                }
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            if (object.format != null) {
                if (!$util.isObject(object.format))
                    throw TypeError(".hermes.EventDef.format: object expected");
                message.format = $root.hermes.FormatString.fromObject(object.format, long + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from an EventDef message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.EventDef
         * @static
         * @param {hermes.EventDef} message EventDef
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EventDef.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults)
                object["arguments"] = [];
            if (options.defaults) {
                object.id = 0;
                object.component = "";
                object.name = "";
                object.severity = options.enums === String ? "EVR_DIAGNOSTIC" : 0;
                object.formatString = "";
                object.metadata = "";
                object.format = null;
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                object.component = message.component;
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.severity != null && Object.hasOwnProperty.call(message, "severity"))
                object.severity = options.enums === String ? $root.hermes.EvrSeverity[message.severity] === undefined ? message.severity : $root.hermes.EvrSeverity[message.severity] : message.severity;
            if (message.formatString != null && Object.hasOwnProperty.call(message, "formatString"))
                object.formatString = message.formatString;
            if (message["arguments"] && message["arguments"].length) {
                object["arguments"] = [];
                for (var j = 0; j < message["arguments"].length; ++j)
                    object["arguments"][j] = $root.hermes.Field.toObject(message["arguments"][j], options, q + 1);
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                object.metadata = message.metadata;
            if (message.format != null && Object.hasOwnProperty.call(message, "format"))
                object.format = $root.hermes.FormatString.toObject(message.format, options, q + 1);
            return object;
        };

        /**
         * Converts this EventDef to JSON.
         * @function toJSON
         * @memberof hermes.EventDef
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EventDef.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EventDef
         * @function getTypeUrl
         * @memberof hermes.EventDef
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EventDef.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.EventDef";
        };

        return EventDef;
    })();

    hermes.TelemetryDef = (function() {

        /**
         * Properties of a TelemetryDef.
         * @memberof hermes
         * @interface ITelemetryDef
         * @property {number|null} [id] Raw ID used for identifying incoming serialized telemetry
         * @property {string|null} [name] Telemetry name
         * @property {string|null} [component] Component or module that owns this telemetry
         * @property {hermes.IType|null} [type] Serialization type
         * @property {string|null} [metadata] TelemetryDef metadata
         */

        /**
         * Constructs a new TelemetryDef.
         * @memberof hermes
         * @classdesc Represents a TelemetryDef.
         * @implements ITelemetryDef
         * @constructor
         * @param {hermes.ITelemetryDef=} [properties] Properties to set
         */
        function TelemetryDef(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Raw ID used for identifying incoming serialized telemetry
         * @member {number} id
         * @memberof hermes.TelemetryDef
         * @instance
         */
        TelemetryDef.prototype.id = 0;

        /**
         * Telemetry name
         * @member {string} name
         * @memberof hermes.TelemetryDef
         * @instance
         */
        TelemetryDef.prototype.name = "";

        /**
         * Component or module that owns this telemetry
         * @member {string} component
         * @memberof hermes.TelemetryDef
         * @instance
         */
        TelemetryDef.prototype.component = "";

        /**
         * Serialization type
         * @member {hermes.IType|null|undefined} type
         * @memberof hermes.TelemetryDef
         * @instance
         */
        TelemetryDef.prototype.type = null;

        /**
         * TelemetryDef metadata.
         * @member {string} metadata
         * @memberof hermes.TelemetryDef
         * @instance
         */
        TelemetryDef.prototype.metadata = "";

        /**
         * Creates a new TelemetryDef instance using the specified properties.
         * @function create
         * @memberof hermes.TelemetryDef
         * @static
         * @param {hermes.ITelemetryDef=} [properties] Properties to set
         * @returns {hermes.TelemetryDef} TelemetryDef instance
         */
        TelemetryDef.create = function create(properties) {
            return new TelemetryDef(properties);
        };

        /**
         * Encodes the specified TelemetryDef message. Does not implicitly {@link hermes.TelemetryDef.verify|verify} messages.
         * @function encode
         * @memberof hermes.TelemetryDef
         * @static
         * @param {hermes.ITelemetryDef} message TelemetryDef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TelemetryDef.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.component);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                $root.hermes.Type.encode(message.type, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.metadata);
            return writer;
        };

        /**
         * Encodes the specified TelemetryDef message, length delimited. Does not implicitly {@link hermes.TelemetryDef.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.TelemetryDef
         * @static
         * @param {hermes.ITelemetryDef} message TelemetryDef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TelemetryDef.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TelemetryDef message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.TelemetryDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.TelemetryDef} TelemetryDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TelemetryDef.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.TelemetryDef();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.component = reader.string();
                        break;
                    }
                case 4: {
                        message.type = $root.hermes.Type.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 6: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TelemetryDef message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.TelemetryDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.TelemetryDef} TelemetryDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TelemetryDef.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TelemetryDef message.
         * @function verify
         * @memberof hermes.TelemetryDef
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TelemetryDef.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message.type != null && Object.hasOwnProperty.call(message, "type")) {
                var error = $root.hermes.Type.verify(message.type, long + 1);
                if (error)
                    return "type." + error;
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            return null;
        };

        /**
         * Creates a TelemetryDef message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.TelemetryDef
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.TelemetryDef} TelemetryDef
         */
        TelemetryDef.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.TelemetryDef)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.TelemetryDef: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.TelemetryDef();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.component != null)
                message.component = String(object.component);
            if (object.type != null) {
                if (!$util.isObject(object.type))
                    throw TypeError(".hermes.TelemetryDef.type: object expected");
                message.type = $root.hermes.Type.fromObject(object.type, long + 1);
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            return message;
        };

        /**
         * Creates a plain object from a TelemetryDef message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.TelemetryDef
         * @static
         * @param {hermes.TelemetryDef} message TelemetryDef
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TelemetryDef.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.name = "";
                object.component = "";
                object.type = null;
                object.metadata = "";
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                object.component = message.component;
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                object.type = $root.hermes.Type.toObject(message.type, options, q + 1);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                object.metadata = message.metadata;
            return object;
        };

        /**
         * Converts this TelemetryDef to JSON.
         * @function toJSON
         * @memberof hermes.TelemetryDef
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TelemetryDef.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TelemetryDef
         * @function getTypeUrl
         * @memberof hermes.TelemetryDef
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TelemetryDef.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.TelemetryDef";
        };

        return TelemetryDef;
    })();

    hermes.DictionaryHead = (function() {

        /**
         * Properties of a DictionaryHead.
         * @memberof hermes
         * @interface IDictionaryHead
         * @property {string|null} [type] Type associated with the Fsw.type
         * This will filter the user's selection
         * of dictionaries that can be tracked.
         * 
         * This is set by the provider.
         * @property {string|null} [name] DictionaryHead name
         * @property {string|null} [version] DictionaryHead version
         */

        /**
         * Constructs a new DictionaryHead.
         * @memberof hermes
         * @classdesc Represents a DictionaryHead.
         * @implements IDictionaryHead
         * @constructor
         * @param {hermes.IDictionaryHead=} [properties] Properties to set
         */
        function DictionaryHead(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Type associated with the Fsw.type
         * This will filter the user's selection
         * of dictionaries that can be tracked.
         * 
         * This is set by the provider.
         * @member {string} type
         * @memberof hermes.DictionaryHead
         * @instance
         */
        DictionaryHead.prototype.type = "";

        /**
         * DictionaryHead name.
         * @member {string} name
         * @memberof hermes.DictionaryHead
         * @instance
         */
        DictionaryHead.prototype.name = "";

        /**
         * DictionaryHead version.
         * @member {string} version
         * @memberof hermes.DictionaryHead
         * @instance
         */
        DictionaryHead.prototype.version = "";

        /**
         * Creates a new DictionaryHead instance using the specified properties.
         * @function create
         * @memberof hermes.DictionaryHead
         * @static
         * @param {hermes.IDictionaryHead=} [properties] Properties to set
         * @returns {hermes.DictionaryHead} DictionaryHead instance
         */
        DictionaryHead.create = function create(properties) {
            return new DictionaryHead(properties);
        };

        /**
         * Encodes the specified DictionaryHead message. Does not implicitly {@link hermes.DictionaryHead.verify|verify} messages.
         * @function encode
         * @memberof hermes.DictionaryHead
         * @static
         * @param {hermes.IDictionaryHead} message DictionaryHead message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DictionaryHead.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.version);
            return writer;
        };

        /**
         * Encodes the specified DictionaryHead message, length delimited. Does not implicitly {@link hermes.DictionaryHead.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.DictionaryHead
         * @static
         * @param {hermes.IDictionaryHead} message DictionaryHead message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DictionaryHead.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DictionaryHead message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.DictionaryHead
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.DictionaryHead} DictionaryHead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DictionaryHead.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DictionaryHead();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.string();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.version = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DictionaryHead message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.DictionaryHead
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.DictionaryHead} DictionaryHead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DictionaryHead.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DictionaryHead message.
         * @function verify
         * @memberof hermes.DictionaryHead
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DictionaryHead.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            return null;
        };

        /**
         * Creates a DictionaryHead message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.DictionaryHead
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.DictionaryHead} DictionaryHead
         */
        DictionaryHead.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.DictionaryHead)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.DictionaryHead: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.DictionaryHead();
            if (object.type != null)
                message.type = String(object.type);
            if (object.name != null)
                message.name = String(object.name);
            if (object.version != null)
                message.version = String(object.version);
            return message;
        };

        /**
         * Creates a plain object from a DictionaryHead message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.DictionaryHead
         * @static
         * @param {hermes.DictionaryHead} message DictionaryHead
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DictionaryHead.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.type = "";
                object.name = "";
                object.version = "";
            }
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                object.type = message.type;
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                object.version = message.version;
            return object;
        };

        /**
         * Converts this DictionaryHead to JSON.
         * @function toJSON
         * @memberof hermes.DictionaryHead
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DictionaryHead.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DictionaryHead
         * @function getTypeUrl
         * @memberof hermes.DictionaryHead
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DictionaryHead.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.DictionaryHead";
        };

        return DictionaryHead;
    })();

    hermes.DictionaryNamespace = (function() {

        /**
         * Properties of a DictionaryNamespace.
         * @memberof hermes
         * @interface IDictionaryNamespace
         * @property {Object.<string,hermes.ICommandDef>|null} [commands] DictionaryNamespace commands
         * @property {Object.<string,hermes.IEventDef>|null} [events] DictionaryNamespace events
         * @property {Object.<string,hermes.ITelemetryDef>|null} [telemetry] DictionaryNamespace telemetry
         * @property {Object.<string,hermes.IParameterDef>|null} [parameters] DictionaryNamespace parameters
         * @property {Object.<string,hermes.IType>|null} [types] DictionaryNamespace types
         */

        /**
         * Constructs a new DictionaryNamespace.
         * @memberof hermes
         * @classdesc Represents a DictionaryNamespace.
         * @implements IDictionaryNamespace
         * @constructor
         * @param {hermes.IDictionaryNamespace=} [properties] Properties to set
         */
        function DictionaryNamespace(properties) {
            this.commands = {};
            this.events = {};
            this.telemetry = {};
            this.parameters = {};
            this.types = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DictionaryNamespace commands.
         * @member {Object.<string,hermes.ICommandDef>} commands
         * @memberof hermes.DictionaryNamespace
         * @instance
         */
        DictionaryNamespace.prototype.commands = $util.emptyObject;

        /**
         * DictionaryNamespace events.
         * @member {Object.<string,hermes.IEventDef>} events
         * @memberof hermes.DictionaryNamespace
         * @instance
         */
        DictionaryNamespace.prototype.events = $util.emptyObject;

        /**
         * DictionaryNamespace telemetry.
         * @member {Object.<string,hermes.ITelemetryDef>} telemetry
         * @memberof hermes.DictionaryNamespace
         * @instance
         */
        DictionaryNamespace.prototype.telemetry = $util.emptyObject;

        /**
         * DictionaryNamespace parameters.
         * @member {Object.<string,hermes.IParameterDef>} parameters
         * @memberof hermes.DictionaryNamespace
         * @instance
         */
        DictionaryNamespace.prototype.parameters = $util.emptyObject;

        /**
         * DictionaryNamespace types.
         * @member {Object.<string,hermes.IType>} types
         * @memberof hermes.DictionaryNamespace
         * @instance
         */
        DictionaryNamespace.prototype.types = $util.emptyObject;

        /**
         * Creates a new DictionaryNamespace instance using the specified properties.
         * @function create
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {hermes.IDictionaryNamespace=} [properties] Properties to set
         * @returns {hermes.DictionaryNamespace} DictionaryNamespace instance
         */
        DictionaryNamespace.create = function create(properties) {
            return new DictionaryNamespace(properties);
        };

        /**
         * Encodes the specified DictionaryNamespace message. Does not implicitly {@link hermes.DictionaryNamespace.verify|verify} messages.
         * @function encode
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {hermes.IDictionaryNamespace} message DictionaryNamespace message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DictionaryNamespace.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.commands != null && Object.hasOwnProperty.call(message, "commands"))
                for (var keys = Object.keys(message.commands), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.CommandDef.encode(message.commands[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                }
            if (message.events != null && Object.hasOwnProperty.call(message, "events"))
                for (var keys = Object.keys(message.events), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.EventDef.encode(message.events[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                }
            if (message.telemetry != null && Object.hasOwnProperty.call(message, "telemetry"))
                for (var keys = Object.keys(message.telemetry), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.TelemetryDef.encode(message.telemetry[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                }
            if (message.parameters != null && Object.hasOwnProperty.call(message, "parameters"))
                for (var keys = Object.keys(message.parameters), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.ParameterDef.encode(message.parameters[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                }
            if (message.types != null && Object.hasOwnProperty.call(message, "types"))
                for (var keys = Object.keys(message.types), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.Type.encode(message.types[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                }
            return writer;
        };

        /**
         * Encodes the specified DictionaryNamespace message, length delimited. Does not implicitly {@link hermes.DictionaryNamespace.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {hermes.IDictionaryNamespace} message DictionaryNamespace message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DictionaryNamespace.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DictionaryNamespace message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.DictionaryNamespace} DictionaryNamespace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DictionaryNamespace.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DictionaryNamespace(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (message.commands === $util.emptyObject)
                            message.commands = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.hermes.CommandDef.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.commands, key);
                        message.commands[key] = value;
                        break;
                    }
                case 2: {
                        if (message.events === $util.emptyObject)
                            message.events = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.hermes.EventDef.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.events, key);
                        message.events[key] = value;
                        break;
                    }
                case 3: {
                        if (message.telemetry === $util.emptyObject)
                            message.telemetry = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.hermes.TelemetryDef.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.telemetry, key);
                        message.telemetry[key] = value;
                        break;
                    }
                case 4: {
                        if (message.parameters === $util.emptyObject)
                            message.parameters = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.hermes.ParameterDef.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.parameters, key);
                        message.parameters[key] = value;
                        break;
                    }
                case 5: {
                        if (message.types === $util.emptyObject)
                            message.types = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.hermes.Type.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.types, key);
                        message.types[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DictionaryNamespace message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.DictionaryNamespace} DictionaryNamespace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DictionaryNamespace.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DictionaryNamespace message.
         * @function verify
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DictionaryNamespace.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.commands != null && Object.hasOwnProperty.call(message, "commands")) {
                if (!$util.isObject(message.commands))
                    return "commands: object expected";
                var key = Object.keys(message.commands);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.CommandDef.verify(message.commands[key[i]], long + 1);
                    if (error)
                        return "commands." + error;
                }
            }
            if (message.events != null && Object.hasOwnProperty.call(message, "events")) {
                if (!$util.isObject(message.events))
                    return "events: object expected";
                var key = Object.keys(message.events);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.EventDef.verify(message.events[key[i]], long + 1);
                    if (error)
                        return "events." + error;
                }
            }
            if (message.telemetry != null && Object.hasOwnProperty.call(message, "telemetry")) {
                if (!$util.isObject(message.telemetry))
                    return "telemetry: object expected";
                var key = Object.keys(message.telemetry);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.TelemetryDef.verify(message.telemetry[key[i]], long + 1);
                    if (error)
                        return "telemetry." + error;
                }
            }
            if (message.parameters != null && Object.hasOwnProperty.call(message, "parameters")) {
                if (!$util.isObject(message.parameters))
                    return "parameters: object expected";
                var key = Object.keys(message.parameters);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.ParameterDef.verify(message.parameters[key[i]], long + 1);
                    if (error)
                        return "parameters." + error;
                }
            }
            if (message.types != null && Object.hasOwnProperty.call(message, "types")) {
                if (!$util.isObject(message.types))
                    return "types: object expected";
                var key = Object.keys(message.types);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.Type.verify(message.types[key[i]], long + 1);
                    if (error)
                        return "types." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DictionaryNamespace message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.DictionaryNamespace} DictionaryNamespace
         */
        DictionaryNamespace.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.DictionaryNamespace)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.DictionaryNamespace: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.DictionaryNamespace();
            if (object.commands) {
                if (!$util.isObject(object.commands))
                    throw TypeError(".hermes.DictionaryNamespace.commands: object expected");
                message.commands = {};
                for (var keys = Object.keys(object.commands), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.commands, keys[i]);
                    if (!$util.isObject(object.commands[keys[i]]))
                        throw TypeError(".hermes.DictionaryNamespace.commands: object expected");
                    message.commands[keys[i]] = $root.hermes.CommandDef.fromObject(object.commands[keys[i]], long + 1);
                }
            }
            if (object.events) {
                if (!$util.isObject(object.events))
                    throw TypeError(".hermes.DictionaryNamespace.events: object expected");
                message.events = {};
                for (var keys = Object.keys(object.events), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.events, keys[i]);
                    if (!$util.isObject(object.events[keys[i]]))
                        throw TypeError(".hermes.DictionaryNamespace.events: object expected");
                    message.events[keys[i]] = $root.hermes.EventDef.fromObject(object.events[keys[i]], long + 1);
                }
            }
            if (object.telemetry) {
                if (!$util.isObject(object.telemetry))
                    throw TypeError(".hermes.DictionaryNamespace.telemetry: object expected");
                message.telemetry = {};
                for (var keys = Object.keys(object.telemetry), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.telemetry, keys[i]);
                    if (!$util.isObject(object.telemetry[keys[i]]))
                        throw TypeError(".hermes.DictionaryNamespace.telemetry: object expected");
                    message.telemetry[keys[i]] = $root.hermes.TelemetryDef.fromObject(object.telemetry[keys[i]], long + 1);
                }
            }
            if (object.parameters) {
                if (!$util.isObject(object.parameters))
                    throw TypeError(".hermes.DictionaryNamespace.parameters: object expected");
                message.parameters = {};
                for (var keys = Object.keys(object.parameters), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.parameters, keys[i]);
                    if (!$util.isObject(object.parameters[keys[i]]))
                        throw TypeError(".hermes.DictionaryNamespace.parameters: object expected");
                    message.parameters[keys[i]] = $root.hermes.ParameterDef.fromObject(object.parameters[keys[i]], long + 1);
                }
            }
            if (object.types) {
                if (!$util.isObject(object.types))
                    throw TypeError(".hermes.DictionaryNamespace.types: object expected");
                message.types = {};
                for (var keys = Object.keys(object.types), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.types, keys[i]);
                    if (!$util.isObject(object.types[keys[i]]))
                        throw TypeError(".hermes.DictionaryNamespace.types: object expected");
                    message.types[keys[i]] = $root.hermes.Type.fromObject(object.types[keys[i]], long + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a DictionaryNamespace message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {hermes.DictionaryNamespace} message DictionaryNamespace
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DictionaryNamespace.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.objects || options.defaults) {
                object.commands = {};
                object.events = {};
                object.telemetry = {};
                object.parameters = {};
                object.types = {};
            }
            var keys2;
            if (message.commands && (keys2 = Object.keys(message.commands)).length) {
                object.commands = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.commands, keys2[j]);
                    object.commands[keys2[j]] = $root.hermes.CommandDef.toObject(message.commands[keys2[j]], options, q + 1);
                }
            }
            if (message.events && (keys2 = Object.keys(message.events)).length) {
                object.events = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.events, keys2[j]);
                    object.events[keys2[j]] = $root.hermes.EventDef.toObject(message.events[keys2[j]], options, q + 1);
                }
            }
            if (message.telemetry && (keys2 = Object.keys(message.telemetry)).length) {
                object.telemetry = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.telemetry, keys2[j]);
                    object.telemetry[keys2[j]] = $root.hermes.TelemetryDef.toObject(message.telemetry[keys2[j]], options, q + 1);
                }
            }
            if (message.parameters && (keys2 = Object.keys(message.parameters)).length) {
                object.parameters = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.parameters, keys2[j]);
                    object.parameters[keys2[j]] = $root.hermes.ParameterDef.toObject(message.parameters[keys2[j]], options, q + 1);
                }
            }
            if (message.types && (keys2 = Object.keys(message.types)).length) {
                object.types = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.types, keys2[j]);
                    object.types[keys2[j]] = $root.hermes.Type.toObject(message.types[keys2[j]], options, q + 1);
                }
            }
            return object;
        };

        /**
         * Converts this DictionaryNamespace to JSON.
         * @function toJSON
         * @memberof hermes.DictionaryNamespace
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DictionaryNamespace.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DictionaryNamespace
         * @function getTypeUrl
         * @memberof hermes.DictionaryNamespace
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DictionaryNamespace.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.DictionaryNamespace";
        };

        return DictionaryNamespace;
    })();

    hermes.Dictionary = (function() {

        /**
         * Properties of a Dictionary.
         * @memberof hermes
         * @interface IDictionary
         * @property {hermes.IDictionaryHead|null} [head] Dictionary head
         * @property {Object.<string,hermes.IDictionaryNamespace>|null} [content] Dictionary content
         * @property {Object.<string,string>|null} [metadata] Dictionary metadata
         * @property {string|null} [id] Dictionary id
         */

        /**
         * Constructs a new Dictionary.
         * @memberof hermes
         * @classdesc Represents a Dictionary.
         * @implements IDictionary
         * @constructor
         * @param {hermes.IDictionary=} [properties] Properties to set
         */
        function Dictionary(properties) {
            this.content = {};
            this.metadata = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Dictionary head.
         * @member {hermes.IDictionaryHead|null|undefined} head
         * @memberof hermes.Dictionary
         * @instance
         */
        Dictionary.prototype.head = null;

        /**
         * Dictionary content.
         * @member {Object.<string,hermes.IDictionaryNamespace>} content
         * @memberof hermes.Dictionary
         * @instance
         */
        Dictionary.prototype.content = $util.emptyObject;

        /**
         * Dictionary metadata.
         * @member {Object.<string,string>} metadata
         * @memberof hermes.Dictionary
         * @instance
         */
        Dictionary.prototype.metadata = $util.emptyObject;

        /**
         * Dictionary id.
         * @member {string} id
         * @memberof hermes.Dictionary
         * @instance
         */
        Dictionary.prototype.id = "";

        /**
         * Creates a new Dictionary instance using the specified properties.
         * @function create
         * @memberof hermes.Dictionary
         * @static
         * @param {hermes.IDictionary=} [properties] Properties to set
         * @returns {hermes.Dictionary} Dictionary instance
         */
        Dictionary.create = function create(properties) {
            return new Dictionary(properties);
        };

        /**
         * Encodes the specified Dictionary message. Does not implicitly {@link hermes.Dictionary.verify|verify} messages.
         * @function encode
         * @memberof hermes.Dictionary
         * @static
         * @param {hermes.IDictionary} message Dictionary message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Dictionary.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.head != null && Object.hasOwnProperty.call(message, "head"))
                $root.hermes.DictionaryHead.encode(message.head, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                for (var keys = Object.keys(message.content), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.DictionaryNamespace.encode(message.content[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.id);
            return writer;
        };

        /**
         * Encodes the specified Dictionary message, length delimited. Does not implicitly {@link hermes.Dictionary.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Dictionary
         * @static
         * @param {hermes.IDictionary} message Dictionary message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Dictionary.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Dictionary message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Dictionary
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Dictionary} Dictionary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Dictionary.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Dictionary(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.head = $root.hermes.DictionaryHead.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 2: {
                        if (message.content === $util.emptyObject)
                            message.content = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.hermes.DictionaryNamespace.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.content, key);
                        message.content[key] = value;
                        break;
                    }
                case 3: {
                        if (message.metadata === $util.emptyObject)
                            message.metadata = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = "";
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.string();
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.metadata, key);
                        message.metadata[key] = value;
                        break;
                    }
                case 4: {
                        message.id = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Dictionary message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Dictionary
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Dictionary} Dictionary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Dictionary.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Dictionary message.
         * @function verify
         * @memberof hermes.Dictionary
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Dictionary.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.head != null && Object.hasOwnProperty.call(message, "head")) {
                var error = $root.hermes.DictionaryHead.verify(message.head, long + 1);
                if (error)
                    return "head." + error;
            }
            if (message.content != null && Object.hasOwnProperty.call(message, "content")) {
                if (!$util.isObject(message.content))
                    return "content: object expected";
                var key = Object.keys(message.content);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.DictionaryNamespace.verify(message.content[key[i]], long + 1);
                    if (error)
                        return "content." + error;
                }
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata")) {
                if (!$util.isObject(message.metadata))
                    return "metadata: object expected";
                var key = Object.keys(message.metadata);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.metadata[key[i]]))
                        return "metadata: string{k:string} expected";
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        /**
         * Creates a Dictionary message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Dictionary
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Dictionary} Dictionary
         */
        Dictionary.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.Dictionary)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.Dictionary: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.Dictionary();
            if (object.head != null) {
                if (!$util.isObject(object.head))
                    throw TypeError(".hermes.Dictionary.head: object expected");
                message.head = $root.hermes.DictionaryHead.fromObject(object.head, long + 1);
            }
            if (object.content) {
                if (!$util.isObject(object.content))
                    throw TypeError(".hermes.Dictionary.content: object expected");
                message.content = {};
                for (var keys = Object.keys(object.content), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.content, keys[i]);
                    if (!$util.isObject(object.content[keys[i]]))
                        throw TypeError(".hermes.Dictionary.content: object expected");
                    message.content[keys[i]] = $root.hermes.DictionaryNamespace.fromObject(object.content[keys[i]], long + 1);
                }
            }
            if (object.metadata) {
                if (!$util.isObject(object.metadata))
                    throw TypeError(".hermes.Dictionary.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.metadata, keys[i]);
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
                }
            }
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        /**
         * Creates a plain object from a Dictionary message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Dictionary
         * @static
         * @param {hermes.Dictionary} message Dictionary
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Dictionary.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.objects || options.defaults) {
                object.content = {};
                object.metadata = {};
            }
            if (options.defaults) {
                object.head = null;
                object.id = "";
            }
            if (message.head != null && Object.hasOwnProperty.call(message, "head"))
                object.head = $root.hermes.DictionaryHead.toObject(message.head, options, q + 1);
            var keys2;
            if (message.content && (keys2 = Object.keys(message.content)).length) {
                object.content = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.content, keys2[j]);
                    object.content[keys2[j]] = $root.hermes.DictionaryNamespace.toObject(message.content[keys2[j]], options, q + 1);
                }
            }
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.metadata, keys2[j]);
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
                }
            }
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this Dictionary to JSON.
         * @function toJSON
         * @memberof hermes.Dictionary
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Dictionary.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Dictionary
         * @function getTypeUrl
         * @memberof hermes.Dictionary
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Dictionary.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Dictionary";
        };

        return Dictionary;
    })();

    /**
     * IntKind enum.
     * @name hermes.IntKind
     * @enum {number}
     * @property {number} INT_U8=0 INT_U8 value
     * @property {number} INT_I8=1 INT_I8 value
     * @property {number} INT_U16=2 INT_U16 value
     * @property {number} INT_I16=3 INT_I16 value
     * @property {number} INT_U32=4 INT_U32 value
     * @property {number} INT_I32=5 INT_I32 value
     * @property {number} INT_U64=6 INT_U64 value
     * @property {number} INT_I64=7 INT_I64 value
     */
    hermes.IntKind = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "INT_U8"] = 0;
        values[valuesById[1] = "INT_I8"] = 1;
        values[valuesById[2] = "INT_U16"] = 2;
        values[valuesById[3] = "INT_I16"] = 3;
        values[valuesById[4] = "INT_U32"] = 4;
        values[valuesById[5] = "INT_I32"] = 5;
        values[valuesById[6] = "INT_U64"] = 6;
        values[valuesById[7] = "INT_I64"] = 7;
        return values;
    })();

    /**
     * NumberKind enum.
     * @name hermes.NumberKind
     * @enum {number}
     * @property {number} NUMBER_U8=0 NUMBER_U8 value
     * @property {number} NUMBER_I8=1 NUMBER_I8 value
     * @property {number} NUMBER_U16=2 NUMBER_U16 value
     * @property {number} NUMBER_I16=3 NUMBER_I16 value
     * @property {number} NUMBER_U32=4 NUMBER_U32 value
     * @property {number} NUMBER_I32=5 NUMBER_I32 value
     * @property {number} NUMBER_U64=6 NUMBER_U64 value
     * @property {number} NUMBER_I64=7 NUMBER_I64 value
     * @property {number} NUMBER_F32=8 NUMBER_F32 value
     * @property {number} NUMBER_F64=9 NUMBER_F64 value
     */
    hermes.NumberKind = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NUMBER_U8"] = 0;
        values[valuesById[1] = "NUMBER_I8"] = 1;
        values[valuesById[2] = "NUMBER_U16"] = 2;
        values[valuesById[3] = "NUMBER_I16"] = 3;
        values[valuesById[4] = "NUMBER_U32"] = 4;
        values[valuesById[5] = "NUMBER_I32"] = 5;
        values[valuesById[6] = "NUMBER_U64"] = 6;
        values[valuesById[7] = "NUMBER_I64"] = 7;
        values[valuesById[8] = "NUMBER_F32"] = 8;
        values[valuesById[9] = "NUMBER_F64"] = 9;
        return values;
    })();

    /**
     * UIntKind enum.
     * @name hermes.UIntKind
     * @enum {number}
     * @property {number} UINT_U8=0 UINT_U8 value
     * @property {number} UINT_U16=1 UINT_U16 value
     * @property {number} UINT_U32=2 UINT_U32 value
     * @property {number} UINT_U64=3 UINT_U64 value
     */
    hermes.UIntKind = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UINT_U8"] = 0;
        values[valuesById[1] = "UINT_U16"] = 1;
        values[valuesById[2] = "UINT_U32"] = 2;
        values[valuesById[3] = "UINT_U64"] = 3;
        return values;
    })();

    /**
     * FloatKind enum.
     * @name hermes.FloatKind
     * @enum {number}
     * @property {number} F_F32=0 F_F32 value
     * @property {number} F_F64=1 F_F64 value
     */
    hermes.FloatKind = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "F_F32"] = 0;
        values[valuesById[1] = "F_F64"] = 1;
        return values;
    })();

    /**
     * ReferenceKind enum.
     * @name hermes.ReferenceKind
     * @enum {number}
     * @property {number} REF_ENUM=0 REF_ENUM value
     * @property {number} REF_BITMASK=1 REF_BITMASK value
     * @property {number} REF_OBJECT=2 REF_OBJECT value
     * @property {number} REF_ARRAY=3 REF_ARRAY value
     * @property {number} REF_BYTES=4 REF_BYTES value
     */
    hermes.ReferenceKind = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "REF_ENUM"] = 0;
        values[valuesById[1] = "REF_BITMASK"] = 1;
        values[valuesById[2] = "REF_OBJECT"] = 2;
        values[valuesById[3] = "REF_ARRAY"] = 3;
        values[valuesById[4] = "REF_BYTES"] = 4;
        return values;
    })();

    hermes.BooleanType = (function() {

        /**
         * Properties of a BooleanType.
         * @memberof hermes
         * @interface IBooleanType
         * @property {hermes.UIntKind|null} [encodeType] BooleanType encodeType
         */

        /**
         * Constructs a new BooleanType.
         * @memberof hermes
         * @classdesc Represents a BooleanType.
         * @implements IBooleanType
         * @constructor
         * @param {hermes.IBooleanType=} [properties] Properties to set
         */
        function BooleanType(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BooleanType encodeType.
         * @member {hermes.UIntKind} encodeType
         * @memberof hermes.BooleanType
         * @instance
         */
        BooleanType.prototype.encodeType = 0;

        /**
         * Creates a new BooleanType instance using the specified properties.
         * @function create
         * @memberof hermes.BooleanType
         * @static
         * @param {hermes.IBooleanType=} [properties] Properties to set
         * @returns {hermes.BooleanType} BooleanType instance
         */
        BooleanType.create = function create(properties) {
            return new BooleanType(properties);
        };

        /**
         * Encodes the specified BooleanType message. Does not implicitly {@link hermes.BooleanType.verify|verify} messages.
         * @function encode
         * @memberof hermes.BooleanType
         * @static
         * @param {hermes.IBooleanType} message BooleanType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BooleanType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.encodeType != null && Object.hasOwnProperty.call(message, "encodeType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.encodeType);
            return writer;
        };

        /**
         * Encodes the specified BooleanType message, length delimited. Does not implicitly {@link hermes.BooleanType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.BooleanType
         * @static
         * @param {hermes.IBooleanType} message BooleanType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BooleanType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BooleanType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.BooleanType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.BooleanType} BooleanType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BooleanType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BooleanType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.encodeType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BooleanType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.BooleanType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.BooleanType} BooleanType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BooleanType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BooleanType message.
         * @function verify
         * @memberof hermes.BooleanType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BooleanType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.encodeType != null && Object.hasOwnProperty.call(message, "encodeType"))
                switch (message.encodeType) {
                default:
                    return "encodeType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };

        /**
         * Creates a BooleanType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.BooleanType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.BooleanType} BooleanType
         */
        BooleanType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.BooleanType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.BooleanType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.BooleanType();
            switch (object.encodeType) {
            default:
                if (typeof object.encodeType === "number") {
                    message.encodeType = object.encodeType;
                    break;
                }
                break;
            case "UINT_U8":
            case 0:
                message.encodeType = 0;
                break;
            case "UINT_U16":
            case 1:
                message.encodeType = 1;
                break;
            case "UINT_U32":
            case 2:
                message.encodeType = 2;
                break;
            case "UINT_U64":
            case 3:
                message.encodeType = 3;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a BooleanType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.BooleanType
         * @static
         * @param {hermes.BooleanType} message BooleanType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BooleanType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults)
                object.encodeType = options.enums === String ? "UINT_U8" : 0;
            if (message.encodeType != null && Object.hasOwnProperty.call(message, "encodeType"))
                object.encodeType = options.enums === String ? $root.hermes.UIntKind[message.encodeType] === undefined ? message.encodeType : $root.hermes.UIntKind[message.encodeType] : message.encodeType;
            return object;
        };

        /**
         * Converts this BooleanType to JSON.
         * @function toJSON
         * @memberof hermes.BooleanType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BooleanType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BooleanType
         * @function getTypeUrl
         * @memberof hermes.BooleanType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BooleanType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.BooleanType";
        };

        return BooleanType;
    })();

    hermes.IntType = (function() {

        /**
         * Properties of an IntType.
         * @memberof hermes
         * @interface IIntType
         * @property {hermes.IntKind|null} [kind] IntType kind
         * @property {number|Long|null} [min] Lower bound on valid values
         * @property {number|Long|null} [max] Upper bound on valid values
         */

        /**
         * Constructs a new IntType.
         * @memberof hermes
         * @classdesc Represents an IntType.
         * @implements IIntType
         * @constructor
         * @param {hermes.IIntType=} [properties] Properties to set
         */
        function IntType(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IntType kind.
         * @member {hermes.IntKind} kind
         * @memberof hermes.IntType
         * @instance
         */
        IntType.prototype.kind = 0;

        /**
         * Lower bound on valid values
         * @member {number|Long} min
         * @memberof hermes.IntType
         * @instance
         */
        IntType.prototype.min = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Upper bound on valid values
         * @member {number|Long} max
         * @memberof hermes.IntType
         * @instance
         */
        IntType.prototype.max = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new IntType instance using the specified properties.
         * @function create
         * @memberof hermes.IntType
         * @static
         * @param {hermes.IIntType=} [properties] Properties to set
         * @returns {hermes.IntType} IntType instance
         */
        IntType.create = function create(properties) {
            return new IntType(properties);
        };

        /**
         * Encodes the specified IntType message. Does not implicitly {@link hermes.IntType.verify|verify} messages.
         * @function encode
         * @memberof hermes.IntType
         * @static
         * @param {hermes.IIntType} message IntType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IntType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.kind);
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.min);
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.max);
            return writer;
        };

        /**
         * Encodes the specified IntType message, length delimited. Does not implicitly {@link hermes.IntType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.IntType
         * @static
         * @param {hermes.IIntType} message IntType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IntType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an IntType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.IntType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.IntType} IntType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IntType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.IntType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.kind = reader.int32();
                        break;
                    }
                case 2: {
                        message.min = reader.int64();
                        break;
                    }
                case 3: {
                        message.max = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an IntType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.IntType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.IntType} IntType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IntType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an IntType message.
         * @function verify
         * @memberof hermes.IntType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        IntType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                switch (message.kind) {
                default:
                    return "kind: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    break;
                }
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                if (!$util.isInteger(message.min) && !(message.min && $util.isInteger(message.min.low) && $util.isInteger(message.min.high)))
                    return "min: integer|Long expected";
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                if (!$util.isInteger(message.max) && !(message.max && $util.isInteger(message.max.low) && $util.isInteger(message.max.high)))
                    return "max: integer|Long expected";
            return null;
        };

        /**
         * Creates an IntType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.IntType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.IntType} IntType
         */
        IntType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.IntType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.IntType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.IntType();
            switch (object.kind) {
            default:
                if (typeof object.kind === "number") {
                    message.kind = object.kind;
                    break;
                }
                break;
            case "INT_U8":
            case 0:
                message.kind = 0;
                break;
            case "INT_I8":
            case 1:
                message.kind = 1;
                break;
            case "INT_U16":
            case 2:
                message.kind = 2;
                break;
            case "INT_I16":
            case 3:
                message.kind = 3;
                break;
            case "INT_U32":
            case 4:
                message.kind = 4;
                break;
            case "INT_I32":
            case 5:
                message.kind = 5;
                break;
            case "INT_U64":
            case 6:
                message.kind = 6;
                break;
            case "INT_I64":
            case 7:
                message.kind = 7;
                break;
            }
            if (object.min != null)
                if ($util.Long)
                    message.min = $util.Long.fromValue(object.min, false);
                else if (typeof object.min === "string")
                    message.min = parseInt(object.min, 10);
                else if (typeof object.min === "number")
                    message.min = object.min;
                else if (typeof object.min === "object")
                    message.min = new $util.LongBits(object.min.low >>> 0, object.min.high >>> 0).toNumber();
            if (object.max != null)
                if ($util.Long)
                    message.max = $util.Long.fromValue(object.max, false);
                else if (typeof object.max === "string")
                    message.max = parseInt(object.max, 10);
                else if (typeof object.max === "number")
                    message.max = object.max;
                else if (typeof object.max === "object")
                    message.max = new $util.LongBits(object.max.low >>> 0, object.max.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from an IntType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.IntType
         * @static
         * @param {hermes.IntType} message IntType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        IntType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.kind = options.enums === String ? "INT_U8" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.min = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.min = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.max = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.max = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
            }
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                object.kind = options.enums === String ? $root.hermes.IntKind[message.kind] === undefined ? message.kind : $root.hermes.IntKind[message.kind] : message.kind;
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.min = typeof message.min === "number" ? BigInt(message.min) : $util.Long.fromBits(message.min.low >>> 0, message.min.high >>> 0, false).toBigInt();
                else if (typeof message.min === "number")
                    object.min = options.longs === String ? String(message.min) : message.min;
                else
                    object.min = options.longs === String ? $util.Long.prototype.toString.call(message.min) : options.longs === Number ? new $util.LongBits(message.min.low >>> 0, message.min.high >>> 0).toNumber() : message.min;
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.max = typeof message.max === "number" ? BigInt(message.max) : $util.Long.fromBits(message.max.low >>> 0, message.max.high >>> 0, false).toBigInt();
                else if (typeof message.max === "number")
                    object.max = options.longs === String ? String(message.max) : message.max;
                else
                    object.max = options.longs === String ? $util.Long.prototype.toString.call(message.max) : options.longs === Number ? new $util.LongBits(message.max.low >>> 0, message.max.high >>> 0).toNumber() : message.max;
            return object;
        };

        /**
         * Converts this IntType to JSON.
         * @function toJSON
         * @memberof hermes.IntType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        IntType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for IntType
         * @function getTypeUrl
         * @memberof hermes.IntType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        IntType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.IntType";
        };

        return IntType;
    })();

    hermes.FloatType = (function() {

        /**
         * Properties of a FloatType.
         * @memberof hermes
         * @interface IFloatType
         * @property {hermes.FloatKind|null} [kind] FloatType kind
         * @property {number|null} [min] Lower bound on valid values
         * @property {number|null} [max] Upper bound on valid values
         */

        /**
         * Constructs a new FloatType.
         * @memberof hermes
         * @classdesc Represents a FloatType.
         * @implements IFloatType
         * @constructor
         * @param {hermes.IFloatType=} [properties] Properties to set
         */
        function FloatType(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FloatType kind.
         * @member {hermes.FloatKind} kind
         * @memberof hermes.FloatType
         * @instance
         */
        FloatType.prototype.kind = 0;

        /**
         * Lower bound on valid values
         * @member {number} min
         * @memberof hermes.FloatType
         * @instance
         */
        FloatType.prototype.min = 0;

        /**
         * Upper bound on valid values
         * @member {number} max
         * @memberof hermes.FloatType
         * @instance
         */
        FloatType.prototype.max = 0;

        /**
         * Creates a new FloatType instance using the specified properties.
         * @function create
         * @memberof hermes.FloatType
         * @static
         * @param {hermes.IFloatType=} [properties] Properties to set
         * @returns {hermes.FloatType} FloatType instance
         */
        FloatType.create = function create(properties) {
            return new FloatType(properties);
        };

        /**
         * Encodes the specified FloatType message. Does not implicitly {@link hermes.FloatType.verify|verify} messages.
         * @function encode
         * @memberof hermes.FloatType
         * @static
         * @param {hermes.IFloatType} message FloatType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FloatType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.kind);
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.min);
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.max);
            return writer;
        };

        /**
         * Encodes the specified FloatType message, length delimited. Does not implicitly {@link hermes.FloatType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FloatType
         * @static
         * @param {hermes.IFloatType} message FloatType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FloatType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FloatType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FloatType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FloatType} FloatType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FloatType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FloatType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.kind = reader.int32();
                        break;
                    }
                case 2: {
                        message.min = reader.double();
                        break;
                    }
                case 3: {
                        message.max = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FloatType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FloatType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FloatType} FloatType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FloatType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FloatType message.
         * @function verify
         * @memberof hermes.FloatType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FloatType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                switch (message.kind) {
                default:
                    return "kind: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                if (typeof message.min !== "number")
                    return "min: number expected";
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                if (typeof message.max !== "number")
                    return "max: number expected";
            return null;
        };

        /**
         * Creates a FloatType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FloatType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FloatType} FloatType
         */
        FloatType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.FloatType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.FloatType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.FloatType();
            switch (object.kind) {
            default:
                if (typeof object.kind === "number") {
                    message.kind = object.kind;
                    break;
                }
                break;
            case "F_F32":
            case 0:
                message.kind = 0;
                break;
            case "F_F64":
            case 1:
                message.kind = 1;
                break;
            }
            if (object.min != null)
                message.min = Number(object.min);
            if (object.max != null)
                message.max = Number(object.max);
            return message;
        };

        /**
         * Creates a plain object from a FloatType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FloatType
         * @static
         * @param {hermes.FloatType} message FloatType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FloatType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.kind = options.enums === String ? "F_F32" : 0;
                object.min = 0;
                object.max = 0;
            }
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                object.kind = options.enums === String ? $root.hermes.FloatKind[message.kind] === undefined ? message.kind : $root.hermes.FloatKind[message.kind] : message.kind;
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                object.min = options.json && !isFinite(message.min) ? String(message.min) : message.min;
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                object.max = options.json && !isFinite(message.max) ? String(message.max) : message.max;
            return object;
        };

        /**
         * Converts this FloatType to JSON.
         * @function toJSON
         * @memberof hermes.FloatType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FloatType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FloatType
         * @function getTypeUrl
         * @memberof hermes.FloatType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FloatType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FloatType";
        };

        return FloatType;
    })();

    hermes.StringType = (function() {

        /**
         * Properties of a StringType.
         * @memberof hermes
         * @interface IStringType
         * @property {hermes.UIntKind|null} [lengthType] Type to serialize length of string with.
         * 
         * When encoding strings, they will be prefixed by their
         * length using this type. If the length does not fit within
         * this type's representable size, it will throw an error.
         * @property {number|null} [maxLength] Optional check for maximum length
         */

        /**
         * Constructs a new StringType.
         * @memberof hermes
         * @classdesc Represents a StringType.
         * @implements IStringType
         * @constructor
         * @param {hermes.IStringType=} [properties] Properties to set
         */
        function StringType(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Type to serialize length of string with.
         * 
         * When encoding strings, they will be prefixed by their
         * length using this type. If the length does not fit within
         * this type's representable size, it will throw an error.
         * @member {hermes.UIntKind} lengthType
         * @memberof hermes.StringType
         * @instance
         */
        StringType.prototype.lengthType = 0;

        /**
         * Optional check for maximum length
         * @member {number} maxLength
         * @memberof hermes.StringType
         * @instance
         */
        StringType.prototype.maxLength = 0;

        /**
         * Creates a new StringType instance using the specified properties.
         * @function create
         * @memberof hermes.StringType
         * @static
         * @param {hermes.IStringType=} [properties] Properties to set
         * @returns {hermes.StringType} StringType instance
         */
        StringType.create = function create(properties) {
            return new StringType(properties);
        };

        /**
         * Encodes the specified StringType message. Does not implicitly {@link hermes.StringType.verify|verify} messages.
         * @function encode
         * @memberof hermes.StringType
         * @static
         * @param {hermes.IStringType} message StringType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StringType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.lengthType);
            if (message.maxLength != null && Object.hasOwnProperty.call(message, "maxLength"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.maxLength);
            return writer;
        };

        /**
         * Encodes the specified StringType message, length delimited. Does not implicitly {@link hermes.StringType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.StringType
         * @static
         * @param {hermes.IStringType} message StringType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StringType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StringType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.StringType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.StringType} StringType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StringType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.StringType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.lengthType = reader.int32();
                        break;
                    }
                case 2: {
                        message.maxLength = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StringType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.StringType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.StringType} StringType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StringType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StringType message.
         * @function verify
         * @memberof hermes.StringType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StringType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                switch (message.lengthType) {
                default:
                    return "lengthType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.maxLength != null && Object.hasOwnProperty.call(message, "maxLength"))
                if (!$util.isInteger(message.maxLength))
                    return "maxLength: integer expected";
            return null;
        };

        /**
         * Creates a StringType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.StringType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.StringType} StringType
         */
        StringType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.StringType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.StringType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.StringType();
            switch (object.lengthType) {
            default:
                if (typeof object.lengthType === "number") {
                    message.lengthType = object.lengthType;
                    break;
                }
                break;
            case "UINT_U8":
            case 0:
                message.lengthType = 0;
                break;
            case "UINT_U16":
            case 1:
                message.lengthType = 1;
                break;
            case "UINT_U32":
            case 2:
                message.lengthType = 2;
                break;
            case "UINT_U64":
            case 3:
                message.lengthType = 3;
                break;
            }
            if (object.maxLength != null)
                message.maxLength = object.maxLength >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a StringType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.StringType
         * @static
         * @param {hermes.StringType} message StringType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StringType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.lengthType = options.enums === String ? "UINT_U8" : 0;
                object.maxLength = 0;
            }
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                object.lengthType = options.enums === String ? $root.hermes.UIntKind[message.lengthType] === undefined ? message.lengthType : $root.hermes.UIntKind[message.lengthType] : message.lengthType;
            if (message.maxLength != null && Object.hasOwnProperty.call(message, "maxLength"))
                object.maxLength = message.maxLength;
            return object;
        };

        /**
         * Converts this StringType to JSON.
         * @function toJSON
         * @memberof hermes.StringType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StringType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for StringType
         * @function getTypeUrl
         * @memberof hermes.StringType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StringType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.StringType";
        };

        return StringType;
    })();

    hermes.EnumItem = (function() {

        /**
         * Properties of an EnumItem.
         * @memberof hermes
         * @interface IEnumItem
         * @property {number|null} [value] EnumItem value
         * @property {string|null} [name] EnumItem name
         * @property {string|null} [metadata] EnumItem metadata
         */

        /**
         * Constructs a new EnumItem.
         * @memberof hermes
         * @classdesc Represents an EnumItem.
         * @implements IEnumItem
         * @constructor
         * @param {hermes.IEnumItem=} [properties] Properties to set
         */
        function EnumItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnumItem value.
         * @member {number} value
         * @memberof hermes.EnumItem
         * @instance
         */
        EnumItem.prototype.value = 0;

        /**
         * EnumItem name.
         * @member {string} name
         * @memberof hermes.EnumItem
         * @instance
         */
        EnumItem.prototype.name = "";

        /**
         * EnumItem metadata.
         * @member {string} metadata
         * @memberof hermes.EnumItem
         * @instance
         */
        EnumItem.prototype.metadata = "";

        /**
         * Creates a new EnumItem instance using the specified properties.
         * @function create
         * @memberof hermes.EnumItem
         * @static
         * @param {hermes.IEnumItem=} [properties] Properties to set
         * @returns {hermes.EnumItem} EnumItem instance
         */
        EnumItem.create = function create(properties) {
            return new EnumItem(properties);
        };

        /**
         * Encodes the specified EnumItem message. Does not implicitly {@link hermes.EnumItem.verify|verify} messages.
         * @function encode
         * @memberof hermes.EnumItem
         * @static
         * @param {hermes.IEnumItem} message EnumItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnumItem.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.metadata);
            return writer;
        };

        /**
         * Encodes the specified EnumItem message, length delimited. Does not implicitly {@link hermes.EnumItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.EnumItem
         * @static
         * @param {hermes.IEnumItem} message EnumItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnumItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnumItem message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.EnumItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.EnumItem} EnumItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnumItem.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EnumItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.value = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnumItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.EnumItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.EnumItem} EnumItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnumItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnumItem message.
         * @function verify
         * @memberof hermes.EnumItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnumItem.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                if (!$util.isInteger(message.value))
                    return "value: integer expected";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            return null;
        };

        /**
         * Creates an EnumItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.EnumItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.EnumItem} EnumItem
         */
        EnumItem.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.EnumItem)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.EnumItem: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.EnumItem();
            if (object.value != null)
                message.value = object.value | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            return message;
        };

        /**
         * Creates a plain object from an EnumItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.EnumItem
         * @static
         * @param {hermes.EnumItem} message EnumItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnumItem.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.value = 0;
                object.name = "";
                object.metadata = "";
            }
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                object.value = message.value;
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                object.metadata = message.metadata;
            return object;
        };

        /**
         * Converts this EnumItem to JSON.
         * @function toJSON
         * @memberof hermes.EnumItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnumItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnumItem
         * @function getTypeUrl
         * @memberof hermes.EnumItem
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnumItem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.EnumItem";
        };

        return EnumItem;
    })();

    hermes.EnumType = (function() {

        /**
         * Properties of an EnumType.
         * @memberof hermes
         * @interface IEnumType
         * @property {string|null} [name] Name of the enum
         * @property {hermes.IntKind|null} [encodeType] Type to serialize enum with.
         * Use this on a per-enum basis. By default it will be I32. If this is
         * specified in the reference type it will override this.
         * 
         * You can also override this behavior programmatically by overriding
         * `Serializable.writeEnum`.
         * @property {Array.<hermes.IEnumItem>|null} [items] Members of the enum and their mapping to its
         * numeric value.
         */

        /**
         * Constructs a new EnumType.
         * @memberof hermes
         * @classdesc Represents an EnumType.
         * @implements IEnumType
         * @constructor
         * @param {hermes.IEnumType=} [properties] Properties to set
         */
        function EnumType(properties) {
            this.items = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Name of the enum
         * @member {string} name
         * @memberof hermes.EnumType
         * @instance
         */
        EnumType.prototype.name = "";

        /**
         * Type to serialize enum with.
         * Use this on a per-enum basis. By default it will be I32. If this is
         * specified in the reference type it will override this.
         * 
         * You can also override this behavior programmatically by overriding
         * `Serializable.writeEnum`.
         * @member {hermes.IntKind} encodeType
         * @memberof hermes.EnumType
         * @instance
         */
        EnumType.prototype.encodeType = 0;

        /**
         * Members of the enum and their mapping to its
         * numeric value.
         * @member {Array.<hermes.IEnumItem>} items
         * @memberof hermes.EnumType
         * @instance
         */
        EnumType.prototype.items = $util.emptyArray;

        /**
         * Creates a new EnumType instance using the specified properties.
         * @function create
         * @memberof hermes.EnumType
         * @static
         * @param {hermes.IEnumType=} [properties] Properties to set
         * @returns {hermes.EnumType} EnumType instance
         */
        EnumType.create = function create(properties) {
            return new EnumType(properties);
        };

        /**
         * Encodes the specified EnumType message. Does not implicitly {@link hermes.EnumType.verify|verify} messages.
         * @function encode
         * @memberof hermes.EnumType
         * @static
         * @param {hermes.IEnumType} message EnumType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnumType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.encodeType != null && Object.hasOwnProperty.call(message, "encodeType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.encodeType);
            if (message.items != null && message.items.length)
                for (var i = 0; i < message.items.length; ++i)
                    $root.hermes.EnumItem.encode(message.items[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EnumType message, length delimited. Does not implicitly {@link hermes.EnumType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.EnumType
         * @static
         * @param {hermes.IEnumType} message EnumType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnumType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnumType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.EnumType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.EnumType} EnumType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnumType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EnumType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.encodeType = reader.int32();
                        break;
                    }
                case 3: {
                        if (!(message.items && message.items.length))
                            message.items = [];
                        message.items.push($root.hermes.EnumItem.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnumType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.EnumType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.EnumType} EnumType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnumType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnumType message.
         * @function verify
         * @memberof hermes.EnumType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnumType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.encodeType != null && Object.hasOwnProperty.call(message, "encodeType"))
                switch (message.encodeType) {
                default:
                    return "encodeType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    break;
                }
            if (message.items != null && Object.hasOwnProperty.call(message, "items")) {
                if (!Array.isArray(message.items))
                    return "items: array expected";
                for (var i = 0; i < message.items.length; ++i) {
                    var error = $root.hermes.EnumItem.verify(message.items[i], long + 1);
                    if (error)
                        return "items." + error;
                }
            }
            return null;
        };

        /**
         * Creates an EnumType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.EnumType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.EnumType} EnumType
         */
        EnumType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.EnumType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.EnumType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.EnumType();
            if (object.name != null)
                message.name = String(object.name);
            switch (object.encodeType) {
            default:
                if (typeof object.encodeType === "number") {
                    message.encodeType = object.encodeType;
                    break;
                }
                break;
            case "INT_U8":
            case 0:
                message.encodeType = 0;
                break;
            case "INT_I8":
            case 1:
                message.encodeType = 1;
                break;
            case "INT_U16":
            case 2:
                message.encodeType = 2;
                break;
            case "INT_I16":
            case 3:
                message.encodeType = 3;
                break;
            case "INT_U32":
            case 4:
                message.encodeType = 4;
                break;
            case "INT_I32":
            case 5:
                message.encodeType = 5;
                break;
            case "INT_U64":
            case 6:
                message.encodeType = 6;
                break;
            case "INT_I64":
            case 7:
                message.encodeType = 7;
                break;
            }
            if (object.items) {
                if (!Array.isArray(object.items))
                    throw TypeError(".hermes.EnumType.items: array expected");
                message.items = [];
                for (var i = 0; i < object.items.length; ++i) {
                    if (!$util.isObject(object.items[i]))
                        throw TypeError(".hermes.EnumType.items: object expected");
                    message.items[i] = $root.hermes.EnumItem.fromObject(object.items[i], long + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an EnumType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.EnumType
         * @static
         * @param {hermes.EnumType} message EnumType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnumType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults)
                object.items = [];
            if (options.defaults) {
                object.name = "";
                object.encodeType = options.enums === String ? "INT_U8" : 0;
            }
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.encodeType != null && Object.hasOwnProperty.call(message, "encodeType"))
                object.encodeType = options.enums === String ? $root.hermes.IntKind[message.encodeType] === undefined ? message.encodeType : $root.hermes.IntKind[message.encodeType] : message.encodeType;
            if (message.items && message.items.length) {
                object.items = [];
                for (var j = 0; j < message.items.length; ++j)
                    object.items[j] = $root.hermes.EnumItem.toObject(message.items[j], options, q + 1);
            }
            return object;
        };

        /**
         * Converts this EnumType to JSON.
         * @function toJSON
         * @memberof hermes.EnumType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnumType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnumType
         * @function getTypeUrl
         * @memberof hermes.EnumType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnumType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.EnumType";
        };

        return EnumType;
    })();

    hermes.BoundedArraySize = (function() {

        /**
         * Properties of a BoundedArraySize.
         * @memberof hermes
         * @interface IBoundedArraySize
         * @property {number|null} [min] BoundedArraySize min
         * @property {number|null} [max] BoundedArraySize max
         */

        /**
         * Constructs a new BoundedArraySize.
         * @memberof hermes
         * @classdesc Represents a BoundedArraySize.
         * @implements IBoundedArraySize
         * @constructor
         * @param {hermes.IBoundedArraySize=} [properties] Properties to set
         */
        function BoundedArraySize(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BoundedArraySize min.
         * @member {number} min
         * @memberof hermes.BoundedArraySize
         * @instance
         */
        BoundedArraySize.prototype.min = 0;

        /**
         * BoundedArraySize max.
         * @member {number} max
         * @memberof hermes.BoundedArraySize
         * @instance
         */
        BoundedArraySize.prototype.max = 0;

        /**
         * Creates a new BoundedArraySize instance using the specified properties.
         * @function create
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {hermes.IBoundedArraySize=} [properties] Properties to set
         * @returns {hermes.BoundedArraySize} BoundedArraySize instance
         */
        BoundedArraySize.create = function create(properties) {
            return new BoundedArraySize(properties);
        };

        /**
         * Encodes the specified BoundedArraySize message. Does not implicitly {@link hermes.BoundedArraySize.verify|verify} messages.
         * @function encode
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {hermes.IBoundedArraySize} message BoundedArraySize message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BoundedArraySize.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.min);
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.max);
            return writer;
        };

        /**
         * Encodes the specified BoundedArraySize message, length delimited. Does not implicitly {@link hermes.BoundedArraySize.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {hermes.IBoundedArraySize} message BoundedArraySize message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BoundedArraySize.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BoundedArraySize message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.BoundedArraySize} BoundedArraySize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BoundedArraySize.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BoundedArraySize();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.min = reader.uint32();
                        break;
                    }
                case 2: {
                        message.max = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BoundedArraySize message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.BoundedArraySize} BoundedArraySize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BoundedArraySize.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BoundedArraySize message.
         * @function verify
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BoundedArraySize.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                if (!$util.isInteger(message.min))
                    return "min: integer expected";
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                if (!$util.isInteger(message.max))
                    return "max: integer expected";
            return null;
        };

        /**
         * Creates a BoundedArraySize message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.BoundedArraySize} BoundedArraySize
         */
        BoundedArraySize.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.BoundedArraySize)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.BoundedArraySize: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.BoundedArraySize();
            if (object.min != null)
                message.min = object.min >>> 0;
            if (object.max != null)
                message.max = object.max >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a BoundedArraySize message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {hermes.BoundedArraySize} message BoundedArraySize
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BoundedArraySize.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.min = 0;
                object.max = 0;
            }
            if (message.min != null && Object.hasOwnProperty.call(message, "min"))
                object.min = message.min;
            if (message.max != null && Object.hasOwnProperty.call(message, "max"))
                object.max = message.max;
            return object;
        };

        /**
         * Converts this BoundedArraySize to JSON.
         * @function toJSON
         * @memberof hermes.BoundedArraySize
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BoundedArraySize.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BoundedArraySize
         * @function getTypeUrl
         * @memberof hermes.BoundedArraySize
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BoundedArraySize.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.BoundedArraySize";
        };

        return BoundedArraySize;
    })();

    hermes.ArrayType = (function() {

        /**
         * Properties of an ArrayType.
         * @memberof hermes
         * @interface IArrayType
         * @property {string|null} [name] Name of the array if this is a typedef instead of
         * an inline array.
         * @property {hermes.IType|null} [elType] Element type
         * @property {number|null} ["static"] ArrayType static
         * @property {hermes.IBoundedArraySize|null} [dynamic] ArrayType dynamic
         * @property {hermes.UIntKind|null} [lengthType] Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         * 
         * Default: {@link TypeKind.u32}
         */

        /**
         * Constructs a new ArrayType.
         * @memberof hermes
         * @classdesc Represents an ArrayType.
         * @implements IArrayType
         * @constructor
         * @param {hermes.IArrayType=} [properties] Properties to set
         */
        function ArrayType(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Name of the array if this is a typedef instead of
         * an inline array.
         * @member {string} name
         * @memberof hermes.ArrayType
         * @instance
         */
        ArrayType.prototype.name = "";

        /**
         * Element type
         * @member {hermes.IType|null|undefined} elType
         * @memberof hermes.ArrayType
         * @instance
         */
        ArrayType.prototype.elType = null;

        /**
         * ArrayType static.
         * @member {number|null|undefined} static
         * @memberof hermes.ArrayType
         * @instance
         */
        ArrayType.prototype["static"] = null;

        /**
         * ArrayType dynamic.
         * @member {hermes.IBoundedArraySize|null|undefined} dynamic
         * @memberof hermes.ArrayType
         * @instance
         */
        ArrayType.prototype.dynamic = null;

        /**
         * Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         * 
         * Default: {@link TypeKind.u32}
         * @member {hermes.UIntKind} lengthType
         * @memberof hermes.ArrayType
         * @instance
         */
        ArrayType.prototype.lengthType = 0;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Either `number` for static array, or a 2-tuple for
         * a range of sizes (or undefined for unbounded).
         * 
         * Static arrays do not prefix their encodings with sizes
         * since encoders and decoders both agree on their length
         * ahead of time.
         * 
         * Dynamically sized arrays will prefix their size with
         * @member {"static"|"dynamic"|undefined} size
         * @memberof hermes.ArrayType
         * @instance
         */
        Object.defineProperty(ArrayType.prototype, "size", {
            get: $util.oneOfGetter($oneOfFields = ["static", "dynamic"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ArrayType instance using the specified properties.
         * @function create
         * @memberof hermes.ArrayType
         * @static
         * @param {hermes.IArrayType=} [properties] Properties to set
         * @returns {hermes.ArrayType} ArrayType instance
         */
        ArrayType.create = function create(properties) {
            return new ArrayType(properties);
        };

        /**
         * Encodes the specified ArrayType message. Does not implicitly {@link hermes.ArrayType.verify|verify} messages.
         * @function encode
         * @memberof hermes.ArrayType
         * @static
         * @param {hermes.IArrayType} message ArrayType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ArrayType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.elType != null && Object.hasOwnProperty.call(message, "elType"))
                $root.hermes.Type.encode(message.elType, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
            if (message["static"] != null && Object.hasOwnProperty.call(message, "static"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message["static"]);
            if (message.dynamic != null && Object.hasOwnProperty.call(message, "dynamic"))
                $root.hermes.BoundedArraySize.encode(message.dynamic, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.lengthType);
            return writer;
        };

        /**
         * Encodes the specified ArrayType message, length delimited. Does not implicitly {@link hermes.ArrayType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ArrayType
         * @static
         * @param {hermes.IArrayType} message ArrayType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ArrayType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ArrayType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ArrayType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ArrayType} ArrayType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ArrayType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ArrayType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.elType = $root.hermes.Type.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 3: {
                        message["static"] = reader.uint32();
                        break;
                    }
                case 4: {
                        message.dynamic = $root.hermes.BoundedArraySize.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 5: {
                        message.lengthType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ArrayType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ArrayType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ArrayType} ArrayType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ArrayType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ArrayType message.
         * @function verify
         * @memberof hermes.ArrayType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ArrayType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            var properties = {};
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.elType != null && Object.hasOwnProperty.call(message, "elType")) {
                var error = $root.hermes.Type.verify(message.elType, long + 1);
                if (error)
                    return "elType." + error;
            }
            if (message["static"] != null && Object.hasOwnProperty.call(message, "static")) {
                properties.size = 1;
                if (!$util.isInteger(message["static"]))
                    return "static: integer expected";
            }
            if (message.dynamic != null && Object.hasOwnProperty.call(message, "dynamic")) {
                if (properties.size === 1)
                    return "size: multiple values";
                properties.size = 1;
                {
                    var error = $root.hermes.BoundedArraySize.verify(message.dynamic, long + 1);
                    if (error)
                        return "dynamic." + error;
                }
            }
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                switch (message.lengthType) {
                default:
                    return "lengthType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };

        /**
         * Creates an ArrayType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ArrayType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ArrayType} ArrayType
         */
        ArrayType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.ArrayType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.ArrayType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.ArrayType();
            if (object.name != null)
                message.name = String(object.name);
            if (object.elType != null) {
                if (!$util.isObject(object.elType))
                    throw TypeError(".hermes.ArrayType.elType: object expected");
                message.elType = $root.hermes.Type.fromObject(object.elType, long + 1);
            }
            if (object["static"] != null)
                message["static"] = object["static"] >>> 0;
            if (object.dynamic != null) {
                if (!$util.isObject(object.dynamic))
                    throw TypeError(".hermes.ArrayType.dynamic: object expected");
                message.dynamic = $root.hermes.BoundedArraySize.fromObject(object.dynamic, long + 1);
            }
            switch (object.lengthType) {
            default:
                if (typeof object.lengthType === "number") {
                    message.lengthType = object.lengthType;
                    break;
                }
                break;
            case "UINT_U8":
            case 0:
                message.lengthType = 0;
                break;
            case "UINT_U16":
            case 1:
                message.lengthType = 1;
                break;
            case "UINT_U32":
            case 2:
                message.lengthType = 2;
                break;
            case "UINT_U64":
            case 3:
                message.lengthType = 3;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from an ArrayType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ArrayType
         * @static
         * @param {hermes.ArrayType} message ArrayType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ArrayType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.elType = null;
                object.lengthType = options.enums === String ? "UINT_U8" : 0;
            }
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.elType != null && Object.hasOwnProperty.call(message, "elType"))
                object.elType = $root.hermes.Type.toObject(message.elType, options, q + 1);
            if (message["static"] != null && Object.hasOwnProperty.call(message, "static")) {
                object["static"] = message["static"];
                if (options.oneofs)
                    object.size = "static";
            }
            if (message.dynamic != null && Object.hasOwnProperty.call(message, "dynamic")) {
                object.dynamic = $root.hermes.BoundedArraySize.toObject(message.dynamic, options, q + 1);
                if (options.oneofs)
                    object.size = "dynamic";
            }
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                object.lengthType = options.enums === String ? $root.hermes.UIntKind[message.lengthType] === undefined ? message.lengthType : $root.hermes.UIntKind[message.lengthType] : message.lengthType;
            return object;
        };

        /**
         * Converts this ArrayType to JSON.
         * @function toJSON
         * @memberof hermes.ArrayType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ArrayType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ArrayType
         * @function getTypeUrl
         * @memberof hermes.ArrayType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ArrayType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ArrayType";
        };

        return ArrayType;
    })();

    hermes.BytesType = (function() {

        /**
         * Properties of a BytesType.
         * @memberof hermes
         * @interface IBytesType
         * @property {string|null} [name] Name of the bytes array if this is a typedef instead of
         * an inline array.
         * @property {hermes.NumberKind|null} [kind] BytesType kind
         * @property {number|null} ["static"] BytesType static
         * @property {hermes.IBoundedArraySize|null} [dynamic] BytesType dynamic
         * @property {hermes.UIntKind|null} [lengthType] Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         * 
         * Default: {@link TypeKind.u32}
         */

        /**
         * Constructs a new BytesType.
         * @memberof hermes
         * @classdesc Homogeneous array of numeric primitives, stored as raw bytes
         * In Python this decodes the array using NumPy
         * In JS/TS this decodes the array using DataView or TypedArray
         * @implements IBytesType
         * @constructor
         * @param {hermes.IBytesType=} [properties] Properties to set
         */
        function BytesType(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Name of the bytes array if this is a typedef instead of
         * an inline array.
         * @member {string} name
         * @memberof hermes.BytesType
         * @instance
         */
        BytesType.prototype.name = "";

        /**
         * BytesType kind.
         * @member {hermes.NumberKind} kind
         * @memberof hermes.BytesType
         * @instance
         */
        BytesType.prototype.kind = 0;

        /**
         * BytesType static.
         * @member {number|null|undefined} static
         * @memberof hermes.BytesType
         * @instance
         */
        BytesType.prototype["static"] = null;

        /**
         * BytesType dynamic.
         * @member {hermes.IBoundedArraySize|null|undefined} dynamic
         * @memberof hermes.BytesType
         * @instance
         */
        BytesType.prototype.dynamic = null;

        /**
         * Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         * 
         * Default: {@link TypeKind.u32}
         * @member {hermes.UIntKind} lengthType
         * @memberof hermes.BytesType
         * @instance
         */
        BytesType.prototype.lengthType = 0;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Serialization type to use for dynamic array's prefixed length.
         * > Ignored on statically sized arrays.
         * 
         * Default: {@link TypeKind.u32}
         * @member {"static"|"dynamic"|undefined} size
         * @memberof hermes.BytesType
         * @instance
         */
        Object.defineProperty(BytesType.prototype, "size", {
            get: $util.oneOfGetter($oneOfFields = ["static", "dynamic"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new BytesType instance using the specified properties.
         * @function create
         * @memberof hermes.BytesType
         * @static
         * @param {hermes.IBytesType=} [properties] Properties to set
         * @returns {hermes.BytesType} BytesType instance
         */
        BytesType.create = function create(properties) {
            return new BytesType(properties);
        };

        /**
         * Encodes the specified BytesType message. Does not implicitly {@link hermes.BytesType.verify|verify} messages.
         * @function encode
         * @memberof hermes.BytesType
         * @static
         * @param {hermes.IBytesType} message BytesType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BytesType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.kind);
            if (message["static"] != null && Object.hasOwnProperty.call(message, "static"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message["static"]);
            if (message.dynamic != null && Object.hasOwnProperty.call(message, "dynamic"))
                $root.hermes.BoundedArraySize.encode(message.dynamic, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.lengthType);
            return writer;
        };

        /**
         * Encodes the specified BytesType message, length delimited. Does not implicitly {@link hermes.BytesType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.BytesType
         * @static
         * @param {hermes.IBytesType} message BytesType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BytesType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BytesType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.BytesType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.BytesType} BytesType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BytesType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BytesType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.kind = reader.int32();
                        break;
                    }
                case 3: {
                        message["static"] = reader.uint32();
                        break;
                    }
                case 4: {
                        message.dynamic = $root.hermes.BoundedArraySize.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 5: {
                        message.lengthType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BytesType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.BytesType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.BytesType} BytesType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BytesType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BytesType message.
         * @function verify
         * @memberof hermes.BytesType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BytesType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            var properties = {};
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                switch (message.kind) {
                default:
                    return "kind: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    break;
                }
            if (message["static"] != null && Object.hasOwnProperty.call(message, "static")) {
                properties.size = 1;
                if (!$util.isInteger(message["static"]))
                    return "static: integer expected";
            }
            if (message.dynamic != null && Object.hasOwnProperty.call(message, "dynamic")) {
                if (properties.size === 1)
                    return "size: multiple values";
                properties.size = 1;
                {
                    var error = $root.hermes.BoundedArraySize.verify(message.dynamic, long + 1);
                    if (error)
                        return "dynamic." + error;
                }
            }
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                switch (message.lengthType) {
                default:
                    return "lengthType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };

        /**
         * Creates a BytesType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.BytesType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.BytesType} BytesType
         */
        BytesType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.BytesType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.BytesType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.BytesType();
            if (object.name != null)
                message.name = String(object.name);
            switch (object.kind) {
            default:
                if (typeof object.kind === "number") {
                    message.kind = object.kind;
                    break;
                }
                break;
            case "NUMBER_U8":
            case 0:
                message.kind = 0;
                break;
            case "NUMBER_I8":
            case 1:
                message.kind = 1;
                break;
            case "NUMBER_U16":
            case 2:
                message.kind = 2;
                break;
            case "NUMBER_I16":
            case 3:
                message.kind = 3;
                break;
            case "NUMBER_U32":
            case 4:
                message.kind = 4;
                break;
            case "NUMBER_I32":
            case 5:
                message.kind = 5;
                break;
            case "NUMBER_U64":
            case 6:
                message.kind = 6;
                break;
            case "NUMBER_I64":
            case 7:
                message.kind = 7;
                break;
            case "NUMBER_F32":
            case 8:
                message.kind = 8;
                break;
            case "NUMBER_F64":
            case 9:
                message.kind = 9;
                break;
            }
            if (object["static"] != null)
                message["static"] = object["static"] >>> 0;
            if (object.dynamic != null) {
                if (!$util.isObject(object.dynamic))
                    throw TypeError(".hermes.BytesType.dynamic: object expected");
                message.dynamic = $root.hermes.BoundedArraySize.fromObject(object.dynamic, long + 1);
            }
            switch (object.lengthType) {
            default:
                if (typeof object.lengthType === "number") {
                    message.lengthType = object.lengthType;
                    break;
                }
                break;
            case "UINT_U8":
            case 0:
                message.lengthType = 0;
                break;
            case "UINT_U16":
            case 1:
                message.lengthType = 1;
                break;
            case "UINT_U32":
            case 2:
                message.lengthType = 2;
                break;
            case "UINT_U64":
            case 3:
                message.lengthType = 3;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a BytesType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.BytesType
         * @static
         * @param {hermes.BytesType} message BytesType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BytesType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.kind = options.enums === String ? "NUMBER_U8" : 0;
                object.lengthType = options.enums === String ? "UINT_U8" : 0;
            }
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                object.kind = options.enums === String ? $root.hermes.NumberKind[message.kind] === undefined ? message.kind : $root.hermes.NumberKind[message.kind] : message.kind;
            if (message["static"] != null && Object.hasOwnProperty.call(message, "static")) {
                object["static"] = message["static"];
                if (options.oneofs)
                    object.size = "static";
            }
            if (message.dynamic != null && Object.hasOwnProperty.call(message, "dynamic")) {
                object.dynamic = $root.hermes.BoundedArraySize.toObject(message.dynamic, options, q + 1);
                if (options.oneofs)
                    object.size = "dynamic";
            }
            if (message.lengthType != null && Object.hasOwnProperty.call(message, "lengthType"))
                object.lengthType = options.enums === String ? $root.hermes.UIntKind[message.lengthType] === undefined ? message.lengthType : $root.hermes.UIntKind[message.lengthType] : message.lengthType;
            return object;
        };

        /**
         * Converts this BytesType to JSON.
         * @function toJSON
         * @memberof hermes.BytesType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BytesType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BytesType
         * @function getTypeUrl
         * @memberof hermes.BytesType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BytesType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.BytesType";
        };

        return BytesType;
    })();

    hermes.Field = (function() {

        /**
         * Properties of a Field.
         * @memberof hermes
         * @interface IField
         * @property {string|null} [name] Field name
         * @property {hermes.IType|null} [type] Field type
         * @property {string|null} [metadata] Field metadata
         * @property {hermes.IValue|null} [value] Field value
         */

        /**
         * Constructs a new Field.
         * @memberof hermes
         * @classdesc Represents a Field.
         * @implements IField
         * @constructor
         * @param {hermes.IField=} [properties] Properties to set
         */
        function Field(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Field name.
         * @member {string} name
         * @memberof hermes.Field
         * @instance
         */
        Field.prototype.name = "";

        /**
         * Field type.
         * @member {hermes.IType|null|undefined} type
         * @memberof hermes.Field
         * @instance
         */
        Field.prototype.type = null;

        /**
         * Field metadata.
         * @member {string} metadata
         * @memberof hermes.Field
         * @instance
         */
        Field.prototype.metadata = "";

        /**
         * Field value.
         * @member {hermes.IValue|null|undefined} value
         * @memberof hermes.Field
         * @instance
         */
        Field.prototype.value = null;

        /**
         * Creates a new Field instance using the specified properties.
         * @function create
         * @memberof hermes.Field
         * @static
         * @param {hermes.IField=} [properties] Properties to set
         * @returns {hermes.Field} Field instance
         */
        Field.create = function create(properties) {
            return new Field(properties);
        };

        /**
         * Encodes the specified Field message. Does not implicitly {@link hermes.Field.verify|verify} messages.
         * @function encode
         * @memberof hermes.Field
         * @static
         * @param {hermes.IField} message Field message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Field.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                $root.hermes.Type.encode(message.type, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.metadata);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                $root.hermes.Value.encode(message.value, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Field message, length delimited. Does not implicitly {@link hermes.Field.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Field
         * @static
         * @param {hermes.IField} message Field message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Field.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Field message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Field
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Field} Field
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Field.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Field();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.type = $root.hermes.Type.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 3: {
                        message.metadata = reader.string();
                        break;
                    }
                case 4: {
                        message.value = $root.hermes.Value.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Field message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Field
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Field} Field
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Field.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Field message.
         * @function verify
         * @memberof hermes.Field
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Field.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.type != null && Object.hasOwnProperty.call(message, "type")) {
                var error = $root.hermes.Type.verify(message.type, long + 1);
                if (error)
                    return "type." + error;
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                var error = $root.hermes.Value.verify(message.value, long + 1);
                if (error)
                    return "value." + error;
            }
            return null;
        };

        /**
         * Creates a Field message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Field
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Field} Field
         */
        Field.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.Field)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.Field: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.Field();
            if (object.name != null)
                message.name = String(object.name);
            if (object.type != null) {
                if (!$util.isObject(object.type))
                    throw TypeError(".hermes.Field.type: object expected");
                message.type = $root.hermes.Type.fromObject(object.type, long + 1);
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            if (object.value != null) {
                if (!$util.isObject(object.value))
                    throw TypeError(".hermes.Field.value: object expected");
                message.value = $root.hermes.Value.fromObject(object.value, long + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a Field message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Field
         * @static
         * @param {hermes.Field} message Field
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Field.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.type = null;
                object.metadata = "";
                object.value = null;
            }
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                object.type = $root.hermes.Type.toObject(message.type, options, q + 1);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                object.metadata = message.metadata;
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                object.value = $root.hermes.Value.toObject(message.value, options, q + 1);
            return object;
        };

        /**
         * Converts this Field to JSON.
         * @function toJSON
         * @memberof hermes.Field
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Field.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Field
         * @function getTypeUrl
         * @memberof hermes.Field
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Field.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Field";
        };

        return Field;
    })();

    hermes.ObjectType = (function() {

        /**
         * Properties of an ObjectType.
         * @memberof hermes
         * @interface IObjectType
         * @property {string|null} [name] Name of the object/struct
         * @property {Array.<hermes.IField>|null} [fields] Fields/members inside object. Ordered in order of serialization.
         */

        /**
         * Constructs a new ObjectType.
         * @memberof hermes
         * @classdesc Represents an ObjectType.
         * @implements IObjectType
         * @constructor
         * @param {hermes.IObjectType=} [properties] Properties to set
         */
        function ObjectType(properties) {
            this.fields = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Name of the object/struct
         * @member {string} name
         * @memberof hermes.ObjectType
         * @instance
         */
        ObjectType.prototype.name = "";

        /**
         * Fields/members inside object. Ordered in order of serialization.
         * @member {Array.<hermes.IField>} fields
         * @memberof hermes.ObjectType
         * @instance
         */
        ObjectType.prototype.fields = $util.emptyArray;

        /**
         * Creates a new ObjectType instance using the specified properties.
         * @function create
         * @memberof hermes.ObjectType
         * @static
         * @param {hermes.IObjectType=} [properties] Properties to set
         * @returns {hermes.ObjectType} ObjectType instance
         */
        ObjectType.create = function create(properties) {
            return new ObjectType(properties);
        };

        /**
         * Encodes the specified ObjectType message. Does not implicitly {@link hermes.ObjectType.verify|verify} messages.
         * @function encode
         * @memberof hermes.ObjectType
         * @static
         * @param {hermes.IObjectType} message ObjectType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObjectType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.fields != null && message.fields.length)
                for (var i = 0; i < message.fields.length; ++i)
                    $root.hermes.Field.encode(message.fields[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ObjectType message, length delimited. Does not implicitly {@link hermes.ObjectType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ObjectType
         * @static
         * @param {hermes.IObjectType} message ObjectType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObjectType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ObjectType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ObjectType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ObjectType} ObjectType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObjectType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ObjectType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        if (!(message.fields && message.fields.length))
                            message.fields = [];
                        message.fields.push($root.hermes.Field.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ObjectType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ObjectType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ObjectType} ObjectType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObjectType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ObjectType message.
         * @function verify
         * @memberof hermes.ObjectType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ObjectType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.fields != null && Object.hasOwnProperty.call(message, "fields")) {
                if (!Array.isArray(message.fields))
                    return "fields: array expected";
                for (var i = 0; i < message.fields.length; ++i) {
                    var error = $root.hermes.Field.verify(message.fields[i], long + 1);
                    if (error)
                        return "fields." + error;
                }
            }
            return null;
        };

        /**
         * Creates an ObjectType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ObjectType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ObjectType} ObjectType
         */
        ObjectType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.ObjectType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.ObjectType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.ObjectType();
            if (object.name != null)
                message.name = String(object.name);
            if (object.fields) {
                if (!Array.isArray(object.fields))
                    throw TypeError(".hermes.ObjectType.fields: array expected");
                message.fields = [];
                for (var i = 0; i < object.fields.length; ++i) {
                    if (!$util.isObject(object.fields[i]))
                        throw TypeError(".hermes.ObjectType.fields: object expected");
                    message.fields[i] = $root.hermes.Field.fromObject(object.fields[i], long + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an ObjectType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ObjectType
         * @static
         * @param {hermes.ObjectType} message ObjectType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ObjectType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults)
                object.fields = [];
            if (options.defaults)
                object.name = "";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.fields && message.fields.length) {
                object.fields = [];
                for (var j = 0; j < message.fields.length; ++j)
                    object.fields[j] = $root.hermes.Field.toObject(message.fields[j], options, q + 1);
            }
            return object;
        };

        /**
         * Converts this ObjectType to JSON.
         * @function toJSON
         * @memberof hermes.ObjectType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ObjectType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ObjectType
         * @function getTypeUrl
         * @memberof hermes.ObjectType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ObjectType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ObjectType";
        };

        return ObjectType;
    })();

    hermes.ReferenceType = (function() {

        /**
         * Properties of a ReferenceType.
         * @memberof hermes
         * @interface IReferenceType
         * @property {string|null} [name] Name of the type
         * @property {hermes.ReferenceKind|null} [kind] ReferenceType kind
         */

        /**
         * Constructs a new ReferenceType.
         * @memberof hermes
         * @classdesc Represents a ReferenceType.
         * @implements IReferenceType
         * @constructor
         * @param {hermes.IReferenceType=} [properties] Properties to set
         */
        function ReferenceType(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Name of the type
         * @member {string} name
         * @memberof hermes.ReferenceType
         * @instance
         */
        ReferenceType.prototype.name = "";

        /**
         * ReferenceType kind.
         * @member {hermes.ReferenceKind} kind
         * @memberof hermes.ReferenceType
         * @instance
         */
        ReferenceType.prototype.kind = 0;

        /**
         * Creates a new ReferenceType instance using the specified properties.
         * @function create
         * @memberof hermes.ReferenceType
         * @static
         * @param {hermes.IReferenceType=} [properties] Properties to set
         * @returns {hermes.ReferenceType} ReferenceType instance
         */
        ReferenceType.create = function create(properties) {
            return new ReferenceType(properties);
        };

        /**
         * Encodes the specified ReferenceType message. Does not implicitly {@link hermes.ReferenceType.verify|verify} messages.
         * @function encode
         * @memberof hermes.ReferenceType
         * @static
         * @param {hermes.IReferenceType} message ReferenceType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReferenceType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.kind);
            return writer;
        };

        /**
         * Encodes the specified ReferenceType message, length delimited. Does not implicitly {@link hermes.ReferenceType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ReferenceType
         * @static
         * @param {hermes.IReferenceType} message ReferenceType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReferenceType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReferenceType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ReferenceType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ReferenceType} ReferenceType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReferenceType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ReferenceType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.kind = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReferenceType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ReferenceType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ReferenceType} ReferenceType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReferenceType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReferenceType message.
         * @function verify
         * @memberof hermes.ReferenceType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReferenceType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                switch (message.kind) {
                default:
                    return "kind: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            return null;
        };

        /**
         * Creates a ReferenceType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ReferenceType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ReferenceType} ReferenceType
         */
        ReferenceType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.ReferenceType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.ReferenceType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.ReferenceType();
            if (object.name != null)
                message.name = String(object.name);
            switch (object.kind) {
            default:
                if (typeof object.kind === "number") {
                    message.kind = object.kind;
                    break;
                }
                break;
            case "REF_ENUM":
            case 0:
                message.kind = 0;
                break;
            case "REF_BITMASK":
            case 1:
                message.kind = 1;
                break;
            case "REF_OBJECT":
            case 2:
                message.kind = 2;
                break;
            case "REF_ARRAY":
            case 3:
                message.kind = 3;
                break;
            case "REF_BYTES":
            case 4:
                message.kind = 4;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a ReferenceType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ReferenceType
         * @static
         * @param {hermes.ReferenceType} message ReferenceType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReferenceType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.kind = options.enums === String ? "REF_ENUM" : 0;
            }
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                object.name = message.name;
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                object.kind = options.enums === String ? $root.hermes.ReferenceKind[message.kind] === undefined ? message.kind : $root.hermes.ReferenceKind[message.kind] : message.kind;
            return object;
        };

        /**
         * Converts this ReferenceType to JSON.
         * @function toJSON
         * @memberof hermes.ReferenceType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReferenceType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ReferenceType
         * @function getTypeUrl
         * @memberof hermes.ReferenceType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ReferenceType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ReferenceType";
        };

        return ReferenceType;
    })();

    hermes.VoidType = (function() {

        /**
         * Properties of a VoidType.
         * @memberof hermes
         * @interface IVoidType
         * @property {number|null} [size] Size in bytes of this struct pad
         */

        /**
         * Constructs a new VoidType.
         * @memberof hermes
         * @classdesc Represents a VoidType.
         * @implements IVoidType
         * @constructor
         * @param {hermes.IVoidType=} [properties] Properties to set
         */
        function VoidType(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Size in bytes of this struct pad
         * @member {number} size
         * @memberof hermes.VoidType
         * @instance
         */
        VoidType.prototype.size = 0;

        /**
         * Creates a new VoidType instance using the specified properties.
         * @function create
         * @memberof hermes.VoidType
         * @static
         * @param {hermes.IVoidType=} [properties] Properties to set
         * @returns {hermes.VoidType} VoidType instance
         */
        VoidType.create = function create(properties) {
            return new VoidType(properties);
        };

        /**
         * Encodes the specified VoidType message. Does not implicitly {@link hermes.VoidType.verify|verify} messages.
         * @function encode
         * @memberof hermes.VoidType
         * @static
         * @param {hermes.IVoidType} message VoidType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VoidType.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.size);
            return writer;
        };

        /**
         * Encodes the specified VoidType message, length delimited. Does not implicitly {@link hermes.VoidType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.VoidType
         * @static
         * @param {hermes.IVoidType} message VoidType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VoidType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VoidType message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.VoidType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.VoidType} VoidType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VoidType.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.VoidType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.size = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VoidType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.VoidType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.VoidType} VoidType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VoidType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VoidType message.
         * @function verify
         * @memberof hermes.VoidType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VoidType.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                if (!$util.isInteger(message.size))
                    return "size: integer expected";
            return null;
        };

        /**
         * Creates a VoidType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.VoidType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.VoidType} VoidType
         */
        VoidType.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.VoidType)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.VoidType: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.VoidType();
            if (object.size != null)
                message.size = object.size >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a VoidType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.VoidType
         * @static
         * @param {hermes.VoidType} message VoidType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VoidType.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults)
                object.size = 0;
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                object.size = message.size;
            return object;
        };

        /**
         * Converts this VoidType to JSON.
         * @function toJSON
         * @memberof hermes.VoidType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VoidType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VoidType
         * @function getTypeUrl
         * @memberof hermes.VoidType
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VoidType.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.VoidType";
        };

        return VoidType;
    })();

    hermes.Type = (function() {

        /**
         * Properties of a Type.
         * @memberof hermes
         * @interface IType
         * @property {hermes.IReferenceType|null} [ref] Type ref
         * @property {hermes.IBooleanType|null} [bool] Type bool
         * @property {hermes.IIntType|null} [int] Type int
         * @property {hermes.IFloatType|null} [float] Type float
         * @property {hermes.IStringType|null} [string] Type string
         * @property {hermes.IEnumType|null} ["enum"] Type enum
         * @property {hermes.IEnumType|null} [bitmask] Type bitmask
         * @property {hermes.IObjectType|null} [object] Type object
         * @property {hermes.IArrayType|null} [array] Type array
         * @property {hermes.IBytesType|null} [bytes] Type bytes
         * @property {hermes.IVoidType|null} ["void"] Type void
         * @property {string|null} [metadata] Type metadata
         */

        /**
         * Constructs a new Type.
         * @memberof hermes
         * @classdesc Represents a Type.
         * @implements IType
         * @constructor
         * @param {hermes.IType=} [properties] Properties to set
         */
        function Type(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Type ref.
         * @member {hermes.IReferenceType|null|undefined} ref
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.ref = null;

        /**
         * Type bool.
         * @member {hermes.IBooleanType|null|undefined} bool
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.bool = null;

        /**
         * Type int.
         * @member {hermes.IIntType|null|undefined} int
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.int = null;

        /**
         * Type float.
         * @member {hermes.IFloatType|null|undefined} float
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.float = null;

        /**
         * Type string.
         * @member {hermes.IStringType|null|undefined} string
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.string = null;

        /**
         * Type enum.
         * @member {hermes.IEnumType|null|undefined} enum
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype["enum"] = null;

        /**
         * Type bitmask.
         * @member {hermes.IEnumType|null|undefined} bitmask
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.bitmask = null;

        /**
         * Type object.
         * @member {hermes.IObjectType|null|undefined} object
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.object = null;

        /**
         * Type array.
         * @member {hermes.IArrayType|null|undefined} array
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.array = null;

        /**
         * Type bytes.
         * @member {hermes.IBytesType|null|undefined} bytes
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.bytes = null;

        /**
         * Type void.
         * @member {hermes.IVoidType|null|undefined} void
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype["void"] = null;

        /**
         * Type metadata.
         * @member {string} metadata
         * @memberof hermes.Type
         * @instance
         */
        Type.prototype.metadata = "";

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Type value.
         * @member {"ref"|"bool"|"int"|"float"|"string"|"enum"|"bitmask"|"object"|"array"|"bytes"|"void"|undefined} value
         * @memberof hermes.Type
         * @instance
         */
        Object.defineProperty(Type.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["ref", "bool", "int", "float", "string", "enum", "bitmask", "object", "array", "bytes", "void"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Type instance using the specified properties.
         * @function create
         * @memberof hermes.Type
         * @static
         * @param {hermes.IType=} [properties] Properties to set
         * @returns {hermes.Type} Type instance
         */
        Type.create = function create(properties) {
            return new Type(properties);
        };

        /**
         * Encodes the specified Type message. Does not implicitly {@link hermes.Type.verify|verify} messages.
         * @function encode
         * @memberof hermes.Type
         * @static
         * @param {hermes.IType} message Type message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Type.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref"))
                $root.hermes.ReferenceType.encode(message.ref, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
            if (message.bool != null && Object.hasOwnProperty.call(message, "bool"))
                $root.hermes.BooleanType.encode(message.bool, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
            if (message.int != null && Object.hasOwnProperty.call(message, "int"))
                $root.hermes.IntType.encode(message.int, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
            if (message.float != null && Object.hasOwnProperty.call(message, "float"))
                $root.hermes.FloatType.encode(message.float, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
            if (message.string != null && Object.hasOwnProperty.call(message, "string"))
                $root.hermes.StringType.encode(message.string, writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
            if (message["enum"] != null && Object.hasOwnProperty.call(message, "enum"))
                $root.hermes.EnumType.encode(message["enum"], writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
            if (message.bitmask != null && Object.hasOwnProperty.call(message, "bitmask"))
                $root.hermes.EnumType.encode(message.bitmask, writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
            if (message.object != null && Object.hasOwnProperty.call(message, "object"))
                $root.hermes.ObjectType.encode(message.object, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
            if (message.array != null && Object.hasOwnProperty.call(message, "array"))
                $root.hermes.ArrayType.encode(message.array, writer.uint32(/* id 9, wireType 2 =*/74).fork(), q + 1).ldelim();
            if (message.bytes != null && Object.hasOwnProperty.call(message, "bytes"))
                $root.hermes.BytesType.encode(message.bytes, writer.uint32(/* id 10, wireType 2 =*/82).fork(), q + 1).ldelim();
            if (message["void"] != null && Object.hasOwnProperty.call(message, "void"))
                $root.hermes.VoidType.encode(message["void"], writer.uint32(/* id 11, wireType 2 =*/90).fork(), q + 1).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.metadata);
            return writer;
        };

        /**
         * Encodes the specified Type message, length delimited. Does not implicitly {@link hermes.Type.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Type
         * @static
         * @param {hermes.IType} message Type message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Type.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Type message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Type
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Type} Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Type.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Type();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.ref = $root.hermes.ReferenceType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 2: {
                        message.bool = $root.hermes.BooleanType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 3: {
                        message.int = $root.hermes.IntType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 4: {
                        message.float = $root.hermes.FloatType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 5: {
                        message.string = $root.hermes.StringType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 6: {
                        message["enum"] = $root.hermes.EnumType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 7: {
                        message.bitmask = $root.hermes.EnumType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 8: {
                        message.object = $root.hermes.ObjectType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 9: {
                        message.array = $root.hermes.ArrayType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 10: {
                        message.bytes = $root.hermes.BytesType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 11: {
                        message["void"] = $root.hermes.VoidType.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 12: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Type message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Type
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Type} Type
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Type.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Type message.
         * @function verify
         * @memberof hermes.Type
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Type.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            var properties = {};
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref")) {
                properties.value = 1;
                {
                    var error = $root.hermes.ReferenceType.verify(message.ref, long + 1);
                    if (error)
                        return "ref." + error;
                }
            }
            if (message.bool != null && Object.hasOwnProperty.call(message, "bool")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.BooleanType.verify(message.bool, long + 1);
                    if (error)
                        return "bool." + error;
                }
            }
            if (message.int != null && Object.hasOwnProperty.call(message, "int")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.IntType.verify(message.int, long + 1);
                    if (error)
                        return "int." + error;
                }
            }
            if (message.float != null && Object.hasOwnProperty.call(message, "float")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.FloatType.verify(message.float, long + 1);
                    if (error)
                        return "float." + error;
                }
            }
            if (message.string != null && Object.hasOwnProperty.call(message, "string")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.StringType.verify(message.string, long + 1);
                    if (error)
                        return "string." + error;
                }
            }
            if (message["enum"] != null && Object.hasOwnProperty.call(message, "enum")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.EnumType.verify(message["enum"], long + 1);
                    if (error)
                        return "enum." + error;
                }
            }
            if (message.bitmask != null && Object.hasOwnProperty.call(message, "bitmask")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.EnumType.verify(message.bitmask, long + 1);
                    if (error)
                        return "bitmask." + error;
                }
            }
            if (message.object != null && Object.hasOwnProperty.call(message, "object")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.ObjectType.verify(message.object, long + 1);
                    if (error)
                        return "object." + error;
                }
            }
            if (message.array != null && Object.hasOwnProperty.call(message, "array")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.ArrayType.verify(message.array, long + 1);
                    if (error)
                        return "array." + error;
                }
            }
            if (message.bytes != null && Object.hasOwnProperty.call(message, "bytes")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.BytesType.verify(message.bytes, long + 1);
                    if (error)
                        return "bytes." + error;
                }
            }
            if (message["void"] != null && Object.hasOwnProperty.call(message, "void")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.VoidType.verify(message["void"], long + 1);
                    if (error)
                        return "void." + error;
                }
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            return null;
        };

        /**
         * Creates a Type message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Type
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Type} Type
         */
        Type.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.Type)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.Type: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.Type();
            if (object.ref != null) {
                if (!$util.isObject(object.ref))
                    throw TypeError(".hermes.Type.ref: object expected");
                message.ref = $root.hermes.ReferenceType.fromObject(object.ref, long + 1);
            }
            if (object.bool != null) {
                if (!$util.isObject(object.bool))
                    throw TypeError(".hermes.Type.bool: object expected");
                message.bool = $root.hermes.BooleanType.fromObject(object.bool, long + 1);
            }
            if (object.int != null) {
                if (!$util.isObject(object.int))
                    throw TypeError(".hermes.Type.int: object expected");
                message.int = $root.hermes.IntType.fromObject(object.int, long + 1);
            }
            if (object.float != null) {
                if (!$util.isObject(object.float))
                    throw TypeError(".hermes.Type.float: object expected");
                message.float = $root.hermes.FloatType.fromObject(object.float, long + 1);
            }
            if (object.string != null) {
                if (!$util.isObject(object.string))
                    throw TypeError(".hermes.Type.string: object expected");
                message.string = $root.hermes.StringType.fromObject(object.string, long + 1);
            }
            if (object["enum"] != null) {
                if (!$util.isObject(object["enum"]))
                    throw TypeError(".hermes.Type.enum: object expected");
                message["enum"] = $root.hermes.EnumType.fromObject(object["enum"], long + 1);
            }
            if (object.bitmask != null) {
                if (!$util.isObject(object.bitmask))
                    throw TypeError(".hermes.Type.bitmask: object expected");
                message.bitmask = $root.hermes.EnumType.fromObject(object.bitmask, long + 1);
            }
            if (object.object != null) {
                if (!$util.isObject(object.object))
                    throw TypeError(".hermes.Type.object: object expected");
                message.object = $root.hermes.ObjectType.fromObject(object.object, long + 1);
            }
            if (object.array != null) {
                if (!$util.isObject(object.array))
                    throw TypeError(".hermes.Type.array: object expected");
                message.array = $root.hermes.ArrayType.fromObject(object.array, long + 1);
            }
            if (object.bytes != null) {
                if (!$util.isObject(object.bytes))
                    throw TypeError(".hermes.Type.bytes: object expected");
                message.bytes = $root.hermes.BytesType.fromObject(object.bytes, long + 1);
            }
            if (object["void"] != null) {
                if (!$util.isObject(object["void"]))
                    throw TypeError(".hermes.Type.void: object expected");
                message["void"] = $root.hermes.VoidType.fromObject(object["void"], long + 1);
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            return message;
        };

        /**
         * Creates a plain object from a Type message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Type
         * @static
         * @param {hermes.Type} message Type
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Type.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults)
                object.metadata = "";
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref")) {
                object.ref = $root.hermes.ReferenceType.toObject(message.ref, options, q + 1);
                if (options.oneofs)
                    object.value = "ref";
            }
            if (message.bool != null && Object.hasOwnProperty.call(message, "bool")) {
                object.bool = $root.hermes.BooleanType.toObject(message.bool, options, q + 1);
                if (options.oneofs)
                    object.value = "bool";
            }
            if (message.int != null && Object.hasOwnProperty.call(message, "int")) {
                object.int = $root.hermes.IntType.toObject(message.int, options, q + 1);
                if (options.oneofs)
                    object.value = "int";
            }
            if (message.float != null && Object.hasOwnProperty.call(message, "float")) {
                object.float = $root.hermes.FloatType.toObject(message.float, options, q + 1);
                if (options.oneofs)
                    object.value = "float";
            }
            if (message.string != null && Object.hasOwnProperty.call(message, "string")) {
                object.string = $root.hermes.StringType.toObject(message.string, options, q + 1);
                if (options.oneofs)
                    object.value = "string";
            }
            if (message["enum"] != null && Object.hasOwnProperty.call(message, "enum")) {
                object["enum"] = $root.hermes.EnumType.toObject(message["enum"], options, q + 1);
                if (options.oneofs)
                    object.value = "enum";
            }
            if (message.bitmask != null && Object.hasOwnProperty.call(message, "bitmask")) {
                object.bitmask = $root.hermes.EnumType.toObject(message.bitmask, options, q + 1);
                if (options.oneofs)
                    object.value = "bitmask";
            }
            if (message.object != null && Object.hasOwnProperty.call(message, "object")) {
                object.object = $root.hermes.ObjectType.toObject(message.object, options, q + 1);
                if (options.oneofs)
                    object.value = "object";
            }
            if (message.array != null && Object.hasOwnProperty.call(message, "array")) {
                object.array = $root.hermes.ArrayType.toObject(message.array, options, q + 1);
                if (options.oneofs)
                    object.value = "array";
            }
            if (message.bytes != null && Object.hasOwnProperty.call(message, "bytes")) {
                object.bytes = $root.hermes.BytesType.toObject(message.bytes, options, q + 1);
                if (options.oneofs)
                    object.value = "bytes";
            }
            if (message["void"] != null && Object.hasOwnProperty.call(message, "void")) {
                object["void"] = $root.hermes.VoidType.toObject(message["void"], options, q + 1);
                if (options.oneofs)
                    object.value = "void";
            }
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                object.metadata = message.metadata;
            return object;
        };

        /**
         * Converts this Type to JSON.
         * @function toJSON
         * @memberof hermes.Type
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Type.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Type
         * @function getTypeUrl
         * @memberof hermes.Type
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Type.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Type";
        };

        return Type;
    })();

    hermes.ObjectValue = (function() {

        /**
         * Properties of an ObjectValue.
         * @memberof hermes
         * @interface IObjectValue
         * @property {Object.<string,hermes.IValue>|null} [o] ObjectValue o
         */

        /**
         * Constructs a new ObjectValue.
         * @memberof hermes
         * @classdesc Represents an ObjectValue.
         * @implements IObjectValue
         * @constructor
         * @param {hermes.IObjectValue=} [properties] Properties to set
         */
        function ObjectValue(properties) {
            this.o = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ObjectValue o.
         * @member {Object.<string,hermes.IValue>} o
         * @memberof hermes.ObjectValue
         * @instance
         */
        ObjectValue.prototype.o = $util.emptyObject;

        /**
         * Creates a new ObjectValue instance using the specified properties.
         * @function create
         * @memberof hermes.ObjectValue
         * @static
         * @param {hermes.IObjectValue=} [properties] Properties to set
         * @returns {hermes.ObjectValue} ObjectValue instance
         */
        ObjectValue.create = function create(properties) {
            return new ObjectValue(properties);
        };

        /**
         * Encodes the specified ObjectValue message. Does not implicitly {@link hermes.ObjectValue.verify|verify} messages.
         * @function encode
         * @memberof hermes.ObjectValue
         * @static
         * @param {hermes.IObjectValue} message ObjectValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObjectValue.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.o != null && Object.hasOwnProperty.call(message, "o"))
                for (var keys = Object.keys(message.o), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.Value.encode(message.o[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim().ldelim();
                }
            return writer;
        };

        /**
         * Encodes the specified ObjectValue message, length delimited. Does not implicitly {@link hermes.ObjectValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ObjectValue
         * @static
         * @param {hermes.IObjectValue} message ObjectValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ObjectValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ObjectValue message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ObjectValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ObjectValue} ObjectValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObjectValue.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ObjectValue(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (message.o === $util.emptyObject)
                            message.o = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = null;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = $root.hermes.Value.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            default:
                                reader.skipType(tag2 & 7, long);
                                break;
                            }
                        }
                        if (key === "__proto__")
                            $util.makeProp(message.o, key);
                        message.o[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ObjectValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ObjectValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ObjectValue} ObjectValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ObjectValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ObjectValue message.
         * @function verify
         * @memberof hermes.ObjectValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ObjectValue.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.o != null && Object.hasOwnProperty.call(message, "o")) {
                if (!$util.isObject(message.o))
                    return "o: object expected";
                var key = Object.keys(message.o);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.Value.verify(message.o[key[i]], long + 1);
                    if (error)
                        return "o." + error;
                }
            }
            return null;
        };

        /**
         * Creates an ObjectValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ObjectValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ObjectValue} ObjectValue
         */
        ObjectValue.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.ObjectValue)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.ObjectValue: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.ObjectValue();
            if (object.o) {
                if (!$util.isObject(object.o))
                    throw TypeError(".hermes.ObjectValue.o: object expected");
                message.o = {};
                for (var keys = Object.keys(object.o), i = 0; i < keys.length; ++i) {
                    if (keys[i] === "__proto__")
                        $util.makeProp(message.o, keys[i]);
                    if (!$util.isObject(object.o[keys[i]]))
                        throw TypeError(".hermes.ObjectValue.o: object expected");
                    message.o[keys[i]] = $root.hermes.Value.fromObject(object.o[keys[i]], long + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an ObjectValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ObjectValue
         * @static
         * @param {hermes.ObjectValue} message ObjectValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ObjectValue.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.objects || options.defaults)
                object.o = {};
            var keys2;
            if (message.o && (keys2 = Object.keys(message.o)).length) {
                object.o = {};
                for (var j = 0; j < keys2.length; ++j) {
                    if (keys2[j] === "__proto__")
                        $util.makeProp(object.o, keys2[j]);
                    object.o[keys2[j]] = $root.hermes.Value.toObject(message.o[keys2[j]], options, q + 1);
                }
            }
            return object;
        };

        /**
         * Converts this ObjectValue to JSON.
         * @function toJSON
         * @memberof hermes.ObjectValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ObjectValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ObjectValue
         * @function getTypeUrl
         * @memberof hermes.ObjectValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ObjectValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ObjectValue";
        };

        return ObjectValue;
    })();

    hermes.ArrayValue = (function() {

        /**
         * Properties of an ArrayValue.
         * @memberof hermes
         * @interface IArrayValue
         * @property {Array.<hermes.IValue>|null} [value] ArrayValue value
         */

        /**
         * Constructs a new ArrayValue.
         * @memberof hermes
         * @classdesc Represents an ArrayValue.
         * @implements IArrayValue
         * @constructor
         * @param {hermes.IArrayValue=} [properties] Properties to set
         */
        function ArrayValue(properties) {
            this.value = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ArrayValue value.
         * @member {Array.<hermes.IValue>} value
         * @memberof hermes.ArrayValue
         * @instance
         */
        ArrayValue.prototype.value = $util.emptyArray;

        /**
         * Creates a new ArrayValue instance using the specified properties.
         * @function create
         * @memberof hermes.ArrayValue
         * @static
         * @param {hermes.IArrayValue=} [properties] Properties to set
         * @returns {hermes.ArrayValue} ArrayValue instance
         */
        ArrayValue.create = function create(properties) {
            return new ArrayValue(properties);
        };

        /**
         * Encodes the specified ArrayValue message. Does not implicitly {@link hermes.ArrayValue.verify|verify} messages.
         * @function encode
         * @memberof hermes.ArrayValue
         * @static
         * @param {hermes.IArrayValue} message ArrayValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ArrayValue.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.value != null && message.value.length)
                for (var i = 0; i < message.value.length; ++i)
                    $root.hermes.Value.encode(message.value[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ArrayValue message, length delimited. Does not implicitly {@link hermes.ArrayValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ArrayValue
         * @static
         * @param {hermes.IArrayValue} message ArrayValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ArrayValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ArrayValue message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ArrayValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ArrayValue} ArrayValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ArrayValue.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ArrayValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.value && message.value.length))
                            message.value = [];
                        message.value.push($root.hermes.Value.decode(reader, reader.uint32(), undefined, long + 1));
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ArrayValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ArrayValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ArrayValue} ArrayValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ArrayValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ArrayValue message.
         * @function verify
         * @memberof hermes.ArrayValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ArrayValue.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                if (!Array.isArray(message.value))
                    return "value: array expected";
                for (var i = 0; i < message.value.length; ++i) {
                    var error = $root.hermes.Value.verify(message.value[i], long + 1);
                    if (error)
                        return "value." + error;
                }
            }
            return null;
        };

        /**
         * Creates an ArrayValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ArrayValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ArrayValue} ArrayValue
         */
        ArrayValue.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.ArrayValue)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.ArrayValue: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.ArrayValue();
            if (object.value) {
                if (!Array.isArray(object.value))
                    throw TypeError(".hermes.ArrayValue.value: array expected");
                message.value = [];
                for (var i = 0; i < object.value.length; ++i) {
                    if (!$util.isObject(object.value[i]))
                        throw TypeError(".hermes.ArrayValue.value: object expected");
                    message.value[i] = $root.hermes.Value.fromObject(object.value[i], long + 1);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an ArrayValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ArrayValue
         * @static
         * @param {hermes.ArrayValue} message ArrayValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ArrayValue.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.arrays || options.defaults)
                object.value = [];
            if (message.value && message.value.length) {
                object.value = [];
                for (var j = 0; j < message.value.length; ++j)
                    object.value[j] = $root.hermes.Value.toObject(message.value[j], options, q + 1);
            }
            return object;
        };

        /**
         * Converts this ArrayValue to JSON.
         * @function toJSON
         * @memberof hermes.ArrayValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ArrayValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ArrayValue
         * @function getTypeUrl
         * @memberof hermes.ArrayValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ArrayValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ArrayValue";
        };

        return ArrayValue;
    })();

    hermes.BytesValue = (function() {

        /**
         * Properties of a BytesValue.
         * @memberof hermes
         * @interface IBytesValue
         * @property {hermes.NumberKind|null} [kind] BytesValue kind
         * @property {boolean|null} [bigEndian] BytesValue bigEndian
         * @property {Uint8Array|null} [value] BytesValue value
         */

        /**
         * Constructs a new BytesValue.
         * @memberof hermes
         * @classdesc Represents a BytesValue.
         * @implements IBytesValue
         * @constructor
         * @param {hermes.IBytesValue=} [properties] Properties to set
         */
        function BytesValue(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BytesValue kind.
         * @member {hermes.NumberKind} kind
         * @memberof hermes.BytesValue
         * @instance
         */
        BytesValue.prototype.kind = 0;

        /**
         * BytesValue bigEndian.
         * @member {boolean} bigEndian
         * @memberof hermes.BytesValue
         * @instance
         */
        BytesValue.prototype.bigEndian = false;

        /**
         * BytesValue value.
         * @member {Uint8Array} value
         * @memberof hermes.BytesValue
         * @instance
         */
        BytesValue.prototype.value = $util.newBuffer([]);

        /**
         * Creates a new BytesValue instance using the specified properties.
         * @function create
         * @memberof hermes.BytesValue
         * @static
         * @param {hermes.IBytesValue=} [properties] Properties to set
         * @returns {hermes.BytesValue} BytesValue instance
         */
        BytesValue.create = function create(properties) {
            return new BytesValue(properties);
        };

        /**
         * Encodes the specified BytesValue message. Does not implicitly {@link hermes.BytesValue.verify|verify} messages.
         * @function encode
         * @memberof hermes.BytesValue
         * @static
         * @param {hermes.IBytesValue} message BytesValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BytesValue.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.kind);
            if (message.bigEndian != null && Object.hasOwnProperty.call(message, "bigEndian"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.bigEndian);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.value);
            return writer;
        };

        /**
         * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link hermes.BytesValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.BytesValue
         * @static
         * @param {hermes.IBytesValue} message BytesValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BytesValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BytesValue message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.BytesValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.BytesValue} BytesValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BytesValue.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BytesValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.kind = reader.int32();
                        break;
                    }
                case 2: {
                        message.bigEndian = reader.bool();
                        break;
                    }
                case 3: {
                        message.value = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BytesValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.BytesValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.BytesValue} BytesValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BytesValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BytesValue message.
         * @function verify
         * @memberof hermes.BytesValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BytesValue.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                switch (message.kind) {
                default:
                    return "kind: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                    break;
                }
            if (message.bigEndian != null && Object.hasOwnProperty.call(message, "bigEndian"))
                if (typeof message.bigEndian !== "boolean")
                    return "bigEndian: boolean expected";
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                    return "value: buffer expected";
            return null;
        };

        /**
         * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.BytesValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.BytesValue} BytesValue
         */
        BytesValue.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.BytesValue)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.BytesValue: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.BytesValue();
            switch (object.kind) {
            default:
                if (typeof object.kind === "number") {
                    message.kind = object.kind;
                    break;
                }
                break;
            case "NUMBER_U8":
            case 0:
                message.kind = 0;
                break;
            case "NUMBER_I8":
            case 1:
                message.kind = 1;
                break;
            case "NUMBER_U16":
            case 2:
                message.kind = 2;
                break;
            case "NUMBER_I16":
            case 3:
                message.kind = 3;
                break;
            case "NUMBER_U32":
            case 4:
                message.kind = 4;
                break;
            case "NUMBER_I32":
            case 5:
                message.kind = 5;
                break;
            case "NUMBER_U64":
            case 6:
                message.kind = 6;
                break;
            case "NUMBER_I64":
            case 7:
                message.kind = 7;
                break;
            case "NUMBER_F32":
            case 8:
                message.kind = 8;
                break;
            case "NUMBER_F64":
            case 9:
                message.kind = 9;
                break;
            }
            if (object.bigEndian != null)
                message.bigEndian = Boolean(object.bigEndian);
            if (object.value != null)
                if (typeof object.value === "string")
                    $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                else if (object.value.length >= 0)
                    message.value = object.value;
            return message;
        };

        /**
         * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.BytesValue
         * @static
         * @param {hermes.BytesValue} message BytesValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BytesValue.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                object.kind = options.enums === String ? "NUMBER_U8" : 0;
                object.bigEndian = false;
                if (options.bytes === String)
                    object.value = "";
                else {
                    object.value = [];
                    if (options.bytes !== Array)
                        object.value = $util.newBuffer(object.value);
                }
            }
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                object.kind = options.enums === String ? $root.hermes.NumberKind[message.kind] === undefined ? message.kind : $root.hermes.NumberKind[message.kind] : message.kind;
            if (message.bigEndian != null && Object.hasOwnProperty.call(message, "bigEndian"))
                object.bigEndian = message.bigEndian;
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
            return object;
        };

        /**
         * Converts this BytesValue to JSON.
         * @function toJSON
         * @memberof hermes.BytesValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BytesValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BytesValue
         * @function getTypeUrl
         * @memberof hermes.BytesValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BytesValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.BytesValue";
        };

        return BytesValue;
    })();

    hermes.EnumValue = (function() {

        /**
         * Properties of an EnumValue.
         * @memberof hermes
         * @interface IEnumValue
         * @property {number|Long|null} [raw] EnumValue raw
         * @property {string|null} [formatted] EnumValue formatted
         */

        /**
         * Constructs a new EnumValue.
         * @memberof hermes
         * @classdesc Represents an EnumValue.
         * @implements IEnumValue
         * @constructor
         * @param {hermes.IEnumValue=} [properties] Properties to set
         */
        function EnumValue(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnumValue raw.
         * @member {number|Long} raw
         * @memberof hermes.EnumValue
         * @instance
         */
        EnumValue.prototype.raw = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * EnumValue formatted.
         * @member {string} formatted
         * @memberof hermes.EnumValue
         * @instance
         */
        EnumValue.prototype.formatted = "";

        /**
         * Creates a new EnumValue instance using the specified properties.
         * @function create
         * @memberof hermes.EnumValue
         * @static
         * @param {hermes.IEnumValue=} [properties] Properties to set
         * @returns {hermes.EnumValue} EnumValue instance
         */
        EnumValue.create = function create(properties) {
            return new EnumValue(properties);
        };

        /**
         * Encodes the specified EnumValue message. Does not implicitly {@link hermes.EnumValue.verify|verify} messages.
         * @function encode
         * @memberof hermes.EnumValue
         * @static
         * @param {hermes.IEnumValue} message EnumValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnumValue.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.raw);
            if (message.formatted != null && Object.hasOwnProperty.call(message, "formatted"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.formatted);
            return writer;
        };

        /**
         * Encodes the specified EnumValue message, length delimited. Does not implicitly {@link hermes.EnumValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.EnumValue
         * @static
         * @param {hermes.IEnumValue} message EnumValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnumValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnumValue message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.EnumValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.EnumValue} EnumValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnumValue.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EnumValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.raw = reader.int64();
                        break;
                    }
                case 2: {
                        message.formatted = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnumValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.EnumValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.EnumValue} EnumValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnumValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnumValue message.
         * @function verify
         * @memberof hermes.EnumValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnumValue.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                if (!$util.isInteger(message.raw) && !(message.raw && $util.isInteger(message.raw.low) && $util.isInteger(message.raw.high)))
                    return "raw: integer|Long expected";
            if (message.formatted != null && Object.hasOwnProperty.call(message, "formatted"))
                if (!$util.isString(message.formatted))
                    return "formatted: string expected";
            return null;
        };

        /**
         * Creates an EnumValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.EnumValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.EnumValue} EnumValue
         */
        EnumValue.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.EnumValue)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.EnumValue: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.EnumValue();
            if (object.raw != null)
                if ($util.Long)
                    message.raw = $util.Long.fromValue(object.raw, false);
                else if (typeof object.raw === "string")
                    message.raw = parseInt(object.raw, 10);
                else if (typeof object.raw === "number")
                    message.raw = object.raw;
                else if (typeof object.raw === "object")
                    message.raw = new $util.LongBits(object.raw.low >>> 0, object.raw.high >>> 0).toNumber();
            if (object.formatted != null)
                message.formatted = String(object.formatted);
            return message;
        };

        /**
         * Creates a plain object from an EnumValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.EnumValue
         * @static
         * @param {hermes.EnumValue} message EnumValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnumValue.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.raw = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                    object.raw = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                object.formatted = "";
            }
            if (message.raw != null && Object.hasOwnProperty.call(message, "raw"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.raw = typeof message.raw === "number" ? BigInt(message.raw) : $util.Long.fromBits(message.raw.low >>> 0, message.raw.high >>> 0, false).toBigInt();
                else if (typeof message.raw === "number")
                    object.raw = options.longs === String ? String(message.raw) : message.raw;
                else
                    object.raw = options.longs === String ? $util.Long.prototype.toString.call(message.raw) : options.longs === Number ? new $util.LongBits(message.raw.low >>> 0, message.raw.high >>> 0).toNumber() : message.raw;
            if (message.formatted != null && Object.hasOwnProperty.call(message, "formatted"))
                object.formatted = message.formatted;
            return object;
        };

        /**
         * Converts this EnumValue to JSON.
         * @function toJSON
         * @memberof hermes.EnumValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnumValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnumValue
         * @function getTypeUrl
         * @memberof hermes.EnumValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnumValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.EnumValue";
        };

        return EnumValue;
    })();

    hermes.Value = (function() {

        /**
         * Properties of a Value.
         * @memberof hermes
         * @interface IValue
         * @property {number|Long|null} [i] Value i
         * @property {number|Long|null} [u] Value u
         * @property {number|null} [f] Value f
         * @property {boolean|null} [b] Value b
         * @property {string|null} [s] Value s
         * @property {hermes.IEnumValue|null} [e] Value e
         * @property {hermes.IObjectValue|null} [o] Value o
         * @property {hermes.IArrayValue|null} [a] Value a
         * @property {hermes.IBytesValue|null} [r] Value r
         */

        /**
         * Constructs a new Value.
         * @memberof hermes
         * @classdesc Represents a Value.
         * @implements IValue
         * @constructor
         * @param {hermes.IValue=} [properties] Properties to set
         */
        function Value(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Value i.
         * @member {number|Long|null|undefined} i
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.i = null;

        /**
         * Value u.
         * @member {number|Long|null|undefined} u
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.u = null;

        /**
         * Value f.
         * @member {number|null|undefined} f
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.f = null;

        /**
         * Value b.
         * @member {boolean|null|undefined} b
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.b = null;

        /**
         * Value s.
         * @member {string|null|undefined} s
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.s = null;

        /**
         * Value e.
         * @member {hermes.IEnumValue|null|undefined} e
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.e = null;

        /**
         * Value o.
         * @member {hermes.IObjectValue|null|undefined} o
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.o = null;

        /**
         * Value a.
         * @member {hermes.IArrayValue|null|undefined} a
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.a = null;

        /**
         * Value r.
         * @member {hermes.IBytesValue|null|undefined} r
         * @memberof hermes.Value
         * @instance
         */
        Value.prototype.r = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Value value.
         * @member {"i"|"u"|"f"|"b"|"s"|"e"|"o"|"a"|"r"|undefined} value
         * @memberof hermes.Value
         * @instance
         */
        Object.defineProperty(Value.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["i", "u", "f", "b", "s", "e", "o", "a", "r"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Value instance using the specified properties.
         * @function create
         * @memberof hermes.Value
         * @static
         * @param {hermes.IValue=} [properties] Properties to set
         * @returns {hermes.Value} Value instance
         */
        Value.create = function create(properties) {
            return new Value(properties);
        };

        /**
         * Encodes the specified Value message. Does not implicitly {@link hermes.Value.verify|verify} messages.
         * @function encode
         * @memberof hermes.Value
         * @static
         * @param {hermes.IValue} message Value message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Value.encode = function encode(message, writer, q) {
            if (!writer)
                writer = $Writer.create();
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            if (message.i != null && Object.hasOwnProperty.call(message, "i"))
                writer.uint32(/* id 1, wireType 0 =*/8).sint64(message.i);
            if (message.u != null && Object.hasOwnProperty.call(message, "u"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.u);
            if (message.f != null && Object.hasOwnProperty.call(message, "f"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.f);
            if (message.b != null && Object.hasOwnProperty.call(message, "b"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.b);
            if (message.s != null && Object.hasOwnProperty.call(message, "s"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.s);
            if (message.e != null && Object.hasOwnProperty.call(message, "e"))
                $root.hermes.EnumValue.encode(message.e, writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
            if (message.o != null && Object.hasOwnProperty.call(message, "o"))
                $root.hermes.ObjectValue.encode(message.o, writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
            if (message.a != null && Object.hasOwnProperty.call(message, "a"))
                $root.hermes.ArrayValue.encode(message.a, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
            if (message.r != null && Object.hasOwnProperty.call(message, "r"))
                $root.hermes.BytesValue.encode(message.r, writer.uint32(/* id 9, wireType 2 =*/74).fork(), q + 1).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Value message, length delimited. Does not implicitly {@link hermes.Value.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Value
         * @static
         * @param {hermes.IValue} message Value message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Value.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Value message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Value
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Value} Value
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Value.decode = function decode(reader, length, error, long) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (long === undefined)
                long = 0;
            if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Value();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.i = reader.sint64();
                        break;
                    }
                case 2: {
                        message.u = reader.uint64();
                        break;
                    }
                case 3: {
                        message.f = reader.double();
                        break;
                    }
                case 4: {
                        message.b = reader.bool();
                        break;
                    }
                case 5: {
                        message.s = reader.string();
                        break;
                    }
                case 6: {
                        message.e = $root.hermes.EnumValue.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 7: {
                        message.o = $root.hermes.ObjectValue.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 8: {
                        message.a = $root.hermes.ArrayValue.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                case 9: {
                        message.r = $root.hermes.BytesValue.decode(reader, reader.uint32(), undefined, long + 1);
                        break;
                    }
                default:
                    reader.skipType(tag & 7, long);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Value message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Value
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Value} Value
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Value.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Value message.
         * @function verify
         * @memberof hermes.Value
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Value.verify = function verify(message, long) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
            var properties = {};
            if (message.i != null && Object.hasOwnProperty.call(message, "i")) {
                properties.value = 1;
                if (!$util.isInteger(message.i) && !(message.i && $util.isInteger(message.i.low) && $util.isInteger(message.i.high)))
                    return "i: integer|Long expected";
            }
            if (message.u != null && Object.hasOwnProperty.call(message, "u")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isInteger(message.u) && !(message.u && $util.isInteger(message.u.low) && $util.isInteger(message.u.high)))
                    return "u: integer|Long expected";
            }
            if (message.f != null && Object.hasOwnProperty.call(message, "f")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (typeof message.f !== "number")
                    return "f: number expected";
            }
            if (message.b != null && Object.hasOwnProperty.call(message, "b")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (typeof message.b !== "boolean")
                    return "b: boolean expected";
            }
            if (message.s != null && Object.hasOwnProperty.call(message, "s")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isString(message.s))
                    return "s: string expected";
            }
            if (message.e != null && Object.hasOwnProperty.call(message, "e")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.EnumValue.verify(message.e, long + 1);
                    if (error)
                        return "e." + error;
                }
            }
            if (message.o != null && Object.hasOwnProperty.call(message, "o")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.ObjectValue.verify(message.o, long + 1);
                    if (error)
                        return "o." + error;
                }
            }
            if (message.a != null && Object.hasOwnProperty.call(message, "a")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.ArrayValue.verify(message.a, long + 1);
                    if (error)
                        return "a." + error;
                }
            }
            if (message.r != null && Object.hasOwnProperty.call(message, "r")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.BytesValue.verify(message.r, long + 1);
                    if (error)
                        return "r." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Value message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Value
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Value} Value
         */
        Value.fromObject = function fromObject(object, long) {
            if (object instanceof $root.hermes.Value)
                return object;
            if (!$util.isObject(object))
                throw TypeError(".hermes.Value: object expected");
            if (long === undefined)
                long = 0;
            if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
            var message = new $root.hermes.Value();
            if (object.i != null)
                if ($util.Long)
                    message.i = $util.Long.fromValue(object.i, false);
                else if (typeof object.i === "string")
                    message.i = parseInt(object.i, 10);
                else if (typeof object.i === "number")
                    message.i = object.i;
                else if (typeof object.i === "object")
                    message.i = new $util.LongBits(object.i.low >>> 0, object.i.high >>> 0).toNumber();
            if (object.u != null)
                if ($util.Long)
                    message.u = $util.Long.fromValue(object.u, true);
                else if (typeof object.u === "string")
                    message.u = parseInt(object.u, 10);
                else if (typeof object.u === "number")
                    message.u = object.u;
                else if (typeof object.u === "object")
                    message.u = new $util.LongBits(object.u.low >>> 0, object.u.high >>> 0).toNumber(true);
            if (object.f != null)
                message.f = Number(object.f);
            if (object.b != null)
                message.b = Boolean(object.b);
            if (object.s != null)
                message.s = String(object.s);
            if (object.e != null) {
                if (!$util.isObject(object.e))
                    throw TypeError(".hermes.Value.e: object expected");
                message.e = $root.hermes.EnumValue.fromObject(object.e, long + 1);
            }
            if (object.o != null) {
                if (!$util.isObject(object.o))
                    throw TypeError(".hermes.Value.o: object expected");
                message.o = $root.hermes.ObjectValue.fromObject(object.o, long + 1);
            }
            if (object.a != null) {
                if (!$util.isObject(object.a))
                    throw TypeError(".hermes.Value.a: object expected");
                message.a = $root.hermes.ArrayValue.fromObject(object.a, long + 1);
            }
            if (object.r != null) {
                if (!$util.isObject(object.r))
                    throw TypeError(".hermes.Value.r: object expected");
                message.r = $root.hermes.BytesValue.fromObject(object.r, long + 1);
            }
            return message;
        };

        /**
         * Creates a plain object from a Value message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Value
         * @static
         * @param {hermes.Value} message Value
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Value.toObject = function toObject(message, options, q) {
            if (!options)
                options = {};
            if (q === undefined)
                q = 0;
            if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
            var object = {};
            if (message.i != null && Object.hasOwnProperty.call(message, "i")) {
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.i = typeof message.i === "number" ? BigInt(message.i) : $util.Long.fromBits(message.i.low >>> 0, message.i.high >>> 0, false).toBigInt();
                else if (typeof message.i === "number")
                    object.i = options.longs === String ? String(message.i) : message.i;
                else
                    object.i = options.longs === String ? $util.Long.prototype.toString.call(message.i) : options.longs === Number ? new $util.LongBits(message.i.low >>> 0, message.i.high >>> 0).toNumber() : message.i;
                if (options.oneofs)
                    object.value = "i";
            }
            if (message.u != null && Object.hasOwnProperty.call(message, "u")) {
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                    object.u = typeof message.u === "number" ? BigInt(message.u) : $util.Long.fromBits(message.u.low >>> 0, message.u.high >>> 0, true).toBigInt();
                else if (typeof message.u === "number")
                    object.u = options.longs === String ? String(message.u) : message.u;
                else
                    object.u = options.longs === String ? $util.Long.prototype.toString.call(message.u) : options.longs === Number ? new $util.LongBits(message.u.low >>> 0, message.u.high >>> 0).toNumber(true) : message.u;
                if (options.oneofs)
                    object.value = "u";
            }
            if (message.f != null && Object.hasOwnProperty.call(message, "f")) {
                object.f = options.json && !isFinite(message.f) ? String(message.f) : message.f;
                if (options.oneofs)
                    object.value = "f";
            }
            if (message.b != null && Object.hasOwnProperty.call(message, "b")) {
                object.b = message.b;
                if (options.oneofs)
                    object.value = "b";
            }
            if (message.s != null && Object.hasOwnProperty.call(message, "s")) {
                object.s = message.s;
                if (options.oneofs)
                    object.value = "s";
            }
            if (message.e != null && Object.hasOwnProperty.call(message, "e")) {
                object.e = $root.hermes.EnumValue.toObject(message.e, options, q + 1);
                if (options.oneofs)
                    object.value = "e";
            }
            if (message.o != null && Object.hasOwnProperty.call(message, "o")) {
                object.o = $root.hermes.ObjectValue.toObject(message.o, options, q + 1);
                if (options.oneofs)
                    object.value = "o";
            }
            if (message.a != null && Object.hasOwnProperty.call(message, "a")) {
                object.a = $root.hermes.ArrayValue.toObject(message.a, options, q + 1);
                if (options.oneofs)
                    object.value = "a";
            }
            if (message.r != null && Object.hasOwnProperty.call(message, "r")) {
                object.r = $root.hermes.BytesValue.toObject(message.r, options, q + 1);
                if (options.oneofs)
                    object.value = "r";
            }
            return object;
        };

        /**
         * Converts this Value to JSON.
         * @function toJSON
         * @memberof hermes.Value
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Value.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Value
         * @function getTypeUrl
         * @memberof hermes.Value
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Value.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Value";
        };

        return Value;
    })();

    return hermes;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @property {number|Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @implements ITimestamp
             * @constructor
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             */
            function Timestamp(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Timestamp seconds.
             * @member {number|Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             * @returns {google.protobuf.Timestamp} Timestamp instance
             */
            Timestamp.create = function create(properties) {
                return new Timestamp(properties);
            };

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function encode(message, writer, q) {
                if (!writer)
                    writer = $Writer.create();
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                return writer;
            };

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function decode(reader, length, error, long) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (long === undefined)
                    long = 0;
                if (long > $Reader.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.seconds = reader.int64();
                            break;
                        }
                    case 2: {
                            message.nanos = reader.int32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7, long);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Timestamp message.
             * @function verify
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Timestamp.verify = function verify(message, long) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    return "maximum nesting depth exceeded";
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                    if (!$util.isInteger(message.nanos))
                        return "nanos: integer expected";
                return null;
            };

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Timestamp} Timestamp
             */
            Timestamp.fromObject = function fromObject(object, long) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                if (!$util.isObject(object))
                    throw TypeError(".google.protobuf.Timestamp: object expected");
                if (long === undefined)
                    long = 0;
                if (long > $util.recursionLimit)
                    throw Error("maximum nesting depth exceeded");
                var message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        message.seconds = $util.Long.fromValue(object.seconds, false);
                    else if (typeof object.seconds === "string")
                        message.seconds = parseInt(object.seconds, 10);
                    else if (typeof object.seconds === "number")
                        message.seconds = object.seconds;
                    else if (typeof object.seconds === "object")
                        message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                if (object.nanos != null)
                    message.nanos = object.nanos | 0;
                return message;
            };

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp} message Timestamp
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Timestamp.toObject = function toObject(message, options, q) {
                if (!options)
                    options = {};
                if (q === undefined)
                    q = 0;
                if (q > $util.recursionLimit)
                    throw Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    if (typeof BigInt !== "undefined" && options.longs === BigInt)
                        object.seconds = typeof message.seconds === "number" ? BigInt(message.seconds) : $util.Long.fromBits(message.seconds.low >>> 0, message.seconds.high >>> 0, false).toBigInt();
                    else if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                    object.nanos = message.nanos;
                return object;
            };

            /**
             * Converts this Timestamp to JSON.
             * @function toJSON
             * @memberof google.protobuf.Timestamp
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Timestamp.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Timestamp
             * @function getTypeUrl
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Timestamp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Timestamp";
            };

            return Timestamp;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
