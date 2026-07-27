use serde::Deserialize;
use std::fmt;
use std::str::FromStr;

use anyhow::anyhow;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize)]
pub enum S3StorageType {
    Standard,
}

impl S3StorageType {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Standard => "standard",
        }
    }
}

impl FromStr for S3StorageType {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_ascii_lowercase().as_str() {
            "standard" => Ok(Self::Standard),
            _ => Err(anyhow!("unsupported storage type: {s}")),
        }
    }
}

impl fmt::Display for S3StorageType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize)]
pub enum S3UsageType {
    _50TBM,
    _500TBM,
    _1000TBM,
}

impl S3UsageType {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::_50TBM => "50TBM",
            Self::_500TBM => "500TBM",
            Self::_1000TBM => "1000TBM",
        }
    }
}

impl FromStr for S3UsageType {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_ascii_lowercase().as_str() {
            "50tbm" | "50tb" | "_50tbm" | "50-tbm" => Ok(Self::_50TBM),
            "500tbm" | "500tb" | "_500tbm" | "500-tbm" => Ok(Self::_500TBM),
            "1000tbm" | "1000tb" | "_1000tbm" | "1000-tbm" => Ok(Self::_1000TBM),
            _ => Err(anyhow!("unsupported usage type: {s}")),
        }
    }
}

impl fmt::Display for S3UsageType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

#[cfg(test)]
mod tests {
    use super::{S3StorageType, S3UsageType};
    use std::str::FromStr;

    #[test]
    fn parses_storage_type() {
        assert_eq!(S3StorageType::from_str("standard").unwrap(), S3StorageType::Standard);
        assert_eq!(S3StorageType::Standard.to_string(), "standard");
    }

    #[test]
    fn parses_usage_type() {
        assert_eq!(S3UsageType::from_str("50tbm").unwrap(), S3UsageType::_50TBM);
        assert_eq!(S3UsageType::from_str("50TBM").unwrap(), S3UsageType::_50TBM);
        assert_eq!(S3UsageType::from_str("500tb").unwrap(), S3UsageType::_500TBM);
        assert_eq!(S3UsageType::from_str("1000tbm").unwrap(), S3UsageType::_1000TBM);
        assert_eq!(S3UsageType::from_str("1000TBM").unwrap(), S3UsageType::_1000TBM);
        assert_eq!(S3UsageType::from_str("1000-tbm").unwrap(), S3UsageType::_1000TBM);
        assert_eq!(S3UsageType::_1000TBM.to_string(), "1000TBM");
    }
}