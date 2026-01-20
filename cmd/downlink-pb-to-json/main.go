package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"

	flag "github.com/spf13/pflag"
	"google.golang.org/protobuf/proto"

	"github.com/nasa/hermes/pkg/pb"
)

var helpMessage = `
Convert '.md.pb' files from downlink into JSON format
`

func init() {
	flag.ErrHelp = errors.New(helpMessage)
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, `Convert '.pb' files from downlink into JSON format
Usage for downlink-to-pb-json:
%s <downlink.pb> > out.json

`, os.Args[0])
		flag.PrintDefaults()
	}
}

func main() {
	flag.Parse()

	srcFile := flag.Arg(0)
	if srcFile == "" {
		log.Fatal("expected .md.pb downlink file to decode")
	}

	src, err := os.ReadFile(srcFile)
	if err != nil {
		log.Fatalf("failed to read input file: %v", err)
	}

	var p pb.FileDownlink
	err = proto.Unmarshal(src, &p)
	if err != nil {
		log.Fatalf("failed to read decode file: %v", err)
	}

	s, err := json.Marshal(&p)
	if err != nil {
		log.Fatalf("failed to encode json: %v", err)
	}

	fmt.Print(string(s))
}
