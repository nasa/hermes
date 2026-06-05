use crate::de::BitVec;
use crate::{ByteOrder, Error, Result};

#[derive(Debug, Clone)]
pub struct TmFrame {
    pub version: u8,
    pub spacecraft_id: u16,
    pub virtual_channel_id: u8,

    pub master_channel_frame_count: u8,
    pub virtual_channel_frame_count: u8,

    /// The Transfer Frame Secondary Header Flag shall signal the presence or absence
    /// of the Transfer Frame Secondary Header. It shall be ‘1’ if a Transfer Frame Secondary
    /// Header is present; it shall be ‘0’ if a Transfer Frame Secondary Header is not present.
    pub secondary_header: bool,

    /// The Synchronization Flag shall signal the type of data which are
    /// inserted into the Transfer Frame Data Field. It shall be ‘0’
    /// if octet-synchronized and forward-ordered Packets or Idle Data are
    /// inserted; it shall be ‘1’ if a VCA_SDU is inserted.
    pub sync_flag: bool,

    /// If the Synchronization Flag is set to ‘0’, the Packet Order Flag is reserved for future
    /// use by the CCSDS and is set to ‘0’. If the Synchronization Flag is set to ‘1’, the
    /// use of the Packet Order Flag is undefined.
    pub packet_order_flag: bool,

    /// This Identifier was required for earlier versions of this Recommended Standard to allow
    /// for the use of Source Packet Segments, which are no longer defined. Its value has been
    /// set to the value used to denote non-use of Source Packet Segments in previous versions.
    pub segment_length_id: u8,

    /// The purpose of the First Header Pointer is to facilitate delimiting of variable-length
    /// Packets contained within the Transfer Frame Data Field by pointing directly to the
    /// location of the first Packet from which its length may be determined.
    pub first_header_pointer: u16,

    pub payload: Vec<u8>,

    /// The association of an Operational Control Field with a Master Channel allows
    /// data to be transferred synchronized with this Master Channel. The association of
    /// an Operational Control Field with a Virtual Channel allows data to be transferred
    /// synchronized with this Virtual Channel.
    pub operational_control_field: Option<u32>,
}

const CRC_16_TABLE: [u16; 256] = [
    0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b,
    0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
    0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401,
    0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738,
    0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96,
    0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
    0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd,
    0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
    0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb,
    0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2,
    0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
    0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8,
    0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827,
    0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
    0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d,
    0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
    0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74,
    0x2e93, 0x3eb2, 0x0ed1, 0x1ef0,
];

pub struct Crc16(u16);
impl Crc16 {
    pub fn new() -> Self {
        Self { 0: 0xFFFF }
    }

    pub fn update(&mut self, data: &[u8]) {
        let mut r = self.0;
        for b in data {
            r = (r << 8) ^ CRC_16_TABLE[((r >> 8) as u8 ^ *b) as usize];
        }

        self.0 = r;
    }

    pub fn finish(self) -> u16 {
        self.0 & 0xFFFF
    }
}

impl TmFrame {
    pub fn decode(data: &[u8], validate_crc: bool) -> Result<TmFrame> {
        let bv = BitVec::from_bytes(data);

        // Validate the CRC before we do anything
        if validate_crc {
            let mut crc = Crc16::new();
            crc.update(&data[0..data.len() - 2]);
            let computed = crc.finish();
            let received = bv.get((data.len() - 2) * 8, 16, ByteOrder::BigEndian) as u16;

            if computed != received {
                return Err(Error::ChecksumMismatch(computed, received));
            }
        }

        let version = bv.get(0, 2, ByteOrder::BigEndian) as u8;
        let spacecraft_id = bv.get(2, 10, ByteOrder::BigEndian) as u16;
        let virtual_channel_id = bv.get(12, 3, ByteOrder::BigEndian) as u8;
        let ocf_flag = bv.get(15, 1, ByteOrder::BigEndian) == 1;

        let master_channel_frame_count = bv.get(16, 8, ByteOrder::BigEndian) as u8;
        let virtual_channel_frame_count = bv.get(24, 8, ByteOrder::BigEndian) as u8;

        let secondary_header = bv.get(32, 1, ByteOrder::BigEndian) == 1;
        let sync_flag = bv.get(33, 1, ByteOrder::BigEndian) == 1;
        let packet_order_flag = bv.get(34, 1, ByteOrder::BigEndian) == 1;
        let segment_length_id = bv.get(35, 2, ByteOrder::BigEndian) as u8;
        let first_header_pointer = bv.get(37, 11, ByteOrder::BigEndian) as u16;

        let payload_len = {
            let without_crc = if validate_crc {
                data.len() - 2
            } else {
                data.len()
            };

            if ocf_flag {
                without_crc - 4
            } else {
                without_crc
            }
        } - 6;

        let payload = bv.read(48, payload_len);

        let operational_control_field = if ocf_flag {
            Some(bv.get(48 * (payload_len * 8), 32, ByteOrder::BigEndian) as u32)
        } else {
            None
        };

        Ok(TmFrame {
            version,
            spacecraft_id,
            virtual_channel_id,
            master_channel_frame_count,
            virtual_channel_frame_count,
            secondary_header,
            sync_flag,
            packet_order_flag,
            segment_length_id,
            first_header_pointer,
            payload,
            operational_control_field,
        })
    }
}
