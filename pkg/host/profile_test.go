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

	// Verify that Remove() fails for non-persistent profiles
	err = host.Profiles.Remove(fixedID)
	assert.Error(t, err, "should not be able to remove non-persistent profile via Remove()")
	assert.Contains(t, err.Error(), "cannot remove profile")
}

func TestNonPersistentProfileReplacesPersistent(t *testing.T) {
	prov := mocks.NewMockProfileProvider[testParams](t)

	prov.EXPECT().Default().Return(testParams{Name: "defaultname"}).Times(2)

	dispose, err := host.RegisterProfileProvider("test-replace", prov, `{
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
		Provider: "test-replace",
		Settings: `{"name": "persistent"}`,
	})
	assert.NoError(t, err)
	defer host.Profiles.Remove(persistentID)

	// Verify it's persistent (not RuntimeOnly)
	allProfiles, err := host.Profiles.AllProfiles()
	assert.NoError(t, err)
	assert.False(t, allProfiles[persistentID].RuntimeOnly)

	// Now add a non-persistent profile with the same ID
	newID, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Id:       persistentID,
		Name:     "non-persistent-replacement",
		Provider: "test-replace",
		Settings: `{"name": "nonpersistent"}`,
	})
	assert.NoError(t, err)
	assert.Equal(t, persistentID, newID, "ID should remain the same")

	// Verify the profile was replaced
	prof, err := host.Profiles.GetProfile(persistentID)
	assert.NoError(t, err)
	assert.Equal(t, "non-persistent-replacement", prof.Name())

	// Verify it's now RuntimeOnly
	allProfiles, err = host.Profiles.AllProfiles()
	assert.NoError(t, err)
	assert.True(t, allProfiles[persistentID].RuntimeOnly, "replaced profile should now be RuntimeOnly")

	// Verify it's not in config
	configs := host.Profiles.Config()
	for _, cfg := range configs {
		assert.NotEqual(t, "non-persistent-replacement", cfg.Name)
	}
}

func TestNonPersistentProfileReplacesActive(t *testing.T) {
	prov := mocks.NewMockProfileProvider[testParams](t)

	prov.EXPECT().Default().Return(testParams{Name: "defaultname"}).Times(2)

	// First profile will be started and run until stopped
	prov.EXPECT().Start(
		mock.Anything,
		testParams{Name: "first"},
		mock.Anything,
	).RunAndReturn(func(ctx context.Context, tp testParams, cs host.ConnectSession) error {
		cs.Started()
		<-ctx.Done()
		return nil
	})

	dispose, err := host.RegisterProfileProvider("test-replace-active", prov, `{
"type": "object",
"properties": {
	"name": {
		"type": "string",
		"description": "Test description"
	}
}}`)
	assert.NoError(t, err)
	defer dispose()

	// Add and start a persistent profile
	persistentID, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Name:     "active-profile",
		Provider: "test-replace-active",
		Settings: `{"name": "first"}`,
	})
	assert.NoError(t, err)
	defer host.Profiles.Remove(persistentID)

	prof, err := host.Profiles.GetProfile(persistentID)
	assert.NoError(t, err)

	err = prof.Start(context.Background())
	assert.NoError(t, err)

	// Verify it's active
	state, err := prof.State()
	assert.NoError(t, err)
	assert.Equal(t, pb.ProfileState_PROFILE_ACTIVE, state.State)

	// Now replace it with a non-persistent profile with the same ID
	// This should stop the old profile
	newID, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Id:       persistentID,
		Name:     "replacement-profile",
		Provider: "test-replace-active",
		Settings: `{"name": "second"}`,
	})
	assert.NoError(t, err)
	assert.Equal(t, persistentID, newID)

	// Verify the new profile exists and is idle
	newProf, err := host.Profiles.GetProfile(persistentID)
	assert.NoError(t, err)
	assert.Equal(t, "replacement-profile", newProf.Name())

	newState, err := newProf.State()
	assert.NoError(t, err)
	assert.Equal(t, pb.ProfileState_PROFILE_IDLE, newState.State)
}

func TestNonPersistentProfileReplacesNonPersistent(t *testing.T) {
	prov := mocks.NewMockProfileProvider[testParams](t)

	prov.EXPECT().Default().Return(testParams{Name: "defaultname"}).Times(2)

	dispose, err := host.RegisterProfileProvider("test-replace-nonpersist", prov, `{
"type": "object",
"properties": {
	"name": {
		"type": "string",
		"description": "Test description"
	}
}}`)
	assert.NoError(t, err)
	defer dispose()

	fixedID := "fixed-id-456"

	// Add first non-persistent profile
	id1, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Id:       fixedID,
		Name:     "first-non-persistent",
		Provider: "test-replace-nonpersist",
		Settings: `{"name": "first"}`,
	})
	assert.NoError(t, err)
	assert.Equal(t, fixedID, id1)

	// Verify first profile
	prof1, err := host.Profiles.GetProfile(fixedID)
	assert.NoError(t, err)
	assert.Equal(t, "first-non-persistent", prof1.Name())

	// Replace with second non-persistent profile
	id2, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Id:       fixedID,
		Name:     "second-non-persistent",
		Provider: "test-replace-nonpersist",
		Settings: `{"name": "second"}`,
	})
	assert.NoError(t, err)
	assert.Equal(t, fixedID, id2)

	// Verify the profile was replaced
	prof2, err := host.Profiles.GetProfile(fixedID)
	assert.NoError(t, err)
	assert.Equal(t, "second-non-persistent", prof2.Name())

	// Verify still RuntimeOnly
	allProfiles, err := host.Profiles.AllProfiles()
	assert.NoError(t, err)
	assert.True(t, allProfiles[fixedID].RuntimeOnly)
}

func TestNonPersistentProfileLifecycle(t *testing.T) {
	prov := mocks.NewMockProfileProvider[testParams](t)

	prov.EXPECT().Default().Return(testParams{Name: "defaultname"}).Times(2)

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

	// Verify still marked as RuntimeOnly even after stop
	allProfiles, err := host.Profiles.AllProfiles()
	assert.NoError(t, err)
	assert.True(t, allProfiles[fixedID].RuntimeOnly)

	// Now we can replace it since it's idle
	newID, err := host.Profiles.Add(t.Context(), &pb.Profile{
		Id:       fixedID,
		Name:     "replaced-lifecycle-profile",
		Provider: "test-lifecycle",
		Settings: `{"name": "lifecycle"}`,
	})
	assert.NoError(t, err)
	assert.Equal(t, fixedID, newID)

	replacedProf, err := host.Profiles.GetProfile(fixedID)
	assert.NoError(t, err)
	assert.Equal(t, "replaced-lifecycle-profile", replacedProf.Name())
}
