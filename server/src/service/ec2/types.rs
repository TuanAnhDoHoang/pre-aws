use std::fmt;

use anyhow::anyhow;
use serde::Deserialize;

// 1. Enum phụ đại diện cho Họ Instance (Family)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Ec2InstanceFamily {
    T3,
    T4g,
    M5,
    M6g,
    C5,
    C6g,
    R5,
    R6g,
    I3,
    G5,
    P3,
}

// 2. Enum phụ đại diện cho Kích thước Instance (Size)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Ec2InstanceSize {
    Nano,
    Micro,
    Small,
    Medium,
    Large,
    XLarge,
    XLarge2,  // 2xlarge
    XLarge4,  // 4xlarge
    XLarge8,  // 8xlarge
    XLarge9,  // 9xlarge
    XLarge12, // 12xlarge
    XLarge16, // 16xlarge
    XLarge18, // 18xlarge
    XLarge24, // 24xlarge
}

// 3. Enum chính chứa danh sách các Ec2InstanceType bạn yêu cầu
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize)]
pub enum Ec2InstanceType {
    // T3
    T3Nano,
    T3Micro,
    T3Small,
    T3Medium,
    T3Large,
    T3XLarge,
    T3_2XLarge,
    // T4g
    T4gNano,
    T4gMicro,
    T4gSmall,
    T4gMedium,
    T4gLarge,
    T4gXLarge,
    T4g_2XLarge,
    // M5
    M5Large,
    M5XLarge,
    M5_2XLarge,
    M5_4XLarge,
    M5_8XLarge,
    M5_12XLarge,
    M5_16XLarge,
    M5_24XLarge,
    // M6g
    M6gLarge,
    M6gXLarge,
    M6g_2XLarge,
    M6g_4XLarge,
    // C5
    C5Large,
    C5XLarge,
    C5_2XLarge,
    C5_4XLarge,
    C5_9XLarge,
    C5_12XLarge,
    C5_18XLarge,
    C5_24XLarge,
    // C6g
    C6gLarge,
    C6gXLarge,
    C6g_2XLarge,
    // R5
    R5Large,
    R5XLarge,
    R5_2XLarge,
    R5_4XLarge,
    R5_8XLarge,
    R5_12XLarge,
    R5_24XLarge,
    // R6g
    R6gLarge,
    R6gXLarge,
    R6g_2XLarge,
    // I3
    I3Large,
    I3XLarge,
    I3_2XLarge,
    I3_4XLarge,
    // G5
    G5XLarge,
    G5_2XLarge,
    G5_4XLarge,
    // P3
    P3_2XLarge,
}

