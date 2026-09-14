package ccsds

import (
	"encoding/binary"
	"testing"

	"github.com/nasa/hermes/pkg/serial"
	"github.com/stretchr/testify/require"
)

func TestPayloadLengthMaximum(t *testing.T) {
	reader := serial.NewReader([]byte{0xff, 0xff}, serial.WithByteOrder(binary.BigEndian))
	var length PayloadLength
	require.NoError(t, length.Unmarshal(reader))
	require.Equal(t, PayloadLength(65536), length)

	writer := serial.NewWriter(serial.WithWriterByteOrder(binary.BigEndian))
	require.NoError(t, length.Marshal(writer))
	require.Equal(t, []byte{0xff, 0xff}, writer.Get())
}

func TestPayloadLengthRejectsOversizeValue(t *testing.T) {
	writer := serial.NewWriter(serial.WithWriterByteOrder(binary.BigEndian))
	err := PayloadLength(65537).Marshal(writer)
	require.ErrorContains(t, err, "exceeds CCSDS maximum")
	require.Empty(t, writer.Get())
}

func TestPacketRejectsTruncatedMaximumLengthPayload(t *testing.T) {
	packet := &Packet{}
	err := packet.Unmarshal(serial.NewReader([]byte{0, 0, 0, 0, 0xff, 0xff}))
	require.ErrorContains(t, err, "readSize=65536 EOF")
	require.Empty(t, packet.Payload)
}

func TestPacketAcceptsCompleteMaximumLengthPayload(t *testing.T) {
	data := make([]byte, 6+65536)
	data[4] = 0xff
	data[5] = 0xff
	packet := &Packet{}
	require.NoError(t, packet.Unmarshal(serial.NewReader(data)))
	require.Len(t, packet.Payload, 65536)
}
