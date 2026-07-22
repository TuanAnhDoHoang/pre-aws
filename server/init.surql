OPTION IMPORT;

-- =====================================================================
-- 1. KHỞI TẠO BẢNG EC2_PRICING
-- =====================================================================
DEFINE TABLE OVERWRITE ec2_pricing SCHEMAFULL;

-- =====================================================================
-- 2. ĐỊNH NGHĨA CÁC TRƯỜNG DỮ LIỆU & RÀNG BUỘC (ENUMS)
-- =====================================================================

-- Đơn vị tính (UOM)
DEFINE FIELD OVERWRITE uom ON TABLE ec2_pricing 
    TYPE string 
    DEFAULT "Hour"
    ASSERT $value INSIDE ["Second", "Hour", "Month"];

-- Giá (Price)
DEFINE FIELD OVERWRITE price ON TABLE ec2_pricing TYPE float;

-- Mã Region AWS
DEFINE FIELD OVERWRITE region ON TABLE ec2_pricing 
    TYPE string 
    ASSERT $value INSIDE [
        "us-east-1", "us-west-1", "eu-west-1", "eu-central-1", 
        "ap-southeast-1", "ap-northeast-1", "ap-south-1", "ap-southeast-2", "sa-east-1"
    ];

-- Loại Instance EC2
DEFINE FIELD OVERWRITE instance_type ON TABLE ec2_pricing 
    TYPE string 
    ASSERT $value INSIDE [
        -- T3 & T4g
        "t3.nano", "t3.micro", "t3.small", "t3.medium", "t3.large", "t3.xlarge", "t3.2xlarge",
        "t4g.nano", "t4g.micro", "t4g.small", "t4g.medium", "t4g.large", "t4g.xlarge", "t4g.2xlarge",
        -- M5 & M6g
        "m5.large", "m5.xlarge", "m5.2xlarge", "m5.4xlarge", "m5.8xlarge", "m5.12xlarge", "m5.16xlarge", "m5.24xlarge",
        "m6g.large", "m6g.xlarge", "m6g.2xlarge", "m6g.4xlarge",
        -- C5 & C6g
        "c5.large", "c5.xlarge", "c5.2xlarge", "c5.4xlarge", "c5.9xlarge", "c5.12xlarge", "c5.18xlarge", "c5.24xlarge",
        "c6g.large", "c6g.xlarge", "c6g.2xlarge",
        -- R5 & R6g
        "r5.large", "r5.xlarge", "r5.2xlarge", "r5.4xlarge", "r5.8xlarge", "r5.12xlarge", "r5.24xlarge",
        "r6g.large", "r6g.xlarge", "r6g.2xlarge",
        -- I3, G5, P3
        "i3.large", "i3.xlarge", "i3.2xlarge", "i3.4xlarge",
        "g5.xlarge", "g5.2xlarge", "g5.4xlarge",
        "p3.2xlarge"
    ];

-- =====================================================================
-- 3. INSERT DỮ LIỆU THỰC TẾ
-- =====================================================================

INSERT INTO ec2_pricing [
    -- T3.NANO
    { instance_type: "t3.nano", region: "us-east-1", price: 0.0052, uom: "Hour"},
    { instance_type: "t3.nano", region: "us-west-1", price: 0.0057, uom: "Hour"},
    { instance_type: "t3.nano", region: "eu-west-1", price: 0.0056, uom: "Hour"},
    { instance_type: "t3.nano", region: "eu-central-1", price: 0.0058, uom: "Hour"},
    { instance_type: "t3.nano", region: "ap-southeast-1", price: 0.0062, uom: "Hour"},
    { instance_type: "t3.nano", region: "ap-northeast-1", price: 0.0063, uom: "Hour"},
    { instance_type: "t3.nano", region: "ap-south-1", price: 0.0057, uom: "Hour"},
    { instance_type: "t3.nano", region: "ap-southeast-2", price: 0.0063, uom: "Hour"},
    { instance_type: "t3.nano", region: "sa-east-1", price: 0.0073, uom: "Hour"},

    -- T3.MICRO
    { instance_type: "t3.micro", region: "us-east-1", price: 0.0104, uom: "Hour"},
    { instance_type: "t3.micro", region: "ap-southeast-1", price: 0.0125, uom: "Hour"},

    -- T4G.NANO
    { instance_type: "t4g.nano", region: "us-east-1", price: 0.0042, uom: "Hour"},
    { instance_type: "t4g.nano", region: "ap-southeast-1", price: 0.0050, uom: "Hour"},

    -- M5.LARGE
    { instance_type: "m5.large", region: "us-east-1", price: 0.0960, uom: "Hour"},
    { instance_type: "m5.large", region: "ap-southeast-1", price: 0.1152, uom: "Hour"}
];
