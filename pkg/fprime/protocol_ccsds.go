package fprime

import (
	"bufio"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"net"
	"slices"
	"strconv"

	"github.com/nasa/hermes/pkg/ccsds"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/serial"
)

var (
	_ framer = (*ccsdsProtocol)(nil)
)

type ccsdsProtocol struct {
	logger         log.Logger
	conn           *bufio.Reader
	r              *serial.Reader
	dictionary     *host.DictionaryNamespace
	cfg            ccsdsCfg
	sequenceNumber uint16
}

// Write implements framer.
func (c *ccsdsProtocol) Write(pkt *Packet) ([]byte, error) {
	w := serial.NewWriter(serial.WithWriterByteOrder(binary.BigEndian))
	err := pkt.Marshal(w, c.dictionary)
	if err != nil {
		return nil, fmt.Errorf("failed to encode fprime packet: %w", err)
	}

	var apid uint16
	switch pkt.Type {
	case PacketType_COMMAND:
		apid = c.cfg.Cmd
	case PacketType_FILE:
		apid = c.cfg.File
	default:
		return nil, fmt.Errorf("unexpected uplink fprime.PacketType: %#v", pkt.Type)
	}

	spp := ccsds.Packet{
		Type:            ccsds.PacketType_TELECOMMAND,
		SecondaryHeader: 0,
		Apid:            apid,
		SequenceFlags:   ccsds.SequenceFlag_UNSEGMENTED,
		SequenceCount:   c.sequenceNumber,
		Payload:         w.Get(),
	}

	c.sequenceNumber += 1

	w.Reset()
	err = spp.Marshal(w)
	if err != nil {
		return nil, fmt.Errorf("failed to encode space packet: %w", err)
	}

	tc := ccsds.TcFrame{
		SpacecraftId:     c.cfg.SpacecraftId,
		VirtualChannelId: 0,
		// Fprime disables FARM checks so this doesn't get checked
		// Sequence count is only checked for space packet
		FrameSequence: 0,
		Payload:       w.Get(),
	}

	w.Reset()
	err = tc.Marshal(w, true)
	if err != nil {
		return nil, fmt.Errorf("failed to encode tc frame: %w", err)
	}

	return w.Get(), nil
}

func NewCcsdsProtocol(
	r io.Reader,
	logger log.Logger,
	dict *host.Dictionary,
) (framer, error) {
	apidCfg, err := getCcsdsCfg(dict)
	if err != nil {
		return nil, err
	}

	logger.Info(
		"loadded CCSDS configuration",
		"spaceraftId", apidCfg.SpacecraftId,
		"apidCmd", apidCfg.Cmd,
		"apidFile", apidCfg.File,
		"apidLog", apidCfg.Log,
		"apidTlm", apidCfg.Tlm,
		"apidTlmPkt", apidCfg.PktTlm,
		"apidDp", apidCfg.Dp,
	)

	return &ccsdsProtocol{
		logger:     logger,
		conn:       bufio.NewReader(r),
		r:          serial.NewReader(nil),
		dictionary: dict.Namespace(""),
		cfg:        apidCfg,
	}, nil
}

// Read implements framer.
func (f *ccsdsProtocol) Read() chan []byte {
	downlink := make(chan []byte, 16)

	go func() {
		defer close(downlink)

		for {
			// TmFramer uses fixed size encoding
			b := make([]byte, 1024)
			_, err := io.ReadFull(f.conn, b)
			if errors.Is(err, io.EOF) || errors.Is(err, net.ErrClosed) {
				return
			} else if err != nil {
				f.logger.Error("failed to read ccsds tm frame from stream", "err", err)
				continue
			}

			var tm ccsds.TmFrame

			f.r.Set(b)
			err = tm.Unmarshal(f.r, true)
			if err != nil {
				f.logger.Error("failed to decode ccsds tm frame from stream", "err", err)
				continue
			}

			f.r.Set(tm.Payload)

			for {
				var spp ccsds.Packet
				err = spp.Unmarshal(f.r)
				if errors.Is(err, io.EOF) {
					break
				} else if err != nil {
					f.logger.Error("failed to decode ccsds space packet", "err", err)
					break
				}

				switch spp.Apid {
				case f.cfg.Log, f.cfg.Tlm, f.cfg.PktTlm, f.cfg.File, f.cfg.Dp:
					// Valid downlink packets
					downlink <- spp.Payload
				case f.cfg.Idle, f.cfg.SppIdle:
					// Nop, skip
				case f.cfg.Hand:
					// TODO(tumbar) What do we do with this?
					f.logger.Debug("received an Fprime HANDSHAKE packet", "payload", spp.Payload)
				default:
					f.logger.Warn("unknown CCSDS space packet APID", "apid", spp.Apid, "payload", spp.Payload)
				}
			}
		}
	}()

	return downlink
}

type ccsdsCfg struct {
	SpacecraftId uint16

	Cmd     uint16
	Tlm     uint16
	Log     uint16
	File    uint16
	PktTlm  uint16
	Dp      uint16
	Idle    uint16
	Hand    uint16
	Unknown uint16
	SppIdle uint16
}

func getEnumItem(apidEnum *pb.EnumType, name string) (uint16, error) {
	idx := slices.IndexFunc(apidEnum.Items, func(e *pb.EnumItem) bool {
		return e.Name == name
	})

	if idx < 0 {
		return 0, fmt.Errorf("could not find %s in ComCfg.Apid which is required for CCSDS protocol deframing", name)
	}

	return uint16(apidEnum.Items[idx].Value), nil
}

func getCcsdsCfg(dictionary *host.Dictionary) (ccsdsCfg, error) {
	var out ccsdsCfg

	scidS := dictionary.Metadata["SpacecraftId"]
	if scidS == "" {
		return out, fmt.Errorf("dictionary does not include ComCfg.SpacecraftId constant")
	}

	scid, err := strconv.ParseUint(scidS, 10, 10)
	if err != nil {
		return out, fmt.Errorf("failed to convert spacecraft id to 10-bit integer: %w", err)
	}

	out.SpacecraftId = uint16(scid)

	ns := dictionary.Namespace("")

	apidRaw := ns.Types["ComCfg.Apid"]
	apid := apidRaw.GetEnum()
	if apid == nil {
		return out, errors.New("dictionary does not include ComCfg.Apid enum")
	}

	out.Cmd, err = getEnumItem(apid, "FW_PACKET_COMMAND")
	if err != nil {
		return out, err
	}

	out.Tlm, err = getEnumItem(apid, "FW_PACKET_TELEM")
	if err != nil {
		return out, err
	}

	out.Log, err = getEnumItem(apid, "FW_PACKET_LOG")
	if err != nil {
		return out, err
	}

	out.File, err = getEnumItem(apid, "FW_PACKET_FILE")
	if err != nil {
		return out, err
	}

	out.PktTlm, err = getEnumItem(apid, "FW_PACKET_PACKETIZED_TLM")
	if err != nil {
		return out, err
	}

	out.Dp, err = getEnumItem(apid, "FW_PACKET_DP")
	if err != nil {
		return out, err
	}

	out.Idle, err = getEnumItem(apid, "FW_PACKET_IDLE")
	if err != nil {
		return out, err
	}

	out.Hand, err = getEnumItem(apid, "FW_PACKET_HAND")
	if err != nil {
		return out, err
	}

	out.SppIdle, err = getEnumItem(apid, "SPP_IDLE_PACKET")
	if err != nil {
		return out, err
	}

	return out, nil
}
