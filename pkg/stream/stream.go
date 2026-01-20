package stream

import (
	"context"
	"sync"
)

// A port is a standard Go channel that sends data in a stream.Message[T] rather
// than the raw data.
// This allows asynchronous completion replies to be propagated back to the
// original sender as well as allow the sender to cancel a port send
type Port[T any] = chan *Message[T]

// Create a new port
func NewPort[T any]() Port[T] {
	return make(Port[T])
}

// Create a new tranform stream given a function that can convert a message 'A'
// into one or more message 'B's.
// The wait group will increment until the input stream is closed.
// The output stream is also closed once the input is closed.
func NewPush[A, B any](
	wg *sync.WaitGroup,
	in Port[A],
	f func(a A, push func(B) error) error,
) Port[B] {
	out := NewPort[B]()

	wg.Add(1)
	go func() {
		defer wg.Done()
		defer close(out)

		for msg := range in {
			if m, ok := msg.Get(); ok {
				msg.Reply(f(m, func(b B) error {
					return SendAndAwait(msg.ctx, out, b)
				}))
			}
		}
	}()

	return out
}

// This transformation stream is meant to be for messages that can be converted 1:1 A -> B.
// Convert streams are more efficient than push streams because they propagate the
// reply from the original message and avoid an allocation. They are also simpler to implement.
func NewConvert[A, B any](
	wg *sync.WaitGroup,
	in Port[A],
	f func(a A) (B, error),
) Port[B] {
	out := NewPort[B]()

	wg.Add(1)
	go func() {
		defer wg.Done()
		defer close(out)

		for msg := range in {
			if m, ok := msg.Get(); ok {
				b, err := f(m)
				if err != nil {
					msg.Reply(err)
				} else {
					// Propagate the message
					out <- Propagate(msg, b)
				}
			}
		}
	}()

	return out
}

func Foreach[T any](
	wg *sync.WaitGroup,
	p Port[T],
	f func(ctx context.Context, t T) error,
) {
	wg.Add(1)
	go func() {
		defer wg.Done()
		for msg := range p {
			if pkt, ok := msg.Get(); ok {
				msg.Reply(f(msg.Context(), pkt))
			}
		}
	}()
}
