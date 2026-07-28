OPTION IMPORT;

-- =====================================================================
-- 1. KHỞI TẠO BẢNG ELB_PRICING
-- =====================================================================
DEFINE TABLE OVERWRITE elb_pricing SCHEMAFULL;

-- =====================================================================
-- 2. ĐỊNH NGHĨA CÁC TRƯỜNG DỮ LIỆU & RÀNG BUỘC (ENUMS)
-- =====================================================================

-- Đơn vị tính (UOM)
DEFINE FIELD OVERWRITE uom ON TABLE elb_pricing
    TYPE string
    DEFAULT "Hour"
    ASSERT $value INSIDE ["Second", "Hour", "Month"];

-- Loại ELB
DEFINE FIELD OVERWRITE elb_type ON TABLE elb_pricing
    TYPE string
    ASSERT $value INSIDE ["ALB", "NLB", "GWLB", "CLB"];

-- Phí theo giờ (Hour cost)
DEFINE FIELD OVERWRITE hour_cost ON TABLE elb_pricing TYPE float;

-- Phí LCU (LCU cost)
DEFINE FIELD OVERWRITE lcu_cost ON TABLE elb_pricing TYPE option<float>;

-- Phí Trust Store
DEFINE FIELD OVERWRITE trust_store_cost ON TABLE elb_pricing TYPE option<float>;

-- Phí CLU Reserve
DEFINE FIELD OVERWRITE lcu_reserve_cost ON TABLE elb_pricing TYPE option<float>;

-- Loại vị trí (location type)
DEFINE FIELD OVERWRITE location_type ON TABLE elb_pricing
    TYPE string
    ASSERT $value INSIDE ["region", "wave-length", "local-zone"];

-- Mã vị trí (location code)
DEFINE FIELD OVERWRITE location_code ON TABLE elb_pricing
    TYPE string
    ASSERT $value INSIDE [
        "ap-southeast-1", "ap-southeast-2", "ap-northeast-1",
        "ap-northeast-1-wl1-tyo1", "ap-northeast-1-wl1-osa1",
        "ap-southeast-1-han-1a", "ap-southeast-1-bkk-1a"
    ];

-- =====================================================================
-- 3. INSERT DỮ LIỆU THỰC TẾ
-- =====================================================================

INSERT INTO elb_pricing [
    -- =================================================================
    -- REGION: Singapore (ap-southeast-1)
    -- =================================================================
    { elb_type: "ALB",  location_type: "region", location_code: "ap-southeast-1", hour_cost: 0.0252, lcu_cost: 0.008, trust_store_cost: 0.0056, lcu_reserve_cost: 0.0080, uom: "Hour" },
    { elb_type: "NLB",  location_type: "region", location_code: "ap-southeast-1", hour_cost: 0.0252, lcu_cost: 0.006, lcu_reserve_cost: 0.006, uom: "Hour" },
    { elb_type: "GWLB", location_type: "region", location_code: "ap-southeast-1", hour_cost: 0.0140, lcu_cost: 0.004, lcu_reserve_cost: 0.004, uom: "Hour" },
    { elb_type: "CLB",  location_type: "region", location_code: "ap-southeast-1", hour_cost: 0.028, lcu_cost: 0.008, uom: "Hour" },

    -- =================================================================
    -- REGION: Sydney (ap-southeast-2)
    -- =================================================================
    { elb_type: "ALB",  location_type: "region", location_code: "ap-southeast-2", hour_cost: 0.0252, lcu_cost: 0.008, trust_store_cost: 0.0056, lcu_reserve_cost: 0.0080, uom: "Hour" },
    { elb_type: "NLB",  location_type: "region", location_code: "ap-southeast-2", hour_cost: 0.0252, lcu_cost: 0.006, lcu_reserve_cost: 0.006, uom: "Hour" },
    { elb_type: "GWLB", location_type: "region", location_code: "ap-southeast-2", hour_cost: 0.0140, lcu_cost: 0.004, lcu_reserve_cost: 0.004, uom: "Hour" },
    { elb_type: "CLB",  location_type: "region", location_code: "ap-southeast-2", hour_cost: 0.028, lcu_cost: 0.008, uom: "Hour" },

    -- =================================================================
    -- REGION: Tokyo (ap-northeast-1)
    -- =================================================================
    { elb_type: "ALB",  location_type: "region", location_code: "ap-northeast-1", hour_cost: 0.0243, lcu_cost: 0.008, trust_store_cost: 0.0054, lcu_reserve_cost: 0.0080, uom: "Hour" },
    { elb_type: "NLB",  location_type: "region", location_code: "ap-northeast-1", hour_cost: 0.0243, lcu_cost: 0.006, lcu_reserve_cost: 0.006, uom: "Hour" },
    { elb_type: "GWLB", location_type: "region", location_code: "ap-northeast-1", hour_cost: 0.0135, lcu_cost: 0.004, lcu_reserve_cost: 0.004, uom: "Hour" },
    { elb_type: "CLB",  location_type: "region", location_code: "ap-northeast-1", hour_cost: 0.027, lcu_cost: 0.008, uom: "Hour" },

    -- =================================================================
    -- WAVE LENGTH: Asia Pacific (KDDI) - Tokyo
    -- =================================================================
    { elb_type: "ALB", location_type: "wave-length", location_code: "ap-northeast-1-wl1-tyo1", hour_cost: 0.032805, lcu_cost: 0.0108, uom: "Hour" },

    -- =================================================================
    -- WAVE LENGTH: Asia Pacific (KDDI) - Osaka
    -- =================================================================
    { elb_type: "ALB", location_type: "wave-length", location_code: "ap-northeast-1-wl1-osa1", hour_cost: 0.032805, lcu_cost: 0.0108, uom: "Hour" },

    -- =================================================================
    -- LOCAL ZONE: Vietnam (Hanoi)
    -- =================================================================
    { elb_type: "ALB", location_type: "local-zone", location_code: "ap-southeast-1-han-1a", hour_cost: 0.0775, lcu_cost: 0.0125, uom: "Hour" },

    -- =================================================================
    -- LOCAL ZONE: Thailand (Bangkok)
    -- =================================================================
    { elb_type: "ALB", location_type: "local-zone", location_code: "ap-southeast-1-bkk-1a", hour_cost: 0.0775, lcu_cost: 0.0125, uom: "Hour" }
];
