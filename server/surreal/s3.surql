OPTION IMPORT;
-- =====================================================================
-- 1. KHỞI TẠO BẢNG S3_PRICING
-- =====================================================================
DEFINE TABLE OVERWRITE s3_pricing SCHEMAFULL;

-- =====================================================================
-- 2. ĐỊNH NGHĨA CÁC TRƯỜNG DỮ LIỆU & RÀNG BUỘC (ENUMS)
-- =====================================================================

-- Đơn vị tính (UOM)
DEFINE FIELD OVERWRITE uom ON TABLE s3_pricing 
    TYPE string 
    DEFAULT "GB"
    ASSERT $value INSIDE ["GB", "TB", "Request", "Hour"];

-- Giá (Price)
DEFINE FIELD OVERWRITE price ON TABLE s3_pricing TYPE float;

-- Mã Region AWS
DEFINE FIELD OVERWRITE region ON TABLE s3_pricing 
    TYPE string 
    ASSERT $value INSIDE [
        "us-east-1", "us-west-1", "eu-west-1", "eu-central-1", 
        "ap-southeast-1", "ap-northeast-1", "ap-south-1", "ap-southeast-2", "sa-east-1"
    ];

-- Loại lưu trữ S3 (S3 Storage Class)
DEFINE FIELD OVERWRITE s3_type ON TABLE s3_pricing 
    TYPE string 
    ASSERT $value INSIDE ["standard", "intelligent-tiering", "standard-ia", "onezone-ia", "glacier-instant", "glacier-flexible", "glacier-deep-archive"];

-- Mức dung lượng/Cách dùng (Usage Type)
DEFINE FIELD OVERWRITE usage_type ON TABLE s3_pricing 
    TYPE string 
    ASSERT $value INSIDE ["50TBM", "500TBM", "1000TBM"];

INSERT INTO s3_pricing [
    { storage_type: "standard", usage_type: "50TBM", region: "ap-southeast-1", price: 0.025, uom: "GB" },
    { storage_type: "standard", usage_type: "500TBM", region: "ap-southeast-1", price: 0.024, uom: "GB" },
    { storage_type: "standard", usage_type: "1000TBM", region: "ap-southeast-1", price: 0.023, uom: "GB" }
];