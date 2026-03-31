//! Serde helpers for XML deserialization and serialization with quick-xml.

use serde::{Deserialize, Deserializer};

/// Deserialize an enum from XML content using $value wrapper pattern.
pub fn deserialize_enum_content<'de, D, T>(deserializer: D) -> Result<T, D::Error>
where
    D: Deserializer<'de>,
    T: Deserialize<'de>,
{
    #[derive(Deserialize)]
    struct Wrapper<T> {
        #[serde(rename = "$value")]
        inner: T,
    }

    let wrapper = Wrapper::<T>::deserialize(deserializer)?;
    Ok(wrapper.inner)
}

/// Deserialize `Option<Enum>` from XML content using $value wrapper pattern.
pub fn deserialize_optional_enum_content<'de, D, T>(
    deserializer: D,
) -> Result<Option<T>, D::Error>
where
    D: Deserializer<'de>,
    T: Deserialize<'de>,
{
    #[derive(Deserialize)]
    struct Wrapper<T> {
        #[serde(rename = "$value")]
        inner: T,
    }

    Option::<Wrapper<T>>::deserialize(deserializer).map(|opt| opt.map(|w| w.inner))
}

/// Deserialize `Vec<Enum>` from XML content using $value wrapper pattern.
pub fn deserialize_vec_enum_content<'de, D, T>(deserializer: D) -> Result<Vec<T>, D::Error>
where
    D: Deserializer<'de>,
    T: Deserialize<'de>,
{
    #[derive(Deserialize)]
    struct Wrapper<T> {
        #[serde(rename = "$value")]
        inner: T,
    }

    Vec::<Wrapper<T>>::deserialize(deserializer)
        .map(|vec| vec.into_iter().map(|w| w.inner).collect())
}

/// Check if AncillaryDataSet should be omitted from serialization.
pub fn is_empty_ancillary_data_set(opt: &Option<crate::AncillaryDataSetType>) -> bool {
    match opt {
        None => true,
        Some(val) => val.ancillary_data.is_empty(),
    }
}

/// Check if CalibratorType should be omitted from serialization.
pub fn is_empty_calibrator(opt: &Option<crate::CalibratorType>) -> bool {
    match opt {
        None => true,
        Some(val) => val.content.is_empty(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use quick_xml::de::from_str;
    use serde::Serialize;

    #[derive(Debug, PartialEq, Deserialize, Serialize)]
    enum Choice {
        #[serde(rename = "OptionA")]
        OptionA(String),
        #[serde(rename = "OptionB")]
        OptionB(i32),
    }

    #[derive(Debug, PartialEq, Deserialize)]
    struct WithCustomDeserialize {
        #[serde(deserialize_with = "deserialize_enum_content")]
        field: Choice,
    }

    #[derive(Debug, PartialEq, Deserialize)]
    struct WithOptionalCustomDeserialize {
        #[serde(default)]
        #[serde(deserialize_with = "deserialize_optional_enum_content")]
        field: Option<Choice>,
    }

    #[test]
    fn test_deserialize_enum_content() {
        let xml = r#"<WithCustomDeserialize><field><OptionA>test</OptionA></field></WithCustomDeserialize>"#;
        let result: WithCustomDeserialize = from_str(xml).unwrap();
        assert_eq!(result.field, Choice::OptionA("test".to_string()));
    }

    #[test]
    fn test_deserialize_optional_enum_content_some() {
        let xml = r#"<WithOptionalCustomDeserialize><field><OptionB>42</OptionB></field></WithOptionalCustomDeserialize>"#;
        let result: WithOptionalCustomDeserialize = from_str(xml).unwrap();
        assert_eq!(result.field, Some(Choice::OptionB(42)));
    }

    #[test]
    fn test_deserialize_optional_enum_content_none() {
        let xml = r#"<WithOptionalCustomDeserialize></WithOptionalCustomDeserialize>"#;
        let result: WithOptionalCustomDeserialize = from_str(xml).unwrap();
        assert_eq!(result.field, None);
    }
}
