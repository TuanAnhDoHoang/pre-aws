use std::fmt;

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
