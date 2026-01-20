package util

import (
	"context"
	"os"
	"os/signal"
	"syscall"
)

// Create a new context that is cancelled when a SIGINT (keyboard interrupt) or SIGTERM
// is sent to this process
func SigTermIntContext() context.Context {
	ctx, cancel := context.WithCancel(context.Background())

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigs
		cancel()
	}()

	return ctx
}
