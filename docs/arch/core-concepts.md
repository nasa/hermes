---
icon: fontawesome/solid/atom
---

# Core Concepts

This document defines many of the core concepts that Hermes is designed around.
Much of the Hermes documentation references concepts defined here.

## Dictionary

A **dictionary** is the interface specification for a spacecraft's flight software.
It defines all the commands the spacecraft accepts, the telemetry channels it
produces, the events it can emit, and the parameters that configure its behavior.
Without a dictionary, ground software cannot communicate with or understand data
from the spacecraft.

Dictionaries serve as the contract between flight software and ground systems.
When flight software is built, it generates a dictionary file that describes its
entire command and telemetry interface. Ground software loads this dictionary to:

- **Decode incoming telemetry**: Map numeric channel IDs to human-readable names and parse binary values according to their types
- **Encode outgoing commands**: Serialize command arguments and validate them before transmission
- **Format event messages**: Combine event IDs with their arguments to produce readable log messages
- **Validate data**: Ensure values are within expected ranges and types match specifications

A dictionary is divided into **namespaces** whos use is defined by the project or
framework. Dictionaries will always include the main or default namespace `""`.

Dictionaries are versioned and can evolve as flight software is updated. Ground systems may
load multiple dictionary versions simultaneously to handle different spacecraft configurations
or testbeds.

### Types

The dictionary type system defines how data is structured and serialized
between ground software and spacecraft. All telemetry values, command
arguments, event arguments, and parameters use these types.

#### Primitives

Primitive types represent simple scalar values. These are the building blocks for more complex types.

**Integer Types:**

| Type | Description         | Size    | Range                                                   |
| ---- | ------------------- | ------- | ------------------------------------------------------- |
| U8   | Unsigned 8-bit int  | 1 byte  | 0 to 255                                                |
| U16  | Unsigned 16-bit int | 2 bytes | 0 to 65,535                                             |
| U32  | Unsigned 32-bit int | 4 bytes | 0 to 4,294,967,295                                      |
| U64  | Unsigned 64-bit int | 8 bytes | 0 to 18,446,744,073,709,551,615                         |
| I8   | Signed 8-bit int    | 1 byte  | -128 to 127                                             |
| I16  | Signed 16-bit int   | 2 bytes | -32,768 to 32,767                                       |
| I32  | Signed 32-bit int   | 4 bytes | -2,147,483,648 to 2,147,483,647                         |
| I64  | Signed 64-bit int   | 8 bytes | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 |

**Floating-Point Types:**

| Type | Description           | Size    | Precision    |
| ---- | --------------------- | ------- | ------------ |
| F32  | 32-bit floating point | 4 bytes | ~7 decimals  |
| F64  | 64-bit floating point | 8 bytes | ~16 decimals |

**Other Primitives:**

| Type    | Description            | Encoding                                                  |
| ------- | ---------------------- | --------------------------------------------------------- |
| Boolean | `true`/`false` value   | Backed by unsigned integer (U8/U16/U32/U64), typically U8 |
| String  | Variable-length text   | Length-prefixed with unsigned integer type                |
| Void    | Padding/reserved space | Fixed number of bytes                                     |

Integer and float types may optionally specify min/max bounds for validation.

#### Enumerates

Enumerated types map symbolic names to integer values, allowing human-readable labels for discrete states.

**Key Attributes:**

| Attribute   | Type    | Description                                                               |
| ----------- | ------- | ------------------------------------------------------------------------- |
| Name        | string  | Identifier for the enum type                                              |
| Encode Type | integer | Underlying integer type for serialization (I8/I16/I32/I64/U8/U16/U32/U64) |
| Items       | list    | Named values with their numeric mappings and optional metadata            |

**Bitmasks** are a variant of enums where each item represents a bitwise mask, allowing
multiple flags to be combined into a single value.

#### Objects

Objects (structs) are composite types containing multiple named fields.
Fields are serialized in the order they are defined.

**Key Attributes:**

| Attribute | Type         | Description                                          |
| --------- | ------------ | ---------------------------------------------------- |
| Name      | string       | Identifier for the struct type                       |
| Fields    | ordered list | Named members with their types and optional metadata |

Each field has a name, type, and optional constant value. Objects can contain any
type including other object, enabling nested data structures.

