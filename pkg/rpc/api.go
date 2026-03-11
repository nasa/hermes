package rpc

import (
	"bufio"
	"context"
	"errors"
	"fmt"
	"maps"
	"slices"
	"strings"
	"time"

	grpcpb "github.com/nasa/hermes/pkg/grpc"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/util"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	otelCodes "go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/trace"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var (
	_ grpcpb.ApiServer  = (*apiServer)(nil)
	_ host.UplinkSource = (*fileChunkReader)(nil)
)

type apiServer struct {
	grpcpb.UnsafeApiServer
	logger log.Logger
}

func NewApiServer() *apiServer {
	return &apiServer{
		logger: log.GetLogger(context.TODO()),
	}
}

// Sequence implements grpc.ApiServer.
func (r *apiServer) Sequence(ctx context.Context, sequence *pb.CommandSequence) (*pb.SequenceReply, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("no metadata included in command call")
	}

	keepGoingOnFailure := len(md.Get("keepGoingOnFailure")) > 0

	fswIds := md.Get("id")
	if len(fswIds) != 1 {
		return nil, fmt.Errorf("expected FSW id in metadata key 'id'")
	}

	fswId := fswIds[0]

	fswR := host.Profiles.GetConnection(fswId)
	if fswR == nil {
		return nil, fmt.Errorf("FSW with id '%s' not found", fswId)
	}

	attr := []attribute.KeyValue{
		attribute.String("fsw", fswId),

		// TODO(tumbar) We should additional attributes to allow
		// linking this back to the original code block

		// TODO(tumbar) What more information do we need here to aid
		// in generating an as-run report?
	}
	for key, value := range sequence.Metadata {
		attr = append(attr, attribute.KeyValue{
			Key:   attribute.Key("md_" + key),
			Value: attribute.StringValue(value),
		})
	}

	spanCtx, span := otel.Tracer("sequence").Start(
		ctx,
		"Sequence",
		trace.WithNewRoot(),
		trace.WithAttributes(attr...),
	)

	defer span.End()

	spanLogger := r.logger.WithContext(spanCtx)

	// Check if this FSW natively supports sequence uplink
	if fsw, ok := fswR.(host.SeqFsw); ok && fsw.Info().HasCapability(pb.FswCapability_SEQUENCE) {
		spanLogger.Info(
			"sequence",
			"fsw", fsw.Info().Id,
			"num_commands", len(sequence.Commands),
			"language", sequence.LanguageName,
			"metadata", sequence.Metadata,
		)

		success, err := fsw.Sequence(spanCtx, sequence)

		if err != nil && errors.Is(err, host.ErrSequenceWithImmediate) {
			// Fall-through to the immediate commanding behavior
		} else {
			if err != nil {
				spanLogger.Error(
					"sequence error",
					"fsw", fsw.Info().Id,
					"num_commands", len(sequence.Commands),
					"language", sequence.LanguageName,
					"metadata", sequence.Metadata,
					"err", err,
				)
			} else {
				spanLogger.Info(
					"sequence finished",
					"fsw", fsw.Info().Id,
					"num_commands", len(sequence.Commands),
					"language", sequence.LanguageName,
					"metadata", sequence.Metadata,
					"status", success,
				)
			}

			return &pb.SequenceReply{Success: success}, err
		}
	} else if _, ok := fswR.(host.CmdFsw); !ok || !fswR.Info().HasCapability(pb.FswCapability_COMMAND) {
		return nil, fmt.Errorf("FSW with id '%s' does not support sequencing or command uplink", fswId)
	}

	for i, cmd := range sequence.Commands {
		reply, err := r.Command(spanCtx, cmd)
		if err != nil {
			return nil, fmt.Errorf("error during sequence execution, command index: %d: %w", i, err)
		}

		if !reply.Success {
			if keepGoingOnFailure {
				r.logger.Error(
					"command in sequence replied with failure",
					"index",
					i,
				)
			} else {
				return &pb.SequenceReply{
					Success:      false,
					CommandIndex: int32(i),
				}, nil
			}
		}
	}

	return &pb.SequenceReply{Success: true}, nil
}

