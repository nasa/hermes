use serde::Deserialize;
#[derive(Debug, Default, Deserialize)]
pub struct EntitiesType(pub ::std::vec::Vec<::std::string::String>);
pub type EntityType = ::std::string::String;
pub type IdType = ::std::string::String;
pub type IdrefType = ::std::string::String;
#[derive(Debug, Default, Deserialize)]
pub struct IdrefsType(pub ::std::vec::Vec<::std::string::String>);
pub type NcNameType = ::std::string::String;
pub type NmtokenType = ::std::string::String;
#[derive(Debug, Default, Deserialize)]
pub struct NmtokensType(pub ::std::vec::Vec<::std::string::String>);
pub type NotationType = ::std::string::String;
pub type NameType = ::std::string::String;
pub type QNameType = ::std::string::String;
#[derive(Debug, Deserialize)]
pub struct AnySimpleType {
    #[serde(default, rename = "@type")]
    pub type_: ::core::option::Option<::std::string::String>,
    #[serde(default, rename = "$text")]
    pub content: Content1Type,
}
#[derive(Debug, Deserialize)]
pub struct AnyType {
    #[serde(default, rename = "$text")]
    pub text: ::core::option::Option<::std::string::String>,
}
pub type AnyUriType = ::std::string::String;
pub type Base64BinaryType = ::std::string::String;
pub type BooleanType = ::core::primitive::bool;
pub type ByteType = ::core::primitive::i8;
pub type DateType = ::std::string::String;
pub type DateTimeType = ::std::string::String;
pub type DecimalType = ::core::primitive::f64;
pub type DoubleType = ::core::primitive::f64;
pub type DurationType = ::std::string::String;
pub type FloatType = ::core::primitive::f32;
pub type GDayType = ::std::string::String;
pub type GMonthType = ::std::string::String;
pub type GMonthDayType = ::std::string::String;
pub type GYearType = ::std::string::String;
pub type GYearMonthType = ::std::string::String;
pub type HexBinaryType = ::std::string::String;
pub type IntType = ::core::primitive::i32;
pub type IntegerType = ::core::primitive::i32;
pub type LanguageType = ::std::string::String;
pub type LongType = ::core::primitive::i64;
pub type NegativeIntegerType = ::core::num::NonZeroIsize;
pub type NonNegativeIntegerType = ::core::primitive::usize;
pub type NonPositiveIntegerType = ::core::primitive::isize;
pub type NormalizedStringType = ::std::string::String;
pub type PositiveIntegerType = ::core::num::NonZeroUsize;
pub type ShortType = ::core::primitive::i16;
pub type StringType = ::std::string::String;
pub type TimeType = ::std::string::String;
pub type TokenType = ::std::string::String;
pub type UnsignedByteType = ::core::primitive::u8;
pub type UnsignedIntType = ::core::primitive::u32;
pub type UnsignedLongType = ::core::primitive::u64;
pub type UnsignedShortType = ::core::primitive::u16;
pub type Content1Type = ::std::string::String;
