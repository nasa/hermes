package fprime

import (
	"context"
	"fmt"
	"io"
	"sync"
	"time"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/serial"
	"github.com/nasa/hermes/pkg/stream"
)

type framer interface {
	Read() chan []byte
	Write(*Packet) ([]byte, error)
}

func ConnectPipeline(
	ctx context.Context,
	logger log.Logger,
	wg *sync.WaitGroup,
	dictionary *host.DictionaryNamespace,
	dictionaryTlmPackets *host.DictionaryNamespace,
	conn io.ReadWriteCloser,
	framerImpl framer,
	downlink chan *Packet,
	uplink stream.Port[*Packet],
) {
	// Downlink
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer close(downlink)

		r := serial.NewReader(nil)
		dl := framerImpl.Read()
		for {
			select {
			case pktRaw, ok := <-dl:
				if !ok {
					return
				}

				var pkt Packet
				r.Set(pktRaw)
				err := pkt.Unmarshal(r, dictionary, dictionaryTlmPackets)
				if err != nil {
					logger.Error("failed to decode fprime packet", "err", err)
				} else {
					downlink <- &pkt
				}
			case <-ctx.Done():
				return
			}
		}
	}()

	stream.Foreach(wg, uplink, func(ctx context.Context, pkt *Packet) error {
		raw, err := framerImpl.Write(pkt)
		if err != nil {
			return fmt.Errorf("fprime packet framing failed: %w", err)
		}

		_, err = conn.Write(raw)
		if err != nil {
			return fmt.Errorf("failed to write fprime packet to socket: %w", err)
		}

		// Slow the uplink if its requested
		if Config.UplinkRateLimit > 0 {
			s := float64(len(raw)) / Config.UplinkRateLimit
			dt := time.Duration(s*1e6) * time.Microsecond

			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(dt):
			}
		}

		return nil
	})
}
