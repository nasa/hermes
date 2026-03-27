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
                    if (properties[keys[i]] != null)
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
        BusFilter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        BusFilter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BusFilter();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        BusFilter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.names != null && message.hasOwnProperty("names")) {
                if (!Array.isArray(message.names))
                    return "names: array expected";
                for (var i = 0; i < message.names.length; ++i)
                    if (!$util.isString(message.names[i]))
                        return "names: string[] expected";
            }
            if (message.context != null && message.hasOwnProperty("context"))
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
        BusFilter.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.BusFilter)
                return object;
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
        BusFilter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.names = [];
            if (options.defaults) {
                object.source = "";
                object.context = options.enums === String ? "REALTIME_ONLY" : 0;
            }
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.names && message.names.length) {
                object.names = [];
                for (var j = 0; j < message.names.length; ++j)
                    object.names[j] = message.names[j];
            }
            if (message.context != null && message.hasOwnProperty("context"))
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
     * SourceContext enum.
     * @name hermes.SourceContext
     * @enum {number}
     * @property {number} REALTIME=0 REALTIME value
     * @property {number} RECORDED=1 RECORDED value
     */
    hermes.SourceContext = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "REALTIME"] = 0;
        values[valuesById[1] = "RECORDED"] = 1;
        return values;
    })();

    hermes.Event = (function() {

        /**
         * Properties of an Event.
         * @memberof hermes
         * @interface IEvent
         * @property {hermes.IEventRef|null} [ref] Event ref
         * @property {hermes.ITime|null} [time] Event time
         * @property {string|null} [message] Event message
         * @property {Array.<hermes.IValue>|null} [args] Event args
         * @property {Object.<string,hermes.IValue>|null} [tags] Event tags
         */

        /**
         * Constructs a new Event.
         * @memberof hermes
         * @classdesc Represents an Event.
         * @implements IEvent
         * @constructor
         * @param {hermes.IEvent=} [properties] Properties to set
         */
        function Event(properties) {
            this.args = [];
            this.tags = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Event ref.
         * @member {hermes.IEventRef|null|undefined} ref
         * @memberof hermes.Event
         * @instance
         */
        Event.prototype.ref = null;

        /**
         * Event time.
         * @member {hermes.ITime|null|undefined} time
         * @memberof hermes.Event
         * @instance
         */
        Event.prototype.time = null;

        /**
         * Event message.
         * @member {string} message
         * @memberof hermes.Event
         * @instance
         */
        Event.prototype.message = "";

        /**
         * Event args.
         * @member {Array.<hermes.IValue>} args
         * @memberof hermes.Event
         * @instance
         */
        Event.prototype.args = $util.emptyArray;

        /**
         * Event tags.
         * @member {Object.<string,hermes.IValue>} tags
         * @memberof hermes.Event
         * @instance
         */
        Event.prototype.tags = $util.emptyObject;

        /**
         * Creates a new Event instance using the specified properties.
         * @function create
         * @memberof hermes.Event
         * @static
         * @param {hermes.IEvent=} [properties] Properties to set
         * @returns {hermes.Event} Event instance
         */
        Event.create = function create(properties) {
            return new Event(properties);
        };

        /**
         * Encodes the specified Event message. Does not implicitly {@link hermes.Event.verify|verify} messages.
         * @function encode
         * @memberof hermes.Event
         * @static
         * @param {hermes.IEvent} message Event message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Event.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref"))
                $root.hermes.EventRef.encode(message.ref, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                $root.hermes.Time.encode(message.time, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
            if (message.args != null && message.args.length)
                for (var i = 0; i < message.args.length; ++i)
                    $root.hermes.Value.encode(message.args[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.tags != null && Object.hasOwnProperty.call(message, "tags"))
                for (var keys = Object.keys(message.tags), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.Value.encode(message.tags[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            return writer;
        };

        /**
         * Encodes the specified Event message, length delimited. Does not implicitly {@link hermes.Event.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Event
         * @static
         * @param {hermes.IEvent} message Event message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Event.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Event message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Event
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Event} Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Event.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Event(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ref = $root.hermes.EventRef.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.time = $root.hermes.Time.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.message = reader.string();
                        break;
                    }
                case 4: {
                        if (!(message.args && message.args.length))
                            message.args = [];
                        message.args.push($root.hermes.Value.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        if (message.tags === $util.emptyObject)
                            message.tags = {};
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
                                value = $root.hermes.Value.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.tags[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Event message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Event
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Event} Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Event.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Event message.
         * @function verify
         * @memberof hermes.Event
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Event.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ref != null && message.hasOwnProperty("ref")) {
                var error = $root.hermes.EventRef.verify(message.ref);
                if (error)
                    return "ref." + error;
            }
            if (message.time != null && message.hasOwnProperty("time")) {
                var error = $root.hermes.Time.verify(message.time);
                if (error)
                    return "time." + error;
            }
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.args != null && message.hasOwnProperty("args")) {
                if (!Array.isArray(message.args))
                    return "args: array expected";
                for (var i = 0; i < message.args.length; ++i) {
                    var error = $root.hermes.Value.verify(message.args[i]);
                    if (error)
                        return "args." + error;
                }
            }
            if (message.tags != null && message.hasOwnProperty("tags")) {
                if (!$util.isObject(message.tags))
                    return "tags: object expected";
                var key = Object.keys(message.tags);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.Value.verify(message.tags[key[i]]);
                    if (error)
                        return "tags." + error;
                }
            }
            return null;
        };

        /**
         * Creates an Event message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Event
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Event} Event
         */
        Event.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Event)
                return object;
            var message = new $root.hermes.Event();
            if (object.ref != null) {
                if (typeof object.ref !== "object")
                    throw TypeError(".hermes.Event.ref: object expected");
                message.ref = $root.hermes.EventRef.fromObject(object.ref);
            }
            if (object.time != null) {
                if (typeof object.time !== "object")
                    throw TypeError(".hermes.Event.time: object expected");
                message.time = $root.hermes.Time.fromObject(object.time);
            }
            if (object.message != null)
                message.message = String(object.message);
            if (object.args) {
                if (!Array.isArray(object.args))
                    throw TypeError(".hermes.Event.args: array expected");
                message.args = [];
                for (var i = 0; i < object.args.length; ++i) {
                    if (typeof object.args[i] !== "object")
                        throw TypeError(".hermes.Event.args: object expected");
                    message.args[i] = $root.hermes.Value.fromObject(object.args[i]);
                }
            }
            if (object.tags) {
                if (typeof object.tags !== "object")
                    throw TypeError(".hermes.Event.tags: object expected");
                message.tags = {};
                for (var keys = Object.keys(object.tags), i = 0; i < keys.length; ++i) {
                    if (typeof object.tags[keys[i]] !== "object")
                        throw TypeError(".hermes.Event.tags: object expected");
                    message.tags[keys[i]] = $root.hermes.Value.fromObject(object.tags[keys[i]]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an Event message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Event
         * @static
         * @param {hermes.Event} message Event
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Event.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.args = [];
            if (options.objects || options.defaults)
                object.tags = {};
            if (options.defaults) {
                object.ref = null;
                object.time = null;
                object.message = "";
            }
            if (message.ref != null && message.hasOwnProperty("ref"))
                object.ref = $root.hermes.EventRef.toObject(message.ref, options);
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = $root.hermes.Time.toObject(message.time, options);
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.args && message.args.length) {
                object.args = [];
                for (var j = 0; j < message.args.length; ++j)
                    object.args[j] = $root.hermes.Value.toObject(message.args[j], options);
            }
            var keys2;
            if (message.tags && (keys2 = Object.keys(message.tags)).length) {
                object.tags = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.tags[keys2[j]] = $root.hermes.Value.toObject(message.tags[keys2[j]], options);
            }
            return object;
        };

        /**
         * Converts this Event to JSON.
         * @function toJSON
         * @memberof hermes.Event
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Event.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Event
         * @function getTypeUrl
         * @memberof hermes.Event
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Event.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Event";
        };

        return Event;
    })();

    hermes.Telemetry = (function() {

        /**
         * Properties of a Telemetry.
         * @memberof hermes
         * @interface ITelemetry
         * @property {hermes.ITelemetryRef|null} [ref] Telemetry ref
         * @property {hermes.ITime|null} [time] Telemetry time
         * @property {hermes.IValue|null} [value] Telemetry value
         * @property {Object.<string,string>|null} [labels] Telemetry labels
         */

        /**
         * Constructs a new Telemetry.
         * @memberof hermes
         * @classdesc Represents a Telemetry.
         * @implements ITelemetry
         * @constructor
         * @param {hermes.ITelemetry=} [properties] Properties to set
         */
        function Telemetry(properties) {
            this.labels = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Telemetry ref.
         * @member {hermes.ITelemetryRef|null|undefined} ref
         * @memberof hermes.Telemetry
         * @instance
         */
        Telemetry.prototype.ref = null;

        /**
         * Telemetry time.
         * @member {hermes.ITime|null|undefined} time
         * @memberof hermes.Telemetry
         * @instance
         */
        Telemetry.prototype.time = null;

        /**
         * Telemetry value.
         * @member {hermes.IValue|null|undefined} value
         * @memberof hermes.Telemetry
         * @instance
         */
        Telemetry.prototype.value = null;

        /**
         * Telemetry labels.
         * @member {Object.<string,string>} labels
         * @memberof hermes.Telemetry
         * @instance
         */
        Telemetry.prototype.labels = $util.emptyObject;

        /**
         * Creates a new Telemetry instance using the specified properties.
         * @function create
         * @memberof hermes.Telemetry
         * @static
         * @param {hermes.ITelemetry=} [properties] Properties to set
         * @returns {hermes.Telemetry} Telemetry instance
         */
        Telemetry.create = function create(properties) {
            return new Telemetry(properties);
        };

        /**
         * Encodes the specified Telemetry message. Does not implicitly {@link hermes.Telemetry.verify|verify} messages.
         * @function encode
         * @memberof hermes.Telemetry
         * @static
         * @param {hermes.ITelemetry} message Telemetry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Telemetry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref"))
                $root.hermes.TelemetryRef.encode(message.ref, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                $root.hermes.Time.encode(message.time, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                $root.hermes.Value.encode(message.value, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.labels != null && Object.hasOwnProperty.call(message, "labels"))
                for (var keys = Object.keys(message.labels), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.labels[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Telemetry message, length delimited. Does not implicitly {@link hermes.Telemetry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Telemetry
         * @static
         * @param {hermes.ITelemetry} message Telemetry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Telemetry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Telemetry message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Telemetry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Telemetry} Telemetry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Telemetry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Telemetry(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ref = $root.hermes.TelemetryRef.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.time = $root.hermes.Time.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.value = $root.hermes.Value.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        if (message.labels === $util.emptyObject)
                            message.labels = {};
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.labels[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Telemetry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Telemetry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Telemetry} Telemetry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Telemetry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Telemetry message.
         * @function verify
         * @memberof hermes.Telemetry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Telemetry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ref != null && message.hasOwnProperty("ref")) {
                var error = $root.hermes.TelemetryRef.verify(message.ref);
                if (error)
                    return "ref." + error;
            }
            if (message.time != null && message.hasOwnProperty("time")) {
                var error = $root.hermes.Time.verify(message.time);
                if (error)
                    return "time." + error;
            }
            if (message.value != null && message.hasOwnProperty("value")) {
                var error = $root.hermes.Value.verify(message.value);
                if (error)
                    return "value." + error;
            }
            if (message.labels != null && message.hasOwnProperty("labels")) {
                if (!$util.isObject(message.labels))
                    return "labels: object expected";
                var key = Object.keys(message.labels);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.labels[key[i]]))
                        return "labels: string{k:string} expected";
            }
            return null;
        };

        /**
         * Creates a Telemetry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Telemetry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Telemetry} Telemetry
         */
        Telemetry.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Telemetry)
                return object;
            var message = new $root.hermes.Telemetry();
            if (object.ref != null) {
                if (typeof object.ref !== "object")
                    throw TypeError(".hermes.Telemetry.ref: object expected");
                message.ref = $root.hermes.TelemetryRef.fromObject(object.ref);
            }
            if (object.time != null) {
                if (typeof object.time !== "object")
                    throw TypeError(".hermes.Telemetry.time: object expected");
                message.time = $root.hermes.Time.fromObject(object.time);
            }
            if (object.value != null) {
                if (typeof object.value !== "object")
                    throw TypeError(".hermes.Telemetry.value: object expected");
                message.value = $root.hermes.Value.fromObject(object.value);
            }
            if (object.labels) {
                if (typeof object.labels !== "object")
                    throw TypeError(".hermes.Telemetry.labels: object expected");
                message.labels = {};
                for (var keys = Object.keys(object.labels), i = 0; i < keys.length; ++i)
                    message.labels[keys[i]] = String(object.labels[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Telemetry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Telemetry
         * @static
         * @param {hermes.Telemetry} message Telemetry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Telemetry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.labels = {};
            if (options.defaults) {
                object.ref = null;
                object.time = null;
                object.value = null;
            }
            if (message.ref != null && message.hasOwnProperty("ref"))
                object.ref = $root.hermes.TelemetryRef.toObject(message.ref, options);
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = $root.hermes.Time.toObject(message.time, options);
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = $root.hermes.Value.toObject(message.value, options);
            var keys2;
            if (message.labels && (keys2 = Object.keys(message.labels)).length) {
                object.labels = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.labels[keys2[j]] = message.labels[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this Telemetry to JSON.
         * @function toJSON
         * @memberof hermes.Telemetry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Telemetry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Telemetry
         * @function getTypeUrl
         * @memberof hermes.Telemetry
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Telemetry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Telemetry";
        };

        return Telemetry;
    })();

    hermes.SourcedEvent = (function() {

        /**
         * Properties of a SourcedEvent.
         * @memberof hermes
         * @interface ISourcedEvent
         * @property {hermes.IEvent|null} [event] SourcedEvent event
         * @property {string|null} [source] SourcedEvent source
         * @property {hermes.SourceContext|null} [context] SourcedEvent context
         */

        /**
         * Constructs a new SourcedEvent.
         * @memberof hermes
         * @classdesc Represents a SourcedEvent.
         * @implements ISourcedEvent
         * @constructor
         * @param {hermes.ISourcedEvent=} [properties] Properties to set
         */
        function SourcedEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SourcedEvent event.
         * @member {hermes.IEvent|null|undefined} event
         * @memberof hermes.SourcedEvent
         * @instance
         */
        SourcedEvent.prototype.event = null;

        /**
         * SourcedEvent source.
         * @member {string} source
         * @memberof hermes.SourcedEvent
         * @instance
         */
        SourcedEvent.prototype.source = "";

        /**
         * SourcedEvent context.
         * @member {hermes.SourceContext} context
         * @memberof hermes.SourcedEvent
         * @instance
         */
        SourcedEvent.prototype.context = 0;

        /**
         * Creates a new SourcedEvent instance using the specified properties.
         * @function create
         * @memberof hermes.SourcedEvent
         * @static
         * @param {hermes.ISourcedEvent=} [properties] Properties to set
         * @returns {hermes.SourcedEvent} SourcedEvent instance
         */
        SourcedEvent.create = function create(properties) {
            return new SourcedEvent(properties);
        };

        /**
         * Encodes the specified SourcedEvent message. Does not implicitly {@link hermes.SourcedEvent.verify|verify} messages.
         * @function encode
         * @memberof hermes.SourcedEvent
         * @static
         * @param {hermes.ISourcedEvent} message SourcedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SourcedEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.event != null && Object.hasOwnProperty.call(message, "event"))
                $root.hermes.Event.encode(message.event, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.source);
            if (message.context != null && Object.hasOwnProperty.call(message, "context"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.context);
            return writer;
        };

        /**
         * Encodes the specified SourcedEvent message, length delimited. Does not implicitly {@link hermes.SourcedEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.SourcedEvent
         * @static
         * @param {hermes.ISourcedEvent} message SourcedEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SourcedEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SourcedEvent message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.SourcedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.SourcedEvent} SourcedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SourcedEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.SourcedEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.event = $root.hermes.Event.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.source = reader.string();
                        break;
                    }
                case 3: {
                        message.context = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SourcedEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.SourcedEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.SourcedEvent} SourcedEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SourcedEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SourcedEvent message.
         * @function verify
         * @memberof hermes.SourcedEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SourcedEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.event != null && message.hasOwnProperty("event")) {
                var error = $root.hermes.Event.verify(message.event);
                if (error)
                    return "event." + error;
            }
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.context != null && message.hasOwnProperty("context"))
                switch (message.context) {
                default:
                    return "context: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };

        /**
         * Creates a SourcedEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.SourcedEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.SourcedEvent} SourcedEvent
         */
        SourcedEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.SourcedEvent)
                return object;
            var message = new $root.hermes.SourcedEvent();
            if (object.event != null) {
                if (typeof object.event !== "object")
                    throw TypeError(".hermes.SourcedEvent.event: object expected");
                message.event = $root.hermes.Event.fromObject(object.event);
            }
            if (object.source != null)
                message.source = String(object.source);
            switch (object.context) {
            default:
                if (typeof object.context === "number") {
                    message.context = object.context;
                    break;
                }
                break;
            case "REALTIME":
            case 0:
                message.context = 0;
                break;
            case "RECORDED":
            case 1:
                message.context = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a SourcedEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.SourcedEvent
         * @static
         * @param {hermes.SourcedEvent} message SourcedEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SourcedEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.event = null;
                object.source = "";
                object.context = options.enums === String ? "REALTIME" : 0;
            }
            if (message.event != null && message.hasOwnProperty("event"))
                object.event = $root.hermes.Event.toObject(message.event, options);
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.context != null && message.hasOwnProperty("context"))
                object.context = options.enums === String ? $root.hermes.SourceContext[message.context] === undefined ? message.context : $root.hermes.SourceContext[message.context] : message.context;
            return object;
        };

        /**
         * Converts this SourcedEvent to JSON.
         * @function toJSON
         * @memberof hermes.SourcedEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SourcedEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SourcedEvent
         * @function getTypeUrl
         * @memberof hermes.SourcedEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SourcedEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.SourcedEvent";
        };

        return SourcedEvent;
    })();

    hermes.SourcedTelemetry = (function() {

        /**
         * Properties of a SourcedTelemetry.
         * @memberof hermes
         * @interface ISourcedTelemetry
         * @property {hermes.ITelemetry|null} [telemetry] SourcedTelemetry telemetry
         * @property {string|null} [source] SourcedTelemetry source
         * @property {hermes.SourceContext|null} [context] SourcedTelemetry context
         */

        /**
         * Constructs a new SourcedTelemetry.
         * @memberof hermes
         * @classdesc Represents a SourcedTelemetry.
         * @implements ISourcedTelemetry
         * @constructor
         * @param {hermes.ISourcedTelemetry=} [properties] Properties to set
         */
        function SourcedTelemetry(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SourcedTelemetry telemetry.
         * @member {hermes.ITelemetry|null|undefined} telemetry
         * @memberof hermes.SourcedTelemetry
         * @instance
         */
        SourcedTelemetry.prototype.telemetry = null;

        /**
         * SourcedTelemetry source.
         * @member {string} source
         * @memberof hermes.SourcedTelemetry
         * @instance
         */
        SourcedTelemetry.prototype.source = "";

        /**
         * SourcedTelemetry context.
         * @member {hermes.SourceContext} context
         * @memberof hermes.SourcedTelemetry
         * @instance
         */
        SourcedTelemetry.prototype.context = 0;

        /**
         * Creates a new SourcedTelemetry instance using the specified properties.
         * @function create
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {hermes.ISourcedTelemetry=} [properties] Properties to set
         * @returns {hermes.SourcedTelemetry} SourcedTelemetry instance
         */
        SourcedTelemetry.create = function create(properties) {
            return new SourcedTelemetry(properties);
        };

        /**
         * Encodes the specified SourcedTelemetry message. Does not implicitly {@link hermes.SourcedTelemetry.verify|verify} messages.
         * @function encode
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {hermes.ISourcedTelemetry} message SourcedTelemetry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SourcedTelemetry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.telemetry != null && Object.hasOwnProperty.call(message, "telemetry"))
                $root.hermes.Telemetry.encode(message.telemetry, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.source);
            if (message.context != null && Object.hasOwnProperty.call(message, "context"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.context);
            return writer;
        };

        /**
         * Encodes the specified SourcedTelemetry message, length delimited. Does not implicitly {@link hermes.SourcedTelemetry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {hermes.ISourcedTelemetry} message SourcedTelemetry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SourcedTelemetry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SourcedTelemetry message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.SourcedTelemetry} SourcedTelemetry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SourcedTelemetry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.SourcedTelemetry();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.telemetry = $root.hermes.Telemetry.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.source = reader.string();
                        break;
                    }
                case 3: {
                        message.context = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SourcedTelemetry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.SourcedTelemetry} SourcedTelemetry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SourcedTelemetry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SourcedTelemetry message.
         * @function verify
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SourcedTelemetry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.telemetry != null && message.hasOwnProperty("telemetry")) {
                var error = $root.hermes.Telemetry.verify(message.telemetry);
                if (error)
                    return "telemetry." + error;
            }
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.context != null && message.hasOwnProperty("context"))
                switch (message.context) {
                default:
                    return "context: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };

        /**
         * Creates a SourcedTelemetry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.SourcedTelemetry} SourcedTelemetry
         */
        SourcedTelemetry.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.SourcedTelemetry)
                return object;
            var message = new $root.hermes.SourcedTelemetry();
            if (object.telemetry != null) {
                if (typeof object.telemetry !== "object")
                    throw TypeError(".hermes.SourcedTelemetry.telemetry: object expected");
                message.telemetry = $root.hermes.Telemetry.fromObject(object.telemetry);
            }
            if (object.source != null)
                message.source = String(object.source);
            switch (object.context) {
            default:
                if (typeof object.context === "number") {
                    message.context = object.context;
                    break;
                }
                break;
            case "REALTIME":
            case 0:
                message.context = 0;
                break;
            case "RECORDED":
            case 1:
                message.context = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a SourcedTelemetry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {hermes.SourcedTelemetry} message SourcedTelemetry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SourcedTelemetry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.telemetry = null;
                object.source = "";
                object.context = options.enums === String ? "REALTIME" : 0;
            }
            if (message.telemetry != null && message.hasOwnProperty("telemetry"))
                object.telemetry = $root.hermes.Telemetry.toObject(message.telemetry, options);
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.context != null && message.hasOwnProperty("context"))
                object.context = options.enums === String ? $root.hermes.SourceContext[message.context] === undefined ? message.context : $root.hermes.SourceContext[message.context] : message.context;
            return object;
        };

        /**
         * Converts this SourcedTelemetry to JSON.
         * @function toJSON
         * @memberof hermes.SourcedTelemetry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SourcedTelemetry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SourcedTelemetry
         * @function getTypeUrl
         * @memberof hermes.SourcedTelemetry
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SourcedTelemetry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.SourcedTelemetry";
        };

        return SourcedTelemetry;
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
                    if (properties[keys[i]] != null)
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
        FileDownlinkChunk.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        FileDownlinkChunk.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileDownlinkChunk();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        FileDownlinkChunk.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.offset != null && message.hasOwnProperty("offset"))
                if (!$util.isInteger(message.offset) && !(message.offset && $util.isInteger(message.offset.low) && $util.isInteger(message.offset.high)))
                    return "offset: integer|Long expected";
            if (message.size != null && message.hasOwnProperty("size"))
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
        FileDownlinkChunk.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FileDownlinkChunk)
                return object;
            var message = new $root.hermes.FileDownlinkChunk();
            if (object.offset != null)
                if ($util.Long)
                    (message.offset = $util.Long.fromValue(object.offset)).unsigned = true;
                else if (typeof object.offset === "string")
                    message.offset = parseInt(object.offset, 10);
                else if (typeof object.offset === "number")
                    message.offset = object.offset;
                else if (typeof object.offset === "object")
                    message.offset = new $util.LongBits(object.offset.low >>> 0, object.offset.high >>> 0).toNumber(true);
            if (object.size != null)
                if ($util.Long)
                    (message.size = $util.Long.fromValue(object.size)).unsigned = true;
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
        FileDownlinkChunk.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.offset = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.offset = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.size = options.longs === String ? "0" : 0;
            }
            if (message.offset != null && message.hasOwnProperty("offset"))
                if (typeof message.offset === "number")
                    object.offset = options.longs === String ? String(message.offset) : message.offset;
                else
                    object.offset = options.longs === String ? $util.Long.prototype.toString.call(message.offset) : options.longs === Number ? new $util.LongBits(message.offset.low >>> 0, message.offset.high >>> 0).toNumber(true) : message.offset;
            if (message.size != null && message.hasOwnProperty("size"))
                if (typeof message.size === "number")
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
                    if (properties[keys[i]] != null)
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
        FileDownlink.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
            if (message.timeStart != null && Object.hasOwnProperty.call(message, "timeStart"))
                $root.google.protobuf.Timestamp.encode(message.timeStart, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.timeEnd != null && Object.hasOwnProperty.call(message, "timeEnd"))
                $root.google.protobuf.Timestamp.encode(message.timeEnd, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
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
                    $root.hermes.FileDownlinkChunk.encode(message.missingChunks[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.duplicateChunks != null && message.duplicateChunks.length)
                for (var i = 0; i < message.duplicateChunks.length; ++i)
                    $root.hermes.FileDownlinkChunk.encode(message.duplicateChunks[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
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
        FileDownlink.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileDownlink(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.uid = reader.string();
                        break;
                    }
                case 2: {
                        message.timeStart = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.timeEnd = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
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
                        message.missingChunks.push($root.hermes.FileDownlinkChunk.decode(reader, reader.uint32()));
                        break;
                    }
                case 10: {
                        if (!(message.duplicateChunks && message.duplicateChunks.length))
                            message.duplicateChunks = [];
                        message.duplicateChunks.push($root.hermes.FileDownlinkChunk.decode(reader, reader.uint32()));
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.metadata[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        FileDownlink.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.timeStart != null && message.hasOwnProperty("timeStart")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeStart);
                if (error)
                    return "timeStart." + error;
            }
            if (message.timeEnd != null && message.hasOwnProperty("timeEnd")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeEnd);
                if (error)
                    return "timeEnd." + error;
            }
            if (message.status != null && message.hasOwnProperty("status"))
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 0:
                case -1:
                case 1:
                case 2:
                    break;
                }
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.sourcePath != null && message.hasOwnProperty("sourcePath"))
                if (!$util.isString(message.sourcePath))
                    return "sourcePath: string expected";
            if (message.destinationPath != null && message.hasOwnProperty("destinationPath"))
                if (!$util.isString(message.destinationPath))
                    return "destinationPath: string expected";
            if (message.filePath != null && message.hasOwnProperty("filePath"))
                if (!$util.isString(message.filePath))
                    return "filePath: string expected";
            if (message.missingChunks != null && message.hasOwnProperty("missingChunks")) {
                if (!Array.isArray(message.missingChunks))
                    return "missingChunks: array expected";
                for (var i = 0; i < message.missingChunks.length; ++i) {
                    var error = $root.hermes.FileDownlinkChunk.verify(message.missingChunks[i]);
                    if (error)
                        return "missingChunks." + error;
                }
            }
            if (message.duplicateChunks != null && message.hasOwnProperty("duplicateChunks")) {
                if (!Array.isArray(message.duplicateChunks))
                    return "duplicateChunks: array expected";
                for (var i = 0; i < message.duplicateChunks.length; ++i) {
                    var error = $root.hermes.FileDownlinkChunk.verify(message.duplicateChunks[i]);
                    if (error)
                        return "duplicateChunks." + error;
                }
            }
            if (message.size != null && message.hasOwnProperty("size"))
                if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                    return "size: integer|Long expected";
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
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
        FileDownlink.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FileDownlink)
                return object;
            var message = new $root.hermes.FileDownlink();
            if (object.uid != null)
                message.uid = String(object.uid);
            if (object.timeStart != null) {
                if (typeof object.timeStart !== "object")
                    throw TypeError(".hermes.FileDownlink.timeStart: object expected");
                message.timeStart = $root.google.protobuf.Timestamp.fromObject(object.timeStart);
            }
            if (object.timeEnd != null) {
                if (typeof object.timeEnd !== "object")
                    throw TypeError(".hermes.FileDownlink.timeEnd: object expected");
                message.timeEnd = $root.google.protobuf.Timestamp.fromObject(object.timeEnd);
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
                    if (typeof object.missingChunks[i] !== "object")
                        throw TypeError(".hermes.FileDownlink.missingChunks: object expected");
                    message.missingChunks[i] = $root.hermes.FileDownlinkChunk.fromObject(object.missingChunks[i]);
                }
            }
            if (object.duplicateChunks) {
                if (!Array.isArray(object.duplicateChunks))
                    throw TypeError(".hermes.FileDownlink.duplicateChunks: array expected");
                message.duplicateChunks = [];
                for (var i = 0; i < object.duplicateChunks.length; ++i) {
                    if (typeof object.duplicateChunks[i] !== "object")
                        throw TypeError(".hermes.FileDownlink.duplicateChunks: object expected");
                    message.duplicateChunks[i] = $root.hermes.FileDownlinkChunk.fromObject(object.duplicateChunks[i]);
                }
            }
            if (object.size != null)
                if ($util.Long)
                    (message.size = $util.Long.fromValue(object.size)).unsigned = true;
                else if (typeof object.size === "string")
                    message.size = parseInt(object.size, 10);
                else if (typeof object.size === "number")
                    message.size = object.size;
                else if (typeof object.size === "object")
                    message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
            if (object.metadata) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.FileDownlink.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
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
        FileDownlink.toObject = function toObject(message, options) {
            if (!options)
                options = {};
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
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.size = options.longs === String ? "0" : 0;
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                object.uid = message.uid;
            if (message.timeStart != null && message.hasOwnProperty("timeStart"))
                object.timeStart = $root.google.protobuf.Timestamp.toObject(message.timeStart, options);
            if (message.timeEnd != null && message.hasOwnProperty("timeEnd"))
                object.timeEnd = $root.google.protobuf.Timestamp.toObject(message.timeEnd, options);
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = options.enums === String ? $root.hermes.FileDownlinkCompletionStatus[message.status] === undefined ? message.status : $root.hermes.FileDownlinkCompletionStatus[message.status] : message.status;
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.sourcePath != null && message.hasOwnProperty("sourcePath"))
                object.sourcePath = message.sourcePath;
            if (message.destinationPath != null && message.hasOwnProperty("destinationPath"))
                object.destinationPath = message.destinationPath;
            if (message.filePath != null && message.hasOwnProperty("filePath"))
                object.filePath = message.filePath;
            if (message.missingChunks && message.missingChunks.length) {
                object.missingChunks = [];
                for (var j = 0; j < message.missingChunks.length; ++j)
                    object.missingChunks[j] = $root.hermes.FileDownlinkChunk.toObject(message.missingChunks[j], options);
            }
            if (message.duplicateChunks && message.duplicateChunks.length) {
                object.duplicateChunks = [];
                for (var j = 0; j < message.duplicateChunks.length; ++j)
                    object.duplicateChunks[j] = $root.hermes.FileDownlinkChunk.toObject(message.duplicateChunks[j], options);
            }
            if (message.size != null && message.hasOwnProperty("size"))
                if (typeof message.size === "number")
                    object.size = options.longs === String ? String(message.size) : message.size;
                else
                    object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
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
                    if (properties[keys[i]] != null)
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
        FileUplink.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uid);
            if (message.timeStart != null && Object.hasOwnProperty.call(message, "timeStart"))
                $root.google.protobuf.Timestamp.encode(message.timeStart, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.timeEnd != null && Object.hasOwnProperty.call(message, "timeEnd"))
                $root.google.protobuf.Timestamp.encode(message.timeEnd, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
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
        FileUplink.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileUplink(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.uid = reader.string();
                        break;
                    }
                case 2: {
                        message.timeStart = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.timeEnd = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.metadata[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        FileUplink.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.timeStart != null && message.hasOwnProperty("timeStart")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeStart);
                if (error)
                    return "timeStart." + error;
            }
            if (message.timeEnd != null && message.hasOwnProperty("timeEnd")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeEnd);
                if (error)
                    return "timeEnd." + error;
            }
            if (message.fswId != null && message.hasOwnProperty("fswId"))
                if (!$util.isString(message.fswId))
                    return "fswId: string expected";
            if (message.sourcePath != null && message.hasOwnProperty("sourcePath"))
                if (!$util.isString(message.sourcePath))
                    return "sourcePath: string expected";
            if (message.destinationPath != null && message.hasOwnProperty("destinationPath"))
                if (!$util.isString(message.destinationPath))
                    return "destinationPath: string expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.size != null && message.hasOwnProperty("size"))
                if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                    return "size: integer|Long expected";
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
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
        FileUplink.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FileUplink)
                return object;
            var message = new $root.hermes.FileUplink();
            if (object.uid != null)
                message.uid = String(object.uid);
            if (object.timeStart != null) {
                if (typeof object.timeStart !== "object")
                    throw TypeError(".hermes.FileUplink.timeStart: object expected");
                message.timeStart = $root.google.protobuf.Timestamp.fromObject(object.timeStart);
            }
            if (object.timeEnd != null) {
                if (typeof object.timeEnd !== "object")
                    throw TypeError(".hermes.FileUplink.timeEnd: object expected");
                message.timeEnd = $root.google.protobuf.Timestamp.fromObject(object.timeEnd);
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
                    (message.size = $util.Long.fromValue(object.size)).unsigned = true;
                else if (typeof object.size === "string")
                    message.size = parseInt(object.size, 10);
                else if (typeof object.size === "number")
                    message.size = object.size;
                else if (typeof object.size === "object")
                    message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
            if (object.metadata) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.FileUplink.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
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
        FileUplink.toObject = function toObject(message, options) {
            if (!options)
                options = {};
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
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.size = options.longs === String ? "0" : 0;
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                object.uid = message.uid;
            if (message.timeStart != null && message.hasOwnProperty("timeStart"))
                object.timeStart = $root.google.protobuf.Timestamp.toObject(message.timeStart, options);
            if (message.timeEnd != null && message.hasOwnProperty("timeEnd"))
                object.timeEnd = $root.google.protobuf.Timestamp.toObject(message.timeEnd, options);
            if (message.fswId != null && message.hasOwnProperty("fswId"))
                object.fswId = message.fswId;
            if (message.sourcePath != null && message.hasOwnProperty("sourcePath"))
                object.sourcePath = message.sourcePath;
            if (message.destinationPath != null && message.hasOwnProperty("destinationPath"))
                object.destinationPath = message.destinationPath;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.size != null && message.hasOwnProperty("size"))
                if (typeof message.size === "number")
                    object.size = options.longs === String ? String(message.size) : message.size;
                else
                    object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
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
                    if (properties[keys[i]] != null)
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
        FileTransfer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        FileTransfer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileTransfer();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        FileTransfer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isString(message.uid))
                    return "uid: string expected";
            if (message.fswId != null && message.hasOwnProperty("fswId"))
                if (!$util.isString(message.fswId))
                    return "fswId: string expected";
            if (message.sourcePath != null && message.hasOwnProperty("sourcePath"))
                if (!$util.isString(message.sourcePath))
                    return "sourcePath: string expected";
            if (message.targetPath != null && message.hasOwnProperty("targetPath"))
                if (!$util.isString(message.targetPath))
                    return "targetPath: string expected";
            if (message.size != null && message.hasOwnProperty("size"))
                if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                    return "size: integer|Long expected";
            if (message.progress != null && message.hasOwnProperty("progress"))
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
        FileTransfer.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FileTransfer)
                return object;
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
                    (message.size = $util.Long.fromValue(object.size)).unsigned = true;
                else if (typeof object.size === "string")
                    message.size = parseInt(object.size, 10);
                else if (typeof object.size === "number")
                    message.size = object.size;
                else if (typeof object.size === "object")
                    message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
            if (object.progress != null)
                if ($util.Long)
                    (message.progress = $util.Long.fromValue(object.progress)).unsigned = true;
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
        FileTransfer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.uid = "";
                object.fswId = "";
                object.sourcePath = "";
                object.targetPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.size = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.progress = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.progress = options.longs === String ? "0" : 0;
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                object.uid = message.uid;
            if (message.fswId != null && message.hasOwnProperty("fswId"))
                object.fswId = message.fswId;
            if (message.sourcePath != null && message.hasOwnProperty("sourcePath"))
                object.sourcePath = message.sourcePath;
            if (message.targetPath != null && message.hasOwnProperty("targetPath"))
                object.targetPath = message.targetPath;
            if (message.size != null && message.hasOwnProperty("size"))
                if (typeof message.size === "number")
                    object.size = options.longs === String ? String(message.size) : message.size;
                else
                    object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
            if (message.progress != null && message.hasOwnProperty("progress"))
                if (typeof message.progress === "number")
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
                    if (properties[keys[i]] != null)
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
        FileTransferState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.downlinkCompleted != null && message.downlinkCompleted.length)
                for (var i = 0; i < message.downlinkCompleted.length; ++i)
                    $root.hermes.FileDownlink.encode(message.downlinkCompleted[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.uplinkCompleted != null && message.uplinkCompleted.length)
                for (var i = 0; i < message.uplinkCompleted.length; ++i)
                    $root.hermes.FileUplink.encode(message.uplinkCompleted[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.downlinkInProgress != null && message.downlinkInProgress.length)
                for (var i = 0; i < message.downlinkInProgress.length; ++i)
                    $root.hermes.FileTransfer.encode(message.downlinkInProgress[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.uplinkInProgress != null && message.uplinkInProgress.length)
                for (var i = 0; i < message.uplinkInProgress.length; ++i)
                    $root.hermes.FileTransfer.encode(message.uplinkInProgress[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
        FileTransferState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileTransferState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.downlinkCompleted && message.downlinkCompleted.length))
                            message.downlinkCompleted = [];
                        message.downlinkCompleted.push($root.hermes.FileDownlink.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        if (!(message.uplinkCompleted && message.uplinkCompleted.length))
                            message.uplinkCompleted = [];
                        message.uplinkCompleted.push($root.hermes.FileUplink.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.downlinkInProgress && message.downlinkInProgress.length))
                            message.downlinkInProgress = [];
                        message.downlinkInProgress.push($root.hermes.FileTransfer.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.uplinkInProgress && message.uplinkInProgress.length))
                            message.uplinkInProgress = [];
                        message.uplinkInProgress.push($root.hermes.FileTransfer.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        FileTransferState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.downlinkCompleted != null && message.hasOwnProperty("downlinkCompleted")) {
                if (!Array.isArray(message.downlinkCompleted))
                    return "downlinkCompleted: array expected";
                for (var i = 0; i < message.downlinkCompleted.length; ++i) {
                    var error = $root.hermes.FileDownlink.verify(message.downlinkCompleted[i]);
                    if (error)
                        return "downlinkCompleted." + error;
                }
            }
            if (message.uplinkCompleted != null && message.hasOwnProperty("uplinkCompleted")) {
                if (!Array.isArray(message.uplinkCompleted))
                    return "uplinkCompleted: array expected";
                for (var i = 0; i < message.uplinkCompleted.length; ++i) {
                    var error = $root.hermes.FileUplink.verify(message.uplinkCompleted[i]);
                    if (error)
                        return "uplinkCompleted." + error;
                }
            }
            if (message.downlinkInProgress != null && message.hasOwnProperty("downlinkInProgress")) {
                if (!Array.isArray(message.downlinkInProgress))
                    return "downlinkInProgress: array expected";
                for (var i = 0; i < message.downlinkInProgress.length; ++i) {
                    var error = $root.hermes.FileTransfer.verify(message.downlinkInProgress[i]);
                    if (error)
                        return "downlinkInProgress." + error;
                }
            }
            if (message.uplinkInProgress != null && message.hasOwnProperty("uplinkInProgress")) {
                if (!Array.isArray(message.uplinkInProgress))
                    return "uplinkInProgress: array expected";
                for (var i = 0; i < message.uplinkInProgress.length; ++i) {
                    var error = $root.hermes.FileTransfer.verify(message.uplinkInProgress[i]);
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
        FileTransferState.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FileTransferState)
                return object;
            var message = new $root.hermes.FileTransferState();
            if (object.downlinkCompleted) {
                if (!Array.isArray(object.downlinkCompleted))
                    throw TypeError(".hermes.FileTransferState.downlinkCompleted: array expected");
                message.downlinkCompleted = [];
                for (var i = 0; i < object.downlinkCompleted.length; ++i) {
                    if (typeof object.downlinkCompleted[i] !== "object")
                        throw TypeError(".hermes.FileTransferState.downlinkCompleted: object expected");
                    message.downlinkCompleted[i] = $root.hermes.FileDownlink.fromObject(object.downlinkCompleted[i]);
                }
            }
            if (object.uplinkCompleted) {
                if (!Array.isArray(object.uplinkCompleted))
                    throw TypeError(".hermes.FileTransferState.uplinkCompleted: array expected");
                message.uplinkCompleted = [];
                for (var i = 0; i < object.uplinkCompleted.length; ++i) {
                    if (typeof object.uplinkCompleted[i] !== "object")
                        throw TypeError(".hermes.FileTransferState.uplinkCompleted: object expected");
                    message.uplinkCompleted[i] = $root.hermes.FileUplink.fromObject(object.uplinkCompleted[i]);
                }
            }
            if (object.downlinkInProgress) {
                if (!Array.isArray(object.downlinkInProgress))
                    throw TypeError(".hermes.FileTransferState.downlinkInProgress: array expected");
                message.downlinkInProgress = [];
                for (var i = 0; i < object.downlinkInProgress.length; ++i) {
                    if (typeof object.downlinkInProgress[i] !== "object")
                        throw TypeError(".hermes.FileTransferState.downlinkInProgress: object expected");
                    message.downlinkInProgress[i] = $root.hermes.FileTransfer.fromObject(object.downlinkInProgress[i]);
                }
            }
            if (object.uplinkInProgress) {
                if (!Array.isArray(object.uplinkInProgress))
                    throw TypeError(".hermes.FileTransferState.uplinkInProgress: array expected");
                message.uplinkInProgress = [];
                for (var i = 0; i < object.uplinkInProgress.length; ++i) {
                    if (typeof object.uplinkInProgress[i] !== "object")
                        throw TypeError(".hermes.FileTransferState.uplinkInProgress: object expected");
                    message.uplinkInProgress[i] = $root.hermes.FileTransfer.fromObject(object.uplinkInProgress[i]);
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
        FileTransferState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
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
                    object.downlinkCompleted[j] = $root.hermes.FileDownlink.toObject(message.downlinkCompleted[j], options);
            }
            if (message.uplinkCompleted && message.uplinkCompleted.length) {
                object.uplinkCompleted = [];
                for (var j = 0; j < message.uplinkCompleted.length; ++j)
                    object.uplinkCompleted[j] = $root.hermes.FileUplink.toObject(message.uplinkCompleted[j], options);
            }
            if (message.downlinkInProgress && message.downlinkInProgress.length) {
                object.downlinkInProgress = [];
                for (var j = 0; j < message.downlinkInProgress.length; ++j)
                    object.downlinkInProgress[j] = $root.hermes.FileTransfer.toObject(message.downlinkInProgress[j], options);
            }
            if (message.uplinkInProgress && message.uplinkInProgress.length) {
                object.uplinkInProgress = [];
                for (var j = 0; j < message.uplinkInProgress.length; ++j)
                    object.uplinkInProgress[j] = $root.hermes.FileTransfer.toObject(message.uplinkInProgress[j], options);
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
     * SIntKind enum.
     * @name hermes.SIntKind
     * @enum {number}
     * @property {number} SINT_I8=0 SINT_I8 value
     * @property {number} SINT_I16=1 SINT_I16 value
     * @property {number} SINT_I32=2 SINT_I32 value
     * @property {number} SINT_I64=3 SINT_I64 value
     */
    hermes.SIntKind = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "SINT_I8"] = 0;
        values[valuesById[1] = "SINT_I16"] = 1;
        values[valuesById[2] = "SINT_I32"] = 2;
        values[valuesById[3] = "SINT_I64"] = 3;
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
                    if (properties[keys[i]] != null)
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
        BooleanType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        BooleanType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BooleanType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.encodeType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        BooleanType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.encodeType != null && message.hasOwnProperty("encodeType"))
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
        BooleanType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.BooleanType)
                return object;
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
        BooleanType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.encodeType = options.enums === String ? "UINT_U8" : 0;
            if (message.encodeType != null && message.hasOwnProperty("encodeType"))
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
                    if (properties[keys[i]] != null)
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
        IntType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        IntType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.IntType();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        IntType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.kind != null && message.hasOwnProperty("kind"))
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
            if (message.min != null && message.hasOwnProperty("min"))
                if (!$util.isInteger(message.min) && !(message.min && $util.isInteger(message.min.low) && $util.isInteger(message.min.high)))
                    return "min: integer|Long expected";
            if (message.max != null && message.hasOwnProperty("max"))
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
        IntType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.IntType)
                return object;
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
                    (message.min = $util.Long.fromValue(object.min)).unsigned = false;
                else if (typeof object.min === "string")
                    message.min = parseInt(object.min, 10);
                else if (typeof object.min === "number")
                    message.min = object.min;
                else if (typeof object.min === "object")
                    message.min = new $util.LongBits(object.min.low >>> 0, object.min.high >>> 0).toNumber();
            if (object.max != null)
                if ($util.Long)
                    (message.max = $util.Long.fromValue(object.max)).unsigned = false;
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
        IntType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.kind = options.enums === String ? "INT_U8" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.min = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.min = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.max = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.max = options.longs === String ? "0" : 0;
            }
            if (message.kind != null && message.hasOwnProperty("kind"))
                object.kind = options.enums === String ? $root.hermes.IntKind[message.kind] === undefined ? message.kind : $root.hermes.IntKind[message.kind] : message.kind;
            if (message.min != null && message.hasOwnProperty("min"))
                if (typeof message.min === "number")
                    object.min = options.longs === String ? String(message.min) : message.min;
                else
                    object.min = options.longs === String ? $util.Long.prototype.toString.call(message.min) : options.longs === Number ? new $util.LongBits(message.min.low >>> 0, message.min.high >>> 0).toNumber() : message.min;
            if (message.max != null && message.hasOwnProperty("max"))
                if (typeof message.max === "number")
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
                    if (properties[keys[i]] != null)
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
        FloatType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        FloatType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FloatType();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        FloatType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.kind != null && message.hasOwnProperty("kind"))
                switch (message.kind) {
                default:
                    return "kind: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.min != null && message.hasOwnProperty("min"))
                if (typeof message.min !== "number")
                    return "min: number expected";
            if (message.max != null && message.hasOwnProperty("max"))
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
        FloatType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FloatType)
                return object;
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
        FloatType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.kind = options.enums === String ? "F_F32" : 0;
                object.min = 0;
                object.max = 0;
            }
            if (message.kind != null && message.hasOwnProperty("kind"))
                object.kind = options.enums === String ? $root.hermes.FloatKind[message.kind] === undefined ? message.kind : $root.hermes.FloatKind[message.kind] : message.kind;
            if (message.min != null && message.hasOwnProperty("min"))
                object.min = options.json && !isFinite(message.min) ? String(message.min) : message.min;
            if (message.max != null && message.hasOwnProperty("max"))
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
                    if (properties[keys[i]] != null)
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
        StringType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        StringType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.StringType();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        StringType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lengthType != null && message.hasOwnProperty("lengthType"))
                switch (message.lengthType) {
                default:
                    return "lengthType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.maxLength != null && message.hasOwnProperty("maxLength"))
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
        StringType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.StringType)
                return object;
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
        StringType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.lengthType = options.enums === String ? "UINT_U8" : 0;
                object.maxLength = 0;
            }
            if (message.lengthType != null && message.hasOwnProperty("lengthType"))
                object.lengthType = options.enums === String ? $root.hermes.UIntKind[message.lengthType] === undefined ? message.lengthType : $root.hermes.UIntKind[message.lengthType] : message.lengthType;
            if (message.maxLength != null && message.hasOwnProperty("maxLength"))
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
                    if (properties[keys[i]] != null)
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
        EnumItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        EnumItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EnumItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        EnumItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isInteger(message.value))
                    return "value: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
        EnumItem.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.EnumItem)
                return object;
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
        EnumItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.value = 0;
                object.name = "";
                object.metadata = "";
            }
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
                    if (properties[keys[i]] != null)
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
        EnumType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.encodeType != null && Object.hasOwnProperty.call(message, "encodeType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.encodeType);
            if (message.items != null && message.items.length)
                for (var i = 0; i < message.items.length; ++i)
                    $root.hermes.EnumItem.encode(message.items[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
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
        EnumType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EnumType();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                        message.items.push($root.hermes.EnumItem.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        EnumType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.encodeType != null && message.hasOwnProperty("encodeType"))
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
            if (message.items != null && message.hasOwnProperty("items")) {
                if (!Array.isArray(message.items))
                    return "items: array expected";
                for (var i = 0; i < message.items.length; ++i) {
                    var error = $root.hermes.EnumItem.verify(message.items[i]);
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
        EnumType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.EnumType)
                return object;
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
                    if (typeof object.items[i] !== "object")
                        throw TypeError(".hermes.EnumType.items: object expected");
                    message.items[i] = $root.hermes.EnumItem.fromObject(object.items[i]);
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
        EnumType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.items = [];
            if (options.defaults) {
                object.name = "";
                object.encodeType = options.enums === String ? "INT_U8" : 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.encodeType != null && message.hasOwnProperty("encodeType"))
                object.encodeType = options.enums === String ? $root.hermes.IntKind[message.encodeType] === undefined ? message.encodeType : $root.hermes.IntKind[message.encodeType] : message.encodeType;
            if (message.items && message.items.length) {
                object.items = [];
                for (var j = 0; j < message.items.length; ++j)
                    object.items[j] = $root.hermes.EnumItem.toObject(message.items[j], options);
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
                    if (properties[keys[i]] != null)
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
        BoundedArraySize.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        BoundedArraySize.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BoundedArraySize();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        BoundedArraySize.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.min != null && message.hasOwnProperty("min"))
                if (!$util.isInteger(message.min))
                    return "min: integer expected";
            if (message.max != null && message.hasOwnProperty("max"))
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
        BoundedArraySize.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.BoundedArraySize)
                return object;
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
        BoundedArraySize.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.min = 0;
                object.max = 0;
            }
            if (message.min != null && message.hasOwnProperty("min"))
                object.min = message.min;
            if (message.max != null && message.hasOwnProperty("max"))
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
                    if (properties[keys[i]] != null)
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
        ArrayType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.elType != null && Object.hasOwnProperty.call(message, "elType"))
                $root.hermes.Type.encode(message.elType, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message["static"] != null && Object.hasOwnProperty.call(message, "static"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message["static"]);
            if (message.dynamic != null && Object.hasOwnProperty.call(message, "dynamic"))
                $root.hermes.BoundedArraySize.encode(message.dynamic, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
        ArrayType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ArrayType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.elType = $root.hermes.Type.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message["static"] = reader.uint32();
                        break;
                    }
                case 4: {
                        message.dynamic = $root.hermes.BoundedArraySize.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.lengthType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        ArrayType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.elType != null && message.hasOwnProperty("elType")) {
                var error = $root.hermes.Type.verify(message.elType);
                if (error)
                    return "elType." + error;
            }
            if (message["static"] != null && message.hasOwnProperty("static")) {
                properties.size = 1;
                if (!$util.isInteger(message["static"]))
                    return "static: integer expected";
            }
            if (message.dynamic != null && message.hasOwnProperty("dynamic")) {
                if (properties.size === 1)
                    return "size: multiple values";
                properties.size = 1;
                {
                    var error = $root.hermes.BoundedArraySize.verify(message.dynamic);
                    if (error)
                        return "dynamic." + error;
                }
            }
            if (message.lengthType != null && message.hasOwnProperty("lengthType"))
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
        ArrayType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ArrayType)
                return object;
            var message = new $root.hermes.ArrayType();
            if (object.name != null)
                message.name = String(object.name);
            if (object.elType != null) {
                if (typeof object.elType !== "object")
                    throw TypeError(".hermes.ArrayType.elType: object expected");
                message.elType = $root.hermes.Type.fromObject(object.elType);
            }
            if (object["static"] != null)
                message["static"] = object["static"] >>> 0;
            if (object.dynamic != null) {
                if (typeof object.dynamic !== "object")
                    throw TypeError(".hermes.ArrayType.dynamic: object expected");
                message.dynamic = $root.hermes.BoundedArraySize.fromObject(object.dynamic);
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
        ArrayType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.elType = null;
                object.lengthType = options.enums === String ? "UINT_U8" : 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.elType != null && message.hasOwnProperty("elType"))
                object.elType = $root.hermes.Type.toObject(message.elType, options);
            if (message["static"] != null && message.hasOwnProperty("static")) {
                object["static"] = message["static"];
                if (options.oneofs)
                    object.size = "static";
            }
            if (message.dynamic != null && message.hasOwnProperty("dynamic")) {
                object.dynamic = $root.hermes.BoundedArraySize.toObject(message.dynamic, options);
                if (options.oneofs)
                    object.size = "dynamic";
            }
            if (message.lengthType != null && message.hasOwnProperty("lengthType"))
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
                    if (properties[keys[i]] != null)
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
        BytesType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.kind);
            if (message["static"] != null && Object.hasOwnProperty.call(message, "static"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message["static"]);
            if (message.dynamic != null && Object.hasOwnProperty.call(message, "dynamic"))
                $root.hermes.BoundedArraySize.encode(message.dynamic, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
        BytesType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BytesType();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                        message.dynamic = $root.hermes.BoundedArraySize.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.lengthType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        BytesType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.kind != null && message.hasOwnProperty("kind"))
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
            if (message["static"] != null && message.hasOwnProperty("static")) {
                properties.size = 1;
                if (!$util.isInteger(message["static"]))
                    return "static: integer expected";
            }
            if (message.dynamic != null && message.hasOwnProperty("dynamic")) {
                if (properties.size === 1)
                    return "size: multiple values";
                properties.size = 1;
                {
                    var error = $root.hermes.BoundedArraySize.verify(message.dynamic);
                    if (error)
                        return "dynamic." + error;
                }
            }
            if (message.lengthType != null && message.hasOwnProperty("lengthType"))
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
        BytesType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.BytesType)
                return object;
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
                if (typeof object.dynamic !== "object")
                    throw TypeError(".hermes.BytesType.dynamic: object expected");
                message.dynamic = $root.hermes.BoundedArraySize.fromObject(object.dynamic);
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
        BytesType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.kind = options.enums === String ? "NUMBER_U8" : 0;
                object.lengthType = options.enums === String ? "UINT_U8" : 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.kind != null && message.hasOwnProperty("kind"))
                object.kind = options.enums === String ? $root.hermes.NumberKind[message.kind] === undefined ? message.kind : $root.hermes.NumberKind[message.kind] : message.kind;
            if (message["static"] != null && message.hasOwnProperty("static")) {
                object["static"] = message["static"];
                if (options.oneofs)
                    object.size = "static";
            }
            if (message.dynamic != null && message.hasOwnProperty("dynamic")) {
                object.dynamic = $root.hermes.BoundedArraySize.toObject(message.dynamic, options);
                if (options.oneofs)
                    object.size = "dynamic";
            }
            if (message.lengthType != null && message.hasOwnProperty("lengthType"))
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
                    if (properties[keys[i]] != null)
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
        Field.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                $root.hermes.Type.encode(message.type, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.metadata);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                $root.hermes.Value.encode(message.value, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
        Field.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Field();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.type = $root.hermes.Type.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.metadata = reader.string();
                        break;
                    }
                case 4: {
                        message.value = $root.hermes.Value.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        Field.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.type != null && message.hasOwnProperty("type")) {
                var error = $root.hermes.Type.verify(message.type);
                if (error)
                    return "type." + error;
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            if (message.value != null && message.hasOwnProperty("value")) {
                var error = $root.hermes.Value.verify(message.value);
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
        Field.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Field)
                return object;
            var message = new $root.hermes.Field();
            if (object.name != null)
                message.name = String(object.name);
            if (object.type != null) {
                if (typeof object.type !== "object")
                    throw TypeError(".hermes.Field.type: object expected");
                message.type = $root.hermes.Type.fromObject(object.type);
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            if (object.value != null) {
                if (typeof object.value !== "object")
                    throw TypeError(".hermes.Field.value: object expected");
                message.value = $root.hermes.Value.fromObject(object.value);
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
        Field.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.type = null;
                object.metadata = "";
                object.value = null;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = $root.hermes.Type.toObject(message.type, options);
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                object.metadata = message.metadata;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = $root.hermes.Value.toObject(message.value, options);
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
                    if (properties[keys[i]] != null)
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
        ObjectType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.fields != null && message.fields.length)
                for (var i = 0; i < message.fields.length; ++i)
                    $root.hermes.Field.encode(message.fields[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
        ObjectType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ObjectType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        if (!(message.fields && message.fields.length))
                            message.fields = [];
                        message.fields.push($root.hermes.Field.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        ObjectType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.fields != null && message.hasOwnProperty("fields")) {
                if (!Array.isArray(message.fields))
                    return "fields: array expected";
                for (var i = 0; i < message.fields.length; ++i) {
                    var error = $root.hermes.Field.verify(message.fields[i]);
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
        ObjectType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ObjectType)
                return object;
            var message = new $root.hermes.ObjectType();
            if (object.name != null)
                message.name = String(object.name);
            if (object.fields) {
                if (!Array.isArray(object.fields))
                    throw TypeError(".hermes.ObjectType.fields: array expected");
                message.fields = [];
                for (var i = 0; i < object.fields.length; ++i) {
                    if (typeof object.fields[i] !== "object")
                        throw TypeError(".hermes.ObjectType.fields: object expected");
                    message.fields[i] = $root.hermes.Field.fromObject(object.fields[i]);
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
        ObjectType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.fields = [];
            if (options.defaults)
                object.name = "";
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.fields && message.fields.length) {
                object.fields = [];
                for (var j = 0; j < message.fields.length; ++j)
                    object.fields[j] = $root.hermes.Field.toObject(message.fields[j], options);
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
                    if (properties[keys[i]] != null)
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
        ReferenceType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        ReferenceType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ReferenceType();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        ReferenceType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.kind != null && message.hasOwnProperty("kind"))
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
        ReferenceType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ReferenceType)
                return object;
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
        ReferenceType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.kind = options.enums === String ? "REF_ENUM" : 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.kind != null && message.hasOwnProperty("kind"))
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
                    if (properties[keys[i]] != null)
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
        VoidType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        VoidType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.VoidType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.size = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        VoidType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.size != null && message.hasOwnProperty("size"))
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
        VoidType.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.VoidType)
                return object;
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
        VoidType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.size = 0;
            if (message.size != null && message.hasOwnProperty("size"))
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
                    if (properties[keys[i]] != null)
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
        Type.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref"))
                $root.hermes.ReferenceType.encode(message.ref, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.bool != null && Object.hasOwnProperty.call(message, "bool"))
                $root.hermes.BooleanType.encode(message.bool, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.int != null && Object.hasOwnProperty.call(message, "int"))
                $root.hermes.IntType.encode(message.int, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.float != null && Object.hasOwnProperty.call(message, "float"))
                $root.hermes.FloatType.encode(message.float, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.string != null && Object.hasOwnProperty.call(message, "string"))
                $root.hermes.StringType.encode(message.string, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message["enum"] != null && Object.hasOwnProperty.call(message, "enum"))
                $root.hermes.EnumType.encode(message["enum"], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.bitmask != null && Object.hasOwnProperty.call(message, "bitmask"))
                $root.hermes.EnumType.encode(message.bitmask, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.object != null && Object.hasOwnProperty.call(message, "object"))
                $root.hermes.ObjectType.encode(message.object, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.array != null && Object.hasOwnProperty.call(message, "array"))
                $root.hermes.ArrayType.encode(message.array, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.bytes != null && Object.hasOwnProperty.call(message, "bytes"))
                $root.hermes.BytesType.encode(message.bytes, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message["void"] != null && Object.hasOwnProperty.call(message, "void"))
                $root.hermes.VoidType.encode(message["void"], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
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
        Type.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Type();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ref = $root.hermes.ReferenceType.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.bool = $root.hermes.BooleanType.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.int = $root.hermes.IntType.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.float = $root.hermes.FloatType.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.string = $root.hermes.StringType.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message["enum"] = $root.hermes.EnumType.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.bitmask = $root.hermes.EnumType.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.object = $root.hermes.ObjectType.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.array = $root.hermes.ArrayType.decode(reader, reader.uint32());
                        break;
                    }
                case 10: {
                        message.bytes = $root.hermes.BytesType.decode(reader, reader.uint32());
                        break;
                    }
                case 11: {
                        message["void"] = $root.hermes.VoidType.decode(reader, reader.uint32());
                        break;
                    }
                case 12: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        Type.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.ref != null && message.hasOwnProperty("ref")) {
                properties.value = 1;
                {
                    var error = $root.hermes.ReferenceType.verify(message.ref);
                    if (error)
                        return "ref." + error;
                }
            }
            if (message.bool != null && message.hasOwnProperty("bool")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.BooleanType.verify(message.bool);
                    if (error)
                        return "bool." + error;
                }
            }
            if (message.int != null && message.hasOwnProperty("int")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.IntType.verify(message.int);
                    if (error)
                        return "int." + error;
                }
            }
            if (message.float != null && message.hasOwnProperty("float")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.FloatType.verify(message.float);
                    if (error)
                        return "float." + error;
                }
            }
            if (message.string != null && message.hasOwnProperty("string")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.StringType.verify(message.string);
                    if (error)
                        return "string." + error;
                }
            }
            if (message["enum"] != null && message.hasOwnProperty("enum")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.EnumType.verify(message["enum"]);
                    if (error)
                        return "enum." + error;
                }
            }
            if (message.bitmask != null && message.hasOwnProperty("bitmask")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.EnumType.verify(message.bitmask);
                    if (error)
                        return "bitmask." + error;
                }
            }
            if (message.object != null && message.hasOwnProperty("object")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.ObjectType.verify(message.object);
                    if (error)
                        return "object." + error;
                }
            }
            if (message.array != null && message.hasOwnProperty("array")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.ArrayType.verify(message.array);
                    if (error)
                        return "array." + error;
                }
            }
            if (message.bytes != null && message.hasOwnProperty("bytes")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.BytesType.verify(message.bytes);
                    if (error)
                        return "bytes." + error;
                }
            }
            if (message["void"] != null && message.hasOwnProperty("void")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.VoidType.verify(message["void"]);
                    if (error)
                        return "void." + error;
                }
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
        Type.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Type)
                return object;
            var message = new $root.hermes.Type();
            if (object.ref != null) {
                if (typeof object.ref !== "object")
                    throw TypeError(".hermes.Type.ref: object expected");
                message.ref = $root.hermes.ReferenceType.fromObject(object.ref);
            }
            if (object.bool != null) {
                if (typeof object.bool !== "object")
                    throw TypeError(".hermes.Type.bool: object expected");
                message.bool = $root.hermes.BooleanType.fromObject(object.bool);
            }
            if (object.int != null) {
                if (typeof object.int !== "object")
                    throw TypeError(".hermes.Type.int: object expected");
                message.int = $root.hermes.IntType.fromObject(object.int);
            }
            if (object.float != null) {
                if (typeof object.float !== "object")
                    throw TypeError(".hermes.Type.float: object expected");
                message.float = $root.hermes.FloatType.fromObject(object.float);
            }
            if (object.string != null) {
                if (typeof object.string !== "object")
                    throw TypeError(".hermes.Type.string: object expected");
                message.string = $root.hermes.StringType.fromObject(object.string);
            }
            if (object["enum"] != null) {
                if (typeof object["enum"] !== "object")
                    throw TypeError(".hermes.Type.enum: object expected");
                message["enum"] = $root.hermes.EnumType.fromObject(object["enum"]);
            }
            if (object.bitmask != null) {
                if (typeof object.bitmask !== "object")
                    throw TypeError(".hermes.Type.bitmask: object expected");
                message.bitmask = $root.hermes.EnumType.fromObject(object.bitmask);
            }
            if (object.object != null) {
                if (typeof object.object !== "object")
                    throw TypeError(".hermes.Type.object: object expected");
                message.object = $root.hermes.ObjectType.fromObject(object.object);
            }
            if (object.array != null) {
                if (typeof object.array !== "object")
                    throw TypeError(".hermes.Type.array: object expected");
                message.array = $root.hermes.ArrayType.fromObject(object.array);
            }
            if (object.bytes != null) {
                if (typeof object.bytes !== "object")
                    throw TypeError(".hermes.Type.bytes: object expected");
                message.bytes = $root.hermes.BytesType.fromObject(object.bytes);
            }
            if (object["void"] != null) {
                if (typeof object["void"] !== "object")
                    throw TypeError(".hermes.Type.void: object expected");
                message["void"] = $root.hermes.VoidType.fromObject(object["void"]);
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
        Type.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.metadata = "";
            if (message.ref != null && message.hasOwnProperty("ref")) {
                object.ref = $root.hermes.ReferenceType.toObject(message.ref, options);
                if (options.oneofs)
                    object.value = "ref";
            }
            if (message.bool != null && message.hasOwnProperty("bool")) {
                object.bool = $root.hermes.BooleanType.toObject(message.bool, options);
                if (options.oneofs)
                    object.value = "bool";
            }
            if (message.int != null && message.hasOwnProperty("int")) {
                object.int = $root.hermes.IntType.toObject(message.int, options);
                if (options.oneofs)
                    object.value = "int";
            }
            if (message.float != null && message.hasOwnProperty("float")) {
                object.float = $root.hermes.FloatType.toObject(message.float, options);
                if (options.oneofs)
                    object.value = "float";
            }
            if (message.string != null && message.hasOwnProperty("string")) {
                object.string = $root.hermes.StringType.toObject(message.string, options);
                if (options.oneofs)
                    object.value = "string";
            }
            if (message["enum"] != null && message.hasOwnProperty("enum")) {
                object["enum"] = $root.hermes.EnumType.toObject(message["enum"], options);
                if (options.oneofs)
                    object.value = "enum";
            }
            if (message.bitmask != null && message.hasOwnProperty("bitmask")) {
                object.bitmask = $root.hermes.EnumType.toObject(message.bitmask, options);
                if (options.oneofs)
                    object.value = "bitmask";
            }
            if (message.object != null && message.hasOwnProperty("object")) {
                object.object = $root.hermes.ObjectType.toObject(message.object, options);
                if (options.oneofs)
                    object.value = "object";
            }
            if (message.array != null && message.hasOwnProperty("array")) {
                object.array = $root.hermes.ArrayType.toObject(message.array, options);
                if (options.oneofs)
                    object.value = "array";
            }
            if (message.bytes != null && message.hasOwnProperty("bytes")) {
                object.bytes = $root.hermes.BytesType.toObject(message.bytes, options);
                if (options.oneofs)
                    object.value = "bytes";
            }
            if (message["void"] != null && message.hasOwnProperty("void")) {
                object["void"] = $root.hermes.VoidType.toObject(message["void"], options);
                if (options.oneofs)
                    object.value = "void";
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
                    if (properties[keys[i]] != null)
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
        ObjectValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.o != null && Object.hasOwnProperty.call(message, "o"))
                for (var keys = Object.keys(message.o), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.Value.encode(message.o[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
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
        ObjectValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ObjectValue(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                                value = $root.hermes.Value.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.o[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        ObjectValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.o != null && message.hasOwnProperty("o")) {
                if (!$util.isObject(message.o))
                    return "o: object expected";
                var key = Object.keys(message.o);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.Value.verify(message.o[key[i]]);
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
        ObjectValue.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ObjectValue)
                return object;
            var message = new $root.hermes.ObjectValue();
            if (object.o) {
                if (typeof object.o !== "object")
                    throw TypeError(".hermes.ObjectValue.o: object expected");
                message.o = {};
                for (var keys = Object.keys(object.o), i = 0; i < keys.length; ++i) {
                    if (typeof object.o[keys[i]] !== "object")
                        throw TypeError(".hermes.ObjectValue.o: object expected");
                    message.o[keys[i]] = $root.hermes.Value.fromObject(object.o[keys[i]]);
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
        ObjectValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.o = {};
            var keys2;
            if (message.o && (keys2 = Object.keys(message.o)).length) {
                object.o = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.o[keys2[j]] = $root.hermes.Value.toObject(message.o[keys2[j]], options);
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
                    if (properties[keys[i]] != null)
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
        ArrayValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && message.value.length)
                for (var i = 0; i < message.value.length; ++i)
                    $root.hermes.Value.encode(message.value[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
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
        ArrayValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ArrayValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.value && message.value.length))
                            message.value = [];
                        message.value.push($root.hermes.Value.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        ArrayValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value")) {
                if (!Array.isArray(message.value))
                    return "value: array expected";
                for (var i = 0; i < message.value.length; ++i) {
                    var error = $root.hermes.Value.verify(message.value[i]);
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
        ArrayValue.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ArrayValue)
                return object;
            var message = new $root.hermes.ArrayValue();
            if (object.value) {
                if (!Array.isArray(object.value))
                    throw TypeError(".hermes.ArrayValue.value: array expected");
                message.value = [];
                for (var i = 0; i < object.value.length; ++i) {
                    if (typeof object.value[i] !== "object")
                        throw TypeError(".hermes.ArrayValue.value: object expected");
                    message.value[i] = $root.hermes.Value.fromObject(object.value[i]);
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
        ArrayValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.value = [];
            if (message.value && message.value.length) {
                object.value = [];
                for (var j = 0; j < message.value.length; ++j)
                    object.value[j] = $root.hermes.Value.toObject(message.value[j], options);
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
                    if (properties[keys[i]] != null)
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
        BytesValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        BytesValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.BytesValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        BytesValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.kind != null && message.hasOwnProperty("kind"))
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
            if (message.bigEndian != null && message.hasOwnProperty("bigEndian"))
                if (typeof message.bigEndian !== "boolean")
                    return "bigEndian: boolean expected";
            if (message.value != null && message.hasOwnProperty("value"))
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
        BytesValue.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.BytesValue)
                return object;
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
        BytesValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
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
            if (message.kind != null && message.hasOwnProperty("kind"))
                object.kind = options.enums === String ? $root.hermes.NumberKind[message.kind] === undefined ? message.kind : $root.hermes.NumberKind[message.kind] : message.kind;
            if (message.bigEndian != null && message.hasOwnProperty("bigEndian"))
                object.bigEndian = message.bigEndian;
            if (message.value != null && message.hasOwnProperty("value"))
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
                    if (properties[keys[i]] != null)
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
        EnumValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        EnumValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EnumValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        EnumValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.raw != null && message.hasOwnProperty("raw"))
                if (!$util.isInteger(message.raw) && !(message.raw && $util.isInteger(message.raw.low) && $util.isInteger(message.raw.high)))
                    return "raw: integer|Long expected";
            if (message.formatted != null && message.hasOwnProperty("formatted"))
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
        EnumValue.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.EnumValue)
                return object;
            var message = new $root.hermes.EnumValue();
            if (object.raw != null)
                if ($util.Long)
                    (message.raw = $util.Long.fromValue(object.raw)).unsigned = false;
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
        EnumValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.raw = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.raw = options.longs === String ? "0" : 0;
                object.formatted = "";
            }
            if (message.raw != null && message.hasOwnProperty("raw"))
                if (typeof message.raw === "number")
                    object.raw = options.longs === String ? String(message.raw) : message.raw;
                else
                    object.raw = options.longs === String ? $util.Long.prototype.toString.call(message.raw) : options.longs === Number ? new $util.LongBits(message.raw.low >>> 0, message.raw.high >>> 0).toNumber() : message.raw;
            if (message.formatted != null && message.hasOwnProperty("formatted"))
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
                    if (properties[keys[i]] != null)
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
        Value.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
                $root.hermes.EnumValue.encode(message.e, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.o != null && Object.hasOwnProperty.call(message, "o"))
                $root.hermes.ObjectValue.encode(message.o, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.a != null && Object.hasOwnProperty.call(message, "a"))
                $root.hermes.ArrayValue.encode(message.a, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.r != null && Object.hasOwnProperty.call(message, "r"))
                $root.hermes.BytesValue.encode(message.r, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
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
        Value.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Value();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                        message.e = $root.hermes.EnumValue.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.o = $root.hermes.ObjectValue.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.a = $root.hermes.ArrayValue.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.r = $root.hermes.BytesValue.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        Value.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.i != null && message.hasOwnProperty("i")) {
                properties.value = 1;
                if (!$util.isInteger(message.i) && !(message.i && $util.isInteger(message.i.low) && $util.isInteger(message.i.high)))
                    return "i: integer|Long expected";
            }
            if (message.u != null && message.hasOwnProperty("u")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isInteger(message.u) && !(message.u && $util.isInteger(message.u.low) && $util.isInteger(message.u.high)))
                    return "u: integer|Long expected";
            }
            if (message.f != null && message.hasOwnProperty("f")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (typeof message.f !== "number")
                    return "f: number expected";
            }
            if (message.b != null && message.hasOwnProperty("b")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (typeof message.b !== "boolean")
                    return "b: boolean expected";
            }
            if (message.s != null && message.hasOwnProperty("s")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!$util.isString(message.s))
                    return "s: string expected";
            }
            if (message.e != null && message.hasOwnProperty("e")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.EnumValue.verify(message.e);
                    if (error)
                        return "e." + error;
                }
            }
            if (message.o != null && message.hasOwnProperty("o")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.ObjectValue.verify(message.o);
                    if (error)
                        return "o." + error;
                }
            }
            if (message.a != null && message.hasOwnProperty("a")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.ArrayValue.verify(message.a);
                    if (error)
                        return "a." + error;
                }
            }
            if (message.r != null && message.hasOwnProperty("r")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.BytesValue.verify(message.r);
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
        Value.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Value)
                return object;
            var message = new $root.hermes.Value();
            if (object.i != null)
                if ($util.Long)
                    (message.i = $util.Long.fromValue(object.i)).unsigned = false;
                else if (typeof object.i === "string")
                    message.i = parseInt(object.i, 10);
                else if (typeof object.i === "number")
                    message.i = object.i;
                else if (typeof object.i === "object")
                    message.i = new $util.LongBits(object.i.low >>> 0, object.i.high >>> 0).toNumber();
            if (object.u != null)
                if ($util.Long)
                    (message.u = $util.Long.fromValue(object.u)).unsigned = true;
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
                if (typeof object.e !== "object")
                    throw TypeError(".hermes.Value.e: object expected");
                message.e = $root.hermes.EnumValue.fromObject(object.e);
            }
            if (object.o != null) {
                if (typeof object.o !== "object")
                    throw TypeError(".hermes.Value.o: object expected");
                message.o = $root.hermes.ObjectValue.fromObject(object.o);
            }
            if (object.a != null) {
                if (typeof object.a !== "object")
                    throw TypeError(".hermes.Value.a: object expected");
                message.a = $root.hermes.ArrayValue.fromObject(object.a);
            }
            if (object.r != null) {
                if (typeof object.r !== "object")
                    throw TypeError(".hermes.Value.r: object expected");
                message.r = $root.hermes.BytesValue.fromObject(object.r);
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
        Value.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.i != null && message.hasOwnProperty("i")) {
                if (typeof message.i === "number")
                    object.i = options.longs === String ? String(message.i) : message.i;
                else
                    object.i = options.longs === String ? $util.Long.prototype.toString.call(message.i) : options.longs === Number ? new $util.LongBits(message.i.low >>> 0, message.i.high >>> 0).toNumber() : message.i;
                if (options.oneofs)
                    object.value = "i";
            }
            if (message.u != null && message.hasOwnProperty("u")) {
                if (typeof message.u === "number")
                    object.u = options.longs === String ? String(message.u) : message.u;
                else
                    object.u = options.longs === String ? $util.Long.prototype.toString.call(message.u) : options.longs === Number ? new $util.LongBits(message.u.low >>> 0, message.u.high >>> 0).toNumber(true) : message.u;
                if (options.oneofs)
                    object.value = "u";
            }
            if (message.f != null && message.hasOwnProperty("f")) {
                object.f = options.json && !isFinite(message.f) ? String(message.f) : message.f;
                if (options.oneofs)
                    object.value = "f";
            }
            if (message.b != null && message.hasOwnProperty("b")) {
                object.b = message.b;
                if (options.oneofs)
                    object.value = "b";
            }
            if (message.s != null && message.hasOwnProperty("s")) {
                object.s = message.s;
                if (options.oneofs)
                    object.value = "s";
            }
            if (message.e != null && message.hasOwnProperty("e")) {
                object.e = $root.hermes.EnumValue.toObject(message.e, options);
                if (options.oneofs)
                    object.value = "e";
            }
            if (message.o != null && message.hasOwnProperty("o")) {
                object.o = $root.hermes.ObjectValue.toObject(message.o, options);
                if (options.oneofs)
                    object.value = "o";
            }
            if (message.a != null && message.hasOwnProperty("a")) {
                object.a = $root.hermes.ArrayValue.toObject(message.a, options);
                if (options.oneofs)
                    object.value = "a";
            }
            if (message.r != null && message.hasOwnProperty("r")) {
                object.r = $root.hermes.BytesValue.toObject(message.r, options);
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
                    if (properties[keys[i]] != null)
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
        ParameterDef.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.component);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                $root.hermes.Type.encode(message.type, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
        ParameterDef.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ParameterDef();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                        message.type = $root.hermes.Type.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        ParameterDef.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.component != null && message.hasOwnProperty("component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.type != null && message.hasOwnProperty("type")) {
                var error = $root.hermes.Type.verify(message.type);
                if (error)
                    return "type." + error;
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
        ParameterDef.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ParameterDef)
                return object;
            var message = new $root.hermes.ParameterDef();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.component != null)
                message.component = String(object.component);
            if (object.name != null)
                message.name = String(object.name);
            if (object.type != null) {
                if (typeof object.type !== "object")
                    throw TypeError(".hermes.ParameterDef.type: object expected");
                message.type = $root.hermes.Type.fromObject(object.type);
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
        ParameterDef.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.component = "";
                object.name = "";
                object.type = null;
                object.metadata = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.component != null && message.hasOwnProperty("component"))
                object.component = message.component;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = $root.hermes.Type.toObject(message.type, options);
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
                    if (properties[keys[i]] != null)
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
        CommandDef.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.opcode != null && Object.hasOwnProperty.call(message, "opcode"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.opcode);
            if (message.mnemonic != null && Object.hasOwnProperty.call(message, "mnemonic"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.mnemonic);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.component);
            if (message["arguments"] != null && message["arguments"].length)
                for (var i = 0; i < message["arguments"].length; ++i)
                    $root.hermes.Field.encode(message["arguments"][i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
        CommandDef.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.CommandDef();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                        message["arguments"].push($root.hermes.Field.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        CommandDef.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.opcode != null && message.hasOwnProperty("opcode"))
                if (!$util.isInteger(message.opcode))
                    return "opcode: integer expected";
            if (message.mnemonic != null && message.hasOwnProperty("mnemonic"))
                if (!$util.isString(message.mnemonic))
                    return "mnemonic: string expected";
            if (message.component != null && message.hasOwnProperty("component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message["arguments"] != null && message.hasOwnProperty("arguments")) {
                if (!Array.isArray(message["arguments"]))
                    return "arguments: array expected";
                for (var i = 0; i < message["arguments"].length; ++i) {
                    var error = $root.hermes.Field.verify(message["arguments"][i]);
                    if (error)
                        return "arguments." + error;
                }
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
        CommandDef.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.CommandDef)
                return object;
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
                    if (typeof object["arguments"][i] !== "object")
                        throw TypeError(".hermes.CommandDef.arguments: object expected");
                    message["arguments"][i] = $root.hermes.Field.fromObject(object["arguments"][i]);
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
        CommandDef.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object["arguments"] = [];
            if (options.defaults) {
                object.opcode = 0;
                object.mnemonic = "";
                object.component = "";
                object.metadata = "";
            }
            if (message.opcode != null && message.hasOwnProperty("opcode"))
                object.opcode = message.opcode;
            if (message.mnemonic != null && message.hasOwnProperty("mnemonic"))
                object.mnemonic = message.mnemonic;
            if (message.component != null && message.hasOwnProperty("component"))
                object.component = message.component;
            if (message["arguments"] && message["arguments"].length) {
                object["arguments"] = [];
                for (var j = 0; j < message["arguments"].length; ++j)
                    object["arguments"][j] = $root.hermes.Field.toObject(message["arguments"][j], options);
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
                    if (properties[keys[i]] != null)
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

        // Virtual OneOf for proto3 optional field
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
        FormatSpecifier.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        FormatSpecifier.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FormatSpecifier();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        FormatSpecifier.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.type != null && message.hasOwnProperty("type"))
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
            if (message.precision != null && message.hasOwnProperty("precision")) {
                properties._precision = 1;
                if (!$util.isInteger(message.precision))
                    return "precision: integer expected";
            }
            if (message.argumentIndex != null && message.hasOwnProperty("argumentIndex"))
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
        FormatSpecifier.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FormatSpecifier)
                return object;
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
        FormatSpecifier.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "FMT_DEFAULT" : 0;
                object.argumentIndex = 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.hermes.FormatSpecifierType[message.type] === undefined ? message.type : $root.hermes.FormatSpecifierType[message.type] : message.type;
            if (message.precision != null && message.hasOwnProperty("precision")) {
                object.precision = message.precision;
                if (options.oneofs)
                    object._precision = "precision";
            }
            if (message.argumentIndex != null && message.hasOwnProperty("argumentIndex"))
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
                    if (properties[keys[i]] != null)
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
        FormatFragment.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
            if (message.specifier != null && Object.hasOwnProperty.call(message, "specifier"))
                $root.hermes.FormatSpecifier.encode(message.specifier, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
        FormatFragment.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FormatFragment();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.text = reader.string();
                        break;
                    }
                case 2: {
                        message.specifier = $root.hermes.FormatSpecifier.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        FormatFragment.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.text != null && message.hasOwnProperty("text")) {
                properties.fragment = 1;
                if (!$util.isString(message.text))
                    return "text: string expected";
            }
            if (message.specifier != null && message.hasOwnProperty("specifier")) {
                if (properties.fragment === 1)
                    return "fragment: multiple values";
                properties.fragment = 1;
                {
                    var error = $root.hermes.FormatSpecifier.verify(message.specifier);
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
        FormatFragment.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FormatFragment)
                return object;
            var message = new $root.hermes.FormatFragment();
            if (object.text != null)
                message.text = String(object.text);
            if (object.specifier != null) {
                if (typeof object.specifier !== "object")
                    throw TypeError(".hermes.FormatFragment.specifier: object expected");
                message.specifier = $root.hermes.FormatSpecifier.fromObject(object.specifier);
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
        FormatFragment.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.text != null && message.hasOwnProperty("text")) {
                object.text = message.text;
                if (options.oneofs)
                    object.fragment = "text";
            }
            if (message.specifier != null && message.hasOwnProperty("specifier")) {
                object.specifier = $root.hermes.FormatSpecifier.toObject(message.specifier, options);
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
                    if (properties[keys[i]] != null)
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
        FormatString.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fragments != null && message.fragments.length)
                for (var i = 0; i < message.fragments.length; ++i)
                    $root.hermes.FormatFragment.encode(message.fragments[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
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
        FormatString.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FormatString();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.fragments && message.fragments.length))
                            message.fragments = [];
                        message.fragments.push($root.hermes.FormatFragment.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.original = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        FormatString.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fragments != null && message.hasOwnProperty("fragments")) {
                if (!Array.isArray(message.fragments))
                    return "fragments: array expected";
                for (var i = 0; i < message.fragments.length; ++i) {
                    var error = $root.hermes.FormatFragment.verify(message.fragments[i]);
                    if (error)
                        return "fragments." + error;
                }
            }
            if (message.original != null && message.hasOwnProperty("original"))
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
        FormatString.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FormatString)
                return object;
            var message = new $root.hermes.FormatString();
            if (object.fragments) {
                if (!Array.isArray(object.fragments))
                    throw TypeError(".hermes.FormatString.fragments: array expected");
                message.fragments = [];
                for (var i = 0; i < object.fragments.length; ++i) {
                    if (typeof object.fragments[i] !== "object")
                        throw TypeError(".hermes.FormatString.fragments: object expected");
                    message.fragments[i] = $root.hermes.FormatFragment.fromObject(object.fragments[i]);
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
        FormatString.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.fragments = [];
            if (options.defaults)
                object.original = "";
            if (message.fragments && message.fragments.length) {
                object.fragments = [];
                for (var j = 0; j < message.fragments.length; ++j)
                    object.fragments[j] = $root.hermes.FormatFragment.toObject(message.fragments[j], options);
            }
            if (message.original != null && message.hasOwnProperty("original"))
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
                    if (properties[keys[i]] != null)
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
        EventDef.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
                    $root.hermes.Field.encode(message["arguments"][i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.metadata);
            if (message.format != null && Object.hasOwnProperty.call(message, "format"))
                $root.hermes.FormatString.encode(message.format, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
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
        EventDef.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EventDef();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                        message["arguments"].push($root.hermes.Field.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        message.metadata = reader.string();
                        break;
                    }
                case 8: {
                        message.format = $root.hermes.FormatString.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        EventDef.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.component != null && message.hasOwnProperty("component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.severity != null && message.hasOwnProperty("severity"))
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
            if (message.formatString != null && message.hasOwnProperty("formatString"))
                if (!$util.isString(message.formatString))
                    return "formatString: string expected";
            if (message["arguments"] != null && message.hasOwnProperty("arguments")) {
                if (!Array.isArray(message["arguments"]))
                    return "arguments: array expected";
                for (var i = 0; i < message["arguments"].length; ++i) {
                    var error = $root.hermes.Field.verify(message["arguments"][i]);
                    if (error)
                        return "arguments." + error;
                }
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            if (message.format != null && message.hasOwnProperty("format")) {
                var error = $root.hermes.FormatString.verify(message.format);
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
        EventDef.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.EventDef)
                return object;
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
                    if (typeof object["arguments"][i] !== "object")
                        throw TypeError(".hermes.EventDef.arguments: object expected");
                    message["arguments"][i] = $root.hermes.Field.fromObject(object["arguments"][i]);
                }
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            if (object.format != null) {
                if (typeof object.format !== "object")
                    throw TypeError(".hermes.EventDef.format: object expected");
                message.format = $root.hermes.FormatString.fromObject(object.format);
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
        EventDef.toObject = function toObject(message, options) {
            if (!options)
                options = {};
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
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.component != null && message.hasOwnProperty("component"))
                object.component = message.component;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.severity != null && message.hasOwnProperty("severity"))
                object.severity = options.enums === String ? $root.hermes.EvrSeverity[message.severity] === undefined ? message.severity : $root.hermes.EvrSeverity[message.severity] : message.severity;
            if (message.formatString != null && message.hasOwnProperty("formatString"))
                object.formatString = message.formatString;
            if (message["arguments"] && message["arguments"].length) {
                object["arguments"] = [];
                for (var j = 0; j < message["arguments"].length; ++j)
                    object["arguments"][j] = $root.hermes.Field.toObject(message["arguments"][j], options);
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                object.metadata = message.metadata;
            if (message.format != null && message.hasOwnProperty("format"))
                object.format = $root.hermes.FormatString.toObject(message.format, options);
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

    hermes.EventRef = (function() {

        /**
         * Properties of an EventRef.
         * @memberof hermes
         * @interface IEventRef
         * @property {number|null} [id] EventRef id
         * @property {string|null} [name] EventRef name
         * @property {string|null} [component] EventRef component
         * @property {hermes.EvrSeverity|null} [severity] EventRef severity
         * @property {Array.<string>|null} ["arguments"] EventRef arguments
         * @property {string|null} [dictionary] EventRef dictionary
         */

        /**
         * Constructs a new EventRef.
         * @memberof hermes
         * @classdesc Represents an EventRef.
         * @implements IEventRef
         * @constructor
         * @param {hermes.IEventRef=} [properties] Properties to set
         */
        function EventRef(properties) {
            this["arguments"] = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EventRef id.
         * @member {number} id
         * @memberof hermes.EventRef
         * @instance
         */
        EventRef.prototype.id = 0;

        /**
         * EventRef name.
         * @member {string} name
         * @memberof hermes.EventRef
         * @instance
         */
        EventRef.prototype.name = "";

        /**
         * EventRef component.
         * @member {string} component
         * @memberof hermes.EventRef
         * @instance
         */
        EventRef.prototype.component = "";

        /**
         * EventRef severity.
         * @member {hermes.EvrSeverity} severity
         * @memberof hermes.EventRef
         * @instance
         */
        EventRef.prototype.severity = 0;

        /**
         * EventRef arguments.
         * @member {Array.<string>} arguments
         * @memberof hermes.EventRef
         * @instance
         */
        EventRef.prototype["arguments"] = $util.emptyArray;

        /**
         * EventRef dictionary.
         * @member {string} dictionary
         * @memberof hermes.EventRef
         * @instance
         */
        EventRef.prototype.dictionary = "";

        /**
         * Creates a new EventRef instance using the specified properties.
         * @function create
         * @memberof hermes.EventRef
         * @static
         * @param {hermes.IEventRef=} [properties] Properties to set
         * @returns {hermes.EventRef} EventRef instance
         */
        EventRef.create = function create(properties) {
            return new EventRef(properties);
        };

        /**
         * Encodes the specified EventRef message. Does not implicitly {@link hermes.EventRef.verify|verify} messages.
         * @function encode
         * @memberof hermes.EventRef
         * @static
         * @param {hermes.IEventRef} message EventRef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EventRef.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.component);
            if (message.severity != null && Object.hasOwnProperty.call(message, "severity"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.severity);
            if (message["arguments"] != null && message["arguments"].length)
                for (var i = 0; i < message["arguments"].length; ++i)
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message["arguments"][i]);
            if (message.dictionary != null && Object.hasOwnProperty.call(message, "dictionary"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.dictionary);
            return writer;
        };

        /**
         * Encodes the specified EventRef message, length delimited. Does not implicitly {@link hermes.EventRef.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.EventRef
         * @static
         * @param {hermes.IEventRef} message EventRef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EventRef.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EventRef message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.EventRef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.EventRef} EventRef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EventRef.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.EventRef();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                        message.severity = reader.int32();
                        break;
                    }
                case 5: {
                        if (!(message["arguments"] && message["arguments"].length))
                            message["arguments"] = [];
                        message["arguments"].push(reader.string());
                        break;
                    }
                case 10: {
                        message.dictionary = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EventRef message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.EventRef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.EventRef} EventRef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EventRef.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EventRef message.
         * @function verify
         * @memberof hermes.EventRef
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EventRef.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.component != null && message.hasOwnProperty("component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message.severity != null && message.hasOwnProperty("severity"))
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
            if (message["arguments"] != null && message.hasOwnProperty("arguments")) {
                if (!Array.isArray(message["arguments"]))
                    return "arguments: array expected";
                for (var i = 0; i < message["arguments"].length; ++i)
                    if (!$util.isString(message["arguments"][i]))
                        return "arguments: string[] expected";
            }
            if (message.dictionary != null && message.hasOwnProperty("dictionary"))
                if (!$util.isString(message.dictionary))
                    return "dictionary: string expected";
            return null;
        };

        /**
         * Creates an EventRef message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.EventRef
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.EventRef} EventRef
         */
        EventRef.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.EventRef)
                return object;
            var message = new $root.hermes.EventRef();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.component != null)
                message.component = String(object.component);
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
            if (object["arguments"]) {
                if (!Array.isArray(object["arguments"]))
                    throw TypeError(".hermes.EventRef.arguments: array expected");
                message["arguments"] = [];
                for (var i = 0; i < object["arguments"].length; ++i)
                    message["arguments"][i] = String(object["arguments"][i]);
            }
            if (object.dictionary != null)
                message.dictionary = String(object.dictionary);
            return message;
        };

        /**
         * Creates a plain object from an EventRef message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.EventRef
         * @static
         * @param {hermes.EventRef} message EventRef
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EventRef.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object["arguments"] = [];
            if (options.defaults) {
                object.id = 0;
                object.name = "";
                object.component = "";
                object.severity = options.enums === String ? "EVR_DIAGNOSTIC" : 0;
                object.dictionary = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.component != null && message.hasOwnProperty("component"))
                object.component = message.component;
            if (message.severity != null && message.hasOwnProperty("severity"))
                object.severity = options.enums === String ? $root.hermes.EvrSeverity[message.severity] === undefined ? message.severity : $root.hermes.EvrSeverity[message.severity] : message.severity;
            if (message["arguments"] && message["arguments"].length) {
                object["arguments"] = [];
                for (var j = 0; j < message["arguments"].length; ++j)
                    object["arguments"][j] = message["arguments"][j];
            }
            if (message.dictionary != null && message.hasOwnProperty("dictionary"))
                object.dictionary = message.dictionary;
            return object;
        };

        /**
         * Converts this EventRef to JSON.
         * @function toJSON
         * @memberof hermes.EventRef
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EventRef.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EventRef
         * @function getTypeUrl
         * @memberof hermes.EventRef
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EventRef.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.EventRef";
        };

        return EventRef;
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
                    if (properties[keys[i]] != null)
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
        TelemetryDef.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.component);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                $root.hermes.Type.encode(message.type, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
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
        TelemetryDef.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.TelemetryDef();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                        message.type = $root.hermes.Type.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.metadata = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        TelemetryDef.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.component != null && message.hasOwnProperty("component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message.type != null && message.hasOwnProperty("type")) {
                var error = $root.hermes.Type.verify(message.type);
                if (error)
                    return "type." + error;
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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
        TelemetryDef.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.TelemetryDef)
                return object;
            var message = new $root.hermes.TelemetryDef();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.component != null)
                message.component = String(object.component);
            if (object.type != null) {
                if (typeof object.type !== "object")
                    throw TypeError(".hermes.TelemetryDef.type: object expected");
                message.type = $root.hermes.Type.fromObject(object.type);
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
        TelemetryDef.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.name = "";
                object.component = "";
                object.type = null;
                object.metadata = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.component != null && message.hasOwnProperty("component"))
                object.component = message.component;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = $root.hermes.Type.toObject(message.type, options);
            if (message.metadata != null && message.hasOwnProperty("metadata"))
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

    hermes.TelemetryRef = (function() {

        /**
         * Properties of a TelemetryRef.
         * @memberof hermes
         * @interface ITelemetryRef
         * @property {number|null} [id] TelemetryRef id
         * @property {string|null} [name] TelemetryRef name
         * @property {string|null} [component] TelemetryRef component
         * @property {string|null} [dictionary] TelemetryRef dictionary
         */

        /**
         * Constructs a new TelemetryRef.
         * @memberof hermes
         * @classdesc Represents a TelemetryRef.
         * @implements ITelemetryRef
         * @constructor
         * @param {hermes.ITelemetryRef=} [properties] Properties to set
         */
        function TelemetryRef(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TelemetryRef id.
         * @member {number} id
         * @memberof hermes.TelemetryRef
         * @instance
         */
        TelemetryRef.prototype.id = 0;

        /**
         * TelemetryRef name.
         * @member {string} name
         * @memberof hermes.TelemetryRef
         * @instance
         */
        TelemetryRef.prototype.name = "";

        /**
         * TelemetryRef component.
         * @member {string} component
         * @memberof hermes.TelemetryRef
         * @instance
         */
        TelemetryRef.prototype.component = "";

        /**
         * TelemetryRef dictionary.
         * @member {string} dictionary
         * @memberof hermes.TelemetryRef
         * @instance
         */
        TelemetryRef.prototype.dictionary = "";

        /**
         * Creates a new TelemetryRef instance using the specified properties.
         * @function create
         * @memberof hermes.TelemetryRef
         * @static
         * @param {hermes.ITelemetryRef=} [properties] Properties to set
         * @returns {hermes.TelemetryRef} TelemetryRef instance
         */
        TelemetryRef.create = function create(properties) {
            return new TelemetryRef(properties);
        };

        /**
         * Encodes the specified TelemetryRef message. Does not implicitly {@link hermes.TelemetryRef.verify|verify} messages.
         * @function encode
         * @memberof hermes.TelemetryRef
         * @static
         * @param {hermes.ITelemetryRef} message TelemetryRef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TelemetryRef.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.component != null && Object.hasOwnProperty.call(message, "component"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.component);
            if (message.dictionary != null && Object.hasOwnProperty.call(message, "dictionary"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.dictionary);
            return writer;
        };

        /**
         * Encodes the specified TelemetryRef message, length delimited. Does not implicitly {@link hermes.TelemetryRef.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.TelemetryRef
         * @static
         * @param {hermes.ITelemetryRef} message TelemetryRef message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TelemetryRef.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TelemetryRef message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.TelemetryRef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.TelemetryRef} TelemetryRef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TelemetryRef.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.TelemetryRef();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                case 10: {
                        message.dictionary = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TelemetryRef message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.TelemetryRef
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.TelemetryRef} TelemetryRef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TelemetryRef.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TelemetryRef message.
         * @function verify
         * @memberof hermes.TelemetryRef
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TelemetryRef.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.component != null && message.hasOwnProperty("component"))
                if (!$util.isString(message.component))
                    return "component: string expected";
            if (message.dictionary != null && message.hasOwnProperty("dictionary"))
                if (!$util.isString(message.dictionary))
                    return "dictionary: string expected";
            return null;
        };

        /**
         * Creates a TelemetryRef message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.TelemetryRef
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.TelemetryRef} TelemetryRef
         */
        TelemetryRef.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.TelemetryRef)
                return object;
            var message = new $root.hermes.TelemetryRef();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.component != null)
                message.component = String(object.component);
            if (object.dictionary != null)
                message.dictionary = String(object.dictionary);
            return message;
        };

        /**
         * Creates a plain object from a TelemetryRef message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.TelemetryRef
         * @static
         * @param {hermes.TelemetryRef} message TelemetryRef
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TelemetryRef.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.name = "";
                object.component = "";
                object.dictionary = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.component != null && message.hasOwnProperty("component"))
                object.component = message.component;
            if (message.dictionary != null && message.hasOwnProperty("dictionary"))
                object.dictionary = message.dictionary;
            return object;
        };

        /**
         * Converts this TelemetryRef to JSON.
         * @function toJSON
         * @memberof hermes.TelemetryRef
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TelemetryRef.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TelemetryRef
         * @function getTypeUrl
         * @memberof hermes.TelemetryRef
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TelemetryRef.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.TelemetryRef";
        };

        return TelemetryRef;
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
                    if (properties[keys[i]] != null)
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
        DictionaryHead.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
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
        DictionaryHead.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DictionaryHead();
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                    reader.skipType(tag & 7);
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
        DictionaryHead.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.version != null && message.hasOwnProperty("version"))
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
        DictionaryHead.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.DictionaryHead)
                return object;
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
        DictionaryHead.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = "";
                object.name = "";
                object.version = "";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.version != null && message.hasOwnProperty("version"))
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
                    if (properties[keys[i]] != null)
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
        DictionaryNamespace.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.commands != null && Object.hasOwnProperty.call(message, "commands"))
                for (var keys = Object.keys(message.commands), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.CommandDef.encode(message.commands[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            if (message.events != null && Object.hasOwnProperty.call(message, "events"))
                for (var keys = Object.keys(message.events), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.EventDef.encode(message.events[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            if (message.telemetry != null && Object.hasOwnProperty.call(message, "telemetry"))
                for (var keys = Object.keys(message.telemetry), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.TelemetryDef.encode(message.telemetry[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            if (message.parameters != null && Object.hasOwnProperty.call(message, "parameters"))
                for (var keys = Object.keys(message.parameters), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.ParameterDef.encode(message.parameters[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            if (message.types != null && Object.hasOwnProperty.call(message, "types"))
                for (var keys = Object.keys(message.types), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.Type.encode(message.types[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
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
        DictionaryNamespace.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DictionaryNamespace(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
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
                                value = $root.hermes.CommandDef.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
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
                                value = $root.hermes.EventDef.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
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
                                value = $root.hermes.TelemetryDef.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
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
                                value = $root.hermes.ParameterDef.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
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
                                value = $root.hermes.Type.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.types[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        DictionaryNamespace.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.commands != null && message.hasOwnProperty("commands")) {
                if (!$util.isObject(message.commands))
                    return "commands: object expected";
                var key = Object.keys(message.commands);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.CommandDef.verify(message.commands[key[i]]);
                    if (error)
                        return "commands." + error;
                }
            }
            if (message.events != null && message.hasOwnProperty("events")) {
                if (!$util.isObject(message.events))
                    return "events: object expected";
                var key = Object.keys(message.events);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.EventDef.verify(message.events[key[i]]);
                    if (error)
                        return "events." + error;
                }
            }
            if (message.telemetry != null && message.hasOwnProperty("telemetry")) {
                if (!$util.isObject(message.telemetry))
                    return "telemetry: object expected";
                var key = Object.keys(message.telemetry);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.TelemetryDef.verify(message.telemetry[key[i]]);
                    if (error)
                        return "telemetry." + error;
                }
            }
            if (message.parameters != null && message.hasOwnProperty("parameters")) {
                if (!$util.isObject(message.parameters))
                    return "parameters: object expected";
                var key = Object.keys(message.parameters);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.ParameterDef.verify(message.parameters[key[i]]);
                    if (error)
                        return "parameters." + error;
                }
            }
            if (message.types != null && message.hasOwnProperty("types")) {
                if (!$util.isObject(message.types))
                    return "types: object expected";
                var key = Object.keys(message.types);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.Type.verify(message.types[key[i]]);
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
        DictionaryNamespace.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.DictionaryNamespace)
                return object;
            var message = new $root.hermes.DictionaryNamespace();
            if (object.commands) {
                if (typeof object.commands !== "object")
                    throw TypeError(".hermes.DictionaryNamespace.commands: object expected");
                message.commands = {};
                for (var keys = Object.keys(object.commands), i = 0; i < keys.length; ++i) {
                    if (typeof object.commands[keys[i]] !== "object")
                        throw TypeError(".hermes.DictionaryNamespace.commands: object expected");
                    message.commands[keys[i]] = $root.hermes.CommandDef.fromObject(object.commands[keys[i]]);
                }
            }
            if (object.events) {
                if (typeof object.events !== "object")
                    throw TypeError(".hermes.DictionaryNamespace.events: object expected");
                message.events = {};
                for (var keys = Object.keys(object.events), i = 0; i < keys.length; ++i) {
                    if (typeof object.events[keys[i]] !== "object")
                        throw TypeError(".hermes.DictionaryNamespace.events: object expected");
                    message.events[keys[i]] = $root.hermes.EventDef.fromObject(object.events[keys[i]]);
                }
            }
            if (object.telemetry) {
                if (typeof object.telemetry !== "object")
                    throw TypeError(".hermes.DictionaryNamespace.telemetry: object expected");
                message.telemetry = {};
                for (var keys = Object.keys(object.telemetry), i = 0; i < keys.length; ++i) {
                    if (typeof object.telemetry[keys[i]] !== "object")
                        throw TypeError(".hermes.DictionaryNamespace.telemetry: object expected");
                    message.telemetry[keys[i]] = $root.hermes.TelemetryDef.fromObject(object.telemetry[keys[i]]);
                }
            }
            if (object.parameters) {
                if (typeof object.parameters !== "object")
                    throw TypeError(".hermes.DictionaryNamespace.parameters: object expected");
                message.parameters = {};
                for (var keys = Object.keys(object.parameters), i = 0; i < keys.length; ++i) {
                    if (typeof object.parameters[keys[i]] !== "object")
                        throw TypeError(".hermes.DictionaryNamespace.parameters: object expected");
                    message.parameters[keys[i]] = $root.hermes.ParameterDef.fromObject(object.parameters[keys[i]]);
                }
            }
            if (object.types) {
                if (typeof object.types !== "object")
                    throw TypeError(".hermes.DictionaryNamespace.types: object expected");
                message.types = {};
                for (var keys = Object.keys(object.types), i = 0; i < keys.length; ++i) {
                    if (typeof object.types[keys[i]] !== "object")
                        throw TypeError(".hermes.DictionaryNamespace.types: object expected");
                    message.types[keys[i]] = $root.hermes.Type.fromObject(object.types[keys[i]]);
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
        DictionaryNamespace.toObject = function toObject(message, options) {
            if (!options)
                options = {};
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
                for (var j = 0; j < keys2.length; ++j)
                    object.commands[keys2[j]] = $root.hermes.CommandDef.toObject(message.commands[keys2[j]], options);
            }
            if (message.events && (keys2 = Object.keys(message.events)).length) {
                object.events = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.events[keys2[j]] = $root.hermes.EventDef.toObject(message.events[keys2[j]], options);
            }
            if (message.telemetry && (keys2 = Object.keys(message.telemetry)).length) {
                object.telemetry = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.telemetry[keys2[j]] = $root.hermes.TelemetryDef.toObject(message.telemetry[keys2[j]], options);
            }
            if (message.parameters && (keys2 = Object.keys(message.parameters)).length) {
                object.parameters = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.parameters[keys2[j]] = $root.hermes.ParameterDef.toObject(message.parameters[keys2[j]], options);
            }
            if (message.types && (keys2 = Object.keys(message.types)).length) {
                object.types = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.types[keys2[j]] = $root.hermes.Type.toObject(message.types[keys2[j]], options);
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
                    if (properties[keys[i]] != null)
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
        Dictionary.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.head != null && Object.hasOwnProperty.call(message, "head"))
                $root.hermes.DictionaryHead.encode(message.head, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                for (var keys = Object.keys(message.content), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.DictionaryNamespace.encode(message.content[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
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
        Dictionary.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Dictionary(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.head = $root.hermes.DictionaryHead.decode(reader, reader.uint32());
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
                                value = $root.hermes.DictionaryNamespace.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.metadata[key] = value;
                        break;
                    }
                case 4: {
                        message.id = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
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
        Dictionary.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.head != null && message.hasOwnProperty("head")) {
                var error = $root.hermes.DictionaryHead.verify(message.head);
                if (error)
                    return "head." + error;
            }
            if (message.content != null && message.hasOwnProperty("content")) {
                if (!$util.isObject(message.content))
                    return "content: object expected";
                var key = Object.keys(message.content);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.DictionaryNamespace.verify(message.content[key[i]]);
                    if (error)
                        return "content." + error;
                }
            }
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                if (!$util.isObject(message.metadata))
                    return "metadata: object expected";
                var key = Object.keys(message.metadata);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.metadata[key[i]]))
                        return "metadata: string{k:string} expected";
            }
            if (message.id != null && message.hasOwnProperty("id"))
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
        Dictionary.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Dictionary)
                return object;
            var message = new $root.hermes.Dictionary();
            if (object.head != null) {
                if (typeof object.head !== "object")
                    throw TypeError(".hermes.Dictionary.head: object expected");
                message.head = $root.hermes.DictionaryHead.fromObject(object.head);
            }
            if (object.content) {
                if (typeof object.content !== "object")
                    throw TypeError(".hermes.Dictionary.content: object expected");
                message.content = {};
                for (var keys = Object.keys(object.content), i = 0; i < keys.length; ++i) {
                    if (typeof object.content[keys[i]] !== "object")
                        throw TypeError(".hermes.Dictionary.content: object expected");
                    message.content[keys[i]] = $root.hermes.DictionaryNamespace.fromObject(object.content[keys[i]]);
                }
            }
            if (object.metadata) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.Dictionary.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
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
        Dictionary.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults) {
                object.content = {};
                object.metadata = {};
            }
            if (options.defaults) {
                object.head = null;
                object.id = "";
            }
            if (message.head != null && message.hasOwnProperty("head"))
                object.head = $root.hermes.DictionaryHead.toObject(message.head, options);
            var keys2;
            if (message.content && (keys2 = Object.keys(message.content)).length) {
                object.content = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.content[keys2[j]] = $root.hermes.DictionaryNamespace.toObject(message.content[keys2[j]], options);
            }
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
            }
            if (message.id != null && message.hasOwnProperty("id"))
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

    hermes.Time = (function() {

        /**
         * Properties of a Time.
         * @memberof hermes
         * @interface ITime
         * @property {google.protobuf.ITimestamp|null} [unix] Time unix
         * @property {number|null} [sclk] Time sclk
         */

        /**
         * Constructs a new Time.
         * @memberof hermes
         * @classdesc Represents a Time.
         * @implements ITime
         * @constructor
         * @param {hermes.ITime=} [properties] Properties to set
         */
        function Time(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Time unix.
         * @member {google.protobuf.ITimestamp|null|undefined} unix
         * @memberof hermes.Time
         * @instance
         */
        Time.prototype.unix = null;

        /**
         * Time sclk.
         * @member {number} sclk
         * @memberof hermes.Time
         * @instance
         */
        Time.prototype.sclk = 0;

        /**
         * Creates a new Time instance using the specified properties.
         * @function create
         * @memberof hermes.Time
         * @static
         * @param {hermes.ITime=} [properties] Properties to set
         * @returns {hermes.Time} Time instance
         */
        Time.create = function create(properties) {
            return new Time(properties);
        };

        /**
         * Encodes the specified Time message. Does not implicitly {@link hermes.Time.verify|verify} messages.
         * @function encode
         * @memberof hermes.Time
         * @static
         * @param {hermes.ITime} message Time message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Time.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.unix != null && Object.hasOwnProperty.call(message, "unix"))
                $root.google.protobuf.Timestamp.encode(message.unix, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.sclk != null && Object.hasOwnProperty.call(message, "sclk"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.sclk);
            return writer;
        };

        /**
         * Encodes the specified Time message, length delimited. Does not implicitly {@link hermes.Time.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Time
         * @static
         * @param {hermes.ITime} message Time message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Time.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Time message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Time
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Time} Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Time.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Time();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.unix = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.sclk = reader.double();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Time message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Time
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Time} Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Time.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Time message.
         * @function verify
         * @memberof hermes.Time
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Time.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.unix != null && message.hasOwnProperty("unix")) {
                var error = $root.google.protobuf.Timestamp.verify(message.unix);
                if (error)
                    return "unix." + error;
            }
            if (message.sclk != null && message.hasOwnProperty("sclk"))
                if (typeof message.sclk !== "number")
                    return "sclk: number expected";
            return null;
        };

        /**
         * Creates a Time message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Time
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Time} Time
         */
        Time.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Time)
                return object;
            var message = new $root.hermes.Time();
            if (object.unix != null) {
                if (typeof object.unix !== "object")
                    throw TypeError(".hermes.Time.unix: object expected");
                message.unix = $root.google.protobuf.Timestamp.fromObject(object.unix);
            }
            if (object.sclk != null)
                message.sclk = Number(object.sclk);
            return message;
        };

        /**
         * Creates a plain object from a Time message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Time
         * @static
         * @param {hermes.Time} message Time
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Time.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.unix = null;
                object.sclk = 0;
            }
            if (message.unix != null && message.hasOwnProperty("unix"))
                object.unix = $root.google.protobuf.Timestamp.toObject(message.unix, options);
            if (message.sclk != null && message.hasOwnProperty("sclk"))
                object.sclk = options.json && !isFinite(message.sclk) ? String(message.sclk) : message.sclk;
            return object;
        };

        /**
         * Converts this Time to JSON.
         * @function toJSON
         * @memberof hermes.Time
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Time.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Time
         * @function getTypeUrl
         * @memberof hermes.Time
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Time.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Time";
        };

        return Time;
    })();

    hermes.FileHeader = (function() {

        /**
         * Properties of a FileHeader.
         * @memberof hermes
         * @interface IFileHeader
         * @property {string|null} [sourcePath] FileHeader sourcePath
         * @property {string|null} [destinationPath] FileHeader destinationPath
         * @property {number|Long|null} [size] FileHeader size
         * @property {Object.<string,string>|null} [metadata] FileHeader metadata
         */

        /**
         * Constructs a new FileHeader.
         * @memberof hermes
         * @classdesc Represents a FileHeader.
         * @implements IFileHeader
         * @constructor
         * @param {hermes.IFileHeader=} [properties] Properties to set
         */
        function FileHeader(properties) {
            this.metadata = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FileHeader sourcePath.
         * @member {string} sourcePath
         * @memberof hermes.FileHeader
         * @instance
         */
        FileHeader.prototype.sourcePath = "";

        /**
         * FileHeader destinationPath.
         * @member {string} destinationPath
         * @memberof hermes.FileHeader
         * @instance
         */
        FileHeader.prototype.destinationPath = "";

        /**
         * FileHeader size.
         * @member {number|Long} size
         * @memberof hermes.FileHeader
         * @instance
         */
        FileHeader.prototype.size = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FileHeader metadata.
         * @member {Object.<string,string>} metadata
         * @memberof hermes.FileHeader
         * @instance
         */
        FileHeader.prototype.metadata = $util.emptyObject;

        /**
         * Creates a new FileHeader instance using the specified properties.
         * @function create
         * @memberof hermes.FileHeader
         * @static
         * @param {hermes.IFileHeader=} [properties] Properties to set
         * @returns {hermes.FileHeader} FileHeader instance
         */
        FileHeader.create = function create(properties) {
            return new FileHeader(properties);
        };

        /**
         * Encodes the specified FileHeader message. Does not implicitly {@link hermes.FileHeader.verify|verify} messages.
         * @function encode
         * @memberof hermes.FileHeader
         * @static
         * @param {hermes.IFileHeader} message FileHeader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileHeader.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sourcePath != null && Object.hasOwnProperty.call(message, "sourcePath"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sourcePath);
            if (message.destinationPath != null && Object.hasOwnProperty.call(message, "destinationPath"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.destinationPath);
            if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.size);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FileHeader message, length delimited. Does not implicitly {@link hermes.FileHeader.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FileHeader
         * @static
         * @param {hermes.IFileHeader} message FileHeader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FileHeader.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FileHeader message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FileHeader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FileHeader} FileHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileHeader.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FileHeader(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.sourcePath = reader.string();
                        break;
                    }
                case 2: {
                        message.destinationPath = reader.string();
                        break;
                    }
                case 3: {
                        message.size = reader.uint64();
                        break;
                    }
                case 4: {
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.metadata[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FileHeader message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FileHeader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FileHeader} FileHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FileHeader.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FileHeader message.
         * @function verify
         * @memberof hermes.FileHeader
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FileHeader.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sourcePath != null && message.hasOwnProperty("sourcePath"))
                if (!$util.isString(message.sourcePath))
                    return "sourcePath: string expected";
            if (message.destinationPath != null && message.hasOwnProperty("destinationPath"))
                if (!$util.isString(message.destinationPath))
                    return "destinationPath: string expected";
            if (message.size != null && message.hasOwnProperty("size"))
                if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                    return "size: integer|Long expected";
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
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
         * Creates a FileHeader message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FileHeader
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FileHeader} FileHeader
         */
        FileHeader.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FileHeader)
                return object;
            var message = new $root.hermes.FileHeader();
            if (object.sourcePath != null)
                message.sourcePath = String(object.sourcePath);
            if (object.destinationPath != null)
                message.destinationPath = String(object.destinationPath);
            if (object.size != null)
                if ($util.Long)
                    (message.size = $util.Long.fromValue(object.size)).unsigned = true;
                else if (typeof object.size === "string")
                    message.size = parseInt(object.size, 10);
                else if (typeof object.size === "number")
                    message.size = object.size;
                else if (typeof object.size === "object")
                    message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
            if (object.metadata) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.FileHeader.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from a FileHeader message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FileHeader
         * @static
         * @param {hermes.FileHeader} message FileHeader
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FileHeader.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.metadata = {};
            if (options.defaults) {
                object.sourcePath = "";
                object.destinationPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.size = options.longs === String ? "0" : 0;
            }
            if (message.sourcePath != null && message.hasOwnProperty("sourcePath"))
                object.sourcePath = message.sourcePath;
            if (message.destinationPath != null && message.hasOwnProperty("destinationPath"))
                object.destinationPath = message.destinationPath;
            if (message.size != null && message.hasOwnProperty("size"))
                if (typeof message.size === "number")
                    object.size = options.longs === String ? String(message.size) : message.size;
                else
                    object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this FileHeader to JSON.
         * @function toJSON
         * @memberof hermes.FileHeader
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FileHeader.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FileHeader
         * @function getTypeUrl
         * @memberof hermes.FileHeader
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FileHeader.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FileHeader";
        };

        return FileHeader;
    })();

    hermes.UplinkFileChunk = (function() {

        /**
         * Properties of an UplinkFileChunk.
         * @memberof hermes
         * @interface IUplinkFileChunk
         * @property {hermes.IFileHeader|null} [header] UplinkFileChunk header
         * @property {Uint8Array|null} [data] UplinkFileChunk data
         */

        /**
         * Constructs a new UplinkFileChunk.
         * @memberof hermes
         * @classdesc Represents an UplinkFileChunk.
         * @implements IUplinkFileChunk
         * @constructor
         * @param {hermes.IUplinkFileChunk=} [properties] Properties to set
         */
        function UplinkFileChunk(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UplinkFileChunk header.
         * @member {hermes.IFileHeader|null|undefined} header
         * @memberof hermes.UplinkFileChunk
         * @instance
         */
        UplinkFileChunk.prototype.header = null;

        /**
         * UplinkFileChunk data.
         * @member {Uint8Array|null|undefined} data
         * @memberof hermes.UplinkFileChunk
         * @instance
         */
        UplinkFileChunk.prototype.data = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * UplinkFileChunk value.
         * @member {"header"|"data"|undefined} value
         * @memberof hermes.UplinkFileChunk
         * @instance
         */
        Object.defineProperty(UplinkFileChunk.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["header", "data"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new UplinkFileChunk instance using the specified properties.
         * @function create
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {hermes.IUplinkFileChunk=} [properties] Properties to set
         * @returns {hermes.UplinkFileChunk} UplinkFileChunk instance
         */
        UplinkFileChunk.create = function create(properties) {
            return new UplinkFileChunk(properties);
        };

        /**
         * Encodes the specified UplinkFileChunk message. Does not implicitly {@link hermes.UplinkFileChunk.verify|verify} messages.
         * @function encode
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {hermes.IUplinkFileChunk} message UplinkFileChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UplinkFileChunk.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                $root.hermes.FileHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified UplinkFileChunk message, length delimited. Does not implicitly {@link hermes.UplinkFileChunk.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {hermes.IUplinkFileChunk} message UplinkFileChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UplinkFileChunk.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UplinkFileChunk message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.UplinkFileChunk} UplinkFileChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UplinkFileChunk.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.UplinkFileChunk();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.header = $root.hermes.FileHeader.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.data = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an UplinkFileChunk message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.UplinkFileChunk} UplinkFileChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UplinkFileChunk.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UplinkFileChunk message.
         * @function verify
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UplinkFileChunk.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.header != null && message.hasOwnProperty("header")) {
                properties.value = 1;
                {
                    var error = $root.hermes.FileHeader.verify(message.header);
                    if (error)
                        return "header." + error;
                }
            }
            if (message.data != null && message.hasOwnProperty("data")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            }
            return null;
        };

        /**
         * Creates an UplinkFileChunk message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.UplinkFileChunk} UplinkFileChunk
         */
        UplinkFileChunk.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.UplinkFileChunk)
                return object;
            var message = new $root.hermes.UplinkFileChunk();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".hermes.UplinkFileChunk.header: object expected");
                message.header = $root.hermes.FileHeader.fromObject(object.header);
            }
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length >= 0)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from an UplinkFileChunk message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {hermes.UplinkFileChunk} message UplinkFileChunk
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UplinkFileChunk.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.header != null && message.hasOwnProperty("header")) {
                object.header = $root.hermes.FileHeader.toObject(message.header, options);
                if (options.oneofs)
                    object.value = "header";
            }
            if (message.data != null && message.hasOwnProperty("data")) {
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                if (options.oneofs)
                    object.value = "data";
            }
            return object;
        };

        /**
         * Converts this UplinkFileChunk to JSON.
         * @function toJSON
         * @memberof hermes.UplinkFileChunk
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UplinkFileChunk.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UplinkFileChunk
         * @function getTypeUrl
         * @memberof hermes.UplinkFileChunk
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UplinkFileChunk.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.UplinkFileChunk";
        };

        return UplinkFileChunk;
    })();

    hermes.DownlinkFileData = (function() {

        /**
         * Properties of a DownlinkFileData.
         * @memberof hermes
         * @interface IDownlinkFileData
         * @property {number|Long|null} [offset] DownlinkFileData offset
         * @property {Uint8Array|null} [data] DownlinkFileData data
         * @property {Object.<string,string>|null} [md] DownlinkFileData md
         */

        /**
         * Constructs a new DownlinkFileData.
         * @memberof hermes
         * @classdesc Represents a DownlinkFileData.
         * @implements IDownlinkFileData
         * @constructor
         * @param {hermes.IDownlinkFileData=} [properties] Properties to set
         */
        function DownlinkFileData(properties) {
            this.md = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DownlinkFileData offset.
         * @member {number|Long} offset
         * @memberof hermes.DownlinkFileData
         * @instance
         */
        DownlinkFileData.prototype.offset = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * DownlinkFileData data.
         * @member {Uint8Array} data
         * @memberof hermes.DownlinkFileData
         * @instance
         */
        DownlinkFileData.prototype.data = $util.newBuffer([]);

        /**
         * DownlinkFileData md.
         * @member {Object.<string,string>} md
         * @memberof hermes.DownlinkFileData
         * @instance
         */
        DownlinkFileData.prototype.md = $util.emptyObject;

        /**
         * Creates a new DownlinkFileData instance using the specified properties.
         * @function create
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {hermes.IDownlinkFileData=} [properties] Properties to set
         * @returns {hermes.DownlinkFileData} DownlinkFileData instance
         */
        DownlinkFileData.create = function create(properties) {
            return new DownlinkFileData(properties);
        };

        /**
         * Encodes the specified DownlinkFileData message. Does not implicitly {@link hermes.DownlinkFileData.verify|verify} messages.
         * @function encode
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {hermes.IDownlinkFileData} message DownlinkFileData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DownlinkFileData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.offset);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
            if (message.md != null && Object.hasOwnProperty.call(message, "md"))
                for (var keys = Object.keys(message.md), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.md[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DownlinkFileData message, length delimited. Does not implicitly {@link hermes.DownlinkFileData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {hermes.IDownlinkFileData} message DownlinkFileData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DownlinkFileData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DownlinkFileData message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.DownlinkFileData} DownlinkFileData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DownlinkFileData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DownlinkFileData(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.offset = reader.uint64();
                        break;
                    }
                case 2: {
                        message.data = reader.bytes();
                        break;
                    }
                case 3: {
                        if (message.md === $util.emptyObject)
                            message.md = {};
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.md[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DownlinkFileData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.DownlinkFileData} DownlinkFileData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DownlinkFileData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DownlinkFileData message.
         * @function verify
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DownlinkFileData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.offset != null && message.hasOwnProperty("offset"))
                if (!$util.isInteger(message.offset) && !(message.offset && $util.isInteger(message.offset.low) && $util.isInteger(message.offset.high)))
                    return "offset: integer|Long expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            if (message.md != null && message.hasOwnProperty("md")) {
                if (!$util.isObject(message.md))
                    return "md: object expected";
                var key = Object.keys(message.md);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.md[key[i]]))
                        return "md: string{k:string} expected";
            }
            return null;
        };

        /**
         * Creates a DownlinkFileData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.DownlinkFileData} DownlinkFileData
         */
        DownlinkFileData.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.DownlinkFileData)
                return object;
            var message = new $root.hermes.DownlinkFileData();
            if (object.offset != null)
                if ($util.Long)
                    (message.offset = $util.Long.fromValue(object.offset)).unsigned = true;
                else if (typeof object.offset === "string")
                    message.offset = parseInt(object.offset, 10);
                else if (typeof object.offset === "number")
                    message.offset = object.offset;
                else if (typeof object.offset === "object")
                    message.offset = new $util.LongBits(object.offset.low >>> 0, object.offset.high >>> 0).toNumber(true);
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length >= 0)
                    message.data = object.data;
            if (object.md) {
                if (typeof object.md !== "object")
                    throw TypeError(".hermes.DownlinkFileData.md: object expected");
                message.md = {};
                for (var keys = Object.keys(object.md), i = 0; i < keys.length; ++i)
                    message.md[keys[i]] = String(object.md[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from a DownlinkFileData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {hermes.DownlinkFileData} message DownlinkFileData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DownlinkFileData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.md = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.offset = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.offset = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            }
            if (message.offset != null && message.hasOwnProperty("offset"))
                if (typeof message.offset === "number")
                    object.offset = options.longs === String ? String(message.offset) : message.offset;
                else
                    object.offset = options.longs === String ? $util.Long.prototype.toString.call(message.offset) : options.longs === Number ? new $util.LongBits(message.offset.low >>> 0, message.offset.high >>> 0).toNumber(true) : message.offset;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            var keys2;
            if (message.md && (keys2 = Object.keys(message.md)).length) {
                object.md = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.md[keys2[j]] = message.md[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this DownlinkFileData to JSON.
         * @function toJSON
         * @memberof hermes.DownlinkFileData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DownlinkFileData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DownlinkFileData
         * @function getTypeUrl
         * @memberof hermes.DownlinkFileData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DownlinkFileData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.DownlinkFileData";
        };

        return DownlinkFileData;
    })();

    hermes.DownlinkFileMetadata = (function() {

        /**
         * Properties of a DownlinkFileMetadata.
         * @memberof hermes
         * @interface IDownlinkFileMetadata
         * @property {string|null} [key] DownlinkFileMetadata key
         * @property {Uint8Array|null} [data] DownlinkFileMetadata data
         */

        /**
         * Constructs a new DownlinkFileMetadata.
         * @memberof hermes
         * @classdesc Represents a DownlinkFileMetadata.
         * @implements IDownlinkFileMetadata
         * @constructor
         * @param {hermes.IDownlinkFileMetadata=} [properties] Properties to set
         */
        function DownlinkFileMetadata(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DownlinkFileMetadata key.
         * @member {string} key
         * @memberof hermes.DownlinkFileMetadata
         * @instance
         */
        DownlinkFileMetadata.prototype.key = "";

        /**
         * DownlinkFileMetadata data.
         * @member {Uint8Array} data
         * @memberof hermes.DownlinkFileMetadata
         * @instance
         */
        DownlinkFileMetadata.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new DownlinkFileMetadata instance using the specified properties.
         * @function create
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {hermes.IDownlinkFileMetadata=} [properties] Properties to set
         * @returns {hermes.DownlinkFileMetadata} DownlinkFileMetadata instance
         */
        DownlinkFileMetadata.create = function create(properties) {
            return new DownlinkFileMetadata(properties);
        };

        /**
         * Encodes the specified DownlinkFileMetadata message. Does not implicitly {@link hermes.DownlinkFileMetadata.verify|verify} messages.
         * @function encode
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {hermes.IDownlinkFileMetadata} message DownlinkFileMetadata message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DownlinkFileMetadata.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified DownlinkFileMetadata message, length delimited. Does not implicitly {@link hermes.DownlinkFileMetadata.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {hermes.IDownlinkFileMetadata} message DownlinkFileMetadata message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DownlinkFileMetadata.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DownlinkFileMetadata message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.DownlinkFileMetadata} DownlinkFileMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DownlinkFileMetadata.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DownlinkFileMetadata();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.key = reader.string();
                        break;
                    }
                case 2: {
                        message.data = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DownlinkFileMetadata message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.DownlinkFileMetadata} DownlinkFileMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DownlinkFileMetadata.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DownlinkFileMetadata message.
         * @function verify
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DownlinkFileMetadata.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            return null;
        };

        /**
         * Creates a DownlinkFileMetadata message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.DownlinkFileMetadata} DownlinkFileMetadata
         */
        DownlinkFileMetadata.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.DownlinkFileMetadata)
                return object;
            var message = new $root.hermes.DownlinkFileMetadata();
            if (object.key != null)
                message.key = String(object.key);
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length >= 0)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from a DownlinkFileMetadata message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {hermes.DownlinkFileMetadata} message DownlinkFileMetadata
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DownlinkFileMetadata.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.key = "";
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = message.key;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            return object;
        };

        /**
         * Converts this DownlinkFileMetadata to JSON.
         * @function toJSON
         * @memberof hermes.DownlinkFileMetadata
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DownlinkFileMetadata.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DownlinkFileMetadata
         * @function getTypeUrl
         * @memberof hermes.DownlinkFileMetadata
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DownlinkFileMetadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.DownlinkFileMetadata";
        };

        return DownlinkFileMetadata;
    })();

    hermes.DownlinkFileValidation = (function() {

        /**
         * Properties of a DownlinkFileValidation.
         * @memberof hermes
         * @interface IDownlinkFileValidation
         */

        /**
         * Constructs a new DownlinkFileValidation.
         * @memberof hermes
         * @classdesc Represents a DownlinkFileValidation.
         * @implements IDownlinkFileValidation
         * @constructor
         * @param {hermes.IDownlinkFileValidation=} [properties] Properties to set
         */
        function DownlinkFileValidation(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new DownlinkFileValidation instance using the specified properties.
         * @function create
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {hermes.IDownlinkFileValidation=} [properties] Properties to set
         * @returns {hermes.DownlinkFileValidation} DownlinkFileValidation instance
         */
        DownlinkFileValidation.create = function create(properties) {
            return new DownlinkFileValidation(properties);
        };

        /**
         * Encodes the specified DownlinkFileValidation message. Does not implicitly {@link hermes.DownlinkFileValidation.verify|verify} messages.
         * @function encode
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {hermes.IDownlinkFileValidation} message DownlinkFileValidation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DownlinkFileValidation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified DownlinkFileValidation message, length delimited. Does not implicitly {@link hermes.DownlinkFileValidation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {hermes.IDownlinkFileValidation} message DownlinkFileValidation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DownlinkFileValidation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DownlinkFileValidation message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.DownlinkFileValidation} DownlinkFileValidation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DownlinkFileValidation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DownlinkFileValidation();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DownlinkFileValidation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.DownlinkFileValidation} DownlinkFileValidation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DownlinkFileValidation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DownlinkFileValidation message.
         * @function verify
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DownlinkFileValidation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a DownlinkFileValidation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.DownlinkFileValidation} DownlinkFileValidation
         */
        DownlinkFileValidation.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.DownlinkFileValidation)
                return object;
            return new $root.hermes.DownlinkFileValidation();
        };

        /**
         * Creates a plain object from a DownlinkFileValidation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {hermes.DownlinkFileValidation} message DownlinkFileValidation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DownlinkFileValidation.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this DownlinkFileValidation to JSON.
         * @function toJSON
         * @memberof hermes.DownlinkFileValidation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DownlinkFileValidation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DownlinkFileValidation
         * @function getTypeUrl
         * @memberof hermes.DownlinkFileValidation
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DownlinkFileValidation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.DownlinkFileValidation";
        };

        return DownlinkFileValidation;
    })();

    hermes.DownlinkFileChunk = (function() {

        /**
         * Properties of a DownlinkFileChunk.
         * @memberof hermes
         * @interface IDownlinkFileChunk
         * @property {hermes.IFileHeader|null} [header] DownlinkFileChunk header
         * @property {hermes.IDownlinkFileData|null} [data] DownlinkFileChunk data
         * @property {hermes.IDownlinkFileMetadata|null} [metadata] DownlinkFileChunk metadata
         * @property {hermes.IDownlinkFileValidation|null} [validation] DownlinkFileChunk validation
         */

        /**
         * Constructs a new DownlinkFileChunk.
         * @memberof hermes
         * @classdesc Represents a DownlinkFileChunk.
         * @implements IDownlinkFileChunk
         * @constructor
         * @param {hermes.IDownlinkFileChunk=} [properties] Properties to set
         */
        function DownlinkFileChunk(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DownlinkFileChunk header.
         * @member {hermes.IFileHeader|null|undefined} header
         * @memberof hermes.DownlinkFileChunk
         * @instance
         */
        DownlinkFileChunk.prototype.header = null;

        /**
         * DownlinkFileChunk data.
         * @member {hermes.IDownlinkFileData|null|undefined} data
         * @memberof hermes.DownlinkFileChunk
         * @instance
         */
        DownlinkFileChunk.prototype.data = null;

        /**
         * DownlinkFileChunk metadata.
         * @member {hermes.IDownlinkFileMetadata|null|undefined} metadata
         * @memberof hermes.DownlinkFileChunk
         * @instance
         */
        DownlinkFileChunk.prototype.metadata = null;

        /**
         * DownlinkFileChunk validation.
         * @member {hermes.IDownlinkFileValidation|null|undefined} validation
         * @memberof hermes.DownlinkFileChunk
         * @instance
         */
        DownlinkFileChunk.prototype.validation = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * DownlinkFileChunk value.
         * @member {"header"|"data"|"metadata"|"validation"|undefined} value
         * @memberof hermes.DownlinkFileChunk
         * @instance
         */
        Object.defineProperty(DownlinkFileChunk.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["header", "data", "metadata", "validation"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new DownlinkFileChunk instance using the specified properties.
         * @function create
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {hermes.IDownlinkFileChunk=} [properties] Properties to set
         * @returns {hermes.DownlinkFileChunk} DownlinkFileChunk instance
         */
        DownlinkFileChunk.create = function create(properties) {
            return new DownlinkFileChunk(properties);
        };

        /**
         * Encodes the specified DownlinkFileChunk message. Does not implicitly {@link hermes.DownlinkFileChunk.verify|verify} messages.
         * @function encode
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {hermes.IDownlinkFileChunk} message DownlinkFileChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DownlinkFileChunk.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                $root.hermes.FileHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.hermes.DownlinkFileData.encode(message.data, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                $root.hermes.DownlinkFileMetadata.encode(message.metadata, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.validation != null && Object.hasOwnProperty.call(message, "validation"))
                $root.hermes.DownlinkFileValidation.encode(message.validation, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DownlinkFileChunk message, length delimited. Does not implicitly {@link hermes.DownlinkFileChunk.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {hermes.IDownlinkFileChunk} message DownlinkFileChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DownlinkFileChunk.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DownlinkFileChunk message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.DownlinkFileChunk} DownlinkFileChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DownlinkFileChunk.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DownlinkFileChunk();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.header = $root.hermes.FileHeader.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.data = $root.hermes.DownlinkFileData.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.metadata = $root.hermes.DownlinkFileMetadata.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.validation = $root.hermes.DownlinkFileValidation.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DownlinkFileChunk message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.DownlinkFileChunk} DownlinkFileChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DownlinkFileChunk.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DownlinkFileChunk message.
         * @function verify
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DownlinkFileChunk.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.header != null && message.hasOwnProperty("header")) {
                properties.value = 1;
                {
                    var error = $root.hermes.FileHeader.verify(message.header);
                    if (error)
                        return "header." + error;
                }
            }
            if (message.data != null && message.hasOwnProperty("data")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.DownlinkFileData.verify(message.data);
                    if (error)
                        return "data." + error;
                }
            }
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.DownlinkFileMetadata.verify(message.metadata);
                    if (error)
                        return "metadata." + error;
                }
            }
            if (message.validation != null && message.hasOwnProperty("validation")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.DownlinkFileValidation.verify(message.validation);
                    if (error)
                        return "validation." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DownlinkFileChunk message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.DownlinkFileChunk} DownlinkFileChunk
         */
        DownlinkFileChunk.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.DownlinkFileChunk)
                return object;
            var message = new $root.hermes.DownlinkFileChunk();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".hermes.DownlinkFileChunk.header: object expected");
                message.header = $root.hermes.FileHeader.fromObject(object.header);
            }
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".hermes.DownlinkFileChunk.data: object expected");
                message.data = $root.hermes.DownlinkFileData.fromObject(object.data);
            }
            if (object.metadata != null) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.DownlinkFileChunk.metadata: object expected");
                message.metadata = $root.hermes.DownlinkFileMetadata.fromObject(object.metadata);
            }
            if (object.validation != null) {
                if (typeof object.validation !== "object")
                    throw TypeError(".hermes.DownlinkFileChunk.validation: object expected");
                message.validation = $root.hermes.DownlinkFileValidation.fromObject(object.validation);
            }
            return message;
        };

        /**
         * Creates a plain object from a DownlinkFileChunk message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {hermes.DownlinkFileChunk} message DownlinkFileChunk
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DownlinkFileChunk.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.header != null && message.hasOwnProperty("header")) {
                object.header = $root.hermes.FileHeader.toObject(message.header, options);
                if (options.oneofs)
                    object.value = "header";
            }
            if (message.data != null && message.hasOwnProperty("data")) {
                object.data = $root.hermes.DownlinkFileData.toObject(message.data, options);
                if (options.oneofs)
                    object.value = "data";
            }
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                object.metadata = $root.hermes.DownlinkFileMetadata.toObject(message.metadata, options);
                if (options.oneofs)
                    object.value = "metadata";
            }
            if (message.validation != null && message.hasOwnProperty("validation")) {
                object.validation = $root.hermes.DownlinkFileValidation.toObject(message.validation, options);
                if (options.oneofs)
                    object.value = "validation";
            }
            return object;
        };

        /**
         * Converts this DownlinkFileChunk to JSON.
         * @function toJSON
         * @memberof hermes.DownlinkFileChunk
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DownlinkFileChunk.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DownlinkFileChunk
         * @function getTypeUrl
         * @memberof hermes.DownlinkFileChunk
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DownlinkFileChunk.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.DownlinkFileChunk";
        };

        return DownlinkFileChunk;
    })();

    /**
     * FswCapability enum.
     * @name hermes.FswCapability
     * @enum {number}
     * @property {number} COMMAND=0 COMMAND value
     * @property {number} PARSE_COMMAND=1 PARSE_COMMAND value
     * @property {number} SEQUENCE=2 SEQUENCE value
     * @property {number} PARSE_SEQUENCE=3 PARSE_SEQUENCE value
     * @property {number} FILE=4 FILE value
     * @property {number} REQUEST=5 REQUEST value
     */
    hermes.FswCapability = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "COMMAND"] = 0;
        values[valuesById[1] = "PARSE_COMMAND"] = 1;
        values[valuesById[2] = "SEQUENCE"] = 2;
        values[valuesById[3] = "PARSE_SEQUENCE"] = 3;
        values[valuesById[4] = "FILE"] = 4;
        values[valuesById[5] = "REQUEST"] = 5;
        return values;
    })();

    hermes.Fsw = (function() {

        /**
         * Properties of a Fsw.
         * @memberof hermes
         * @interface IFsw
         * @property {string|null} [id] Fsw id
         * @property {string|null} [type] Fsw type
         * @property {string|null} [profileId] Fsw profileId
         * @property {Array.<string>|null} [forwards] Fsw forwards
         * @property {Array.<hermes.FswCapability>|null} [capabilities] Fsw capabilities
         * @property {string|null} [dictionary] Fsw dictionary
         */

        /**
         * Constructs a new Fsw.
         * @memberof hermes
         * @classdesc Represents a Fsw.
         * @implements IFsw
         * @constructor
         * @param {hermes.IFsw=} [properties] Properties to set
         */
        function Fsw(properties) {
            this.forwards = [];
            this.capabilities = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Fsw id.
         * @member {string} id
         * @memberof hermes.Fsw
         * @instance
         */
        Fsw.prototype.id = "";

        /**
         * Fsw type.
         * @member {string} type
         * @memberof hermes.Fsw
         * @instance
         */
        Fsw.prototype.type = "";

        /**
         * Fsw profileId.
         * @member {string} profileId
         * @memberof hermes.Fsw
         * @instance
         */
        Fsw.prototype.profileId = "";

        /**
         * Fsw forwards.
         * @member {Array.<string>} forwards
         * @memberof hermes.Fsw
         * @instance
         */
        Fsw.prototype.forwards = $util.emptyArray;

        /**
         * Fsw capabilities.
         * @member {Array.<hermes.FswCapability>} capabilities
         * @memberof hermes.Fsw
         * @instance
         */
        Fsw.prototype.capabilities = $util.emptyArray;

        /**
         * Fsw dictionary.
         * @member {string} dictionary
         * @memberof hermes.Fsw
         * @instance
         */
        Fsw.prototype.dictionary = "";

        /**
         * Creates a new Fsw instance using the specified properties.
         * @function create
         * @memberof hermes.Fsw
         * @static
         * @param {hermes.IFsw=} [properties] Properties to set
         * @returns {hermes.Fsw} Fsw instance
         */
        Fsw.create = function create(properties) {
            return new Fsw(properties);
        };

        /**
         * Encodes the specified Fsw message. Does not implicitly {@link hermes.Fsw.verify|verify} messages.
         * @function encode
         * @memberof hermes.Fsw
         * @static
         * @param {hermes.IFsw} message Fsw message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Fsw.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
            if (message.profileId != null && Object.hasOwnProperty.call(message, "profileId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.profileId);
            if (message.forwards != null && message.forwards.length)
                for (var i = 0; i < message.forwards.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.forwards[i]);
            if (message.capabilities != null && message.capabilities.length) {
                writer.uint32(/* id 7, wireType 2 =*/58).fork();
                for (var i = 0; i < message.capabilities.length; ++i)
                    writer.int32(message.capabilities[i]);
                writer.ldelim();
            }
            if (message.dictionary != null && Object.hasOwnProperty.call(message, "dictionary"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.dictionary);
            return writer;
        };

        /**
         * Encodes the specified Fsw message, length delimited. Does not implicitly {@link hermes.Fsw.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Fsw
         * @static
         * @param {hermes.IFsw} message Fsw message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Fsw.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Fsw message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Fsw
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Fsw} Fsw
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Fsw.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Fsw();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.type = reader.string();
                        break;
                    }
                case 3: {
                        message.profileId = reader.string();
                        break;
                    }
                case 4: {
                        if (!(message.forwards && message.forwards.length))
                            message.forwards = [];
                        message.forwards.push(reader.string());
                        break;
                    }
                case 7: {
                        if (!(message.capabilities && message.capabilities.length))
                            message.capabilities = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.capabilities.push(reader.int32());
                        } else
                            message.capabilities.push(reader.int32());
                        break;
                    }
                case 8: {
                        message.dictionary = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Fsw message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Fsw
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Fsw} Fsw
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Fsw.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Fsw message.
         * @function verify
         * @memberof hermes.Fsw
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Fsw.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.profileId != null && message.hasOwnProperty("profileId"))
                if (!$util.isString(message.profileId))
                    return "profileId: string expected";
            if (message.forwards != null && message.hasOwnProperty("forwards")) {
                if (!Array.isArray(message.forwards))
                    return "forwards: array expected";
                for (var i = 0; i < message.forwards.length; ++i)
                    if (!$util.isString(message.forwards[i]))
                        return "forwards: string[] expected";
            }
            if (message.capabilities != null && message.hasOwnProperty("capabilities")) {
                if (!Array.isArray(message.capabilities))
                    return "capabilities: array expected";
                for (var i = 0; i < message.capabilities.length; ++i)
                    switch (message.capabilities[i]) {
                    default:
                        return "capabilities: enum value[] expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        break;
                    }
            }
            if (message.dictionary != null && message.hasOwnProperty("dictionary"))
                if (!$util.isString(message.dictionary))
                    return "dictionary: string expected";
            return null;
        };

        /**
         * Creates a Fsw message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Fsw
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Fsw} Fsw
         */
        Fsw.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Fsw)
                return object;
            var message = new $root.hermes.Fsw();
            if (object.id != null)
                message.id = String(object.id);
            if (object.type != null)
                message.type = String(object.type);
            if (object.profileId != null)
                message.profileId = String(object.profileId);
            if (object.forwards) {
                if (!Array.isArray(object.forwards))
                    throw TypeError(".hermes.Fsw.forwards: array expected");
                message.forwards = [];
                for (var i = 0; i < object.forwards.length; ++i)
                    message.forwards[i] = String(object.forwards[i]);
            }
            if (object.capabilities) {
                if (!Array.isArray(object.capabilities))
                    throw TypeError(".hermes.Fsw.capabilities: array expected");
                message.capabilities = [];
                for (var i = 0; i < object.capabilities.length; ++i)
                    switch (object.capabilities[i]) {
                    default:
                        if (typeof object.capabilities[i] === "number") {
                            message.capabilities[i] = object.capabilities[i];
                            break;
                        }
                    case "COMMAND":
                    case 0:
                        message.capabilities[i] = 0;
                        break;
                    case "PARSE_COMMAND":
                    case 1:
                        message.capabilities[i] = 1;
                        break;
                    case "SEQUENCE":
                    case 2:
                        message.capabilities[i] = 2;
                        break;
                    case "PARSE_SEQUENCE":
                    case 3:
                        message.capabilities[i] = 3;
                        break;
                    case "FILE":
                    case 4:
                        message.capabilities[i] = 4;
                        break;
                    case "REQUEST":
                    case 5:
                        message.capabilities[i] = 5;
                        break;
                    }
            }
            if (object.dictionary != null)
                message.dictionary = String(object.dictionary);
            return message;
        };

        /**
         * Creates a plain object from a Fsw message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Fsw
         * @static
         * @param {hermes.Fsw} message Fsw
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Fsw.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.forwards = [];
                object.capabilities = [];
            }
            if (options.defaults) {
                object.id = "";
                object.type = "";
                object.profileId = "";
                object.dictionary = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.profileId != null && message.hasOwnProperty("profileId"))
                object.profileId = message.profileId;
            if (message.forwards && message.forwards.length) {
                object.forwards = [];
                for (var j = 0; j < message.forwards.length; ++j)
                    object.forwards[j] = message.forwards[j];
            }
            if (message.capabilities && message.capabilities.length) {
                object.capabilities = [];
                for (var j = 0; j < message.capabilities.length; ++j)
                    object.capabilities[j] = options.enums === String ? $root.hermes.FswCapability[message.capabilities[j]] === undefined ? message.capabilities[j] : $root.hermes.FswCapability[message.capabilities[j]] : message.capabilities[j];
            }
            if (message.dictionary != null && message.hasOwnProperty("dictionary"))
                object.dictionary = message.dictionary;
            return object;
        };

        /**
         * Converts this Fsw to JSON.
         * @function toJSON
         * @memberof hermes.Fsw
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Fsw.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Fsw
         * @function getTypeUrl
         * @memberof hermes.Fsw
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Fsw.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Fsw";
        };

        return Fsw;
    })();

    hermes.CommandOptions = (function() {

        /**
         * Properties of a CommandOptions.
         * @memberof hermes
         * @interface ICommandOptions
         * @property {boolean|null} [noWait] Don't wait for the command to reply before resolving the command promise
         * This promise will resolve once the command is sent to the FSW.
         */

        /**
         * Constructs a new CommandOptions.
         * @memberof hermes
         * @classdesc Represents a CommandOptions.
         * @implements ICommandOptions
         * @constructor
         * @param {hermes.ICommandOptions=} [properties] Properties to set
         */
        function CommandOptions(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Don't wait for the command to reply before resolving the command promise
         * This promise will resolve once the command is sent to the FSW.
         * @member {boolean} noWait
         * @memberof hermes.CommandOptions
         * @instance
         */
        CommandOptions.prototype.noWait = false;

        /**
         * Creates a new CommandOptions instance using the specified properties.
         * @function create
         * @memberof hermes.CommandOptions
         * @static
         * @param {hermes.ICommandOptions=} [properties] Properties to set
         * @returns {hermes.CommandOptions} CommandOptions instance
         */
        CommandOptions.create = function create(properties) {
            return new CommandOptions(properties);
        };

        /**
         * Encodes the specified CommandOptions message. Does not implicitly {@link hermes.CommandOptions.verify|verify} messages.
         * @function encode
         * @memberof hermes.CommandOptions
         * @static
         * @param {hermes.ICommandOptions} message CommandOptions message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommandOptions.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.noWait != null && Object.hasOwnProperty.call(message, "noWait"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.noWait);
            return writer;
        };

        /**
         * Encodes the specified CommandOptions message, length delimited. Does not implicitly {@link hermes.CommandOptions.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.CommandOptions
         * @static
         * @param {hermes.ICommandOptions} message CommandOptions message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommandOptions.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommandOptions message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.CommandOptions
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.CommandOptions} CommandOptions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommandOptions.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.CommandOptions();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.noWait = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommandOptions message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.CommandOptions
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.CommandOptions} CommandOptions
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommandOptions.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommandOptions message.
         * @function verify
         * @memberof hermes.CommandOptions
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommandOptions.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.noWait != null && message.hasOwnProperty("noWait"))
                if (typeof message.noWait !== "boolean")
                    return "noWait: boolean expected";
            return null;
        };

        /**
         * Creates a CommandOptions message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.CommandOptions
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.CommandOptions} CommandOptions
         */
        CommandOptions.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.CommandOptions)
                return object;
            var message = new $root.hermes.CommandOptions();
            if (object.noWait != null)
                message.noWait = Boolean(object.noWait);
            return message;
        };

        /**
         * Creates a plain object from a CommandOptions message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.CommandOptions
         * @static
         * @param {hermes.CommandOptions} message CommandOptions
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommandOptions.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.noWait = false;
            if (message.noWait != null && message.hasOwnProperty("noWait"))
                object.noWait = message.noWait;
            return object;
        };

        /**
         * Converts this CommandOptions to JSON.
         * @function toJSON
         * @memberof hermes.CommandOptions
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommandOptions.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CommandOptions
         * @function getTypeUrl
         * @memberof hermes.CommandOptions
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CommandOptions.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.CommandOptions";
        };

        return CommandOptions;
    })();

    hermes.CommandValue = (function() {

        /**
         * Properties of a CommandValue.
         * @memberof hermes
         * @interface ICommandValue
         * @property {hermes.ICommandDef|null} [def] CommandValue def
         * @property {Array.<hermes.IValue>|null} [args] CommandValue args
         * @property {hermes.ICommandOptions|null} [options] CommandValue options
         * @property {Object.<string,string>|null} [metadata] CommandValue metadata
         */

        /**
         * Constructs a new CommandValue.
         * @memberof hermes
         * @classdesc Represents a CommandValue.
         * @implements ICommandValue
         * @constructor
         * @param {hermes.ICommandValue=} [properties] Properties to set
         */
        function CommandValue(properties) {
            this.args = [];
            this.metadata = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommandValue def.
         * @member {hermes.ICommandDef|null|undefined} def
         * @memberof hermes.CommandValue
         * @instance
         */
        CommandValue.prototype.def = null;

        /**
         * CommandValue args.
         * @member {Array.<hermes.IValue>} args
         * @memberof hermes.CommandValue
         * @instance
         */
        CommandValue.prototype.args = $util.emptyArray;

        /**
         * CommandValue options.
         * @member {hermes.ICommandOptions|null|undefined} options
         * @memberof hermes.CommandValue
         * @instance
         */
        CommandValue.prototype.options = null;

        /**
         * CommandValue metadata.
         * @member {Object.<string,string>} metadata
         * @memberof hermes.CommandValue
         * @instance
         */
        CommandValue.prototype.metadata = $util.emptyObject;

        /**
         * Creates a new CommandValue instance using the specified properties.
         * @function create
         * @memberof hermes.CommandValue
         * @static
         * @param {hermes.ICommandValue=} [properties] Properties to set
         * @returns {hermes.CommandValue} CommandValue instance
         */
        CommandValue.create = function create(properties) {
            return new CommandValue(properties);
        };

        /**
         * Encodes the specified CommandValue message. Does not implicitly {@link hermes.CommandValue.verify|verify} messages.
         * @function encode
         * @memberof hermes.CommandValue
         * @static
         * @param {hermes.ICommandValue} message CommandValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommandValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.def != null && Object.hasOwnProperty.call(message, "def"))
                $root.hermes.CommandDef.encode(message.def, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.args != null && message.args.length)
                for (var i = 0; i < message.args.length; ++i)
                    $root.hermes.Value.encode(message.args[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.options != null && Object.hasOwnProperty.call(message, "options"))
                $root.hermes.CommandOptions.encode(message.options, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CommandValue message, length delimited. Does not implicitly {@link hermes.CommandValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.CommandValue
         * @static
         * @param {hermes.ICommandValue} message CommandValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommandValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommandValue message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.CommandValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.CommandValue} CommandValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommandValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.CommandValue(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.def = $root.hermes.CommandDef.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.args && message.args.length))
                            message.args = [];
                        message.args.push($root.hermes.Value.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.options = $root.hermes.CommandOptions.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.metadata[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommandValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.CommandValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.CommandValue} CommandValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommandValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommandValue message.
         * @function verify
         * @memberof hermes.CommandValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommandValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.def != null && message.hasOwnProperty("def")) {
                var error = $root.hermes.CommandDef.verify(message.def);
                if (error)
                    return "def." + error;
            }
            if (message.args != null && message.hasOwnProperty("args")) {
                if (!Array.isArray(message.args))
                    return "args: array expected";
                for (var i = 0; i < message.args.length; ++i) {
                    var error = $root.hermes.Value.verify(message.args[i]);
                    if (error)
                        return "args." + error;
                }
            }
            if (message.options != null && message.hasOwnProperty("options")) {
                var error = $root.hermes.CommandOptions.verify(message.options);
                if (error)
                    return "options." + error;
            }
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
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
         * Creates a CommandValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.CommandValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.CommandValue} CommandValue
         */
        CommandValue.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.CommandValue)
                return object;
            var message = new $root.hermes.CommandValue();
            if (object.def != null) {
                if (typeof object.def !== "object")
                    throw TypeError(".hermes.CommandValue.def: object expected");
                message.def = $root.hermes.CommandDef.fromObject(object.def);
            }
            if (object.args) {
                if (!Array.isArray(object.args))
                    throw TypeError(".hermes.CommandValue.args: array expected");
                message.args = [];
                for (var i = 0; i < object.args.length; ++i) {
                    if (typeof object.args[i] !== "object")
                        throw TypeError(".hermes.CommandValue.args: object expected");
                    message.args[i] = $root.hermes.Value.fromObject(object.args[i]);
                }
            }
            if (object.options != null) {
                if (typeof object.options !== "object")
                    throw TypeError(".hermes.CommandValue.options: object expected");
                message.options = $root.hermes.CommandOptions.fromObject(object.options);
            }
            if (object.metadata) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.CommandValue.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from a CommandValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.CommandValue
         * @static
         * @param {hermes.CommandValue} message CommandValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommandValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.args = [];
            if (options.objects || options.defaults)
                object.metadata = {};
            if (options.defaults) {
                object.def = null;
                object.options = null;
            }
            if (message.def != null && message.hasOwnProperty("def"))
                object.def = $root.hermes.CommandDef.toObject(message.def, options);
            if (message.args && message.args.length) {
                object.args = [];
                for (var j = 0; j < message.args.length; ++j)
                    object.args[j] = $root.hermes.Value.toObject(message.args[j], options);
            }
            if (message.options != null && message.hasOwnProperty("options"))
                object.options = $root.hermes.CommandOptions.toObject(message.options, options);
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this CommandValue to JSON.
         * @function toJSON
         * @memberof hermes.CommandValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommandValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CommandValue
         * @function getTypeUrl
         * @memberof hermes.CommandValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CommandValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.CommandValue";
        };

        return CommandValue;
    })();

    hermes.RawCommandValue = (function() {

        /**
         * Properties of a RawCommandValue.
         * @memberof hermes
         * @interface IRawCommandValue
         * @property {string|null} [command] RawCommandValue command
         * @property {hermes.ICommandOptions|null} [options] RawCommandValue options
         * @property {Object.<string,string>|null} [metadata] RawCommandValue metadata
         */

        /**
         * Constructs a new RawCommandValue.
         * @memberof hermes
         * @classdesc RawCommandValue is meant for commanding FSWs from clients that do not parse
         * the dictionary and command fully. This is useful for thin clients that will
         * rely on the backend to perform type checks.
         * @implements IRawCommandValue
         * @constructor
         * @param {hermes.IRawCommandValue=} [properties] Properties to set
         */
        function RawCommandValue(properties) {
            this.metadata = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RawCommandValue command.
         * @member {string} command
         * @memberof hermes.RawCommandValue
         * @instance
         */
        RawCommandValue.prototype.command = "";

        /**
         * RawCommandValue options.
         * @member {hermes.ICommandOptions|null|undefined} options
         * @memberof hermes.RawCommandValue
         * @instance
         */
        RawCommandValue.prototype.options = null;

        /**
         * RawCommandValue metadata.
         * @member {Object.<string,string>} metadata
         * @memberof hermes.RawCommandValue
         * @instance
         */
        RawCommandValue.prototype.metadata = $util.emptyObject;

        /**
         * Creates a new RawCommandValue instance using the specified properties.
         * @function create
         * @memberof hermes.RawCommandValue
         * @static
         * @param {hermes.IRawCommandValue=} [properties] Properties to set
         * @returns {hermes.RawCommandValue} RawCommandValue instance
         */
        RawCommandValue.create = function create(properties) {
            return new RawCommandValue(properties);
        };

        /**
         * Encodes the specified RawCommandValue message. Does not implicitly {@link hermes.RawCommandValue.verify|verify} messages.
         * @function encode
         * @memberof hermes.RawCommandValue
         * @static
         * @param {hermes.IRawCommandValue} message RawCommandValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RawCommandValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.command);
            if (message.options != null && Object.hasOwnProperty.call(message, "options"))
                $root.hermes.CommandOptions.encode(message.options, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RawCommandValue message, length delimited. Does not implicitly {@link hermes.RawCommandValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.RawCommandValue
         * @static
         * @param {hermes.IRawCommandValue} message RawCommandValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RawCommandValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RawCommandValue message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.RawCommandValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.RawCommandValue} RawCommandValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RawCommandValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.RawCommandValue(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        message.command = reader.string();
                        break;
                    }
                case 3: {
                        message.options = $root.hermes.CommandOptions.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.metadata[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RawCommandValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.RawCommandValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.RawCommandValue} RawCommandValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RawCommandValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RawCommandValue message.
         * @function verify
         * @memberof hermes.RawCommandValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RawCommandValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.command != null && message.hasOwnProperty("command"))
                if (!$util.isString(message.command))
                    return "command: string expected";
            if (message.options != null && message.hasOwnProperty("options")) {
                var error = $root.hermes.CommandOptions.verify(message.options);
                if (error)
                    return "options." + error;
            }
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
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
         * Creates a RawCommandValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.RawCommandValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.RawCommandValue} RawCommandValue
         */
        RawCommandValue.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.RawCommandValue)
                return object;
            var message = new $root.hermes.RawCommandValue();
            if (object.command != null)
                message.command = String(object.command);
            if (object.options != null) {
                if (typeof object.options !== "object")
                    throw TypeError(".hermes.RawCommandValue.options: object expected");
                message.options = $root.hermes.CommandOptions.fromObject(object.options);
            }
            if (object.metadata) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.RawCommandValue.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from a RawCommandValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.RawCommandValue
         * @static
         * @param {hermes.RawCommandValue} message RawCommandValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RawCommandValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.metadata = {};
            if (options.defaults) {
                object.command = "";
                object.options = null;
            }
            if (message.command != null && message.hasOwnProperty("command"))
                object.command = message.command;
            if (message.options != null && message.hasOwnProperty("options"))
                object.options = $root.hermes.CommandOptions.toObject(message.options, options);
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this RawCommandValue to JSON.
         * @function toJSON
         * @memberof hermes.RawCommandValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RawCommandValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RawCommandValue
         * @function getTypeUrl
         * @memberof hermes.RawCommandValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RawCommandValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.RawCommandValue";
        };

        return RawCommandValue;
    })();

    hermes.CommandSequence = (function() {

        /**
         * Properties of a CommandSequence.
         * @memberof hermes
         * @interface ICommandSequence
         * @property {Array.<hermes.ICommandValue>|null} [commands] CommandSequence commands
         * @property {string|null} [languageName] CommandSequence languageName
         * @property {Object.<string,string>|null} [metadata] CommandSequence metadata
         */

        /**
         * Constructs a new CommandSequence.
         * @memberof hermes
         * @classdesc Represents a CommandSequence.
         * @implements ICommandSequence
         * @constructor
         * @param {hermes.ICommandSequence=} [properties] Properties to set
         */
        function CommandSequence(properties) {
            this.commands = [];
            this.metadata = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommandSequence commands.
         * @member {Array.<hermes.ICommandValue>} commands
         * @memberof hermes.CommandSequence
         * @instance
         */
        CommandSequence.prototype.commands = $util.emptyArray;

        /**
         * CommandSequence languageName.
         * @member {string} languageName
         * @memberof hermes.CommandSequence
         * @instance
         */
        CommandSequence.prototype.languageName = "";

        /**
         * CommandSequence metadata.
         * @member {Object.<string,string>} metadata
         * @memberof hermes.CommandSequence
         * @instance
         */
        CommandSequence.prototype.metadata = $util.emptyObject;

        /**
         * Creates a new CommandSequence instance using the specified properties.
         * @function create
         * @memberof hermes.CommandSequence
         * @static
         * @param {hermes.ICommandSequence=} [properties] Properties to set
         * @returns {hermes.CommandSequence} CommandSequence instance
         */
        CommandSequence.create = function create(properties) {
            return new CommandSequence(properties);
        };

        /**
         * Encodes the specified CommandSequence message. Does not implicitly {@link hermes.CommandSequence.verify|verify} messages.
         * @function encode
         * @memberof hermes.CommandSequence
         * @static
         * @param {hermes.ICommandSequence} message CommandSequence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommandSequence.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.commands != null && message.commands.length)
                for (var i = 0; i < message.commands.length; ++i)
                    $root.hermes.CommandValue.encode(message.commands[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.languageName != null && Object.hasOwnProperty.call(message, "languageName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.languageName);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CommandSequence message, length delimited. Does not implicitly {@link hermes.CommandSequence.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.CommandSequence
         * @static
         * @param {hermes.ICommandSequence} message CommandSequence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommandSequence.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommandSequence message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.CommandSequence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.CommandSequence} CommandSequence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommandSequence.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.CommandSequence(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.commands && message.commands.length))
                            message.commands = [];
                        message.commands.push($root.hermes.CommandValue.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.languageName = reader.string();
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.metadata[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommandSequence message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.CommandSequence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.CommandSequence} CommandSequence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommandSequence.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommandSequence message.
         * @function verify
         * @memberof hermes.CommandSequence
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommandSequence.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.commands != null && message.hasOwnProperty("commands")) {
                if (!Array.isArray(message.commands))
                    return "commands: array expected";
                for (var i = 0; i < message.commands.length; ++i) {
                    var error = $root.hermes.CommandValue.verify(message.commands[i]);
                    if (error)
                        return "commands." + error;
                }
            }
            if (message.languageName != null && message.hasOwnProperty("languageName"))
                if (!$util.isString(message.languageName))
                    return "languageName: string expected";
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
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
         * Creates a CommandSequence message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.CommandSequence
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.CommandSequence} CommandSequence
         */
        CommandSequence.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.CommandSequence)
                return object;
            var message = new $root.hermes.CommandSequence();
            if (object.commands) {
                if (!Array.isArray(object.commands))
                    throw TypeError(".hermes.CommandSequence.commands: array expected");
                message.commands = [];
                for (var i = 0; i < object.commands.length; ++i) {
                    if (typeof object.commands[i] !== "object")
                        throw TypeError(".hermes.CommandSequence.commands: object expected");
                    message.commands[i] = $root.hermes.CommandValue.fromObject(object.commands[i]);
                }
            }
            if (object.languageName != null)
                message.languageName = String(object.languageName);
            if (object.metadata) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.CommandSequence.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from a CommandSequence message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.CommandSequence
         * @static
         * @param {hermes.CommandSequence} message CommandSequence
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommandSequence.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.commands = [];
            if (options.objects || options.defaults)
                object.metadata = {};
            if (options.defaults)
                object.languageName = "";
            if (message.commands && message.commands.length) {
                object.commands = [];
                for (var j = 0; j < message.commands.length; ++j)
                    object.commands[j] = $root.hermes.CommandValue.toObject(message.commands[j], options);
            }
            if (message.languageName != null && message.hasOwnProperty("languageName"))
                object.languageName = message.languageName;
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this CommandSequence to JSON.
         * @function toJSON
         * @memberof hermes.CommandSequence
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommandSequence.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CommandSequence
         * @function getTypeUrl
         * @memberof hermes.CommandSequence
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CommandSequence.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.CommandSequence";
        };

        return CommandSequence;
    })();

    hermes.RawCommandSequence = (function() {

        /**
         * Properties of a RawCommandSequence.
         * @memberof hermes
         * @interface IRawCommandSequence
         * @property {string|null} [sequence] RawCommandSequence sequence
         * @property {string|null} [languageName] RawCommandSequence languageName
         * @property {Object.<string,string>|null} [metadata] RawCommandSequence metadata
         * @property {string|null} [lineCommentPrefix] RawCommandSequence lineCommentPrefix
         */

        /**
         * Constructs a new RawCommandSequence.
         * @memberof hermes
         * @classdesc Represents a RawCommandSequence.
         * @implements IRawCommandSequence
         * @constructor
         * @param {hermes.IRawCommandSequence=} [properties] Properties to set
         */
        function RawCommandSequence(properties) {
            this.metadata = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RawCommandSequence sequence.
         * @member {string} sequence
         * @memberof hermes.RawCommandSequence
         * @instance
         */
        RawCommandSequence.prototype.sequence = "";

        /**
         * RawCommandSequence languageName.
         * @member {string} languageName
         * @memberof hermes.RawCommandSequence
         * @instance
         */
        RawCommandSequence.prototype.languageName = "";

        /**
         * RawCommandSequence metadata.
         * @member {Object.<string,string>} metadata
         * @memberof hermes.RawCommandSequence
         * @instance
         */
        RawCommandSequence.prototype.metadata = $util.emptyObject;

        /**
         * RawCommandSequence lineCommentPrefix.
         * @member {string} lineCommentPrefix
         * @memberof hermes.RawCommandSequence
         * @instance
         */
        RawCommandSequence.prototype.lineCommentPrefix = "";

        /**
         * Creates a new RawCommandSequence instance using the specified properties.
         * @function create
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {hermes.IRawCommandSequence=} [properties] Properties to set
         * @returns {hermes.RawCommandSequence} RawCommandSequence instance
         */
        RawCommandSequence.create = function create(properties) {
            return new RawCommandSequence(properties);
        };

        /**
         * Encodes the specified RawCommandSequence message. Does not implicitly {@link hermes.RawCommandSequence.verify|verify} messages.
         * @function encode
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {hermes.IRawCommandSequence} message RawCommandSequence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RawCommandSequence.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sequence != null && Object.hasOwnProperty.call(message, "sequence"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sequence);
            if (message.languageName != null && Object.hasOwnProperty.call(message, "languageName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.languageName);
            if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
            if (message.lineCommentPrefix != null && Object.hasOwnProperty.call(message, "lineCommentPrefix"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.lineCommentPrefix);
            return writer;
        };

        /**
         * Encodes the specified RawCommandSequence message, length delimited. Does not implicitly {@link hermes.RawCommandSequence.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {hermes.IRawCommandSequence} message RawCommandSequence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RawCommandSequence.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RawCommandSequence message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.RawCommandSequence} RawCommandSequence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RawCommandSequence.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.RawCommandSequence(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.sequence = reader.string();
                        break;
                    }
                case 2: {
                        message.languageName = reader.string();
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
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.metadata[key] = value;
                        break;
                    }
                case 4: {
                        message.lineCommentPrefix = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RawCommandSequence message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.RawCommandSequence} RawCommandSequence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RawCommandSequence.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RawCommandSequence message.
         * @function verify
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RawCommandSequence.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (!$util.isString(message.sequence))
                    return "sequence: string expected";
            if (message.languageName != null && message.hasOwnProperty("languageName"))
                if (!$util.isString(message.languageName))
                    return "languageName: string expected";
            if (message.metadata != null && message.hasOwnProperty("metadata")) {
                if (!$util.isObject(message.metadata))
                    return "metadata: object expected";
                var key = Object.keys(message.metadata);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.metadata[key[i]]))
                        return "metadata: string{k:string} expected";
            }
            if (message.lineCommentPrefix != null && message.hasOwnProperty("lineCommentPrefix"))
                if (!$util.isString(message.lineCommentPrefix))
                    return "lineCommentPrefix: string expected";
            return null;
        };

        /**
         * Creates a RawCommandSequence message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.RawCommandSequence} RawCommandSequence
         */
        RawCommandSequence.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.RawCommandSequence)
                return object;
            var message = new $root.hermes.RawCommandSequence();
            if (object.sequence != null)
                message.sequence = String(object.sequence);
            if (object.languageName != null)
                message.languageName = String(object.languageName);
            if (object.metadata) {
                if (typeof object.metadata !== "object")
                    throw TypeError(".hermes.RawCommandSequence.metadata: object expected");
                message.metadata = {};
                for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                    message.metadata[keys[i]] = String(object.metadata[keys[i]]);
            }
            if (object.lineCommentPrefix != null)
                message.lineCommentPrefix = String(object.lineCommentPrefix);
            return message;
        };

        /**
         * Creates a plain object from a RawCommandSequence message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {hermes.RawCommandSequence} message RawCommandSequence
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RawCommandSequence.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.metadata = {};
            if (options.defaults) {
                object.sequence = "";
                object.languageName = "";
                object.lineCommentPrefix = "";
            }
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                object.sequence = message.sequence;
            if (message.languageName != null && message.hasOwnProperty("languageName"))
                object.languageName = message.languageName;
            var keys2;
            if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                object.metadata = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.metadata[keys2[j]] = message.metadata[keys2[j]];
            }
            if (message.lineCommentPrefix != null && message.hasOwnProperty("lineCommentPrefix"))
                object.lineCommentPrefix = message.lineCommentPrefix;
            return object;
        };

        /**
         * Converts this RawCommandSequence to JSON.
         * @function toJSON
         * @memberof hermes.RawCommandSequence
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RawCommandSequence.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RawCommandSequence
         * @function getTypeUrl
         * @memberof hermes.RawCommandSequence
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RawCommandSequence.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.RawCommandSequence";
        };

        return RawCommandSequence;
    })();

    hermes.RequestValue = (function() {

        /**
         * Properties of a RequestValue.
         * @memberof hermes
         * @interface IRequestValue
         * @property {string|null} [kind] RequestValue kind
         * @property {Uint8Array|null} [data] RequestValue data
         */

        /**
         * Constructs a new RequestValue.
         * @memberof hermes
         * @classdesc FSW Requests are non-dictionary defined items. These are connection
         * specific commands meant to be exposed by custom UI in the frontend.
         * @implements IRequestValue
         * @constructor
         * @param {hermes.IRequestValue=} [properties] Properties to set
         */
        function RequestValue(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RequestValue kind.
         * @member {string} kind
         * @memberof hermes.RequestValue
         * @instance
         */
        RequestValue.prototype.kind = "";

        /**
         * RequestValue data.
         * @member {Uint8Array} data
         * @memberof hermes.RequestValue
         * @instance
         */
        RequestValue.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new RequestValue instance using the specified properties.
         * @function create
         * @memberof hermes.RequestValue
         * @static
         * @param {hermes.IRequestValue=} [properties] Properties to set
         * @returns {hermes.RequestValue} RequestValue instance
         */
        RequestValue.create = function create(properties) {
            return new RequestValue(properties);
        };

        /**
         * Encodes the specified RequestValue message. Does not implicitly {@link hermes.RequestValue.verify|verify} messages.
         * @function encode
         * @memberof hermes.RequestValue
         * @static
         * @param {hermes.IRequestValue} message RequestValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestValue.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.kind);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified RequestValue message, length delimited. Does not implicitly {@link hermes.RequestValue.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.RequestValue
         * @static
         * @param {hermes.IRequestValue} message RequestValue message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestValue.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RequestValue message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.RequestValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.RequestValue} RequestValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestValue.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.RequestValue();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.kind = reader.string();
                        break;
                    }
                case 2: {
                        message.data = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RequestValue message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.RequestValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.RequestValue} RequestValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestValue.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RequestValue message.
         * @function verify
         * @memberof hermes.RequestValue
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RequestValue.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.kind != null && message.hasOwnProperty("kind"))
                if (!$util.isString(message.kind))
                    return "kind: string expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            return null;
        };

        /**
         * Creates a RequestValue message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.RequestValue
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.RequestValue} RequestValue
         */
        RequestValue.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.RequestValue)
                return object;
            var message = new $root.hermes.RequestValue();
            if (object.kind != null)
                message.kind = String(object.kind);
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length >= 0)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from a RequestValue message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.RequestValue
         * @static
         * @param {hermes.RequestValue} message RequestValue
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RequestValue.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.kind = "";
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            }
            if (message.kind != null && message.hasOwnProperty("kind"))
                object.kind = message.kind;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            return object;
        };

        /**
         * Converts this RequestValue to JSON.
         * @function toJSON
         * @memberof hermes.RequestValue
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RequestValue.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RequestValue
         * @function getTypeUrl
         * @memberof hermes.RequestValue
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RequestValue.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.RequestValue";
        };

        return RequestValue;
    })();

    hermes.RequestReply = (function() {

        /**
         * Properties of a RequestReply.
         * @memberof hermes
         * @interface IRequestReply
         * @property {Uint8Array|null} [data] RequestReply data
         */

        /**
         * Constructs a new RequestReply.
         * @memberof hermes
         * @classdesc Represents a RequestReply.
         * @implements IRequestReply
         * @constructor
         * @param {hermes.IRequestReply=} [properties] Properties to set
         */
        function RequestReply(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RequestReply data.
         * @member {Uint8Array} data
         * @memberof hermes.RequestReply
         * @instance
         */
        RequestReply.prototype.data = $util.newBuffer([]);

        /**
         * Creates a new RequestReply instance using the specified properties.
         * @function create
         * @memberof hermes.RequestReply
         * @static
         * @param {hermes.IRequestReply=} [properties] Properties to set
         * @returns {hermes.RequestReply} RequestReply instance
         */
        RequestReply.create = function create(properties) {
            return new RequestReply(properties);
        };

        /**
         * Encodes the specified RequestReply message. Does not implicitly {@link hermes.RequestReply.verify|verify} messages.
         * @function encode
         * @memberof hermes.RequestReply
         * @static
         * @param {hermes.IRequestReply} message RequestReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestReply.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
            return writer;
        };

        /**
         * Encodes the specified RequestReply message, length delimited. Does not implicitly {@link hermes.RequestReply.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.RequestReply
         * @static
         * @param {hermes.IRequestReply} message RequestReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestReply.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RequestReply message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.RequestReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.RequestReply} RequestReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestReply.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.RequestReply();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.data = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RequestReply message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.RequestReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.RequestReply} RequestReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestReply.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RequestReply message.
         * @function verify
         * @memberof hermes.RequestReply
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RequestReply.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            return null;
        };

        /**
         * Creates a RequestReply message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.RequestReply
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.RequestReply} RequestReply
         */
        RequestReply.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.RequestReply)
                return object;
            var message = new $root.hermes.RequestReply();
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length >= 0)
                    message.data = object.data;
            return message;
        };

        /**
         * Creates a plain object from a RequestReply message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.RequestReply
         * @static
         * @param {hermes.RequestReply} message RequestReply
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RequestReply.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            return object;
        };

        /**
         * Converts this RequestReply to JSON.
         * @function toJSON
         * @memberof hermes.RequestReply
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RequestReply.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RequestReply
         * @function getTypeUrl
         * @memberof hermes.RequestReply
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RequestReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.RequestReply";
        };

        return RequestReply;
    })();

    hermes.Id = (function() {

        /**
         * Properties of an Id.
         * @memberof hermes
         * @interface IId
         * @property {string|null} [id] Id id
         */

        /**
         * Constructs a new Id.
         * @memberof hermes
         * @classdesc Represents an Id.
         * @implements IId
         * @constructor
         * @param {hermes.IId=} [properties] Properties to set
         */
        function Id(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Id id.
         * @member {string} id
         * @memberof hermes.Id
         * @instance
         */
        Id.prototype.id = "";

        /**
         * Creates a new Id instance using the specified properties.
         * @function create
         * @memberof hermes.Id
         * @static
         * @param {hermes.IId=} [properties] Properties to set
         * @returns {hermes.Id} Id instance
         */
        Id.create = function create(properties) {
            return new Id(properties);
        };

        /**
         * Encodes the specified Id message. Does not implicitly {@link hermes.Id.verify|verify} messages.
         * @function encode
         * @memberof hermes.Id
         * @static
         * @param {hermes.IId} message Id message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Id.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            return writer;
        };

        /**
         * Encodes the specified Id message, length delimited. Does not implicitly {@link hermes.Id.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Id
         * @static
         * @param {hermes.IId} message Id message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Id.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Id message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Id
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Id} Id
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Id.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Id();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Id message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Id
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Id} Id
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Id.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Id message.
         * @function verify
         * @memberof hermes.Id
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Id.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        /**
         * Creates an Id message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Id
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Id} Id
         */
        Id.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Id)
                return object;
            var message = new $root.hermes.Id();
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        /**
         * Creates a plain object from an Id message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Id
         * @static
         * @param {hermes.Id} message Id
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Id.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.id = "";
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this Id to JSON.
         * @function toJSON
         * @memberof hermes.Id
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Id.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Id
         * @function getTypeUrl
         * @memberof hermes.Id
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Id.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Id";
        };

        return Id;
    })();

    hermes.FswList = (function() {

        /**
         * Properties of a FswList.
         * @memberof hermes
         * @interface IFswList
         * @property {Array.<hermes.IFsw>|null} [all] FswList all
         */

        /**
         * Constructs a new FswList.
         * @memberof hermes
         * @classdesc Represents a FswList.
         * @implements IFswList
         * @constructor
         * @param {hermes.IFswList=} [properties] Properties to set
         */
        function FswList(properties) {
            this.all = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FswList all.
         * @member {Array.<hermes.IFsw>} all
         * @memberof hermes.FswList
         * @instance
         */
        FswList.prototype.all = $util.emptyArray;

        /**
         * Creates a new FswList instance using the specified properties.
         * @function create
         * @memberof hermes.FswList
         * @static
         * @param {hermes.IFswList=} [properties] Properties to set
         * @returns {hermes.FswList} FswList instance
         */
        FswList.create = function create(properties) {
            return new FswList(properties);
        };

        /**
         * Encodes the specified FswList message. Does not implicitly {@link hermes.FswList.verify|verify} messages.
         * @function encode
         * @memberof hermes.FswList
         * @static
         * @param {hermes.IFswList} message FswList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FswList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.all != null && message.all.length)
                for (var i = 0; i < message.all.length; ++i)
                    $root.hermes.Fsw.encode(message.all[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FswList message, length delimited. Does not implicitly {@link hermes.FswList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FswList
         * @static
         * @param {hermes.IFswList} message FswList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FswList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FswList message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FswList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FswList} FswList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FswList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FswList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.all && message.all.length))
                            message.all = [];
                        message.all.push($root.hermes.Fsw.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FswList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FswList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FswList} FswList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FswList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FswList message.
         * @function verify
         * @memberof hermes.FswList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FswList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.all != null && message.hasOwnProperty("all")) {
                if (!Array.isArray(message.all))
                    return "all: array expected";
                for (var i = 0; i < message.all.length; ++i) {
                    var error = $root.hermes.Fsw.verify(message.all[i]);
                    if (error)
                        return "all." + error;
                }
            }
            return null;
        };

        /**
         * Creates a FswList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FswList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FswList} FswList
         */
        FswList.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FswList)
                return object;
            var message = new $root.hermes.FswList();
            if (object.all) {
                if (!Array.isArray(object.all))
                    throw TypeError(".hermes.FswList.all: array expected");
                message.all = [];
                for (var i = 0; i < object.all.length; ++i) {
                    if (typeof object.all[i] !== "object")
                        throw TypeError(".hermes.FswList.all: object expected");
                    message.all[i] = $root.hermes.Fsw.fromObject(object.all[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a FswList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FswList
         * @static
         * @param {hermes.FswList} message FswList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FswList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.all = [];
            if (message.all && message.all.length) {
                object.all = [];
                for (var j = 0; j < message.all.length; ++j)
                    object.all[j] = $root.hermes.Fsw.toObject(message.all[j], options);
            }
            return object;
        };

        /**
         * Converts this FswList to JSON.
         * @function toJSON
         * @memberof hermes.FswList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FswList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FswList
         * @function getTypeUrl
         * @memberof hermes.FswList
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FswList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FswList";
        };

        return FswList;
    })();

    hermes.Reply = (function() {

        /**
         * Properties of a Reply.
         * @memberof hermes
         * @interface IReply
         * @property {boolean|null} [success] Reply success
         */

        /**
         * Constructs a new Reply.
         * @memberof hermes
         * @classdesc Represents a Reply.
         * @implements IReply
         * @constructor
         * @param {hermes.IReply=} [properties] Properties to set
         */
        function Reply(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Reply success.
         * @member {boolean} success
         * @memberof hermes.Reply
         * @instance
         */
        Reply.prototype.success = false;

        /**
         * Creates a new Reply instance using the specified properties.
         * @function create
         * @memberof hermes.Reply
         * @static
         * @param {hermes.IReply=} [properties] Properties to set
         * @returns {hermes.Reply} Reply instance
         */
        Reply.create = function create(properties) {
            return new Reply(properties);
        };

        /**
         * Encodes the specified Reply message. Does not implicitly {@link hermes.Reply.verify|verify} messages.
         * @function encode
         * @memberof hermes.Reply
         * @static
         * @param {hermes.IReply} message Reply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Reply.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            return writer;
        };

        /**
         * Encodes the specified Reply message, length delimited. Does not implicitly {@link hermes.Reply.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Reply
         * @static
         * @param {hermes.IReply} message Reply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Reply.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Reply message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Reply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Reply} Reply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Reply.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Reply();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Reply message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Reply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Reply} Reply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Reply.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Reply message.
         * @function verify
         * @memberof hermes.Reply
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Reply.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            return null;
        };

        /**
         * Creates a Reply message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Reply
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Reply} Reply
         */
        Reply.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Reply)
                return object;
            var message = new $root.hermes.Reply();
            if (object.success != null)
                message.success = Boolean(object.success);
            return message;
        };

        /**
         * Creates a plain object from a Reply message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Reply
         * @static
         * @param {hermes.Reply} message Reply
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Reply.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.success = false;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            return object;
        };

        /**
         * Converts this Reply to JSON.
         * @function toJSON
         * @memberof hermes.Reply
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Reply.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Reply
         * @function getTypeUrl
         * @memberof hermes.Reply
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Reply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Reply";
        };

        return Reply;
    })();

    hermes.SequenceReply = (function() {

        /**
         * Properties of a SequenceReply.
         * @memberof hermes
         * @interface ISequenceReply
         * @property {boolean|null} [success] SequenceReply success
         * @property {number|null} [commandIndex] SequenceReply commandIndex
         */

        /**
         * Constructs a new SequenceReply.
         * @memberof hermes
         * @classdesc Represents a SequenceReply.
         * @implements ISequenceReply
         * @constructor
         * @param {hermes.ISequenceReply=} [properties] Properties to set
         */
        function SequenceReply(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SequenceReply success.
         * @member {boolean} success
         * @memberof hermes.SequenceReply
         * @instance
         */
        SequenceReply.prototype.success = false;

        /**
         * SequenceReply commandIndex.
         * @member {number} commandIndex
         * @memberof hermes.SequenceReply
         * @instance
         */
        SequenceReply.prototype.commandIndex = 0;

        /**
         * Creates a new SequenceReply instance using the specified properties.
         * @function create
         * @memberof hermes.SequenceReply
         * @static
         * @param {hermes.ISequenceReply=} [properties] Properties to set
         * @returns {hermes.SequenceReply} SequenceReply instance
         */
        SequenceReply.create = function create(properties) {
            return new SequenceReply(properties);
        };

        /**
         * Encodes the specified SequenceReply message. Does not implicitly {@link hermes.SequenceReply.verify|verify} messages.
         * @function encode
         * @memberof hermes.SequenceReply
         * @static
         * @param {hermes.ISequenceReply} message SequenceReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SequenceReply.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.commandIndex != null && Object.hasOwnProperty.call(message, "commandIndex"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.commandIndex);
            return writer;
        };

        /**
         * Encodes the specified SequenceReply message, length delimited. Does not implicitly {@link hermes.SequenceReply.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.SequenceReply
         * @static
         * @param {hermes.ISequenceReply} message SequenceReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SequenceReply.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SequenceReply message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.SequenceReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.SequenceReply} SequenceReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SequenceReply.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.SequenceReply();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.commandIndex = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SequenceReply message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.SequenceReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.SequenceReply} SequenceReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SequenceReply.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SequenceReply message.
         * @function verify
         * @memberof hermes.SequenceReply
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SequenceReply.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.commandIndex != null && message.hasOwnProperty("commandIndex"))
                if (!$util.isInteger(message.commandIndex))
                    return "commandIndex: integer expected";
            return null;
        };

        /**
         * Creates a SequenceReply message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.SequenceReply
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.SequenceReply} SequenceReply
         */
        SequenceReply.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.SequenceReply)
                return object;
            var message = new $root.hermes.SequenceReply();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.commandIndex != null)
                message.commandIndex = object.commandIndex | 0;
            return message;
        };

        /**
         * Creates a plain object from a SequenceReply message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.SequenceReply
         * @static
         * @param {hermes.SequenceReply} message SequenceReply
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SequenceReply.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.success = false;
                object.commandIndex = 0;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.commandIndex != null && message.hasOwnProperty("commandIndex"))
                object.commandIndex = message.commandIndex;
            return object;
        };

        /**
         * Converts this SequenceReply to JSON.
         * @function toJSON
         * @memberof hermes.SequenceReply
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SequenceReply.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SequenceReply
         * @function getTypeUrl
         * @memberof hermes.SequenceReply
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SequenceReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.SequenceReply";
        };

        return SequenceReply;
    })();

    hermes.StatefulProfile = (function() {

        /**
         * Properties of a StatefulProfile.
         * @memberof hermes
         * @interface IStatefulProfile
         * @property {hermes.IProfile|null} [value] StatefulProfile value
         * @property {hermes.ProfileState|null} [state] StatefulProfile state
         * @property {boolean|null} [runtimeOnly] StatefulProfile runtimeOnly
         */

        /**
         * Constructs a new StatefulProfile.
         * @memberof hermes
         * @classdesc Represents a StatefulProfile.
         * @implements IStatefulProfile
         * @constructor
         * @param {hermes.IStatefulProfile=} [properties] Properties to set
         */
        function StatefulProfile(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StatefulProfile value.
         * @member {hermes.IProfile|null|undefined} value
         * @memberof hermes.StatefulProfile
         * @instance
         */
        StatefulProfile.prototype.value = null;

        /**
         * StatefulProfile state.
         * @member {hermes.ProfileState} state
         * @memberof hermes.StatefulProfile
         * @instance
         */
        StatefulProfile.prototype.state = 0;

        /**
         * StatefulProfile runtimeOnly.
         * @member {boolean} runtimeOnly
         * @memberof hermes.StatefulProfile
         * @instance
         */
        StatefulProfile.prototype.runtimeOnly = false;

        /**
         * Creates a new StatefulProfile instance using the specified properties.
         * @function create
         * @memberof hermes.StatefulProfile
         * @static
         * @param {hermes.IStatefulProfile=} [properties] Properties to set
         * @returns {hermes.StatefulProfile} StatefulProfile instance
         */
        StatefulProfile.create = function create(properties) {
            return new StatefulProfile(properties);
        };

        /**
         * Encodes the specified StatefulProfile message. Does not implicitly {@link hermes.StatefulProfile.verify|verify} messages.
         * @function encode
         * @memberof hermes.StatefulProfile
         * @static
         * @param {hermes.IStatefulProfile} message StatefulProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatefulProfile.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                $root.hermes.Profile.encode(message.value, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.state);
            if (message.runtimeOnly != null && Object.hasOwnProperty.call(message, "runtimeOnly"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.runtimeOnly);
            return writer;
        };

        /**
         * Encodes the specified StatefulProfile message, length delimited. Does not implicitly {@link hermes.StatefulProfile.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.StatefulProfile
         * @static
         * @param {hermes.IStatefulProfile} message StatefulProfile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatefulProfile.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StatefulProfile message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.StatefulProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.StatefulProfile} StatefulProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatefulProfile.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.StatefulProfile();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.value = $root.hermes.Profile.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.state = reader.int32();
                        break;
                    }
                case 3: {
                        message.runtimeOnly = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StatefulProfile message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.StatefulProfile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.StatefulProfile} StatefulProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatefulProfile.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StatefulProfile message.
         * @function verify
         * @memberof hermes.StatefulProfile
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StatefulProfile.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value")) {
                var error = $root.hermes.Profile.verify(message.value);
                if (error)
                    return "value." + error;
            }
            if (message.state != null && message.hasOwnProperty("state"))
                switch (message.state) {
                default:
                    return "state: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.runtimeOnly != null && message.hasOwnProperty("runtimeOnly"))
                if (typeof message.runtimeOnly !== "boolean")
                    return "runtimeOnly: boolean expected";
            return null;
        };

        /**
         * Creates a StatefulProfile message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.StatefulProfile
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.StatefulProfile} StatefulProfile
         */
        StatefulProfile.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.StatefulProfile)
                return object;
            var message = new $root.hermes.StatefulProfile();
            if (object.value != null) {
                if (typeof object.value !== "object")
                    throw TypeError(".hermes.StatefulProfile.value: object expected");
                message.value = $root.hermes.Profile.fromObject(object.value);
            }
            switch (object.state) {
            default:
                if (typeof object.state === "number") {
                    message.state = object.state;
                    break;
                }
                break;
            case "PROFILE_IDLE":
            case 0:
                message.state = 0;
                break;
            case "PROFILE_CONNECTING":
            case 1:
                message.state = 1;
                break;
            case "PROFILE_ACTIVE":
            case 2:
                message.state = 2;
                break;
            case "PROFILE_DISCONNECT":
            case 3:
                message.state = 3;
                break;
            }
            if (object.runtimeOnly != null)
                message.runtimeOnly = Boolean(object.runtimeOnly);
            return message;
        };

        /**
         * Creates a plain object from a StatefulProfile message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.StatefulProfile
         * @static
         * @param {hermes.StatefulProfile} message StatefulProfile
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StatefulProfile.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.value = null;
                object.state = options.enums === String ? "PROFILE_IDLE" : 0;
                object.runtimeOnly = false;
            }
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = $root.hermes.Profile.toObject(message.value, options);
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = options.enums === String ? $root.hermes.ProfileState[message.state] === undefined ? message.state : $root.hermes.ProfileState[message.state] : message.state;
            if (message.runtimeOnly != null && message.hasOwnProperty("runtimeOnly"))
                object.runtimeOnly = message.runtimeOnly;
            return object;
        };

        /**
         * Converts this StatefulProfile to JSON.
         * @function toJSON
         * @memberof hermes.StatefulProfile
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StatefulProfile.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for StatefulProfile
         * @function getTypeUrl
         * @memberof hermes.StatefulProfile
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StatefulProfile.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.StatefulProfile";
        };

        return StatefulProfile;
    })();

    hermes.ProfileList = (function() {

        /**
         * Properties of a ProfileList.
         * @memberof hermes
         * @interface IProfileList
         * @property {Object.<string,hermes.IStatefulProfile>|null} [all] ProfileList all
         */

        /**
         * Constructs a new ProfileList.
         * @memberof hermes
         * @classdesc Represents a ProfileList.
         * @implements IProfileList
         * @constructor
         * @param {hermes.IProfileList=} [properties] Properties to set
         */
        function ProfileList(properties) {
            this.all = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProfileList all.
         * @member {Object.<string,hermes.IStatefulProfile>} all
         * @memberof hermes.ProfileList
         * @instance
         */
        ProfileList.prototype.all = $util.emptyObject;

        /**
         * Creates a new ProfileList instance using the specified properties.
         * @function create
         * @memberof hermes.ProfileList
         * @static
         * @param {hermes.IProfileList=} [properties] Properties to set
         * @returns {hermes.ProfileList} ProfileList instance
         */
        ProfileList.create = function create(properties) {
            return new ProfileList(properties);
        };

        /**
         * Encodes the specified ProfileList message. Does not implicitly {@link hermes.ProfileList.verify|verify} messages.
         * @function encode
         * @memberof hermes.ProfileList
         * @static
         * @param {hermes.IProfileList} message ProfileList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.all != null && Object.hasOwnProperty.call(message, "all"))
                for (var keys = Object.keys(message.all), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.StatefulProfile.encode(message.all[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            return writer;
        };

        /**
         * Encodes the specified ProfileList message, length delimited. Does not implicitly {@link hermes.ProfileList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ProfileList
         * @static
         * @param {hermes.IProfileList} message ProfileList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProfileList message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ProfileList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ProfileList} ProfileList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ProfileList(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (message.all === $util.emptyObject)
                            message.all = {};
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
                                value = $root.hermes.StatefulProfile.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.all[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProfileList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ProfileList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ProfileList} ProfileList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProfileList message.
         * @function verify
         * @memberof hermes.ProfileList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProfileList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.all != null && message.hasOwnProperty("all")) {
                if (!$util.isObject(message.all))
                    return "all: object expected";
                var key = Object.keys(message.all);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.StatefulProfile.verify(message.all[key[i]]);
                    if (error)
                        return "all." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ProfileList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ProfileList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ProfileList} ProfileList
         */
        ProfileList.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ProfileList)
                return object;
            var message = new $root.hermes.ProfileList();
            if (object.all) {
                if (typeof object.all !== "object")
                    throw TypeError(".hermes.ProfileList.all: object expected");
                message.all = {};
                for (var keys = Object.keys(object.all), i = 0; i < keys.length; ++i) {
                    if (typeof object.all[keys[i]] !== "object")
                        throw TypeError(".hermes.ProfileList.all: object expected");
                    message.all[keys[i]] = $root.hermes.StatefulProfile.fromObject(object.all[keys[i]]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ProfileList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ProfileList
         * @static
         * @param {hermes.ProfileList} message ProfileList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProfileList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.all = {};
            var keys2;
            if (message.all && (keys2 = Object.keys(message.all)).length) {
                object.all = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.all[keys2[j]] = $root.hermes.StatefulProfile.toObject(message.all[keys2[j]], options);
            }
            return object;
        };

        /**
         * Converts this ProfileList to JSON.
         * @function toJSON
         * @memberof hermes.ProfileList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProfileList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProfileList
         * @function getTypeUrl
         * @memberof hermes.ProfileList
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProfileList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ProfileList";
        };

        return ProfileList;
    })();

    hermes.ProfileProviderList = (function() {

        /**
         * Properties of a ProfileProviderList.
         * @memberof hermes
         * @interface IProfileProviderList
         * @property {Array.<hermes.IProfileProvider>|null} [all] ProfileProviderList all
         */

        /**
         * Constructs a new ProfileProviderList.
         * @memberof hermes
         * @classdesc Represents a ProfileProviderList.
         * @implements IProfileProviderList
         * @constructor
         * @param {hermes.IProfileProviderList=} [properties] Properties to set
         */
        function ProfileProviderList(properties) {
            this.all = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProfileProviderList all.
         * @member {Array.<hermes.IProfileProvider>} all
         * @memberof hermes.ProfileProviderList
         * @instance
         */
        ProfileProviderList.prototype.all = $util.emptyArray;

        /**
         * Creates a new ProfileProviderList instance using the specified properties.
         * @function create
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {hermes.IProfileProviderList=} [properties] Properties to set
         * @returns {hermes.ProfileProviderList} ProfileProviderList instance
         */
        ProfileProviderList.create = function create(properties) {
            return new ProfileProviderList(properties);
        };

        /**
         * Encodes the specified ProfileProviderList message. Does not implicitly {@link hermes.ProfileProviderList.verify|verify} messages.
         * @function encode
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {hermes.IProfileProviderList} message ProfileProviderList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileProviderList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.all != null && message.all.length)
                for (var i = 0; i < message.all.length; ++i)
                    $root.hermes.ProfileProvider.encode(message.all[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ProfileProviderList message, length delimited. Does not implicitly {@link hermes.ProfileProviderList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {hermes.IProfileProviderList} message ProfileProviderList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileProviderList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProfileProviderList message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ProfileProviderList} ProfileProviderList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileProviderList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ProfileProviderList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.all && message.all.length))
                            message.all = [];
                        message.all.push($root.hermes.ProfileProvider.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProfileProviderList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ProfileProviderList} ProfileProviderList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileProviderList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProfileProviderList message.
         * @function verify
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProfileProviderList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.all != null && message.hasOwnProperty("all")) {
                if (!Array.isArray(message.all))
                    return "all: array expected";
                for (var i = 0; i < message.all.length; ++i) {
                    var error = $root.hermes.ProfileProvider.verify(message.all[i]);
                    if (error)
                        return "all." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ProfileProviderList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ProfileProviderList} ProfileProviderList
         */
        ProfileProviderList.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ProfileProviderList)
                return object;
            var message = new $root.hermes.ProfileProviderList();
            if (object.all) {
                if (!Array.isArray(object.all))
                    throw TypeError(".hermes.ProfileProviderList.all: array expected");
                message.all = [];
                for (var i = 0; i < object.all.length; ++i) {
                    if (typeof object.all[i] !== "object")
                        throw TypeError(".hermes.ProfileProviderList.all: object expected");
                    message.all[i] = $root.hermes.ProfileProvider.fromObject(object.all[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a ProfileProviderList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {hermes.ProfileProviderList} message ProfileProviderList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProfileProviderList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.all = [];
            if (message.all && message.all.length) {
                object.all = [];
                for (var j = 0; j < message.all.length; ++j)
                    object.all[j] = $root.hermes.ProfileProvider.toObject(message.all[j], options);
            }
            return object;
        };

        /**
         * Converts this ProfileProviderList to JSON.
         * @function toJSON
         * @memberof hermes.ProfileProviderList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProfileProviderList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProfileProviderList
         * @function getTypeUrl
         * @memberof hermes.ProfileProviderList
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProfileProviderList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ProfileProviderList";
        };

        return ProfileProviderList;
    })();

    hermes.ProfileUpdate = (function() {

        /**
         * Properties of a ProfileUpdate.
         * @memberof hermes
         * @interface IProfileUpdate
         * @property {string|null} [id] ProfileUpdate id
         * @property {string|null} [settings] ProfileUpdate settings
         */

        /**
         * Constructs a new ProfileUpdate.
         * @memberof hermes
         * @classdesc Represents a ProfileUpdate.
         * @implements IProfileUpdate
         * @constructor
         * @param {hermes.IProfileUpdate=} [properties] Properties to set
         */
        function ProfileUpdate(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProfileUpdate id.
         * @member {string} id
         * @memberof hermes.ProfileUpdate
         * @instance
         */
        ProfileUpdate.prototype.id = "";

        /**
         * ProfileUpdate settings.
         * @member {string} settings
         * @memberof hermes.ProfileUpdate
         * @instance
         */
        ProfileUpdate.prototype.settings = "";

        /**
         * Creates a new ProfileUpdate instance using the specified properties.
         * @function create
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {hermes.IProfileUpdate=} [properties] Properties to set
         * @returns {hermes.ProfileUpdate} ProfileUpdate instance
         */
        ProfileUpdate.create = function create(properties) {
            return new ProfileUpdate(properties);
        };

        /**
         * Encodes the specified ProfileUpdate message. Does not implicitly {@link hermes.ProfileUpdate.verify|verify} messages.
         * @function encode
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {hermes.IProfileUpdate} message ProfileUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.settings != null && Object.hasOwnProperty.call(message, "settings"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.settings);
            return writer;
        };

        /**
         * Encodes the specified ProfileUpdate message, length delimited. Does not implicitly {@link hermes.ProfileUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {hermes.IProfileUpdate} message ProfileUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProfileUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ProfileUpdate} ProfileUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileUpdate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ProfileUpdate();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.settings = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProfileUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ProfileUpdate} ProfileUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProfileUpdate message.
         * @function verify
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProfileUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.settings != null && message.hasOwnProperty("settings"))
                if (!$util.isString(message.settings))
                    return "settings: string expected";
            return null;
        };

        /**
         * Creates a ProfileUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ProfileUpdate} ProfileUpdate
         */
        ProfileUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ProfileUpdate)
                return object;
            var message = new $root.hermes.ProfileUpdate();
            if (object.id != null)
                message.id = String(object.id);
            if (object.settings != null)
                message.settings = String(object.settings);
            return message;
        };

        /**
         * Creates a plain object from a ProfileUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {hermes.ProfileUpdate} message ProfileUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProfileUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.settings = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.settings != null && message.hasOwnProperty("settings"))
                object.settings = message.settings;
            return object;
        };

        /**
         * Converts this ProfileUpdate to JSON.
         * @function toJSON
         * @memberof hermes.ProfileUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProfileUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProfileUpdate
         * @function getTypeUrl
         * @memberof hermes.ProfileUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProfileUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ProfileUpdate";
        };

        return ProfileUpdate;
    })();

    hermes.DictionaryList = (function() {

        /**
         * Properties of a DictionaryList.
         * @memberof hermes
         * @interface IDictionaryList
         * @property {Object.<string,hermes.IDictionaryHead>|null} [all] DictionaryList all
         */

        /**
         * Constructs a new DictionaryList.
         * @memberof hermes
         * @classdesc Represents a DictionaryList.
         * @implements IDictionaryList
         * @constructor
         * @param {hermes.IDictionaryList=} [properties] Properties to set
         */
        function DictionaryList(properties) {
            this.all = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DictionaryList all.
         * @member {Object.<string,hermes.IDictionaryHead>} all
         * @memberof hermes.DictionaryList
         * @instance
         */
        DictionaryList.prototype.all = $util.emptyObject;

        /**
         * Creates a new DictionaryList instance using the specified properties.
         * @function create
         * @memberof hermes.DictionaryList
         * @static
         * @param {hermes.IDictionaryList=} [properties] Properties to set
         * @returns {hermes.DictionaryList} DictionaryList instance
         */
        DictionaryList.create = function create(properties) {
            return new DictionaryList(properties);
        };

        /**
         * Encodes the specified DictionaryList message. Does not implicitly {@link hermes.DictionaryList.verify|verify} messages.
         * @function encode
         * @memberof hermes.DictionaryList
         * @static
         * @param {hermes.IDictionaryList} message DictionaryList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DictionaryList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.all != null && Object.hasOwnProperty.call(message, "all"))
                for (var keys = Object.keys(message.all), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.hermes.DictionaryHead.encode(message.all[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            return writer;
        };

        /**
         * Encodes the specified DictionaryList message, length delimited. Does not implicitly {@link hermes.DictionaryList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.DictionaryList
         * @static
         * @param {hermes.IDictionaryList} message DictionaryList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DictionaryList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DictionaryList message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.DictionaryList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.DictionaryList} DictionaryList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DictionaryList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.DictionaryList(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (message.all === $util.emptyObject)
                            message.all = {};
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
                                value = $root.hermes.DictionaryHead.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.all[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DictionaryList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.DictionaryList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.DictionaryList} DictionaryList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DictionaryList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DictionaryList message.
         * @function verify
         * @memberof hermes.DictionaryList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DictionaryList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.all != null && message.hasOwnProperty("all")) {
                if (!$util.isObject(message.all))
                    return "all: object expected";
                var key = Object.keys(message.all);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.hermes.DictionaryHead.verify(message.all[key[i]]);
                    if (error)
                        return "all." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DictionaryList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.DictionaryList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.DictionaryList} DictionaryList
         */
        DictionaryList.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.DictionaryList)
                return object;
            var message = new $root.hermes.DictionaryList();
            if (object.all) {
                if (typeof object.all !== "object")
                    throw TypeError(".hermes.DictionaryList.all: object expected");
                message.all = {};
                for (var keys = Object.keys(object.all), i = 0; i < keys.length; ++i) {
                    if (typeof object.all[keys[i]] !== "object")
                        throw TypeError(".hermes.DictionaryList.all: object expected");
                    message.all[keys[i]] = $root.hermes.DictionaryHead.fromObject(object.all[keys[i]]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a DictionaryList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.DictionaryList
         * @static
         * @param {hermes.DictionaryList} message DictionaryList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DictionaryList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.all = {};
            var keys2;
            if (message.all && (keys2 = Object.keys(message.all)).length) {
                object.all = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.all[keys2[j]] = $root.hermes.DictionaryHead.toObject(message.all[keys2[j]], options);
            }
            return object;
        };

        /**
         * Converts this DictionaryList to JSON.
         * @function toJSON
         * @memberof hermes.DictionaryList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DictionaryList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DictionaryList
         * @function getTypeUrl
         * @memberof hermes.DictionaryList
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DictionaryList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.DictionaryList";
        };

        return DictionaryList;
    })();

    hermes.Uplink = (function() {

        /**
         * Properties of an Uplink.
         * @memberof hermes
         * @interface IUplink
         * @property {string|null} [id] Uplink id
         * @property {hermes.ICommandValue|null} [cmd] Uplink cmd
         * @property {hermes.IRawCommandValue|null} [parseCmd] Uplink parseCmd
         * @property {hermes.ICommandSequence|null} [seq] Uplink seq
         * @property {hermes.IRawCommandSequence|null} [parseSeq] Uplink parseSeq
         * @property {hermes.IUplinkFileChunk|null} [file] Uplink file
         * @property {hermes.IRequestValue|null} [request] Uplink request
         * @property {google.protobuf.IEmpty|null} [cancel] Uplink cancel
         * @property {google.protobuf.IEmpty|null} [final] Uplink final
         */

        /**
         * Constructs a new Uplink.
         * @memberof hermes
         * @classdesc Represents an Uplink.
         * @implements IUplink
         * @constructor
         * @param {hermes.IUplink=} [properties] Properties to set
         */
        function Uplink(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Uplink id.
         * @member {string} id
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.id = "";

        /**
         * Uplink cmd.
         * @member {hermes.ICommandValue|null|undefined} cmd
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.cmd = null;

        /**
         * Uplink parseCmd.
         * @member {hermes.IRawCommandValue|null|undefined} parseCmd
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.parseCmd = null;

        /**
         * Uplink seq.
         * @member {hermes.ICommandSequence|null|undefined} seq
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.seq = null;

        /**
         * Uplink parseSeq.
         * @member {hermes.IRawCommandSequence|null|undefined} parseSeq
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.parseSeq = null;

        /**
         * Uplink file.
         * @member {hermes.IUplinkFileChunk|null|undefined} file
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.file = null;

        /**
         * Uplink request.
         * @member {hermes.IRequestValue|null|undefined} request
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.request = null;

        /**
         * Uplink cancel.
         * @member {google.protobuf.IEmpty|null|undefined} cancel
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.cancel = null;

        /**
         * Uplink final.
         * @member {google.protobuf.IEmpty|null|undefined} final
         * @memberof hermes.Uplink
         * @instance
         */
        Uplink.prototype.final = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * Uplink value.
         * @member {"cmd"|"parseCmd"|"seq"|"parseSeq"|"file"|"request"|"cancel"|"final"|undefined} value
         * @memberof hermes.Uplink
         * @instance
         */
        Object.defineProperty(Uplink.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["cmd", "parseCmd", "seq", "parseSeq", "file", "request", "cancel", "final"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new Uplink instance using the specified properties.
         * @function create
         * @memberof hermes.Uplink
         * @static
         * @param {hermes.IUplink=} [properties] Properties to set
         * @returns {hermes.Uplink} Uplink instance
         */
        Uplink.create = function create(properties) {
            return new Uplink(properties);
        };

        /**
         * Encodes the specified Uplink message. Does not implicitly {@link hermes.Uplink.verify|verify} messages.
         * @function encode
         * @memberof hermes.Uplink
         * @static
         * @param {hermes.IUplink} message Uplink message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Uplink.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.cmd != null && Object.hasOwnProperty.call(message, "cmd"))
                $root.hermes.CommandValue.encode(message.cmd, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.parseCmd != null && Object.hasOwnProperty.call(message, "parseCmd"))
                $root.hermes.RawCommandValue.encode(message.parseCmd, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
                $root.hermes.CommandSequence.encode(message.seq, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.parseSeq != null && Object.hasOwnProperty.call(message, "parseSeq"))
                $root.hermes.RawCommandSequence.encode(message.parseSeq, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.file != null && Object.hasOwnProperty.call(message, "file"))
                $root.hermes.UplinkFileChunk.encode(message.file, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.request != null && Object.hasOwnProperty.call(message, "request"))
                $root.hermes.RequestValue.encode(message.request, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.cancel != null && Object.hasOwnProperty.call(message, "cancel"))
                $root.google.protobuf.Empty.encode(message.cancel, writer.uint32(/* id 99, wireType 2 =*/794).fork()).ldelim();
            if (message.final != null && Object.hasOwnProperty.call(message, "final"))
                $root.google.protobuf.Empty.encode(message.final, writer.uint32(/* id 100, wireType 2 =*/802).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Uplink message, length delimited. Does not implicitly {@link hermes.Uplink.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Uplink
         * @static
         * @param {hermes.IUplink} message Uplink message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Uplink.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Uplink message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Uplink
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Uplink} Uplink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Uplink.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Uplink();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.cmd = $root.hermes.CommandValue.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.parseCmd = $root.hermes.RawCommandValue.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.seq = $root.hermes.CommandSequence.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.parseSeq = $root.hermes.RawCommandSequence.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.file = $root.hermes.UplinkFileChunk.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.request = $root.hermes.RequestValue.decode(reader, reader.uint32());
                        break;
                    }
                case 99: {
                        message.cancel = $root.google.protobuf.Empty.decode(reader, reader.uint32());
                        break;
                    }
                case 100: {
                        message.final = $root.google.protobuf.Empty.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Uplink message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Uplink
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Uplink} Uplink
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Uplink.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Uplink message.
         * @function verify
         * @memberof hermes.Uplink
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Uplink.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.cmd != null && message.hasOwnProperty("cmd")) {
                properties.value = 1;
                {
                    var error = $root.hermes.CommandValue.verify(message.cmd);
                    if (error)
                        return "cmd." + error;
                }
            }
            if (message.parseCmd != null && message.hasOwnProperty("parseCmd")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.RawCommandValue.verify(message.parseCmd);
                    if (error)
                        return "parseCmd." + error;
                }
            }
            if (message.seq != null && message.hasOwnProperty("seq")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.CommandSequence.verify(message.seq);
                    if (error)
                        return "seq." + error;
                }
            }
            if (message.parseSeq != null && message.hasOwnProperty("parseSeq")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.RawCommandSequence.verify(message.parseSeq);
                    if (error)
                        return "parseSeq." + error;
                }
            }
            if (message.file != null && message.hasOwnProperty("file")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.UplinkFileChunk.verify(message.file);
                    if (error)
                        return "file." + error;
                }
            }
            if (message.request != null && message.hasOwnProperty("request")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.RequestValue.verify(message.request);
                    if (error)
                        return "request." + error;
                }
            }
            if (message.cancel != null && message.hasOwnProperty("cancel")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.google.protobuf.Empty.verify(message.cancel);
                    if (error)
                        return "cancel." + error;
                }
            }
            if (message.final != null && message.hasOwnProperty("final")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.google.protobuf.Empty.verify(message.final);
                    if (error)
                        return "final." + error;
                }
            }
            return null;
        };

        /**
         * Creates an Uplink message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Uplink
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Uplink} Uplink
         */
        Uplink.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Uplink)
                return object;
            var message = new $root.hermes.Uplink();
            if (object.id != null)
                message.id = String(object.id);
            if (object.cmd != null) {
                if (typeof object.cmd !== "object")
                    throw TypeError(".hermes.Uplink.cmd: object expected");
                message.cmd = $root.hermes.CommandValue.fromObject(object.cmd);
            }
            if (object.parseCmd != null) {
                if (typeof object.parseCmd !== "object")
                    throw TypeError(".hermes.Uplink.parseCmd: object expected");
                message.parseCmd = $root.hermes.RawCommandValue.fromObject(object.parseCmd);
            }
            if (object.seq != null) {
                if (typeof object.seq !== "object")
                    throw TypeError(".hermes.Uplink.seq: object expected");
                message.seq = $root.hermes.CommandSequence.fromObject(object.seq);
            }
            if (object.parseSeq != null) {
                if (typeof object.parseSeq !== "object")
                    throw TypeError(".hermes.Uplink.parseSeq: object expected");
                message.parseSeq = $root.hermes.RawCommandSequence.fromObject(object.parseSeq);
            }
            if (object.file != null) {
                if (typeof object.file !== "object")
                    throw TypeError(".hermes.Uplink.file: object expected");
                message.file = $root.hermes.UplinkFileChunk.fromObject(object.file);
            }
            if (object.request != null) {
                if (typeof object.request !== "object")
                    throw TypeError(".hermes.Uplink.request: object expected");
                message.request = $root.hermes.RequestValue.fromObject(object.request);
            }
            if (object.cancel != null) {
                if (typeof object.cancel !== "object")
                    throw TypeError(".hermes.Uplink.cancel: object expected");
                message.cancel = $root.google.protobuf.Empty.fromObject(object.cancel);
            }
            if (object.final != null) {
                if (typeof object.final !== "object")
                    throw TypeError(".hermes.Uplink.final: object expected");
                message.final = $root.google.protobuf.Empty.fromObject(object.final);
            }
            return message;
        };

        /**
         * Creates a plain object from an Uplink message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Uplink
         * @static
         * @param {hermes.Uplink} message Uplink
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Uplink.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.id = "";
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.cmd != null && message.hasOwnProperty("cmd")) {
                object.cmd = $root.hermes.CommandValue.toObject(message.cmd, options);
                if (options.oneofs)
                    object.value = "cmd";
            }
            if (message.parseCmd != null && message.hasOwnProperty("parseCmd")) {
                object.parseCmd = $root.hermes.RawCommandValue.toObject(message.parseCmd, options);
                if (options.oneofs)
                    object.value = "parseCmd";
            }
            if (message.seq != null && message.hasOwnProperty("seq")) {
                object.seq = $root.hermes.CommandSequence.toObject(message.seq, options);
                if (options.oneofs)
                    object.value = "seq";
            }
            if (message.parseSeq != null && message.hasOwnProperty("parseSeq")) {
                object.parseSeq = $root.hermes.RawCommandSequence.toObject(message.parseSeq, options);
                if (options.oneofs)
                    object.value = "parseSeq";
            }
            if (message.file != null && message.hasOwnProperty("file")) {
                object.file = $root.hermes.UplinkFileChunk.toObject(message.file, options);
                if (options.oneofs)
                    object.value = "file";
            }
            if (message.request != null && message.hasOwnProperty("request")) {
                object.request = $root.hermes.RequestValue.toObject(message.request, options);
                if (options.oneofs)
                    object.value = "request";
            }
            if (message.cancel != null && message.hasOwnProperty("cancel")) {
                object.cancel = $root.google.protobuf.Empty.toObject(message.cancel, options);
                if (options.oneofs)
                    object.value = "cancel";
            }
            if (message.final != null && message.hasOwnProperty("final")) {
                object.final = $root.google.protobuf.Empty.toObject(message.final, options);
                if (options.oneofs)
                    object.value = "final";
            }
            return object;
        };

        /**
         * Converts this Uplink to JSON.
         * @function toJSON
         * @memberof hermes.Uplink
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Uplink.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Uplink
         * @function getTypeUrl
         * @memberof hermes.Uplink
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Uplink.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Uplink";
        };

        return Uplink;
    })();

    hermes.UplinkReply = (function() {

        /**
         * Properties of an UplinkReply.
         * @memberof hermes
         * @interface IUplinkReply
         * @property {string|null} [id] UplinkReply id
         * @property {Uint8Array|null} [reply] UplinkReply reply
         * @property {string|null} [error] UplinkReply error
         */

        /**
         * Constructs a new UplinkReply.
         * @memberof hermes
         * @classdesc Represents an UplinkReply.
         * @implements IUplinkReply
         * @constructor
         * @param {hermes.IUplinkReply=} [properties] Properties to set
         */
        function UplinkReply(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UplinkReply id.
         * @member {string} id
         * @memberof hermes.UplinkReply
         * @instance
         */
        UplinkReply.prototype.id = "";

        /**
         * UplinkReply reply.
         * @member {Uint8Array|null|undefined} reply
         * @memberof hermes.UplinkReply
         * @instance
         */
        UplinkReply.prototype.reply = null;

        /**
         * UplinkReply error.
         * @member {string|null|undefined} error
         * @memberof hermes.UplinkReply
         * @instance
         */
        UplinkReply.prototype.error = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * UplinkReply status.
         * @member {"reply"|"error"|undefined} status
         * @memberof hermes.UplinkReply
         * @instance
         */
        Object.defineProperty(UplinkReply.prototype, "status", {
            get: $util.oneOfGetter($oneOfFields = ["reply", "error"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new UplinkReply instance using the specified properties.
         * @function create
         * @memberof hermes.UplinkReply
         * @static
         * @param {hermes.IUplinkReply=} [properties] Properties to set
         * @returns {hermes.UplinkReply} UplinkReply instance
         */
        UplinkReply.create = function create(properties) {
            return new UplinkReply(properties);
        };

        /**
         * Encodes the specified UplinkReply message. Does not implicitly {@link hermes.UplinkReply.verify|verify} messages.
         * @function encode
         * @memberof hermes.UplinkReply
         * @static
         * @param {hermes.IUplinkReply} message UplinkReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UplinkReply.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.reply != null && Object.hasOwnProperty.call(message, "reply"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.reply);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.error);
            return writer;
        };

        /**
         * Encodes the specified UplinkReply message, length delimited. Does not implicitly {@link hermes.UplinkReply.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.UplinkReply
         * @static
         * @param {hermes.IUplinkReply} message UplinkReply message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UplinkReply.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UplinkReply message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.UplinkReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.UplinkReply} UplinkReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UplinkReply.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.UplinkReply();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.reply = reader.bytes();
                        break;
                    }
                case 3: {
                        message.error = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an UplinkReply message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.UplinkReply
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.UplinkReply} UplinkReply
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UplinkReply.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UplinkReply message.
         * @function verify
         * @memberof hermes.UplinkReply
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UplinkReply.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.reply != null && message.hasOwnProperty("reply")) {
                properties.status = 1;
                if (!(message.reply && typeof message.reply.length === "number" || $util.isString(message.reply)))
                    return "reply: buffer expected";
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                if (properties.status === 1)
                    return "status: multiple values";
                properties.status = 1;
                if (!$util.isString(message.error))
                    return "error: string expected";
            }
            return null;
        };

        /**
         * Creates an UplinkReply message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.UplinkReply
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.UplinkReply} UplinkReply
         */
        UplinkReply.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.UplinkReply)
                return object;
            var message = new $root.hermes.UplinkReply();
            if (object.id != null)
                message.id = String(object.id);
            if (object.reply != null)
                if (typeof object.reply === "string")
                    $util.base64.decode(object.reply, message.reply = $util.newBuffer($util.base64.length(object.reply)), 0);
                else if (object.reply.length >= 0)
                    message.reply = object.reply;
            if (object.error != null)
                message.error = String(object.error);
            return message;
        };

        /**
         * Creates a plain object from an UplinkReply message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.UplinkReply
         * @static
         * @param {hermes.UplinkReply} message UplinkReply
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UplinkReply.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.id = "";
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.reply != null && message.hasOwnProperty("reply")) {
                object.reply = options.bytes === String ? $util.base64.encode(message.reply, 0, message.reply.length) : options.bytes === Array ? Array.prototype.slice.call(message.reply) : message.reply;
                if (options.oneofs)
                    object.status = "reply";
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                object.error = message.error;
                if (options.oneofs)
                    object.status = "error";
            }
            return object;
        };

        /**
         * Converts this UplinkReply to JSON.
         * @function toJSON
         * @memberof hermes.UplinkReply
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UplinkReply.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UplinkReply
         * @function getTypeUrl
         * @memberof hermes.UplinkReply
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UplinkReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.UplinkReply";
        };

        return UplinkReply;
    })();

    hermes.FswInitialPacket = (function() {

        /**
         * Properties of a FswInitialPacket.
         * @memberof hermes
         * @interface IFswInitialPacket
         * @property {hermes.IFsw|null} [info] FswInitialPacket info
         * @property {string|null} [profile] FswInitialPacket profile
         */

        /**
         * Constructs a new FswInitialPacket.
         * @memberof hermes
         * @classdesc Represents a FswInitialPacket.
         * @implements IFswInitialPacket
         * @constructor
         * @param {hermes.IFswInitialPacket=} [properties] Properties to set
         */
        function FswInitialPacket(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FswInitialPacket info.
         * @member {hermes.IFsw|null|undefined} info
         * @memberof hermes.FswInitialPacket
         * @instance
         */
        FswInitialPacket.prototype.info = null;

        /**
         * FswInitialPacket profile.
         * @member {string} profile
         * @memberof hermes.FswInitialPacket
         * @instance
         */
        FswInitialPacket.prototype.profile = "";

        /**
         * Creates a new FswInitialPacket instance using the specified properties.
         * @function create
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {hermes.IFswInitialPacket=} [properties] Properties to set
         * @returns {hermes.FswInitialPacket} FswInitialPacket instance
         */
        FswInitialPacket.create = function create(properties) {
            return new FswInitialPacket(properties);
        };

        /**
         * Encodes the specified FswInitialPacket message. Does not implicitly {@link hermes.FswInitialPacket.verify|verify} messages.
         * @function encode
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {hermes.IFswInitialPacket} message FswInitialPacket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FswInitialPacket.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.info != null && Object.hasOwnProperty.call(message, "info"))
                $root.hermes.Fsw.encode(message.info, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.profile != null && Object.hasOwnProperty.call(message, "profile"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.profile);
            return writer;
        };

        /**
         * Encodes the specified FswInitialPacket message, length delimited. Does not implicitly {@link hermes.FswInitialPacket.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {hermes.IFswInitialPacket} message FswInitialPacket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FswInitialPacket.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FswInitialPacket message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FswInitialPacket} FswInitialPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FswInitialPacket.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FswInitialPacket();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.info = $root.hermes.Fsw.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.profile = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FswInitialPacket message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FswInitialPacket} FswInitialPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FswInitialPacket.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FswInitialPacket message.
         * @function verify
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FswInitialPacket.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.info != null && message.hasOwnProperty("info")) {
                var error = $root.hermes.Fsw.verify(message.info);
                if (error)
                    return "info." + error;
            }
            if (message.profile != null && message.hasOwnProperty("profile"))
                if (!$util.isString(message.profile))
                    return "profile: string expected";
            return null;
        };

        /**
         * Creates a FswInitialPacket message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FswInitialPacket} FswInitialPacket
         */
        FswInitialPacket.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FswInitialPacket)
                return object;
            var message = new $root.hermes.FswInitialPacket();
            if (object.info != null) {
                if (typeof object.info !== "object")
                    throw TypeError(".hermes.FswInitialPacket.info: object expected");
                message.info = $root.hermes.Fsw.fromObject(object.info);
            }
            if (object.profile != null)
                message.profile = String(object.profile);
            return message;
        };

        /**
         * Creates a plain object from a FswInitialPacket message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {hermes.FswInitialPacket} message FswInitialPacket
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FswInitialPacket.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.info = null;
                object.profile = "";
            }
            if (message.info != null && message.hasOwnProperty("info"))
                object.info = $root.hermes.Fsw.toObject(message.info, options);
            if (message.profile != null && message.hasOwnProperty("profile"))
                object.profile = message.profile;
            return object;
        };

        /**
         * Converts this FswInitialPacket to JSON.
         * @function toJSON
         * @memberof hermes.FswInitialPacket
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FswInitialPacket.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FswInitialPacket
         * @function getTypeUrl
         * @memberof hermes.FswInitialPacket
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FswInitialPacket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FswInitialPacket";
        };

        return FswInitialPacket;
    })();

    hermes.FswConnectionPacket = (function() {

        /**
         * Properties of a FswConnectionPacket.
         * @memberof hermes
         * @interface IFswConnectionPacket
         * @property {hermes.IFswInitialPacket|null} [info] FswConnectionPacket info
         * @property {hermes.IUplinkReply|null} [reply] FswConnectionPacket reply
         */

        /**
         * Constructs a new FswConnectionPacket.
         * @memberof hermes
         * @classdesc Represents a FswConnectionPacket.
         * @implements IFswConnectionPacket
         * @constructor
         * @param {hermes.IFswConnectionPacket=} [properties] Properties to set
         */
        function FswConnectionPacket(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FswConnectionPacket info.
         * @member {hermes.IFswInitialPacket|null|undefined} info
         * @memberof hermes.FswConnectionPacket
         * @instance
         */
        FswConnectionPacket.prototype.info = null;

        /**
         * FswConnectionPacket reply.
         * @member {hermes.IUplinkReply|null|undefined} reply
         * @memberof hermes.FswConnectionPacket
         * @instance
         */
        FswConnectionPacket.prototype.reply = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * FswConnectionPacket value.
         * @member {"info"|"reply"|undefined} value
         * @memberof hermes.FswConnectionPacket
         * @instance
         */
        Object.defineProperty(FswConnectionPacket.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["info", "reply"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new FswConnectionPacket instance using the specified properties.
         * @function create
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {hermes.IFswConnectionPacket=} [properties] Properties to set
         * @returns {hermes.FswConnectionPacket} FswConnectionPacket instance
         */
        FswConnectionPacket.create = function create(properties) {
            return new FswConnectionPacket(properties);
        };

        /**
         * Encodes the specified FswConnectionPacket message. Does not implicitly {@link hermes.FswConnectionPacket.verify|verify} messages.
         * @function encode
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {hermes.IFswConnectionPacket} message FswConnectionPacket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FswConnectionPacket.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.info != null && Object.hasOwnProperty.call(message, "info"))
                $root.hermes.FswInitialPacket.encode(message.info, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.reply != null && Object.hasOwnProperty.call(message, "reply"))
                $root.hermes.UplinkReply.encode(message.reply, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FswConnectionPacket message, length delimited. Does not implicitly {@link hermes.FswConnectionPacket.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {hermes.IFswConnectionPacket} message FswConnectionPacket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FswConnectionPacket.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FswConnectionPacket message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.FswConnectionPacket} FswConnectionPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FswConnectionPacket.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.FswConnectionPacket();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.info = $root.hermes.FswInitialPacket.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.reply = $root.hermes.UplinkReply.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FswConnectionPacket message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.FswConnectionPacket} FswConnectionPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FswConnectionPacket.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FswConnectionPacket message.
         * @function verify
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FswConnectionPacket.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.info != null && message.hasOwnProperty("info")) {
                properties.value = 1;
                {
                    var error = $root.hermes.FswInitialPacket.verify(message.info);
                    if (error)
                        return "info." + error;
                }
            }
            if (message.reply != null && message.hasOwnProperty("reply")) {
                if (properties.value === 1)
                    return "value: multiple values";
                properties.value = 1;
                {
                    var error = $root.hermes.UplinkReply.verify(message.reply);
                    if (error)
                        return "reply." + error;
                }
            }
            return null;
        };

        /**
         * Creates a FswConnectionPacket message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.FswConnectionPacket} FswConnectionPacket
         */
        FswConnectionPacket.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.FswConnectionPacket)
                return object;
            var message = new $root.hermes.FswConnectionPacket();
            if (object.info != null) {
                if (typeof object.info !== "object")
                    throw TypeError(".hermes.FswConnectionPacket.info: object expected");
                message.info = $root.hermes.FswInitialPacket.fromObject(object.info);
            }
            if (object.reply != null) {
                if (typeof object.reply !== "object")
                    throw TypeError(".hermes.FswConnectionPacket.reply: object expected");
                message.reply = $root.hermes.UplinkReply.fromObject(object.reply);
            }
            return message;
        };

        /**
         * Creates a plain object from a FswConnectionPacket message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {hermes.FswConnectionPacket} message FswConnectionPacket
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FswConnectionPacket.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.info != null && message.hasOwnProperty("info")) {
                object.info = $root.hermes.FswInitialPacket.toObject(message.info, options);
                if (options.oneofs)
                    object.value = "info";
            }
            if (message.reply != null && message.hasOwnProperty("reply")) {
                object.reply = $root.hermes.UplinkReply.toObject(message.reply, options);
                if (options.oneofs)
                    object.value = "reply";
            }
            return object;
        };

        /**
         * Converts this FswConnectionPacket to JSON.
         * @function toJSON
         * @memberof hermes.FswConnectionPacket
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FswConnectionPacket.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FswConnectionPacket
         * @function getTypeUrl
         * @memberof hermes.FswConnectionPacket
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FswConnectionPacket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.FswConnectionPacket";
        };

        return FswConnectionPacket;
    })();

    hermes.ProfileProvider = (function() {

        /**
         * Properties of a ProfileProvider.
         * @memberof hermes
         * @interface IProfileProvider
         * @property {string|null} [name] ProfileProvider name
         * @property {string|null} [schema] ProfileProvider schema
         * @property {string|null} [uiSchema] ProfileProvider uiSchema
         */

        /**
         * Constructs a new ProfileProvider.
         * @memberof hermes
         * @classdesc Represents a ProfileProvider.
         * @implements IProfileProvider
         * @constructor
         * @param {hermes.IProfileProvider=} [properties] Properties to set
         */
        function ProfileProvider(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProfileProvider name.
         * @member {string} name
         * @memberof hermes.ProfileProvider
         * @instance
         */
        ProfileProvider.prototype.name = "";

        /**
         * ProfileProvider schema.
         * @member {string} schema
         * @memberof hermes.ProfileProvider
         * @instance
         */
        ProfileProvider.prototype.schema = "";

        /**
         * ProfileProvider uiSchema.
         * @member {string} uiSchema
         * @memberof hermes.ProfileProvider
         * @instance
         */
        ProfileProvider.prototype.uiSchema = "";

        /**
         * Creates a new ProfileProvider instance using the specified properties.
         * @function create
         * @memberof hermes.ProfileProvider
         * @static
         * @param {hermes.IProfileProvider=} [properties] Properties to set
         * @returns {hermes.ProfileProvider} ProfileProvider instance
         */
        ProfileProvider.create = function create(properties) {
            return new ProfileProvider(properties);
        };

        /**
         * Encodes the specified ProfileProvider message. Does not implicitly {@link hermes.ProfileProvider.verify|verify} messages.
         * @function encode
         * @memberof hermes.ProfileProvider
         * @static
         * @param {hermes.IProfileProvider} message ProfileProvider message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileProvider.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.schema != null && Object.hasOwnProperty.call(message, "schema"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.schema);
            if (message.uiSchema != null && Object.hasOwnProperty.call(message, "uiSchema"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.uiSchema);
            return writer;
        };

        /**
         * Encodes the specified ProfileProvider message, length delimited. Does not implicitly {@link hermes.ProfileProvider.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.ProfileProvider
         * @static
         * @param {hermes.IProfileProvider} message ProfileProvider message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProfileProvider.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProfileProvider message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.ProfileProvider
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.ProfileProvider} ProfileProvider
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileProvider.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.ProfileProvider();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.schema = reader.string();
                        break;
                    }
                case 3: {
                        message.uiSchema = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProfileProvider message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.ProfileProvider
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.ProfileProvider} ProfileProvider
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProfileProvider.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProfileProvider message.
         * @function verify
         * @memberof hermes.ProfileProvider
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProfileProvider.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.schema != null && message.hasOwnProperty("schema"))
                if (!$util.isString(message.schema))
                    return "schema: string expected";
            if (message.uiSchema != null && message.hasOwnProperty("uiSchema"))
                if (!$util.isString(message.uiSchema))
                    return "uiSchema: string expected";
            return null;
        };

        /**
         * Creates a ProfileProvider message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.ProfileProvider
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.ProfileProvider} ProfileProvider
         */
        ProfileProvider.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.ProfileProvider)
                return object;
            var message = new $root.hermes.ProfileProvider();
            if (object.name != null)
                message.name = String(object.name);
            if (object.schema != null)
                message.schema = String(object.schema);
            if (object.uiSchema != null)
                message.uiSchema = String(object.uiSchema);
            return message;
        };

        /**
         * Creates a plain object from a ProfileProvider message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.ProfileProvider
         * @static
         * @param {hermes.ProfileProvider} message ProfileProvider
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProfileProvider.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.schema = "";
                object.uiSchema = "";
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.schema != null && message.hasOwnProperty("schema"))
                object.schema = message.schema;
            if (message.uiSchema != null && message.hasOwnProperty("uiSchema"))
                object.uiSchema = message.uiSchema;
            return object;
        };

        /**
         * Converts this ProfileProvider to JSON.
         * @function toJSON
         * @memberof hermes.ProfileProvider
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProfileProvider.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ProfileProvider
         * @function getTypeUrl
         * @memberof hermes.ProfileProvider
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ProfileProvider.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.ProfileProvider";
        };

        return ProfileProvider;
    })();

    hermes.Profile = (function() {

        /**
         * Properties of a Profile.
         * @memberof hermes
         * @interface IProfile
         * @property {string|null} [name] Profile name
         * @property {string|null} [provider] Profile provider
         * @property {string|null} [settings] Profile settings
         * @property {string|null} [id] Profile id
         */

        /**
         * Constructs a new Profile.
         * @memberof hermes
         * @classdesc Represents a Profile.
         * @implements IProfile
         * @constructor
         * @param {hermes.IProfile=} [properties] Properties to set
         */
        function Profile(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Profile name.
         * @member {string} name
         * @memberof hermes.Profile
         * @instance
         */
        Profile.prototype.name = "";

        /**
         * Profile provider.
         * @member {string} provider
         * @memberof hermes.Profile
         * @instance
         */
        Profile.prototype.provider = "";

        /**
         * Profile settings.
         * @member {string} settings
         * @memberof hermes.Profile
         * @instance
         */
        Profile.prototype.settings = "";

        /**
         * Profile id.
         * @member {string} id
         * @memberof hermes.Profile
         * @instance
         */
        Profile.prototype.id = "";

        /**
         * Creates a new Profile instance using the specified properties.
         * @function create
         * @memberof hermes.Profile
         * @static
         * @param {hermes.IProfile=} [properties] Properties to set
         * @returns {hermes.Profile} Profile instance
         */
        Profile.create = function create(properties) {
            return new Profile(properties);
        };

        /**
         * Encodes the specified Profile message. Does not implicitly {@link hermes.Profile.verify|verify} messages.
         * @function encode
         * @memberof hermes.Profile
         * @static
         * @param {hermes.IProfile} message Profile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Profile.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.provider != null && Object.hasOwnProperty.call(message, "provider"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.provider);
            if (message.settings != null && Object.hasOwnProperty.call(message, "settings"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.settings);
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.id);
            return writer;
        };

        /**
         * Encodes the specified Profile message, length delimited. Does not implicitly {@link hermes.Profile.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hermes.Profile
         * @static
         * @param {hermes.IProfile} message Profile message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Profile.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Profile message from the specified reader or buffer.
         * @function decode
         * @memberof hermes.Profile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hermes.Profile} Profile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Profile.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.hermes.Profile();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.provider = reader.string();
                        break;
                    }
                case 3: {
                        message.settings = reader.string();
                        break;
                    }
                case 5: {
                        message.id = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Profile message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hermes.Profile
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hermes.Profile} Profile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Profile.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Profile message.
         * @function verify
         * @memberof hermes.Profile
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Profile.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.provider != null && message.hasOwnProperty("provider"))
                if (!$util.isString(message.provider))
                    return "provider: string expected";
            if (message.settings != null && message.hasOwnProperty("settings"))
                if (!$util.isString(message.settings))
                    return "settings: string expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        /**
         * Creates a Profile message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hermes.Profile
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hermes.Profile} Profile
         */
        Profile.fromObject = function fromObject(object) {
            if (object instanceof $root.hermes.Profile)
                return object;
            var message = new $root.hermes.Profile();
            if (object.name != null)
                message.name = String(object.name);
            if (object.provider != null)
                message.provider = String(object.provider);
            if (object.settings != null)
                message.settings = String(object.settings);
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        /**
         * Creates a plain object from a Profile message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hermes.Profile
         * @static
         * @param {hermes.Profile} message Profile
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Profile.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.provider = "";
                object.settings = "";
                object.id = "";
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.provider != null && message.hasOwnProperty("provider"))
                object.provider = message.provider;
            if (message.settings != null && message.hasOwnProperty("settings"))
                object.settings = message.settings;
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this Profile to JSON.
         * @function toJSON
         * @memberof hermes.Profile
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Profile.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Profile
         * @function getTypeUrl
         * @memberof hermes.Profile
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Profile.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hermes.Profile";
        };

        return Profile;
    })();

    /**
     * ProfileState enum.
     * @name hermes.ProfileState
     * @enum {number}
     * @property {number} PROFILE_IDLE=0 PROFILE_IDLE value
     * @property {number} PROFILE_CONNECTING=1 PROFILE_CONNECTING value
     * @property {number} PROFILE_ACTIVE=2 PROFILE_ACTIVE value
     * @property {number} PROFILE_DISCONNECT=3 PROFILE_DISCONNECT value
     */
    hermes.ProfileState = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "PROFILE_IDLE"] = 0;
        values[valuesById[1] = "PROFILE_CONNECTING"] = 1;
        values[valuesById[2] = "PROFILE_ACTIVE"] = 2;
        values[valuesById[3] = "PROFILE_DISCONNECT"] = 3;
        return values;
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
                        if (properties[keys[i]] != null)
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
            Timestamp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
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
            Timestamp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    var tag = reader.uint32();
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
                        reader.skipType(tag & 7);
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
            Timestamp.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && message.hasOwnProperty("nanos"))
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
            Timestamp.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                var message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
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
            Timestamp.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && message.hasOwnProperty("nanos"))
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

        protobuf.Empty = (function() {

            /**
             * Properties of an Empty.
             * @memberof google.protobuf
             * @interface IEmpty
             */

            /**
             * Constructs a new Empty.
             * @memberof google.protobuf
             * @classdesc Represents an Empty.
             * @implements IEmpty
             * @constructor
             * @param {google.protobuf.IEmpty=} [properties] Properties to set
             */
            function Empty(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new Empty instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty=} [properties] Properties to set
             * @returns {google.protobuf.Empty} Empty instance
             */
            Empty.create = function create(properties) {
                return new Empty(properties);
            };

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Empty.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Empty.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Empty
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Empty} Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Empty.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Empty();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Empty
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Empty} Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Empty.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Empty message.
             * @function verify
             * @memberof google.protobuf.Empty
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Empty.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Empty
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Empty} Empty
             */
            Empty.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Empty)
                    return object;
                return new $root.google.protobuf.Empty();
            };

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.Empty} message Empty
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Empty.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this Empty to JSON.
             * @function toJSON
             * @memberof google.protobuf.Empty
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Empty.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Empty
             * @function getTypeUrl
             * @memberof google.protobuf.Empty
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Empty.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/google.protobuf.Empty";
            };

            return Empty;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
