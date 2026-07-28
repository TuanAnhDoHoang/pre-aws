use anyhow::anyhow;
use serde::Deserialize;
use std::str::FromStr;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
pub enum AwsWavelengthZone {
    // --- US East (N. Virginia) [us-east-1] - Verizon ---
    UsEast1Wl1Atl1, // Atlanta, GA
    UsEast1Wl1Bos1, // Boston, MA
    UsEast1Wl1Clt1, // Charlotte, NC
    UsEast1Wl1Chi1, // Chicago, IL
    UsEast1Wl1Dfw1, // Dallas, TX
    UsEast1Wl1Dtt1, // Detroit, MI
    UsEast1Wl1Hou1, // Houston, TX
    UsEast1Wl1Mci1, // Kansas City, MO
    UsEast1Wl1Mia1, // Miami, FL
    UsEast1Wl1Msp1, // Minneapolis, MN
    UsEast1Wl1Bna1, // Nashville, TN
    UsEast1Wl1Nyc1, // New York City, NY
    UsEast1Wl1Tpa1, // Tampa, FL
    UsEast1Wl1Was1, // Washington, DC

    // --- US West (Oregon) [us-west-2] - Verizon ---
    UsWest2Wl1Den1, // Denver, CO
    UsWest2Wl1Las1, // Las Vegas, NV
    UsWest2Wl1Lax1, // Los Angeles, CA
    UsWest2Wl1Phx1, // Phoenix, AZ
    UsWest2Wl1Sfo1, // San Francisco Bay Area, CA
    UsWest2Wl1Sea1, // Seattle, WA

    // --- Asia Pacific (Tokyo) [ap-northeast-1] - KDDI ---
    ApNortheast1Wl1Tyo1, // Tokyo, Japan
    ApNortheast1Wl1Osa1, // Osaka, Japan

    // --- Canada (Central) [ca-central-1] - Bell ---
    CaCentral1Wl1Yto1, // Toronto, Canada

    // --- Europe (London) [eu-west-2] - BT ---
    EuWest2Wl1Man1, // Manchester, United Kingdom

    // --- Europe (Paris) [eu-west-3] - Orange / Sonatel ---
    EuWest3Wl1Cas1, // Casablanca, Morocco (Orange)
    EuWest3Wl1Dkr1, // Dakar, Senegal (Sonatel)
}

impl AwsWavelengthZone {
    /// Trả về chuỗi Zone Code chính thức của AWS (ví dụ: "us-east-1-wl1-atl1")
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::UsEast1Wl1Atl1 => "us-east-1-wl1-atl1",
            Self::UsEast1Wl1Bos1 => "us-east-1-wl1-bos1",
            Self::UsEast1Wl1Clt1 => "us-east-1-wl1-clt1",
            Self::UsEast1Wl1Chi1 => "us-east-1-wl1-chi1",
            Self::UsEast1Wl1Dfw1 => "us-east-1-wl1-dfw1",
            Self::UsEast1Wl1Dtt1 => "us-east-1-wl1-dtt1",
            Self::UsEast1Wl1Hou1 => "us-east-1-wl1-hou1",
            Self::UsEast1Wl1Mci1 => "us-east-1-wl1-mci1",
            Self::UsEast1Wl1Mia1 => "us-east-1-wl1-mia1",
            Self::UsEast1Wl1Msp1 => "us-east-1-wl1-msp1",
            Self::UsEast1Wl1Bna1 => "us-east-1-wl1-bna1",
            Self::UsEast1Wl1Nyc1 => "us-east-1-wl1-nyc1",
            Self::UsEast1Wl1Tpa1 => "us-east-1-wl1-tpa1",
            Self::UsEast1Wl1Was1 => "us-east-1-wl1-was1",

            Self::UsWest2Wl1Den1 => "us-west-2-wl1-den1",
            Self::UsWest2Wl1Las1 => "us-west-2-wl1-las1",
            Self::UsWest2Wl1Lax1 => "us-west-2-wl1-lax1",
            Self::UsWest2Wl1Phx1 => "us-west-2-wl1-phx1",
            Self::UsWest2Wl1Sfo1 => "us-west-2-wl1-sfo1",
            Self::UsWest2Wl1Sea1 => "us-west-2-wl1-sea1",

