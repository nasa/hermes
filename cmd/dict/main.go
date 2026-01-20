package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/nasa/hermes/pkg/pb"
	flag "github.com/spf13/pflag"
	"google.golang.org/protobuf/encoding/prototext"
	"google.golang.org/protobuf/proto"
)

var multiline bool = false
var indent int = 0
var filter []string
var format string = "text"
var listNs bool = false

func init() {
	flag.BoolVar(&multiline, "multiline", multiline, "whether the marshaler should format the output in")
	flag.IntVar(&indent, "indent", indent, "the number of spaces to indent by")
	flag.StringArrayVar(&filter, "filter", filter, "filter dictionary sections")
	flag.StringVarP(&format, "format", "f", format, "output format (text/wire)")
	flag.BoolVar(&listNs, "list-namespaces", listNs, "list the namespaces in the dictionary and exit")
}

func dictionaryFilter(dict *pb.Dictionary, sections []string) (*pb.Dictionary, error) {
	out := &pb.Dictionary{
		Head:     dict.Head,
		Metadata: dict.Metadata,
		Content:  map[string]*pb.DictionaryNamespace{},
	}

	content := dict.GetContent()

	for _, section := range sections {
		sectionParts := strings.Split(section, ".")
		if len(sectionParts) != 2 {
			return nil, fmt.Errorf("invalid section id in filter: '%s'", section)
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
}

func main() {
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "usage %s: %s <opts> [dict]\n", os.Args[0], os.Args[0])
		flag.PrintDefaults()
	}

	flag.Parse()

	switch format {
	case "text", "wire":
	default:
		log.Fatalf("--format must be 'text' or 'wire'")
	}

	sourcePath := flag.Arg(0)
	if sourcePath == "" {
		log.Fatalf("dictionary.pb file not specfied")
	}

	f, err := os.ReadFile(sourcePath)
	if err != nil {
		log.Fatalf("failed to read file %s: %s", sourcePath, err.Error())
	}

	var dict pb.Dictionary
	err = proto.Unmarshal(f, &dict)
	if err != nil {
		log.Fatalf("failed to decode dictionary %s", err.Error())
	}

	var dictFiltered *pb.Dictionary

	if listNs {
		fmt.Printf("name,types,commands,events,telemetry,parameters\n")
		for name, ns := range dict.Content {
			fmt.Printf(
				"%s,%d,%d,%d,%d,%d\n",
				name,
				len(ns.Types),
				len(ns.Commands),
				len(ns.Events),
				len(ns.Telemetry),
				len(ns.Parameters),
			)
		}

		return
	}

	// Filter the dictionary
	if len(filter) > 0 {
		dictFiltered, err = dictionaryFilter(&dict, filter)
		if err != nil {
			log.Fatalf("failed to filter dictionary: %s", err.Error())
		}
	} else {
		dictFiltered = &dict
	}

	if format == "text" {
		var indentStr = ""
		for range indent {
			indentStr += " "
		}

		m := prototext.MarshalOptions{
			Multiline: multiline,
			Indent:    indentStr,
		}

		os.Stdout.Write([]byte(m.Format(dictFiltered)))
	} else {
		b, err := proto.Marshal(dictFiltered)
		if err != nil {
			log.Fatalf("failed to marshal dictionary: %s", err.Error())
		}

		os.Stdout.Write(b)
	}
}
