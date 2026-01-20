package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	flag "github.com/spf13/pflag"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/nasa/hermes/pkg/client"
	hermesGrpc "github.com/nasa/hermes/pkg/grpc"
	"github.com/nasa/hermes/pkg/pb"

	"github.com/nasa/hermes/pkg/util"
)

var commandMode bool = false
var noCommandWait bool = false
var fswId string = ""
var sourcePath string
var destinationPath string
var localChunkSize uint32 = 65536

var helpMessage = `
Uplink a file to a Hermes backend
` + client.EnvironmentHelp

func init() {
	flag.ErrHelp = errors.New(helpMessage)
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, `Uplink a file to a Hermes backend
Usage for file uplink:
%s [-f fsw-id] <source-path> <destination-path>

Usage for command uplink
%s -c [-f fsw-id] MNEMONIC ARG1 ARG2

`, os.Args[0], os.Args[0])
		flag.PrintDefaults()
	}

	flag.StringVarP(&fswId, "fsw", "f", fswId, "FSW ID to uplink to, by default this uses the FSW connect (if there is only one connection)")
	flag.BoolVarP(&commandMode, "cmd", "c", commandMode, "Send command rather than uplink a file")
	flag.BoolVarP(&noCommandWait, "no-wait", "n", noCommandWait, "Don't wait for command to finish, exit once it's sent")
	flag.Uint32Var(&localChunkSize, "chunk-size", localChunkSize, "chunk size to send to host server with")
}

func uplinkFile(ctx context.Context, client hermesGrpc.ApiClient) {
	sourcePath = flag.Arg(0)
	if sourcePath == "" {
		log.Fatalf("expected a source path argument")
	}

	destinationPath = flag.Arg(1)
	if destinationPath == "" {
		log.Fatalf("expected a destination path argument")
	}

	st, err := os.Stat(sourcePath)
	if err != nil {
		log.Fatalf("failed to stat '%s': %v", sourcePath, err)
	} else if st.IsDir() {
		log.Fatal("cannot update a directory")
	}

	f, err := os.Open(sourcePath)
	if err != nil {
		log.Fatalf("failed to open file %s for reading: %v", sourcePath, err)
	}

	// Send the header chunk
	uplinkStream, err := client.Uplink(ctx)
	if err != nil {
		log.Fatalf("failed to start uplink request: %v", err)
	}

	err = uplinkStream.Send(&pb.UplinkFileChunk{
		Value: &pb.UplinkFileChunk_Header{Header: &pb.FileHeader{
			SourcePath:      sourcePath,
			DestinationPath: destinationPath,
			Size:            uint64(st.Size()),
		}},
	})

	if err != nil {
		log.Fatalf("failed to send file header: %v", err)
	}

	buffer := make([]byte, localChunkSize)
	for {
		n, err := f.Read(buffer)
		if err != nil {
			if !errors.Is(err, io.EOF) {
				log.Fatalf("failed to read chunk from file: %v", err)
			} else {
				break
			}
		}

		err = uplinkStream.Send(&pb.UplinkFileChunk{
			Value: &pb.UplinkFileChunk_Data{
				Data: buffer[:n],
			},
		})

		if err != nil {
			log.Fatalf("failed to send file chunk: %v", err)
		}
	}

	_, err = uplinkStream.CloseAndRecv()
	if err != nil {
		log.Fatalf("failed to close stream: %v", err)
	}

	log.Println("uplink finished")
}

func uplinkCommand(ctx context.Context, client hermesGrpc.ApiClient) {
	cmd := strings.Join(flag.Args(), " ")

	reply, err := client.RawCommand(ctx, &pb.RawCommandValue{
		Command: cmd,
		Options: &pb.CommandOptions{
			NoWait: noCommandWait,
		},
	})

	if err != nil {
		log.Fatalf("failed to uplink command: %v", err)
	}

	if !reply.Success {
		log.Fatalf("command reported failure")
	}
}

func main() {
	flag.Parse()

	ctx := util.SigTermIntContext()

	conn, err := client.NewClient()
	if err != nil {
		log.Fatal(err)
	}

	defer conn.Close()

	client := hermesGrpc.NewApiClient(conn)

	if fswId == "" {
		fswList, err := client.AllFsw(ctx, &emptypb.Empty{})
		if err != nil {
			log.Fatalf("failed to get available fsws: %v", err)
		}

		allList := fswList.GetAll()
		if len(allList) != 1 {
			log.Fatalf("--fsw is not specified, there needs to be exactly one FSW connected not '%d'", len(allList))
		}

		fswId = allList[0].GetId()
	}

	md := metadata.New(map[string]string{
		"id": fswId,
	})

	uplinkCtx := metadata.NewOutgoingContext(ctx, md)

	if commandMode {
		uplinkCommand(uplinkCtx, client)
	} else {
		uplinkFile(uplinkCtx, client)
	}
}
