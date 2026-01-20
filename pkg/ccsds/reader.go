package ccsds

import (
	"encoding/binary"
	"errors"
	"io"
	"slices"

	"github.com/nasa/hermes/pkg/log"
)

type sppDeframer struct {
	r   io.Reader
	out chan []byte
	log log.Logger
}

func (s *sppDeframer) readLoop() {
	header := make([]byte, 6)
	defer close(s.out)

	for {
		_, err := io.ReadFull(s.r, header)
		if err != nil {
			if errors.Is(err, io.EOF) {
				break
			} else {
				s.log.Error("failed to read header", "err", err)
				return
			}
		}

		pktLength := binary.BigEndian.Uint16(header[4:])
		payload := make([]byte, pktLength+1)
		_, err = io.ReadFull(s.r, payload)
		if err != nil {
			if errors.Is(err, io.EOF) {
				s.log.Warn("failed to read final packet from stream", "err", err)
				break
			} else {
				s.log.Error("failed to read header", "err", err)
				return
			}
		}

		pkt := slices.Grow[[]byte](nil, len(header)+len(payload))
		pkt = append(pkt, header...)
		pkt = append(pkt, payload...)

		s.out <- pkt
	}

}

func NewSppDeframer(r io.Reader, logger log.Logger) chan []byte {
	deframer := &sppDeframer{
		r:   r,
		out: make(chan []byte),
		log: logger,
	}

	go deframer.readLoop()
	return deframer.out
}
