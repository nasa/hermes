package pb

import (
	"errors"
	"fmt"
	"unsafe"
)

var ErrInvalidSize = errors.New("invalid size")

func newInvalidSize(size int, multiple int) error {
	return fmt.Errorf("%w: %d not multiple of %d", ErrInvalidSize, size, multiple)
}

func unsafeSwap2(data []byte) ([]byte, error) {
	if len(data)%2 != 0 {
		return nil, newInvalidSize(len(data), 2)
	}

	result := make([]byte, len(data))
	ptr := unsafe.Pointer(&data[0])
	resPtr := unsafe.Pointer(&result[0])

	for i := 0; i < len(data); i += 2 {
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+1)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+1))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i)))
	}

	return result, nil
}

func unsafeSwap4(data []byte) ([]byte, error) {
	if len(data)%4 != 0 {
		return nil, newInvalidSize(len(data), 4)
	}

	result := make([]byte, len(data))
	ptr := unsafe.Pointer(&data[0])
	resPtr := unsafe.Pointer(&result[0])

	for i := 0; i < len(data); i += 4 {
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+3)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+1))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+2)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+2))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+1)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+3))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i)))
	}

	return result, nil
}

func unsafeSwap8(data []byte) ([]byte, error) {
	if len(data)%8 != 0 {
		return nil, newInvalidSize(len(data), 8)
	}

	result := make([]byte, len(data))
	ptr := unsafe.Pointer(&data[0])
	resPtr := unsafe.Pointer(&result[0])

	for i := 0; i < len(data); i += 8 {
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+7)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+1))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+6)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+2))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+5)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+3))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+4)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+4))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+3)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+5))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+2)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+6))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i+1)))
		*(*byte)(unsafe.Pointer(uintptr(resPtr) + uintptr(i+7))) = *(*byte)(unsafe.Pointer(uintptr(ptr) + uintptr(i)))
	}

	return result, nil
}

func unsafeBytesToSlice[T any](bs []byte) ([]T, error) {
	var v T
	if len(bs)%int(unsafe.Sizeof(v)) != 0 {
		return nil, newInvalidSize(len(bs), int(unsafe.Sizeof(v)))
	}

	return unsafe.Slice((*T)(unsafe.Pointer(&bs[0])), len(bs)/int(unsafe.Sizeof(v))), nil
}
