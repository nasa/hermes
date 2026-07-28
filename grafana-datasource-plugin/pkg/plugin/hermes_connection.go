package plugin

import (
	"context"
	"sync"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	hermesGrpc "github.com/nasa/hermes/pkg/grpc"
	pb "github.com/nasa/hermes/pkg/pb"
)

type HermesConnection struct {
	hermesClient hermesGrpc.ApiClient
	mu           sync.RWMutex
	dictHeads    map[string]*pb.DictionaryHead
	dicts        map[string]*pb.Dictionary
}

func newHermesConn(ctx context.Context, hermesGrpcConnStr string) (*HermesConnection, error) {
	hermesConn, err := grpc.NewClient(hermesGrpcConnStr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}

	h := &HermesConnection{
		hermesClient: hermesGrpc.NewApiClient(hermesConn),
		dictHeads:    make(map[string]*pb.DictionaryHead),
		dicts:        make(map[string]*pb.Dictionary),
	}

	if dictList, err := h.hermesClient.AllDictionary(ctx, &emptypb.Empty{}); err != nil {
		return nil, err
	} else {
		h.mu.Lock()
		h.dictHeads = dictList.All
		for dictID := range dictList.GetAll() {
			if _, exists := h.dicts[dictID]; !exists {
				go h.getDict(ctx, dictID)
			}
		}
		h.mu.Unlock()
	}

	go h.syncDicts(ctx)

	return h, nil
}

func (h *HermesConnection) syncDicts(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			dictStream, err := h.hermesClient.SubscribeDictionary(ctx, &emptypb.Empty{})
			if err != nil {
				log.DefaultLogger.Error("Failed to subscribe to Hermes dictionaries, retrying...", "err", err)
				time.Sleep(5 * time.Second)
				continue
			}

			for {
				dictList, err := dictStream.Recv()
				if err != nil {
					log.DefaultLogger.Error("Hermes dictionary stream error, reconnecting...", "err", err)
					break
				}

				h.mu.Lock()
				h.dictHeads = dictList.All
				for dictId := range h.dictHeads {
					if _, exists := h.dicts[dictId]; !exists {
						go h.getDict(ctx, dictId)
					}
				}
				h.mu.Unlock()
			}
		}
	}
}

func (h *HermesConnection) getDict(ctx context.Context, dictID string) {
	log.DefaultLogger.Info("Fetching new dictionary", "id", dictID)

	dict, err := h.hermesClient.GetDictionary(ctx, &pb.Id{Id: dictID})
	if err != nil {
		log.DefaultLogger.Error("Failed to get dictionary definitions", "id", dictID, "err", err)
		return
	}

	h.mu.Lock()
	h.dicts[dictID] = dict
	h.mu.Unlock()
}