// RawSequence implements grpc.ApiServer.
func (r *apiServer) RawSequence(ctx context.Context, seq *pb.RawCommandSequence) (*pb.SequenceReply, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("no metadata included in command call")
	}

	fswId := md.Get("id")
	if len(fswId) != 1 {
		return nil, fmt.Errorf("expected FSW id in metadata key 'id'")
	}

	fswR := host.Profiles.GetConnection(fswId[0])
	if fswR == nil {
		return nil, fmt.Errorf("FSW with id '%s' not found", fswId[0])
	}

	var outSeq *pb.CommandSequence

	if fsw, ok := fswR.(host.SeqFswParser); ok && fsw.Info().HasCapability(pb.FswCapability_PARSE_SEQUENCE) {
		pSeq, err := fsw.ParseSequence(ctx, seq)
		if err != nil {
			return nil, fmt.Errorf("failed to parse sequence: %w", err)
		}

		outSeq = pSeq
	} else if fsw, ok := fswR.(host.CmdFswParser); ok && fsw.Info().HasCapability(pb.FswCapability_PARSE_COMMAND) {
		scanner := bufio.NewScanner(strings.NewReader(seq.Sequence))
		outSeq = &pb.CommandSequence{
			Commands:     []*pb.CommandValue{},
			LanguageName: seq.LanguageName,
			Metadata:     seq.Metadata,
		}

		lineNo := 0
		for scanner.Scan() {
			line := strings.Trim(scanner.Text(), " ")

			idx := strings.Index(line, seq.LineCommentPrefix)
			if idx >= 0 {
				line = line[0:idx]
			}

			line = strings.Trim(line, " ")
			if len(line) > 0 {
				parsedCmd, err := fsw.ParseCommand(ctx, &pb.RawCommandValue{Command: line})
				if err != nil {
					return nil, fmt.Errorf(
						"failed to parse command on line %d '%s': %w",
						lineNo+1, line, err,
					)
				}

				outSeq.Commands = append(outSeq.Commands, parsedCmd)
			}

			lineNo++
		}
	} else {
		return nil, fmt.Errorf("FSW with id '%s' does not support parsing commands in the backend", fswId)
	}

	return r.Sequence(ctx, outSeq)
}

// Command implements grpc.ApiServer.
func (r *apiServer) Command(ctx context.Context, request *pb.CommandValue) (*pb.Reply, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("no metadata included in command call")
	}

	fswIds := md.Get("id")
	if len(fswIds) != 1 {
		return nil, fmt.Errorf("expected FSW id in metadata key 'id'")
	}

	fswId := fswIds[0]

	fswR := host.Profiles.GetConnection(fswId)
	if fswR == nil {
		return nil, fmt.Errorf("FSW with id '%s' not found", fswId)
	}

	fsw, ok := fswR.(host.CmdFsw)
	if !ok || !fsw.Info().HasCapability(pb.FswCapability_COMMAND) {
		return nil, fmt.Errorf("FSW with ID '%s' does not support immediate commanding", fswId)
	}

	spanCtx, span := otel.Tracer("command").Start(
		ctx,
		fmt.Sprintf("%s.%s", request.GetDef().GetComponent(), request.GetDef().GetMnemonic()),
		trace.WithAttributes(
			append([]attribute.KeyValue{
				attribute.String("fsw", fsw.Info().Id),
				attribute.String("component", request.GetDef().GetComponent()),
				attribute.String("mnemonic", request.GetDef().GetMnemonic()),
			},
				pb.ArgsToAttributes(request.GetArgs(), request.GetDef().GetArguments())...,
			)...,
		),
	)

	defer span.End()

	spanLogger := r.logger.WithContext(spanCtx)

	spanLogger.Info(
		"command",
		"fsw", fsw.Info().Id,
		"component", request.GetDef().GetComponent(),
		"mnemonic", request.GetDef().GetMnemonic(),
		"args", fmt.Sprintf("%v", pb.ArgsToMap(request.GetArgs(), request.GetDef().ArgNames())),
	)

	success, err := fsw.Command(spanCtx, request)
	if err != nil {
		if errors.Is(err, context.Canceled) {
			spanLogger.Warn(
				"command cancelled",
				"fsw", fsw.Info().Id,
				"component", request.GetDef().GetComponent(),
				"mnemonic", request.GetDef().GetMnemonic(),
				"args", pb.ArgsToMap(request.GetArgs(), request.GetDef().ArgNames()),
			)

			span.SetStatus(otelCodes.Error, "cancelled")
		} else {
			spanLogger.Error(
				"command error",
				"fsw", fsw.Info().Id,
				"component", request.GetDef().GetComponent(),
				"mnemonic", request.GetDef().GetMnemonic(),
				"args", pb.ArgsToMap(request.GetArgs(), request.GetDef().ArgNames()),
				"err", err,
			)

			span.SetStatus(otelCodes.Error, err.Error())
		}

		return nil, err
	}

	span.SetStatus(otelCodes.Ok, "success")

	spanLogger.Info(
		"command completed",
		"fsw", fsw.Info().Id,
		"component", request.GetDef().GetComponent(),
		"mnemonic", request.GetDef().GetMnemonic(),
		"args", pb.ArgsToMap(request.GetArgs(), request.GetDef().ArgNames()),
		"success", success,
	)

	return &pb.Reply{Success: success}, nil
}