impl Ec2InstanceType {
    /// Hàm tiện ích lấy ra Family và Size tương ứng
    pub fn details(&self) -> (Ec2InstanceFamily, Ec2InstanceSize) {
        match self {
            // T3
            Self::T3Nano => (Ec2InstanceFamily::T3, Ec2InstanceSize::Nano),
            Self::T3Micro => (Ec2InstanceFamily::T3, Ec2InstanceSize::Micro),
            Self::T3Small => (Ec2InstanceFamily::T3, Ec2InstanceSize::Small),
            Self::T3Medium => (Ec2InstanceFamily::T3, Ec2InstanceSize::Medium),
            Self::T3Large => (Ec2InstanceFamily::T3, Ec2InstanceSize::Large),
            Self::T3XLarge => (Ec2InstanceFamily::T3, Ec2InstanceSize::XLarge),
            Self::T3_2XLarge => (Ec2InstanceFamily::T3, Ec2InstanceSize::XLarge2),

            // T4g
            Self::T4gNano => (Ec2InstanceFamily::T4g, Ec2InstanceSize::Nano),
            Self::T4gMicro => (Ec2InstanceFamily::T4g, Ec2InstanceSize::Micro),
            Self::T4gSmall => (Ec2InstanceFamily::T4g, Ec2InstanceSize::Small),
            Self::T4gMedium => (Ec2InstanceFamily::T4g, Ec2InstanceSize::Medium),
            Self::T4gLarge => (Ec2InstanceFamily::T4g, Ec2InstanceSize::Large),
            Self::T4gXLarge => (Ec2InstanceFamily::T4g, Ec2InstanceSize::XLarge),
            Self::T4g_2XLarge => (Ec2InstanceFamily::T4g, Ec2InstanceSize::XLarge2),

            // M5
            Self::M5Large => (Ec2InstanceFamily::M5, Ec2InstanceSize::Large),
            Self::M5XLarge => (Ec2InstanceFamily::M5, Ec2InstanceSize::XLarge),
            Self::M5_2XLarge => (Ec2InstanceFamily::M5, Ec2InstanceSize::XLarge2),
            Self::M5_4XLarge => (Ec2InstanceFamily::M5, Ec2InstanceSize::XLarge4),
            Self::M5_8XLarge => (Ec2InstanceFamily::M5, Ec2InstanceSize::XLarge8),
            Self::M5_12XLarge => (Ec2InstanceFamily::M5, Ec2InstanceSize::XLarge12),
            Self::M5_16XLarge => (Ec2InstanceFamily::M5, Ec2InstanceSize::XLarge16),
            Self::M5_24XLarge => (Ec2InstanceFamily::M5, Ec2InstanceSize::XLarge24),

            // M6g
            Self::M6gLarge => (Ec2InstanceFamily::M6g, Ec2InstanceSize::Large),
            Self::M6gXLarge => (Ec2InstanceFamily::M6g, Ec2InstanceSize::XLarge),
            Self::M6g_2XLarge => (Ec2InstanceFamily::M6g, Ec2InstanceSize::XLarge2),
            Self::M6g_4XLarge => (Ec2InstanceFamily::M6g, Ec2InstanceSize::XLarge4),

            // C5
            Self::C5Large => (Ec2InstanceFamily::C5, Ec2InstanceSize::Large),
            Self::C5XLarge => (Ec2InstanceFamily::C5, Ec2InstanceSize::XLarge),
            Self::C5_2XLarge => (Ec2InstanceFamily::C5, Ec2InstanceSize::XLarge2),
            Self::C5_4XLarge => (Ec2InstanceFamily::C5, Ec2InstanceSize::XLarge4),
            Self::C5_9XLarge => (Ec2InstanceFamily::C5, Ec2InstanceSize::XLarge9),
            Self::C5_12XLarge => (Ec2InstanceFamily::C5, Ec2InstanceSize::XLarge12),
            Self::C5_18XLarge => (Ec2InstanceFamily::C5, Ec2InstanceSize::XLarge18),
            Self::C5_24XLarge => (Ec2InstanceFamily::C5, Ec2InstanceSize::XLarge24),

            // C6g
            Self::C6gLarge => (Ec2InstanceFamily::C6g, Ec2InstanceSize::Large),
            Self::C6gXLarge => (Ec2InstanceFamily::C6g, Ec2InstanceSize::XLarge),
            Self::C6g_2XLarge => (Ec2InstanceFamily::C6g, Ec2InstanceSize::XLarge2),

            // R5
            Self::R5Large => (Ec2InstanceFamily::R5, Ec2InstanceSize::Large),
            Self::R5XLarge => (Ec2InstanceFamily::R5, Ec2InstanceSize::XLarge),
            Self::R5_2XLarge => (Ec2InstanceFamily::R5, Ec2InstanceSize::XLarge2),
            Self::R5_4XLarge => (Ec2InstanceFamily::R5, Ec2InstanceSize::XLarge4),
            Self::R5_8XLarge => (Ec2InstanceFamily::R5, Ec2InstanceSize::XLarge8),
            Self::R5_12XLarge => (Ec2InstanceFamily::R5, Ec2InstanceSize::XLarge12),
            Self::R5_24XLarge => (Ec2InstanceFamily::R5, Ec2InstanceSize::XLarge24),

            // R6g
            Self::R6gLarge => (Ec2InstanceFamily::R6g, Ec2InstanceSize::Large),
            Self::R6gXLarge => (Ec2InstanceFamily::R6g, Ec2InstanceSize::XLarge),
            Self::R6g_2XLarge => (Ec2InstanceFamily::R6g, Ec2InstanceSize::XLarge2),

            // I3
            Self::I3Large => (Ec2InstanceFamily::I3, Ec2InstanceSize::Large),
            Self::I3XLarge => (Ec2InstanceFamily::I3, Ec2InstanceSize::XLarge),
            Self::I3_2XLarge => (Ec2InstanceFamily::I3, Ec2InstanceSize::XLarge2),
            Self::I3_4XLarge => (Ec2InstanceFamily::I3, Ec2InstanceSize::XLarge4),

            // G5
            Self::G5XLarge => (Ec2InstanceFamily::G5, Ec2InstanceSize::XLarge),
            Self::G5_2XLarge => (Ec2InstanceFamily::G5, Ec2InstanceSize::XLarge2),
            Self::G5_4XLarge => (Ec2InstanceFamily::G5, Ec2InstanceSize::XLarge4),

            // P3
            Self::P3_2XLarge => (Ec2InstanceFamily::P3, Ec2InstanceSize::XLarge2),
        }
    }
    pub fn to_str(&self) -> String {
        let (family, size) = self.details();

        let family_str = match family {
            Ec2InstanceFamily::T3 => "t3",
            Ec2InstanceFamily::T4g => "t4g",
            Ec2InstanceFamily::M5 => "m5",
            Ec2InstanceFamily::M6g => "m6g",
            Ec2InstanceFamily::C5 => "c5",
            Ec2InstanceFamily::C6g => "c6g",
            Ec2InstanceFamily::R5 => "r5",
            Ec2InstanceFamily::R6g => "r6g",
            Ec2InstanceFamily::I3 => "i3",
            Ec2InstanceFamily::G5 => "g5",
            Ec2InstanceFamily::P3 => "p3",
        };

        let size_str = match size {
            Ec2InstanceSize::Nano => "nano",
            Ec2InstanceSize::Micro => "micro",
            Ec2InstanceSize::Small => "small",
            Ec2InstanceSize::Medium => "medium",
            Ec2InstanceSize::Large => "large",
            Ec2InstanceSize::XLarge => "xlarge",
            Ec2InstanceSize::XLarge2 => "2xlarge",
            Ec2InstanceSize::XLarge4 => "4xlarge",
            Ec2InstanceSize::XLarge8 => "8xlarge",
            Ec2InstanceSize::XLarge9 => "9xlarge",
            Ec2InstanceSize::XLarge12 => "12xlarge",
            Ec2InstanceSize::XLarge16 => "16xlarge",
            Ec2InstanceSize::XLarge18 => "18xlarge",
            Ec2InstanceSize::XLarge24 => "24xlarge",
        };
        format!("{}.{}", family_str, size_str)
    }
}

