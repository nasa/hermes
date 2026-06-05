use crate::{Error, RelativeTime, Result};
use std::time::Duration;

pub(crate) fn parse_i64(s: &str) -> Result<i64> {
    match s.parse() {
        Ok(f) => Ok(f),
        Err(e) => Err(Error::InvalidValue(format!("{}", e))),
    }
}

pub(crate) fn parse_u64(s: &str) -> Result<u64> {
    match s.parse() {
        Ok(f) => Ok(f),
        Err(e) => Err(Error::InvalidValue(format!("{}", e))),
    }
}

pub(crate) fn parse_float(s: &str) -> Result<f64> {
    match s.parse::<f64>() {
        Ok(f) => Ok(f),
        Err(e) => Err(Error::InvalidValue(format!("{}", e))),
    }
}

pub(crate) fn parse_boolean(s: &str) -> Result<bool> {
    match s {
        "true" => Ok(true),
        "false" => Ok(false),
        "1" => Ok(true),
        "0" => Ok(false),
        _ => Err(Error::InvalidValue(format!(
            "'{}' is not a valid boolean",
            s
        ))),
    }
}

fn hex_to_bin(b: u8) -> Result<u8> {
    match b {
        b'0'..=b'9' => Ok(b - b'0'),
        b'a'..=b'f' => Ok(b - b'a' + 10),
        b'A'..=b'F' => Ok(b - b'A' + 10),
        _ => Err(Error::InvalidValue(format!(
            "'{}' is not a valid hex number",
            b
        ))),
    }
}

pub(crate) fn parse_hex_binary(s: &str) -> Result<Vec<u8>> {
    if s.len() % 2 != 0 {
        return Err(Error::InvalidValue(
            "Hex binary string must be even length".to_string(),
        ));
    }

    let data = s.as_bytes();
    let mut out = vec![0u8; s.len() / 2];
    for (i, byte) in out.iter_mut().enumerate() {
        *byte = hex_to_bin(data[i * 2])? << 4 | hex_to_bin(data[i * 2 + 1])?;
    }

    Ok(out)
}

pub(crate) fn parse_relative_time(s: &str) -> Result<RelativeTime> {
    let mut chars = s.chars();

    macro_rules! expect {
        ($c: expr) => {
            match chars.next() {
                Some($c) => (),
                Some(c) => {
                    return Err(Error::InvalidValue(format!(
                        "Unexpected character '{}', expected '{}'",
                        c, $c
                    )))
                }
                None => return Err(Error::InvalidValue(format!("'{}' is not a valid time", s))),
            }
        };
    }

    #[derive(Default)]
    struct RelativeBuilder {
        positive: bool,
        years: u32,
        months: u32,
        days: u32,
        hours: u32,
        minutes: u32,
        seconds: f64,
    }

    let mut builder: RelativeBuilder = Default::default();

    match chars.next() {
        Some('+') => {
            builder.positive = true;
            expect!('P');
        }
        Some('-') => {
            builder.positive = false;
            expect!('P');
        }
        Some('P') => {
            builder.positive = true;
        }
        _ => {
            return Err(Error::InvalidValue("Expected relative time".to_string()));
        }
    }

    let mut buf = vec![];

    /// Clear the buffer and parse to whatever this is returning into
    macro_rules! parse {
        ($name: expr) => {
            std::mem::replace(&mut buf, vec![])
                .iter()
                .collect::<String>()
                .parse()
                .map_err(|_| Error::InvalidValue(format!("Invalid {}", $name)))?
        };
    }

    let mut parse_time = false;

    // Parse date
    for char in chars {
        match char {
            'Y' if !parse_time => {
                builder.years = parse!("years");
            }
            'M' if !parse_time => {
                builder.months = parse!("months");
            }
            'D' if !parse_time => {
                builder.days = parse!("days");
            }
            'T' if !parse_time => {
                // Make sure we processed all the numbers
                if !buf.is_empty() {
                    return Err(Error::InvalidValue(format!(
                        "Unexpected character '{}'",
                        char
                    )));
                }

                parse_time = true;
            }
            'H' if parse_time => {
                builder.hours = parse!("hours");
            }
            'M' if parse_time => {
                builder.minutes = parse!("minutes");
            }
            'S' if parse_time => {
                builder.seconds = parse!("seconds");
            }
            '0'..'9' => {
                buf.push(char);
            }
            '.' if parse_time => {
                buf.push(char);
            }
            _ => {
                return Err(Error::InvalidValue(format!(
                    "Unexpected character '{}'",
                    char
                )));
            }
        }
    }

    if !buf.is_empty() {
        return Err(Error::InvalidValue(format!(
            "Expected duration specifier after number '{}'",
            buf.into_iter().collect::<String>()
        )));
    }

    // Compute time in microseconds
    let us = ((builder.years as u64) * 365 * 24 * 3600 * 1_000_000)
        + ((builder.months as u64) * 30 * 24 * 3600 * 1_000_000)
        + ((builder.days as u64) * 24 * 3600 * 1_000_000)
        + ((builder.hours as u64) * 3600 * 1_000_000)
        + ((builder.minutes as u64) * 60 * 1_000_000)
        + ((builder.seconds * 1_000_000.0) as u64);

    if builder.positive {
        Ok(RelativeTime::Forward(Duration::from_micros(us)))
    } else {
        Ok(RelativeTime::Backward(Duration::from_micros(us)))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    pub fn hex() {
        assert_eq!(parse_hex_binary("00").unwrap(), [0]);
        assert_eq!(parse_hex_binary("AB").unwrap(), [0xab]);
        assert_eq!(parse_hex_binary("ABab0F").unwrap(), [0xab, 0xab, 0x0f]);
    }

    #[test]
    pub fn relative_time() {
        assert_eq!(
            parse_relative_time("P10YT10S").unwrap(),
            RelativeTime::Forward(Duration::from_micros(
                10 * 365 * 24 * 3600 * 1_000_000 + 10 * 1_000_000
            ))
        );

        assert_eq!(
            parse_relative_time("PT1H3M1S").unwrap(),
            RelativeTime::Forward(Duration::from_micros(
                1 * 3600 * 1_000_000 + 3 * 60 * 1_000_000 + 1_000_000
            ))
        );

        assert_eq!(
            parse_relative_time("PT1.25S").unwrap(),
            RelativeTime::Forward(Duration::from_micros(1_000_000 + 250_000))
        );

        assert_eq!(
            parse_relative_time("-PT1.25S").unwrap(),
            RelativeTime::Backward(Duration::from_micros(1_000_000 + 250_000))
        );
    }
}
