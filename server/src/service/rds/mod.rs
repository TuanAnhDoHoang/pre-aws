use serde::Deserialize;

use crate::service::{ec2::types::Ec2InstanceType, rds::types::{RdsDeploymentType, RdsEngine, RdsInstanceType}};

pub mod types;

#[derive(Debug, Deserialize)]
pub struct RdsOption {
    pub engine: RdsEngine,
    pub instance_type: RdsInstanceType,
    pub deployment_type: RdsDeploymentType
}

#[derive(Debug, Deserialize)]
pub struct RdsOptionRequest {
    pub engine: String,
    pub instance_type: String,
    pub deployment_type: String
}