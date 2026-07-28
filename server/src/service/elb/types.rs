use serde::Deserialize;

use crate::service::{Region, types::{AwsLocalZone, AwsWavelengthZone}};

#[derive(Debug, Deserialize)]
pub enum ElbType {
    ALB(ALBLocationType),
    NLB,
    GWLB,
    CLB,
}

#[derive(Debug, Deserialize)]
pub enum ALBLocationType{
    AwsRegion(Region),
    AwsWavelengthZone(AwsWavelengthZone),
    AwsLocalZone(AwsLocalZone)
}