impl std::str::FromStr for Ec2InstanceType {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let normalized = s.trim().to_ascii_lowercase();
        let mut parts = normalized.split('.');

        let family = parts.next().ok_or_else(|| anyhow!("invalid instance type: {s}"))?;
        let size = parts.next().ok_or_else(|| anyhow!("invalid instance type: {s}"))?;

        if parts.next().is_some() {
            return Err(anyhow!("invalid instance type: {s}"));
        }

        match (family, size) {
            ("t3", "nano") => Ok(Self::T3Nano),
            ("t3", "micro") => Ok(Self::T3Micro),
            ("t3", "small") => Ok(Self::T3Small),
            ("t3", "medium") => Ok(Self::T3Medium),
            ("t3", "large") => Ok(Self::T3Large),
            ("t3", "xlarge") => Ok(Self::T3XLarge),
            ("t3", "2xlarge") => Ok(Self::T3_2XLarge),

            ("t4g", "nano") => Ok(Self::T4gNano),
            ("t4g", "micro") => Ok(Self::T4gMicro),
            ("t4g", "small") => Ok(Self::T4gSmall),
            ("t4g", "medium") => Ok(Self::T4gMedium),
            ("t4g", "large") => Ok(Self::T4gLarge),
            ("t4g", "xlarge") => Ok(Self::T4gXLarge),
            ("t4g", "2xlarge") => Ok(Self::T4g_2XLarge),

            ("m5", "large") => Ok(Self::M5Large),
            ("m5", "xlarge") => Ok(Self::M5XLarge),
            ("m5", "2xlarge") => Ok(Self::M5_2XLarge),
            ("m5", "4xlarge") => Ok(Self::M5_4XLarge),
            ("m5", "8xlarge") => Ok(Self::M5_8XLarge),
            ("m5", "12xlarge") => Ok(Self::M5_12XLarge),
            ("m5", "16xlarge") => Ok(Self::M5_16XLarge),
            ("m5", "24xlarge") => Ok(Self::M5_24XLarge),

            ("m6g", "large") => Ok(Self::M6gLarge),
            ("m6g", "xlarge") => Ok(Self::M6gXLarge),
            ("m6g", "2xlarge") => Ok(Self::M6g_2XLarge),
            ("m6g", "4xlarge") => Ok(Self::M6g_4XLarge),

            ("c5", "large") => Ok(Self::C5Large),
            ("c5", "xlarge") => Ok(Self::C5XLarge),
            ("c5", "2xlarge") => Ok(Self::C5_2XLarge),
            ("c5", "4xlarge") => Ok(Self::C5_4XLarge),
            ("c5", "9xlarge") => Ok(Self::C5_9XLarge),
            ("c5", "12xlarge") => Ok(Self::C5_12XLarge),
            ("c5", "18xlarge") => Ok(Self::C5_18XLarge),
            ("c5", "24xlarge") => Ok(Self::C5_24XLarge),

            ("c6g", "large") => Ok(Self::C6gLarge),
            ("c6g", "xlarge") => Ok(Self::C6gXLarge),
            ("c6g", "2xlarge") => Ok(Self::C6g_2XLarge),

            ("r5", "large") => Ok(Self::R5Large),
            ("r5", "xlarge") => Ok(Self::R5XLarge),
            ("r5", "2xlarge") => Ok(Self::R5_2XLarge),
            ("r5", "4xlarge") => Ok(Self::R5_4XLarge),
            ("r5", "8xlarge") => Ok(Self::R5_8XLarge),
            ("r5", "12xlarge") => Ok(Self::R5_12XLarge),
            ("r5", "24xlarge") => Ok(Self::R5_24XLarge),

            ("r6g", "large") => Ok(Self::R6gLarge),
            ("r6g", "xlarge") => Ok(Self::R6gXLarge),
            ("r6g", "2xlarge") => Ok(Self::R6g_2XLarge),

            ("i3", "large") => Ok(Self::I3Large),
            ("i3", "xlarge") => Ok(Self::I3XLarge),
            ("i3", "2xlarge") => Ok(Self::I3_2XLarge),
            ("i3", "4xlarge") => Ok(Self::I3_4XLarge),

            ("g5", "xlarge") => Ok(Self::G5XLarge),
            ("g5", "2xlarge") => Ok(Self::G5_2XLarge),
            ("g5", "4xlarge") => Ok(Self::G5_4XLarge),

            ("p3", "2xlarge") => Ok(Self::P3_2XLarge),

            _ => Err(anyhow!("unsupported instance type: {s}")),
        }
    }
}

