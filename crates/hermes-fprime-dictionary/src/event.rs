use crate::error::DictionaryError;
use crate::fprime::Severity;
use hermes_pb::*;

/// Convert FPrime severity to protobuf EvrSeverity
pub fn parse_severity(severity: &Severity) -> Result<EvrSeverity, DictionaryError> {
    match severity {
        Severity::ActivityHi => Ok(EvrSeverity::EvrActivityHigh),
        Severity::ActivityLo => Ok(EvrSeverity::EvrActivityLow),
        Severity::Command => Ok(EvrSeverity::EvrCommand),
        Severity::Diagnostic => Ok(EvrSeverity::EvrDiagnostic),
        Severity::Fatal => Ok(EvrSeverity::EvrFatal),
        Severity::WarningHi => Ok(EvrSeverity::EvrWarningHigh),
        Severity::WarningLo => Ok(EvrSeverity::EvrWarningLow),
    }
}

/// Parse FPP format string into structured FormatString with fragments
pub fn parse_fpp_format_string(s: &str, num_args: usize) -> Result<FormatString, DictionaryError> {
    let mut fragments = Vec::new();
    let mut chars = s.chars().enumerate().peekable();
    let mut current_text = String::new();
    let mut arg_index = 0;

    while let Some((pos, ch)) = chars.next() {
        if ch == '{' {
            // Save accumulated text
            if !current_text.is_empty() {
                fragments.push(FormatFragment {
                    fragment: Some(format_fragment::Fragment::Text(std::mem::take(
                        &mut current_text,
                    ))),
                });
            }

            // Parse format specifier
            let spec = parse_format_specifier(&mut chars, arg_index, pos)?;
            fragments.push(FormatFragment {
                fragment: Some(format_fragment::Fragment::Specifier(spec)),
            });
            arg_index += 1;
        } else {
            current_text.push(ch);
        }
    }

    // Save final text
    if !current_text.is_empty() {
        fragments.push(FormatFragment {
            fragment: Some(format_fragment::Fragment::Text(current_text)),
        });
    }

    // Validate argument count
    if arg_index != num_args {
        return Err(DictionaryError::ArgumentCountMismatch {
            expected: num_args,
            found: arg_index,
        });
    }

    Ok(FormatString {
        fragments,
        original: s.to_string(),
    })
}

fn parse_format_specifier(
    chars: &mut std::iter::Peekable<std::iter::Enumerate<std::str::Chars>>,
    arg_index: usize,
    start_pos: usize,
) -> Result<FormatSpecifier, DictionaryError> {
    let mut inner = String::new();
    let mut found_close = false;

    while let Some((_, ch)) = chars.next() {
        if ch == '}' {
            found_close = true;
            break;
        }
        inner.push(ch);
    }

    // Check if we found closing brace
    if !found_close {
        return Err(DictionaryError::UnclosedFormatSpecifier(start_pos));
    }

    // Parse the inner content: optional precision + format char
    let (precision, spec_type) = parse_specifier_content(&inner)?;

    Ok(FormatSpecifier {
        r#type: spec_type as i32,
        precision,
        argument_index: arg_index as u32,
    })
}

fn parse_specifier_content(s: &str) -> Result<(Option<u32>, FormatSpecifierType), DictionaryError> {
    if s.is_empty() {
        return Ok((None, FormatSpecifierType::FmtDefault));
    }

    let bytes = s.as_bytes();
    let mut i = 0;

    // Skip optional width digits
    while i < bytes.len() && bytes[i].is_ascii_digit() {
        i += 1;
    }

    let mut precision = None;

    // Check for precision
    if i < bytes.len() && bytes[i] == b'.' {
        i += 1;
        let prec_start = i;
        while i < bytes.len() && bytes[i].is_ascii_digit() {
            i += 1;
        }
        if i > prec_start {
            precision = Some(
                s[prec_start..i]
                    .parse::<u32>()
                    .map_err(|_| DictionaryError::InvalidFormatSpecifier(s.to_string()))?,
            );
        }
    }

    // Must end with exactly one format character
    if i != bytes.len() - 1 {
        return Err(DictionaryError::InvalidFormatSpecifier(s.to_string()));
    }

    let spec_type = match bytes[i] {
        b'c' => FormatSpecifierType::FmtChar,
        b'd' => FormatSpecifierType::FmtDecimal,
        b'x' => FormatSpecifierType::FmtHexLower,
        b'X' => FormatSpecifierType::FmtHexUpper,
        b'o' => FormatSpecifierType::FmtOctal,
        b'e' => FormatSpecifierType::FmtExpLower,
        b'E' => FormatSpecifierType::FmtExpUpper,
        b'f' => FormatSpecifierType::FmtFixedLower,
        b'F' => FormatSpecifierType::FmtFixedUpper,
        b'g' => FormatSpecifierType::FmtGeneralLower,
        b'G' => FormatSpecifierType::FmtGeneralUpper,
        _ => return Err(DictionaryError::InvalidFormatSpecifier(s.to_string())),
    };

    Ok((precision, spec_type))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_severity() {
        assert_eq!(
            parse_severity(&Severity::Fatal).unwrap(),
            EvrSeverity::EvrFatal
        );
        assert_eq!(
            parse_severity(&Severity::WarningHi).unwrap(),
            EvrSeverity::EvrWarningHigh
        );
        assert_eq!(
            parse_severity(&Severity::ActivityLo).unwrap(),
            EvrSeverity::EvrActivityLow
        );
    }

    #[test]
    fn test_parse_fpp_format_string() {
        // Test simple format specifier
        let result = parse_fpp_format_string("Test {d} value", 1).unwrap();
        assert_eq!(result.fragments.len(), 3); // text, spec, text
        assert_eq!(result.original, "Test {d} value");

        // Test precision
        let result = parse_fpp_format_string("Float {.2f}", 1).unwrap();
        assert_eq!(result.fragments.len(), 2); // text, spec
        if let Some(format_fragment::Fragment::Specifier(spec)) = &result.fragments[1].fragment {
            assert_eq!(spec.r#type, FormatSpecifierType::FmtFixedLower as i32);
            assert_eq!(spec.precision, Some(2));
            assert_eq!(spec.argument_index, 0);
        } else {
            panic!("Expected specifier fragment");
        }

        // Test multiple specifiers
        let result = parse_fpp_format_string("Multiple {} {}", 2).unwrap();
        assert_eq!(result.fragments.len(), 4); // text, spec, text, spec

        // Test mixed specifiers
        let result = parse_fpp_format_string("Mixed {d} and {}", 2).unwrap();
        assert_eq!(result.fragments.len(), 4); // text, spec, text, spec

        // Test argument count mismatch
        assert!(parse_fpp_format_string("Test {d} value", 2).is_err());
        assert!(parse_fpp_format_string("Test {d} value", 0).is_err());
    }
}
