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
  't3.large': { hourly: 0.107, unit: 'giờ' },
  't3.micro': { hourly: 0.013, unit: 'giờ' },
  't2.micro': { hourly: 0.011, unit: 'giờ' },
  'm5.large': { hourly: 0.096, unit: 'giờ' },
  'db.t3.micro': { hourly: 0.017, unit: 'giờ' },
  'db.t3.large': { hourly: 0.136, unit: 'giờ' },
  'lambda': { hourly: 0.002, unit: 'triệu requests' }, // Lambda cost simplified
  's3': { hourly: 0.023, unit: 'GB/tháng' },
  'ebs_gp3': { hourly: 0.00011, unit: 'GB/giờ' }, // approx $0.08 / GB month
  'elb': { hourly: 0.025, unit: 'giờ' },
  'cloudfront': { hourly: 0.012, unit: 'GB' },
  'dynamodb': { hourly: 0.00025, unit: 'triệu ghi/đọc' },
  'vpc': { hourly: 0.0, unit: 'miễn phí' },
};

// Calculate cost for a single node
export function calculateNodeCost(node: CloudNode): { hourly: number; display: string } {
  const type = node.type;
  const props = node.properties;

  if (type === 'compute') {
    const instType = props.instance_type || 't3.large';
    const rate = PRICE_CATALOG[instType] || PRICE_CATALOG['t3.large'];
    return { hourly: rate.hourly, display: `$${rate.hourly.toFixed(3)}/giờ` };
  }
  if (type === 'rds') {
    const instClass = props.instance_class || 'db.t3.micro';
    const rate = PRICE_CATALOG[instClass] || PRICE_CATALOG['db.t3.micro'];
    // Database storage cost added simplified
    const storageGB = props.allocated_storage || 20;
    const storageCostPerHour = (storageGB * 0.115) / 720; // $0.115/GB/month
    const totalHourly = rate.hourly + storageCostPerHour;
    return { hourly: totalHourly, display: `$${totalHourly.toFixed(3)}/giờ` };
  }
  if (type === 'tg') {
    // ELB or Target Group
    const rate = PRICE_CATALOG['elb'];
    return { hourly: rate.hourly, display: `$${rate.hourly.toFixed(3)}/giờ` };
  }
  if (type === 's3') {
    return { hourly: 0.005, display: `$0.023/GB/tháng` }; // Average flat-rate proxy hourly
  }
  if (type === 'ebs') {
    const size = props.size || 50;
    const hourlyCost = size * PRICE_CATALOG['ebs_gp3'].hourly;
    return { hourly: hourlyCost, display: `$${hourlyCost.toFixed(4)}/giờ` };
  }
  if (type === 'cloudfront') {
    return { hourly: 0.008, display: `$0.08/GB` };
  }
  if (type === 'dynamodb') {
    return { hourly: 0.004, display: `$0.25/triệu write` };
  }
  if (type === 'lambda') {
    return { hourly: 0.002, display: `$0.20/triệu requests` };
  }

  return { hourly: 0.0, display: 'Miễn phí' };
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
