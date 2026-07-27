use std::fmt;
use std::str::FromStr;

use anyhow::anyhow;
use serde::Deserialize;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize)]
pub enum RdsDeploymentType {
    SingleAz,
    MultiAz,
}

impl RdsDeploymentType {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::SingleAz => "single",
            Self::MultiAz => "multi-az",
        }
    }
}

impl FromStr for RdsDeploymentType {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_ascii_lowercase().as_str() {
            "single" | "single-az" | "singleaz" => Ok(Self::SingleAz),
            "multi" | "multi-az" | "multiaz" => Ok(Self::MultiAz),
            _ => Err(anyhow!("unsupported RDS deployment type: {s}")),
        }
    }
}

impl fmt::Display for RdsDeploymentType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize)]
pub enum RdsInstanceType {
    DbT3Micro,
    DbT3Small,
    DbT3Medium,
    DbT3Large,
    DbT3XLarge,
    DbT3_2XLarge,

    DbT4gMicro,
    DbT4gSmall,
    DbT4gMedium,
    DbT4gLarge,
    DbT4gXLarge,
    DbT4g_2XLarge,

    DbM5Large,
    DbM5XLarge,
    DbM5_2XLarge,
    DbM5_4XLarge,
    DbM5_8XLarge,
    DbM5_12XLarge,
    DbM5_16XLarge,
    DbM5_24XLarge,

    DbM5dLarge,
    DbM5dXLarge,
    DbM5d_2XLarge,
    DbM5d_4XLarge,
    DbM5d_8XLarge,
    DbM5d_12XLarge,
    DbM5d_16XLarge,
    DbM5d_24XLarge,

    DbM6gLarge,
    DbM6gXLarge,
    DbM6g_2XLarge,
    DbM6g_4XLarge,
    DbM6g_8XLarge,
    DbM6g_12XLarge,
    DbM6g_16XLarge,

    DbM6gdLarge,
    DbM6gdXLarge,
    DbM6gd_2XLarge,
    DbM6gd_4XLarge,
    DbM6gd_8XLarge,
    DbM6gd_12XLarge,
    DbM6gd_16XLarge,

    DbM6iLarge,
    DbM6iXLarge,
    DbM6i_2XLarge,
    DbM6i_4XLarge,
    DbM6i_8XLarge,
    DbM6i_12XLarge,
    DbM6i_16XLarge,
    DbM6i_24XLarge,
    DbM6i_32XLarge,

    DbM7gLarge,
    DbM7gXLarge,
    DbM7g_2XLarge,
    DbM7g_4XLarge,
    DbM7g_8XLarge,
    DbM7g_12XLarge,
    DbM7g_16XLarge,

    DbM7iLarge,
    DbM7iXLarge,
    DbM7i_2XLarge,
    DbM7i_4XLarge,
    DbM7i_8XLarge,
    DbM7i_12XLarge,
    DbM7i_16XLarge,
    DbM7i_24XLarge,
    DbM7i_48XLarge,

    DbM8gLarge,
    DbM8gXLarge,
    DbM8g_2XLarge,
    DbM8g_4XLarge,
    DbM8g_8XLarge,
    DbM8g_12XLarge,
    DbM8g_16XLarge,
    DbM8g_24XLarge,
    DbM8g_48XLarge,
}

impl RdsInstanceType {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::DbT3Micro => "db.t3.micro",
            Self::DbT3Small => "db.t3.small",
            Self::DbT3Medium => "db.t3.medium",
            Self::DbT3Large => "db.t3.large",
            Self::DbT3XLarge => "db.t3.xlarge",
            Self::DbT3_2XLarge => "db.t3.2xlarge",

            Self::DbT4gMicro => "db.t4g.micro",
            Self::DbT4gSmall => "db.t4g.small",
            Self::DbT4gMedium => "db.t4g.medium",
            Self::DbT4gLarge => "db.t4g.large",
            Self::DbT4gXLarge => "db.t4g.xlarge",
            Self::DbT4g_2XLarge => "db.t4g.2xlarge",