impl fmt::Display for Ec2InstanceType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let (family, size) = self.details();

        let family_str = match family {
            Ec2InstanceFamily::T3 => "t3",
            Ec2InstanceFamily::T4g => "t4g",
            Ec2InstanceFamily::M5 => "m5",
            Ec2InstanceFamily::M6g => "m6g",
            Ec2InstanceFamily::C5 => "c5",
            Ec2InstanceFamily::C6g => "c6g",
            Ec2InstanceFamily::R5 => "r5",
            Ec2InstanceFamily::R6g => "r6g",
            Ec2InstanceFamily::I3 => "i3",
            Ec2InstanceFamily::G5 => "g5",
            Ec2InstanceFamily::P3 => "p3",
        };

        let size_str = match size {
            Ec2InstanceSize::Nano => "nano",
            Ec2InstanceSize::Micro => "micro",
            Ec2InstanceSize::Small => "small",
            Ec2InstanceSize::Medium => "medium",
            Ec2InstanceSize::Large => "large",
            Ec2InstanceSize::XLarge => "xlarge",
            Ec2InstanceSize::XLarge2 => "2xlarge",
            Ec2InstanceSize::XLarge4 => "4xlarge",
            Ec2InstanceSize::XLarge8 => "8xlarge",
            Ec2InstanceSize::XLarge9 => "9xlarge",
            Ec2InstanceSize::XLarge12 => "12xlarge",
            Ec2InstanceSize::XLarge16 => "16xlarge",
            Ec2InstanceSize::XLarge18 => "18xlarge",
            Ec2InstanceSize::XLarge24 => "24xlarge",
        };

        write!(f, "{}.{}", family_str, size_str)
    }
}

#[cfg(test)]
mod tests {
    use super::Ec2InstanceType;
    use std::str::FromStr;

    #[test]
    fn parses_display_format() {
        assert_eq!(Ec2InstanceType::from_str("t3.large").unwrap(), Ec2InstanceType::T3Large);
        assert_eq!(Ec2InstanceType::from_str("m5.2xlarge").unwrap(), Ec2InstanceType::M5_2XLarge);
        assert_eq!(Ec2InstanceType::from_str("c6g.xlarge").unwrap(), Ec2InstanceType::C6gXLarge);
    }
}