// RawCommand implements grpc.ApiServer.
func (r *apiServer) RawCommand(ctx context.Context, cmd *pb.RawCommandValue) (*pb.Reply, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("no metadata included in command call")
	}

	fswIds := md.Get("id")
	if len(fswIds) != 1 {
		return nil, fmt.Errorf("expected FSW id in metadata key 'id'")
	}

	fswId := fswIds[0]

	fswR := host.Profiles.GetConnection(fswId)
	if fswR == nil {
		return nil, fmt.Errorf("FSW with id '%s' not found", fswId)
	}

	fsw, ok := fswR.(host.CmdFswParser)
	if !ok || !fsw.Info().HasCapability(pb.FswCapability_PARSE_COMMAND) {
		return nil, fmt.Errorf("FSW with ID '%s' (%T) does not support command parsing", fswId, fswR)
	}

	_, ok = fswR.(host.CmdFsw)
	if !ok {
		return nil, fmt.Errorf("FSW with ID '%s' does not support immediate commanding", fswId)
	}

	parsedCmd, err := fsw.ParseCommand(ctx, cmd)
	if err != nil {
		return nil, fmt.Errorf("failed to parse command: %w", err)
	}

	return r.Command(ctx, parsedCmd)
}

// Request implements grpc.ApiServer.
func (r *apiServer) Request(ctx context.Context, request *pb.RequestValue) (*pb.RequestReply, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, fmt.Errorf("no metadata included in ground command call")
	}

	fswIds := md.Get("id")
	if len(fswIds) != 1 {
		return nil, fmt.Errorf("expected FSW id in metadata key 'id'")
	}

	fswId := fswIds[0]

	fswR := host.Profiles.GetConnection(fswId)
	if fswR == nil {
		return nil, fmt.Errorf("FSW with id '%s' not found", fswId)
	}

	fsw, ok := fswR.(host.RequestFsw)
	if !ok || !fsw.Info().HasCapability(pb.FswCapability_REQUEST) {
		return nil, fmt.Errorf("FSW with ID '%s' does not support requests", fswId)
	}

	spanCtx, span := otel.Tracer("request").Start(
		ctx,
		request.GetKind(),
		trace.WithAttributes(
			attribute.String("fsw", fsw.Info().Id),
		),
	)

	defer span.End()

	spanLogger := r.logger.WithContext(spanCtx)

	spanLogger.Info(
		"request",
		"fsw", fsw.Info().Id,
		"kind", request.GetKind(),
	)

	reply, err := fsw.Request(spanCtx, request.GetKind(), request.GetData())
	if err != nil {
		if errors.Is(err, context.Canceled) {
			spanLogger.Warn(
				"request cancelled",
				"fsw", fsw.Info().Id,
				"kind", request.GetKind(),
			)

			span.SetStatus(otelCodes.Error, "cancelled")
		} else {
			spanLogger.Error(
				"request error",
				"fsw", fsw.Info().Id,
				"kind", request.GetKind(),
				"err", err,
			)

			span.SetStatus(otelCodes.Error, err.Error())
		}

		return nil, err
	}

	span.SetStatus(otelCodes.Ok, "success")

	spanLogger.Info(
		"request completed",
		"fsw", fsw.Info().Id,
		"kind", request.GetKind(),
	)

	return &pb.RequestReply{Data: reply}, nil
}

type fileChunkReader struct {
	uid       string
	lastChunk int
	request   grpc.ClientStreamingServer[pb.UplinkFileChunk, pb.Reply]
	span      trace.Span
}

