package rpc

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"slices"
	"sync"

	"github.com/nasa/hermes/pkg/dwn"
	grpcpb "github.com/nasa/hermes/pkg/grpc"
	"github.com/nasa/hermes/pkg/util"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/emptypb"
)

var (
	_ grpcpb.ProviderServer = (*providerServer)(nil)

	_ host.RuntimeProfile = (*rpcProfile)(nil)
	_ host.ConnectSession = (*rpcProfile)(nil)

	_ host.Fsw          = (*fswClient)(nil)
	_ host.CmdFsw       = (*fswClient)(nil)
	_ host.CmdFswParser = (*fswClient)(nil)
	_ host.SeqFsw       = (*fswClient)(nil)
	_ host.SeqFswParser = (*fswClient)(nil)
	_ host.UplinkFsw    = (*fswClient)(nil)
	_ host.RequestFsw   = (*fswClient)(nil)
)

type providerServer struct {
	grpcpb.UnsafeProviderServer
	logger log.Logger

	// Maps profile name to a registered profile
	profiles map[string]*rpcProfile
}

func NewProviderServer() *providerServer {
	return &providerServer{
		logger:   log.GetLogger(context.Background()),
		profiles: map[string]*rpcProfile{},
	}
}

// Connection implements grpc.ProviderServer.
func (r *providerServer) Connection(stream grpc.BidiStreamingServer[pb.FswConnectionPacket, pb.Uplink]) error {
	infoMsg, err := stream.Recv()
	if err != nil {
		return fmt.Errorf("unexpected error while receiving info: %w", err)
	}

	info, isInfo := infoMsg.Value.(*pb.FswConnectionPacket_Info)
	if !isInfo {
		return fmt.Errorf("expected info packet to be first packet on connection, got %T", infoMsg.Value)
	}

	fsw := newFswClient(info.Info.GetInfo())

	name := info.Info.GetProfile()
	var profile *rpcProfile
	if p, ok := r.profiles[name]; ok {
		// This profile already exists, add it to that profile
		profile = p
		r.logger.Info(
			"rpc connection on existing profile",
			"profile", name,
			"fswId", fsw.info.Id,
			"capabilities", info.Info.GetInfo().Capabilities,
		)
	} else {
		profile = &rpcProfile{
			name:        name,
			logger:      log.GetLogger(stream.Context()),
			connections: map[string]host.Fsw{},
			listener:    host.Profiles,
		}

		id := host.Profiles.AddRuntime(profile)

		r.profiles[name] = profile
		r.logger.Info(
			"rpc connection on new profile",
			"profile", name,
			"fswId", fsw.info.Id,
			"profileId", id,
			"capabilities", info.Info.GetInfo().Capabilities,
		)
	}

	profile.Connect(fsw)
	defer func() {
		r.logger.Info("rpc connection closed", "profile", name, "fswId", fsw.info.Id)
		profile.Disconnect(fsw)

		// Clean up the profile if there are no more active connections
		if len(profile.connections) == 0 {
			r.logger.Debug("all rpc connections on profile closed", "profile", name, "fswId", fsw.info.Id)
			delete(r.profiles, name)
			host.Profiles.RemoveRuntime(profile)
		}
	}()

	// Process uplink replies
	return fsw.process(stream)
}

// Event implements grpc.ProviderServer.
func (r *providerServer) Event(stream grpc.ClientStreamingServer[pb.SourcedEvent, emptypb.Empty]) error {
	for {
		req, err := stream.Recv()
		if err == io.EOF {
			// Client has finished sending data
			return stream.SendAndClose(&emptypb.Empty{})
		}
		if err != nil {
			return err
		}

		host.Event.Emit(req)
	}
}

type noopValidator int

// Validate implements dwn.FileValidator.
func (n noopValidator) Validate(r io.Reader) error {
	return nil
}

var _ dwn.FileValidator = noopValidator(0)