#### Arrays

Arrays are homogeneous collections of elements of the same type. Arrays can be either
static (fixed size known at compile time) or dynamic (variable size with length prefix).

**Key Attributes:**

| Attribute    | Type              | Description                                        |
| ------------ | ----------------- | -------------------------------------------------- |
| Name         | string            | Optional identifier if this is a named type        |
| Element Type | Type              | Type of each element in the array                  |
| Size         | static or dynamic | Fixed size or bounded range (min/max)              |
| Length Type  | unsigned integer  | Serialization type for dynamic array length prefix |

**Static arrays** have a compile-time fixed size and do not include a length prefix in their serialization.
**Dynamic arrays** include a length prefix (U8/U16/U32/U64) before the array elements, allowing variable-length data.

#### Bytes

Bytes types are specialized arrays optimized for homogeneous numeric data. They store elements as
packed binary data without per-element encoding overhead, making them efficient for bulk numeric
telemetry like sensor arrays or image data.

**Key Attributes:**

| Attribute   | Type              | Description                                          |
| ----------- | ----------------- | ---------------------------------------------------- |
| Name        | string            | Optional identifier if this is a named type          |
| Kind        | number primitive  | Element type (U8/I8/U16/I16/U32/I32/U64/I64/F32/F64) |
| Size        | static or dynamic | Fixed size or bounded range                          |
| Length Type | unsigned integer  | Serialization type for dynamic array length prefix   |

Bytes types decode to native array types: NumPy arrays in Python, TypedArrays in
JavaScript/TypeScript. This provides efficient memory layout and compatibility
with numeric computing libraries.

### Commands

Commands represent uplink messages sent from the ground system to the spacecraft.
A command is the most basic (and important) mechanism to communicate with the spacecraft.
They make up the backbone for deep-space autonomous operations.

Each command execution is a discrete event that should be recorded for audit
and analysis purposes. The start and end of a command typically emit an event
with `COMMAND` severity.

**Key Attributes:**

| Attribute | Type            | Description                                             |
| --------- | --------------- | ------------------------------------------------------- |
| Opcode    | integer         | Unique identifier for the command type                  |
| Mnemonic  | string          | Human-readable command name (e.g., `CMD_POWER_ON`)      |
| Component | string          | Module or subsystem that owns this command              |
| Arguments | typed values    | Command parameters with names and values                |
| Timestamp | time            | When the command was sent from ground                   |
| Source    | string          | Which FSW connection received the command               |
| Metadata  | key-value pairs | Additional context like sequence ID, user, session info |
| Result    | success/failure | Command execution outcome                               |

Commands can be grouped into **sequences** for multi-step operations, where multiple
commands are executed in order as a single logical unit.

### Telemetry

Telemetry represents channelized time-series data downlinked from the spacecraft. This is typically high-frequency sensor data, state information, and performance metrics that are continuously sampled and stored.

**Key Attributes:**

| Attribute  | Type            | Description                                                                        |
| ---------- | --------------- | ---------------------------------------------------------------------------------- |
| Channel ID | integer         | Unique identifier for the telemetry channel                                        |
| Name       | string          | Human-readable channel name (e.g., `TEMP_SENSOR_1`)                                |
| Component  | string          | Module or subsystem that produces this telemetry                                   |
| Timestamp  | time            | When the measurement was taken (spacecraft clock or ground receipt time)           |
| Value      | typed           | The telemetry reading - can be numeric (int/float), string, enum, struct, or array |
| Source     | string          | Which FSW connection produced this data                                            |
| Context    | enum            | Whether this is REALTIME or RECORDED data                                          |
| Labels     | key-value pairs | Optional tags for cardinality (e.g., task ID, sensor index)                        |

Telemetry is the highest volume data type and benefits most from time-series optimized storage.

### Events

Events (EVRs - Event Reports) represent discrete log messages emitted by the spacecraft.
These are structured log entries with severity levels, similar to traditional application
logging but with spacecraft-specific context.

**Key Attributes:**

