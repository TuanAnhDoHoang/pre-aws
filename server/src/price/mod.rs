use std::str::FromStr;

use anyhow::{Context, anyhow};
use serde::{Deserialize, Serialize};
use surrealdb::{Surreal, engine::remote::ws::Client, types::SurrealValue};

use crate::service::{
    Region,
    ec2::{Ec2Option, Ec2OptionRequest, types::Ec2InstanceType},
    elb::{
        ElbOption, ElbOptionRequest,
        types::{ALBLocationType, ALBLocationTypeRequest, ElbType, ElbTypeRequest},
    },
    rds::{
        RdsOption, RdsOptionRequest,
        types::{RdsDeploymentType, RdsEngine, RdsInstanceType},
    },
    s3::{
        S3Option, S3OptionRequest,
        types::{S3StorageType, S3UsageType},
    },
    types::{AwsLocalZone, AwsWavelengthZone},
};

#[derive(Debug, Deserialize)]
pub enum Service {
    EC2,
    RDS,
    S3,
    ELB,
}

//For logic
// #[derive(Debug, Deserialize)]
// pub enum ServiceOption {
//     Ec2(Ec2Option),
//     Rds(RdsOption),
// }

//For request
#[derive(Debug, Deserialize)]
pub enum ServiceOptionRequest {
    Ec2(Ec2OptionRequest),
    Rds(RdsOptionRequest),
    S3(S3OptionRequest),
    Elb(ElbOptionRequest),
}

#[derive(Default, Deserialize, Debug, Serialize)]
//units of measurement
pub enum UOM {
    Second,
    #[default]
    Hour,
    Month,
    GB,
}
impl FromStr for UOM {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "hour" | "hrs" | "hr" | "h" => Ok(UOM::Hour),
            "second" | "sec" | "s" => Ok(UOM::Second),
            "month" | "mo" | "m" => Ok(UOM::Month),
            "gb" | "gib" | "gigabyte" => Ok(UOM::GB),
            _ => Err(anyhow!("Error during parsing unit of price")),
        }
    }
}

// Featch price base on service, region and options of service -> price, unit name
pub async fn fetch(
    db: &Surreal<Client>,
    service: &Service,
    region: String,
    options: ServiceOptionRequest,
) -> anyhow::Result<(f64, UOM)> {
    let region = Region::from_str(&region)?;
    let (price, uom): (f64, UOM) = match (service, options) {
        (Service::EC2, ServiceOptionRequest::Ec2(ec2_options_req)) => {
            let ec2_instance_type = Ec2InstanceType::from_str(&ec2_options_req.instance_type)?;
            let ec2_option = Ec2Option {
                instance_type: ec2_instance_type,
            };
            get_ec2_price(db, &region, &ec2_option)
                .await
                .context("Error during get Ec2 pricing")
        }
        (Service::RDS, ServiceOptionRequest::Rds(rds_options_req)) => {
            let rds_engine = RdsEngine::from_str(&rds_options_req.engine)?;
            let rds_instance_type = RdsInstanceType::from_str(&rds_options_req.instance_type)?;
            let rds_deploy_type = RdsDeploymentType::from_str(&rds_options_req.deployment_type)?;
            let rds_options = RdsOption {
                engine: rds_engine,
                instance_type: rds_instance_type,
                deployment_type: rds_deploy_type,
            };
            get_rds_price(db, &region, &rds_options)
                .await
                .context("Error during get RDS pricing")
        }
        (Service::S3, ServiceOptionRequest::S3(s3_options_req)) => {
            let s3_storage_type = S3StorageType::from_str(&s3_options_req.storage_type)?;
            let s3_usage_type = S3UsageType::from_str(&s3_options_req.usage_type)?;
            let s3_options = S3Option {
                storage_type: s3_storage_type,
                usage_type: s3_usage_type,
            };
            get_s3_price(db, &region, &s3_options)
                .await
                .context("Error during get S3 pricing")
        }
        (Service::ELB, ServiceOptionRequest::Elb(elb_options_req)) => {
            let elb_type = match elb_options_req.elb_type {
                ElbTypeRequest::ALB(location_type) => {
                    let alb_location_type = match location_type {
                        ALBLocationTypeRequest::AwsRegion(region) => {
                            let region =
                                Region::from_str(&region).context("Error during read Region")?;
                            ALBLocationType::AwsRegion(region)
                        }
                        ALBLocationTypeRequest::AwsWavelengthZone(wave_length) => {
                            let wave_length = AwsWavelengthZone::from_str(&wave_length)
                                .context("Error during read wave length")?;
                            ALBLocationType::AwsWavelengthZone(wave_length)
                        }
                        ALBLocationTypeRequest::AwsLocalZone(local_zone) => {
                            let local_zone = AwsLocalZone::from_str(&local_zone)
                                .context("Error during read Local Zone")?;
                            ALBLocationType::AwsLocalZone(local_zone)
                        }
                    };
                    ElbType::ALB(alb_location_type)
                }
                ElbTypeRequest::NLB => ElbType::NLB,
                ElbTypeRequest::GWLB => ElbType::GWLB,
                ElbTypeRequest::CLB => ElbType::CLB,
            };
            let elb_options = ElbOption { elb_type };
            get_elb_price(db, &region, &elb_options)
                .await
                .context("Error during get Elb pricing")
        }
        _ => Ok((0.0, UOM::default())),
    }?;
    Ok((price, uom))
}

#[derive(Debug, SurrealValue)]
struct PriceResponse {
    price: f64,
    uom: String,
}

