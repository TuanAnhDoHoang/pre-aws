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
    #[serde(rename = "aws-region")]
    AwsRegion(Region),
    #[serde(rename = "aws-wavelength-zone")]
    AwsWavelengthZone(AwsWavelengthZone),
    #[serde(rename = "aws-local-zone")]
    AwsLocalZone(AwsLocalZone)
}

#[derive(Debug, Deserialize)]
pub enum ElbTypeRequest {
    ALB(ALBLocationTypeRequest),
    NLB,
    GWLB,
    CLB,
}

#[derive(Debug, Deserialize)]
pub enum ALBLocationTypeRequest{
    #[serde(rename = "aws-region")]
    AwsRegion(String),
    #[serde(rename = "aws-wavelength-zone")]
    AwsWavelengthZone(String),
    #[serde(rename = "aws-local-zone")]
    AwsLocalZone(String)
}
