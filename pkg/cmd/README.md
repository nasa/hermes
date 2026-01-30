# Command Package

This package provides utilities for parsing and handling command-line style inputs for spacecraft commands.

## Overview

The cmd package implements a lexer and parser for command strings, allowing the conversion of text-based commands into structured command objects that can be processed by the Hermes system. It's designed to work with command dictionaries and supports various argument types.

## Components

The cmd package provides the following components:

- Command parsing functionality for processing command arguments based on command definitions
- Argument handling utilities for various data types (integers, floats, strings, arrays, etc.)
- Lexical analysis for tokenizing command strings

## Features

- Support for parsing command mnemonics and arguments
- Validation against command definitions
- Handling of various argument types and formats
- Special options for array handling (e.g., `omitLengthPrefix`)
- Integration with the Hermes dictionary system

## Usage

### Basic Command Parsing

```go
import "github.com/nasa/hermes/pkg/cmd"

// Parse a command string into tokens
tokens := cmd.Lex("COMMAND_NAME arg1 arg2 \"quoted arg\"")

// Parse a command using a command definition
parsedArgs, err := cmd.ParseCommand(commandDef, args)
```

### Using the BasicCommandParser

```go
import (
    "github.com/nasa/hermes/pkg/cmd"
    "github.com/nasa/hermes/pkg/host"
    "github.com/nasa/hermes/pkg/pb"
)

parser := &cmd.BasicCommandParser{}
dictionary := &host.DictionaryNamespace{...}
rawCmd := &pb.RawCommandValue{Command: "CMD_NAME arg1 arg2"}

cmdValue, err := parser.ParseCommand(dictionary, rawCmd)
```

## Options

The package supports various options for customizing command parsing behavior:

- `WithoutOmitLengthPrefix()`: Disables the special handling of dynamically sized arrays where the length prefix is omitted

## Dependencies

- `github.com/nasa/hermes/pkg/pb`: For protocol buffer definitions
- `github.com/nasa/hermes/pkg/host`: For dictionary and command handling
