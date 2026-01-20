package fprime

import (
	"context"
	"fmt"
	"net"
	"sync"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/nasa/hermes/mocks"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
)

var testDictionary = &pb.Dictionary{
	Head: &pb.DictionaryHead{
		Name:    "test",
		Type:    "fprime",
		Version: "test-v1.0.0",
	},
	Content: map[string]*pb.DictionaryNamespace{
		"": {},
	},
}

func TestServerConnDisc(t *testing.T) {
	cs := mocks.NewMockConnectSession(t)
	logger := log.GetLogger(context.TODO())

	started := make(chan struct{})

	cs.EXPECT().Started().Run(func() {
		close(started)
	})

	cs.EXPECT().Connect(mock.MatchedBy(func(fsw *Fsw) bool {
		return assert.NotNil(t, fsw)
	})).Return()
	cs.EXPECT().Disconnect(mock.MatchedBy(func(fsw *Fsw) bool {
		return assert.NotNil(t, fsw)
	})).Return()

	cs.EXPECT().Log().Return(logger)

	prov := new(serverProvider)

	ctx, cancel := context.WithCancel(context.Background())

	runtimeWg := sync.WaitGroup{}
	runtimeWg.Add(1)
	go func() {
		defer runtimeWg.Done()
		err := prov.Start(
			ctx,
			ServerParams{
				Name:       "fswName",
				Address:    "localhost:65345",
				Dictionary: host.Dictionaries.Add(testDictionary),
				Protocol:   "fprime",
			},
			cs,
		)

		assert.NoError(t, err)
	}()

	cs.AssertNumberOfCalls(t, "Connect", 0)
	cs.AssertNumberOfCalls(t, "Disconnect", 0)
	cs.AssertNumberOfCalls(t, "Close", 0)

	<-started

	// Connect to the server with a client
	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()

		clientConn, err := net.Dial("tcp", "localhost:65345")

		if !assert.NoError(t, err) {
			return
		}

		// Connect a second time, this connect should be rejected and not init another FSW
		clientConn2, err := net.Dial("tcp", "localhost:65345")
		if assert.NoError(t, err) {
			err = clientConn2.Close()
			assert.NoError(t, err)
		}

		err = clientConn.Close()
		assert.NoError(t, err)
	}()

	wg.Wait()
	cancel()
	runtimeWg.Wait()

	cs.AssertNumberOfCalls(t, "Started", 1)
	cs.AssertNumberOfCalls(t, "Connect", 1)
	cs.AssertNumberOfCalls(t, "Disconnect", 1)
	cs.AssertNumberOfCalls(t, "Started", 1)
}

func TestServerProfile(t *testing.T) {
	unregister, err := host.RegisterProfileProvider("FPrime Server", &serverProvider{}, ``)
	assert.NoError(t, err)

	defer unregister()

	dictId := host.Dictionaries.Add(testDictionary)

	profId, err := host.Profiles.Add(&pb.Profile{
		Name:     "test",
		Provider: "FPrime Server",
		Settings: fmt.Sprintf(`{
	"name": "test-fsw",
	"address": "localhost:65346",
	"dictionary": "%s"
}`, dictId),
	})

	assert.NoError(t, err)
	defer host.Profiles.Remove(profId)

	prof, err := host.Profiles.GetProfile(profId)
	if !assert.NoError(t, err) {
		return
	}

	err = prof.Start(context.Background())
	assert.NoError(t, err)

	// Connect to the server with a client
	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()

		clientConn, err := net.Dial("tcp", "localhost:65346")
		if assert.NoError(t, err) {
			err = clientConn.Close()
			assert.NoError(t, err)
		}
	}()

	wg.Wait()

	err = prof.Stop(context.Background())
	assert.NoError(t, err)
}
