package fprime

import (
	"context"
	"errors"
	"fmt"
	"io"
	"sync"

	"github.com/nasa/hermes/pkg/dwn"
	"github.com/nasa/hermes/pkg/hash"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/stream"
)

func NewFileChunker(
	wg *sync.WaitGroup,
	chunkSize int,
	in stream.Port[[]byte],
) stream.Port[[]byte] {
	out := stream.NewPort[[]byte]()

	wg.Add(1)
	go func() {
		defer wg.Done()
		defer close(out)

		var buffer []byte
		for msg := range in {
			if data, ok := msg.Get(); ok {
				var err error

				if data == nil {
					// Flush the buffer
					for len(buffer) >= chunkSize {
						err = stream.SendAndAwait(context.Background(), out, buffer[:chunkSize])
						buffer = buffer[chunkSize:]
						if err != nil {
							break
						}
					}

					if err == nil && len(buffer) > 0 {
						err = stream.SendAndAwait(context.Background(), out, buffer)
						buffer = make([]byte, 0)
					}

				} else {
					// Add the message to the buffer
					buffer = append(buffer, data...)

					// Push each chunk through
					for len(buffer) >= chunkSize {
						err = stream.SendAndAwait(msg.Context(), out, buffer[:chunkSize])
						buffer = buffer[chunkSize:]

						if err != nil {
							break
						}
					}
				}

				msg.Reply(err)
			}
		}
	}()

	return out
}

type fileUplink struct {
	header *pb.FileHeader

	checksum      hash.Hash[uint32]
	sequenceIndex uint32
	offset        uint32

	finished bool
}

// Process implements stream.Transform.
func (f *fileUplink) processChunk(data []byte, push func(*FilePacket) error) error {
	if f.finished {
		return fmt.Errorf("attempting to send data passed the end of the file")
	}

	if f.sequenceIndex == 0 {
		// Push the start packet to the stream
		srcPath := f.header.SourcePath
		if Config.UplinkTruncateSourcePath {
			srcPath = "/"
		}

		err := push((&FileStartPacket{
			Size:        uint32(f.header.Size),
			Source:      srcPath,
			Destination: f.header.DestinationPath,
		}).AsFilePacket(0))

		if err != nil {
			return fmt.Errorf("failed to uplink start packet: %w", err)
		}

		f.sequenceIndex = 1
		f.offset = 0
	}

	f.checksum.Update(data)

	err := push((&FileDataPacket{
		Offset: f.offset,
		Data:   data,
	}).AsFilePacket(f.sequenceIndex))

	if err != nil {
		return fmt.Errorf("failed to uplink data packet: %w", err)
	}

	f.sequenceIndex++
	f.offset += uint32(len(data))

	// If we have sent the entire file, send the end packet
	if f.offset >= uint32(f.header.Size) {
		f.finished = true

		err := push((&FileEndPacket{
			CRC: f.checksum.Finish(),
		}).AsFilePacket(f.sequenceIndex))

		if err != nil {
			return fmt.Errorf("failed to end data packet: %w", err)
		}

		f.sequenceIndex++

		if f.offset > uint32(f.header.Size) {
			return fmt.Errorf(
				"wrote more data than the file size: wrote %d bytes expected %d bytes",
				f.offset,
				f.header.Size,
			)
		}
	}

	return nil
}

func uplinkFile(
	wg *sync.WaitGroup,
	header *pb.FileHeader,
	chunks stream.Port[[]byte],
	uplink stream.Port[*Packet],
) {
	u := &fileUplink{
		header:        header,
		checksum:      hash.NewCFDP(),
		sequenceIndex: 0,
		offset:        0,
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		for msg := range chunks {
			if chunk, ok := msg.Get(); ok {
				msg.Reply(u.processChunk(chunk, func(fp *FilePacket) error {
					return stream.SendAndAwait(msg.Context(), uplink, fp.AsPacket())
				}))
			}
		}
	}()
}

