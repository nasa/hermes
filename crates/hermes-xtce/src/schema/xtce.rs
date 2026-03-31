use serde::{Deserialize, Serialize};
use serde_enum_str::{Deserialize_enum_str, Serialize_enum_str};
///Describe two or more conditions that are logically anded together. Conditions may be a mix of Condition and ORedCondition.   See ORedConditionType and BooleanExpressionType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AnDedConditionsType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<AnDedConditionsTypeContent>,
}
///Describe two or more conditions that are logically anded together. Conditions may be a mix of Condition and ORedCondition.   See ORedConditionType and BooleanExpressionType.
#[derive(Debug, Deserialize, Serialize)]
pub enum AnDedConditionsTypeContent {
    ///Condition elements describe a test similar to the Comparison element except that the parameters used have additional flexibility for the compare.
    #[serde(rename = "Condition")]
    Condition(ComparisonCheckType),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible and the and/or for multiple checks can be specified.
    #[serde(rename = "ORedConditions")]
    ORedConditions(ORedConditionsType),
}
///Describe an absolute time argument type relative to a known epoch (such as TAI).  The string representation of this time should use the [ISO 8601] extended format CCYY-MM-DDThh:mm:ss where "CC" represents the century, "YY" the year, "MM" the month and "DD" the day, preceded by an optional leading "-" sign to indicate a negative number. If the sign is omitted, "+" is assumed. The letter "T" is the date/time separator and "hh", "mm", "ss" represent hour, minute and second respectively. Additional digits can be used to increase the precision of fractional seconds if desired i.e. the format ss.ss... with any number of digits after the decimal point is supported.  See TAIType, IntegerDataEncoding and AbsoluteTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AbsoluteTimeArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DateTimeType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///A base schema type for describing an absolute time data type. Contains an absolute (to a known epoch) time.  Use the [ISO 8601] extended format CCYY-MM-DDThh:mm:ss where "CC" represents the century, "YY" the year, "MM" the month and "DD" the day, preceded by an optional leading "-" sign to indicate a negative number. If the sign is omitted, "+" is assumed. The letter "T" is the date/time separator and "hh", "mm", "ss" represent hour, minute and second respectively. Additional digits can be used to increase the precision of fractional seconds if desired i.e. the format ss.ss... with any number of digits after the decimal point is supported. See AbsoluteTimeParameterType and AbsoluteTimeArgumentType.  See AbsouteTimeParameterType, AbsoluteTimeArgumentType and BaseTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AbsoluteTimeDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DateTimeType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///Describe an absolute time parameter type relative to a known epoch (such as TAI).  The string representation of this time should use the [ISO 8601] extended format CCYY-MM-DDThh:mm:ss where "CC" represents the century, "YY" the year, "MM" the month and "DD" the day, preceded by an optional leading "-" sign to indicate a negative number. If the sign is omitted, "+" is assumed. The letter "T" is the date/time separator and "hh", "mm", "ss" represent hour, minute and second respectively. Additional digits can be used to increase the precision of fractional seconds if desired i.e. the format ss.ss... with any number of digits after the decimal point is supported.  See TAIType, IntegerDataEncoding and AbsoluteTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AbsoluteTimeParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DateTimeType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///A verifier that means the destination has accepted the command.
#[derive(Debug, Deserialize, Serialize)]
pub struct AcceptedVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<AcceptedVerifierTypeContent>,
}
///A verifier that means the destination has accepted the command.
#[derive(Debug, Deserialize, Serialize)]
pub enum AcceptedVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
}
///Describe a complex data type analogous to a C-struct. Each field of the data type is called a Member.  Each Member is part of the MemberList which forms the list of items to be placed under this data type's name.  The MemberList defines a data block and block's size is defined by the DataEncodings of each Member's type reference. The data members are ordered and contiguous in the MemberList element (packed).  Each member may be addressed by the dot syntax similar to C such as P.voltage if P is the referring parameter and voltage is of a member of P's aggregate type.  See MemberType, MemberListType, DataEncodingType, NameReferenceType, and AggregateDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AggregateArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Initial values for the individual members of the aggregate/structure may be provided here at the type definition using JSON style notation (e.g. '{ "member1": 2, "member2": "foo" }').  When Member elements provide initialValue attributes, they take precedence over these since these are at the type definition level and the Member element acts like a Parameter element.  These may also recurse into members that are also aggregates.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Ordered list of the members of the aggregate/structure.  Members are contiguous.
    #[serde(rename = "MemberList")]
    pub member_list: MemberListType,
}
///A base schema type for describing a complex data type analogous to a C-struct. Each field of the data type is called a Member.  Each Member is part of the MemberList which forms the list of items to be placed under this data type's name.  The MemberList defines a data block and block's size is defined by the DataEncodings of each Member's type reference. The data members are ordered and contiguous in the MemberList element (packed).  Each member may be addressed by the dot syntax similar to C such as P.voltage if P is the referring parameter and voltage is of a member of P's aggregate type.  See MemberType, MemberListType, DataEncodingType, NameReferenceType, AggregateParameterType and AggregateArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AggregateDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Initial values for the individual members of the aggregate/structure may be provided here at the type definition using JSON style notation (e.g. '{ "member1": 2, "member2": "foo" }').  When Member elements provide initialValue attributes, they take precedence over these since these are at the type definition level and the Member element acts like a Parameter element.  These may also recurse into members that are also aggregates.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Ordered list of the members of the aggregate/structure.  Members are contiguous.
    #[serde(rename = "MemberList")]
    pub member_list: MemberListType,
}
///Describe a complex data type analogous to a C-struct. Each field of the data type is called a Member.  Each Member is part of the MemberList which forms the list of items to be placed under this data type's name.  The MemberList defines a data block and block's size is defined by the DataEncodings of each Member's type reference. The data members are ordered and contiguous in the MemberList element (packed).  Each member may be addressed by the dot syntax similar to C such as P.voltage if P is the referring parameter and voltage is of a member of P's aggregate type.  See MemberType, MemberListType, DataEncodingType, NameReferenceType, and AggregateDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AggregateParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Initial values for the individual members of the aggregate/structure may be provided here at the type definition using JSON style notation (e.g. '{ "member1": 2, "member2": "foo" }').  When Member elements provide initialValue attributes, they take precedence over these since these are at the type definition level and the Member element acts like a Parameter element.  These may also recurse into members that are also aggregates.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Ordered list of the members of the aggregate/structure.  Members are contiguous.
    #[serde(rename = "MemberList")]
    pub member_list: MemberListType,
}
///Describe up to six levels: Normal, Watch, Warning, Distress, Critical, and Severe of conditions the alarm will trigger when true. The types are conditions available are a single comparison, a comparison list, a discrete lookup list, and custom algorithm.   See MatchCriteriaType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AlarmConditionsType {
    ///An alarm state of least concern.  Considered to be below the most commonly used Warning level.
    #[serde(default, rename = "WatchAlarm")]
    pub watch_alarm: ::core::option::Option<MatchCriteriaType>,
    ///An alarm state of concern that represents the most commonly used minimum concern level for many software applications.
    #[serde(default, rename = "WarningAlarm")]
    pub warning_alarm: ::core::option::Option<MatchCriteriaType>,
    ///An alarm state of concern in between the most commonly used Warning and Critical levels.
    #[serde(default, rename = "DistressAlarm")]
    pub distress_alarm: ::core::option::Option<MatchCriteriaType>,
    ///An alarm state of concern that represents the most commonly used maximum concern level for many software applications.
    #[serde(default, rename = "CriticalAlarm")]
    pub critical_alarm: ::core::option::Option<MatchCriteriaType>,
    ///An alarm state of highest concern.  Considered to be above the most commonly used Critical level.
    #[serde(default, rename = "SevereAlarm")]
    pub severe_alarm: ::core::option::Option<MatchCriteriaType>,
}
///Describe any number of alarm ranges, each with its own level (normal, warning, watch, distress, critical, severe) and range form (inside -- (min,max), [min,max), (min, max], [min, max], or outside -- (-inf, min) or (-inf,min] and [max, +inf) or (max,+inf). Ranges may overlap, be disjoint and so forth. Ranges within the value spectrum non-specified are non-normal. The most severe range level of value within the ranges is the level of the alarm. Range values are in calibrated engineering units. See FloatRangeType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AlarmMultiRangesType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describe any number of alarm ranges, each with its own level (normal, warning, watch, distress, critical, severe) and range form (inside -- (min,max),[min,max), (min, max], [min, max], or outside -- (-inf, min) or (-inf,min] and [max, +inf) or (max,+inf).. Ranges may overlap, be disjoint and so forth. Ranges within the value spectrum non-specified are non-normal. The most severe range level of value within the ranges is the level of the alarm. Range values are in calibrated engineering units. See FloatRangeType.
    #[serde(default, rename = "Range")]
    pub range: ::std::vec::Vec<MultiRangeType>,
}
///Describe up to six ranges where either less severe ranges are a subset of more severe ranges (outside), or more severe ranges are a subset of less severe ranges (inside). In both forms, the undefined least severe range is normal. Range values are in calibrated engineering units. See FloatRangeType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AlarmRangesType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///A value of outside specifies that the most severe range is outside all the other ranges: -severe -critical -distress -warning -watch normal +watch +warning +distress +critical +severe.  This means each min, max pair are a range: (-inf, min) or (-inf, min], and [max, inf) or (max, inf).  However a value of inside "inverts" these bands: -normal -watch -warning -distress -critical severe +critical +distress +warning +watch, +normal.  This means each min, max pair form a range of (min, max) or [min, max) or (min, max] or [min, max]. The most common form used is "outside" and it is the default.  The set notation used defines parenthesis as exclusive and square brackets as inclusive.
    #[serde(default = "AlarmRangesType::default_range_form", rename = "@rangeForm")]
    pub range_form: RangeFormType,
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///A range of least concern. Considered to be below the most commonly used Warning level.
    #[serde(default, rename = "WatchRange")]
    pub watch_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern that represents the most commonly used minimum concern level for many software applications.
    #[serde(default, rename = "WarningRange")]
    pub warning_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern in between the most commonly used Warning and Critical levels.
    #[serde(default, rename = "DistressRange")]
    pub distress_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern that represents the most commonly used maximum concern level for many software applications.
    #[serde(default, rename = "CriticalRange")]
    pub critical_range: ::core::option::Option<FloatRangeType>,
    ///A range of highest concern. Considered to be above the most commonly used Critical level.
    #[serde(default, rename = "SevereRange")]
    pub severe_range: ::core::option::Option<FloatRangeType>,
}
impl AlarmRangesType {
    #[must_use]
    pub fn default_range_form() -> RangeFormType {
        RangeFormType::Outside
    }
}
///Defines a base schema type used to build up the other data type specific alarm types. The definition includes a count to go into alarm (minViolations - the counts to go out of alarm is the same), a condition style alarm and a custom alarm. See AlarmConditionType, CustomAlgorithmType, BinaryAlarmConditionType, BooleanAlarmType, BinaryContextAlarmType, EnumerationAlarmType, NumericAlarmType, StringAlarmType, TimeAlarmType, TimeAlarmConditionType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(default = "AlarmType::default_min_violations", rename = "@minViolations")]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(default = "AlarmType::default_min_conformance", rename = "@minConformance")]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "AlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<AlarmTypeContent>,
}
///Defines a base schema type used to build up the other data type specific alarm types. The definition includes a count to go into alarm (minViolations - the counts to go out of alarm is the same), a condition style alarm and a custom alarm. See AlarmConditionType, CustomAlgorithmType, BinaryAlarmConditionType, BooleanAlarmType, BinaryContextAlarmType, EnumerationAlarmType, NumericAlarmType, StringAlarmType, TimeAlarmType, TimeAlarmConditionType.
#[derive(Debug, Deserialize, Serialize)]
pub enum AlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
}
impl AlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///An unordered collection of algorithms
#[derive(Debug, Deserialize, Serialize)]
pub struct AlgorithmSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<AlgorithmSetTypeContent>,
}
///An unordered collection of algorithms
#[derive(Debug, Deserialize, Serialize)]
pub enum AlgorithmSetTypeContent {
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputOutputTriggerAlgorithmType),
    #[serde(rename = "MathAlgorithm")]
    MathAlgorithm(MathAlgorithmType),
}
///This optional element may be used to enter Pseudo or actual code for the algorithm.  The language for the algorithm is specified with the language attribute
#[derive(Debug, Deserialize, Serialize)]
pub struct AlgorithmTextType {
    #[serde(default = "AlgorithmTextType::default_language", rename = "@language")]
    pub language: super::xs::StringType,
    #[serde(default, rename = "$text")]
    pub content: super::xs::StringType,
}
impl AlgorithmTextType {
    #[must_use]
    pub fn default_language() -> super::xs::StringType {
        ::std::string::String::from("pseudo")
    }
}
///Contains an unordered collection of Alias elements to describe alternate names or IDs for this named item.
#[derive(Debug, Deserialize, Serialize)]
pub struct AliasSetType {
    ///An alternate name, ID number, and sometimes flight software variable name in the code for this item.
    #[serde(default, rename = "Alias")]
    pub alias: ::std::vec::Vec<AliasType>,
}
///Used to contain an alias (alternate) name or ID for the object.   For example, a parameter may have a mnemonic, an on-board id, and special IDs used by various ground software applications; all of these are alias's.  Some ground system processing equipment has some severe naming restrictions on parameters (e.g., names must less then 12 characters, single case or integral id's only); their alias's provide a means of capturing each name in a "nameSpace".  Note: the name is not reference-able (it cannot be used in a name reference substituting for the name of the item of interest).  See NameDescriptionType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AliasType {
    ///Aliases should be grouped together in a "namespace" so that they can be switched in and out of data extractions.  The namespace generally identifies the purpose of the alternate name, whether for software variable names, additional operator names, or whatever the purpose.
    #[serde(rename = "@nameSpace")]
    pub name_space: super::xs::StringType,
    ///The alternate name or ID to use.  The alias does not have the restrictions that apply to name attributes.  This is useful for capturing legacy identifiers for systems with unusual naming conventions.  It is also useful for capturing variable names in software, amongst other things.
    #[serde(rename = "@alias")]
    pub alias: super::xs::StringType,
}
///Describe an unordered collection of ancillary data.  AncillaryData elements capture platform/program/implementation specific data about the parent element object that is non-standard and would not fit into the schema.  See AncillaryDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AncillaryDataSetType {
    ///Optional list of AncillaryData elements associated with this item.
    #[serde(default, rename = "AncillaryData")]
    pub ancillary_data: ::std::vec::Vec<AncillaryDataType>,
}
///Use for any other data associated with a named item.  May be used to include administrative data (e.g., version, CM or tags) or potentially any MIME type.  Data may be included or given as an href.
#[derive(Debug, Deserialize, Serialize)]
pub struct AncillaryDataType {
    ///Identifier for this Ancillary Data characteristic, feature, or data.
    #[serde(rename = "@name")]
    pub name: super::xs::StringType,
    ///Optional text encoding method for the element text content of this element.  The default is "text/plain".
    #[serde(default = "AncillaryDataType::default_mime_type", rename = "@mimeType")]
    pub mime_type: super::xs::StringType,
    ///Optional Uniform Resource Identifier for this characteristic, feature, or data.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@href")]
    pub href: ::core::option::Option<super::xs::AnyUriType>,
    #[serde(default, rename = "$text")]
    pub content: super::xs::StringType,
}
impl AncillaryDataType {
    #[must_use]
    pub fn default_mime_type() -> super::xs::StringType {
        ::std::string::String::from("text/plain")
    }
}
///Identical to ANDedConditionsType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentAnDedConditionsType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentAnDedConditionsTypeContent>,
}
///Identical to ANDedConditionsType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentAnDedConditionsTypeContent {
    ///Condition elements describe a test similar to the Comparison element except that the arguments/parameters used have additional flexibility for the compare.
    #[serde(rename = "Condition")]
    Condition(ArgumentComparisonCheckType),
    ///This element describes tests similar to the ComparisonList element except that the arguments/parameters used are more flexible and the and/or for multiple checks can be specified.
    #[serde(rename = "ORedConditions")]
    ORedConditions(ArgumentORedConditionsType),
}
///A base schema type for describing an absolute time data type. Contains an absolute (to a known epoch) time.  Use the [ISO 8601] extended format CCYY-MM-DDThh:mm:ss where "CC" represents the century, "YY" the year, "MM" the month and "DD" the day, preceded by an optional leading "-" sign to indicate a negative number. If the sign is omitted, "+" is assumed. The letter "T" is the date/time separator and "hh", "mm", "ss" represent hour, minute and second respectively. Additional digits can be used to increase the precision of fractional seconds if desired i.e. the format ss.ss... with any number of digits after the decimal point is supported. See AbsoluteTimeParameterType and AbsoluteTimeArgumentType.  See AbsouteTimeParameterType, AbsoluteTimeArgumentType and BaseTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentAbsoluteTimeDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DateTimeType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///Identical to ArgumentRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentArgumentRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@argumentRef")]
    pub argument_ref: ExpandedNameReferenceNoPathType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Identical to ArrayParameterRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentArrayArgumentRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@argumentRef")]
    pub argument_ref: ExpandedNameReferenceNoPathType,
    #[serde(
        default = "ArgumentArrayArgumentRefEntryType::default_last_entry_for_this_array_instance",
        rename = "@lastEntryForThisArrayInstance"
    )]
    pub last_entry_for_this_array_instance: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::core::option::Option<ArgumentArrayArgumentRefEntryTypeContent>,
}
///Identical to ArrayParameterRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentArrayArgumentRefEntryTypeContent {
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///The dimension here if used for subsetting must be less than the ones in the type.  It's not a subset if its the same size.
    #[serde(rename = "DimensionList")]
    pub dimension_list: ArgumentDimensionListType,
}
impl ArgumentArrayArgumentRefEntryType {
    #[must_use]
    pub fn default_last_entry_for_this_array_instance() -> super::xs::BooleanType {
        false
    }
}
///Identical to ArrayParameterRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentArrayParameterRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(
        default = "ArgumentArrayParameterRefEntryType::default_last_entry_for_this_array_instance",
        rename = "@lastEntryForThisArrayInstance"
    )]
    pub last_entry_for_this_array_instance: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::core::option::Option<ArgumentArrayParameterRefEntryTypeContent>,
}
///Identical to ArrayParameterRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentArrayParameterRefEntryTypeContent {
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///The dimension here if used for subsetting must be less than the ones in the type.  It's not a subset if its the same size.
    #[serde(rename = "DimensionList")]
    pub dimension_list: DimensionListType,
}
impl ArgumentArrayParameterRefEntryType {
    #[must_use]
    pub fn default_last_entry_for_this_array_instance() -> super::xs::BooleanType {
        false
    }
}
///Argument Assignments specialize a MetaCommand or BlockMetaCommand when inheriting from another MetaCommand.  General argument values can be restricted to specific values to further specialize the MetaCommand.  Use it to "narrow" a MetaCommand from its base MetaCommand by specifying values of arguments for example, a power command may be narrowed to a "power on" command by assigning the value of an argument to "on".  See ArgumentAssignmentType and MetaCommandType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentAssignmentListType {
    ///Specialize this command definition when inheriting from a more general MetaCommand by restricting the specific values of otherwise general arguments.
    #[serde(default, rename = "ArgumentAssignment")]
    pub argument_assignment: ::std::vec::Vec<ArgumentAssignmentType>,
}
///Describe an assignment of an argument with a calibrated/engineering value. See ArgumentAssignmentListType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentAssignmentType {
    ///The named argument from the base MetaCommand to assign/restrict with a value.
    #[serde(rename = "@argumentName")]
    pub argument_name: ExpandedNameReferenceNoPathType,
    ///Specify value as a string compliant with the XML schema (xs) type specified for each XTCE type: integer=xs:integer; float=xs:double; string=xs:string; boolean=xs:boolean; binary=xs:hexBinary; enum=xs:string from EnumerationList; relative time=xs:duration; absolute time=xs:dateTime.  Supplied value must be within the ValidRange specified for the type.
    #[serde(rename = "@argumentValue")]
    pub argument_value: super::xs::StringType,
}
///Identical to BaseDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentBaseDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentBaseDataTypeContent>,
}
///Identical to BaseDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentBaseDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
}
///Identical to BaseTimeDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentBaseTimeDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///Identical to BinaryDataEncodingType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentBinaryDataEncodingType {
    ///Describes the bit ordering of the encoded value.
    #[serde(
        default = "ArgumentBinaryDataEncodingType::default_bit_order",
        rename = "@bitOrder"
    )]
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    #[serde(
        default = "ArgumentBinaryDataEncodingType::default_byte_order",
        rename = "@byteOrder"
    )]
    pub byte_order: ByteOrderType,
    ///DEPRECATED: Use the ErrorDetectCorrect element in the container elements instead.
    #[serde(default, rename = "ErrorDetectCorrect")]
    pub error_detect_correct: ::core::option::Option<ErrorDetectCorrectType>,
    ///Number of bits this value occupies on the stream being encoded/decoded.
    #[serde(rename = "SizeInBits")]
    pub size_in_bits: ArgumentIntegerValueType,
    ///Used to convert binary data to an application data type
    #[serde(default, rename = "FromBinaryTransformAlgorithm")]
    pub from_binary_transform_algorithm: ::core::option::Option<
        ArgumentInputAlgorithmType,
    >,
    ///Used to convert binary data from an application data type to binary data
    #[serde(default, rename = "ToBinaryTransformAlgorithm")]
    pub to_binary_transform_algorithm: ::core::option::Option<
        ArgumentInputAlgorithmType,
    >,
}
impl ArgumentBinaryDataEncodingType {
    #[must_use]
    pub fn default_bit_order() -> BitOrderType {
        BitOrderType::MostSignificantBitFirst
    }
    #[must_use]
    pub fn default_byte_order() -> ByteOrderType {
        ByteOrderType::MostSignificantByteFirst
    }
}
///Identical to BinaryDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentBinaryDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Extra bits are truncated from the MSB (leftmost).
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::HexBinaryType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentBinaryDataTypeContent>,
}
///Identical to BinaryDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentBinaryDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
}
///Identical to BooleanDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentBooleanDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Enumeration string representing the 1 value, with the default being 'True'.
    #[serde(
        default = "ArgumentBooleanDataType::default_one_string_value",
        rename = "@oneStringValue"
    )]
    pub one_string_value: super::xs::StringType,
    ///Enumeration string representing the 0 value, with the default being 'False'.
    #[serde(
        default = "ArgumentBooleanDataType::default_zero_string_value",
        rename = "@zeroStringValue"
    )]
    pub zero_string_value: super::xs::StringType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentBooleanDataTypeContent>,
}
///Identical to BooleanDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentBooleanDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
}
impl ArgumentBooleanDataType {
    #[must_use]
    pub fn default_one_string_value() -> super::xs::StringType {
        ::std::string::String::from("True")
    }
    #[must_use]
    pub fn default_zero_string_value() -> super::xs::StringType {
        ::std::string::String::from("False")
    }
}
///Identical to BooleanExpressionType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentBooleanExpressionType {
    ///Condition elements describe a test similar to the Comparison element except that the arguments/parameters used have additional flexibility.
    #[serde(rename = "Condition")]
    Condition(ArgumentComparisonCheckType),
    ///This element describes tests similar to the ComparisonList element except that the arguments/parameters used are more flexible.
    #[serde(rename = "ANDedConditions")]
    AnDedConditions(ArgumentAnDedConditionsType),
    ///This element describes tests similar to the ComparisonList element except that the arguments/parameters used are more flexible.
    #[serde(rename = "ORedConditions")]
    ORedConditions(ArgumentORedConditionsType),
}
///Identical to ComparisonCheckType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentComparisonCheckType {
    #[serde(rename = "$value")]
    pub content: [ArgumentComparisonCheckTypeContent; 3usize],
}
///Identical to ComparisonCheckType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentComparisonCheckTypeContent {
    ///Left hand side parameter instance.
    #[serde(rename = "ParameterInstanceRef")]
    ParameterInstanceRef(ParameterInstanceRefType),
    ///Left hand side argument instance.
    #[serde(rename = "ArgumentInstanceRef")]
    ArgumentInstanceRef(ArgumentInstanceRefType),
    ///Comparison operator.
    #[serde(rename = "ComparisonOperator")]
    ComparisonOperator(ComparisonOperatorsType),
    ///Specify as: integer data type using xs:integer, float data type using xs:double, string data type using xs:string, boolean data type using xs:boolean, binary data type using xs:hexBinary, enum data type using label name, relative time data type using xs:duration, absolute time data type using xs:dateTime.  Values must not exceed the characteristics for the data type or this is a validation error. Takes precedence over an initial value given in the data type. Values are calibrated unless there is an option to override it.
    #[serde(rename = "Value")]
    Value(super::xs::StringType),
}
///Identical to ComparisonListType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentComparisonListType {
    ///List of Comparison elements must all be true for the comparison to evaluate to true.
    #[serde(default, rename = "Comparison")]
    pub comparison: ::std::vec::Vec<ArgumentComparisonType>,
}
///Identical to ComparisonType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentComparisonType {
    ///Comparison operator to use with equality being the common default.
    #[serde(
        default = "ArgumentComparisonType::default_comparison_operator",
        rename = "@comparisonOperator"
    )]
    pub comparison_operator: ComparisonOperatorsType,
    ///Specify as: integer data type using xs:integer, float data type using xs:double, string data type using xs:string, boolean data type using xs:boolean, binary data type using xs:hexBinary, enum data type using label name, relative time data type using xs:duration, absolute time data type using xs:dateTime.  Values must not exceed the characteristics for the data type or this is a validation error. Takes precedence over an initial value given in the data type. Values are calibrated unless there is an option to override it.
    #[serde(rename = "@value")]
    pub value: super::xs::StringType,
    #[serde(rename = "$value")]
    pub content: ArgumentComparisonTypeContent,
}
///Identical to ComparisonType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentComparisonTypeContent {
    ///This parameter instance is being compared to the value in the parent element using the comparison defined there also.
    #[serde(rename = "ParameterInstanceRef")]
    ParameterInstanceRef(ParameterInstanceRefType),
    ///This argument instance is being compared to the value in the parent element using the comparison defined there also.
    #[serde(rename = "ArgumentInstanceRef")]
    ArgumentInstanceRef(ArgumentInstanceRefType),
}
impl ArgumentComparisonType {
    #[must_use]
    pub fn default_comparison_operator() -> ComparisonOperatorsType {
        ComparisonOperatorsType::Eq
    }
}
///Identical to ContainerRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentContainerRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@containerRef")]
    pub container_ref: NameReferenceWithPathType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Identical to ContainerSegmentRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentContainerSegmentRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@containerRef")]
    pub container_ref: NameReferenceWithPathType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@order")]
    pub order: ::core::option::Option<PositiveLongType>,
    #[serde(rename = "@sizeInBits")]
    pub size_in_bits: PositiveLongType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Identical to DimensionListType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentDimensionListType {
    #[serde(default, rename = "Dimension")]
    pub dimension: ::std::vec::Vec<ArgumentDimensionType>,
}
///Identical to DimensionType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentDimensionType {
    ///zero based index
    #[serde(rename = "StartingIndex")]
    pub starting_index: ArgumentIntegerValueType,
    #[serde(rename = "EndingIndex")]
    pub ending_index: ArgumentIntegerValueType,
}
///Identical to DiscreteLookupListType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentDiscreteLookupListType {
    ///In the event that no lookup condition evaluates to true, then this value will be used.
    #[serde(rename = "@defaultValue")]
    pub default_value: super::xs::LongType,
    ///Describe a lookup condition set using discrete values from arguments and/or parameters.
    #[serde(default, rename = "DiscreteLookup")]
    pub discrete_lookup: ::std::vec::Vec<ArgumentDiscreteLookupType>,
}
///Identical to ArgumentDiscreteLookupType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentDiscreteLookupType {
    ///Value to use when the lookup conditions are true.
    #[serde(rename = "@value")]
    pub value: super::xs::LongType,
    #[serde(rename = "$value")]
    pub content: ArgumentDiscreteLookupTypeContent,
}
///Identical to ArgumentDiscreteLookupType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentDiscreteLookupTypeContent {
    ///A simple comparison check involving a single test of an argument or parameter value.
    #[serde(rename = "Comparison")]
    Comparison(ArgumentComparisonType),
    ///A series of simple comparison checks with an implicit 'and' in that they all must be true for the overall condition to be true.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ArgumentComparisonListType),
    ///An arbitrarily complex boolean expression that has additional flexibility on the terms beyond the Comparison and ComparisonList elements.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(ArgumentBooleanExpressionType),
    ///An escape to an externally defined algorithm.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(ArgumentInputAlgorithmType),
}
///Identical to DynamicValueType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentDynamicValueType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentDynamicValueTypeContent>,
}
///Identical to DynamicValueType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentDynamicValueTypeContent {
    ///Retrieve the value by referencing the value of an Argument.
    #[serde(rename = "ArgumentInstanceRef")]
    ArgumentInstanceRef(ArgumentInstanceRefType),
    ///Retrieve the value by referencing the value of a Parameter.
    #[serde(rename = "ParameterInstanceRef")]
    ParameterInstanceRef(ParameterInstanceRefType),
    ///A slope and intercept may be applied to scale or shift the value selected from the argument or parameter.
    #[serde(rename = "LinearAdjustment")]
    LinearAdjustment(LinearAdjustmentType),
}
///Identical to EnumeratedDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentEnumeratedDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Use the label, it must be in the enumeration list to be valid.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentEnumeratedDataTypeContent>,
}
///Identical to EnumeratedDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentEnumeratedDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
    ///Unordered list of label/value pairs where values cannot be duplicated.
    #[serde(rename = "EnumerationList")]
    EnumerationList(EnumerationListType),
}
///Identical to FixedValueEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentFixedValueEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///An optional name for the fixed/constant field in the sequence.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///The fixed/constant value that should be encoded into the sequence.  This value provided should have sufficient bit length to accomodate the size in bits.  If the value is larger, the most significant unnecessary bits are dropped.  The value provided should be in network byte order for encoding.
    #[serde(rename = "@binaryValue")]
    pub binary_value: super::xs::HexBinaryType,
    ///The number of bits that this fixed/constant value should occupy in the sequence.
    #[serde(rename = "@sizeInBits")]
    pub size_in_bits: PositiveLongType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Identical to FloatDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentFloatDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DoubleType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally.  Generally this can be determined by examination of the space required to capture the full range of the encoding, but it is not always clear when calibrators are in use.  A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible values.
    #[serde(
        default = "ArgumentFloatDataType::default_size_in_bits",
        rename = "@sizeInBits"
    )]
    pub size_in_bits: FloatSizeInBitsType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentFloatDataTypeContent>,
}
///Identical to FloatDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentFloatDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
    ///This element provides the implementation with assistance rendering the value as a string for users.
    #[serde(rename = "ToString")]
    ToString(ToStringType),
}
impl ArgumentFloatDataType {
    #[must_use]
    pub fn default_size_in_bits() -> FloatSizeInBitsType {
        FloatSizeInBitsType::_32
    }
}
///Identical to IndirectParameterRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentIndirectParameterRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@aliasNameSpace")]
    pub alias_name_space: ::core::option::Option<super::xs::StringType>,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(rename = "ParameterInstance")]
    pub parameter_instance: ParameterInstanceRefType,
}
///Identical to InputAlgorithmType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentInputAlgorithmType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "AlgorithmText")]
    pub algorithm_text: ::core::option::Option<AlgorithmTextType>,
    #[serde(default, rename = "ExternalAlgorithmSet")]
    pub external_algorithm_set: ::core::option::Option<ExternalAlgorithmSetType>,
    ///The InputSet describes the list of arguments and/or parameters that should be made available as input arguments to the algorithm.
    #[serde(default, rename = "InputSet")]
    pub input_set: ::core::option::Option<ArgumentInputSetType>,
}
///Identical to InputSetType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentInputSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentInputSetTypeContent>,
}
///Identical to InputSetType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentInputSetTypeContent {
    ///Reference a parameter to serve as an input to the algorithm.
    #[serde(rename = "InputParameterInstanceRef")]
    InputParameterInstanceRef(InputParameterInstanceRefType),
    ///Reference an argument to serve as an input to the algorithm.
    #[serde(rename = "InputArgumentInstanceRef")]
    InputArgumentInstanceRef(ArgumentInstanceRefType),
    ///Supply a local constant name and value to input to this algorithm.
    #[serde(rename = "Constant")]
    Constant(ConstantType),
}
///An argument instance is the name of an argument as the reference is always resolved locally to the metacommand.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentInstanceRefType {
    ///Give the name of the argument.  There is no path, this is a local reference.
    #[serde(rename = "@argumentRef")]
    pub argument_ref: ExpandedNameReferenceNoPathType,
    ///Typically the calibrated/engineering value is used and that is the default.
    #[serde(
        default = "ArgumentInstanceRefType::default_use_calibrated_value",
        rename = "@useCalibratedValue"
    )]
    pub use_calibrated_value: super::xs::BooleanType,
}
impl ArgumentInstanceRefType {
    #[must_use]
    pub fn default_use_calibrated_value() -> super::xs::BooleanType {
        true
    }
}
///Identical to IntegerDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentIntegerDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Specify the value as a base 10 integer.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::LongType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally.  Generally this can be determined by examination of the space required to capture the full range of the encoding, but it is not always clear when calibrators are in use.  A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible values.
    #[serde(
        default = "ArgumentIntegerDataType::default_size_in_bits",
        rename = "@sizeInBits"
    )]
    pub size_in_bits: PositiveLongType,
    ///Flag indicating if the engineering/calibrated data type used should support signed representation.  This should not be confused with the encoding type for the raw value.  The default is true.
    #[serde(default = "ArgumentIntegerDataType::default_signed", rename = "@signed")]
    pub signed: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentIntegerDataTypeContent>,
}
///Identical to IntegerDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentIntegerDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
    ///This element provides the implementation with assistance rendering the value as a string for users.
    #[serde(rename = "ToString")]
    ToString(ToStringType),
}
impl ArgumentIntegerDataType {
    #[must_use]
    pub fn default_size_in_bits() -> PositiveLongType {
        32i64
    }
    #[must_use]
    pub fn default_signed() -> super::xs::BooleanType {
        true
    }
}
///Identical to IntegerValueType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentIntegerValueType {
    ///Use a fixed integer value.
    #[serde(rename = "FixedValue")]
    FixedValue(super::xs::LongType),
    ///Determine the value by interrogating an instance of an argument or parameter.
    #[serde(rename = "DynamicValue")]
    DynamicValue(ArgumentDynamicValueType),
    ///Determine the value by interrogating an instance of an argument or parameter and selecting a specified value based on tests of the value of that argument or parameter.
    #[serde(rename = "DiscreteLookupList")]
    DiscreteLookupList(ArgumentDiscreteLookupListType),
}
///Defines a list of Arguments for a command definition.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentListType {
    ///Defines an Argument for a command definition.  Arguments are local to the MetaCommand, BlockMetaCommand, and those that inherit from the definition.
    #[serde(default, rename = "Argument")]
    pub argument: ::std::vec::Vec<ArgumentType>,
}
///Identical to LocationInContainerInBitsType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentLocationInContainerInBitsType {
    #[serde(
        default = "ArgumentLocationInContainerInBitsType::default_reference_location",
        rename = "@referenceLocation"
    )]
    pub reference_location: ReferenceLocationType,
    #[serde(rename = "$value")]
    pub content: ArgumentLocationInContainerInBitsTypeContent,
}
///Identical to LocationInContainerInBitsType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentLocationInContainerInBitsTypeContent {
    ///Use a fixed integer value.
    #[serde(rename = "FixedValue")]
    FixedValue(super::xs::LongType),
    ///Determine the value by interrogating an instance of an argument or parameter.
    #[serde(rename = "DynamicValue")]
    DynamicValue(ArgumentDynamicValueType),
    ///Determine the value by interrogating an instance of an argument or parameter and selecting a specified value based on tests of the value of that argument or parameter.
    #[serde(rename = "DiscreteLookupList")]
    DiscreteLookupList(ArgumentDiscreteLookupListType),
}
impl ArgumentLocationInContainerInBitsType {
    #[must_use]
    pub fn default_reference_location() -> ReferenceLocationType {
        ReferenceLocationType::PreviousEntry
    }
}
///Identical to MatchCriteriaType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentMatchCriteriaType {
    ///A simple comparison check involving a single test of an argument or parameter value.
    #[serde(rename = "Comparison")]
    Comparison(ArgumentComparisonType),
    ///A series of simple comparison checks with an implicit 'and' in that they all must be true for the overall condition to be true.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ArgumentComparisonListType),
    ///An arbitrarily complex boolean expression that has additional flexibility on the terms beyond the Comparison and ComparisonList elements.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(ArgumentBooleanExpressionType),
    ///An escape to an externally defined algorithm.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(ArgumentInputAlgorithmType),
}
///Describe a value to set to a destination Parameter after completion of a commanding lifecycle step.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentMathOperationType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentMathOperationTypeContent>,
}
///Describe a value to set to a destination Parameter after completion of a commanding lifecycle step.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentMathOperationTypeContent {
    ///Use a constant in the calculation.
    #[serde(rename = "ValueOperand")]
    ValueOperand(super::xs::StringType),
    ///Use the value of the target parameter in the calculation. It is the calibrated/engineering value only.  If the raw value is needed, specify it explicitly using ParameterInstanceRefOperand. Note this element has no content.
    #[serde(rename = "ThisParameterOperand")]
    ThisParameterOperand(super::xs::StringType),
    ///All operators utilize operands on the top values in the stack and leaving the result on the top of the stack.  Ternary operators utilize the top three operands on the stack, binary operators utilize the top two operands on the stack, and unary operators use the top operand on the stack.
    #[serde(rename = "Operator")]
    Operator(MathOperatorsType),
    ///This element is used to reference the last received/assigned value of any Parameter in this math operation.
    #[serde(rename = "ParameterInstanceRefOperand")]
    ParameterInstanceRefOperand(ParameterInstanceRefType),
    ///This element is used to reference a value of any Argument from this command instance in this math operation.
    #[serde(rename = "ArgumentInstanceRefOperand")]
    ArgumentInstanceRefOperand(ArgumentInstanceRefType),
}
///Identical to ORedConditionsType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentORedConditionsType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentORedConditionsTypeContent>,
}
///Identical to ORedConditionsType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentORedConditionsTypeContent {
    ///Condition elements describe a test similar to the Comparison element except that the arguments/parameters used have additional flexibility for the compare.
    #[serde(rename = "Condition")]
    Condition(ArgumentComparisonCheckType),
    ///This element describes tests similar to the ComparisonList element except that the arguments/parameters used are more flexible and the and/or for multiple checks can be specified.
    #[serde(rename = "ANDedConditions")]
    AnDedConditions(ArgumentAnDedConditionsType),
}
///Identical to ParameterRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentParameterRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Identical to ParameterSegmentRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentParameterSegmentRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@order")]
    pub order: ::core::option::Option<PositiveLongType>,
    #[serde(rename = "@sizeInBits")]
    pub size_in_bits: PositiveLongType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Used to contain a relative time value.  Used to describe a relative time.  Normally used for time offsets.  A Relative time is expressed as PnYn MnDTnH nMnS, where nY represents the number of years, nM the number of months, nD the number of days, 'T' is the date/time separator, nH the number of hours, nM the number of minutes and nS the number of seconds. The number of seconds can include decimal digits to arbitrary precision.  For example, to indicate a duration of 1 year, 2 months, 3 days, 10 hours, and 30 minutes, one would write: P1Y2M3DT10H30M. One could also indicate a duration of minus 120 days as: -P120D.  An extension of Schema duration type.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentRelativeTimeDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DurationType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///Identical to RepeatType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentRepeatType {
    ///Value (either fixed or dynamic) that contains the count of repeated structures.
    #[serde(rename = "Count")]
    pub count: ArgumentIntegerValueType,
    #[serde(default, rename = "Offset")]
    pub offset: ::core::option::Option<ArgumentIntegerValueType>,
}
///Defines a list of argument values that restrict a constraint from being realized in the commanding lifecycle.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentRestrictionListType {
    ///Specifies an argument value that causes this constraint to be realized.
    #[serde(default, rename = "ArgumentRestriction")]
    pub argument_restriction: ::std::vec::Vec<ArgumentAssignmentType>,
}
///Identical to a SequenceEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentSequenceEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Identical to StreamRefEntryType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentStreamSegmentEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@streamRef")]
    pub stream_ref: NameReferenceWithPathType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@order")]
    pub order: ::core::option::Option<PositiveLongType>,
    #[serde(rename = "@sizeInBits")]
    pub size_in_bits: PositiveLongType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        ArgumentLocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<ArgumentRepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<ArgumentMatchCriteriaType>,
    ///Ancillary data associated with this entry.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Identical to StringDataEncodingType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentStringDataEncodingType {
    ///Describes the bit ordering of the encoded value.
    #[serde(
        default = "ArgumentStringDataEncodingType::default_bit_order",
        rename = "@bitOrder"
    )]
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    #[serde(
        default = "ArgumentStringDataEncodingType::default_byte_order",
        rename = "@byteOrder"
    )]
    pub byte_order: ByteOrderType,
    ///The character set encoding of this string data type.
    #[serde(
        default = "ArgumentStringDataEncodingType::default_encoding",
        rename = "@encoding"
    )]
    pub encoding: StringEncodingType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentStringDataEncodingTypeContent>,
}
///Identical to StringDataEncodingType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentStringDataEncodingTypeContent {
    ///DEPRECATED: Use the ErrorDetectCorrect element in the container elements instead.
    #[serde(rename = "ErrorDetectCorrect")]
    ErrorDetectCorrect(ErrorDetectCorrectType),
    ///Static length strings do not change in overall length between samples.   They may terminate before the end of their buffer using a terminating character, or by various lookups, or calculations.  But they have a maximum fixed size, and the data itself is always within that maximum size.
    #[serde(rename = "SizeInBits")]
    SizeInBits(SizeInBitsType),
    ///Variable length strings are those where the space occupied in a container can vary.  If the string has variable content but occupies the same amount of space when encoded should use the SizeInBits element.  Specification of a variable length string needs to consider that the implementation needs to allocate space to store the string.  Specify the maximum possible length of the string data type for memory purposes and also specify the bit size of the string to use in containers with the dynamic elements.
    #[serde(rename = "Variable")]
    Variable(ArgumentVariableStringType),
}
impl ArgumentStringDataEncodingType {
    #[must_use]
    pub fn default_bit_order() -> BitOrderType {
        BitOrderType::MostSignificantBitFirst
    }
    #[must_use]
    pub fn default_byte_order() -> ByteOrderType {
        ByteOrderType::MostSignificantByteFirst
    }
    #[must_use]
    pub fn default_encoding() -> StringEncodingType {
        StringEncodingType::Utf8
    }
}
///Identical to StringDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentStringDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Initial values for string types, may include C language style (\n, \t, \", \\, etc.) escape sequences.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///restriction pattern is a regular expression
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@restrictionPattern")]
    pub restriction_pattern: ::core::option::Option<super::xs::StringType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally. Generally this can be determined by examination of the encoding information for the string, but it is not always clear, so this attribute allows the extra hint when needed. A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible characters.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@characterWidth")]
    pub character_width: ::core::option::Option<CharacterWidthType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentStringDataTypeContent>,
}
///Identical to StringDataType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentStringDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
    #[serde(rename = "SizeRangeInCharacters")]
    SizeRangeInCharacters(IntegerRangeType),
}
///An Argument has a name and can take on values with the underlying value type described by the ArgumentTypeRef. Describe the properties of a command argument referring to a data type (argument type). The bulk of properties associated with a command argument are in its argument type. The initial value specified here, overrides the initial value in the argument type. See BaseDataType, BaseTimeDataType and NameReferenceType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Specify the reference to the argument type from the ArgumentTypeSet area using the path reference rules, either local to this SpaceSystem, relative, or absolute.
    #[serde(rename = "@argumentTypeRef")]
    pub argument_type_ref: NameReferenceWithPathType,
    ///Specify as: integer data type using xs:integer, float data type using xs:double, string data type using xs:string, boolean data type using xs:boolean, binary data type using xs:hexBinary, enum data type using label name, relative time data type using xs:duration, absolute time data type using xs:dateTime, arrays using JSON syntax (e.g. '[1, 3, 4]', and aggregates using JSON syntax '{"member1": 1, "member2": "foo"}' ). Values must not exceed the characteristics for the data type or this is a validation error. Takes precedence over an initial value given in the data type. Values are calibrated unless there is an option to override it.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Describe an unordered collection of argument type definitions.  These types named for the engineering/calibrated type of the argument.  See BaseDataType and BaseTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentTypeSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentTypeSetTypeContent>,
}
///Describe an unordered collection of argument type definitions.  These types named for the engineering/calibrated type of the argument.  See BaseDataType and BaseTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentTypeSetTypeContent {
    ///Describe an argument type that has an engineering/calibrated value in the form of a character string.
    #[serde(rename = "StringArgumentType")]
    StringArgumentType(StringArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of an enumeration.
    #[serde(rename = "EnumeratedArgumentType")]
    EnumeratedArgumentType(EnumeratedArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of an integer.
    #[serde(rename = "IntegerArgumentType")]
    IntegerArgumentType(IntegerArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of a binary (usually hex represented).
    #[serde(rename = "BinaryArgumentType")]
    BinaryArgumentType(BinaryArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of a decimal.
    #[serde(rename = "FloatArgumentType")]
    FloatArgumentType(FloatArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of a boolean enumeration.
    #[serde(rename = "BooleanArgumentType")]
    BooleanArgumentType(BooleanArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of a duration in time.
    #[serde(rename = "RelativeTimeArgumentType")]
    RelativeTimeArgumentType(RelativeTimeArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of an instant in time.
    #[serde(rename = "AbsoluteTimeArgumentType")]
    AbsoluteTimeArgumentType(AbsoluteTimeArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of an array of a primitive type.
    #[serde(rename = "ArrayArgumentType")]
    ArrayArgumentType(ArrayArgumentType),
    ///Describe an argument type that has an engineering/calibrated value in the form of a structure of arguments of other types.
    #[serde(rename = "AggregateArgumentType")]
    AggregateArgumentType(AggregateArgumentType),
}
///Identical to VariableStringType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArgumentVariableStringType {
    ///The upper bound of the size of this string data type so that the implementation can reserve/allocate enough memory to capture all reported instances of the string.
    #[serde(rename = "@maxSizeInBits")]
    pub max_size_in_bits: PositiveLongType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ArgumentVariableStringTypeContent>,
}
///Identical to VariableStringType but supports argument instance references.
#[derive(Debug, Deserialize, Serialize)]
pub enum ArgumentVariableStringTypeContent {
    ///Determine the container size in bits by interrogating an instance of a parameter or argument.
    #[serde(rename = "DynamicValue")]
    DynamicValue(ArgumentDynamicValueType),
    ///Determine the container size in bits by interrogating an instance of a parameter or argument and selecting a specified value based on tests of the value of that parameter or argument.
    #[serde(rename = "DiscreteLookupList")]
    DiscreteLookupList(ArgumentDiscreteLookupListType),
    ///In some string implementations, the size of the string contents (not the memory allocation size) is determined by a leading numeric value.  This is sometimes referred to as Pascal strings.  If a LeadingSize is specified, then the TerminationChar element does not have a functional meaning.
    #[serde(rename = "LeadingSize")]
    LeadingSize(LeadingSizeType),
    ///The termination character that represents the end of the string contents.  For C and most strings, this is null (00), which is the default.
    #[serde(rename = "TerminationChar")]
    TerminationChar(super::xs::HexBinaryType),
}
///Describe an array argument type.  The size and number of dimension are described here. See ArrayParameterRefEntryType, NameReferenceType and ArrayDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArrayArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Reference to the data type that represents the type of the elements for this array.
    #[serde(rename = "@arrayTypeRef")]
    pub array_type_ref: NameReferenceWithPathType,
    ///Initial values for the individual elements of the array may be provided here at the type definition using JSON style array notation (e.g. [1, 2, 3]).  It may be multi-dimension, in which case the sequence matches the sequence of the Dimension elements in the DimensionList.  When provided here, the initialValue attributes in the type definition specified in attribute arrayTypeRef are ignored.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describe the dimensions of this array.
    #[serde(rename = "DimensionList")]
    pub dimension_list: ArgumentDimensionListType,
}
///A base schema type for describing an array data type.  The number of and size of each dimension is defined in its two child types. See NameReferenceType, ArrayArgumentType and ArrayParameterType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArrayDataTypeType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Reference to the data type that represents the type of the elements for this array.
    #[serde(rename = "@arrayTypeRef")]
    pub array_type_ref: NameReferenceWithPathType,
    ///Initial values for the individual elements of the array may be provided here at the type definition using JSON style array notation (e.g. [1, 2, 3]).  It may be multi-dimension, in which case the sequence matches the sequence of the Dimension elements in the DimensionList.  When provided here, the initialValue attributes in the type definition specified in attribute arrayTypeRef are ignored.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Describe an entry that is an array parameter. Specify the dimension sizes if you subsetting the array (the number of dimensions shall match the number defined in the parameter's type definition), otherwise the ones in the ParameterType are assumed.  See SequenceEntryType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArrayParameterRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(default, rename = "$value")]
    pub content: ::core::option::Option<ArrayParameterRefEntryTypeContent>,
}
///Describe an entry that is an array parameter. Specify the dimension sizes if you subsetting the array (the number of dimensions shall match the number defined in the parameter's type definition), otherwise the ones in the ParameterType are assumed.  See SequenceEntryType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArrayParameterRefEntryTypeContent {
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        LocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<RepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<MatchCriteriaType>,
    ///Optional timing information associated with this entry.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
    ///Optional ancillary data associated with this element.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///The dimension here if used for subsetting must be less than the ones in the type.  It's not a subset if its the same size.
    #[serde(rename = "DimensionList")]
    pub dimension_list: DimensionListType,
}
///Describe an array parameter type.  The size and number of dimensions are described here. See ArrayParameterRefEntryType, NameReferenceType and ArrayDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ArrayParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Reference to the data type that represents the type of the elements for this array.
    #[serde(rename = "@arrayTypeRef")]
    pub array_type_ref: NameReferenceWithPathType,
    ///Initial values for the individual elements of the array may be provided here at the type definition using JSON style array notation (e.g. [1, 2, 3]).  It may be multi-dimension, in which case the sequence matches the sequence of the Dimension elements in the DimensionList.  When provided here, the initialValue attributes in the type definition specified in attribute arrayTypeRef are ignored.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describe the dimensions of this array.
    #[serde(rename = "DimensionList")]
    pub dimension_list: DimensionListType,
}
///Describe an unordered collection of authors.  See AuthorType.
#[derive(Debug, Deserialize, Serialize)]
pub struct AuthorSetType {
    ///Contains information about an author, maintainer, or data source regarding this document.
    #[serde(default, rename = "Author")]
    pub author: ::std::vec::Vec<AuthorType>,
}
///Type definition that describes the format of the contents of the Author element.
pub type AuthorType = ::std::string::String;
///After searching for the frame sync marker for some number of bits, it may be desirable to invert the incoming data, and then look for frame sync.  In some cases this will require an external algorithm
#[derive(Debug, Deserialize, Serialize)]
pub struct AutoInvertType {
    #[serde(
        default = "AutoInvertType::default_bad_frames_to_auto_invert",
        rename = "@badFramesToAutoInvert"
    )]
    pub bad_frames_to_auto_invert: PositiveLongType,
    #[serde(default, rename = "InvertAlgorithm")]
    pub invert_algorithm: ::core::option::Option<InputAlgorithmType>,
}
impl AutoInvertType {
    #[must_use]
    pub fn default_bad_frames_to_auto_invert() -> PositiveLongType {
        1024i64
    }
}
///Supplies an optional non-reference-able name and short description for alarms. Also includes an optional ancillary data for any special local flags, note that these may not necessarily transfer to another recipient of an instance document.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Supplies an optional non-reference-able name and short description for calibrators.  Also includes an optional ancillary data for any special local flags, note that these may not necessarily transfer to another recipient of an instance document.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseCalibratorType {
    ///Optional name for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///Optional description for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional additional ancillary information for this calibrator/algorithm
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///A base type for comparison related elements that improves the mapping produced by data binding tools.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseComparisonType;
///A base type for boolean expression related elements that improves the mapping produced by data binding tools.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseConditionsType;
///Describe a child/parent container inheritance relationship.  Describe constraints with RestrictionCriteria, conditions that must be true for this container to be an extension of the parent container.  A constraint can be used to convey the identifying features of the telemetry format such as the CCSDS application id or minor-frame id.  See RestrictionCriteriaType and SequenceContainerType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseContainerType {
    ///Reference to the container that this container extends.
    #[serde(rename = "@containerRef")]
    pub container_ref: NameReferenceWithPathType,
    ///Contains the conditions that must evaluate to true in order for this container to be an extension of the parent container.
    #[serde(default, rename = "RestrictionCriteria")]
    pub restriction_criteria: ::core::option::Option<RestrictionCriteriaType>,
}
///An abstract schema type used by within the schema to derive the other simple/primitive engineering form data types:  BooleanDataType, BinaryDataType, StringDataType, EnumeratedDataType, FloatDataType and IntegerDataType.  The encoding elements are optional because they describe the raw wire encoded form of the data type.  Encoding is only necessary when the type is telemetered in some form.  Local variables and derived typically do not require encoding.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BaseDataTypeContent>,
}
///An abstract schema type used by within the schema to derive the other simple/primitive engineering form data types:  BooleanDataType, BinaryDataType, StringDataType, EnumeratedDataType, FloatDataType and IntegerDataType.  The encoding elements are optional because they describe the raw wire encoded form of the data type.  Encoding is only necessary when the type is telemetered in some form.  Local variables and derived typically do not require encoding.
#[derive(Debug, Deserialize, Serialize)]
pub enum BaseDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
}
///When specified, a BaseMetaCommand element identifies that this MetaCommand inherits (extends) another MetaCommand.  It's required ArgumentAssignmentList narrows or this command from the parent.  This is typically used when specializing a generic MetaCommand to a specific MetaCommand.  See MetaCommandType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseMetaCommandType {
    ///Reference to the MetaCommand definition that this MetaCommand extends.
    #[serde(rename = "@metaCommandRef")]
    pub meta_command_ref: NameReferenceWithPathType,
    ///Argument Assignments specialize a MetaCommand or BlockMetaCommand when inheriting from another MetaCommand.  General argument values can be restricted to specific values to further specialize the MetaCommand.
    #[serde(default, rename = "ArgumentAssignmentList")]
    pub argument_assignment_list: ::core::option::Option<ArgumentAssignmentListType>,
}
///An abstract schema type used within the schema to derive other time based data types: RelativeTimeDataType and AbsoluteTimeDataType.  An absolute time data type is a telemetered source/destination data type.  A data encoding must be set.  An optional epoch may be set.  Time types are an exception to other primitives because, if the time data type is not telemetered, it still must have a data encoding set.  See DataEncodingType, AbsoluteTimeDataType and RelativeTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseTimeDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///A base type for the various triggers, purely to improve the mappings created by data binding compilers.
#[derive(Debug, Deserialize, Serialize)]
pub struct BaseTriggerType;
///Defines to type of update rates: perSecond and perContainerUpdate.  See RateInStreamType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BasisType {
    #[serde(rename = "perSecond")]
    PerSecond,
    #[serde(rename = "perContainerUpdate")]
    PerContainerUpdate,
}
///Describe alarm conditions specific to the binary data type, extends the basic AlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BinaryAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "BinaryAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "BinaryAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "BinaryAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BinaryAlarmTypeContent>,
}
///Describe alarm conditions specific to the binary data type, extends the basic AlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BinaryAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
}
impl BinaryAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///Defines a binary engineering/calibrated argument type (often called "blob type"). The binary data may be of fixed or variable length, and has an optional encoding and decoding algorithm that may be defined to transform the data between space and ground.  See BinaryDataEncodingType, IntegerValueType, InputAlgorithmType, and BinaryDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BinaryArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Extra bits are truncated from the MSB (leftmost).
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::HexBinaryType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BinaryArgumentTypeContent>,
}
///Defines a binary engineering/calibrated argument type (often called "blob type"). The binary data may be of fixed or variable length, and has an optional encoding and decoding algorithm that may be defined to transform the data between space and ground.  See BinaryDataEncodingType, IntegerValueType, InputAlgorithmType, and BinaryDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BinaryArgumentTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
}
///Describe an ordered collection of context binary alarms, duplicates are valid.  Process the contexts in list order.  See BinaryContextAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BinaryContextAlarmListType {
    ///A Context contains a new alarm definition and a context match.  The match takes precedence over any default alarm when the first in the overall list evaluates to true.  It is also possible the alarm definition is empty, in which case the context means no alarm defined when the match is true.
    #[serde(default, rename = "ContextAlarm")]
    pub context_alarm: ::std::vec::Vec<BinaryContextAlarmType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct BinaryContextAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "BinaryContextAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "BinaryContextAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "BinaryContextAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<BinaryContextAlarmTypeContent>,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum BinaryContextAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    #[serde(rename = "ContextMatch")]
    ContextMatch(ContextMatchType),
}
impl BinaryContextAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///Describe binary data that is unmolested in the decoding/encoding or cannot be represented in any of the other data encoding formats.  Optionally use the FromBinaryTransformAlgorithm and ToBinaryTransformAlgorithm element to describe the transformation process.  See InputAlgorithmType for the transformation structure.
#[derive(Debug, Deserialize, Serialize)]
pub struct BinaryDataEncodingType {
    ///Describes the bit ordering of the encoded value.
    #[serde(default = "BinaryDataEncodingType::default_bit_order", rename = "@bitOrder")]
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    #[serde(
        default = "BinaryDataEncodingType::default_byte_order",
        rename = "@byteOrder"
    )]
    pub byte_order: ByteOrderType,
    ///DEPRECATED: Use the ErrorDetectCorrect element in the container elements instead.
    #[serde(default, rename = "ErrorDetectCorrect")]
    pub error_detect_correct: ::core::option::Option<ErrorDetectCorrectType>,
    ///Number of bits this value occupies on the stream being encoded/decoded.
    #[serde(rename = "SizeInBits")]
    pub size_in_bits: IntegerValueType,
    ///Used to convert binary data to an application data type
    #[serde(default, rename = "FromBinaryTransformAlgorithm")]
    pub from_binary_transform_algorithm: ::core::option::Option<InputAlgorithmType>,
    ///Used to convert binary data from an application data type to binary data
    #[serde(default, rename = "ToBinaryTransformAlgorithm")]
    pub to_binary_transform_algorithm: ::core::option::Option<InputAlgorithmType>,
}
impl BinaryDataEncodingType {
    #[must_use]
    pub fn default_bit_order() -> BitOrderType {
        BitOrderType::MostSignificantBitFirst
    }
    #[must_use]
    pub fn default_byte_order() -> ByteOrderType {
        ByteOrderType::MostSignificantByteFirst
    }
}
///A base schema type for describing a binary data engineering/calibrated type (often called "blob type"). The binary data may be of fixed or variable length, and has an optional encoding and decoding algorithm that may be defined to transform the data between space and ground.  See BaseDataType, BinaryParameterType and BinaryArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BinaryDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Extra bits are truncated from the MSB (leftmost).
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::HexBinaryType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BinaryDataTypeContent>,
}
///A base schema type for describing a binary data engineering/calibrated type (often called "blob type"). The binary data may be of fixed or variable length, and has an optional encoding and decoding algorithm that may be defined to transform the data between space and ground.  See BaseDataType, BinaryParameterType and BinaryArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BinaryDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
}
///Describe a binary engineering/calibrated parameter type (sometimes called a "blob type"). It may be of fixed or variable length, and has an optional encoding and decoding algorithm that may be defined to transform the data between space and ground.  See BinaryDataEncodingType, IntegerValueType, InputAlgorithmType and BinaryDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BinaryParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Extra bits are truncated from the MSB (leftmost).
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::HexBinaryType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BinaryParameterTypeContent>,
}
///Describe a binary engineering/calibrated parameter type (sometimes called a "blob type"). It may be of fixed or variable length, and has an optional encoding and decoding algorithm that may be defined to transform the data between space and ground.  See BinaryDataEncodingType, IntegerValueType, InputAlgorithmType and BinaryDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BinaryParameterTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///Optionally describe an alarm monitoring specification that is effective whenever a contextual alarm definition does not take precedence.
    #[serde(rename = "DefaultAlarm")]
    DefaultAlarm(BinaryAlarmType),
    ///Optionally describe one or more alarm monitoring specifications that are effective whenever a contextual match definition evaluates to true.  The first match that evaluates to true takes precedence.
    #[serde(rename = "ContextAlarmList")]
    ContextAlarmList(BinaryContextAlarmListType),
}
///A simple restriction on string for hexadecimal numbers.  Must be in 0b or 0B form.
pub type BinaryType = ::std::string::String;
///Defines two bit-order types: most significant bit first and least significant bit first.  See DataEncodingType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BitOrderType {
    #[serde(rename = "leastSignificantBitFirst")]
    LeastSignificantBitFirst,
    #[serde(rename = "mostSignificantBitFirst")]
    MostSignificantBitFirst,
}
///Describe an ordered grouping of MetaCommands into a list, duplicates are valid. The block contains argument values fully specified.  See MetaCommandStepListType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BlockMetaCommandType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///List of the MetaCommands to include in this BlockMetaCommand.
    #[serde(rename = "MetaCommandStepList")]
    pub meta_command_step_list: MetaCommandStepListType,
}
///Alarm conditions for Boolean types
#[derive(Debug, Deserialize, Serialize)]
pub struct BooleanAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "BooleanAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "BooleanAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "BooleanAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BooleanAlarmTypeContent>,
}
///Alarm conditions for Boolean types
#[derive(Debug, Deserialize, Serialize)]
pub enum BooleanAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
}
impl BooleanAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///Defines a boolean argument type which has two values only: "True" (1) or "False" (0). The values one and zero may be mapped to a specific string using the attributes oneStringValue and zeroStringValue.  This type is a simplified form of the EnumeratedDataType.  See IntegerDataEncoding and BooleanDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BooleanArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Enumeration string representing the 1 value, with the default being 'True'.
    #[serde(
        default = "BooleanArgumentType::default_one_string_value",
        rename = "@oneStringValue"
    )]
    pub one_string_value: super::xs::StringType,
    ///Enumeration string representing the 0 value, with the default being 'False'.
    #[serde(
        default = "BooleanArgumentType::default_zero_string_value",
        rename = "@zeroStringValue"
    )]
    pub zero_string_value: super::xs::StringType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BooleanArgumentTypeContent>,
}
///Defines a boolean argument type which has two values only: "True" (1) or "False" (0). The values one and zero may be mapped to a specific string using the attributes oneStringValue and zeroStringValue.  This type is a simplified form of the EnumeratedDataType.  See IntegerDataEncoding and BooleanDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BooleanArgumentTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
}
impl BooleanArgumentType {
    #[must_use]
    pub fn default_one_string_value() -> super::xs::StringType {
        ::std::string::String::from("True")
    }
    #[must_use]
    pub fn default_zero_string_value() -> super::xs::StringType {
        ::std::string::String::from("False")
    }
}
///Describe an ordered collection of context boolean alarms, duplicates are valid.  Process the contexts in list order.  See BooleanContextAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BooleanContextAlarmListType {
    ///A Context contains a new alarm definition and a context match.  The match takes precedence over any default alarm when the first in the overall list evaluates to true.  It is also possible the alarm definition is empty, in which case the context means no alarm defined when the match is true.
    #[serde(default, rename = "ContextAlarm")]
    pub context_alarm: ::std::vec::Vec<BooleanContextAlarmType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct BooleanContextAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "BooleanContextAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "BooleanContextAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "BooleanContextAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<BooleanContextAlarmTypeContent>,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum BooleanContextAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    #[serde(rename = "ContextMatch")]
    ContextMatch(ContextMatchType),
}
impl BooleanContextAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///A base schema type for describing a boolean data type which has two values only: "True" (1) or "False" (0). The values one and zero may be mapped to a specific string using the attributes oneStringValue and zeroStringValue.  This type is a simplified form of the EnumeratedDataType.  See BaseDataType, BooleanParameterType and BooleanArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BooleanDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Enumeration string representing the 1 value, with the default being 'True'.
    #[serde(
        default = "BooleanDataType::default_one_string_value",
        rename = "@oneStringValue"
    )]
    pub one_string_value: super::xs::StringType,
    ///Enumeration string representing the 0 value, with the default being 'False'.
    #[serde(
        default = "BooleanDataType::default_zero_string_value",
        rename = "@zeroStringValue"
    )]
    pub zero_string_value: super::xs::StringType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BooleanDataTypeContent>,
}
///A base schema type for describing a boolean data type which has two values only: "True" (1) or "False" (0). The values one and zero may be mapped to a specific string using the attributes oneStringValue and zeroStringValue.  This type is a simplified form of the EnumeratedDataType.  See BaseDataType, BooleanParameterType and BooleanArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BooleanDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
}
impl BooleanDataType {
    #[must_use]
    pub fn default_one_string_value() -> super::xs::StringType {
        ::std::string::String::from("True")
    }
    #[must_use]
    pub fn default_zero_string_value() -> super::xs::StringType {
        ::std::string::String::from("False")
    }
}
///Holds an arbitrarily complex boolean expression
#[derive(Debug, Deserialize, Serialize)]
pub enum BooleanExpressionType {
    ///Condition elements describe a test similar to the Comparison element except that the parameters used have additional flexibility.
    #[serde(rename = "Condition")]
    Condition(ComparisonCheckType),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible.
    #[serde(rename = "ANDedConditions")]
    AnDedConditions(AnDedConditionsType),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible.
    #[serde(rename = "ORedConditions")]
    ORedConditions(ORedConditionsType),
}
///Describe a boolean parameter type which has two values only: "True" (1) or "False" (0). The values one and zero may be mapped to a specific string using the attributes oneStringValue and zeroStringValue.  This type is a simplified form of the EnumeratedDataType.  See IntegerDataEncoding and BooleanDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct BooleanParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Enumeration string representing the 1 value, with the default being 'True'.
    #[serde(
        default = "BooleanParameterType::default_one_string_value",
        rename = "@oneStringValue"
    )]
    pub one_string_value: super::xs::StringType,
    ///Enumeration string representing the 0 value, with the default being 'False'.
    #[serde(
        default = "BooleanParameterType::default_zero_string_value",
        rename = "@zeroStringValue"
    )]
    pub zero_string_value: super::xs::StringType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<BooleanParameterTypeContent>,
}
///Describe a boolean parameter type which has two values only: "True" (1) or "False" (0). The values one and zero may be mapped to a specific string using the attributes oneStringValue and zeroStringValue.  This type is a simplified form of the EnumeratedDataType.  See IntegerDataEncoding and BooleanDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum BooleanParameterTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///Optionally describe an alarm monitoring specification that is effective whenever a contextual alarm definition does not take precedence.
    #[serde(rename = "DefaultAlarm")]
    DefaultAlarm(BooleanAlarmType),
    ///Optionally describe one or more alarm monitoring specifications that are effective whenever a contextual match definition evaluates to true.  The first match that evaluates to true takes precedence.
    #[serde(rename = "ContextAlarmList")]
    ContextAlarmList(BooleanContextAlarmListType),
}
impl BooleanParameterType {
    #[must_use]
    pub fn default_one_string_value() -> super::xs::StringType {
        ::std::string::String::from("True")
    }
    #[must_use]
    pub fn default_zero_string_value() -> super::xs::StringType {
        ::std::string::String::from("False")
    }
}
///Describe a byte order using a byte list. The list is viewed as representing memory, the first item in the list is address 0. For mostSignificantByteFirst/big endian, the high order byte is the first byte in the list and has the highest significance followed by the less significant bytes ending with the least significant byte. For leastSignificantByteFirst/little endian, the first byte starts with the least significant byte which is first in the least and ends at the highest significant byte. For example given the value 0x0A0B0C0D the following example orderings can be formed. For mostSignificantByteFirst/big endian the significances would be listed as 3 (0x0A), 2 (0x0B), 1 (0x0C), 0 (0x0D) with 3 being first in the list, and for leastSignificantByteFirst/little endian as 0 (0x0D), 1 (0x0C), 2 (0x0B), 3 (0x0A) with 0 being first in the list. See DataEncodingType.
pub type ByteOrderArbitraryType = ::std::string::String;
///Common byte orderings: most significant byte first (also known as big endian) and least significant byte first (also known as little endian).
#[derive(Debug, Deserialize, Serialize)]
pub enum ByteOrderCommonType {
    #[serde(rename = "mostSignificantByteFirst")]
    MostSignificantByteFirst,
    #[serde(rename = "leastSignificantByteFirst")]
    LeastSignificantByteFirst,
}
///Describe a byte order: big/little or byte list.
#[derive(Debug, Deserialize_enum_str, Serialize_enum_str)]
pub enum ByteOrderType {
    #[serde(rename = "mostSignificantByteFirst")]
    MostSignificantByteFirst,
    #[serde(rename = "leastSignificantByteFirst")]
    LeastSignificantByteFirst,
    #[serde(other)]
    String(::std::string::String),
}
#[derive(Debug, Deserialize, Serialize)]
pub struct ByteType {
    #[serde(rename = "@byteSignificance")]
    pub byte_significance: NonNegativeLongType,
}
///Cyclic Redundancy Check (CRC) definition. The polynomial coefficients for the CRC are defined as a truncated hex value.  The coefficient for the nth bit of an n-bit CRC will always be 1 and is not represented in the truncated hex value.  For example, the truncated hex value of CRC-32 (width=32 bits) used in the Ethernet specification is 0x04C11DB7, where each non-zero bit of the truncated hex represents a coefficient of 1 in the polynomial and the bit position represents the exponent. There may also be an initial remainder "InitRemainder" and a final XOR "FinalXOR" to fully specify the CRC.  reflectData and reflectRemainder may also be specified to reverse the bit order in the incoming data and/or the result.
#[derive(Debug, Deserialize, Serialize)]
pub struct CrcType {
    ///The width is the number of bits in the shift register, which is not necessarily the number of bits of the parameter holding the value.
    #[serde(rename = "@width")]
    pub width: PositiveLongType,
    ///Endianness of the input data, true=little, false=big.
    #[serde(default = "CrcType::default_reflect_data", rename = "@reflectData")]
    pub reflect_data: super::xs::BooleanType,
    ///Endianness of the output data, true=little, false=big.
    #[serde(
        default = "CrcType::default_reflect_remainder",
        rename = "@reflectRemainder"
    )]
    pub reflect_remainder: super::xs::BooleanType,
    ///The direction to perform the CRC calculation.
    #[serde(default = "CrcType::default_direction", rename = "@direction")]
    pub direction: BitOrderType,
    ///An offset of non-zero may be specified to skip some bits against the reference position in the reference attribute.
    #[serde(
        default = "CrcType::default_bits_from_reference",
        rename = "@bitsFromReference"
    )]
    pub bits_from_reference: NonNegativeLongType,
    ///The bits involved in the calculation may start at the beginning or the end of the container.
    #[serde(default = "CrcType::default_reference", rename = "@reference")]
    pub reference: ReferencePointType,
    ///Reference to the parameter that contains the value of the CRC based on this container.  This attribute is optional because not all implementations verify (telemetry) or create (telecommand) error control fields using the XTCE definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@parameterRef")]
    pub parameter_ref: ::core::option::Option<ExpandedNameReferenceWithPathType>,
    ///The polynomial that represents the calculation in hexadecimal form (described at CRCType annotation).
    #[serde(rename = "Polynomial")]
    pub polynomial: super::xs::HexBinaryType,
    ///A hexadecimal digit string specifying the initial value to set in the shift register before computing the CRC.
    #[serde(default, rename = "InitRemainder")]
    pub init_remainder: ::core::option::Option<super::xs::HexBinaryType>,
    ///A hexadecimal digit string specifying the value to be added to the final shift register value before output.
    #[serde(default, rename = "FinalXOR")]
    pub final_xor: ::core::option::Option<super::xs::HexBinaryType>,
}
impl CrcType {
    #[must_use]
    pub fn default_reflect_data() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_reflect_remainder() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_direction() -> BitOrderType {
        BitOrderType::MostSignificantBitFirst
    }
    #[must_use]
    pub fn default_bits_from_reference() -> NonNegativeLongType {
        0i64
    }
    #[must_use]
    pub fn default_reference() -> ReferencePointType {
        ReferencePointType::Start
    }
}
///Describe a calibrator to transform a source data type raw/uncalibrated value (e.g. an integer count from a spacecraft) to an engineering unit/calibrated value for users (e.g. a float).
#[derive(Debug, Deserialize, Serialize)]
pub struct CalibratorType {
    ///Optional name for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///Optional description for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<CalibratorTypeContent>,
}
///Describe a calibrator to transform a source data type raw/uncalibrated value (e.g. an integer count from a spacecraft) to an engineering unit/calibrated value for users (e.g. a float).
#[derive(Debug, Deserialize, Serialize)]
pub enum CalibratorTypeContent {
    ///Optional additional ancillary information for this calibrator/algorithm
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Describes a calibrator in the form of a piecewise defined function
    #[serde(rename = "SplineCalibrator")]
    SplineCalibrator(SplineCalibratorType),
    ///Describes a calibrator in the form of a polynomial function
    #[serde(rename = "PolynomialCalibrator")]
    PolynomialCalibrator(PolynomialCalibratorType),
    ///Describes a calibrator in the form of a user/program/implementation defined function
    #[serde(rename = "MathOperationCalibrator")]
    MathOperationCalibrator(MathOperationCalibratorType),
}
///Describe an alarm when the parameter value's rate-of-change is either too fast or too slow. The change may be with respect to time (the default) or with respect to samples (delta alarms). Use the changeType attribute to select the type: changePerSecond (time) or changePerSample (delta). The change may also be ether relative (as a percentage change) or absolute as set by the changeBasis attribute. (Delta alarms are typically absolute but percentage is conceivable). The alarm also requires the spanOfInterest in both samples and seconds to have passed before it is to trigger. For time based rate of change alarms, the time specified in spanOfInterestInSeconds is used to calculate the change. For sample based rate of change alarms, the change is calculated over the number of samples specified in spanOfInterestInSamples. A typical delta alarm would set: changeType=changePerSample, changeBasis=absoluteChange, spanOfInterestInSamples=1. A typical time based version would set: changeType=changePerSecond, changeBasis=percentageChange, and spaceOfInterestInSeconds=1. To set the ranges use maxInclusive, the following definition applies: | Normal.maxInclusive | = | Watch.maxInclusive | = | Warning.maxInclusive | = | Distress.maxInclusive | = | Critical.maxInclusive | = | Severe.maxInclusive |. And it is further assumed the absolute value of each range and sampled value it taken to evaluate the alarm. See NumericAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ChangeAlarmRangesType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///A value of outside specifies that the most severe range is outside all the other ranges: -severe -critical -distress -warning -watch normal +watch +warning +distress +critical +severe.  This means each min, max pair are a range: (-inf, min) or (-inf, min], and [max, inf) or (max, inf).  However a value of inside "inverts" these bands: -normal -watch -warning -distress -critical severe +critical +distress +warning +watch, +normal.  This means each min, max pair form a range of (min, max) or [min, max) or (min, max] or [min, max]. The most common form used is "outside" and it is the default.  The set notation used defines parenthesis as exclusive and square brackets as inclusive.
    #[serde(
        default = "ChangeAlarmRangesType::default_range_form",
        rename = "@rangeForm"
    )]
    pub range_form: RangeFormType,
    #[serde(
        default = "ChangeAlarmRangesType::default_change_type",
        rename = "@changeType"
    )]
    pub change_type: ChangeSpanType,
    #[serde(
        default = "ChangeAlarmRangesType::default_change_basis",
        rename = "@changeBasis"
    )]
    pub change_basis: ChangeBasisType,
    #[serde(
        default = "ChangeAlarmRangesType::default_span_of_interest_in_samples",
        rename = "@spanOfInterestInSamples"
    )]
    pub span_of_interest_in_samples: PositiveLongType,
    #[serde(
        default = "ChangeAlarmRangesType::default_span_of_interest_in_seconds",
        rename = "@spanOfInterestInSeconds"
    )]
    pub span_of_interest_in_seconds: super::xs::DoubleType,
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///A range of least concern. Considered to be below the most commonly used Warning level.
    #[serde(default, rename = "WatchRange")]
    pub watch_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern that represents the most commonly used minimum concern level for many software applications.
    #[serde(default, rename = "WarningRange")]
    pub warning_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern in between the most commonly used Warning and Critical levels.
    #[serde(default, rename = "DistressRange")]
    pub distress_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern that represents the most commonly used maximum concern level for many software applications.
    #[serde(default, rename = "CriticalRange")]
    pub critical_range: ::core::option::Option<FloatRangeType>,
    ///A range of highest concern. Considered to be above the most commonly used Critical level.
    #[serde(default, rename = "SevereRange")]
    pub severe_range: ::core::option::Option<FloatRangeType>,
}
impl ChangeAlarmRangesType {
    #[must_use]
    pub fn default_range_form() -> RangeFormType {
        RangeFormType::Outside
    }
    #[must_use]
    pub fn default_change_type() -> ChangeSpanType {
        ChangeSpanType::ChangePerSecond
    }
    #[must_use]
    pub fn default_change_basis() -> ChangeBasisType {
        ChangeBasisType::AbsoluteChange
    }
    #[must_use]
    pub fn default_span_of_interest_in_samples() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_span_of_interest_in_seconds() -> super::xs::DoubleType {
        0f64
    }
}
///Defines absoluteChange and percentageChange for use in rate of change alarms. Used by ChangeAlarmRangesType.
#[derive(Debug, Deserialize, Serialize)]
pub enum ChangeBasisType {
    #[serde(rename = "absoluteChange")]
    AbsoluteChange,
    #[serde(rename = "percentageChange")]
    PercentageChange,
}
///Defines a changePerSecond and changePerSample for use in rate of change alarms. Used by ChangeAlarmRangesType.
#[derive(Debug, Deserialize, Serialize)]
pub enum ChangeSpanType {
    #[serde(rename = "changePerSecond")]
    ChangePerSecond,
    #[serde(rename = "changePerSample")]
    ChangePerSample,
}
///Describe a change value used to test verification status. See CommandVerifierType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ChangeValueType {
    ///Value as a floating point number.
    #[serde(rename = "@value")]
    pub value: super::xs::DoubleType,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum CharacterWidthType {
    #[serde(rename = "8")]
    _8,
    #[serde(rename = "16")]
    _16,
    #[serde(rename = "32")]
    _32,
}
///Used by CommandVerifiers to limit the time allocated to check for the verification.  See CommandVerifierType.
#[derive(Debug, Deserialize, Serialize)]
pub struct CheckWindowAlgorithmsType {
    #[serde(rename = "StartCheck")]
    pub start_check: InputAlgorithmType,
    #[serde(rename = "StopTime")]
    pub stop_time: InputAlgorithmType,
}
///Used by CommandVerifiers to limit the time allocated to check for the verification.  See CheckWindowAlgorithmsType.
#[derive(Debug, Deserialize, Serialize)]
pub struct CheckWindowType {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@timeToStartChecking")]
    pub time_to_start_checking: ::core::option::Option<RelativeTimeType>,
    #[serde(rename = "@timeToStopChecking")]
    pub time_to_stop_checking: RelativeTimeType,
    #[serde(
        default = "CheckWindowType::default_time_window_is_relative_to",
        rename = "@timeWindowIsRelativeTo"
    )]
    pub time_window_is_relative_to: TimeWindowIsRelativeToType,
}
impl CheckWindowType {
    #[must_use]
    pub fn default_time_window_is_relative_to() -> TimeWindowIsRelativeToType {
        TimeWindowIsRelativeToType::TimeLastVerifierPassed
    }
}
///Describe checksum or hash function definiton.  See ErrorDetectCorrectType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ChecksumType {
    ///An offset of non-zero may be specified to skip some bits against the reference position in the reference attribute.
    #[serde(
        default = "ChecksumType::default_bits_from_reference",
        rename = "@bitsFromReference"
    )]
    pub bits_from_reference: NonNegativeLongType,
    ///The bits involved in the calculation may start at the beginning or the end of the container.
    #[serde(default = "ChecksumType::default_reference", rename = "@reference")]
    pub reference: ReferencePointType,
    ///Qualified list of named common checksum algorithms. If custom is chosen, InputAlgorithm must be set.
    #[serde(rename = "@name")]
    pub name: ChecksumTypeNameType,
    ///The hashing algorithm may use a larger internal bucket size than the emitted value size in bits captured by the parameterRef attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@hashSizeInBits")]
    pub hash_size_in_bits: ::core::option::Option<PositiveLongType>,
    ///Reference to the parameter that contains the value of this computed checksum or hash based on this container.  This attribute is optional because not all implementations verify (telemetry) or create (telecommand) error control fields using the XTCE definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@parameterRef")]
    pub parameter_ref: ::core::option::Option<ExpandedNameReferenceWithPathType>,
    ///Provided to account for an algorithm not otherwise listed by enumeration.  Assumed to return the computed checksum.
    #[serde(default, rename = "InputAlgorithm")]
    pub input_algorithm: ::core::option::Option<InputAlgorithmType>,
}
impl ChecksumType {
    #[must_use]
    pub fn default_bits_from_reference() -> NonNegativeLongType {
        0i64
    }
    #[must_use]
    pub fn default_reference() -> ReferencePointType {
        ReferencePointType::Start
    }
}
///Describe an entry list for a CommandContainer which is associated with a MetaCommand. The entry list for a MetaCommand CommandContainer element operates in a similar fashion as the entry list element for a SequenceContainer element.  It adds fixed value and argument entries to the entry list not present in sequence containers.  See MetaCommandType, CommandContainerType and EntryListType.
#[derive(Debug, Deserialize, Serialize)]
pub struct CommandContainerEntryListType {
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<CommandContainerEntryListTypeContent>,
}
///Describe an entry list for a CommandContainer which is associated with a MetaCommand. The entry list for a MetaCommand CommandContainer element operates in a similar fashion as the entry list element for a SequenceContainer element.  It adds fixed value and argument entries to the entry list not present in sequence containers.  See MetaCommandType, CommandContainerType and EntryListType.
#[derive(Debug, Deserialize, Serialize)]
pub enum CommandContainerEntryListTypeContent {
    ///Specify a Parameter to be a part of this container layout definition.
    #[serde(rename = "ParameterRefEntry")]
    ParameterRefEntry(ArgumentParameterRefEntryType),
    ///Specify a portion of a Parameter to be a part of this container layout definition.  This is used when the Parameter is reported in fractional parts in the container before being fully updated.
    #[serde(rename = "ParameterSegmentRefEntry")]
    ParameterSegmentRefEntry(ArgumentParameterSegmentRefEntryType),
    ///Specify the content of another Container to be a part of this container layout definition.
    #[serde(rename = "ContainerRefEntry")]
    ContainerRefEntry(ArgumentContainerRefEntryType),
    ///Specify a portion of another Container to be a part of this container layout definition.
    #[serde(rename = "ContainerSegmentRefEntry")]
    ContainerSegmentRefEntry(ArgumentContainerSegmentRefEntryType),
    ///Specify a portion of a Stream to be a part of this container layout definition.
    #[serde(rename = "StreamSegmentEntry")]
    StreamSegmentEntry(ArgumentStreamSegmentEntryType),
    ///Specify a previous (not last reported) value of a Parmeter to be a part of this container layout definition.
    #[serde(rename = "IndirectParameterRefEntry")]
    IndirectParameterRefEntry(ArgumentIndirectParameterRefEntryType),
    ///Specify an Array Type Parameter to be a part of this container layout definition when the Container does not populate the entire space of the Array contents.  If the entire space of the Array is populated, a tolerant implementation will accept ParameterRefEntry also.
    #[serde(rename = "ArrayParameterRefEntry")]
    ArrayParameterRefEntry(ArgumentArrayParameterRefEntryType),
    ///Specify an Argument to be a part of this container layout definition.
    #[serde(rename = "ArgumentRefEntry")]
    ArgumentRefEntry(ArgumentArgumentRefEntryType),
    ///Specify an Array Type Argument to be a part of this container layout definition when the Container does not populate the entire space of the Array contents.  If the entire space of the Array is populated, a tolerant implementation will accept ArgumentRefEntry also.
    #[serde(rename = "ArrayArgumentRefEntry")]
    ArrayArgumentRefEntry(ArgumentArrayArgumentRefEntryType),
    ///Specify an immutable value to be a part of this container layout definition.
    #[serde(rename = "FixedValueEntry")]
    FixedValueEntry(ArgumentFixedValueEntryType),
}
///Contains an unordered Set of Command Containers
#[derive(Debug, Deserialize, Serialize)]
pub struct CommandContainerSetType {
    #[serde(default, rename = "CommandContainer")]
    pub command_container: ::std::vec::Vec<SequenceContainerType>,
}
///Describe a MetaCommand command container.  The command container may contain arguments, parameters, other basic containers, and fixed values.  Arguments are supplied by the user of a commanding application; parameters are supplied by the controlling system.  Parameters and arguments map source data types to encodings.   See MetaCommandType.
#[derive(Debug, Deserialize, Serialize)]
pub struct CommandContainerType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "DefaultRateInStream")]
    pub default_rate_in_stream: ::core::option::Option<RateInStreamType>,
    #[serde(default, rename = "RateInStreamSet")]
    pub rate_in_stream_set: ::core::option::Option<RateInStreamSetType>,
    ///May be used to indicate error detection and correction, change byte order,  provide the size (when it can't be derived), or perform some custom processing.
    #[serde(default, rename = "BinaryEncoding")]
    pub binary_encoding: ::core::option::Option<ContainerBinaryDataEncodingType>,
    ///List of item entries to pack/encode into this container definition.
    #[serde(rename = "EntryList")]
    pub entry_list: CommandContainerEntryListType,
    ///When a MetaCommand inherits/extends another MetaCommand, this references the CommandContainer from the BaseMetaCommand.
    #[serde(default, rename = "BaseContainer")]
    pub base_container: ::core::option::Option<BaseContainerType>,
}
///Describe command related metadata. Items defined in this area may refer to items defined in TelemetryMetaData.  See TelemetryMetaDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct CommandMetaDataType {
    ///A list of parameter types.
    #[serde(default, rename = "ParameterTypeSet")]
    pub parameter_type_set: ::core::option::Option<ParameterTypeSetType>,
    ///Parameters referenced by MetaCommands.  This Parameter Set is located here so that MetaCommand data can be built independently of TelemetryMetaData.
    #[serde(default, rename = "ParameterSet")]
    pub parameter_set: ::core::option::Option<ParameterSetType>,
    ///A list of argument types.  MetaCommand definitions can contain arguments and parameters.  Arguments are user provided to the specific command definition.  Parameters are provided/calculated/determined by the software creating the command instance.  As a result, arguments contain separate type information.  In some cases, arguments have different descriptive characteristics.
    #[serde(default, rename = "ArgumentTypeSet")]
    pub argument_type_set: ::core::option::Option<ArgumentTypeSetType>,
    ///A list of command definitions with their arguments, parameters, and container encoding descriptions.
    #[serde(default, rename = "MetaCommandSet")]
    pub meta_command_set: ::core::option::Option<MetaCommandSetType>,
    ///Similar to the ContainerSet for telemetry, the CommandContainerSet contains containers that can be referenced/shared by MetaCommand definitions.
    #[serde(default, rename = "CommandContainerSet")]
    pub command_container_set: ::core::option::Option<CommandContainerSetType>,
    ///Contains an unordered set of Streams.
    #[serde(default, rename = "StreamSet")]
    pub stream_set: ::core::option::Option<StreamSetType>,
    ///Contains an unordered set of Algorithms.
    #[serde(default, rename = "AlgorithmSet")]
    pub algorithm_set: ::core::option::Option<AlgorithmSetType>,
}
///A command verifier is used to check that the command has been successfully executed. Command Verifiers may be either a Custom Algorithm or a Boolean Check or the presence of a Container for a relative change in the value of a Parameter.  The CheckWindow is a time period where the verification must test true to pass.
#[derive(Debug, Deserialize, Serialize)]
pub struct CommandVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<CommandVerifierTypeContent>,
}
///A command verifier is used to check that the command has been successfully executed. Command Verifiers may be either a Custom Algorithm or a Boolean Check or the presence of a Container for a relative change in the value of a Parameter.  The CheckWindow is a time period where the verification must test true to pass.
#[derive(Debug, Deserialize, Serialize)]
pub enum CommandVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
}
///Describe the comparison between the instance (value) of a parameter against either a specified value or another parameter instance.
#[derive(Debug, Deserialize, Serialize)]
pub struct ComparisonCheckType {
    #[serde(rename = "$value")]
    pub content: [ComparisonCheckTypeContent; 3usize],
}
///Describe the comparison between the instance (value) of a parameter against either a specified value or another parameter instance.
#[derive(Debug, Deserialize, Serialize)]
pub enum ComparisonCheckTypeContent {
    ///Left hand side parameter instance.
    #[serde(rename = "ParameterInstanceRef")]
    ParameterInstanceRef(ParameterInstanceRefType),
    ///Comparison operator.
    #[serde(rename = "ComparisonOperator")]
    ComparisonOperator(ComparisonOperatorsType),
    ///Right hand side value.  Specify as: integer data type using xs:integer, float data type using xs:double, string data type using xs:string, boolean data type using xs:boolean, binary data type using xs:hexBinary, enum data type using label name, relative time data type using xs:duration, absolute time data type using xs:dateTime.  Values must not exceed the characteristics for the data type or this is a validation error. Takes precedence over an initial value given in the data type. Values are calibrated unless there is an option to override it.
    #[serde(rename = "Value")]
    Value(super::xs::StringType),
}
///All comparisons must be true
#[derive(Debug, Deserialize, Serialize)]
pub struct ComparisonListType {
    ///List of Comparison elements must all be true for the comparison to evaluate to true.
    #[serde(default, rename = "Comparison")]
    pub comparison: ::std::vec::Vec<ComparisonType>,
}
///Operators to use when testing a boolean condition for a validity check
#[derive(Debug, Deserialize, Serialize)]
pub enum ComparisonOperatorsType {
    #[serde(rename = "==")]
    Eq,
    #[serde(rename = "!=")]
    Neq,
    #[serde(rename = "<")]
    Lt,
    #[serde(rename = "<=")]
    Lte,
    #[serde(rename = ">")]
    Gt,
    #[serde(rename = ">=")]
    Gte,
}
///A simple ParameterInstanceRef to value comparison.  The string supplied in the value attribute needs to be converted to a type matching the Parameter being compared to.  For integer types it is base 10 form.  Floating point types may be specified in normal (100.0) or scientific (1.0e2) form.  The value is truncated  to use the least significant bits that match the bit size of the Parameter being compared to.
#[derive(Debug, Deserialize, Serialize)]
pub struct ComparisonType {
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(default = "ComparisonType::default_instance", rename = "@instance")]
    pub instance: super::xs::LongType,
    #[serde(
        default = "ComparisonType::default_use_calibrated_value",
        rename = "@useCalibratedValue"
    )]
    pub use_calibrated_value: super::xs::BooleanType,
    ///Operator to use for the comparison with the common equality operator as the default.
    #[serde(
        default = "ComparisonType::default_comparison_operator",
        rename = "@comparisonOperator"
    )]
    pub comparison_operator: ComparisonOperatorsType,
    ///Specify value as a string compliant with the XML schema (xs) type specified for each XTCE type: integer=xs:integer; float=xs:double; string=xs:string; boolean=xs:boolean; binary=xs:hexBinary; enum=xs:string from EnumerationList; relative time= xs:duration; absolute time=xs:dateTime.  Supplied value must be within the ValidRange specified for the type.
    #[serde(rename = "@value")]
    pub value: super::xs::StringType,
}
impl ComparisonType {
    #[must_use]
    pub fn default_instance() -> super::xs::LongType {
        0i64
    }
    #[must_use]
    pub fn default_use_calibrated_value() -> super::xs::BooleanType {
        true
    }
    #[must_use]
    pub fn default_comparison_operator() -> ComparisonOperatorsType {
        ComparisonOperatorsType::Eq
    }
}
///A possible set of verifiers that all must be true for the command be considered completed.  Consider that some may not participate due to argument value restriction, if that element is used.
#[derive(Debug, Deserialize, Serialize)]
pub struct CompleteVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<CompleteVerifierTypeContent>,
}
///A possible set of verifiers that all must be true for the command be considered completed.  Consider that some may not participate due to argument value restriction, if that element is used.
#[derive(Debug, Deserialize, Serialize)]
pub enum CompleteVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
    #[serde(rename = "ReturnParmRef")]
    ReturnParmRef(ParameterRefType),
}
///Defines six levels: Normal, Watch, Warning, Distress, Critical and Severe, in that order of concern from least to most. These level definitions are used throughout the alarm definitions. An implementation should interpret these as best to match their uniqueness and provide documentation on how this standard maps to their implementation.  Not all are likely to be provided, with some either ignored, promoted or demoted to others, or warned on input.  There exist some reasonable usage recommendations in the user community.
#[derive(Debug, Deserialize, Serialize)]
pub enum ConcernLevelsType {
    ///The case of "normal" or "no concern level" is generally the default.  This value can be useful when describing an exception or disabling when the more typical case is a non-normal concern level.
    #[serde(rename = "normal")]
    Normal,
    ///DEPRECATED: The lowest level of concern.  Systems that support only 3 or 4 concern levels have been observed to promote "watch" to "warning" during data processing, if this enumeration is not explicitly supported.  This value may not exist in future versions of this specification.
    #[serde(rename = "watch")]
    Watch,
    ///A level of concern to be interpreted by the user as less than the highest possible concern.  This is intended by the specification to be quite vague.  The project operational concept will explicitly define how these are to be used.
    #[serde(rename = "warning")]
    Warning,
    ///A level of concern to be interpreted by the user as greater than the least concern but not yet rising to the highest possible concern.  This is intended by the specification to be quite vague.  The project operational concept will explicitly define how these are to be used.
    #[serde(rename = "distress")]
    Distress,
    ///A level of concern to be interpreted by the user as the highest possible concern.  This is intended by the specification to be quite vague.  The project operational concept will explicitly define how these are to be used.
    #[serde(rename = "critical")]
    Critical,
    ///DEPRECATED: The highest level of concern.  Systems that support only 3 or 4 concern levels have been observed to demote "severe" to "critical" during data processing, if this enumeration is not explicitly supported.  This value may not exist in future versions of this specification.
    #[serde(rename = "severe")]
    Severe,
}
///Defines the criticality level of a command.  Criticality levels follow ISO 14950.
#[derive(Debug, Deserialize, Serialize)]
pub enum ConsequenceLevelType {
    ///Normal command.  Corresponds to ISO 14950 Level D telecommand criticality.
    #[serde(rename = "normal")]
    Normal,
    ///Command that is not a critical command but is essential to the success of the mission and, if sent at the wrong time, could cause momentary loss of the mission.  Corresponds to ISO 14950 Level C telecommand criticality.
    #[serde(rename = "vital")]
    Vital,
    ///Command that, if executed at the wrong time or in the wrong configuration, could cause irreversible loss or damage for the mission.  Corresponds to ISO 14950 Level B telecommand criticality.  Some space programs have called this "restricted" and may be implemented with a secondary confirmation before transmission.
    #[serde(rename = "critical")]
    Critical,
    ///Command that is not expected to be used for nominal or foreseeable contingency operations, that is included for unforeseen contingency operations, and that could cause irreversible damage if executed at the wrong time or in the wrong configuration.  Corresponds to ISO 14950 Level A telecommand criticality.  Some space programs have called this "prohibited".
    #[serde(rename = "forbidden")]
    Forbidden,
    ///In the event that a program uses this value, that program will need to define the meaning of this value to their system.
    #[serde(rename = "user1")]
    User1,
    ///In the event that a program uses this value, that program will need to define the meaning of this value to their system.
    #[serde(rename = "user2")]
    User2,
}
///Names and provides a value for a constant input to the algorithm.  There are two attributes to Constant, constantName and value.  constantName is a variable name in the algorithm to be executed.  value is the value of the constant to be used.
#[derive(Debug, Deserialize, Serialize)]
pub struct ConstantType {
    ///Supply a name for the constant to be used to access this value from within the algorithm.
    #[serde(rename = "@constantName")]
    pub constant_name: super::xs::StringType,
    ///Supply the constant value in the form of the data type needed in the algorithm.
    #[serde(rename = "@value")]
    pub value: super::xs::StringType,
}
///Describe container binary data that is unmolested in the decoding/encoding or cannot be represented in any of the other data encoding formats. Optionally use the FromBinaryTransformAlgorithm and ToBinaryTransformAlgorithm element to describe the transformation process. See InputAlgorithmType for the transformation structure.
#[derive(Debug, Deserialize, Serialize)]
pub struct ContainerBinaryDataEncodingType {
    ///Describes the optional inclusion of an error detection and/or correction algorithm used with this container.
    #[serde(default, rename = "ErrorDetectCorrect")]
    pub error_detect_correct: ::core::option::Option<ErrorDetectCorrectType>,
    ///Number of bits this container occupies on the stream being encoded/decoded.  This is only needed to "force" the bit length of the container to be a fixed value.  In most cases, the entry list would define the size of the container.
    #[serde(default, rename = "SizeInBits")]
    pub size_in_bits: ::core::option::Option<IntegerValueType>,
    ///Used to convert binary data to an application data type.
    #[serde(default, rename = "FromBinaryTransformAlgorithm")]
    pub from_binary_transform_algorithm: ::core::option::Option<InputAlgorithmType>,
    ///Used to convert binary data from an application data type to binary data.
    #[serde(default, rename = "ToBinaryTransformAlgorithm")]
    pub to_binary_transform_algorithm: ::core::option::Option<InputAlgorithmType>,
}
///An entry that is simply a reference to another container.
#[derive(Debug, Deserialize, Serialize)]
pub struct ContainerRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@containerRef")]
    pub container_ref: NameReferenceWithPathType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        LocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<RepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<MatchCriteriaType>,
    ///Optional timing information associated with this entry.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
    ///Optional ancillary data associated with this element.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct ContainerRefSetType {
    #[serde(default, rename = "ContainerRef")]
    pub container_ref: ::std::vec::Vec<ContainerRefType>,
}
///Holds a reference to a container
#[derive(Debug, Deserialize, Serialize)]
pub struct ContainerRefType {
    ///name of container
    #[serde(rename = "@containerRef")]
    pub container_ref: NameReferenceWithPathType,
}
///An entry that is only a portion of a container indicating that the entire container must be assembled from other container segments.   It is assumed that container segments happen sequentially in time, that is the first part of a container is first, however (and there's always a however), if this is not the case the order of this container segment may be supplied with the order attribute where the first segment order="0".  Each instance of a container cannot overlap in the overall sequence with another instance
#[derive(Debug, Deserialize, Serialize)]
pub struct ContainerSegmentRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@containerRef")]
    pub container_ref: NameReferenceWithPathType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@order")]
    pub order: ::core::option::Option<PositiveLongType>,
    #[serde(rename = "@sizeInBits")]
    pub size_in_bits: PositiveLongType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        LocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<RepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<MatchCriteriaType>,
    ///Optional timing information associated with this entry.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
    ///Optional ancillary data associated with this element.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Unordered Set of Containers
