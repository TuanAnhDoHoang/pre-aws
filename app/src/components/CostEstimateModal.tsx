import React, { useState, useEffect } from 'react';
import { CloudNode, SERVICE_DEFINITIONS } from '../types';
import { calculateNodeCost, ServicePriceResult } from '../utils';

interface CostEstimateModalProps {
  nodes: CloudNode[];
  onClose: () => void;
  isOpen: boolean;
  region?: string;
}

export default function CostEstimateModal({ nodes, onClose, isOpen, region = 'ap-southeast-1' }: CostEstimateModalProps) {
  const [activeHoursPerDay, setActiveHoursPerDay] = useState<number>(24);
  const getNodePrice = (node: CloudNode) => {
    const price = node.pricing;
    if (price?.status === 'ok') {
      return price;
    }
    return {
      price: 0,
      unit: 'USD/giờ',
      display: price?.status === 'loading' ? 'Đang tải...' : '0.00 USD/giờ',
      status: price?.status || 'error',
      errorMessage: price?.errorMessage,
    };
  };

  const estimateMonthlyCost = (node: CloudNode, price: ServicePriceResult, monthlyHours: number) => {
    if (price.unit.includes('USD/giờ')) {
      return price.price * monthlyHours;
    }
    if (price.unit.includes('USD/GB/tháng') || price.unit.includes('USD/GB')) {
      const assumedGb = 50;
      return price.price * assumedGb;
    }
    if (price.unit.includes('USD/triệu request')) {
      return price.price;
    }
    return price.price;
  };

  if (!isOpen) return null;

  // Calculate monthly costs
  // Monthly hours = activeHoursPerDay * 30 days
  const monthlyHours = activeHoursPerDay * 30;

  // Group nodes and summarize costs
  const categories: Record<'Compute' | 'Storage' | 'Database' | 'Networking', { nodes: CloudNode[]; totalMonthly: number }> = {
    Compute: { nodes: [], totalMonthly: 0 },
    Storage: { nodes: [], totalMonthly: 0 },
    Database: { nodes: [], totalMonthly: 0 },
    Networking: { nodes: [], totalMonthly: 0 },
  };

  nodes.forEach((node) => {
    const def = SERVICE_DEFINITIONS[node.type];
    const price = getNodePrice(node);

    const monthlyCost = estimateMonthlyCost(node, price, monthlyHours);

    if (categories[def.category]) {
      categories[def.category].nodes.push(node);
      categories[def.category].totalMonthly += monthlyCost;
    }
  });

  const grandTotalMonthly = 
    categories.Compute.totalMonthly + 
    categories.Storage.totalMonthly + 
    categories.Database.totalMonthly + 
    categories.Networking.totalMonthly;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-150">
      <div 
        className="bg-[#F1F0ED] border-2 border-[#141414] rounded-none shadow-none max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#E4E3E0] border-b border-[#141414] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F27D26] text-2xl font-black">payments</span>
            <h3 className="font-extrabold text-sm text-on-surface uppercase tracking-wider font-sans">Dự toán chi phí vận hành (Tháng)</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface hover:text-[#F27D26] hover:bg-black/5 p-1 rounded-none transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl font-bold">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#E4E3E0] border border-[#141414] rounded-none p-4 text-center">
              <p className="text-[10px] font-black text-on-surface uppercase tracking-widest mb-1.5">Chi phí dự kiến / tháng</p>
              <p className="text-3xl font-black text-[#F27D26] font-mono">${grandTotalMonthly.toFixed(2)}</p>
              <p className="text-[10px] font-serif italic text-on-surface/80 mt-1">Dựa trên {monthlyHours} giờ hoạt động (30 ngày)</p>
            </div>
            <div className="bg-white border border-[#141414] rounded-none p-4 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-on-surface uppercase tracking-wider">Số giờ chạy mỗi ngày:</span>
                <span className="font-mono font-extrabold text-[#F27D26] text-xs">{activeHoursPerDay}h/24h</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="24" 
                value={activeHoursPerDay}
                onChange={(e) => setActiveHoursPerDay(parseInt(e.target.value))}
                className="w-full accent-[#F27D26] cursor-pointer mt-1"
              />
              <p className="text-[9px] font-serif italic text-on-surface-variant/80 mt-2 text-center">Kéo slider để cấu hình chu kỳ chạy mô phỏng</p>
            </div>
          </div>

          {/* Graphical Progress Meters */}
          <div>
            <h4 className="text-[11px] font-black text-on-surface mb-3 uppercase tracking-widest">Phân rã chi phí danh mục</h4>
            <div className="space-y-3.5">
              {(Object.keys(categories) as Array<keyof typeof categories>).map((catName) => {
                const data = categories[catName];
                const percentage = grandTotalMonthly > 0 ? (data.totalMonthly / grandTotalMonthly) * 100 : 0;
                
                let colorClass = 'bg-[#F27D26]';
                if (catName === 'Storage') colorClass = 'bg-[#141414]';
                if (catName === 'Database') colorClass = 'bg-[#4D4B46]';
                if (catName === 'Networking') colorClass = 'bg-[#BCBBAF]';

                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
                      <span className="text-on-surface flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 border border-[#141414] ${colorClass}`}></span>
                        {catName} ({data.nodes.length} tài nguyên)
                      </span>
                      <span className="font-mono text-on-surface font-extrabold">
                        ${data.totalMonthly.toFixed(2)} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#E4E3E0] border border-[#141414] h-3.5 rounded-none overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${colorClass}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Table */}
          <div>
            <h4 className="text-[11px] font-black text-on-surface mb-2.5 uppercase tracking-widest">Bảng kê chi tiết thiết bị</h4>
            <div className="border border-[#141414] rounded-none overflow-hidden bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E4E3E0] border-b border-[#141414] text-on-surface font-black uppercase tracking-wider text-[10px]">
                    <th className="p-3">Tên thiết bị</th>
                    <th className="p-3 text-center">Phân loại</th>
                    <th className="p-3 text-right">Đơn giá giờ</th>
                    <th className="p-3 text-right">Dự kiến tháng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]/20 text-on-surface font-bold uppercase tracking-tight text-[11px]">
                  {nodes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-on-surface-variant/60 font-serif italic normal-case">
                        Chưa có tài nguyên nào trên Canvas để tính giá.
                      </td>
                    </tr>
                  ) : (
                    nodes.map((node) => {
                      const cost = getNodePrice(node);
                      const def = SERVICE_DEFINITIONS[node.type];
                      const monthlyEstimate = estimateMonthlyCost(node, cost, monthlyHours);

                      return (
                        <tr key={node.id} className="hover:bg-black/5">
                          <td className="p-3 font-extrabold">{node.name}</td>
                          <td className="p-3 text-center text-on-surface-variant/80 text-[10px] font-black">
                            {def.label}
                          </td>
                          <td className="p-3 text-right font-mono text-[10px] text-[#F27D26]">
                            {cost.display}
                          </td>
                          <td className="p-3 text-right font-mono text-[10px] text-[#F27D26] font-extrabold">
                            ${monthlyEstimate.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#E4E3E0] border-t border-[#141414] flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-[#F27D26] hover:bg-[#D66311] border border-[#141414] text-white font-extrabold rounded-none text-xs uppercase tracking-widest shadow-none active:scale-97 transition-all cursor-pointer"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
}
