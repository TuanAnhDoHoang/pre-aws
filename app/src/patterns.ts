import { CloudNode, Connection } from './types';

export interface DesignPattern {
  id: string;
  name: string;
  description: string;
  nodes: CloudNode[];
  connections: Connection[];
  isCustom?: boolean;
}

export const PRESET_PATTERNS: DesignPattern[] = [
  {
    id: 'pattern-blue-green',
    name: 'Blue/Green Deployment',
    description: 'Mô hình High-Availability sử dụng ALB định tuyến lưu lượng thông minh qua 2 nhóm Target Group độc lập (Blue/Green) giúp triển khai cập nhật ứng dụng không gây gián đoạn (zero-downtime).',
    nodes: [
      {
        id: 'bg-alb',
        type: 'tg',
        name: 'Application Load Balancer',
        x: 400,
        y: 80,
        properties: {
          name: 'app-alb',
          port: 80,
          protocol: 'HTTP',
          target_type: 'instance',
        },
        status: 'active',
      },
      {
        id: 'bg-tg-blue',
        type: 'tg',
        name: 'TG-Alpha (Blue Group)',
        x: 280,
        y: 190,
        properties: {
          name: 'tg-blue',
          port: 80,
          protocol: 'HTTP',
          target_type: 'instance',
        },
        status: 'active',
      },
      {
        id: 'bg-tg-green',
        type: 'tg',
        name: 'TG-Beta (Green Group)',
        x: 520,
        y: 190,
        properties: {
          name: 'tg-green',
          port: 80,
          protocol: 'HTTP',
          target_type: 'instance',
        },
        status: 'active',
      },
      {
        id: 'bg-ec2-blue',
        type: 'compute',
        name: 'Web Server Alpha (Blue)',
        x: 220,
        y: 300,
        properties: {
          ami: 'ami-0c55b159cbfafe1f0',
          instance_type: 't3.large',
          name: 'Web-Server-Blue',
        },
        status: 'active',
      },
      {
        id: 'bg-ec2-green',
        type: 'compute',
        name: 'Web Server Beta (Green)',
        x: 580,
        y: 300,
        properties: {
          ami: 'ami-0c55b159cbfafe1f0',
          instance_type: 't3.large',
          name: 'Web-Server-Green',
        },
        status: 'active',
      },
      {
        id: 'bg-db',
        type: 'rds',
        name: 'Main Database (RDS)',
        x: 400,
        y: 440,
        properties: {
          allocated_storage: 40,
          engine: 'postgres',
          instance_class: 'db.t3.large',
          deployment_type: 'multi-az',
          name: 'app-db',
          username: 'postgres',
        },
        status: 'active',
      },
    ],
    connections: [
      { id: 'bg-conn-alb-blue', from: 'bg-alb', to: 'bg-tg-blue' },
      { id: 'bg-conn-alb-green', from: 'bg-alb', to: 'bg-tg-green' },
      { id: 'bg-conn-tg-blue-ec2', from: 'bg-tg-blue', to: 'bg-ec2-blue' },
      { id: 'bg-conn-tg-green-ec2', from: 'bg-tg-green', to: 'bg-ec2-green' },
      { id: 'bg-conn-ec2-blue-db', from: 'bg-ec2-blue', to: 'bg-db' },
      { id: 'bg-conn-ec2-green-db', from: 'bg-ec2-green', to: 'bg-db' },
    ],
  },
  {
    id: 'pattern-serverless',
    name: 'Serverless Architecture',
    description: 'Kiến trúc đám mây phi máy chủ hiệu năng cực cao. Phân phối Frontend tĩnh từ S3 qua CloudFront CDN, gọi API xử lý qua AWS Lambda tích hợp cơ sở dữ liệu NoSQL DynamoDB mở rộng tự động.',
    nodes: [
      {
        id: 'sl-cf',
        type: 'cloudfront',
        name: 'CloudFront CDN',
        x: 400,
        y: 80,
        properties: {
          origin_domain_name: 'static-web-bucket.s3.amazonaws.com',
          enabled: true,
        },
        status: 'active',
      },
      {
        id: 'sl-s3',
        type: 's3',
        name: 'S3 Website Bucket',
        x: 250,
        y: 200,
        properties: {
          bucket_name: 'static-web-assets-prod',
          acl: 'private',
          versioning: true,
        },
        status: 'active',
      },
      {
        id: 'sl-lambda-api',
        type: 'lambda',
        name: 'API Lambda Function',
        x: 550,
        y: 200,
        properties: {
          runtime: 'nodejs18.x',
          memory_size: 1024,
          handler: 'api.handler',
        },
        status: 'active',
      },
      {
        id: 'sl-ddb',
        type: 'dynamodb',
        name: 'DynamoDB Table',
        x: 550,
        y: 340,
        properties: {
          billing_mode: 'PAY_PER_REQUEST',
          hash_key: 'id',
        },
        status: 'active',
      },
    ],
    connections: [
      { id: 'sl-conn-cf-s3', from: 'sl-cf', to: 'sl-s3' },
      { id: 'sl-conn-cf-lambda', from: 'sl-cf', to: 'sl-lambda-api' },
      { id: 'sl-conn-lambda-ddb', from: 'sl-lambda-api', to: 'sl-ddb' },
    ],
  },
  {
    id: 'pattern-static-website',
    name: 'Host Static Website',
    description: 'Giải pháp lưu trữ trang web tĩnh bảo mật và tiết kiệm chi phí tối đa. Sử dụng Amazon S3 lưu trữ các tệp HTML, CSS, JS tĩnh và phân phối thông qua CloudFront CDN toàn cầu.',
    nodes: [
      {
        id: 'sw-cf',
        type: 'cloudfront',
        name: 'CloudFront Distribution',
        x: 400,
        y: 100,
        properties: {
          origin_domain_name: 'website-hosting-bucket.s3.amazonaws.com',
          enabled: true,
        },
        status: 'active',
      },
      {
        id: 'sw-s3',
        type: 's3',
        name: 'S3 Website Bucket',
        x: 400,
        y: 260,
        properties: {
          bucket_name: 'website-hosting-bucket',
          acl: 'private',
          versioning: true,
        },
        status: 'active',
      },
    ],
    connections: [
      { id: 'sw-conn-cf-s3', from: 'sw-cf', to: 'sw-s3' },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'cloud_architecture_custom_patterns';

export function getCustomPatterns(): DesignPattern[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading custom patterns from localStorage', e);
    return [];
  }
}

export function saveCustomPattern(name: string, description: string, nodes: CloudNode[], connections: Connection[]): DesignPattern {
  const newPattern: DesignPattern = {
    id: `pattern-custom-${Date.now()}`,
    name,
    description: description || 'Mẫu thiết kế được lưu bởi người dùng.',
    nodes: JSON.parse(JSON.stringify(nodes)), // deep copy
    connections: JSON.parse(JSON.stringify(connections)),
    isCustom: true,
  };

  const currentCustoms = getCustomPatterns();
  const updatedCustoms = [...currentCustoms, newPattern];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCustoms));

  return newPattern;
}

export function deleteCustomPattern(id: string): void {
  const currentCustoms = getCustomPatterns();
  const updatedCustoms = currentCustoms.filter(p => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCustoms));
}