// File implements grpc.ProviderServer.
func (r *providerServer) File(stream grpc.ClientStreamingServer[pb.DownlinkFileChunk, emptypb.Empty]) error {
	headerMsg, err := stream.Recv()
	if err != nil {
		return fmt.Errorf("unexpected error while receiving info: %w", err)
	}

	header, isHeader := headerMsg.Value.(*pb.DownlinkFileChunk_Header)
	if !isHeader {
		return fmt.Errorf("expected header packet to be first packet, got %T", headerMsg.Value)
	}

	md, ok := metadata.FromIncomingContext(stream.Context())
	if !ok {
		return fmt.Errorf("no metadata included in file downlink")
	}

	fswId := md.Get("id")
	if len(fswId) != 1 {
		return fmt.Errorf("expected FSW id in metadata key 'id'")
	}

	session, err := dwn.NewDownlinkSession(
		log.GetLogger(stream.Context()),
		fswId[0],
		header.Header.GetSourcePath(),
		header.Header.GetDestinationPath(),
		header.Header.GetSize(),
		// TODO(tumbar) Figure out remote file validation
		noopValidator(0),
	)

	if err != nil {
		return fmt.Errorf("failed to start downlink session: %w", err)
	}

	defer session.Finish()

	for {
		msg, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			return nil
		} else if err != nil {
			return fmt.Errorf("failed to receive file chunk: %w", err)
		}

		switch m := msg.Value.(type) {
		case *pb.DownlinkFileChunk_Data:
			session.Chunk(&dwn.DownlinkChunk{
				Offset: m.Data.GetOffset(),
				Data:   m.Data.GetData(),
				MD:     m.Data.GetMd(),
			})
		case *pb.DownlinkFileChunk_Header:
			return fmt.Errorf("unexpected header chunk received during downlink")
		case *pb.DownlinkFileChunk_Metadata:
			var v any
			err := json.Unmarshal(m.Metadata.GetData(), &v)
			if err != nil {
				return fmt.Errorf("failed to process JSON metadata '%s': %w", m.Metadata.GetKey(), err)
			}

			session.Metadata(m.Metadata.GetKey(), v)
		case *pb.DownlinkFileChunk_Validation:
			// TODO(tumbar) How do we handle this?
		default:
			panic(fmt.Sprintf("unexpected pb.isDownlinkFileChunk_Value: %#v", msg.Value))
		}
	}
}

// Telemetry implements grpc.ProviderServer.
func (r *providerServer) Telemetry(stream grpc.ClientStreamingServer[pb.SourcedTelemetry, emptypb.Empty]) error {
	for {
		req, err := stream.Recv()
		if err == io.EOF {
			// Client has finished sending data
			return stream.SendAndClose(&emptypb.Empty{})
		}
		if err != nil {
			return err
		}

		host.Telemetry.Emit(req)
	}
}

type rpcProfile struct {
	mux    sync.RWMutex
	logger log.Logger
	name   string

	connections map[string]host.Fsw

	listener host.ProfileListener
}

// Connect implements host.ConnectSession.
func (r *rpcProfile) Connect(fsw host.Fsw) {
	r.mux.Lock()
	defer r.mux.Unlock()

	info := fsw.Info()
	if _, ok := r.connections[info.Id]; ok {
		r.logger.Warn(
			"overlapping connection id, overwriting previous connection",
			"fswId",
			info.Id,
			"type",
			info.Type,
		)
	} else {
		r.logger.Info(
			"fsw connected",
			"fswId",
			info.Id,
			"type",
			info.Type,
		)
	}

	r.connections[info.Id] = fsw

	// Avoid deadlock by running this in a separate go-route
	go func() {
		r.listener.UpdateProfiles()
		r.listener.UpdateConnections()
	}()
}

// Disconnect implements host.ConnectSession.
func (r *rpcProfile) Disconnect(fsw host.Fsw) {
	// Avoid deadlock by serving this in a separate go routine
	r.mux.Lock()
	defer r.mux.Unlock()

	info := fsw.Info()
	if r.connections[info.Id] != nil {
		delete(r.connections, info.Id)
		r.logger.Info(
			"fsw disconnected",
			"fswId",
			info.Id,
			"type",
			info.Type,
		)
	} else {
		r.logger.Warn(
			"disconnecting fsw that was not connected",
			"fswId",
			info.Id,
			"type",
			info.Type,
		)
	}

	// Avoid deadlock by running this in a separate go-route
	go func() {
		r.listener.UpdateProfiles()
		r.listener.UpdateConnections()
	}()
}

// Log implements host.ConnectSession.
func (r *rpcProfile) Log() log.Logger {
	return r.logger
}

// Started implements host.ConnectSession.
func (r *rpcProfile) Started() {
	panic("should not be called as we have no provider")
}

// IsRuntimeProfile implements host.RuntimeProfile.
func (r *rpcProfile) IsRuntimeProfile() {}

