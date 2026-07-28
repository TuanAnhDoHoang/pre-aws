import axios from 'axios';
import { CloudNode, Connection, ServiceType } from './types';

// Helper to sanitize resource names for Terraform (no spaces, lowercase)
export function sanitizeTerraformName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/^[^a-z]+/, 'res_'); // Ensure it starts with letters
}

// Initial topology from the image
export const INITIAL_NODES: CloudNode[] = [
  {
    id: 'node_elb',
    type: 'tg', // Represents the ELB
    name: 'ELB',
    x: 400,
    y: 100,
    properties: {
      name: 'elb',
      port: 80,
      protocol: 'HTTP',
      target_type: 'instance',
    },
    status: 'active',
  },
  {
    id: 'node_tg_alpha',
    type: 'tg',
    name: 'TG-Alpha',
    x: 350,
    y: 190,
    properties: {
      name: 'tg-alpha',
      port: 80,
      protocol: 'HTTP',
      target_type: 'instance',
    },
    status: 'active',
  },
  {
    id: 'node_tg_beta',
    type: 'tg',
    name: 'TG-Beta',
    x: 450,
    y: 190,
    properties: {
      name: 'tg-beta',
      port: 80,
      protocol: 'HTTP',
      target_type: 'instance',
    },
    status: 'active',
  },
  {
    id: 'node_web_01',
    type: 'compute',
    name: 'Web Server 01',
    x: 300,
    y: 280,
    properties: {
      ami: 'ami-0c55b159cbfafe1f0',
      instance_type: 't3.large',
      name: 'Web Server 01',
    },
    status: 'active',
  },
  {
    id: 'node_web_02',
    type: 'compute',
    name: 'Web Server 02',
    x: 500,
    y: 280,
    properties: {
      ami: 'ami-0c55b159cbfafe1f0',
      instance_type: 't3.large',
      name: 'Web Server 02',
    },
    status: 'active',
  },
  {
    id: 'node_main_db',
    type: 'rds',
    name: 'Main DB',
    x: 400,
    y: 430,
    properties: {
      allocated_storage: 20,
      engine: 'mysql',
      instance_class: 'db.t3.micro',
      deployment_type: 'single',
      name: 'maindb',
      username: 'admin',
    },
    status: 'active',
  },
];

export const INITIAL_CONNECTIONS: Connection[] = [
  { id: 'conn1', from: 'node_elb', to: 'node_tg_alpha' },
  { id: 'conn2', from: 'node_elb', to: 'node_tg_beta' },
  { id: 'conn3', from: 'node_tg_alpha', to: 'node_web_01' },
  { id: 'conn4', from: 'node_tg_beta', to: 'node_web_02' },
  { id: 'conn5', from: 'node_web_01', to: 'node_main_db' },
  { id: 'conn6', from: 'node_web_02', to: 'node_main_db' },
];

// Price catalog matching typical AWS region prices for simple math
export const PRICE_CATALOG: Record<string, { hourly: number; unit: string }> = {
  't3.large': { hourly: 0.107, unit: 'USD/giờ' },
  't3.micro': { hourly: 0.013, unit: 'USD/giờ' },
  't2.micro': { hourly: 0.0116, unit: 'USD/giờ' },
  'm5.large': { hourly: 0.096, unit: 'USD/giờ' },
  'c5.large': { hourly: 0.085, unit: 'USD/giờ' },
  'db.t3.micro': { hourly: 0.017, unit: 'USD/giờ' },
  'db.t3.large': { hourly: 0.136, unit: 'USD/giờ' },
  'lambda': { hourly: 0.002, unit: 'USD/triệu request' },
  's3': { hourly: 0.023, unit: 'USD/GB/tháng' },
  'ebs_gp3': { hourly: 0.00011, unit: 'USD/GB/giờ' },
  'elb': { hourly: 0.025, unit: 'USD/giờ' },
  'cloudfront': { hourly: 0.08, unit: 'USD/GB' },
  'dynamodb': { hourly: 0.25, unit: 'USD/triệu request' },
  'vpc': { hourly: 0.0, unit: 'miễn phí' },
};

export interface ServicePricePayload {
  serviceType: ServiceType;
  region: string;
  name: string;
  properties: Record<string, any>;
}

export interface ServicePriceResult {
  price: number;
  unit: string;
  display: string;
  payloadSent?: ServicePricePayload;
}

/**
 * Hàm fetch price dùng chung cho tất cả các dịch vụ (giả lập server API).
 * Đóng gói thông tin do user chọn + region để lấy giá từ server.
 */
