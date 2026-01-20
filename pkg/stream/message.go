package stream

import (
	"context"
)

type Message[T any] struct {
	msg   T
	ctx   context.Context
	reply chan error
}

func NewMessage[T any](ctx context.Context, msg T) *Message[T] {
	return &Message[T]{
		msg:   msg,
		ctx:   ctx,
		reply: make(chan error),
	}
}

// Get the message contents
// A boolean is also returned indicating whether the message
// should still be processed.
// If this is `false`, a reply should NOT be sent to this message
// since the message has been cancelled
func (m *Message[T]) Get() (T, bool) {
	select {
	case <-m.ctx.Done():
		var z T
		return z, false
	default:
		return m.msg, true
	}
}

func (m *Message[T]) Context() context.Context {
	return m.ctx
}

func (m *Message[T]) Reply(err error) {
	defer close(m.reply)
	select {
	case <-m.ctx.Done():
	case m.reply <- err:
	}
}

func (m *Message[T]) Await() error {
	select {
	case err, ok := <-m.reply:
		if ok {
			return err
		} else {
			return ErrInvalidReply
		}
	case <-m.ctx.Done():
		return m.ctx.Err()
	}
}

func Propagate[A, B any](a *Message[A], msg B) *Message[B] {
	return &Message[B]{
		msg:   msg,
		ctx:   a.ctx,
		reply: a.reply,
	}
}

func SendAndAwait[T any](
	ctx context.Context,
	port Port[T],
	msg T,
) error {
	m := NewMessage(ctx, msg)

	select {
	case <-ctx.Done():
		return ctx.Err()
	case port <- m:
		return m.Await()
	}
}
