package integration

import (
	"context"
	"testing"
	"time"

	hermesGrpc "github.com/nasa/hermes/pkg/grpc"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/emptypb"
)

func startFprimeProfile(t *testing.T, run func(api *TestApi, fswId string)) {
	client, conn := setupGRPCClient(t)
	ctx, cancel := context.WithTimeout(context.Background(), fprimeConnectionTimeout)

	cleanup := func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), requestTimeout)
		defer cleanupCancel()
		profList, err := client.AllProfiles(cleanupCtx, &emptypb.Empty{})
		require.NoError(t, err, "Failed to get profiles")
		for id, prof := range profList.GetAll() {
			if prof.GetValue().GetName() == "fprime-integration-test" {
				client.StopProfile(cleanupCtx, &pb.Id{Id: id})
				client.RemoveProfile(cleanupCtx, &pb.Id{Id: id})
			}
		}
	}

	cleanup()

	// Create FPrime Server profile
	profile := &pb.Profile{
		Name:     "fprime-integration-test",
		Provider: "FPrime Server",
		Settings: `{
			"name": "fprime",
			"address": "0.0.0.0:50050",
			"dictionary": "fprime",
			"protocol": "ccsds"
		}`,
	}

	// Add profile
	addResp, err := client.AddProfile(ctx, profile)
	require.NoError(t, err, "Failed to add FPrime Server profile")
	profileID := addResp.GetId()
	t.Logf("Created FPrime Server profile: %s", profileID)

	// Cleanup
	t.Cleanup(func() {
		cancel()
		cleanup()
		conn.Close()
	})

	// Now start the profile
	_, err = client.StartProfile(ctx, &pb.Id{Id: profileID})
	require.NoError(t, err, "Failed to start profile")
	t.Logf("Profile started, monitoring for FPrime FSW connection...")

	// Set up FSW connection monitoring BEFORE starting the profile
	fswId, fswConnected := waitForFSWConnection(t, client, profileID, fprimeConnectionTimeout)
	require.True(t, fswConnected, "FPrime FSW should connect to the server")

	run(NewTestApi(t, client), fswId)
}

// Wait for the FSW connection state to change
func waitForFSWConnection(t *testing.T, client hermesGrpc.ApiClient, profileID string, timeout time.Duration) (string, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	t.Logf("Subscribed to updates, waiting for FSW connection...")

	// Also poll FSW list periodically as a fallback
	resultChan := make(chan string, 1)

	// Listen for FSW connections
	go func() {
		check := func(all *pb.FswList) bool {
			for _, fsw := range all.GetAll() {
				if fsw.GetProfileId() == profileID {
					select {
					case resultChan <- fsw.GetId():
						return true
					default:
					}
				}
			}

			return false
		}

		// Subscribe to FSW updates
		stream, err := client.SubscribeFsw(ctx, &emptypb.Empty{})
		require.NoError(t, err, "Failed to subscribe to FSW updates")
		defer stream.CloseSend()

		// Poll the current FSW list (to catch any that connected before subscription)
		all, err := client.AllFsw(ctx, &emptypb.Empty{})
		require.NoError(t, err, "Failed to get FSW list")
		if check(all) {
			return
		}

		// Listen for new FSW connections from the stream
		for {
			update, err := stream.Recv()
			if err != nil {
				t.Logf("Stream error: %v", err)
				return
			}

			if check(update) {
				return
			}
		}
	}()

	// Wait for result or timeout
	select {
	case fswId := <-resultChan:
		return fswId, true
	case <-ctx.Done():
		t.Logf("Timeout waiting for FSW connection")
		return "", false
	}
}

func TestFPrimeServerConnection(t *testing.T) {
	startFprimeProfile(t, func(api *TestApi, fswId string) {
		// Validate that a connection was made
		all, err := api.Client.AllFsw(t.Context(), &emptypb.Empty{})
		require.NoError(t, err, "Failed to get FSW list")
		require.Len(t, all.GetAll(), 1)

		fsw := all.GetAll()[0]
		require.Equal(t, "fprime", fsw.GetType())
		require.Equal(t, fswId, fsw.GetId())

		require.Contains(t, fsw.Capabilities, pb.FswCapability_COMMAND)
		require.Contains(t, fsw.Capabilities, pb.FswCapability_FILE)
		require.Contains(t, fsw.Capabilities, pb.FswCapability_PARSE_COMMAND)
	})
}

