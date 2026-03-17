package fprime_test

import (
	_ "embed"
	"encoding/json"
	"os"
	"sync"
	"testing"

	"github.com/nasa/hermes/pkg/fprime"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/assert"

	"google.golang.org/protobuf/proto"
)

func readFile(t *testing.T, filename string) []any {
	refFile, err := os.ReadFile(filename)
	assert.NoError(t, err)

	out := []any{}
	err = json.Unmarshal(refFile, &out)
	assert.NoError(t, err)

	return out
}

func updateFile(t *testing.T, filename string, contents any) {
	out, err := json.MarshalIndent(contents, "", "  ")
	if err == nil {
		err := os.WriteFile(filename, []byte(out), 0666)
		assert.NoError(t, err)
	} else {
		t.Fatal(err)
	}
}

func serder(t *testing.T, value any) []any {
	ser, err := json.Marshal(value)
	assert.NoError(t, err)

	out := []any{}
	err = json.Unmarshal(ser, &out)
	assert.NoError(t, err)
	return out
}

func TestFPrimeTCP(t *testing.T) {
	testMux.Lock()
	defer testMux.Unlock()

	fprime.Config.UseTimeBase = true
	fprime.Config.UseTimeContext = true

	dictRaw, err := os.ReadFile("testdata/dict.pb")
	assert.NoError(t, err)

	fprimeGdsTcpStream, err := os.Open("testdata/fprime.tcp.bin")
	assert.NoError(t, err)
	defer fprimeGdsTcpStream.Close()

	var dict pb.Dictionary
	err = proto.Unmarshal(dictRaw, &dict)
	assert.NoError(t, err)

	dictHost, err := host.DictionaryFromProto(&dict)
	assert.NoError(t, err)
	assert.NoError(t, err)

	events := []*pb.SourcedEvent{}
	telemetry := []*pb.SourcedTelemetry{}

	host.Event.On(t.Context(), func(msg *pb.SourcedEvent) {
		events = append(events, msg)
	})

	host.Telemetry.On(t.Context(), func(msg *pb.SourcedTelemetry) {
		telemetry = append(telemetry, msg)
	})

	logger := log.GetLogger(t.Context())

	fsw := fprime.NewFprimeFsw(logger, "tcp", "", dictHost.Namespace(""))

	wg := sync.WaitGroup{}
	fprime.ConnectPipeline(
		t.Context(),
		logger,
		&wg,
		dictHost.Namespace(""),
		dictHost.Namespace("telemetry-packets"),
		fprimeGdsTcpStream,
		fprime.NewFprimeProtocol(fprimeGdsTcpStream, dictHost.Namespace("")),
		fsw.Down,
		fsw.Up,
	)

	wg.Wait()

	// Update reference files
	// updateFile(t, "testdata/events.json", events)
	// updateFile(t, "testdata/telemetry.json", telemetry)

	refEvents := readFile(t, "testdata/events.json")
	refTelemetry := readFile(t, "testdata/telemetry.json")

	assert.EqualValues(t, refEvents, serder(t, events))
	assert.EqualValues(t, refTelemetry, serder(t, telemetry))
}
