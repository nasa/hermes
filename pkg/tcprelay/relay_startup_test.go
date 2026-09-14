package tcprelay

import (
	"testing"

	"github.com/nasa/hermes/pkg/host"
)

type observedStartupSession struct {
	host.ConnectSession
	ready chan struct{}
}

func (s *observedStartupSession) Started() {
	s.ConnectSession.Started()
	close(s.ready)
}

func TestRelayStartupReady(t *testing.T) {
	for _, serverMode := range []bool{false, true} {
		name := "client"
		if serverMode {
			name = "server"
		}
		t.Run(name, func(t *testing.T) {
			sourcePort := getFreePort(t)
			if !serverMode {
				sourcePort = newMockSource(t).Port()
			}
			session := &observedStartupSession{
				ConnectSession: newCaptureSession(),
				ready:          make(chan struct{}),
			}
			startRelaySession(t, t.Context(), session, sourcePort,
				[]int{getFreePort(t)}, []int{getFreePort(t)}, serverMode)
			select {
			case <-session.ready:
			default:
				t.Fatal("startRelaySession returned before the provider finished startup")
			}
		})
	}
}
