package dwn

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"slices"
	"sync"
	"time"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/infra"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/util"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/trace"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var metricFileDownlinkSize, _ = infra.Meter.Int64Counter(
	"hermes.downlink.size.confirmed",
	metric.WithDescription("Total bytes downlinked on this file"),
	metric.WithUnit("By"),
)

var metricFileDownlinkSizeMissing, _ = infra.Meter.Int64Counter(
	"hermes.downlink.size.missing",
	metric.WithDescription("Total bytes missing on this file"),
	metric.WithUnit("By"),
)

var metricFileDownlinkSizeDiscarded, _ = infra.Meter.Int64Counter(
	"hermes.downlink.size.discarded",
	metric.WithDescription("Total redundant bytes discarded on this file"),
	metric.WithUnit("By"),
)

var metricFileDownlinkChunks, _ = infra.Meter.Int64Counter(
	"hermes.downlink.chunks",
	metric.WithDescription("Total number of chunks downlinked on this file"),
)

var metricFileDownlinkN, _ = infra.Meter.Int64Counter(
	"hermes.downlink.count.all",
	metric.WithDescription("Total number of files downlinked from this source (failed and succesful)"),
)

var metricFileDownlinkFailedN, _ = infra.Meter.Int64Counter(
	"hermes.downlink.count.failed",
	metric.WithDescription("Total number of files that failed to downlink from this source"),
)

var metricFileDownlinkConfirmedN, _ = infra.Meter.Int64Counter(
	"hermes.downlink.count.confirmed",
	metric.WithDescription("Total number of files that successfully downlinked from this source"),
)

var (
	_ downlinkMessage = (*DownlinkChunk)(nil)
	_ downlinkMessage = (*metadataMessage)(nil)
)

type downlinkMessage interface {
	downlinkMessage()
}

type DownlinkChunk struct {
	// Offset in bytes of this data chunk
	Offset uint64

	// Chunk data
	Data []byte

	MD map[string]string
}

type metadataMessage struct {
	key  string
	data []byte
}

func (d *DownlinkChunk) downlinkMessage()   {}
func (m *metadataMessage) downlinkMessage() {}

type storedDownlinkChunk struct {
	// Offset that this chunk was actually stored in the staging file
	ActualOffset uint64

	// Offset where the data should be in the file
	TargetOffset uint64

	// Size of the data chunk
	Size uint32
}

type FileValidator interface {
	Validate(r io.Reader) error
}

// Holds the set of chunks downlinked and where they are in the buffer file
// This allows us to reconstitute the file post-downlink completion
type DownlinkSession struct {
	// Stream chunks down to this session
	queue chan downlinkMessage

	// Otel span for the running downlink
	span trace.Span

	logger log.Logger

	// Waitgroup for waiting for downlink to finish
	wg sync.WaitGroup

	// Keeps track of what is stored in the staging file
	storedChunks []*storedDownlinkChunk

	// Staging file for writing chunks as they come in realtime
	stagingFileWriter io.Writer
	stagingFile       *os.File

	// Current offset of the staging file
	stagingOffset uint64

	// Expected full file size
	// if the write offset does not reach this once the queue closes, status will be `TIMEOUT`
	expectedSize uint64

	// Tracks the message that will be emitted once the downlink finishes
	msg *pb.FileDownlink

	metricAttr metric.MeasurementOption

	// Validation function for checking file integrity
	validator FileValidator
}