| Attribute | Type            | Description                                                       |
| --------- | --------------- | ----------------------------------------------------------------- |
| Event ID  | integer         | Unique identifier for the event type                              |
| Name      | string          | Human-readable event name (e.g., `CMD_DISPATCH_ERROR`)            |
| Component | string          | Module or subsystem that emitted the event                        |
| Timestamp | time            | When the event occurred (spacecraft clock or ground receipt time) |
| Severity  | enum            | Log level (see table below)                                       |
| Message   | string          | Formatted log message                                             |
| Arguments | typed values    | Optional structured data embedded in the message                  |
| Source    | string          | Which FSW connection produced this event                          |
| Context   | enum            | Whether this is REALTIME or RECORDED data                         |
| Tags      | key-value pairs | Optional additional context                                       |

**Severity Levels:**

| Level         | Description                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DIAGNOSTIC    | A debug or development log/event has occurred. Typically these are not streamed to the ground in realtime. These are transmitted during high rate data passes |
| ACTIVITY_LOW  | A minor system or component event has occurred.                                                                                                               |
| ACTIVITY_HIGH | A major system or component event has occurred.                                                                                                               |
| WARNING_LOW   | A recoverable system fault or error has occurred.                                                                                                             |
| WARNING_HIGH  | A major system fault or error has occurred. Typically this halts the system in some way though it is up to the flight software to choose what to do here.     |
| COMMAND       | A command has been dispatch or has finished.                                                                                                                  |
| FATAL         | An unrecoverable issue has been detected. The flight software typically reboots into a "Safe" mode.                                                           |

Events are lower volume than telemetry but critical for understanding
spacecraft behavior and troubleshooting.

### Parameters

Parameters represent configuration values, constants, and settings defined in
the spacecraft's flight software. Unlike telemetry which provides dynamic
sensor readings, parameters are static or semi-static values that configure
how the system operates. They define thresholds, limits, operational modes,
and other configuration data.

**Key Attributes:**

| Attribute | Type    | Description                                                    |
| --------- | ------- | -------------------------------------------------------------- |
| ID        | integer | Unique identifier for the parameter                            |
| Name      | string  | Human-readable parameter name (e.g., `MAX_TEMP`)               |
| Component | string  | Module or subsystem that owns this parameter                   |
| Type      | typed   | Data type of the parameter value (numeric, string, enum, etc.) |
| Metadata  | string  | Optional additional information about the parameter            |

Parameters are typically lower volume than telemetry and events, representing the
configuration state rather than runtime state. They may be updatable via special
commands or fixed at compile-time depending on the flight software implementation.

### Namespaces

Namespaces are organizational containers within a dictionary that group related definitions together.
Many dictionaries will include a single _main_ namespace called `""`. 

**Key Attributes:**

| Attribute  | Type                | Description                                       |
| ---------- | ------------------- | ------------------------------------------------- |
| Name       | string              | Namespace identifier (typically component name)   |
| Commands   | map of CommandDef   | All commands owned by this component              |
| Events     | map of EventDef     | All events that this component can emit           |
| Telemetry  | map of TelemetryDef | All telemetry channels produced by this component |
| Parameters | map of ParameterDef | All configuration parameters for this component   |
| Types      | map of custom types | Custom data types used by this component          |

Namespaces provide hierarchical organization of dictionary definitions, making it easier to
manage large flight software systems with many components. Dictionary queries can target specific
namespaces to retrieve only relevant definitions for a particular subsystem.

## Files

File transfers track both uplink (ground → spacecraft) and downlink (spacecraft → ground) operations.
These records capture transfer sessions for audit, debugging incomplete transfers, and data provenance.

**Key Attributes:**

| Attribute        | Type            | Description                                                 |
| ---------------- | --------------- | ----------------------------------------------------------- |
| Transfer ID      | UUID            | Unique identifier for this transfer session                 |
| Direction        | enum            | UPLINK or DOWNLINK                                          |
| Source Path      | string          | File path on the originating system                         |
| Destination Path | string          | File path on the receiving system                           |
| FSW Connection   | string          | Which FSW connection handled the transfer                   |
| Start Time       | timestamp       | When the transfer began (ground time)                       |
| End Time         | timestamp       | When the transfer completed or failed                       |
| Size             | integer         | Total file size in bytes                                    |
| Status           | enum            | COMPLETED, PARTIAL, CRC_FAILED, or UNKNOWN (downlinks only) |
| Error Message    | string          | Non-empty if transfer failed                                |
| Missing Chunks   | byte ranges     | For partial downlinks, which data is missing                |
| Metadata         | key-value pairs | Additional transfer context                                 |