            Self::DbM5Large => "db.m5.large",
            Self::DbM5XLarge => "db.m5.xlarge",
            Self::DbM5_2XLarge => "db.m5.2xlarge",
            Self::DbM5_4XLarge => "db.m5.4xlarge",
            Self::DbM5_8XLarge => "db.m5.8xlarge",
            Self::DbM5_12XLarge => "db.m5.12xlarge",
            Self::DbM5_16XLarge => "db.m5.16xlarge",
            Self::DbM5_24XLarge => "db.m5.24xlarge",

            Self::DbM5dLarge => "db.m5d.large",
            Self::DbM5dXLarge => "db.m5d.xlarge",
            Self::DbM5d_2XLarge => "db.m5d.2xlarge",
            Self::DbM5d_4XLarge => "db.m5d.4xlarge",
            Self::DbM5d_8XLarge => "db.m5d.8xlarge",
            Self::DbM5d_12XLarge => "db.m5d.12xlarge",
            Self::DbM5d_16XLarge => "db.m5d.16xlarge",
            Self::DbM5d_24XLarge => "db.m5d.24xlarge",

            Self::DbM6gLarge => "db.m6g.large",
            Self::DbM6gXLarge => "db.m6g.xlarge",
            Self::DbM6g_2XLarge => "db.m6g.2xlarge",
            Self::DbM6g_4XLarge => "db.m6g.4xlarge",
            Self::DbM6g_8XLarge => "db.m6g.8xlarge",
            Self::DbM6g_12XLarge => "db.m6g.12xlarge",
            Self::DbM6g_16XLarge => "db.m6g.16xlarge",

            Self::DbM6gdLarge => "db.m6gd.large",
            Self::DbM6gdXLarge => "db.m6gd.xlarge",
            Self::DbM6gd_2XLarge => "db.m6gd.2xlarge",
            Self::DbM6gd_4XLarge => "db.m6gd.4xlarge",
            Self::DbM6gd_8XLarge => "db.m6gd.8xlarge",
            Self::DbM6gd_12XLarge => "db.m6gd.12xlarge",
            Self::DbM6gd_16XLarge => "db.m6gd.16xlarge",

            Self::DbM6iLarge => "db.m6i.large",
            Self::DbM6iXLarge => "db.m6i.xlarge",
            Self::DbM6i_2XLarge => "db.m6i.2xlarge",
            Self::DbM6i_4XLarge => "db.m6i.4xlarge",
            Self::DbM6i_8XLarge => "db.m6i.8xlarge",
            Self::DbM6i_12XLarge => "db.m6i.12xlarge",
            Self::DbM6i_16XLarge => "db.m6i.16xlarge",
            Self::DbM6i_24XLarge => "db.m6i.24xlarge",
            Self::DbM6i_32XLarge => "db.m6i.32xlarge",

            Self::DbM7gLarge => "db.m7g.large",
            Self::DbM7gXLarge => "db.m7g.xlarge",
            Self::DbM7g_2XLarge => "db.m7g.2xlarge",
            Self::DbM7g_4XLarge => "db.m7g.4xlarge",
            Self::DbM7g_8XLarge => "db.m7g.8xlarge",
            Self::DbM7g_12XLarge => "db.m7g.12xlarge",
            Self::DbM7g_16XLarge => "db.m7g.16xlarge",

            Self::DbM7iLarge => "db.m7i.large",
            Self::DbM7iXLarge => "db.m7i.xlarge",
            Self::DbM7i_2XLarge => "db.m7i.2xlarge",
            Self::DbM7i_4XLarge => "db.m7i.4xlarge",
            Self::DbM7i_8XLarge => "db.m7i.8xlarge",
            Self::DbM7i_12XLarge => "db.m7i.12xlarge",
            Self::DbM7i_16XLarge => "db.m7i.16xlarge",
            Self::DbM7i_24XLarge => "db.m7i.24xlarge",
            Self::DbM7i_48XLarge => "db.m7i.48xlarge",

            Self::DbM8gLarge => "db.m8g.large",
            Self::DbM8gXLarge => "db.m8g.xlarge",
            Self::DbM8g_2XLarge => "db.m8g.2xlarge",
            Self::DbM8g_4XLarge => "db.m8g.4xlarge",
            Self::DbM8g_8XLarge => "db.m8g.8xlarge",
            Self::DbM8g_12XLarge => "db.m8g.12xlarge",
            Self::DbM8g_16XLarge => "db.m8g.16xlarge",
            Self::DbM8g_24XLarge => "db.m8g.24xlarge",
            Self::DbM8g_48XLarge => "db.m8g.48xlarge",
        }
    }
}