async fn get_ec2_price(
    db: &Surreal<Client>,
    region: &Region,
    options: &Ec2Option,
) -> anyhow::Result<(f64, UOM)> {
    println!("=============After=============");
    println!("region {:?}", &region.to_str());
    println!("ec2_option: {:?}", &options.instance_type.to_str());

    let mut response = db
        .query("select price, uom from ec2_pricing where region=$r and instance_type=$i")
        .bind(("r", region.to_str()))
        .bind(("i", options.instance_type.to_str()))
        .await?;

    let records: Vec<PriceResponse> = response.take(0)?;
    // Lấy bản ghi đầu tiên nếu tìm thấy, nếu không trả về lỗi
    let price_record = records.into_iter().next().ok_or_else(|| {
        anyhow::anyhow!(
            "Không tìm thấy giá cho region '{}' và instance_type '{}'",
            region.to_str(),
            options.instance_type.to_str()
        )
    })?;

    let uom = UOM::from_str(&price_record.uom)?;

    Ok((price_record.price, uom))
}

async fn get_rds_price(
    db: &Surreal<Client>,
    region: &Region,
    options: &RdsOption,
) -> anyhow::Result<(f64, UOM)> {
    println!("=============After=============");
    println!("region {:?}", &region.to_str());
    println!("rds_option: {:?}", &options.instance_type.to_string());

    let mut response = db
        .query("select price, uom from rds_pricing where region=$r and engine=$e and instance_type=$i and deployment_type=$d")
        .bind(("r", region.to_str()))
        .bind(("e", options.engine.as_str()))
        .bind(("i", options.instance_type.as_str()))
        .bind(("d", options.deployment_type.as_str()))
        .await?;

    let records: Vec<PriceResponse> = response.take(0)?;
    // Lấy bản ghi đầu tiên nếu tìm thấy, nếu không trả về lỗi
    let price_record = records.into_iter().next().ok_or_else(|| {
        anyhow::anyhow!(
            "Không tìm thấy giá cho region '{}' và instance_type '{}' và deployment_type '{}'",
            region.to_str(),
            options.instance_type.as_str(),
            options.deployment_type.as_str()
        )
    })?;

    let uom = UOM::from_str(&price_record.uom)?;

    Ok((price_record.price, uom))
}

async fn get_s3_price(
    db: &Surreal<Client>,
    region: &Region,
    options: &S3Option,
) -> anyhow::Result<(f64, UOM)> {
    println!("=============After=============");
    println!("region {:?}", &region.to_str());
    println!("s3_option: {:?}", &options.storage_type.to_string());
    println!("s3_option: {:?}", &options.usage_type.to_string());

    let mut response = db
        .query("select price, uom from s3_pricing where region=$r and storage_type=$s and usage_type=$u")
        .bind(("r", region.to_str()))
        .bind(("s", options.storage_type.as_str()))
        .bind(("u", options.usage_type.as_str()))
        .await.context("Error during query s3 price")?;

    let records: Vec<PriceResponse> = response.take(0).context("Error during take response")?;
    // Lấy bản ghi đầu tiên nếu tìm thấy, nếu không trả về lỗi
    let price_record = records.into_iter().next().ok_or_else(|| {
        anyhow::anyhow!(
            "Không tìm thấy giá cho region '{}' và storage_type '{}' và usage_type '{}'",
            region.to_str(),
            options.storage_type.as_str(),
            options.usage_type.as_str()
        )
    })?;

    let uom = UOM::from_str(&price_record.uom).context("Error during parse unit of price")?;

    Ok((price_record.price, uom))
}

async fn get_elb_price(
    db: &Surreal<Client>,
    region: &Region,
    options: &ElbOption,
) -> anyhow::Result<(f64, UOM)> {
    let (elb_type, location_type, location_code) = match &options.elb_type {
        ElbType::ALB(location_type) => {
            let (location_type, location_code) = match location_type {
                ALBLocationType::AwsRegion(region) => ("region", region.to_str()),
                ALBLocationType::AwsWavelengthZone(wave_length_zone) => {
                    ("wave-length", wave_length_zone.as_str())
                }
                ALBLocationType::AwsLocalZone(local_zone) => ("local-zone", local_zone.as_str()),
            };
            ("ALB", location_type, location_code)
        }
        ElbType::NLB => ("NLB", "region", region.to_str()),
        ElbType::GWLB => ("GWLB", "region", region.to_str()),
        ElbType::CLB => ("CLB", "region", region.to_str()),
    };
    let mut response = db
        .query(
            r"select hour_cost, lcu_cost, trust_store_cost, lcu_reserve_cost, uom from elb_pricing where 
            elb_type=$elb_type and 
            location_type=$location_type and 
            location_code=$location_code
        ",
        )
        .bind(("elb_type", elb_type))
        .bind(("location_type", location_type))
        .bind(("location_code", location_code))
        .await?;

    let records: Vec<ElbPriceResponse> = response.take(0).context("Error during take response")?;
    // Lấy bản ghi đầu tiên nếu tìm thấy, nếu không trả về lỗi
    let price_record = records.into_iter().next().ok_or_else(|| {
        anyhow::anyhow!(
            "Không tìm thấy giá cho elb_type '{}' và location_type '{}' và location_code '{}'",
            elb_type,
            location_type,
            location_code
        )
    })?;

    let price = price_record.hour_cost
        + price_record.lcu_cost.unwrap_or_default()
        + price_record.lcu_reserve_cost.unwrap_or_default()
        + price_record.trust_store_cost.unwrap_or_default();

    let uom = UOM::from_str(&price_record.uom).context("Error during parse unit of price")?;

    Ok((price, uom))
}

#[derive(Debug, SurrealValue)]
struct ElbPriceResponse {
    hour_cost: f64,
    lcu_cost: Option<f64>,
    trust_store_cost: Option<f64>,
    lcu_reserve_cost: Option<f64>,
    uom: String,
}