            Self::ApNortheast1Wl1Tyo1 => "ap-northeast-1-wl1-tyo1",
            Self::ApNortheast1Wl1Osa1 => "ap-northeast-1-wl1-osa1",

            Self::CaCentral1Wl1Yto1 => "ca-central-1-wl1-yto1",

            Self::EuWest2Wl1Man1 => "eu-west-2-wl1-man1",

            Self::EuWest3Wl1Cas1 => "eu-west-3-wl1-cas1",
            Self::EuWest3Wl1Dkr1 => "eu-west-3-wl1-dkr1",
        }
    }
}

impl FromStr for AwsWavelengthZone {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "us-east-1-wl1-atl1" => Ok(Self::UsEast1Wl1Atl1),
            "us-east-1-wl1-bos1" => Ok(Self::UsEast1Wl1Bos1),
            "us-east-1-wl1-clt1" => Ok(Self::UsEast1Wl1Clt1),
            "us-east-1-wl1-chi1" => Ok(Self::UsEast1Wl1Chi1),
            "us-east-1-wl1-dfw1" => Ok(Self::UsEast1Wl1Dfw1),
            "us-east-1-wl1-dtt1" => Ok(Self::UsEast1Wl1Dtt1),
            "us-east-1-wl1-hou1" => Ok(Self::UsEast1Wl1Hou1),
            "us-east-1-wl1-mci1" => Ok(Self::UsEast1Wl1Mci1),
            "us-east-1-wl1-mia1" => Ok(Self::UsEast1Wl1Mia1),
            "us-east-1-wl1-msp1" => Ok(Self::UsEast1Wl1Msp1),
            "us-east-1-wl1-bna1" => Ok(Self::UsEast1Wl1Bna1),
            "us-east-1-wl1-nyc1" => Ok(Self::UsEast1Wl1Nyc1),
            "us-east-1-wl1-tpa1" => Ok(Self::UsEast1Wl1Tpa1),
            "us-east-1-wl1-was1" => Ok(Self::UsEast1Wl1Was1),
            "us-west-2-wl1-den1" => Ok(Self::UsWest2Wl1Den1),
            "us-west-2-wl1-las1" => Ok(Self::UsWest2Wl1Las1),
            "us-west-2-wl1-lax1" => Ok(Self::UsWest2Wl1Lax1),
            "us-west-2-wl1-phx1" => Ok(Self::UsWest2Wl1Phx1),
            "us-west-2-wl1-sfo1" => Ok(Self::UsWest2Wl1Sfo1),
            "us-west-2-wl1-sea1" => Ok(Self::UsWest2Wl1Sea1),
            "ap-northeast-1-wl1-tyo1" => Ok(Self::ApNortheast1Wl1Tyo1),
            "ap-northeast-1-wl1-osa1" => Ok(Self::ApNortheast1Wl1Osa1),
            "ca-central-1-wl1-yto1" => Ok(Self::CaCentral1Wl1Yto1),
            "eu-west-2-wl1-man1" => Ok(Self::EuWest2Wl1Man1),
            "eu-west-3-wl1-cas1" => Ok(Self::EuWest3Wl1Cas1),
            "eu-west-3-wl1-dkr1" => Ok(Self::EuWest3Wl1Dkr1),
            _ => Err(anyhow!("Invalid AWS wavelength zone")),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
pub enum AwsLocalZone {
    // --- US East (N. Virginia) [us-east-1] ---
    UsEast1Atl2a, // Atlanta, GA, US
    UsEast1Bos1a, // Boston, MA, US
    UsEast1Chi2a, // Chicago, IL, US
    UsEast1Dfw2a, // Dallas, TX, US
    UsEast1Iah2a, // Houston, TX, US
    UsEast1Mci1a, // Kansas City, MO, US
    UsEast1Mia2a, // Miami, FL, US
    UsEast1Msp1a, // Minneapolis, MN, US
    UsEast1Nyc2a, // New York City, NY, US
    UsEast1Phl1a, // Philadelphia, PA, US
    UsEast1Bue1a, // Buenos Aires, Argentina
    UsEast1Scl1a, // Santiago, Chile
    UsEast1Lim1a, // Lima, Peru

