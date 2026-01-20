// Copyright 2024 Bjørn Erik Pedersen
// SPDX-License-Identifier: MIT

package util

import (
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestDebounce(t *testing.T) {
	var (
		counter1 uint64
		counter2 uint64
	)

	f1 := func() {
		atomic.AddUint64(&counter1, 1)
	}

	f2 := func() {
		atomic.AddUint64(&counter2, 1)
	}

	f3 := func() {
		atomic.AddUint64(&counter2, 2)
	}

	debounced := NewDebouncer(100 * time.Millisecond)

	for i := 0; i < 3; i++ {
		for j := 0; j < 10; j++ {
			debounced(f1)
		}

		time.Sleep(200 * time.Millisecond)
	}

	for i := 0; i < 4; i++ {
		for j := 0; j < 10; j++ {
			debounced(f2)
		}
		for j := 0; j < 10; j++ {
			debounced(f3)
		}

		time.Sleep(200 * time.Millisecond)
	}

	c1 := int(atomic.LoadUint64(&counter1))
	c2 := int(atomic.LoadUint64(&counter2))
	assert.Equal(t, 3, c1)
	assert.Equal(t, 8, c2)
}

func TestDebounceConcurrentAdd(t *testing.T) {
	var wg sync.WaitGroup

	var flag uint64

	debounced := NewDebouncer(100 * time.Millisecond)

	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			debounced(func() {
				atomic.CompareAndSwapUint64(&flag, 0, 1)
			})
		}()
	}
	wg.Wait()

	time.Sleep(500 * time.Millisecond)
	c := int(atomic.LoadUint64(&flag))
	assert.Equal(t, 1, c)
}

// Issue #1
func TestDebounceDelayed(t *testing.T) {

	var (
		counter1 uint64
	)

	f1 := func() {
		atomic.AddUint64(&counter1, 1)
	}

	debounced := NewDebouncer(100 * time.Millisecond)

	time.Sleep(110 * time.Millisecond)

	debounced(f1)

	time.Sleep(200 * time.Millisecond)

	c1 := int(atomic.LoadUint64(&counter1))
	assert.Equal(t, 1, c1)
}

func BenchmarkDebounce(b *testing.B) {
	var counter uint64

	f := func() {
		atomic.AddUint64(&counter, 1)
	}

	debounced := NewDebouncer(100 * time.Millisecond)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		debounced(f)
	}

	c := int(atomic.LoadUint64(&counter))
	if c != 0 {
		b.Fatal("Expected count 0, was", c)
	}
}