#[derive(Debug, Deserialize, Serialize)]
pub struct ContainerSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ContainerSetTypeContent>,
}
///Unordered Set of Containers
#[derive(Debug, Deserialize, Serialize)]
pub enum ContainerSetTypeContent {
    ///SequenceContainers define sequences of parameters or other containers.
    #[serde(rename = "SequenceContainer")]
    SequenceContainer(SequenceContainerType),
}
///An abstract block of data; used as the base type for more specific container types
#[derive(Debug, Deserialize, Serialize)]
pub struct ContainerType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "DefaultRateInStream")]
    pub default_rate_in_stream: ::core::option::Option<RateInStreamType>,
    #[serde(default, rename = "RateInStreamSet")]
    pub rate_in_stream_set: ::core::option::Option<RateInStreamSetType>,
    ///May be used to indicate error detection and correction, change byte order,  provide the size (when it can't be derived), or perform some custom processing.
    #[serde(default, rename = "BinaryEncoding")]
    pub binary_encoding: ::core::option::Option<ContainerBinaryDataEncodingType>,
}
///Describe an ordered list of calibrators with a context match.  Useful when different calibrations must be used depending on a matching value.  The first context that matches determines which calibrator to use. See IntegerDataEncodingType and FloatDataEncodingType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ContextCalibratorListType {
    ///Describe a calibrator that depends on a matching value using a ContextMatch.  When the context matches for the calibrator, the default calibrator is overridden, if it exists.
    #[serde(default, rename = "ContextCalibrator")]
    pub context_calibrator: ::std::vec::Vec<ContextCalibratorType>,
}
///Context calibrations are applied when the ContextMatch is true.  Context calibrators overide Default calibrators
#[derive(Debug, Deserialize, Serialize)]
pub struct ContextCalibratorType {
    #[serde(rename = "ContextMatch")]
    pub context_match: ContextMatchType,
    #[serde(rename = "Calibrator")]
    pub calibrator: CalibratorType,
}
///A MatchCriteriaType used for Context selection.  It is possible that no match evaluates to true, which results in the default element being used.  It is also possible that a match can have an empty context change, in which case the default is replaced with nothing.
#[derive(Debug, Deserialize, Serialize)]
pub enum ContextMatchType {
    ///A simple comparison check involving a single test of a parameter value.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///A series of simple comparison checks with an implicit 'and' in that they all must be true for the overall condition to be true.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///An arbitrarily complex boolean expression that has additional flexibility on the terms beyond the Comparison and ComparisonList elements.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///An escape to an externally defined algorithm.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
}
///Describe an ordered list of ContextSignificance elements where the significance on the first context match to test true is used as the significance of the MetaCommand.  If there is a DefaultSignificance, it is overrideen by the matching context.  See ContextSignificantType and MetaCommandType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ContextSignificanceListType {
    ///A Context contains a different significance definition and a context match.  The match takes precedence over any default significance when the first in the overall list evaluates to true.
    #[serde(default, rename = "ContextSignificance")]
    pub context_significance: ::std::vec::Vec<ContextSignificanceType>,
}
///Describe a significance level for a MetaCommand definition where the significance level depends on matching a context value.  See ContextMatchType and SignificanceType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ContextSignificanceType {
    ///Describe the context matching value and source that will enable the Significance listed in the Significance element.
    #[serde(rename = "ContextMatch")]
    pub context_match: ContextMatchType,
    ///Describe the signficance of this MetaCommand definition.  See SignificanceType.
    #[serde(rename = "Significance")]
    pub significance: SignificanceType,
}
///Describe a custom, algorithmic alarm condition. The algorithm is assumed to return a boolean value: true or false. See AlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct CustomAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Algorithm returns a boolean.
    #[serde(rename = "InputAlgorithm")]
    pub input_algorithm: InputAlgorithmType,
}
///A stream type where some level of custom processing (e.g. convolutional, encryption, compression) is performed.  Has a reference to external algorithms for encoding and decoding algorithms.
#[derive(Debug, Deserialize, Serialize)]
pub struct CustomStreamType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@bitRateInBPS")]
    pub bit_rate_in_bps: ::core::option::Option<super::xs::DoubleType>,
    #[serde(default = "CustomStreamType::default_pcm_type", rename = "@pcmType")]
    pub pcm_type: PcmType,
    #[serde(default = "CustomStreamType::default_inverted", rename = "@inverted")]
    pub inverted: super::xs::BooleanType,
    #[serde(rename = "@encodedStreamRef")]
    pub encoded_stream_ref: NameReferenceWithPathType,
    #[serde(rename = "@decodedStreamRef")]
    pub decoded_stream_ref: NameReferenceWithPathType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(rename = "EncodingAlgorithm")]
    pub encoding_algorithm: InputAlgorithmType,
    ///Algorithm outputs may be used to set decoding quality parameters.
    #[serde(rename = "DecodingAlgorithm")]
    pub decoding_algorithm: InputOutputAlgorithmType,
}
impl CustomStreamType {
    #[must_use]
    pub fn default_pcm_type() -> PcmType {
        PcmType::Nrzl
    }
    #[must_use]
    pub fn default_inverted() -> super::xs::BooleanType {
        false
    }
}
///Describes how a particular piece of data is sent or received from some non-native, off-platform device. (e.g. a spacecraft)
#[derive(Debug, Deserialize, Serialize)]
pub struct DataEncodingType {
    ///Describes the bit ordering of the encoded value.
    #[serde(default = "DataEncodingType::default_bit_order", rename = "@bitOrder")]
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    #[serde(default = "DataEncodingType::default_byte_order", rename = "@byteOrder")]
    pub byte_order: ByteOrderType,
    ///DEPRECATED: Use the ErrorDetectCorrect element in the container elements instead.
    #[serde(default, rename = "ErrorDetectCorrect")]
    pub error_detect_correct: ::core::option::Option<ErrorDetectCorrectType>,
}
impl DataEncodingType {
    #[must_use]
    pub fn default_bit_order() -> BitOrderType {
        BitOrderType::MostSignificantBitFirst
    }
    #[must_use]
    pub fn default_byte_order() -> ByteOrderType {
        ByteOrderType::MostSignificantByteFirst
    }
}
///Defines an abstract schema type used as basis for NameDescriptionType and OptionalNameDescriptionType, includes an attribute for a short description and an element for a longer unbounded description.  This type also provides alias set and ancillary data set  See AliasSetType and AncillaryDataSetType.
#[derive(Debug, Deserialize, Serialize)]
pub struct DescriptionType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Where the Dimension list is in this form:  Array[1stDim][2ndDim][lastDim].  The last dimension is assumed to be the least significant - that is this dimension will cycle through its combination before the next to last dimension changes.  The order MUST ascend or the array will need to be broken out entry by entry.
#[derive(Debug, Deserialize, Serialize)]
pub struct DimensionListType {
    #[serde(default, rename = "Dimension")]
    pub dimension: ::std::vec::Vec<DimensionType>,
}
///For partial entries of an array, the starting and ending index for each dimension, OR the Size must be specified.  Indexes are zero based.
#[derive(Debug, Deserialize, Serialize)]
pub struct DimensionType {
    ///zero based index
    #[serde(rename = "StartingIndex")]
    pub starting_index: IntegerValueType,
    #[serde(rename = "EndingIndex")]
    pub ending_index: IntegerValueType,
}
///Describe an ordered table of integer values and associated conditions, forming a lookup table. The list may have duplicates.  The table is evaluated from first to last, the first condition to be true returns the value associated with it.  See DiscreteLookupType.
#[derive(Debug, Deserialize, Serialize)]
pub struct DiscreteLookupListType {
    ///In the event that no lookup condition evaluates to true, then this value will be used.
    #[serde(rename = "@defaultValue")]
    pub default_value: super::xs::LongType,
    ///Describe a lookup condition set using discrete values from parameters.
    #[serde(default, rename = "DiscreteLookup")]
    pub discrete_lookup: ::std::vec::Vec<DiscreteLookupType>,
}
///Describe a discrete value lookup and the value associated when the lookup evaluates to true.
#[derive(Debug, Deserialize, Serialize)]
pub struct DiscreteLookupType {
    ///Value to use when the lookup conditions are true.
    #[serde(rename = "@value")]
    pub value: super::xs::LongType,
    #[serde(rename = "$value")]
    pub content: DiscreteLookupTypeContent,
}
///Describe a discrete value lookup and the value associated when the lookup evaluates to true.
#[derive(Debug, Deserialize, Serialize)]
pub enum DiscreteLookupTypeContent {
    ///A simple comparison check involving a single test of a parameter value.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///A series of simple comparison checks with an implicit 'and' in that they all must be true for the overall condition to be true.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///An arbitrarily complex boolean expression that has additional flexibility on the terms beyond the Comparison and ComparisonList elements.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///An escape to an externally defined algorithm.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
}
///Uses a parameter instance to obtain the value.  The parameter value may be optionally adjusted by a Linear function or use a series of boolean expressions to lookup the value.  Anything more complex and a DynamicValue with a CustomAlgorithm may be used
#[derive(Debug, Deserialize, Serialize)]
pub struct DynamicValueType {
    ///Retrieve the value by referencing the value of a Parameter.
    #[serde(rename = "ParameterInstanceRef")]
    pub parameter_instance_ref: ParameterInstanceRefType,
    ///A slope and intercept may be applied to scale or shift the value selected from the argument or parameter.
    #[serde(default, rename = "LinearAdjustment")]
    pub linear_adjustment: ::core::option::Option<LinearAdjustmentType>,
}
///Describe the data encoding for a time data type.  It includes the units and other attributes scale and offset.  Use scale and offset to describe a y=mx+b relationship (where m is the slope/scale and b is the intercept/offset) to make adjustments to the encoded time value so that it matches the time units.  For binary encoded time use transform algorithms to convert time data formats that are too difficult to describe in XTCE. See AbsoluteTimeDataType and RelativeTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct EncodingType {
    ///Time units, with the default being in seconds.
    #[serde(default = "EncodingType::default_units", rename = "@units")]
    pub units: TimeUnitsType,
    ///Linear slope used as a shorter form of specifying a calibrator to convert between the raw value and the engineering units.
    #[serde(default = "EncodingType::default_scale", rename = "@scale")]
    pub scale: super::xs::DoubleType,
    ///Linear intercept used as a shorter form of specifying a calibrator to convert between the raw value and the engineering units.
    #[serde(default = "EncodingType::default_offset", rename = "@offset")]
    pub offset: super::xs::DoubleType,
    #[serde(rename = "$value")]
    pub content: EncodingTypeContent,
}
///Describe the data encoding for a time data type.  It includes the units and other attributes scale and offset.  Use scale and offset to describe a y=mx+b relationship (where m is the slope/scale and b is the intercept/offset) to make adjustments to the encoded time value so that it matches the time units.  For binary encoded time use transform algorithms to convert time data formats that are too difficult to describe in XTCE. See AbsoluteTimeDataType and RelativeTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum EncodingTypeContent {
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
}
impl EncodingType {
    #[must_use]
    pub fn default_units() -> TimeUnitsType {
        TimeUnitsType::Seconds
    }
    #[must_use]
    pub fn default_scale() -> super::xs::DoubleType {
        1f64
    }
    #[must_use]
    pub fn default_offset() -> super::xs::DoubleType {
        0f64
    }
}
///Contains an ordered list of Entries.  Used in Sequence Container
#[derive(Debug, Deserialize, Serialize)]
pub struct EntryListType {
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<EntryListTypeContent>,
}
///Contains an ordered list of Entries.  Used in Sequence Container
#[derive(Debug, Deserialize, Serialize)]
pub enum EntryListTypeContent {
    ///Specify a Parameter to be a part of this container layout definition.
    #[serde(rename = "ParameterRefEntry")]
    ParameterRefEntry(ParameterRefEntryType),
    ///Specify a portion of a Parameter to be a part of this container layout definition.  This is used when the Parameter is reported in fractional parts in the container before being fully updated.
    #[serde(rename = "ParameterSegmentRefEntry")]
    ParameterSegmentRefEntry(ParameterSegmentRefEntryType),
    ///Specify the content of another Container to be a part of this container layout definition.
    #[serde(rename = "ContainerRefEntry")]
    ContainerRefEntry(ContainerRefEntryType),
    ///Specify a portion of another Container to be a part of this container layout definition.
    #[serde(rename = "ContainerSegmentRefEntry")]
    ContainerSegmentRefEntry(ContainerSegmentRefEntryType),
    ///Specify a portion of a Stream to be a part of this container layout definition.
    #[serde(rename = "StreamSegmentEntry")]
    StreamSegmentEntry(StreamSegmentEntryType),
    ///Specify a previous (not last reported) value of a Parmeter to be a part of this container layout definition.
    #[serde(rename = "IndirectParameterRefEntry")]
    IndirectParameterRefEntry(IndirectParameterRefEntryType),
    ///Specify an Array Type Parameter to be a part of this container layout definition when the Container does not populate the entire space of the Array contents.  If the entire space of the Array is populated, a tolerant implementation will accept ParameterRefEntry also.
    #[serde(rename = "ArrayParameterRefEntry")]
    ArrayParameterRefEntry(ArrayParameterRefEntryType),
}
///Describes an enumerated argument type.  The enumeration list consists of label/value pairs. See EnumerationListType, IntegerDataEncodingType and EnumeratedDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumeratedArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Use the label, it must be in the enumeration list to be valid.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<EnumeratedArgumentTypeContent>,
}
///Describes an enumerated argument type.  The enumeration list consists of label/value pairs. See EnumerationListType, IntegerDataEncodingType and EnumeratedDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum EnumeratedArgumentTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
    ///Unordered list of label/value pairs where values cannot be duplicated.
    #[serde(rename = "EnumerationList")]
    EnumerationList(EnumerationListType),
}
///Describes an enumerated parameter type.  The enumeration list consists of label/value pairs. See EnumerationListType, EnumeratedParameterType and EnumeratedArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumeratedDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Use the label, it must be in the enumeration list to be valid.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<EnumeratedDataTypeContent>,
}
///Describes an enumerated parameter type.  The enumeration list consists of label/value pairs. See EnumerationListType, EnumeratedParameterType and EnumeratedArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub enum EnumeratedDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///Unordered list of label/value pairs where values cannot be duplicated.
    #[serde(rename = "EnumerationList")]
    EnumerationList(EnumerationListType),
}
///Describe an enumerated parameter type.  The enumeration list consists of label/value pairs. See EnumerationListType, IntegerDataEncodingType and EnumeratedDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumeratedParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Use the label, it must be in the enumeration list to be valid.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<EnumeratedParameterTypeContent>,
}
///Describe an enumerated parameter type.  The enumeration list consists of label/value pairs. See EnumerationListType, IntegerDataEncodingType and EnumeratedDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum EnumeratedParameterTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///Unordered list of label/value pairs where values cannot be duplicated.
    #[serde(rename = "EnumerationList")]
    EnumerationList(EnumerationListType),
    ///Describe labels for this parameter that should be in an alarm state.  The default definition applies when there are no context alarm definitions or all the context alarm definitions evaluate to false in their matching criteria.
    #[serde(rename = "DefaultAlarm")]
    DefaultAlarm(EnumerationAlarmType),
    ///Describe labels for this parameter that should be in an alarm state when another parameter and value combination evaluates to true using the described matching criteria.
    #[serde(rename = "ContextAlarmList")]
    ContextAlarmList(EnumerationContextAlarmListType),
}
///Describe an alarm level and its enumeration label to trigger from. See EnumeratedAlarmType and EnumeratedParameterType.
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumerationAlarmLevelType {
    ///Defines six levels: Normal, Watch, Warning, Distress, Critical and Severe. Typical implementations color the "normal" level as green, "warning" level as yellow, and "critical" level as red. In the case of enumeration alarms, the "normal" is assumed by implementations to be any label not otherwise in an alarm state.
    #[serde(rename = "@alarmLevel")]
    pub alarm_level: ConcernLevelsType,
    ///The enumeration label is the engineering/calibrated value for enumerated types.
    #[serde(rename = "@enumerationLabel")]
    pub enumeration_label: super::xs::StringType,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumerationAlarmListType {
    ///Describe an alarm state for an enumeration label where the label is engineer/calibrated value. Note that labels may represent multiple raw/uncalbrated values.
    #[serde(default, rename = "EnumerationAlarm")]
    pub enumeration_alarm: ::std::vec::Vec<EnumerationAlarmLevelType>,
}
///Describe alarm conditions specific to the enumeration data type, extends the basic AlarmType with an EnumerationAlarmList. The alarms are described using the label (engineering/calibrated value) of the enumerated parameter. Enumeration labels may represent several raw/uncalibrated values, so as a result, a single alarm definition here may represent multiple raw values in the enumerated parameter. It is not necessary to define an alarm for raw/uncalibrated values that do not map to an enumeration. Implementations should implicitly define this as an alarm case, of which the manifestation of that is program/implementation specific. See EnumeratedParameterType.
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumerationAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "EnumerationAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "EnumerationAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "EnumerationAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    ///Alarm state name for when no enumeration alarms evaluate to true. This defaults to "normal", which is almost always the case. Setting it to another alarm state permits a form of "inverted logic" where the alarm list can specify the normal states instead of the alarm states.
    #[serde(
        default = "EnumerationAlarmType::default_default_alarm_level",
        rename = "@defaultAlarmLevel"
    )]
    pub default_alarm_level: ConcernLevelsType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<EnumerationAlarmTypeContent>,
}
///Describe alarm conditions specific to the enumeration data type, extends the basic AlarmType with an EnumerationAlarmList. The alarms are described using the label (engineering/calibrated value) of the enumerated parameter. Enumeration labels may represent several raw/uncalibrated values, so as a result, a single alarm definition here may represent multiple raw values in the enumerated parameter. It is not necessary to define an alarm for raw/uncalibrated values that do not map to an enumeration. Implementations should implicitly define this as an alarm case, of which the manifestation of that is program/implementation specific. See EnumeratedParameterType.
#[derive(Debug, Deserialize, Serialize)]
pub enum EnumerationAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    ///List of alarm state definitions for this enumerated type.
    #[serde(rename = "EnumerationAlarmList")]
    EnumerationAlarmList(EnumerationAlarmListType),
}
impl EnumerationAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_default_alarm_level() -> ConcernLevelsType {
        ConcernLevelsType::Normal
    }
}
///Describe an ordered collection of context enumeration alarms, duplicates are valid. Process the contexts in list order. See EnumerationContextAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumerationContextAlarmListType {
    ///A Context contains a new alarm definition and a context match.  The match takes precedence over any default alarm when the first in the overall list evaluates to true.  It is also possible the alarm definition is empty, in which case the context means no alarm defined when the match is true.
    #[serde(default, rename = "ContextAlarm")]
    pub context_alarm: ::std::vec::Vec<EnumerationContextAlarmType>,
}
///Describe a context that when true the alarm condition may be evaluated. See ContextMatchType and EnumerationAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumerationContextAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "EnumerationContextAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "EnumerationContextAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(
        default = "EnumerationContextAlarmType::default_disabled",
        rename = "@disabled"
    )]
    pub disabled: super::xs::BooleanType,
    ///Alarm state name for when no enumeration alarms evaluate to true. This defaults to "normal", which is almost always the case. Setting it to another alarm state permits a form of "inverted logic" where the alarm list can specify the normal states instead of the alarm states.
    #[serde(
        default = "EnumerationContextAlarmType::default_default_alarm_level",
        rename = "@defaultAlarmLevel"
    )]
    pub default_alarm_level: ConcernLevelsType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<EnumerationContextAlarmTypeContent>,
}
///Describe a context that when true the alarm condition may be evaluated. See ContextMatchType and EnumerationAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub enum EnumerationContextAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    ///List of alarm state definitions for this enumerated type.
    #[serde(rename = "EnumerationAlarmList")]
    EnumerationAlarmList(EnumerationAlarmListType),
    ///Describe a context in terms of a parameter and value that when true enables the context alarm definition.
    #[serde(rename = "ContextMatch")]
    ContextMatch(ContextMatchType),
}
impl EnumerationContextAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_default_alarm_level() -> ConcernLevelsType {
        ConcernLevelsType::Normal
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct EnumerationListType {
    #[serde(default, rename = "Enumeration")]
    pub enumeration: ::std::vec::Vec<ValueEnumerationType>,
}
///Union values of common epoch definitions for document convenience.
#[derive(Debug, Deserialize, Serialize)]
pub enum EpochTimeEnumsType {
    #[serde(rename = "TAI")]
    Tai,
    #[serde(rename = "J2000")]
    J2000,
    #[serde(rename = "UNIX")]
    Unix,
    #[serde(rename = "GPS")]
    Gps,
}
///Epochs may be specified as an xs date where time is implied to be 00:00:00, xs dateTime, or string enumeration of common epochs.  The enumerations are TAI (used by CCSDS and others), J2000, UNIX (also known as POSIX), and GPS.
#[derive(Debug, Deserialize_enum_str, Serialize_enum_str)]
pub enum EpochType {
    #[serde(rename = "TAI")]
    Tai,
    #[serde(rename = "J2000")]
    J2000,
    #[serde(rename = "UNIX")]
    Unix,
    #[serde(rename = "GPS")]
    Gps,
    #[serde(other)]
    String(::std::string::String),
}
///Describe CRC, Checksum, Parity, or XOR for error detection and correction algorithm calculation.  See CRCType, ChecksumType, ParityType, and XORType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ErrorDetectCorrectType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ErrorDetectCorrectTypeContent>,
}
///Describe CRC, Checksum, Parity, or XOR for error detection and correction algorithm calculation.  See CRCType, ChecksumType, ParityType, and XORType.
#[derive(Debug, Deserialize, Serialize)]
pub enum ErrorDetectCorrectTypeContent {
    ///Describe checksum or hash function applied to all or part of this container definition.
    #[serde(rename = "Checksum")]
    Checksum(ChecksumType),
    ///Describe a Cyclic Redundancy Check (CRC) algorithm applied to all or part of this container definition.
    #[serde(rename = "CRC")]
    Crc(CrcType),
    ///Describe an "exclusive or" (XOR) checksum applied to all or part of this container definition.
    #[serde(rename = "XOR")]
    Xor(XorType),
    ///Describe a parity applied to all or part of this container definition.
    #[serde(rename = "Parity")]
    Parity(ParityType),
}
///A verifier that indicates that the command is being executed.  An optional Element indicates how far along the command has progressed either as a fixed value or an (possibly scaled) ParameterInstance value.
#[derive(Debug, Deserialize, Serialize)]
pub struct ExecutionVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<ExecutionVerifierTypeContent>,
}
///A verifier that indicates that the command is being executed.  An optional Element indicates how far along the command has progressed either as a fixed value or an (possibly scaled) ParameterInstance value.
#[derive(Debug, Deserialize, Serialize)]
pub enum ExecutionVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
    #[serde(rename = "PercentComplete")]
    PercentComplete(PercentCompleteType),
}
///Defines a reference to a named object where array and aggregate are possibilities, but path is not a possibility.  This is used by the argumentName attribute within the ArgumentAssignment element and ArgumentRef variations.
pub type ExpandedNameReferenceNoPathType = ::std::string::String;
///Defines a reference that can include a path to a named object where array and aggregate are possible.  The named must be of schema type NameType.  All name references use a Unix style file system name format where the SpaceSystem names form a path in the SpaceSystem tree. The following characters are reserved for the path: '/', '..' and '.' (multiple consecutive '/'s are treated as one).  The path portion is similar to the directory path used in file system names and the path characters have similar meaning (e.g., SimpleSat/Bus/EPDS/BatteryOne/Voltage). There are three overall forms for name references:  absolute path, relative path and just the name.  The first two forms are called qualified name references; the last form is called an unqualified name reference.  The unqualified form refers to an item in the SpaceSystem the reference is used in.  The unqualified form refers to an item in the SpaceSystem the reference is used in.  All name references must resolve to a named item (i.e. no dangling name references).  This is used by the ParameterRef variations.
pub type ExpandedNameReferenceWithPathType = ::std::string::String;
#[derive(Debug, Deserialize, Serialize)]
pub struct ExternalAlgorithmSetType {
    #[serde(default, rename = "ExternalAlgorithm")]
    pub external_algorithm: ::std::vec::Vec<ExternalAlgorithmType>,
}
///This is the external algorithm.  Multiple entries are provided so that the same database may be used for multiple implementation s
#[derive(Debug, Deserialize, Serialize)]
pub struct ExternalAlgorithmType {
    #[serde(rename = "@implementationName")]
    pub implementation_name: super::xs::StringType,
    #[serde(rename = "@algorithmLocation")]
    pub algorithm_location: super::xs::StringType,
}
///When true, indicates that the command failed.  timeToWait is how long to wait for the FailedVerifier to test true.
#[derive(Debug, Deserialize, Serialize)]
pub struct FailedVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<FailedVerifierTypeContent>,
}
///When true, indicates that the command failed.  timeToWait is how long to wait for the FailedVerifier to test true.
#[derive(Debug, Deserialize, Serialize)]
pub enum FailedVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
    #[serde(rename = "ReturnParmRef")]
    ReturnParmRef(ParameterRefType),
}
///For streams that contain a series of frames with a fixed frame length where the frames are found by looking for a marker in the data.  This marker is sometimes called the frame sync pattern and sometimes the Asynchronous Sync Marker (ASM).  This marker need not be contiguous although it usually is.
#[derive(Debug, Deserialize, Serialize)]
pub struct FixedFrameStreamType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@bitRateInBPS")]
    pub bit_rate_in_bps: ::core::option::Option<super::xs::DoubleType>,
    #[serde(default = "FixedFrameStreamType::default_pcm_type", rename = "@pcmType")]
    pub pcm_type: PcmType,
    #[serde(default = "FixedFrameStreamType::default_inverted", rename = "@inverted")]
    pub inverted: super::xs::BooleanType,
    ///Allowed slip (in bits) in either direction for the sync pattern
    #[serde(
        default = "FixedFrameStreamType::default_sync_aperture_in_bits",
        rename = "@syncApertureInBits"
    )]
    pub sync_aperture_in_bits: NonNegativeLongType,
    #[serde(rename = "@frameLengthInBits")]
    pub frame_length_in_bits: super::xs::LongType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<FixedFrameStreamTypeContent>,
}
///For streams that contain a series of frames with a fixed frame length where the frames are found by looking for a marker in the data.  This marker is sometimes called the frame sync pattern and sometimes the Asynchronous Sync Marker (ASM).  This marker need not be contiguous although it usually is.
#[derive(Debug, Deserialize, Serialize)]
pub enum FixedFrameStreamTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///This Container (usually abstract) is the container that is in the fixed frame stream.  Normally, this is a general container type from which many specific containers are inherited.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    #[serde(rename = "ServiceRef")]
    ServiceRef(ServiceRefType),
    ///This is a reference to a connecting stream - say a custom stream.
    #[serde(rename = "StreamRef")]
    StreamRef(StreamRefType),
    #[serde(rename = "SyncStrategy")]
    SyncStrategy(FixedFrameSyncStrategyType),
}
impl FixedFrameStreamType {
    #[must_use]
    pub fn default_pcm_type() -> PcmType {
        PcmType::Nrzl
    }
    #[must_use]
    pub fn default_inverted() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_sync_aperture_in_bits() -> NonNegativeLongType {
        0i64
    }
}
///Describe a sync pattern and an optional reference to an algorithm used to invert the stream if the frame sync pattern is not found. See FixedFrameStreamType.
#[derive(Debug, Deserialize, Serialize)]
pub struct FixedFrameSyncStrategyType {
    #[serde(
        default = "FixedFrameSyncStrategyType::default_verify_to_lock_good_frames",
        rename = "@verifyToLockGoodFrames"
    )]
    pub verify_to_lock_good_frames: NonNegativeLongType,
    #[serde(
        default = "FixedFrameSyncStrategyType::default_check_to_lock_good_frames",
        rename = "@checkToLockGoodFrames"
    )]
    pub check_to_lock_good_frames: NonNegativeLongType,
    ///Maximum number of bit errors in the sync pattern (marker).
    #[serde(
        default = "FixedFrameSyncStrategyType::default_max_bit_errors_in_sync_pattern",
        rename = "@maxBitErrorsInSyncPattern"
    )]
    pub max_bit_errors_in_sync_pattern: NonNegativeLongType,
    #[serde(default, rename = "AutoInvert")]
    pub auto_invert: ::core::option::Option<AutoInvertType>,
    ///The pattern of bits used to look for frame synchronization.  See SyncPatternType.
    #[serde(rename = "SyncPattern")]
    pub sync_pattern: SyncPatternType,
}
impl FixedFrameSyncStrategyType {
    #[must_use]
    pub fn default_verify_to_lock_good_frames() -> NonNegativeLongType {
        4i64
    }
    #[must_use]
    pub fn default_check_to_lock_good_frames() -> NonNegativeLongType {
        1i64
    }
    #[must_use]
    pub fn default_max_bit_errors_in_sync_pattern() -> NonNegativeLongType {
        0i64
    }
}
///A simple union type combining integer, octal, binary, and hexadecimal types
#[derive(Debug, Deserialize, Serialize)]
pub enum FixedIntegerValueType {
    I32(::core::primitive::i32),
    String(::std::string::String),
}
#[derive(Debug, Deserialize, Serialize)]
pub enum FlagBitType {
    #[serde(rename = "zeros")]
    Zeros,
    #[serde(rename = "ones")]
    Ones,
}
///The pattern of bits used to look for frame synchronization.
#[derive(Debug, Deserialize, Serialize)]
pub struct FlagType {
    #[serde(default = "FlagType::default_flag_size_in_bits", rename = "@flagSizeInBits")]
    pub flag_size_in_bits: PositiveLongType,
    #[serde(default = "FlagType::default_flag_bit_type", rename = "@flagBitType")]
    pub flag_bit_type: FlagBitType,
}
impl FlagType {
    #[must_use]
    pub fn default_flag_size_in_bits() -> PositiveLongType {
        6i64
    }
    #[must_use]
    pub fn default_flag_bit_type() -> FlagBitType {
        FlagBitType::Ones
    }
}
///Describe a floating point argument type.  Several encodings are supported.  Calibrated integer to float relationships should be described with this data type. Use the data encoding to define calibrators.  Joins integer as one of the numerics. See FloatDataEncodingType, IntegerDataEncodingType and FloatDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct FloatArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DoubleType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally.  Generally this can be determined by examination of the space required to capture the full range of the encoding, but it is not always clear when calibrators are in use.  A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible values.
    #[serde(default = "FloatArgumentType::default_size_in_bits", rename = "@sizeInBits")]
    pub size_in_bits: FloatSizeInBitsType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<FloatArgumentTypeContent>,
}
///Describe a floating point argument type.  Several encodings are supported.  Calibrated integer to float relationships should be described with this data type. Use the data encoding to define calibrators.  Joins integer as one of the numerics. See FloatDataEncodingType, IntegerDataEncodingType and FloatDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum FloatArgumentTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
    ///This element provides the implementation with assistance rendering the value as a string for users.
    #[serde(rename = "ToString")]
    ToString(ToStringType),
    ///Provides additional platform/program specific ranging information.
    #[serde(rename = "ValidRangeSet")]
    ValidRangeSet(ValidFloatRangeSetType),
}
impl FloatArgumentType {
    #[must_use]
    pub fn default_size_in_bits() -> FloatSizeInBitsType {
        FloatSizeInBitsType::_32
    }
}
///For common encodings of floating point data
#[derive(Debug, Deserialize, Serialize)]
pub struct FloatDataEncodingType {
    ///Describes the bit ordering of the encoded value.
    #[serde(default = "FloatDataEncodingType::default_bit_order", rename = "@bitOrder")]
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    #[serde(
        default = "FloatDataEncodingType::default_byte_order",
        rename = "@byteOrder"
    )]
    pub byte_order: ByteOrderType,
    ///Specifies real/decimal numeric value to raw encoding method, with the default being "IEEE754_1985".
    #[serde(default = "FloatDataEncodingType::default_encoding", rename = "@encoding")]
    pub encoding: FloatEncodingType,
    ///Number of bits to use for the float raw encoding method, with 32 being the default.  Not every number of bits is valid for each encoding method.
    #[serde(
        default = "FloatDataEncodingType::default_size_in_bits",
        rename = "@sizeInBits"
    )]
    pub size_in_bits: FloatEncodingSizeInBitsType,
    ///A changeThreshold may optionally be specified to inform systems of the minimum change in value that is significant.  This is used by some systems to limit the telemetry processing and/or recording requirements. If the value is unspecified or zero, any change is significant.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@changeThreshold")]
    pub change_threshold: ::core::option::Option<super::xs::DoubleType>,
    ///DEPRECATED: Use the ErrorDetectCorrect element in the container elements instead.
    #[serde(default, rename = "ErrorDetectCorrect")]
    pub error_detect_correct: ::core::option::Option<ErrorDetectCorrectType>,
    ///Calibrator to be applied to the raw uncalibrated value to arrive at the engineering/calibrated value when no Context Calibrators are provided or evaluate to true, based on their MatchCriteria.
    #[serde(default, rename = "DefaultCalibrator")]
    pub default_calibrator: ::core::option::Option<CalibratorType>,
    ///Calibrator to be applied to the raw uncalibrated value to arrive at the engineering/calibrated value when a MatchCriteria evaluates to true.  The first in the list to match takes precedence.
    #[serde(default, rename = "ContextCalibratorList")]
    pub context_calibrator_list: ::core::option::Option<ContextCalibratorListType>,
}
impl FloatDataEncodingType {
    #[must_use]
    pub fn default_bit_order() -> BitOrderType {
        BitOrderType::MostSignificantBitFirst
    }
    #[must_use]
    pub fn default_byte_order() -> ByteOrderType {
        ByteOrderType::MostSignificantByteFirst
    }
    #[must_use]
    pub fn default_encoding() -> FloatEncodingType {
        FloatEncodingType::Ieee7541985
    }
    #[must_use]
    pub fn default_size_in_bits() -> FloatEncodingSizeInBitsType {
        FloatEncodingSizeInBitsType::_32
    }
}
///A base schema type for describing a floating point engineering/calibrated data type. Several encodings are supported.  Calibrated integer to float relationships should be described with this data type. Use the data encoding to define calibrators.  Joins integer as one of the numerics. See BaseDataType, FloatParameterType and FloatArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub struct FloatDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Initial value is always given in calibrated form
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DoubleType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally.  Generally this can be determined by examination of the space required to capture the full range of the encoding, but it is not always clear when calibrators are in use.  A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible values.
    #[serde(default = "FloatDataType::default_size_in_bits", rename = "@sizeInBits")]
    pub size_in_bits: FloatSizeInBitsType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<FloatDataTypeContent>,
}
///A base schema type for describing a floating point engineering/calibrated data type. Several encodings are supported.  Calibrated integer to float relationships should be described with this data type. Use the data encoding to define calibrators.  Joins integer as one of the numerics. See BaseDataType, FloatParameterType and FloatArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub enum FloatDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///This element provides the implementation with assistance rendering the value as a string for users.
    #[serde(rename = "ToString")]
    ToString(ToStringType),
    ///The ValidRange defines the span of valid values for this data type.  This is a subset within the data type itself.  For example, an IEEE754 encoded float has almost a universal of possible values.  However, the known possible valid range may only span -180.0 to +180.0, due to the physics of the measurement.  So, the valid range provides additional boundary/constraint information beyond that of the data encoding in the range of possible values that are meaningful to this parameter.  The valid range is not to be construed as an alarm definition and is not affected by any alarm definitions, instead violations of the valid range make a parameter value "unreasonable", as opposed to reasonable to be reported.  The exact effect of this state which should be of concern is implementation dependent.
    #[serde(rename = "ValidRange")]
    ValidRange(FloatDataTypeValidRange),
}
impl FloatDataType {
    #[must_use]
    pub fn default_size_in_bits() -> FloatSizeInBitsType {
        FloatSizeInBitsType::_32
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub enum FloatEncodingSizeInBitsType {
    ///At the time of this writing, 16 bit encoding size is only valid in cases of IEEE754 and vendor specific MILSTD_1750A variation that is not a part of the standard.  This is not meant to preclude use in the event that future floating point formats may also define this value.
    #[serde(rename = "16")]
    _16,
    ///At the time of this writing, 32 bit encoding size is only valid in cases of IEEE754_1985, IEEE754, MILSTD_1750A, DEC, IBM, and TI.  This is not meant to preclude use in the event that future floating point formats may also define this value.  The IEEE754 enumeration and the IEEE754_1985 enumeration are allowed in this case and the interpretation is the same.
    #[serde(rename = "32")]
    _32,
    ///At the time of this writing, 40 bit encoding size is only valid in the case of TI.  This is not meant to preclude use in the event that future floating point formats may also define this value.
    #[serde(rename = "40")]
    _40,
    ///At the time of this writing, 48 bit encoding size is only valid in the case of MILSTD_1750A.  This is not meant to preclude use in the event that future floating point formats may also define this value.
    #[serde(rename = "48")]
    _48,
    ///At the time of this writing, 64 bit encoding size is only valid in cases of IEEE754_1985, IEEE754, DEC, and IBM.  This is not meant to preclude use in the event that future floating point formats may also define this value.  The IEEE754 enumeration and the IEEE754_1985 enumeration are allowed in this case and the interpretation is the same.
    #[serde(rename = "64")]
    _64,
    ///At the time of this writing, 80 bit encoding size is only valid in the case of IEEE754_1985.  This is not meant to preclude use in the event that future floating point formats may also define this value.
    #[serde(rename = "80")]
    _80,
    ///At the time of this writing, 128 bit encoding size is only valid in the case of IEEE754_1985 and IEEE754.  This is not meant to preclude use in the event that future floating point formats may also define this value.  The IEEE754 enumeration and the IEEE754_1985 enumeration are allowed in this case and the interpretation is the same.
    #[serde(rename = "128")]
    _128,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum FloatEncodingType {
    #[serde(rename = "IEEE754_1985")]
    Ieee7541985,
    #[serde(rename = "IEEE754")]
    Ieee754,
    #[serde(rename = "MILSTD_1750A")]
    Milstd1750A,
    #[serde(rename = "DEC")]
    Dec,
    #[serde(rename = "IBM")]
    Ibm,
    #[serde(rename = "TI")]
    Ti,
}
///Describe a floating point parameter type.  Several encodings are supported.  Calibrated integer to float relationships should be described with this data type. Use the data encoding to define calibrators.  Joins integer as one of the numerics. See FloatDataEncodingType, IntegerDataEncodingType and FloatDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct FloatParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Initial value is always given in calibrated form
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DoubleType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally.  Generally this can be determined by examination of the space required to capture the full range of the encoding, but it is not always clear when calibrators are in use.  A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible values.
    #[serde(
        default = "FloatParameterType::default_size_in_bits",
        rename = "@sizeInBits"
    )]
    pub size_in_bits: FloatSizeInBitsType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<FloatParameterTypeContent>,
}
///Describe a floating point parameter type.  Several encodings are supported.  Calibrated integer to float relationships should be described with this data type. Use the data encoding to define calibrators.  Joins integer as one of the numerics. See FloatDataEncodingType, IntegerDataEncodingType and FloatDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum FloatParameterTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///This element provides the implementation with assistance rendering the value as a string for users.
    #[serde(rename = "ToString")]
    ToString(ToStringType),
    ///The ValidRange defines the span of valid values for this data type.  This is a subset within the data type itself.  For example, an IEEE754 encoded float has almost a universal of possible values.  However, the known possible valid range may only span -180.0 to +180.0, due to the physics of the measurement.  So, the valid range provides additional boundary/constraint information beyond that of the data encoding in the range of possible values that are meaningful to this parameter.  The valid range is not to be construed as an alarm definition and is not affected by any alarm definitions, instead violations of the valid range make a parameter value "unreasonable", as opposed to reasonable to be reported.  The exact effect of this state which should be of concern is implementation dependent.
    #[serde(rename = "ValidRange")]
    ValidRange(FloatDataTypeValidRange),
    ///Default alarm definitions are those which do not adjust definition logic based on the value of other parameters.  Other parameters may participate in the determination of an alarm condition for this parameter, but the definition logic of the alarm on this parameter is constant.  If the alarming logic on this parameter changes based on the value of other parameters, then it is a ContextAlarm and belongs in the ContextAlarmList element.
    #[serde(rename = "DefaultAlarm")]
    DefaultAlarm(NumericAlarmType),
    ///Context alarm definitions are those which adjust the definition logic for this parameter based on the value of other parameters.  A context which evaluates to being in effect, based on the testing of another parameter, takes precedence over the default alarms in the DefaultAlarm element.  If the no context alarm evaluates to being in effect, based on the testing of another parameter, then the default alarm definitions from the DefaultAlarm element will remain in effect.  If multiple contexts evaluate to being in effect, then the first one that appears will take precedence.
    #[serde(rename = "ContextAlarmList")]
    ContextAlarmList(NumericContextAlarmListType),
}
impl FloatParameterType {
    #[must_use]
    pub fn default_size_in_bits() -> FloatSizeInBitsType {
        FloatSizeInBitsType::_32
    }
}
///Describe a floating point based range, several types of ranges are supported -- one sided and two sided, inclusive or exclusive.  It would not make sense to set two mins or maxes. Used in a number of locations related to ranges: ValidFloatRangeSetType or AlarmRangeType for example.
#[derive(Debug, Deserialize, Serialize)]
pub struct FloatRangeType {
    ///Minimum decimal/real number value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minInclusive")]
    pub min_inclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Minimum decimal/real number value excluding itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minExclusive")]
    pub min_exclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Maximum decimal/real number value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxInclusive")]
    pub max_inclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Maximum decimal/real number value excluding itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxExclusive")]
    pub max_exclusive: ::core::option::Option<super::xs::DoubleType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum FloatSizeInBitsType {
    #[serde(rename = "32")]
    _32,
    #[serde(rename = "64")]
    _64,
    #[serde(rename = "128")]
    _128,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum FloatingPointNotationType {
    #[serde(rename = "normal")]
    Normal,
    #[serde(rename = "scientific")]
    Scientific,
    #[serde(rename = "engineering")]
    Engineering,
}
///The top level type definition for all data streams that are frame based.
#[derive(Debug, Deserialize, Serialize)]
pub struct FrameStreamType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@bitRateInBPS")]
    pub bit_rate_in_bps: ::core::option::Option<super::xs::DoubleType>,
    #[serde(default = "FrameStreamType::default_pcm_type", rename = "@pcmType")]
    pub pcm_type: PcmType,
    #[serde(default = "FrameStreamType::default_inverted", rename = "@inverted")]
    pub inverted: super::xs::BooleanType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<FrameStreamTypeContent>,
}
///The top level type definition for all data streams that are frame based.
#[derive(Debug, Deserialize, Serialize)]
pub enum FrameStreamTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///This Container (usually abstract) is the container that is in the fixed frame stream.  Normally, this is a general container type from which many specific containers are inherited.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    #[serde(rename = "ServiceRef")]
    ServiceRef(ServiceRefType),
    ///This is a reference to a connecting stream - say a custom stream.
    #[serde(rename = "StreamRef")]
    StreamRef(StreamRefType),
}
impl FrameStreamType {
    #[must_use]
    pub fn default_pcm_type() -> PcmType {
        PcmType::Nrzl
    }
    #[must_use]
    pub fn default_inverted() -> super::xs::BooleanType {
        false
    }
}
///Schema for a Header record.  A header contains general information about the system or subsystem.
#[derive(Debug, Deserialize, Serialize)]
pub struct HeaderType {
    ///This attribute contains an optional version descriptor for this document.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@version")]
    pub version: ::core::option::Option<super::xs::StringType>,
    ///This attribute contains an optional date to be associated with this document.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@date")]
    pub date: ::core::option::Option<super::xs::StringType>,
    ///This attribute contains optional classification status for use by programs for which that is applicable.
    #[serde(default = "HeaderType::default_classification", rename = "@classification")]
    pub classification: super::xs::StringType,
    ///This attribute contains an optional additional instructions attribute to be interpreted by programs that use this attribute.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@classificationInstructions")]
    pub classification_instructions: ::core::option::Option<super::xs::StringType>,
    ///This attribute contains a flag describing the state of this document in the evolution of the project using it.
    #[serde(rename = "@validationStatus")]
    pub validation_status: ValidationStatusType,
    ///The AuthorSet contains optional contact information for this document.
    #[serde(default, rename = "AuthorSet")]
    pub author_set: ::core::option::Option<AuthorSetType>,
    ///The NoteSet contains optional technical information related to the content of this document.
    #[serde(default, rename = "NoteSet")]
    pub note_set: ::core::option::Option<NoteSetType>,
    ///The HistorySet contains optional evolutionary information for data contained in this document.
    #[serde(default, rename = "HistorySet")]
    pub history_set: ::core::option::Option<HistorySetType>,
}
impl HeaderType {
    #[must_use]
    pub fn default_classification() -> super::xs::StringType {
        ::std::string::String::from("NotClassified")
    }
}
///A simple restriction on string for hexadecimal numbers.  Must be in 0x or 0X form.
pub type HexadecimalType = ::std::string::String;
///Describe an unordered collection of History elements.  Usage is user defined.  See HistoryType.
#[derive(Debug, Deserialize, Serialize)]
pub struct HistorySetType {
    ///Contains a history record related to the evolution of this document.
    #[serde(default, rename = "History")]
    pub history: ::std::vec::Vec<HistoryType>,
}
pub type HistoryType = ::std::string::String;
///An entry whose name is given by the value of a ParamameterInstance.  This entry may be used to implement dwell telemetry streams.  The value of the parameter in ParameterInstance must use either the name of the Parameter or its alias.  If it's an alias name, the alias namespace is supplied as an attribute.
#[derive(Debug, Deserialize, Serialize)]
pub struct IndirectParameterRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@aliasNameSpace")]
    pub alias_name_space: ::core::option::Option<super::xs::StringType>,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        LocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<RepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<MatchCriteriaType>,
    ///Optional timing information associated with this entry.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
    ///Optional ancillary data associated with this element.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(rename = "ParameterInstance")]
    pub parameter_instance: ParameterInstanceRefType,
}
///A set of labeled inputs is added to the SimpleAlgorithmType
#[derive(Debug, Deserialize, Serialize)]
pub struct InputAlgorithmType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "AlgorithmText")]
    pub algorithm_text: ::core::option::Option<AlgorithmTextType>,
    #[serde(default, rename = "ExternalAlgorithmSet")]
    pub external_algorithm_set: ::core::option::Option<ExternalAlgorithmSetType>,
    ///The InputSet describes the list of parameters that should be made available as input arguments to the algorithm.
    #[serde(default, rename = "InputSet")]
    pub input_set: ::core::option::Option<InputSetType>,
}
///A set of labeled outputs are added to the SimpleInputAlgorithmType
#[derive(Debug, Deserialize, Serialize)]
pub struct InputOutputAlgorithmType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(default = "InputOutputAlgorithmType::default_thread", rename = "@thread")]
    pub thread: super::xs::BooleanType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "AlgorithmText")]
    pub algorithm_text: ::core::option::Option<AlgorithmTextType>,
    #[serde(default, rename = "ExternalAlgorithmSet")]
    pub external_algorithm_set: ::core::option::Option<ExternalAlgorithmSetType>,
    ///The InputSet describes the list of parameters that should be made available as input arguments to the algorithm.
    #[serde(default, rename = "InputSet")]
    pub input_set: ::core::option::Option<InputSetType>,
    #[serde(default, rename = "OutputSet")]
    pub output_set: ::core::option::Option<OutputSetType>,
}
impl InputOutputAlgorithmType {
    #[must_use]
    pub fn default_thread() -> super::xs::BooleanType {
        false
    }
}
///Input output algorithm is extended with a set of labeled triggers. See InputOutputAlgorithmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct InputOutputTriggerAlgorithmType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(
        default = "InputOutputTriggerAlgorithmType::default_thread",
        rename = "@thread"
    )]
    pub thread: super::xs::BooleanType,
    ///First telemetry container from which the output parameter should be calculated.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@triggerContainer")]
    pub trigger_container: ::core::option::Option<NameReferenceWithPathType>,
    ///Algorithm processing priority. If more than one algorithm is triggered by the same container, the lowest priority algorithm should be calculated first.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@priority")]
    pub priority: ::core::option::Option<super::xs::IntType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "AlgorithmText")]
    pub algorithm_text: ::core::option::Option<AlgorithmTextType>,
    #[serde(default, rename = "ExternalAlgorithmSet")]
    pub external_algorithm_set: ::core::option::Option<ExternalAlgorithmSetType>,
    ///The InputSet describes the list of parameters that should be made available as input arguments to the algorithm.
    #[serde(default, rename = "InputSet")]
    pub input_set: ::core::option::Option<InputSetType>,
    #[serde(default, rename = "OutputSet")]
    pub output_set: ::core::option::Option<OutputSetType>,
    #[serde(default, rename = "TriggerSet")]
    pub trigger_set: ::core::option::Option<TriggerSetType>,
}
impl InputOutputTriggerAlgorithmType {
    #[must_use]
    pub fn default_thread() -> super::xs::BooleanType {
        false
    }
}
///Names an input parameter to the algorithm.  There are two attributes to InputParm, inputName and parameterName. parameterName is a parameter reference name for a parameter that will be used in this algorithm.  inputName is an optional "friendly" name for the input parameter.
#[derive(Debug, Deserialize, Serialize)]
pub struct InputParameterInstanceRefType {
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(
        default = "InputParameterInstanceRefType::default_instance",
        rename = "@instance"
    )]
    pub instance: super::xs::LongType,
    #[serde(
        default = "InputParameterInstanceRefType::default_use_calibrated_value",
        rename = "@useCalibratedValue"
    )]
    pub use_calibrated_value: super::xs::BooleanType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@inputName")]
    pub input_name: ::core::option::Option<super::xs::StringType>,
}
impl InputParameterInstanceRefType {
    #[must_use]
    pub fn default_instance() -> super::xs::LongType {
        0i64
    }
    #[must_use]
    pub fn default_use_calibrated_value() -> super::xs::BooleanType {
        true
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct InputSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<InputSetTypeContent>,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum InputSetTypeContent {
    ///Reference a parameter to serve as an input to the algorithm.
    #[serde(rename = "InputParameterInstanceRef")]
    InputParameterInstanceRef(InputParameterInstanceRefType),
    ///Supply a local constant name and value to input to this algorithm.
    #[serde(rename = "Constant")]
    Constant(ConstantType),
}
///Describes an integer argument type. Several encodings supported.  Calibrated integer to integer relationships should be described with this data type. Use the integer data encoding to define calibrators. Joins float as one of the numerics. See IntegerDataEncoding and IntegerDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct IntegerArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Specify the value as a base 10 integer.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::LongType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally.  Generally this can be determined by examination of the space required to capture the full range of the encoding, but it is not always clear when calibrators are in use.  A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible values.
    #[serde(
        default = "IntegerArgumentType::default_size_in_bits",
        rename = "@sizeInBits"
    )]
    pub size_in_bits: PositiveLongType,
    ///Flag indicating if the engineering/calibrated data type used should support signed representation.  This should not be confused with the encoding type for the raw value.  The default is true.
    #[serde(default = "IntegerArgumentType::default_signed", rename = "@signed")]
    pub signed: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<IntegerArgumentTypeContent>,
}
///Describes an integer argument type. Several encodings supported.  Calibrated integer to integer relationships should be described with this data type. Use the integer data encoding to define calibrators. Joins float as one of the numerics. See IntegerDataEncoding and IntegerDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum IntegerArgumentTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
    ///This element provides the implementation with assistance rendering the value as a string for users.
    #[serde(rename = "ToString")]
    ToString(ToStringType),
    ///Provides additional platform/program specific ranging information.
    #[serde(rename = "ValidRangeSet")]
    ValidRangeSet(ValidIntegerRangeSetType),
}
impl IntegerArgumentType {
    #[must_use]
    pub fn default_size_in_bits() -> PositiveLongType {
        32i64
    }
    #[must_use]
    pub fn default_signed() -> super::xs::BooleanType {
        true
    }
}
///For all major encodings of integer data
#[derive(Debug, Deserialize, Serialize)]
pub struct IntegerDataEncodingType {
    ///Describes the bit ordering of the encoded value.
    #[serde(
        default = "IntegerDataEncodingType::default_bit_order",
        rename = "@bitOrder"
    )]
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    #[serde(
        default = "IntegerDataEncodingType::default_byte_order",
        rename = "@byteOrder"
    )]
    pub byte_order: ByteOrderType,
    ///Specifies integer numeric value to raw encoding method, with the default being "unsigned".
    #[serde(default = "IntegerDataEncodingType::default_encoding", rename = "@encoding")]
    pub encoding: IntegerEncodingType,
    ///Number of bits to use for the raw encoding, with 8 being the default.
    #[serde(
        default = "IntegerDataEncodingType::default_size_in_bits",
        rename = "@sizeInBits"
    )]
    pub size_in_bits: PositiveLongType,
    ///A changeThreshold may optionally be specified to inform systems of the minimum change in value that is significant.  This is used by some systems to limit the telemetry processing and/or recording requirements, such as for an analog-to-digital converter that dithers in the least significant bit. If the value    is unspecified or zero, any change is significant.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@changeThreshold")]
    pub change_threshold: ::core::option::Option<NonNegativeLongType>,
    ///DEPRECATED: Use the ErrorDetectCorrect element in the container elements instead.
    #[serde(default, rename = "ErrorDetectCorrect")]
    pub error_detect_correct: ::core::option::Option<ErrorDetectCorrectType>,
    ///Calibrator to be applied to the raw uncalibrated value to arrive at the engineering/calibrated value when no Context Calibrators are provided or evaluate to true, based on their MatchCriteria.
    #[serde(default, rename = "DefaultCalibrator")]
    pub default_calibrator: ::core::option::Option<CalibratorType>,
    ///Calibrator to be applied to the raw uncalibrated value to arrive at the engineering/calibrated value when a MatchCriteria evaluates to true.  The first in the list to match takes precedence.
    #[serde(default, rename = "ContextCalibratorList")]
    pub context_calibrator_list: ::core::option::Option<ContextCalibratorListType>,
}
impl IntegerDataEncodingType {
    #[must_use]
    pub fn default_bit_order() -> BitOrderType {
        BitOrderType::MostSignificantBitFirst
    }
    #[must_use]
    pub fn default_byte_order() -> ByteOrderType {
        ByteOrderType::MostSignificantByteFirst
    }
    #[must_use]
    pub fn default_encoding() -> IntegerEncodingType {
        IntegerEncodingType::Unsigned
    }
    #[must_use]
    pub fn default_size_in_bits() -> PositiveLongType {
        8i64
    }
}
///Describe an integer engineering/calibrated data type. Several encodings are supported.  See BaseDataType, IntegerParameterType and IntegerArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub struct IntegerDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Specify the value as a base 10 integer.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::LongType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally.  Generally this can be determined by examination of the space required to capture the full range of the encoding, but it is not always clear when calibrators are in use.  A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible values.
    #[serde(default = "IntegerDataType::default_size_in_bits", rename = "@sizeInBits")]
    pub size_in_bits: PositiveLongType,
    ///Flag indicating if the engineering/calibrated data type used should support signed representation.  This should not be confused with the encoding type for the raw value.  The default is true.
    #[serde(default = "IntegerDataType::default_signed", rename = "@signed")]
    pub signed: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<IntegerDataTypeContent>,
}
///Describe an integer engineering/calibrated data type. Several encodings are supported.  See BaseDataType, IntegerParameterType and IntegerArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub enum IntegerDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///This element provides the implementation with assistance rendering the value as a string for users.
    #[serde(rename = "ToString")]
    ToString(ToStringType),
    ///The ValidRange defines the span of valid values for this data type.  This is a subset within the data type itself.  For example, a 16 bit unsigned integer has possible values from 0 to 65535.  However, the known possible valid range may only span 0 to 999, due to the physics of the measurement.  So, the valid range provides additional boundary/constraint information beyond that of the data encoding in the range of possible values that are meaningful to this parameter.  The valid range is not to be construed as an alarm definition and is not affected by any alarm definitions, instead violations of the valid range make a parameter value "unreasonable", as opposed to reasonable to be reported.  The exact effect of this state which should be of concern is implementation dependent.
    #[serde(rename = "ValidRange")]
    ValidRange(IntegerDataTypeValidRange),
}
impl IntegerDataType {
    #[must_use]
    pub fn default_size_in_bits() -> PositiveLongType {
        32i64
    }
    #[must_use]
    pub fn default_signed() -> super::xs::BooleanType {
        true
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub enum IntegerEncodingType {
    #[serde(rename = "unsigned")]
    Unsigned,
    #[serde(rename = "signMagnitude")]
    SignMagnitude,
    #[serde(rename = "twosComplement")]
    TwosComplement,
    #[serde(rename = "onesComplement")]
    OnesComplement,
    #[serde(rename = "BCD")]
    Bcd,
    #[serde(rename = "packedBCD")]
    PackedBcd,
}
///Describe an integer parameter type. Several are supported. Calibrated integer to integer relationships should be described with this data type. Use the integer data encoding to define calibrators. Joins float as one of the numerics. See IntegerDataEncoding and IntegerDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct IntegerParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Default/Initial value is always given in calibrated form.  Specify the value as a base 10 integer.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::LongType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally.  Generally this can be determined by examination of the space required to capture the full range of the encoding, but it is not always clear when calibrators are in use.  A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible values.
    #[serde(
        default = "IntegerParameterType::default_size_in_bits",
        rename = "@sizeInBits"
    )]
    pub size_in_bits: PositiveLongType,
    ///Flag indicating if the engineering/calibrated data type used should support signed representation.  This should not be confused with the encoding type for the raw value.  The default is true.
    #[serde(default = "IntegerParameterType::default_signed", rename = "@signed")]
    pub signed: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<IntegerParameterTypeContent>,
}
///Describe an integer parameter type. Several are supported. Calibrated integer to integer relationships should be described with this data type. Use the integer data encoding to define calibrators. Joins float as one of the numerics. See IntegerDataEncoding and IntegerDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum IntegerParameterTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///This element provides the implementation with assistance rendering the value as a string for users.
    #[serde(rename = "ToString")]
    ToString(ToStringType),
    ///The ValidRange defines the span of valid values for this data type.  This is a subset within the data type itself.  For example, a 16 bit unsigned integer has possible values from 0 to 65535.  However, the known possible valid range may only span 0 to 999, due to the physics of the measurement.  So, the valid range provides additional boundary/constraint information beyond that of the data encoding in the range of possible values that are meaningful to this parameter.  The valid range is not to be construed as an alarm definition and is not affected by any alarm definitions, instead violations of the valid range make a parameter value "unreasonable", as opposed to reasonable to be reported.  The exact effect of this state which should be of concern is implementation dependent.
    #[serde(rename = "ValidRange")]
    ValidRange(IntegerDataTypeValidRange),
    ///Default alarm definitions are those which do not adjust definition logic based on the value of other parameters. Other parameters may participate in the determination of an alarm condition for this parameter, but the definition logic of the alarm on this parameter is constant. If the alarming logic on this parameter changes based on the value of other parameters, then it is a ContextAlarm and belongs in the ContextAlarmList element.
    #[serde(rename = "DefaultAlarm")]
    DefaultAlarm(NumericAlarmType),
    ///Context alarm definitions are those which adjust the definition logic for this parameter based on the value of other parameters. A context which evaluates to being in effect, based on the testing of another parameter, takes precedence over the default alarms in the DefaultAlarm element. If the no context alarm evaluates to being in effect, based on the testing of another parameter, then the default alarm definitions from the DefaultAlarm element will remain in effect. If multiple contexts evaluate to being in effect, then the first one that appears will take precedence.
    #[serde(rename = "ContextAlarmList")]
    ContextAlarmList(NumericContextAlarmListType),
}
impl IntegerParameterType {
    #[must_use]
    pub fn default_size_in_bits() -> PositiveLongType {
        32i64
    }
    #[must_use]
    pub fn default_signed() -> super::xs::BooleanType {
        true
    }
}
///Describe an integral based range: minInclusive and maxInclusive. Used in a number of locations related to ranges: ValidIntegerRangeSetType for example.
#[derive(Debug, Deserialize, Serialize)]
pub struct IntegerRangeType {
    ///Minimum integer value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minInclusive")]
    pub min_inclusive: ::core::option::Option<super::xs::LongType>,
    ///Maximum integer value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxInclusive")]
    pub max_inclusive: ::core::option::Option<super::xs::LongType>,
}
///Contains an Integer value; value may be provided directly or via the value in a parameter.
#[derive(Debug, Deserialize, Serialize)]
pub enum IntegerValueType {
    ///Use a fixed integer value.
    #[serde(rename = "FixedValue")]
    FixedValue(super::xs::LongType),
    ///Determine the value by interrogating an instance of a parameter.
    #[serde(rename = "DynamicValue")]
    DynamicValue(DynamicValueType),
    ///Determine the value by interrogating an instance of a parameter and selecting a specified value based on tests of the value of that parameter.
    #[serde(rename = "DiscreteLookupList")]
    DiscreteLookupList(DiscreteLookupListType),
}
///Describe a type of constraint on the next command, rather than this command. Interlocks apply only to the next command.  An interlock will block successive commands until this command has reached a certain stage of verifier.  Interlocks are scoped to a SpaceSystem basis:  they by default apply to the SpaceSystem the MetaCommand is defined in but this may be overridden.  See MetaCommandType and VerifierSetType.
#[derive(Debug, Deserialize, Serialize)]
pub struct InterlockType {
    ///The name of a SpaceSystem this Interlock applies to.  By default, it only applies to the SpaceSystem that contains this MetaCommand.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@scopeToSpaceSystem")]
    pub scope_to_space_system: ::core::option::Option<NameReferenceWithPathType>,
    ///The verification stage of the command that releases the interlock, with the default being complete.
    #[serde(
        default = "InterlockType::default_verification_to_wait_for",
        rename = "@verificationToWaitFor"
    )]
    pub verification_to_wait_for: VerifierEnumerationType,
    ///Only applies when the verificationToWaitFor attribute is 'queued' or 'executing'.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@verificationProgressPercentage")]
    pub verification_progress_percentage: ::core::option::Option<super::xs::DoubleType>,
    ///A flag that indicates that under special circumstances, this Interlock can be suspended.
    #[serde(default = "InterlockType::default_suspendable", rename = "@suspendable")]
    pub suspendable: super::xs::BooleanType,
}
impl InterlockType {
    #[must_use]
    pub fn default_verification_to_wait_for() -> VerifierEnumerationType {
        VerifierEnumerationType::Complete
    }
    #[must_use]
    pub fn default_suspendable() -> super::xs::BooleanType {
        false
    }
}
///Like PASCAL strings, the size of the string is given as an integer at the start of the string.  SizeTag must be an unsigned Integer
#[derive(Debug, Deserialize, Serialize)]
pub struct LeadingSizeType {
    #[serde(
        default = "LeadingSizeType::default_size_in_bits_of_size_tag",
        rename = "@sizeInBitsOfSizeTag"
    )]
    pub size_in_bits_of_size_tag: PositiveLongType,
}
impl LeadingSizeType {
    #[must_use]
    pub fn default_size_in_bits_of_size_tag() -> PositiveLongType {
        16i64
    }
}
///A slope and intercept may be applied to scale or shift the value of the parameter in the dynamic value.  The default of slope=1 and intercept=0 results in no change to the value.
#[derive(Debug, Deserialize, Serialize)]
pub struct LinearAdjustmentType {
    #[serde(default = "LinearAdjustmentType::default_slope", rename = "@slope")]
    pub slope: super::xs::DoubleType,
    #[serde(default = "LinearAdjustmentType::default_intercept", rename = "@intercept")]
    pub intercept: super::xs::DoubleType,
}
impl LinearAdjustmentType {
    #[must_use]
    pub fn default_slope() -> super::xs::DoubleType {
        1f64
    }
    #[must_use]
    pub fn default_intercept() -> super::xs::DoubleType {
        0f64
    }
}
///Describe the absolute or relative bit location of an entry in a container.  The "referenceLocation" attribute specifies the starting bit anchor.  If no referenceLocation value is given, the entry is assumed to begin at the first bit position after the previous entry.  Each container starts at bit 0, thus "containerStart" is an offset from 0.  Negative container start bits are before the container and are implementation dependent - these should be flagged as likely errors.  "containerEnd" is given as a positive offset from the end of the container, thus a container end of 0 is exactly at the end of the container.  Negative container end addresses are after the container and are implementation dependent - these should be flagged as likely errors.  Positive "previouEntry" values are offsets from the previous entry - zero (0) is the default which means it follows contiguously from the last occupied bit of the previous entry.  A value of one means it is offset 1-bit from the previous entry, and a value of negative 1 (-1) means it overlaps the previous entry by one bit, and so forth. The "nextEntry" attribute value is proposed for deprecation and should be avoided.  See SequenceEntryType.
#[derive(Debug, Deserialize, Serialize)]
pub struct LocationInContainerInBitsType {
    ///Defines the relative reference used to interpret the start bit position.  The default is 0 bits from the end of the previousEntry, which makes the entry contiguous.
    #[serde(
        default = "LocationInContainerInBitsType::default_reference_location",
        rename = "@referenceLocation"
    )]
    pub reference_location: ReferenceLocationType,
    #[serde(rename = "$value")]
    pub content: LocationInContainerInBitsTypeContent,
}
///Describe the absolute or relative bit location of an entry in a container.  The "referenceLocation" attribute specifies the starting bit anchor.  If no referenceLocation value is given, the entry is assumed to begin at the first bit position after the previous entry.  Each container starts at bit 0, thus "containerStart" is an offset from 0.  Negative container start bits are before the container and are implementation dependent - these should be flagged as likely errors.  "containerEnd" is given as a positive offset from the end of the container, thus a container end of 0 is exactly at the end of the container.  Negative container end addresses are after the container and are implementation dependent - these should be flagged as likely errors.  Positive "previouEntry" values are offsets from the previous entry - zero (0) is the default which means it follows contiguously from the last occupied bit of the previous entry.  A value of one means it is offset 1-bit from the previous entry, and a value of negative 1 (-1) means it overlaps the previous entry by one bit, and so forth. The "nextEntry" attribute value is proposed for deprecation and should be avoided.  See SequenceEntryType.
#[derive(Debug, Deserialize, Serialize)]
pub enum LocationInContainerInBitsTypeContent {
    ///Use a fixed integer value.
    #[serde(rename = "FixedValue")]
    FixedValue(super::xs::LongType),
    ///Determine the value by interrogating an instance of a parameter.
    #[serde(rename = "DynamicValue")]
    DynamicValue(DynamicValueType),
    ///Determine the value by interrogating an instance of a parameter and selecting a specified value based on tests of the value of that parameter.
    #[serde(rename = "DiscreteLookupList")]
    DiscreteLookupList(DiscreteLookupListType),
}
impl LocationInContainerInBitsType {
    #[must_use]
    pub fn default_reference_location() -> ReferenceLocationType {
        ReferenceLocationType::PreviousEntry
    }
}
///The Long Description is intended to be used for explanatory descriptions of the object and may include HTML markup.  Long Descriptions are of unbounded length
pub type LongDescriptionType = ::std::string::String;
///Contains either a simple Comparison, a ComparisonList, an arbitrarily complex BooleanExpression or an escape to an externally defined algorithm
#[derive(Debug, Deserialize, Serialize)]
pub enum MatchCriteriaType {
    ///A simple comparison check involving a single test of a parameter value.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///A series of simple comparison checks with an implicit 'and' in that they all must be true for the overall condition to be true.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///An arbitrarily complex boolean expression that has additional flexibility on the terms beyond the Comparison and ComparisonList elements.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///An escape to an externally defined algorithm.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
}
///Describe a postfix (Reverse Polish Notation (RPN)) notation based mathmatical equations. See MathOperationType.
#[derive(Debug, Deserialize, Serialize)]
pub struct MathAlgorithmType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///The contents of the Math Operation as an algorithm definition in RPN.  See TriggeredMathOperationType.
    #[serde(rename = "MathOperation")]
    pub math_operation: TriggeredMathOperationType,
}
///Describe a mathematical function for calibration where the mathematical function is defined using the MathOperationType.
#[derive(Debug, Deserialize, Serialize)]
pub struct MathOperationCalibratorType {
    ///Optional name for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///Optional description for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<MathOperationCalibratorTypeContent>,
}
///Describe a mathematical function for calibration where the mathematical function is defined using the MathOperationType.
#[derive(Debug, Deserialize, Serialize)]
pub enum MathOperationCalibratorTypeContent {
    ///Optional additional ancillary information for this calibrator/algorithm
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Use a constant in the calculation.
    #[serde(rename = "ValueOperand")]
    ValueOperand(super::xs::StringType),
    ///Use the value of this parameter in the calculation. It is the calibrator's value only.  If the raw value is needed, specify it explicitly using ParameterInstanceRefOperand. Note this element has no content.
    #[serde(rename = "ThisParameterOperand")]
    ThisParameterOperand(super::xs::StringType),
    ///All operators utilize operands on the top values in the stack and leaving the result on the top of the stack.  Ternary operators utilize the top three operands on the stack, binary operators utilize the top two operands on the stack, and unary operators use the top operand on the stack.
    #[serde(rename = "Operator")]
    Operator(MathOperatorsType),
    ///This element is used to reference the last received/assigned value of any Parameter in this math operation.
    #[serde(rename = "ParameterInstanceRefOperand")]
    ParameterInstanceRefOperand(ParameterInstanceRefType),
}
///Postfix (aka Reverse Polish Notation (RPN)) notation is used to describe mathmatical equations. It uses a stack where operands (either fixed values or ParameterInstances) are pushed onto the stack from first to last in the XML. As the operators are specified, each pops off operands as it evaluates them, and pushes the result back onto the stack. In this case postfix is used to avoid having to specify parenthesis. To convert from infix to postfix, use Dijkstra's "shunting yard" algorithm.
#[derive(Debug, Deserialize, Serialize)]
pub struct MathOperationType {
    ///Optional name for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///Optional description for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<MathOperationTypeContent>,
}
///Postfix (aka Reverse Polish Notation (RPN)) notation is used to describe mathmatical equations. It uses a stack where operands (either fixed values or ParameterInstances) are pushed onto the stack from first to last in the XML. As the operators are specified, each pops off operands as it evaluates them, and pushes the result back onto the stack. In this case postfix is used to avoid having to specify parenthesis. To convert from infix to postfix, use Dijkstra's "shunting yard" algorithm.
#[derive(Debug, Deserialize, Serialize)]
pub enum MathOperationTypeContent {
    ///Optional additional ancillary information for this calibrator/algorithm
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Use a constant in the calculation.
    #[serde(rename = "ValueOperand")]
    ValueOperand(super::xs::StringType),
    ///Use the value of this parameter in the calculation. It is the calibrator's value only.  If the raw value is needed, specify it explicitly using ParameterInstanceRefOperand. Note this element has no content.
    #[serde(rename = "ThisParameterOperand")]
    ThisParameterOperand(super::xs::StringType),
    ///All operators utilize operands on the top values in the stack and leaving the result on the top of the stack.  Ternary operators utilize the top three operands on the stack, binary operators utilize the top two operands on the stack, and unary operators use the top operand on the stack.
    #[serde(rename = "Operator")]
    Operator(MathOperatorsType),
    ///This element is used to reference the last received/assigned value of any Parameter in this math operation.
    #[serde(rename = "ParameterInstanceRefOperand")]
    ParameterInstanceRefOperand(ParameterInstanceRefType),
}
///Mathematical operators used in the math operation.  Behavior of each operator on the stack is described using notation (before -- after), where "before" represents the stack before execution of the operator and "after" represent the stack after execution.
#[derive(Debug, Deserialize, Serialize)]
pub enum MathOperatorsType {
    ///addition (x1 x2 -- x1+x2)
    #[serde(rename = "+")]
    Plus,
    ///subtraction (x1 x2 -- x1-x2)
    #[serde(rename = "-")]
    Minus,
    ///multiplication (x1 x2 -- x1*x2)
    #[serde(rename = "*")]
    Multiply,
    ///division (x1 x2 -- x1/x2)
    #[serde(rename = "/")]
    Divide,
    ///modulo (x1 x2 -- x3) Divide x1 by x2, giving the modulo x3
    #[serde(rename = "%")]
    Modulo,
    ///power function (x1 x2 -- x1**x2)
    #[serde(rename = "^")]
    Pow,
    ///reverse power function (x1 x2 -- x2**x1)
    #[serde(rename = "y^x")]
    YX,
    ///natural (base e) logarithm (x -- ln(x))
    #[serde(rename = "ln")]
    Ln,
    ///base-10 logarithm (x-- log(x))
    #[serde(rename = "log")]
    Log,
    ///exponentiation (x -- exp(x))
    #[serde(rename = "e^x")]
    EX,
    ///inversion (x -- 1/x)
    #[serde(rename = "1/x")]
    _1X,
    ///factorial (x -- x!)
    #[serde(rename = "x!")]
    X,
    ///tangent (x -- tan(x)) radians
    #[serde(rename = "tan")]
    Tan,
    ///cosine (x -- cos(x)) radians
    #[serde(rename = "cos")]
    Cos,
    ///sine (x -- sin(x)) radians
    #[serde(rename = "sin")]
    Sin,
    ///arctangent (x -- atan(x)) radians
    #[serde(rename = "atan")]
    Atan,
    ///arctangent (x1 x2 -- atan2(x2, x1)) radians
    #[serde(rename = "atan2")]
    Atan2,
    ///arccosine (x -- acos(x)) radians
    #[serde(rename = "acos")]
    Acos,
    ///arcsine (x -- asin(x)) radians
    #[serde(rename = "asin")]
    Asin,
    ///hyperbolic tangent (x -- tanh(x))
    #[serde(rename = "tanh")]
    Tanh,
    ///hyperbolic cosine (x -- cosh(x))
    #[serde(rename = "cosh")]
    Cosh,
    ///hyperbolic sine (x -- sinh(x))
    #[serde(rename = "sinh")]
    Sinh,
    ///hyperbolic arctangent (x -- atanh(x))
    #[serde(rename = "atanh")]
    Atanh,
    ///hyperbolic arccosine (x -- acosh(x))
    #[serde(rename = "acosh")]
    Acosh,
    ///hyperbolic arcsine (x -- asinh(x))
    #[serde(rename = "asinh")]
    Asinh,
    ///swap the top two stack items (x1 x2 -- x2 x1)
    #[serde(rename = "swap")]
    Swap,
    ///Remove top item from the stack (x -- )
    #[serde(rename = "drop")]
    Drop,
    ///Duplicate top item on the stack (x -- x x)
    #[serde(rename = "dup")]
    Dup,
    ///Duplicate top item on the stack (x1 x2 -- x1 x2 x1)
    #[serde(rename = "over")]
    Over,
    ///signed bitwise left shift (x1 x2 -- x1  x2)
    #[serde(rename = "<<")]
    BitwiseLShift,
    ///signed bitwise right shift (x1 x2 -- x1  x2)
    #[serde(rename = ">>")]
    BitwiseRShift,
    ///bitwise and (x1 x2 -- x1  x2)
    #[serde(rename = "&")]
    BitwiseAnd,
    ///bitwise or (x1 x2 -- x1 | x2)
    #[serde(rename = "|")]
    BitwiseOr,
    ///logical and (x1 x2 -- x1  x2)
    #[serde(rename = "&&")]
    And,
    ///logical or (x1 x2 -- x1 || x2)
    #[serde(rename = "||")]
    Or,
    ///logical not (x1 x2 -- x1 ! x2)
    #[serde(rename = "!")]
    Not,
    ///absolute value (x1 -- abs(x1))
    #[serde(rename = "abs")]
    Abs,
    ///Euclidean division quotient (x1 -- div(x1))
    #[serde(rename = "div")]
    Div,
    ///integer part (x1 -- int(x1))
    #[serde(rename = "int")]
    Int,
    ///greater than x,y (x1 x2 -- x1  x2)
    #[serde(rename = ">")]
    Gt,
    ///greater than or equal x,y (x1 x2 -- x1 = x2)
    #[serde(rename = ">=")]
    Gte,
    ///less than x,y (x1 x2 -- x1  x2)
    #[serde(rename = "<")]
    Lt,
    ///less than or equal x,y (x1 x2 -- x1 = x2)
    #[serde(rename = "<=")]
    Lte,
    ///equal x,y (x1 x2 -- x1 == x2)
    #[serde(rename = "==")]
    Eq,
    ///not equal x,y (x1 x2 -- x1 != x2)
    #[serde(rename = "!=")]
    Neq,
    ///minimum of x,y (x1 x2 -- min(x1, x2))
    #[serde(rename = "min")]
    Min,
    ///maximum of x,y (x1 x2 -- max(x1, x2))
    #[serde(rename = "max")]
    Max,
    ///Bitwise exclusive or (XOR) (x1 x2 -- x1 xor x2)
    #[serde(rename = "xor")]
    Xor,
    ///Bitwise not operation (x1 x2 -- x1 ~ x2) The result of this can only be 0 or 1
    #[serde(rename = "~")]
    BitwiseNot,
}
///Order is important only if the name of the AggregateParameter or Aggregate Argument is directly referenced in SequenceContainers.  In this case the members are assued to be added sequentially (in the order listed here) into the Container.
#[derive(Debug, Deserialize, Serialize)]
pub struct MemberListType {
    #[serde(default, rename = "Member")]
    pub member: ::std::vec::Vec<MemberType>,
}
///Describe a member field in an AggregateDataType. Each member has a name and a type reference to a data type for the aggregate member name.  If this aggregate is a Parameter aggregate, then the typeRef is a parameter type reference.  If this aggregate is an Argument aggregate, then the typeRef is an argument type reference.  References to an array data type is currently not supported. Circular references are not allowed.  See MemberListType. AggregateParameterType and AggregateArgumentType.
#[derive(Debug, Deserialize, Serialize)]
pub struct MemberType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(rename = "@typeRef")]
    pub type_ref: NameReferenceWithPathType,
    ///Used to set the initial calibrated values of Parameters and Arguments.  Will overwrite an initial value defined for the ParameterType or ArgumentType definition elements.  For integer types it is base 10 form.  Floating point types may be specified in normal (100.0) or scientific (1.0e2) form.  Time types are specified using the ISO 8601 formats described for XTCE time data types.  Initial values for string types, may include C language style (\n, \t, \", \\, etc.) escape sequences.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct MessageRefSetType {
    #[serde(default, rename = "MessageRef")]
    pub message_ref: ::std::vec::Vec<MessageRefType>,
}
///Holds a reference to a message
#[derive(Debug, Deserialize, Serialize)]
pub struct MessageRefType {
    ///name of message
    #[serde(rename = "@messageRef")]
    pub message_ref: NameReferenceWithPathType,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct MessageSetType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "Message")]
    pub message: ::std::vec::Vec<MessageType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct MessageType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(rename = "MatchCriteria")]
    pub match_criteria: MatchCriteriaType,
    ///The ContainerRef should point to ROOT container that will describe an entire packet/minor frame or chunk of telemetry.
    #[serde(rename = "ContainerRef")]
    pub container_ref: ContainerRefType,
}
///Describes an unordered collection of command definitions.  Duplicates are invalid based on the name attribute of MetaCommand and BlockMetaCommand.  See MetaCommandType and BlockMetaCommandType.
#[derive(Debug, Deserialize, Serialize)]
pub struct MetaCommandSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<MetaCommandSetTypeContent>,
}
///Describes an unordered collection of command definitions.  Duplicates are invalid based on the name attribute of MetaCommand and BlockMetaCommand.  See MetaCommandType and BlockMetaCommandType.
#[derive(Debug, Deserialize, Serialize)]
pub enum MetaCommandSetTypeContent {
    ///All atomic commands to be sent on this mission are listed here.  In addition this area has verification and validation information.
    #[serde(rename = "MetaCommand")]
    MetaCommand(MetaCommandType),
    ///Used to include a MetaCommand defined in another sub-system in this sub-system.
    #[serde(rename = "MetaCommandRef")]
    MetaCommandRef(NameReferenceWithPathType),
    ///Used to define a command that includes more than one atomic MetaCommand definition.
    #[serde(rename = "BlockMetaCommand")]
    BlockMetaCommand(BlockMetaCommandType),
}
///Describe the list of MetaCommand definitions that form the block command.  Contains an ordered list of MetaCommandSteps where each step is a MetaCommand with associated arguments, duplicates are valid.  See BlockMetaCommandType.
#[derive(Debug, Deserialize, Serialize)]
pub struct MetaCommandStepListType {
    ///A MetaCommand with specific specified argument values to include in the BlockMetaCommand.
    #[serde(default, rename = "MetaCommandStep")]
    pub meta_command_step: ::std::vec::Vec<MetaCommandStepType>,
}
///Describe a MetaCommand step, consisting MetaCommand reference and argument list. See MetaCommandStepListType and NameReferenceType.
#[derive(Debug, Deserialize, Serialize)]
pub struct MetaCommandStepType {
    #[serde(rename = "@metaCommandRef")]
    pub meta_command_ref: NameReferenceWithPathType,
    #[serde(default, rename = "ArgumentAssignmentList")]
    pub argument_assignment_list: ::core::option::Option<ArgumentAssignmentListType>,
}
///Describe a command which consists of an abstract portion (MetaCommand) and an optional packaging portion (MetaCommand CommandContainer).  An argument list is provided. MetaCommand may extend other MetaCommands and their CommandContainer may extend other CommandContainer or SequenceContainers.  A MetaCommand's CommandContainer is private except as referred to in BaseMetaCommand (they are not visible to other containers and cannot be used in an entry list). MetaCommands may also define various other behavioral aspects of a command such as command verifiers.  See CommandContainerType, ArgumentListType, BaseMetaCommandType and BaseContainerType.
#[derive(Debug, Deserialize, Serialize)]
pub struct MetaCommandType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Abstract MetaCommand definitions that are not instantiated, rather only used as bases to inherit from to create specialized command definitions.
    #[serde(default = "MetaCommandType::default_abstract_", rename = "@abstract")]
    pub abstract_: super::xs::BooleanType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Optional inheritance for this MetaCommand from another named MetaCommand.
    #[serde(default, rename = "BaseMetaCommand")]
    pub base_meta_command: ::core::option::Option<BaseMetaCommandType>,
    ///Optional.  Normally used when the database is built in a flat, non-hierarchical format.  May be used by implementations to group MetaCommands together.
    #[serde(default, rename = "SystemName")]
    pub system_name: ::core::option::Option<super::xs::StringType>,
    ///Many commands have one or more options.  These are called command arguments.  Command arguments may be of any of the standard data types.  MetaCommand arguments are local to the MetaCommand, but may be referenced in inherited MetaCommand definitions, generally to apply Argument Assignments to the values.
    #[serde(default, rename = "ArgumentList")]
    pub argument_list: ::core::option::Option<ArgumentListType>,
    ///Tells how to package/encode this command definition in binary form.
    #[serde(default, rename = "CommandContainer")]
    pub command_container: ::core::option::Option<CommandContainerType>,
    ///List of constraints to check when sending this command.
    #[serde(default, rename = "TransmissionConstraintList")]
    pub transmission_constraint_list: ::core::option::Option<
        TransmissionConstraintListType,
    >,
    ///Some Command and Control Systems may require special user access or confirmations before transmitting commands with certain levels.  The level is inherited from the Base MetaCommand.
    #[serde(default, rename = "DefaultSignificance")]
    pub default_significance: ::core::option::Option<SignificanceType>,
    ///Some Command and Control Systems may require special user access or confirmations before transmitting commands with certain levels.  In addition to the default, Significance can be defined in contexts where it changes based on the values of parameters.
    #[serde(default, rename = "ContextSignificanceList")]
    pub context_significance_list: ::core::option::Option<ContextSignificanceListType>,
    ///An Interlock is a type of Constraint, but not on Command instances of this MetaCommand; Interlocks apply instead to the next command.  An Interlock will block successive commands until this command has reached a certain stage (through verifications).  Interlocks are scoped to a SpaceSystem basis.
    #[serde(default, rename = "Interlock")]
    pub interlock: ::core::option::Option<InterlockType>,
    ///Functional list of conditions/changes to check after sending this command to determine success or failure.
    #[serde(default, rename = "VerifierSet")]
    pub verifier_set: ::core::option::Option<VerifierSetType>,
    ///List of parameters to set new values upon completion of sending this command.
    #[serde(default, rename = "ParameterToSetList")]
    pub parameter_to_set_list: ::core::option::Option<ParameterToSetListType>,
    ///List of parameters to suspend alarm processing/detection upon completion of sending this command.
    #[serde(default, rename = "ParametersToSuspendAlarmsOnSet")]
    pub parameters_to_suspend_alarms_on_set: ::core::option::Option<
        ParametersToSuspendAlarmsOnSetType,
    >,
}
impl MetaCommandType {
    #[must_use]
    pub fn default_abstract_() -> super::xs::BooleanType {
        false
    }
}
///The alarm multi-range element type permits users to define multiple alarm ranges in a sequence that goes beyond the more typical "inside" and "outside" range definitions. It can be thought of as a "barber pole" definition.
#[derive(Debug, Deserialize, Serialize)]
pub struct MultiRangeType {
    ///Minimum decimal/real number value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minInclusive")]
    pub min_inclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Minimum decimal/real number value excluding itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minExclusive")]
    pub min_exclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Maximum decimal/real number value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxInclusive")]
    pub max_inclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Maximum decimal/real number value excluding itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxExclusive")]
    pub max_exclusive: ::core::option::Option<super::xs::DoubleType>,
    ///A value of outside specifies that the most severe range is outside all the other ranges: -severe -critical -distress -warning -watch normal +watch +warning +distress +critical +severe.  This means each min, max pair are a range: (-inf, min) or (-inf, min], and [max, inf) or (max, inf).  However a value of inside "inverts" these bands: -normal -watch -warning -distress -critical severe +critical +distress +warning +watch, +normal.  This means each min, max pair form a range of (min, max) or [min, max) or (min, max] or [min, max].  The most common form used is "outside" and it is the default.  The set notation used defines parenthesis as exclusive and square brackets as inclusive.
    #[serde(default = "MultiRangeType::default_range_form", rename = "@rangeForm")]
    pub range_form: RangeFormType,
    ///The level of concern for this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@level")]
    pub level: ::core::option::Option<ConcernLevelsType>,
}
impl MultiRangeType {
    #[must_use]
    pub fn default_range_form() -> RangeFormType {
        RangeFormType::Outside
    }
}
///Defines a base schema type definition used by many other schema types throughout schema.  Use it to describe a name with optional descriptions, aliases, and ancillary data.  See NameType, LongDescriptionType, ShortDescriptionType, AliasSetType and AncillaryDataSetType.
#[derive(Debug, Deserialize, Serialize)]
pub struct NameDescriptionType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///This is identical to NameType above and is used for references that point to named objects for which path is not an option and array/aggregate typing is not an option.  This is not used by the schema.
pub type NameReferenceNoPathType = ::std::string::String;
///Defines a reference that can include a path to a named object where array and aggregate are not possible.  The named must be of schema type NameType.  All name references use a Unix style file system name format where the SpaceSystem names form a path in the SpaceSystem tree. The following characters are reserved for the path: '/', '..' and '.' (multiple consecutive '/'s are treated as one).  The path portion is similar to the directory path used in file system names and the path characters have similar meaning (e.g., SimpleSat/Bus/EPDS/BatteryOne/Voltage). There are three overall forms for name references:  absolute path, relative path and just the name.  The first two forms are called qualified name references; the last form is called an unqualified name reference.  The unqualified form refers to an item in the SpaceSystem the reference is used in.  The unqualified form refers to an item in the SpaceSystem the reference is used in.  All name references must resolve to a named item (i.e. no dangling name references).  This is used by the ParameterTypeRef, ArgumentTypeRef, baseType attribute, typeRef attribute, arrayTypeRef attribute, spaceSystemAtRisk attribute, scopeToSpaceSystem attribute, triggerContainer attribute, StreamRef, ContainerRef, MetaCommandRef, ServiceRef, and MessageRef variations.
pub type NameReferenceWithPathType = ::std::string::String;
///Defines a basic name where all characters are allowed except '.', '[', ']', ':', '/', and whitespace.  See NameDescriptionType.
pub type NameType = ::std::string::String;
///XTCE-specific replacement for xtce:NonNegativeLongType which more cleanly maps to native data types.
pub type NonNegativeLongType = ::core::primitive::i64;
///Contains an unordered collection of Notes.  Usage is user defined.  See NoteType.
#[derive(Debug, Deserialize, Serialize)]
pub struct NoteSetType {
    ///Contains a program defined technical note regarding this document.
    #[serde(default, rename = "Note")]
    pub note: ::std::vec::Vec<NoteType>,
}
pub type NoteType = ::std::string::String;
///This type describes how a numeric value should be represented in engineering/calibrated form.  The defaults reflect the most common form.
#[derive(Debug, Deserialize, Serialize)]
pub struct NumberFormatType {
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to the radix.  Default is base 10.
    #[serde(default = "NumberFormatType::default_number_base", rename = "@numberBase")]
    pub number_base: RadixType,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to the minimum number of fractional digits.  The default is 0.
    #[serde(
        default = "NumberFormatType::default_minimum_fraction_digits",
        rename = "@minimumFractionDigits"
    )]
    pub minimum_fraction_digits: NonNegativeLongType,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to the maximum or upper bound of the number of digits.  There is no default.  No value specified should be interpreted as no upper bound such that all requires digits are used to fully characterize the value.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maximumFractionDigits")]
    pub maximum_fraction_digits: ::core::option::Option<NonNegativeLongType>,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to the minimum number of integer digits.  The default is 1.
    #[serde(
        default = "NumberFormatType::default_minimum_integer_digits",
        rename = "@minimumIntegerDigits"
    )]
    pub minimum_integer_digits: NonNegativeLongType,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to the maximum or upper bound of the integer digits.  There is no default.  No value specified should be interpreted as no upper bound such that all requires digits are used to fully characterize the value.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maximumIntegerDigits")]
    pub maximum_integer_digits: ::core::option::Option<NonNegativeLongType>,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to negative values.  This attribute specifies the character or characters that should be appended to the numeric value to indicate negative values.  The default is none.
    #[serde(
        default = "NumberFormatType::default_negative_suffix",
        rename = "@negativeSuffix"
    )]
    pub negative_suffix: super::xs::StringType,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to positive values.  This attribute specifies the character or characters that should be appended to the numeric value to indicate positive values.  The default is none.  Zero is considered to be specific to the implementation/platform and is not implied here.
    #[serde(
        default = "NumberFormatType::default_positive_suffix",
        rename = "@positiveSuffix"
    )]
    pub positive_suffix: super::xs::StringType,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to negative values.  This attribute specifies the character or characters that should be prepended to the numeric value to indicate negative values.  The default is a minus character "-".
    #[serde(
        default = "NumberFormatType::default_negative_prefix",
        rename = "@negativePrefix"
    )]
    pub negative_prefix: super::xs::StringType,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to positive values.  This attribute specifies the character or characters that should be prepended to the numeric value to indicate positive values.  The default is none.  Zero is considered to be specific to the implementation/platform and is not implied here.
    #[serde(
        default = "NumberFormatType::default_positive_prefix",
        rename = "@positivePrefix"
    )]
    pub positive_prefix: super::xs::StringType,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to larger values.  Groupings by thousand are specific to locale, so the schema only specifies whether they will be present and not which character separators are used.  The default is false.
    #[serde(
        default = "NumberFormatType::default_show_thousands_grouping",
        rename = "@showThousandsGrouping"
    )]
    pub show_thousands_grouping: super::xs::BooleanType,
    ///Describes how the engineering/calibrated value of this number should be displayed with respect to notation.  Engineering, scientific, or traditional decimal notation may be specified.  The precise characters used is locale specific for the implementation/platform.  The default is "normal" for the traditional notation.
    #[serde(default = "NumberFormatType::default_notation", rename = "@notation")]
    pub notation: FloatingPointNotationType,
}
impl NumberFormatType {
    #[must_use]
    pub fn default_number_base() -> RadixType {
        RadixType::Decimal
    }
    #[must_use]
    pub fn default_minimum_fraction_digits() -> NonNegativeLongType {
        0i64
    }
    #[must_use]
    pub fn default_minimum_integer_digits() -> NonNegativeLongType {
        1i64
    }
    #[must_use]
    pub fn default_negative_suffix() -> super::xs::StringType {
        ::std::string::String::from("")
    }
    #[must_use]
    pub fn default_positive_suffix() -> super::xs::StringType {
        ::std::string::String::from("")
    }
    #[must_use]
    pub fn default_negative_prefix() -> super::xs::StringType {
        ::std::string::String::from("-")
    }
    #[must_use]
    pub fn default_positive_prefix() -> super::xs::StringType {
        ::std::string::String::from("")
    }
    #[must_use]
    pub fn default_show_thousands_grouping() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_notation() -> FloatingPointNotationType {
        FloatingPointNotationType::Normal
    }
}
///Describe alarm conditions specific to the numeric data types, extends the basic AlarmType with StaticAlarmRanges and ChangeAlarmRanges. See FloatParameterType and IntegerParameterType.
#[derive(Debug, Deserialize, Serialize)]
pub struct NumericAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "NumericAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "NumericAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "NumericAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<NumericAlarmTypeContent>,
}
///Describe alarm conditions specific to the numeric data types, extends the basic AlarmType with StaticAlarmRanges and ChangeAlarmRanges. See FloatParameterType and IntegerParameterType.
#[derive(Debug, Deserialize, Serialize)]
pub enum NumericAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    ///StaticAlarmRanges are used to trigger alarms when the parameter value passes some threshold value.
    #[serde(rename = "StaticAlarmRanges")]
    StaticAlarmRanges(AlarmRangesType),
    ///ChangeAlarmRanges are used to trigger alarms when the parameter value changes by a rate or quantity from a reference.
    #[serde(rename = "ChangeAlarmRanges")]
    ChangeAlarmRanges(ChangeAlarmRangesType),
    ///Similar to but more lenient form of StaticAlarmRanges.
    #[serde(rename = "AlarmMultiRanges")]
    AlarmMultiRanges(AlarmMultiRangesType),
}
impl NumericAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///An ordered collection of numeric alarms associated with a context. A context is an alarm definition on a parameter which is valid only in the case of a test on the value of other parameters. Process the contexts in list order. Used by both FloatParameterType and IntegerParameterType. See NumericContextAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct NumericContextAlarmListType {
    ///A Context contains a new alarm definition and a context match.  The match takes precedence over any default alarm when the first in the overall list evaluates to true.  It is also possible the alarm definition is empty, in which case the context means no alarm defined when the match is true.
    #[serde(default, rename = "ContextAlarm")]
    pub context_alarm: ::std::vec::Vec<NumericContextAlarmType>,
}
///Describe a parameter dependent context, that when evaluates to true, enables the use of this alarm definition. See ContextMatchType and NumericAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct NumericContextAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "NumericContextAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "NumericContextAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "NumericContextAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<NumericContextAlarmTypeContent>,
}
///Describe a parameter dependent context, that when evaluates to true, enables the use of this alarm definition. See ContextMatchType and NumericAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub enum NumericContextAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    ///StaticAlarmRanges are used to trigger alarms when the parameter value passes some threshold value.
    #[serde(rename = "StaticAlarmRanges")]
    StaticAlarmRanges(AlarmRangesType),
    ///ChangeAlarmRanges are used to trigger alarms when the parameter value changes by a rate or quantity from a reference.
    #[serde(rename = "ChangeAlarmRanges")]
    ChangeAlarmRanges(ChangeAlarmRangesType),
    ///Similar to but more lenient form of StaticAlarmRanges.
    #[serde(rename = "AlarmMultiRanges")]
    AlarmMultiRanges(AlarmMultiRangesType),
    ///Contains the evaluation criteria for a parameter dependent test, that when evaluates to true, enables this alarm definition.
    #[serde(rename = "ContextMatch")]
    ContextMatch(ContextMatchType),
}
impl NumericContextAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///Describe two or more conditions that are logically ored together. Conditions may be a mix of Condition and ANDedCondition.   See ORedConditionType and BooleanExpressionType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ORedConditionsType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ORedConditionsTypeContent>,
}
///Describe two or more conditions that are logically ored together. Conditions may be a mix of Condition and ANDedCondition.   See ORedConditionType and BooleanExpressionType.
#[derive(Debug, Deserialize, Serialize)]
pub enum ORedConditionsTypeContent {
    ///Condition elements describe a test similar to the Comparison element except that the parameters used have additional flexibility for the compare.
    #[serde(rename = "Condition")]
    Condition(ComparisonCheckType),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible and the and/or for multiple checks can be specified.
    #[serde(rename = "ANDedConditions")]
    AnDedConditions(AnDedConditionsType),
}
///A simple restriction on string for hexadecimal numbers.  Must be in 0o or 0O form.
pub type OctalType = ::std::string::String;
///Describe a reference to container that triggers an event when the telemetry container referred to is updated (processed).  See TriggerSetType.
#[derive(Debug, Deserialize, Serialize)]
pub struct OnContainerUpdateTriggerType {
    ///Reference to the Container whose update/receipt triggers this algorithm to evaluate.
    #[serde(rename = "@containerRef")]
    pub container_ref: NameReferenceWithPathType,
}
///Describe a reference to parameter that triggers an event when the telemetry parameter referred to is updated (processed) with a new value.  See TriggerSetType.
#[derive(Debug, Deserialize, Serialize)]
pub struct OnParameterUpdateTriggerType {
    ///Reference to the Parameter whose update triggers this algorithm to evaluate.
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
}
///Describe a periodic time basis to trigger an event.  See TriggerSetType.
#[derive(Debug, Deserialize, Serialize)]
pub struct OnPeriodicRateTriggerType {
    ///The periodic rate in time in which this algorithm is triggered to evaluate.
    #[serde(rename = "@fireRateInSeconds")]
    pub fire_rate_in_seconds: super::xs::DoubleType,
}
///The type definition used by most elements that have an optional name with optional descriptions.
#[derive(Debug, Deserialize, Serialize)]
pub struct OptionalNameDescriptionType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Names an output parameter to the algorithm.  There are two attributes to OutputParm, outputName and parameterName. parameterName is a parameter reference name for a parameter that will be updated by this algorithm.  outputName is an optional "friendly" name for the output parameter.
#[derive(Debug, Deserialize, Serialize)]
pub struct OutputParameterRefType {
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@outputName")]
    pub output_name: ::core::option::Option<super::xs::StringType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct OutputSetType {
    #[serde(default, rename = "OutputParameterRef")]
    pub output_parameter_ref: ::std::vec::Vec<OutputParameterRefType>,
}
///A PCM Stream Type is the high level definition for all Pulse Code Modulated (PCM) (i.e., binary) streams.
#[derive(Debug, Deserialize, Serialize)]
pub struct PcmStreamType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@bitRateInBPS")]
    pub bit_rate_in_bps: ::core::option::Option<super::xs::DoubleType>,
    #[serde(default = "PcmStreamType::default_pcm_type", rename = "@pcmType")]
    pub pcm_type: PcmType,
    #[serde(default = "PcmStreamType::default_inverted", rename = "@inverted")]
    pub inverted: super::xs::BooleanType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
impl PcmStreamType {
    #[must_use]
    pub fn default_pcm_type() -> PcmType {
        PcmType::Nrzl
    }
    #[must_use]
    pub fn default_inverted() -> super::xs::BooleanType {
        false
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub enum PcmType {
    #[serde(rename = "NRZL")]
    Nrzl,
    #[serde(rename = "NRZM")]
    Nrzm,
    #[serde(rename = "NRZS")]
    Nrzs,
    #[serde(rename = "BiPhaseL")]
    BiPhaseL,
    #[serde(rename = "BiPhaseM")]
    BiPhaseM,
    #[serde(rename = "BiPhaseS")]
    BiPhaseS,
}
///A reference to an instance of a Parameter.   Used when the value of a parameter is required for a calculation or as an index value.  A positive value for instance is forward in time, a negative value for count is backward in time, a 0 value for count means use the current value of the parameter or the first value in a container.
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterInstanceRefType {
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(
        default = "ParameterInstanceRefType::default_instance",
        rename = "@instance"
    )]
    pub instance: super::xs::LongType,
    #[serde(
        default = "ParameterInstanceRefType::default_use_calibrated_value",
        rename = "@useCalibratedValue"
    )]
    pub use_calibrated_value: super::xs::BooleanType,
}
impl ParameterInstanceRefType {
    #[must_use]
    pub fn default_instance() -> super::xs::LongType {
        0i64
    }
    #[must_use]
    pub fn default_use_calibrated_value() -> super::xs::BooleanType {
        true
    }
}
///Describes extended properties/attributes of Parameter definitions.
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterPropertiesType {
    ///This attribute describes the nature of the source entity for which this parameter receives a value.  Implementations assign different attributes/properties internally to a parameter based on the anticipated data source.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@dataSource")]
    pub data_source: ::core::option::Option<TelemetryDataSourceType>,
    ///A Parameter marked as 'readOnly' true is non-settable by users and applications/services that do not represent the data source itself.  Note that a slight conceptual overlap exists here between the 'dataSource' attribute and this attribute when the data source is 'constant'.  For a constant data source, then 'readOnly' should be 'true'.  Application implementations may choose to implicitly enforce this.  Some implementations have both concepts of a Parameter that is settable or non-settable and a Constant in different parts of their internal data model.
    #[serde(
        default = "ParameterPropertiesType::default_read_only",
        rename = "@readOnly"
    )]
    pub read_only: super::xs::BooleanType,
    ///A Parameter marked to persist should retain the latest value through resets/restarts to the extent that is possible or defined in the implementation.  The net effect is that the initial/default value on a Parameter is only seen once or when the system has a reset to revert to initial/default values.
    #[serde(
        default = "ParameterPropertiesType::default_persistence",
        rename = "@persistence"
    )]
    pub persistence: super::xs::BooleanType,
    ///Optional.  Normally used when the database is built in a flat, non-hierarchical format.
    #[serde(default, rename = "SystemName")]
    pub system_name: ::core::option::Option<super::xs::StringType>,
    ///Optional condition that must be true for this Parameter to be valid.
    #[serde(default, rename = "ValidityCondition")]
    pub validity_condition: ::core::option::Option<MatchCriteriaType>,
    ///When present, this set of elements describes physical address location(s) of the parameter where it is stored.  Typically this is on the data source, although that is not constrained by this schema.
    #[serde(default, rename = "PhysicalAddressSet")]
    pub physical_address_set: ::core::option::Option<PhysicalAddressSetType>,
    ///This time will override any Default value for TimeAssociation.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
}
impl ParameterPropertiesType {
    #[must_use]
    pub fn default_read_only() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_persistence() -> super::xs::BooleanType {
        true
    }
}
///An entry that is a single Parameter
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        LocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<RepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<MatchCriteriaType>,
    ///Optional timing information associated with this entry.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
    ///Optional ancillary data associated with this element.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///A reference to a Parameter. Uses Unix-like naming across the SpaceSystem Tree (e.g., SimpleSat/Bus/EPDS/BatteryOne/Voltage).  To reference an individual member of an array use the zero based bracket notation commonly used in languages like C, C++, and Java.
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterRefType {
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
}
///An entry that is only a portion of a parameter value indicating that the entire parameter value must be assembled from other parameter segments.   It is assumed that parameter segments happen sequentially in time, that is the first part if a telemetry parameter first, however (and there's always a however), if this is not the case the order of this parameter segment may be supplied with the order attribute where the first segment order="0".
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterSegmentRefEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@order")]
    pub order: ::core::option::Option<PositiveLongType>,
    #[serde(rename = "@sizeInBits")]
    pub size_in_bits: PositiveLongType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        LocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<RepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<MatchCriteriaType>,
    ///Optional timing information associated with this entry.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
    ///Optional ancillary data associated with this element.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Describe an unordered collection of parameters where duplicates defined by the Parameter name attribute are invalid. The ParameterSet exists in both the TelemetryMetaData and the CommandMetaData element so that each may be built independently but from a single namespace.  See TelemetryMetaDataType and CommandMetaDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ParameterSetTypeContent>,
}
///Describe an unordered collection of parameters where duplicates defined by the Parameter name attribute are invalid. The ParameterSet exists in both the TelemetryMetaData and the CommandMetaData element so that each may be built independently but from a single namespace.  See TelemetryMetaDataType and CommandMetaDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum ParameterSetTypeContent {
    ///Defines a named and typed Parameter.
    #[serde(rename = "Parameter")]
    Parameter(ParameterType),
    ///Used to include a Parameter defined in another sub-system in this sub-system.
    #[serde(rename = "ParameterRef")]
    ParameterRef(ParameterRefType),
}
///Parameters that are set with a new value after the command has been sent.  Appended to the Base Command list
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterToSetListType {
    #[serde(default, rename = "ParameterToSet")]
    pub parameter_to_set: ::std::vec::Vec<ParameterToSetType>,
}
///Sets a Parameter to a new value (either from a derivation or explicitly) after the command has been verified (all verifications have passed).
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterToSetType {
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    ///This attribute provides more specific control over when the Parameter value is set.  By default, it is when the command have all verifications complete.  See VerifierEnumerationType.
    #[serde(
        default = "ParameterToSetType::default_set_on_verification",
        rename = "@setOnVerification"
    )]
    pub set_on_verification: VerifierEnumerationType,
    #[serde(rename = "$value")]
    pub content: ParameterToSetTypeContent,
}
///Sets a Parameter to a new value (either from a derivation or explicitly) after the command has been verified (all verifications have passed).
#[derive(Debug, Deserialize, Serialize)]
pub enum ParameterToSetTypeContent {
    ///Specify a simple algorithm to use to set the target Parameter value.  See ArgumentMathOperationType.
    #[serde(rename = "Derivation")]
    Derivation(ArgumentMathOperationType),
    ///Specify value as a string compliant with the XML schema (xs) type specified for each XTCE type: integer=xs:integer; float=xs:double; string=xs:string; boolean=xs:boolean; binary=xs:hexBinary; enum=xs:string from EnumerationList; relative time= xs:duration; absolute time=xs:dateTime.  Supplied value must be within the ValidRange specified for the Parameter and appropriate for the type.
    #[serde(rename = "NewValue")]
    NewValue(super::xs::StringType),
}
impl ParameterToSetType {
    #[must_use]
    pub fn default_set_on_verification() -> VerifierEnumerationType {
        VerifierEnumerationType::Complete
    }
}
///Will suspend all Alarms associated with this Parameter for the given suspense time after the given verifier
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterToSuspendAlarmsOnType {
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(rename = "@suspenseTime")]
    pub suspense_time: RelativeTimeType,
    #[serde(
        default = "ParameterToSuspendAlarmsOnType::default_verifier_to_trigger_on",
        rename = "@verifierToTriggerOn"
    )]
    pub verifier_to_trigger_on: VerifierEnumerationType,
}
impl ParameterToSuspendAlarmsOnType {
    #[must_use]
    pub fn default_verifier_to_trigger_on() -> VerifierEnumerationType {
        VerifierEnumerationType::Release
    }
}
///Describe the properties of a telemetry parameter, including its data type (parameter type). The bulk of properties associated with a telemetry parameter are in its parameter type. The initial value specified here, overrides the initial value in the parameter type. A parameter may be local, in which case its parameter type would have no data encodings. Ideally such a definition would also set data source in parameter properties to "local" but the syntax does not enforce this. See BaseDataType, BaseTimeDataType, and NameReferenceType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Specify the reference to the parameter type from the ParameterTypeSet area using the path reference rules, either local to this SpaceSystem, relative, or absolute.
    #[serde(rename = "@parameterTypeRef")]
    pub parameter_type_ref: NameReferenceWithPathType,
    ///Specify as: integer data type using xs:integer, float data type using xs:double, string data type using xs:string, boolean data type using xs:boolean, binary data type using xs:hexBinary, enum data type using label name, relative time data type using xs:duration, absolute time data type using xs:dateTime, arrays using JSON syntax (e.g. '[1, 3, 4]', and aggregates using JSON syntax '{"member1": 1, "member2": "foo"}' ). Values must not exceed the characteristics for the data type or this is a validation error. Takes precedence over an initial value given in the data type. Values are calibrated unless there is an option to override it.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Specify additional properties for this Parameter used by the implementation of tailor the behavior and attributes of the Parameter.  When not specified, the defaults on the ParameterProperties element attributes are assumed.
    #[serde(default, rename = "ParameterProperties")]
    pub parameter_properties: ::core::option::Option<ParameterPropertiesType>,
}
///Describe an unordered collection of parameter type definitions.  These types named for the engineering/calibrated type of the parameter.  See BaseDataType and BaseTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterTypeSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ParameterTypeSetTypeContent>,
}
///Describe an unordered collection of parameter type definitions.  These types named for the engineering/calibrated type of the parameter.  See BaseDataType and BaseTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum ParameterTypeSetTypeContent {
    ///Describe a parameter type that has an engineering/calibrated value in the form of a character string.
    #[serde(rename = "StringParameterType")]
    StringParameterType(StringParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of an enumeration.
    #[serde(rename = "EnumeratedParameterType")]
    EnumeratedParameterType(EnumeratedParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of an integer.
    #[serde(rename = "IntegerParameterType")]
    IntegerParameterType(IntegerParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of a binary (usually hex represented).
    #[serde(rename = "BinaryParameterType")]
    BinaryParameterType(BinaryParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of a decimal.
    #[serde(rename = "FloatParameterType")]
    FloatParameterType(FloatParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of a boolean enumeration.
    #[serde(rename = "BooleanParameterType")]
    BooleanParameterType(BooleanParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of a duration in time.
    #[serde(rename = "RelativeTimeParameterType")]
    RelativeTimeParameterType(RelativeTimeParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of an instant in time.
    #[serde(rename = "AbsoluteTimeParameterType")]
    AbsoluteTimeParameterType(AbsoluteTimeParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of an array of a primitive type.
    #[serde(rename = "ArrayParameterType")]
    ArrayParameterType(ArrayParameterType),
    ///Describe a parameter type that has an engineering/calibrated value in the form of a structure of parameters of other types.
    #[serde(rename = "AggregateParameterType")]
    AggregateParameterType(AggregateParameterType),
}
///A parameter change in value or specified delta change in value.
#[derive(Debug, Deserialize, Serialize)]
pub struct ParameterValueChangeType {
    #[serde(rename = "ParameterRef")]
    pub parameter_ref: ParameterRefType,
    #[serde(rename = "Change")]
    pub change: ChangeValueType,
}
///Sometimes it is necessary to suspend alarms - particularly 'change' alarms for commands that will change the value of a Parameter
#[derive(Debug, Deserialize, Serialize)]
pub struct ParametersToSuspendAlarmsOnSetType {
    #[serde(default, rename = "ParameterToSuspendAlarmsOn")]
    pub parameter_to_suspend_alarms_on: ::std::vec::Vec<ParameterToSuspendAlarmsOnType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum ParityFormType {
    #[serde(rename = "Even")]
    Even,
    #[serde(rename = "Odd")]
    Odd,
}
///Describe the parity value.  See ErrorDetectCorrectType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ParityType {
    ///The parity form.
    #[serde(rename = "@type")]
    pub type_: ParityFormType,
    ///An offset of non-zero may be specified to skip some bits against the reference position in the reference attribute.
    #[serde(
        default = "ParityType::default_bits_from_reference",
        rename = "@bitsFromReference"
    )]
    pub bits_from_reference: NonNegativeLongType,
    ///The bits involved in the calculation may start at the beginning or the end of the container.
    #[serde(default = "ParityType::default_reference", rename = "@reference")]
    pub reference: ReferencePointType,
    ///Reference to the parameter that contains the value of the parity based on this container.  This attribute is optional because not all implementations verify (telemetry) or create (telecommand) error control fields using the XTCE definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@parameterRef")]
    pub parameter_ref: ::core::option::Option<ExpandedNameReferenceWithPathType>,
}
impl ParityType {
    #[must_use]
    pub fn default_bits_from_reference() -> NonNegativeLongType {
        0i64
    }
    #[must_use]
    pub fn default_reference() -> ReferencePointType {
        ReferencePointType::Start
    }
}
///Describe a percentage complete that is fixed from 0 to 100, or as value from a parameter. See ExecutionVerifierType.
#[derive(Debug, Deserialize, Serialize)]
pub enum PercentCompleteType {
    ///0 to 100 percent
    #[serde(rename = "FixedValue")]
    FixedValue(PercentCompleteTypeFixedValue),
    ///Uses a parameter instance to obtain the value. The parameter value may be optionally adjusted by a Linear function or use a series of boolean expressions to lookup the value. Anything more complex and a DynamicValue with a CustomAlgorithm may be used.
    #[serde(rename = "DynamicValue")]
    DynamicValue(DynamicValueType),
}
///One or more physical addresses may be associated with each Parameter.  Examples of physical addresses include a location on the spacecraft or a location on a data collection bus.
#[derive(Debug, Deserialize, Serialize)]
pub struct PhysicalAddressSetType {
    ///Contains the address (e.g., channel information) required to process the spacecraft telemetry streams. May be an onboard  id, a mux address, or a physical location.
    ///Contains the address (channel information) required to process the spacecraft telemetry streams
    #[serde(default, rename = "PhysicalAddress")]
    pub physical_address: ::std::vec::Vec<PhysicalAddressType>,
}
///Describe the physical address(s) that this parameter is collected from.  Examples of physical addresses include a memory location on the spacecraft or a location on a data collection bus, with the source identified with a descriptive name for the region of memory, such as RAM, Flash, EEPROM, and other possibilities that can be adapted for program specific usage.
#[derive(Debug, Deserialize, Serialize)]
pub struct PhysicalAddressType {
    ///A descriptive name for the location, such as a memory type, where this address is located.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@sourceName")]
    pub source_name: ::core::option::Option<super::xs::StringType>,
    ///The address within the memory location.  This specification does not specify program and hardware specific attributes, such as address size and address region starting location.  These are part of the spacecraft hardware properties.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@sourceAddress")]
    pub source_address: ::core::option::Option<super::xs::StringType>,
    ///A sub-address may be used to further specify the location if it fractionally occupies the address.  Additional possibilities exist for separating partitions of memory or other address based storage mechanisms.  This specification does not specify spacecraft specific hardware properties, so usage of addressing information is largely program and platform specific.
    #[serde(default, rename = "SubAddress")]
    pub sub_address: ::core::option::Option<::std::boxed::Box<PhysicalAddressType>>,
}
///Describe a polynomial equation for calibration. This is a calibration type where a curve in a raw vs calibrated plane is described using a set of polynomial coefficients.  Raw values are converted to calibrated values by finding a position on the curve corresponding to the raw value. The first coefficient belongs with the X^0 term, the next coefficient belongs to the X^1 term and so on. See CalibratorType.
#[derive(Debug, Deserialize, Serialize)]
pub struct PolynomialCalibratorType {
    ///Optional name for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///Optional description for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional additional ancillary information for this calibrator/algorithm
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///A single term in the polynomial function.
    #[serde(default, rename = "Term")]
    pub term: ::std::vec::Vec<TermType>,
}
///XTCE-specific replacement for xtce:PositiveLongType which more cleanly maps to native data types.
pub type PositiveLongType = ::core::primitive::i64;
///A verifer that means the command is scheduled for execution by the destination.
#[derive(Debug, Deserialize, Serialize)]
pub struct QueuedVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<QueuedVerifierTypeContent>,
}
///A verifer that means the command is scheduled for execution by the destination.
#[derive(Debug, Deserialize, Serialize)]
pub enum QueuedVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
}
///Specifies the number base
#[derive(Debug, Deserialize, Serialize)]
pub enum RadixType {
    #[serde(rename = "Decimal")]
    Decimal,
    #[serde(rename = "Hexadecimal")]
    Hexadecimal,
    #[serde(rename = "Octal")]
    Octal,
    #[serde(rename = "Binary")]
    Binary,
}
///Defines inside and outside enumerated terms, where the term outside means the range is (-inf,  minimum) and (maximum, inf) -- that is a range where acceptable values must be less than the minimum and greater than the maximum, and the term inside means the range is (minimum, maximum) -- that is acceptable values are between the minimum and maximum (either the min or max may be inclusive or exclusive).
#[derive(Debug, Deserialize, Serialize)]
pub enum RangeFormType {
    #[serde(rename = "outside")]
    Outside,
    #[serde(rename = "inside")]
    Inside,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct RateInStreamSetType {
    #[serde(default, rename = "RateInStream")]
    pub rate_in_stream: ::std::vec::Vec<RateInStreamWithStreamNameType>,
}
///Define the expected appearance (rate) of a container in a stream where the rate is defined on either a perSecond or perContainer update basis.  Many programs and platforms have variable reporting rates for containers and these can be commanded.  As a result, this element is only useful to some users and generally does not affect the processing of the received containers themselves.  See ContainerType.
#[derive(Debug, Deserialize, Serialize)]
pub struct RateInStreamType {
    ///The measurement unit basis for the minimum and maximum appearance count values.
    #[serde(default = "RateInStreamType::default_basis", rename = "@basis")]
    pub basis: BasisType,
    ///The minimum rate for the specified basis for which this container should appear in the stream.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minimumValue")]
    pub minimum_value: ::core::option::Option<super::xs::DoubleType>,
    ///The maximum rate for the specified basis for which this container should appear in the stream.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maximumValue")]
    pub maximum_value: ::core::option::Option<super::xs::DoubleType>,
}
impl RateInStreamType {
    #[must_use]
    pub fn default_basis() -> BasisType {
        BasisType::PerSecond
    }
}
///Define the expected appearance (rate) of a container in a named stream where the rate is defined on either a perSecond or perContainer update basis.  Many programs and platforms have variable reporting rates for containers and these can be commanded.  As a result, this element is only useful to some users and generally does not affect the processing of the received containers themselves.  See ContainerType and RateInStreamType.
#[derive(Debug, Deserialize, Serialize)]
pub struct RateInStreamWithStreamNameType {
    ///The measurement unit basis for the minimum and maximum appearance count values.
    #[serde(
        default = "RateInStreamWithStreamNameType::default_basis",
        rename = "@basis"
    )]
    pub basis: BasisType,
    ///The minimum rate for the specified basis for which this container should appear in the stream.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minimumValue")]
    pub minimum_value: ::core::option::Option<super::xs::DoubleType>,
    ///The maximum rate for the specified basis for which this container should appear in the stream.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maximumValue")]
    pub maximum_value: ::core::option::Option<super::xs::DoubleType>,
    ///Reference to a named stream for which this rate specification applies.
    #[serde(rename = "@streamRef")]
    pub stream_ref: NameReferenceWithPathType,
}
impl RateInStreamWithStreamNameType {
    #[must_use]
    pub fn default_basis() -> BasisType {
        BasisType::PerSecond
    }
}
///A verifier that simply means the destination has received the command.
#[derive(Debug, Deserialize, Serialize)]
pub struct ReceivedVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ReceivedVerifierTypeContent>,
}
///A verifier that simply means the destination has received the command.
#[derive(Debug, Deserialize, Serialize)]
pub enum ReceivedVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
}
///The location may be relative to the start of the container (containerStart), relative to the end of the previous entry (previousEntry), relative to the end of the container (containerEnd), or relative to the entry that follows this one (nextEntry). If going forward (containerStart and previousEntry) then the location refers to the start of the									Entry. If going backwards (containerEnd and nextEntry) then, the location refers to the end of the entry.
#[derive(Debug, Deserialize, Serialize)]
pub enum ReferenceLocationType {
    #[serde(rename = "containerStart")]
    ContainerStart,
    #[serde(rename = "containerEnd")]
    ContainerEnd,
    #[serde(rename = "previousEntry")]
    PreviousEntry,
    #[serde(rename = "nextEntry")]
    NextEntry,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum ReferencePointType {
    #[serde(rename = "start")]
    Start,
    #[serde(rename = "end")]
    End,
}
///Most time values are relative to another time e.g. seconds are relative to minutes, minutes are relative to hours.  This type is used to describe this relationship starting with the least significant time Parameter to and progressing to the most significant time parameter.
#[derive(Debug, Deserialize, Serialize)]
pub enum ReferenceTimeType {
    #[serde(rename = "OffsetFrom")]
    OffsetFrom(ParameterInstanceRefType),
    ///Epochs may be specified as an xs date where time is implied to be 00:00:00, xs dateTime, or string enumeration of common epochs.  The enumerations are TAI (used by CCSDS and others), J2000, UNIX (also known as POSIX), and GPS.
    #[serde(rename = "Epoch")]
    Epoch(EpochType),
}
///Describes a relative time argument type. Relative time parameters are time offsets (e.g. 10 second, 1.24 milliseconds, etc.) See IntegerDataEncodingType, FloatDataEncoding and RelativeTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct RelativeTimeArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DurationType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///Used to contain a relative time value.  Used to describe a relative time.  Normally used for time offsets.  A Relative time is expressed as PnYn MnDTnH nMnS, where nY represents the number of years, nM the number of months, nD the number of days, 'T' is the date/time separator, nH the number of hours, nM the number of minutes and nS the number of seconds. The number of seconds can include decimal digits to arbitrary precision.  For example, to indicate a duration of 1 year, 2 months, 3 days, 10 hours, and 30 minutes, one would write: P1Y2M3DT10H30M. One could also indicate a duration of minus 120 days as: -P120D.  An extension of Schema duration type.
#[derive(Debug, Deserialize, Serialize)]
pub struct RelativeTimeDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DurationType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
}
///Describes a relative time parameter type. Relative time parameters are time offsets (e.g. 10 second, 1.24 milliseconds, etc.) See IntegerDataEncodingType, FloatDataEncoding and RelativeTimeDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct RelativeTimeParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Extend another absolute or relative time type.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::DurationType>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes how the raw base counts of the time type are encoded/decoded.
    #[serde(default, rename = "Encoding")]
    pub encoding: ::core::option::Option<EncodingType>,
    ///Describes origin (epoch or reference) of this time type.
    #[serde(default, rename = "ReferenceTime")]
    pub reference_time: ::core::option::Option<ReferenceTimeType>,
    ///Default alarm definitions are those which do not adjust definition logic based on the value of other parameters.  Other parameters may participate in the determination of an alarm condition for this parameter, but the definition logic of the alarm on this parameter is constant.  If the alarming logic on this parameter changes based on the value of other parameters, then it is a ContextAlarm and belongs in the ContextAlarmList element.
    #[serde(default, rename = "DefaultAlarm")]
    pub default_alarm: ::core::option::Option<TimeAlarmType>,
    ///Context alarm definitions are those which adjust the definition logic for this parameter based on the value of other parameters.  A context which evaluates to being in effect, based on the testing of another parameter, takes precedence over the default alarms in the DefaultAlarm element.  If the no context alarm evaluates to being in effect, based on the testing of another parameter, then the default alarm definitions from the DefaultAlarm element will remain in effect.  If multiple contexts evaluate to being in effect, then the first one that appears will take precedence.
    #[serde(default, rename = "ContextAlarmList")]
    pub context_alarm_list: ::core::option::Option<TimeContextAlarmListType>,
}
///Used to describe a relative time.  Normally used for time offsets.  A Relative time is expressed as PnYn MnDTnH nMnS, where nY represents the number of years, nM the number of months, nD the number of days, 'T' is the date/time separator, nH the number of hours, nM the number of minutes and nS the number of seconds. The number of seconds can include decimal digits to arbitrary precision.  For example, to indicate a duration of 1 year, 2 months, 3 days, 10 hours, and 30 minutes, one would write: P1Y2M3DT10H30M. One could also indicate a duration of minus 120 days as: -P120D.  An extension of Schema duration type.
pub type RelativeTimeType = ::std::string::String;
///Contains elements that describe how an Entry is identically repeated. This includes a Count of the number of appearances and an optional Offset in bits that may occur between appearances. A Count of 1 indicates no repetition. The Offset default is 0 when not specified.
#[derive(Debug, Deserialize, Serialize)]
pub struct RepeatType {
    ///Value (either fixed or dynamic) that contains the count of appearances for an Entry. The value must be positive where 1 is the same as not specifying a RepeatEntry element at all.
    #[serde(rename = "Count")]
    pub count: IntegerValueType,
    ///Value (either fixed or dynamic) that contains an optional offset in bits between repeats of the Entry. The default is 0, which is contiguous. The value must be 0 or positive. Empty offset after the last repeat count is not implicitly reserved, so the parent EntryList should consider if these are occupied bits when placing the next Entry.
    #[serde(default, rename = "Offset")]
    pub offset: ::core::option::Option<IntegerValueType>,
}
///Define one or more conditions (constraints) for container inheritance. A container is instantiable if its constraints are true.  Constraint conditions may be a comparison, a list of comparisons, a boolean expression, or a graph of containers that are instantiable (if all containers are instantiable the condition is true).  See BaseContainerType, ComparisonType, ComparisonListType, BooleanExpressionType and NextContainerType.
#[derive(Debug, Deserialize, Serialize)]
pub enum RestrictionCriteriaType {
    ///A simple comparison check involving a single test of a parameter value.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///A series of simple comparison checks with an implicit 'and' in that they all must be true for the overall condition to be true.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///An arbitrarily complex boolean expression that has additional flexibility on the terms beyond the Comparison and ComparisonList elements.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///An escape to an externally defined algorithm.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Reference to the named container that must follow this container in the stream sequence.
    #[serde(rename = "NextContainer")]
    NextContainer(::core::option::Option<ContainerRefType>),
}
///Sent from range means the command has been transmitted to the spacecraft by the network that connects the ground system to the spacecraft.  Typically, this verifier would come from something other than the spacecraft, such as a modem or front end processor.
#[derive(Debug, Deserialize, Serialize)]
pub struct SentFromRangeVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<SentFromRangeVerifierTypeContent>,
}
///Sent from range means the command has been transmitted to the spacecraft by the network that connects the ground system to the spacecraft.  Typically, this verifier would come from something other than the spacecraft, such as a modem or front end processor.
#[derive(Debug, Deserialize, Serialize)]
pub enum SentFromRangeVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
}
///Describes the binary layout/packing of data and also related properties, including an entry list of parameters, parameter segments, array parameters, stream segments, containers, and container segments.  Sequence containers may extend other sequence containers (see BaseContainerType).   The parent container's entries are placed before the entries in the child container forming one entry list.  An inheritance chain may be formed using this mechanism, but only one entry list is being created.  Sequence containers may be marked as "abstract", when this occurs an instance of it cannot itself be created.  The idle pattern is part of any unallocated space in the container.  See EntryListType.
#[derive(Debug, Deserialize, Serialize)]
pub struct SequenceContainerType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Abstract container definitions that are not instantiated, rather only used as bases to inherit from to create specialized container definitions.
    #[serde(default = "SequenceContainerType::default_abstract_", rename = "@abstract")]
    pub abstract_: super::xs::BooleanType,
    ///The idle pattern is part of any unallocated space in the container.  This is uncommon.
    #[serde(
        default = "SequenceContainerType::default_idle_pattern",
        rename = "@idlePattern"
    )]
    pub idle_pattern: FixedIntegerValueType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "DefaultRateInStream")]
    pub default_rate_in_stream: ::core::option::Option<RateInStreamType>,
    #[serde(default, rename = "RateInStreamSet")]
    pub rate_in_stream_set: ::core::option::Option<RateInStreamSetType>,
    ///May be used to indicate error detection and correction, change byte order,  provide the size (when it can't be derived), or perform some custom processing.
    #[serde(default, rename = "BinaryEncoding")]
    pub binary_encoding: ::core::option::Option<ContainerBinaryDataEncodingType>,
    ///List of item entries to pack/encode into this container definition.
    #[serde(rename = "EntryList")]
    pub entry_list: EntryListType,
    ///Optional inheritance for this container from another named container.
    #[serde(default, rename = "BaseContainer")]
    pub base_container: ::core::option::Option<BaseContainerType>,
}
impl SequenceContainerType {
    #[must_use]
    pub fn default_abstract_() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_idle_pattern() -> FixedIntegerValueType {
        FixedIntegerValueType::I32(0i32)
    }
}
///Defines an abstract schema type used to create other entry types. Describe an entry's location in the container (See LocationInContainerInBitsType). The location may be fixed or dynamic, absolute or relative. Entries may be included depending on the value of a condition (See IncludeConditionType), and entries may also repeat (see RepeatEntryType). The entry's IncludeCondition resolves to true, it is fully-resolved when its size is computable after RepeatEntry has been accounted for and then offset by LocationInContainer. See EntryListType, IncludeConditionType, RepeatEntryType and LocationInContainerInBitsType.
#[derive(Debug, Deserialize, Serialize)]
pub struct SequenceEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        LocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<RepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<MatchCriteriaType>,
    ///Optional timing information associated with this entry.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
    ///Optional ancillary data associated with this element.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///A reference to a Service
