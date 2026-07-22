use serde::Deserialize;

pub mod ec2;
#[derive(Debug, Deserialize)]
pub enum Region {
    Virginia,
    California,
    Singapore,
    Tokyo,
    Sydney,
}

impl Region {
    /// Trả về chuỗi định danh (Region Code) chuẩn của AWS
    pub fn to_str(&self) -> &'static str {
        match self {
            Region::Virginia => "us-east-1",
            Region::California => "us-west-1",
            Region::Singapore => "ap-southeast-1",
            Region::Tokyo => "ap-northeast-1",
            Region::Sydney => "ap-southeast-2",
        }
    }
}