func NewDownlinkSession(
	logger log.Logger,
	source string,
	sourcePath string,
	destinationPath string,
	fileSize uint64,
	validator FileValidator,
	attributes ...attribute.KeyValue,
) (*DownlinkSession, error) {
	f, err := os.CreateTemp("", "hermes-downlink")
	if err != nil {
		return nil, fmt.Errorf("failed to open tmp file: %w", err)
	}

	uid := util.GenerateShortUID()

	host.FileTransfer.AddDownlink(
		uid,
		source,
		sourcePath,
		destinationPath,
		fileSize,
	)

	filePath := newDownlinkFilePath(
		uid,
		source,
		sourcePath,
		destinationPath,
	)

	metricFileDownlinkN.Add(
		context.Background(), 1,
		metric.WithAttributes(attribute.String("source", source)),
	)

	attributes = append(
		attributes,
		attribute.String("uid", uid),
		attribute.String("path", filePath),
		attribute.String("sourcePath", sourcePath),
		attribute.String("destinationPath", destinationPath),
	)

	spanCtx, span := otel.Tracer("downlink").Start(
		context.TODO(),
		"FileDownlink",
		trace.WithAttributes(attributes...),
	)

	out := &DownlinkSession{
		wg: sync.WaitGroup{},
		logger: logger.WithGroup("downlink").With(
			"uid", uid,
			"path", filePath,
			"sourcePath", sourcePath,
			"destinationPath", destinationPath,
		).WithContext(spanCtx),
		span: span,

		queue:             make(chan downlinkMessage, 32),
		storedChunks:      make([]*storedDownlinkChunk, 0),
		stagingFile:       f,
		stagingFileWriter: bufio.NewWriter(f),
		stagingOffset:     0,
		expectedSize:      fileSize,

		metricAttr: metric.WithAttributes(attributes...),

		msg: &pb.FileDownlink{
			Uid:       uid,
			TimeStart: timestamppb.New(time.Now().UTC()),

			Source:          source,
			SourcePath:      sourcePath,
			DestinationPath: destinationPath,
			FilePath:        filePath,

			Status: pb.FileDownlinkCompletionStatus_DOWNLINK_UNKNOWN,

			Size:     fileSize,
			Metadata: map[string]string{},
		},

		validator: validator,
	}

	// Process the fileio in another goroutine
	out.wg.Go(func() {
		defer out.span.End()
		out.eventLoop()
	})

	return out, nil
}

func (s *DownlinkSession) SetExpectedSize(size uint64) {
	s.expectedSize = size
}

func (s *DownlinkSession) infillChunk(
	offset uint64,
	missingSize uint64,
	outFile *os.File,
) error {
	s.msg.MissingChunks = append(
		s.msg.MissingChunks,
		&pb.FileDownlinkChunk{
			Offset: offset,
			Size:   missingSize,
		},
	)

	metricFileDownlinkSizeMissing.Add(
		context.Background(),
		int64(missingSize),
		s.metricAttr,
	)

	s.logger.Warn(
		"infilling missing file chunk",
		"size",
		missingSize,
		"offset",
		offset,
	)

	_, err := outFile.WriteAt(make([]byte, missingSize), int64(offset))
	if err != nil {
		s.logger.Error("failed to write chunk to file",
			"err", err,
			"offset", offset,
			"size", missingSize,
		)

		return err
	}

	return nil
}