impl FromStr for RdsInstanceType {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let normalized = s.trim().to_ascii_lowercase();
        let normalized = normalized.strip_prefix("db.").unwrap_or(&normalized);

        match normalized {
            "t3.micro" => Ok(Self::DbT3Micro),
            "t3.small" => Ok(Self::DbT3Small),
            "t3.medium" => Ok(Self::DbT3Medium),
            "t3.large" => Ok(Self::DbT3Large),
            "t3.xlarge" => Ok(Self::DbT3XLarge),
            "t3.2xlarge" => Ok(Self::DbT3_2XLarge),

            "t4g.micro" => Ok(Self::DbT4gMicro),
            "t4g.small" => Ok(Self::DbT4gSmall),
            "t4g.medium" => Ok(Self::DbT4gMedium),
            "t4g.large" => Ok(Self::DbT4gLarge),
            "t4g.xlarge" => Ok(Self::DbT4gXLarge),
            "t4g.2xlarge" => Ok(Self::DbT4g_2XLarge),

            "m5.large" => Ok(Self::DbM5Large),
            "m5.xlarge" => Ok(Self::DbM5XLarge),
            "m5.2xlarge" => Ok(Self::DbM5_2XLarge),
            "m5.4xlarge" => Ok(Self::DbM5_4XLarge),
            "m5.8xlarge" => Ok(Self::DbM5_8XLarge),
            "m5.12xlarge" => Ok(Self::DbM5_12XLarge),
            "m5.16xlarge" => Ok(Self::DbM5_16XLarge),
            "m5.24xlarge" => Ok(Self::DbM5_24XLarge),

            "m5d.large" => Ok(Self::DbM5dLarge),
            "m5d.xlarge" => Ok(Self::DbM5dXLarge),
            "m5d.2xlarge" => Ok(Self::DbM5d_2XLarge),
            "m5d.4xlarge" => Ok(Self::DbM5d_4XLarge),
            "m5d.8xlarge" => Ok(Self::DbM5d_8XLarge),
            "m5d.12xlarge" => Ok(Self::DbM5d_12XLarge),
            "m5d.16xlarge" => Ok(Self::DbM5d_16XLarge),
            "m5d.24xlarge" => Ok(Self::DbM5d_24XLarge),

            "m6g.large" => Ok(Self::DbM6gLarge),
            "m6g.xlarge" => Ok(Self::DbM6gXLarge),
            "m6g.2xlarge" => Ok(Self::DbM6g_2XLarge),
            "m6g.4xlarge" => Ok(Self::DbM6g_4XLarge),
            "m6g.8xlarge" => Ok(Self::DbM6g_8XLarge),
            "m6g.12xlarge" => Ok(Self::DbM6g_12XLarge),
            "m6g.16xlarge" => Ok(Self::DbM6g_16XLarge),

            "m6gd.large" => Ok(Self::DbM6gdLarge),
            "m6gd.xlarge" => Ok(Self::DbM6gdXLarge),
            "m6gd.2xlarge" => Ok(Self::DbM6gd_2XLarge),
            "m6gd.4xlarge" => Ok(Self::DbM6gd_4XLarge),
            "m6gd.8xlarge" => Ok(Self::DbM6gd_8XLarge),
            "m6gd.12xlarge" => Ok(Self::DbM6gd_12XLarge),
            "m6gd.16xlarge" => Ok(Self::DbM6gd_16XLarge),

            "m6i.large" => Ok(Self::DbM6iLarge),
            "m6i.xlarge" => Ok(Self::DbM6iXLarge),
            "m6i.2xlarge" => Ok(Self::DbM6i_2XLarge),
            "m6i.4xlarge" => Ok(Self::DbM6i_4XLarge),
            "m6i.8xlarge" => Ok(Self::DbM6i_8XLarge),
            "m6i.12xlarge" => Ok(Self::DbM6i_12XLarge),
            "m6i.16xlarge" => Ok(Self::DbM6i_16XLarge),
            "m6i.24xlarge" => Ok(Self::DbM6i_24XLarge),
            "m6i.32xlarge" => Ok(Self::DbM6i_32XLarge),

            "m7g.large" => Ok(Self::DbM7gLarge),
            "m7g.xlarge" => Ok(Self::DbM7gXLarge),
            "m7g.2xlarge" => Ok(Self::DbM7g_2XLarge),
            "m7g.4xlarge" => Ok(Self::DbM7g_4XLarge),
            "m7g.8xlarge" => Ok(Self::DbM7g_8XLarge),
            "m7g.12xlarge" => Ok(Self::DbM7g_12XLarge),
            "m7g.16xlarge" => Ok(Self::DbM7g_16XLarge),

            "m7i.large" => Ok(Self::DbM7iLarge),
            "m7i.xlarge" => Ok(Self::DbM7iXLarge),
            "m7i.2xlarge" => Ok(Self::DbM7i_2XLarge),
            "m7i.4xlarge" => Ok(Self::DbM7i_4XLarge),
            "m7i.8xlarge" => Ok(Self::DbM7i_8XLarge),
            "m7i.12xlarge" => Ok(Self::DbM7i_12XLarge),
            "m7i.16xlarge" => Ok(Self::DbM7i_16XLarge),
            "m7i.24xlarge" => Ok(Self::DbM7i_24XLarge),
            "m7i.48xlarge" => Ok(Self::DbM7i_48XLarge),

            "m8g.large" => Ok(Self::DbM8gLarge),
            "m8g.xlarge" => Ok(Self::DbM8gXLarge),
            "m8g.2xlarge" => Ok(Self::DbM8g_2XLarge),
            "m8g.4xlarge" => Ok(Self::DbM8g_4XLarge),
            "m8g.8xlarge" => Ok(Self::DbM8g_8XLarge),
            "m8g.12xlarge" => Ok(Self::DbM8g_12XLarge),
            "m8g.16xlarge" => Ok(Self::DbM8g_16XLarge),
            "m8g.24xlarge" => Ok(Self::DbM8g_24XLarge),
            "m8g.48xlarge" => Ok(Self::DbM8g_48XLarge),

            _ => Err(anyhow!("unsupported RDS instance type: {s}")),
        }
    }
}