    // --- US West (Oregon) [us-west-2] ---
    UsWest2Den1a, // Denver, CO, US
    UsWest2Hnl1a, // Honolulu, HI, US (Hawaii)
    UsWest2Las1a, // Las Vegas, NV, US
    UsWest2Lax1a, // Los Angeles, CA, US (Zone 1)
    UsWest2Lax1b, // Los Angeles, CA, US (Zone 2)
    UsWest2Phx2a, // Phoenix, AZ, US
    UsWest2Sea1a, // Seattle, WA, US

    // --- Asia Pacific (Singapore) [ap-southeast-1] ---
    ApSoutheast1Mnl1a, // Manila, Philippines
    ApSoutheast1Bkk1a, // Bangkok, Thailand
    ApSoutheast1Han1a, // Hanoi, Vietnam

    // --- Asia Pacific (Sydney) [ap-southeast-2] ---
    ApSoutheast2Per1a, // Perth, Australia
    ApSoutheast2Akl1a, // Auckland, New Zealand

    // --- Asia Pacific (Mumbai) [ap-south-1] ---
    ApSouth1Del1a, // Delhi, India
    ApSouth1Ccu1a, // Kolkata, India

    // --- Europe (Frankfurt) [eu-central-1] ---
    EuCentral1Ham1a, // Hamburg, Germany
    EuCentral1Waw1a, // Warsaw, Poland
    EuCentral1Ist1a, // Istanbul, Turkey
    EuCentral1Ath1a, // Athens, Greece

    // --- Europe (Stockholm) [eu-north-1] ---
    EuNorth1Cph1a, // Copenhagen, Denmark
    EuNorth1Hel1a, // Helsinki, Finland

    // --- Africa (Cape Town) [af-south-1] ---
    AfSouth1Los1a, // Lagos, Nigeria

    // --- Middle East (Bahrain) [me-south-1] ---
    MeSouth1Mct1a, // Muscat, Oman
}

impl AwsLocalZone {
    /// Trả về chuỗi kí hiệu Zone chính thức được hiển thị trên console AWS (ví dụ: "us-east-1-atl-2a")
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::UsEast1Atl2a => "us-east-1-atl-2a",
            Self::UsEast1Bos1a => "us-east-1-bos-1a",
            Self::UsEast1Chi2a => "us-east-1-chi-2a",
            Self::UsEast1Dfw2a => "us-east-1-dfw-2a",
            Self::UsEast1Iah2a => "us-east-1-iah-2a",
            Self::UsEast1Mci1a => "us-east-1-mci-1a",
            Self::UsEast1Mia2a => "us-east-1-mia-2a",
            Self::UsEast1Msp1a => "us-east-1-msp-1a",
            Self::UsEast1Nyc2a => "us-east-1-nyc-2a",
            Self::UsEast1Phl1a => "us-east-1-phl-1a",
            Self::UsEast1Bue1a => "us-east-1-bue-1a",
            Self::UsEast1Scl1a => "us-east-1-scl-1a",
            Self::UsEast1Lim1a => "us-east-1-lim-1a",

            Self::UsWest2Den1a => "us-west-2-den-1a",
            Self::UsWest2Hnl1a => "us-west-2-hnl-1a",
            Self::UsWest2Las1a => "us-west-2-las-1a",
            Self::UsWest2Lax1a => "us-west-2-lax-1a",
            Self::UsWest2Lax1b => "us-west-2-lax-1b",
            Self::UsWest2Phx2a => "us-west-2-phx-2a",
            Self::UsWest2Sea1a => "us-west-2-sea-1a",

            Self::ApSoutheast1Mnl1a => "ap-southeast-1-mnl-1a",
            Self::ApSoutheast1Bkk1a => "ap-southeast-1-bkk-1a",
            Self::ApSoutheast1Han1a => "ap-southeast-1-han-1a",

