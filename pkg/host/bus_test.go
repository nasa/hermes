package host_test

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/nasa/hermes/pkg/host"
)

type Def struct {
	id          int
	description string
}

type Message struct {
	value  int
	def    *Def
	source string
}

type MessageHandler struct {
	calls []*Message
}

func (h *MessageHandler) Handle(value *Message) {
	h.calls = append(h.calls, value)
}

func TestBusListener(t *testing.T) {
	b := host.NewBus[*Message]("test")

	h := &MessageHandler{
		calls: []*Message{},
	}

	ctx, cancel := context.WithCancel(context.Background())
	b.On(ctx, h.Handle)

	b.Emit(&Message{value: 1, def: &Def{id: 1, description: "First"}, source: "1"})
	b.Emit(&Message{value: 2, def: &Def{id: 2, description: "Second"}, source: "2"})
	b.Emit(&Message{value: 3, def: &Def{id: 3, description: "Third"}, source: "3"})

	b.Flush(context.TODO())

	cancel()

	b.Emit(&Message{value: 4, def: &Def{id: 4, description: "Fourth"}, source: "4"})
	b.Emit(&Message{value: 5, def: &Def{id: 5, description: "Fifth"}, source: "5"})

	b.Flush(context.TODO())

	assert.EqualValues(t, 3, len(h.calls))
	assert.EqualValues(t, "1", h.calls[0].source)
	assert.EqualValues(t, "2", h.calls[1].source)
	assert.EqualValues(t, "3", h.calls[2].source)

	assert.EqualValues(t, "First", h.calls[0].def.description)
	assert.EqualValues(t, "Second", h.calls[1].def.description)
	assert.EqualValues(t, "Third", h.calls[2].def.description)
}

func TestBusWaiter(t *testing.T) {
	b := host.NewBus[*Message]("test")

	h := &MessageHandler{
		calls: []*Message{},
	}

	waiter := b.Wait(context.Background(), func(msg *Message) bool {
		h.Handle(msg)
		return msg.def.id == 2
	})

	go func() {
		b.Emit(&Message{value: 1, def: &Def{id: 1, description: "First"}, source: "1"})
		b.Emit(&Message{value: 2, def: &Def{id: 2, description: "Second"}, source: "2"})
		b.Emit(&Message{value: 3, def: &Def{id: 3, description: "Third"}, source: "3"})
	}()

	msg, ok := <-waiter
	assert.True(t, ok)
	assert.EqualValues(t, &Message{value: 2, def: &Def{id: 2, description: "Second"}, source: "2"}, msg)

	assert.EqualValues(t, 2, len(h.calls))
	assert.EqualValues(t, "1", h.calls[0].source)
	assert.EqualValues(t, "2", h.calls[1].source)

	assert.EqualValues(t, "First", h.calls[0].def.description)
	assert.EqualValues(t, "Second", h.calls[1].def.description)
}

func TestBusWaiterCancel(t *testing.T) {
	b := host.NewBus[*Message]("test")

	ctx, cancel := context.WithCancel(context.Background())

	h := &MessageHandler{
		calls: []*Message{},
	}

	waiter := b.Wait(ctx, func(msg *Message) bool {
		h.Handle(msg)
		return msg.def.id == 2
	})

	go func() {
		b.Emit(&Message{value: 1, def: &Def{id: 1, description: "First"}, source: "1"})
		// b.Emit(&Message{value: 2, def: &Def{id: 2, description: "Second"}, source: "2"})
		b.Emit(&Message{value: 3, def: &Def{id: 3, description: "Third"}, source: "3"})

		time.Sleep(50 * time.Millisecond)
		b.Emit(&Message{value: 4, def: &Def{id: 4, description: "Fourth"}, source: "4"})

		cancel()
	}()

	msg, ok := <-waiter
	assert.False(t, ok)
	assert.Nil(t, msg)
}

func TestPrematureCancellation(t *testing.T) {
	b := host.NewBus[*Message]("test")

	// Wait for the second message
	waiter := b.Wait(t.Context(), func(msg *Message) bool {
		return msg.def.id == 2
	})

	go func() {
		time.Sleep(50 * time.Millisecond)

		b.Emit(&Message{value: 1, def: &Def{id: 1, description: "First"}, source: "1"})
		b.Flush(context.TODO())

		b.Dispose()

		b.Emit(&Message{value: 2, def: &Def{id: 2, description: "Second"}, source: "2"})
	}()

	msg, ok := <-waiter
	assert.False(t, ok)
	assert.Nil(t, msg)

	b.Start()

	calls := []*Message{}

	// Wait for the second message
	b.On(context.Background(), func(msg *Message) {
		calls = append(calls, msg)
	})

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		time.Sleep(50 * time.Millisecond)

		b.Emit(&Message{value: 1, def: &Def{id: 1, description: "First"}, source: "1"})
		b.Flush(context.TODO())

		b.Dispose()

		b.Emit(&Message{value: 2, def: &Def{id: 2, description: "Second"}, source: "2"})
	}()

	wg.Wait()
	b.Flush(context.TODO())

	assert.Len(t, calls, 1)
}
