package fprime

import (
	"context"
	"fmt"
	"net"
	"sync"
	"testing"
	"time"

	"github.com/nasa/hermes/mocks"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
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
	connected := make(chan struct{})
	disconnected := make(chan struct{})
	canCloseFirstConn := make(chan struct{})

	cs.EXPECT().Started().Run(func() {
		close(started)
	})

	cs.EXPECT().Connect(mock.MatchedBy(func(fsw *Fsw) bool {
		return assert.NotNil(t, fsw)
	})).Run(func(fsw host.Fsw) {
		close(connected)
	}).Return().Once()

	cs.EXPECT().Disconnect(mock.MatchedBy(func(fsw *Fsw) bool {
		return assert.NotNil(t, fsw)
	})).Run(func(fsw host.Fsw) {
		close(disconnected)
	}).Return().Once()

	cs.EXPECT().Log().Return(logger)

	prov := new(serverProvider)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	runtimeWg := sync.WaitGroup{}
	runtimeWg.Go(func() {
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
	})

	// Wait for server to start
	<-started

	cs.AssertNumberOfCalls(t, "Connect", 0)
	cs.AssertNumberOfCalls(t, "Disconnect", 0)
	cs.AssertNumberOfCalls(t, "Close", 0)

	// Connect to the server with a client
	wg := sync.WaitGroup{}
	wg.Go(func() {
		clientConn, err := net.Dial("tcp", "localhost:65345")
		if !assert.NoError(t, err) {
			return
		}
		defer clientConn.Close()

		// Wait for the Connect callback to be called
		<-connected

		// Wait for signal to close the connection
		<-canCloseFirstConn
	})

	// Connect a second time while the first connection is still active
	// This should be rejected and not init another FSW
	clientConn2, err := net.Dial("tcp", "localhost:65345")
	if assert.NoError(t, err) {
		err = clientConn2.Close()
		assert.NoError(t, err)
	}

	time.Sleep(200 * time.Millisecond)

	// Signal the first connection to close
	close(canCloseFirstConn)

	wg.Wait()

	// Wait for Disconnect to be called
	<-disconnected

	cancel()
	runtimeWg.Wait()

	cs.AssertNumberOfCalls(t, "Started", 1)
	cs.AssertNumberOfCalls(t, "Connect", 1)
	cs.AssertNumberOfCalls(t, "Disconnect", 1)
}

func TestServerProfile(t *testing.T) {
	unregister, err := host.RegisterProfileProvider("FPrime Server", &serverProvider{}, ``)
	assert.NoError(t, err)

	defer unregister()

	dictId := host.Dictionaries.Add(testDictionary)

	profId, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Name:     "test",
		Provider: "FPrime Server",
		Settings: fmt.Sprintf(`{
	"name": "test-fsw",
	"address": "localhost:65346",
	"dictionary": "%s",
	"protocol": "fprime"
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
	wg.Go(func() {

		clientConn, err := net.Dial("tcp", "localhost:65346")
		if assert.NoError(t, err) {
			err = clientConn.Close()
			assert.NoError(t, err)
		}
	})

	wg.Wait()

	err = prof.Stop(context.Background())
	assert.NoError(t, err)
}