var empty = struct{}{}

// Config implements host.StatefulProfile.
func (r *rpcProfile) Config() host.ProfileConfig {
	return host.ProfileConfig{
		Name:     r.name,
		Provider: "Remote",
		Settings: &empty,
	}
}

// Connections implements host.StatefulProfile.
func (r *rpcProfile) Connections() []*pb.Fsw {
	r.mux.RLock()
	defer r.mux.RUnlock()

	out := []*pb.Fsw{}
	for id, fsw := range r.connections {
		info := fsw.Info()
		out = append(out, &pb.Fsw{
			Id:           id,
			Type:         info.Type,
			Forwards:     slices.Clone(info.Forwards),
			Capabilities: slices.Clone(info.Capabilities),
		})
	}

	return out
}

// GetConnection implements host.StatefulProfile.
func (r *rpcProfile) GetConnection(id string) host.Fsw {
	r.mux.RLock()
	defer r.mux.RUnlock()

	for _, fsw := range r.connections {
		if fsw.Info().Id == id {
			return fsw
		}
	}

	return nil
}

// Name implements host.StatefulProfile.
func (r *rpcProfile) Name() string {
	return r.name
}

// Start implements host.StatefulProfile.
func (r *rpcProfile) Start(ctx context.Context) error {
	return fmt.Errorf("builtin remote profile cannot be started or stopped")
}

// State implements host.StatefulProfile.
func (r *rpcProfile) State() (*pb.StatefulProfile, error) {
	return &pb.StatefulProfile{
		Value: &pb.Profile{
			Name:     r.name,
			Provider: "Remote",
		},
		State: pb.ProfileState_PROFILE_ACTIVE,
	}, nil
}

// Stop implements host.StatefulProfile.
func (r *rpcProfile) Stop(ctx context.Context) error {
	return fmt.Errorf("builtin remote profile cannot be started or stopped")
}

// Update implements host.StatefulProfile.
func (r *rpcProfile) Update(settings string) error {
	return fmt.Errorf("builtin remote profile cannot be updated")
}

type fswClient struct {
	mux      sync.Mutex
	logger   log.Logger
	info     *pb.Fsw
	requests map[string]chan *pb.UplinkReply
	uplink   chan *pb.Uplink
}

func newFswClient(info *pb.Fsw) *fswClient {
	return &fswClient{
		logger:   log.GetLogger(context.TODO()),
		info:     info,
		requests: map[string]chan *pb.UplinkReply{},
		uplink:   make(chan *pb.Uplink, 8),
	}
}

func (f *fswClient) newSession(ctx context.Context) (string, func() *pb.UplinkReply) {
	id := util.GenerateShortUID()

	f.mux.Lock()
	defer f.mux.Unlock()
	replyChan := make(chan *pb.UplinkReply)
	f.requests[id] = replyChan

	return id, func() *pb.UplinkReply {
		select {
		case <-ctx.Done():
			// Propagate the cancellation to the client
			f.uplink <- &pb.Uplink{
				Id: id,
				Value: &pb.Uplink_Cancel{
					Cancel: &emptypb.Empty{},
				},
			}

			// Wait for the cancellation to propagate
			out := <-replyChan
			delete(f.requests, id)
			close(replyChan)
			return out

		// Wait for a normal reply
		case reply, ok := <-replyChan:
			delete(f.requests, id)
			if ok {
				close(replyChan)
				return reply
			} else {
				return &pb.UplinkReply{
					Id: id,
					Status: &pb.UplinkReply_Error{
						Error: "connection closed",
					},
				}
			}
		}
	}
}

// Uplink implements host.UplinkFsw.
func (f *fswClient) Uplink(ctx context.Context, header *pb.FileHeader, data host.UplinkSource) error {
	id, replyWait := f.newSession(ctx)

	// Send the header packet to initiate the uplink session
	f.uplink <- &pb.Uplink{
		Id: id,
		Value: &pb.Uplink_File{
			File: &pb.UplinkFileChunk{
				Value: &pb.UplinkFileChunk_Header{
					Header: header,
				},
			},
		},
	}

	for {
		pkt, err := data.Recv()
		if errors.Is(err, io.EOF) {
			break
		}

		f.uplink <- &pb.Uplink{
			Id: id,
			Value: &pb.Uplink_File{
				File: &pb.UplinkFileChunk{
					Value: &pb.UplinkFileChunk_Data{
						Data: pkt,
					},
				},
			},
		}
	}

	// Finish up the stream
	f.uplink <- &pb.Uplink{
		Id:    id,
		Value: &pb.Uplink_Final{Final: &emptypb.Empty{}},
	}

	reply := replyWait()
	if reply.GetError() != "" {
		return errors.New(reply.String())
	}

	return nil
}

