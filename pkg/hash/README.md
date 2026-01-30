# Hash Package

This package provides hash function implementations for data integrity verification.

## Overview

The hash package implements various checksum and hash algorithms commonly used in spacecraft communications and file transfers. It provides a generic `Hash` interface that all implementations follow, making it easy to switch between different hash algorithms as needed.

## Components

The hash package provides the following components:

- Hash Interface: Defines the generic interface for all hash implementations with methods to reset, update, and finalize hash computation
- CRC16 Implementation: Implements the 16-bit Cyclic Redundancy Check algorithm with standard CRC-16-CCITT polynomial
- CRC32 Implementation: Implements the 32-bit Cyclic Redundancy Check algorithm with standard CRC-32 polynomial
- CFDP Implementation: Implements the Consultative Committee for Space Data Systems (CCSDS) File Delivery Protocol checksum

## Usage

### Basic Hash Computation

```go
import "github.com/nasa/hermes/pkg/hash"

// Create a new CRC16 hash
crc := hash.NewCRC16()

// Update with data
crc.Update([]byte("Hello, world!"))

// Get the final hash value
checksum := crc.Finish()
```

### Data Verification

```go
// Compute hash of data
crc := hash.NewCRC16()
crc.Update(data)
computed := crc.Finish()

// Compare with received checksum
if computed != received {
    return hash.NewChecksumFailedErr(received, computed)
}
```

### Using Different Hash Algorithms

```go
// CRC16 for small data
crc16 := hash.NewCRC16()
crc16.Update(data)
checksum16 := crc16.Finish()

// CRC32 for larger data
crc32 := hash.NewCRC32()
crc32.Update(data)
checksum32 := crc32.Finish()

// CFDP for file transfers
cfdp := hash.NewCFDP()
cfdp.Update(data)
checksumCFDP := cfdp.Finish()
```

## Dependencies

- Standard Go libraries only
- No external dependencies
