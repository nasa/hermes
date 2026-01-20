package host

import (
	"context"

	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
)

type ConnectSession interface {
	Log() log.Logger

	// Notify the runtime that the profile is active
	// This should be called during ProfileProvider.Start()
	// if this profile is a long running profile
	Started()

	// Notify runtime that a FSW connected
	Connect(fsw Fsw)

	// Notify runtime that a FSW has disconnected
	Disconnect(fsw Fsw)
}

type ProfileProvider[T any] interface {
	// Config used by default when a new profile is created
	Default() T

	// Run the profile
	// `ctx` will be cancelled when the user requests the profile to stop
	// `session.Started()` should be called when the profile startup finished
	// This profile will return when the execution is finished
	// execution could complete due to an external signal or the context cancellation
	Start(
		ctx context.Context,
		settings T,
		session ConnectSession,
	) error
}

type profileProviderConfig interface {
	Name() string
	Create(name string, listener ProfileListener) StatefulProfile
	Proto() *pb.ProfileProvider
}

var (
	_ profileProviderConfig = &profileProviderConfigImpl[any]{}
)

type profileProviderConfigImpl[T any] struct {
	name     string
	schema   string
	uiSchema string

	logger log.Logger
	api    ProfileProvider[T]
}

func newProfileProvider[T any](
	name string,
	provider ProfileProvider[T],
	schema string,
) (*profileProviderConfigImpl[T], error) {
	return &profileProviderConfigImpl[T]{
		name:     name,
		schema:   schema,
		uiSchema: "",

		api:    provider,
		logger: log.GetLogger(context.TODO()),
	}, nil
}

func newProfileProviderWithUiSchema[T any](
	name string,
	provider ProfileProvider[T],
	schema string,
	uiSchema string,
) (*profileProviderConfigImpl[T], error) {
	return &profileProviderConfigImpl[T]{
		name:     name,
		schema:   string(schema),
		uiSchema: uiSchema,
		api:      provider,

		logger: log.GetLogger(context.TODO()),
	}, nil
}

// Create implements ProfileProviderConfig.
func (p *profileProviderConfigImpl[T]) Create(
	name string,
	listener ProfileListener,
) StatefulProfile {
	return newStatefulProfile(name, p, listener)
}

func (p *profileProviderConfigImpl[T]) Proto() *pb.ProfileProvider {
	return &pb.ProfileProvider{
		Name:     p.name,
		Schema:   p.schema,
		UiSchema: p.uiSchema,
	}
}

func (p *profileProviderConfigImpl[T]) Name() string {
	return p.name
}