type fileDownlinkValidator struct {
	ExpectedHash      uint32
	Hasher            hash.Hash[uint32]
	ExpectedHashValid bool
}

func (v *fileDownlinkValidator) Validate(reader io.Reader) error {
	if !v.ExpectedHashValid {
		return fmt.Errorf("invalid expected hash, no expected crc received")
	}

	chunk := make([]byte, 32768)
	v.Hasher.Reset()

	for {
		n, err := reader.Read(chunk)
		if n > 0 {
			// Feed the bytes to the hasher
			v.Hasher.Update(chunk[:n])
		}

		if err != nil {
			if errors.Is(err, io.EOF) {
				// No more bytes
				break
			} else {
				// Failed to read a chunk
				return fmt.Errorf("read failed: %w", err)
			}
		}
	}

	computedHash := v.Hasher.Finish()
	if computedHash != v.ExpectedHash {
		return &stream.ErrCrcMismatch{
			Computed: computedHash,
			Received: v.ExpectedHash,
		}
	}

	// Hashes match, report no errors
	return nil
}

type FileDownlink struct {
	source string

	logger        log.Logger
	session       *dwn.DownlinkSession
	fileValidator *fileDownlinkValidator
}

func NewFileDownlink(source string, logger log.Logger) *FileDownlink {
	return &FileDownlink{
		source:  source,
		logger:  logger,
		session: nil,

		fileValidator: &fileDownlinkValidator{
			Hasher: hash.NewCFDP(),
		},
	}
}

// Write implements stream.WritableStream.
func (f *FileDownlink) Write(fp *FilePacket) error {
	switch packet := fp.Payload.(type) {
	case *FileStartPacket:
		if f.session != nil {
			f.logger.Warn("received an unexpected file start packet, cancelling current downlink")
			f.session.Finish()
			f.session = nil
		}

		f.fileValidator.ExpectedHashValid = false
		dlSession, err := dwn.NewDownlinkSession(
			f.logger,
			f.source,
			packet.Source,
			packet.Destination,
			uint64(packet.Size),
			f.fileValidator,
		)

		if err != nil {
			f.logger.Error("failed to start downlink session", "err", err)
			// This is not a decoding related error, don't report it to the pipeline
			return nil
		}

		f.session = dlSession
	case *FileDataPacket:
		if f.session == nil {
			f.logger.Warn(
				"dropping file data packet with no active downlink session",
				"index", fp.SequenceIndex,
				"offset", packet.Offset,
				"size", len(packet.Data),
			)

			return nil
		}

		f.session.Chunk(&dwn.DownlinkChunk{
			Offset: uint64(packet.Offset),
			Data:   packet.Data,
		})
	case *FileEndPacket:
		if f.session == nil {
			f.logger.Warn(
				"dropping file end packet with no active downlink session",
				"index", fp.SequenceIndex,
			)

			return nil
		}

		// Feed the expected hash to the validator
		f.fileValidator.ExpectedHash = packet.CRC
		f.fileValidator.ExpectedHashValid = true

		f.session.Finish()
		f.session = nil
	case *FileCancelPacket:
		if f.session != nil {
			f.logger.Info("cancelling current file downlink (received 'cancel' packet)")
			f.session.Finish()
			f.session = nil
		} else {
			f.logger.Warn(
				"dropping file cancel packet with no active downlink session",
				"index", fp.SequenceIndex,
			)

			return nil
		}
	default:
		return fmt.Errorf("unexpected downlink packet type: %T", packet)
	}

	return nil
}

// End implements stream.WritableStream.
func (f *FileDownlink) End() {
	if f.session != nil {
		f.logger.Warn("closed during active downlink session")
		f.session.Finish()
		f.session = nil
	}
}

func (f *FileDownlink) Close() {
	if f.session != nil {
		f.logger.Info("cancelling current file downlink (processor closed)")
		f.session.Finish()
		f.session.Wait()
		f.session = nil
	}
}