// Recv implements host.UplinkSource.
func (f *fileChunkReader) Recv() ([]byte, error) {
	res, err := f.request.Recv()
	if err != nil {
		f.span.RecordError(fmt.Errorf("failed to recv() chunk: %w", err))
		return nil, err
	}

	if data := res.GetData(); data != nil {
		f.span.AddEvent(
			"chunk",
			trace.WithAttributes(
				attribute.Int64("size", int64(len(data))),
			),
		)

		if f.lastChunk > 0 {
			host.FileTransfer.UplinkProgress(f.uid, uint64(f.lastChunk))
		}

		f.lastChunk = len(data)
		return data, nil
	}

	f.span.RecordError(fmt.Errorf("expected data in file chunk"))
	return nil, fmt.Errorf("expected data in file chunk")
}

// Uplink implements grpc.ApiServer.
func (r *apiServer) Uplink(request grpc.ClientStreamingServer[pb.UplinkFileChunk, pb.Reply]) error {
	md, ok := metadata.FromIncomingContext(request.Context())
	if !ok {
		return fmt.Errorf("no metadata included in uplink call")
	}

	fswId := md.Get("id")
	if len(fswId) != 1 {
		return fmt.Errorf("expected FSW id in metadata key 'id'")
	}

	fswR := host.Profiles.GetConnection(fswId[0])
	if fswR == nil {
		return fmt.Errorf("FSW with id '%s' not found", fswId[0])
	}

	fsw, ok := fswR.(host.UplinkFsw)
	if !ok || !fsw.Info().HasCapability(pb.FswCapability_FILE) {
		return fmt.Errorf("FSW with id '%s' does not support file uplink", fswId)
	}

	firstChunk, err := request.Recv()
	if err != nil {
		return fmt.Errorf("failure reading header %w", err)
	}

	header := firstChunk.GetHeader()
	if header == nil {
		return fmt.Errorf("expected header in first file chunk")
	}

	timeStart := time.Now()
	uid := util.GenerateShortUID()
	destinationPath := header.GetDestinationPath()
	sourcePath := header.GetSourcePath()
	size := header.GetSize()
	metadata := maps.Clone(header.GetMetadata())

	host.FileTransfer.AddUplink(
		uid,
		fsw.Info().Id,
		sourcePath,
		destinationPath,
		size,
	)

	if destinationPath == "" {
		return fmt.Errorf("file uplink header must include destination path")
	}

	spanCtx, span := otel.Tracer("uplink").Start(
		request.Context(),
		fmt.Sprintf("uplink %s -> %s", sourcePath, destinationPath),
		trace.WithAttributes(
			attribute.String("fsw", fsw.Info().Id),
			attribute.String("sourcePath", sourcePath),
			attribute.String("desintationPath", destinationPath),
			attribute.Int64("size", int64(size)),
		),
	)

	defer span.End()
	uplinkLogger := log.GetLogger(spanCtx).With(
		"fsw", fsw.Info().Id,
		"sourcePath", sourcePath,
		"destinationPath", destinationPath,
		"size", int64(size),
	)

	uplinkLogger.Info("uplinking file")

	err = fsw.Uplink(
		request.Context(),
		header,
		&fileChunkReader{
			uid:     uid,
			request: request,
			span:    span,
		},
	)

	timeEnd := time.Now()
	errorMsg := ""
	if err != nil {
		errorMsg = err.Error()
	}

	host.FileUplink.Emit(&pb.FileUplink{
		Uid:             uid,
		TimeStart:       timestamppb.New(timeStart),
		TimeEnd:         timestamppb.New(timeEnd),
		FswId:           fswId[0],
		SourcePath:      sourcePath,
		DestinationPath: destinationPath,
		Error:           errorMsg,
		Size:            size,
		Metadata:        metadata,
	})

	if err != nil {

		span.SetStatus(otelCodes.Error, err.Error())
		uplinkLogger.Error(
			"failed to uplink file",
			"err", err,
		)

		return err
	}

	uplinkLogger.Info("uplink finished")
	return request.SendAndClose(&pb.Reply{Success: true})
}

// AddDictionary implements pb.ApiServer.
func (r *apiServer) AddDictionary(ctx context.Context, dict *pb.Dictionary) (*pb.Id, error) {
	id := host.Dictionaries.Add(dict)
	return &pb.Id{Id: id}, nil
}

