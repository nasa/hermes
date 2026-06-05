# Hermes Decode

This binary is used to decode arbitrary data into a single
or sequence of Hermes packets through an XTCE specification.

It is a terminal-based user interface to view packets and their
decoded parameters as they are streamed into STDIN.

## Input format

Packet frames must stream into STDIN using the following format:

```
<size: u32 big endian>
<u8 * size>
```
