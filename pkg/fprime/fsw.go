package fprime

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"sync"
	"time"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"

	"github.com/nasa/hermes/pkg/cmd"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/stream"
	"github.com/nasa/hermes/pkg/util"
)

var metricFileUplinkSent, _ = infra.Meter.Int64Counter(
	"hermes.fprime.uplink.size.sent",
	metric.WithDescription("Total bytes uplinked on this file"),
	metric.WithUnit("By"),
)

var metricFileUplinkSize, _ = infra.Meter.Int64Gauge(
	"hermes.fprime.uplink.size.total",
	metric.WithDescription("File size in bytes"),
	metric.WithUnit("By"),
)

var metricFileUplinkFailedN, _ = infra.Meter.Int64Counter(
	"hermes.fprime.uplink.count.failed",
	metric.WithDescription("Total number of files that failed to uplink from to destination"),
)

var metricFileUplinkN, _ = infra.Meter.Int64Counter(
	"hermes.fprime.uplink.count.all",
	metric.WithDescription("Total number of files uplinked to destination (failed and succesful)"),
)

var (
	_ host.CmdFsw       = (*Fsw)(nil)
	_ host.CmdFswParser = (*Fsw)(nil)
	_ host.UplinkFsw    = (*Fsw)(nil)
	_ host.RequestFsw   = (*Fsw)(nil)
)

type Fsw struct {
	host.FswInfo
	cmd.BasicCommandParser
	Up     stream.Port[*Packet]
	Down   chan *Packet
	Logger log.Logger
	File   *FileDownlink

	// Mutex that locks when a file uplink is in progress
	// FPrime uplink protocol does not support interleaved file transfers
	fileUplinkInProgress sync.Mutex

	dictionary *host.DictionaryNamespace
}

func NewFprimeFsw(
	logger log.Logger,
	name string,
	dictionaryId string,
	dictionary *host.DictionaryNamespace,
) *Fsw {
	f := &Fsw{
		FswInfo: host.FswInfo{
			Id:         name,
			Type:       "fprime",
			Dictionary: dictionaryId,
		},

		Up:         stream.NewPort[*Packet](),
		Down:       make(chan *Packet),
		Logger:     logger.With("source", name),
		File:       NewFileDownlink(name, logger),
		dictionary: dictionary,
	}

	go f.downlinkLoop()
	return f
}

func (f *Fsw) downlinkLoop() {
	defer close(f.Up)

	for pkt := range f.Down {
		switch data := pkt.Payload.(type) {
		case *FilePacket:
			err := f.File.Write(data)
			if err != nil {
				f.Logger.Error("failed to process file downlink packet", "err", err)
			}
		case []*TelemValue:
			for _, tlmRaw := range data {
				tlm, err := tlmRaw.ToTelemetry()
				if err != nil {
					f.Logger.Error("failed to convert telemetry", "err", err)
				} else {
					host.Telemetry.Emit(&pb.SourcedTelemetry{
						Source:    f.Id,
						Telemetry: tlm,
					})
				}
			}
		case *LogValue:
			evr, err := data.ToEvent()
			if err != nil {
				f.Logger.Error("failed to convert event", "err", err)
			} else {
				host.Event.Emit(&pb.SourcedEvent{
					Source: f.Id,
					Event:  evr,
				})
			}
		default:
			f.Logger.Warn("unknown downlink packet", "type", fmt.Sprintf("%T", data))
		}
	}
}

// Info implements host.Fsw.
func (f *Fsw) Info() host.FswInfo {
	return f.FswInfo
}

func commandCompletionPredicate(fswId string, cmd *pb.CommandDef) func(msg *pb.SourcedEvent) bool {
	return func(msg *pb.SourcedEvent) bool {
		if msg.Source != fswId {
			// We only care about our own EVRs
			return false
		}

		// Command response reply from FPrime source
		/**
		if (Fw::CmdResponse::OK == response.e) {
			this->log_COMMAND_OpCodeCompleted(opCode);
		} else {
			this->m_numCmdErrors++;
			this->tlmWrite_CommandErrors(this->m_numCmdErrors);
			FW_ASSERT(response.e != Fw::CmdResponse::OK);
			this->log_COMMAND_OpCodeError(opCode,response);
		}
		*/

		// These happen only on commanding a bad opcode, it must be ours
		def := msg.GetEvent().GetRef()
		sev := def.GetSeverity()
		if sev == pb.EvrSeverity_EVR_WARNING_HIGH && def.GetName() == "InvalidCommand" {
			return true
		}

		if sev != pb.EvrSeverity_EVR_COMMAND {
			return false
		}

		if def.GetName() == "OpCodeCompleted" || def.GetName() == "OpCodeError" {
			// The first option should be an opcode
			// Make sure the opcode corresponds to the definition opcode
			args := msg.GetEvent().Args
			if len(args) > 0 {
				opcodeArg := args[0]
				if ev := opcodeArg.GetE(); ev != nil {
					return int32(ev.Raw) == cmd.Opcode
				} else if int32(opcodeArg.GetU()) == cmd.Opcode {
					return true
				} else if int32(opcodeArg.GetI()) == cmd.Opcode {
					return true
				}
			}
		}

		return false
	}
}