// AddProfile implements pb.ApiServer.
func (r *apiServer) AddProfile(ctx context.Context, profile *pb.Profile) (*pb.Id, error) {
	id, err := host.Profiles.Add(ctx, profile)
	if err != nil {
		return nil, err
	}

	return &pb.Id{Id: id}, nil
}

// AllDictionary implements pb.ApiServer.
func (r *apiServer) AllDictionary(ctx context.Context, _ *emptypb.Empty) (*pb.DictionaryList, error) {
	all := map[string]*pb.DictionaryHead{}
	for id, dict := range host.Dictionaries.All() {
		all[id] = dict.GetHead()
	}

	return &pb.DictionaryList{All: all}, nil
}

// AllFsw implements pb.ApiServer.
func (r *apiServer) AllFsw(ctx context.Context, _ *emptypb.Empty) (*pb.FswList, error) {
	return &pb.FswList{All: host.Profiles.AllConnections()}, nil
}

// AllProfiles implements pb.ApiServer.
func (r *apiServer) AllProfiles(ctx context.Context, _ *emptypb.Empty) (*pb.ProfileList, error) {
	profiles, err := host.Profiles.AllProfiles()
	if err != nil {
		return nil, err
	}

	return &pb.ProfileList{All: profiles}, nil
}

// AllProviders implements pb.ApiServer.
func (r *apiServer) AllProviders(ctx context.Context, _ *emptypb.Empty) (*pb.ProfileProviderList, error) {
	return &pb.ProfileProviderList{All: host.Profiles.AllProviders()}, nil
}

// GetDictionary implements pb.ApiServer.
func (r *apiServer) GetDictionary(ctx context.Context, id *pb.Id) (*pb.Dictionary, error) {
	dict := host.Dictionaries.Get(id.Id)
	if dict == nil {
		return nil, status.Errorf(codes.NotFound, "dictionary not found: %s", id.Id)
	}

	// Select a subset of the sections in the dictionary
	// based on the metadata in the incoming request
	if md, ok := metadata.FromIncomingContext(ctx); ok && len(md.Get("sections")) > 0 {
		out := &pb.Dictionary{
			Head:     dict.Head,
			Metadata: dict.Metadata,
			Content:  map[string]*pb.DictionaryNamespace{},
		}

		content := dict.GetContent()

		for _, section := range md.Get("sections") {
			sectionParts := strings.Split(section, ".")
			if len(sectionParts) != 2 {
				return nil, fmt.Errorf("invalid section id in metadata: '%s'", section)
			}

			nsId := sectionParts[0]
			sectionId := sectionParts[1]

			ns := content[nsId]

			// Put a empty skeleton if we haven't already added this namespace
			if out.Content[nsId] == nil {
				out.Content[nsId] = &pb.DictionaryNamespace{
					Types: ns.GetTypes(),
				}
			}

			switch sectionId {
			// All parts of the namespace
			case "*":
				out.Content[nsId].Commands = ns.GetCommands()
				out.Content[nsId].Events = ns.GetEvents()
				out.Content[nsId].Telemetry = ns.GetTelemetry()
				out.Content[nsId].Parameters = ns.GetParameters()
			case "commands":
				out.Content[nsId].Commands = ns.GetCommands()
			case "events":
				out.Content[nsId].Events = ns.GetEvents()
			case "telemetry":
				out.Content[nsId].Telemetry = ns.GetTelemetry()
			case "parameters":
				out.Content[nsId].Parameters = ns.GetParameters()
			default:
				return nil, fmt.Errorf("invalid section id in metadata: '%s'", section)
			}
		}

		return out, nil
	} else {
		// By default, we transmit the entire dictionary
		return dict, nil
	}
}

// GetFsw implements pb.ApiServer.
func (r *apiServer) GetFsw(ctx context.Context, id *pb.Id) (*pb.Fsw, error) {
	for _, fsw := range host.Profiles.AllConnections() {
		if fsw.Id == id.Id {
			return fsw, nil
		}
	}

	return nil, status.Errorf(codes.NotFound, "fsw not found: '%s'", id.Id)
}

// RemoveDictionary implements pb.ApiServer.
func (r *apiServer) RemoveDictionary(ctx context.Context, id *pb.Id) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, host.Dictionaries.Remove(id.Id)
}

// RemoveProfile implements pb.ApiServer.
func (r *apiServer) RemoveProfile(ctx context.Context, id *pb.Id) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, host.Profiles.Remove(id.Id)
}