func (f *fswClient) request(ctx context.Context, request *pb.Uplink, reply proto.Message) error {
	id, replyWait := f.newSession(ctx)
	request.Id = id
	f.uplink <- request

	replyMsg := replyWait()
	if replyMsg.GetError() != "" {
		return errors.New(replyMsg.String())
	}

	if err := proto.Unmarshal(replyMsg.GetReply(), reply); err != nil {
		return fmt.Errorf("failed to unmarshal reply: %w", err)
	}

	return nil
}

// ParseSequence implements host.SeqFswParser.
func (f *fswClient) ParseSequence(ctx context.Context, seq *pb.RawCommandSequence) (*pb.CommandSequence, error) {
	var out pb.CommandSequence
	err := f.request(ctx, &pb.Uplink{Value: &pb.Uplink_ParseSeq{ParseSeq: seq}}, &out)
	if err != nil {
		return nil, err
	}

	return &out, nil
}

// Sequence implements host.SeqFsw.
func (f *fswClient) Sequence(ctx context.Context, seq *pb.CommandSequence) (bool, error) {
	var out pb.Reply
	err := f.request(ctx, &pb.Uplink{Value: &pb.Uplink_Seq{Seq: seq}}, &out)
	if err != nil {
		return false, err
	}

	return out.Success, nil
}

// ParseCommand implements host.CmdFswParser.
func (f *fswClient) ParseCommand(ctx context.Context, cmd *pb.RawCommandValue) (*pb.CommandValue, error) {
	var out pb.CommandValue
	err := f.request(ctx, &pb.Uplink{Value: &pb.Uplink_ParseCmd{ParseCmd: cmd}}, &out)
	if err != nil {
		return nil, err
	}

	return &out, nil
}

// Command implements host.CmdFsw.
func (f *fswClient) Command(ctx context.Context, cmd *pb.CommandValue) (bool, error) {
	var out pb.Reply
	err := f.request(ctx, &pb.Uplink{Value: &pb.Uplink_Cmd{Cmd: cmd}}, &out)
	if err != nil {
		return false, err
	}

	return out.Success, nil
}

// Request implements host.RequestFsw.
func (f *fswClient) Request(ctx context.Context, kind string, data []byte) ([]byte, error) {
	var out pb.RequestReply
	err := f.request(ctx, &pb.Uplink{Value: &pb.Uplink_Request{Request: &pb.RequestValue{
		Kind: kind,
		Data: data,
	}}}, &out)

	if err != nil {
		return nil, err
	}

	return out.GetData(), nil
}

// Info implements host.Fsw.
func (f *fswClient) Info() host.FswInfo {
	return host.FswInfo{
		Id:           f.info.GetId(),
		Type:         f.info.GetType(),
		Forwards:     f.info.GetForwards(),
		Capabilities: f.info.GetCapabilities(),
	}
}

func (f *fswClient) process(stream grpc.BidiStreamingServer[pb.FswConnectionPacket, pb.Uplink]) error {
	defer func() {
		// Cancel all running replies
		for _, replyChan := range f.requests {
			close(replyChan)
		}

		close(f.uplink)
	}()

	// Uplink to client
	go func() {
		for pkt := range f.uplink {
			err := stream.Send(pkt)
			if err != nil {
				f.requests[pkt.Id] <- &pb.UplinkReply{
					Id: pkt.Id,
					Status: &pb.UplinkReply_Error{
						Error: fmt.Sprintf("failed to send request: %s", err.Error()),
					},
				}
			}
		}
	}()

	for {
		pkt, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			return nil
		} else if err != nil {
			return err
		}

		reply := pkt.GetReply()
		if reply == nil {
			f.logger.Warn("expected reply in connection stream", "pktType", fmt.Sprintf("%T", pkt.Value))
			continue
		}

		if replyChan, ok := f.requests[reply.Id]; ok {
			replyChan <- reply
		} else {
			f.logger.Warn("got unexpected reply on non-existent (or closed) reply channel", "id", reply.Id)
		}
	}
}
