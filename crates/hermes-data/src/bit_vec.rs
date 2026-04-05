use crate::ByteOrder;

/// BitVec in big endian ordering is straightforward
/// little endian order is quite a bit more confusing.
///
/// ```C
/// struct x {
///     unsigned int a : 4;
///     unsigned int b : 8;
///     unsigned int c : 4;
/// };
/// ```
///
/// Big endian:
/// `AAAABBBB BBBBCCCC`
///
/// Little endian:
/// `BBBBAAAA CCCCBBBB`
///
pub(crate) struct BitVec<'a> {
    buffer: &'a [u8],
    offset: usize,
}

impl<'a> BitVec<'a> {
    pub(crate) fn new(buffer: &'a [u8], offset: usize) -> Self {
        Self { buffer, offset }
    }

    fn get_be(&self, bit_offset: usize, bit_size: usize) -> u64 {
        let mut result = 0u64;

        let mut byte_index = bit_offset / 8;
        let mut remaining_bits = bit_size;

        // Calculate how many bits are available from bit_offset to the end of the current byte
        let first_byte_bits = (8 - (bit_offset % 8)) % 8;

        if first_byte_bits > 0 {
            if remaining_bits <= first_byte_bits {
                // The entire value fits within the first byte
                let shift = first_byte_bits - remaining_bits;
                let mask = (1 << remaining_bits) - 1;
                return ((self.buffer[byte_index] >> shift) & mask) as u64;
            } else {
                // Extract the bits from the first partial byte
                let mask = (1 << first_byte_bits) - 1;
                result = (self.buffer[byte_index] & mask) as u64;
                remaining_bits -= first_byte_bits;
                byte_index += 1;
            }
        }

        // Read complete bytes (8 bits at a time)
        while remaining_bits > 8 {
            result = (result << 8) | (self.buffer[byte_index] as u64);
            remaining_bits -= 8;
            byte_index += 1;
        }

        // Read the final partial byte
        let shift = 8 - remaining_bits;
        result = (result << remaining_bits) | ((self.buffer[byte_index] >> shift) as u64);

        result
    }

    fn get_le(&self, bit_offset: usize, bit_size: usize) -> u64 {
        let mut result = 0u64;

        let mut byte_index = (bit_offset + bit_size - 1) / 8;
        let mut remaining_bits = bit_size;

        // Calculate how many bits are in the last partial byte
        let last_byte_bits = (bit_offset + bit_size) % 8;

        if last_byte_bits > 0 {
            if remaining_bits <= last_byte_bits {
                // The entire value fits within the last byte
                let shift = last_byte_bits - remaining_bits;
                let mask = (1 << remaining_bits) - 1;
                return ((self.buffer[byte_index] >> shift) & mask) as u64;
            } else {
                // Extract the bits from the last partial byte
                let mask = (1 << last_byte_bits) - 1;
                result = (self.buffer[byte_index] & mask) as u64;
                remaining_bits -= last_byte_bits;
                byte_index -= 1;
            }
        }

        // Read complete bytes (8 bits at a time)
        while remaining_bits > 8 {
            result = (result << 8) | (self.buffer[byte_index] as u64);
            remaining_bits -= 8;
            byte_index -= 1;
        }

        // Read the final partial byte
        let shift = 8 - remaining_bits;
        result = (result << remaining_bits) | ((self.buffer[byte_index] >> shift) as u64);

        result
    }

    pub(crate) fn get(&self, bit_offset: usize, bit_size: usize, order: ByteOrder) -> u64 {
        match order {
            ByteOrder::LittleEndian => self.get_le(bit_offset + self.offset, bit_size),
            ByteOrder::BigEndian => self.get_be(bit_offset + self.offset, bit_size),
        }
    }

    pub(crate) fn read(&self, bit_offset: usize, num_bytes: usize) -> Vec<u8> {
        let bit_offset = bit_offset + self.offset;

        // Nominally we will never need to do any shifts since strings should be aligned to 8-bits
        let shift = bit_offset % 8;
        let start = bit_offset / 8;

        // Apply the optional shift
        if shift > 0 {
            // Load two bytes at a time and combine with the proper shift (slow)
            (start..(start + num_bytes))
                .into_iter()
                .map(|i| (self.buffer[i] << shift) | (self.buffer[(i + 1) % 8] >> shift))
                .collect()
        } else {
            // No shift needed, return the data (fast)
            (start..(start + num_bytes))
                .into_iter()
                .map(|i| self.buffer[i])
                .collect()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_big_endian() {
        let v = BitVec::new(&[0b1010_0011, 0b1100_1111], 0);
        assert_eq!(v.get_be(0, 4), 0b1010);
        assert_eq!(v.get_be(4, 8), 0b0011_1100);
        assert_eq!(v.get_be(12, 4), 0b1111);

        let v = BitVec::new(&[0b1011_0011, 0b1110_0101, 0b0110_0011, 0b1111_0000], 0);
        assert_eq!(v.get_be(0, 3), 0b101);
        assert_eq!(v.get_be(3, 10), 0b10_0111_1100);
        assert_eq!(v.get_be(13, 19), 0b101_0110_0011_1111_0000);
    }

    #[test]
    fn test_little_endian() {
        let v = BitVec::new(&[0b1010_0011, 0b1100_1111], 0);
        assert_eq!(v.get_le(0, 4), 0b0011);
        assert_eq!(v.get_le(4, 8), 0b1111_1010);
        assert_eq!(v.get_le(12, 4), 0b1100);

        let v = BitVec::new(&[0b1011_0011, 0b1110_0101, 0b0110_0011, 0b1111_0000], 0);
        assert_eq!(v.get_le(0, 3), 0b011);
        assert_eq!(v.get_le(3, 10), 0b00_10110110);
        assert_eq!(v.get_le(13, 19), 0b111_1000_0011_0001_1111);
    }
}
