export type ServiceType =
  | 'compute'
  | 'lambda'
  | 's3'
  | 'ebs'
  | 'rds'
  | 'dynamodb'
  | 'vpc'
  | 'cloudfront'
  | 'elb';

export interface NodePricing {
  price: number;
  unit: string;
  display: string;
  status: 'loading' | 'ok' | 'error';
  errorMessage?: string;
}

export interface CloudNode {
  id: string;
  type: ServiceType;
  name: string;
  x: number;
  y: number;
  properties: Record<string, any>;
  status?: 'active' | 'inactive' | 'error';
  pricing?: NodePricing;
}

export interface Connection {
  id: string;
  from: string; // CloudNode id
  to: string; // CloudNode id
  fromPort?: 'top' | 'bottom';
  toPort?: 'top' | 'bottom';
}

export interface ServiceDefinition {
  type: ServiceType;
  label: string;
  category: 'Compute' | 'Storage' | 'Database' | 'Networking';
  icon: string; // Material Symbols icon name
  color: string; // Text color class
  defaultProperties: Record<string, any>;
}

export const SERVICE_DEFINITIONS: Record<ServiceType, ServiceDefinition> = {
  compute: {
    type: 'compute',
    label: 'Compute',
    category: 'Compute',
    icon: 'memory',
    color: 'text-primary',
    defaultProperties: {
      ami: 'ami-0c55b159cbfafe1f0',
      instance_type: 't3.large',
      name: 'Web Server',
    },
  },
  lambda: {
    type: 'lambda',
    label: 'Lambda',
    category: 'Compute',
    icon: 'bolt',
    color: 'text-amber-500',
    defaultProperties: {
      runtime: 'nodejs18.x',
      memory_size: 512,
      handler: 'index.handler',
    },
  },
  s3: {
    type: 's3',
    label: 'S3 Bucket',
    category: 'Storage',
    icon: 'storage',
    color: 'text-green-600',
    defaultProperties: {
      bucket_name: 'my-app-assets-bucket',
      acl: 'private',
      versioning: true,
      storage_type: 'standard',
      usage_type: '50TBM',
    },
  },
  ebs: {
    type: 'ebs',
    label: 'EBS Volume',
    category: 'Storage',
    icon: 'folder',
    color: 'text-amber-700',
    defaultProperties: {
      size: 50,
      volume_type: 'gp3',
    },
  },
  rds: {
    type: 'rds',
    label: 'RDS',
    category: 'Database',
    icon: 'database',
    color: 'text-sky-600',
    defaultProperties: {
      allocated_storage: 20,
      engine: 'mysql',
      instance_type: 'db.t3.micro',
      deployment_type: 'single',
      name: 'maindb',
      username: 'admin',
    },
  },
  dynamodb: {
    type: 'dynamodb',
    label: 'DynamoDB',
    category: 'Database',
    icon: 'bolt',
    color: 'text-blue-500',
    defaultProperties: {
      billing_mode: 'PAY_PER_REQUEST',
      hash_key: 'id',
    },
  },
  vpc: {
    type: 'vpc',
    label: 'VPC',
    category: 'Networking',
    icon: 'router',
    color: 'text-teal-600',
    defaultProperties: {
      cidr_block: '10.0.0.0/16',
      enable_dns_hostnames: true,
    },
  },
  cloudfront: {
    type: 'cloudfront',
    label: 'CloudFront',
    category: 'Networking',
    icon: 'public',
    color: 'text-indigo-600',
    defaultProperties: {
      origin_domain_name: 'mybucket.s3.amazonaws.com',
      enabled: true,
    },
  },
  elb: {
    type: 'elb',
    label: 'Load balancer',
    category: 'Networking',
    icon: 'hub',
    color: 'text-slate-600',
    defaultProperties: {
      port: 80,
      protocol: 'HTTP',
      target_type: 'instance',
    },
  },
};