func (s *DownlinkSession) eventLoop() {
	s.logger.Info("file downlink started")
	stagingFileName := s.stagingFile.Name()

	// Make sure to clean up the tmp file once we finish
	defer os.Remove(stagingFileName)
	defer func() {
		s.msg.TimeEnd = timestamppb.New(time.Now().UTC())
		s.span.AddEvent(
			"finished",
			trace.WithAttributes(
				attribute.String("status", s.msg.Status.String()),
			),
		)

		switch s.msg.Status {
		case pb.FileDownlinkCompletionStatus_DOWNLINK_COMPLETED:
			metricFileDownlinkConfirmedN.Add(
				context.Background(),
				1,
				metric.WithAttributes(attribute.String("source", s.msg.Source)),
			)
			s.span.SetStatus(codes.Ok, "downlink successful")
		default:
			metricFileDownlinkFailedN.Add(
				context.Background(),
				1,
				metric.WithAttributes(attribute.String("source", s.msg.Source)),
			)
			s.span.SetStatus(codes.Error, "downlink failed")
		}

		// Notify a downlink has finished
		host.FileDownlink.Emit(s.msg)
	}()

	for msg := range s.queue {
		switch chunk := msg.(type) {
		case *metadataMessage:
			s.span.AddEvent(
				"received file metadata",
				trace.WithAttributes(
					attribute.String("key", chunk.key),
				),
			)

			s.msg.Metadata[chunk.key] = string(chunk.data)
		case *DownlinkChunk:
			chunkSize := uint32(len(chunk.Data))

			attr := []attribute.KeyValue{
				attribute.Int64("offset", int64(chunk.Offset)),
				attribute.Int64("size", int64(chunkSize)),
			}

			for key, val := range chunk.MD {
				attr = append(attr, attribute.String(key, val))
			}

			s.span.AddEvent(
				"received file chunk",
				trace.WithAttributes(attr...),
			)

			// Write the chunk to disk and keep track of it
			s.storedChunks = append(s.storedChunks, &storedDownlinkChunk{
				ActualOffset: s.stagingOffset,
				TargetOffset: chunk.Offset,
				Size:         chunkSize,
			})

			metricFileDownlinkSize.Add(
				context.Background(),
				int64(chunkSize),
				s.metricAttr,
			)

			metricFileDownlinkChunks.Add(
				context.Background(),
				1, s.metricAttr,
			)

			n, err := s.stagingFile.Write(chunk.Data)
			if err != nil {
				s.logger.Error("failed to write chunk to staging file", "err", err)
			}

			s.stagingOffset += uint64(n)
			host.FileTransfer.DownlinkProgress(s.msg.Uid, uint64(uint64(chunkSize)))
		}
	}

	s.stagingFile.Sync()
	s.stagingFile.Close()

	stagingFileRead, err := os.Open(stagingFileName)
	if err != nil {
		s.logger.Error("failed to open staging file for reading", "err", err)
		return
	}

	defer stagingFileRead.Close()

	s.logger.Debug("staging complete, processing downlink", "chunks", len(s.storedChunks))

	// Sort the stored chunks by target offsets so we can re-create the actual file
	slices.SortFunc(s.storedChunks, func(a, b *storedDownlinkChunk) int {
		return int(a.TargetOffset - b.TargetOffset)
	})

	// TODO(tumbar) We should consolidate adjecent chunks here

	s.logger.Debug("opening destination file", "path", s.msg.FilePath)
	outFile, err := os.Create(s.msg.FilePath)
	if err != nil {
		s.logger.Error("failed to open destination file", "path", s.msg.FilePath, "err", err)
		return
	}

	defer outFile.Close()

	metadataFilePath := getDownlinkMetadataFilePath(s.msg.FilePath)
	s.logger.Debug("opening destination metadata file", "path", metadataFilePath)

	metadataFile, err := os.Create(metadataFilePath)
	if err != nil {
		s.logger.Error("failed to open destination metadata file", "path", metadataFilePath, "err", err)
		return
	}

	defer metadataFile.Close()

	s.msg.MissingChunks = []*pb.FileDownlinkChunk{}
	s.msg.DuplicateChunks = []*pb.FileDownlinkChunk{}

	// Write the chunks in order in the destination file
	missingChunks := false
	offset := uint64(0)
	for _, chunk := range s.storedChunks {
		// Missing chunk
		if offset < chunk.TargetOffset {
			missingChunks = true
			missingSize := chunk.TargetOffset - offset

			if s.infillChunk(offset, missingSize, outFile) != nil {
				return
			}

			offset += missingSize
		}

		// Overlapping chunk
		if offset > chunk.TargetOffset {
			// TODO(tumbar) We may NOT want to get rid of the whole chunk because the overlap
			// may not be over the whole chunk.

			s.logger.Warn(
				"discarding overlapping chunk",
				"chunk_size", chunk.Size,
				"chunk_offset", chunk.TargetOffset,
				"offset", offset,
			)

			metricFileDownlinkSizeDiscarded.Add(
				context.Background(),
				int64(chunk.Size),
				s.metricAttr,
			)

			continue
		}

		chunkBytes := make([]byte, chunk.Size)
		_, err := stagingFileRead.ReadAt(chunkBytes, int64(chunk.ActualOffset))
		if err != nil {
			s.logger.Error(
				"failed to read chunk for staging file",
				"err", err,
				"offset", chunk.ActualOffset,
				"size", chunk.Size,
			)

			return
		}

		_, err = outFile.WriteAt(chunkBytes, int64(chunk.TargetOffset))
		if err != nil {
			s.logger.Error("failed to write chunk to file",
				"err", err,
				"offset", offset,
				"size", chunk.TargetOffset-offset,
			)

			return
		}

		offset += uint64(chunk.Size)
	}

	// Infill the last chunk if needed
	if offset < s.expectedSize {
		missingChunks = true
		missingSize := s.expectedSize - offset

		if s.infillChunk(offset, missingSize, outFile) != nil {
			return
		}

		offset += missingSize
	}

	s.msg.Size = offset

	s.span.AddEvent("writing metadata file")
	mdData, err := proto.Marshal(s.msg)
	if err != nil {
		s.logger.Error("failed to encode downlink metadata", "path", metadataFilePath, "err", err)
	} else {
		_, err = metadataFile.Write(mdData)
		if err != nil {
			s.logger.Error("failed to write downlink metadata", "path", metadataFilePath, "err", err)
		}
	}

	s.span.AddEvent("syncing filesystem")
	outFile.Sync()
	metadataFile.Sync()

	if missingChunks {
		// Don't both validating the CRC since there is not enough data
		s.msg.Status = pb.FileDownlinkCompletionStatus_DOWNLINK_PARTIAL
		s.span.AddEvent("received a partial file, not validating CRC")
	} else {
		validateFile, err := os.Open(outFile.Name())
		if err != nil {
			s.msg.Status = pb.FileDownlinkCompletionStatus_DOWNLINK_CRC_FAILED
			s.logger.Warn(
				"failed to open destination file for validation",
				"path",
				outFile.Name(),
			)
		} else {
			defer validateFile.Close()
			bufferedValidateReader := bufio.NewReader(validateFile)
			if err = s.validator.Validate(bufferedValidateReader); err != nil {
				s.msg.Status = pb.FileDownlinkCompletionStatus_DOWNLINK_CRC_FAILED
				s.logger.Warn("failed to validate file", "err", err)
			} else {
				s.msg.Status = pb.FileDownlinkCompletionStatus_DOWNLINK_COMPLETED
				s.logger.Info("successfully validated file")
			}
		}
	}
}