export async function fetchServicePrice(payload: ServicePricePayload): Promise<ServicePriceResult> {
  // Giả lập latency server fetch
  await new Promise((resolve) => setTimeout(resolve, 60));

  const { serviceType, region, properties } = payload;

  const regionMultiplier: Record<string, number> = {
    'ap-southeast-1': 1.0,   // Singapore
    'us-east-1': 0.85,       // N. Virginia
    'eu-west-1': 1.05,       // Ireland
    'ap-northeast-1': 1.1,   // Tokyo
  };
  const mult = regionMultiplier[region] || 1.0;

  if (serviceType === 'compute') {
    const response = await axios.post("http://localhost:5000/price", {
      region,
      service: "EC2",
      options: {
        Ec2: {
          instance_type: properties.instance_type
        }
      }
    });
    let price = response.data.price;
    let uom = response.data.uom;
    return {
      price,
      unit: uom,
      display: `$${price} USD/giờ`,
      payloadSent: payload,
    }
  }

  if (serviceType === 'rds') {
    // const instClass = properties.instance_class || 'db.t3.micro';
    // const baseRate = PRICE_CATALOG[instClass]?.hourly || 0.017;
    // const storage = Number(properties.allocated_storage) || 20;
    // const storageCostPerHour = (storage * 0.115) / 720;
    // const totalHourly = Number(((baseRate + storageCostPerHour) * mult).toFixed(4));
    // return {
    //   price: totalHourly,
    //   unit: 'USD/giờ',
    //   display: `$${totalHourly} USD/giờ`,
    //   payloadSent: payload,
    // };
    const response = await axios.post("http://localhost:5000/price", {
      region,
      service: "RDS",
      options: {
        Rds: {
          engine: payload.properties.engine,
          instance_type: payload.properties.instance_type,
          deployment_type: payload.properties.deployment_type 
        }
      }
    });

    let price = response.data.price;
    let uom = response.data.uom;
    return {
      price,
      unit: uom,
      display: `$${price} USD/giờ`,
      payloadSent: payload,
    }
  }

  if (serviceType === 's3') {
    const response = await axios.post('http://localhost:5000/price', {
      region,
      service: 'S3',
      options: {
        S3: {
          storage_type: properties.storage_type || 'standard',
          usage_type: properties.usage_type || '50TBM',
        },
      },
    });

    const price = response.data.price;
    const uom = response.data.uom;
    return {
      price,
      unit: uom,
      display: `$${price} ${uom}`,
      payloadSent: payload,
    };
  }

  if (serviceType === 'ebs') {
    const size = Number(properties.size) || 50;
    const hourlyCost = Number((size * PRICE_CATALOG['ebs_gp3'].hourly * mult).toFixed(4));
    return {
      price: hourlyCost,
      unit: 'USD/giờ',
      display: `$${hourlyCost} USD/giờ`,
      payloadSent: payload,
    };
  }

  if (serviceType === 'tg') {
    try {
      const elbType = properties.elb_type || 'ALB';
      const locationType = properties.location_type || 'region';
      const locationCode = properties.location_code || region;

      let elbPayload: Record<string, any> = {
        elb_type: elbType,
      };

      if (elbType === 'ALB') {
        const locationKey = locationType === 'wave-length'
          ? 'aws-wavelength-zone'
          : locationType === 'local-zone'
            ? 'aws-local-zone'
            : 'aws-region';

        elbPayload = {
          elb_type: {
            ALB: {
              [locationKey]: locationCode,
            },
          },
        };
      }

      const response = await axios.post('http://localhost:5000/price', {
        region,
        service: 'ELB',
        options: {
          Elb: elbPayload,
        },
      });

      const price = response.data.price;
      const uom = response.data.uom;
      return {
        price,
        unit: uom,
        display: `$${price} ${uom}`,
        payloadSent: payload,
      };
    } catch {
      const baseRate = PRICE_CATALOG['elb'].hourly * mult;
      const finalPrice = Number(baseRate.toFixed(4));
      return {
        price: finalPrice,
        unit: 'USD/giờ',
        display: `$${finalPrice} USD/giờ`,
        payloadSent: payload,
      };
    }
  }

  if (serviceType === 'cloudfront') {
    const finalPrice = Number((0.08 * mult).toFixed(3));
    return {
      price: finalPrice,
      unit: 'USD/GB',
      display: `$${finalPrice} USD/GB`,
      payloadSent: payload,
    };
  }

  if (serviceType === 'dynamodb') {
    const finalPrice = Number((0.25 * mult).toFixed(2));
    return {
      price: finalPrice,
      unit: 'USD/triệu request',
      display: `$${finalPrice} USD/triệu request`,
      payloadSent: payload,
    };
  }

  if (serviceType === 'lambda') {
    const finalPrice = Number((0.20 * mult).toFixed(2));
    return {
      price: finalPrice,
      unit: 'USD/triệu request',
      display: `$${finalPrice} USD/triệu request`,
      payloadSent: payload,
    };
  }

  return {
    price: 0,
    unit: 'USD/giờ',
    display: 'Miễn phí',
    payloadSent: payload,
  };
}