File transfer records are relatively low volume compared to telemetry and events, but are important for operational tracking and ensuring data products are received completely.

## Time

You obviously know all about time. But you may not know that time is actually far more
complex than a readout on a clock. A spacecraft or mission as a whole typically has
more than one source of time. It is important for operators to understand and manage
these sources of time to understand the state of the spacecraft and plan accordingly.
To illustrate this important point, we will consider a spacecraft in deep-space with
a ground station on Earth.

In this example mission there are a couple time sources at play:

| Name | Source                     | Function                                                                                                                                                                                                                            |
| ---- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SCLK | Spacecraft's onboard clock | Monotonically increasing, high precision time relative to a fixed epoch.                                                                                                                                                            |
| TAI  | Earth Atomic Time          | Monotonically increasing, high precision time kept by about 400 atomic clocks around the globe.                                                                                                                                     |
| UTC  | Universal Coordinated Time | A [discontinous offset](https://en.wikipedia.org/wiki/Leap_second) of TAI which aligns solar noon with 12:00 due to fluctuations in the earths rotation rate. This is the standard time reported by most computer systems on Earth. |

### Epoch

The spacecraft's on-board clock is typically a crystal oscillator or some other
high precision mechanism for measuring _relative_ time deltas. The spacecraft clock
keeps time using a numeric value that increments a specified rate.
The value represents the time elapsed since some "zero time" or **Epoch**.

JPL uses two major epochs:

- **J2000**: January 1 2000. This is the most common epoch used by our spacecraft
- **Unix**: January 1 1970. This is the most common epoch used around the globe by many timekeeping systems.

!!! example

    If we are measuring time at second precision relative to J2000. The following
    times are equivalent:

    - `827432430` SCLK
    - `2026 Mar 22 06:19:26` UTC

### Time Base

During the operational cycle of a spacecraft, the SCLK may incur discontinuous
time jumps during different states. For example, many spacecraft will shutdown
on a fixed cycle to save energy during unused spans. When the spacecraft boots
back up the clock might not be initialized yet meaning the FSW reports time `0.0`.

The ground might receive some messages like this:

```
0 000000000.0000 FSW CPU Reset
0 000000000.0010 FSW is booting up
0 000000000.0020 Looking for synchronized clock source
0 000000000.0030 Synchronizing clock
1 827432430.1512 Clock synchronized
```

You'll notice between the fourth and fifth event there is a time skip of about 26
years. This happens because the source of on-board time changes when the flight
software synchronizes with the "proper" time source. The first field in this
example indicates the "time base" of the SCLK. The time base is defined by the
mission and should include enough cardinality to encompass all the continous
time scales.

In this example the `0` time base indicates the raw on-board clock which is tied
to the system reset time. The `1` time base indicates the epoch synchronized clock
which is the nominal time base during the operation of the mission.

### Non-Linear Time

Most of the concepts of time handling in Hermes are derived from JPL NAIF
[SPICE](https://naif.jpl.nasa.gov). SPICE concepts have been used at JPL to
manage deep space missions for many decades dating back to the Apollo era.

!!! quote

    Most of the complexity of dealing with SCLK time values arises from the fact
    that the rate at which any spacecraft clock runs varies over time. As a
    consequence, the relationship between SCLK and ET or UTC is not accurately
    described by a linear function; usually, a piecewise linear function is
    used to model this relationship.

    The mapping that models the relationship between SCLK and other time systems
    is updated as a mission progresses. While the change in the relationship
    between SCLK and other systems will usually be small, you should be aware
    that it exists; it may be a cause of discrepancies between results produced
    by different sets of software. 

Hermes provides an implementation of SPICE SCLK that is bit-compatible with CSPICE
and supports loading SCLK time kernels. To understand more about SCLK and SPICE
time kernels see the NAIF [required reading](https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/sclk.html).

### Earth Return Time

Earth return time (ERT) simply means the time (usually in UTC) at which a given piece
of data reaches the ground system. All Hermes timestamped telemetry will include SCLK
and ERT and both will be used to analyze the state of the spacecraft.
