import React, { useState, useEffect } from 'react';
import { CloudNode } from '../types';
import { calculateNodeCost, isHourlyUnit } from '../utils';

interface CostMonitorProps {
  nodes: CloudNode[];
  onClose: () => void;
  isPlaying: boolean;
  isVisible?: boolean;
  region?: string;
}

export default function CostMonitor({ nodes, onClose, isPlaying, isVisible = true, region = 'ap-southeast-1' }: CostMonitorProps) {
  const [startTime, setStartTime] = useState<string>('--:--:--');
  const [currentTime, setCurrentTime] = useState<string>('--:--:--');
  const [accumulatedCost, setAccumulatedCost] = useState<number>(0.0);

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
    };
  };


  // Set Start Time when simulation begins
  useEffect(() => {
    if (isPlaying) {
      const now = new Date();
      setStartTime(now.toTimeString().split(' ')[0]);
      setCurrentTime(now.toTimeString().split(' ')[0]);
      setAccumulatedCost(0);
    }
  }, [isPlaying]);

  // Keep live time clock ticking while running
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const now = new Date();
        setCurrentTime(now.toTimeString().split(' ')[0]);

        // Calculate rate of cost per second: total hourly rate / 3600
        const totalHourly = nodes.reduce((sum, node) => {
          const price = getNodePrice(node);
          return sum + (isHourlyUnit(price.unit) ? price.price : calculateNodeCost(node, region).hourly);
        }, 0);
        const costPerSecond = totalHourly / 3600;
        setAccumulatedCost((prev) => prev + costPerSecond);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, nodes, region]);

  if (!isPlaying) return null;

  // Calculate distinct costs
  const totalHourly = nodes.reduce((sum, node) => {
    const price = getNodePrice(node);
    return sum + (isHourlyUnit(price.unit) ? price.price : calculateNodeCost(node, region).hourly);
  }, 0);

  return (
    <div
      className={`absolute top-18 right-4 w-80 bg-[#F1F0ED] border-2 border-[#141414] rounded-none shadow-none z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-[#141414] text-white flex justify-between items-center shrink-0 rounded-none border-b border-[#141414]">
        <h3 className="font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-[#F27D26] animate-pulse" style={{ fontVariationSettings: '"FILL" 1' }}>
            monitoring
          </span>
          GIÁM SÁT CHI PHÍ (LIVE)
        </h3>
        <button
          onClick={onClose}
          className="hover:text-[#F27D26] p-1 rounded-none transition-colors flex items-center justify-center cursor-pointer"
          title="Đóng giám sát"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Timing block */}
        <div className="bg-[#E4E3E0] p-3 rounded-none border border-[#141414]">
          <div className="flex justify-between items-center text-[10px] font-black text-on-surface uppercase mb-1 tracking-wider">
            <span>Bắt đầu:</span>
            <span className="font-mono text-xs text-on-surface">{startTime}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-on-surface uppercase tracking-wider">
            <span>Thời gian chạy:</span>
            <span className="font-mono text-[#F27D26] font-extrabold animate-pulse">{currentTime}</span>
          </div>
        </div>

        {/* Current Session Simulated Cost */}
        <div className="text-center bg-[#E4E3E0] border border-[#141414] p-3 rounded-none">
          <p className="text-[10px] font-black text-on-surface uppercase mb-1 tracking-widest">
            CHI PHÍ TÍCH LŨY (PHIÊN CHẠY)
          </p>
          <p className="font-mono text-xl font-extrabold text-[#F27D26]">
            ${accumulatedCost.toFixed(6)}
          </p>
        </div>

        {/* Breakdown table */}
        <div>
          <h4 className="text-[10px] font-black text-on-surface uppercase mb-2 tracking-widest">
            Đơn giá chi tiết tài nguyên
          </h4>
          <div className="max-h-36 overflow-y-auto custom-scrollbar pr-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#141414]">
                  <th className="py-1.5 font-bold uppercase text-[10px] text-on-surface">Tài nguyên</th>
                  <th className="py-1.5 font-bold uppercase text-[10px] text-on-surface text-right">Đơn giá</th>
                </tr>
              </thead>
              <tbody className="text-on-surface font-medium">
                {nodes.map((node, index) => {
                  const cost = getNodePrice(node);
                  return (
                    <tr key={node.id + index} className="border-b border-[#141414]/20">
                      <td className="py-1.5 text-[11px] truncate max-w-[120px] font-bold" title={node.name}>
                        {node.name}
                      </td>
                      <td className="py-1.5 text-right font-mono text-[11px] text-[#F27D26] font-bold">
                        {cost.display}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Hourly Cost */}
        <div className="pt-2.5 border-t border-[#141414] flex justify-between items-center text-xs">
          <span className="font-black uppercase text-[10px] text-on-surface tracking-wider">Tổng chi phí / giờ:</span>
          <span className="font-mono font-extrabold text-[#F27D26] text-sm">${totalHourly.toFixed(3)}/h</span>
        </div>
      </div>
    </div>
  );
}
