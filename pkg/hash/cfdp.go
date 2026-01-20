package hash

import "encoding/binary"

// Verify CFDP satisfies Hash interface
var _ Hash[uint32] = (*cfdpImpl)(nil)

type cfdpImpl struct {
	value    uint32
	position int
}

func NewCFDP() Hash[uint32] {
	return &cfdpImpl{value: 0}
}

func (c *cfdpImpl) updateUnaligned(b byte) {
	c.value = (c.value + (uint32(b) << (8 * (3 - (c.position % 4))))) & 0xFFFFFFFF
	c.position++
}

func (c *cfdpImpl) Reset() {
	c.value = 0
	c.position = 0
}

func (c *cfdpImpl) Update(data []byte) {
	offset := 0

	// Push unaligned data until aligned or out of bytes
	for ; (c.position%4 != 0) && offset < len(data); offset++ {
		c.updateUnaligned(data[offset])
	}

	// Push aligned data in word increments
	// Push as must as possible
	for offset+4 < len(data) {
		c.value += binary.BigEndian.Uint32(data[offset : offset+4])
		c.position += 4
		offset += 4
	}

	// Place the rest of the unaligned data
	for ; offset < len(data); offset++ {
		c.updateUnaligned(data[offset])
	}
}

func (c *cfdpImpl) Finish() uint32 {
	return c.value
}
