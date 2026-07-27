OPTION IMPORT;
-- =====================================================================
-- 1. KHỞI TẠO BẢNG RDS_PRICING
-- =====================================================================
DEFINE TABLE OVERWRITE rds_pricing SCHEMAFULL;

-- =====================================================================
-- 2. ĐỊNH NGHĨA CÁC TRƯỜNG DỮ LIỆU & RÀNG BUỘC (ENUMS)
-- =====================================================================

-- Engine của RDS (Engine)
DEFINE FIELD OVERWRITE engine ON TABLE rds_pricing 
    TYPE string 
    DEFAULT "postgres"
    ASSERT $value INSIDE ["postgres", "mysql", "oracle"];

-- Đơn vị tính (UOM)
DEFINE FIELD OVERWRITE uom ON TABLE rds_pricing 
    TYPE string 
    DEFAULT "Hour"
    ASSERT $value INSIDE ["Second", "Hour", "Month"];

-- Giá (Price)
DEFINE FIELD OVERWRITE price ON TABLE rds_pricing TYPE float;

-- Mã Region AWS
DEFINE FIELD OVERWRITE region ON TABLE rds_pricing 
    TYPE string 
    ASSERT $value INSIDE [
        "us-east-1", "us-west-1", "eu-west-1", "eu-central-1", 
        "ap-southeast-1", "ap-northeast-1", "ap-south-1", "ap-southeast-2", "sa-east-1"
    ];

-- Loại Triển khai RDS (Deployment Type)
DEFINE FIELD OVERWRITE deployment_type ON TABLE rds_pricing 
    TYPE string 
    ASSERT $value INSIDE ["single", "multi-az"];

-- Loại Instance RDS
DEFINE FIELD OVERWRITE instance_type ON TABLE rds_pricing 
    TYPE string 
    ASSERT $value INSIDE [
        -- T3 & T4g
        "db.t3.micro", "db.t3.small", "db.t3.medium", "db.t3.large", "db.t3.xlarge", "db.t3.2xlarge",
        "db.t4g.micro", "db.t4g.small", "db.t4g.medium", "db.t4g.large", "db.t4g.xlarge", "db.t4g.2xlarge",

        -- M5 & M5d
        "db.m5.large", "db.m5.xlarge", "db.m5.2xlarge", "db.m5.4xlarge", "db.m5.8xlarge", "db.m5.12xlarge", "db.m5.16xlarge", "db.m5.24xlarge",
        "db.m5d.large", "db.m5d.xlarge", "db.m5d.2xlarge", "db.m5d.4xlarge", "db.m5d.8xlarge", "db.m5d.12xlarge", "db.m5d.16xlarge", "db.m5d.24xlarge",

        -- M6g, M6gd & M6i
        "db.m6g.large", "db.m6g.xlarge", "db.m6g.2xlarge", "db.m6g.4xlarge", "db.m6g.8xlarge", "db.m6g.12xlarge", "db.m6g.16xlarge",
        "db.m6gd.large", "db.m6gd.xlarge", "db.m6gd.2xlarge", "db.m6gd.4xlarge", "db.m6gd.8xlarge", "db.m6gd.12xlarge", "db.m6gd.16xlarge",
        "db.m6i.large", "db.m6i.xlarge", "db.m6i.2xlarge", "db.m6i.4xlarge", "db.m6i.8xlarge", "db.m6i.12xlarge", "db.m6i.16xlarge", "db.m6i.24xlarge", "db.m6i.32xlarge",

        -- M7g & M7i
        "db.m7g.large", "db.m7g.xlarge", "db.m7g.2xlarge", "db.m7g.4xlarge", "db.m7g.8xlarge", "db.m7g.12xlarge", "db.m7g.16xlarge",
        "db.m7i.large", "db.m7i.xlarge", "db.m7i.2xlarge", "db.m7i.4xlarge", "db.m7i.8xlarge", "db.m7i.12xlarge", "db.m7i.16xlarge", "db.m7i.24xlarge", "db.m7i.48xlarge",

        -- M8g
        "db.m8g.large", "db.m8g.xlarge", "db.m8g.2xlarge", "db.m8g.4xlarge", "db.m8g.8xlarge", "db.m8g.12xlarge", "db.m8g.16xlarge", "db.m8g.24xlarge", "db.m8g.48xlarge"
    ];

