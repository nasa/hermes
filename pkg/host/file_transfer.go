package host

import (
	"context"
	"slices"
	"sync"
	"time"

	"github.com/nasa/hermes/pkg/pb"
	"google.golang.org/protobuf/proto"
)

type FileTransferBus struct {
	mux sync.Mutex
	bus *Bus[*pb.FileTransferState]

	state *pb.FileTransferState
	dirty bool
}

func NewFileTransferBus() *FileTransferBus {
	out := &FileTransferBus{
		bus: NewBus[*pb.FileTransferState]("FileTransfer"),
		state: &pb.FileTransferState{
			DownlinkCompleted:  []*pb.FileDownlink{},
			UplinkCompleted:    []*pb.FileUplink{},
			DownlinkInProgress: []*pb.FileTransfer{},
			UplinkInProgress:   []*pb.FileTransfer{},
		},
		dirty: false,
	}

	go func() {
		for {
			// Sync up file transfer progress @1Hz
			<-time.After(time.Second)
			out.sync()
		}
	}()

	// Handle file downlink completion
	FileDownlink.On(context.Background(), func(msg *pb.FileDownlink) {
		defer out.sync()

		out.mux.Lock()
		defer out.mux.Unlock()

		out.state.DownlinkInProgress = slices.DeleteFunc(out.state.DownlinkInProgress, func(s *pb.FileTransfer) bool {
			return s.Uid == msg.Uid
		})

		out.state.DownlinkCompleted = append(out.state.DownlinkCompleted, msg)
		out.dirty = true
	})

	// Handle file uplink completion
	FileUplink.On(context.Background(), func(msg *pb.FileUplink) {
		defer out.sync()

		out.mux.Lock()
		defer out.mux.Unlock()

		out.state.UplinkInProgress = slices.DeleteFunc(out.state.UplinkInProgress, func(s *pb.FileTransfer) bool {
			return s.Uid == msg.Uid
		})
		out.state.UplinkCompleted = append(out.state.UplinkCompleted, msg)
		out.dirty = true
	})

	return out
}

func (b *FileTransferBus) AddDownlink(
	uid string,
	source string,
	sourcePath string,
	destinationPath string,
	fileSize uint64,
) {
	defer b.sync()

	b.mux.Lock()
	defer b.mux.Unlock()

	fileTransfer := &pb.FileTransfer{
		Uid:        uid,
		FswId:      source,
		SourcePath: sourcePath,
		TargetPath: destinationPath,
		Size:       fileSize,
		Progress:   0,
	}

	b.state.DownlinkInProgress = append(b.state.DownlinkInProgress, fileTransfer)
	b.dirty = true
}

func (b *FileTransferBus) DownlinkProgress(uid string, chunkSize uint64) {
	b.mux.Lock()
	defer b.mux.Unlock()

	for _, item := range b.state.DownlinkInProgress {
		if item.Uid == uid {
			item.Progress += chunkSize
			b.dirty = true
		}
	}
}

func (b *FileTransferBus) AddUplink(
	uid string,
	source string,
	sourcePath string,
	destinationPath string,
	fileSize uint64,
) {
	defer b.sync()

	b.mux.Lock()
	defer b.mux.Unlock()

	fileTransfer := &pb.FileTransfer{
		Uid:        uid,
		FswId:      source,
		SourcePath: sourcePath,
		TargetPath: destinationPath,
		Size:       fileSize,
		Progress:   0,
	}

	b.state.UplinkInProgress = append(b.state.UplinkInProgress, fileTransfer)
	b.dirty = true
}

func (b *FileTransferBus) UplinkProgress(uid string, chunkSize uint64) {
	b.mux.Lock()
	defer b.mux.Unlock()

	for _, item := range b.state.UplinkInProgress {
		if item.Uid == uid {
			item.Progress += chunkSize
			b.dirty = true
		}
	}
}

func (b *FileTransferBus) sync() {
	b.mux.Lock()
	if b.dirty {
		b.dirty = false
		duped := proto.CloneOf(b.state)
		b.mux.Unlock()

		b.bus.Emit(duped)
	} else {
		b.mux.Unlock()
	}
}

// Wait for a message matching a predicate criteria to be met
// This is a blocking call.
// The context can be used to cancel the wait operation and will return the context error.
// Upon a successful wait operation, the message that matched the criteria will be returned
func (b *FileTransferBus) Wait(ctx context.Context, predicate BusPredicate[*pb.FileTransferState]) chan *pb.FileTransferState {
	return b.bus.Wait(ctx, predicate)
}

// Attaches a function callback that runs in order on every event that is emitted
// on this message bus. Calls to the handler are performed in a SINGLE goroutine
// meaning that the handler will not process multiple messages at the same time.
//
// The context is used to cancel the subscription to the message bus
func (b *FileTransferBus) On(ctx context.Context, handler BusEventHandler[*pb.FileTransferState]) {
	b.bus.On(ctx, handler)
}

// Flush implements stream.FlushableStream.
func (b *FileTransferBus) Flush(ctx context.Context) error {
	return b.bus.Flush(ctx)
}

func (b *FileTransferBus) State() *pb.FileTransferState {
	b.mux.Lock()
	defer b.mux.Unlock()

	return proto.CloneOf(b.state)
}

func (b *FileTransferBus) ClearDownlink() {
	defer b.sync()

	b.mux.Lock()
	defer b.mux.Unlock()

	b.state.DownlinkCompleted = []*pb.FileDownlink{}
	b.dirty = true
}

func (b *FileTransferBus) ClearUplink() {
	defer b.sync()

	b.mux.Lock()
	defer b.mux.Unlock()

	b.state.UplinkCompleted = []*pb.FileUplink{}
	b.dirty = true
}
