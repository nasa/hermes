package host

import (
	"context"
	"fmt"
	"reflect"
	"runtime"
	"sync"
	"sync/atomic"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
)

type BusEventHandler[T any] func(msg T)
type BusPredicate[T any] func(msg T) bool

type busSubscription[T any] struct {
	ctx        context.Context
	handle     BusEventHandler[T]
	handleName string

	// Optional dispose() cleanup called when the bus is closed
	cancel func()

	// Optional called if the context is cancelled
	cleanup func()
}

type busMsg[T any] struct {
	msg *T
	sub *busSubscription[T]
}

type Bus[T any] struct {
	name   string
	wg     sync.WaitGroup
	queue  chan busMsg[T]
	closed atomic.Bool
}

func NewBus[T any](name string) *Bus[T] {
	b := &Bus[T]{
		name:  name,
		wg:    sync.WaitGroup{},
		queue: make(chan busMsg[T], 8),
	}

	go b.eventLoop()
	return b
}

func (b *Bus[T]) eventLoop() {
	listeners := map[*busSubscription[T]]struct{}{}

	defer func() {
		// The queue closed out, we should clean up all the remaining subscriptions
		// if they need to be cleaned up
		for listener := range listeners {
			if listener.cancel != nil {
				select {
				case <-listener.ctx.Done():
					if listener.cleanup != nil {
						listener.cleanup()
						listener.cleanup = nil
					}
				default:
					listener.cancel()
					if listener.cleanup != nil {
						listener.cleanup()
						listener.cleanup = nil
					}
				}
			}
		}

		clear(listeners)
	}()

	for msg := range b.queue {
		if msg.msg != nil {
			spanCtx, msgSpan := otel.Tracer("Bus").Start(
				context.TODO(),
				b.name,
			)

			for listener := range listeners {
				func() {
					_, listenerSpan := otel.Tracer("Bus").Start(
						spanCtx,
						"Handler",
						trace.WithAttributes(attribute.String("name", listener.handleName)),
					)

					defer listenerSpan.End()

					// Check if the listener is expired
					select {
					case <-listener.ctx.Done():
						// Subscription is done, clear it out
						if listener.cleanup != nil {
							listener.cleanup()
							listener.cleanup = nil
						}
						delete(listeners, msg.sub)
					default:
						listener.handle(*msg.msg)
					}
				}()
			}

			msgSpan.End()

			b.wg.Done()
		} else if msg.sub != nil {
			listeners[msg.sub] = struct{}{}
		}
	}
}

// Emit a message to the message bus
func (b *Bus[T]) Emit(value T) {
	if !b.closed.Load() {
		// wait for msg to be processed
		b.wg.Add(1)
		b.queue <- busMsg[T]{
			msg: &value,
		}
	}
}

func getFunctionName(i any) string {
	return runtime.FuncForPC(reflect.ValueOf(i).Pointer()).Name()
}

// Wait for a message matching a predicate criteria to be met
// This is a blocking call.
// The context can be used to cancel the wait operation and will return the context error.
// Upon a successful wait operation, the message that matched the criteria will be returned
func (b *Bus[T]) Wait(ctx context.Context, predicate BusPredicate[T]) chan T {
	listener := make(chan T)

	waitCtx, cancel := context.WithCancel(ctx)

	b.queue <- busMsg[T]{sub: &busSubscription[T]{
		ctx:    waitCtx,
		cancel: cancel,
		handle: func(msg T) {
			if predicate(msg) {
				select {
				case listener <- msg:
				case <-waitCtx.Done():
				}

				cancel()
			}
		},
		handleName: fmt.Sprintf("Wait for %s", getFunctionName(predicate)),
		cleanup: func() {
			close(listener)
		},
	}}

	return listener
}

// Attaches a function callback that runs in order on every event that is emitted
// on this message bus. Calls to the handler are performed in a SINGLE goroutine
// meaning that the handler will not process multiple messages at the same time.
//
// The context is used to cancel the subscription to the message bus
func (b *Bus[T]) On(ctx context.Context, handler BusEventHandler[T]) {
	// Register the subscription
	// Subscriptions are cleared once the context is cleaned up
	b.queue <- busMsg[T]{sub: &busSubscription[T]{
		ctx:        ctx,
		handle:     handler,
		handleName: getFunctionName(handler),
	}}
}

// Flush implements stream.FlushableStream.
func (b *Bus[T]) Flush(ctx context.Context) error {
	b.wg.Wait()
	return nil
}

func (b *Bus[T]) Dispose() {
	if !b.closed.Load() {
		b.closed.Store(true)
		close(b.queue)
	}
}

func (b *Bus[T]) Start() {
	if b.closed.Load() {
		b.queue = make(chan busMsg[T], 8)
		b.closed.Store(false)
		go b.eventLoop()
	}
}
