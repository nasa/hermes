package host_test

import (
	"context"
	"testing"

	"github.com/nasa/hermes/mocks"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type testParams struct {
	Name string `json:"name,omitempty"`
}

func TestProfileRegsitry(t *testing.T) {
	prov := mocks.NewMockProfileProvider[testParams](t)

	prov.EXPECT().Default().Return(testParams{Name: "defaultname"})
	prov.EXPECT().Start(
		mock.Anything,
		testParams{Name: "connname"},
		mock.Anything,
	).RunAndReturn(func(ctx context.Context, tp testParams, cs host.ConnectSession) error {
		cs.Started()
		<-ctx.Done()
		return nil
	})

	dispose, err := host.RegisterProfileProvider("test", prov, `{
"type": "object",
"properties": {
	"name": {
		"type": "string",
		"description": "Test description"
	}
}}`)
	assert.NoError(t, err)

	defer dispose()

	id, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Name:     "testname",
		Provider: "test",
		Settings: `{"name": "connname"}`,
	})

	defer host.Profiles.Remove(id)

	assert.NoError(t, err)

	prof, err := host.Profiles.GetProfile(id)
	assert.NoError(t, err)

	err = prof.Start(context.Background())
	assert.NoError(t, err)

	err = prof.Stop(context.Background())
	assert.NoError(t, err)

	state, err := prof.State()
	assert.NoError(t, err)
	assert.EqualValues(t, &pb.StatefulProfile{
		Value: &pb.Profile{
			Name:     "testname",
			Provider: "test",
			Settings: `{"name":"connname"}`,
		},
		State: pb.ProfileState_PROFILE_IDLE,
	}, state)
}

func TestNonPersistentProfile(t *testing.T) {
	prov := mocks.NewMockProfileProvider[testParams](t)

	prov.EXPECT().Default().Return(testParams{Name: "defaultname"})

	dispose, err := host.RegisterProfileProvider("test-nonpersist", prov, `{
"type": "object",
"properties": {
	"name": {
		"type": "string",
		"description": "Test description"
	}
}}`)
	assert.NoError(t, err)
	defer dispose()

	// Add a non-persistent profile with explicit ID
	fixedID := "fixed-id-123"
	id, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Id:       fixedID,
		Name:     "non-persistent",
		Provider: "test-nonpersist",
		Settings: `{"name": "npname"}`,
	})

	assert.NoError(t, err)
	assert.Equal(t, fixedID, id, "ID should match the provided ID")

	// Verify the profile exists
	prof, err := host.Profiles.GetProfile(fixedID)
	assert.NoError(t, err)
	assert.NotNil(t, prof)

	// Verify the profile is marked as RuntimeOnly in AllProfiles
	allProfiles, err := host.Profiles.AllProfiles()
	assert.NoError(t, err)
	assert.True(t, allProfiles[fixedID].RuntimeOnly, "non-persistent profile should be marked as RuntimeOnly")

	// Verify the profile is NOT included in Config (not persisted to disk)
	configs := host.Profiles.Config()
	for _, cfg := range configs {
		assert.NotEqual(t, "non-persistent", cfg.Name, "non-persistent profile should not be in config")
	}

	// FIXME(tumbar) Should we disallow removing non-persistent profiles?
	// Verify that Remove() fails for non-persistent profiles
	err = host.Profiles.Remove(fixedID)
	assert.NoError(t, err)
	// assert.Error(t, err, "should not be able to remove non-persistent profile via Remove()")
	// assert.Contains(t, err.Error(), "cannot remove profile")
}

func TestCannotAddProfileWithExistingID(t *testing.T) {
	prov := mocks.NewMockProfileProvider[testParams](t)

	prov.EXPECT().Default().Return(testParams{Name: "defaultname"}).Times(1)

	dispose, err := host.RegisterProfileProvider("test-overlap", prov, `{
"type": "object",
"properties": {
	"name": {
		"type": "string",
		"description": "Test description"
	}
}}`)
	assert.NoError(t, err)
	defer dispose()

	// Add a persistent profile first
	persistentID, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Name:     "persistent-profile",
		Provider: "test-overlap",
		Settings: `{"name": "persistent"}`,
	})
	assert.NoError(t, err)
	defer host.Profiles.Remove(persistentID)

	// Verify it's persistent (not RuntimeOnly)
	allProfiles, err := host.Profiles.AllProfiles()
	assert.NoError(t, err)
	assert.False(t, allProfiles[persistentID].RuntimeOnly)

	// Try to add a profile with the same ID - should fail
	_, err = host.Profiles.Add(t.Context(), &pb.Profile{
		Id:       persistentID,
		Name:     "non-persistent-replacement",
		Provider: "test-overlap",
		Settings: `{"name": "nonpersistent"}`,
	})
	assert.Error(t, err, "should not allow overlapping profile IDs")
	assert.Contains(t, err.Error(), "overlapping", "error should mention overlapping profiles")

	// Verify the original profile is unchanged
	prof, err := host.Profiles.GetProfile(persistentID)
	assert.NoError(t, err)
	assert.Equal(t, "persistent-profile", prof.Name())

	// Verify it's still persistent (not RuntimeOnly)
	allProfiles, err = host.Profiles.AllProfiles()
	assert.NoError(t, err)
	assert.False(t, allProfiles[persistentID].RuntimeOnly)

	// Verify it's still in config
	configs := host.Profiles.Config()
	found := false
	for _, cfg := range configs {
		if cfg.Name == "persistent-profile" {
			found = true
			break
		}
	}
	assert.True(t, found, "persistent profile should remain in config")

}

func TestNonPersistentProfileLifecycle(t *testing.T) {
	prov := mocks.NewMockProfileProvider[testParams](t)

	prov.EXPECT().Default().Return(testParams{Name: "defaultname"}).Times(1)

	prov.EXPECT().Start(
		mock.Anything,
		testParams{Name: "lifecycle"},
		mock.Anything,
	).RunAndReturn(func(ctx context.Context, tp testParams, cs host.ConnectSession) error {
		cs.Started()
		<-ctx.Done()
		return nil
	})

	dispose, err := host.RegisterProfileProvider("test-lifecycle", prov, `{
"type": "object",
"properties": {
	"name": {
		"type": "string",
		"description": "Test description"
	}
}}`)
	assert.NoError(t, err)
	defer dispose()

	fixedID := "lifecycle-id"

	// Add a non-persistent profile
	id, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Id:       fixedID,
		Name:     "lifecycle-profile",
		Provider: "test-lifecycle",
		Settings: `{"name": "lifecycle"}`,
	})
	assert.NoError(t, err)
	assert.Equal(t, fixedID, id)

	prof, err := host.Profiles.GetProfile(id)
	assert.NoError(t, err)

	// Start the profile
	err = prof.Start(context.Background())
	assert.NoError(t, err)

	state, err := prof.State()
	assert.NoError(t, err)
	assert.Equal(t, pb.ProfileState_PROFILE_ACTIVE, state.State)

	// Stop the profile
	err = prof.Stop(context.Background())
	assert.NoError(t, err)

	state, err = prof.State()
	assert.NoError(t, err)
	assert.Equal(t, pb.ProfileState_PROFILE_IDLE, state.State)
}
