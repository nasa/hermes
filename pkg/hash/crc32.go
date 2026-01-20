package hash

var crc32Table [256]uint32

// Verify CRC32 satisfies Hash interface
var _ Hash[uint32] = (*crc32)(nil)

type crc32 uint32

func NewCRC32() Hash[uint32] {
	out := crc32(0xFFFFFFFF)
	return &out
}

func init() {
	// Initialize the CRC32 polynomial
	for i := range crc32Table {
		c := uint32(i)
		for range 8 {
			if (c & 1) != 0 {
				c = 0xEDB88320 ^ (c >> 1)
			} else {
				c = c >> 1
			}
		}

		crc32Table[i] = c
	}
}

func (c *crc32) Reset() {
	*c = 0xFFFFFFFF
}

func (c *crc32) Update(data []byte) {
	r := uint32(*c)

	for _, b := range data {
		r = (r >> 8) ^ crc32Table[(r^uint32(b))&0xFF]
	}

	*c = crc32(r)
}

func (c *crc32) Finish() uint32 {
	return uint32(*c) ^ 0xFFFFFFFF
}
