package host

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"sync"

	"github.com/nasa/hermes/pkg/log"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/nasa/hermes/pkg/util"
)

var _ ProfileListener = (*profileRegistry)(nil)
var ErrProfilesExist = errors.New("cannot load profile configuration when some profiles already exist")

type ProfileListener interface {
	// Notify the parent that the profile state has been updated
	UpdateProfiles()

	// Notify the parent that the connection state has been updated
	UpdateConnections()
}

type profileRegistry struct {
	mux    sync.RWMutex
	logger log.Logger

	providers map[string]profileProviderConfig
	profiles  map[string]StatefulProfile

	// State emitters
	ProviderState   Stateful[[]*pb.ProfileProvider]
	ProfileState    Stateful[map[string]*pb.StatefulProfile]
	ConnectionState Stateful[[]*pb.Fsw]
}

func newProfileRegistry() *profileRegistry {
	return &profileRegistry{
		mux:    sync.RWMutex{},
		logger: log.GetLogger(context.TODO()),

		providers: map[string]profileProviderConfig{},
		profiles:  map[string]StatefulProfile{},

		ProviderState:   NewStateful[[]*pb.ProfileProvider](),
		ProfileState:    NewStateful[map[string]*pb.StatefulProfile](),
		ConnectionState: NewStateful[[]*pb.Fsw](),
	}
}

func RegisterProfileProvider[T any](
	name string,
	provider ProfileProvider[T],
	schema string,
) (func(), error) {
	providerCfg, err := newProfileProvider(
		name,
		provider,
		schema,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to register profile provider: %w", err)
	}

	return Profiles.register(providerCfg)
}

func RegisterProfileProviderWithUiSchema[T any](
	name string,
	provider ProfileProvider[T],
	schema string,
	uiSchema string,
) (func(), error) {
	providerCfg, err := newProfileProviderWithUiSchema(
		name,
		provider,
		schema,
		uiSchema,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to register profile provider: %w", err)
	}

	return Profiles.register(providerCfg)
}

func (r *profileRegistry) register(provider profileProviderConfig) (func(), error) {
	r.mux.Lock()
	defer r.mux.Unlock()

	if r.providers[provider.Name()] != nil {
		return nil, errors.New("duplicate profile profider")
	}

	r.logger.Info(
		"registering profile provider",
		"name", provider.Name(),
	)

	r.providers[provider.Name()] = provider
	go r.updateProviders()

	return func() {
		r.mux.Lock()
		defer r.mux.Unlock()

		r.logger.Info(
			"unregistering profile provider",
			"name", provider.Name(),
		)

		delete(r.providers, provider.Name())
	}, nil
}

