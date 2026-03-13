package host

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"sync"
	"sync/atomic"

	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
)

var (
	_ StatefulProfile = &statefulProfile[struct{}]{}
	_ ConnectSession  = &statefulProfile[struct{}]{}
)

type ProfileConfig struct {
	Name     string `json:"name"`
	Provider string `json:"provider"`
	Settings any    `json:"settings"`
}

type StatefulProfile interface {
	Name() string

	// Get the current profile state as a protobuf
	State() (*pb.StatefulProfile, error)

	// Update the settings given the parameters as json
	Update(settings string) error

	// Start this profile
	Start(ctx context.Context) error

	// Get all the active connections on this profile
	// Note: ProfileId is not filled in here
	Connections() []*pb.Fsw

	// Get a connected Fsw given its ID
	// Returns 'nil' if no connection with ID belongs to this profile
	GetConnection(id string) Fsw

	// Stop this profile
	Stop(ctx context.Context) error

	// Get the JSON configuration of this profile
	Config() ProfileConfig
}

// Implement this interface on profiles that should not be modified or deleted
// These profiles are added at runtime and managed externally from the API
type RuntimeProfile interface {
	StatefulProfile
	IsRuntimeProfile()
}

type atomicValue[T ~int32] struct {
	atomic.Int32
}

func (a *atomicValue[T]) Load() T {
	return T(a.Int32.Load())
}

func (a *atomicValue[T]) Store(value T) {
	a.Int32.Store(int32(value))
}

// Tracks the starting and stopping of a profile.
// Active profiles are held in a ProfileSession.
// Updates to the profile state including name, settings and connection state are
// signaled back to listeners on the `Stateful` interface.
type statefulProfile[T any] struct {
	mux    sync.RWMutex
	logger log.Logger

	name     string
	settings T
	state    atomicValue[pb.ProfileState]

	provider      *profileProviderConfigImpl[T]
	runtimeCtx    context.Context
	runtimeCancel func()

	// This sends at most a single message
	// It will be the error returned by the Provider.Start()
	// This channel is closed once the profile has finished executing
	runtime chan error

	// This channel is closed when the provider calls Session.Started()
	// It signals the startup that the profile is long running and active
	runtimeStartedClosed bool
	runtimeStarted       chan struct{}

	// tracks the set of flight softwares that are connected
	connections map[string]Fsw

	listener ProfileListener
}

// Log implements ConnectSession.
func (sp *statefulProfile[T]) Log() log.Logger {
	return sp.logger
}

func newStatefulProfile[T any](
	name string,
	provider *profileProviderConfigImpl[T],
	listener ProfileListener,
) *statefulProfile[T] {
	out := &statefulProfile[T]{
		logger: log.GetLogger(context.TODO()).With("profile", provider.Name()),

		settings: provider.api.Default(),
		name:     name,

		provider: provider,

		connections: make(map[string]Fsw),
		listener:    listener,
	}

	return out
}

func (sp *statefulProfile[T]) GetConnection(id string) Fsw {
	sp.mux.RLock()
	defer sp.mux.RUnlock()

	for _, fsw := range sp.connections {
		if fsw.Info().Id == id {
			return fsw
		}
	}

	return nil
}

// Connections implements StatefulProfile.
func (sp *statefulProfile[T]) Connections() []*pb.Fsw {
	sp.mux.RLock()
	defer sp.mux.RUnlock()

	out := []*pb.Fsw{}
	for id, fsw := range sp.connections {
		info := fsw.Info()

		var capabilities []pb.FswCapability
		if len(info.Capabilities) > 0 {
			capabilities = slices.Clone(info.Capabilities)
		} else {
			if _, isSeq := fsw.(SeqFsw); isSeq {
				capabilities = append(capabilities, pb.FswCapability_SEQUENCE)
			}

			if _, isRawSeq := fsw.(SeqFswParser); isRawSeq {
				capabilities = append(capabilities, pb.FswCapability_PARSE_SEQUENCE)
			}

			if _, isCmd := fsw.(CmdFsw); isCmd {
				capabilities = append(capabilities, pb.FswCapability_COMMAND)
			}

			if _, isRawCmd := fsw.(CmdFswParser); isRawCmd {
				capabilities = append(capabilities, pb.FswCapability_PARSE_COMMAND)
			}

			if _, isUpl := fsw.(UplinkFsw); isUpl {
				capabilities = append(capabilities, pb.FswCapability_FILE)
			}

			if _, isGndCmd := fsw.(RequestFsw); isGndCmd {
				capabilities = append(capabilities, pb.FswCapability_REQUEST)
			}
		}

		out = append(out, &pb.Fsw{
			Id:           id,
			Type:         info.Type,
			Forwards:     slices.Clone(info.Forwards),
			Capabilities: capabilities,
		})
	}

	return out
}

func (sp *statefulProfile[T]) Name() string {
	sp.mux.RLock()
	defer sp.mux.RUnlock()

	return sp.name
}

func (sp *statefulProfile[T]) verifyIdle(action string) error {
	if sp.state.Load() != pb.ProfileState_PROFILE_IDLE {
		sp.logger.Warn(
			"blocking profile updates while profile is not idle",
			"state",
			sp.state.Load().String(),
		)

		return fmt.Errorf("'%s' not permitted: profile is not idle", action)
	}

	return nil
}

