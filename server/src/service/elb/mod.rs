use serde::Deserialize;

use crate::service::elb::types::{ElbType};

pub mod types;

#[derive(Debug, Deserialize)]
pub struct ElbOption {
    elb_type: ElbType,
}

#[derive(Debug, Deserialize)]
pub struct ElbOptionRequest {
    elb_type: ElbType,
}