use std::str::FromStr;

use serde::Deserialize;

use crate::service::elb::types::{ElbType, ElbTypeRequest};

pub mod types;

#[derive(Debug, Deserialize)]
pub struct ElbOption {
    pub elb_type: ElbType,
}

#[derive(Debug, Deserialize)]
pub struct ElbOptionRequest {
    pub elb_type: ElbTypeRequest,
}
