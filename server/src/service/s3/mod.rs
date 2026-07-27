use serde::Deserialize;

use crate::service::s3::types::{S3StorageType, S3UsageType};

pub mod types;


#[derive(Debug, Deserialize)]
pub struct S3Option {
    pub storage_type: S3StorageType,
    pub usage_type: S3UsageType,
}

#[derive(Debug, Deserialize)]
pub struct S3OptionRequest {
    pub storage_type: String,
    pub usage_type: String,
}