import React, { useState, useEffect } from 'react';
import { CloudNode, ServiceType, SERVICE_DEFINITIONS } from '../types';
import { generateFullTerraform, fetchServicePrice, ServicePricePayload, ServicePriceResult } from '../utils';
import AwsIcon from './AwsIcons';

interface PropertyPanelProps {
  selectedNode: CloudNode | null;
  nodes: CloudNode[];
  connections: any[];
  onUpdateNodeProperties: (nodeId: string, updatedProps: Record<string, any>) => void;
  onUpdateNodeName: (nodeId: string, name: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteConnection: (connId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  width: number;
  onWidthChange: (width: number) => void;
  setCollapsed: (collapsed: boolean) => void;
  onCloseEdit?: () => void;
  selectedServiceType: ServiceType | null;
  onAddNode: (type: ServiceType) => void;
  onClearSelectedServiceType: () => void;
  region: string;
  isReadOnly?: boolean;
}

const SERVICE_DESCRIPTIONS: Record<ServiceType, { desc: string; detail: string; useCases: string[] }> = {
  compute: {
    desc: 'Máy chủ ảo điện toán đám mây (Amazon EC2).',
    detail: 'Cung cấp năng lượng xử lý có thể mở rộng an toàn và có kích thước tùy chỉnh trong đám mây.',
    useCases: ['Chạy ứng dụng web, API', 'Xử lý dữ liệu nền', 'Ứng dụng microservices'],
  },
  lambda: {
    desc: 'Dịch vụ điện toán không máy chủ (Serverless Lambda).',
    detail: 'Chạy mã code mà không cần cung cấp hoặc quản lý máy chủ. Chỉ trả tiền cho thời gian tính toán thực tế.',
    useCases: ['Xử lý tệp tin tự động', 'Hậu phương API không máy chủ', 'Hẹn giờ chạy tác vụ định kỳ'],
  },
  s3: {
    desc: 'Dịch vụ lưu trữ đối tượng đơn giản (Amazon S3 Bucket).',
    detail: 'Khả năng lưu trữ đối tượng hàng đầu về bảo mật, hiệu suất và khả năng mở rộng quy mô cực kỳ lớn.',
    useCases: ['Lưu trữ ảnh, video, tệp tĩnh', 'Sao lưu dữ liệu dự phòng', 'Lưu trữ tệp cấu hình ứng dụng'],
  },
  ebs: {
    desc: 'Ổ đĩa lưu trữ khối hiệu năng cao (Amazon EBS).',
    detail: 'Khối lưu trữ hiệu năng cao, bền bỉ được thiết kế để sử dụng với Amazon EC2.',
    useCases: ['Lưu trữ hệ điều hành cho máy chủ', 'Hệ thống tệp tin cho cơ sở dữ liệu', 'Bộ nhớ đệm tốc độ cao'],
  },
  rds: {
    desc: 'Dịch vụ cơ sở dữ liệu quan hệ được quản lý (Amazon RDS).',
    detail: 'Dễ dàng thiết lập, vận hành và mở rộng quy mô cơ sở dữ liệu quan hệ trong đám mây.',
    useCases: ['Cơ sở dữ liệu giao dịch MySQL/PostgreSQL', 'Lưu trữ dữ liệu khách hàng', 'Ứng dụng cần tính toàn vẹn cao'],
  },
  dynamodb: {
    desc: 'Cơ sở dữ liệu NoSQL nhanh, linh hoạt và được quản lý hoàn toàn.',
    detail: 'Cơ sở dữ liệu phi quan hệ, cung cấp hiệu suất ở mọi quy mô với độ trễ dưới 10 mili-giây.',
    useCases: ['Lưu trữ phiên đăng nhập (session)', 'Bảng xếp hạng game trực tuyến', 'Dữ liệu ứng dụng di động động'],
  },
  vpc: {
    desc: 'Mạng riêng ảo cô lập trên đám mây (Amazon VPC).',
    detail: 'Cung cấp một phân vùng cô lập một cách logic để bạn có thể khởi chạy các tài nguyên AWS trong một mạng ảo.',
    useCases: ['Cô lập mạng cho các máy chủ', 'Cấu hình mạng con public và private', 'Kết nối VPN với mạng doanh nghiệp'],
  },
  cloudfront: {
    desc: 'Mạng phân phối nội dung toàn cầu (Amazon CloudFront).',
    detail: 'Dịch vụ phân phối nội dung nhanh chóng, bảo mật cao để phân phối tệp, video và ứng dụng đến người dùng cuối.',
    useCases: ['Tăng tốc tải trang web tĩnh', 'Phân phối nội dung đa phương tiện', 'Bộ nhớ đệm ở vùng biên toàn cầu'],
  },
  tg: {
    desc: 'Nhóm mục tiêu định tuyến lưu lượng (Target Group).',
    detail: 'Sử dụng để định tuyến yêu cầu từ bộ cân bằng tải Application Load Balancer tới các mục tiêu đã đăng ký.',
    useCases: ['Cân bằng tải cho nhóm EC2', 'Kiểm tra sức khỏe (Health Check) thiết bị', 'Định tuyến lưu lượng theo đường dẫn'],
  },
};

export default function PropertyPanel({
  selectedNode,
  nodes,
  connections,
  onUpdateNodeProperties,
  onUpdateNodeName,
  onDeleteNode,
  onDeleteConnection,
  collapsed,
  onToggleCollapse,
  width,
  onWidthChange,
  setCollapsed,
  onCloseEdit,
  selectedServiceType,
  onAddNode,
  onClearSelectedServiceType,
  region,
  isReadOnly = false,
}: PropertyPanelProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [keepEdit, setKeepEdit] = useState<CloudNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedWidth, setSavedWidth] = useState(320);
  const [activeTab, setActiveTab] = useState<'info' | 'terraform'>('info');

  // Price fetching state
  const [fetchedPrice, setFetchedPrice] = useState<ServicePriceResult | null>(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedNode) {
      setFetchedPrice(null);
      return;
    }
    setIsFetchingPrice(true);
    const payload: ServicePricePayload = {
      serviceType: selectedNode.type,
      region,
      name: selectedNode.name,
      properties: selectedNode.properties || {},
    };

    fetchServicePrice(payload)
      .then((res) => {
        setFetchedPrice(res);
        setIsFetchingPrice(false);
      })
      .catch(() => {
        setIsFetchingPrice(false);
      });
  }, [selectedNode?.id, selectedNode?.name, JSON.stringify(selectedNode?.properties), region]);

  useEffect(() => {
    if (selectedNode || selectedServiceType) {
      setActiveTab('info');
    }
  }, [selectedNode, selectedServiceType]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = startWidth - deltaX;

      if (newWidth < 40) {
        newWidth = 0;
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }

      if (newWidth > 1200) {
        newWidth = 1200;
      }
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      onWidthChange(savedWidth);
      setIsExpanded(false);
    } else {
      setSavedWidth(width);
      onWidthChange(750);
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    if (selectedNode != null) setKeepEdit(selectedNode);
  }, [selectedNode]);

  const activeEditNode = keepEdit ? (nodes.find(n => n.id === keepEdit.id) || null) : null;

  const handleCloseEdit = () => {
    setKeepEdit(null);
    if (onCloseEdit) {
      onCloseEdit();
    }
  };

  const fullHCL = generateFullTerraform(nodes, connections, region);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullHCL);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([fullHCL], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'main.tf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Custom regex based HCL Highlighter
  const highlightHCL = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      let highlighted = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // 1. Highlight resource blocks: resource "type" "name" {
      highlighted = highlighted.replace(
        /^(resource)\s+"([^"]+)"\s+"([^"]+)"\s*({?)/g,
        '<span class="text-[#F27D26] font-bold">$1</span> <span class="text-[#FFA726]">"$2"</span> <span class="text-[#FFCC80]">"$3"</span> $4'
      );

      // 2. Highlight provider blocks: provider "name" {
      highlighted = highlighted.replace(
        /^(provider)\s+"([^"]+)"\s*({?)/g,
        '<span class="text-[#F27D26] font-bold">$1</span> <span class="text-[#FFA726]">"$2"</span> $3'
      );

      // 3. Highlight tags block opening or tags = {
      highlighted = highlighted.replace(
        /tags\s*=\s*{/g,
        '<span class="text-[#E0E0E0]">tags</span> <span class="text-white">=</span> <span class="text-white">{</span>'
      );

      // 4. Highlight property assignments: key = value
      highlighted = highlighted.replace(
        /^(\s*)([a-zA-Z0-9_]+)\s*(=)\s*(.*)$/g,
        (match, indent, key, eq, val) => {
          let highlightedVal = val;
          // Clean value formatting
          if (val.startsWith('"') && val.endsWith('"')) {
            highlightedVal = `<span class="text-[#81D4FA]">${val}</span>`;
          } else if (val === 'true' || val === 'false') {
            highlightedVal = `<span class="text-[#FFCC80] font-semibold">${val}</span>`;
          } else if (!isNaN(Number(val))) {
            highlightedVal = `<span class="text-[#FFE0B2]">${val}</span>`;
          } else if (val.startsWith('[') || val.startsWith('{')) {
            highlightedVal = `<span class="text-white">${val}</span>`;
          }
          return `${indent}<span class="text-[#E0E0E0]">${key}</span> <span class="text-white">${eq}</span> ${highlightedVal}`;
        }
      );

      return (
        <div
          key={idx}
          className="min-h-[18px] font-mono text-[11px] leading-relaxed select-text"
          dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
        />
      );
    });
  };

  const renderServiceTemplateInfo = () => {
    if (!selectedServiceType) return null;
    const def = SERVICE_DEFINITIONS[selectedServiceType];
    const info = SERVICE_DESCRIPTIONS[selectedServiceType];

    return (
      <div className="p-4 border-b border-[#141414] bg-[#E4E3E0] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AwsIcon type={selectedServiceType} className="w-5 h-5 select-none pointer-events-none" />
            <span className="text-xs font-black uppercase tracking-wider text-on-surface">
              Chi tiết dịch vụ AWS
            </span>
          </div>
          <button
            onClick={onClearSelectedServiceType}
            className="flex items-center justify-center bg-white text-[#141414] border border-[#141414] hover:bg-red-500 hover:text-white transition-colors cursor-pointer w-7 h-7 animate-none shadow-none hover:shadow-none"
            title="Đóng bảng chi tiết"
          >
            <span className="material-symbols-outlined text-sm font-black">close</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-[#141414] p-3.5 space-y-3 shadow-none">
          <div>
            <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight font-sans">
              {def.label}
            </h3>
            <p className="text-[10px] font-mono text-[#F27D26] font-semibold">
              aws_{selectedServiceType === 'tg' ? 'lb_target_group' : selectedServiceType === 'compute' ? 'instance' : selectedServiceType === 'rds' ? 'db_instance' : selectedServiceType}
            </p>
          </div>

          <div className="text-xs text-on-surface space-y-1.5 leading-relaxed select-text">
            <p className="font-bold text-neutral-800">{info.desc}</p>
            <p className="text-neutral-600 text-[11px] font-serif italic">{info.detail}</p>
          </div>

          {/* Use Cases */}
          <div className="pt-2.5 border-t border-dashed border-neutral-300">
            <h4 className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">
              Trường hợp sử dụng điển hình:
            </h4>
            <ul className="space-y-1">
              {info.useCases.map((useCase, idx) => (
                <li key={idx} className="text-[10px] text-neutral-700 flex items-start gap-1.5 leading-tight">
                  <span className="text-[#F27D26] font-bold shrink-0">•</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Initial Default properties */}
          <div className="pt-2.5 border-t border-dashed border-neutral-300">
            <h4 className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">
              Cấu hình ban đầu mặc định:
            </h4>
            <div className="bg-neutral-50 p-2 border border-neutral-200 font-mono text-[10px] text-neutral-600 space-y-0.5 max-h-[85px] overflow-y-auto">
              {Object.entries(def.defaultProperties).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-bold text-neutral-700">{key}:</span>
                  <span className="text-neutral-900">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Button */}
        {!isReadOnly ? (
          <button
            onClick={() => {
              onAddNode(selectedServiceType);
            }}
            className="w-full py-2.5 bg-[#F27D26] hover:bg-[#D66311] text-white border border-[#141414] font-bold text-xs active:scale-98 transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            title="Bấm để thêm thiết bị này vào sơ đồ"
          >
            <span className="material-symbols-outlined text-sm font-black">add_box</span>
            Thêm vào sơ đồ (+)
          </button>
        ) : (
          <div className="text-[10px] text-[#F27D26] font-extrabold uppercase tracking-widest bg-[#F27D26]/10 border border-[#F27D26] p-2.5 text-center leading-normal">
            Đang ở chế độ xem mẫu (Chỉ đọc)
          </div>
        )}
      </div>
    );
  };

  const renderPropertiesForm = () => {
    const activeNode = keepEdit ? (nodes.find(n => n.id === keepEdit.id) || null) : null;
    if (!activeNode) return null;

    const selectedNode = activeNode;

    const def = SERVICE_DEFINITIONS[selectedNode.type];
    const props = selectedNode.properties;

    return (
      <div className="p-4 border-b border-[#141414] bg-[#E4E3E0]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AwsIcon type={selectedNode.type} className="w-5 h-5 select-none pointer-events-none" />
            <span className="text-xs font-black uppercase tracking-wider text-on-surface">
              Cấu hình {def.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <button
                onClick={() => onDeleteNode(selectedNode.id)}
                className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 border border-red-400 px-2 py-0.5 rounded-none hover:bg-red-200 transition-colors uppercase font-bold cursor-pointer h-7"
                title="Xóa thành phần khỏi Canvas"
              >
                <span className="material-symbols-outlined text-xs">delete</span>
                Xóa
              </button>
            )}
            <button
              onClick={handleCloseEdit}
              className="flex items-center justify-center bg-white text-[#141414] border border-[#141414] hover:bg-red-500 hover:text-white transition-colors cursor-pointer w-7 h-7"
              title="Đóng bảng chỉnh sửa"
            >
              <span className="material-symbols-outlined text-sm font-black">close</span>
            </button>
          </div>
        </div>

        <fieldset disabled={isReadOnly} className="space-y-3 border-0 p-0 m-0">
          {/* Node Display Name */}
          <div>
            <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
              Tên thành phần
            </label>
            <input
              type="text"
              value={selectedNode.name}
              onChange={(e) => onUpdateNodeName(selectedNode.id, e.target.value)}
              className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden focus:border-[#F27D26]"
            />
          </div>

          {/* Price fetched from server (Giả lập fetch price với thông tin + region) */}
          <div className="bg-[#141414] text-white p-3 border border-[#141414] rounded-none mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-[#F27D26] tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">payments</span>
                Giá từ Server (Fetch Price)
              </span>
              {isFetchingPrice ? (
                <span className="text-[10px] text-gray-400 font-mono animate-pulse">Đang lấy giá...</span>
              ) : (
                <span className="text-xs font-black font-mono text-emerald-400">
                  {fetchedPrice?.display || '---'}
                </span>
              )}
            </div>
            <div className="text-[9px] text-gray-300 font-mono mt-1.5 pt-1.5 border-t border-gray-800 flex justify-between items-center">
              <span>Đơn vị: <strong className="text-white">{fetchedPrice?.unit || 'USD/giờ'}</strong></span>
              <span>Region: <strong className="text-[#F27D26]">{region}</strong></span>
            </div>
          </div>
          {/* Compute Specific Fields (EC2: chỉ chọn tên, instance type) */}
          {selectedNode.type === 'compute' && (
            <div>
              <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                Instance Type
              </label>
              <select
                value={props.instance_type || 't3.large'}
                onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, instance_type: e.target.value })}
                className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
              >
                <option value="t4g.nano">t4g.nano</option>
                <option value="t4g.micro">t4g.micro</option>
                <option value="t4g.small">t4g.small</option>
                <option value="t4g.medium">t4g.medium</option>
                <option value="t4g.large">t4g.large</option>
                <option value="t4g.xlarge">t4g.xlarge</option>
                <option value="t4g.2xlarge">t4g.2xlarge</option>
                <option value="t3.nano">t3.nano</option>
                <option value="t3.micro">t3.micro</option>
                <option value="t3.small">t3.small</option>
                <option value="t3.medium">t3.medium</option>
                <option value="t3.large">t3.large</option>
                <option value="t3.xlarge">t3.xlarge</option>
                <option value="t3.2xlarge">t3.2xlarge</option>
                <option value="t3a.nano">t3a.nano</option>
                <option value="t3a.micro">t3a.micro</option>
                <option value="t3a.small">t3a.small</option>
                <option value="t3a.medium">t3a.medium</option>
                <option value="t3a.large">t3a.large</option>
                <option value="t3a.xlarge">t3a.xlarge</option>
              </select>
            </div>
          )}


          {/* RDS Database Specific Fields */}
          {selectedNode.type === 'rds' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                    Engine
                  </label>
                  <select
                    value={props.engine || 'postgres'}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, engine: e.target.value })}
                    className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                  >
                    <option value="mysql">MySQL</option>
                    <option value="postgres">PostgreSQL</option>
                  </select>
                </div>
                {/* <div>
                  <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                    Dung lượng (GB)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={props.allocated_storage || 20}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, allocated_storage: parseInt(e.target.value) || 20 })}
                    className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface"
                  />
                </div> */}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                    Instance Type
                  </label>
                  <select
                    value={props.instance_type || 'db.t3.micro'}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, instance_type: e.target.value })}
                    className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                  >
                    <option value="db.t4g.micro">db.t4g.micro</option>
                    <option value="db.t4g.small">db.t4g.small</option>
                    <option value="db.t4g.medium">db.t4g.medium</option>
                    <option value="db.t4g.large">db.t4g.large</option>
                    <option value="db.t4g.xlarge">db.t4g.xlarge</option>
                    <option value="db.t4g.2xlarge">db.t4g.2xlarge</option>
                    <option value="db.t3.micro">db.t3.micro</option>
                    <option value="db.t3.small">db.t3.small</option>
                    <option value="db.t3.medium">db.t3.medium</option>
                    <option value="db.t3.large">db.t3.large</option>
                    <option value="db.t3.xlarge">db.t3.xlarge</option>
                    <option value="db.t3.2xlarge">db.t3.2xlarge</option>
                    <option value="db.m8g.large">db.m8g.large</option>
                    <option value="db.m8g.xlarge">db.m8g.xlarge</option>
                    <option value="db.m8g.2xlarge">db.m8g.2xlarge</option>
                    <option value="db.m8g.4xlarge">db.m8g.4xlarge</option>
                    <option value="db.m8g.8xlarge">db.m8g.8xlarge</option>
                    <option value="db.m8g.12xlarge">db.m8g.12xlarge</option>
                    <option value="db.m8g.16xlarge">db.m8g.16xlarge</option>
                    <option value="db.m8g.24xlarge">db.m8g.24xlarge</option>
                    <option value="db.m8g.48xlarge">db.m8g.48xlarge</option>
                    <option value="db.m7g.large">db.m7g.large</option>
                    <option value="db.m7g.xlarge">db.m7g.xlarge</option>
                    <option value="db.m7g.2xlarge">db.m7g.2xlarge</option>
                    <option value="db.m7g.4xlarge">db.m7g.4xlarge</option>
                    <option value="db.m7g.8xlarge">db.m7g.8xlarge</option>
                    <option value="db.m7g.12xlarge">db.m7g.12xlarge</option>
                    <option value="db.m7g.16xlarge">db.m7g.16xlarge</option>
                    <option value="db.m7i.large">db.m7i.large</option>
                    <option value="db.m7i.xlarge">db.m7i.xlarge</option>
                    <option value="db.m7i.2xlarge">db.m7i.2xlarge</option>
                    <option value="db.m7i.4xlarge">db.m7i.4xlarge</option>
                    <option value="db.m7i.8xlarge">db.m7i.8xlarge</option>
                    <option value="db.m7i.12xlarge">db.m7i.12xlarge</option>
                    <option value="db.m7i.16xlarge">db.m7i.16xlarge</option>
                    <option value="db.m7i.24xlarge">db.m7i.24xlarge</option>
                    <option value="db.m7i.48xlarge">db.m7i.48xlarge</option>
                    <option value="db.m6g.large">db.m6g.large</option>
                    <option value="db.m6g.xlarge">db.m6g.xlarge</option>
                    <option value="db.m6g.2xlarge">db.m6g.2xlarge</option>
                    <option value="db.m6g.4xlarge">db.m6g.4xlarge</option>
                    <option value="db.m6g.8xlarge">db.m6g.8xlarge</option>
                    <option value="db.m6g.12xlarge">db.m6g.12xlarge</option>
                    <option value="db.m6g.16xlarge">db.m6g.16xlarge</option>
                    <option value="db.m6gd.large">db.m6gd.large</option>
                    <option value="db.m6gd.xlarge">db.m6gd.xlarge</option>
                    <option value="db.m6gd.2xlarge">db.m6gd.2xlarge</option>
                    <option value="db.m6gd.4xlarge">db.m6gd.4xlarge</option>
                    <option value="db.m6gd.8xlarge">db.m6gd.8xlarge</option>
                    <option value="db.m6gd.12xlarge">db.m6gd.12xlarge</option>
                    <option value="db.m6gd.16xlarge">db.m6gd.16xlarge</option>
                    <option value="db.m6i.large">db.m6i.large</option>
                    <option value="db.m6i.xlarge">db.m6i.xlarge</option>
                    <option value="db.m6i.2xlarge">db.m6i.2xlarge</option>
                    <option value="db.m6i.4xlarge">db.m6i.4xlarge</option>
                    <option value="db.m6i.8xlarge">db.m6i.8xlarge</option>
                    <option value="db.m6i.12xlarge">db.m6i.12xlarge</option>
                    <option value="db.m6i.16xlarge">db.m6i.16xlarge</option>
                    <option value="db.m6i.24xlarge">db.m6i.24xlarge</option>
                    <option value="db.m6i.32xlarge">db.m6i.32xlarge</option>
                    <option value="db.m5.large">db.m5.large</option>
                    <option value="db.m5.xlarge">db.m5.xlarge</option>
                    <option value="db.m5.2xlarge">db.m5.2xlarge</option>
                    <option value="db.m5.4xlarge">db.m5.4xlarge</option>
                    <option value="db.m5.8xlarge">db.m5.8xlarge</option>
                    <option value="db.m5.12xlarge">db.m5.12xlarge</option>
                    <option value="db.m5.16xlarge">db.m5.16xlarge</option>
                    <option value="db.m5.24xlarge">db.m5.24xlarge</option>
                    <option value="db.m5d.large">db.m5d.large</option>
                    <option value="db.m5d.xlarge">db.m5d.xlarge</option>
                    <option value="db.m5d.2xlarge">db.m5d.2xlarge</option>
                    <option value="db.m5d.4xlarge">db.m5d.4xlarge</option>
                    <option value="db.m5d.8xlarge">db.m5d.8xlarge</option>
                    <option value="db.m5d.12xlarge">db.m5d.12xlarge</option>
                    <option value="db.m5d.16xlarge">db.m5d.16xlarge</option>
                    <option value="db.m5d.24xlarge">db.m5d.24xlarge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                    Deployment Type
                  </label>
                  <select
                    value={props.deployment_type || 'single'}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, deployment_type: e.target.value })}
                    className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                  >
                    <option value="single">Single-AZ</option>
                    <option value="multi-az">Multi-AZ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                    Tên RDS
                  </label>
                  <input
                    type="text"
                    value={props.name || 'maindb'}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, name: e.target.value })}
                    className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.2 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                    Tên Admin
                  </label>
                  <input
                    type="text"
                    value={props.username || 'admin'}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, username: e.target.value })}
                    className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.2 text-xs text-on-surface"
                  />
                </div>
              </div>
            </>
          )}

          {/* S3 Bucket Fields */}
          {selectedNode.type === 's3' && (
            <>
              <div>
                <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                  Tên Bucket S3
                </label>
                <input
                  type="text"
                  value={props.bucket_name || 'my-app-assets-bucket'}
                  onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, bucket_name: e.target.value })}
                  className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                    Storage type
                  </label>
                  <select
                    value={props.storage_type || 'standard'}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, storage_type: e.target.value })}
                    className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                  >
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                    Usage type
                  </label>
                  <select
                    value={props.usage_type || '50TBM'}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, usage_type: e.target.value })}
                    className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                  >
                    <option value="50TBM">50TBM</option>
                    <option value="500TBM">500TBM</option>
                    <option value="1000TBM">1000TBM</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={props.versioning ?? true}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, versioning: e.target.checked })}
                    className="rounded-none border-[#141414] text-primary focus:ring-primary"
                  />
                  Bật Versioning
                </label>
              </div>
            </>
          )}

          {/* EBS Volume Fields */}
          {selectedNode.type === 'ebs' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                  Kích thước (GB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="16000"
                  value={props.size || 50}
                  onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, size: parseInt(e.target.value) || 50 })}
                  className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                  Loại volume
                </label>
                <select
                  value={props.volume_type || 'gp3'}
                  onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, volume_type: e.target.value })}
                  className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                >
                  <option value="gp3">gp3 (SSD)</option>
                  <option value="gp2">gp2 (SSD)</option>
                  <option value="io2">io2 (SSD Provisioned)</option>
                </select>
              </div>
            </div>
          )}

          {/* VPC Fields */}
          {selectedNode.type === 'vpc' && (
            <>
              <div>
                <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                  IPv4 CIDR Block
                </label>
                <input
                  type="text"
                  value={props.cidr_block || '10.0.0.0/16'}
                  onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, cidr_block: e.target.value })}
                  className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface font-mono"
                />
              </div>
              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={props.enable_dns_hostnames ?? true}
                    onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, enable_dns_hostnames: e.target.checked })}
                    className="rounded-none border-[#141414] text-primary focus:ring-primary"
                  />
                  Enable DNS Hostnames
                </label>
              </div>
            </>
          )}

          {/* Target Group Fields */}
          {selectedNode.type === 'tg' && !selectedNode.name.toLowerCase().includes('elb') && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                  Port
                </label>
                <input
                  type="number"
                  min="1"
                  max="65535"
                  value={props.port || 80}
                  onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, port: parseInt(e.target.value) || 80 })}
                  className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                  Giao thức
                </label>
                <select
                  value={props.protocol || 'HTTP'}
                  onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, protocol: e.target.value })}
                  className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                >
                  <option value="HTTP">HTTP</option>
                  <option value="HTTPS">HTTPS</option>
                  <option value="TCP">TCP</option>
                </select>
              </div>
            </div>
          )}

          {/* CloudFront Fields */}
          {selectedNode.type === 'cloudfront' && (
            <div>
              <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                Origin Domain
              </label>
              <input
                type="text"
                value={props.origin_domain_name || 'mybucket.s3.amazonaws.com'}
                onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, origin_domain_name: e.target.value })}
                className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface"
              />
            </div>
          )}

          {/* Lambda Specific Fields */}
          {selectedNode.type === 'lambda' && (
            <>
              <div>
                <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                  Runtime
                </label>
                <select
                  value={props.runtime || 'nodejs18.x'}
                  onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, runtime: e.target.value })}
                  className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                >
                  <option value="nodejs18.x">NodeJS 18.x</option>
                  <option value="python3.9">Python 3.9</option>
                  <option value="go1.x">Go 1.x</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
                  Bộ nhớ cấu hình (MB)
                </label>
                <select
                  value={props.memory_size || 512}
                  onChange={(e) => onUpdateNodeProperties(selectedNode.id, { ...props, memory_size: parseInt(e.target.value) || 512 })}
                  className="w-full bg-white border border-[#141414] rounded-none px-2 py-1.5 text-xs text-on-surface focus:outline-hidden"
                >
                  <option value="128">128 MB</option>
                  <option value="512">512 MB</option>
                  <option value="1024">1024 MB</option>
                  <option value="2048">2048 MB</option>
                </select>
              </div>
            </>
          )}

          {/* Active Connections List with Unplug / Delete triggers */}
          {(() => {
            const nodeConnections = connections.filter(
              (c) => c.from === selectedNode.id || c.to === selectedNode.id
            );
            if (nodeConnections.length === 0) return null;

            return (
              <div className="pt-3 border-t border-dashed border-neutral-400 mt-4">
                <label className="block text-[10px] font-black text-on-surface uppercase mb-2 tracking-wider">
                  Các liên kết dịch vụ ({nodeConnections.length})
                </label>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {nodeConnections.map((conn) => {
                    const fromNode = nodes.find((n) => n.id === conn.from);
                    const toNode = nodes.find((n) => n.id === conn.to);
                    if (!fromNode || !toNode) return null;

                    const isFromCurrent = conn.from === selectedNode.id;
                    const otherNode = isFromCurrent ? toNode : fromNode;
                    const currentPortLabel = isFromCurrent
                      ? (conn.fromPort === 'top' ? 'Cổng Trên' : 'Cổng Dưới')
                      : (conn.toPort === 'top' ? 'Cổng Trên' : 'Cổng Dưới');
                    const otherPortLabel = isFromCurrent
                      ? (conn.toPort === 'top' ? 'Cổng Trên' : 'Cổng Dưới')
                      : (conn.fromPort === 'top' ? 'Cổng Trên' : 'Cổng Dưới');

                    return (
                      <div
                        key={conn.id}
                        className="flex items-center justify-between bg-white border border-[#141414] px-2 py-1 text-xs text-on-surface hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex flex-col text-[10px] leading-tight select-text">
                          <span className="font-bold text-neutral-800">
                            {isFromCurrent ? 'Nối tới:' : 'Nhận từ:'} {otherNode.name}
                          </span>
                          <span className="text-[9px] text-[#F27D26] font-mono font-semibold">
                            {currentPortLabel} ➜ {otherPortLabel}
                          </span>
                        </div>
                        {!isReadOnly && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConnection(conn.id);
                            }}
                            className="text-red-600 hover:text-white hover:bg-red-600 p-1 flex items-center justify-center border border-transparent hover:border-[#141414] transition-colors cursor-pointer"
                            title="Tháo gỡ liên kết này"
                          >
                            <span className="material-symbols-outlined text-xs font-black">link_off</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </fieldset>
      </div>
    );
  };

  return (
    <aside
      className={`bg-[#F1F0ED] border-l border-[#141414] flex flex-col h-full relative z-30 overflow-hidden ${isDragging ? '' : 'transition-[width] duration-150'
        }`}
      style={{ width: collapsed ? 0 : width }}
    >
      {!collapsed && (
        <div className="flex flex-col h-full min-w-[280px] w-full relative">
          {/* Header */}
          <div className="p-4 border-b border-[#141414] flex justify-between items-center bg-[#E4E3E0] shrink-0">
            <h2 className="font-extrabold text-sm text-on-surface uppercase tracking-wider font-sans">
              BẢNG CẤU HÌNH & CODE
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleExpand}
                className="text-on-surface hover:text-[#F27D26] transition-colors flex items-center p-1 rounded-none hover:bg-black/5 cursor-pointer"
                title={isExpanded ? "Thu nhỏ" : "Mở rộng màn hình"}
              >
                <span className="material-symbols-outlined text-lg">
                  {isExpanded ? 'fullscreen_exit' : 'fullscreen'}
                </span>
              </button>
              <button
                onClick={onToggleCollapse}
                className="text-on-surface hover:text-[#F27D26] transition-colors flex items-center p-1 rounded-none hover:bg-black/5 cursor-pointer"
                title="Đóng sidebar"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          {/* Tabs Selector */}
          <div className="flex border-b border-[#141414] bg-[#E4E3E0] shrink-0 font-sans text-xs">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 px-1.5 font-black uppercase text-center border-r border-[#141414] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'info'
                ? 'bg-[#F1F0ED] text-[#F27D26] font-extrabold border-b-2 border-b-[#F27D26]'
                : 'text-on-surface/70 hover:bg-[#F1F0ED]/50 hover:text-on-surface'
                }`}
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              Cấu hình & Chi tiết
            </button>
            <button
              onClick={() => setActiveTab('terraform')}
              className={`flex-1 py-3 px-1.5 font-black uppercase text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'terraform'
                ? 'bg-[#F1F0ED] text-[#F27D26] font-extrabold border-b-2 border-b-[#F27D26]'
                : 'text-on-surface/70 hover:bg-[#F1F0ED]/50 hover:text-on-surface'
                }`}
            >
              <span className="material-symbols-outlined text-sm">code</span>
              Mã Terraform
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'info' ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[#F1F0ED]">
              {activeEditNode ? (
                renderPropertiesForm()
              ) : selectedServiceType ? (
                renderServiceTemplateInfo()
              ) : (
                <div className="p-5 text-center bg-[#E4E3E0]/50 py-12 flex-1 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface/50 text-3xl mb-2 block">
                    info
                  </span>
                  <p className="text-[11px] font-bold text-on-surface uppercase tracking-wider max-w-[200px] leading-relaxed text-center">
                    Chọn một thiết bị trên sơ đồ để cấu hình hoặc click thư viện ở bên trái để xem thông tin
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 bg-[#141414]">
              {/* Code Container */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar overflow-x-auto relative min-h-0">
                <div className="absolute top-3 right-3 text-[10px] font-mono text-white/40 font-bold select-none pointer-events-none uppercase tracking-widest">
                  main.tf
                </div>
                <pre className="font-mono text-xs leading-relaxed select-text select-all">
                  <code>{highlightHCL(fullHCL)}</code>
                </pre>
              </div>

              {/* Bottom Controls */}
              <div className="p-4 bg-[#E4E3E0]/80 border-t border-[#141414] flex gap-3 shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2.5 bg-[#F27D26] text-white rounded-none font-bold text-xs hover:bg-[#D66311] active:scale-98 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider border border-[#141414]"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copySuccess ? 'check_circle' : 'content_copy'}
                  </span>
                  {copySuccess ? 'Đã chép!' : 'Sao chép'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2.5 bg-white border border-[#141414] rounded-none text-on-surface hover:bg-[#E4E3E0] transition-all flex items-center justify-center gap-1.5 text-xs font-bold active:scale-98 uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Tải về
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resize Handle */}
      {!collapsed && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize hover:bg-[#F27D26]/40 active:bg-[#F27D26] z-50 transition-colors border-r border-[#141414]/10"
          title="Kéo để chỉnh kích thước"
        />
      )}
    </aside>
  );
}
