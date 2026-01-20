package host_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/nasa/hermes/pkg/host"
)

type subscribeable struct {
	host.Stateful[string]
}

func TestSubscribe(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())

	subs := subscribeable{
		Stateful: host.NewStateful[string](),
	}

	states := []string{}
	subs.Subscribe(ctx, func(s string) {
		states = append(states, s)
	})

	subs.PushUpdate("1")
	subs.PushUpdate("2")
	subs.PushUpdate("3")
	subs.PushUpdate("4")

	cancel()

	subs.PushUpdate("5")
	subs.PushUpdate("6")

	assert.EqualValues(t, []string{"1", "2", "3", "4"}, states)
}