// Wait for file downlink to be processed
func (s *DownlinkSession) Wait() *pb.FileDownlink {
	s.wg.Wait()
	return s.msg
}

// Push a chunk to the downlink queue
func (s *DownlinkSession) Chunk(chunk *DownlinkChunk) {
	s.queue <- chunk
}

// Notify session that there are no more chunks
func (s *DownlinkSession) Finish() {
	close(s.queue)
}

// Push a piece of metadata alongside the raw downlink
// This will be encoded as JSON and can be retrieved later
func (s *DownlinkSession) Metadata(key string, value any) {
	e, err := json.Marshal(value)
	if err != nil {
		s.logger.Warn("failed to encode downlink metadata to JSON", "err", err)
		return
	}

	s.queue <- &metadataMessage{
		key:  key,
		data: e,
	}
}

func getDownlinkMetadataFilePath(downlinkFilePath string) string {
	return downlinkFilePath + ".md.pb"
}

func newDownlinkFilePath(
	uid,
	source,
	sourcePath,
	desintationPath string,
) string {
	var basePath string
	if desintationPath == "" {
		basePath = sourcePath
	} else {
		basePath = desintationPath
	}

	name := path.Base(basePath)
	ext := path.Ext(name)

	name = name[:len(name)-len(ext)]
	if ext == "" {
		ext = ".dat"
	}

	joinedPath := path.Join(
		host.Config.DownlinkRoot,
		fmt.Sprintf(
			"%s-%s-%s-%s%s",
			source,
			time.Now().Format("2006-01-02-15:04:05"),
			name,
			uid, ext,
		),
	)

	aPath, err := filepath.Abs(joinedPath)

	if err != nil {
		return basePath
	}

	return aPath
}
