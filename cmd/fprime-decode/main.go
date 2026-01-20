package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"

	"github.com/nasa/hermes/pkg/fprime"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/serial"
	flag "github.com/spf13/pflag"
	"google.golang.org/protobuf/proto"
)

var dictionary string
var verbose bool = false

func init() {
	flag.StringVarP(&dictionary, "dictionary", "d", dictionary, "dictionary to decode telemetry with")
	flag.BoolVarP(&verbose, "verbose", "v", verbose, "print debug log levels")
}

func main() {
	flag.Parse()
	logger := log.GetLogger(context.Background())

	if verbose {
		log.ConsoleLevel = slog.LevelDebug
	}

	logger.Debug("reading dictionary file", "filename", dictionary)
	contents, err := os.ReadFile(dictionary)
	if err != nil {
		logger.Error("failed to read dictionary", "err", err)
		os.Exit(1)
	}

	var dict pb.Dictionary
	err = proto.Unmarshal(contents, &dict)
	if err != nil {
		logger.Error("failed to decode dictionary", "err", err)
		os.Exit(2)
	}

	dictNs, ok := dict.Content[""]
	if !ok {
		logger.Error("dictionary does not have primary namespace")
		os.Exit(3)
	}

	var hostTlmPktDict *host.DictionaryNamespace
	tlmPktDict, ok := dict.Content["telemetry-packets"]
	if ok {
		hostTlmPktDict, err = host.NewDictionaryNamespace(tlmPktDict)
		if err != nil {
			logger.Error("failed to load dictionary", "err", err)
			os.Exit(4)
		}
	} else {
		logger.Warn("dictionary does not have 'telemetry-packets' namespace, packetized telemetry won't decode")
		hostTlmPktDict, _ = host.NewDictionaryNamespace(nil)
	}

	hostDict, err := host.NewDictionaryNamespace(dictNs)
	if err != nil {
		logger.Error("failed to load dictionary", "err", err)
		os.Exit(4)
	}

	r := serial.NewReader(nil)
	for pktRaw := range fprime.NewFprimeProtocolDeframer(os.Stdin) {
		r.Set(pktRaw)

		var pkt fprime.Packet
		err := pkt.Unmarshal(r, hostDict, hostTlmPktDict)

		if err != nil {
			logger.Error("failed to decode fprime packet", "err", err)
		} else {
			js, _ := json.Marshal(pkt)
			fmt.Println(string(js))
		}
	}
}