#[derive(Debug, Deserialize, Serialize)]
pub struct ServiceRefType {
    #[serde(rename = "@serviceRef")]
    pub service_ref: NameReferenceWithPathType,
}
///A service is a logical grouping of container and/or messages.
#[derive(Debug, Deserialize, Serialize)]
pub struct ServiceSetType {
    #[serde(default, rename = "Service")]
    pub service: ::std::vec::Vec<ServiceType>,
}
///Holds a set of services, logical groups of containers  OR messages (not both).
#[derive(Debug, Deserialize, Serialize)]
pub struct ServiceType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<ServiceTypeContent>,
}
///Holds a set of services, logical groups of containers  OR messages (not both).
#[derive(Debug, Deserialize, Serialize)]
pub enum ServiceTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    #[serde(rename = "MessageRefSet")]
    MessageRefSet(MessageRefSetType),
    #[serde(rename = "ContainerRefSet")]
    ContainerRefSet(ContainerRefSetType),
}
///It is strongly recommended that the short description be kept under 80 characters in length
pub type ShortDescriptionType = ::std::string::String;
///Significance provides some cautionary information about the potential consequence of each MetaCommand.
#[derive(Debug, Deserialize, Serialize)]
pub struct SignificanceType {
    ///If none is supplied, then the current SpaceSystem is assumed to be the one at risk by the issuance of this command
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@spaceSystemAtRisk")]
    pub space_system_at_risk: ::core::option::Option<NameReferenceWithPathType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@reasonForWarning")]
    pub reason_for_warning: ::core::option::Option<super::xs::StringType>,
    #[serde(
        default = "SignificanceType::default_consequence_level",
        rename = "@consequenceLevel"
    )]
    pub consequence_level: ConsequenceLevelType,
}
impl SignificanceType {
    #[must_use]
    pub fn default_consequence_level() -> ConsequenceLevelType {
        ConsequenceLevelType::Normal
    }
}
///The simplest form of algorithm, a SimpleAlgorithmType contains an area for a free-form pseudo code description of the algorithm plus a Set of references to external algorithms.  External algorithms are usually unique to a ground system type.   Multiple external algorithms are possible because XTCE documents may be used across multiple ground systems.
#[derive(Debug, Deserialize, Serialize)]
pub struct SimpleAlgorithmType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    #[serde(default, rename = "AlgorithmText")]
    pub algorithm_text: ::core::option::Option<AlgorithmTextType>,
    #[serde(default, rename = "ExternalAlgorithmSet")]
    pub external_algorithm_set: ::core::option::Option<ExternalAlgorithmSetType>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct SizeInBitsType {
    ///This is the simplest case of a string data type where the encoding size of the string does not change.
    #[serde(rename = "Fixed")]
    pub fixed: SizeInBitsTypeFixed,
    ///The termination character that represents the end of the string contents.  For C and most strings, this is null (00), which is the default.
    #[serde(default, rename = "TerminationChar")]
    pub termination_char: ::core::option::Option<super::xs::HexBinaryType>,
    ///In some string implementations, the size of the string contents (not the memory allocation size) is determined by a leading numeric value.  This is sometimes referred to as Pascal strings.  If a LeadingSize is specified, then the TerminationChar element does not have a functional meaning.
    #[serde(default, rename = "LeadingSize")]
    pub leading_size: ::core::option::Option<LeadingSizeType>,
}
pub type SpaceSystem = SpaceSystemNotNil;
///The top-level SpaceSystem is the root element for the set of metadata necessary to monitor and command a space device, such as a satellite.  A SpaceSystem defines a namespace.  Metadata areas include:  packets/minor frames layout, telemetry, calibration, alarm, algorithms, streams and commands.  A SpaceSystem may have child SpaceSystems, forming a SpaceSystem tree. See SpaceSystemType.
pub type SpaceSystemNotNil = SpaceSystemType;
///SpaceSystem is a collection of SpaceSystem(s) including space assets, ground assets, multi-satellite systems and sub-systems.  A SpaceSystem is the root element for the set of data necessary to monitor and command an arbitrary space device - this includes the binary decomposition the data streams going into and out of a device.
#[derive(Debug, Deserialize, Serialize)]
pub struct SpaceSystemType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Type of the space system.  Represents what from a space enterprise this SpaceSystem element represents.  See the individual enumeration descriptions in SystemTypeType.
    #[serde(default = "SpaceSystemType::default_system_type", rename = "@systemType")]
    pub system_type: SystemTypeType,
    ///Broad name for the type of asset, such as spacecraft, aircraft, device, or any other that makes sense for the system.
    #[serde(default = "SpaceSystemType::default_asset_type", rename = "@assetType")]
    pub asset_type: super::xs::StringType,
    ///Optional descriptive attribute for document owner convenience.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@operationalStatus")]
    pub operational_status: ::core::option::Option<super::xs::TokenType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@base")]
    pub base: ::core::option::Option<super::xml::Base>,
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(default, rename = "LongDescription")]
    pub long_description: ::core::option::Option<LongDescriptionType>,
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(default, rename = "AliasSet")]
    pub alias_set: ::core::option::Option<AliasSetType>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///The Header element contains optional descriptive information about this SpaceSystem or the document as a whole when specified at the root SpaceSystem.
    #[serde(default, rename = "Header")]
    pub header: ::core::option::Option<HeaderType>,
    ///This element contains descriptions of the telemetry created on the space asset/device and sent to other data consumers.
    #[serde(default, rename = "TelemetryMetaData")]
    pub telemetry_meta_data: ::core::option::Option<TelemetryMetaDataType>,
    ///This element contains descriptions of the commands and their associated constraints and verifications that can be sent to the space asset/device.
    #[serde(default, rename = "CommandMetaData")]
    pub command_meta_data: ::core::option::Option<CommandMetaDataType>,
    #[serde(default, rename = "ServiceSet")]
    pub service_set: ::core::option::Option<ServiceSetType>,
    ///Additional SpaceSystem elements may be used like namespaces to segregate portions of the space asset/device into convenient groupings or may be used to specialize a product line generic SpaceSystem to a specific asset instance.
    #[serde(default, rename = "SpaceSystem")]
    pub space_system: ::std::vec::Vec<SpaceSystem>,
}
impl SpaceSystemType {
    #[must_use]
    pub fn default_system_type() -> SystemTypeType {
        SystemTypeType::Unknown
    }
    #[must_use]
    pub fn default_asset_type() -> super::xs::StringType {
        ::std::string::String::from("unknown")
    }
}
///Describe a spline function for calibration using a set of at least 2 points.  Raw values are converted to calibrated values by finding a position on the line corresponding to the raw value.  The line may be interpolated and/or extrapolated as needed. The interpolation order may be specified for all the points and overridden on individual points.  The algorithm triggers on the input parameter. See CalibratorType.
#[derive(Debug, Deserialize, Serialize)]
pub struct SplineCalibratorType {
    ///Optional name for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///Optional description for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The interpolation order to apply to the overall spline function.  Order 0 is no slope between the points (flat).  Order 1 is linear interpolation.  Order 2 would be quadratic and in this special case, 3 points would be required, etc.
    #[serde(default = "SplineCalibratorType::default_order", rename = "@order")]
    pub order: NonNegativeLongType,
    ///Extrapolation allows the closest outside point and the associated interpolation to extend outside of the range of the points in the spline function.
    #[serde(
        default = "SplineCalibratorType::default_extrapolate",
        rename = "@extrapolate"
    )]
    pub extrapolate: super::xs::BooleanType,
    ///Optional additional ancillary information for this calibrator/algorithm
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///Describes a single point of the spline or piecewise function.
    #[serde(default, rename = "SplinePoint")]
    pub spline_point: ::std::vec::Vec<SplinePointType>,
}
impl SplineCalibratorType {
    #[must_use]
    pub fn default_order() -> NonNegativeLongType {
        1i64
    }
    #[must_use]
    pub fn default_extrapolate() -> super::xs::BooleanType {
        false
    }
}
///A spline, or piecewise defined function, is a set on points from which a curve may be drawn to interpolate raw to calibrated values
#[derive(Debug, Deserialize, Serialize)]
pub struct SplinePointType {
    ///The order of a SplineCalibrator refers to the interpolation function.  Order 0 is a flat line from the defined point (inclusive) to the next point (exclusive).  Order 1 is linear interpolation between two points.  Order 2 is quadratic fit and requires at least 3 points (unusual case).  This order is generally not needed, but may be used to override the interpolation order for this point.
    #[serde(default = "SplinePointType::default_order", rename = "@order")]
    pub order: NonNegativeLongType,
    ///The raw encoded value.
    #[serde(rename = "@raw")]
    pub raw: super::xs::DoubleType,
    ///The engineering/calibrated value associated with the raw value for this point.
    #[serde(rename = "@calibrated")]
    pub calibrated: super::xs::DoubleType,
}
impl SplinePointType {
    #[must_use]
    pub fn default_order() -> NonNegativeLongType {
        1i64
    }
}
///Holds a reference to a stream
#[derive(Debug, Deserialize, Serialize)]
pub struct StreamRefType {
    ///name of reference stream
    #[serde(rename = "@streamRef")]
    pub stream_ref: NameReferenceWithPathType,
}
///An entry that is a portion of a stream (streams are by definition, assumed continuous)   It is assumed that stream segments happen sequentially in time, that is the first part if a steam first, however, if this is not the case the order of the stream segments may be supplied with the order attribute where the first segment order="0".
#[derive(Debug, Deserialize, Serialize)]
pub struct StreamSegmentEntryType {
    ///Optional short description for this entry element.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@streamRef")]
    pub stream_ref: NameReferenceWithPathType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@order")]
    pub order: ::core::option::Option<PositiveLongType>,
    #[serde(rename = "@sizeInBits")]
    pub size_in_bits: PositiveLongType,
    ///The start bit 0 position for each container is local to the container, but does include space occupied by inherited containers.  When a container is "included", as opposed to inherited, then the interpreting implementation takes into account the start bit position of the referring container when finally assembling the start bits for the post-processed entry content.  The default start bit for any entry is 0 bits from the previous entry, making the content contiguous when this element is not used.
    #[serde(default, rename = "LocationInContainerInBits")]
    pub location_in_container_in_bits: ::core::option::Option<
        LocationInContainerInBitsType,
    >,
    ///May be used when this entry repeats itself in the sequence container.  When an entry repeats, it effectively specifies that the same entry is reported more than once in the container and has the same physical meaning.  This should not be construed to be equivalent to arrays.
    #[serde(default, rename = "RepeatEntry")]
    pub repeat_entry: ::core::option::Option<RepeatType>,
    ///This entry will only be included in the sequence when this condition is true, otherwise it is always included.  When the include condition evaluates to false, it is as if the entry does not exist such that any start bit interpretations cannot take into account the space that would have been occupied if this included condition were true.
    #[serde(default, rename = "IncludeCondition")]
    pub include_condition: ::core::option::Option<MatchCriteriaType>,
    ///Optional timing information associated with this entry.
    #[serde(default, rename = "TimeAssociation")]
    pub time_association: ::core::option::Option<TimeAssociationType>,
    ///Optional ancillary data associated with this element.
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
}
///Contains an unordered set of Streams.
#[derive(Debug, Deserialize, Serialize)]
pub struct StreamSetType {
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<StreamSetTypeContent>,
}
///Contains an unordered set of Streams.
#[derive(Debug, Deserialize, Serialize)]
pub enum StreamSetTypeContent {
    #[serde(rename = "FixedFrameStream")]
    FixedFrameStream(FixedFrameStreamType),
    #[serde(rename = "VariableFrameStream")]
    VariableFrameStream(VariableFrameStreamType),
    #[serde(rename = "CustomStream")]
    CustomStream(CustomStreamType),
}
///Describe a string alarm condition based on matching a regular expression.  The level and regular expression are described.  The specific implementation of the regular expression syntax is not specified in the schema at this time.  See StringAlarmListType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringAlarmLevelType {
    #[serde(rename = "@alarmLevel")]
    pub alarm_level: ConcernLevelsType,
    #[serde(rename = "@matchPattern")]
    pub match_pattern: super::xs::StringType,
}
///Describe an ordered collection of string alarms, where duplicates are valid. Evaluate the alarms in list order. The first to evaluate to true takes precedence.  See StringAlarmLevelType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringAlarmListType {
    #[serde(default, rename = "StringAlarm")]
    pub string_alarm: ::std::vec::Vec<StringAlarmLevelType>,
}
///Describe alarms specific to the string data type, extends the basic AlarmType, while adding a StringAlarmList and defaultAlarmLevel attribute. The string alarm list is evaluated in list order. See ConcernsLevelsType and StringAlarmListType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "StringAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "StringAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "StringAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(
        default = "StringAlarmType::default_default_alarm_level",
        rename = "@defaultAlarmLevel"
    )]
    pub default_alarm_level: ConcernLevelsType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<StringAlarmTypeContent>,
}
///Describe alarms specific to the string data type, extends the basic AlarmType, while adding a StringAlarmList and defaultAlarmLevel attribute. The string alarm list is evaluated in list order. See ConcernsLevelsType and StringAlarmListType.
#[derive(Debug, Deserialize, Serialize)]
pub enum StringAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    #[serde(rename = "StringAlarmList")]
    StringAlarmList(StringAlarmListType),
}
impl StringAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_default_alarm_level() -> ConcernLevelsType {
        ConcernLevelsType::Normal
    }
}
///Describes a string parameter type. Three forms are supported: fixed length, variable length and variable length using a prefix. See StringDataEncodingType and StringDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringArgumentType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Initial values for string types, may include C language style (\n, \t, \", \\, etc.) escape sequences.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///restriction pattern is a regular expression
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@restrictionPattern")]
    pub restriction_pattern: ::core::option::Option<super::xs::StringType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally. Generally this can be determined by examination of the encoding information for the string, but it is not always clear, so this attribute allows the extra hint when needed. A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible characters.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@characterWidth")]
    pub character_width: ::core::option::Option<CharacterWidthType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<StringArgumentTypeContent>,
}
///Describes a string parameter type. Three forms are supported: fixed length, variable length and variable length using a prefix. See StringDataEncodingType and StringDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum StringArgumentTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this argument value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the argument.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(ArgumentBinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(ArgumentStringDataEncodingType),
    #[serde(rename = "SizeRangeInCharacters")]
    SizeRangeInCharacters(IntegerRangeType),
}
///Describe an ordered collection of context string alarms, duplicates are valid. Process the contexts in list order. See StringContextAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringContextAlarmListType {
    ///A Context contains a new alarm definition and a context match.  The match takes precedence over any default alarm when the first in the overall list evaluates to true.  It is also possible the alarm definition is empty, in which case the context means no alarm defined when the match is true.
    #[serde(default, rename = "ContextAlarm")]
    pub context_alarm: ::std::vec::Vec<StringContextAlarmType>,
}
///Describe a context that when true the alarm may be evaluated.  See ContextMatchType and StringAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringContextAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "StringContextAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "StringContextAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "StringContextAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(
        default = "StringContextAlarmType::default_default_alarm_level",
        rename = "@defaultAlarmLevel"
    )]
    pub default_alarm_level: ConcernLevelsType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<StringContextAlarmTypeContent>,
}
///Describe a context that when true the alarm may be evaluated.  See ContextMatchType and StringAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub enum StringContextAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    #[serde(rename = "StringAlarmList")]
    StringAlarmList(StringAlarmListType),
    #[serde(rename = "ContextMatch")]
    ContextMatch(ContextMatchType),
}
impl StringContextAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
    #[must_use]
    pub fn default_default_alarm_level() -> ConcernLevelsType {
        ConcernLevelsType::Normal
    }
}
///Describe common encodings of string data: UTF-8 and UTF-16. See StringDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringDataEncodingType {
    ///Describes the bit ordering of the encoded value.
    #[serde(default = "StringDataEncodingType::default_bit_order", rename = "@bitOrder")]
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    #[serde(
        default = "StringDataEncodingType::default_byte_order",
        rename = "@byteOrder"
    )]
    pub byte_order: ByteOrderType,
    ///The character set encoding of this string data type.
    #[serde(default = "StringDataEncodingType::default_encoding", rename = "@encoding")]
    pub encoding: StringEncodingType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<StringDataEncodingTypeContent>,
}
///Describe common encodings of string data: UTF-8 and UTF-16. See StringDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum StringDataEncodingTypeContent {
    ///DEPRECATED: Use the ErrorDetectCorrect element in the container elements instead.
    #[serde(rename = "ErrorDetectCorrect")]
    ErrorDetectCorrect(ErrorDetectCorrectType),
    ///Static length strings do not change in overall length between samples.   They may terminate before the end of their buffer using a terminating character, or by various lookups, or calculations.  But they have a maximum fixed size, and the data itself is always within that maximum size.
    #[serde(rename = "SizeInBits")]
    SizeInBits(SizeInBitsType),
    ///Variable length strings are those where the space occupied in a container can vary.  If the string has variable content but occupies the same amount of space when encoded should use the SizeInBits element.  Specification of a variable length string needs to consider that the implementation needs to allocate space to store the string.  Specify the maximum possible length of the string data type for memory purposes and also specify the bit size of the string to use in containers with the dynamic elements.
    #[serde(rename = "Variable")]
    Variable(VariableStringType),
}
impl StringDataEncodingType {
    #[must_use]
    pub fn default_bit_order() -> BitOrderType {
        BitOrderType::MostSignificantBitFirst
    }
    #[must_use]
    pub fn default_byte_order() -> ByteOrderType {
        ByteOrderType::MostSignificantByteFirst
    }
    #[must_use]
    pub fn default_encoding() -> StringEncodingType {
        StringEncodingType::Utf8
    }
}
///Defines a base schema type for StringParameterType and StringArgumentType, adding initial value, restriction pattern, character width, and size range in characters.  The initial value if set is the initial value of all instances of the child types.  The restriction pattern is a regular expression enforcing the string value to this pattern.  The character width is on the local data type side.  And the size range in character restricts the character set.  For telemetered values, if the restriction pattern of size range in character is not met, the item is invalid. See BaseDataType, StringParameterType, StringArgumentType, CharacterWidthType and IntegerRangeType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringDataType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Initial values for string types, may include C language style (\n, \t, \", \\, etc.) escape sequences.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///restriction pattern is a regular expression
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@restrictionPattern")]
    pub restriction_pattern: ::core::option::Option<super::xs::StringType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally. Generally this can be determined by examination of the encoding information for the string, but it is not always clear, so this attribute allows the extra hint when needed. A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible characters.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@characterWidth")]
    pub character_width: ::core::option::Option<CharacterWidthType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<StringDataTypeContent>,
}
///Defines a base schema type for StringParameterType and StringArgumentType, adding initial value, restriction pattern, character width, and size range in characters.  The initial value if set is the initial value of all instances of the child types.  The restriction pattern is a regular expression enforcing the string value to this pattern.  The character width is on the local data type side.  And the size range in character restricts the character set.  For telemetered values, if the restriction pattern of size range in character is not met, the item is invalid. See BaseDataType, StringParameterType, StringArgumentType, CharacterWidthType and IntegerRangeType.
#[derive(Debug, Deserialize, Serialize)]
pub enum StringDataTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///The size in bits may be greater than or equal to minInclusive.  It may be less than or equal to maxInclusive.  They both may be set indicating a closed range.
    #[serde(rename = "SizeRangeInCharacters")]
    SizeRangeInCharacters(IntegerRangeType),
}
///Defines string encodings.  US-ASCII (7-bit), ISO-8859-1 (8-bit Extended ASCII), Windows-1252 (8-bit Extended ASCII), UTF-8 (Unicode), UTF-16 (Unicode with Byte Order Mark), UTF-16LE (Unicode Little Endian), UTF-16BE (Unicode Big Endian).  See StringDataEncodingType.
#[derive(Debug, Deserialize, Serialize)]
pub enum StringEncodingType {
    #[serde(rename = "US-ASCII")]
    UsAscii,
    #[serde(rename = "ISO-8859-1")]
    Iso88591,
    #[serde(rename = "Windows-1252")]
    Windows1252,
    #[serde(rename = "UTF-8")]
    Utf8,
    ///With UTF-16, encoded bits must be prepended with a Byte Order Mark.  This mark indicates whether the data is encoded in big or little endian.
    #[serde(rename = "UTF-16")]
    Utf16,
    ///With UTF-16LE, encoded bits will always be represented as little endian.  Bits are not prepended with a Byte Order Mark.
    #[serde(rename = "UTF-16LE")]
    Utf16Le,
    ///With UTF-16BE, encoded bits will always be represented as big endian.  Bits are not prepended with a Byte Order Mark.
    #[serde(rename = "UTF-16BE")]
    Utf16Be,
    ///With UTF-32, encoded bits must be prepended with a Byte Order Mark.  This mark indicates whether the data is encoded in big or little endian.
    #[serde(rename = "UTF-32")]
    Utf32,
    ///With UTF-32LE, encoded bits will always be represented as little endian.  Bits are not prepended with a Byte Order Mark.
    #[serde(rename = "UTF-32LE")]
    Utf32Le,
    ///With UTF-32BE, encoded bits will always be represented as big endian.  Bits are not prepended with a Byte Order Mark.
    #[serde(rename = "UTF-32BE")]
    Utf32Be,
}
///Describes a string parameter type. Three forms are supported: fixed length, variable length and variable length using a prefix. See StringDataEncodingType and StringDataType.
#[derive(Debug, Deserialize, Serialize)]
pub struct StringParameterType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    ///Used to derive one Data Type from another - will inherit all the attributes from the baseType any of which may be redefined in this type definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@baseType")]
    pub base_type: ::core::option::Option<NameReferenceWithPathType>,
    ///Initial values for string types, may include C language style (\n, \t, \", \\, etc.) escape sequences.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@initialValue")]
    pub initial_value: ::core::option::Option<super::xs::StringType>,
    ///restriction pattern is a regular expression
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@restrictionPattern")]
    pub restriction_pattern: ::core::option::Option<super::xs::StringType>,
    ///Optional hint to the implementation about the size of the engineering/calibrated data type to use internally. Generally this can be determined by examination of the encoding information for the string, but it is not always clear, so this attribute allows the extra hint when needed. A tolerant implementation will endeavor to always make sufficient size engineering data types to capture the entire range of possible characters.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@characterWidth")]
    pub character_width: ::core::option::Option<CharacterWidthType>,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<StringParameterTypeContent>,
}
///Describes a string parameter type. Three forms are supported: fixed length, variable length and variable length using a prefix. See StringDataEncodingType and StringDataType.
#[derive(Debug, Deserialize, Serialize)]
pub enum StringParameterTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///When appropriate, describe the units of measure that are represented by this parameter value.
    #[serde(rename = "UnitSet")]
    UnitSet(UnitSetType),
    ///Binary encoding is typically a "pass through" raw encoding form where one of the more common encodings is not required for the parameter.  A custom transformation capability is available if needed.
    #[serde(rename = "BinaryDataEncoding")]
    BinaryDataEncoding(BinaryDataEncodingType),
    ///Float encoding is a common encoding where the raw binary is in a form that gets interpreted as a decimal numeric value.
    #[serde(rename = "FloatDataEncoding")]
    FloatDataEncoding(FloatDataEncodingType),
    ///Integer encoding is a common encoding where the raw binary is in a form that gets interpreted as an integral value, either signed or unsigned.
    #[serde(rename = "IntegerDataEncoding")]
    IntegerDataEncoding(IntegerDataEncodingType),
    ///String encoding is a common encoding where the raw binary is in a form that gets interpreted as a character sequence.
    #[serde(rename = "StringDataEncoding")]
    StringDataEncoding(StringDataEncodingType),
    ///The size in bits may be greater than or equal to minInclusive.  It may be less than or equal to maxInclusive.  They both may be set indicating a closed range.
    #[serde(rename = "SizeRangeInCharacters")]
    SizeRangeInCharacters(IntegerRangeType),
    ///Default alarm definitions are those which do not adjust definition logic based on the value of other parameters.  Other parameters may participate in the determination of an alarm condition for this parameter, but the definition logic of the alarm on this parameter is constant.  If the alarming logic on this parameter changes based on the value of other parameters, then it is a ContextAlarm and belongs in the ContextAlarmList element.
    #[serde(rename = "DefaultAlarm")]
    DefaultAlarm(StringAlarmType),
    ///Context alarm definitions are those which adjust the definition logic for this parameter based on the value of other parameters.  A context which evaluates to being in effect, based on the testing of another parameter, takes precedence over the default alarms in the DefaultAlarm element.  If the no context alarm evaluates to being in effect, based on the testing of another parameter, then the default alarm definitions from the DefaultAlarm element will remain in effect.  If multiple contexts evaluate to being in effect, then the first one that appears will take precedence.
    #[serde(rename = "ContextAlarmList")]
    ContextAlarmList(StringContextAlarmListType),
}
///The pattern of bits used to look for frame synchronization.
#[derive(Debug, Deserialize, Serialize)]
pub struct SyncPatternType {
    ///CCSDS ASM for non-turbocoded frames = 1acffc1d
    #[serde(rename = "@pattern")]
    pub pattern: super::xs::HexBinaryType,
    #[serde(
        default = "SyncPatternType::default_bit_location_from_start_of_container",
        rename = "@bitLocationFromStartOfContainer"
    )]
    pub bit_location_from_start_of_container: super::xs::LongType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@mask")]
    pub mask: ::core::option::Option<super::xs::HexBinaryType>,
    ///truncate the mask from the left
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maskLengthInBits")]
    pub mask_length_in_bits: ::core::option::Option<PositiveLongType>,
    ///truncate the pattern from the left
    #[serde(rename = "@patternLengthInBits")]
    pub pattern_length_in_bits: PositiveLongType,
}
impl SyncPatternType {
    #[must_use]
    pub fn default_bit_location_from_start_of_container() -> super::xs::LongType {
        0i64
    }
}
///A Sync Strategy specifies the strategy on how to find frames within a stream of PCM data.  The sync strategy is based upon a state machine that begins in the 'Search' state until the first sync marker is found.  Then it goes into the 'Verify' state until a specified number of successive good sync markers are found.  Then, the state machine goes into the 'Lock' state, in the 'Lock' state frames are considered good.  Should a sync marker be missed in the 'Lock' state, the state machine will transition into the 'Check' state, if the next sync marker is where it's expected within a specified number of frames, then the state machine will transition back to the 'Lock' state, it not it will transition back to 'Search'.
#[derive(Debug, Deserialize, Serialize)]
pub struct SyncStrategyType {
    #[serde(
        default = "SyncStrategyType::default_verify_to_lock_good_frames",
        rename = "@verifyToLockGoodFrames"
    )]
    pub verify_to_lock_good_frames: NonNegativeLongType,
    #[serde(
        default = "SyncStrategyType::default_check_to_lock_good_frames",
        rename = "@checkToLockGoodFrames"
    )]
    pub check_to_lock_good_frames: NonNegativeLongType,
    ///Maximum number of bit errors in the sync pattern (marker).
    #[serde(
        default = "SyncStrategyType::default_max_bit_errors_in_sync_pattern",
        rename = "@maxBitErrorsInSyncPattern"
    )]
    pub max_bit_errors_in_sync_pattern: NonNegativeLongType,
    #[serde(default, rename = "AutoInvert")]
    pub auto_invert: ::core::option::Option<AutoInvertType>,
}
impl SyncStrategyType {
    #[must_use]
    pub fn default_verify_to_lock_good_frames() -> NonNegativeLongType {
        4i64
    }
    #[must_use]
    pub fn default_check_to_lock_good_frames() -> NonNegativeLongType {
        1i64
    }
    #[must_use]
    pub fn default_max_bit_errors_in_sync_pattern() -> NonNegativeLongType {
        0i64
    }
}
///The type attribute represents what from a space enterprise this SpaceSystem element represents.  See the enumerations for specific details.  Unknown is the default for backwards compatibility, though it should be avoided in newer documents.
#[derive(Debug, Deserialize, Serialize)]
pub enum SystemTypeType {
    ///An form of asset monitored and/or controlled by the enterprise that may participate in a larger group and may be subdivided into internal components.
    #[serde(rename = "asset")]
    Asset,
    ///A grouping of assets that make sense to aggregate together in the data model, such as a fleet or constellation.
    #[serde(rename = "assetGroup")]
    AssetGroup,
    ///Internal systems of assets permit managing the structure of XTCE documents by decomposing the internal structures of interest to tighten the scope of an individual SpaceSystem element.  The XInclude facility is also available at the SpaceSystem element for managing the size of XTCE documents, in addition to the internal organization.
    #[serde(rename = "assetComponent")]
    AssetComponent,
    ///The default enumeration is meant for backwards compatibility with earlier versions and should be avoided.
    #[serde(rename = "unknown")]
    Unknown,
}
///A telemetered Parameter is one that will have values in telemetry. A derived Parameter is one that is calculated, usually by an Algorithm. A constant Parameter is one that is used as a constant in the system (e.g. a vehicle id). A local Parameter is one that is used purely by the software locally (e.g. a ground command counter). A ground Parameter is one that is generated by an asset which is not the spacecraft.
#[derive(Debug, Deserialize, Serialize)]
pub enum TelemetryDataSourceType {
    #[serde(rename = "telemetered")]
    Telemetered,
    #[serde(rename = "derived")]
    Derived,
    #[serde(rename = "constant")]
    Constant,
    #[serde(rename = "local")]
    Local,
    #[serde(rename = "ground")]
    Ground,
}
///All the data about telemetry is contained in TelemetryMetaData
#[derive(Debug, Deserialize, Serialize)]
pub struct TelemetryMetaDataType {
    ///A list of parameter types
    #[serde(default, rename = "ParameterTypeSet")]
    pub parameter_type_set: ::core::option::Option<ParameterTypeSetType>,
    ///A list of Parameters for this Space System.
    #[serde(default, rename = "ParameterSet")]
    pub parameter_set: ::core::option::Option<ParameterSetType>,
    ///Holds the list of all potential container definitions for telemetry. Containers may parts of packets or TDM, and then groups of the containers, and then an entire entity -- such as a packet.  In order to maximize re-used for duplication, the pieces may defined once here, and then assembled as needed into larger structures, also here.
    #[serde(default, rename = "ContainerSet")]
    pub container_set: ::core::option::Option<ContainerSetType>,
    ///Messages are an alternative method of uniquely identifying containers within a Service.  A message provides a test in the form of MatchCriteria to match to a container.  A simple example might be: [When minorframeID=21, the message is the 21st minorframe container.  The collection of messages to search thru will be bound by a Service.
    #[serde(default, rename = "MessageSet")]
    pub message_set: ::core::option::Option<MessageSetType>,
    #[serde(default, rename = "StreamSet")]
    pub stream_set: ::core::option::Option<StreamSetType>,
    #[serde(default, rename = "AlgorithmSet")]
    pub algorithm_set: ::core::option::Option<AlgorithmSetType>,
}
///A term in a polynomial expression.
#[derive(Debug, Deserialize, Serialize)]
pub struct TermType {
    ///The coefficient in a single term of a polynomial expression.
    #[serde(rename = "@coefficient")]
    pub coefficient: super::xs::DoubleType,
    ///The exponent in a single term of a polynomial expression.  Should negative exponents be required, use a Math Calibrator style of definition for this type.
    #[serde(rename = "@exponent")]
    pub exponent: NonNegativeLongType,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct TimeAlarmRangesType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///A value of outside specifies that the most severe range is outside all the other ranges: -severe -critical -distress -warning -watch normal +watch +warning +distress +critical +severe.  This means each min, max pair are a range: (-inf, min) or (-inf, min], and [max, inf) or (max, inf).  However a value of inside "inverts" these bands: -normal -watch -warning -distress -critical severe +critical +distress +warning +watch, +normal.  This means each min, max pair form a range of (min, max) or [min, max) or (min, max] or [min, max]. The most common form used is "outside" and it is the default.  The set notation used defines parenthesis as exclusive and square brackets as inclusive.
    #[serde(default = "TimeAlarmRangesType::default_range_form", rename = "@rangeForm")]
    pub range_form: RangeFormType,
    ///Time units, with the default being in seconds.
    #[serde(default = "TimeAlarmRangesType::default_time_units", rename = "@timeUnits")]
    pub time_units: TimeUnitsType,
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: ::core::option::Option<AncillaryDataSetType>,
    ///A range of least concern. Considered to be below the most commonly used Warning level.
    #[serde(default, rename = "WatchRange")]
    pub watch_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern that represents the most commonly used minimum concern level for many software applications.
    #[serde(default, rename = "WarningRange")]
    pub warning_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern in between the most commonly used Warning and Critical levels.
    #[serde(default, rename = "DistressRange")]
    pub distress_range: ::core::option::Option<FloatRangeType>,
    ///A range of concern that represents the most commonly used maximum concern level for many software applications.
    #[serde(default, rename = "CriticalRange")]
    pub critical_range: ::core::option::Option<FloatRangeType>,
    ///A range of highest concern. Considered to be above the most commonly used Critical level.
    #[serde(default, rename = "SevereRange")]
    pub severe_range: ::core::option::Option<FloatRangeType>,
}
impl TimeAlarmRangesType {
    #[must_use]
    pub fn default_range_form() -> RangeFormType {
        RangeFormType::Outside
    }
    #[must_use]
    pub fn default_time_units() -> TimeUnitsType {
        TimeUnitsType::Seconds
    }
}
///Alarms associated with time data types
#[derive(Debug, Deserialize, Serialize)]
pub struct TimeAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "TimeAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "TimeAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "TimeAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::std::vec::Vec<TimeAlarmTypeContent>,
}
///Alarms associated with time data types
#[derive(Debug, Deserialize, Serialize)]
pub enum TimeAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    ///StaticAlarmRanges are used to trigger alarms when the parameter value passes some threshold value
    #[serde(rename = "StaticAlarmRanges")]
    StaticAlarmRanges(TimeAlarmRangesType),
    ///ChangePerSecondAlarmRanges are used to trigger alarms when the parameter value's rate-of-change passes some threshold value.  An alarm condition that triggers when the value changes too fast (or too slow)
    #[serde(rename = "ChangePerSecondAlarmRanges")]
    ChangePerSecondAlarmRanges(TimeAlarmRangesType),
}
impl TimeAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///Describes a time association consisting of an instance of an absolute time parameter (parameterRef) and this entry.  Because telemetry parameter instances are oftentimes "time-tagged" with a timing signal either provided on the ground or on the space system.  This data element allows one to specify which of possibly many AbsoluteTimeParameters to use to "time-tag" parameter instances with.  See AbsoluteTimeParameterType.
#[derive(Debug, Deserialize, Serialize)]
pub struct TimeAssociationType {
    #[serde(rename = "@parameterRef")]
    pub parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(default = "TimeAssociationType::default_instance", rename = "@instance")]
    pub instance: super::xs::LongType,
    #[serde(
        default = "TimeAssociationType::default_use_calibrated_value",
        rename = "@useCalibratedValue"
    )]
    pub use_calibrated_value: super::xs::BooleanType,
    ///If true, then the current value of the AbsoluteTime will be projected to current time.  In other words, if the value of the AbsoluteTime parameter was set 10 seconds ago, then 10 seconds will be added to its value before associating this time with the parameter.
    #[serde(
        default = "TimeAssociationType::default_interpolate_time",
        rename = "@interpolateTime"
    )]
    pub interpolate_time: super::xs::BooleanType,
    ///The offset is used to supply a relative time offset from the time association and to this parameter
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@offset")]
    pub offset: ::core::option::Option<super::xs::DoubleType>,
    ///Specify the units the offset is in, the default is seconds.
    #[serde(default = "TimeAssociationType::default_unit", rename = "@unit")]
    pub unit: TimeAssociationUnitType,
}
impl TimeAssociationType {
    #[must_use]
    pub fn default_instance() -> super::xs::LongType {
        0i64
    }
    #[must_use]
    pub fn default_use_calibrated_value() -> super::xs::BooleanType {
        true
    }
    #[must_use]
    pub fn default_interpolate_time() -> super::xs::BooleanType {
        true
    }
    #[must_use]
    pub fn default_unit() -> TimeAssociationUnitType {
        TimeAssociationUnitType::Seconds
    }
}
///Time units the time association decimal value is in.
#[derive(Debug, Deserialize, Serialize)]
pub enum TimeAssociationUnitType {
    #[serde(rename = "seconds")]
    Seconds,
    #[serde(rename = "milliseconds")]
    Milliseconds,
    #[serde(rename = "microseconds")]
    Microseconds,
    #[serde(rename = "nanoseconds")]
    Nanoseconds,
    #[serde(rename = "picoseconds")]
    Picoseconds,
    #[serde(rename = "minutes")]
    Minutes,
    #[serde(rename = "hours")]
    Hours,
    #[serde(rename = "days")]
    Days,
    #[serde(rename = "months")]
    Months,
    #[serde(rename = "years")]
    Years,
}
///An ordered collection of temporal alarms associated with a context. A context is an alarm definition on a parameter which is valid only in the case of a test on the value of other parameters. Process the contexts in list order. See TimeContextAlarmType.
#[derive(Debug, Deserialize, Serialize)]
pub struct TimeContextAlarmListType {
    ///A Context contains a new alarm definition and a context match.  The match takes precedence over any default alarm when the first in the overall list evaluates to true.  It is also possible the alarm definition is empty, in which case the context means no alarm defined when the match is true.
    #[serde(default, rename = "ContextAlarm")]
    pub context_alarm: ::std::vec::Vec<TimeContextAlarmType>,
}
///Context alarms are applied when the ContextMatch is true.  Context alarms override Default alarms
#[derive(Debug, Deserialize, Serialize)]
pub struct TimeContextAlarmType {
    ///The alarm definition may be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///An optional brief description of this alarm definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The number of successive instances that meet the alarm conditions for the alarm to trigger. The default is 1.
    #[serde(
        default = "TimeContextAlarmType::default_min_violations",
        rename = "@minViolations"
    )]
    pub min_violations: PositiveLongType,
    ///Optionally specify the number of successive instances that do not meet the alarm conditions to leave the alarm state. If this attribute is not specified, it is treated as being equal to minViolations (symmetric).
    #[serde(
        default = "TimeContextAlarmType::default_min_conformance",
        rename = "@minConformance"
    )]
    pub min_conformance: PositiveLongType,
    ///The initial state of this alarm definition as delivered.  When true, this leaves the alarm definition empty for the parameter and also short circuits the remaining context matches and the default so no alarm is active on the parameter.
    #[serde(default = "TimeContextAlarmType::default_disabled", rename = "@disabled")]
    pub disabled: super::xs::BooleanType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<TimeContextAlarmTypeContent>,
}
///Context alarms are applied when the ContextMatch is true.  Context alarms override Default alarms
#[derive(Debug, Deserialize, Serialize)]
pub enum TimeContextAlarmTypeContent {
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///A MatchCriteria may be specified for each of the 5 alarm levels. Each level is optional and the alarm should be the highest level to test true.
    #[serde(rename = "AlarmConditions")]
    AlarmConditions(AlarmConditionsType),
    ///An escape for ridiculously complex alarm conditions. Will trigger on changes to the containing Parameter.
    #[serde(rename = "CustomAlarm")]
    CustomAlarm(CustomAlarmType),
    ///StaticAlarmRanges are used to trigger alarms when the parameter value passes some threshold value
    #[serde(rename = "StaticAlarmRanges")]
    StaticAlarmRanges(TimeAlarmRangesType),
    ///ChangePerSecondAlarmRanges are used to trigger alarms when the parameter value's rate-of-change passes some threshold value.  An alarm condition that triggers when the value changes too fast (or too slow)
    #[serde(rename = "ChangePerSecondAlarmRanges")]
    ChangePerSecondAlarmRanges(TimeAlarmRangesType),
    #[serde(rename = "ContextMatch")]
    ContextMatch(ContextMatchType),
}
impl TimeContextAlarmType {
    #[must_use]
    pub fn default_min_violations() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_min_conformance() -> PositiveLongType {
        1i64
    }
    #[must_use]
    pub fn default_disabled() -> super::xs::BooleanType {
        false
    }
}
///Base time unit of measure.  It is best practice to avoid days, months, and years due to ambiguity involving leap seconds and leap days.  If these are used, the system should document how the leaps are handled.
#[derive(Debug, Deserialize, Serialize)]
pub enum TimeUnitsType {
    #[serde(rename = "seconds")]
    Seconds,
    #[serde(rename = "milliseconds")]
    Milliseconds,
    #[serde(rename = "microseconds")]
    Microseconds,
    #[serde(rename = "nanoseconds")]
    Nanoseconds,
    #[serde(rename = "picoseconds")]
    Picoseconds,
    #[serde(rename = "minutes")]
    Minutes,
    #[serde(rename = "hours")]
    Hours,
    #[serde(rename = "days")]
    Days,
    #[serde(rename = "months")]
    Months,
    #[serde(rename = "years")]
    Years,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum TimeWindowIsRelativeToType {
    #[serde(rename = "commandRelease")]
    CommandRelease,
    #[serde(rename = "timeLastVerifierPassed")]
    TimeLastVerifierPassed,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct ToStringType {
    ///This element describes how a numeric value should be represented in engineering/calibrated form.  The defaults reflect the most common form.
    #[serde(rename = "NumberFormat")]
    pub number_format: NumberFormatType,
}
///Transferred to range means the command has been received to the network that connects the ground system to the spacecraft.  Typically, this verifier would come from something other than the spacecraft, such as a modem or front end processor.
#[derive(Debug, Deserialize, Serialize)]
pub struct TransferredToRangeVerifierType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///Optional name of this defined item.  See NameType for restriction information.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<NameType>,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<TransferredToRangeVerifierTypeContent>,
}
///Transferred to range means the command has been received to the network that connects the ground system to the spacecraft.  Typically, this verifier would come from something other than the spacecraft, such as a modem or front end processor.
#[derive(Debug, Deserialize, Serialize)]
pub enum TransferredToRangeVerifierTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Verification is a list of comparisons.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///Verification is a new instance of the referenced container. For example, sending a command to download memory then receiving a packet with the memory download would be verified upon receipt of the packet.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    ///Verification is a telemetry parameter value change on the ground.  For example, a command counter.
    #[serde(rename = "ParameterValueChange")]
    ParameterValueChange(ParameterValueChangeType),
    ///Verification is outside the scope of regular command and telemetry processing.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Verification is a boolean expression of conditions.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///Verification is a single comparison.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///Define a time window for checking for verification.
    #[serde(rename = "CheckWindow")]
    CheckWindow(CheckWindowType),
    ///Define a time window algorithmically for verification.
    #[serde(rename = "CheckWindowAlgorithms")]
    CheckWindowAlgorithms(CheckWindowAlgorithmsType),
    ///Optional list of argument values that manifest this post-transmission validation parameter value check.  When not present, this check applies to all instances of the command.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
}
///Appended to the TramsmissionConstraint List of the base command.  Constraints are checked in order.
#[derive(Debug, Deserialize, Serialize)]
pub struct TransmissionConstraintListType {
    ///A constraint that potentially blocks transmission of this command based on parameter values for all instances or optionally limited to only when specified argument values are used in the command.
    #[serde(default, rename = "TransmissionConstraint")]
    pub transmission_constraint: ::std::vec::Vec<TransmissionConstraintType>,
}
///A CommandTransmission constraint is used to check that the command can be run in the current operating mode and may block the transmission of the command if the constraint condition is true.
#[derive(Debug, Deserialize, Serialize)]
pub struct TransmissionConstraintType {
    ///Pause during timeOut, fail when the timeout passes
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@timeOut")]
    pub time_out: ::core::option::Option<RelativeTimeType>,
    ///Indicates whether the constraints for a Command may be suspended.
    #[serde(
        default = "TransmissionConstraintType::default_suspendable",
        rename = "@suspendable"
    )]
    pub suspendable: super::xs::BooleanType,
    #[serde(default, rename = "$value")]
    pub content: ::core::option::Option<TransmissionConstraintTypeContent>,
}
///A CommandTransmission constraint is used to check that the command can be run in the current operating mode and may block the transmission of the command if the constraint condition is true.
#[derive(Debug, Deserialize, Serialize)]
pub enum TransmissionConstraintTypeContent {
    ///A simple comparison check involving a single test of a parameter value.
    #[serde(rename = "Comparison")]
    Comparison(ComparisonType),
    ///A series of simple comparison checks with an implicit 'and' in that they all must be true for the overall condition to be true.
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ///An arbitrarily complex boolean expression that has additional flexibility on the terms beyond the Comparison and ComparisonList elements.
    #[serde(rename = "BooleanExpression")]
    BooleanExpression(BooleanExpressionType),
    ///An escape to an externally defined algorithm.
    #[serde(rename = "CustomAlgorithm")]
    CustomAlgorithm(InputAlgorithmType),
    ///Optional list of argument values that manifest this pre-transmission constraint parameter value check.
    #[serde(rename = "ArgumentRestrictionList")]
    ArgumentRestrictionList(ArgumentAssignmentListType),
}
impl TransmissionConstraintType {
    #[must_use]
    pub fn default_suspendable() -> super::xs::BooleanType {
        false
    }
}
///A trigger is used to initiate the processing of some algorithm.  A trigger may be based on an update of a Parameter, receipt of a Container, or on a time basis.  Triggers may also have a maximum rate that limits how often the trigger can be invoked.
#[derive(Debug, Deserialize, Serialize)]
pub struct TriggerSetType {
    ///Triggers may optionally be named.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///This attribute is a maximum rate that constrains how quickly this trigger may evaluate the algorithm to avoid flooding the implementation.  The default is once per second.  Setting to 0 results in no maximum.
    #[serde(default = "TriggerSetType::default_trigger_rate", rename = "@triggerRate")]
    pub trigger_rate: NonNegativeLongType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<TriggerSetTypeContent>,
}
///A trigger is used to initiate the processing of some algorithm.  A trigger may be based on an update of a Parameter, receipt of a Container, or on a time basis.  Triggers may also have a maximum rate that limits how often the trigger can be invoked.
#[derive(Debug, Deserialize, Serialize)]
pub enum TriggerSetTypeContent {
    ///This element instructs the trigger to invoke the algorithm evaluation when a Parameter update is received.
    #[serde(rename = "OnParameterUpdateTrigger")]
    OnParameterUpdateTrigger(OnParameterUpdateTriggerType),
    ///This element instructs the trigger to invoke the algorithm evaluation when a Container is received.
    #[serde(rename = "OnContainerUpdateTrigger")]
    OnContainerUpdateTrigger(OnContainerUpdateTriggerType),
    ///This element instructs the trigger to invoke the algorithm evaluation using a timer.
    #[serde(rename = "OnPeriodicRateTrigger")]
    OnPeriodicRateTrigger(OnPeriodicRateTriggerType),
}
impl TriggerSetType {
    #[must_use]
    pub fn default_trigger_rate() -> NonNegativeLongType {
        1i64
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct TriggeredMathOperationType {
    ///Optional name for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@name")]
    pub name: ::core::option::Option<super::xs::StringType>,
    ///Optional description for this calibrator/algorithm
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@outputParameterRef")]
    pub output_parameter_ref: ExpandedNameReferenceWithPathType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<TriggeredMathOperationTypeContent>,
}
#[derive(Debug, Deserialize, Serialize)]
pub enum TriggeredMathOperationTypeContent {
    ///Optional additional ancillary information for this calibrator/algorithm
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///Use a constant in the calculation.
    #[serde(rename = "ValueOperand")]
    ValueOperand(super::xs::StringType),
    ///Use the value of this parameter in the calculation. It is the calibrator's value only.  If the raw value is needed, specify it explicitly using ParameterInstanceRefOperand. Note this element has no content.
    #[serde(rename = "ThisParameterOperand")]
    ThisParameterOperand(super::xs::StringType),
    ///All operators utilize operands on the top values in the stack and leaving the result on the top of the stack.  Ternary operators utilize the top three operands on the stack, binary operators utilize the top two operands on the stack, and unary operators use the top operand on the stack.
    #[serde(rename = "Operator")]
    Operator(MathOperatorsType),
    ///This element is used to reference the last received/assigned value of any Parameter in this math operation.
    #[serde(rename = "ParameterInstanceRefOperand")]
    ParameterInstanceRefOperand(ParameterInstanceRefType),
    #[serde(rename = "TriggerSet")]
    TriggerSet(TriggerSetType),
}
///Defines enumerated values to categorize a unit associated with a telemetered value.  Typically the unit refers to the calibrated (engineering) value.  In some cases the unit may be associated with the uncalibrated or raw values.  Uncalibrated and raw here are typically synonymous, but there are exceptions.
#[derive(Debug, Deserialize, Serialize)]
pub enum UnitFormType {
    ///The unit of measure for this value refers to the engineer/calibrated value.
    #[serde(rename = "calibrated")]
    Calibrated,
    ///The unit of measure for this value refers to the pre-calibrated data, after extraction from the data stream, when in the local native data type.  This is unusual, but present in some cases.
    #[serde(rename = "uncalibrated")]
    Uncalibrated,
    ///The unit of measure for this value refers to the raw binary value from the data stream, prior to conversion to the local native data type and application of calibrators.
    #[serde(rename = "raw")]
    Raw,
}
///Describe an ordered collection of units that form a unit-expression.  Units may be described for both calibrated/engineering values and also potentially uncalibrated/raw values.  See UnitType.
#[derive(Debug, Deserialize, Serialize)]
pub struct UnitSetType {
    ///Describe the exponent, factor, form, and description for a unit.  The attributes are optional because different programs use this element in different ways, depending on vendor support.
    #[serde(default, rename = "Unit")]
    pub unit: ::std::vec::Vec<UnitType>,
}
///Describe the exponent, factor, form, and description for a unit.  The unit itself is in element Unit in UnitSet.  See UnitSetType.  The attributes are optional because different programs use this element in different ways, depending on vendor support.
#[derive(Debug, Deserialize, Serialize)]
pub struct UnitType {
    ///Optional attribute used in conjunction with the "factor" attribute where some programs choose to specify the unit definition with these machine processable algebraic features.  For example, a unit text of "meters" may have a "power" attribute of 2, resulting "meters squared" as the actual unit.  This is not commonly used.  The most common method for "meters squared" is to use the text content of the Unit element in a form like "m^2".
    #[serde(default = "UnitType::default_power", rename = "@power")]
    pub power: super::xs::DoubleType,
    ///Optional attribute used in conjunction with the "power" attribute where some programs choose to specify the unit definition with these machine processable algebraic features.  For example, a unit text of "meters" may have a "factor" attribute of 2, resulting "2 times meters" as the actual unit.  This is not commonly used.  The most common method for "2 times meters" is to use the text content of the Unit element in a form like "2*m".
    #[serde(default = "UnitType::default_factor", rename = "@factor")]
    pub factor: super::xs::StringType,
    ///A description of the unit, which may be for expanded human readability or for specification of the nature/property of the unit.  For example, meters per second squared is of a nature/property of acceleration.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@description")]
    pub description: ::core::option::Option<ShortDescriptionType>,
    ///The default value "calibrated" is most common practice to specify units at the engineering/calibrated value, it is possible to specify an additional Unit element for the raw/uncalibrated value.
    #[serde(default = "UnitType::default_form", rename = "@form")]
    pub form: UnitFormType,
    #[serde(default, rename = "$text")]
    pub text: ::core::option::Option<::std::string::String>,
}
impl UnitType {
    #[must_use]
    pub fn default_power() -> super::xs::DoubleType {
        1f64
    }
    #[must_use]
    pub fn default_factor() -> super::xs::StringType {
        ::std::string::String::from("1")
    }
    #[must_use]
    pub fn default_form() -> UnitFormType {
        UnitFormType::Calibrated
    }
}
///Numerical ranges that define the universe of valid values for this argument.  A single range is the most common, although it is possible to define multiple ranges when the valid values are not contiguous.
#[derive(Debug, Deserialize, Serialize)]
pub struct ValidFloatRangeSetType {
    ///By default and general recommendation, the valid range is specified in engineering/calibrated values, although this can be adjusted.
    #[serde(
        default = "ValidFloatRangeSetType::default_valid_range_applies_to_calibrated",
        rename = "@validRangeAppliesToCalibrated"
    )]
    pub valid_range_applies_to_calibrated: super::xs::BooleanType,
    ///A valid range constrains the whole set of possible values that could be encoded by the data type to a more "valid" or "reasonable" set of values.  This should be treated as a boundary check in an implementation to validate the input or output value.  Typically, only 1 range is used.  In cases where multiple ranges are used, then the value is valid when it is valid in any of the provided ranges.  Implementations may also use these ranges to enhance user interface displays and other visualization widgets as appropriate for the type.
    #[serde(default, rename = "ValidRange")]
    pub valid_range: ::std::vec::Vec<FloatRangeType>,
}
impl ValidFloatRangeSetType {
    #[must_use]
    pub fn default_valid_range_applies_to_calibrated() -> super::xs::BooleanType {
        true
    }
}
///Numerical ranges that define the universe of valid values for this argument.  A single range is the most common, although it is possible to define multiple ranges when the valid values are not contiguous.
#[derive(Debug, Deserialize, Serialize)]
pub struct ValidIntegerRangeSetType {
    ///By default and general recommendation, the valid range is specified in engineering/calibrated values, although this can be adjusted.
    #[serde(
        default = "ValidIntegerRangeSetType::default_valid_range_applies_to_calibrated",
        rename = "@validRangeAppliesToCalibrated"
    )]
    pub valid_range_applies_to_calibrated: super::xs::BooleanType,
    ///A valid range constrains the whole set of possible values that could be encoded by the data type to a more "valid" or "reasonable" set of values.  This should be treated as a boundary check in an implementation to validate the input or output value.  Typically, only 1 range is used.  In cases where multiple ranges are used, then the value is valid when it is valid in any of the provided ranges.  Implementations may also use these ranges to enhance user interface displays and other visualization widgets as appropriate for the type.
    #[serde(default, rename = "ValidRange")]
    pub valid_range: ::std::vec::Vec<IntegerRangeType>,
}
impl ValidIntegerRangeSetType {
    #[must_use]
    pub fn default_valid_range_applies_to_calibrated() -> super::xs::BooleanType {
        true
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub enum ValidationStatusType {
    #[serde(rename = "Unknown")]
    Unknown,
    #[serde(rename = "Working")]
    Working,
    #[serde(rename = "Draft")]
    Draft,
    #[serde(rename = "Test")]
    Test,
    #[serde(rename = "Validated")]
    Validated,
    #[serde(rename = "Released")]
    Released,
    #[serde(rename = "Withdrawn")]
    Withdrawn,
}
///Describe a value and an associated string label, see EnumerationListType.
#[derive(Debug, Deserialize, Serialize)]
pub struct ValueEnumerationType {
    ///Numeric raw/uncalibrated value to associate with a string enumeration label.
    #[serde(rename = "@value")]
    pub value: super::xs::LongType,
    ///If max value is given, the label maps to a range where value is less than or equal to maxValue. The range is inclusive.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxValue")]
    pub max_value: ::core::option::Option<super::xs::LongType>,
    ///String enumeration label to apply to this value definition in the enumeration.
    #[serde(rename = "@label")]
    pub label: super::xs::StringType,
    ///An optional additional string description can be specified for this enumeration label to provide extended information if desired.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
}
///For streams that contain a series of frames with a variable frame length where the frames are found by looking for a series of one's or zero's (usually one's).  The series is called the flag.   in the PCM stream that are usually made to be illegal in the PCM stream by zero or one bit insertion.
#[derive(Debug, Deserialize, Serialize)]
pub struct VariableFrameStreamType {
    ///Optional short description to be used for explanation of this item.  It is recommended that the short description be kept under 80 characters in length.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@shortDescription")]
    pub short_description: ::core::option::Option<ShortDescriptionType>,
    ///The name of this defined item.  See NameType for restriction information.
    #[serde(rename = "@name")]
    pub name: NameType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@bitRateInBPS")]
    pub bit_rate_in_bps: ::core::option::Option<super::xs::DoubleType>,
    #[serde(default = "VariableFrameStreamType::default_pcm_type", rename = "@pcmType")]
    pub pcm_type: PcmType,
    #[serde(default = "VariableFrameStreamType::default_inverted", rename = "@inverted")]
    pub inverted: super::xs::BooleanType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<VariableFrameStreamTypeContent>,
}
///For streams that contain a series of frames with a variable frame length where the frames are found by looking for a series of one's or zero's (usually one's).  The series is called the flag.   in the PCM stream that are usually made to be illegal in the PCM stream by zero or one bit insertion.
#[derive(Debug, Deserialize, Serialize)]
pub enum VariableFrameStreamTypeContent {
    ///Optional long form description to be used for explanatory descriptions of this item and may include HTML markup using CDATA.  Long Descriptions are of unbounded length.
    #[serde(rename = "LongDescription")]
    LongDescription(LongDescriptionType),
    ///Used to contain an alias (alternate) name or ID for this item.   See AliasSetType for additional explanation.
    #[serde(rename = "AliasSet")]
    AliasSet(AliasSetType),
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    #[serde(rename = "AncillaryDataSet")]
    AncillaryDataSet(AncillaryDataSetType),
    ///This Container (usually abstract) is the container that is in the fixed frame stream.  Normally, this is a general container type from which many specific containers are inherited.
    #[serde(rename = "ContainerRef")]
    ContainerRef(ContainerRefType),
    #[serde(rename = "ServiceRef")]
    ServiceRef(ServiceRefType),
    ///This is a reference to a connecting stream - say a custom stream.
    #[serde(rename = "StreamRef")]
    StreamRef(StreamRefType),
    #[serde(rename = "SyncStrategy")]
    SyncStrategy(VariableFrameSyncStrategyType),
}
impl VariableFrameStreamType {
    #[must_use]
    pub fn default_pcm_type() -> PcmType {
        PcmType::Nrzl
    }
    #[must_use]
    pub fn default_inverted() -> super::xs::BooleanType {
        false
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct VariableFrameSyncStrategyType {
    #[serde(
        default = "VariableFrameSyncStrategyType::default_verify_to_lock_good_frames",
        rename = "@verifyToLockGoodFrames"
    )]
    pub verify_to_lock_good_frames: NonNegativeLongType,
    #[serde(
        default = "VariableFrameSyncStrategyType::default_check_to_lock_good_frames",
        rename = "@checkToLockGoodFrames"
    )]
    pub check_to_lock_good_frames: NonNegativeLongType,
    ///Maximum number of bit errors in the sync pattern (marker).
    #[serde(
        default = "VariableFrameSyncStrategyType::default_max_bit_errors_in_sync_pattern",
        rename = "@maxBitErrorsInSyncPattern"
    )]
    pub max_bit_errors_in_sync_pattern: NonNegativeLongType,
    #[serde(default, rename = "AutoInvert")]
    pub auto_invert: ::core::option::Option<AutoInvertType>,
    #[serde(rename = "Flag")]
    pub flag: FlagType,
}
impl VariableFrameSyncStrategyType {
    #[must_use]
    pub fn default_verify_to_lock_good_frames() -> NonNegativeLongType {
        4i64
    }
    #[must_use]
    pub fn default_check_to_lock_good_frames() -> NonNegativeLongType {
        1i64
    }
    #[must_use]
    pub fn default_max_bit_errors_in_sync_pattern() -> NonNegativeLongType {
        0i64
    }
}
///Describe a variable string whose length may change between samples.
#[derive(Debug, Deserialize, Serialize)]
pub struct VariableStringType {
    ///The upper bound of the size of this string data type so that the implementation can reserve/allocate enough memory to capture all reported instances of the string.
    #[serde(rename = "@maxSizeInBits")]
    pub max_size_in_bits: PositiveLongType,
    #[serde(rename = "$value")]
    pub content: ::std::vec::Vec<VariableStringTypeContent>,
}
///Describe a variable string whose length may change between samples.
#[derive(Debug, Deserialize, Serialize)]
pub enum VariableStringTypeContent {
    ///Determine the container size in bits by interrogating an instance of a parameter.
    #[serde(rename = "DynamicValue")]
    DynamicValue(DynamicValueType),
    ///Determine the container size in bits by interrogating an instance of a parameter and selecting a specified value based on tests of the value of that parameter.
    #[serde(rename = "DiscreteLookupList")]
    DiscreteLookupList(DiscreteLookupListType),
    ///In some string implementations, the size of the string contents (not the memory allocation size) is determined by a leading numeric value.  This is sometimes referred to as Pascal strings.  If a LeadingSize is specified, then the TerminationChar element does not have a functional meaning.
    #[serde(rename = "LeadingSize")]
    LeadingSize(LeadingSizeType),
    ///The termination character that represents the end of the string contents.  For C and most strings, this is null (00), which is the default.
    #[serde(rename = "TerminationChar")]
    TerminationChar(super::xs::HexBinaryType),
}
///An enumerated list of verifier types
#[derive(Debug, Deserialize, Serialize)]
pub enum VerifierEnumerationType {
    #[serde(rename = "release")]
    Release,
    #[serde(rename = "transferredToRange")]
    TransferredToRange,
    #[serde(rename = "sentFromRange")]
    SentFromRange,
    #[serde(rename = "received")]
    Received,
    #[serde(rename = "accepted")]
    Accepted,
    #[serde(rename = "queued")]
    Queued,
    #[serde(rename = "executing")]
    Executing,
    #[serde(rename = "complete")]
    Complete,
    #[serde(rename = "failed")]
    Failed,
}
///Describe a collection of unordered verifiers.  A command verifier is a conditional check on the telemetry from a SpaceSystem that that provides positive indication on the processing state of a command.  There are eight different verifiers each associated with different states in command processing: TransferredToRange, TransferredFromRange, Received, Accepted, Queued, Execution, Complete, and Failed.  There may be multiple "complete" and "execution" verifiers. If the MetaCommand is part of an inheritance relation (BaseMetaCommand), the "complete" and "execution" verifier sets are appended to any defined in the parent MetaCommand. All others will override a verifier defined in a BaseMetaCommand.  Duplicate verifiers in the list of CompleteVerifiers and ExecutionVerifiers before and after appending to the verifiers in BaseMetaCommand should be avoided. See MetaCommandType and BaseMetaCommandType for additional information.
#[derive(Debug, Deserialize, Serialize)]
pub struct VerifierSetType {
    ///Transferred to range means the command has been received to the network that connects the ground system to the spacecraft.  Typically, this verifier would come from something other than the spacecraft, such as a modem or front end processor.
    #[serde(default, rename = "TransferredToRangeVerifier")]
    pub transferred_to_range_verifier: ::core::option::Option<
        TransferredToRangeVerifierType,
    >,
    ///Sent from range means the command has been transmitted to the spacecraft by the network that connects the ground system to the spacecraft.  Typically, this verifier would come from something other than the spacecraft, such as a modem or front end processor.
    #[serde(default, rename = "SentFromRangeVerifier")]
    pub sent_from_range_verifier: ::core::option::Option<SentFromRangeVerifierType>,
    ///A verifier that simply means the destination has received the command.
    #[serde(default, rename = "ReceivedVerifier")]
    pub received_verifier: ::core::option::Option<ReceivedVerifierType>,
    ///A verifier that means the destination has accepted the command.
    #[serde(default, rename = "AcceptedVerifier")]
    pub accepted_verifier: ::core::option::Option<AcceptedVerifierType>,
    ///A verifer that means the command is scheduled for execution by the destination.
    #[serde(default, rename = "QueuedVerifier")]
    pub queued_verifier: ::core::option::Option<QueuedVerifierType>,
    ///A verifier that indicates that the command is being executed.  An optional Element indicates how far along the command has progressed either as a fixed value or an (possibly scaled) ParameterInstance value.
    #[serde(default, rename = "ExecutionVerifier")]
    pub execution_verifier: ::std::vec::Vec<ExecutionVerifierType>,
    ///A possible set of verifiers that all must be true for the command be considered completed.  Consider that some may not participate due to argument value restriction, if that element is used.
    #[serde(default, rename = "CompleteVerifier")]
    pub complete_verifier: ::std::vec::Vec<CompleteVerifierType>,
    ///When true, indicates that the command failed.  timeToWait is how long to wait for the FailedVerifier to test true.
    #[serde(default, rename = "FailedVerifier")]
    pub failed_verifier: ::core::option::Option<FailedVerifierType>,
}
///Describe an exclusive or (XOR) checksum definition. See ErrorDetectCorrectType.
#[derive(Debug, Deserialize, Serialize)]
pub struct XorType {
    ///An offset of non-zero may be specified to skip some bits against the reference position in the reference attribute.
    #[serde(
        default = "XorType::default_bits_from_reference",
        rename = "@bitsFromReference"
    )]
    pub bits_from_reference: NonNegativeLongType,
    ///The bits involved in the calculation may start at the beginning or the end of the container.
    #[serde(default = "XorType::default_reference", rename = "@reference")]
    pub reference: ReferencePointType,
    ///Reference to the parameter that contains the value of this computed XOR based on this container.  This attribute is optional because not all implementations verify (telemetry) or create (telecommand) error control fields using the XTCE definition.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@parameterRef")]
    pub parameter_ref: ::core::option::Option<ExpandedNameReferenceWithPathType>,
}
impl XorType {
    #[must_use]
    pub fn default_bits_from_reference() -> NonNegativeLongType {
        0i64
    }
    #[must_use]
    pub fn default_reference() -> ReferencePointType {
        ReferencePointType::Start
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub enum ChecksumTypeNameType {
    #[serde(rename = "unix_sum")]
    UnixSum,
    #[serde(rename = "sum8")]
    Sum8,
    #[serde(rename = "sum16")]
    Sum16,
    #[serde(rename = "sum24")]
    Sum24,
    #[serde(rename = "sum32")]
    Sum32,
    #[serde(rename = "fletcher4")]
    Fletcher4,
    #[serde(rename = "fletcher8")]
    Fletcher8,
    #[serde(rename = "fletcher16")]
    Fletcher16,
    #[serde(rename = "fletcher32")]
    Fletcher32,
    #[serde(rename = "adler32")]
    Adler32,
    #[serde(rename = "luhn")]
    Luhn,
    #[serde(rename = "verhoeff")]
    Verhoeff,
    #[serde(rename = "damm")]
    Damm,
    ///Document a custom checksum algorithm in the InputAlgorithm element.
    #[serde(rename = "custom")]
    Custom,
}
///The ValidRange defines the span of valid values for this data type.  This is a subset within the data type itself.  For example, an IEEE754 encoded float has almost a universal of possible values.  However, the known possible valid range may only span -180.0 to +180.0, due to the physics of the measurement.  So, the valid range provides additional boundary/constraint information beyond that of the data encoding in the range of possible values that are meaningful to this parameter.  The valid range is not to be construed as an alarm definition and is not affected by any alarm definitions, instead violations of the valid range make a parameter value "unreasonable", as opposed to reasonable to be reported.  The exact effect of this state which should be of concern is implementation dependent.
pub type FloatDataTypeValidRange = FloatDataTypeValidRangeElementType;
///The ValidRange defines the span of valid values for this data type.  This is a subset within the data type itself.  For example, a 16 bit unsigned integer has possible values from 0 to 65535.  However, the known possible valid range may only span 0 to 999, due to the physics of the measurement.  So, the valid range provides additional boundary/constraint information beyond that of the data encoding in the range of possible values that are meaningful to this parameter.  The valid range is not to be construed as an alarm definition and is not affected by any alarm definitions, instead violations of the valid range make a parameter value "unreasonable", as opposed to reasonable to be reported.  The exact effect of this state which should be of concern is implementation dependent.
pub type IntegerDataTypeValidRange = IntegerDataTypeValidRangeElementType;
///0 to 100 percent
pub type PercentCompleteTypeFixedValue = PercentCompleteTypeFixedValueElementType;
///This is the simplest case of a string data type where the encoding size of the string does not change.
pub type SizeInBitsTypeFixed = SizeInBitsTypeFixedElementType;
#[derive(Debug, Deserialize, Serialize)]
pub struct FloatDataTypeValidRangeElementType {
    ///Minimum decimal/real number value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minInclusive")]
    pub min_inclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Minimum decimal/real number value excluding itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minExclusive")]
    pub min_exclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Maximum decimal/real number value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxInclusive")]
    pub max_inclusive: ::core::option::Option<super::xs::DoubleType>,
    ///Maximum decimal/real number value excluding itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxExclusive")]
    pub max_exclusive: ::core::option::Option<super::xs::DoubleType>,
    ///By default and general recommendation, the valid range is specified in engineering/calibrated values, although this can be adjusted.
    #[serde(
        default = "FloatDataTypeValidRangeElementType::default_valid_range_applies_to_calibrated",
        rename = "@validRangeAppliesToCalibrated"
    )]
    pub valid_range_applies_to_calibrated: super::xs::BooleanType,
}
impl FloatDataTypeValidRangeElementType {
    #[must_use]
    pub fn default_valid_range_applies_to_calibrated() -> super::xs::BooleanType {
        true
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct IntegerDataTypeValidRangeElementType {
    ///Minimum integer value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@minInclusive")]
    pub min_inclusive: ::core::option::Option<super::xs::LongType>,
    ///Maximum integer value including itself.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@maxInclusive")]
    pub max_inclusive: ::core::option::Option<super::xs::LongType>,
    ///By default and general recommendation, the valid range is specified in engineering/calibrated values, although this can be adjusted.
    #[serde(
        default = "IntegerDataTypeValidRangeElementType::default_valid_range_applies_to_calibrated",
        rename = "@validRangeAppliesToCalibrated"
    )]
    pub valid_range_applies_to_calibrated: super::xs::BooleanType,
}
impl IntegerDataTypeValidRangeElementType {
    #[must_use]
    pub fn default_valid_range_applies_to_calibrated() -> super::xs::BooleanType {
        true
    }
}
pub type PercentCompleteTypeFixedValueElementType = ::core::primitive::f64;
#[derive(Debug, Deserialize, Serialize)]
pub struct SizeInBitsTypeFixedElementType {
    ///Size in bits of this string data type for both the memory allocation in the implementing software and also the size in bits for this parameter when it appears in a container.
    #[serde(rename = "FixedValue")]
    pub fixed_value: PositiveLongType,
}