func TestCommand(t *testing.T) {
	startFprimeProfile(t, func(api *TestApi, fswId string) {
		// Get the command dictionary
		dict, err := api.Client.GetDictionary(t.Context(), &pb.Id{Id: "fprime"})
		require.NoError(t, err, "Failed to get command dictionary")

		def := dict.Content[""].Commands["CdhCore.cmdDisp.CMD_NO_OP"]

		md := metadata.New(map[string]string{
			"id": fswId,
		})

		uplinkCtx := metadata.NewOutgoingContext(t.Context(), md)

		res, err := api.Client.Command(uplinkCtx, &pb.CommandValue{
			Def:  def,
			Args: []*pb.Value{},
		})
		require.NoError(t, err, "Failed to send command")
		require.Equal(t, true, res.Success)
		api.RequireNoWarningHi(t)
	})
}

func TestCommandNoOpString(t *testing.T) {
	startFprimeProfile(t, func(api *TestApi, fswId string) {
		// Get the command dictionary
		dict, err := api.Client.GetDictionary(t.Context(), &pb.Id{Id: "fprime"})
		require.NoError(t, err, "Failed to get command dictionary")

		def := dict.Content[""].Commands["CdhCore.cmdDisp.CMD_NO_OP_STRING"]

		md := metadata.New(map[string]string{
			"id": fswId,
		})

		uplinkCtx := metadata.NewOutgoingContext(t.Context(), md)
		res, err := api.Client.Command(uplinkCtx, &pb.CommandValue{
			Def: def,
			Args: []*pb.Value{
				{
					Value: &pb.Value_S{S: "This is a test"},
				},
			},
		})
		require.NoError(t, err, "Failed to send command")
		require.Equal(t, true, res.Success)

		time.Sleep(100 * time.Millisecond)

		ev := api.RequireEvent(t, func(ev *pb.SourcedEvent) bool {
			return ev.GetSource() == fswId &&
				ev.GetContext() == pb.SourceContext_REALTIME &&
				ev.GetEvent().GetRef().GetName() == "NoOpStringReceived"
		})

		require.Equal(t, ev.GetEvent().GetArgs()[0].GetS(), "This is a test")
		api.RequireNoWarningHi(t)
	})
}

func TestCommandNoOpStringRaw(t *testing.T) {
	startFprimeProfile(t, func(api *TestApi, fswId string) {
		md := metadata.New(map[string]string{
			"id": fswId,
		})

		uplinkCtx := metadata.NewOutgoingContext(t.Context(), md)

		res, err := api.Client.RawCommand(uplinkCtx, &pb.RawCommandValue{
			Command: "CdhCore.cmdDisp.CMD_NO_OP_STRING \"This is another test\"",
		})

		require.NoError(t, err, "Failed to send command")
		require.Equal(t, true, res.Success)

		time.Sleep(100 * time.Millisecond)

		ev := api.RequireEvent(t, func(ev *pb.SourcedEvent) bool {
			return ev.GetSource() == fswId &&
				ev.GetContext() == pb.SourceContext_REALTIME &&
				ev.GetEvent().GetRef().GetName() == "NoOpStringReceived"
		})

		require.Equal(t, ev.GetEvent().GetArgs()[0].GetS(), "This is another test")
		api.RequireNoWarningHi(t)
	})
}

func TestFileUplink(t *testing.T) {
	startFprimeProfile(t, func(api *TestApi, fswId string) {
		md := metadata.New(map[string]string{
			"id": fswId,
		})

		uplinkCtx := metadata.NewOutgoingContext(t.Context(), md)
		upl, err := api.Client.Uplink(uplinkCtx)
		require.NoError(t, err)

		err = upl.Send(&pb.UplinkFileChunk{
			Value: &pb.UplinkFileChunk_Header{
				Header: &pb.FileHeader{
					SourcePath:      "source.txt",
					DestinationPath: "dest.txt",
					Size:            29,
				},
			},
		})
		require.NoError(t, err)

		// Send first chunk
		err = upl.Send(&pb.UplinkFileChunk{
			Value: &pb.UplinkFileChunk_Data{
				Data: []byte("Hello World\n"),
			},
		})
		require.NoError(t, err)

		// Send second chunk
		err = upl.Send(&pb.UplinkFileChunk{
			Value: &pb.UplinkFileChunk_Data{
				Data: []byte("Yellow Submarine\n"),
			},
		})
		require.NoError(t, err)

		res, err := upl.CloseAndRecv()
		require.NoError(t, err, "Failed to send file uplink")
		require.Equal(t, true, res.Success)

		time.Sleep(500 * time.Millisecond)

		api.RequireNoWarningHi(t)
		api.RequireEvent(t, func(ev *pb.SourcedEvent) bool {
			return ev.GetSource() == fswId &&
				ev.GetContext() == pb.SourceContext_REALTIME &&
				ev.GetEvent().GetRef().GetName() == "FileReceived"
		})
	})
}
