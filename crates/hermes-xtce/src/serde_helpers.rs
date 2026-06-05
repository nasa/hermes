//! Serde helpers for XML deserialization with quick-xml.

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
pub fn deserialize_optional_enum_content<'de, D, T>(deserializer: D) -> Result<Option<T>, D::Error>
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

/// Deserialize a Vec from an XML container element with $value children.
/// This flattens the structure by removing the intermediate wrapper struct.
///
/// For example, XML like:
/// ```xml
/// <ParameterTypeSet>
///   <IntegerParameterType>...</IntegerParameterType>
///   <StringParameterType>...</StringParameterType>
/// </ParameterTypeSet>
/// ```
///
/// Can be deserialized directly into `Vec<ParameterTypeSetTypeContent>`
/// instead of `Option<ParameterSetType>` where ParameterSetType wraps the Vec.
///
/// This deserializer handles the case where the field's `rename` attribute
/// matches the container element name, so by the time this is called,
/// we're already inside the container and just need to deserialize the Vec of children.
pub fn deserialize_container_vec<'de, D, T>(deserializer: D) -> Result<Vec<T>, D::Error>
where
    D: Deserializer<'de>,
    T: Deserialize<'de>,
{
    // When the field has #[serde(rename = "ContainerName")], serde has already
    // matched and entered the container element. We use $value to capture all child elements.
    #[derive(Deserialize)]
    struct Wrapper<T> {
        #[serde(rename = "$value")]
        items: Vec<T>,
    }

    // For empty containers, the Wrapper deserialization might fail with "missing field $value"
    // In that case, we return an empty Vec
    Wrapper::<T>::deserialize(deserializer)
        .map(|w| w.items)
        .or_else(|e| {
            // Check if the error is about missing $value field
            let err_msg = e.to_string();
            if err_msg.contains("missing field") && err_msg.contains("$value") {
                Ok(Vec::new())
            } else {
                Err(e)
            }
        })
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
