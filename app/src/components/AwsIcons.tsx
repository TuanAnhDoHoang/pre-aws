import React from 'react';

interface AwsIconProps {
  type: string;
  className?: string;
}

export default function AwsIcon({ type, className = "w-10 h-10" }: AwsIconProps) {
  switch (type) {
    case 'compute': // EC2 Instance
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Orange */}
          <rect width="100" height="100" rx="12" fill="#FF9900" />
          {/* Outer Ring / Network Border */}
          <rect x="18" y="18" width="64" height="64" rx="6" stroke="white" strokeWidth="4.5" fill="none" strokeDasharray="14 5" />
          {/* Inner compute core */}
          <rect x="33" y="33" width="34" height="34" rx="4" fill="white" />
          {/* Chip lines */}
          <rect x="42" y="42" width="16" height="4" rx="1" fill="#FF9900" />
          <rect x="42" y="49" width="16" height="4" rx="1" fill="#FF9900" />
          <rect x="42" y="56" width="16" height="4" rx="1" fill="#FF9900" />
        </svg>
      );

    case 'lambda': // Serverless Compute
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Orange */}
          <rect width="100" height="100" rx="12" fill="#FF9900" />
          {/* Greek Lambda Symbol */}
          <path
            d="M32 72 L47 50 L36 30 H49 L55 45 L69 25 H81 L59 53 L74 72 H61 L50 56 L39 72 H32 Z"
            fill="white"
          />
        </svg>
      );

    case 's3': // Simple Storage Service Bucket
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Green */}
          <rect width="100" height="100" rx="12" fill="#3F8624" />
          {/* Bucket Outline */}
          <path
            d="M25 32 H75 L70 76 C70 80 60 83 50 83 C40 83 30 80 30 76 Z"
            stroke="white"
            strokeWidth="5"
            fill="none"
          />
          {/* Bucket lid top rim */}
          <ellipse cx="50" cy="32" rx="25" ry="7.5" fill="white" />
          {/* Lid interior accent */}
          <ellipse cx="50" cy="32" rx="18" ry="4.5" fill="#3F8624" />
          {/* S3 data blocks */}
          <rect x="38" y="46" width="6" height="16" rx="1" fill="white" />
          <rect x="47" y="46" width="6" height="16" rx="1" fill="white" />
          <rect x="56" y="46" width="6" height="16" rx="1" fill="white" />
        </svg>
      );

    case 'ebs': // Elastic Block Store
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Green-Gold (AWS Storage secondary) */}
          <rect width="100" height="100" rx="12" fill="#3F8624" />
          {/* Stacked volumetric volumes */}
          <g transform="translate(0, -1)">
            {/* Top segment */}
            <path d="M22 36 C22 31, 78 31, 78 36 V48 C78 53, 22 53, 22 48 Z" fill="white" stroke="#3F8624" strokeWidth="2" />
            <ellipse cx="50" cy="36" rx="28" ry="5.5" fill="#A1D085" />
            {/* Bottom segment */}
            <path d="M22 54 C22 49, 78 49, 78 54 V66 C78 71, 22 71, 22 66 Z" fill="white" stroke="#3F8624" strokeWidth="2" />
            <ellipse cx="50" cy="54" rx="28" ry="5.5" fill="#A1D085" />
          </g>
        </svg>
      );

    case 'rds': // Relational Database Service
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Blue */}
          <rect width="100" height="100" rx="12" fill="#3B73B9" />
          {/* Database Stack */}
          <g transform="translate(0, -2)">
            {/* Base cylinder */}
            <path d="M30 36 V68 C30 75, 70 75, 70 68 V36 Z" fill="none" stroke="white" strokeWidth="5.5" />
            {/* Stack partitions */}
            <ellipse cx="50" cy="36" rx="20" ry="6.5" fill="white" />
            <path d="M30 48 C30 53, 70 53, 70 48" stroke="white" strokeWidth="4.5" />
            <path d="M30 60 C30 65, 70 65, 70 60" stroke="white" strokeWidth="4.5" />
          </g>
          {/* Connection dots on DB */}
          <circle cx="50" cy="48" r="3.5" fill="#3B73B9" />
          <circle cx="50" cy="60" r="3.5" fill="#3B73B9" />
        </svg>
      );

    case 'dynamodb': // DynamoDB Purple NoSQL
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Purple */}
          <rect width="100" height="100" rx="12" fill="#2E27B1" />
          {/* Three horizontal slice blocks representing high availability / key value */}
          <rect x="22" y="24" width="56" height="12" rx="2.5" fill="white" />
          <rect x="22" y="44" width="56" height="12" rx="2.5" fill="white" />
          <rect x="22" y="64" width="56" height="12" rx="2.5" fill="white" />
          {/* Dynamic Bolt/Arrow indicating rapid lookup speed */}
          <path
            d="M50 14 L36 49 H52 L42 86 L64 43 H48 L58 14 Z"
            fill="#FF9900"
            stroke="#2E27B1"
            strokeWidth="2.5"
          />
        </svg>
      );

    case 'vpc': // Virtual Private Cloud
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Green (AWS VPC / Networking theme) */}
          <rect width="100" height="100" rx="12" fill="#7AA116" />
          {/* Cloud border outline */}
          <path
            d="M32 66 C21 66, 18 51, 29 46 C26 31, 46 24, 56 34 C66 24, 82 31, 80 46 C87 51, 85 66, 71 66 Z"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Nested shield subnet */}
          <path
            d="M50 43 L66 48 V58 C66 67, 50 72, 50 72 C50 72, 34 67, 34 58 V48 Z"
            fill="white"
          />
          {/* Lock outline within shield */}
          <path
            d="M45 52 H55 V59 H45 Z"
            fill="#7AA116"
          />
          <path
            d="M47 52 V49.5 C47 48, 53 48, 53 49.5 V52"
            stroke="#7AA116"
            strokeWidth="1.8"
            fill="none"
          />
        </svg>
      );

    case 'cloudfront': // CDN Edge Network
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Fuchsia/Reddish-Pink */}
          <rect width="100" height="100" rx="12" fill="#C85179" />
          {/* Core globe cache circle */}
          <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="4.5" fill="none" />
          <ellipse cx="50" cy="50" rx="20" ry="7.5" stroke="white" strokeWidth="2.5" fill="none" />
          <ellipse cx="50" cy="50" rx="7.5" ry="20" stroke="white" strokeWidth="2.5" fill="none" />
          {/* Distribution Edge directions */}
          <line x1="50" y1="11" x2="50" y2="22" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="78" x2="50" y2="89" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="11" y1="50" x2="22" y2="50" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="50" x2="89" y2="50" stroke="white" strokeWidth="4" strokeLinecap="round" />
          {/* Edge caches (satellites) */}
          <circle cx="50" cy="11" r="5" fill="white" />
          <circle cx="50" cy="89" r="5" fill="white" />
          <circle cx="11" cy="50" r="5" fill="white" />
          <circle cx="89" cy="50" r="5" fill="white" />
        </svg>
      );

    case 'elb': // ELB Target Group
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Blue-Slate */}
          <rect width="100" height="100" rx="12" fill="#6B8194" />
          {/* Load balancer central node */}
          <circle cx="30" cy="50" r="10" stroke="white" strokeWidth="5" fill="none" />
          {/* Core server icon inside load balancer */}
          <circle cx="30" cy="50" r="4" fill="white" />
          {/* Connection wires branching to multiple targets */}
          <path
            d="M40 50 H55"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M55 33 V67"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M55 33 H66"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M55 67 H66"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Standard Target Nodes */}
          <rect x="66" y="25" width="16" height="16" rx="3.5" fill="white" />
          <rect x="66" y="59" width="16" height="16" rx="3.5" fill="white" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="12" fill="#E4E3E0" stroke="#141414" strokeWidth="3" />
          <circle cx="50" cy="50" r="18" fill="#F27D26" />
        </svg>
      );
  }
}
