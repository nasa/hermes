# CCSDS Package

This package provides implementations of the Consultative Committee for Space Data Systems (CCSDS) protocols, specifically focusing on Space Packet Protocol and Transfer Frame formats.

## Overview

The CCSDS package implements data structures and functions for handling CCSDS standard space communication protocols. It provides utilities for:

- Encoding and decoding CCSDS Space Packets
- Working with Telemetry (TM) and Telecommand (TC) frames
- Handling packet segmentation and reassembly
- Managing sequence flags and counters

## Components

The CCSDS package provides the following components:

- Packet: Implements the CCSDS Space Packet format with support for headers, packet types, segmentation flags, and sequence counting
- TmFrame: Implements the CCSDS Telemetry Transfer Frame format with header fields, virtual channel management, and CRC validation
- TcFrame: Implements the CCSDS Telecommand Transfer Frame format with command frame structure and frame sequencing
- Reader: Provides utilities for reading and deframing CCSDS packets from byte streams
- Types: Defines specialized types used in CCSDS protocols

## Protocol Definition

The `ccsds.protocol` file contains the protocol definition used to generate the Go code with the protocolc tool. It defines the structure of:
- Space Packets
- Telemetry Frames
- Telecommand Frames
- Secondary Headers
- Enumerated types for packet classification

## Usage

```go
import "github.com/nasa/hermes/pkg/ccsds"

// Create and marshal a CCSDS packet
packet := &ccsds.Packet{
    Version:         0,
    Type:            ccsds.PacketType_TELEMETRY,
    SecondaryHeader: 0,
    Apid:            123,
    SequenceFlags:   ccsds.SequenceFlag_UNSEGMENTED,
    SequenceCount:   1,
    Payload:         []byte{...},
}

writer := serial.NewWriter()
err := packet.Marshal(writer)
// Use the marshaled data...

// Unmarshal a CCSDS packet
reader := serial.NewReader(data)
var packet ccsds.Packet
err := packet.Unmarshal(reader)
// Use the unmarshaled packet...
```

## Dependencies

- `github.com/nasa/hermes/pkg/serial`: For binary serialization and deserialization
- `github.com/nasa/hermes/pkg/hash`: For CRC calculation and validation
- `github.com/nasa/hermes/pkg/log`: For logging in the deframer
