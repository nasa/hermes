package host_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/nasa/hermes/mocks"
	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
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

	id, err := host.Profiles.Add(&pb.Profile{
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
