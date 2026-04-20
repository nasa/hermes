use crate::{
    AggregateType, AggregateValue, ArrayType, BinaryType, BooleanEncoding, BooleanType,
    ByteOrder, Error, FloatSize, FloatType, IntegerType, Result,
    StringType, Type, Value, VariableSize,
};

/// Serializer that converts typed Values into binary format
pub struct Serializer {
    /// Byte buffer being written to
    buffer: Vec<u8>,
    /// Current bit offset within the buffer (for non-byte-aligned fields)
    bit_offset: usize,
}

impl Serializer {
    /// Create a new serializer
    pub fn new() -> Self {
        Serializer {
            buffer: Vec::new(),
            bit_offset: 0,
        }
    }

    /// Convert the serializer into the final byte buffer
    pub fn into_bytes(mut self) -> Vec<u8> {
        // Pad to byte boundary if needed
        if self.bit_offset > 0 {
            self.bit_offset = 0;
        }
        self.buffer
    }

    /// Get the current buffer
    pub fn buffer(&self) -> &[u8] {
        &self.buffer
    }

    /// Write raw bytes to the buffer
    pub fn write_bytes(&mut self, bytes: &[u8]) -> Result<()> {
        if self.bit_offset != 0 {
            return Err(Error::NotImplemented(
                "Writing bytes with non-zero bit offset",
            ));
        }
        self.buffer.extend_from_slice(bytes);
        Ok(())
    }

    /// Serialize a value according to its type
    pub fn serialize_value(&mut self, type_: &Type, value: &Value) -> Result<()> {
        match (type_, value) {
            (Type::Integer(int_ty), Value::SignedInteger(i)) => {
                self.serialize_integer(int_ty, *i)?;
            }
            (Type::Integer(int_ty), Value::UnsignedInteger(u)) => {
                if int_ty.signed {
                    return Err(Error::TypeValueMismatch);
                }
                self.serialize_unsigned(int_ty, *u)?;
            }
            (Type::Float(float_ty), Value::Float(f)) => {
                self.serialize_float(float_ty, *f)?;
            }
            (Type::String(str_ty), Value::String(s)) => {
                self.serialize_string(str_ty, s)?;
            }
            (Type::Boolean(bool_ty), Value::Boolean(b)) => {
                self.serialize_boolean(bool_ty, *b)?;
            }
            (Type::Binary(bin_ty), Value::Binary(b)) => {
                self.serialize_binary(bin_ty, b)?;
            }
            (Type::Enumerated(enum_ty), Value::Enumerated(e)) => {
                // Enumerate values are always i64, but may be encoded as unsigned
                if enum_ty.encoding.signed {
                    self.serialize_integer(&enum_ty.encoding, e.value)?;
                } else {
                    self.serialize_unsigned(&enum_ty.encoding, e.value as u64)?;
                }
            }
            (Type::Array(arr_ty), Value::Array(arr)) => {
                self.serialize_array(arr_ty, arr)?;
            }
            (Type::Aggregate(agg_ty), Value::Aggregate(agg)) => {
                self.serialize_aggregate(agg_ty, agg)?;
            }
            (Type::AbsoluteTime(_abs_ty), Value::AbsoluteTime(_time)) => {
                return Err(Error::NotImplemented("Absolute time serialization"));
            }
            (Type::RelativeTime(_rel_ty), Value::RelativeTime(_time)) => {
                return Err(Error::NotImplemented("Relative time serialization"));
            }
            _ => return Err(Error::TypeValueMismatch),
        }
        Ok(())
    }

    /// Serialize a signed integer
    fn serialize_integer(&mut self, int_ty: &IntegerType, value: i64) -> Result<()> {
        if !int_ty.signed {
            return Err(Error::TypeValueMismatch);
        }

        let size_in_bits = int_ty.size_in_bits as usize;

        // Convert signed to unsigned representation for serialization
        let unsigned_value = if value < 0 {
            // Two's complement
            let mask = if size_in_bits == 64 {
                u64::MAX
            } else {
                (1u64 << size_in_bits) - 1
            };
            (value as u64) & mask
        } else {
            value as u64
        };

        self.write_unsigned_bits(unsigned_value, size_in_bits, int_ty.byte_order)
    }

    /// Serialize an unsigned integer
    fn serialize_unsigned(&mut self, int_ty: &IntegerType, value: u64) -> Result<()> {
        let size_in_bits = int_ty.size_in_bits as usize;
        self.write_unsigned_bits(value, size_in_bits, int_ty.byte_order)
    }

    /// Write an unsigned value with specified bit size and byte order
    fn write_unsigned_bits(
        &mut self,
        value: u64,
        size_in_bits: usize,
        byte_order: ByteOrder,
    ) -> Result<()> {
        if self.bit_offset != 0 {
            return Err(Error::NotImplemented(
                "Bit-aligned integer serialization not yet implemented",
            ));
        }

        if size_in_bits % 8 != 0 {
            return Err(Error::NotImplemented(
                "Non-byte-aligned integer serialization not yet implemented",
            ));
        }

        let num_bytes = size_in_bits / 8;

        match byte_order {
            ByteOrder::BigEndian => {
                for i in (0..num_bytes).rev() {
                    let byte = ((value >> (i * 8)) & 0xFF) as u8;
                    self.buffer.push(byte);
                }
            }
            ByteOrder::LittleEndian => {
                for i in 0..num_bytes {
                    let byte = ((value >> (i * 8)) & 0xFF) as u8;
                    self.buffer.push(byte);
                }
            }
        }

        Ok(())
    }

