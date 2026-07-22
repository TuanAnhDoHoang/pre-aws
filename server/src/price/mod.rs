use std::str::FromStr;

use anyhow::{Context, anyhow};
use serde::{Deserialize, Serialize};
use surrealdb::{Surreal, engine::remote::ws::Client, types::SurrealValue};

use crate::service::{Region, ec2::types::Ec2InstanceType};

#[derive(Debug, Deserialize)]
pub enum Service {
    EC2,
}

#[derive(Debug, Deserialize)]
pub enum ServiceOption {
    Ec2(Ec2Option),
}

#[derive(Debug, Deserialize)]
pub struct Ec2Option {
    instance_type: Ec2InstanceType,
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
    region: &Region,
    options: &ServiceOption,
) -> anyhow::Result<(f64, UOM)> {
    let (price, uom): (f64, UOM) = match (service, options) {
        (Service::EC2, ServiceOption::Ec2(ec2_options)) => get_ec2_price(db, &region, &ec2_options)
            .await
            .context("Error during getting price of Ec2"),
    }?;
    Ok((price, uom))
}

// struct PriceRecord {
//     instance_type: String,
//     region: String,
//     price: u32,
//     uom: String,
// }

#[derive(SurrealValue)]
struct PriceResponse {
    price: f64,
    uom: String,
}

async fn get_ec2_price(
    db: &Surreal<Client>,
    region: &Region,
    options: &Ec2Option,
) -> anyhow::Result<(f64, UOM)> {
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