func (r *profileRegistry) Stop(ctx context.Context) error {
	errs := []error{}

	for _, prof := range r.profiles {
		err := prof.Stop(ctx)
		if err != nil {
			errs = append(errs, err)
		}
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	return nil
}

func (r *profileRegistry) Add(ctx context.Context, p *pb.Profile) (string, error) {
	defer r.UpdateProfiles()

	r.mux.RLock()
	prov, ok := r.providers[p.Provider]
	r.mux.RUnlock()

	if !ok {
		return "", fmt.Errorf("no profile provider: '%s'", p.Provider)
	}

	var id string
	var profile StatefulProfile

	if p.Id != "" {
		r.mux.RLock()
		_, oldOk := r.profiles[p.Id]
		r.mux.RUnlock()

		if oldOk {
			r.logger.Info(
				"overlapping non-persistent profile",
				"id", id,
			)

			return "", fmt.Errorf("overlapping non-persistent profile")
		}

		id = p.Id
		profile = &nonPersistentProfile{StatefulProfile: prov.Create(p.Name, r)}
		r.logger.Info(
			"adding non persistent profile",
			"name", profile.Name(),
			"provider", profile.Config().Provider,
			"id", id,
		)
	} else {
		id = util.GenerateShortUID()
		profile = prov.Create(p.Name, r)
		r.logger.Info(
			"adding profile",
			"name", profile.Name(),
			"provider", profile.Config().Provider,
			"id", id,
		)
	}

	if p.Settings != "" {
		err := profile.Update(p.Settings)
		if err != nil {
			return "", fmt.Errorf("failed to create profile: %w", err)
		}
	}

	r.mux.Lock()
	r.profiles[id] = profile
	r.mux.Unlock()

	return id, nil
}

func (r *profileRegistry) AddRuntime(p RuntimeProfile) string {
	defer r.UpdateProfiles()
	id := util.GenerateShortUID()

	r.logger.Info(
		"adding runtime profile",
		"name", p.Name(),
		"provider", p.Config().Provider,
		"id", id,
	)

	r.mux.Lock()
	r.profiles[id] = p
	r.mux.Unlock()

	return id
}

func (r *profileRegistry) RemoveRuntime(p RuntimeProfile) {
	defer r.UpdateProfiles()

	r.mux.Lock()
	defer r.mux.Unlock()

	var removed bool = false
	var removeId string
	for id, pi := range r.profiles {
		if pi == p {
			removeId = id
			removed = true
			break
		}
	}

	if !removed {
		r.logger.Warn(
			"could not remove runtime profile (not found)",
			"name", p.Name(),
			"provider", p.Config().Provider,
		)
	} else {
		r.logger.Info(
			"removing runtime profile",
			"name", p.Name(),
			"provider", p.Config().Provider,
			"id", removeId,
		)

		delete(r.profiles, removeId)
	}
}

func (r *profileRegistry) GetProfile(id string) (StatefulProfile, error) {
	prof, ok := r.profiles[id]
	if !ok {
		return nil, fmt.Errorf("no profile with id: %s", id)
	}

	return prof, nil
}

func (r *profileRegistry) Remove(id string) error {
	defer r.UpdateProfiles()

	r.mux.Lock()
	defer r.mux.Unlock()

	profile, ok := r.profiles[id]
	if !ok {
		r.logger.Error(
			"cannot remove profile, not found",
			"name", profile.Name(),
			"provider", profile.Config().Provider,
			"id", id,
		)
		return fmt.Errorf("no profile with id %s", id)
	}

	r.logger.Info(
		"removing profile",
		"name", profile.Name(),
		"provider", profile.Config().Provider,
		"id", id,
	)

	delete(r.profiles, id)

	return nil
}

func (r *profileRegistry) AllProfileIds() []string {
	r.mux.RLock()
	defer r.mux.RUnlock()

	out := []string{}
	for id := range r.profiles {
		out = append(out, id)
	}

	return out
}

func (r *profileRegistry) AllProfiles() (map[string]*pb.StatefulProfile, error) {
	r.mux.RLock()
	defer r.mux.RUnlock()

	all := map[string]*pb.StatefulProfile{}
	for id, prof := range r.profiles {
		enc, err := prof.State()
		if _, ok := prof.(RuntimeProfile); ok {
			enc.RuntimeOnly = true
		} else {
			enc.RuntimeOnly = false
		}

		if err != nil {
			return nil, fmt.Errorf(
				"enconding of profile %s parameters failed: %w",
				prof.Name(), err,
			)
		}

		all[id] = enc
	}

	return all, nil
}

func (r *profileRegistry) GetConnection(id string) Fsw {
	r.mux.RLock()
	defer r.mux.RUnlock()

	for _, profile := range r.profiles {
		fsw := profile.GetConnection(id)
		if fsw != nil {
			return fsw
		}
	}

	return nil
}

func (r *profileRegistry) AllConnections() []*pb.Fsw {
	r.mux.RLock()
	defer r.mux.RUnlock()

	all := []*pb.Fsw{}
	for profileId, profile := range r.profiles {
		for _, fsw := range profile.Connections() {
			fsw.ProfileId = profileId
			all = append(all, fsw)
		}
	}

	return all
}

func (r *profileRegistry) AllProviders() []*pb.ProfileProvider {
	r.mux.RLock()
	defer r.mux.RUnlock()

	all := []*pb.ProfileProvider{}
	for _, prov := range r.providers {
		all = append(all, prov.Proto())
	}

	return all
}

func (r *profileRegistry) Load(config []ProfileConfig) error {
	r.mux.Lock()

	if len(r.profiles) > 0 {
		r.mux.Unlock()
		return ErrProfilesExist
	}

	r.mux.Unlock()

	for _, cfg := range config {
		jsonSettings, err := json.Marshal(cfg.Settings)
		if err != nil {
			return fmt.Errorf("configuration %s has invalid json settings: %w", cfg.Name, err)
		}

		_, err = r.Add(context.Background(), &pb.Profile{
			Name:     cfg.Name,
			Provider: cfg.Provider,
			Settings: string(jsonSettings),
		})

		if err != nil {
			return fmt.Errorf("failed to add profile %s: %w", cfg.Name, err)
		}
	}

	return nil
}

func (r *profileRegistry) Config() []ProfileConfig {
	r.mux.RLock()
	defer r.mux.RUnlock()

	out := []ProfileConfig{}
	for _, prof := range r.profiles {
		if _, ok := prof.(RuntimeProfile); ok {
			// Don't store runtime profiles to disk
			continue
		}

		out = append(out, prof.Config())
	}

	return out
}

func (r *profileRegistry) updateProviders() {
	r.ProviderState.PushUpdate(r.AllProviders())
}

func (r *profileRegistry) UpdateConnections() {
	r.ConnectionState.PushUpdate(r.AllConnections())
}

func (r *profileRegistry) UpdateProfiles() {
	profs, err := r.AllProfiles()
	if err != nil {
		r.logger.Warn("failed push profile update", "err", err)
		return
	}

	r.ProfileState.PushUpdate(profs)
}
