package fprime

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"io"

	"github.com/nasa/hermes/pkg/hash"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/serial"
	"github.com/nasa/hermes/pkg/stream"
)

const START_WORD = 0xDEADBEEF

var fprimeProtocolStartWord = binary.BigEndian.AppendUint32([]byte{}, START_WORD)

var (
	_ stream.Deframer = (*fprimeProtocolDeframer)(nil)
	_ framer          = (*fprimeProtocol)(nil)
)

type fprimeProtocolDeframer struct{}
type fprimeProtocol struct {
	dictionary *host.DictionaryNamespace
	downlink   chan []byte
}

func NewFprimeProtocol(r io.Reader, dict *host.DictionaryNamespace) framer {
	return &fprimeProtocol{
		downlink:   NewFprimeProtocolDeframer(r),
		dictionary: dict,
	}
}

// Read implements framer.
func (f *fprimeProtocol) Read() chan []byte {
	return f.downlink
}

// Write implements framer.
func (f *fprimeProtocol) Write(pkt *Packet) ([]byte, error) {
	w := serial.NewWriter(serial.WithWriterByteOrder(binary.BigEndian))
	pkt.Marshal(w, f.dictionary)
	data := w.Get()

	w.Reset()
	w.U32(START_WORD)
	w.U32(uint32(len(data)))
	w.Write(data)

	crc32 := hash.NewCRC32()
	crc32.Update(w.Get())
	w.U32(crc32.Finish())
	return w.Get(), nil
}

func NewFprimeProtocolDeframer(r io.Reader) chan []byte {
	return stream.NewDeframerStream(
		r,
		stream.DeframerSettings{
			Name:       "fprime",
			BufferSize: 16384,
			Delim:      fprimeProtocolStartWord,
		},
		&fprimeProtocolDeframer{},
	)
}

// Read implements protocol.Deframer.
func (g *fprimeProtocolDeframer) Read(r *bufio.Reader) ([]byte, error) {
	sizeBytes := make([]byte, 4)
	_, err := io.ReadFull(r, sizeBytes)
	if err != nil {
		return nil, fmt.Errorf("size: %w", err)
	}

	size := binary.BigEndian.Uint32(sizeBytes)

	out := make([]byte, size)
	_, err = io.ReadFull(r, out)
	if err != nil {
		return nil, fmt.Errorf("data: %w", err)
	}

	crc32Bytes := make([]byte, 4)
	_, err = io.ReadFull(r, crc32Bytes)
	if err != nil {
		return nil, fmt.Errorf("crc: %w", err)
	}

	crc32 := hash.NewCRC32()
	crc32.Update(fprimeProtocolStartWord)
	crc32.Update(sizeBytes)
	crc32.Update(out)

	recvCrc32 := binary.BigEndian.Uint32(crc32Bytes)
	if recvCrc32 != crc32.Finish() {
		return nil, &stream.ErrCrcMismatch{
			Computed: crc32.Finish(),
			Received: recvCrc32,
		}
	}

	return out, nil
}
