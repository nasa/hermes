package main

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"os"
	"reflect"
	"strconv"
	"sync"
	"time"

	"github.com/nasa/hermes/pkg/client"
	hermesGrpc "github.com/nasa/hermes/pkg/grpc"
	hermesLog "github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/util"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func BatchEvents[T any](inChan <-chan T, batchSize int, flushInterval time.Duration) chan []T {
	out := make(chan []T)
	batch := make([]T, batchSize)
	go func() {
		defer close(out)
		i := 0
		for {
			select {
			case event, ok := <-inChan:
				if !ok {
					return
				}
				batch[i] = event
				i++
				if i == batchSize {
					out <- batch
					// reset for next batch
					batch = make([]T, batchSize)
					i = 0
				}
			case <-time.After(flushInterval):
				// process whatever we have seen so far if the batch size isn't filled in 5 secs
				if i > 0 {
					out <- batch[:i]
					// reset for next batch
					batch = make([]T, batchSize)
					i = 0
				}
			}
		}
	}()
	return out
}

func unpackArray[S ~[]E, E any](s S) []any {
	r := make([]any, len(s))
	for i, e := range s {
		r[i] = e
	}
	return r
}

func main() {
	log := hermesLog.GetLogger(context.TODO())
	config := parse_config(log)
	if config.Verbose {
		hermesLog.ConsoleLevel = slog.LevelDebug
	}

	var recorder Recorder
	var err error
	switch config.Driver {
	case DriverSQLite3:
		log.Info("connecting to sqlite3 database", "filename", config.Sqlite)
		recorder, err = NewSQLiteRecorder(config.Sqlite, config.ExtraColumn)
	case DriverTimeScale:
		log.Info("connecting to postgres database", "uri", config.Postgresql)
		recorder, err = NewPGRecorder(config.Postgresql, config.ExtraColumn)
	default:
		log.Error("unknown driver!")
		os.Exit(1)
	}
	if err != nil {
		log.Error("failed to create new recorder", "err", err)
		os.Exit(1)
	}
	defer recorder.Close()

	err = recorder.Initialize()
	if err != nil {
		log.Error("failed to initialize recorder", "err", err)
		os.Exit(1)
	}

	conn, err := client.NewClient()
	if err != nil {
		log.Error("failed to create new client", "err", err)
		os.Exit(1)
	}
	defer conn.Close()

	client := hermesGrpc.NewApiClient(conn)
	ctx := util.SigTermIntContext()

	wg := sync.WaitGroup{}

	evrBuffer := make(chan *pb.SourcedEvent, config.BufferSize)

	if !config.NoEvrs {
		log.Info("Subscribing to event Stream")
		evrStream, err := client.SubEvent(ctx, &pb.BusFilter{})
		if err != nil {
			log.Error("failed to subscribe to event stream", err)
			os.Exit(1)
		}

		wg.Add(1)
		go func() {
			defer wg.Done()
			defer close(evrBuffer)

			for {
				res, err := evrStream.Recv()
				if errors.Is(err, io.EOF) || status.Code(err) == codes.Canceled {
					break
				} else if err != nil {
					log.Error("failed to read telemetry message", "err", err)
					os.Exit(1)
				}
				evrBuffer <- res
			}
		}()
	}

	telemetryBuffer := make(chan *pb.SourcedTelemetry, config.BufferSize)

	if !config.NoTlm {
		log.Info("Subscribing to Telemetry Stream")
		telemetryStream, err := client.SubTelemetry(ctx, &pb.BusFilter{})
		if err != nil {
			log.Error("failed to subscribe to telemetry stream")
			os.Exit(1)
		}

		wg.Add(1)
		go func() {
			defer wg.Done()
			defer close(telemetryBuffer)

			for {
				res, err := telemetryStream.Recv()
				if errors.Is(err, io.EOF) || status.Code(err) == codes.Canceled {
					break
				} else if err != nil {
					log.Error("failed to read telemetry message", "err", err)
					os.Exit(1)
				}
				telemetryBuffer <- res
			}
		}()
	}

	wg.Add(1)
	go func() {
		defer wg.Done()

		flushIntervalDuration := time.Duration(config.FlushInterval * float64(time.Millisecond))
		telemetryBatches := BatchEvents(telemetryBuffer, config.BatchSize, flushIntervalDuration)
		evrBatches := BatchEvents(evrBuffer, config.BatchSize, flushIntervalDuration)
		replayBatches := make(chan []any, 1)

		for range recorder.MaxConnections() {
			go func() {
			batchloop:
				for {
					var batch []any
					select {
					case telBatch := <-telemetryBatches:
						batch = unpackArray(telBatch)
					case evrBatch := <-evrBatches:
						batch = unpackArray(evrBatch)
					case replayBatch := <-replayBatches:
						batch = replayBatch
					}

					log.Info("writing telemetry batch", "type", reflect.TypeOf(batch[0]), "len", strconv.Itoa(len(batch)))

					tx, err := recorder.StartTransaction()
					if err != nil {
						log.Warn("failed to start telemetry transaction", "err", err)
						replayBatches <- batch
						continue
					}

					for _, anyTelemetry := range batch {
						switch tel := anyTelemetry.(type) {
						case *pb.SourcedTelemetry:
							err = recorder.InsertTelemetry(tx, tel)
						case *pb.SourcedEvent:
							err = recorder.InsertEvent(tx, tel)
						}
						if err != nil {
							log.Warn("failed to insert telemetry message", "err", err)
							replayBatches <- batch
							continue batchloop
						}
					}

					err = tx.Commit()
					if err != nil {
						log.Warn("failed to commit telemetry transaction", "err", err)
						replayBatches <- batch
						continue
					}
				}
			}()
		}
	}()

	go func() {
		ticker := time.NewTicker(5 * time.Second)
		for {
			select {
			case <-ticker.C:
				log.Info("stats", "stats", recorder.DB().Stats())
			case <-ctx.Done():
				return
			}
		}
	}()

	wg.Wait()
}