// Calculate cost for a single node synchronously
export function calculateNodeCost(node: CloudNode, region: string = 'ap-southeast-1'): { hourly: number; unit: string; display: string } {
  const payload: ServicePricePayload = {
    serviceType: node.type,
    region,
    name: node.name,
    properties: node.properties || {},
  };

  const regionMultiplier: Record<string, number> = {
    'ap-southeast-1': 1.0,
    'us-east-1': 0.85,
    'eu-west-1': 1.05,
    'ap-northeast-1': 1.1,
  };
  const mult = regionMultiplier[region] || 1.0;

  if (node.type === 'compute') {
    const instType = node.properties?.instance_type || 't3.large';
    const baseRate = PRICE_CATALOG[instType]?.hourly || 0.107;
    const finalPrice = Number((baseRate * mult).toFixed(4));
    return { hourly: finalPrice, unit: 'USD/giờ', display: `$${finalPrice} USD/giờ` };
  }

  if (node.type === 'rds') {
    const instClass = node.properties?.instance_class || 'db.t3.micro';
    const baseRate = PRICE_CATALOG[instClass]?.hourly || 0.017;
    const storageGB = Number(node.properties?.allocated_storage) || 20;
    const storageCostPerHour = (storageGB * 0.115) / 720;
    const totalHourly = Number(((baseRate + storageCostPerHour) * mult).toFixed(4));
    return { hourly: totalHourly, unit: 'USD/giờ', display: `$${totalHourly} USD/giờ` };
  }

  if (node.type === 'tg') {
    const rate = Number((PRICE_CATALOG['elb'].hourly * mult).toFixed(4));
    return { hourly: rate, unit: 'USD/giờ', display: `$${rate} USD/giờ` };
  }

  if (node.type === 's3') {
    const hourly = Number((0.005 * mult).toFixed(4));
    const monthlyUnit = Number((0.023 * mult).toFixed(3));
    return { hourly, unit: 'USD/GB/tháng', display: `$${monthlyUnit} USD/GB/tháng` };
  }

  if (node.type === 'ebs') {
    const size = Number(node.properties?.size) || 50;
    const hourlyCost = Number((size * PRICE_CATALOG['ebs_gp3'].hourly * mult).toFixed(4));
    return { hourly: hourlyCost, unit: 'USD/giờ', display: `$${hourlyCost} USD/giờ` };
  }

  if (node.type === 'cloudfront') {
    const hourly = Number((0.008 * mult).toFixed(4));
    const unitPrice = Number((0.08 * mult).toFixed(3));
    return { hourly, unit: 'USD/GB', display: `$${unitPrice} USD/GB` };
  }

  if (node.type === 'dynamodb') {
    const hourly = Number((0.004 * mult).toFixed(4));
    const unitPrice = Number((0.25 * mult).toFixed(2));
    return { hourly, unit: 'USD/triệu request', display: `$${unitPrice} USD/triệu request` };
  }

  if (node.type === 'lambda') {
    const hourly = Number((0.002 * mult).toFixed(4));
    const unitPrice = Number((0.20 * mult).toFixed(2));
    return { hourly, unit: 'USD/triệu request', display: `$${unitPrice} USD/triệu request` };
  }

  return { hourly: 0, unit: 'USD/giờ', display: 'Miễn phí' };
}