impl fmt::Display for RdsInstanceType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize)]
pub enum RdsEngine {
    MySql,
    Postgres,
}

impl RdsEngine {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::MySql => "mysql",
            Self::Postgres => "postgres",
        }
    }
}

impl FromStr for RdsEngine {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_ascii_lowercase().as_str() {
            "mysql" => Ok(Self::MySql),
            "postgres" | "postgresql" => Ok(Self::Postgres),
            _ => Err(anyhow!("unsupported RDS engine: {s}")),
        }
    }
}

impl fmt::Display for RdsEngine {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

#[cfg(test)]
mod tests {
    use super::{RdsDeploymentType, RdsEngine, RdsInstanceType};
    use std::str::FromStr;

    #[test]
    fn parses_supported_deployment_values() {
        assert_eq!(
            RdsDeploymentType::from_str("single").unwrap(),
            RdsDeploymentType::SingleAz
        );
        assert_eq!(
            RdsDeploymentType::from_str("multi-az").unwrap(),
            RdsDeploymentType::MultiAz
        );
        assert_eq!(RdsDeploymentType::SingleAz.to_string(), "single");
    }

    #[test]
    fn parses_supported_instance_values() {
        assert_eq!(
            RdsInstanceType::from_str("db.t3.micro").unwrap(),
            RdsInstanceType::DbT3Micro
        );
        assert_eq!(
            RdsInstanceType::from_str("db.m5.2xlarge").unwrap(),
            RdsInstanceType::DbM5_2XLarge
        );
        assert_eq!(
            RdsInstanceType::from_str("db.m7i.48xlarge").unwrap(),
            RdsInstanceType::DbM7i_48XLarge
        );
        assert_eq!(RdsInstanceType::DbM8g_48XLarge.to_string(), "db.m8g.48xlarge");
    }

    #[test]
    fn parses_supported_engine_values() {
        assert_eq!(RdsEngine::from_str("mysql").unwrap(), RdsEngine::MySql);
        assert_eq!(RdsEngine::from_str("postgres").unwrap(), RdsEngine::Postgres);
        assert_eq!(RdsEngine::from_str("PostgreSQL").unwrap(), RdsEngine::Postgres);
        assert_eq!(RdsEngine::Postgres.to_string(), "postgres");
    }
}