INSERT INTO rds_pricing [
    -- T4G FAMILY
    { engine: "postgres", instance_type: "db.t4g.micro", region: "ap-southeast-1", deployment_type: "single", price: 0.025, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.small", region: "ap-southeast-1", deployment_type: "single", price: 0.051, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.medium", region: "ap-southeast-1", deployment_type: "single", price: 0.102, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.large", region: "ap-southeast-1", deployment_type: "single", price: 0.203, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.406, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.813, uom: "Hour" },

    --T3 FAMILY
    { engine: "postgres", instance_type: "db.t3.micro", region: "ap-southeast-1", deployment_type: "single", price: 0.028, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.small", region: "ap-southeast-1", deployment_type: "single", price: 0.056, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.medium", region: "ap-southeast-1", deployment_type: "single", price: 0.112, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.large", region: "ap-southeast-1", deployment_type: "single", price: 0.224, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.448, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.896, uom: "Hour" },

    --M8G FAMILY
    { engine: "postgres", instance_type: "db.m8g.large", region: "ap-southeast-1", deployment_type: "single", price: 0.234, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.468, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.937, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.4xlarge", region: "ap-southeast-1", deployment_type: "single", price: 1.874, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.8xlarge", region: "ap-southeast-1", deployment_type: "single", price: 3.747, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.12xlarge", region: "ap-southeast-1", deployment_type: "single", price: 5.621, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.16xlarge", region: "ap-southeast-1", deployment_type: "single", price: 7.494, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.24xlarge", region: "ap-southeast-1", deployment_type: "single", price: 11.242, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.48xlarge", region: "ap-southeast-1", deployment_type: "single", price: 22.484, uom: "Hour" },

    --M7G FAMILY
    { engine: "postgres", instance_type: "db.m7g.large", region: "ap-southeast-1", deployment_type: "single", price: 0.234, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.468, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.937, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.4xlarge", region: "ap-southeast-1", deployment_type: "single", price: 1.874, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.8xlarge", region: "ap-southeast-1", deployment_type: "single", price: 3.747, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.12xlarge", region: "ap-southeast-1", deployment_type: "single", price: 5.621, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.16xlarge", region: "ap-southeast-1", deployment_type: "single", price: 7.494, uom: "Hour" },

    --M7I FAMILY
    { engine: "postgres", instance_type: "db.m7i.large", region: "ap-southeast-1", deployment_type: "single", price: 0.247, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.494, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.988, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.4xlarge", region: "ap-southeast-1", deployment_type: "single", price: 1.976, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.8xlarge", region: "ap-southeast-1", deployment_type: "single", price: 3.952, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.12xlarge", region: "ap-southeast-1", deployment_type: "single", price: 5.928, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.16xlarge", region: "ap-southeast-1", deployment_type: "single", price: 7.904, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.24xlarge", region: "ap-southeast-1", deployment_type: "single", price: 11.856, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.48xlarge", region: "ap-southeast-1", deployment_type: "single", price: 23.712, uom: "Hour" },

    --M6G FAMILY
    { engine: "postgres", instance_type: "db.m6g.large", region: "ap-southeast-1", deployment_type: "single", price: 0.221, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.441, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.883, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.4xlarge", region: "ap-southeast-1", deployment_type: "single", price: 1.765, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.8xlarge", region: "ap-southeast-1", deployment_type: "single", price: 3.53, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.12xlarge", region: "ap-southeast-1", deployment_type: "single", price: 5.295, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.16xlarge", region: "ap-southeast-1", deployment_type: "single", price: 7.06, uom: "Hour" },

    --M6GD FAMILY
    { engine: "postgres", instance_type: "db.m6gd.large", region: "ap-southeast-1", deployment_type: "single", price: 0.26, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.52, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 1.041, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.4xlarge", region: "ap-southeast-1", deployment_type: "single", price: 2.081, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.8xlarge", region: "ap-southeast-1", deployment_type: "single", price: 4.162, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.12xlarge", region: "ap-southeast-1", deployment_type: "single", price: 6.243, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.16xlarge", region: "ap-southeast-1", deployment_type: "single", price: 8.324, uom: "Hour" },

    --M6I FAMILY
    { engine: "postgres", instance_type: "db.m6i.large", region: "ap-southeast-1", deployment_type: "single", price: 0.247, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.494, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.988, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.4xlarge", region: "ap-southeast-1", deployment_type: "single", price: 1.976, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.8xlarge", region: "ap-southeast-1", deployment_type: "single", price: 3.952, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.12xlarge", region: "ap-southeast-1", deployment_type: "single", price: 5.928, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.16xlarge", region: "ap-southeast-1", deployment_type: "single", price: 7.904, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.24xlarge", region: "ap-southeast-1", deployment_type: "single", price: 11.856, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.32xlarge", region: "ap-southeast-1", deployment_type: "single", price: 15.808, uom: "Hour" },

    --M5 FAMILY
    { engine: "postgres", instance_type: "db.m5.large", region: "ap-southeast-1", deployment_type: "single", price: 0.247, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.494, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.988, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.4xlarge", region: "ap-southeast-1", deployment_type: "single", price: 1.976, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.8xlarge", region: "ap-southeast-1", deployment_type: "single", price: 3.952, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.12xlarge", region: "ap-southeast-1", deployment_type: "single", price: 5.928, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.16xlarge", region: "ap-southeast-1", deployment_type: "single", price: 7.904, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.24xlarge", region: "ap-southeast-1", deployment_type: "single", price: 11.856, uom: "Hour" },

    --M5D FAMILY
    { engine: "postgres", instance_type: "db.m5d.large", region: "ap-southeast-1", deployment_type: "single", price: 0.29, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.xlarge", region: "ap-southeast-1", deployment_type: "single", price: 0.58, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.2xlarge", region: "ap-southeast-1", deployment_type: "single", price: 1.161, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.4xlarge", region: "ap-southeast-1", deployment_type: "single", price: 2.322, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.8xlarge", region: "ap-southeast-1", deployment_type: "single", price: 4.644, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.12xlarge", region: "ap-southeast-1", deployment_type: "single", price: 6.965, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.16xlarge", region: "ap-southeast-1", deployment_type: "single", price: 9.287, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.24xlarge", region: "ap-southeast-1", deployment_type: "single", price: 13.931, uom: "Hour" }
];

INSERT INTO rds_pricing [
    --T4G FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.t4g.micro", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.051, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.small", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.102, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.medium", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.203, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.406, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.813, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t4g.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.626, uom: "Hour" },

    --T3 FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.t3.micro", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.056, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.small", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.112, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.medium", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.224, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.448, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.896, uom: "Hour" },
    { engine: "postgres", instance_type: "db.t3.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.792, uom: "Hour" },

    --M8G FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.m8g.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.468, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.936, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.872, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.4xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 3.744, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.8xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 7.488, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.12xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 11.232, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.16xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 14.976, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.24xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 22.464, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m8g.48xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 44.928, uom: "Hour" },

    --M7G FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.m7g.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.468, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.937, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.874, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.4xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 3.747, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.8xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 7.494, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.12xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 11.242, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7g.16xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 14.989, uom: "Hour" },

    --M7I FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.m7i.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.494, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.988, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.976, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.4xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 3.952, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.8xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 7.904, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.12xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 11.856, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.16xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 15.808, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.24xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 23.712, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m7i.48xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 47.424, uom: "Hour" },

    --M6G FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.m6g.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.441, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.883, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.765, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.4xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 3.53, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.8xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 7.06, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.12xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 10.59, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6g.16xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 14.121, uom: "Hour" },

    --M6GD FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.m6gd.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.52, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.041, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 2.081, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.4xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 4.162, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.8xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 8.324, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.12xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 12.487, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6gd.16xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 16.649, uom: "Hour" },

    --M6I FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.m6i.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.494, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.988, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.976, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.4xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 3.952, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.8xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 7.904, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.12xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 11.856, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.16xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 15.808, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.24xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 23.712, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m6i.32xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 31.616, uom: "Hour" },

    --M5 FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.m5.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.494, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.988, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.976, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.4xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 3.952, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.8xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 7.904, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.12xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 11.856, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.16xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 15.808, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5.24xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 23.712, uom: "Hour" },

    --M5D FAMILY (Multi-AZ)
    { engine: "postgres", instance_type: "db.m5d.large", region: "ap-southeast-1", deployment_type: "multi-az", price: 0.58, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 1.161, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.2xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 2.322, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.4xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 4.644, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.8xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 9.287, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.12xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 13.931, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.16xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 18.574, uom: "Hour" },
    { engine: "postgres", instance_type: "db.m5d.24xlarge", region: "ap-southeast-1", deployment_type: "multi-az", price: 27.862, uom: "Hour" }
];