func (sp *statefulProfile[T]) Update(settings string) error {
	defer sp.listener.UpdateProfiles()

	sp.mux.Lock()
	defer sp.mux.Unlock()

	err := sp.verifyIdle("UPDATE")
	if err != nil {
		return err
	}

	if err := json.Unmarshal([]byte(settings), &sp.settings); err != nil {
		return fmt.Errorf("failed to unmarshal settings json: %w", err)
	}

	return nil
}

// Connect implements ConnectSession.
func (sp *statefulProfile[T]) Connect(fsw Fsw) {
	// Avoid deadlock by serving this in a separate go routine
	go func() {
		defer sp.listener.UpdateProfiles()
		defer sp.listener.UpdateConnections()

		sp.mux.Lock()
		defer sp.mux.Unlock()

		info := fsw.Info()
		if sp.connections[info.Id] != nil {
			sp.logger.Warn(
				"overlapping connection id, overwriting previous connection",
				"fswId",
				info.Id,
				"type",
				info.Type,
			)
		} else {
			sp.logger.Info(
				"fsw connected",
				"fswId",
				info.Id,
				"type",
				info.Type,
			)
		}

		sp.connections[info.Id] = fsw
	}()
}

// Disconnect implements ConnectSession.
func (sp *statefulProfile[T]) Disconnect(fsw Fsw) {
	// Avoid deadlock by serving this in a separate go routine
	go func() {
		defer sp.listener.UpdateProfiles()
		defer sp.listener.UpdateConnections()

		sp.mux.Lock()
		defer sp.mux.Unlock()

		info := fsw.Info()
		if sp.connections[info.Id] != nil {
			delete(sp.connections, info.Id)
			sp.logger.Info(
				"fsw disconnected",
				"fswId",
				info.Id,
				"type",
				info.Type,
			)
		} else {
			sp.logger.Warn(
				"disconnecting fsw that was not connected",
				"fswId",
				info.Id,
				"type",
				info.Type,
			)
		}
	}()
}

// Started implements ConnectSession.
func (sp *statefulProfile[T]) Started() {
	go func() {
		defer sp.listener.UpdateProfiles()

		sp.mux.Lock()
		defer sp.mux.Unlock()
		if !sp.runtimeStartedClosed {
			sp.state.Store(pb.ProfileState_PROFILE_ACTIVE)

			sp.runtimeStartedClosed = true
			close(sp.runtimeStarted)
		} else {
			sp.logger.Warn("session.Started() called more than once")
		}
	}()
}

func (sp *statefulProfile[T]) Start(ctx context.Context) error {
	err := sp.verifyIdle("START")
	if err != nil {
		return err
	}

	// Create new session using the settings
	sp.logger.Info("starting profile")

	func() {
		sp.mux.Lock()
		defer sp.mux.Unlock()

		sp.runtimeCtx, sp.runtimeCancel = context.WithCancel(context.Background())
		sp.runtime = make(chan error)
		sp.runtimeStarted = make(chan struct{})
		sp.runtimeStartedClosed = false
	}()

	go func() {
		defer sp.listener.UpdateProfiles()
		sp.state.Store(pb.ProfileState_PROFILE_CONNECTING)
		sp.listener.UpdateProfiles()

		err := sp.provider.api.Start(sp.runtimeCtx, sp.settings, sp)

		if err != nil {
			sp.logger.Error(
				"failed to start profile",
				"err",
				err,
			)

			sp.runtime <- err
		} else {
			sp.logger.Info("profile stopped")
		}

		close(sp.runtime)
		sp.state.Store(pb.ProfileState_PROFILE_IDLE)
	}()

	select {
	case <-ctx.Done():
		sp.runtimeCancel()
		sp.logger.Info("cancelled profile startup")
		err, ok := <-sp.runtime
		if ok {
			return err
		} else {
			return ctx.Err()
		}
	case <-sp.runtimeStarted:
		return nil
	case err, ok := <-sp.runtime:
		if ok && err != nil {
			return err
		}
	}

	return nil
}

func (sp *statefulProfile[T]) Stop(ctx context.Context) error {
	if sp.state.Load() != pb.ProfileState_PROFILE_ACTIVE {
		return errors.New("cannot stop profile that is not running")
	}

	if sp.runtimeCancel != nil {
		sp.runtimeCancel()

		sp.state.Store(pb.ProfileState_PROFILE_DISCONNECT)
		sp.listener.UpdateProfiles()

		select {
		case <-ctx.Done():
			sp.state.Store(pb.ProfileState_PROFILE_ACTIVE)
			sp.listener.UpdateProfiles()
			return ctx.Err()
		case msg, ok := <-sp.runtime:
			if !ok {
				return nil
			} else {
				return msg
			}
		}
	} else {
		return fmt.Errorf("no profile is running")
	}
}

func (sp *statefulProfile[T]) State() (*pb.StatefulProfile, error) {
	sp.mux.RLock()
	defer sp.mux.RUnlock()

	b, err := json.Marshal(&sp.settings)
	if err != nil {
		return nil, err
	}

	return &pb.StatefulProfile{
		Value: &pb.Profile{
			Provider: sp.provider.name,
			Settings: string(b),
			Name:     sp.name,
		},
		State: sp.state.Load(),
	}, nil
}

func (sp *statefulProfile[T]) Config() ProfileConfig {
	return ProfileConfig{
		Name:     sp.name,
		Provider: sp.provider.name,
		Settings: sp.settings,
	}
}

var _ RuntimeProfile = (*nonPersistentProfile)(nil)

type nonPersistentProfile struct {
	StatefulProfile
}

// IsRuntimeProfile implements [RuntimeProfile].
func (n *nonPersistentProfile) IsRuntimeProfile() {}
