use std::str::FromStr;

use anyhow::anyhow;
use serde::Deserialize;

pub mod types;
pub mod ec2;
pub mod rds;
pub mod s3;
pub mod elb;

#[derive(Debug, Deserialize)]
pub enum Region {
    UsEast1, //Virginia
    UsWest1, //California
    ApSoutheast1, //Singapore
    ApNorteast1, //Tokyo
    ApSoutheast2, //Sydney
}

impl Region {
    /// Trả về chuỗi định danh (Region Code) chuẩn của AWS
    pub fn to_str(&self) -> &'static str {
        match self {
            Region::UsEast1 => "us-east-1",
            Region::UsWest1 => "us-west-1",
            Region::ApSoutheast1 => "ap-southeast-1",
            Region::ApNorteast1 => "ap-northeast-1",
            Region::ApSoutheast2 => "ap-southeast-2",
        }
    }
}

impl FromStr for Region{
    type Err = anyhow::Error;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s{
            "us-east-1" => Ok(Region::UsEast1),
            "us-west-1" => Ok(Region::UsWest1),
            "ap-southeast-1" => Ok(Region::ApSoutheast1),
            "ap-northeast-1" => Ok(Region::ApNorteast1),
            "ap-southeast-2" => Ok(Region::ApSoutheast2),
            _ => Err(anyhow!("Invalid region"))
        }
    }
}