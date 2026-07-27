use serde::Deserialize;

use crate::service::ec2::types::Ec2InstanceType;

pub mod types;

#[derive(Debug, Deserialize)]
pub struct Ec2Option {
    pub instance_type: Ec2InstanceType,
}

#[derive(Debug, Deserialize)]
pub struct Ec2OptionRequest {
    pub instance_type: String,
}