            Self::ApSoutheast2Per1a => "ap-southeast-2-per-1a",
            Self::ApSoutheast2Akl1a => "ap-southeast-2-akl-1a",

            Self::ApSouth1Del1a => "ap-south-1-del-1a",
            Self::ApSouth1Ccu1a => "ap-south-1-ccu-1a",

            Self::EuCentral1Ham1a => "eu-central-1-ham-1a",
            Self::EuCentral1Waw1a => "eu-central-1-waw-1a",
            Self::EuCentral1Ist1a => "eu-central-1-ist-1a",
            Self::EuCentral1Ath1a => "eu-central-1-ath-1a",

            Self::EuNorth1Cph1a => "eu-north-1-cph-1a",
            Self::EuNorth1Hel1a => "eu-north-1-hel-1a",

            Self::AfSouth1Los1a => "af-south-1-los-1a",

            Self::MeSouth1Mct1a => "me-south-1-mct-1a",
        }
    }
}

impl FromStr for AwsLocalZone {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "us-east-1-atl-2a" => Ok(Self::UsEast1Atl2a),
            "us-east-1-bos-1a" => Ok(Self::UsEast1Bos1a),
            "us-east-1-chi-2a" => Ok(Self::UsEast1Chi2a),
            "us-east-1-dfw-2a" => Ok(Self::UsEast1Dfw2a),
            "us-east-1-iah-2a" => Ok(Self::UsEast1Iah2a),
            "us-east-1-mci-1a" => Ok(Self::UsEast1Mci1a),
            "us-east-1-mia-2a" => Ok(Self::UsEast1Mia2a),
            "us-east-1-msp-1a" => Ok(Self::UsEast1Msp1a),
            "us-east-1-nyc-2a" => Ok(Self::UsEast1Nyc2a),
            "us-east-1-phl-1a" => Ok(Self::UsEast1Phl1a),
            "us-east-1-bue-1a" => Ok(Self::UsEast1Bue1a),
            "us-east-1-scl-1a" => Ok(Self::UsEast1Scl1a),
            "us-east-1-lim-1a" => Ok(Self::UsEast1Lim1a),
            "us-west-2-den-1a" => Ok(Self::UsWest2Den1a),
            "us-west-2-hnl-1a" => Ok(Self::UsWest2Hnl1a),
            "us-west-2-las-1a" => Ok(Self::UsWest2Las1a),
            "us-west-2-lax-1a" => Ok(Self::UsWest2Lax1a),
            "us-west-2-lax-1b" => Ok(Self::UsWest2Lax1b),
            "us-west-2-phx-2a" => Ok(Self::UsWest2Phx2a),
            "us-west-2-sea-1a" => Ok(Self::UsWest2Sea1a),
            "ap-southeast-1-mnl-1a" => Ok(Self::ApSoutheast1Mnl1a),
            "ap-southeast-1-bkk-1a" => Ok(Self::ApSoutheast1Bkk1a),
            "ap-southeast-1-han-1a" => Ok(Self::ApSoutheast1Han1a),
            "ap-southeast-2-per-1a" => Ok(Self::ApSoutheast2Per1a),
            "ap-southeast-2-akl-1a" => Ok(Self::ApSoutheast2Akl1a),
            "ap-south-1-del-1a" => Ok(Self::ApSouth1Del1a),
            "ap-south-1-ccu-1a" => Ok(Self::ApSouth1Ccu1a),
            "eu-central-1-ham-1a" => Ok(Self::EuCentral1Ham1a),
            "eu-central-1-waw-1a" => Ok(Self::EuCentral1Waw1a),
            "eu-central-1-ist-1a" => Ok(Self::EuCentral1Ist1a),
            "eu-central-1-ath-1a" => Ok(Self::EuCentral1Ath1a),
            "eu-north-1-cph-1a" => Ok(Self::EuNorth1Cph1a),
            "eu-north-1-hel-1a" => Ok(Self::EuNorth1Hel1a),
            "af-south-1-los-1a" => Ok(Self::AfSouth1Los1a),
            "me-south-1-mct-1a" => Ok(Self::MeSouth1Mct1a),
            _ => Err(anyhow!("Invalid AWS local zone")),
        }
    }
}
