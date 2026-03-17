package host

import (
	"context"
	"errors"
	"slices"

	"github.com/nasa/hermes/pkg/pb"
)

var ErrSequenceWithImmediate = errors.New("sequencing language only supports immediate commanding")

type FswInfo struct {
	// Unique identifier, name of the FSW.
	// This is usually a human readable value rather than a uid.
	Id string `json:"id,omitempty"`

	// FSW type
	Type string `json:"type,omitempty"`

	// Telemetry from these FSW IDs should be treated as though they
	// also came from this FSW. Useful for when you need a custom language
	// context that wraps multiple FSWs
	Forwards []string `json:"forwards,omitempty"`

	// An optional set of FSW capabilities that allows runtime configuration of
	// connection capability
	Capabilities []pb.FswCapability

	// (optional) Dictionary ID to use to command this FSW
	Dictionary string `json:"dictionary,omitempty"`
}

func (f FswInfo) HasCapability(c pb.FswCapability) bool {
	if len(f.Capabilities) == 0 {
		// If FSW has _no_ capabilities we assume the runtime will cast
		// the fsw interfaces up to the proper interface
		return true
	} else {
		return slices.Contains(f.Capabilities, c)
	}
}

// Interface for FSW interface to get data to uplink to the
// uplink stream
type UplinkSource interface {
	// Get the next chunk of bytes to uplink
	// The next Recv() call should not happen until the
	// last packet was processed to properly implement stream back-pressure
	//
	// io.EOF error will be returned once the last chunk has been sent
	// Other errors should kill the uplink
	Recv() ([]byte, error)
}

// Basic connection metadata
// To make this useful, one (or more) of the FSW
// extensions should be implemented
type Fsw interface {
	Info() FswInfo
}

// Some clients send commands with the def mostly unfilled.
// The while the mnemonic is required, the argument defs are not.
// This allows simplistic clients to send semi-parsed commands and
// have the backend perform the more complex parsing/dictionary operations.
//
// If this FSW supports these types of clients, they should implement this interface.
// Normally this is just a matter of calling host.CommandUpdate() with the proper dictionary,
// but could be a bit more involved if there are special parameters or multiple dictionaries.
//
// If implemented, this will be called on Command() and Sequence() endpoints at the RPC end before
// they are passed to the Command()/Sequence() interfaces of the FSW.
type CmdFswParser interface {
	Fsw
	ParseCommand(ctx context.Context, cmd *pb.RawCommandValue) (*pb.CommandValue, error)
}

// This interface allows the FSW to hook into the full parsing of a sequence
// If this is not implement and CmdFswParser is implemented, sequence parsing will
// feed uncommented lines to `CmdFswParser`.
type SeqFswParser interface {
	Fsw
	ParseSequence(ctx context.Context, cmd *pb.RawCommandSequence) (*pb.CommandSequence, error)
}

// A FSW connection that supports immediate commanding
// Immediate commanding is used if this FSW does not support
// the `SeqFsw` interface.
type CmdFsw interface {
	Fsw

	// Send a command to the FSW. Wait for
	// completion or otherwise, up to the
	// plugin to decide when the promise resolves.
	//
	// Returning 'true' indicates the command succeeded
	// Returning an error instead of just `false, nil` indicates
	// the command failure to send or was cancelled rather than just failed to execute
	Command(ctx context.Context, cmd *pb.CommandValue) (bool, error)
}

// A FSW connection that supports generic requests
type RequestFsw interface {
	Fsw

	// Send a request to the FSW. Requests
	// are not defined in the dictionary. Requests here
	// are defined by an agreement between the frontend
	// implementation and the backend implementation.
	Request(ctx context.Context, kind string, data []byte) ([]byte, error)
}

// A FSW connection that supports uplinking/dispatching a sequence of commands.
type SeqFsw interface {
	Fsw

	// Uplink a sequence to the FSW's filesystem and kick it off
	// with an immediate command.
	// A context cancellation should optionally notify the immediate cancellation
	// of the sequence (if possible).
	Sequence(ctx context.Context, seq *pb.CommandSequence) (bool, error)
}

// A FSW connection that supports file uplink
type UplinkFsw interface {
	Fsw

	// Uplink a file to the FSW.
	// ctx: cancellation context
	// header: file uplink metadata header
	// data: interface for receiving file chunks to uplink
	Uplink(
		ctx context.Context,
		header *pb.FileHeader,
		data UplinkSource,
	) error
}
