package host

import (
	"context"
	"sync"
)

var (
	_ Stateful[struct{}] = &statefulImpl[struct{}]{}
)

type Stateful[T any] interface {
	/// Subscribe to updates about this object
	Subscribe(ctx context.Context, handler func(T))
	PushUpdate(event T)
}

type statefulImpl[T any] struct {
	statefulMux sync.RWMutex
	fanout      map[int]struct {
		ctx     context.Context
		handler func(T)
	}
	counter int
}

func NewStateful[T any]() Stateful[T] {
	return &statefulImpl[T]{
		fanout: make(map[int]struct {
			ctx     context.Context
			handler func(T)
		}),
		counter: 0,
	}
}

// UpdateChannel implements Stateful.
func (s *statefulImpl[T]) Subscribe(ctx context.Context, handler func(T)) {
	s.statefulMux.Lock()
	defer s.statefulMux.Unlock()

	if s.fanout == nil {
		s.fanout = make(map[int]struct {
			ctx     context.Context
			handler func(T)
		})
	}

	key := s.counter
	s.fanout[key] = struct {
		ctx     context.Context
		handler func(T)
	}{
		ctx:     ctx,
		handler: handler,
	}
	s.counter += 1

	// Create the subscription cleanup
	go func() {
		// Wait for the context to cancel the sub
		<-ctx.Done()

		// Clear the subscription
		s.statefulMux.Lock()
		defer s.statefulMux.Unlock()
		delete(s.fanout, key)
	}()
}

func (s *statefulImpl[T]) PushUpdate(event T) {
	s.statefulMux.RLock()
	defer s.statefulMux.RUnlock()

	for _, c := range s.fanout {
		select {
		case <-c.ctx.Done():
		default:
			c.handler(event)
		}
	}
}
