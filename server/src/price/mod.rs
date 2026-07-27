use std::str::FromStr;

use anyhow::{Context, anyhow};
use serde::{Deserialize, Serialize};
use surrealdb::{Surreal, engine::remote::ws::Client, types::SurrealValue};

use crate::service::{
    Region, ec2::{Ec2Option, Ec2OptionRequest, types::Ec2InstanceType}, rds::{RdsOption, RdsOptionRequest, types::{RdsDeploymentType, RdsEngine, RdsInstanceType}}, s3::{S3Option, S3OptionRequest, types::{S3StorageType, S3UsageType}},
};

#[derive(Debug, Deserialize)]
pub enum Service {
    EC2,
    RDS,
    S3,
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
    S3(S3OptionRequest)
}

#[derive(Default, Deserialize, Debug, Serialize)]
//units of measurement
pub enum UOM {
    Second,
    #[default]
    Hour,
    Month,
}
impl FromStr for UOM {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "hour" | "hrs" | "hr" | "h" => Ok(UOM::Hour),
            "second" | "sec" | "s" => Ok(UOM::Second),
            "month" | "mo" | "m" => Ok(UOM::Month),
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
            let rds_options = RdsOption{
                engine: rds_engine,
                instance_type: rds_instance_type,
                deployment_type: rds_deploy_type
            };
            get_rds_price(db, &region, &rds_options).await.context("Error during get RDS pricing")
        }
        (Service::RDS, ServiceOptionRequest::S3(s3_options_req)) => {
            let s3_storage_type = S3StorageType::from_str(&s3_options_req.storage_type)?;
            let s3_usage_type = S3UsageType::from_str(&s3_options_req.usage_type)?;
            let s3_options = S3Option{
                storage_type: s3_storage_type,
                usage_type: s3_usage_type
            };
            get_s3_price(db, &region, &s3_options).await.context("Error during get S3 pricing")
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
    println!("ec2_option: {:?}", &options.instance_type.to_string());

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
) -> anyhow::Result<(f64, UOM)>{
    println!("=============After=============");
    println!("region {:?}", &region.to_str());
    println!("ec2_option: {:?}", &options.storage_type.to_string());
    println!("ec2_option: {:?}", &options.usage_type.to_string());

    let mut response = db
        .query("select price, uom from s3_pricing where region=$r and storage_type=$s and usage_type=$u")
        .bind(("r", region.to_str()))
        .bind(("s", options.storage_type.as_str()))
        .bind(("u", options.usage_type.as_str()))
        .await?;

    let records: Vec<PriceResponse> = response.take(0)?;
    // Lấy bản ghi đầu tiên nếu tìm thấy, nếu không trả về lỗi
    let price_record = records.into_iter().next().ok_or_else(|| {
        anyhow::anyhow!(
            "Không tìm thấy giá cho region '{}' và instance_type '{}' và deployment_type '{}'",
            region.to_str(),
            options.storage_type.as_str(),
            options.usage_type.as_str()
        )
    })?;

    let uom = UOM::from_str(&price_record.uom)?;

    Ok((price_record.price, uom))
}