// StartProfile implements pb.ApiServer.
func (r *apiServer) StartProfile(ctx context.Context, id *pb.Id) (*emptypb.Empty, error) {
	prof, err := host.Profiles.GetProfile(id.Id)
	if err != nil {
		return nil, err
	}

	err = prof.Start(ctx)
	if err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

// StopProfile implements pb.ApiServer.
func (r *apiServer) StopProfile(ctx context.Context, id *pb.Id) (*emptypb.Empty, error) {
	prof, err := host.Profiles.GetProfile(id.Id)
	if err != nil {
		return nil, err
	}

	if err := prof.Stop(ctx); err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}

var metricSubResponseSize, _ = infra.Meter.Int64Gauge(
	"hermes.bus.message_size",
	metric.WithDescription("Size of a message response on each of the busses"),
)

// SubDownlink implements pb.ApiServer.
func (r *apiServer) SubFileDownlink(filter *pb.BusFilter, s grpc.ServerStreamingServer[pb.FileDownlink]) error {
	host.FileDownlink.On(s.Context(), func(msg *pb.FileDownlink) {
		if filter.GetSource() == "" || filter.GetSource() == msg.GetSource() {
			metricSubResponseSize.Record(
				s.Context(),
				int64(proto.Size(msg)),
				metric.WithAttributes(attribute.String("bus", "downlink")),
			)
			s.Send(msg)
		}
	})

	// This is a long running subscription until the context request cancellation
	<-s.Context().Done()
	return nil
}

// SubDownlink implements pb.ApiServer.
func (r *apiServer) SubFileUplink(filter *pb.BusFilter, s grpc.ServerStreamingServer[pb.FileUplink]) error {
	host.FileUplink.On(s.Context(), func(msg *pb.FileUplink) {
		if filter.GetSource() == "" || filter.GetSource() == msg.GetFswId() {
			metricSubResponseSize.Record(
				s.Context(),
				int64(proto.Size(msg)),
				metric.WithAttributes(attribute.String("bus", "uplink")),
			)
			s.Send(msg)
		}
	})

	// This is a long running subscription until the context request cancellation
	<-s.Context().Done()
	return nil
}

// SubEvent implements pb.ApiServer.
func (r *apiServer) SubEvent(filter *pb.BusFilter, s grpc.ServerStreamingServer[pb.SourcedEvent]) error {
	// Validate filter
	switch filter.GetContext() {
	case pb.SourceContextFilter_ALL, pb.SourceContextFilter_REALTIME_ONLY, pb.SourceContextFilter_RECORDED_ONLY:
		// These are ok
	default:
		return fmt.Errorf("invalid source context filter: %s", filter.GetContext())
	}

	host.Event.On(s.Context(), func(msg *pb.SourcedEvent) {
		// Filter source context
		switch filter.GetContext() {
		case pb.SourceContextFilter_ALL:
			// Don't filter anything
		case pb.SourceContextFilter_REALTIME_ONLY:
			if msg.Context != pb.SourceContext_REALTIME {
				return
			}
		case pb.SourceContextFilter_RECORDED_ONLY:
			if msg.Context != pb.SourceContext_RECORDED {
				return
			}
		default:
			panic("unexpected pb.SourceContextFilter")
		}

		// Filter source
		if !(filter.GetSource() == "" || filter.GetSource() == msg.GetSource()) {
			return
		}

		// Filter names
		if len(filter.Names) > 0 && !slices.Contains(filter.Names, msg.GetEvent().GetRef().GetName()) {
			return
		}

		metricSubResponseSize.Record(
			s.Context(),
			int64(proto.Size(msg)),
			metric.WithAttributes(attribute.String("bus", "event")),
		)

		s.Send(msg)
	})

	// This is a long running subscription until the context request cancellation
	<-s.Context().Done()
	return nil
}

// SubTelemetry implements pb.ApiServer.
func (r *apiServer) SubTelemetry(filter *pb.BusFilter, s grpc.ServerStreamingServer[pb.SourcedTelemetry]) error {
	// Validate filter
	switch filter.GetContext() {
	case pb.SourceContextFilter_ALL, pb.SourceContextFilter_REALTIME_ONLY, pb.SourceContextFilter_RECORDED_ONLY:
		// These are ok
	default:
		return fmt.Errorf("invalid source context filter: %s", filter.GetContext())
	}

	host.Telemetry.On(s.Context(), func(msg *pb.SourcedTelemetry) {
		// Filter source context
		switch filter.GetContext() {
		case pb.SourceContextFilter_ALL:
			// Don't filter anything
		case pb.SourceContextFilter_REALTIME_ONLY:
			if msg.Context != pb.SourceContext_REALTIME {
				return
			}
		case pb.SourceContextFilter_RECORDED_ONLY:
			if msg.Context != pb.SourceContext_RECORDED {
				return
			}
		default:
			panic("unexpected pb.SourceContextFilter")
		}

		// Filter source
		if !(filter.GetSource() == "" || filter.GetSource() == msg.GetSource()) {
			return
		}

		// Filter names
		if len(filter.Names) > 0 && !slices.Contains(filter.Names, msg.GetTelemetry().GetRef().GetName()) {
			return
		}

		metricSubResponseSize.Record(
			s.Context(),
			int64(proto.Size(msg)),
			metric.WithAttributes(attribute.String("bus", "telemetry")),
		)

		s.Send(msg)
	})

	// This is a long running subscription until the context request cancellation
	<-s.Context().Done()
	return nil
}

// SubFileTransfer implements grpc.ApiServer.
func (r *apiServer) SubFileTransfer(_ *emptypb.Empty, s grpc.ServerStreamingServer[pb.FileTransferState]) error {
	host.FileTransfer.On(s.Context(), func(msg *pb.FileTransferState) {
		s.Send(msg)
	})

	// This is a long running subscription until the context request cancellation
	<-s.Context().Done()
	return nil
}

// GetFileTransferState implements grpc.ApiServer.
func (r *apiServer) GetFileTransferState(context.Context, *emptypb.Empty) (*pb.FileTransferState, error) {
	return host.FileTransfer.State(), nil
}

// ClearDownlinkTransferState implements grpc.ApiServer.
func (r *apiServer) ClearDownlinkTransferState(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	host.FileTransfer.ClearDownlink()
	return &emptypb.Empty{}, nil
}

// ClearUplinkTransferState implements grpc.ApiServer.
func (r *apiServer) ClearUplinkTransferState(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	host.FileTransfer.ClearUplink()
	return &emptypb.Empty{}, nil
}

// SubscribeDictionary implements pb.ApiServer.
func (r *apiServer) SubscribeDictionary(_ *emptypb.Empty, s grpc.ServerStreamingServer[pb.DictionaryList]) error {
	host.Dictionaries.Subscribe(s.Context(), func(dl *pb.DictionaryList) {
		s.Send(dl)
	})

	<-s.Context().Done()
	return nil
}

// SubscribeFsw implements pb.ApiServer.
func (r *apiServer) SubscribeFsw(_ *emptypb.Empty, s grpc.ServerStreamingServer[pb.FswList]) error {
	host.Profiles.ConnectionState.Subscribe(s.Context(), func(f []*pb.Fsw) {
		s.Send(&pb.FswList{All: f})
	})

	<-s.Context().Done()
	return nil
}

// SubscribeProfiles implements pb.ApiServer.
func (r *apiServer) SubscribeProfiles(_ *emptypb.Empty, s grpc.ServerStreamingServer[pb.ProfileList]) error {
	host.Profiles.ProfileState.Subscribe(s.Context(), func(sp map[string]*pb.StatefulProfile) {
		s.Send(&pb.ProfileList{All: sp})
	})

	<-s.Context().Done()
	return nil
}

// SubscribeProviders implements pb.ApiServer.
func (r *apiServer) SubscribeProviders(_ *emptypb.Empty, s grpc.ServerStreamingServer[pb.ProfileProviderList]) error {
	host.Profiles.ProviderState.Subscribe(s.Context(), func(pp []*pb.ProfileProvider) {
		s.Send(&pb.ProfileProviderList{All: pp})
	})

	<-s.Context().Done()
	return nil
}

// UpdateProfile implements pb.ApiServer.
func (r *apiServer) UpdateProfile(ctx context.Context, pu *pb.ProfileUpdate) (*emptypb.Empty, error) {
	prof, err := host.Profiles.GetProfile(pu.GetId())
	if err != nil {
		return nil, err
	}

	err = prof.Update(pu.GetSettings())
	if err != nil {
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
