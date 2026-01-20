package stream

import (
	"bufio"
	"context"
	"errors"
	"io"
	"net"
	"slices"
	"sync"
	"time"

	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/log"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
)

var metricDroppedBytes, _ = infra.Meter.Int64Counter(
	"hermes.protocol.dropped",
	metric.WithDescription("Number of dropped bytes on this protocol"),
	metric.WithUnit("By"),
)

var metricCrcMismatch, _ = infra.Meter.Int64Counter(
	"hermes.protocol.crcErrors",
	metric.WithDescription("Number of CRC validation failures"),
)

var (
	_ Deframer = (*deframer)(nil)
)

type Deframer interface {
	// Read a packet from the stream
	// This is called immediately after reading through the `StartDelim`
	// Implementation should read only a simple packet and return the packet bytes or nil if error
	Read(r *bufio.Reader) ([]byte, error)
}

type deframer struct {
	read func(r *bufio.Reader) ([]byte, error)
}

// Read implements Deframer.
func (d *deframer) Read(r *bufio.Reader) ([]byte, error) {
	return d.read(r)
}

func NewDeframerFunc(read func(r *bufio.Reader) ([]byte, error)) Deframer {
	return &deframer{read: read}
}

type DeframerSettings struct {
	// Metadata used for instrumentation purposes
	Name string

	// Should be fairly large, enough to fit a packet (not required)
	BufferSize int

	// Denotes the sync-marker at the start of a packet.
	// The deframer will read until it sees this byte sequence and then pass the reader to
	// the deframer implementation to extract the packet
	Delim []byte
}

type iodeframer struct {
	attr       metric.MeasurementOption
	log        log.Logger
	startDelim []byte

	impl  Deframer
	r     *bufio.Reader
	queue chan []byte
}

// Wraps a io.Reader in a buffered io reader and generates a packet stream
// Packet streams from io.Readers are useful when using faulty transports that may
// drop some data or may be already sending bytes when we start reading (i.e. communicating with FSW)
func NewDeframerStream(
	r io.Reader,
	cfg DeframerSettings,
	impl Deframer,
) chan []byte {
	out := &iodeframer{
		attr:       metric.WithAttributes(attribute.String("name", cfg.Name)),
		log:        log.GetLogger(context.TODO()),
		startDelim: cfg.Delim,

		impl:  impl,
		r:     bufio.NewReaderSize(r, cfg.BufferSize),
		queue: make(chan []byte, 32),
	}

	go out.readLoop()
	return out.queue
}

func (s *iodeframer) readLoop() {
	if len(s.startDelim) < 1 {
		// No delim means just call out to the reader directly
		for {
			pkt, err := s.impl.Read(s.r)
			if err != nil {
				var errCRC *ErrCrcMismatch
				if errors.As(err, &errCRC) {
					metricCrcMismatch.Add(context.Background(), 1, s.attr)
					s.log.Warn(err.Error())
				} else if errors.Is(err, io.EOF) || errors.Is(err, net.ErrClosed) {
					// Stream is closed
					return
				} else {
					s.log.Error("failed to read packet from stream reader", "err", err)
				}
			} else if pkt != nil {
				// Valid packet, send down the pipe
				s.queue <- pkt
			}
		}
	}

	delimVerify := make([]byte, len(s.startDelim)-1)

	metricDroppedBytes.Add(context.Background(), 0, s.attr)
	metricCrcMismatch.Add(context.Background(), 0, s.attr)

	for {
		preSyncData, err := s.r.ReadSlice(s.startDelim[0])
		if err != nil {
			if len(preSyncData) > 0 {
				// Buffer probably filled up, if we read any data we should drop of the pre-sync marker bytes
				metricDroppedBytes.Add(context.Background(), int64(len(preSyncData)), s.attr)
				s.log.Warn("dropping data bytes before sync marker (buffer full)", "n", len(preSyncData))

				// It may be possible to recover from this error
				continue
			} else if errors.Is(err, io.EOF) || errors.Is(err, net.ErrClosed) {
				// Stream is closed
				break
			} else {
				// unrecoverable error (i.e. no data was read)
				s.log.Error("failed to read from input stream", "err", err)
			}
		}

		// One character should be in preSyncData (i.e. the first byte of the sync marker)
		// If there is more data there were bytes before the sync marker and we need to drop them
		if len(preSyncData) > 1 {
			// TODO(tumbar) We shouldn't drop this data but rather assume its a packet and pass it to the validator
			// I'm not sure how this given the current api
			metricDroppedBytes.Add(context.Background(), int64(len(preSyncData)), s.attr)
			s.log.Warn("dropping data bytes before sync marker", "n", len(preSyncData))
		}

		n, err := io.ReadFull(s.r, delimVerify)
		if err != nil {
			if n > 0 {
				metricDroppedBytes.Add(context.Background(), int64(n), s.attr)
				s.log.Error("failed to read rest of sync marker, dropping bytes", "n", n, "err", err)
			} else {
				s.log.Error("failed to read rest of sync marker", "err", err)
			}

			break
		}

		if slices.Compare(delimVerify, s.startDelim[1:]) == 0 {
			// Valid slice, pass to the reader
			pkt, err := s.impl.Read(s.r)
			if err != nil {
				var errCRC *ErrCrcMismatch
				if errors.As(err, &errCRC) {
					metricCrcMismatch.Add(context.Background(), 1, s.attr)
					s.log.Warn(err.Error())
				} else {
					s.log.Error("failed to read packet from stream reader", "err", err)
				}
			} else if pkt != nil {
				// Valid packet, send down the pipe
				s.queue <- pkt
			}
		} else {
			// Drop the rest of the sync
			metricDroppedBytes.Add(context.Background(), int64(len(s.startDelim)), s.attr)
			s.log.Warn("dropping (false) sync marker", "n", len(s.startDelim))
		}
	}

	close(s.queue)
}

// Creates a new transform stream that limits the throughput rate of a transfer
func NewRateLimiter(wg *sync.WaitGroup, bytesPerSecond float64, in Port[[]byte]) Port[[]byte] {
	out := NewPort[[]byte]()

	wg.Add(1)
	go func() {
		defer wg.Done()

		for msg := range in {
			if data, ok := msg.Get(); ok {
				startTime := time.Now()

				err := SendAndAwait(msg.Context(), out, data)

				if err != nil {
					msg.Reply(err)
					continue
				}

				seconds := time.Duration((float64(len(data)) / bytesPerSecond) * float64(time.Second))
				select {
				case <-time.After(seconds - time.Since(startTime)):
					msg.Reply(nil)
				case <-msg.Context().Done():
					msg.Reply(msg.Context().Err())
				}
			}
		}
	}()

	return out
}