    /// Serialize a float
    fn serialize_float(&mut self, float_ty: &FloatType, value: f64) -> Result<()> {
        if self.bit_offset != 0 {
            return Err(Error::NotImplemented(
                "Bit-aligned float serialization not yet implemented",
            ));
        }

        match float_ty.size_in_bits {
            FloatSize::F32 => {
                let f32_val = value as f32;
                let bytes = match float_ty.byte_order {
                    ByteOrder::BigEndian => f32_val.to_be_bytes(),
                    ByteOrder::LittleEndian => f32_val.to_le_bytes(),
                };
                self.buffer.extend_from_slice(&bytes);
            }
            FloatSize::F64 => {
                let bytes = match float_ty.byte_order {
                    ByteOrder::BigEndian => value.to_be_bytes(),
                    ByteOrder::LittleEndian => value.to_le_bytes(),
                };
                self.buffer.extend_from_slice(&bytes);
            }
        }

        Ok(())
    }

    /// Serialize a string
    fn serialize_string(&mut self, str_ty: &StringType, value: &str) -> Result<()> {
        let bytes = match str_ty.encoding {
            crate::StringEncoding::Utf8 => value.as_bytes(),
            crate::StringEncoding::UsAscii => value.as_bytes(), // ASCII is subset of UTF-8
        };

        match &str_ty.size {
            VariableSize::Fixed(size_in_bits) => {
                let expected_bytes = size_in_bits / 8;
                if bytes.len() != expected_bytes {
                    return Err(Error::InvalidValue(format!(
                        "String length {} does not match fixed size {} bytes",
                        bytes.len(),
                        expected_bytes
                    )));
                }
                self.buffer.extend_from_slice(bytes);
            }
            VariableSize::LeadingSize { kind, .. } => {
                // Write length prefix
                let len = bytes.len() as u64;
                self.serialize_unsigned(kind, len)?;
                // Write string content
                self.buffer.extend_from_slice(bytes);
            }
            VariableSize::TerminationChar { chr, .. } => {
                // Write string content
                self.buffer.extend_from_slice(bytes);
                // Write termination character
                self.buffer.push(*chr);
            }
            VariableSize::DynamicParameterRef(_) => {
                return Err(Error::NotImplemented(
                    "Dynamic parameter ref string size not supported in serialization",
                ));
            }
        }

        Ok(())
    }

    /// Serialize a boolean
    fn serialize_boolean(&mut self, bool_ty: &BooleanType, value: bool) -> Result<()> {
        match &bool_ty.encoding {
            BooleanEncoding::Integer(int_ty) => {
                let int_value = if value { 1i64 } else { 0i64 };
                self.serialize_integer(int_ty, int_value)?;
            }
            BooleanEncoding::String(str_ty) => {
                let str_value = if value {
                    &bool_ty.one_string_value
                } else {
                    &bool_ty.zero_string_value
                };
                self.serialize_string(str_ty, str_value)?;
            }
        }

        Ok(())
    }

    /// Serialize binary data
    fn serialize_binary(&mut self, bin_ty: &BinaryType, value: &[u8]) -> Result<()> {
        match &bin_ty.size {
            VariableSize::Fixed(size_in_bits) => {
                let expected_bytes = size_in_bits / 8;
                if value.len() != expected_bytes {
                    return Err(Error::InvalidValue(format!(
                        "Binary length {} does not match fixed size {} bytes",
                        value.len(),
                        expected_bytes
                    )));
                }
                self.buffer.extend_from_slice(value);
            }
            VariableSize::LeadingSize { kind, .. } => {
                // Write length prefix
                let len = value.len() as u64;
                self.serialize_unsigned(kind, len)?;
                // Write binary content
                self.buffer.extend_from_slice(value);
            }
            _ => {
                return Err(Error::NotImplemented(
                    "Termination char and dynamic ref not supported for binary types",
                ));
            }
        }

        Ok(())
    }

    /// Serialize an array
    fn serialize_array(&mut self, arr_ty: &ArrayType, values: &[Value]) -> Result<()> {
        // For now, assume single dimension
        if arr_ty.dimensions.len() != 1 {
            return Err(Error::NotImplemented(
                "Multi-dimensional array serialization",
            ));
        }

        // TODO: Handle dynamic array size prefix if needed
        // For now, just serialize elements in order

        for (i, value) in values.iter().enumerate() {
            self.serialize_value(&arr_ty.element_type, value)
                .map_err(|e| {
                    Error::InvalidValue(format!("Array element {} serialization failed: {}", i, e))
                })?;
        }

        Ok(())
    }

    /// Serialize an aggregate
    fn serialize_aggregate(&mut self, agg_ty: &AggregateType, value: &AggregateValue) -> Result<()> {
        // Serialize members in the order defined by the type
        for member in &agg_ty.members {
            let member_value = value.get(&member.name).ok_or_else(|| {
                Error::InvalidValue(format!("Missing aggregate member '{}'", member.name))
            })?;

            self.serialize_value(&member.type_, member_value)
                .map_err(|e| {
                    Error::InvalidValue(format!(
                        "Aggregate member '{}' serialization failed: {}",
                        member.name, e
                    ))
                })?;
        }

        Ok(())
    }
}

impl Default for Serializer {
    fn default() -> Self {
        Self::new()
    }
}