func (f *Fsw) uplink(ctx context.Context, pkt *Packet) error {
	return stream.SendAndAwait(ctx, f.Up, pkt)
}

// Command implements host.Fsw.
func (f *Fsw) Command(ctx context.Context, cmd *pb.CommandValue) (success bool, err error) {
	options := cmd.GetOptions()
	var evr *pb.SourcedEvent
	var waitForEvr chan *pb.SourcedEvent
	if !options.GetNoWait() {
		waitForEvr = host.Event.Wait(
			ctx,
			commandCompletionPredicate(f.Id, cmd.Def),
		)
	}

	if delayMsS, ok := cmd.Metadata["relativeTimeDelayMs"]; ok {
		delayMs, err := strconv.ParseInt(delayMsS, 10, 64)
		if err != nil {
			return false, fmt.Errorf("failed to convert 'relativeTimeDelayMs' to integer: %w", err)
		}

		select {
		case <-ctx.Done():
			return false, ctx.Err()
		case <-time.After(time.Millisecond * time.Duration(delayMs)):
		}
	}

	err = f.uplink(ctx, (&CommandPacket{
		Def:  cmd.Def,
		Args: cmd.Args,
	}).AsPacket())

	if err != nil {
		return false, fmt.Errorf("failed to write command packet: %w", err)
	}

	// Don't wait for completion
	if options.GetNoWait() {
		return true, nil
	}

	evr, ok := <-waitForEvr
	if !ok {
		return false, ctx.Err()
	}

	switch evr.GetEvent().GetRef().GetName() {
	case "InvalidCommand", "OpCodeError":
		return false, nil
	case "OpCodeCompleted":
		return true, nil
	default:
		return false, fmt.Errorf("invalid completion event name: '%s'", evr.GetEvent().GetRef().GetName())
	}
}

// Uplink implements host.Fsw.
func (f *Fsw) Uplink(
	ctx context.Context,
	header *pb.FileHeader,
	data host.UplinkSource,
) error {
	if !f.fileUplinkInProgress.TryLock() {
		return fmt.Errorf("uplink already in progress")
	}

	defer f.fileUplinkInProgress.Unlock()

	// File size must fit in uint32 since F` packet protocol uses u32 for file size
	if header.Size >= math.MaxUint32 {
		return fmt.Errorf("file too big, must be less that %d bytes, got %d", math.MaxUint32, header.Size)
	}

	uid := util.GenerateShortUID()

	metricAttr := metric.WithAttributes(
		attribute.String("uid", uid),
		attribute.String("destination", f.Id),
		attribute.String("sourcePath", header.SourcePath),
		attribute.String("destinationPath", header.DestinationPath),
	)

	metricFileUplinkSize.Record(
		ctx,
		int64(header.Size),
		metricAttr,
	)

	var err error
	wg := sync.WaitGroup{}
	uplinker := stream.NewPort[[]byte]()

	defer wg.Wait()
	defer close(uplinker)

	chunked := NewFileChunker(&wg, int(Config.UplinkChunkSize), uplinker)
	uplinkFile(&wg, header, chunked, f.Up)

	for {
		var chunk []byte
		chunk, err = data.Recv()
		if err != nil {
			break
		}

		err = stream.SendAndAwait(ctx, uplinker, chunk)
		if err != nil {
			break
		}

		metricFileUplinkSent.Add(
			ctx,
			int64(len(chunk)),
			metricAttr,
		)
	}

	if err != nil {
		err = stream.SendAndAwait(ctx, uplinker, nil)
	}

	metricFileUplinkN.Add(ctx, 1)

	if err != nil {
		metricFileUplinkFailedN.Add(ctx, 1)

		f.Logger.Warn("error occurred during uplink, cancelling uplink", "err", err)

		// Cancel the uplink
		cancelErr := f.uplink(
			context.Background(),
			(&FileCancelPacket{}).AsFilePacket(0).AsPacket(),
		)

		if cancelErr != nil {
			f.Logger.Error("failed to cancel uplink", "err", cancelErr)
		}

		return err
	}

	return nil
}

// ParseCommand implements host.RawCmdFsw.
// Subtle: this method shadows the method (BasicCommandParser).ParseCommand of Fsw.BasicCommandParser.
func (f *Fsw) ParseCommand(_ context.Context, cmd *pb.RawCommandValue) (*pb.CommandValue, error) {
	return f.BasicCommandParser.ParseCommand(f.dictionary, cmd)
}

// Request implements host.RequestFsw.
func (f *Fsw) Request(ctx context.Context, kind string, data []byte) ([]byte, error) {
	switch kind {
	case "cancel":
		// Transmit a cancel packet
		err := f.uplink(
			ctx,
			(&FileCancelPacket{}).AsFilePacket(0).AsPacket(),
		)

		if err != nil {
			return nil, err
		}

		return []byte{}, nil
	default:
		return nil, fmt.Errorf("unsupported request type '%s'", kind)
	}
}