// Generate Terraform HCL for a node
export function generateNodeHCL(node: CloudNode): string {
  const tfId = sanitizeTerraformName(node.name || node.id);
  const props = node.properties;

  switch (node.type) {
    case 'compute':
      return `resource "aws_instance" "${tfId}" {
  ami           = "${props.ami || 'ami-0c55b159cbfafe1f0'}"
  instance_type = "${props.instance_type || 't3.large'}"

  tags = {
    Name = "${node.name}"
  }
}`;

    case 'rds':
      return `resource "aws_db_instance" "${tfId}" {
  allocated_storage    = ${props.allocated_storage || 20}
  engine               = "${props.engine || 'mysql'}"
  instance_class       = "${props.instance_class || 'db.t3.micro'}"
  name                 = "${props.name || 'maindb'}"
  username             = "${props.username || 'admin'}"
  password             = "super_secure_password"
  skip_final_snapshot  = true
}`;

    case 'tg':
      // Check if it's the main ELB or a standard target group
      if (node.name.toLowerCase().includes('elb')) {
        return `resource "aws_lb" "${tfId}" {
  name               = "${tfId}"
  internal           = false
  load_balancer_type = "application"
  subnets            = ["subnet-12345678", "subnet-87654321"]

  tags = {
    Environment = "production"
  }
}`;
      } else {
        return `resource "aws_lb_target_group" "${tfId}" {
  name        = "${tfId}"
  port        = ${props.port || 80}
  protocol    = "${props.protocol || 'HTTP'}"
  target_type = "${props.target_type || 'instance'}"
  vpc_id      = "vpc-12345678"
}`;
      }

    case 's3':
      return `resource "aws_s3_bucket" "${tfId}" {
  bucket = "${props.bucket_name || 'my-app-assets-bucket'}"

  tags = {
    Name        = "${node.name}"
    Environment = "production"
  }
}

resource "aws_s3_bucket_acl" "${tfId}_acl" {
  bucket = aws_s3_bucket.${tfId}.id
  acl    = "${props.acl || 'private'}"
}

resource "aws_s3_bucket_versioning" "${tfId}_versioning" {
  bucket = aws_s3_bucket.${tfId}.id
  versioning_configuration {
    status = "${props.versioning ? 'Enabled' : 'Disabled'}"
  }
}`;

    case 'ebs':
      return `resource "aws_ebs_volume" "${tfId}" {
  availability_zone = "ap-southeast-1a"
  size              = ${props.size || 50}
  type              = "${props.volume_type || 'gp3'}"

  tags = {
    Name = "${node.name}"
  }
}`;

    case 'dynamodb':
      return `resource "aws_dynamodb_table" "${tfId}" {
  name           = "${tfId}"
  billing_mode   = "${props.billing_mode || 'PAY_PER_REQUEST'}"
  hash_key       = "${props.hash_key || 'id'}"

  attribute {
    name = "${props.hash_key || 'id'}"
    type = "S"
  }

  tags = {
    Name = "${node.name}"
  }
}`;

    case 'lambda':
      return `resource "aws_lambda_function" "${tfId}" {
  filename      = "lambda_function_payload.zip"
  function_name = "${tfId}"
  role          = "arn:aws:iam::123456789012:role/lambda-role"
  handler       = "${props.handler || 'index.handler'}"
  runtime       = "${props.runtime || 'nodejs18.x'}"
  memory_size   = ${props.memory_size || 512}
}`;

    case 'vpc':
      return `resource "aws_vpc" "${tfId}" {
  cidr_block           = "${props.cidr_block || '10.0.0.0/16'}"
  enable_dns_hostnames = ${props.enable_dns_hostnames ?? true}

  tags = {
    Name = "${node.name}"
  }
}`;

    case 'cloudfront':
      return `resource "aws_cloudfront_distribution" "${tfId}" {
  origin {
    domain_name = "${props.origin_domain_name || 'mybucket.s3.amazonaws.com'}"
    origin_id   = "S3-${tfId}"
  }

  enabled             = ${props.enabled ?? true}
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${tfId}"

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}`;

    default:
      return `# No definition for resource type: ${node.type}`;
  }
}

// Full Terraform output generator
export function generateFullTerraform(nodes: CloudNode[], connections: Connection[], region: string = 'ap-southeast-1'): string {
  let output = `provider "aws" {
  region = "${region}"
}

`;

  // Write out each node's resource block
  nodes.forEach((node) => {
    output += generateNodeHCL(node) + '\n\n';
  });

  // Write load balancer target attachments if connections exist
  const instances = nodes.filter((n) => n.type === 'compute');
  const targetGroups = nodes.filter((n) => n.type === 'tg' && !n.name.toLowerCase().includes('elb'));

  // Connect target groups to instances based on canvas connections
  connections.forEach((conn) => {
    const fromNode = nodes.find((n) => n.id === conn.from);
    const toNode = nodes.find((n) => n.id === conn.to);

    if (fromNode && toNode) {
      // If connecting a target group to an instance
      if (fromNode.type === 'tg' && !fromNode.name.toLowerCase().includes('elb') && toNode.type === 'compute') {
        const tgId = sanitizeTerraformName(fromNode.name);
        const instId = sanitizeTerraformName(toNode.name);
        output += `resource "aws_lb_target_group_attachment" "attach_${tgId}_to_${instId}" {
  target_group_arn = aws_lb_target_group.${tgId}.arn
  target_id        = aws_instance.${instId}.id
  port             = 80
}

`;
      }
    }
  });

  return output.trim();
}
