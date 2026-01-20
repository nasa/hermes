package fprime

import (
	"fmt"

	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/serial"
)

type CommandPacket struct {
	// Dictionary definition of the command
	Def *pb.CommandDef

	// Command arguments
	Args []*pb.Value
}

func (p *CommandPacket) Unmarshal(r *serial.Reader) error {
	return fmt.Errorf("command packets should not be decoded")
}

func (p *CommandPacket) Marshal(w *serial.Writer) error {
	if len(p.Def.Arguments) != len(p.Args) {
		return fmt.Errorf(
			"argument count mismatch %d (value) != %d (dict)",
			len(p.Def.Arguments),
			len(p.Args),
		)
	}

	err := w.IntKind(Config.OpcodeType, int64(p.Def.Opcode))
	if err != nil {
		return fmt.Errorf("failed to write opcode: %w", err)
	}

	for i, argDef := range p.Def.Arguments {
		arg := p.Args[i]
		err := w.Type(argDef.Type, arg)
		if err != nil {
			return fmt.Errorf("failed to write argument %s [%d]: %w", argDef.Name, i, err)
		}
	}

	return nil
}

func (p *FileStartPacket) AsFilePacket(sequenceIndex uint32) *FilePacket {
	return &FilePacket{
		Type:          FilePacketType_START,
		SequenceIndex: sequenceIndex,
		Payload:       p,
	}
}

func (p *FileDataPacket) AsFilePacket(sequenceIndex uint32) *FilePacket {
	return &FilePacket{
		Type:          FilePacketType_DATA,
		SequenceIndex: sequenceIndex,
		Payload:       p,
	}
}

func (p *FileEndPacket) AsFilePacket(sequenceIndex uint32) *FilePacket {
	return &FilePacket{
		Type:          FilePacketType_END,
		SequenceIndex: sequenceIndex,
		Payload:       p,
	}
}

func (p *FileCancelPacket) AsFilePacket(sequenceIndex uint32) *FilePacket {
	return &FilePacket{
		Type:          FilePacketType_CANCEL,
		SequenceIndex: sequenceIndex,
		Payload:       p,
	}
}

func (p *FilePacket) AsPacket() *Packet {
	return &Packet{
		Type:    PacketType_FILE,
		Payload: p,
	}
}

func (p *CommandPacket) AsPacket() *Packet {
	return &Packet{
		Type:    PacketType_COMMAND,
		Payload: p,
	}
}
